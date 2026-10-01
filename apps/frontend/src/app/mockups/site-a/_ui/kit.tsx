import type { CSSProperties, ReactNode } from "react";
import { tilt, torn } from "@/app/mockups/site-a/_shared/hand";

// Direction A's physical bits: washi tape, die-cut vinyl stickers, rubber stamps, kraft
// cardboard. Every one is a real-world object with a real-world rule (tape holds a corner,
// a sticker has a white die-cut margin, a stamp is inked unevenly and never quite straight).

export function Tape({
  ink = "var(--sa-s1)",
  className,
  style,
}: {
  ink?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      aria-hidden
      className={`sa-tape ${className ?? ""}`}
      style={{ "--tape": ink, ...style } as CSSProperties}
    />
  );
}

export function Sticker({
  children,
  shape = "round",
  ink,
  seed,
  className,
  style,
}: {
  children: ReactNode;
  shape?: "round" | "rect" | "burst" | "blob";
  ink: string;
  seed: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      className={`sa-sticker sa-sticker--${shape} ${className ?? ""}`}
      style={{ "--st": ink, rotate: `${tilt(seed, 9)}deg`, ...style } as CSSProperties}
    >
      <span className="sa-sticker__face">{children}</span>
    </span>
  );
}

/** A rubber stamp, inked a little unevenly. */
export function Stamp({
  children,
  ink = "var(--sa-l1)",
  seed,
  className,
  style,
}: {
  children: ReactNode;
  ink?: string;
  seed: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      className={`sa-stamp ${className ?? ""}`}
      style={{ "--ink": ink, rotate: `${tilt(seed, 8)}deg`, ...style } as CSSProperties}
    >
      {children}
    </span>
  );
}

/** A torn piece of kraft cardboard with a marker note on it. */
export function Kraft({
  children,
  seed,
  className,
  style,
}: {
  children: ReactNode;
  seed: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`sa-kraft ${className ?? ""}`}
      style={{ rotate: `${tilt(seed, 2.4)}deg`, ...style }}
    >
      <div
        className="sa-kraft__board"
        style={{ clipPath: torn(seed, ["top", "right", "bottom", "left"], 5, 30) }}
      />
      <div className="sa-kraft__text">{children}</div>
    </div>
  );
}
