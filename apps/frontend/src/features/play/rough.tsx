"use client";

import rough from "roughjs";
import type { CSSProperties } from "react";
import { useMemo } from "react";
import { hashSeed, seeded } from "./paper-style";

// Hand-drawn marks. Rough.js does the wobble (seeded, so a mark draws identically on the server
// and in the browser and never jitters between renders); this file turns its drawables into plain
// SVG paths coloured with CSS variables, and gives the reusable marks: tick, star, arrow, loop,
// underline and cross-out.

type Drawable = ReturnType<ReturnType<typeof rough.generator>["line"]>;
export type RoughOptions = NonNullable<Parameters<ReturnType<typeof rough.generator>["line"]>[4]>;

const gen = rough.generator();
export { gen as roughGen };

/** One SVG path from a rough drawable: an outline stroke, a sketched fill stroke, or a solid fill. */
export type RoughPath = { d: string; kind: "stroke" | "sketch" | "solid"; width: number };

const STROKE = "S";
const FILL = "F";

/** Rough options with markers in place of colours, so each path's role can be told apart. */
export const opts = (o: RoughOptions = {}): RoughOptions => ({
  ...o,
  stroke: o.stroke === "none" ? "none" : STROKE,
  fill: o.fill ? FILL : undefined,
});

/**
 * Paths rounded to two decimals, so the server and the browser print identical markup (their
 * trig can differ in the last digits, which would break hydration).
 */
const round = (d: string) =>
  d.replace(/-?\d+\.\d{3,}/g, (n) => String(Math.round(Number(n) * 100) / 100));

export function toPaths(...drawables: Drawable[]): RoughPath[] {
  return drawables.flatMap((d) =>
    gen
      .toPaths(d)
      .filter((p) => p.stroke !== "none" || (p.fill && p.fill !== "none"))
      .map((p) => ({
        d: round(p.d),
        kind: p.stroke === STROKE ? "stroke" : p.stroke === FILL ? "sketch" : "solid",
        width: p.strokeWidth,
      })),
  );
}

/**
 * Renders rough paths. `stroke` and `fill` are CSS colours (variables are fine). With `draw`, each
 * stroke draws itself on like a pen moving, one after another (skipped for reduced motion).
 */
export function RoughPaths({
  paths,
  stroke = "currentColor",
  fill = stroke,
  draw = false,
  duration = 0.5,
  delay = 0,
  scaleStroke = false,
}: {
  paths: RoughPath[];
  stroke?: string;
  fill?: string;
  draw?: boolean;
  duration?: number;
  delay?: number;
  /** Let stroke width scale with the viewBox (default: widths stay in screen pixels). */
  scaleStroke?: boolean;
}) {
  const strokes = paths.filter((p) => p.kind !== "solid").length || 1;
  let i = 0;
  return (
    <>
      {paths.map((p, k) => {
        if (p.kind === "solid") {
          return <path key={k} d={p.d} style={{ fill, stroke: "none" }} />;
        }
        const step = i++;
        const style: CSSProperties = {
          stroke: p.kind === "stroke" ? stroke : fill,
          strokeWidth: p.width,
          fill: "none",
        };
        if (draw) {
          (style as Record<string, string | number>)["--pl-draw-dur"] = `${duration / strokes}s`;
          (style as Record<string, string | number>)["--pl-draw-delay"] =
            `${delay + (duration / strokes) * step}s`;
        }
        return (
          <path
            key={k}
            d={p.d}
            pathLength={draw ? 1 : undefined}
            className={draw ? "pl-draw" : undefined}
            vectorEffect={scaleStroke ? undefined : "non-scaling-stroke"}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={style}
          />
        );
      })}
    </>
  );
}

type MarkProps = {
  seed?: string | number;
  className?: string;
  style?: CSSProperties;
  /** Draw the mark on as it appears. */
  draw?: boolean;
  delay?: number;
  /** A label for screen readers; marks are decorative (hidden) without one. */
  label?: string;
};

function MarkSvg({
  viewBox,
  paths,
  className,
  style,
  draw,
  delay,
  duration,
  label,
  fill,
  stretch,
}: {
  viewBox: string;
  paths: RoughPath[];
  duration?: number;
  fill?: string;
  stretch?: boolean;
} & Omit<MarkProps, "seed">) {
  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio={stretch ? "none" : undefined}
      className={`pl-mark ${className ?? ""}`}
      style={style}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      overflow="visible"
    >
      <RoughPaths paths={paths} draw={draw} delay={delay} duration={duration} fill={fill} />
    </svg>
  );
}

const seedOf = (s: string | number | undefined, kind: string) => hashSeed(kind, s ?? 0);

/** A teacher's tick: a short down-stroke and a long flick up, drawn twice over like a real pencil. */
export function Tick({ seed, ...rest }: MarkProps) {
  const paths = useMemo(() => {
    const r = seeded(seedOf(seed, "tick"));
    const j = (n: number) => (r() - 0.5) * n;
    return toPaths(
      gen.curve(
        [
          [6 + j(2), 30 + j(3)],
          [14 + j(2), 38 + j(2)],
          [20 + j(2), 46 + j(2)],
          [32 + j(3), 24 + j(3)],
          [46 + j(3), 6 + j(3)],
        ],
        opts({ roughness: 0.9, strokeWidth: 2.6, seed: seedOf(seed, "tick-a") }),
      ),
    );
  }, [seed]);
  return <MarkSvg viewBox="0 0 52 52" paths={paths} duration={0.45} {...rest} />;
}

