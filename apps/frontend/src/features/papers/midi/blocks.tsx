import type { Image as EditionImage } from "@repo/shared";
import Link from "next/link";
import type { Reading, StoryItem } from "../types";
import { BriefArt, BriefBand, planBriefs } from "../brief-art";
import { lengthClass, PrintPhoto } from "./print";

// The pieces every Midi page is composed from: a story's head, its text, a photograph, a second
// story, the "In brief" column. Compositions (section.tsx, front.tsx) arrange these; each story is
// printed once and in full.

export type HeadSize = "hero" | "big" | "mid" | "quiet";

/** Kicker, headline (linked to the story's own page) and standfirst. */
export function StoryHead({
  story,
  reading,
  size,
  byline,
  level = 2,
  kicker,
}: {
  story: StoryItem;
  reading: Reading;
  size: HeadSize;
  byline?: string;
  level?: 2 | 3;
  kicker?: string;
}) {
  const H = level === 2 ? "h2" : "h3";
  return (
    <header className={`m5k-head m5k-head--${size}`}>
      <p className="m5-kicker">{kicker ?? story.kicker}</p>
      <H
        id={`h-${story.slug}`}
        className={`m5-display m5k-headline ${lengthClass(story.headline, [44, 64, 84])}`}
      >
        <Link href={reading.storyHref(story.slug)}>{story.headline}</Link>
      </H>
      <p className="m5k-dek">{story.dek}</p>
      {byline ? <p className="m5-byline m5k-by">{byline}</p> : null}
    </header>
  );
}

/** A story's whole text, set in reading columns. */
export function Body({
  story,
  cols = 2,
  drop,
  className,
}: {
  story: StoryItem;
  cols?: 1 | 2;
  drop?: boolean;
  className?: string;
}) {
  return (
    <div className={`m5-body m5-read m5-read--${cols} ${className ?? ""}`}>
      {story.body.map((p, i) => (
        <p key={i} className={drop && i === 0 ? "m5-drop" : undefined}>
          {p}
        </p>
      ))}
    </div>
  );
}

/** A photograph: printed flat in the column, or as a print pasted on with tape. */
export function Photo({
  image,
  className,
  sizes,
  pasted,
  priority,
  plates,
}: {
  image: EditionImage;
  className?: string;
  sizes: string;
  pasted?: boolean;
  priority?: boolean;
  plates?: Pick<StoryItem, "slug" | "images">;
}) {
  if (pasted) {
    return (
      <figure className={`m5-pasted print-print m5k-photo ${className ?? ""}`}>
        <PrintPhoto image={image} sizes={sizes} priority={priority} plates={plates} />
        <span className="print-tape m5-pasted-tape" aria-hidden />
      </figure>
    );
  }
  return (
    <figure className={`m5k-photo ${className ?? ""}`}>
      <PrintPhoto image={image} sizes={sizes} priority={priority} plates={plates} />
    </figure>
  );
}

/** "In brief": the page's short items, as a numbered column or a ruled strip. */
export function Briefs({
  stories,
  reading,
  variant,
  className,
}: {
  stories: StoryItem[];
  reading: Reading;
  variant: "numbered" | "strip";
  className?: string;
}) {
  if (!stories.length) return null;
  const id = `m5-brief-${stories[0]!.slug}`;
  const plan = planBriefs(stories, {
    measure: variant === "strip" ? "wide" : "narrow",
    flavour: "mag",
    seed: stories.map((s) => s.slug).join("|"),
  });
  return (
    <section
      className={`m5k-briefs m5k-briefs--${variant} ${className ?? ""}`}
      aria-labelledby={id}
      data-count={Math.min(stories.length, 4)}
    >
      <h2 id={id} className="m5-display m5k-briefs-h">
        In brief
      </h2>
      {plan.band ? <BriefBand stories={stories} /> : null}
      <ol>
        {stories.map((b, i) => (
          <li key={b.slug} data-art={plan.arts[i]}>
            {variant === "numbered" && !plan.band ? (
              <b className="m5-display m5k-brief-n" aria-hidden>
                {i + 1}
              </b>
            ) : null}
            <article>
              <BriefArt
                story={b}
                art={plan.arts[i]!}
                keyNo={plan.band ? i + 1 : undefined}
                kicker={<p className="m5-kicker">{b.kicker}</p>}
              >
                <h3 className="m5-display m5k-brief-head">
                  <Link href={reading.storyHref(b.slug)}>{b.headline}</Link>
                </h3>
              </BriefArt>
              {b.dek ? <p className="m5k-brief-dek">{b.dek}</p> : null}
              <div className="m5-body m5-read m5-read--1">
                {b.body.map((p, k) => (
                  <p key={k}>{p}</p>
                ))}
              </div>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** The section's name as the page's h1, in one of the design's settings. */
export function SectionTitle({
  name,
  tagline,
  variant,
}: {
  name: string;
  tagline: string;
  variant: "band" | "huge" | "edge";
}) {
  return (
    <header className={`m5k-title m5k-title--${variant}`}>
      <h1 className="m5-display m5k-title-name">{name}</h1>
      {tagline ? <p className="m5k-title-tag">{tagline}</p> : null}
    </header>
  );
}
