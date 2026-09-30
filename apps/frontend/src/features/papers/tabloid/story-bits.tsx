import type { StoryItem } from "@repo/shared";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { BriefArt, BriefBand, planBriefs } from "../brief-art";
import type { Area, Place } from "./compose";
import { host } from "./edition-data";
import { Bars, Body, Photo, Sticker, Tape, fit } from "./parts";

// The pieces of a page as the tabloid prints them — a story's head, its photograph, its text, the
// second story and the briefs — each dropped into one area of the page's composition.

export const fs = (u: number) =>
  ({ fontSize: `calc(var(--u) * ${u.toFixed(2)})` }) as CSSProperties;

/** The measure of an area that spans `span` of the three columns, in sheet millimetres. */
export const measureOf = (span: number) => [0, 80, 168, 258][Math.min(Math.max(span, 1), 3)]!;

/** A headline sized to its area: bigger across the page, never broken inside a word. */
export function headSize(headline: string, span: number, scale = 1) {
  const [max, lines] = span >= 3 ? [12.5, 2] : span === 2 ? [10, 3] : [7.4, 5];
  return fit(headline, { max: max * scale, min: 5.2, measure: measureOf(span), lines, em: 0.52 });
}

/** The splash headline set on a photograph, in caps on highlighter bars. */
export function splashSize(headline: string, measure: number, max = 11, lines = 3) {
  return fit(headline.toUpperCase(), { max, min: 6, measure, lines, em: 0.64 });
}

/** One area of the page's grid, with the rules a newspaper draws between its columns. */
export function AreaBox({
  area,
  place,
  as: Tag = "div",
  className,
  label,
  children,
}: {
  area: Area;
  place: Place | undefined;
  as?: "div" | "section" | "aside" | "article" | "nav";
  className?: string;
  label?: string;
  children: ReactNode;
}) {
  if (!place) return null;
  return (
    <Tag
      className={`tb-area tb-a-${area} tb-span-${place.span} ${place.row === 0 ? "tb-r0" : ""} ${place.col === 0 ? "tb-c0" : ""} ${className ?? ""}`}
      style={{ gridArea: area }}
      aria-label={label}
    >
      {children}
    </Tag>
  );
}

/** "Source: Hollowmere Herald", linked to the original. */
export function Source({ story }: { story: StoryItem }) {
  return (
    <p className="tb-source">
      Source:{" "}
      <a href={story.sourceUrl} rel="noopener noreferrer" target="_blank">
        {story.sourceName || host(story.sourceUrl)}
      </a>
    </p>
  );
}

/** A story's kicker, headline and standfirst. */
export function StoryHead({
  story,
  href,
  span,
  level = "h2",
  scale,
  byline,
}: {
  story: StoryItem;
  href: string;
  span: number;
  level?: "h2" | "h3";
  scale?: number;
  byline?: ReactNode;
}) {
  const H = level;
  return (
    <>
      <p className="tb-kicker">{story.kicker}:</p>
      <H className="tb-cond tb-head" style={fs(headSize(story.headline, span, scale))}>
        <Link href={href}>{story.headline}</Link>
      </H>
      <p className="tb-dek">{story.dek}</p>
      {byline ? <p className="tb-byline">{byline}</p> : null}
    </>
  );
}

/** A story's whole body, flowing into as many columns as its area has room for. */
export function StoryText({ story, dropcap }: { story: StoryItem; dropcap?: boolean }) {
  return (
    <div className="tb-flow">
      <Body paragraphs={story.body} dropcap={dropcap} />
      <Source story={story} />
    </div>
  );
}

/**
 * The main story's photograph, filling its area. On a splash the headline is printed on it in
 * caps on highlighter bars; the sticker, when the story has one, goes in a corner.
 */
export function MainPhoto({
  story,
  href,
  measure,
  onPhoto,
  priority,
  sizes,
  single,
}: {
  story: StoryItem;
  href: string;
  measure: number;
  onPhoto?: boolean;
  /** Print only the first picture (the page runs the rest elsewhere). */
  single?: boolean;
  priority?: boolean;
  sizes: string;
}) {
  const image = story.images[0];
  if (!image) return null;
  return (
    <Photo
      image={image}
      sizes={sizes}
      className="tb-fill tb-photo--open"
      priority={priority}
      plates={single ? undefined : story}
    >
      {story.sticker ? (
        <Sticker text={story.sticker} plate="b" className="tb-splash-sticker" />
      ) : null}
      {onPhoto ? (
        <div className="tb-onphoto">
          <p className="tb-kicker">{story.kicker}:</p>
          <h2 className="tb-splash" style={fs(splashSize(story.headline, measure))}>
            <Link href={href}>
              <Bars className="tb-bars--over">{story.headline}</Bars>
            </Link>
          </h2>
        </div>
      ) : null}
    </Photo>
  );
}

