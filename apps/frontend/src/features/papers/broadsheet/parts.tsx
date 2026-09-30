import type { Edition, Image as EditionImage } from "@repo/shared";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Burst } from "@repo/ui/print/burst";
import { Mark } from "@repo/ui/print/mark";
import { printedPhoto } from "@repo/ui/print/photo";
import type { Reading } from "../types";
import { lastWord, longDate, shortDate, weekday } from "./lib";

/** Lets a hand mark stretch to its box, for a swipe or a ring drawn to fit a word. */
export const STRETCH = { maskSize: "100% 100%", WebkitMaskSize: "100% 100%" } as const;

/** A full-width zigzag rule, optionally carrying one small word in the middle. */
export function Zigzag({ word, className }: { word?: string; className?: string }) {
  return (
    <div
      className={`yn-zigzag ${className ?? ""}`}
      role="separator"
      aria-hidden={word ? undefined : true}
    >
      {word ? <span>{word}</span> : null}
    </div>
  );
}

/**
 * The inside-page masthead: the front page's three-cell row, shrunk. The page number sits on a
 * worn fluoro block, the section name takes the wordmark's place, and the date is set as a
 * dateline. `stamp` presses a rubber stamp over the corner (the guest section's "today only").
 */
export function RunningHead({
  edition,
  reading,
  title,
  tagline,
  stamp,
  titleAs = "h1",
}: {
  edition: Edition;
  reading: Reading;
  title: ReactNode;
  tagline: string;
  stamp?: ReactNode;
  titleAs?: "h1" | "p";
}) {
  const Title = titleAs;
  return (
    <header className="yn-run">
      <div className="yn-run-page print-worn">
        <span className="yn-hand">page</span>
        <span className="yn-fat">{reading.pages.indexOf(reading.current) + 1}</span>
      </div>
      <div className="yn-vrule" />
      <div className="yn-run-title">
        <p className="yn-chunk yn-run-mark">
          <Link href={reading.pages[0]?.href ?? "/"} className="bs-link">
            The Yay News
          </Link>
        </p>
        <Title className="yn-chunk print-misreg yn-run-h1 bs-run-h1">{title}</Title>
        <p className="yn-hand yn-run-tag">{tagline}</p>
      </div>
      <div className="yn-vrule" />
      <div className="yn-run-date">
        <p className="yn-chunk">{weekday(edition.date)}</p>
        <p>{longDate(edition.date)}</p>
        <p>
          Vol. {edition.volume} · No. {edition.issueNumber} · Free
        </p>
      </div>
      {stamp ? <Stamp className="yn-run-stamp">{stamp}</Stamp> : null}
    </header>
  );
}

/** The folio line at the foot of every inside page, with the one "next page" line. */
export function Folio({
  edition,
  reading,
  section,
}: {
  edition: Edition;
  reading: Reading;
  section: string;
}) {
  const n = reading.pages.indexOf(reading.current) + 1;
  return (
    <footer className="yn-folio">
      <span>
        Page {n} · The Yay News · {shortDate(edition.date)}
      </span>
      <span className="yn-hand">{section}</span>
      <span>
        {reading.next ? (
          <Link href={reading.next.href} className="bs-link">
            Next: {reading.next.slug === "back" ? "the back page" : reading.next.label}, p.{n + 1} →
          </Link>
        ) : (
          "The end"
        )}
      </span>
    </footer>
  );
}

/** A photo that fills its box, printed into the paper, with an optional corner credit tag. */
export function Photo({
  image,
  sizes,
  position,
  className,
  priority,
  width = 1600,
}: {
  image: EditionImage;
  sizes: string;
  position?: string;
  className?: string;
  priority?: boolean;
  width?: number;
}) {
  return (
    <div className={`yn-photo ${className ?? ""}`}>
      <Image
        src={printedPhoto(image.url, width)}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        style={position ? { objectPosition: position } : undefined}
      />
    </div>
  );
}

/**
 * A story's sticker ("Wow!", "New season") as a printer's burst. The lettering shrinks with the
 * length of the words so any sticker fits its badge.
 */
export function Sticker({
  text,
  fill = "var(--neon-yellow)",
  className,
  size = 1,
  points = 22,
  ink = "var(--ink)",
}: {
  text: string;
  fill?: string;
  /** The colour of the lettering: the type colour that reads on `fill`. */
  ink?: string;
  className?: string;
  /** Scales the lettering, for bigger or smaller badges. */
  size?: number;
  points?: number;
}) {
  const longest = Math.max(...text.split(/\s+/).map((w) => w.length), 1);
  const words = text.trim().split(/\s+/).length;
  const em = Math.min(8, 30 / Math.max(longest, 3.4), 20 / Math.max(words * 1.6, 2.6)) * size;
  return (
    <Burst fill={fill} points={points} depth={0.1} className={className}>
      <span
        className="yn-burst-text bs-burst-text"
        style={{ fontSize: `calc(var(--u) * ${em})`, color: ink }}
      >
        {text}
      </span>
    </Burst>
  );
}

