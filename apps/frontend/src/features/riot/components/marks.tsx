import type { CSSProperties } from "react";
import { arrowStrokes, loopPoints, pressureStroke } from "../tokens/stroke";
import { rand, r1 } from "../tokens/seed";
import "../riot.css";

// Hand-drawn marks in marker: pressure-varied filled strokes that overshoot and wobble. A few per
// screen at most (one ring round where you are, one arrow to the thing to do).

type Ink = "a" | "b" | "k";

/**
 * A marker loop drawn round its positioned parent (the active nav item, the answer). Decorative;
 * say the state in words too (aria-current, "you are here").
 */
export function MarkerCircle({
  seed,
  ink = "k",
  aspect = 2.4,
  width = 5,
  className,
  style,
}: {
  seed: string;
  ink?: Ink;
  /** Width ÷ height of what it rings, so the stroke keeps its weight. */
  aspect?: number;
  width?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const h = 100;
  const w = r1(h * aspect);
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      overflow="visible"
      className={`rt-ring rt-ink--${ink} ${className ?? ""}`}
      style={style}
    >
      <path d={pressureStroke(loopPoints(w, h, seed), { width, seed, tip: 0.18, peak: 0.4 })} />
    </svg>
  );
}

/** A marker arrow along `points` (in a `w` × `h` box), pointing at the last point. */
export function HandArrow({
  seed,
  points,
  w,
  h,
  ink = "k",
  width = 3.6,
  head = 12,
  className,
  style,
}: {
  seed: string;
  points: [number, number][];
  w: number;
  h: number;
  ink?: Ink;
  width?: number;
  head?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox={`0 0 ${w} ${h}`}
      overflow="visible"
      className={`rt-mark rt-ink--${ink} ${className ?? ""}`}
      style={style}
    >
      {arrowStrokes(points, seed, head, width).map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

/** A quick marker underline, a touch bowed, stretched to its parent's width. */
export function MarkerUnderline({
  seed,
  ink = "a",
  width = 7,
  className,
  style,
}: {
  seed: string;
  ink?: Ink;
  width?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const r = rand(`under:${seed}`);
  const pts: [number, number][] = [
    [2, 12 + r() * 3],
    [70, 9 + r() * 4],
    [140, 10 + r() * 3],
    [204, 7 + r() * 4],
  ];
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox="0 0 206 20"
      preserveAspectRatio="none"
      overflow="visible"
      className={`rt-underline rt-ink--${ink} ${className ?? ""}`}
      style={style}
    >
      <path d={pressureStroke(pts, { width, seed, tip: 0.3, peak: 0.3 })} />
    </svg>
  );
}