/** A five-point doodle star, drawn in one looping line with the ends overshooting. */
export function Star({ seed, ...rest }: MarkProps) {
  const paths = useMemo(() => {
    const r = seeded(seedOf(seed, "star"));
    const pts: [number, number][] = [];
    const turn = (Math.PI * 4) / 5;
    const start = -Math.PI / 2 + (r() - 0.5) * 0.3;
    for (let k = 0; k <= 5; k++) {
      const a = start + turn * k;
      const rad = 22 + (r() - 0.5) * 4;
      pts.push([26 + Math.cos(a) * rad, 27 + Math.sin(a) * rad]);
    }
    const last = pts[5]!;
    pts[5] = [last[0] + 3 + r() * 3, last[1] + 2];
    return toPaths(
      gen.linearPath(pts, opts({ roughness: 1.1, strokeWidth: 2, seed: seedOf(seed, "star-a") })),
    );
  }, [seed]);
  return <MarkSvg viewBox="0 0 52 52" paths={paths} duration={0.7} {...rest} />;
}

/**
 * A hand-drawn arrow along a path of points (in the given viewBox), with a two-stroke head at the
 * last point.
 */
export function Arrow({
  seed,
  points,
  viewBox,
  head = 10,
  ...rest
}: MarkProps & { points: [number, number][]; viewBox: string; head?: number }) {
  const key = JSON.stringify(points);
  const paths = useMemo(() => {
    const pts = JSON.parse(key) as [number, number][];
    const s = seedOf(seed, "arrow");
    const a = pts.at(-2) ?? pts[0]!;
    const b = pts.at(-1)!;
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    const wing = (d: number): [number, number] => [
      b[0] - Math.cos(ang + d) * head,
      b[1] - Math.sin(ang + d) * head,
    ];
    return toPaths(
      gen.curve(pts, opts({ roughness: 1, strokeWidth: 2, bowing: 2, seed: s })),
      gen.line(...b, ...wing(0.5), opts({ roughness: 0.8, strokeWidth: 2, seed: s + 1 })),
      gen.line(...b, ...wing(-0.55), opts({ roughness: 0.8, strokeWidth: 2, seed: s + 2 })),
    );
  }, [key, seed, head]);
  return <MarkSvg viewBox={viewBox} paths={paths} duration={0.9} {...rest} />;
}

/** A loose circle drawn round something, overshooting where the pencil comes back round. */
export function Loop({ seed, ...rest }: MarkProps) {
  const paths = useMemo(() => toPaths(loop(50, 20, 46, 17, seedOf(seed, "loop"), 2)), [seed]);
  return <MarkSvg viewBox="0 0 100 40" paths={paths} duration={0.6} {...rest} />;
}

/** A pencil underline, slightly bowed and a touch uneven. */
export function Underline({ seed, ...rest }: MarkProps) {
  const paths = useMemo(() => {
    const r = seeded(seedOf(seed, "under"));
    return toPaths(
      gen.curve(
        [
          [2, 6 + r() * 2],
          [50, 4 + r() * 3],
          [98, 5 + r() * 3],
        ],
        opts({ roughness: 0.7, strokeWidth: 1.6, bowing: 1, seed: seedOf(seed, "under-a") }),
      ),
    );
  }, [seed]);
  return <MarkSvg viewBox="0 0 100 10" paths={paths} duration={0.35} stretch {...rest} />;
}

/** A quick single pencil strike through a word. */
export function CrossOut({ seed, ...rest }: MarkProps) {
  const paths = useMemo(() => {
    const r = seeded(seedOf(seed, "cross"));
    return toPaths(
      gen.line(
        1,
        6 + r() * 2,
        99,
        4 + r() * 3,
        opts({ roughness: 1.2, strokeWidth: 1.5, seed: seedOf(seed, "cross-a") }),
      ),
    );
  }, [seed]);
  return (
    <svg
      viewBox="0 0 100 10"
      preserveAspectRatio="none"
      className={`pl-mark ${rest.className ?? ""}`}
      style={rest.style}
      aria-hidden
      focusable="false"
      overflow="visible"
    >
      <RoughPaths paths={paths} draw={rest.draw} delay={rest.delay} duration={0.3} />
    </svg>
  );
}

/**
 * The points of a hand-drawn loop round an ellipse centred on (cx, cy): it starts a little off,
 * wanders in and out, and goes past where it began, as a hand does.
 */
export function loopPoints(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  seed: number,
  rotate = 0,
): [number, number][] {
  const r = seeded(seed);
  const n = 22;
  const start = -Math.PI * 0.75 + (r() - 0.5) * 0.6;
  const sweep = Math.PI * 2 * (1.12 + r() * 0.08);
  const pts: [number, number][] = [];
  let drift = 0;
  for (let k = 0; k <= n; k++) {
    const t = start + (sweep * k) / n;
    drift += (r() - 0.5) * 0.05;
    const grow = 1 + drift + (k / n) * 0.06;
    const x = Math.cos(t) * rx * grow;
    const y = Math.sin(t) * ry * grow;
    pts.push([
      cx + x * Math.cos(rotate) - y * Math.sin(rotate),
      cy + x * Math.sin(rotate) + y * Math.cos(rotate),
    ]);
  }
  return pts;
}

export function loop(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  seed: number,
  strokeWidth = 2,
  rotate = 0,
) {
  return gen.curve(
    loopPoints(cx, cy, rx, ry, seed, rotate),
    opts({ roughness: 0.6, strokeWidth, seed, curveTightness: 0.1 }),
  );
}
