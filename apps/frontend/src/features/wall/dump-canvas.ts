import type { Recap } from "./recap";

// Draws the weekly dump: a 1080×1350 corkboard (an Instagram feed post) with the week's clippings
// pinned up, the stamps thumped on, and the numbers in marker. Fonts are whatever the page has
// loaded for the given CSS families, so it prints in the paper's own faces.

export type DumpFonts = { gothic: string; type: string; hand: string; sans: string };

const W = 1080;
const H = 1350;
const INK = "#161412";
const PAPER = "#efe8d8";
const PINK = "#d61f7a";
const BLUE = "#1f4fd8";

function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function wrap(ctx: CanvasRenderingContext2D, text: string, max: number, lines: number): string[] {
  const words = text.split(/\s+/);
  const out: string[] = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (ctx.measureText(next).width > max && line) {
      out.push(line);
      line = w;
      if (out.length === lines) break;
    } else line = next;
  }
  if (out.length < lines && line) out.push(line);
  if (out.length === lines && words.join(" ").length > out.join(" ").length) {
    out[lines - 1] = `${out[lines - 1]!.replace(/\s+\S*$/, "")}…`;
  }
  return out;
}

function cork(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#b8875a";
  ctx.fillRect(0, 0, W, H);
  const r = seeded(7);
  ctx.fillStyle = "rgba(60,35,10,0.28)";
  for (let i = 0; i < 9000; i++) {
    ctx.beginPath();
    ctx.arc(r() * W, r() * H, 1 + r() * 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function tornRect(ctx: CanvasRenderingContext2D, w: number, h: number, r: () => number) {
  ctx.beginPath();
  ctx.moveTo(0, 6);
  for (let x = 0; x <= w; x += 18) ctx.lineTo(x, r() * 10);
  ctx.lineTo(w, h);
  for (let x = w; x >= 0; x -= 18) ctx.lineTo(x, h - r() * 10);
  ctx.closePath();
}

export function drawDump(canvas: HTMLCanvasElement, recap: Recap, fonts: DumpFonts, title: string) {
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const r = seeded(recap.from.split("-").reduce((s, n) => s * 31 + Number(n), 7));
  cork(ctx);

  // The title card, taped at the top.
  ctx.save();
  ctx.translate(90, 70);
  ctx.rotate(-0.02);
  ctx.fillStyle = PAPER;
  ctx.shadowColor = "rgba(0,0,0,0.3)";
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 10;
  ctx.fillRect(0, 0, 900, 230);
  ctx.shadowColor = "transparent";
  ctx.fillStyle = INK;
  ctx.font = `700 26px ${fonts.type}`;
  ctx.fillText("THE YAY NEWS · " + title.toUpperCase(), 40, 58);
  ctx.font = `140px ${fonts.gothic}`;
  ctx.fillText(recap.label.toUpperCase(), 36, 196);
  ctx.fillStyle = "rgba(233,255,31,0.8)";
  ctx.fillRect(390, -16, 120, 34);
  ctx.restore();

  // The week's numbers, in marker on a sticky note.
  ctx.save();
  ctx.translate(640, 350);
  ctx.rotate(0.04);
  ctx.fillStyle = "#e9ff1f";
  ctx.shadowColor = "rgba(0,0,0,0.3)";
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 8;
  ctx.fillRect(0, 0, 360, 330);
  ctx.shadowColor = "transparent";
  ctx.fillStyle = INK;
  ctx.font = `54px ${fonts.hand}`;
  const lines = [
    `${recap.papers} paper${recap.papers === 1 ? "" : "s"} read`,
    `${recap.clippings.length} torn out`,
    `${recap.puzzles} puzzle${recap.puzzles === 1 ? "" : "s"} solved`,
    `best streak: ${recap.best}`,
  ];
  lines.forEach((l, i) => ctx.fillText(l, 26, 74 + i * 70));
  ctx.restore();

  // Clippings, pinned up down the left.
  const clips = recap.clippings.slice(0, 5);
  clips.forEach((c, i) => {
    const w = 520;
    const h = 170;
    ctx.save();
    ctx.translate(70 + (i % 2) * 30, 350 + i * 185);
    ctx.rotate((r() - 0.5) * 0.09);
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 8;
    ctx.fillStyle = PAPER;
    tornRect(ctx, w, h, r);
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.fillStyle = INK;
    ctx.font = `700 20px ${fonts.type}`;
    ctx.fillText((c.kicker ?? `No. ${c.issue}`).toUpperCase(), 28, 46);
    ctx.font = `44px ${fonts.gothic}`;
    wrap(ctx, c.headline, w - 56, 2).forEach((l, k) => ctx.fillText(l, 28, 96 + k * 46));
    ctx.fillStyle = PINK;
    ctx.beginPath();
    ctx.arc(w / 2, 18, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
  if (clips.length === 0) {
    ctx.save();
    ctx.translate(80, 400);
    ctx.rotate(-0.03);
    ctx.fillStyle = "#fffbe6";
    ctx.fillRect(0, 0, 480, 200);
    ctx.fillStyle = INK;
    ctx.font = `46px ${fonts.hand}`;
    wrap(ctx, "nothing torn out yet. keep the good ones next week.", 430, 3).forEach((l, k) =>
      ctx.fillText(l, 26, 70 + k * 52),
    );
    ctx.restore();
  }

  // Stamps, thumped down the right.
  recap.stamps.slice(0, 7).forEach((s, i) => {
    const x = 700 + (i % 2) * 150;
    const y = 780 + Math.floor(i / 2) * 150;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((r() - 0.5) * 0.6);
    ctx.globalAlpha = 0.9;
    ctx.strokeStyle = s.late ? BLUE : PINK;
    ctx.fillStyle = s.late ? BLUE : PINK;
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(0, 0, 62, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 52, 0, Math.PI * 2);
    ctx.stroke();
    ctx.textAlign = "center";
    ctx.font = `48px ${fonts.gothic}`;
    ctx.fillText(String(s.issue), 0, 12);
    ctx.font = `700 15px ${fonts.type}`;
    ctx.fillText(s.late ? "LATE" : "READ", 0, 36);
    ctx.restore();
  });

  // The sign-off.
  ctx.fillStyle = PAPER;
  ctx.font = `46px ${fonts.hand}`;
  ctx.fillText("only good news. new every morning at 7.", 90, H - 60);
}
