// A paper aeroplane folded from a real sheet, as geometry. The sheet (200 × 280) is cut along
// every crease a dart plane gets into eight flat facets; each fold is a rotation of some facets
// about a crease line, and a facet's place at any moment is the product of the folds it has been
// through. The result is a CSS matrix3d per facet, so the browser draws actual folded paper.

export type V3 = [number, number, number];
export type M4 = number[];
export type Pt = [number, number];

export const SHEET_W = 200;
export const SHEET_H = 280;

const I = (): M4 => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

export function mul(a: M4, b: M4): M4 {
  const o = new Array<number>(16).fill(0);
  for (let c = 0; c < 4; c++)
    for (let r = 0; r < 4; r++) {
      let s = 0;
      for (let k = 0; k < 4; k++) s += a[k * 4 + r]! * b[c * 4 + k]!;
      o[c * 4 + r] = s;
    }
  return o;
}

export const T = (x: number, y: number, z = 0): M4 => {
  const m = I();
  m[12] = x;
  m[13] = y;
  m[14] = z;
  return m;
};

/** Rotation by `th` radians about the unit axis u (right-handed, in CSS's y-down, z-out space). */
export function R(u: V3, th: number): M4 {
  const [x, y, z] = u;
  const c = Math.cos(th);
  const s = Math.sin(th);
  const t = 1 - c;
  return [
    t * x * x + c,
    t * x * y + s * z,
    t * x * z - s * y,
    0,
    t * x * y - s * z,
    t * y * y + c,
    t * y * z + s * x,
    0,
    t * x * z + s * y,
    t * y * z - s * x,
    t * z * z + c,
    0,
    0,
    0,
    0,
    1,
  ];
}

export const ap = (m: M4, [x, y, z]: V3): V3 => [
  m[0]! * x + m[4]! * y + m[8]! * z + m[12]!,
  m[1]! * x + m[5]! * y + m[9]! * z + m[13]!,
  m[2]! * x + m[6]! * y + m[10]! * z + m[14]!,
];

const rotAbout = (p: V3, u: V3, th: number) => mul(T(...p), mul(R(u, th), T(-p[0], -p[1], -p[2])));

const norm = (v: V3): V3 => {
  const l = Math.hypot(...v) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
};

// ——— The sheet's facets ———

// The wing crease runs from the nose (100, 0) to (62, 280) on the left half. Where it crosses the
// folded-in corner flap, the flap is creased too: reflected back across the corner fold that's
// the line from (100, 0) to (0, 13.57).
const WING_X = 62;
const FLAP_Y = ((100 - WING_X) * 100) / SHEET_H; // 13.57

const mirror = (pts: Pt[]): Pt[] => pts.map(([x, y]) => [SHEET_W - x, y]);

const LEFT: Record<string, Pt[]> = {
  flapKeel: [
    [0, 0],
    [100, 0],
    [0, FLAP_Y],
  ],
  flapWing: [
    [100, 0],
    [0, 100],
    [0, FLAP_Y],
  ],
  sheetKeel: [
    [100, 0],
    [100, SHEET_H],
    [WING_X, SHEET_H],
  ],
  sheetWing: [
    [100, 0],
    [0, 100],
    [0, SHEET_H],
    [WING_X, SHEET_H],
  ],
};

export type Facet = { id: string; pts: Pt[]; lift: number };

// Tiny lifts keep facets that end up lying on each other from fighting over the same plane.
const E = 0.45;
export const FACETS: Facet[] = [
  { id: "L.flapKeel", pts: LEFT.flapKeel!, lift: -E },
  { id: "L.flapWing", pts: LEFT.flapWing!, lift: -E },
  { id: "L.sheetKeel", pts: LEFT.sheetKeel!, lift: 0 },
  { id: "L.sheetWing", pts: LEFT.sheetWing!, lift: 0 },
  { id: "R.flapKeel", pts: mirror(LEFT.flapKeel!), lift: 2 * E },
  { id: "R.flapWing", pts: mirror(LEFT.flapWing!), lift: 2 * E },
  { id: "R.sheetKeel", pts: mirror(LEFT.sheetKeel!), lift: -3 * E },
  { id: "R.sheetWing", pts: mirror(LEFT.sheetWing!), lift: -3 * E },
];

