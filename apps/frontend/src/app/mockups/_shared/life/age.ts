// How a back issue looks its age. Pure functions of the issue's age in days (and a seed), so the
// paper on the desk and its spine on the archive shelf age in exactly the same way.

import { seeded } from "../edition-seed";

export type AgeLook = {
  /** 0 for today's paper, 1 for the oldest issue in the run (about six weeks). */
  amount: number;
  sepia: number;
  brightness: number;
  contrast: number;
  saturate: number;
  /** Opacity of the toned, sun-faded border. */
  edge: number;
  /** Opacity of the foxing spots (only months-old paper has any). */
  foxing: number;
  /** Extra dot gain: old ink looks softer. Added to the press filter's blur. */
  soften: number;
  spots: { x: number; y: number; r: number; o: number }[];
};

const OLDEST = 41;

export function ageLook(days: number, seed: number): AgeLook {
  const d = Math.max(0, days);
  const a = d === 0 ? 0 : Math.min(1, (d / OLDEST) ** 0.7);
  // A few days: only the edges have started to turn. Weeks: warmer and flatter. Months: yellow,
  // soft, and speckled with foxing.
  const sepia = 0.34 * a ** 1.6;
  const foxing = d < 18 ? 0 : Math.min(1, (d - 18) / 22);
  const rnd = seeded(seed * 7919 + 13);
  const count = foxing > 0 ? 5 + Math.floor(rnd() * 7) : 0;
  const spots = Array.from({ length: count }, () => ({
    x: Math.round(rnd() * 1000) / 10,
    y: Math.round(rnd() * 1000) / 10,
    r: Math.round((0.6 + rnd() * 2.2) * 10) / 10,
    o: Math.round((0.25 + rnd() * 0.55) * foxing * 100) / 100,
  }));
  return {
    amount: a,
    sepia,
    brightness: 1 - 0.04 * a,
    contrast: 1 - 0.13 * a,
    saturate: 1 - 0.22 * a,
    edge: d === 0 ? 0 : 0.15 + 0.85 * a,
    foxing,
    soften: 0.28 * a,
    spots,
  };
}

/** The colour of the paper itself at this age: fresh newsprint drifting to old-book yellow. */
export function agedPaper(days: number): string {
  const a = days === 0 ? 0 : Math.min(1, (days / OLDEST) ** 0.7);
  const mix = (from: number, to: number) => Math.round(from + (to - from) * a);
  return `rgb(${mix(240, 226)} ${mix(235, 206)} ${mix(224, 158)})`;
}

/** Background layers for the toned edge and foxing, used on the sheet's age layer. */
export function ageBackground(look: AgeLook): string {
  const spots = look.spots.map(
    (s) =>
      `radial-gradient(circle at ${s.x}% ${s.y}%, rgb(150 92 38 / ${s.o}) 0, rgb(170 110 50 / ${(s.o * 0.4).toFixed(2)}) ${s.r * 0.45}%, transparent ${s.r}%)`,
  );
  const edge = `radial-gradient(ellipse 72% 70% at 50% 50%, transparent 62%, rgb(196 150 70 / ${(0.45 * look.edge).toFixed(3)}) 88%, rgb(170 118 44 / ${(0.7 * look.edge).toFixed(3)}) 100%)`;
  return [...spots, edge].join(", ");
}
