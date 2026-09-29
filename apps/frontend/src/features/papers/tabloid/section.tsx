import type { StoryItem } from "@repo/shared";
import Link from "next/link";
import type { ReactNode } from "react";
import { Mark } from "@/features/print/mark";
import type { PageProps, Reading } from "../types";
import { capitalise, folioDate, issueLine, ordered, pad2 } from "./edition-data";
import {
  Body,
  Folio,
  Masthead,
  MiniMark,
  Photo,
  PixelType,
  Sheet,
  Tape,
  creditLine,
  themeFor,
  type Theme,
} from "./parts";
import { Jump, PlateWord, Source, Splash, pullQuote } from "./story-bits";

// A core section's inside page. Every section prints through the same template: masthead, the
// top story's photograph (or a plate of ink) run big, then a band of columns for the rest. Screen
// & Sound and Gaming get the mockup's flourishes on top.

/** What the coloured box in each section's masthead says. */
const BOX: Record<string, string> = {
  "screen-and-sound": "Admit one",
  gaming: "Player 1, ready",
  sports: "Full time",
  discoveries: "Eureka!",
  tech: "Switched on",
  money: "Pocket change",
  "internet-and-culture": "Going viral",
  "food-and-words": "Second helpings",
  "art-design-and-books": "Hang it up",
  "on-this-day": "Once upon a time",
};

/** How a picture sits in a column: pasted on with tape, in a film strip, or on a cartridge. */
function ColumnPicture({ story, slug, index }: { story: StoryItem; slug: string; index: number }) {
  const image = story.images[0];
  if (!image) return null;
  if (slug === "screen-and-sound") {
    const holes = Array.from({ length: 12 }, (_, i) => <i key={i} />);
    return (
      <>
        <div className="tb-filmstrip tb-screen2-strip">
          <div className="tb-sprockets" aria-hidden>
            {holes}
          </div>
          <Photo image={image} sizes="(max-width: 760px) 100vw, 360px" width={900} />
          <div className="tb-sprockets" aria-hidden>
            {holes}
          </div>
          <Tape />
        </div>
        <p className="tb-credit-line">{creditLine(image)}</p>
      </>
    );
  }
  return (
    <>
      <div className={`tb-pasted print-print tb-col-print ${index % 2 ? "tb-col-print--r" : ""}`}>
        <Photo image={image} sizes="(max-width: 760px) 100vw, 360px" width={900} />
        <Tape />
      </div>
      <p className="tb-credit-line">{creditLine(image)}</p>
    </>
  );
}

/** A story in the band below the splash: kicker, headline, picture, standfirst, body. */
function ColumnStory({
  story,
  slug,
  index,
  reading,
  children,
}: {
  story: StoryItem;
  slug: string;
  index: number;
  reading: Reading;
  /** Anything set under the story in the same column. */
  children?: ReactNode;
}) {
  const href = reading.storyHref(story.slug);
  if (slug === "gaming" && story.images[0]) {
    return (
      <article className="tb-col">
        <div className="tb-cart tb-cart--col">
          <div className="tb-cart-grip" aria-hidden>
            {Array.from({ length: 14 }, (_, i) => (
              <i key={i} />
            ))}
          </div>
          <Photo image={story.images[0]} sizes="(max-width: 760px) 100vw, 360px" width={900} />
          <div className="tb-cart-text">
            <p className="tb-kicker">{story.kicker}:</p>
            <h3 className="tb-cond tb-h3-sm tb-cart-head">
              <Link href={href}>{story.headline}</Link>
            </h3>
            <p className="tb-dek">{story.dek}</p>
            <div className="tb-body">
              <Body paragraphs={story.body} />
            </div>
            <Source story={story} />
            <Jump href={href} />
          </div>
        </div>
        {children}
      </article>
    );
  }
  return (
    <article className="tb-col">
      <div className="tb-colhead">
        <p className="tb-kicker">{story.kicker}:</p>
        <h3 className="tb-cond tb-h3-sm">
          <Link href={href}>{story.headline}</Link>
        </h3>
      </div>
      <ColumnPicture story={story} slug={slug} index={index} />
      <p className="tb-dek">{story.dek}</p>
      <div className="tb-body">
        <Body paragraphs={story.body} />
      </div>
      <Source story={story} />
      <Jump href={href} />
      {children}
    </article>
  );
}