// ——— The folds ———

type FoldSpec = {
  /** Which step of the folding it belongs to (steps run one after another). */
  step: number;
  /** The crease, in sheet coordinates, on the facet `ref` (which stays put in this fold). */
  a: Pt;
  b: Pt;
  ref: string;
  moves: string[];
  angle: number;
  /** Which way the moving part swings: +1 towards the reader, −1 away. */
  toward: 1 | -1;
};

const SPECS: FoldSpec[] = [
  // 1. The top-left corner in to the centre line.
  {
    step: 1,
    a: [0, 100],
    b: [100, 0],
    ref: "L.sheetWing",
    moves: ["L.flapKeel", "L.flapWing"],
    angle: Math.PI,
    toward: 1,
  },
  // 2. And the top-right.
  {
    step: 2,
    a: [100, 0],
    b: [200, 100],
    ref: "R.sheetWing",
    moves: ["R.flapKeel", "R.flapWing"],
    angle: Math.PI,
    toward: 1,
  },
  // 3. In half down the middle, flaps inside.
  {
    step: 3,
    a: [100, 0],
    b: [100, SHEET_H],
    ref: "L.sheetKeel",
    moves: ["R.flapKeel", "R.flapWing", "R.sheetKeel", "R.sheetWing"],
    angle: Math.PI,
    toward: 1,
  },
  // 4. Both wings down.
  {
    step: 4,
    a: [100, 0],
    b: [WING_X, SHEET_H],
    ref: "L.sheetKeel",
    moves: ["L.sheetWing", "L.flapWing"],
    angle: Math.PI / 2 - 0.22,
    toward: -1,
  },
  {
    step: 4,
    a: [100, 0],
    b: [SHEET_W - WING_X, SHEET_H],
    ref: "R.sheetKeel",
    moves: ["R.sheetWing", "R.flapWing"],
    angle: Math.PI / 2 - 0.22,
    toward: 1,
  },
];

export const STEPS = 4;

type Fold = FoldSpec & { p: V3; u: V3; sign: number };

const centroid = (pts: Pt[]): V3 => [
  pts.reduce((s, p) => s + p[0], 0) / pts.length,
  pts.reduce((s, p) => s + p[1], 0) / pts.length,
  0,
];

const FOLDS: Fold[] = (() => {
  const base = new Map<string, M4>(FACETS.map((f) => [f.id, I()]));
  const out: Fold[] = [];
  for (const spec of SPECS) {
    const ref = base.get(spec.ref)!;
    const p = ap(ref, [spec.a[0], spec.a[1], 0]);
    const q = ap(ref, [spec.b[0], spec.b[1], 0]);
    const u = norm([q[0] - p[0], q[1] - p[1], q[2] - p[2]]);
    // Pick the rotation's sign so the moving part swings the chosen way.
    const mover = FACETS.find((f) => f.id === spec.moves[0])!;
    const c0 = ap(base.get(mover.id)!, centroid(mover.pts));
    const c1 = ap(rotAbout(p, u, Math.PI / 2), c0);
    const sign = Math.sign(c1[2] - c0[2]) === spec.toward ? 1 : -1;
    out.push({ ...spec, p, u, sign });
    // Folds in the same step are independent; later steps see this one done.
    for (const id of spec.moves)
      base.set(id, mul(rotAbout(p, u, sign * spec.angle), base.get(id)!));
  }
  return out;
})();

/** Each facet's matrix, given each step's progress (0–1). */
export function facetMatrices(progress: readonly number[]): Map<string, M4> {
  const out = new Map<string, M4>();
  for (const f of FACETS) {
    let m = T(0, 0, f.lift);
    for (const fold of FOLDS) {
      if (!fold.moves.includes(f.id)) continue;
      const t = progress[fold.step - 1] ?? 0;
      if (t <= 0) continue;
      m = mul(rotAbout(fold.p, fold.u, fold.sign * fold.angle * t), m);
    }
    out.set(f.id, m);
  }
  return out;
}

