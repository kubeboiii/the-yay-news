import Link from "next/link";
import { Mark } from "@/features/print/mark";
import { pageHref } from "../reading";
import type { StoryProps } from "../types";
import {
  credit,
  Folio,
  groundFor,
  lengthClass,
  longDate,
  minutes,
  pageNumber,
  PrintPhoto,
  pullQuote,
} from "./print";

/**
 * A story's own page: the story cut out of the magazine and printed on a single sheet — kicker,
 * headline, standfirst, byline, photograph with credit, the full text with a drop cap, a pull
 * quote, the source, and the way back into the edition.
 */
export function Story({ data, links }: StoryProps) {
  const { story, edition, page } = data;
  const [image, ...more] = story.images;
  const said = pullQuote(story.body);
  const [first, ...rest] = story.body;
  const section = story.section.name;
  // The page the story sits on (see pageNumber): the front's stories are on page 2, an inside
  // page's on the right-hand page of its spread.
  const index = Math.max(page.order - 1, 0);
  const folio = index === 0 ? 2 : pageNumber(index) + 1;
  const pageName = page.layout === "front" ? "the front page" : (page.section?.name ?? "its page");
  const ground = groundFor(story.section.slug);

  return (
    <div className="print-sheet-wrap m5t-wrap">
      <article className="print-sheet print-sheet--bright m5-sheet-flow m5t">
        <Folio
          page={folio}
          section={section}
          date={edition.date}
          top={`The Yay News · No. ${edition.issueNumber} · ${section}`}
        />
        <div className="m5-page-flow">
          <p className={`m5t-strip m5-ground--${ground}`}>
            <span className="m5-kicker">
              {section} · {story.kicker}
            </span>
            {story.sticker ? <span className="m5t-sticker">{story.sticker}</span> : null}
          </p>

          <h1 className={`m5-display m5t-head ${lengthClass(story.headline, [44, 72, 100])}`}>
            {story.headline}
          </h1>
          <p className="m5t-dek">{story.dek}</p>
          <p className="m5-byline m5t-by">
            By the Yay {section.toLowerCase()} desk{" "}
            <i>
              · {longDate(edition.date)} · {minutes(story.readMinutes)} to read
            </i>
          </p>

          {image ? (
            <figure className="m5t-figure">
              <PrintPhoto
                image={image}
                priority
                className="m5t-photo"
                sizes="(max-width: 760px) 100vw, 800px"
              />
              <figcaption className="m5-caption">
                {image.alt}. <span className="m5-credit">{credit(image)}</span>
              </figcaption>
            </figure>
          ) : (
            <div className="m5t-rule" aria-hidden />
          )}

          <div className="m5t-text">
            <div className="m5-body m5t-body">
              {first ? <p className="m5f-drop">{first}</p> : null}
              {rest.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <aside className="m5t-side">
              {said ? (
                <blockquote className="m5-display m5t-pull">
                  “{said}”
                  <Mark name="brush-03" ink="var(--apricot-deep)" className="m5t-pull-mark" />
                </blockquote>
              ) : null}
              {more.map((img) => (
                <figure key={img.url} className="m5-pasted print-print m5t-more">
                  <PrintPhoto image={img} sizes="(max-width: 760px) 90vw, 260px" />
                  <span className="print-tape m5-pasted-tape" aria-hidden />
                  <figcaption className="m5-credit">{credit(img)}</figcaption>
                </figure>
              ))}
              <div className="m5t-source">
                <p className="m5t-source-label">Where we found it</p>
                <p>
                  <a href={story.sourceUrl} rel="noopener noreferrer" target="_blank">
                    {story.sourceName} <span aria-hidden>↗</span>
                  </a>
                </p>
              </div>
            </aside>
          </div>

          <nav className="m5t-nav" aria-label="In this edition">
            <p className="m5t-back">
              <Link href={links.page}>
                <span aria-hidden>←</span> Back to {pageName}, page {folio}
              </Link>
              <Link href={links.edition}>No. {edition.issueNumber}, the front page</Link>
            </p>
            <div className="m5t-turns">
              {links.prev ? (
                <Link href={links.prev.href} rel="prev" className="m5t-turn">
                  <span className="m5t-turn-label">
                    <span aria-hidden>←</span> Previous story
                  </span>
                  <span className="m5-display m5t-turn-head">{links.prev.headline}</span>
                </Link>
              ) : (
                <span />
              )}
              {links.next ? (
                <Link href={links.next.href} rel="next" className="m5t-turn m5t-turn--next">
                  <span className="m5t-turn-label">
                    Next story <span aria-hidden>→</span>
                  </span>
                  <span className="m5-display m5t-turn-head">{links.next.headline}</span>
                </Link>
              ) : (
                <Link
                  href={pageHref(edition.issueNumber, "back")}
                  className="m5t-turn m5t-turn--next"
                >
                  <span className="m5t-turn-label">
                    That was the last story <span aria-hidden>→</span>
                  </span>
                  <span className="m5-display m5t-turn-head">On to the puzzles</span>
                </Link>
              )}
            </div>
          </nav>
        </div>
      </article>
    </div>
  );
}
