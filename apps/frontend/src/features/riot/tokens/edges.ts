import { r1, rand } from "./seed";

// How a piece of paper was cut, as a CSS clip-path. Seeded, so the same piece tears the same way
// on every render. Use them sparingly: most things are guillotine-cut (straight), a few are torn.
//
//   cut     guillotine: straight, a hair out of square
//   torn    ripped by hand: deep, irregular bites
//   deckle  handmade paper: soft, frequent, shallow
//   zigzag  pinking shears: a regular saw-tooth

export type Edge = "cut" | "torn" | "deckle" | "zigzag";
export type Side = "top" | "right" | "bottom" | "left";

const SPEC: Record<Exclude<Edge, "cut">, { depth: number; teeth: number; jitter: number }> = {
  torn: { depth: 9, teeth: 26, jitter: 1 },
  deckle: { depth: 3.5, teeth: 60, jitter: 0.8 },
  zigzag: { depth: 7, teeth: 0, jitter: 0 },
};

/**
 * A clip-path polygon for `edge` along `sides`. `teeth` sets how many zigzag teeth run along each
 * side (default 28); the other edges bite in px and step in %.
 */
export function edgePath(
  edge: Edge,
  seed: string,
  sides: readonly Side[] = ["top", "right", "bottom", "left"],
  teeth = 28,
): string {
  const r = rand(`edge:${edge}:${seed}`);
  if (edge === "cut") {
    // A guillotine never quite squares a stack: each corner off by a fraction.
    const c = () => r1(r() * 0.5, 2);
    return `polygon(${c()}% ${c()}%, ${100 - c()}% ${c()}%, ${100 - c()}% ${100 - c()}%, ${c()}% ${100 - c()}%)`;
  }
  const pts: string[] = [];
  const has = (s: Side) => sides.includes(s);
  if (edge === "zigzag") {
    const d = SPEC.zigzag.depth;
    const run = (n: number, f: (t: string, out: boolean) => string) => {
      for (let i = 0; i <= n; i++) pts.push(f(`${r1((i / n) * 100, 2)}%`, i % 2 === 1));
    };
    const n = Math.max(4, Math.round(teeth)) * 2;
    if (has("top")) run(n, (t, o) => `${t} ${o ? d : 0}px`);
    else pts.push("0% 0%", "100% 0%");
    if (has("right")) run(n, (t, o) => `calc(100% - ${o ? d : 0}px) ${t}`);
    if (has("bottom")) {
      const tmp: string[] = [];
      for (let i = n; i >= 0; i--)
        tmp.push(`${r1((i / n) * 100, 2)}% calc(100% - ${i % 2 ? d : 0}px)`);
      pts.push(...tmp);
    } else pts.push("100% 100%", "0% 100%");
    if (has("left"))
      for (let i = n; i >= 0; i--) pts.push(`${i % 2 ? d : 0}px ${r1((i / n) * 100, 2)}%`);
    return `polygon(${pts.join(", ")})`;
  }
  const { depth, teeth: bites, jitter } = SPEC[edge];
  // A tear wanders: each bite leans on the last one, so it reads as one rip, not noise.
  let drift = r() * depth;
  const bite = () => {
    drift = Math.min(depth, Math.max(0, drift + (r() * 2 - 1) * depth * 0.55 * jitter));
    return r1(edge === "deckle" ? r() * depth : drift);
  };
  const step = (i: number) => r1((i / bites) * 100, 2);
  if (has("top")) for (let i = 0; i <= bites; i++) pts.push(`${step(i)}% ${bite()}px`);
  else pts.push("0% 0%", "100% 0%");
  if (has("right"))
    for (let i = 0; i <= bites; i++) pts.push(`calc(100% - ${bite()}px) ${step(i)}%`);
  if (has("bottom"))
    for (let i = bites; i >= 0; i--) pts.push(`${step(i)}% calc(100% - ${bite()}px)`);
  else pts.push("100% 100%", "0% 100%");
  if (has("left")) for (let i = bites; i >= 0; i--) pts.push(`${bite()}px ${step(i)}%`);
  return `polygon(${pts.join(", ")})`;
}
