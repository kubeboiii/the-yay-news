import "server-only";
import type { CSSProperties, ReactElement, ReactNode } from "react";
import type { Look } from "@/app/clip/_lib/looks";
import { qrPath } from "@/features/reader/qr";

// The eight pages of the mini zine, as JSX for Satori (next/og), each one A7 portrait at 300 dpi.
// Photos are not drawn here: each page leaves a window (a `Hole`) where the PDF lays the real
// JPEG in afterwards, so photos print at their own resolution and the file stays small. Every
// word is set here, in the edition's own faces and inks.

export const PANEL_W = 877;
export const PANEL_H = 1240;
const M = 58;

export type Hole = { x: number; y: number; w: number; h: number; photo: string; alt: string };

export type ZineStory = {
  section: string;
  colour: string;
  kicker: string;
  headline: string;
  text: string;
  photo: string | null;
  credit: string | null;
  url: string;
};

export type ZineData = {
  issue: number;
  volume: number;
  date: string;
  editionName: string;
  cover: ZineStory;
  stories: ZineStory[];
  puzzle:
    | { type: "word_search"; title: string; theme: string; grid: string[]; words: string[] }
    | {
        type: "word_ladder";
        title: string;
        instructions: string;
        start: string;
        end: string;
        steps: number;
      }
    | null;
  signOff: string;
  url: string;
  urlText: string;
};

export type Panel = { node: ReactElement; holes: Hole[] };

const flex = (s: CSSProperties = {}): CSSProperties => ({ display: "flex", ...s });

/** Fewer words, bigger type. */
const fit = (text: string, big: number, small: number, from = 30, to = 100) => {
  const t = Math.max(0, Math.min(1, (text.length - from) / (to - from)));
  return Math.round(big + (small - big) * t);
};

function Folio({ look, n, label }: { look: Look; n: number; label: string }) {
  return (
    <div
      style={flex({
        position: "absolute",
        left: M,
        right: M,
        bottom: 34,
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: look.mono,
        fontSize: 24,
        color: look.ink,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
      })}
    >
      <span>{label}</span>
      <span style={flex({ fontFamily: look.head, fontSize: 40, letterSpacing: 0 })}>{n}</span>
    </div>
  );
}

function Window({ x, y, w, h, look }: { x: number; y: number; w: number; h: number; look: Look }) {
  // The frame round the photo; the photo itself goes in underneath (see Hole).
  return (
    <div
      style={{
        position: "absolute",
        left: x - 5,
        top: y - 5,
        width: w + 10,
        height: h + 10,
        border: `5px solid ${look.ink}`,
        display: "flex",
      }}
    />
  );
}

function Page({ children }: { children: ReactNode }) {
  return (
    <div style={flex({ width: PANEL_W, height: PANEL_H, position: "relative" })}>{children}</div>
  );
}

// ——— 1. The cover ———

