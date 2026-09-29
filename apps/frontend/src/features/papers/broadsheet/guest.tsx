import type { Edition } from "@repo/shared";
import Link from "next/link";
import type { PageProps } from "../types";
import { Briefs, Copy, InkPull, Media, StoryBlock, StoryHead } from "./blocks";
import { featureOf, featuresOf, fitSize, guestComp, longDate, storiesOf, weekday } from "./lib";
import { Folio, Zigzag } from "./parts";

// The rotating guest section: a supplement tucked into the paper for one day. It swaps the
// running head for a full-width band of its own ink, and is composed one of two ways: a cover
// (the main picture across the page with its head pasted on) or columns. It carries the
// edition's word of the day (Food & Words) or letters (Reader-made) when it has them.

export function Guest({ edition, page, reading }: PageProps) {
  const section = page.section;
  const comp = guestComp(edition, page);
  const { main, second, extra, briefs } = storiesOf(page.stories);
  const more = [second, ...extra].filter((s) => s !== null);
  const n = reading.pages.indexOf(reading.current) + 1;
  const name = section?.name ?? "Guest section";
  const extraBox = <GuestExtra edition={edition} slug={section?.slug ?? ""} />;

  return (
    <div className="yn-sheet-wrap">
      <article
        className={`yn-sheet yn-inside yn-theme-guest bs-inside bs-guest bs-guest--${comp}`}
        data-comp={comp}
      >
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
              · today&rsquo;s guest section
            </p>
            <h1
              className="yn-chunk bs-guest-h1"
              style={{ fontSize: `calc(var(--u) * ${fitSize(name, 260, 36, 0.29)})` }}
            >
              {name}
            </h1>
            <p className="yn-hand bs-guest-tag">{section?.tagline}</p>
          </div>
          <p className="bs-guest-date">
            {weekday(edition.date)}
            <br />
            {longDate(edition.date)}
            <br />
            No. {edition.issueNumber}
          </p>
        </header>

        <Zigzag />

        <div className="bs-page">
          {main && comp === "cover" ? (
            <>
              <figure className="yn-hero bs-picture">
                <Media story={main} frame="flat" className="bs-picture-media" priority />
                <div className="yn-hero-card bs-picture-card">
                  <span className="print-tape fr-card-tape-l" aria-hidden />
                  <span className="print-tape fr-card-tape-r" aria-hidden />
                  <StoryHead story={main} reading={reading} size="xl" dek={false} />
                </div>
              </figure>
              <div className="bs-grid bs-g-guestcover">
                <div className="bs-stack">
                  <p className="yn-dek bs-dek-big">{main.dek}</p>
                  <Copy story={main} cols={2} dropcap />
                </div>
                {extraBox}
              </div>
              <Zigzag />
              <div className="bs-grid bs-g-foot">
                <div className="bs-stack">
                  {more.map((s) => (
                    <StoryBlock
                      key={s.slug}
                      story={s}
                      reading={reading}
                      size="lg"
                      cols={2}
                      className="bs-second-split"
                    />
                  ))}
                </div>
                <Briefs stories={briefs} reading={reading} variant="rail" />
              </div>
            </>
          ) : main ? (
            <div className="bs-grid bs-g-guestcols">
              <div className="bs-stack">
                <StoryHead
                  story={main}
                  reading={reading}
                  size="xxl"
                  dek={Boolean(main.images[0])}
                />
                {main.images[0] ? (
                  <Media story={main} frame="print" className="bs-m-wide" priority />
                ) : (
                  <InkPull story={main} />
                )}
                <Copy story={main} cols={2} dropcap />
              </div>
              <div className="bs-stack bs-ruled-left">
                {extraBox}
                {more.map((s) => (
                  <StoryBlock key={s.slug} story={s} reading={reading} size="md" mediaFirst />
                ))}
                <Briefs stories={briefs} reading={reading} variant="numbered" />
              </div>
            </div>
          ) : null}
        </div>

        <Folio edition={edition} reading={reading} section={name} />
      </article>
    </div>
  );
}

/** Guest sections whose feature is taken off the back page and printed here instead. */
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
        <h2 className="yn-label">Letters to the editor</h2>
        {letters.map((l, i) => (
          <figure key={i} className="bs-letter">
            <blockquote className="yn-body bs-copy">{l.text}</blockquote>
            <figcaption className="yn-pullquote-by">— {l.from}</figcaption>
          </figure>
        ))}
      </aside>
    );
  }
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
      <h2 className="yn-label">Word of the day</h2>
      <p className="yn-chunk bs-word-word">{word.word}</p>
      <p className="bs-word-say">{word.pronunciation}</p>
      <p className="yn-body bs-word-means">{word.meaning}</p>
      <p className="yn-hand bs-word-eg">&ldquo;{word.example}&rdquo;</p>
    </aside>
  );
}
