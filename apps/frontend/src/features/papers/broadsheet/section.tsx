import type { Edition } from "@repo/shared";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Mark } from "@/features/print/mark";
import type { EditionPage, PageProps, Reading, StoryItem } from "../types";
import {
  HouseAd,
  type Listing,
  Listings,
  NextTicket,
  PullQuote,
  listings,
  pullQuote,
} from "./furniture";
import { RULE_WORDS, type Theme, allStories, posterSize, themeFor } from "./lib";
import { Body, Folio, Photo, PixelText, RunningHead, Sticker, Zigzag, byline } from "./parts";

// An inside page for any core section: one to three stories, with or without photos. The page is
// built from the mockup's parts — a lead with its media and a listings column, a row for the other
// stories, and a row of furniture — and Screen & Sound and Gaming print their lead in the
// mockup's film strip and cartridge.

const SLOT_RANK = { lead: 0, feature: 1, brief: 2 } as const;

export const ordered = (stories: StoryItem[]) =>
  [...stories].sort((a, b) => SLOT_RANK[a.slot] - SLOT_RANK[b.slot] || a.order - b.order);

export function Section(props: PageProps) {
  return <InsidePage {...props} theme={themeFor(props.page)} />;
}

export function InsidePage({ edition, page, reading, theme }: PageProps & { theme: Theme }) {
  const [first, ...rest] = ordered(page.stories);
  const words = RULE_WORDS[theme];
  const section = page.section;
  const items = listings(edition, reading, page);

  return (
    <div className="yn-sheet-wrap">
      <article
        className={`yn-sheet yn-inside yn-theme-${theme} bs-inside ${rest.length ? "" : "bs-solo"}`}
      >
        <RunningHead
          edition={edition}
          reading={reading}
          title={section?.name ?? "Inside"}
          tagline={section?.tagline ?? ""}
        />

        <Zigzag word={words[0]} />

        {theme === "gaming" ? <Hud edition={edition} /> : null}

        <div className="bs-main">
          {first ? (
            theme === "gaming" ? (
              <CartTop story={first} reading={reading} items={items} page={page} />
            ) : rest.length ? (
              <LeadTop
                story={first}
                reading={reading}
                items={items}
                theme={theme}
                title={section?.name ?? "Inside"}
              />
            ) : (
              <SoloTop story={first} reading={reading} items={items} />
            )
          ) : (
            <section className="bs-poster bs-empty">
              <p className="yn-kicker">Nothing to report</p>
              <p className="yn-chunk yn-hed">A quiet day in {section?.name ?? "this section"}</p>
            </section>
          )}

          {rest.length ? (
            <>
              <Zigzag word={words[1]} />
              <MoreStories
                stories={rest}
                reading={reading}
                theme={theme}
                edition={edition}
                page={page}
              />
            </>
          ) : null}
        </div>

        <Zigzag word={words[2]} />

        <FurnitureRow edition={edition} page={page} reading={reading} />

        {theme === "gaming" ? <HudEnd reading={reading} /> : null}

        <Folio edition={edition} reading={reading} section={section?.name ?? "Inside"} />
      </article>
    </div>
  );
}

/** The story's own sticker, pressed over the corner of its picture. */
function StorySticker({ story, className }: { story: StoryItem; className: string }) {
  return story.sticker ? <Sticker text={story.sticker} className={className} /> : null;
}

/** A headline linked to its story's own page. */
export function Hed({
  story,
  reading,
  className = "yn-hed",
  as: As = "h2",
}: {
  story: StoryItem;
  reading: Reading;
  className?: string;
  as?: "h2" | "h3";
}) {
  return (
    <As className={`yn-chunk ${className}`}>
      <Link href={reading.storyHref(story.slug)} className="bs-link">
        {story.headline}
      </Link>
    </As>
  );
}

export const ReadOn = ({ story, reading }: { story: StoryItem; reading: Reading }) => (
  <Link href={reading.storyHref(story.slug)} className="yn-jump bs-link">
    {story.readMinutes > 1 ? `The whole story, ${story.readMinutes} minutes →` : "Read on →"}
  </Link>
);

