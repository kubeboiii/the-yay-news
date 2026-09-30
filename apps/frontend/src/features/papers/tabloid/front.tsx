import type { StoryItem } from "@repo/shared";
import Link from "next/link";
import { Mark } from "@/features/print/mark";
import type { PageProps } from "../types";
import { WeekInPictures, editionName } from "../weekend";
import { type Area, frontComposition, gridStyle, places } from "./compose";
import {
  capitalise,
  editionMinutes,
  featureOf,
  folioDate,
  issueLine,
  longDate,
  ordered,
  sentence,
} from "./edition-data";
import { Barcode, Folio, Masthead, Sheet, fit } from "./parts";
import { roles } from "./section";
import { AreaBox, MainPhoto, SecondStory, StoryHead, StoryText, fs, measureOf } from "./story-bits";

// The front page: the masthead, the lead story printed whole, the front's other stories, and a
// rail with the one index of the paper, the number of the day and the weather. It has three
// compositions and walks through them issue by issue, so no two days' fronts look alike.

export function Front({ edition, page, reading }: PageProps) {
  const stories = ordered(page.stories);
  const lead = stories.find((s) => s.slot === "lead") ?? stories[0];
  // The front's other stories: the one with a picture takes the wider slot.
  const [f1, f2, ...more] = stories
    .filter((s) => s !== lead)
    .sort((a, b) => b.images.length - a.images.length);
  const number = featureOf(edition, "number_of_day");
  const weather = featureOf(edition, "weather");
  const date = folioDate(edition.date);
  const composition = frontComposition(edition, lead);
  const at = places(composition);
  const present: Area[] = [
    "rail",
    ...(lead ? (["head", "body"] as Area[]) : []),
    ...(lead?.images.length ? (["photo"] as Area[]) : []),
    ...(f1 ? (["f1"] as Area[]) : []),
    ...(f2 ? (["f2"] as Area[]) : []),
  ];
  const onPhoto = composition.onPhoto && Boolean(lead?.images.length);
  const href = (s: StoryItem) => reading.storyHref(s.slug);
  const index = reading.pages.filter((p) => p.order !== reading.current.order);
  const mainOf = (order: number) => {
    const p = edition.pages.find((x) => x.order === order);
    return p ? roles(p.stories).main : undefined;
  };

  return (
    <Sheet theme="front" label={`The Yay News, ${longDate(edition.date)}`}>
      <Masthead
        title="The Yay News"
        specTitle={editionName(edition.date) ?? "Good news only"}
        spec={[
          ["Date", date],
          ["Issue", issueLine(edition)],
          ["Read time", `${editionMinutes(edition)} min`],
        ]}
        box={
          <>
            <span className="tb-box-words">
              Free
              <small>No. {edition.issueNumber}</small>
            </span>
            <Barcode />
          </>
        }
      />

      <div
        className={`tb-comp tb-comp--front ${onPhoto ? "tb-comp--bleed" : ""}`}
        data-composition={`front-${composition.name}`}
        style={gridStyle(composition, present)}
      >
        {lead ? (
          <article className="tb-main" aria-label={lead.headline}>
            {onPhoto ? null : (
              <AreaBox area="head" place={at.head}>
                <StoryHead story={lead} href={href(lead)} span={at.head?.span ?? 3} scale={1.12} />
              </AreaBox>
            )}
            <AreaBox area="photo" place={at.photo} className={onPhoto ? "tb-bleed" : ""}>
              <MainPhoto
                story={lead}
                href={href(lead)}
                measure={onPhoto ? 236 : measureOf(at.photo?.span ?? 2) - 20}
                onPhoto={onPhoto}
                priority
                sizes="(max-width: 760px) 100vw, 1100px"
              />
            </AreaBox>
            <AreaBox area="body" place={at.body}>
              {onPhoto ? <p className="tb-dek tb-dek--lead">{lead.dek}</p> : null}
              <StoryText story={lead} dropcap />
            </AreaBox>
          </article>
        ) : null}

        {[f1, f2].map((s, i) =>
          s ? (
            <AreaBox
              key={s.slug}
              area={i === 0 ? "f1" : "f2"}
              place={i === 0 ? at.f1 : at.f2}
              as="article"
              label={s.headline}
            >
              <SecondStory
                story={s}
                href={href(s)}
                span={(i === 0 ? at.f1 : at.f2)?.span ?? 1}
                slug=""
              />
              {i === 1
                ? more.map((m) => (
                    <div key={m.slug} className="tb-front-more">
                      <SecondStory story={m} href={href(m)} span={at.f2?.span ?? 1} slug="" />
                    </div>
                  ))
                : null}
            </AreaBox>
          ) : null,
        )}

        <AreaBox
          area="rail"
          place={at.rail}
          as="aside"
          label="Inside today, the number of the day and the weather"
        >
          <nav aria-labelledby="inside-today">
            <p className="tb-kicker">Inside today:</p>
            <h2 id="inside-today" className="tb-cond tb-h3">
              {index.length} more pages
            </h2>
            <ol className="tb-index">
              {index.map((p) => {
                const top = p.slug === "back" ? undefined : mainOf(p.order);
                return (
                  <li key={p.order}>
                    <Link href={p.href}>
                      <span className="tb-index-row">
                        <span className="tb-index-label">{p.label}</span>
                        <b>{p.order}</b>
                      </span>
                      {top ? <span className="tb-index-head">{top.headline}</span> : null}
                    </Link>
                  </li>
                );
              })}
            </ol>
          </nav>
          {number ? (
            <div className="tb-rail-box">
              <p className="tb-kicker">Number of the day:</p>
              <p
                className="tb-front2-num tb-cond"
                style={fs(fit(number.content.value, { max: 17, min: 8, measure: 70, em: 0.6 }))}
              >
                <span className="tb-underline">
                  {number.content.value}
                  <Mark name="brush-03" ink="var(--a)" className="tb-mark tb-over" />
                </span>
              </p>
              <p>{sentence(capitalise(number.content.caption))}</p>
            </div>
          ) : null}
          {weather ? (
            <div className="tb-rail-box">
              <p className="tb-kicker">Weather:</p>
              <h2 className="tb-weather-head tb-cond">{weather.content.headline}</h2>
              <p>{weather.content.detail}</p>
            </div>
          ) : null}
        </AreaBox>
      </div>

      <WeekInPictures edition={edition} reading={reading} className="tb-desk" />

      <Folio page={page.order} section="Front page" date={date} next={reading.next} />
    </Sheet>
  );
}
