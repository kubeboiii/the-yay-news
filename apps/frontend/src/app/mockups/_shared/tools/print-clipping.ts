// How a clipping is re-printed as paper: its cut or torn edge, the tape holding it up, and the
// finished image a reader saves or shares. The board draws the same thing in CSS; this draws it on
// a canvas so the saved picture is the clipping as it hangs, not the raw capture.

import type { CSSProperties } from "react";
import { seeded } from "../edition-seed";
import { type Clipping, seedOf } from "./board-store";

export type Edge =
  | { kind: "cut"; poly: [number, number][] }
  | { kind: "torn"; offset: number; depth: number };

export type Tape = { x: number; y: number; angle: number; w: number };

/** A scissor cut is never quite square, and a tear is never the same twice. */
export function edgeFor(c: Pick<Clipping, "id" | "w">): Edge {
  const r = seeded(seedOf(c.id));
  if (r() < 0.45) {
    const j = () => (r() - 0.5) * 1.4; // up to 0.7% of the side either way
    return {
      kind: "cut",
      poly: [
        [0.4 + j(), 0.3 + j()],
        [50 + j() * 8, 0.1 + Math.abs(j())],
        [99.6 + j(), 0.6 + j()],
        [99.8 + j(), 50 + j() * 6],
        [99.5 + j(), 99.5 + j()],
        [50 + j() * 8, 99.8 - Math.abs(j())],
        [0.3 + j(), 99.6 + j()],
        [0.1 + Math.abs(j()), 50 + j() * 6],
      ],
    };
  }
  return { kind: "torn", offset: Math.round(r() * 100), depth: Math.max(26, Math.min(64, c.w * 0.1)) };
}

/** Where the tape goes, as fractions of the clipping's width and height. */
export function tapesFor(c: Pick<Clipping, "id" | "w" | "h">): Tape[] {
  const r = seeded(seedOf(c.id) ^ 0x9e3779b9);
  const w = Math.max(0.16, Math.min(0.42, 110 / Math.max(1, c.w)));
  if (r() < 0.4 || c.w < 220) {
    return [{ x: 0.5 + (r() - 0.5) * 0.2, y: 0, angle: (r() - 0.5) * 16, w: w * 1.1 }];
  }
  const a = 32 + r() * 14;
  return [
    { x: 0.04 + r() * 0.03, y: 0.02, angle: -a, w },
    { x: 0.96 - r() * 0.03, y: 0.02, angle: a - r() * 6, w },
    ...(r() < 0.35 ? [{ x: 0.5 + (r() - 0.5) * 0.4, y: 1, angle: (r() - 0.5) * 20, w: w * 0.9 }] : []),
  ];
}

/** CSS mask or clip for an edge, at a given on-board width in pixels. */
export function edgeStyle(edge: Edge, scale: number): CSSProperties {
  if (edge.kind === "cut") {
    return { clipPath: `polygon(${edge.poly.map(([x, y]) => `${x.toFixed(2)}% ${y.toFixed(2)}%`).join(", ")})` };
  }
  const d = edge.depth * scale;
  const torn = 'url("/mockup/fx/torn-edge.png")';
  const mask = `${torn} ${edge.offset}% 0 / 180% ${d}px no-repeat, ${torn} ${100 - edge.offset}% 100% / 180% ${d}px no-repeat, linear-gradient(#000, #000) 0 50% / 100% calc(100% - ${d * 0.9}px) no-repeat`;
  return { mask, WebkitMask: mask };
}

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

/**
 * The clipping as it hangs on the board, as a PNG: newsprint grain printed through it, its edge,
 * a soft shadow and its tape, on a transparent ground so it can be dropped onto anything.
 */
export async function printClipping(c: Clipping, paper: "newsprint" | "white" = "newsprint"): Promise<Blob> {
  const [shot, grain, torn, tape] = await Promise.all([
    createImageBitmap(c.image),
    loadImage(paper === "white" ? "/mockup/press/newsprint-white.jpg" : "/mockup/press/newsprint.jpg"),
    loadImage("/mockup/fx/torn-edge.png"),
    loadImage("/mockup/fx/tape.png"),
  ]);
  const iw = shot.width;
  const ih = shot.height;
  const k = iw / Math.max(1, c.w);

  const piece = document.createElement("canvas");
  piece.width = iw;
  piece.height = ih;
  const p = piece.getContext("2d");
  if (!p) throw new Error("No canvas");
  p.drawImage(shot, 0, 0);
  // The paper's own grain, printed through the ink, at the size the page shows it.
  p.globalCompositeOperation = "multiply";
  const gw = 900 * k;
  const gh = (grain.height / grain.width) * gw;
  for (let y = 0; y < ih; y += gh) for (let x = 0; x < iw; x += gw) p.drawImage(grain, x, y, gw, gh);

  const mask = document.createElement("canvas");
  mask.width = iw;
  mask.height = ih;
  const m = mask.getContext("2d");
  if (!m) throw new Error("No canvas");
  const edge = edgeFor(c);
  if (edge.kind === "cut") {
    m.beginPath();
    edge.poly.forEach(([x, y], i) => (i ? m.lineTo((x / 100) * iw, (y / 100) * ih) : m.moveTo((x / 100) * iw, (y / 100) * ih)));
    m.closePath();
    m.fill();
  } else {
    const d = edge.depth * k;
    const tw = iw * 1.8;
    const ox = -(tw - iw) * (edge.offset / 100);
    const ob = -(tw - iw) * ((100 - edge.offset) / 100);
    m.drawImage(torn, ox, 0, tw, d);
    m.drawImage(torn, ob, ih - d, tw, d);
    m.fillRect(0, d * 0.45, iw, ih - d * 0.9);
  }
  p.globalCompositeOperation = "destination-in";
  p.drawImage(mask, 0, 0);

  const pad = Math.round(Math.max(24 * k, iw * 0.07));
  const out = document.createElement("canvas");
  out.width = iw + pad * 2;
  out.height = ih + pad * 2;
  const o = out.getContext("2d");
  if (!o) throw new Error("No canvas");
  o.shadowColor = "rgba(45, 32, 18, 0.34)";
  o.shadowBlur = 14 * k;
  o.shadowOffsetY = 5 * k;
  o.drawImage(piece, pad, pad);
  o.shadowColor = "transparent";
  o.globalAlpha = 0.92;
  for (const t of tapesFor(c)) {
    const tw = t.w * iw;
    const th = (tape.height / tape.width) * tw;
    o.save();
    o.translate(pad + t.x * iw, pad + t.y * ih);
    o.rotate((t.angle * Math.PI) / 180);
    o.drawImage(tape, -tw / 2, -th / 2, tw, th);
    o.restore();
  }

  return new Promise((resolve, reject) => out.toBlob((b) => (b ? resolve(b) : reject(new Error("No image"))), "image/png"));
}
