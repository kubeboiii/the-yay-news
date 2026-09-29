import type { StoryItem } from "@repo/shared";
import Link from "next/link";
import { Mark } from "@/features/print/mark";
import type { PageProps, Reading } from "../types";
import {
  AlsoInside,
  Body,
  Byline,
  Credit,
  Doodle,
  Folio,
  Head,
  Page,
  Photo,
  Print,
  printNote,
  Pull,
  ReadOn,
  Ringed,
  RunningHead,
  Spread,
  Tape,
  TurnOver,
} from "./parts";
import { byOrder, fitSize, folios, groundsFor, headSize, pullQuote, shortDate } from "./text";

/*
 * The rotating guest section is a visitor, so it is printed as one: its stories are clippings on
 * white stock, torn out and taped onto the spread, under a stamped "guest section" head. The first
 * clipping sits on the left page; any others go on the right with the pull quote and the turn-over.
 */
export function Guest({ edition, page, reading }: PageProps) {
  const name = page.section?.name ?? reading.current.label;
  const tagline = page.section?.tagline ?? "";
  const slug = page.section?.slug ?? reading.current.slug;
  const [gl, gr] = groundsFor(slug, page.order, true);
  const [lf, rf] = folios(reading, page.order);
  const date = shortDate(edition.date);
  const stories = byOrder(page.stories);
  const [first, ...rest] = stories;
  const pull =
    rest.length === 0 && stories.reduce((n, s) => n + s.body.join("").length, 0) >= 260
      ? null
      : pullQuote(stories);
  // A guest with a single story spreads it: its picture (or standfirst) left, the clipping right.
  const alone = rest.length === 0;

  return (
    <Spread label={`${name} spread`}>
      <Page ground={gl} side="left" className="zg-page">
        <RunningHead>The Yay Zine · Guest section</RunningHead>
        <div className="zg-mast">
          <p className="z-stamp print-worn zg-stamp">
            Guest section
            <small>visiting today, gone tomorrow</small>
          </p>
          <Mark name="sketch-40" ink="var(--ink)" className="zg-mast__doodle" />
        </div>
        <Head
          as="h1"
          top={tagline || "A visiting section"}
          bottom={name}
          size={fitSize(name, 146, 16, 8.6)}
          wrap
        />
        {!first ? (
          <p className="zs-empty">Our guest is running late. Back next time.</p>
        ) : alone ? (
          <Poster story={first} />
        ) : (
          <Clipping story={first} reading={reading} i={0} />
        )}
        {first && !alone && first.images.length === 0 ? (
          <Doodle slug={slug} next={reading.next?.label ?? null} />
        ) : null}
        <Folio n={lf} date={date} />
      </Page>

      <Page ground={gr} side="right" className="zg-page">
        <RunningHead>The Yay Zine · {name}</RunningHead>
        <p className="zg-note">
          Every other day a guest section takes a spread of the zine. No. {edition.issueNumber}’s
          visitor: <b>{name}</b>.
        </p>
        {alone && first ? <Clipping story={first} reading={reading} i={1} alone /> : null}
        {rest.map((s, i) => (
          <Clipping key={s.slug} story={s} reading={reading} i={i + 1} />
        ))}
        {pull ? <Pull text={pull} className="zs-pull" /> : null}
        {rest.length <= 1 ? (
          <AlsoInside edition={edition} reading={reading} count={2} big={rest.length === 0} />
        ) : null}
        <TurnOver edition={edition} reading={reading} />
        <Folio n={rf} date={date} />
      </Page>
    </Spread>
  );
}

/** The left page of a one-story guest spread: the story's picture pasted up large, or its standfirst. */
function Poster({ story }: { story: StoryItem }) {
  const image = story.images[0] ?? null;
  if (!image) {
    return (
      <div className="zs-bare zg-poster">
        <p className="zs-bare__dek">{story.dek}</p>
        <Mark name="sketch-52" ink="var(--ink)" className="zs-bare__doodle" />
      </div>
    );
  }
  return (
    <div className="zg-poster">
      <div className="zs-lead__photo z-offset-block">
        <Print
          photo={image}
          ratio="4 / 3"
          sizes="(max-width: 900px) 100vw, 600px"
          rotate={2}
          tape={["tl", "tr"]}
          note={printNote(image.alt, 44)}
          priority
        />
      </div>
      <div className="zf-credit">
        <Credit photos={[image]} />
      </div>
    </div>
  );
}

function Clipping({
  story,
  reading,
  i,
  alone,
}: {
  story: StoryItem;
  reading: Reading;
  i: number;
  alone?: boolean;
}) {
  const href = reading.storyHref(story.slug);
  // On a one-story spread the picture (or the standfirst, when there is none) is on the left page.
  const image = alone ? null : (story.images[0] ?? null);
  const showDek = !alone || story.images.length > 0;
  return (
    <article
      className="zg-clip"
      style={{ ["--r" as string]: `${i % 2 ? 1.2 : -0.9}deg` }}
      aria-labelledby={`h-${story.slug}`}
    >
      <div className="zg-clip__paper">
        <p className="z-kicker">{story.kicker}</p>
        <h2
          className="z-h2 zs-brief__head"
          id={`h-${story.slug}`}
          style={{ ["--zh" as string]: headSize(story.headline, [8.4, 7.2, 6.4, 5.8]) }}
        >
          <Link href={href} className="z-link-head">
            <Ringed text={story.headline} />
          </Link>
        </h2>
        {image ? (
          <div className="zg-clip__photo">
            <Photo photo={image} ratio="2 / 1" sizes="(max-width: 900px) 100vw, 560px" />
            <Credit photos={[image]} />
          </div>
        ) : null}
        {showDek ? <p className="z-dek">{story.dek}</p> : null}
        <Byline story={story} />
        <Body story={story} drop className="zs-body zg-clip__body">
          <ReadOn href={href} />
        </Body>
      </div>
      <Tape at={i % 2 ? "tr" : "tl"} />
    </article>
  );
}
