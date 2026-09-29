import Image from "next/image";
import Link from "next/link";
import { Burst } from "@/features/print/burst";
import { Mark } from "@/features/print/mark";
import { printedPhoto } from "@/features/print/photo";
import type { PageProps, StoryItem } from "../types";
import {
  allStories,
  dotDate,
  featureOf,
  fitSize,
  pageNumber,
  puzzleOf,
  readMinutes,
  shortDate,
} from "./lib";
import { Barcode, Body, Ringed, STRETCH, Stamp, Sticker, Zigzag, byline } from "./parts";

/** Splits "12,408 picnic blankets … — a new record" into the caption and its aside. */
function splitCaption(caption: string): [string, string | null] {
  const [main, ...aside] = caption.split(/\s+[—–]\s+/);
  const rest = aside.join(" — ").trim();
  return [main ?? caption, rest && rest.length <= 40 ? rest : null];
}

/** The inside story the front page teases with a print: one with a photo, stickered if possible. */
function teaser(stories: StoryItem[], lead: StoryItem | undefined) {
  const inside = stories.filter((s) => s !== lead && s.images.length > 0);
  return inside.find((s) => s.sticker) ?? inside[0] ?? stories.find((s) => s !== lead) ?? null;
}

export function Front({ edition, page, reading }: PageProps) {
  const lead = page.stories.find((s) => s.slot === "lead") ?? page.stories[0];
  const others = page.stories.filter((s) => s !== lead);
  const number = featureOf(edition, "number_of_day");
  const weather = featureOf(edition, "weather");
  const riddle = puzzleOf(edition, "riddle");
  const quote = featureOf(edition, "quote");
  const stories = allStories(edition);
  const tease = teaser(
    stories.filter((s) => !page.stories.includes(s)),
    lead,
  );
  const teasePage = tease ? reading.pageFor(tease.section.slug) : null;
  const back = reading.pages.find((p) => p.slug === "back") ?? null;
  const minutes = readMinutes(edition);
  const image = lead?.images[0];
  const [caption, aside] = number ? splitCaption(number.caption) : ["", null];
  const long = (lead?.headline.length ?? 0) > 64;

  return (
    <div className="yn-sheet-wrap">
      <article className="yn-sheet bs-front">
        {number ? (
          <section className="yn-banner bs-banner" aria-label="Number of the day">
            <div className="yn-banner-stack">
              <div className="yn-hand">Today&rsquo;s</div>
              <div className="yn-chunk">Number</div>
            </div>
            <div className="yn-vrule" />
            <div className="yn-banner-number">
              <span
                className="yn-fat fr-number"
                style={{ fontSize: `calc(var(--u) * ${fitSize(number.value, 120, 33, 0.42)})` }}
              >
                <Mark
                  name="brush-03"
                  ink="var(--neon-pink)"
                  className="fr-number-swipe"
                  style={STRETCH}
                />
                <span className="relative">{number.value}</span>
              </span>
              <span className="yn-hand bs-banner-caption">{caption}</span>
            </div>
            <Burst
              fill="var(--neon-pink)"
              points={22}
              depth={0.1}
              className="yn-banner-badge bs-banner-badge print-worn"
            >
              <span
                className="yn-burst-text bs-burst-text bs-on-pink"
                style={{
                  fontSize: `calc(var(--u) * ${aside ? Math.min(7, 80 / aside.length + 2.4) : 7})`,
                }}
              >
                {aside ?? "true story!"}
              </span>
            </Burst>
          </section>
        ) : null}

        <Zigzag word="finishable" />

        <header className="yn-mast">
          <div className="yn-spec">
            <h2 className="yn-chunk">The Daily</h2>
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
                <dd>{stories.length}, all good</dd>
              </div>
              <div>
                <dt>Price:</dt>
                <dd>Free, forever</dd>
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
              {minutes === 1 ? "minute" : "minutes"}
              <br />
              of good news,
              <br />
              then you&rsquo;re done
            </span>
          </div>
        </header>

        <Zigzag word="unputdownable" />

        {lead ? (
          <figure className={`yn-hero ${image ? "" : "bs-hero-type"}`}>
            {image ? (
              <div className="yn-hero-photo">
                <Image
                  src={printedPhoto(image.url, 2000)}
                  alt={image.alt}
                  fill
                  priority
                  sizes="(max-width: 760px) 100vw, 1100px"
                  className="object-cover object-[center_40%]"
                />
              </div>
            ) : null}

            <Stamp className="fr-stamp">
              Today&rsquo;s
              <br />
              lead
            </Stamp>

            {lead.sticker ? (
              <Burst fill="var(--neon-yellow)" points={24} depth={0.08} className="yn-hero-sticker">
                <span className="yn-burst-text bs-burst-text bs-hero-burst bs-on-yellow">
                  <span className="block text-[0.62em] tracking-wide">happy fact:</span>
                  <span
                    style={{
                      fontSize: `${Math.min(1, 9 / Math.max(...lead.sticker.split(/\s+/).map((w) => w.length), 4))}em`,
                    }}
                  >
                    {lead.sticker}
                  </span>
                </span>
              </Burst>
            ) : null}

            <div className={`yn-hero-card ${long ? "bs-hero-card-long" : ""}`}>
              {image ? (
                <>
                  <span className="print-tape fr-card-tape-l" aria-hidden />
                  <span className="print-tape fr-card-tape-r" aria-hidden />
                </>
              ) : null}
              <p className="yn-kicker">Today&rsquo;s lead story · {lead.kicker}</p>
              <h2 className="yn-chunk">
                <Link href={reading.storyHref(lead.slug)} className="bs-link">
                  <Ringed text={lead.headline} />
                </Link>
              </h2>
              {image ? (
                <span className="yn-credit">@theyaynews via {image.credit}</span>
              ) : (
                <p className="yn-dek bs-hero-dek">{lead.dek}</p>
              )}
            </div>
          </figure>
        ) : null}

        <Zigzag word="good news only" />

        <section className="fr-foot" aria-label="Also on the front page">
          {lead ? (
            <article className="fr-col fr-lead">
              <p className="yn-kicker">{lead.kicker}</p>
              <h2 className="yn-chunk">{lead.dek}</h2>
              <p className="yn-byline fr-byline">{byline(lead)}</p>
              <Body paragraphs={lead.body.slice(0, 3)} className="yn-dropcap" />
              <Link href={reading.storyHref(lead.slug)} className="yn-jump bs-link">
                {lead.body.length > 3
                  ? "Continued: the whole story →"
                  : "Read it on its own page →"}
              </Link>
            </article>
          ) : null}

          {(others[0] ?? tease) ? (
            <FrontTeaser
              story={(others[0] ?? tease)!}
              href={reading.storyHref((others[0] ?? tease)!.slug)}
              where={
                others[0]
                  ? null
                  : teasePage
                    ? {
                        label: `${teasePage.label}, page ${pageNumber(reading, teasePage.slug)}`,
                        href: teasePage.href,
                      }
                    : null
              }
            />
          ) : null}

          <div className="fr-col fr-inside">
            {weather ? (
              <>
                <p className="yn-kicker">Internet weather</p>
                <h2 className="yn-chunk fr-weather-head">
                  {weather.headline}
                  <Mark name="stars-06" className="fr-weather-stars" />
                </h2>
                <p className="yn-body fr-weather">{weather.detail}</p>
              </>
            ) : null}
            <h2 className="fr-inside-head">Inside today</h2>
            <ul className="yn-index yn-body">
              {reading.pages.slice(1).map((p, i) => (
                <li key={p.slug}>
                  <Link href={p.href} className="bs-link">
                    {p.slug === "back" ? "Puzzles & the back page" : p.label}
                  </Link>
                  <span>p.{i + 2}</span>
                </li>
              ))}
            </ul>
          </div>

          {riddle || quote ? (
            <aside className="fr-col fr-riddle">
              <div className="fr-riddle-ink print-worn" aria-hidden />
              {riddle && back ? (
                <Burst
                  fill="var(--neon-yellow)"
                  points={20}
                  depth={0.12}
                  className="yn-riddle-badge"
                >
                  <span className="yn-burst-text bs-on-yellow text-[calc(var(--u)*4.4)]">
                    back
                    <br />
                    page!
                  </span>
                </Burst>
              ) : null}
              {riddle ? (
                <>
                  <p className="yn-kicker">Riddle me this</p>
                  <p className="yn-chunk fr-riddle-q">{riddle.data.question}</p>
                  <p className="yn-body">
                    {back ? (
                      <Link href={back.href} className="bs-link bs-link-under">
                        The puzzles are on the back page.
                      </Link>
                    ) : null}{" "}
                    Answer in tomorrow&rsquo;s paper. No peeking before your coffee.
                  </p>
                </>
              ) : quote ? (
                <>
                  <p className="yn-kicker">Said today</p>
                  <p className="yn-chunk fr-riddle-q">&ldquo;{quote.text}&rdquo;</p>
                  <p className="yn-body">{quote.by}</p>
                </>
              ) : null}
            </aside>
          ) : null}

          <aside className="fr-col fr-price">
            <div className="fr-pricebox">
              <p className="yn-chunk">Free</p>
              <p className="yn-hand">forever, and ever</p>
              <Barcode />
              <p className="fr-issn">
                No. {edition.issueNumber} · {dotDate(edition.date)}
              </p>
            </div>
            <div className="fr-ad">
              <p className="yn-ad-label">Advertisement</p>
              <p className="yn-chunk">This space was for sale.</p>
              <p className="yn-body">
                Nobody bought it, so here is a nice thought instead: drink some water.
              </p>
            </div>
          </aside>
        </section>

        <div className="yn-zigzag fr-last" role="separator" aria-hidden />
      </article>
      <p className="yn-note-foot">
        No. {edition.issueNumber} · {shortDate(edition.date)} · photos credited where they appear
      </p>
    </div>
  );
}

