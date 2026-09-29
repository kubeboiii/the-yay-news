import type { Edition, Image as EditionImage } from "@repo/shared";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Burst } from "@/features/print/burst";
import { Mark } from "@/features/print/mark";
import type { PageProps, Reading, StoryItem } from "../types";
import {
  credit,
  Folio,
  type Ground,
  groundFor,
  lengthClass,
  minutes,
  pageNumberOf,
  PrintPhoto,
  pullQuote,
  ranked,
  readMinutes,
  spreadNumbers,
} from "./print";

// An inside page prints as a spread. The left-hand page is the section's opener, on the section's
// pastel ground; the right-hand page, on paper, carries the stories. The opener has three forms:
//
//   · a photograph bled off the top of the page with the section's name set over its edge, when
//     the first story has a photograph (Gaming says "Press play" instead, as in the mockup);
//   · Screen & Sound's paste-up of every photograph on the page, when it has any;
//   · without a photograph, the name set huge off the page's edge above "In these pages".
//
// The right-hand page sets the first (lead or feature) story in full, then the briefs in a band
// at the foot, then the way over the page. The guest section has its own spread (see Guest).

/** Display type that must fit a page's measure: sized by its longest word and its whole length. */
function fitted(text: string, max: number, perWord: number, perText: number): CSSProperties {
  const longest = Math.max(...text.split(/\s+/).map((w) => w.length), 1);
  const size = Math.min(max, perWord / longest, perText / Math.max(text.length, 1));
  return { "--fs": size.toFixed(2) } as CSSProperties;
}

const groundClass = (g: Ground) => `m5-ground m5-ground--${g}`;

function Contents({
  stories,
  reading,
  big,
}: {
  stories: StoryItem[];
  reading: Reading;
  big?: boolean;
}) {
  return (
    <ol className={big ? "m5o-contents m5o-contents--big" : "m5o-contents"}>
      {stories.map((s, i) => (
        <li key={s.slug}>
          <b className="m5-display" aria-hidden>
            {i + 1}
          </b>
          <span>
            <span className="m5-kicker">{s.kicker}</span>
            <Link href={reading.storyHref(s.slug)} className="m5o-contents-head">
              {s.headline}
            </Link>
            {big ? <i>{s.dek}</i> : null}
          </span>
        </li>
      ))}
    </ol>
  );
}

/** A photographic print pasted on at an angle, with tape across one edge. */
function Pasted({
  image,
  className,
  sizes,
  position,
}: {
  image: EditionImage;
  className: string;
  sizes: string;
  position?: string;
}) {
  return (
    <figure className={`m5-pasted print-print ${className}`}>
      <PrintPhoto image={image} sizes={sizes} position={position} />
      <span className="print-tape m5-pasted-tape" aria-hidden />
      <figcaption className="m5-credit">{credit(image)}</figcaption>
    </figure>
  );
}

function OverThePage({
  edition,
  reading,
  big,
}: {
  edition: Edition;
  reading: Reading;
  big?: boolean;
}) {
  const next = reading.next;
  if (!next) return null;
  const back = next.slug === "back";
  const label = back ? "Puzzles & the back page" : next.label;
  const where = `page ${pageNumberOf(reading, next)}`;
  if (!big) {
    return (
      <p className="m5r-turn">
        <b>Over the page</b>{" "}
        <Link href={next.href}>
          {label}, {where} <span aria-hidden>→</span>
        </Link>
      </p>
    );
  }
  // With no briefs to fill the foot of the page, the way on is set as a proper teaser.
  const top = ranked(edition.pages.find((p) => p.order === next.order)?.stories ?? [])[0];
  return (
    <aside className="m5r-next" aria-label="Over the page">
      <p className="m5r-next-label">
        Over the page · {label}, {where}
      </p>
      <p className="m5-display m5r-next-head">
        <Link href={next.href}>
          {top?.headline ?? (back ? "The Mini, a word ladder, a riddle and the small ads" : label)}
        </Link>
      </p>
      {top ? <p className="m5r-next-dek">{top.dek}</p> : null}
      <Mark name="arrows-08" className="m5-hm m5r-next-arrow" />
    </aside>
  );
}

