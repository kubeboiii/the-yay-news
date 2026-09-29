import Link from "next/link";
import { Burst } from "@/features/print/burst";
import type { PageProps } from "../types";
import {
  Anno,
  Body,
  Byline,
  Credit,
  Folio,
  Head,
  OnFold,
  Page,
  Print,
  printNote,
  ReadOn,
  Ringed,
  RunningHead,
  Spread,
  Zig,
} from "./parts";
import {
  byOrder,
  feature,
  fitSize,
  folios,
  headSize,
  longDate,
  pad2,
  shortDate,
  teaseFor,
  weekday,
} from "./text";

/** The front prints the lead's opening paragraphs and jumps to its own page for the rest. */
function frontCut(body: string[], budget = 500): string[] {
  const out: string[] = [];
  let used = 0;
  for (const para of body) {
    if (out.length && used + para.length > budget) break;
    out.push(para);
    used += para.length;
  }
  return out;
}

/**
 * The front route prints the first spread: the cover (masthead, spec table, number of the day and
 * weather, and a teaser print from inside) on the left, and page 2 (the lead story and "Inside
 * today") on the right.
 */
export function Front({ edition, page, reading }: PageProps) {
  const [lead, ...others] = byOrder(page.stories);
  const number = feature(edition, "number_of_day");
  const weather = feature(edition, "weather");
  const date = shortDate(edition.date);
  const [, right] = folios(reading, page.order);
  const day = weekday(edition.date);
  const weekend = day === "Saturday" || day === "Sunday";

  // The cover's teaser: the first inside story with a picture, else the first inside story.
  const inside = byOrder(edition.pages).filter((p) => p.layout !== "front" && p.layout !== "back");
  const insideStories = inside.flatMap((p) => byOrder(p.stories).map((s) => ({ s, p })));
  const teaser = insideStories.find(({ s }) => s.images.length > 0) ?? insideStories[0] ?? null;
  const teaserFolio = teaser ? folios(reading, teaser.p.order)[0] : null;
  const teaserImage = teaser?.s.images[0] ?? null;

  const contents = reading.pages.filter((p) => p.slug !== "");
  // A long contents list takes room from the lead: a shallower print and a shorter opening.
  const crowded = contents.length > 6;
  const opening = lead ? frontCut(lead.body, crowded ? 320 : 500) : [];
  const leadImage = lead?.images[0] ?? null;

  return (
    <Spread label="Front page spread">
      <Page ground="mint" side="left" className="z-cover">
        <div className="z-cover__top">
          <p className="z-stamp print-worn z-cover__stamp">
            {edition.kind === "slow_news_day"
              ? "Slow news day"
              : weekend
                ? "Weekend edition"
                : `${day} edition`}
            <small>Only good news · free, forever</small>
          </p>

          <div className="z-spec">
            <div>
              <p className="z-spec__name">
                <b>ZINE</b>
                <span>
                  170mm ×<br />
                  250mm
                </span>
              </p>
              <dl>
                <dt>Vol. · No.</dt>
                <dd>
                  Vol. {edition.volume} · No. {edition.issueNumber}
                </dd>
                <dt>Date</dt>
                <dd>
                  <time dateTime={edition.date}>{longDate(edition.date)}</time>
                </dd>
                <dt>Price</dt>
                <dd>Free, forever</dd>
                {weather ? (
                  <>
                    <dt>Weather</dt>
                    <dd>{weather.content.headline}</dd>
                  </>
                ) : null}
              </dl>
              {weather ? <p className="zf-weather">{weather.content.detail}</p> : null}
            </div>
            {number ? (
              <div className="z-spec__num">
                <b
                  className="print-misreg"
                  style={{
                    ["--misreg" as string]: "var(--rose)",
                    ["--nb" as string]: fitSize(number.content.value, 32, 7.6, 4.2),
                  }}
                >
                  {number.content.value}
                </b>
                <span>Number of the day: {number.content.caption}</span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="z-cover__stack">
          {/* The extrusion is a second impression under the letters, and it is the one that wore. */}
          <p className="z-cover__title z-cover__title--shade print-worn" aria-hidden>
            <span className="z-cover__the">The</span>
            <span className="z-cover__yay">Yay</span>
            <span className="z-cover__news">News</span>
          </p>
          <h1 className="z-cover__title z-cover__title--ink">
            <span className="z-cover__the">The</span>
            <span className="z-cover__yay">Yay</span>
            <span className="z-cover__news">News</span>
          </h1>
          {teaser && teaserImage ? (
            <>
              <Print
                photo={teaserImage}
                ratio="4 / 5"
                sizes="(max-width: 900px) 50vw, 200px"
                rotate={5}
                tape={["t"]}
                note={printNote(teaser.s.kicker, 16)}
                className="z-cover__print"
              />
              <Anno
                arrow="arrows-10"
                arrowFirst={false}
                arrowSize={[12, 7]}
                className="zf-cover__anno"
                style={{ ["--r" as string]: "-5deg" }}
                arrowStyle={{ rotate: "170deg" }}
              >
                more on page {teaserFolio}
              </Anno>
            </>
          ) : null}
        </div>

        <div className="z-cover__foot">
          <p className="z-cover__tag">Only good news. Mostly fun. Occasionally weird.</p>
          {teaser ? (
            <p className="z-cover__also">
              <Link href={reading.storyHref(teaser.s.slug)} className="z-link-block">
                <b>{teaser.s.headline}</b>
                {teaser.s.dek}
              </Link>
            </p>
          ) : null}
        </div>
      </Page>

      <Page ground="pink" side="right">
        <RunningHead>The Yay Zine · Only good newsprint</RunningHead>

        {lead ? (
          <>
            <h2 className="z-head">
              <span className="z-head__top">
                <span aria-hidden className="z-dots" />
                <span className="z-head__cond">{lead.kicker}</span>
                <span aria-hidden className="z-dots" />
              </span>
              <Link
                href={reading.storyHref(lead.slug)}
                className="z-head__heavy z-head__heavy--wrap z-link-head"
                style={{ ["--hb" as string]: headSize(lead.headline, [10.4, 8.4, 7.2, 6.6]) }}
              >
                <Ringed text={lead.headline} />
              </Link>
            </h2>

            {leadImage ? (
              <>
                <div className="z-lead__photo z-offset-block">
                  <Print
                    photo={leadImage}
                    ratio={crowded ? "3 / 1" : lead.headline.length > 56 ? "12 / 5" : "2 / 1"}
                    sizes="(max-width: 900px) 100vw, 600px"
                    rotate={-2.2}
                    tape={["tl", "br"]}
                    note={printNote(leadImage.alt, 46)}
                    priority
                  />
                  {lead.sticker ? (
                    <Burst fill="var(--butter)" points={18} depth={0.16} className="z-lead__burst">
                      <p>{lead.sticker}</p>
                    </Burst>
                  ) : null}
                </div>
                <div className="zf-credit">
                  <Credit photos={[leadImage]} />
                </div>
              </>
            ) : lead.sticker ? (
              <div className="zf-sticker-row">
                <Burst fill="var(--butter)" points={18} depth={0.16} className="z-lead__burst">
                  <p>{lead.sticker}</p>
                </Burst>
              </div>
            ) : null}

            <div className="z-lead__text">
              <div>
                <p className="z-kicker">
                  {lead.section.name} — a {lead.readMinutes}-minute read
                </p>
                <p className="z-dek">{lead.dek}</p>
                <Byline story={lead} />
              </div>
              <Body story={{ ...lead, body: opening }} drop className="z-lead__body z-cols-2">
                <ReadOn href={reading.storyHref(lead.slug)}>
                  {opening.length < lead.body.length
                    ? "Continued on its own page"
                    : "Read it on its own page"}
                </ReadOn>
              </Body>
            </div>
          </>
        ) : (
          <Head top="Today" bottom="Good morning" />
        )}

        {others.length ? (
          <ul className="zf-others">
            {others.map((s) => (
              <li key={s.slug}>
                <p className="z-kicker">{s.kicker}</p>
                <h3 className="z-h3">
                  <Link href={reading.storyHref(s.slug)} className="z-link-head">
                    {s.headline}
                  </Link>
                </h3>
                <p className="zf-others__dek">{s.dek}</p>
              </li>
            ))}
          </ul>
        ) : null}

        <nav
          className={`z-contents zf-contents ${contents.length > 8 ? "zf-contents--5" : ""}`}
          aria-labelledby="inside-today"
        >
          <div className="z-contents__title">
            <h2 className="z-label" id="inside-today">
              Inside today
            </h2>
            <Zig />
          </div>
          <ol>
            {contents.map((c) => {
              const [n] = folios(reading, c.order);
              return (
                <li key={c.order}>
                  <Link href={c.href} className="z-link-block">
                    <span className="z-contents__n" aria-hidden>
                      {pad2(n)}
                    </span>
                    <span className="z-contents__sec z-h3">
                      <span className="z-sr">Page {n}: </span>
                      {c.label}
                    </span>
                    <span className="z-contents__tease">{teaseFor(edition, c.order)}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>

        <Folio n={right} date={date} />
      </Page>

      <OnFold gx={-1} gy={52} rotate={-8}>
        <Burst fill="var(--blue)" points={13} depth={0.16} wobble={1} className="z-fold-sticker">
          <p>
            Only good news
            <span>inside!</span>
          </p>
        </Burst>
      </OnFold>
    </Spread>
  );
}
