import Image from "next/image";
import type { ReactNode } from "react";
import type { Photo as PhotoData } from "@/app/mockups/_data/photos";
import { unsplash } from "@/app/mockups/_data/photos";

export const FOLIO_DATE = "Tue 30 Sep 2026";

/** The printed sheet itself: a bright-white tabloid page with its section's two inks. */
export function Sheet({
  theme,
  children,
}: {
  theme: "front" | "screen" | "gaming" | "back";
  children: ReactNode;
}) {
  return (
    <main className="print-desk tb-desk">
      <div className="print-sheet-wrap tb-wrap">
        <article lang="en" className={`print-sheet print-sheet--bright tb-sheet tb-theme-${theme}`}>
          {children}
        </article>
      </div>
    </main>
  );
}

/**
 * The masthead band every page shares: a screaming wordmark on the left, the small spec table and
 * the coloured number box on the right, exactly where the printer's sample puts its paper spec.
 */
export function Masthead({
  eyebrow,
  title,
  titleClass,
  specTitle,
  spec,
  aside,
  box,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  titleClass?: string;
  specTitle?: ReactNode;
  spec?: [string, string][];
  aside?: ReactNode;
  box: ReactNode;
}) {
  return (
    <header className="tb-mast">
      <div className="tb-mast-left">
        {eyebrow ? <div className="tb-eyebrow">{eyebrow}</div> : null}
        <h1 className={`tb-mast-title ${titleClass ?? ""}`}>{title}</h1>
      </div>
      <div className="tb-mast-right">
        {spec ? (
          <div className="tb-spec">
            <div className="tb-spec-title">{specTitle}</div>
            <dl>
              {spec.map(([k, v]) => (
                <div key={k} className="tb-spec-row">
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}
        {aside ? <div className="tb-mast-aside">{aside}</div> : null}
        <div className="tb-box print-worn">{box}</div>
      </div>
    </header>
  );
}

/** A strip of masking tape laid over whatever it is pinning down. */
export function Tape({ className }: { className?: string }) {
  return <span className={`print-tape ${className ?? ""}`} aria-hidden />;
}

/** A rubber stamp: ink that did not take evenly, pressed down at a slight angle. */
export function Stamp({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`tb-stamp print-worn ${className ?? ""}`} aria-hidden>
      {children}
    </div>
  );
}

// Bar widths for a price-box barcode, fixed so the code prints the same on every render.
const BARCODE = [
  2, 1, 1, 3, 1, 2, 1, 1, 2, 3, 1, 1, 2, 1, 3, 1, 2, 2, 1, 1, 3, 1, 1, 2, 1, 2, 1, 3, 1, 1, 2, 1,
];

export function Barcode({ className }: { className?: string }) {
  return (
    <span className={`tb-barcode ${className ?? ""}`} aria-hidden>
      {BARCODE.map((w, i) => (
        <i key={i} style={{ flexGrow: w, opacity: i % 2 === 0 ? 1 : 0 }} />
      ))}
    </span>
  );
}

/** The small wordmark that carries the paper's name onto a section page. */
export function MiniMark({ section, page }: { section: string; page: number }) {
  return (
    <>
      <span className="tb-minimark">The Yay News</span>
      <span className="tb-eyebrow-meta">
        Section {page} · {section} · {FOLIO_DATE}
      </span>
    </>
  );
}

/** A photograph printed onto the stock, with a credit set in the corner the way the sample does. */
export function Photo({
  photo,
  sizes,
  className,
  position,
  priority,
  creditSide = "right",
  children,
}: {
  photo: PhotoData;
  sizes: string;
  className?: string;
  position?: string;
  priority?: boolean;
  creditSide?: "left" | "right";
  children?: ReactNode;
}) {
  return (
    <figure className={`tb-photo ${className ?? ""}`}>
      <Image
        src={unsplash(photo.id, 1600)}
        alt={photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="print-photo object-cover"
        style={position ? { objectPosition: position } : undefined}
      />
      {children}
      <figcaption className={`tb-credit tb-credit-${creditSide}`}>
        Photo: {photo.credit} · unsplash.com
      </figcaption>
    </figure>
  );
}

/** Headline words set on highlighter bars, one bar per printed line. */
export function Bars({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={`tb-bars ${className ?? ""}`}>
      <span>{children}</span>
    </span>
  );
}

export function Folio({ page, section }: { page: number; section: string }) {
  return (
    <footer className="tb-folio">
      <span>
        Page {page} · The Yay News · {FOLIO_DATE}
      </span>
      <span className="tb-folio-mid">{section}</span>
      <span>Sample edition · printed on bright white · @theyaynews</span>
    </footer>
  );
}

// A 3 × 5 bitmap font, so pixel lettering is built from printed squares rather than drawn.
const GLYPHS: Record<string, string[]> = {
  "0": ["###", "#.#", "#.#", "#.#", "###"],
  "1": [".#.", "##.", ".#.", ".#.", "###"],
  "2": ["###", "..#", "###", "#..", "###"],
  "3": ["###", "..#", ".##", "..#", "###"],
  "4": ["#.#", "#.#", "###", "..#", "..#"],
  "5": ["###", "#..", "###", "..#", "###"],
  "6": ["###", "#..", "###", "#.#", "###"],
  "7": ["###", "..#", ".#.", ".#.", ".#."],
  "8": ["###", "#.#", "###", "#.#", "###"],
  "9": ["###", "#.#", "###", "..#", "###"],
  U: ["#.#", "#.#", "#.#", "#.#", "###"],
  P: ["###", "#.#", "###", "#..", "#.."],
  H: ["#.#", "#.#", "###", "#.#", "#.#"],
  I: ["###", ".#.", ".#.", ".#.", "###"],
  ",": ["...", "...", "...", ".#.", "#.."],
  " ": ["...", "...", "...", "...", "..."],
};

/** Pixel lettering: every lit cell is one inked square in a CSS grid. */
export function PixelType({ text, className }: { text: string; className?: string }) {
  const chars = text.split("");
  return (
    <span className={`tb-pixels ${className ?? ""}`} role="img" aria-label={text}>
      {chars.map((ch, ci) => {
        const g = GLYPHS[ch] ?? GLYPHS[" "]!;
        return (
          <span key={`${ch}-${ci}`} className="tb-glyph" aria-hidden>
            {g.flatMap((row, r) =>
              row
                .split("")
                .map((cell, c) => <i key={`${r}-${c}`} className={cell === "#" ? "on" : ""} />),
            )}
          </span>
        );
      })}
    </span>
  );
}