// ——— Posing the whole thing ———
//
// A pose is a rotation (as a quaternion, so poses blend smoothly), the point of the model it turns
// about, and a scale. The model's own axes once folded: the nose points to −y, the wings' tops
// face −x, and the wings span z.

export type Quat = [number, number, number, number];
export type Pose = { q: Quat; cx: number; cy: number; s: number };

function quatOf(m: M4): Quat {
  const [m00, m10, m20, m01, m11, m21, m02, m12, m22] = [
    m[0]!,
    m[1]!,
    m[2]!,
    m[4]!,
    m[5]!,
    m[6]!,
    m[8]!,
    m[9]!,
    m[10]!,
  ];
  const tr = m00 + m11 + m22;
  let w: number, x: number, y: number, z: number;
  if (tr > 0) {
    const s = Math.sqrt(tr + 1) * 2;
    w = s / 4;
    x = (m21 - m12) / s;
    y = (m02 - m20) / s;
    z = (m10 - m01) / s;
  } else if (m00 > m11 && m00 > m22) {
    const s = Math.sqrt(1 + m00 - m11 - m22) * 2;
    w = (m21 - m12) / s;
    x = s / 4;
    y = (m01 + m10) / s;
    z = (m02 + m20) / s;
  } else if (m11 > m22) {
    const s = Math.sqrt(1 + m11 - m00 - m22) * 2;
    w = (m02 - m20) / s;
    x = (m01 + m10) / s;
    y = s / 4;
    z = (m12 + m21) / s;
  } else {
    const s = Math.sqrt(1 + m22 - m00 - m11) * 2;
    w = (m10 - m01) / s;
    x = (m02 + m20) / s;
    y = (m12 + m21) / s;
    z = s / 4;
  }
  return [x, y, z, w];
}

function matOf([x, y, z, w]: Quat): M4 {
  return [
    1 - 2 * (y * y + z * z),
    2 * (x * y + z * w),
    2 * (x * z - y * w),
    0,
    2 * (x * y - z * w),
    1 - 2 * (x * x + z * z),
    2 * (y * z + x * w),
    0,
    2 * (x * z + y * w),
    2 * (y * z - x * w),
    1 - 2 * (x * x + y * y),
    0,
    0,
    0,
    0,
    1,
  ];
}

function slerp(a: Quat, b: Quat, t: number): Quat {
  let d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  const bb: Quat = d < 0 ? [-b[0], -b[1], -b[2], -b[3]] : b;
  d = Math.abs(d);
  if (d > 0.9995) {
    const q = a.map((v, i) => v + (bb[i]! - v) * t) as Quat;
    const l = Math.hypot(...q);
    return q.map((v) => v / l) as Quat;
  }
  const th = Math.acos(d);
  const s0 = Math.sin((1 - t) * th) / Math.sin(th);
  const s1 = Math.sin(t * th) / Math.sin(th);
  return a.map((v, i) => v * s0 + bb[i]! * s1) as Quat;
}

const deg = (d: number) => (d * Math.PI) / 180;
const euler = (rx: number, ry: number, rz: number) =>
  quatOf(mul(R([0, 0, 1], deg(rz)), mul(R([0, 1, 0], deg(ry)), R([1, 0, 0], deg(rx)))));

const cross = (a: V3, b: V3): V3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

/** The rotation taking the folded plane's nose to `forward` and its wing tops to face `up`. */
function aim(forward: V3, up: V3): Quat {
  const F = norm(forward);
  const u0 = norm(up);
  const k = dot(u0, F);
  const U = norm([u0[0] - k * F[0], u0[1] - k * F[1], u0[2] - k * F[2]]);
  const S = cross(U, F);
  // Model axes: nose f = (0, −1, 0), top u = (−1, 0, 0), span s = (0, 0, 1). R = [F U S]·[f u s]ᵀ.
  const f: V3 = [0, -1, 0];
  const u: V3 = [-1, 0, 0];
  const s: V3 = [0, 0, 1];
  const m = I();
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++) m[c * 4 + r] = F[r]! * f[c]! + U[r]! * u[c]! + S[r]! * s[c]!;
  return quatOf(m);
}