/** A headline whose last word carries a ring drawn by hand, the way the mockup marks one word. */
export function Ringed({ text }: { text: string }) {
  const [head, tail] = lastWord(text);
  // A ring drawn round a long word would swamp the line; long words go unmarked.
  if (tail.replace(/[^\p{L}\p{N}]/gu, "").length > 8) return <>{text}</>;
  return (
    <>
      {head}
      <span className="fr-ringed">
        {tail}
        <Mark name="ellipse-01" className="fr-ring" style={STRETCH} />
      </span>
    </>
  );
}

/*
 * Five-by-seven bitmap letters, the way an arcade screen draws them. Each glyph is seven rows of
 * five cells; a "1" is an inked square. Rendered as a grid of squares so it prints like a mosaic.
 */
const GLYPHS: Record<string, string[]> = {
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
  C: ["01110", "10001", "10000", "10000", "10000", "10001", "01110"],
  D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  F: ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
  G: ["01110", "10001", "10000", "10111", "10001", "10001", "01111"],
  H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  I: ["01110", "00100", "00100", "00100", "00100", "00100", "01110"],
  K: ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
  N: ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  U: ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
  V: ["10001", "10001", "10001", "10001", "10001", "01010", "00100"],
  W: ["10001", "10001", "10001", "10101", "10101", "10101", "01010"],
  X: ["10001", "10001", "01010", "00100", "01010", "10001", "10001"],
  Y: ["10001", "10001", "01010", "00100", "00100", "00100", "00100"],
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  "3": ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  "5": ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
  "6": ["00110", "01000", "10000", "11110", "10001", "10001", "01110"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  "9": ["01110", "10001", "10001", "01111", "00001", "00010", "01100"],
  "-": ["00000", "00000", "00000", "11111", "00000", "00000", "00000"],
  ".": ["000", "000", "000", "000", "000", "000", "010"],
  "?": ["01110", "10001", "00001", "00010", "00100", "00000", "00100"],
  "!": ["010", "010", "010", "010", "010", "000", "010"],
  " ": ["000", "000", "000", "000", "000", "000", "000"],
};

export function PixelText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={`yn-pixel ${className ?? ""}`} role="img" aria-label={text}>
      {[...text.toUpperCase()].map((ch, i) => {
        const rows = GLYPHS[ch] ?? GLYPHS[" "] ?? [];
        const cols = rows[0]?.length ?? 5;
        return (
          <span
            key={`${ch}-${i}`}
            className="yn-pixel-glyph"
            style={{ gridTemplateColumns: `repeat(${cols}, var(--px))` }}
            aria-hidden
          >
            {rows.flatMap((row, r) =>
              [...row].map((bit, c) => (
                <span key={`${r}-${c}`} className={bit === "1" ? "on" : undefined} />
              )),
            )}
          </span>
        );
      })}
    </span>
  );
}

/**
 * A rubber stamp: ruled border, chunky capitals, ink that didn't take evenly. Tilt and place it
 * where it's used; it should look pressed on by hand, never centred.
 */
export function Stamp({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`yn-stamp print-worn ${className ?? ""}`}>
      <span className="yn-chunk">{children}</span>
    </div>
  );
}

// Bar widths for the cover-price barcode, fixed so it prints identically every time.
const BARS = "2113121412211132114123112213121131241121321131";

/** The cover-price barcode box every news-stand paper carries. Purely decorative. */
export function Barcode() {
  return (
    <div className="yn-barcode" aria-hidden>
      {[...BARS].map((w, i) => (
        <span
          key={`${w}-${i}`}
          style={{ width: `calc(var(--u) * ${Number(w) * 0.32})`, opacity: i % 2 ? 0 : 1 }}
        />
      ))}
    </div>
  );
}

/** Body paragraphs. */
export function Body({
  paragraphs,
  className,
  dateline,
}: {
  paragraphs: string[];
  className?: string;
  dateline?: string;
}) {
  return (
    <div className={`yn-body ${className ?? ""}`}>
      {paragraphs.map((p, i) => (
        <p key={i}>
          {i === 0 && dateline ? <span className="yn-dateline">{dateline} — </span> : null}
          {p}
        </p>
      ))}
    </div>
  );
}

/** The line a story carries in this paper: where it came from. */
export const byline = (s: { sourceName: string }) => `From ${s.sourceName}`;
