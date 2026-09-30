// Hand-drawn line work, generated: pencil lines that bow and overshoot, circles that don't quite
// close, tally marks. Everything is seeded, so a drawing is identical on the server and in the
// browser (no hydration mismatch) and the same stamp always wobbles the same way.

export type Rng = () => number;

/** mulberry32: a tiny seeded PRNG. */
export function rng(seed: number): Rng {
  let a = seed >>> 0 || 0x9e3779b9;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A string to a seed. */
export function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

const f = (n: number) => (Math.round(n * 100) / 100).toString();
/** A random number in [-1, 1). */
const pm = (r: Rng) => r() * 2 - 1;

/** A pencil line from a to b: bowed slightly, with a small overshoot at each end. */
export function line(r: Rng, x1: number, y1: number, x2: number, y2: number, rough = 1): string {
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const nx = -(y2 - y1) / len;
  const ny = (x2 - x1) / len;
  const over = len * 0.04 * rough;
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const sx = x1 - ux * over * r() + pm(r) * rough * 0.6;
  const sy = y1 - uy * over * r() + pm(r) * rough * 0.6;
  const ex = x2 + ux * over * r() + pm(r) * rough * 0.6;
  const ey = y2 + uy * over * r() + pm(r) * rough * 0.6;
  const bow = pm(r) * Math.min(len * 0.05, 3) * rough;
  const c1 = 0.3 + r() * 0.15;
  const c2 = 0.6 + r() * 0.15;
  return `M${f(sx)} ${f(sy)} C${f(sx + (ex - sx) * c1 + nx * bow)} ${f(sy + (ey - sy) * c1 + ny * bow)} ${f(sx + (ex - sx) * c2 + nx * bow * 0.6)} ${f(sy + (ey - sy) * c2 + ny * bow * 0.6)} ${f(ex)} ${f(ey)}`;
}

/** A hand-drawn ellipse: wobbly radius, started anywhere, overlapping itself as it closes. */
export function ellipse(
  r: Rng,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  rough = 1,
  overlap = 0.18,
): string {
  const steps = 14;
  const start = r() * Math.PI * 2;
  const turn = Math.PI * 2 * (1 + overlap * (0.6 + r() * 0.8));
  const pts: [number, number][] = [];
  const drift = pm(r) * 0.06 * rough;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = start + turn * t;
    // The radius drifts as the hand goes round, so start and end don't meet.
    const k = 1 + pm(r) * 0.035 * rough + drift * t;
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  return smooth(pts);
}

/** A smooth path through points (Catmull-Rom as cubic Béziers). */
export function smooth(pts: [number, number][], closed = false): string {
  if (pts.length < 2) return "";
  const p = (i: number) =>
    closed ? pts[(i + pts.length) % pts.length]! : pts[Math.min(Math.max(i, 0), pts.length - 1)]!;
  let d = `M${f(pts[0]![0])} ${f(pts[0]![1])}`;
  const n = closed ? pts.length : pts.length - 1;
  for (let i = 0; i < n; i++) {
    const [x0, y0] = p(i - 1);
    const [x1, y1] = p(i);
    const [x2, y2] = p(i + 1);
    const [x3, y3] = p(i + 2);
    d += ` C${f(x1 + (x2 - x0) / 6)} ${f(y1 + (y2 - y0) / 6)} ${f(x2 - (x3 - x1) / 6)} ${f(y2 - (y3 - y1) / 6)} ${f(x2)} ${f(y2)}`;
  }
  return closed ? `${d} Z` : d;
}

/** A polyline through points, each point nudged by the hand. */
export function scrawl(r: Rng, pts: [number, number][], rough = 1): string {
  return smooth(pts.map(([x, y]) => [x + pm(r) * rough, y + pm(r) * rough]));
}

/** Tally marks: groups of four uprights struck through by a fifth, `height` tall, from (x, y). */
export function tally(
  r: Rng,
  count: number,
  x: number,
  y: number,
  height: number,
  gap = height * 0.22,
): string[] {
  const out: string[] = [];
  let cx = x;
  for (let g = 0; g < Math.ceil(count / 5); g++) {
    const inGroup = Math.min(5, count - g * 5);
    const start = cx;
    for (let i = 0; i < Math.min(inGroup, 4); i++) {
      const lean = pm(r) * height * 0.08;
      out.push(line(r, cx + lean, y + pm(r), cx - lean, y + height + pm(r), 0.8));
      cx += gap;
    }
    if (inGroup === 5) {
      out.push(
        line(r, start - gap * 0.5, y + height * 0.72, cx - gap * 0.3, y + height * 0.22, 0.9),
      );
    }
    cx += gap * 1.6;
  }
  return out;
}

/** Points round a regular polygon, for stamp borders. */
export function polygon(cx: number, cy: number, r: number, sides: number, rot = 0): string {
  const pts = Array.from({ length: sides }, (_, i) => {
    const a = rot + (Math.PI * 2 * i) / sides - Math.PI / 2;
    return `${f(cx + Math.cos(a) * r)},${f(cy + Math.sin(a) * r)}`;
  });
  return pts.join(" ");
}

/** A scalloped (cloud) edge round a circle: `bumps` arcs of radius `r`. */
export function scallop(cx: number, cy: number, r: number, bumps: number, depth: number): string {
  let d = "";
  for (let i = 0; i <= bumps; i++) {
    const a = (Math.PI * 2 * i) / bumps - Math.PI / 2;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if (i === 0) d = `M${f(x)} ${f(y)}`;
    else {
      const m = (Math.PI * 2 * (i - 0.5)) / bumps - Math.PI / 2;
      const qx = cx + Math.cos(m) * (r + depth * 2);
      const qy = cy + Math.sin(m) * (r + depth * 2);
      d += ` Q${f(qx)} ${f(qy)} ${f(x)} ${f(y)}`;
    }
  }
  return `${d} Z`;
}
