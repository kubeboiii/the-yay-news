import { hashSeed, seeded } from "@/features/play/paper-style";

// Seeded randomness for hand-made placement: a tilt or a torn edge is the same on every render, so
// the server and the browser print identical markup and nothing jitters between renders.

/** A deterministic random stream for `key`. */
export const rand = (key: string) => seeded(hashSeed("site", key));

/** A tilt in degrees between -max and max. */
export function tilt(key: string, max = 2): number {
  return Math.round((rand(key)() * 2 - 1) * max * 10) / 10;
}

/** Rounds to `d` decimals, so generated SVG and clip paths stay short and stable. */
export const r1 = (n: number, d = 1) => Math.round(n * 10 ** d) / 10 ** d;
