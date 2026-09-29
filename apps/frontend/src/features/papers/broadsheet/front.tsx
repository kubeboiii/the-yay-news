import type { Edition } from "@repo/shared";
import Link from "next/link";
import { Mark } from "@/features/print/mark";
import type { PageProps, Reading, StoryItem } from "../types";
import { Copy, Media, StoryBlock, StoryHead } from "./blocks";
import {
  type FrontComp,
  featureOf,
  fitSize,
  frontComp,
  readMinutes,
  shortDate,
  storiesOf,
} from "./lib";
import { STRETCH, Sticker, Zigzag } from "./parts";

// The front page. Five compositions share one masthead, one set of inks and one type system; the
// paper picks one per day (see frontComp in lib.ts), so a week of fronts reads as five days of the
// same paper rather than one template refilled.

export function Front({ edition, page, reading }: PageProps) {
  const comp = frontComp(edition, page);
  const { main, second, extra } = storiesOf(page.stories);
  const others = [second, ...extra].filter((s): s is StoryItem => Boolean(s));
  const parts = { edition, reading, main, others };

  return (
    <div className="yn-sheet-wrap">
      <article className={`yn-sheet yn-theme-front bs-front bs-front--${comp}`} data-comp={comp}>
        <FrontComposition comp={comp} {...parts} />
      </article>
    </div>
  );
}

type Parts = {
  edition: Edition;
  reading: Reading;
  main: StoryItem | null;
  others: StoryItem[];
};

function FrontComposition({ comp, edition, reading, main, others }: Parts & { comp: FrontComp }) {
  const photo = Boolean(main?.images[0]);
  const [s2, ...s3] = others;
  const lead = main ? (
    <>
      <Copy story={main} cols={2} dropcap />
    </>
  ) : null;

  switch (comp) {
    // The mockup's own front: the day's number across the top, the masthead, the lead photo with
    // its headline pasted on, and five columns of news beneath.
    case "classic":
      return (
        <>
          <NumberBanner edition={edition} />
          <Zigzag />
          <Masthead edition={edition} />
          <Zigzag />
          {main ? <Hero story={main} reading={reading} /> : null}
          <Zigzag />
          <div className="bs-grid bs-f-classic">
            {main ? (
              <div className="bs-stack">
                <p className="yn-dek bs-dek-big">{main.dek}</p>
                <p className="yn-byline bs-src">From {main.sourceName}</p>
                <Copy story={main} cols={3} dropcap />
              </div>
            ) : null}
            <div className="bs-stack bs-f-rail">
              <Weather edition={edition} />
              <Index edition={edition} reading={reading} />
            </div>
          </div>
          <Zigzag />
          <div className="bs-grid bs-f-pair">
            {others.map((s) => (
              <StoryBlock
                key={s.slug}
                story={s}
                reading={reading}
                size="lg"
                className="bs-second-split"
              />
            ))}
          </div>
        </>
      );

    // Masthead first; the lead's headline across the whole sheet; the picture and the story side
    // by side; the other two stories and the index in a row along the foot.
    case "headline":
      return (
        <>
          <Masthead edition={edition} />
          <Zigzag />
          <NumberBanner edition={edition} compact />
          <Zigzag />
          {main ? (
            <>
              <StoryHead
                story={main}
                reading={reading}
                size="xxl"
                className="bs-head--across bs-head--front"
              />
              <div className={`bs-grid ${photo ? "bs-f-headline" : ""}`}>
                {photo ? <Media story={main} frame="flat" className="bs-m-wide" priority /> : null}
                {lead}
              </div>
            </>
          ) : null}
          <Zigzag />
          <div className="bs-grid bs-f-row3">
            {others.map((s) => (
              <StoryBlock key={s.slug} story={s} reading={reading} size="md" mediaFirst />
            ))}
            <div className="bs-stack bs-f-rail">
              <Weather edition={edition} />
              <Index edition={edition} reading={reading} />
            </div>
          </div>
        </>
      );

    // A rail down the right: the day's number set tall on ink, the weather and the index; the lead
    // takes the rest, and the other two stories run side by side beneath.
    case "rail":
      return (
        <>
          <Masthead edition={edition} />
          <Zigzag />
          <div className="bs-grid bs-f-rail-grid">
            {main ? (
              <div className="bs-stack">
                <Media story={main} frame="print" className="bs-m-wide" priority />
                <StoryHead story={main} reading={reading} size="xl" />
                <Copy story={main} cols={3} dropcap />
              </div>
            ) : null}
            <div className="bs-stack bs-f-rail">
              <NumberTall edition={edition} />
              <Weather edition={edition} />
              <Index edition={edition} reading={reading} />
            </div>
          </div>
          <Zigzag />
          <div className="bs-grid bs-f-pair">
            {others.map((s) => (
              <StoryBlock
                key={s.slug}
                story={s}
                reading={reading}
                size="lg"
                cols={2}
                className="bs-ruled-top"
              />
            ))}
          </div>
        </>
      );

    // The number and masthead up top; the other two stories stacked down the left with their
    // pictures; the lead with its photo beside them; weather and index along the foot.
    case "split":
      return (
        <>
          <NumberBanner edition={edition} />
          <Zigzag />
          <Masthead edition={edition} />
          <Zigzag />
          <div className="bs-grid bs-f-split">
            <div className="bs-stack bs-f-left">
              {s2 ? <StoryBlock story={s2} reading={reading} size="md" mediaFirst /> : null}
              <Weather edition={edition} />
            </div>
            {main ? (
              <div className="bs-stack bs-ruled-left">
                <StoryHead story={main} reading={reading} size="xl" />
                <Media story={main} frame="print" className="bs-m-wide" priority />
                {lead}
                {s3.map((s) => (
                  <StoryBlock
                    key={s.slug}
                    story={s}
                    reading={reading}
                    size="lg"
                    className="bs-second-across bs-ruled-top"
                  />
                ))}
              </div>
            ) : null}
          </div>
          <Zigzag />
          <Index edition={edition} reading={reading} wide />
        </>
      );

    // The lead's headline on a block of pink with its picture pasted over the edge; its text in
    // two columns beside the day's number; the other stories and the index along the foot.
    case "poster":
      return (
        <>
          <Masthead edition={edition} />
          <Zigzag />
          {main ? (
            <div className={`bs-postblock ${photo ? "bs-postblock--photo" : ""}`}>
              <div className="bs-postblock-ink print-worn" aria-hidden />
              <StoryHead story={main} reading={reading} size="xxl" className="bs-postblock-head" />
              {photo ? (
                <Media story={main} frame="print" className="bs-postblock-media" priority />
              ) : null}
            </div>
          ) : null}
          <div className="bs-grid bs-f-poster">
            {lead}
            <div className="bs-stack bs-f-rail">
              <NumberTall edition={edition} />
              <Weather edition={edition} />
            </div>
          </div>
          <Zigzag />
          <div className="bs-grid bs-f-row3">
            {s2 ? <StoryBlock story={s2} reading={reading} size="md" mediaFirst /> : null}
            {s3.map((s) => (
              <StoryBlock key={s.slug} story={s} reading={reading} size="md" mediaFirst />
            ))}
            <Index edition={edition} reading={reading} />
          </div>
        </>
      );
  }
}

