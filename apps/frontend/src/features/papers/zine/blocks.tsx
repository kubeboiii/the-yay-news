import type { Image as EditionImage, StoryItem } from "@repo/shared";
import Link from "next/link";
import type { ReactNode } from "react";
import { Burst } from "@repo/ui/print/burst";
import { Mark } from "@repo/ui/print/mark";
import { BriefArt, BriefBand, planBriefs } from "../brief-art";
import { Body, Byline, Head, Photo, Print, printNote, ReadOn, Ringed, Tape, Zig } from "./parts";
import { headSize } from "./text";

/*
 * The zine's story furniture: one story block with a handful of deliberate treatments, and one
 * "In brief" block with four. Compositions (compose.ts) pick a treatment for each story on a page,
 * so the grid, type and inks stay the zine's while the page is composed around the day's copy.
 */

export type StoryVariant =
  | "top" // a taped print across the top, then the head and the text
  | "float" // head first; the print floated into the text
  | "after1" // head, first paragraph, then the picture flat on a block of ink, then the rest
  | "rail" // kicker, head and standfirst in a narrow rail beside the picture and text
  | "boxed" // the whole story on a block of the page's deep ink
  | "clip" // the story on white stock, torn out and taped on
  | "cart" // Play: a cartridge label carries the head, the print taped over its edge
  | "film"; // Screen: the picture on a strip of film above the head

export type HeadSize = "xl" | "l" | "m" | "s";

const SIZES: Record<HeadSize, [number, number, number, number]> = {
  xl: [12, 10.4, 9.2, 8.4],
  l: [9.6, 8.4, 7.6, 7],
  m: [7.8, 7, 6.4, 6],
  s: [6.4, 5.9, 5.5, 5.2],
};

type StoryBlockProps = {
  story: StoryItem;
  href: string;
  variant: StoryVariant;
  size?: HeadSize;
  /** Which side a floated or railed picture sits on. */
  side?: "left" | "right";
  /** Head in the two-line form: the kicker between halftone bars above the slab. */
  dots?: boolean;
  /** Paragraphs to print before jumping to the story's own page (front-page lead only). */
  cut?: number;
  priority?: boolean;
  /** Print the sticker (the data's own) on the picture. */
  sticker?: boolean;
  className?: string;
};

