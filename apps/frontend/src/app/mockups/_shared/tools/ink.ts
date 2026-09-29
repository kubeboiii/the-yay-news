// Stroke geometry for the marker: turns the points a hand moved through into the filled outline a
// real nib leaves. Coordinates are in "sheet units" — the overlay is always 1000 units wide, so a
// drawing scales with the paper when the window changes size.

export type Tool = "pencil" | "felt" | "highlighter";

/** One sampled point: position in sheet units and the nib width reached there. */
export type InkPoint = [x: number, y: number, w: number];

export type Stroke = { tool: Tool; pts: InkPoint[] };

type NibSpec = {
  /** Nominal width in sheet units (1000 across the wrap). */
  base: number;
  /** How much a fast stroke thins the line (0 = not at all). */
  speedThin: number;
  /** Lowest and highest multiple of the base a stroke may reach. */
  min: number;
  max: number;
};

export const NIBS: Record<Tool, NibSpec> = {
  // A coloured pencil: thin, thins further when flicked, never quite even.
  pencil: { base: 1.85, speedThin: 0.55, min: 0.45, max: 1.2 },
  // A felt-tip: a firm round nib that barely changes, a touch lighter when rushed.
  felt: { base: 3.4, speedThin: 0.25, min: 0.7, max: 1.1 },
  // A chisel highlighter: wide, constant pressure; its width comes from the angle of the chisel.
  highlighter: { base: 15, speedThin: 0, min: 1, max: 1 },
};

/** The highlighter's chisel is held near-vertical, so a line along a row of type is at full width. */
const CHISEL = (78 * Math.PI) / 180;

/**
 * Width for the next point, from how fast the hand is moving (units per millisecond) and, for a
 * pen, how hard it is pressing. The result is eased toward the previous width so the line swells
 * and thins smoothly instead of jumping between samples.
 */
export function nextWidth(tool: Tool, prev: number | undefined, speed: number, pressure: number | undefined) {
  const nib = NIBS[tool];
  const bySpeed = 1.15 - Math.min(1, speed / 2.2) * nib.speedThin * 1.6;
  const byPressure = pressure === undefined ? 1 : 0.45 + pressure * 1.1;
  const target = nib.base * Math.min(nib.max, Math.max(nib.min, bySpeed * byPressure));
  if (prev === undefined) return target;
  return prev + (target - prev) * 0.35;
}

const r1 = (n: number) => Math.round(n * 10) / 10;

/** Rounds a stroke for storage: a tenth of a sheet unit is far below what the eye can see. */
export const packStroke = (s: Stroke): Stroke => ({ tool: s.tool, pts: s.pts.map(([x, y, w]) => [r1(x), r1(y), r1(w)]) });

/** Light smoothing: each point pulled toward its neighbours, ends kept where the hand put them. */
function smooth(pts: InkPoint[], passes = 2): InkPoint[] {
  let out = pts;
  for (let k = 0; k < passes; k++) {
    if (out.length < 3) return out;
    const next: InkPoint[] = [out[0] as InkPoint];
    for (let i = 1; i < out.length - 1; i++) {
      const a = out[i - 1] as InkPoint;
      const b = out[i] as InkPoint;
      const c = out[i + 1] as InkPoint;
      next.push([(a[0] + b[0] * 2 + c[0]) / 4, (a[1] + b[1] * 2 + c[1]) / 4, (a[2] + b[2] * 2 + c[2]) / 4]);
    }
    next.push(out[out.length - 1] as InkPoint);
    out = next;
  }
  return out;
}

/** Drops points closer together than the nib can resolve, which also keeps saved drawings small. */
function thin(pts: InkPoint[], minGap: number): InkPoint[] {
  if (pts.length < 3) return pts;
  const out: InkPoint[] = [pts[0] as InkPoint];
  for (let i = 1; i < pts.length - 1; i++) {
    const p = pts[i] as InkPoint;
    const q = out[out.length - 1] as InkPoint;
    if (Math.hypot(p[0] - q[0], p[1] - q[1]) >= minGap) out.push(p);
  }
  out.push(pts[pts.length - 1] as InkPoint);
  return out;
}

const f = (n: number) => n.toFixed(2);

/** A dot: a single touch of the nib. */
function dot(x: number, y: number, r: number, tool: Tool) {
  if (tool === "highlighter") {
    const hw = r * 0.35;
    return `M${f(x - hw)} ${f(y - r)}h${f(hw * 2)}v${f(r * 2)}h${f(-hw * 2)}Z`;
  }
  return `M${f(x - r)} ${f(y)}a${f(r)} ${f(r)} 0 1 0 ${f(r * 2)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-r * 2)} 0Z`;
}

/**
 * The filled outline of a stroke as an SVG path: the centre line offset either side by half the
 * nib width at each point, joined with curves through the midpoints, with round ends for a pencil
 * or felt-tip and square ends for a chisel.
 */
export function outline(stroke: Stroke): string {
  const { tool } = stroke;
  const raw = thin(stroke.pts, tool === "highlighter" ? 1.2 : 0.6);
  const first = raw[0];
  if (!first) return "";
  if (raw.length === 1) return dot(first[0], first[1], first[2] / 2, tool);
  const pts = smooth(raw);

  const left: [number, number][] = [];
  const right: [number, number][] = [];
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i] as InkPoint;
    const a = pts[Math.max(0, i - 1)] as InkPoint;
    const b = pts[Math.min(pts.length - 1, i + 1)] as InkPoint;
    let dx = b[0] - a[0];
    let dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    dx /= len;
    dy /= len;
    let hw = p[2] / 2;
    if (tool === "highlighter") {
      // A chisel is widest when it moves across its edge and narrowest when it moves along it.
      const across = Math.abs(Math.sin(Math.atan2(dy, dx) - CHISEL));
      hw = (p[2] / 2) * (0.25 + 0.75 * across);
    }
    left.push([p[0] - dy * hw, p[1] + dx * hw]);
    right.push([p[0] + dy * hw, p[1] - dx * hw]);
  }

  const side = (arr: [number, number][]) => {
    let d = "";
    for (let i = 1; i < arr.length - 1; i++) {
      const p = arr[i] as [number, number];
      const n = arr[i + 1] as [number, number];
      d += `Q${f(p[0])} ${f(p[1])} ${f((p[0] + n[0]) / 2)} ${f((p[1] + n[1]) / 2)}`;
    }
    const last = arr[arr.length - 1] as [number, number];
    return `${d}L${f(last[0])} ${f(last[1])}`;
  };

  const l0 = left[0] as [number, number];
  const rr = [...right].reverse();
  const r0 = rr[0] as [number, number];
  const end = pts[pts.length - 1] as InkPoint;
  const start = pts[0] as InkPoint;
  const cap = (r: number, to: [number, number]) =>
    tool === "highlighter" ? `L${f(to[0])} ${f(to[1])}` : `A${f(r)} ${f(r)} 0 0 1 ${f(to[0])} ${f(to[1])}`;

  return (
    `M${f(l0[0])} ${f(l0[1])}` +
    side(left) +
    cap(end[2] / 2, r0) +
    side(rr) +
    cap(start[2] / 2, l0) +
    "Z"
  );
}