/** Spec table, wordmark and read time: the masthead row every front page carries. */
function Masthead({ edition }: { edition: Edition }) {
  const minutes = readMinutes(edition);
  const count = edition.pages.reduce((n, p) => n + p.stories.length, 0);
  return (
    <header className="yn-mast">
      <div className="yn-spec">
        <p className="yn-chunk bs-spec-title">The Daily</p>
        <dl>
          <div>
            <dt>Edition:</dt>
            <dd>
              Vol. {edition.volume} · No. {edition.issueNumber}
            </dd>
          </div>
          <div>
            <dt>Date:</dt>
            <dd>
              <time dateTime={edition.date}>{shortDate(edition.date)}</time>
            </dd>
          </div>
          <div>
            <dt>Stories:</dt>
            <dd>{count}</dd>
          </div>
          <div>
            <dt>Price:</dt>
            <dd>Free</dd>
          </div>
        </dl>
      </div>
      <div className="yn-vrule" />
      <div className="yn-wordmark">
        <h1 className="yn-chunk">The Yay News</h1>
        <p className="yn-hand">Only good news. Mostly fun. Occasionally weird.</p>
      </div>
      <div className="yn-vrule" />
      <div className="yn-readtime print-worn" aria-label={`${minutes} minute read`}>
        <span className="yn-fat">{minutes}</span>
        <span className="yn-hand">
          minutes
          <br />
          to read today&rsquo;s
          <br />
          paper
        </span>
      </div>
    </header>
  );
}