/** The column that sends the reader on: what's over the page, and the page after that. */
function TurnTo({
  edition,
  reading,
  inline,
}: Pick<PageProps, "edition" | "reading"> & { inline?: boolean }) {
  const ahead = [reading.next, reading.pages[reading.pages.indexOf(reading.current) + 2]]
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((link) => ({
      link,
      top: ordered(edition.pages.find((p) => p.order === link.order)?.stories ?? [])[0],
    }));
  return (
    <aside
      className={inline ? "tb-turn tb-turn--inline" : "tb-col tb-turn"}
      aria-label="Over the page"
    >
      <div className="tb-colhead">
        <p className="tb-kicker">Over the page:</p>
        <h3 className="tb-cond tb-h3">Turn to</h3>
      </div>
      <ol className="tb-turn-list">
        {ahead.map(({ link, top }) => (
          <li key={link.order}>
            <Link href={top ? reading.storyHref(top.slug) : link.href}>
              <span className="tb-turn-no">{pad2(link.order)}</span>
              <span>
                <span className="tb-turn-label">{link.label}</span>
                <span className="tb-turn-head tb-cond">
                  {top
                    ? top.headline
                    : link.slug === "back"
                      ? "Puzzles, comics and the sign-off"
                      : link.label}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
      <p className="tb-jump">
        <Link href={reading.pages[0]?.href ?? "/"}>
          Back to the front, <b>page 1 →</b>
        </Link>
      </p>
    </aside>
  );
}

/** The cinema letterboard under Screen & Sound's masthead. */
function Letterboard({ rows, tag }: { rows: string[]; tag: ReactNode }) {
  return (
    <div className="tb-letterboard" aria-hidden>
      <div className="tb-letterboard-rows">
        {rows.map((line, r) => (
          <div key={r} className="tb-letterboard-row">
            {line.split(" ").map((word, w) => (
              <span key={w} className="tb-letterboard-word">
                {[...word].map((ch, i) => (
                  <span key={i} className="tb-letter">
                    {ch}
                  </span>
                ))}
              </span>
            ))}
          </div>
        ))}
      </div>
      <span className="tb-letterboard-tag tb-cond">{tag}</span>
    </div>
  );
}

export function SectionPage({
  edition,
  page,
  reading,
  eyebrowLabel,
  boxWords,
  boxSmall,
  asideKicker,
  after,
  theme: forced,
}: PageProps & {
  eyebrowLabel?: string;
  boxWords?: string;
  boxSmall?: string;
  asideKicker?: string;
  after?: ReactNode;
  theme?: Theme;
}) {
  const section = page.section;
  const slug = section?.slug ?? "";
  const name = section?.name ?? reading.current.label;
  const [top, ...rest] = ordered(page.stories);
  const theme: Theme = forced ?? (slug === "gaming" ? "gaming" : themeFor(page.order));
  const date = folioDate(edition.date);
  const quote = pullQuote(page.stories);
  const minutes = page.stories.reduce((n, s) => n + s.readMinutes, 0);
  const cols = rest.length >= 2 ? "three" : rest.length === 1 ? "two" : "one";
  // With two stories, "Over the page" goes under whichever story leaves the shorter column.
  const second = rest[0];
  const weight = (s: StoryItem) => s.body.join("").length + s.headline.length + s.dek.length;
  const turnUnder =
    cols !== "two" || !second
      ? null
      : second.images.length || weight(second) > weight(top!) * 1.3
        ? "top"
        : "second";
  const words = boxWords ?? BOX[slug] ?? "Good news";

  return (
    <Sheet theme={theme} label={`${name}, page ${page.order}`}>
      <Masthead
        eyebrow={
          <MiniMark href={reading.pages[0]?.href ?? "/"}>
            Page {page.order} · {eyebrowLabel ?? name} · {date}
          </MiniMark>
        }
        title={name}
        size={{ measure: 158, max: slug === "gaming" ? 24 : 17.5 }}
        aside={
          section ? (
            <>
              <p className="tb-kicker">{asideKicker ?? "In this section:"}</p>
              <p>
                <span className="tb-runin">{section.tagline}. </span>
                {page.stories.length} {page.stories.length === 1 ? "story" : "stories"}, {minutes}{" "}
                min to read.
              </p>
            </>
          ) : undefined
        }
        box={
          slug === "gaming" ? (
            <>
              <PixelType text="1UP" />
              <span className="tb-box-words">
                {words}
                <small>Page {pad2(page.order)} · the games desk</small>
              </span>
            </>
          ) : (
            <>
              <span className="tb-box-num">{pad2(page.order)}</span>
              <span className="tb-box-words">
                {words}
                <small>{boxSmall ?? name}</small>
              </span>
            </>
          )
        }
      />

      {slug === "screen-and-sound" && top ? (
        <Letterboard
          rows={["NOW SHOWING", top.kicker.toUpperCase()]}
          tag={
            <>
              {minutes} min
              <br />
              of good
            </>
          }
        />
      ) : null}

      {after}

      {top ? (
        <Splash
          story={top}
          href={reading.storyHref(top.slug)}
          measure={228}
          priority
          className={`tb-section-splash tb-splash--${slug}`}
        />
      ) : (
        <div className="tb-grow tb-plate tb-empty">
          <PlateWord text="Good news only" measure={228} />
        </div>
      )}

      {top ? (
        <section
          className={`tb-band tb-sec-band tb-sec-band--${cols}`}
          aria-label={`${name} stories`}
        >
          <article className="tb-col">
            <div className={cols === "one" ? "tb-story-cols" : ""}>
              <p className="tb-byline">
                By our {name} desk · <b>{top.readMinutes} min read</b>
              </p>
              {top.images.length ? <p className="tb-dek">{top.dek}</p> : null}
              <div className={`tb-body ${cols === "two" ? "tb-body--lead" : ""}`}>
                <Body paragraphs={top.body} dropcap={cols !== "three"} />
              </div>
              <Source story={top} extra={top.images[0] ? creditLine(top.images[0]) : undefined} />
              <Jump href={reading.storyHref(top.slug)} />
            </div>
            {quote && cols !== "three" ? (
              <blockquote className="tb-pull">
                <p className="tb-cond">&ldquo;{quote.text}&rdquo;</p>
                {quote.by ? <footer className="tb-pull-by">{capitalise(quote.by)}</footer> : null}
              </blockquote>
            ) : null}
            {slug === "screen-and-sound" ? (
              <Mark name="sketch-24" ink="var(--b)" className="tb-mark tb-sec-music" />
            ) : null}
            {turnUnder === "top" ? <TurnTo edition={edition} reading={reading} inline /> : null}
          </article>
          {rest.slice(0, 2).map((s, i) => (
            <ColumnStory key={s.slug} story={s} slug={slug} index={i} reading={reading}>
              {turnUnder === "second" ? (
                <TurnTo edition={edition} reading={reading} inline />
              ) : null}
            </ColumnStory>
          ))}
          {cols === "one" ? <TurnTo edition={edition} reading={reading} /> : null}
        </section>
      ) : null}

      <Folio page={page.order} section={name} date={date} issue={issueLine(edition)} />
    </Sheet>
  );
}

export function Section(props: PageProps) {
  return <SectionPage {...props} />;
}
