import Link from "next/link";
import type { StoryProps } from "../types";
import { isLong, longDate, shortDate, themeFor, weekday } from "./lib";
import { Gallery } from "../plates";
import { Body, Photo, Ringed, Sticker, Zigzag } from "./parts";

// A story's own page: the story cut out of the paper and laid out on a sheet of its own, in the
// same running head, inks and type as the page it came from.

export function Story({ data, links }: StoryProps) {
  const { story, edition, page } = data;
  const theme = page.layout === "front" ? "front" : themeFor(page);
  const image = story.images[0];
  const from =
    page.layout === "front"
      ? "the front page"
      : page.layout === "back"
        ? "the back page"
        : (page.section?.name ?? "the paper");
  const long = story.headline.length > 70;

  return (
    <div className="yn-sheet-wrap">
      <article className={`yn-sheet yn-inside yn-theme-${theme} bs-inside bs-story`}>
        <header className="yn-run">
          <div className="yn-run-page print-worn">
            <span className="yn-hand">page</span>
            <span className="yn-fat">{page.order}</span>
          </div>
          <div className="yn-vrule" />
          <div className="yn-run-title">
            <p className="yn-chunk yn-run-mark">
              <Link href={links.edition} className="bs-link">
                The Yay News
              </Link>
            </p>
            <p className="yn-chunk print-misreg yn-run-h1 bs-run-h1">
              <Link href={links.page} className="bs-link">
                {page.layout === "front" ? "Front Page" : (page.section?.name ?? "Inside")}
              </Link>
            </p>
            <p className="yn-hand yn-run-tag">
              {page.section?.tagline ?? "Only good news. Mostly fun. Occasionally weird."}
            </p>
          </div>
          <div className="yn-vrule" />
          <div className="yn-run-date">
            <p className="yn-chunk">{weekday(edition.date)}</p>
            <p>{longDate(edition.date)}</p>
            <p>
              Vol. {edition.volume} · No. {edition.issueNumber} · Free
            </p>
          </div>
        </header>

        <Zigzag />

        <section className={`bs-story-top ${image ? "" : "bs-story-top--type"}`}>
          <div className="bs-story-head">
            <p className="yn-kicker">{story.kicker}</p>
            <h1 className={`yn-chunk bs-story-h1 ${long ? "bs-story-h1--long" : ""}`}>
              <Ringed text={story.headline} />
            </h1>
            <p className="yn-dek bs-story-dek">{story.dek}</p>
            <p className="yn-byline bs-story-byline">
              From {story.sourceName} · {story.readMinutes} min read · Page {page.order}, {from}
            </p>
          </div>
          {story.sticker ? <Sticker text={story.sticker} className="bs-story-sticker" /> : null}
        </section>

        {image ? (
          <figure className="bs-story-print print-print">
            <span className="print-tape bs-print-tape-l" aria-hidden />
            <span className="print-tape bs-print-tape-r" aria-hidden />
            <Photo
              image={image}
              className="bs-story-photo"
              sizes="(max-width: 760px) 100vw, 1100px"
              priority
              width={2000}
            />
            <figcaption className="yn-caption">
              {image.alt}
              {image.licence === "Credited to its source" ? (
                <span className="bs-credit">Image: {image.credit}</span>
              ) : null}
            </figcaption>
          </figure>
        ) : null}

        <Zigzag />

        <section className="bs-story-main">
          <Body
            paragraphs={story.body}
            className={`yn-dropcap bs-story-body ${isLong(story.body) ? "" : "bs-story-body--short"}`}
          />

          <aside className="bs-story-side">
            <div className="bs-story-time print-worn">
              <span className="yn-fat">{story.readMinutes}</span>
              <span className="yn-hand">
                {story.readMinutes === 1 ? "minute" : "minutes"}
                <br />
                of good news
              </span>
            </div>
            <div className="bs-story-source">
              <p className="yn-label">Where it came from</p>
              <p className="yn-body">
                <a
                  href={story.sourceUrl}
                  className="bs-link bs-link-under"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {story.sourceName}
                </a>
              </p>
              {story.embedUrl ? (
                <p className="yn-body">
                  <a
                    href={story.embedUrl}
                    className="bs-link bs-link-under"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Watch or listen at the source →
                  </a>
                </p>
              ) : null}
            </div>
            <div className="bs-story-back">
              <p className="yn-label">Found in</p>
              <p className="yn-body">
                <Link href={links.page} className="bs-link bs-link-under">
                  Page {page.order}, {from}
                </Link>
              </p>
              <p className="yn-body">
                <Link href={links.edition} className="bs-link bs-link-under">
                  No. {edition.issueNumber}, {shortDate(edition.date)}
                </Link>
              </p>
            </div>
          </aside>
        </section>

        <Gallery story={story} className="bs-story-gallery" captionClass="yn-caption" />

        <Zigzag word="more stories" />

        <nav className="bs-story-nav" aria-label="More stories">
          {links.prev ? (
            <Link href={links.prev.href} className="bs-story-turn bs-story-turn--prev bs-link">
              <span className="yn-label">← Previous story</span>
              <span className="yn-chunk yn-hed-sm">{links.prev.headline}</span>
            </Link>
          ) : (
            <Link href={links.edition} className="bs-story-turn bs-story-turn--prev bs-link">
              <span className="yn-label">← The front page</span>
              <span className="yn-chunk yn-hed-sm">Start the paper from the top</span>
            </Link>
          )}
          <Link href={links.page} className="bs-story-turn bs-story-turn--page bs-link">
            <span className="yn-label">Back to the page</span>
            <span className="yn-chunk yn-hed-sm">
              Page {page.order}: {from}
            </span>
          </Link>
          {links.next ? (
            <Link href={links.next.href} className="bs-story-turn bs-story-turn--next bs-link">
              <span className="yn-label">Next story →</span>
              <span className="yn-chunk yn-hed-sm">{links.next.headline}</span>
            </Link>
          ) : (
            <Link href={links.edition} className="bs-story-turn bs-story-turn--next bs-link">
              <span className="yn-label">The last story</span>
              <span className="yn-chunk yn-hed-sm">Back to the front page</span>
            </Link>
          )}
        </nav>

        <footer className="yn-folio">
          <span>
            Page {page.order} · The Yay News · {shortDate(edition.date)}
          </span>
          <span className="yn-hand">{from}</span>
          <span>No. {edition.issueNumber}</span>
        </footer>
      </article>
    </div>
  );
}