export const POSES: Pose[] = [
  // Flat on the table, a little tilted.
  { q: euler(16, 0, -3), cx: 100, cy: 140, s: 1 },
  { q: euler(16, 0, -3), cx: 100, cy: 140, s: 1 },
  { q: euler(16, 0, -3), cx: 100, cy: 140, s: 1 },
  // Folded in half: the strip, turned a touch.
  { q: euler(10, -14, -6), cx: 84, cy: 140, s: 1 },
  // A plane, nose up and to the right, seen from a little above and behind.
  { q: aim([1, -0.22, -0.3], [0, -0.92, 0.42]), cx: 86, cy: 172, s: 1.15 },
];

export function poseAt(progress: readonly number[]): Pose {
  let pose = POSES[0]!;
  for (let i = 0; i < STEPS; i++) {
    const t = progress[i] ?? 0;
    if (t <= 0) break;
    const next = POSES[i + 1]!;
    pose = {
      q: slerp(pose.q, next.q, t),
      cx: pose.cx + (next.cx - pose.cx) * t,
      cy: pose.cy + (next.cy - pose.cy) * t,
      s: pose.s + (next.s - pose.s) * t,
    };
  }
  return pose;
}

export function poseMatrix(p: Pose): M4 {
  const sc = I();
  sc[0] = p.s;
  sc[5] = p.s;
  sc[10] = p.s;
  return mul(T(SHEET_W / 2, SHEET_H / 2), mul(sc, mul(matOf(p.q), T(-p.cx, -p.cy))));
}

/** Perspective as seen from `d` in front of the sheet's centre. */
export const PERSPECTIVE = 1100;
export const EYE: V3 = [SHEET_W / 2, SHEET_H / 2, PERSPECTIVE];
export const PROJECT: M4 = (() => {
  const p = I();
  p[11] = -1 / PERSPECTIVE;
  return mul(T(SHEET_W / 2, SHEET_H / 2), mul(p, T(-SHEET_W / 2, -SHEET_H / 2)));
})();

export { centroid, dot, norm };

/** How lit a facet's front is (0 = in shadow, 1 = facing the light), from its matrix. */
export function lightOf(m: M4): number {
  const n = norm([m[8]!, m[9]!, m[10]!]);
  const L = norm([-0.35, -0.55, 0.76]);
  return n[0] * L[0] + n[1] * L[1] + n[2] * L[2];
}

export const css = (m: M4) =>
  `matrix3d(${m.map((v) => (Math.abs(v) < 1e-9 ? 0 : Math.round(v * 1e3) / 1e3)).join(",")})`;

/** Grows a polygon a hair outward, so neighbouring facets overlap instead of showing a seam. */
function grow(pts: Pt[], by = 0.7): Pt[] {
  const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  return pts.map(([x, y]) => {
    const d = Math.hypot(x - cx, y - cy) || 1;
    return [x + ((x - cx) / d) * by, y + ((y - cy) / d) * by];
  });
}

/** The facet's polygon as a CSS clip-path, and mirrored for its reverse side. */
export const clipOf = (pts: Pt[], mirrored = false) =>
  `polygon(${grow(pts)
    .map(
      ([x, y]) =>
        `${(((mirrored ? SHEET_W - x : x) / SHEET_W) * 100).toFixed(2)}% ${((y / SHEET_H) * 100).toFixed(2)}%`,
    )
    .join(",")})`;

/** Turns a front-face matrix into its reverse: flipped about the sheet's centre line. */
export const BACK_FLIP = mul(T(SHEET_W / 2, 0), mul(R([0, 1, 0], Math.PI), T(-SHEET_W / 2, 0)));
