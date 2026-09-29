import type { Edition, Image as EditionImage, StoryItem } from "@repo/shared";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Mark } from "@/features/print/mark";
import { printedPhoto } from "@/features/print/photo";
import type { Reading } from "../types";
import { folios, pad2, ringSplit, teaseFor, type Ground } from "./text";

// The zine's printed furniture, adapted from the approved mockup (v4) to take edition data.

const mm = (n: number) => `calc(var(--u) * ${n})`;

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
}: {
  ground: Ground;
  side: "left" | "right";
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={`print-sheet print-sheet--bright z-page z-${ground} z-${side} ${className ?? ""}`}
    >
      {children}
    </article>
  );
}

/** The small centred line at the head of every mini page. */
export function RunningHead({ children }: { children: ReactNode }) {
  return <p className="z-run">{children}</p>;
}

export function Folio({ n, date }: { n: number; date: string }) {
  return (
    <p className="z-folio">
      <b>{pad2(n)}</b>
      <span>
        Page {n} · The Yay News · {date}
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
}: {
  photo: EditionImage;
  ratio: string;
  sizes: string;
  position?: string;
  className?: string;
  priority?: boolean;
}) {
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

export const creditLine = (photos: EditionImage[]) =>
  `${photos.length > 1 ? "Photos" : photos[0]?.kind === "illustration" ? "Illustration" : "Photo"}: ${[
    ...new Set(photos.map((p) => p.credit)),
  ].join("; ")} · ${[...new Set(photos.map((p) => p.licence))].join("; ")}`;

export function Credit({ photos, children }: { photos: EditionImage[]; children?: ReactNode }) {
  return (
    <p className="z-cap">
      {children ? <>{children} </> : null}
      <span className="z-cap__credit">{creditLine(photos)}</span>
    </p>
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
}: {
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
      <Photo photo={photo} ratio={ratio} sizes={sizes} position={position} priority={priority} />
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

/** A typed note beside a marker arrow, positioned by the caller. */
export function Anno({
  arrow,
  children,
  style,
  arrowSize = [16, 10],
  arrowFirst = true,
  ink = "var(--ink)",
  arrowStyle,
  className,
}: {
  arrow: string;
  children: ReactNode;
  style?: CSSProperties;
  arrowSize?: [number, number];
  arrowFirst?: boolean;
  ink?: string;
  arrowStyle?: CSSProperties;
  className?: string;
}) {
  const mark = (
    <span className="z-anno__arrow" style={{ flex: "none" }}>
      <Mark
        name={arrow}
        ink={ink}
        style={{
          width: mm(arrowSize[0]),
          height: mm(arrowSize[1]),
          display: "block",
          ...arrowStyle,
        }}
      />
    </span>
  );
  return (
    <p className={`z-anno ${className ?? ""}`} style={style}>
      {arrowFirst ? mark : null}
      <span>{children}</span>
      {arrowFirst ? null : mark}
    </p>
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

/** Something stuck on after printing, across the fold. Hidden once the spread splits. */
export function OnFold({
  children,
  gx = 0,
  gy,
  rotate,
}: {
  children: ReactNode;
  gx?: number;
  gy: number;
  rotate: number;
}) {
  return (
    <div
      className="z-onfold"
      aria-hidden
      style={{ ["--gx" as string]: gx, ["--gy" as string]: gy, ["--r" as string]: `${rotate}deg` }}
    >
      {children}
    </div>
  );
}

/** "By-line" furniture for a story: where it came from and how long it takes. */
export function Byline({ story }: { story: StoryItem }) {
  return (
    <p className="z-byline">
      From {/^the /i.test(story.sourceName) ? null : <i>the </i>}
      {story.sourceName} · {story.readMinutes}-minute read
    </p>
  );
}

/** Body paragraphs, the first with a drop cap when asked. */
export function Body({
  story,
  drop,
  className,
  children,
}: {
  story: StoryItem;
  drop?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`z-body ${className ?? ""}`}>
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

/** A pull quote between two short zigzags. */
export function Pull({ text, className }: { text: string; className?: string }) {
  return (
    <div className={`z-pull ${className ?? ""}`}>
      <Zig short />
      <blockquote>
        <p>“{text}”</p>
      </blockquote>
      <Zig short />
    </div>
  );
}

/** The foot of an inside spread: where to turn next, with the next page's first headline. */
export function TurnOver({ edition, reading }: { edition: Edition; reading: Reading }) {
  const next = reading.next;
  if (!next) return null;
  const [n] = folios(reading, next.order);
  return (
    <Link href={next.href} className="z-turn">
      <span className="z-turn__label">Turn over</span>
      <span className="z-turn__n" aria-hidden>
        {pad2(n)}
      </span>
      <span className="z-turn__text">
        <b>
          <span className="z-sr">Next, page {n}: </span>
          {next.label}
        </b>
        <span>{teaseFor(edition, next.order)}</span>
      </span>
      <Mark name="arrows-06" ink="var(--ink)" className="z-turn__arrow" />
    </Link>
  );
}

/**
 * "Also in No. N": stories from the pages after the next one (wrapping round to the front), so a
 * spread with room to spare points on into the zine. The next page is the turn-over card's.
 */
export function AlsoInside({
  edition,
  reading,
  count,
  big,
}: {
  edition: Edition;
  reading: Reading;
  count: number;
  /** A one-story spread's right page: bigger teasers, each with its picture pasted in. */
  big?: boolean;
}) {
  const pages = [...edition.pages].sort((a, b) => a.order - b.order);
  const at = pages.findIndex((p) => p.order === reading.current.order);
  const ring = [...pages.slice(at + 1), ...pages.slice(0, Math.max(at, 0))].filter(
    (p) => p.stories.length > 0,
  );
  const candidates = ring
    .map((p, i) => {
      const stories = [...p.stories].sort((a, b) => a.order - b.order);
      // The next page's first story is already on the turn-over card.
      const s = i === 0 && p.order === reading.next?.order ? stories[1] : stories[0];
      return s ? { s, n: folios(reading, p.order)[0] } : null;
    })
    .filter((x): x is { s: StoryItem; n: number } => x !== null);
  // The big version pastes in a picture for each teaser, so it prefers stories that have one.
  const ordered = big
    ? [
        ...candidates.filter((c) => c.s.images.length),
        ...candidates.filter((c) => !c.s.images.length),
      ]
    : candidates;
  const picks = ordered.slice(0, count);
  if (!picks.length) return null;
  return (
    <aside
      className={`z-also ${big ? "z-also--big" : ""}`}
      aria-labelledby={`also-${reading.current.order}`}
    >
      <div className="z-contents__title">
        <h2 className="z-label" id={`also-${reading.current.order}`}>
          Also in No. {edition.issueNumber}
        </h2>
        <Zig />
      </div>
      <ol>
        {picks.map(({ s, n }, i) => (
          <li key={s.slug}>
            {big && s.images[0] ? (
              <Print
                photo={s.images[0]}
                ratio="3 / 2"
                sizes="(max-width: 900px) 90vw, 280px"
                rotate={i % 2 ? 2.2 : -2.4}
                tape={[i % 2 ? "tr" : "tl"]}
                className="z-also__print"
              />
            ) : null}
            <Link href={reading.storyHref(s.slug)} className="z-link-block">
              <span className="z-also__n" aria-hidden>
                {pad2(n)}
              </span>
              <span className="z-also__text">
                <span className="z-kicker">
                  <span className="z-sr">Page {n}: </span>
                  {s.section.name} · {s.kicker}
                </span>
                <b>{s.headline}</b>
                {big ? <span className="z-also__dek">{s.dek}</span> : null}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </aside>
  );
}

// ——— A short day's left page: a big doodle and a typed note pointing over the fold ———

const DOODLE: Record<string, string> = {
  "screen-and-sound": "sketch-24",
  gaming: "stars-04",
  sports: "stars-21",
  tech: "sketch-11",
  discoveries: "sketch-28",
  money: "stars-17",
  "internet-and-culture": "sketch-05",
  "food-and-words": "sketch-15",
  "on-this-day": "sketch-47",
  "art-design-and-books": "doodles-02",
};

/** The hand-drawn mark a section uses to fill a short page. */
export const doodleFor = (slug: string) => DOODLE[slug] ?? "sketch-52";

export function Doodle({ slug, next }: { slug: string; next: string | null }) {
  return (
    <div className="zs-doodle" aria-hidden>
      <Mark name={doodleFor(slug)} ink="var(--ink)" className="zs-doodle__mark" />
      <p className="z-anno zs-doodle__note">
        <span>{next ? `${next} is over the page` : "that’s the lot"}</span>
        <Mark name="arrows-06" ink="var(--ink)" className="zs-doodle__arrow" />
      </p>
    </div>
  );
}
