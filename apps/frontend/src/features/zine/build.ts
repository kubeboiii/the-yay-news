import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Edition, StoryItem } from "@repo/shared";
import { ImageResponse } from "next/og";
import { loadFonts } from "@/app/clip/_lib/fonts";
import { editionLook } from "@/app/clip/_lib/looks";
import { editionName } from "@/features/papers/weekend-lineup";
import { issueHref, storyHref } from "@/features/papers/reading";
import { printedPhoto } from "@/features/print/photo";
import { absoluteUrl } from "@/features/reader/site";
import {
  backPanel,
  coverPanel,
  PANEL_H,
  PANEL_W,
  type Panel,
  puzzlePanel,
  storyPanel,
  type ZineData,
  type ZineStory,
} from "./panels";
import { decodePng, jpegInfo, type PdfImage, writePdf } from "./pdf";

// Today's paper as a one-sheet mini zine: an A4 landscape PDF that folds, with one cut, into an
// eight-page A7 booklet. The standard imposition, checked by folding one:
//
//        ┌──────┬──────┬──────┬──────┐
//   top  │  5   │  4   │  3   │  2   │   printed upside down
//        ├──────┼══════┼══════┼──────┤   ← the cut, across the middle two panels only
//   bot. │  6   │  7   │  8   │  1   │   upright; 1 is the cover, 8 the back cover
//        └──────┴──────┴──────┴──────┘
//
// Folded long-ways the top row turns over behind the bottom one and reads the right way up; the
// cut opens into a plus; the leaves pair up 1|2, 3|4, 5|6, 7|8 with 2–3, 4–5 and 6–7 as spreads.
//
// Pages: 1 the cover (front page lead), 2–6 five short stories, 7 a puzzle, 8 how to fold it.

const A4_W = 841.89;
const A4_H = 595.28;
const PW = A4_W / 4;
const PH = A4_H / 2;
const K = PW / PANEL_W;

/** Where each page goes on the sheet: column, and whether it prints upside down (top row). */
export const IMPOSITION: Record<number, { col: number; top: boolean }> = {
  5: { col: 0, top: true },
  4: { col: 1, top: true },
  3: { col: 2, top: true },
  2: { col: 3, top: true },
  6: { col: 0, top: false },
  7: { col: 1, top: false },
  8: { col: 2, top: false },
  1: { col: 3, top: false },
};

const PUBLIC = path.join(process.cwd(), "public");

/** A photo as the PDF can print it (a JPEG as it is, or a decoded PNG), or null. */
async function photoFor(url: string): Promise<PdfImage | null> {
  const src = printedPhoto(url, 1400);
  let buf: Buffer;
  try {
    buf = src.startsWith("/")
      ? await readFile(path.join(PUBLIC, src.slice(1)))
      : Buffer.from(await (await fetch(src)).arrayBuffer());
  } catch {
    return null;
  }
  const info = jpegInfo(buf);
  if (info) return { kind: "jpeg", data: buf, ...info };
  try {
    return decodePng(buf);
  } catch {
    return null;
  }
}

