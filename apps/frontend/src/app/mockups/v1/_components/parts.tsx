import Image from "next/image";
import type { ReactNode } from "react";
import { edition } from "@/app/mockups/_data/sample-edition";
import { type Photo, unsplash } from "@/app/mockups/_data/photos";

export const DATE_SHORT = "Wed 30 Sep 2026";

/** Lets a hand mark stretch to its box, for a swipe or a ring drawn to fit a word. */
export const STRETCH = { maskSize: "100% 100%", WebkitMaskSize: "100% 100%" } as const;

/** A full-width zigzag rule, optionally carrying one small hand-lettered word in the middle. */
export function Zigzag({ word }: { word?: string }) {
  return (
    <div className="yn-zigzag" role="separator" aria-hidden={word ? undefined : true}>
      {word ? <span>{word}</span> : null}
    </div>
  );
}

/**
 * The inside-page masthead: the front page's three-cell row, shrunk. The page number sits on a
 * worn fluoro block, the section name takes the wordmark's place, and the date is set as a
 * dateline rather than a table. The sample-edition stamp is pressed on over the corner.
 */
export function RunningHead({
  page,
  section,
  tagline,
}: {
  page: number;
  section: ReactNode;
  tagline: string;
}) {
  return (
    <header className="yn-run">
      <div className="yn-run-page print-worn">
        <span className="yn-hand">page</span>
        <span className="yn-fat">{page}</span>
      </div>
      <div className="yn-vrule" />
      <div className="yn-run-title">
        <p className="yn-chunk yn-run-mark">The Yay News</p>
        <h1 className="yn-chunk print-misreg yn-run-h1">{section}</h1>
        <p className="yn-hand yn-run-tag">{tagline}</p>
      </div>
      <div className="yn-vrule" />
      <div className="yn-run-date">
        <p className="yn-chunk">Wednesday</p>
        <p>30 September 2026</p>
        <p>
          Vol. {edition.volume} · No. {edition.issue} · Free
        </p>
      </div>
      <Stamp className="yn-run-stamp">
        Sample
        <br />
        edition
      </Stamp>
    </header>
  );
}

/** The folio line at the foot of every inside page. */
export function Folio({ page, section }: { page: number; section: string }) {
  return (
    <footer className="yn-folio">
      <span>
        Page {page} · The Yay News · {DATE_SHORT}
      </span>
      <span className="yn-hand">{section}</span>
      <span>Sample edition · all stories invented</span>
    </footer>
  );
}

/** A photo that fills its box, printed into the paper, with an optional corner credit tag. */
export function Photo({
  photo,
  sizes,
  position,
  className,
  tag = true,
  priority,
}: {
  photo: Photo;
  sizes: string;
  position?: string;
  className?: string;
  tag?: boolean;
  priority?: boolean;
}) {
  return (
    <div className={`yn-photo ${className ?? ""}`}>
      <Image
        src={unsplash(photo.id, 1600)}
        alt={photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        style={position ? { objectPosition: position } : undefined}
      />
      {tag ? <span className="yn-photo-tag">@theyaynews via {photo.credit}</span> : null}
    </div>
  );
}

/*
 * Five-by-seven bitmap letters, the way an arcade screen draws them. Each glyph is seven rows of
 * five cells; a "1" is an inked square. Rendered as a grid of squares so it prints like a mosaic.
 */
const GLYPHS: Record<string, string[]> = {
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  C: ["01110", "10001", "10000", "10000", "10000", "10001", "01110"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  I: ["01110", "00100", "00100", "00100", "00100", "00100", "01110"],
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  N: ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  U: ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
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
  "?": ["01110", "10001", "00001", "00010", "00100", "00000", "00100"],
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