/** A story, printed in full (headline, standfirst, whole body) in one of the zine's treatments. */
export function StoryBlock({
  story,
  href,
  variant,
  size = "l",
  side = "right",
  dots,
  cut,
  priority,
  sticker = true,
  className,
}: StoryBlockProps) {
  // Only a page's main story gets a figure ringed by hand; once a page is enough.
  const ringed = /zc-(main|lead)/.test(className ?? "");
  const headText = ringed ? <Ringed text={story.headline} /> : story.headline;
  const image = story.images[0] ?? null;
  const body = cut && cut < story.body.length ? story.body.slice(0, cut) : story.body;
  const cutShort = body.length < story.body.length;
  const zh = headSize(story.headline, SIZES[size]);
  const id = `h-${story.slug}`;

  const headline = dots ? (
    <h2 className="z-head zc-dots" id={id}>
      <span className="z-head__top">
        <span aria-hidden className="z-dots" />
        <span className="z-head__cond">{story.kicker}</span>
        <span aria-hidden className="z-dots" />
      </span>
      <Link
        href={href}
        className="z-head__heavy z-head__heavy--wrap z-link-head"
        style={{ ["--hb" as string]: zh }}
      >
        {headText}
      </Link>
    </h2>
  ) : (
    <>
      <p className="z-kicker zc-kicker">{story.kicker}</p>
      <h2 className="z-h2 zc-head" id={id} style={{ ["--zh" as string]: zh }}>
        <Link href={href} className="z-link-head">
          {headText}
        </Link>
      </h2>
    </>
  );
  const dek = <p className="z-dek zc-dek">{story.dek}</p>;
  const byline = <Byline story={story} />;
  const jump = cutShort ? <ReadOn href={href}>Continued on its own page</ReadOn> : null;
  const burst =
    sticker && story.sticker ? (
      <Burst fill="var(--butter)" points={18} depth={0.16} className="zc-burst">
        <p>{story.sticker}</p>
      </Burst>
    ) : null;
  const print = (img: EditionImage, ratio: string, rotate: number, cls?: string) => (
    <div className={`zc-print ${cls ?? ""}`}>
      <Print
        photo={img}
        plates={img === image ? story : undefined}
        ratio={ratio}
        sizes="(max-width: 900px) 100vw, 620px"
        rotate={rotate}
        tape={rotate < 0 ? ["tl", "br"] : ["tr"]}
        note={printNote(img.alt, 44)}
        priority={priority}
      />
      {burst}
    </div>
  );
  const text = (before?: ReactNode) => (
    <Body story={{ ...story, body }} drop className="zc-body" before={before}>
      {jump}
    </Body>
  );
  const cls = `zc-story zc-story--${variant} ${className ?? ""}`;

  if (variant === "rail") {
    return (
      <article className={`${cls} zc-rail--${side}`} aria-labelledby={id}>
        <div className="zc-rail__rail">
          {headline}
          {dek}
          {byline}
          {/* The print goes down the rail under the head, so the rail runs as deep as the text. */}
          {image ? print(image, "3 / 4", side === "right" ? -1.4 : 1.6) : null}
        </div>
        <div className="zc-rail__main">{text()}</div>
      </article>
    );
  }

  if (variant === "float") {
    return (
      <article className={cls} aria-labelledby={id}>
        {headline}
        {dek}
        {byline}
        {text(
          image ? (
            <figure className={`zc-float zc-float--${side}`}>
              <Print
                photo={image}
                ratio="4 / 5"
                sizes="(max-width: 900px) 100vw, 260px"
                rotate={side === "right" ? 2.2 : -2.2}
                tape={["t"]}
                priority={priority}
              />
            </figure>
          ) : null,
        )}
      </article>
    );
  }

  if (variant === "after1") {
    const [first, ...others] = body;
    return (
      <article className={cls} aria-labelledby={id}>
        {headline}
        {dek}
        {byline}
        <div className="z-body zc-body">
          <p className="z-drop">{first}</p>
          {image ? (
            <div className="zc-flat z-offset-block">
              <Photo
                photo={image}
                plates={story}
                ratio="16 / 9"
                sizes="(max-width: 900px) 100vw, 620px"
              />
              {burst}
            </div>
          ) : null}
          {others.map((p, i) => (
            <p key={i} className={i === 0 && image ? "zc-noindent" : undefined}>
              {p}
            </p>
          ))}
          {jump}
        </div>
      </article>
    );
  }

  if (variant === "boxed") {
    return (
      <article className={cls} aria-labelledby={id}>
        {headline}
        {dek}
        {byline}
        {text(
          image ? (
            <figure className={`zc-float zc-float--${side} zc-float--flat`}>
              <Photo
                photo={image}
                plates={story}
                ratio="1 / 1"
                sizes="(max-width: 900px) 100vw, 260px"
              />
            </figure>
          ) : null,
        )}
      </article>
    );
  }

  if (variant === "clip") {
    return (
      <article
        className={cls}
        aria-labelledby={id}
        style={{ ["--r" as string]: side === "left" ? "-0.8deg" : "0.9deg" }}
      >
        <div className="zc-clip__paper">
          {image ? (
            <div className="zc-clip__photo">
              <Photo
                photo={image}
                plates={story}
                ratio="2 / 1"
                sizes="(max-width: 900px) 100vw, 560px"
              />
            </div>
          ) : null}
          {headline}
          {dek}
          {byline}
          {text()}
        </div>
        <Tape at={side === "left" ? "tl" : "tr"} />
      </article>
    );
  }

  if (variant === "cart") {
    return (
      <article className={cls} aria-labelledby={id}>
        <div className={`z-gotw ${image ? "" : "zs-gotw--bare"}`}>
          {image ? (
            <Print
              photo={image}
              plates={story}
              ratio="4 / 5"
              sizes="(max-width: 900px) 70vw, 220px"
              rotate={-4}
              tape={["tl", "tr"]}
              className="z-gotw__print"
              priority={priority}
            />
          ) : null}
          <div className="z-cart">
            <div className="z-cart__ridges" aria-hidden />
            <div className="z-cart__label">
              <p className="z-kicker">{story.kicker}</p>
              <h2 className="z-cart__title" id={id}>
                <Link href={href} className="z-link-head">
                  {story.headline}
                </Link>
              </h2>
              <p className="z-cart__verdict">{story.dek}</p>
            </div>
          </div>
        </div>
        {byline}
        {text()}
      </article>
    );
  }

  if (variant === "film") {
    return (
      <article className={cls} aria-labelledby={id}>
        {image ? (
          <div className="z-film zs-film">
            <div className="z-film__frames zs-film__one zs-film__wide">
              <Photo
                photo={image}
                plates={story}
                ratio="5 / 2"
                sizes="(max-width: 900px) 100vw, 620px"
                priority={priority}
              />
            </div>
            <p className="z-film__edge" aria-hidden>
              <span>YAY 400</span>
              <span>▸ 23A</span>
              <span>▸ 24</span>
              <span>▸ 24A</span>
            </p>
          </div>
        ) : null}
        {headline}
        {dek}
        {byline}
        {text()}
      </article>
    );
  }

  // "top"
  return (
    <article className={cls} aria-labelledby={id}>
      {image ? print(image, "3 / 2", side === "right" ? -1.6 : 1.8, "zc-print--top") : null}
      {headline}
      {dek}
      {byline}
      {text()}
    </article>
  );
}

