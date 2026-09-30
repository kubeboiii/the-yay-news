import Link from "next/link";
import type { ReactNode } from "react";
import { Burst } from "@repo/ui/print/burst";
import { Mark } from "@repo/ui/print/mark";
import type { PageProps, Reading, StoryItem } from "../types";
import { Body, Photo, StoryHead } from "./blocks";
import { type FrontComposition, frontComposition } from "./compose";
import {
  feature,
  Folio,
  lengthClass,
  longDate,
  minutes,
  pageNumberOf,
  PrintPhoto,
  ranked,
  weekday,
} from "./print";
import type { Edition } from "@repo/shared";
import { WeekInPictures, editionName } from "../weekend";

// The front route prints the cover (page 1) on its own, then the opening spread (pages 2–3). The
// cover carries the masthead, the date, the lead's headline and standfirst and the one "Inside
// today" index; the spread carries the lead's text, the two other front-page stories and the
// day's number, weather and quote. Three compositions (compose.ts) take turns day by day:
//
//   photo-cover   the lead's photograph bled off the cover, the index down its left side;
//                 the lead's text on page 2 over the day's figures, the two stories side by side.
//   type-cover    the lead's headline set huge as the cover, the index in two columns below;
//                 page 2 opens on the photograph, page 3 on the figures above the two stories.
//   framed-cover  the photograph pasted onto the cover as a print, the index in a box;
//                 page 2 runs the figures down a rail beside the two stories, page 3 the lead.