export function coverPanel(d: ZineData, look: Look): Panel {
  const s = d.cover;
  const hole = { x: M, y: 360, w: PANEL_W - M * 2, h: 470 };
  return {
    holes: s.photo ? [{ ...hole, photo: s.photo, alt: s.headline }] : [],
    node: (
      <Page>
        <div
          style={flex({
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: 330,
            background: look.a,
            flexDirection: "column",
            padding: `${M}px ${M}px 24px`,
            color: look.ink,
          })}
        >
          <div
            style={flex({
              justifyContent: "space-between",
              fontFamily: look.mono,
              fontSize: 25,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            })}
          >
            <span>{d.editionName}</span>
            <span>
              Vol. {d.volume} · No. {d.issue}
            </span>
          </div>
          <div
            style={flex({
              fontFamily: look.head,
              fontWeight: 800,
              fontSize: look.id === "v1" ? 150 : look.id === "v4" ? 84 : 100,
              lineHeight: 0.9,
              marginTop: 18,
              letterSpacing: look.id === "v1" ? "0.01em" : "-0.02em",
              textTransform: look.id === "v5" ? "none" : "uppercase",
            })}
          >
            {look.id === "v5" ? "The Yay News" : "THE YAY NEWS"}
          </div>
          <div
            style={flex({
              marginTop: 16,
              fontFamily: look.text,
              fontStyle: "italic",
              fontSize: 34,
            })}
          >
            {`The mini zine · ${d.date}`}
          </div>
        </div>
        {s.photo ? (
          <Window {...hole} look={look} />
        ) : (
          <div
            style={flex({
              position: "absolute",
              left: hole.x,
              top: hole.y,
              width: hole.w,
              height: hole.h,
              background: look.b,
            })}
          />
        )}
        <div
          style={flex({
            position: "absolute",
            left: M,
            right: M,
            top: 870,
            flexDirection: "column",
            color: look.ink,
          })}
        >
          <div
            style={flex({
              fontFamily: look.sans,
              fontWeight: 700,
              fontSize: 26,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            })}
          >
            {`Today's big one · ${s.kicker}`}
          </div>
          <div
            style={flex({
              marginTop: 10,
              fontFamily: look.head,
              fontWeight: 800,
              fontSize: fit(s.headline, 64, 48),
              lineHeight: 1,
              letterSpacing: "-0.01em",
            })}
          >
            {s.headline}
          </div>
        </div>
        <Folio look={look} n={1} label="Fold me · 8 pages inside" />
      </Page>
    ),
  };
}

// ——— 2–6. The stories ———

