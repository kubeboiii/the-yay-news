// How a back issue looks its age, as a function of how many days it has been on the shelf (and a
// seed, so the same copy always has the same spots). From the Phase 1 archive mockup.

const OLDEST = 41;

/** Deterministic pseudo-random generator (mulberry32): same seed, same sequence. */
export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const amount = (days: number) => (days <= 0 ? 0 : Math.min(1, (days / OLDEST) ** 0.7));

/** CSS for a copy's age: paper colour, toned edges and foxing, and a faded print. */
export function aged(days: number, seed: number) {
  const d = Math.max(0, days);
  const a = amount(d);
  const mix = (from: number, to: number) => Math.round(from + (to - from) * a);
  const paper = `rgb(${mix(240, 226)} ${mix(235, 206)} ${mix(224, 158)})`;
  const edge = d === 0 ? 0 : 0.15 + 0.85 * a;
  const foxing = d < 18 ? 0 : Math.min(1, (d - 18) / 22);
  const rnd = seeded(seed * 7919 + 13);
  const spots = Array.from({ length: foxing > 0 ? 5 + Math.floor(rnd() * 7) : 0 }, () => {
    const [x, y] = [Math.round(rnd() * 1000) / 10, Math.round(rnd() * 1000) / 10];
    const r = Math.round((0.6 + rnd() * 2.2) * 10) / 10;
    const o = Math.round((0.25 + rnd() * 0.55) * foxing * 100) / 100;
    return `radial-gradient(circle at ${x}% ${y}%, rgb(150 92 38 / ${o}) 0, rgb(170 110 50 / ${(o * 0.4).toFixed(2)}) ${r * 0.45}%, transparent ${r}%)`;
  });
  const toned = `radial-gradient(ellipse 72% 70% at 50% 50%, transparent 62%, rgb(196 150 70 / ${(0.45 * edge).toFixed(3)}) 88%, rgb(170 118 44 / ${(0.7 * edge).toFixed(3)}) 100%)`;
  const sepia = 0.34 * a ** 1.6;
  return {
    "--ar-paper": paper,
    "--ar-age": edge > 0 ? [...spots, toned].join(", ") : "none",
    filter: `sepia(${(sepia * 0.8).toFixed(3)}) contrast(${(1 - 0.13 * a).toFixed(3)}) saturate(${(1 - 0.22 * a).toFixed(3)})`,
  };
}

/** Whole days from a calendar date (UTC) to now. */
export const daysSince = (date: string, now: number) =>
  Math.floor((now - Date.parse(`${date}T00:00:00Z`)) / 86_400_000);