function Index({ edition, reading, variant }: PageProps & { variant: "rail" | "cols" | "box" }) {
  const inside = reading.pages.filter((l) => l.order !== reading.current.order);
  return (
    <nav className={`m5c-index m5c-index--${variant}`} aria-label="Inside today">
      <h2 className="m5-display m5c-index-h">Inside today</h2>
      <ol>
        {inside.map((l) => {
          const p = edition.pages.find((x) => x.order === l.order);
          const top = p ? ranked(p.stories)[0] : null;
          return (
            <li key={l.order}>
              <Link href={l.href}>
                <b className="m5-display">{pageNumberOf(reading, l)}</b>
                <span className="m5c-index-name">{l.slug === "back" ? "Puzzles" : l.label}</span>
                {top ? <span className="m5c-index-line">{top.headline}</span> : null}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function Masthead({ edition }: { edition: Edition }) {
  return (
    <>
      <div className="m5c-top">
        <p className="m5f-stamp print-worn">
          {editionName(edition.date) ?? `${weekday(edition.date)} edition`}
        </p>
        <p className="m5c-issue">
          Vol. {edition.volume} · No. {edition.issueNumber} · {longDate(edition.date)}
        </p>
      </div>
      <h1 className="m5-display m5c-mast">The Yay News</h1>
      <div className="m5c-rules" aria-hidden />
      <p className="m5c-tagline">All the good news, and none of the rest</p>
    </>
  );
}

function Sticker({ text }: { text: string | null | undefined }) {
  if (!text) return null;
  return (
    <Burst
      fill="var(--butter-deep)"
      points={13}
      depth={0.13}
      wobble={1}
      className="m5c-sticker print-worn"
    >
      <p className="m5c-sticker-text">
        <span className={`m5-display ${lengthClass(text, [9, 14, 22])}`}>{text}</span>
      </p>
    </Burst>
  );
}

function Figures({ edition, variant }: { edition: Edition; variant: "band" | "rail" }) {
  const number = feature(edition, "number_of_day");
  const weather = feature(edition, "weather");
  const quote = feature(edition, "quote");
  if (!number && !weather && !quote) return null;
  return (
    <aside className={`m5c-figures m5c-figures--${variant}`} aria-label="Today in figures">
      {number ? (
        <section>
          <h2 className="m5c-fig-h">The number of the day</h2>
          <p className={`m5-display m5c-num ${lengthClass(number.value, [5, 8, 12])}`}>
            {number.value}
          </p>
          <p className="m5c-fig-text">{number.caption}</p>
        </section>
      ) : null}
      {weather ? (
        <section className="m5c-weather">
          <h2 className="m5c-fig-h">The weather, roughly</h2>
          <Mark name="sketch-51" className="m5-hm m5c-cloud" />
          <p className="m5-display m5c-weather-head">{weather.headline}</p>
          <p className="m5c-fig-text">{weather.detail}</p>
        </section>
      ) : null}
      {quote ? (
        <section>
          <h2 className="m5c-fig-h">Overheard</h2>
          {/* A short remark is set bigger, so it fills its column as far down as its neighbours. */}
          <blockquote
            className="m5-display m5c-quote"
            style={
              quote.text.length < 90
                ? { fontSize: `calc(var(--u) * ${quote.text.length < 50 ? 9 : 7})` }
                : undefined
            }
          >
            “{quote.text}”
          </blockquote>
          <p className="m5-byline">{quote.by}</p>
        </section>
      ) : null}
    </aside>
  );
}

function CoverLine({ lead, reading }: { lead: StoryItem; reading: Reading }) {
  return (
    <div className="m5c-line">
      <p className="m5-kicker">
        {lead.section.name} · {lead.kicker}
      </p>
      <h2 className={`m5-display m5c-line-head ${lengthClass(lead.headline, [44, 66, 90])}`}>
        <Link href={reading.storyHref(lead.slug)}>{lead.headline}</Link>
      </h2>
      <p className="m5c-line-dek">{lead.dek}</p>
    </div>
  );
}

function Story({
  story,
  reading,
  photo,
  cols,
}: {
  story: StoryItem;
  reading: Reading;
  photo: "top" | "inset" | "none";
  cols: 1 | 2;
}) {
  const image = photo !== "none" ? story.images[0] : undefined;
  return (
    <section className="m5k-second m5k-second--ruled" aria-labelledby={`h-${story.slug}`}>
      {image && photo === "top" ? (
        <Photo
          image={image}
          plates={story}
          className="m5k-photo--second"
          sizes="(max-width: 760px) 100vw, 400px"
        />
      ) : null}
      <StoryHead
        story={story}
        reading={reading}
        size="mid"
        kicker={`${story.section.name} · ${story.kicker}`}
      />
      {image && photo === "inset" ? (
        <div className="m5-body m5-read m5-read--2 m5k-inset-flow">
          <Photo
            image={image}
            className="m5k-photo--inset"
            sizes="(max-width: 760px) 100vw, 320px"
          />
          {story.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      ) : (
        <Body story={story} cols={cols} />
      )}
    </section>
  );
}

const leadByline = (lead: StoryItem) =>
  `The cover story · by the Yay ${lead.section.name.toLowerCase()} desk · ${minutes(lead.readMinutes)} to read`;

function Cover({
  composition,
  lead,
  props,
}: {
  composition: FrontComposition;
  lead?: StoryItem;
  props: PageProps;
}) {
  const { edition, reading } = props;
  const image = lead?.images[0];
  return (
    <div className="print-sheet-wrap m5c-cover-wrap">
      <div className="print-spread m5c-single">
        <article
          className={`print-sheet print-sheet--bright m5c-cover m5c-cover--${composition}`}
          aria-label="Cover"
        >
          <Masthead edition={edition} />
          {composition === "photo-cover" && image ? (
            <>
              <div className="m5c-cover-body">
                <Index {...props} variant="rail" />
                <div className="m5c-bleed">
                  <PrintPhoto
                    image={image}
                    plates={lead}
                    priority
                    sizes="(max-width: 760px) 100vw, 560px"
                  />
                  <Sticker text={lead?.sticker} />
                </div>
              </div>
              {lead ? <CoverLine lead={lead} reading={reading} /> : null}
            </>
          ) : null}
          {composition === "type-cover" ? (
            <>
              <div className="m5c-type">
                {lead ? <CoverLine lead={lead} reading={reading} /> : null}
                <Sticker text={lead?.sticker} />
              </div>
              <Index {...props} variant="cols" />
            </>
          ) : null}
          {composition === "framed-cover" && image ? (
            <>
              <div className="m5c-framed">
                <Photo
                  image={image}
                  plates={lead}
                  className="m5c-print"
                  sizes="(max-width: 760px) 100vw, 520px"
                  pasted
                  priority
                />
                <Sticker text={lead?.sticker} />
              </div>
              {lead ? <CoverLine lead={lead} reading={reading} /> : null}
              <Index {...props} variant="box" />
            </>
          ) : null}
        </article>
      </div>
    </div>
  );
}

export function Front(props: PageProps) {
  const { edition, page, reading } = props;
  const composition = frontComposition(edition, page);
  const [lead, ...others] = ranked(page.stories);
  const date = edition.date;
  const sheet = (n: 2 | 3, name: string, children: ReactNode, cls?: string) => (
    <article
      className={`print-sheet print-sheet--bright m5-sheet-flow ${cls ?? ""}`}
      aria-label={`Page ${n}`}
    >
      <Folio page={n} section={name} date={date} />
      <div className="m5-page-flow">{children}</div>
    </article>
  );
  const leadText = lead ? (
    <section className="m5k-main" aria-label={lead.headline}>
      <p className="m5-byline m5k-by m5k-by--rule">{leadByline(lead)}</p>
      <Body story={lead} drop />
    </section>
  ) : null;
  const stories = (photo: "top" | "inset", cols: 1 | 2) =>
    others.map((s) => <Story key={s.slug} story={s} reading={reading} photo={photo} cols={cols} />);
  const pictures = <WeekInPictures edition={edition} reading={reading} max={5} />;

  let left: ReactNode;
  let right: ReactNode;
  if (composition === "photo-cover") {
    left = sheet(
      2,
      lead?.section.name ?? "Front",
      <>
        {leadText}
        <Figures edition={edition} variant="band" />
      </>,
    );
    right = sheet(
      3,
      "Front",
      <>
        <div className="m5k-two">{stories("top", 1)}</div>
        {pictures}
      </>,
    );
  } else if (composition === "type-cover") {
    left = sheet(
      2,
      lead?.section.name ?? "Front",
      <>
        {lead?.images[0] ? (
          <Photo
            image={lead.images[0]}
            plates={lead}
            className="m5k-photo--top m5c-lead-photo"
            sizes="(max-width: 760px) 100vw, 640px"
            priority
          />
        ) : null}
        {leadText}
      </>,
    );
    right = sheet(
      3,
      "Front",
      <>
        <Figures edition={edition} variant="band" />
        {stories("inset", 2)}
        {pictures}
      </>,
    );
  } else {
    left = sheet(
      2,
      "Front",
      <div className="m5c-railed">
        <Figures edition={edition} variant="rail" />
        <div className="m5c-railed-main">{stories("top", 1)}</div>
      </div>,
    );
    right = sheet(
      3,
      lead?.section.name ?? "Front",
      <>
        {leadText}
        {pictures}
      </>,
    );
  }

  return (
    <div className="m5k" data-composition={composition} data-ground="apricot">
      <Cover composition={composition} lead={lead} props={props} />
      <div className="print-sheet-wrap m5c-spread-wrap">
        <div className="print-spread">
          {left}
          {right}
        </div>
      </div>
    </div>
  );
}
