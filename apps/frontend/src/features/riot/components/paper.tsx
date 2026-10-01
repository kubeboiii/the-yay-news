import type { CSSProperties, ReactNode } from "react";
import { type Edge, edgePath, type Side } from "../tokens/edges";
import { type Fade, halftonePath } from "../tokens/halftone";
import { rand, r1, tilt as seededTilt } from "../tokens/seed";
import "../riot.css";

// The cut-and-paste parts. Rules of the kit: most things sit straight; one or two hero pieces on
// a screen are tilted; nothing casts a drop shadow (paper shows its layers by overlapping, by its
// edges and by tape). Grounds are the paper, one of the two plates, their overprint, or black.

export type Ground = "paper" | "white" | "a" | "b" | "over" | "ink";

/** A piece of paper: guillotine-cut unless told otherwise, straight unless told otherwise. */
export function Scrap({
  children,
  seed,
  ground = "paper",
  edge = "cut",
  sides,
  tape,
  tilt = 0,
  as: Tag = "div",
  className,
  style,
}: {
  children: ReactNode;
  seed: string;
  ground?: Ground;
  edge?: Edge;
  /** Which sides the edge applies to (torn/deckle/zigzag); defaults to all four. */
  sides?: readonly Side[];
  /** Masking tape holding it on. */
  tape?: TapeAt | readonly TapeAt[];
  /** Degrees. Reserve for one or two hero pieces per screen. */
  tilt?: number;
  as?: "div" | "p" | "figure" | "aside" | "li";
  className?: string;
  style?: CSSProperties;
}) {
  const tapes = tape ? (Array.isArray(tape) ? tape : [tape]) : [];
  return (
    <Tag
      className={`rt-scrap rt-on--${ground} ${className ?? ""}`}
      style={{ rotate: tilt ? `${tilt}deg` : undefined, ...style }}
    >
      <span
        className={`rt-scrap__sheet rt-g--${ground}`}
        aria-hidden
        style={{ clipPath: edgePath(edge, seed, sides) }}
      />
      <div className="rt-scrap__body">{children}</div>
      {tapes.map((t) => (
        <Tape key={t} at={t} seed={`${seed}-${t}`} />
      ))}
    </Tag>
  );
}

export type TapeAt = "top" | "top-left" | "top-right" | "bottom-left" | "bottom-right";

/** A strip of masking tape: translucent, torn at both ends, laid on a little crooked. */
export function Tape({
  at = "top",
  seed,
  className,
  style,
}: {
  at?: TapeAt;
  seed: string;
  className?: string;
  style?: CSSProperties;
}) {
  const r = rand(`tape:${seed}`);
  const base = at === "top" ? 0 : at === "top-left" || at === "bottom-right" ? -38 : 38;
  const end = () => r1(r() * 9);
  return (
    <span
      aria-hidden
      className={`rt-tape rt-tape--${at} ${className ?? ""}`}
      style={{
        rotate: `${r1(base + (r() - 0.5) * 8)}deg`,
        clipPath: `polygon(${end()}% 0, ${100 - end()}% 4%, 100% ${30 + end()}%, ${96 - end()}% 100%, ${end()}% 96%, 0 ${50 + end()}%)`,
        ...style,
      }}
    />
  );
}

/** A heading in the kit's one condensed face. Set straight and tight; size from the caller. */
export function Heading({
  children,
  as: Tag = "h2",
  id,
  className,
  style,
}: {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "p";
  id?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <Tag id={id} className={`rt-heading ${className ?? ""}`} style={style}>
      {children}
    </Tag>
  );
}

/**
 * A sticker slapped on. Allow one or two per screen, and each must say something true or be a
 * real joke. `pinned` positions it absolutely (place it with a class).
 */
export function Sticker({
  children,
  seed,
  ground = "a",
  shape = "rect",
  tilt,
  pinned,
  className,
  style,
}: {
  children: ReactNode;
  seed: string;
  ground?: Exclude<Ground, "white">;
  shape?: "rect" | "circle" | "burst";
  /** Degrees; defaults to a seeded slap of up to ±7°. */
  tilt?: number;
  pinned?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      className={`rt-sticker rt-sticker--${shape} rt-g--${ground} ${pinned ? "rt-sticker--pinned" : ""} ${className ?? ""}`}
      style={{ rotate: `${tilt ?? seededTilt(`sticker:${seed}`, 7)}deg`, ...style }}
    >
      {children}
    </span>
  );
}

/**
 * A halftone screen in one plate, fading by tone. Absolutely fills its positioned parent unless a
 * class places it; multiplies with what's under it, as a second pass on the drum would.
 */
export function Halftone({
  seed,
  fade = "corner",
  ink = "b",
  density,
  pitch,
  angle,
  w = 640,
  h = 440,
  className,
  style,
}: {
  seed: string;
  fade?: Fade;
  ink?: "a" | "b" | "k";
  density?: number;
  pitch?: number;
  angle?: number;
  /** The screen's own box in px (dots are `pitch` apart in it); it's scaled to cover, so pass
   * roughly the size it prints at. */
  w?: number;
  h?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="xMidYMid slice"
      className={`rt-halftone rt-ink--${ink} ${className ?? ""}`}
      style={style}
    >
      <path d={halftonePath({ w, h, pitch, angle, fade, density, seed })} fill="currentColor" />
    </svg>
  );
}

/**
 * Big type printed twice, the second plate slipped 1–3px on the drum. For one or two large
 * elements per screen only.
 */
export function Misprint({
  children,
  as: Tag = "span",
  ink = "b",
  offset = [3, 2],
  className,
  style,
}: {
  children: string | number;
  as?: "span" | "p" | "strong";
  ink?: "a" | "b";
  offset?: [number, number];
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <Tag
      className={`rt-misprint rt-ink--${ink} ${className ?? ""}`}
      data-text={children}
      style={
        { "--rt-mx": `${offset[0]}px`, "--rt-my": `${offset[1]}px`, ...style } as CSSProperties
      }
    >
      {children}
    </Tag>
  );
}

/** A rubber stamp, inked unevenly. Decorative by default (say it in words nearby). */
export function RubberStamp({
  children,
  seed,
  ink = "k",
  tilt,
  decorative = true,
  className,
  style,
}: {
  children: ReactNode;
  seed: string;
  ink?: "k" | "a" | "b";
  tilt?: number;
  decorative?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      aria-hidden={decorative || undefined}
      className={`rt-stamp rt-ink--${ink} ${className ?? ""}`}
      style={{ rotate: `${tilt ?? seededTilt(`stamp:${seed}`, 14)}deg`, ...style }}
    >
      {children}
    </span>
  );
}