/** A story's first sentences, up to about `chars`. */
function opening(s: StoryItem, chars: number): string {
  const text = s.body.join(" ") || s.dek;
  if (text.length <= chars) return text;
  const cut = text.slice(0, chars);
  const end = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("? "), cut.lastIndexOf("! "));
  return end > chars * 0.45 ? cut.slice(0, end + 1) : `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

const short = (href: string) => href.replace(/^https?:\/\/(www\.)?/, "");

const LONG = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function zineStory(s: StoryItem, issue: number, chars: number): ZineStory {
  const img = s.images[0];
  return {
    section: s.section.name,
    colour: s.section.colour,
    kicker: s.kicker,
    headline: s.headline,
    text: opening(s, chars),
    photo: img?.url ?? null,
    credit: img ? img.credit : null,
    url: short(absoluteUrl(storyHref(issue, s.slug))),
  };
}

/** What goes in the zine: the lead on the cover, five stories, a puzzle, the sign-off. */
export function zineData(e: Edition): ZineData {
  const pages = [...e.pages].sort((a, b) => a.order - b.order);
  const front = pages.find((p) => p.layout === "front") ?? pages[0]!;
  const lead = front.stories.find((s) => s.slot === "lead") ?? front.stories[0]!;
  // One story from each of the first five inside pages: its main story, with a photo if it has one.
  const picked: StoryItem[] = [];
  for (const p of pages) {
    if (p.layout === "front" || p.layout === "back" || picked.length >= 5) continue;
    const s =
      [...p.stories].sort((a, b) => a.order - b.order).find((x) => x.images.length) ?? p.stories[0];
    if (s && s.slug !== lead.slug) picked.push(s);
  }
  // A short paper: fill up from the front page.
  for (const s of front.stories) {
    if (picked.length >= 5) break;
    if (s.slug !== lead.slug && !picked.includes(s)) picked.push(s);
  }
  const ws = e.puzzles.find((p) => p.type === "word_search");
  const wl = e.puzzles.find((p) => p.type === "word_ladder");
  const sign = e.features.find((f) => f.type === "sign_off");
  const url = absoluteUrl(issueHref(e.issueNumber));
  return {
    issue: e.issueNumber,
    volume: e.volume,
    date: LONG.format(new Date(`${e.date}T00:00:00Z`)),
    editionName: editionName(e.date) ?? "The Yay News",
    cover: zineStory(lead, e.issueNumber, 200),
    stories: picked.slice(0, 5).map((s) => zineStory(s, e.issueNumber, 260)),
    puzzle:
      ws?.type === "word_search"
        ? { type: "word_search", ...ws.data }
        : wl?.type === "word_ladder"
          ? { type: "word_ladder", ...wl.data }
          : null,
    signOff:
      sign?.type === "sign_off" ? sign.content.text : "You're done for today. See you tomorrow.",
    url,
    urlText: short(url),
  };
}

const n2 = (n: number) => (Math.round(n * 1000) / 1000).toString();

/** The zine as a PDF. */
export async function buildZine(e: Edition): Promise<Buffer> {
  const look = editionLook(e);
  const d = zineData(e);
  const panels: Record<number, Panel> = {
    1: coverPanel(d, look),
    7: puzzlePanel(d, look),
    8: backPanel(d, look),
  };
  d.stories.forEach((s, i) => (panels[i + 2] = storyPanel(s, i + 2, look)));
  const fonts = await loadFonts(look.fonts);

  const images: PdfImage[] = [];
  let ops = "1 1 1 rg 0 0 " + `${n2(A4_W)} ${n2(A4_H)} re f\n`;
  for (let page = 1; page <= 8; page++) {
    const panel = panels[page];
    if (!panel) continue;
    const at = IMPOSITION[page]!;
    const x0 = at.col * PW;
    // Content space: pixels, y down. The bottom row is upright; the top row is turned 180°.
    const cm = at.top
      ? `${n2(-K)} 0 0 ${n2(K)} ${n2(x0 + PW)} ${n2(PH)} cm`
      : `${n2(K)} 0 0 ${n2(-K)} ${n2(x0)} ${n2(PH)} cm`;
    ops += `q ${cm}\n`;
    for (const hole of panel.holes) {
      const img = await photoFor(hole.photo);
      if (!img) continue;
      const s = Math.max(hole.w / img.width, hole.h / img.height);
      const dw = img.width * s;
      const dh = img.height * s;
      const dx = hole.x + (hole.w - dw) / 2;
      const dy = hole.y + (hole.h - dh) / 2;
      ops += `q ${hole.x} ${hole.y} ${hole.w} ${hole.h} re W n ${n2(dw)} 0 0 ${n2(-dh)} ${n2(dx)} ${n2(dy + dh)} cm /Im${images.length} Do Q\n`;
      images.push(img);
    }
    const art = new ImageResponse(panel.node, { width: PANEL_W, height: PANEL_H, fonts });
    images.push(decodePng(Buffer.from(await art.arrayBuffer())));
    ops += `q ${PANEL_W} 0 0 ${-PANEL_H} 0 ${PANEL_H} cm /Im${images.length - 1} Do Q\nQ\n`;
  }
  // Guides, faint: the folds dotted, the one cut dashed and darker, with a pair of scissors.
  ops += "q 0.62 0.62 0.62 RG 0.5 w [1 2.5] 0 d\n";
  for (let c = 1; c < 4; c++) ops += `${n2(c * PW)} 0 m ${n2(c * PW)} ${n2(A4_H)} l S\n`;
  ops += `0 ${n2(PH)} m ${n2(PW)} ${n2(PH)} l S ${n2(3 * PW)} ${n2(PH)} m ${n2(A4_W)} ${n2(PH)} l S\n`;
  ops += `0.25 0.25 0.25 RG 0.8 w [5 3] 0 d ${n2(PW)} ${n2(PH)} m ${n2(3 * PW)} ${n2(PH)} l S Q\n`;
  // Scissors at the start of the cut: two rings and two blades.
  const sx = PW + 6;
  const sy = PH;
  ops += `q 0.25 0.25 0.25 RG 0.7 w [] 0 d\n`;
  for (const oy of [-3.2, 3.2]) {
    const cx = sx - 2;
    const cy = sy + oy;
    const r = 2.2;
    const c = 0.5523 * r;
    ops += `${n2(cx + r)} ${n2(cy)} m ${n2(cx + r)} ${n2(cy + c)} ${n2(cx + c)} ${n2(cy + r)} ${n2(cx)} ${n2(cy + r)} c ${n2(cx - c)} ${n2(cy + r)} ${n2(cx - r)} ${n2(cy + c)} ${n2(cx - r)} ${n2(cy)} c ${n2(cx - r)} ${n2(cy - c)} ${n2(cx - c)} ${n2(cy - r)} ${n2(cx)} ${n2(cy - r)} c ${n2(cx + c)} ${n2(cy - r)} ${n2(cx + r)} ${n2(cy - c)} ${n2(cx + r)} ${n2(cy)} c S\n`;
  }
  ops += `${n2(sx)} ${n2(sy - 2.2)} m ${n2(sx + 9)} ${n2(sy + 1.2)} l S ${n2(sx)} ${n2(sy + 2.2)} m ${n2(sx + 9)} ${n2(sy - 1.2)} l S Q\n`;

  return writePdf([{ width: A4_W, height: A4_H, content: ops, images }], {
    title: `The Yay News No. ${e.issueNumber}: the mini zine`,
  });
}