function FrontTeaser({
  story,
  href,
  where,
}: {
  story: StoryItem;
  href: string;
  where: { label: string; href: string } | null;
}) {
  const image = story.images[0];
  return (
    <article className="fr-col fr-cat">
      {image ? (
        <>
          <figure className="fr-cat-print print-print">
            <span className="print-tape fr-cat-tape" aria-hidden />
            <div className="relative h-full w-full">
              <Image
                src={printedPhoto(image.url, 800)}
                alt={image.alt}
                fill
                sizes="(max-width: 760px) 90vw, 240px"
                className="object-cover"
              />
            </div>
          </figure>
          <p className="yn-caption">
            {story.kicker}. <span className="yn-credit">Photo: {image.credit}</span>
          </p>
        </>
      ) : (
        <div className="bs-cat-flag">
          {story.sticker ? (
            <Sticker text={story.sticker} className="bs-cat-sticker" />
          ) : (
            <p className="yn-kicker">{story.kicker}</p>
          )}
        </div>
      )}
      <h2 className="yn-chunk mt-[calc(var(--u)*3)]">
        <Link href={href} className="bs-link">
          {story.headline}
        </Link>
      </h2>
      <p className="yn-body">{story.dek}</p>
      {where ? (
        <Link href={where.href} className="yn-jump bs-link">
          {where.label}
        </Link>
      ) : (
        <Link href={href} className="yn-jump bs-link">
          Read on →
        </Link>
      )}
    </article>
  );
}
