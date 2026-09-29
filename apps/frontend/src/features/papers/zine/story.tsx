import Link from "next/link";
import { Burst } from "@/features/print/burst";
import { Mark } from "@/features/print/mark";
import type { StoryProps } from "../types";
import { pageLabel } from "../reading";
import {
  Body,
  Byline,
  Credit,
  doodleFor,
  Page,
  Print,
  printNote,
  Pull,
  Ringed,
  RunningHead,
} from "./parts";
import { groundsFor, headSize, pad2, pullQuote, shortDate, longDate } from "./text";

/*
 * A story's own page: the story cut out of its spread and laid out as a single mini page of its
 * own, on its section's ground — kicker, headline, picture (or its standfirst set big), the full
 * body, the source, and the way on: the stories either side, its page and the front.
 */
export function Story({ data, links }: StoryProps) {
  const { story, edition, page } = data;
  const guest = page.layout === "guest";
  const slug =
    page.layout === "front"
      ? "front"
      : page.layout === "back"
        ? "back"
        : (page.section?.slug ?? "");
  const [ground] = groundsFor(slug, page.order, guest);
  const date = shortDate(edition.date);
  const where = pageLabel(page);
  const image = story.images[0] ?? null;
  const pull = pullQuote([story]);
  // The mini page it was cut from: the front's lead is on page 2; a section's opens its spread.
  const from = page.layout === "front" ? 2 : 2 * (page.order - 1) + 1;

  return (
    <main className="z-main">
      <div className="print-sheet-wrap z-wrap z-wrap--single">
        <div className="z-single">
          <Page ground={ground} side="left" className="zt-page">
            <RunningHead>
              The Yay Zine · {story.section.name} ·{" "}
              <time dateTime={edition.date}>{longDate(edition.date)}</time>
            </RunningHead>
            <p className="zt-back">
              <Link href={links.page} className="z-link">
                ← Back to{" "}
                {page.layout === "front" ? "the front page" : `${where}, page ${pad2(from)}`}
              </Link>
            </p>
            <p className="z-kicker zt-kicker">
              {story.kicker} — {story.section.name}
            </p>
            <h1
              className="z-h2 zt-head"
              style={{ ["--zh" as string]: headSize(story.headline, [12, 10, 8.8, 8]) }}
            >
              <Ringed text={story.headline} />
            </h1>
            {image ? (
              <>
                <div className="zt-photo z-offset-block">
                  <Print
                    photo={image}
                    ratio="3 / 2"
                    sizes="(max-width: 900px) 100vw, 620px"
                    rotate={-1.6}
                    tape={["tl", "br"]}
                    note={printNote(image.alt, 44)}
                    priority
                  />
                  {story.sticker ? (
                    <Burst fill="var(--butter)" points={18} depth={0.16} className="z-lead__burst">
                      <p>{story.sticker}</p>
                    </Burst>
                  ) : null}
                </div>
                <div className="zf-credit">
                  <Credit photos={story.images.slice(0, 1)} />
                </div>
                <p className="z-dek zt-dek">{story.dek}</p>
              </>
            ) : (
              <div className="zs-bare zt-bare">
                <p className="zs-bare__dek">{story.dek}</p>
                {story.sticker ? (
                  <Burst fill="var(--butter)" points={18} depth={0.16} className="zt-sticker">
                    <p>{story.sticker}</p>
                  </Burst>
                ) : null}
              </div>
            )}
            <Byline story={story} />
            <Body
              story={story}
              drop
              className={`zt-body ${story.body.join("").length > 900 ? "z-cols-2" : ""}`}
            />
            <p className="zt-source">
              Source:{" "}
              <a
                href={story.sourceUrl}
                className="z-link"
                rel="noopener noreferrer"
                target="_blank"
              >
                {story.sourceName} ↗
              </a>
            </p>
            {pull ? <Pull text={pull} className="zs-pull zt-pull" /> : null}

            {!image && story.body.join("").length < 700 ? (
              <Mark name={doodleFor(story.section.slug)} ink="var(--ink)" className="zt-doodle" />
            ) : null}
            <nav className="zt-nav" aria-label="More from this edition">
              {links.prev ? (
                <Link href={links.prev.href} className="zt-nav__card" rel="prev">
                  <span className="z-kicker">← Previous story</span>
                  <b>{links.prev.headline}</b>
                </Link>
              ) : (
                <span />
              )}
              {links.next ? (
                <Link href={links.next.href} className="zt-nav__card zt-nav__card--next" rel="next">
                  <span className="z-kicker">Next story →</span>
                  <b>{links.next.headline}</b>
                </Link>
              ) : null}
              <p className="zt-nav__row">
                <Link href={links.page} className="z-link">
                  Back to {where}
                </Link>
                <span aria-hidden> · </span>
                <Link href={links.edition} className="z-link">
                  The front of No. {edition.issueNumber}
                </Link>
              </p>
            </nav>
            <p className="z-folio">
              <b>{pad2(from)}</b>
              <span>
                Cut from page {from} · The Yay News · {date}
              </span>
            </p>
          </Page>
        </div>
      </div>
    </main>
  );
}
