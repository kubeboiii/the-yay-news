import type { CSSProperties } from "react";
import type { PlayInks } from "./types";

/**
 * The CSS variables that recolour every puzzle: `--play-ink` (pencil), `--play-highlight`
 * (marker), `--play-paper`, `--play-mark` (ticks and stars) and `--play-print` (printed ink).
 * A design can set them on any ancestor in its own CSS instead; this is for inline use.
 */
export function paperStyle(inks: PlayInks = {}, style?: CSSProperties): CSSProperties {
  const vars: Record<string, string> = {};
  if (inks.ink) vars["--play-ink"] = inks.ink;
  if (inks.highlight) vars["--play-highlight"] = inks.highlight;
  if (inks.paper) vars["--play-paper"] = inks.paper;
  if (inks.mark) vars["--play-mark"] = inks.mark;
  if (inks.print) vars["--play-print"] = inks.print;
  return { ...(vars as CSSProperties), ...style };
}

/** Deterministic randomness, so a mark looks hand-made but draws the same on every render. */
export function hashSeed(...parts: (string | number)[]): number {
  let h = 2166136261;
  for (const ch of parts.join("·")) {
    h ^= ch.codePointAt(0) ?? 0;
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % 2147483646 || 1;
}

/** A small seeded random number generator (mulberry32), returning floats in [0, 1). */
export function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A random number in [-1, 1) from a seed. */
export const wobble = (seed: number) => seeded(seed)() * 2 - 1;
