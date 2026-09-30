"use client";

import type { CSSProperties, ElementType } from "react";
import { hashSeed, seeded } from "./paper-style";

/** How a single pencilled letter sits: every one leans, drifts and presses a little differently. */
export function letterStyle(seed: number, amount = 1): CSSProperties {
  const r = seeded(seed);
  return {
    "--pl-rot": `${(r() - 0.5) * 9 * amount}deg`,
    "--pl-dx": `${(r() - 0.5) * 0.09 * amount}em`,
    "--pl-dy": `${(r() - 0.5) * 0.1 * amount}em`,
    "--pl-press": (0.8 + r() * 0.2).toFixed(2),
    "--pl-scale": (0.94 + r() * 0.12).toFixed(3),
  } as CSSProperties;
}

/** One letter written in pencil. `seed` fixes its lean and pressure. */
export function PencilLetter({
  char,
  seed,
  className,
  style,
}: {
  char: string;
  seed: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span className={`pl-letter ${className ?? ""}`} style={{ ...letterStyle(seed), ...style }}>
      {char}
    </span>
  );
}

/**
 * Text written by hand in pencil: the handwriting face, graphite grain, and each letter set at its
 * own slight angle and pressure. Words stay together so it wraps like writing does. Screen readers
 * get the plain text.
 */
export function Pencil({
  children,
  seed = 0,
  as: Tag = "span",
  className,
  style,
  wobble = 1,
}: {
  children: string;
  seed?: string | number;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  /** How much each letter wanders (0 = none, 1 = normal). */
  wobble?: number;
}) {
  const words = children.split(/(\s+)/);
  let i = 0;
  return (
    <Tag className={`pl-pencil ${className ?? ""}`} style={style}>
      <span className="pl-sr">{children}</span>
      <span aria-hidden>
        {words.map((w, wi) =>
          /^\s+$/.test(w) ? (
            " "
          ) : (
            <span key={wi} className="pl-word">
              {[...w].map((ch) => {
                const k = i++;
                return (
                  <span
                    key={k}
                    className="pl-letter"
                    style={letterStyle(hashSeed(seed, k, ch), wobble)}
                  >
                    {ch}
                  </span>
                );
              })}
            </span>
          ),
        )}
      </span>
    </Tag>
  );
}

/**
 * SVG filters the marks use: graphite grain for pencil and a waxy edge for the marker. Every
 * puzzle renders a copy (the definitions are identical, so whichever the browser finds first is
 * used), which keeps each component self-contained when a design embeds just one.
 */
export function PlayDefs() {
  return (
    <svg aria-hidden width="0" height="0" className="pl-defs" focusable="false">
      <defs>
        <filter id="pl-graphite" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.35"
            numOctaves="2"
            seed="7"
            result="grain"
          />
          <feColorMatrix
            in="grain"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2.4 0 0 0 -0.45"
            result="tooth"
          />
          <feComposite in="SourceGraphic" in2="tooth" operator="in" result="grained" />
          <feDisplacementMap
            in="grained"
            in2="grain"
            scale="0.9"
            xChannelSelector="G"
            yChannelSelector="B"
          />
        </filter>
        <filter id="pl-marker" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.08 0.6"
            numOctaves="2"
            seed="3"
            result="streak"
          />
          <feColorMatrix
            in="streak"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.9 0 0 0 0.35"
            result="wet"
          />
          <feComposite in="SourceGraphic" in2="wet" operator="in" />
        </filter>
      </defs>
    </svg>
  );
}

/** A visually hidden live region: puzzles announce what happened (a word found, solved…). */
export function Announcer({ message }: { message: string }) {
  return (
    <p className="pl-sr" role="status" aria-live="polite">
      {message}
    </p>
  );
}