export type BriefsVariant = "numbered" | "box" | "ruled" | "band";

/** The page's short news items, printed in full, as proper briefs: kicker, headline, text. */
export function Briefs({
  stories,
  storyHref,
  variant,
  mark,
  from = 0,
}: {
  stories: StoryItem[];
  storyHref: (slug: string) => string;
  variant: BriefsVariant;
  mark?: string;
  /** Briefs already printed on the facing page: this block continues the column. */
  from?: number;
}) {
  if (!stories.length) return null;
  const id = `brief-${stories[0]!.slug}`;
  const plan = planBriefs(stories, {
    measure: variant === "band" ? "wide" : "narrow",
    flavour: "scrappy",
    seed: stories.map((s) => s.slug).join("|"),
  });
  return (
    <section className={`zc-briefs zc-briefs--${variant}`} aria-labelledby={id}>
      {variant === "box" ? <Tape at="t" /> : null}
      <div className="zc-briefs__title">
        <h2 className="z-label" id={id}>
          {from ? "In brief, continued" : "In brief"}
        </h2>
        <Zig />
        {mark && variant !== "band" ? (
          <Mark name={mark} ink="var(--ink)" className="zc-briefs__mark" />
        ) : null}
      </div>
      {plan.band ? <BriefBand stories={stories} /> : null}
      <ol>
        {stories.map((s, i) => (
          <li key={s.slug} data-art={plan.arts[i]}>
            {variant === "numbered" && !plan.band ? (
              <span className="zc-briefs__n" aria-hidden>
                {from + i + 1}
              </span>
            ) : null}
            <div>
              <BriefArt
                story={s}
                art={plan.arts[i]!}
                keyNo={plan.band ? from + i + 1 : undefined}
                kicker={<p className="z-kicker">{s.kicker}</p>}
              >
                <h3 className="zc-briefs__head">
                  <Link href={storyHref(s.slug)} className="z-link-head">
                    {s.headline}
                  </Link>
                </h3>
              </BriefArt>
              <p className="zc-briefs__dek">{s.dek}</p>
              <div className="zc-body zc-briefs__body">
                {s.body.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Kept for the section head: re-exported so compositions import one module. */
export { Head };
