import { rand, tilt } from "@/features/riot/tokens/seed";

// Small seeded helpers for hand-made edges and placement, shared by the three directions. Seeded,
// so a torn edge or a tilt is the same on every render (no hydration mismatch, no jitter). `rand`
// and `tilt` live in the riot kit now.

export { rand, tilt };

/**
 * A CSS clip-path polygon with one or more torn edges. `depth` is how far the tear bites, in px;
 * `teeth` how many tears along each edge.
 */
export function torn(
  key: string,
  edges: ("top" | "bottom" | "left" | "right")[] = ["bottom"],
  depth = 7,
  teeth = 46,
): string {
  const r = rand(key);
  const pts: string[] = [];
  const bite = () => (r() * depth).toFixed(1);
  const step = (i: number) => ((i / teeth) * 100).toFixed(2);
  // top: left → right
  if (edges.includes("top")) for (let i = 0; i <= teeth; i++) pts.push(`${step(i)}% ${bite()}px`);
  else pts.push("0% 0%", "100% 0%");
  // right: top → bottom
  if (edges.includes("right"))
    for (let i = 0; i <= teeth; i++) pts.push(`calc(100% - ${bite()}px) ${step(i)}%`);
  // bottom: right → left
  if (edges.includes("bottom"))
    for (let i = teeth; i >= 0; i--) pts.push(`${step(i)}% calc(100% - ${bite()}px)`);
  else pts.push("100% 100%", "0% 100%");
  // left: bottom → top
  if (edges.includes("left")) for (let i = teeth; i >= 0; i--) pts.push(`${bite()}px ${step(i)}%`);
  return `polygon(${pts.join(", ")})`;
}

/** Newsprint grain as a CSS background image (an SVG noise tile). */
export const GRAIN = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1  0 0 0 0 0.08  0 0 0 0 0.06  0 0 0 .55 -.18'/></filter><rect width='180' height='180' filter='url(%23n)'/></svg>`,
).replace(/%2523/g, "%23")}")`;

/** Coarse photocopier toner noise (higher contrast than GRAIN). */
export const TONER = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.55' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 2.4 -1.45'/></filter><rect width='240' height='240' filter='url(%23n)'/></svg>`,
).replace(/%2523/g, "%23")}")`;