/**
 * The page's lead: its media across the top (the film strip on Screen & Sound, a taped print
 * elsewhere, or a solid block of ink carrying the headline when there is no photo), the story
 * set in two columns beneath, and the listings column beside it.
 */
function LeadTop({
  story,
  reading,
  items,
  theme,
  title,
}: {
  story: StoryItem;
  reading: Reading;
  items: Listing[];
  theme: Theme;
  title: string;
}) {
  const image = story.images[0];
  const poster = !image;
  return (
    <section className="ss-top bs-top" aria-label={story.kicker}>
      <article className="ss-lead bs-lead">
        {image && theme === "screen" ? (
          <figure className="yn-filmstrip ss-strip bs-media">
            <span className="print-tape ss-strip-tape-l" aria-hidden />
            <span className="print-tape ss-strip-tape-r" aria-hidden />
            <Photo
              image={image}
              className="ss-frame bs-grow"
              position="center 55%"
              sizes="(max-width: 760px) 100vw, 740px"
              priority
            />
            <div className="yn-film-edge" aria-hidden>
              <span>YAY 400</span>
              <span>▸ 12A</span>
              <span>13</span>
              <span>▸ 13A</span>
              <span>YAY 400</span>
            </div>
          </figure>
        ) : image ? (
          <figure className="bs-print print-print bs-media">
            <span className="print-tape bs-print-tape-l" aria-hidden />
            <span className="print-tape bs-print-tape-r" aria-hidden />
            <Photo
              image={image}
              className="bs-grow"
              sizes="(max-width: 760px) 100vw, 740px"
              priority
            />
          </figure>
        ) : (
          <div
            className="bs-poster bs-media"
            style={
              {
                "--poster": posterSize(story.headline, 150_000, 720, 40).toFixed(1),
              } as CSSProperties
            }
          >
            <p className="yn-kicker">{story.kicker}</p>
            <Hed story={story} reading={reading} className="yn-hed bs-poster-hed" />
            <p className="yn-dek bs-poster-dek">{story.dek}</p>
            <Mark name="sketch-35" ink="var(--pop-ink)" className="bs-poster-mark" />
          </div>
        )}
        <StorySticker story={story} className="ss-sticker" />

        {poster ? (
          <div className="bs-lead-copy">
            <p className="yn-byline">{byline(story)}</p>
            <Body
              paragraphs={story.body}
              className={`yn-dropcap ${story.body.join(" ").length > 280 ? "bs-cols-2" : ""}`}
            />
            <ReadOn story={story} reading={reading} />
          </div>
        ) : (
          <div className="ss-lead-text">
            <div>
              <p className="yn-kicker">{story.kicker}</p>
              <Hed story={story} reading={reading} />
              <p className="yn-byline mt-[calc(var(--u)*3)]">{byline(story)}</p>
              {image ? (
                <p className="yn-caption bs-cap">
                  {image.alt}. <span className="yn-credit">Photo: {image.credit}</span>
                </p>
              ) : null}
            </div>
            <div>
              <p className="yn-dek">{story.dek}</p>
              <Body paragraphs={story.body} className="yn-dropcap" />
              <ReadOn story={story} reading={reading} />
            </div>
          </div>
        )}
      </article>

      <aside className="ss-listings bs-listings" aria-label="Elsewhere in today's paper">
        {theme === "screen" ? (
          <div className="yn-letterboard" aria-hidden>
            <p className="small">today</p>
            <p>Now</p>
            <p>Showing</p>
          </div>
        ) : (
          <p className="yn-chunk bs-listings-flag" aria-hidden>
            Also
            <br />
            today
          </p>
        )}
        <h3 className="yn-label">
          {theme === "screen" ? "What’s on in this paper" : "Elsewhere in the paper"}
        </h3>
        <Listings items={items} />
        <Ear text={theme === "screen" ? "Now showing" : title} />
      </aside>
    </section>
  );
}

/**
 * A page with one story: its picture printed across the page with the headline on a card pasted
 * over it (the front page's lead, in the section's inks), or a poster of ink when there is no
 * picture, and the story and the listings set beneath.
 */
