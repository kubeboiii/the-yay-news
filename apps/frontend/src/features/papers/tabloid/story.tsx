import Link from "next/link";
import { Mark } from "@/features/print/mark";
import { pageHref } from "../reading";
import { Gallery } from "../plates";
import type { StoryProps } from "../types";
import { folioDate, issueLine, longDate } from "./edition-data";
import {
  Body,
  Folio,
  MiniMark,
  Photo,
  Sheet,
  Sticker,
  fit,
  printedCredit,
  themeFor,
} from "./parts";
import { PlateWord, Source, fs } from "./story-bits";

// A story's own page: the story cut out of the tabloid and laid on the desk by itself — the same
// type, inks and furniture, but only as long as the story.

export function Story({ data, links }: StoryProps) {
  const { story, edition, page } = data;
  const image = story.images[0];
  const credit = image ? printedCredit(image) : null;
  const section = page.section?.name ?? (page.layout === "front" ? "Front page" : "The back page");
  const date = folioDate(edition.date);

  return (
    <Sheet theme={themeFor(page.order)} cut label={story.headline}>
      <header className="tb-cut-head">
        <div className="tb-eyebrow">
          <MiniMark href={links.edition}>
            Page {page.order} · {section} · {date}
          </MiniMark>
        </div>
        <nav className="tb-cut-nav" aria-label="Back to the paper">
          <Link href={links.page}>← Back to page {page.order}</Link>
          <Link href={links.edition}>Front page, No. {edition.issueNumber}</Link>
        </nav>
      </header>

      <div className="tb-cut">
        <div className="tb-cut-top">
          <p className="tb-kicker">{story.kicker}:</p>
          <h1
            className="tb-cond tb-cut-headline"
            style={fs(fit(story.headline, { max: 13, min: 7, measure: 120, lines: 5, em: 0.52 }))}
          >
            {story.headline}
          </h1>
          <p className="tb-dek">{story.dek}</p>
          <p className="tb-byline">
            By our {section} desk · <b>{story.readMinutes} min read</b> · {issueLine(edition)} ·{" "}
            {longDate(edition.date)}
          </p>
        </div>
        {image ? (
          <Photo
            image={image}
            sizes="(max-width: 760px) 100vw, 560px"
            width={1400}
            className="tb-cut-photo tb-photo--open"
            priority
          >
            {story.sticker ? (
              <Sticker text={story.sticker} plate="b" className="tb-cut-sticker" />
            ) : null}
          </Photo>
        ) : (
          <div className="tb-plate tb-cut-plate" aria-hidden>
            <PlateWord text={story.kicker} measure={110} />
            <Mark name="doodles-02" ink="var(--a)" className="tb-mark tb-plate-star" />
            {story.sticker ? (
              <Sticker text={story.sticker} plate="a" className="tb-cut-sticker" />
            ) : null}
          </div>
        )}
      </div>

      <section className="tb-band tb-cut-band" aria-label="The story">
        <div className="tb-col">
          <div
            className={`tb-body ${story.body.join(" ").length > 900 ? "tb-flow" : "tb-cut-narrow"}`}
          >
            <Body paragraphs={story.body} dropcap />
            <Source story={story} />
            {credit ? <p className="tb-image-credit">{credit}</p> : null}
          </div>
        </div>
      </section>

      <Gallery story={story} className="tb-cut-gallery" captionClass="tb-caption" />

      <nav className="tb-cut-turn" aria-label="More stories">
        {links.prev ? (
          <Link href={links.prev.href} rel="prev" className="tb-cut-turn-prev">
            <span className="tb-kicker">Previous story:</span>
            <span className="tb-cond tb-cut-turn-head">← {links.prev.headline}</span>
          </Link>
        ) : (
          <Link href={links.edition} className="tb-cut-turn-prev">
            <span className="tb-kicker">From the top:</span>
            <span className="tb-cond tb-cut-turn-head">← The front page</span>
          </Link>
        )}
        {links.next ? (
          <Link href={links.next.href} rel="next" className="tb-cut-turn-next">
            <span className="tb-kicker">Next story:</span>
            <span className="tb-cond tb-cut-turn-head">{links.next.headline} →</span>
          </Link>
        ) : (
          <Link href={pageHref(edition.issueNumber, "back")} className="tb-cut-turn-next">
            <span className="tb-kicker">That&rsquo;s every story:</span>
            <span className="tb-cond tb-cut-turn-head">On to the puzzles →</span>
          </Link>
        )}
      </nav>

      <Folio page={page.order} section={section} date={date} />
    </Sheet>
  );
}
