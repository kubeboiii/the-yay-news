import type { StoryItem } from "@repo/shared";
import Link from "next/link";
import { Mark } from "@/features/print/mark";
import type { PageLink, PageProps } from "../types";
import {
  capitalise,
  editionMinutes,
  featureOf,
  folioDate,
  isWeekendDate,
  issueLine,
  longDate,
  ordered,
  sentence,
  weekday,
} from "./edition-data";
import { Barcode, Body, Folio, Masthead, Photo, Sheet, Tape, fit } from "./parts";
import { Jump, Source, Splash, fs } from "./story-bits";

const WORDS = [
  "No",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
];
const countWord = (n: number) => WORDS[n] ?? String(n);

type Teaser = { story: StoryItem; page: PageLink };

/** Two stories from inside to trail above the splash: one with a photograph if there is one. */
function teasersFor({ edition, reading }: PageProps): Teaser[] {
  const inside = [...edition.pages]
    .filter((p) => p.layout !== "front" && p.layout !== "back")
    .sort((a, b) => a.order - b.order)
    .flatMap((p) => {
      const link = reading.pages.find((l) => l.order === p.order);
      const top = ordered(p.stories)[0];
      return link && top ? [{ story: top, page: link }] : [];
    });
  const pictured = inside.find((t) => t.story.images.length > 0);
  const first = pictured ?? inside[0];
  const second = inside.find((t) => t !== first && t.page !== first?.page);
  return [first, second].filter((t): t is Teaser => Boolean(t));
}

export function Front(props: PageProps) {
  const { edition, page, reading } = props;
  const lead = ordered(page.stories)[0];
  const others = ordered(page.stories).slice(1);
  const number = featureOf(edition, "number_of_day");
  const weather = featureOf(edition, "weather");
  const date = folioDate(edition.date);
  const weekend = isWeekendDate(edition.date);
  const [t1, t2] = teasersFor(props);
  const t1Image = t1?.story.images[0];
  const index = reading.pages.filter((p) => p.order !== reading.current.order);

  return (
    <Sheet theme="front" label={`The Yay News, ${longDate(edition.date)}`}>
      <Masthead
        title="The Yay News"
        specTitle="Today's paper"
        spec={[
          ["Date", date],
          ["Issue", issueLine(edition)],
          ["Read time", `${editionMinutes(edition)} min, then done`],
        ]}
        box={
          <>
            <span className="tb-box-words">
              Free
              <small>forever · No. {edition.issueNumber}</small>
            </span>
            <Barcode />
          </>
        }
      />

      {t1 ? (
        <section
          className={`tb-front2-teasers ${t1Image ? "" : "tb-front2-teasers--plain"} ${t2 ? "" : "tb-front2-teasers--one"}`}
          aria-label="Also inside"
        >
          {t1Image ? (
            <div className="tb-pasted print-print tb-front2-cat">
              <Photo image={t1Image} sizes="(max-width: 760px) 70vw, 160px" width={600} />
              <Tape />
              <span className="tb-pasted-cap" aria-hidden>
                {t1.story.kicker}
              </span>
            </div>
          ) : null}
          {[t1, t2].map((t, i) =>
            t ? (
              <Link
                key={t.story.slug}
                href={reading.storyHref(t.story.slug)}
                className={i === 1 ? "tb-teaser2" : "tb-teaser1"}
              >
                <p
                  className="tb-teaser-head tb-cond"
                  style={fs(
                    fit(t.story.headline, {
                      max: i === 0 ? 8.4 : 6.4,
                      min: 5,
                      measure: i === 0 ? 92 : 100,
                      lines: 3,
                      em: 0.5,
                    }),
                  )}
                >
                  {t.story.headline}
                </p>
                <p className="tb-teaser-jump">
                  {t.page.label}, <b>page {t.page.order} →</b>
                </p>
              </Link>
            ) : null,
          )}
        </section>
      ) : null}

      {lead ? (
        <Splash
          story={lead}
          href={reading.storyHref(lead.slug)}
          bleed
          measure={250}
          priority
          className="tb-front-splash"
          note={weekend ? `happy ${weekday(edition.date)}!` : undefined}
          stamp={
            <>
              {weekend ? "Weekend edition" : `${weekday(edition.date)} edition`}
              <small>{longDate(edition.date)}</small>
            </>
          }
        />
      ) : null}

      <section className="tb-band tb-front2-band" aria-label="Today's stories">
        <article className="tb-col">
          {lead ? (
            <div className="tb-story-cols">
              <p className="tb-byline">
                By our {lead.section.name} desk · <b>{lead.readMinutes} min read</b>
              </p>
              {lead.images.length ? <p className="tb-dek">{lead.dek}</p> : null}
              <Body paragraphs={lead.body} dropcap />
              <Source
                story={lead}
                extra={lead.images[0] ? `Photo: ${lead.images[0].credit}` : undefined}
              />
              <Jump href={reading.storyHref(lead.slug)} />
            </div>
          ) : null}
          {others.map((s) => (
            <div key={s.slug} className="tb-front-more">
              <p className="tb-kicker">{s.kicker}:</p>
              <h3 className="tb-cond tb-h3-sm">
                <Link href={reading.storyHref(s.slug)}>{s.headline}</Link>
              </h3>
              <p className="tb-dek">{s.dek}</p>
              <Jump href={reading.storyHref(s.slug)} />
            </div>
          ))}
        </article>

        <nav className="tb-col" aria-labelledby="inside-today">
          <div className="tb-colhead">
            <p className="tb-kicker">Inside today:</p>
            <h2 id="inside-today" className="tb-cond tb-h3">
              {countWord(reading.pages.length)} pages, all good
            </h2>
          </div>
          <ol className="tb-index">
            {index.map((p) => (
              <li key={p.order}>
                <Link href={p.href}>
                  <span>{p.label}</span>
                  <b>{p.order}</b>
                </Link>
              </li>
            ))}
          </ol>
        </nav>

        <aside className="tb-col" aria-label="Number of the day and the weather">
          {number ? (
            <>
              <p className="tb-kicker">Number of the day:</p>
              <p
                className="tb-front2-num tb-cond"
                style={fs(fit(number.content.value, { max: 17, min: 8, measure: 56, em: 0.6 }))}
              >
                <span className="tb-underline">
                  {number.content.value}
                  <Mark name="brush-03" ink="var(--a)" className="tb-mark tb-over" />
                </span>
              </p>
              <p>{sentence(capitalise(number.content.caption))}</p>
            </>
          ) : null}
          {weather ? (
            <div className={number ? "tb-weather" : ""}>
              <p className="tb-kicker">Weather:</p>
              <h2 className="tb-weather-head tb-cond">{weather.content.headline}</h2>
              <p>{weather.content.detail}</p>
            </div>
          ) : null}
        </aside>
      </section>

      <Folio page={page.order} section="Front page" date={date} issue={issueLine(edition)} />
    </Sheet>
  );
}
