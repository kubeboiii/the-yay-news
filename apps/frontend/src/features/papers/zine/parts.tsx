import type { Image as EditionImage, StoryItem } from "@repo/shared";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Mark } from "@/features/print/mark";
import { printedPhoto } from "@/features/print/photo";
import { FillPlates } from "../plates";
import { pad2, ringSplit, type Ground } from "./text";

// The zine's printed furniture, adapted from the approved mockup (v4) to take edition data.

/** A spread of two mini pages, 170 × 250 mm each. */
export function Spread({ children, label }: { children: ReactNode; label: string }) {
  return (
    <main className="z-main">
      <div className="print-sheet-wrap z-wrap">
        <div className="print-spread z-spread" aria-label={label}>
          {children}
        </div>
      </div>
    </main>
  );
}

export function Page({
  ground,
  side,
  children,
  className,
  composition,
  "data-estimate": estimate,
}: {
  ground: Ground;
  side: "left" | "right";
  children: ReactNode;
  className?: string;
  /** The composition's name, stamped on the page for checks and debugging. */
  composition?: string;
  "data-estimate"?: string;
}) {
  return (
    <article
      className={`print-sheet print-sheet--bright z-page z-${ground} z-${side} ${className ?? ""}`}
      data-composition={composition}
      data-estimate={estimate}
    >
      {children}
    </article>
  );
}

/** The small centred line at the head of every mini page. */
export function RunningHead({ children }: { children: ReactNode }) {
  return <p className="z-run">{children}</p>;
}

/** The folio, with (at most) one small "next" line: the shell's page bar does the page-turning. */
export function Folio({
  n,
  date,
  next,
}: {
  n: number;
  date: string;
  next?: { label: string; href: string; n: number } | null;
}) {
  return (
    <p className="z-folio">
      <b>{pad2(n)}</b>
      <span>
        Page {n} · The Yay News · {date}
        {next ? (
          <>
            {" · "}
            <Link href={next.href} className="z-link">
              Next: {next.label}, p.{next.n} →
            </Link>
          </>
        ) : null}
      </span>
    </p>
  );
}

export function Zig({ short, className }: { short?: boolean; className?: string }) {
  return <div aria-hidden className={`z-zig ${short ? "z-zig--short" : ""} ${className ?? ""}`} />;
}

/**
 * The two-line headline: an italic line flanked by halftone bars, then a heavy slab line. `as`
 * picks the heading level so each page keeps one h1; `wrap` lets a long heavy line break.
 */
export function Head({
  top,
  bottom,
  as: Tag = "h2",
  size,
  wrap,
  id,
}: {
  top: ReactNode;
  bottom: ReactNode;
  as?: "h1" | "h2" | "div";
  size?: number;
  wrap?: boolean;
  id?: string;
}) {
  const hidden = Tag === "div" ? true : undefined;
  const style = size ? ({ "--hb": size } as CSSProperties) : undefined;
  return (
    <Tag className="z-head" id={id} aria-hidden={hidden}>
      <span className="z-head__top">
        <span aria-hidden className="z-dots" />
        <span className="z-head__cond">{top}</span>
        <span aria-hidden className="z-dots" />
      </span>
      <span className={`z-head__heavy ${wrap ? "z-head__heavy--wrap" : ""}`} style={style}>
        {bottom}
      </span>
    </Tag>
  );
}

