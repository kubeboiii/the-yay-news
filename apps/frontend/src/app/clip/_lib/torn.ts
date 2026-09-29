// The outline of a piece torn out of a newspaper, as SVG path data. Newsprint tears along the
// grain in long lazy waves with a fine ragged fringe, so each edge is a few octaves of seeded
// noise: a slow wander, a medium wobble and a sharp per-fibre jitter. Same seed, same tear.

import { seeded } from "@/app/mockups/_shared/edition-seed";

type Pt = [number, number];

/** Smooth 1D value noise from a seeded random source: `octave(t)` in -1..1. */
function octave(rand: () => number, knots: number) {
  const v = Array.from({ length: knots + 2 }, () => rand() * 2 - 1);
  return (t: number) => {
    const x = Math.max(0, Math.min(1, t)) * knots;
    const i = Math.floor(x);
    const f = x - i;
    const s = f * f * (3 - 2 * f);
    return (v[i] ?? 0) * (1 - s) + (v[i + 1] ?? 0) * s;
  };
}

/** Offsets into the paper along one edge, in px, for `n` samples (always >= 0, so it only bites). */
function tear(rand: () => number, n: number, depth: number) {
  const slow = octave(rand, 3);
  const mid = octave(rand, 14);
  const fine = octave(rand, 70);
  return Array.from({ length: n + 1 }, (_, k) => {
    const t = k / n;
    const d =
      depth * (0.5 + 0.32 * slow(t) + 0.22 * mid(t) + 0.12 * fine(t)) +
      depth * 0.14 * (rand() - 0.5);
    return Math.max(0, d);
  });
}

export type Tear = { paper: string; rim: string };

const path = (pts: Pt[]) => `M${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L")}Z`;

/**
 * A torn outline for a w × h piece: `paper` is the printed sheet, `rim` the paler fibres the tear
 * exposes just outside it. `depth` is how far the tear bites in, in px.
 */
export function tornOutline(w: number, h: number, seed: number, depth = 18, step = 6): Tear {
  const rand = seeded(seed);
  const nx = Math.round(w / step);
  const ny = Math.round(h / step);
  // Each side: the tear itself (where the rim ends) and how much paler fibre shows inside it.
  const side = (n: number, d: number) => {
    const edge = tear(rand, n, d);
    const fringe = octave(rand, Math.max(8, Math.round(n / 5)));
    const fibre = edge.map((_, k) => d * (0.12 + 0.3 * Math.max(0, fringe(k / n))) + rand() * 1.6);
    return { edge, fibre };
  };
  const top = side(nx, depth);
  const right = side(ny, depth * 0.6);
  const bottom = side(nx, depth);
  const left = side(ny, depth * 0.6);
  const outline = (withFibre: boolean) => {
    const at = (s: { edge: number[]; fibre: number[] }, k: number) =>
      (s.edge[k] ?? 0) + (withFibre ? (s.fibre[k] ?? 0) : 0);
    // Corners are left to the neighbouring samples, so they come out as a small torn-off nick.
    const pts: Pt[] = [];
    for (let k = 1; k < nx; k++) pts.push([(k / nx) * w, at(top, k)]);
    for (let k = 1; k < ny; k++) pts.push([w - at(right, k), (k / ny) * h]);
    for (let k = nx - 1; k > 0; k--) pts.push([(k / nx) * w, h - at(bottom, k)]);
    for (let k = ny - 1; k > 0; k--) pts.push([at(left, k), (k / ny) * h]);
    return path(pts);
  };
  return { rim: outline(false), paper: outline(true) };
}

/** A stable 32-bit seed from any string. */
export function seedFrom(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}
