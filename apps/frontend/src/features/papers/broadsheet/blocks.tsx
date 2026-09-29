import type { StoryItem } from "@repo/shared";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Reading } from "../types";
import type { Theme } from "./lib";
import { Body, Photo, Sticker, byline } from "./parts";

// The pieces every composition is set from: a story's head, its full text in columns, its
// picture (printed once, in the frame its section uses), and the "In brief" column. Each story
// is printed whole, exactly once, on its own page.

export type HedSize = "xxl" | "xl" | "lg" | "md" | "sm";

/** Kicker, headline (linked to the story's own page), standfirst and source. */
export function StoryHead({
  story,
  reading,
  size = "lg",
  dek = true,
  as: As = "h2",
  className,
  children,
}: {
  story: StoryItem;
  reading: Reading;
  size?: HedSize;
  dek?: boolean;
  as?: "h2" | "h3";
  className?: string;
  children?: ReactNode;
}) {
  return (
    <header className={`bs-head ${className ?? ""}`}>
      <p className="yn-kicker bs-kick">{story.kicker}</p>
      <As className={`yn-chunk bs-hed bs-hed--${size}`}>
        <Link href={reading.storyHref(story.slug)} className="bs-link">
          {story.headline}
        </Link>
      </As>
      {children}
      {dek ? <p className="yn-dek bs-dek">{story.dek}</p> : null}
      <p className="yn-byline bs-src">{byline(story)}</p>
    </header>
  );
}

/** The story's whole body, set in `cols` newspaper columns (fewer if the space is narrow). */
export function Copy({
  story,
  cols = 1,
  dropcap = false,
  className,
}: {
  story: StoryItem;
  cols?: 1 | 2 | 3;
  dropcap?: boolean;
  className?: string;
}) {
  return (
    <Body
      paragraphs={story.body}
      className={`bs-copy bs-copy--${cols} ${dropcap ? "yn-dropcap" : ""} ${className ?? ""}`}
    />
  );
}

export type Frame = "print" | "film" | "cart" | "flat";

/** The frame a section prints its main picture in: Screen & Sound's film, Gaming's cartridge. */
export const frameFor = (theme: Theme, fallback: Frame = "print"): Frame =>
  theme === "screen" ? "film" : theme === "gaming" ? "cart" : fallback;

/**
 * A story's picture, printed once: taped on as a print, in a strip of film, on a cartridge label,
 * or flat into the page. The caption is the picture's description; the sticker is the story's own.
 */
export function Media({
  story,
  frame = "print",
  className,
  sizes = "(max-width: 760px) 100vw, 720px",
  caption = true,
  sticker = true,
  priority,
}: {
  story: StoryItem;
  frame?: Frame;
  className?: string;
  sizes?: string;
  caption?: boolean;
  sticker?: boolean;
  priority?: boolean;
}) {
  const image = story.images[0];
  if (!image) return null;
  const photo = <Photo image={image} sizes={sizes} priority={priority} className="bs-pic" />;
  return (
    <figure className={`bs-media bs-media--${frame} ${className ?? ""}`}>
      {frame === "film" ? (
        <div className="yn-filmstrip bs-film">
          {photo}
          <div className="yn-film-edge" aria-hidden>
            <span>YAY 400</span>
            <span>▸ 12A</span>
            <span>13</span>
            <span>▸ 13A</span>
            <span>YAY 400</span>
          </div>
        </div>
      ) : frame === "cart" ? (
        <div className="yn-cart bs-cart">
          <div className="yn-cart-ridges" aria-hidden>
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="yn-cart-label bs-cart-label">{photo}</div>
        </div>
      ) : frame === "print" ? (
        <div className="print-print bs-print">
          <span className="print-tape bs-print-tape-l" aria-hidden />
          <span className="print-tape bs-print-tape-r" aria-hidden />
          {photo}
        </div>
      ) : (
        <div className="bs-flat">{photo}</div>
      )}
      {caption && image.alt ? (
        <figcaption className="yn-caption bs-cap">{image.alt}</figcaption>
      ) : null}
      {sticker && story.sticker ? (
        <Sticker text={story.sticker} className="bs-media-sticker" />
      ) : null}
    </figure>
  );
}

/** One short news item for the "In brief" column. */
export function Brief({ story, reading, n }: { story: StoryItem; reading: Reading; n?: number }) {
  return (
    <article className="bs-brief">
      {n ? (
        <span className="yn-fat bs-brief-n" aria-hidden>
          {n}
        </span>
      ) : null}
      <div className="bs-brief-body">
        <p className="yn-kicker bs-kick">{story.kicker}</p>
        <h3 className="yn-chunk bs-hed bs-hed--brief">
          <Link href={reading.storyHref(story.slug)} className="bs-link">
            {story.headline}
          </Link>
        </h3>
        <p className="bs-brief-dek">{story.dek}</p>
        <Body paragraphs={story.body} className="bs-copy bs-copy--1" />
      </div>
    </article>
  );
}

/** The page's briefs, as a rail, a numbered column or a strip across the page. */
export function Briefs({
  stories,
  reading,
  variant,
  className,
}: {
  stories: StoryItem[];
  reading: Reading;
  variant: "rail" | "numbered" | "strip" | "ink";
  className?: string;
}) {
  if (!stories.length) return null;
  return (
    <section className={`bs-briefs bs-briefs--${variant} ${className ?? ""}`} aria-label="In brief">
      <h2 className="yn-label bs-briefs-title">In brief</h2>
      <div className="bs-briefs-list" style={{ ["--n" as string]: stories.length }}>
        {stories.map((s, i) => (
          <Brief
            key={s.slug}
            story={s}
            reading={reading}
            n={variant === "numbered" ? i + 1 : undefined}
          />
        ))}
      </div>
    </section>
  );
}

/**
 * When the main story has no picture, its standfirst is set big on a block of the section's ink
 * in the picture's place (and not repeated in the head).
 */
export function InkPull({ story, className }: { story: StoryItem; className?: string }) {
  return (
    <div className={`bs-inkpull ${className ?? ""}`}>
      <p className="yn-chunk bs-inkpull-text">{story.dek}</p>
      {story.sticker ? <Sticker text={story.sticker} className="bs-media-sticker" /> : null}
    </div>
  );
}

/** A story set whole: head, picture if it has one, and its text. */
export function StoryBlock({
  story,
  reading,
  size = "md",
  cols = 1,
  frame = "print",
  mediaFirst = false,
  className,
  dropcap,
}: {
  story: StoryItem;
  reading: Reading;
  size?: HedSize;
  cols?: 1 | 2 | 3;
  frame?: Frame;
  mediaFirst?: boolean;
  className?: string;
  dropcap?: boolean;
}) {
  const media = <Media story={story} frame={frame} sizes="(max-width: 760px) 100vw, 480px" />;
  return (
    <article className={`bs-story-block ${className ?? ""}`}>
      {mediaFirst ? media : null}
      <StoryHead story={story} reading={reading} size={size} />
      {mediaFirst ? null : media}
      <Copy story={story} cols={cols} dropcap={dropcap} />
    </article>
  );
}
