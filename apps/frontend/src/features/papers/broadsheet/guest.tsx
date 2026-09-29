import type { Edition } from "@repo/shared";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Mark } from "@/features/print/mark";
import type { PageProps } from "../types";
import {
  RULE_WORDS,
  featureOf,
  featuresOf,
  fitSize,
  isLong,
  longDate,
  posterSize,
  shortDate,
  weekday,
} from "./lib";
import { Body, Folio, Photo, Stamp, Sticker, Zigzag, byline } from "./parts";
import { FurnitureRow, Hed, MoreStories, ReadOn, ordered } from "./section";

// The rotating guest section: a supplement tucked into the middle of the paper for one day. It
// swaps the running head for a full-width band of its own ink, sets its feature like a magazine
// spread, and carries one extra that belongs to the guest (the word of the day for Food & Words,
// letters for Reader-made, a hundred years ago for On This Day, the paper's own type for Art,
// Design & Books).

export function Guest({ edition, page, reading }: PageProps) {
  const section = page.section;
  const [first, ...rest] = ordered(page.stories);
  const words = RULE_WORDS.guest;
  const n = reading.pages.indexOf(reading.current) + 1;
  const image = first?.images[0];
  const name = section?.name ?? "Guest section";
  const long = first ? isLong(first.body) : false;
  const storyText = first ? (
    <div className="bs-spread-text">
      <div>
        <p className="yn-dek bs-dek-big">{first.dek}</p>
        <p className="yn-byline mt-[calc(var(--u)*3)]">{byline(first)}</p>
        {image ? (
          <p className="yn-caption bs-cap">
            {image.alt}. <span className="yn-credit">Photo: {image.credit}</span>
          </p>
        ) : null}
      </div>
      <div>
        <Body
          paragraphs={first.body}
          className={`yn-dropcap ${isLong(first.body) ? "bs-cols-2" : ""}`}
        />
        <ReadOn story={first} reading={reading} />
      </div>
    </div>
  ) : null;

  return (
    <div className="yn-sheet-wrap">
      <article className="yn-sheet yn-inside yn-theme-guest bs-inside bs-guest">
        <header className="bs-guest-band">
          <div className="bs-guest-band-ink print-worn" aria-hidden />
          <div className="bs-guest-page">
            <span className="yn-hand">page</span>
            <span className="yn-fat">{n}</span>
          </div>
          <div className="bs-guest-title">
            <p className="yn-hand bs-guest-presents">
              <Link href={reading.pages[0]?.href ?? "/"} className="bs-link">
                The Yay News
              </Link>{" "}
              presents today&rsquo;s guest section
            </p>
            <h1
              className="yn-chunk bs-guest-h1"
              style={{ fontSize: `calc(var(--u) * ${fitSize(name, 220, 36, 0.29)})` }}
            >
              {name}
            </h1>
            <p className="yn-hand bs-guest-tag">{section?.tagline}</p>
          </div>
          <Sticker
            text="One day only"
            fill="var(--pop2)"
            ink="var(--pop2-ink)"
            className="bs-guest-sticker print-worn"
            size={1.1}
          />
        </header>
        <p className="bs-guest-dateline">
          <span>{weekday(edition.date)}</span>
          <span>{longDate(edition.date)}</span>
          <span>
            Vol. {edition.volume} · No. {edition.issueNumber}
          </span>
          <span>Pull it out, keep it, pass it on</span>
        </p>

        <Zigzag word={words[0]} />

        <div className="bs-main">
          {first ? (
            <section className="bs-spread" aria-label={first.kicker}>
              <div className="bs-spread-main">
                <figure
                  className={`yn-hero bs-solo-hero bs-spread-hero ${image ? "" : "bs-solo-hero--type"}`}
                  style={
                    {
                      "--poster": posterSize(first.headline, 200_000, 700, 40).toFixed(1),
                    } as CSSProperties
                  }
                >
                  {image ? (
                    <Photo
                      image={image}
                      className="yn-hero-photo"
                      sizes="(max-width: 760px) 100vw, 900px"
                      priority
                      width={2000}
                    />
                  ) : (
                    <Mark name="stars-06" ink="var(--pop-ink)" className="bs-solo-stars" />
                  )}
                  {first.sticker ? (
                    <Sticker text={first.sticker} className="yn-hero-sticker" size={1.3} />
                  ) : null}
                  <div className="yn-hero-card bs-solo-card">
                    <span className="print-tape fr-card-tape-l" aria-hidden />
                    <span className="print-tape fr-card-tape-r" aria-hidden />
                    <p className="yn-kicker">{first.kicker}</p>
                    <Hed story={first} reading={reading} className="bs-solo-hed" />
                    {image ? (
                      <span className="yn-credit">@theyaynews via {image.credit}</span>
                    ) : null}
                  </div>
                </figure>
                {long ? storyText : null}
              </div>
              <div className="bs-spread-side">
                <GuestExtra edition={edition} slug={section?.slug ?? ""} />
                {long ? null : storyText}
                <aside className="bs-guest-note">
                  <p className="yn-label">About this section</p>
                  <p className="yn-body">
                    {section?.name ?? "A guest section"} is one of the paper&rsquo;s guest sections.
                    They take turns: one gets a page every other day, then makes way for the next.
                  </p>
                </aside>
              </div>
            </section>
          ) : null}

          {rest.length ? (
            <>
              <Zigzag word={words[1]} />
              <MoreStories
                stories={rest}
                reading={reading}
                theme="guest"
                edition={edition}
                page={page}
              />
            </>
          ) : null}
        </div>

        <Zigzag word={words[2]} />
        <FurnitureRow edition={edition} page={page} reading={reading} />
        <Folio edition={edition} reading={reading} section={section?.name ?? "Guest section"} />
      </article>
    </div>
  );
}

