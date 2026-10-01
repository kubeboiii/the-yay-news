import { r1, rand } from "./seed";

// Marker strokes with pressure. A felt-tip lays down more ink where the hand slows (the middle
// of a stroke) and lifts off thin at the ends; it wobbles a little and overshoots where it comes
// back round. Each stroke is a filled outline (not a fixed-width line), so the width really varies.
// Seeded and rounded, so the server and the browser draw the same path.

type P = [number, number];

/** A Catmull-Rom spline through `pts`, sampled `n` times per segment. */
function spline(pts: readonly P[], n = 10): P[] {
  const out: P[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]!;
    const p1 = pts[i]!;
    const p2 = pts[i + 1]!;
    const p3 = pts[i + 2] ?? p2;
    for (let s = 0; s < n; s++) {
      const t = s / n;
      const t2 = t * t;
      const t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) =>
        0.5 *
        (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(pts.at(-1)!);
  return out;
}

/**
 * The filled outline of a marker stroke along `pts`: widest at `peak` (0–1 along the stroke),
 * tapering to `tip` × width at both ends, with a seeded wobble in the width.
 */
export function pressureStroke(
  pts: readonly P[],
  { width = 4, tip = 0.25, peak = 0.45, seed = "stroke", wobble = 0.18 } = {},
): string {
  const line = spline(pts);
  const r = rand(`stroke:${seed}`);
  const n = line.length;
  const noise = Array.from({ length: 6 }, () => 1 + (r() * 2 - 1) * wobble);
  const left: string[] = [];
  const right: string[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const a = line[Math.max(0, i - 1)]!;
    const b = line[Math.min(n - 1, i + 1)]!;
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const nx = -(b[1] - a[1]) / len;
    const ny = (b[0] - a[0]) / len;
    // Pressure: a smooth hump peaking at `peak`, never below `tip`.
    const d = t < peak ? t / peak : (1 - t) / (1 - peak);
    const press = tip + (1 - tip) * Math.sin((Math.min(1, d) * Math.PI) / 2);
    const k = noise[Math.min(5, Math.floor(t * 6))]!;
    const w = (width * press * k) / 2;
    const [x, y] = line[i]!;
    left.push(`${r1(x + nx * w)} ${r1(y + ny * w)}`);
    right.push(`${r1(x - nx * w)} ${r1(y - ny * w)}`);
  }
  return `M${left.join(" L")} L${right.reverse().join(" L")} Z`;
}

/**
 * A loop drawn round something in a w × h box: one pass and a bit, overshooting where the pen
 * comes back round, slightly off-centre and wobbling in radius.
 */
export function loopPoints(w: number, h: number, seed: string): P[] {
  const r = rand(`loop:${seed}`);
  const cx = w / 2 + (r() - 0.5) * w * 0.03;
  const cy = h / 2 + (r() - 0.5) * h * 0.06;
  const start = -Math.PI * (0.62 + r() * 0.1);
  const sweep = Math.PI * 2 * (1.1 + r() * 0.06);
  const steps = 14;
  const pts: P[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = start + sweep * t;
    // The second time round drifts outward, so the ends cross instead of meeting.
    const grow = 1 + t * 0.07 + (r() - 0.5) * 0.035;
    pts.push([cx + Math.cos(a) * (w / 2 - 3) * grow, cy + Math.sin(a) * (h / 2 - 3) * grow]);
  }
  return pts;
}

/** A quick arrow along `pts`: the shaft, then two flicks for the head. */
export function arrowStrokes(pts: readonly P[], seed: string, head = 12, width = 4): string[] {
  const r = rand(`arrow:${seed}`);
  const b = pts.at(-1)!;
  const a = pts.at(-2) ?? pts[0]!;
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const flick = (spread: number, len: number): P[] => {
    const tipX = b[0] - Math.cos(ang + spread) * len;
    const tipY = b[1] - Math.sin(ang + spread) * len;
    // Each flick starts a hair past the point and curves a little.
    const mid: P = [(b[0] + tipX) / 2 + (r() - 0.5) * 1.5, (b[1] + tipY) / 2 + (r() - 0.5) * 1.5];
    return [[b[0] + Math.cos(ang) * 1.2, b[1] + Math.sin(ang) * 1.2], mid, [tipX, tipY]];
  };
  return [
    pressureStroke(pts, { width, seed: `${seed}-shaft`, peak: 0.35 }),
    pressureStroke(flick(0.55, head * (0.9 + r() * 0.2)), {
      width: width * 0.9,
      seed: `${seed}-h1`,
      peak: 0.2,
    }),
    pressureStroke(flick(-0.6, head * (0.85 + r() * 0.2)), {
      width: width * 0.9,
      seed: `${seed}-h2`,
      peak: 0.2,
    }),
  ];
}
