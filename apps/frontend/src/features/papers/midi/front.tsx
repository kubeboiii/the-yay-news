import Link from "next/link";
import { Burst } from "@/features/print/burst";
import { Mark } from "@/features/print/mark";
import type { PageProps } from "../types";
import {
  credit,
  feature,
  Folio,
  lengthClass,
  longDate,
  minutes,
  pageNumberOf,
  PrintPhoto,
  pullQuote,
  ranked,
  readMinutes,
  weekday,
} from "./print";

/**
 * The front: a two-page spread. Page 1 is the cover on apricot — masthead, date, "Inside" strip,
 * the lead's photograph bled off three edges, a sticker and the spec block. Page 2 is the lead
 * story in full beside a margin of the day's numbers, weather and quote, with "Inside today" below.
 */
export function Front({ edition, page, reading }: PageProps) {
  const [lead, ...others] = ranked(page.stories);
  const cover = lead?.images[0] ?? null;
  const number = feature(edition, "number_of_day");
  const weather = feature(edition, "weather");
  const quote = feature(edition, "quote");
  const date = edition.date;

  const inside = reading.pages.filter((p) => p.order !== page.order);
  const insidePages = edition.pages.filter((p) => p.layout !== "front" && p.layout !== "back");
  const firstStory = (order: number) =>
    ranked(edition.pages.find((p) => p.order === order)?.stories ?? [])[0] ?? null;
  const strip = insidePages
    .slice(0, 3)
    .map((p) => ({
      link: reading.pages.find((l) => l.order === p.order)!,
      story: firstStory(p.order),
    }))
    .filter((s) => s.story);
  // A clipping from further in: the first inside story with a photograph.
  const clipPage = insidePages.find((p) => ranked(p.stories)[0]?.images[0]);
  const clip = clipPage ? ranked(clipPage.stories)[0]! : null;
  const clipLink = clipPage ? reading.pages.find((l) => l.order === clipPage.order) : null;

  const allStories = edition.pages.flatMap((p) => p.stories);
  const total = readMinutes(allStories);
  const said = lead ? pullQuote(lead.body) : null;
  const [first, ...rest] = lead?.body ?? [];

  return (
    <div className="print-sheet-wrap">
      <div className="print-spread">
        {/* ---------------- Page 1: the cover ---------------- */}
        <article className="print-sheet print-sheet--bright m5f-cover" aria-label="Cover">
          <div className="m5f-top">
            <p className="m5f-stamp print-worn">{weekday(date)} edition</p>
            <p className="m5f-issue">
              Vol. {edition.volume} · No. {edition.issueNumber} · {longDate(date)} · Free, forever
            </p>
          </div>

          <h1 className="m5-display m5f-mast">The Yay News</h1>
          <div className="m5f-rules" aria-hidden />

          {strip.length ? (
            <nav className="m5f-inside" aria-label="Inside this edition">
              <span className="m5f-inside-label" aria-hidden>
                Inside
              </span>
              <ul style={{ gridTemplateColumns: `repeat(${strip.length}, 1fr)` }}>
                {strip.map(({ link, story }) => (
                  <li key={link.order} className={lengthClass(story!.headline, [48, 70, 90])}>
                    <Link href={link.href}>
                      {story!.headline} <b>{pageNumberOf(reading, link)}</b>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}

          {cover ? (
            <div className="m5f-bleed">
              <PrintPhoto
                image={cover}
                priority
                position="50% 40%"
                sizes="(max-width: 760px) 100vw, 740px"
              />
            </div>
          ) : lead ? (
            <div className="m5f-bleed m5f-bleed--type">
              <p className="m5-kicker">{lead.kicker}</p>
              <p
                className={`m5-display m5f-cover-line ${lengthClass(lead.headline, [40, 70, 100])}`}
              >
                {lead.headline}
              </p>
              <Mark name="sketch-51" className="m5-hm m5f-cover-doodle" />
            </div>
          ) : (
            <div className="m5f-bleed m5f-bleed--type" />
          )}

          {lead?.sticker ? (
            <Burst
              fill="var(--butter-deep)"
              points={13}
              depth={0.13}
              wobble={1}
              className="m5f-sticker print-worn"
            >
              <p className="m5f-sticker-text">
                <span className={`m5-display ${lengthClass(lead.sticker, [9, 14, 22])}`}>
                  {lead.sticker}
                </span>
                <small>{lead.kicker}, page 2</small>
              </p>
            </Burst>
          ) : null}

          <div className="m5f-spec">
            <div className="m5f-spec-l">
              <p className="m5-display m5f-no">No. {edition.issueNumber}</p>
              <dl>
                <dt>Format</dt>
                <dd>Midi, 220 × 310 mm</dd>
                <dt>Reading time</dt>
                <dd>{minutes(total)}, finishable</dd>
                <dt>Stories</dt>
                <dd>{allStories.length}, every one good news</dd>
              </dl>
              {cover ? (
                <p className="m5-caption m5f-cover-cap">
                  Cover: {cover.alt}. <span className="m5-credit">{credit(cover)}</span>
                </p>
              ) : null}
            </div>
            <div className="m5f-box print-worn">
              <b className="m5-display">100%</b>
              <span>good news, 0% doom</span>
            </div>
          </div>
        </article>

        {/* ---------------- Page 2: the lead ---------------- */}
        <article className="print-sheet print-sheet--bright m5-sheet-flow" aria-label="Page 2">
          <Folio page={2} section={lead?.section.name ?? "Front page"} date={date} />
          <div className="m5f-lead">
            <aside className="m5f-side" aria-label="Today in brief">
              {number ? (
                <section>
                  <h2 className="m5f-side-h">The number of the day</h2>
                  <p className={`m5-display m5f-num ${lengthClass(number.value, [5, 8, 12])}`}>
                    {number.value}
                  </p>
                  <p>{number.caption}</p>
                </section>
              ) : null}
              {weather ? (
                <section className="m5f-weather">
                  <h2 className="m5f-side-h">The weather, roughly</h2>
                  <Mark name="sketch-51" className="m5-hm m5f-cloud" />
                  <p className="m5-display m5f-weather-head">{weather.headline}</p>
                  <p>{weather.detail}</p>
                </section>
              ) : null}
              {quote ? (
                <section>
                  <h2 className="m5f-side-h">Overheard</h2>
                  <blockquote className="m5-display m5f-quote">“{quote.text}”</blockquote>
                  <p className="m5-byline">{quote.by}</p>
                </section>
              ) : null}
              {others.map((s) => (
                <section key={s.slug} className="m5f-clip m5f-clip--front print-torn">
                  <p className="m5f-clip-label">{s.kicker}</p>
                  <h2 className="m5-display m5f-clip-head">
                    <Link href={reading.storyHref(s.slug)}>{s.headline}</Link>
                  </h2>
                  <p className="m5f-clip-dek">{s.dek}</p>
                </section>
              ))}
              {clip && clipLink ? (
                <section className="m5f-clip print-torn">
                  <PrintPhoto image={clip.images[0]!} sizes="(max-width: 760px) 90vw, 160px" />
                  <p className="m5f-clip-label">
                    Also today, page {pageNumberOf(reading, clipLink)}
                  </p>
                  <h2 className="m5-display m5f-clip-head">
                    <Link href={reading.storyHref(clip.slug)}>{clip.headline}</Link>
                  </h2>
                  <p className="m5-credit">{credit(clip.images[0]!)}</p>
                </section>
              ) : null}
            </aside>

            <div className="m5f-main">
              {lead ? (
                <>
                  <div className={cover ? "m5f-top-row m5f-top-row--still" : "m5f-top-row"}>
                    <div>
                      <p className="m5-kicker">
                        {lead.section.name} · {lead.kicker}
                      </p>
                      <h2
                        className={`m5-display m5f-hero ${lengthClass(lead.headline, [36, 64, 96])}`}
                      >
                        <Link href={reading.storyHref(lead.slug)}>{lead.headline}</Link>
                      </h2>
                    </div>
                    {cover ? (
                      <figure className="m5-pasted print-print m5f-still">
                        <PrintPhoto
                          image={cover}
                          position="72% 62%"
                          sizes="(max-width: 760px) 80vw, 200px"
                        />
                        <span className="print-tape m5f-still-tape" aria-hidden />
                        <figcaption className="m5-credit">{cover.credit}</figcaption>
                      </figure>
                    ) : null}
                  </div>
                  <p className="m5f-dek">{lead.dek}</p>
                  <p className="m5-byline m5f-byline">
                    By the Yay {lead.section.name.toLowerCase()} desk{" "}
                    <i>· {minutes(lead.readMinutes)} to read</i>
                  </p>
                  <div className="m5-body m5f-body">
                    {first ? <p className="m5f-drop">{first}</p> : null}
                    {rest.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                  <p className="m5-more">
                    <Link href={reading.storyHref(lead.slug)}>
                      The whole story, with its source <span aria-hidden>→</span>
                    </Link>
                  </p>
                  {said ? (
                    <blockquote className="m5-display m5f-pull">
                      “{said}”
                      <Mark name="brush-03" ink="var(--apricot-deep)" className="m5f-pull-mark" />
                    </blockquote>
                  ) : null}
                </>
              ) : null}

              <section className="m5f-contents" aria-labelledby="m5f-contents">
                <h2 id="m5f-contents" className="m5-display">
                  Inside today
                </h2>
                <ol>
                  {inside.map((l) => {
                    const p = edition.pages.find((x) => x.order === l.order);
                    const top = p ? ranked(p.stories)[0] : null;
                    return (
                      <li key={l.order}>
                        <Link href={l.href}>
                          <i className="m5-display">{pageNumberOf(reading, l)}</i>
                          <b>{l.slug === "back" ? "Puzzles & the back page" : l.label}</b>
                          <span>
                            {top?.headline ??
                              (l.slug === "back"
                                ? "The Mini, a ladder, a riddle, and the small ads"
                                : (p?.section?.tagline ?? ""))}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              </section>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