/** Guest sections whose extra is taken off the back page and printed here instead. */
export const guestTakes = (edition: Edition): "word_of_the_day" | "letter" | null =>
  edition.guestSection?.slug === "food-and-words"
    ? "word_of_the_day"
    : edition.guestSection?.slug === "reader-made"
      ? "letter"
      : null;

function GuestExtra({ edition, slug }: { edition: Edition; slug: string }) {
  const word = featureOf(edition, "word_of_the_day");
  const letters = featuresOf(edition, "letter");
  if (slug === "food-and-words" && word) return <WordCard word={word} />;
  if (slug === "reader-made" && letters.length) {
    return (
      <aside className="bs-extra bs-letters">
        <p className="yn-label">Letters to the editor</p>
        {letters.map((l, i) => (
          <figure key={i} className="bs-letter">
            <blockquote className="yn-body">{l.text}</blockquote>
            <figcaption className="yn-pullquote-by">— {l.from}</figcaption>
          </figure>
        ))}
      </aside>
    );
  }
  if (slug === "on-this-day") return <HundredYears date={edition.date} />;
  if (slug === "art-design-and-books") return <Specimen />;
  return null;
}

export function WordCard({
  word,
}: {
  word: { word: string; pronunciation: string; meaning: string; example: string };
}) {
  return (
    <aside className="bs-extra bs-word">
      <div className="bs-extra-ink print-worn" aria-hidden />
      <p className="yn-label">Word of the day</p>
      <p className="yn-chunk bs-word-word">{word.word}</p>
      <p className="bs-word-say">{word.pronunciation}</p>
      <p className="yn-body bs-word-means">{word.meaning}</p>
      <p className="yn-hand bs-word-eg">&ldquo;{word.example}&rdquo;</p>
    </aside>
  );
}

/** The same date a hundred years earlier, worked out rather than written in. */
function HundredYears({ date }: { date: string }) {
  const [y, m, d] = date.split("-");
  const then = `${Number(y) - 100}-${m}-${d}`;
  const days = Math.round(
    (Date.parse(`${date}T00:00:00Z`) - Date.parse(`${then}T00:00:00Z`)) / 86_400_000,
  );
  return (
    <aside className="bs-extra bs-then">
      <div className="bs-extra-ink print-worn" aria-hidden />
      <p className="yn-label">A hundred years ago today</p>
      <p className="yn-chunk bs-then-day">{weekday(then)}</p>
      <p className="yn-chunk bs-then-date">{longDate(then)}</p>
      <p className="yn-body">
        Exactly {days.toLocaleString("en-GB")} days before this paper, {shortDate(date)}. Every one
        of them had some good news in it somewhere.
      </p>
      <Stamp className="bs-then-stamp">
        Est.
        <br />
        {Number(y) - 100}
      </Stamp>
    </aside>
  );
}

/** The paper's own typefaces, set as a specimen card: the design desk's page, about itself. */
function Specimen() {
  return (
    <aside className="bs-extra bs-specimen">
      <p className="yn-label">Set in this paper</p>
      <p className="bs-spec-row">
        <span className="yn-chunk bs-spec-aa">Aa</span>
        <span>
          <b>League Gothic</b> for the headlines, the masthead and every big number.
        </span>
      </p>
      <p className="bs-spec-row">
        <span className="bs-spec-aa bs-spec-serif">Aa</span>
        <span>
          <b>Libre Caslon Text</b> for everything you read, italics included.
        </span>
      </p>
      <p className="bs-spec-row">
        <span className="bs-spec-aa bs-spec-sans">Aa</span>
        <span>
          <b>Libre Franklin</b> for the small print: bylines, folios, labels.
        </span>
      </p>
      <Mark name="arrows-07" className="bs-spec-arrow" />
    </aside>
  );
}