function SoloTop({
  story,
  reading,
  items,
}: {
  story: StoryItem;
  reading: Reading;
  items: Listing[];
}) {
  const image = story.images[0];
  const poster = posterSize(story.headline, 300_000, 1000, 50);
  return (
    <section
      className="bs-solo-top"
      aria-label={story.kicker}
      style={{ "--poster": poster.toFixed(1) } as CSSProperties}
    >
      <figure className={`yn-hero bs-solo-hero ${image ? "" : "bs-solo-hero--type"}`}>
        {image ? (
          <Photo
            image={image}
            className="yn-hero-photo"
            sizes="(max-width: 760px) 100vw, 1100px"
            priority
            width={2000}
          />
        ) : (
          <>
            <Mark name="sketch-35" ink="var(--pop-ink)" className="bs-solo-mark" />
            <Mark name="stars-06" ink="var(--pop-ink)" className="bs-solo-stars" />
          </>
        )}
        {story.sticker ? (
          <Sticker text={story.sticker} className="yn-hero-sticker" size={1.3} points={24} />
        ) : null}
        <div className="yn-hero-card bs-solo-card">
          <span className="print-tape fr-card-tape-l" aria-hidden />
          <span className="print-tape fr-card-tape-r" aria-hidden />
          <p className="yn-kicker">{story.kicker}</p>
          <Hed story={story} reading={reading} className="bs-solo-hed" />
          {image ? <span className="yn-credit">@theyaynews via {image.credit}</span> : null}
        </div>
      </figure>

      <div className="bs-solo-text">
        <div>
          <p className="yn-dek bs-dek-big">{story.dek}</p>
          <p className="yn-byline mt-[calc(var(--u)*3)]">{byline(story)}</p>
          {image ? (
            <p className="yn-caption bs-cap">
              {image.alt}. <span className="yn-credit">Photo: {image.credit}</span>
            </p>
          ) : null}
        </div>
        <div>
          <Body paragraphs={story.body} className="yn-dropcap" />
          <ReadOn story={story} reading={reading} />
        </div>
        <aside className="bs-solo-listings" aria-label="Elsewhere in today's paper">
          <h3 className="yn-label">Elsewhere in the paper</h3>
          <Listings items={items} className="bs-solo-list" />
        </aside>
      </div>
    </section>
  );
}

/**
 * The foot of the listings column: the section's name set sideways in the column's own ink, as
 * big as whatever height is left. It is drawn as SVG so it scales to its box and can never spill.
 */
function Ear({ text }: { text: string }) {
  const word = text.toUpperCase();
  const length = Math.max(word.length * 30, 120);
  return (
    <div className="bs-ear" aria-hidden>
      <svg viewBox={`0 0 100 ${length + 20}`} preserveAspectRatio="xMidYMax meet">
        <text
          x="0"
          y="0"
          transform={`translate(78 ${length + 10}) rotate(-90)`}
          textLength={length}
          lengthAdjust="spacingAndGlyphs"
          className="bs-ear-text"
        >
          {word}
        </text>
      </svg>
    </div>
  );
}