/** A photograph printed onto the page, sized by aspect ratio so it reflows on phones. */
export function Photo({
  photo,
  ratio,
  sizes,
  position,
  className,
  priority,
  plates,
}: {
  photo: EditionImage;
  ratio: string;
  sizes: string;
  position?: string;
  className?: string;
  priority?: boolean;
  /** A story with more than one picture prints them all, as a group, in this photo's place. */
  plates?: Pick<StoryItem, "slug" | "images">;
}) {
  if (plates && plates.images.length > 1) {
    return (
      <div className={`z-photo z-photo--plates ${className ?? ""}`} style={{ aspectRatio: ratio }}>
        <FillPlates story={plates} sizes={sizes} priority={priority} />
      </div>
    );
  }
  return (
    <div className={`z-photo ${className ?? ""}`} style={{ aspectRatio: ratio }}>
      <Image
        src={printedPhoto(photo.url, 1600)}
        alt={photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="print-photo object-cover"
        style={position ? { objectPosition: position } : undefined}
      />
    </div>
  );
}

/** A strip of masking tape over a corner of a pasted print. */
export function Tape({ at }: { at: "tl" | "tr" | "br" | "t" }) {
  return <span aria-hidden className={`print-tape z-tape-${at}`} />;
}

/** A short handwritten note for the bottom border of a print, only when it fits one line. */
export const printNote = (text: string | null | undefined, max = 40) =>
  text && text.length <= max ? text : undefined;

/**
 * A photographic print pasted onto the page at an angle, held on with tape. The caption is written
 * on the print's white bottom border by hand.
 */
export function Print({
  photo,
  ratio,
  sizes,
  rotate = -2,
  tape = ["tl", "tr"],
  note,
  position,
  className,
  priority,
  plates,
}: {
  plates?: Pick<StoryItem, "slug" | "images">;
  photo: EditionImage;
  ratio: string;
  sizes: string;
  rotate?: number;
  tape?: ("tl" | "tr" | "br" | "t")[];
  note?: string;
  position?: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <figure
      className={`z-print print-print ${className ?? ""}`}
      style={{ margin: 0, ["--r" as string]: `${rotate}deg` }}
    >
      <Photo
        photo={photo}
        ratio={ratio}
        sizes={sizes}
        position={position}
        priority={priority}
        plates={plates}
      />
      {note ? (
        <figcaption className="z-print__cap" aria-hidden>
          {note}
        </figcaption>
      ) : null}
      {tape.map((t) => (
        <Tape key={t} at={t} />
      ))}
    </figure>
  );
}

/** A word ringed by hand with a loose marker ellipse. */
export function Ring({ children, ink = "var(--ink)" }: { children: ReactNode; ink?: string }) {
  return (
    <span className="z-ring">
      {children}
      <Mark name="ellipse-01" ink={ink} className="z-ring__mark" />
    </span>
  );
}

/** A headline with its first figure ringed by hand, the way the mockup rings "10 million". */
export function Ringed({ text }: { text: string }) {
  const parts = ringSplit(text);
  if (!parts) return <>{text}</>;
  const [before, ringed, after] = parts;
  return (
    <>
      {before}
      <Ring>{ringed}</Ring>
      {after}
    </>
  );
}

/**
 * A line that runs across both pages of a spread. Each page renders the whole line and crops it at
 * its own edge; the right-hand copy is hidden from assistive tech so it is read once.
 */
export function Across({
  side,
  height,
  children,
}: {
  side: "left" | "right";
  height: number;
  children: ReactNode;
}) {
  return (
    <div
      className="z-across"
      style={{ ["--ah" as string]: height }}
      aria-hidden={side === "right" ? true : undefined}
    >
      <div className="z-across__line">{children}</div>
    </div>
  );
}

/** "By-line" furniture for a story: where it came from and how long it takes. */
export function Byline({ story }: { story: StoryItem }) {
  return (
    <p className="z-byline">
      Via {story.sourceName} · {story.readMinutes}-minute read
    </p>
  );
}

/** Body paragraphs, the first with a drop cap when asked. */
export function Body({
  story,
  drop,
  className,
  before,
  children,
}: {
  story: StoryItem;
  drop?: boolean;
  className?: string;
  /** Printed ahead of the text, e.g. a picture floated into it. */
  before?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className={`z-body ${className ?? ""}`}>
      {before}
      {story.body.map((para, i) => (
        <p key={i} className={drop && i === 0 ? "z-drop" : undefined}>
          {para}
        </p>
      ))}
      {children}
    </div>
  );
}

/** The link from a story on a page to its own page. */
export function ReadOn({ href, children }: { href: string; children?: ReactNode }) {
  return (
    <p className="z-jump">
      <Link href={href} className="z-link">
        {children ?? "Read it on its own page"} →
      </Link>
    </p>
  );
}

// ——— The hand-drawn mark each section keeps for its furniture ———

const DOODLE: Record<string, string> = {
  screen: "sketch-24",
  play: "stars-04",
  startups: "sketch-40",
  music: "stars-10",
  sports: "stars-21",
  tech: "sketch-11",
  discoveries: "sketch-28",
  money: "stars-17",
  internet: "sketch-05",
  "food-and-words": "sketch-15",
  "on-this-day": "sketch-47",
  "art-design-and-books": "doodles-02",
  "brain-snacks": "sketch-34",
};

/** The hand-drawn mark a section uses beside its "In brief" label. */
export const doodleFor = (slug: string) => DOODLE[slug] ?? "sketch-52";
