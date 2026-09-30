import type { Image as ImageData, StoryItem } from "@repo/shared";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Burst } from "@repo/ui/print/burst";
import { printedPhoto } from "@repo/ui/print/photo";
import { FillPlates } from "../plates";
import { longestWord } from "./edition-data";

export type Theme = "front" | "screen" | "play" | "back";

/** Sections that always lead with one plate: Music on orange, Startups on blue. */
const LEAD: Record<string, Theme> = { music: "front", startups: "screen" };

/** The plates a theme leads with: orange-led pages, or blue-led ones. */
export const themeFor = (order: number, slug = ""): Theme =>
  LEAD[slug] ?? (order % 2 === 0 ? "screen" : "front");

/**
 * The printed sheet: a bright-white tabloid page in its section's two inks. `cut` is a story
 * clipped out of the paper, which is only as long as the story.
 */
export function Sheet({
  theme,
  cut,
  label,
  children,
}: {
  theme: Theme;
  cut?: boolean;
  label?: string;
  children: ReactNode;
}) {
  return (
    <div className="print-sheet-wrap tb-wrap">
      <article
        lang="en"
        aria-label={label}
        className={`print-sheet print-sheet--bright tb-sheet tb-theme-${theme} ${cut ? "tb-sheet--cut" : ""}`}
      >
        {children}
      </article>
    </div>
  );
}

/**
 * A type size (in sheet millimetres) that sets `text` on `lines` lines of `measure` mm without
 * breaking a word: `em` is the average advance of one character in ems for the face.
 */
export function fit(
  text: string,
  {
    max,
    min,
    measure,
    lines = 1,
    em = 0.62,
  }: {
    max: number;
    min: number;
    measure: number;
    lines?: number;
    em?: number;
  },
) {
  const chars = [...text].length;
  const byLength = (measure * lines) / (chars * em * 1.08);
  const byWord = measure / (Math.max(longestWord(text), 1) * em * 1.05);
  return Math.max(min, Math.min(max, byLength, byWord));
}

const sizeVar = (name: string, u: number) => ({ [name]: `calc(var(--u) * ${u.toFixed(2)})` });

/**
 * The masthead band every page shares: a screaming wordmark on the left, the small spec table or
 * a short aside, and the coloured box on the right, where the printer's sample puts its spec.
 */
export function Masthead({
  eyebrow,
  title,
  titleClass,
  specTitle,
  spec,
  aside,
  box,
  size,
}: {
  eyebrow?: ReactNode;
  title: string;
  titleClass?: string;
  specTitle?: ReactNode;
  spec?: [string, string][];
  aside?: ReactNode;
  box: ReactNode;
  /** Size the title to fit its column: the column's width on the sheet, in mm. */
  size?: { measure: number; max: number };
}) {
  const style = size
    ? ({
        ...sizeVar(
          "--mast-fs",
          fit(title, {
            max: size.max,
            min: 8,
            measure: size.measure,
            lines: [...title].length > 18 ? 2 : 1,
            em: 0.66,
          }),
        ),
        ...sizeVar(
          "--mast-fs-phone",
          fit(title, { max: 22, min: 9, measure: 138, lines: 3, em: 0.7 }),
        ),
      } as CSSProperties)
    : undefined;
  return (
    <header className="tb-mast">
      <div className="tb-mast-left">
        {eyebrow ? <div className="tb-eyebrow">{eyebrow}</div> : null}
        <h1
          className={`tb-mast-title ${size ? "tb-mast-title--fit" : ""} ${titleClass ?? ""}`}
          style={style}
        >
          {title}
        </h1>
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

/** The small wordmark that carries the paper's name onto an inside page. */
export function MiniMark({
  href,
  children,
}: {
  href: string;
  /** The page's line: "Page 2 · Screen · Sat 26 Sept 2026". */
  children: ReactNode;
}) {
  return (
    <>
      <Link href={href} className="tb-minimark">
        The Yay News
      </Link>
      <span className="tb-eyebrow-meta">{children}</span>
    </>
  );
}

/**
 * The one credit the paper prints: on a story's own page, for a picture taken from a real
 * article. Pool and sample pictures carry their credit in their metadata only.
 */
export const printedCredit = (image: ImageData) =>
  image.licence === "Credited to its source" ? `Image: ${image.credit}` : null;

/** A photograph printed onto the stock. */
export function Photo({
  image,
  sizes,
  width = 1600,
  className,
  position,
  priority,
  children,
  plates,
}: {
  image: ImageData;
  sizes: string;
  width?: number;
  className?: string;
  position?: string;
  priority?: boolean;
  children?: ReactNode;
  /** A story with more than one picture prints them all, as a group, in the photo's place. */
  plates?: Pick<StoryItem, "slug" | "images">;
}) {
  if (plates && plates.images.length > 1) {
    return (
      <figure className={`tb-photo tb-photo--plates ${className ?? ""}`}>
        <FillPlates story={plates} sizes={sizes} priority={priority} />
        {children}
      </figure>
    );
  }
  return (
    <figure className={`tb-photo ${className ?? ""}`}>
      <Image
        src={printedPhoto(image.url, width)}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="print-photo object-cover"
        style={position ? { objectPosition: position } : undefined}
      />
      {children}
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

/**
 * A printer's burst with a story's sticker on it. The type is sized from the sticker's longest
 * word so that no word ever runs off the badge.
 */
export function Sticker({
  text,
  plate,
  className,
  points = 20,
  hand,
}: {
  text: string;
  /** Which of the page's two inks the badge is printed in. */
  plate: "a" | "b";
  className?: string;
  points?: number;
  hand?: string;
}) {
  // The badge's inner square is ~70% of its width; the sticker is sized in its own ems.
  const words = longestWord(text);
  const em = Math.min(0.3, 0.64 / (Math.max(words, 2) * 0.66));
  return (
    <Burst
      fill={`var(--${plate})`}
      points={points}
      depth={0.13}
      className={`tb-sticker tb-sticker--${plate} ${className ?? ""}`}
    >
      <span aria-hidden className="tb-sticker-in" style={{ "--st": em } as CSSProperties}>
        <span className="tb-sticker-big">{text}</span>
        {hand ? <span className="tb-sticker-hand">{hand}</span> : null}
      </span>
    </Burst>
  );
}

/** The folio: page, paper and date; the section; and, at most, one line to the next page. */
export function Folio({
  page,
  section,
  date,
  next,
}: {
  page: number;
  section: string;
  date: string;
  next?: { href: string; label: string; order: number } | null;
}) {
  return (
    <footer className="tb-folio">
      <span>
        Page {page} · The Yay News · {date}
      </span>
      <span className="tb-folio-mid">{section}</span>
      {next ? (
        <Link href={next.href} className="tb-folio-next">
          Next: {next.label}, p.{next.order} →
        </Link>
      ) : (
        <span />
      )}
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

/** A story's body as newspaper paragraphs: the first justified (optionally with a drop cap). */
export function Body({
  paragraphs,
  dropcap,
  runin,
}: {
  paragraphs: string[];
  dropcap?: boolean;
  runin?: string;
}) {
  return (
    <>
      {paragraphs.map((para, i) =>
        i === 0 ? (
          <p key={i} className={`tb-first ${dropcap ? "tb-dropcap" : ""}`}>
            {runin ? <span className="tb-runin">{runin} </span> : null}
            {para}
          </p>
        ) : (
          <p key={i}>{para}</p>
        ),
      )}
    </>
  );
}