/** Gaming's lead: the story's picture on a game cartridge, the review beside it. */
function CartTop({
  story,
  reading,
  items,
  page,
}: {
  story: StoryItem;
  reading: Reading;
  items: Listing[];
  page: EditionPage;
}) {
  const image = story.images[0];
  const solo = page.stories.length === 1;
  const pageStories = page.stories.length;
  const pageMinutes = page.stories.reduce((n, s) => n + s.readMinutes, 0);
  return (
    <section className="gm-top bs-top" aria-label={story.kicker}>
      <div className="gm-cart-wrap">
        <div className="yn-cart bs-cart">
          <div className="yn-cart-ridges" aria-hidden>
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="yn-cart-label bs-cart-label">
            {image ? (
              <Photo
                image={image}
                className="bs-grow"
                sizes="(max-width: 760px) 100vw, 560px"
                priority
              />
            ) : (
              <div className="bs-cart-screen bs-grow" aria-hidden>
                <PixelText text="PRESS START" />
              </div>
            )}
            <div className="yn-cart-title">
              <p className="yn-chunk yn-caps bs-cart-kicker" aria-hidden>
                {story.kicker}
              </p>
              <p className="meta">
                {story.readMinutes} min · 1 player
                <br />
                good news edition
              </p>
            </div>
          </div>
          <div className="yn-cart-foot" aria-hidden>
            <span>Cart. no. {story.slug.slice(0, 2).toUpperCase()}-001</span>
            <span>Insert this side up</span>
          </div>
        </div>
        {story.sticker ? (
          <Sticker
            text={story.sticker}
            fill="var(--neon-green)"
            points={20}
            className="gm-sticker print-worn"
          />
        ) : null}
      </div>

      <article className="gm-review">
        <p className="yn-kicker">{story.kicker}</p>
        <Hed story={story} reading={reading} />
        <p className="yn-dek">{story.dek}</p>
        <p className="yn-byline">{byline(story)}</p>
        <Body paragraphs={story.body} />
        <ReadOn story={story} reading={reading} />
        {image ? (
          <p className="yn-caption bs-cap">
            {image.alt}. <span className="yn-credit">Photo: {image.credit}</span>
          </p>
        ) : null}

        <div className="gm-verdict">
          <p className="gm-verdict-line">
            Stories <b>{pageStories}</b> · Minutes <b>{pageMinutes}</b> · Bad news <b>0</b>
          </p>
          <div className="gm-total">
            <span className="yn-fat">10</span>
            <p className="yn-hand">
              out of ten for this page.
              <br />
              Nothing bad happened on it.
            </p>
          </div>
        </div>

        <div className="gm-also">
          <p className="yn-label">Also out today</p>
          <ul>
            {items.slice(0, solo ? 8 : 5).map((l) => (
              <li key={l.href}>
                <span>
                  <Link href={l.href} className="bs-link">
                    <b>{l.label}</b>
                  </Link>{" "}
                  — {l.note}
                </span>
                <span>p.{l.n}</span>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </section>
  );
}

/** The rest of the page's stories: one set beside its picture, or two side by side. */
export function MoreStories({
  stories,
  reading,
  theme,
  edition,
  page,
}: {
  stories: StoryItem[];
  reading: Reading;
  theme: Theme;
  edition: Edition;
  page: EditionPage;
}) {
  if (stories.length === 1) {
    const story = stories[0]!;
    const image = story.images[0];
    const flourish = theme === "screen" || theme === "gaming";
    return (
      <section
        className={`bs-more ${image ? "bs-more--img" : "bs-more--text"} ${flourish ? "bs-more--flourish" : ""}`}
        aria-label={story.kicker}
      >
        {image ? (
          <div className="ss-collage bs-collage">
            <div className="ss-collage-ink" aria-hidden />
            <figure className="ss-choir-print print-print">
              <span className="print-tape ss-choir-tape" aria-hidden />
              <Photo
                image={image}
                className="ss-choir-photo"
                tag={false}
                sizes="(max-width: 760px) 100vw, 320px"
                width={900}
              />
            </figure>
            <p className="ss-collage-credit">Photo: {image.credit}</p>
            <StorySticker story={story} className="bs-more-sticker" />
          </div>
        ) : null}
        <article className="ss-choir-text bs-more-text">
          <div className="bs-more-head">
            {!image && story.sticker ? (
              <StorySticker story={story} className="bs-more-sticker bs-more-sticker--text" />
            ) : null}
            <p className="yn-kicker">{story.kicker}</p>
            <Hed story={story} reading={reading} className="yn-hed bs-more-hed" />
            <p className="yn-dek">{story.dek}</p>
          </div>
          <div className="bs-more-copy">
            <p className="yn-byline">{byline(story)}</p>
            <Body paragraphs={story.body} />
            <ReadOn story={story} reading={reading} />
          </div>
        </article>
        {theme === "screen" ? (
          <div className="ss-record bs-record" aria-hidden>
            <div className="yn-vinyl ss-vinyl">
              <span className="side">Side A</span>
              <span>The Yay News</span>
              <span className="mt-[calc(var(--u)*7)]">No. {edition.issueNumber}</span>
              <span className="rpm">33⅓ rpm</span>
            </div>
            <Mark name="sketch-35" className="yn-mark-abs ss-note-1" />
            <Mark name="sketch-34" ink="var(--neon-pink)" className="yn-mark-abs ss-note-2" />
          </div>
        ) : theme === "gaming" ? (
          <HiScore edition={edition} page={page} />
        ) : null}
      </section>
    );
  }
  return (
    <section className="bs-more-2" aria-label="More stories">
      {stories.map((story, i) => {
        const image = story.images[0];
        return (
          <article key={story.slug} className={`bs-brief ${i ? "bs-brief--ruled" : ""}`}>
            {image ? (
              <figure className="bs-brief-print print-print">
                <span className="print-tape bs-brief-tape" aria-hidden />
                <Photo
                  image={image}
                  className="bs-brief-photo"
                  tag={false}
                  sizes="(max-width: 760px) 100vw, 360px"
                  width={900}
                />
              </figure>
            ) : null}
            <StorySticker story={story} className="bs-brief-sticker" />
            <p className="yn-kicker">{story.kicker}</p>
            <Hed story={story} reading={reading} className="yn-hed-sm" as="h3" />
            <p className="yn-dek">{story.dek}</p>
            <p className="yn-byline">{byline(story)}</p>
            <Body paragraphs={story.body} />
            {image ? <p className="yn-credit bs-brief-credit">Photo: {image.credit}</p> : null}
            <ReadOn story={story} reading={reading} />
          </article>
        );
      })}
    </section>
  );
}

/** The arcade HUD across the top of the Gaming page. */
function Hud({ edition }: { edition: Edition }) {
  return (
    <div className="gm-hud" aria-hidden>
      <PixelText text="PLAYER 1" />
      <p className="gm-hud-mid">Credits 99 · free play, forever</p>
      <PixelText text={`HI-SCORE ${String(edition.issueNumber).padStart(6, "0")}`} />
    </div>
  );
}

function HudEnd({ reading }: { reading: Reading }) {
  return (
    <div className="gm-hud gm-hud-end">
      <PixelText text="CONTINUE? YES" />
      <p className="gm-hud-mid">
        {reading.next ? (
          <Link href={reading.next.href} className="bs-link">
            Next level: {reading.next.slug === "back" ? "the back page" : reading.next.label} →
          </Link>
        ) : (
          "Game over. See you tomorrow"
        )}
      </p>
    </div>
  );
}

/** Gaming's scoreboard for the issue: every story good news, none bad. */
function HiScore({ edition, page }: { edition: Edition; page: EditionPage }) {
  const good = allStories(edition).length;
  return (
    <article className="gm-hiscore bs-hiscore">
      <div className="gm-hiscore-ink print-worn" aria-hidden />
      <p className="yn-kicker">Today&rsquo;s score</p>
      <PixelText text={String(good).padStart(3, "0")} />
      <p className="yn-body">
        Good news: {good} stories. Bad news: none. A perfect run for issue {edition.issueNumber},
        level {page.order}.
      </p>
    </article>
  );
}

/** The row every inside page ends on: the next page as a ticket, a quote, and a house ad. */
export function FurnitureRow({ edition, page, reading }: PageProps) {
  const quote = pullQuote(page);
  return (
    <section className="ss-row bs-row" aria-label="Before you turn the page">
      <NextTicket reading={reading} edition={edition} />
      {quote ? <PullQuote quote={quote} /> : <Progress reading={reading} />}
      <HouseAd seed={edition.issueNumber + page.order} />
    </section>
  );
}

const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1);
const WORDS = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

/** How far through the paper the reader is: it's a finishable paper, so it says so. */
function Progress({ reading }: { reading: Reading }) {
  const n = reading.pages.indexOf(reading.current) + 1;
  const total = reading.pages.length;
  const left = total - n;
  return (
    <figure className="bs-progress">
      <Mark name="stars-19" ink="var(--pop)" className="yn-mark-abs ss-quote-mark" />
      <p className="bs-progress-n">
        <span className="yn-fat">{n}</span>
        <span className="yn-fat bs-progress-of">/{total}</span>
      </p>
      <p className="yn-hand bs-progress-note">
        pages read.{" "}
        {left > 1
          ? `${cap(WORDS[left] ?? String(left))} to go, then you’re done.`
          : left === 1
            ? "One to go, then you’re done."
            : "That’s the lot."}
      </p>
    </figure>
  );
}