/** The second story's picture, in the section's own treatment where it has one. */
function SecondPicture({ story, slug }: { story: StoryItem; slug: string }) {
  const image = story.images[0];
  if (!image) return null;
  const photo = (
    <Photo image={image} sizes="(max-width: 760px) 100vw, 380px" width={900} plates={story} />
  );
  if (slug === "screen") {
    const holes = Array.from({ length: 12 }, (_, i) => <i key={i} />);
    return (
      <div className="tb-filmstrip tb-second-pic">
        <div className="tb-sprockets" aria-hidden>
          {holes}
        </div>
        {photo}
        <div className="tb-sprockets" aria-hidden>
          {holes}
        </div>
      </div>
    );
  }
  if (slug === "play") {
    return (
      <div className="tb-cart tb-cart--pic tb-second-pic">
        <div className="tb-cart-grip" aria-hidden>
          {Array.from({ length: 14 }, (_, i) => (
            <i key={i} />
          ))}
        </div>
        {photo}
      </div>
    );
  }
  return (
    <div className="tb-pasted print-print tb-col-print tb-second-pic">
      {photo}
      <Tape />
    </div>
  );
}

/** The page's second story: head, picture and whole text, laid across its area. */
export function SecondStory({
  story,
  href,
  span,
  slug,
}: {
  story: StoryItem;
  href: string;
  span: number;
  slug: string;
}) {
  const wide = span >= 2 && story.images.length > 0;
  return (
    <div className={`tb-second ${wide ? "tb-second--wide" : ""}`}>
      {wide ? <SecondPicture story={story} slug={slug} /> : null}
      <div className="tb-second-text">
        <StoryHead
          story={story}
          href={href}
          span={wide ? span - 1 : span}
          level="h3"
          scale={0.82}
        />
        {wide ? null : <SecondPicture story={story} slug={slug} />}
        <StoryText story={story} />
      </div>
    </div>
  );
}

/** "In brief": the page's short items, as a column or a strip across the page. */
export function Briefs({
  stories,
  storyHref,
  span,
}: {
  stories: StoryItem[];
  storyHref: (slug: string) => string;
  span: number;
}) {
  if (!stories.length) return null;
  const plan = planBriefs(stories, {
    measure: span >= 2 ? "wide" : "narrow",
    flavour: "loud",
    seed: stories.map((s) => s.slug).join("|"),
  });
  return (
    <>
      <h2 className="tb-briefs-head tb-cond">In brief</h2>
      {plan.band ? <BriefBand stories={stories} /> : null}
      <ol className={`tb-briefs tb-briefs--${span >= 3 ? "strip" : span === 2 ? "pair" : "rail"}`}>
        {stories.map((s, i) => (
          <li key={s.slug} className="tb-brief" data-art={plan.arts[i]}>
            <BriefArt
              story={s}
              art={plan.arts[i]!}
              keyNo={plan.band ? i + 1 : undefined}
              kicker={<p className="tb-kicker">{s.kicker}:</p>}
            >
              <h3 className="tb-cond tb-brief-head">
                <Link href={storyHref(s.slug)}>{s.headline}</Link>
              </h3>
            </BriefArt>
            {s.dek ? <p className="tb-brief-dek">{s.dek}</p> : null}
            <Body paragraphs={s.body} />
            <Source story={s} />
          </li>
        ))}
      </ol>
    </>
  );
}

/** The big outline word printed across a plate of ink, sized to its plate on desk and phone. */
export function PlateWord({ text, measure }: { text: string; measure: number }) {
  const upper = text.toUpperCase();
  const size = (m: number, max: number) =>
    fit(upper, { max, min: 8, measure: m, lines: 2, em: 0.7 }).toFixed(2);
  return (
    <span
      className="tb-plate-word"
      aria-hidden
      style={{ "--pw": size(measure, 34), "--pw-phone": size(136, 30) } as CSSProperties}
    >
      {text}
    </span>
  );
}