/** Cut text at a sentence (or a word) so it ends inside `chars`. */
function cutAt(text: string, chars: number) {
  if (text.length <= chars) return text;
  const cut = text.slice(0, chars);
  const end = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("? "), cut.lastIndexOf("! "));
  return end > chars * 0.55 ? cut.slice(0, end + 1) : `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

/**
 * As much of the story as fits under its headline in whole lines: an estimate from the faces'
 * average widths (Satori can't measure for us), erring short so nothing is cut mid-line.
 */
function fitted(s: ZineStory, look: Look, box: number) {
  const size = fit(s.headline, 62, 44);
  const wide = look.id === "v4" || look.id === "v3" ? 0.6 : 0.5;
  const lineChars = Math.floor((PANEL_W - M * 2) / (size * wide));
  const headLines = Math.ceil(s.headline.length / lineChars);
  const left = box - 40 - headLines * size * 1.02 - 16;
  const lines = Math.max(1, Math.floor(left / (36 * 1.3)));
  const perLine = Math.floor((PANEL_W - M * 2) / (36 * (look.id === "v4" ? 0.5 : 0.45)));
  return cutAt(s.text, lines * perLine);
}

export function storyPanel(s: ZineStory, n: number, look: Look): Panel {
  const hole = { x: M, y: 160, w: PANEL_W - M * 2, h: 420 };
  return {
    holes: s.photo ? [{ ...hole, photo: s.photo, alt: s.headline }] : [],
    node: (
      <Page>
        <div
          style={flex({
            position: "absolute",
            left: M,
            right: M,
            top: M,
            justifyContent: "space-between",
            alignItems: "center",
          })}
        >
          <div
            style={flex({
              background: s.colour,
              color: "#141414",
              padding: "8px 18px 6px",
              fontFamily: look.sans,
              fontWeight: 700,
              fontSize: 30,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            })}
          >
            {s.section}
          </div>
          <div
            style={flex({
              fontFamily: look.mono,
              fontSize: 24,
              color: look.ink,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            })}
          >
            The Yay News
          </div>
        </div>
        {s.photo ? (
          <Window {...hole} look={look} />
        ) : (
          <div
            style={flex({
              position: "absolute",
              left: hole.x,
              top: hole.y,
              width: hole.w,
              height: hole.h,
              background: s.colour,
            })}
          />
        )}
        {s.credit ? (
          <div
            style={flex({
              position: "absolute",
              right: M,
              top: hole.y + hole.h + 10,
              fontFamily: look.sans,
              fontSize: 19,
              color: look.ink,
            })}
          >
            {s.credit}
          </div>
        ) : null}
        <div
          style={flex({
            position: "absolute",
            left: M,
            right: M,
            top: hole.y + hole.h + 50,
            height: PANEL_H - (hole.y + hole.h + 50) - 200,
            flexDirection: "column",
            color: look.ink,
            overflow: "hidden",
          })}
        >
          <div
            style={flex({
              fontFamily: look.mono,
              fontWeight: 700,
              fontSize: 26,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            })}
          >
            {s.kicker}
          </div>
          <div
            style={flex({
              marginTop: 8,
              fontFamily: look.head,
              fontWeight: 800,
              fontSize: fit(s.headline, 62, 44),
              lineHeight: 1.02,
              letterSpacing: "-0.01em",
            })}
          >
            {s.headline}
          </div>
          <div
            style={flex({
              marginTop: 16,
              fontFamily: look.text,
              fontSize: 36,
              lineHeight: 1.3,
            })}
          >
            {fitted(s, look, PANEL_H - (hole.y + hole.h + 50) - 200)}
          </div>
        </div>
        <div
          style={flex({
            position: "absolute",
            left: M,
            right: M,
            bottom: 92,
            fontFamily: look.sans,
            fontSize: 22,
            color: look.ink,
            borderTop: `2px solid ${look.ink}`,
            paddingTop: 10,
          })}
        >
          {`The rest: ${s.url}`}
        </div>
        <Folio look={look} n={n} label="The mini zine" />
      </Page>
    ),
  };
}

// ——— 7. The puzzle ———

export function puzzlePanel(d: ZineData, look: Look): Panel {
  const p = d.puzzle;
  let body: ReactNode = (
    <div style={flex({ fontFamily: look.text, fontSize: 40, color: look.ink })}>
      Today&rsquo;s puzzles are on the back page of the paper.
    </div>
  );
  if (p?.type === "word_search") {
    const n = Math.max(p.grid.length, p.grid[0]?.length ?? 0);
    const cell = Math.floor(Math.min(PANEL_W - M * 2, 740) / n);
    body = (
      <div style={flex({ flexDirection: "column", alignItems: "center", gap: 26 })}>
        <div
          style={flex({
            flexDirection: "column",
            border: `4px solid ${look.ink}`,
            padding: 10,
          })}
        >
          {p.grid.map((row, r) => (
            <div key={r} style={flex({})}>
              {row.split("").map((ch, c) => (
                <div
                  key={c}
                  style={flex({
                    width: cell,
                    height: cell,
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: look.mono,
                    fontWeight: 700,
                    fontSize: Math.round(cell * 0.56),
                    color: look.ink,
                  })}
                >
                  {ch}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div
          style={flex({
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "10px 26px",
            fontFamily: look.sans,
            fontWeight: 700,
            fontSize: 30,
            letterSpacing: "0.06em",
            color: look.ink,
          })}
        >
          {p.words.map((w) => (
            <span key={w} style={flex({ alignItems: "center", gap: 10 })}>
              <span style={flex({ width: 22, height: 22, border: `3px solid ${look.ink}` })} />
              {w}
            </span>
          ))}
        </div>
      </div>
    );
  } else if (p?.type === "word_ladder") {
    const rungs = Array.from({ length: p.steps }, (_, i) => i);
    const word = (w: string, filled: boolean) => (
      <div style={flex({ gap: 10 })}>
        {w.split("").map((ch, i) => (
          <div
            key={i}
            style={flex({
              width: 96,
              height: 96,
              alignItems: "center",
              justifyContent: "center",
              border: `4px solid ${look.ink}`,
              background: filled ? look.a : "transparent",
              fontFamily: look.head,
              fontWeight: 800,
              fontSize: 60,
              color: look.ink,
            })}
          >
            {filled ? ch : ""}
          </div>
        ))}
      </div>
    );
    body = (
      <div style={flex({ flexDirection: "column", alignItems: "center", gap: 14 })}>
        <div
          style={flex({ fontFamily: look.text, fontSize: 34, color: look.ink, marginBottom: 10 })}
        >
          {p.instructions}
        </div>
        {word(p.end, true)}
        {rungs.map((i) => (
          <div key={i} style={flex({})}>
            {word(p.start.replace(/./g, " "), false)}
          </div>
        ))}
        {word(p.start, true)}
      </div>
    );
  }
  return {
    holes: [],
    node: (
      <Page>
        <div
          style={flex({
            position: "absolute",
            left: M,
            right: M,
            top: M,
            flexDirection: "column",
            color: look.ink,
          })}
        >
          <div
            style={flex({
              fontFamily: look.mono,
              fontSize: 26,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            })}
          >
            A puzzle for the pocket
          </div>
          <div
            style={flex({
              fontFamily: look.head,
              fontWeight: 800,
              fontSize: 96,
              lineHeight: 0.95,
              marginTop: 6,
            })}
          >
            {p?.title ?? "Puzzles"}
          </div>
          {p?.type === "word_search" ? (
            <div
              style={flex({
                fontFamily: look.text,
                fontStyle: "italic",
                fontSize: 36,
                marginTop: 8,
              })}
            >
              {`${p.theme}. Circle them all.`}
            </div>
          ) : null}
        </div>
        <div
          style={flex({
            position: "absolute",
            left: M,
            right: M,
            top: 290,
            justifyContent: "center",
          })}
        >
          {body}
        </div>
        <Folio look={look} n={7} label="Answers in tomorrow's paper" />
      </Page>
    ),
  };
}

// ——— 8. The back cover: how to fold it ———

const STEP_W = 360;
const STEP_H = 205;

function Step({ n, text, svg, look }: { n: number; text: string; svg: string; look: Look }) {
  const src = `data:image/svg+xml;base64,${Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 110" width="${STEP_W}" height="${STEP_H - 70}"><g fill="none" stroke="${look.ink}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round">${svg}</g></svg>`,
  ).toString("base64")}`;
  return (
    <div style={flex({ flexDirection: "column", width: STEP_W, height: STEP_H })}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} width={STEP_W} height={STEP_H - 70} alt="" />
      <div
        style={flex({
          gap: 10,
          fontFamily: look.sans,
          fontSize: 21,
          lineHeight: 1.15,
          color: look.ink,
          marginTop: 6,
        })}
      >
        <span
          style={flex({ fontFamily: look.head, fontWeight: 800, fontSize: 34, lineHeight: 0.9 })}
        >
          {n}
        </span>
        <span style={flex({ flex: 1 })}>{text}</span>
      </div>
    </div>
  );
}

// Each diagram is drawn in a 180 × 110 box. The sheet is A4 landscape (4 × 2 panels).
const dash = 'stroke-dasharray="5 4"';
const STEPS: { text: string; svg: string }[] = [
  {
    text: "Fold in half, long edges together. Unfold.",
    svg: `<rect x="20" y="15" width="140" height="80"/><line x1="20" y1="55" x2="160" y2="55" ${dash}/><path d="M172 30 C182 45 182 65 172 80 M167 74 L172 80 L178 74"/>`,
  },
  {
    text: "Fold in half twice more, into eight. Unfold.",
    svg: `<rect x="20" y="15" width="140" height="80"/><line x1="55" y1="15" x2="55" y2="95" ${dash}/><line x1="90" y1="15" x2="90" y2="95" ${dash}/><line x1="125" y1="15" x2="125" y2="95" ${dash}/><line x1="20" y1="55" x2="160" y2="55" ${dash}/>`,
  },
  {
    text: "Fold short edges together. Cut the middle crease from the fold to the dot.",
    svg: `<rect x="55" y="15" width="70" height="80"/><line x1="90" y1="15" x2="90" y2="95" ${dash}/><line x1="55" y1="55" x2="90" y2="55" stroke-width="3.4"/><circle cx="90" cy="55" r="3" fill="currentColor"/><circle cx="30" cy="48" r="6"/><circle cx="30" cy="62" r="6"/><path d="M35 51 L52 58 M35 59 L52 52"/>`,
  },
  {
    text: "Open it, then fold it the long way again.",
    svg: `<rect x="20" y="35" width="140" height="40"/><line x1="55" y1="35" x2="55" y2="75" ${dash}/><line x1="90" y1="35" x2="90" y2="75" ${dash}/><line x1="125" y1="35" x2="125" y2="75" ${dash}/><line x1="55" y1="35" x2="125" y2="35" stroke-width="4" stroke="#ffffff"/><line x1="55" y1="35" x2="125" y2="35" ${dash}/>`,
  },
  {
    text: "Push the ends together: the cut opens into a plus.",
    svg: `<path d="M20 55 L90 25 L160 55 L90 85 Z"/><line x1="90" y1="25" x2="90" y2="85" ${dash}/><path d="M8 55 L20 55 M14 49 L20 55 L14 61"/><path d="M172 55 L160 55 M166 49 L160 55 L166 61"/>`,
  },
  {
    text: "Fold it round into a book, page 1 on the front.",
    svg: `<path d="M60 20 L120 20 L120 95 L60 95 Z"/><path d="M60 20 L50 26 L50 100 L110 100 L120 95"/><text x="90" y="64" font-size="22" text-anchor="middle" fill="currentColor" stroke="none" font-family="sans-serif">1</text>`,
  },
];

export function backPanel(d: ZineData, look: Look): Panel {
  const { size, d: path } = qrPath(d.url);
  const qr = `data:image/svg+xml;base64,${Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="#ffffff"/><path d="${path}" fill="${look.ink}"/></svg>`,
  ).toString("base64")}`;
  return {
    holes: [],
    node: (
      <Page>
        <div
          style={flex({
            position: "absolute",
            left: M,
            right: M,
            top: M,
            flexDirection: "column",
            color: look.ink,
          })}
        >
          <div
            style={flex({
              fontFamily: look.head,
              fontWeight: 800,
              fontSize: look.id === "v4" ? 52 : look.id === "v1" ? 76 : 60,
              lineHeight: 0.95,
              whiteSpace: "nowrap",
            })}
          >
            How to fold your zine
          </div>
          <div
            style={flex({ fontFamily: look.text, fontStyle: "italic", fontSize: 30, marginTop: 8 })}
          >
            One sheet, one cut, eight pages.
          </div>
        </div>
        <div
          style={flex({
            position: "absolute",
            left: M,
            right: M,
            top: 205,
            flexWrap: "wrap",
            justifyContent: "space-between",
            rowGap: 20,
          })}
        >
          {STEPS.map((s, i) => (
            <Step
              key={i}
              n={i + 1}
              text={s.text}
              svg={s.svg.replace(/currentColor/g, look.ink)}
              look={look}
            />
          ))}
        </div>
        <div
          style={flex({
            position: "absolute",
            left: M,
            right: M,
            bottom: 110,
            alignItems: "center",
            gap: 24,
            borderTop: `4px solid ${look.ink}`,
            paddingTop: 20,
            color: look.ink,
          })}
        >
          <div style={flex({ flexDirection: "column", flex: 1, gap: 8 })}>
            <div
              style={flex({ fontFamily: look.head, fontWeight: 800, fontSize: 44, lineHeight: 1 })}
            >
              {d.signOff}
            </div>
            <div style={flex({ fontFamily: look.sans, fontSize: 22, wordBreak: "break-all" })}>
              {`The whole paper: ${d.urlText}`}
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qr} width={150} height={150} alt="" />
        </div>
        <Folio look={look} n={8} label={`The Yay News · No. ${d.issue}`} />
      </Page>
    ),
  };
}