/** The day's number across the top in fluoro yellow. */
function NumberBanner({ edition, compact }: { edition: Edition; compact?: boolean }) {
  const number = featureOf(edition, "number_of_day");
  if (!number) return null;
  return (
    <section
      className={`yn-banner bs-banner ${compact ? "bs-banner--compact" : ""}`}
      aria-label="Number of the day"
    >
      <div className="yn-banner-stack">
        <div className="yn-hand">Today&rsquo;s</div>
        <div className="yn-chunk">Number</div>
      </div>
      <div className="yn-vrule" />
      <div className="yn-banner-number">
        <span
          className="yn-fat fr-number"
          style={{
            fontSize: `calc(var(--u) * ${fitSize(number.value, 120, compact ? 24 : 33, 0.42)})`,
          }}
        >
          <Mark
            name="brush-03"
            ink="var(--neon-pink)"
            className="fr-number-swipe"
            style={STRETCH}
          />
          <span className="relative">{number.value}</span>
        </span>
        <span className="yn-hand bs-banner-caption">{number.caption}</span>
      </div>
    </section>
  );
}

/** The day's number set tall on a block of pink, for a rail. */
function NumberTall({ edition }: { edition: Edition }) {
  const number = featureOf(edition, "number_of_day");
  if (!number) return null;
  return (
    <section className="bs-numtall" aria-label="Number of the day">
      <div className="bs-numtall-ink print-worn" aria-hidden />
      <p className="yn-hand">Today&rsquo;s number</p>
      <p
        className="yn-fat bs-numtall-n"
        style={{ fontSize: `calc(var(--u) * ${fitSize(number.value, 80, 30, 0.42)})` }}
      >
        {number.value}
      </p>
      <p className="bs-numtall-cap">{number.caption}</p>
    </section>
  );
}

function Weather({ edition }: { edition: Edition }) {
  const weather = featureOf(edition, "weather");
  if (!weather) return null;
  return (
    <section className="bs-weather" aria-label="Internet weather">
      <p className="yn-kicker bs-kick">The internet weather</p>
      <h2 className="yn-chunk bs-hed bs-hed--md bs-weather-head">
        {weather.headline}
        <Mark name="stars-06" className="fr-weather-stars" />
      </h2>
      <p className="bs-copy bs-copy--1 yn-body">{weather.detail}</p>
    </section>
  );
}

/** "Inside today": each page, its number and the headline that leads it. */
function Index({ edition, reading, wide }: { edition: Edition; reading: Reading; wide?: boolean }) {
  const pages = [...edition.pages].sort((a, b) => a.order - b.order);
  return (
    <section className={`bs-index ${wide ? "bs-index--wide" : ""}`} aria-label="Inside today">
      <h2 className="yn-label bs-index-title">Inside today</h2>
      <ol>
        {reading.pages.slice(1).map((link, i) => {
          const p = pages[i + 1];
          const lead = p ? storiesOf(p.stories).main : null;
          return (
            <li key={link.slug}>
              <Link href={link.href} className="bs-link bs-index-link">
                <span className="bs-index-name">
                  {link.slug === "back" ? "Puzzles & the back page" : link.label}
                </span>
                <span className="bs-index-p">p.{i + 2}</span>
              </Link>
              {lead ? <span className="bs-index-hed">{lead.headline}</span> : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/** The lead photo across the sheet, the headline pasted on it on a card of pink. */
function Hero({ story, reading }: { story: StoryItem; reading: Reading }) {
  const image = story.images[0];
  return (
    <figure className={`yn-hero bs-front-hero ${image ? "" : "bs-hero-type"}`}>
      {image ? (
        <Media
          story={story}
          frame="flat"
          caption={false}
          sticker={false}
          className="yn-hero-photo"
          priority
        />
      ) : null}
      {story.sticker ? (
        <Sticker text={story.sticker} className="yn-hero-sticker" size={1.3} points={24} />
      ) : null}
      <div className="yn-hero-card">
        <span className="print-tape fr-card-tape-l" aria-hidden />
        <span className="print-tape fr-card-tape-r" aria-hidden />
        <p className="yn-kicker">Today&rsquo;s lead story · {story.kicker}</p>
        <h2 className="yn-chunk">
          <Link href={reading.storyHref(story.slug)} className="bs-link">
            {story.headline}
          </Link>
        </h2>
      </div>
    </figure>
  );
}
