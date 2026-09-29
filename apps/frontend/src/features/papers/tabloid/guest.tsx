import type { StoryItem } from "@repo/shared";
import Link from "next/link";
import { Mark } from "@/features/print/mark";
import type { PageProps } from "../types";
import { folioDate, issueLine, ordered, pad2 } from "./edition-data";
import {
  Bars,
  Body,
  Folio,
  Masthead,
  MiniMark,
  Photo,
  Sheet,
  Stamp,
  Sticker,
  Tape,
  creditLine,
  fit,
  themeFor,
} from "./parts";
import { Jump, PlateWord, Source, fs, pullQuote, splashSize } from "./story-bits";

// The guest section: a visiting desk that turns up every other day. It prints as a pull-out
// rather than as one more section page — a striped header strip, the stories set as pasted-up
// tiles, and the guest's name stamped across it.

function GuestTile({
  story,
  href,
  lead,
  index,
}: {
  story: StoryItem;
  href: string;
  lead?: boolean;
  index: number;
}) {
  const image = story.images[0];
  const headSize = fit(story.headline, {
    max: lead ? 10 : 6.6,
    min: 5,
    measure: lead ? 150 : 88,
    lines: lead ? 3 : 4,
    em: 0.52,
  });
  return (
    <article className={`tb-gtile ${lead ? "tb-gtile--lead" : ""}`}>
      {image ? (
        <div
          className={`tb-pasted print-print tb-gtile-print ${index % 2 ? "tb-gtile-print--r" : ""}`}
        >
          <Photo
            image={image}
            sizes={lead ? "(max-width: 760px) 100vw, 640px" : "(max-width: 760px) 100vw, 360px"}
            width={lead ? 1400 : 900}
            priority={lead}
          />
          <Tape />
          {lead && story.sticker ? (
            <Sticker text={story.sticker} plate="b" className="tb-gtile-sticker" />
          ) : null}
        </div>
      ) : lead ? (
        <div className="tb-plate tb-gtile-plate">
          <PlateWord text={story.kicker} measure={140} />
          <Mark name="doodles-02" ink="var(--a)" className="tb-mark tb-plate-star" />
          {story.sticker ? (
            <Sticker text={story.sticker} plate="a" className="tb-gtile-sticker" />
          ) : null}
          <div className="tb-onphoto">
            <p className="tb-kicker">{story.kicker}:</p>
            <h2 className="tb-splash" style={fs(splashSize(story.headline, 140, 11, 4))}>
              <Link href={href}>
                <Bars className="tb-bars--plate">{story.headline}</Bars>
              </Link>
            </h2>
          </div>
        </div>
      ) : null}
      {image ? <p className="tb-credit-line">{creditLine(image)}</p> : null}
      {lead && !image ? null : (
        <>
          <p className="tb-kicker">{story.kicker}:</p>
          <h2 className="tb-cond tb-gtile-head" style={fs(headSize)}>
            <Link href={href}>{story.headline}</Link>
          </h2>
        </>
      )}
      <p className="tb-dek">{story.dek}</p>
      <div
        className={`tb-body ${lead && story.body.join(" ").length > 420 ? "tb-gtile-cols" : ""}`}
      >
        <Body paragraphs={story.body} dropcap={lead} />
      </div>
      <Source story={story} />
      <Jump href={href} />
    </article>
  );
}

export function Guest({ edition, page, reading }: PageProps) {
  const section = page.section;
  const name = section?.name ?? "Guest section";
  const [lead, ...rest] = ordered(page.stories);
  const date = folioDate(edition.date);
  const quote = pullQuote(page.stories);
  const minutes = page.stories.reduce((n, s) => n + s.readMinutes, 0);

  return (
    <Sheet theme={themeFor(page.order + 1)} label={`${name}, page ${page.order}`}>
      <Masthead
        eyebrow={
          <MiniMark href={reading.pages[0]?.href ?? "/"}>
            Page {page.order} · Guest section · {date}
          </MiniMark>
        }
        title={name}
        size={{ measure: 158, max: 17.5 }}
        aside={
          <>
            <p className="tb-kicker">Visiting today:</p>
            <p>
              <span className="tb-runin">{section?.tagline ?? "A guest desk"}. </span>
              Here today, somewhere else tomorrow. {minutes} min to read.
            </p>
          </>
        }
        box={
          <>
            <span className="tb-box-num">{pad2(page.order)}</span>
            <span className="tb-box-words">
              Guest
              <small>Pull out &amp; keep</small>
            </span>
          </>
        }
      />

      <div className="tb-guest-strip">
        <span className="tb-guest-strip-in tb-cond">Guest section</span>
        <span className="tb-guest-strip-note">
          A different desk every other day · today: <b>{name}</b>
        </span>
      </div>

      <section className="tb-guest-grid" aria-label={`${name} stories`}>
        {lead ? (
          <GuestTile story={lead} href={reading.storyHref(lead.slug)} lead index={0} />
        ) : null}
        <div className="tb-guest-side">
          <Stamp className="tb-guest-stamp">
            Guest
            <small>{date}</small>
          </Stamp>
          {rest.slice(0, 2).map((s, i) => (
            <GuestTile key={s.slug} story={s} href={reading.storyHref(s.slug)} index={i + 1} />
          ))}
          {quote ? (
            <blockquote className="tb-pull tb-guest-pull">
              <p className="tb-cond">&ldquo;{quote.text}&rdquo;</p>
              {quote.by ? <footer className="tb-pull-by">{quote.by}</footer> : null}
            </blockquote>
          ) : null}
          <aside className="tb-guest-card print-worn" aria-label="About the guest section">
            <Mark name="stars-14" ink="var(--b)" className="tb-mark tb-guest-stars" />
            <p className="tb-kicker">Today&rsquo;s visiting desk:</p>
            <p
              className="tb-guest-card-name tb-cond"
              style={fs(fit(name, { max: 9, min: 5, measure: 84, lines: 3, em: 0.55 }))}
            >
              {name}
            </p>
            <p className="tb-guest-card-tag">{section?.tagline ?? "A guest desk"}.</p>
            <Mark name="doodles-06" ink="currentColor" className="tb-guest-card-art" />
            <p className="tb-guest-card-foot">
              A different guest takes this page every other day. {rest.length + 1}{" "}
              {rest.length ? "stories" : "story"}, {minutes} min, then back to the paper.
            </p>
            {reading.next ? (
              <p className="tb-jump">
                <Link href={reading.next.href}>
                  Next: {reading.next.label}, <b>page {reading.next.order} →</b>
                </Link>
              </p>
            ) : null}
          </aside>
        </div>
      </section>

      <Folio page={page.order} section={`Guest: ${name}`} date={date} issue={issueLine(edition)} />
    </Sheet>
  );
}