/** The right-hand page: the first story in full, the briefs at the foot. */
function StoryPage({
  edition,
  name,
  stories,
  reading,
  page,
  date,
  photosUsed,
  mainPhotoUsed,
}: {
  edition: Edition;
  name: string;
  stories: StoryItem[];
  reading: Reading;
  page: number;
  date: string;
  photosUsed: boolean;
  mainPhotoUsed: boolean;
}) {
  const [main, ...briefs] = stories;
  const said = main ? pullQuote(main.body) : null;
  // A page with little copy sets it larger, with the pull quote as the page's centrepiece.
  const copy = stories.reduce(
    (n, s) => n + s.headline.length + s.dek.length + s.body.join("").length,
    0,
  );
  const roomy = copy < 1500;
  return (
    <article
      className={`print-sheet print-sheet--bright m5-sheet-flow m5r ${roomy ? "m5r--roomy" : ""} ${
        // Little copy and nothing to picture: the headline is set as the page's picture.
        roomy && !said && !(main?.images[0] && !mainPhotoUsed) ? "m5r--hero" : ""
      }`}
      aria-label={`Page ${page}`}
    >
      <Folio page={page} section={name} date={date} />
      <div className="m5-page-flow">
        {main ? (
          <section className="m5r-main" aria-labelledby={`m5-${main.slug}`}>
            <p className="m5-kicker">
              {main.slot === "brief" ? name : `${main.slot === "lead" ? "The lead" : "Feature"}`} ·{" "}
              {main.kicker}
            </p>
            <h2
              id={`m5-${main.slug}`}
              className={`m5-display m5r-head ${lengthClass(main.headline, [50, 76, 100])}`}
            >
              <Link href={reading.storyHref(main.slug)}>{main.headline}</Link>
            </h2>
            <p className="m5r-dek">{main.dek}</p>
            <p className="m5-byline m5r-by">
              By the Yay {name.toLowerCase()} desk <i>· {minutes(main.readMinutes)} to read</i>
            </p>
            {!mainPhotoUsed && main.images[0] ? (
              <Pasted
                image={main.images[0]}
                className="m5r-print"
                sizes="(max-width: 760px) 90vw, 360px"
              />
            ) : null}
            <div className={said && !roomy ? "m5r-grid m5r-grid--pull" : "m5r-grid"}>
              <div className="m5-body m5r-cols">
                {main.body.map((p, i) => (
                  <p key={i} className={i === 0 ? "m5r-first" : undefined}>
                    {p}
                  </p>
                ))}
              </div>
              {said && !roomy ? (
                <blockquote className="m5-display m5r-pull">“{said}”</blockquote>
              ) : null}
            </div>
            <p className="m5-more">
              <Link href={reading.storyHref(main.slug)}>
                The whole story, with its source <span aria-hidden>→</span>
              </Link>
            </p>
          </section>
        ) : (
          <p className="m5r-empty">Nothing on this page today. Turn over for the rest.</p>
        )}

        {said && roomy ? (
          <blockquote className="m5-display m5r-centre">
            “{said}”
            <Mark name="brush-03" ink="var(--apricot-deep)" className="m5r-centre-mark" />
          </blockquote>
        ) : null}

        <div className="m5r-foot">
          {briefs.length ? (
            <section className="m5r-briefs" aria-labelledby="m5r-briefs">
              <h2 id="m5r-briefs" className="m5-display m5r-briefs-head">
                Also in {name}
              </h2>
              <div className="m5r-brief-row" data-count={Math.min(briefs.length, 3)}>
                {briefs.map((b) => (
                  <article key={b.slug} className="m5r-brief">
                    {!photosUsed && b.images[0] ? (
                      <div className="m5r-brief-photo">
                        <PrintPhoto image={b.images[0]} sizes="(max-width: 760px) 90vw, 300px" />
                        <p className="m5-credit">{credit(b.images[0])}</p>
                      </div>
                    ) : null}
                    <p className="m5-kicker">{b.kicker}</p>
                    <h3 className="m5-display m5r-brief-head">
                      <Link href={reading.storyHref(b.slug)}>{b.headline}</Link>
                    </h3>
                    <p className="m5r-brief-dek">{b.dek}</p>
                    <div className="m5-body m5r-brief-body">
                      {b.body.map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>
                    <p className="m5-more">
                      <Link href={reading.storyHref(b.slug)}>
                        Read on <span aria-hidden>→</span>
                      </Link>
                    </p>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
          <OverThePage edition={edition} reading={reading} big={!briefs.length} />
        </div>
      </div>
    </article>
  );
}

/** Screen & Sound's opener: the page's photographs, pasted up on the ground. */
function Collage({
  name,
  tagline,
  stories,
  photos,
  reading,
  page,
  date,
  ground,
}: {
  name: string;
  tagline: string;
  stories: StoryItem[];
  photos: EditionImage[];
  reading: Reading;
  page: number;
  date: string;
  ground: Ground;
}) {
  const single = photos.length === 1;
  const [first, ...more] = photos;
  return (
    <article
      className={`print-sheet print-sheet--bright m5-sheet-flow m5s-left ${groundClass(ground)}`}
      aria-label={`Page ${page}`}
    >
      <Folio page={page} section={name} date={date} />
      <div className={`m5-page-flow m5s-collage ${single ? "m5s-collage--one" : ""}`}>
        <div className="m5s-top">
          <header className="m5s-head">
            <h1 className="m5-display m5s-title">{name}</h1>
            <p className="m5s-sub">{tagline}</p>
          </header>
          {first ? (
            <div className="m5s-first">
              <Pasted image={first} className="m5s-tv" sizes="(max-width: 760px) 90vw, 440px" />
              <p className="m5-note m5s-note" aria-hidden>
                {first.alt.toLowerCase()}
              </p>
              <Mark name="arrows-07" className="m5-hm m5s-arrow" />
            </div>
          ) : null}
        </div>
        {more.length ? (
          <div className="m5s-row" data-count={more.length}>
            {more.map((img, i) => (
              <Pasted
                key={img.url}
                image={img}
                className={i % 2 ? "m5s-print m5s-print--b" : "m5s-print m5s-print--a"}
                sizes="(max-width: 760px) 90vw, 300px"
              />
            ))}
          </div>
        ) : null}
        <Mark name="sketch-24" className="m5-hm m5s-notes" />
        <section className="m5s-picks" aria-label="In these pages">
          <p className="m5o-label">In these pages</p>
          <Contents stories={stories} reading={reading} />
        </section>
      </div>
    </article>
  );
}

/** The opener with a photograph bled off the top, and the name set across its lower edge. */
function PhotoOpener({
  slug,
  name,
  tagline,
  stories,
  image,
  reading,
  page,
  date,
  ground,
}: {
  slug: string;
  name: string;
  tagline: string;
  stories: StoryItem[];
  image: EditionImage;
  reading: Reading;
  page: number;
  date: string;
  ground: Ground;
}) {
  const gaming = slug === "gaming";
  const word = gaming ? "Press play" : name;
  const mins = readMinutes(stories);
  return (
    <article
      className={`print-sheet print-sheet--bright m5-sheet-flow m5g-left ${groundClass(ground)}`}
      aria-label={`Page ${page}`}
    >
      <Folio page={page} section={name} date={date} />
      <div className="m5g-bleed">
        <PrintPhoto
          image={image}
          priority
          sizes="(max-width: 760px) 100vw, 700px"
          position="50% 42%"
        />
      </div>
      <p className="m5-credit m5g-bleed-credit">{credit(image)}</p>
      {gaming ? (
        <>
          <p className="m5g-slip print-torn" aria-hidden>
            {image.alt.toLowerCase()}
          </p>
          <span className="print-tape m5g-slip-tape" aria-hidden />
        </>
      ) : null}

      <h1
        className="m5-display m5g-word print-misreg"
        style={fitted(word, 44, 330, 520)}
        aria-label={gaming ? `${name}: ${word}` : undefined}
      >
        {word}
      </h1>

      <div className="m5g-under">
        <p className="m5g-stand">
          {tagline}. {stories.length === 1 ? "One story" : `${stories.length} stories`},{" "}
          {minutes(mins)} of reading, over the page.
        </p>
        <section className="m5g-score" aria-label="In these pages">
          <p className="m5o-label">In these pages</p>
          <Contents stories={stories} reading={reading} />
        </section>
      </div>
    </article>
  );
}

/** The opener without a photograph: the name, huge, running off the edge of the page. */
const DOODLES: Record<string, string> = {
  sports: "doodles-01",
  tech: "sketch-40",
  money: "doodles-02",
  discoveries: "stars-06",
  "internet-and-culture": "doodles-06",
  gaming: "doodles-03",
  "screen-and-sound": "sketch-24",
};
const doodleFor = (slug: string) => DOODLES[slug] ?? "stars-06";

function TypeOpener({
  slug,
  name,
  tagline,
  stories,
  reading,
  page,
  date,
  ground,
}: {
  slug: string;
  name: string;
  tagline: string;
  stories: StoryItem[];
  reading: Reading;
  page: number;
  date: string;
  ground: Ground;
}) {
  const mins = readMinutes(stories);
  return (
    <article
      className={`print-sheet print-sheet--bright m5-sheet-flow m5o-left ${groundClass(ground)}`}
      aria-label={`Page ${page}`}
    >
      <Folio page={page} section={name} date={date} />
      <div className="m5-page-flow m5o-page">
        <h1 className="m5-display m5o-title" style={fitted(name, 46, 330, 640)}>
          {name}
        </h1>
        <p className="m5o-stand">{tagline}</p>
        <section className="m5o-inside" aria-label="In these pages">
          <p className="m5o-label">In these pages</p>
          <Contents stories={stories} reading={reading} big />
        </section>
        {/* A block of the section's deeper ink with a drawing on it, where a photograph would go. */}
        <div className="m5o-poster" aria-hidden>
          <span className="print-tape m5o-poster-tape" />
          <Mark name={doodleFor(slug)} className="m5o-poster-mark" />
          <Burst
            fill="var(--paper)"
            points={12}
            depth={0.14}
            wobble={1}
            className="m5o-sticker print-worn"
          >
            <p className="m5o-sticker-text">
              <b className="m5-display">{mins}</b>
              <span>{mins === 1 ? "minute" : "minutes"}, start to finish</span>
            </p>
          </Burst>
        </div>
      </div>
    </article>
  );
}

/** A core section's inside page. */
export function Section({ edition, page, reading }: PageProps) {
  const name = page.section?.name ?? reading.current.label;
  const slug = page.section?.slug ?? reading.current.slug;
  const tagline = page.section?.tagline ?? "";
  const [left, right] = spreadNumbers(reading);
  const stories = ranked(page.stories);
  const ground = groundFor(slug);
  const photo = stories[0]?.images[0];
  // Screen & Sound pastes up its briefs' photographs (or, if they have none, the feature's).
  const briefPhotos = stories.slice(1).flatMap((s) => s.images.slice(0, 1));
  const collagePhotos = (briefPhotos.length ? briefPhotos : photo ? [photo] : []).slice(0, 3);
  const collage = slug === "screen-and-sound" && collagePhotos.length > 0;
  const common = { name, tagline, stories, reading, page: left, date: edition.date, ground };

  return (
    <div className="print-sheet-wrap">
      <div className="print-spread">
        {collage ? (
          <Collage {...common} photos={collagePhotos} />
        ) : photo ? (
          <PhotoOpener {...common} slug={slug} image={photo} />
        ) : (
          <TypeOpener {...common} slug={slug} />
        )}
        <StoryPage
          edition={edition}
          name={name}
          stories={stories}
          reading={reading}
          page={right}
          date={edition.date}
          photosUsed={collage}
          mainPhotoUsed={collage && !briefPhotos.length}
        />
      </div>
    </div>
  );
}

/**
 * The guest section: a visiting page, so it is set differently from the core sections. The
 * left-hand page is a centred title page on butter, stamped "Guest section", with the first
 * story's headline and standfirst; the right-hand page pastes in its photograph, runs its text in
 * two columns with a drop cap and its pull quote, and any other stories as torn clippings.
 */
export function Guest({ edition, page, reading }: PageProps) {
  const name = page.section?.name ?? reading.current.label;
  const tagline = page.section?.tagline ?? "";
  const [left, right] = spreadNumbers(reading);
  const [main, ...more] = ranked(page.stories);
  const said = main ? pullQuote(main.body) : null;
  const image = main?.images[0];

  return (
    <div className="print-sheet-wrap">
      <div className="print-spread">
        <article
          className="print-sheet print-sheet--bright m5-sheet-flow m5q-left"
          aria-label={`Page ${left}`}
        >
          <Folio page={left} section={`Guest section · ${name}`} date={edition.date} />
          <div className="m5-page-flow m5q-title-page">
            <p className="m5f-stamp m5q-stamp print-worn">Guest section</p>
            <h1 className="m5-display m5q-title" style={fitted(name, 30, 190, 560)}>
              {name}
            </h1>
            <p className="m5q-tagline">{tagline}</p>
            <div className="m5q-rules" aria-hidden />
            {main ? (
              <header className="m5q-story">
                <p className="m5-kicker">{main.kicker}</p>
                <h2 className={`m5-display m5q-head ${lengthClass(main.headline, [50, 76, 100])}`}>
                  <Link href={reading.storyHref(main.slug)}>{main.headline}</Link>
                </h2>
                <p className="m5q-dek">{main.dek}</p>
                <p className="m5-byline">
                  For the Yay News <i>· {minutes(main.readMinutes)} to read, over the page</i>
                </p>
                <Mark name="stars-06" className="m5-hm m5q-stars" />
              </header>
            ) : null}
            {more.length ? (
              <section className="m5q-also" aria-label={`Also from ${name}`}>
                <p className="m5o-label">Also in this section</p>
                <Contents stories={more} reading={reading} />
              </section>
            ) : null}
          </div>
        </article>

        <article
          className="print-sheet print-sheet--bright m5-sheet-flow m5q-right"
          aria-label={`Page ${right}`}
        >
          <Folio page={right} section={`Guest section · ${name}`} date={edition.date} />
          <div className="m5-page-flow m5q-page" data-stories={Math.min(1 + more.length, 3)}>
            {main ? (
              <section className="m5q-main" aria-label={main.headline}>
                <p className="m5q-cont">
                  Continued from page {left} · {main.kicker}
                </p>
                {image ? (
                  <Pasted
                    image={image}
                    className="m5q-print"
                    sizes="(max-width: 760px) 90vw, 520px"
                  />
                ) : null}
                <div className={`m5-body m5q-cols ${more.length ? "" : "m5q-cols--solo"}`}>
                  {main.body.map((p, i) => (
                    <p key={i} className={i === 0 ? "m5r-first" : undefined}>
                      {p}
                    </p>
                  ))}
                </div>
                <p className="m5-more">
                  <Link href={reading.storyHref(main.slug)}>
                    The whole story, with its source <span aria-hidden>→</span>
                  </Link>
                </p>
                {/* The quote (or, failing one, the standfirst) as the page's pull quote. */}
                <blockquote className="m5-display m5q-pull">
                  “{said ?? main.dek}”
                  <Mark name="brush-03" ink="var(--butter-deep)" className="m5r-centre-mark" />
                </blockquote>
              </section>
            ) : null}
            {more.length ? (
              <section className="m5q-clips" aria-labelledby="m5q-clips">
                <h2 id="m5q-clips" className="m5-display m5r-briefs-head">
                  Also from {name}
                </h2>
                <div className="m5q-clip-row" data-count={more.length}>
                  {more.map((b, i) => (
                    <article
                      key={b.slug}
                      className={`m5q-clip ${i % 2 ? "m5q-clip--b" : "m5q-clip--a"}`}
                    >
                      <div className="m5q-clip-paper print-torn" aria-hidden />
                      {b.images[0] ? (
                        <div className="m5r-brief-photo">
                          <PrintPhoto image={b.images[0]} sizes="(max-width: 760px) 90vw, 300px" />
                          <p className="m5-credit">{credit(b.images[0])}</p>
                        </div>
                      ) : null}
                      <p className="m5-kicker">{b.kicker}</p>
                      <h3 className="m5-display m5q-clip-head">
                        <Link href={reading.storyHref(b.slug)}>{b.headline}</Link>
                      </h3>
                      <p className="m5q-clip-dek">{b.dek}</p>
                      <div className="m5-body m5q-clip-body">
                        {b.body.map((p, k) => (
                          <p key={k}>{p}</p>
                        ))}
                      </div>
                      <p className="m5-more">
                        <Link href={reading.storyHref(b.slug)}>
                          Read on <span aria-hidden>→</span>
                        </Link>
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}
            <div className="m5q-foot">
              <OverThePage edition={edition} reading={reading} big />
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
