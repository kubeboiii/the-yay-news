import type { CSSProperties, ReactNode } from "react";
import type { PageProps, Reading, StoryItem } from "../types";
import { Body, Briefs, Photo, SectionTitle, StoryHead } from "./blocks";
import { guestComposition, type InsideComposition, insideCompositions } from "./compose";
import { Folio, type Ground, groundFor, minutes, PrintPhoto, ranked, spreadNumbers } from "./print";

// An inside page prints as a spread: the main story with its photograph, the second story, and an
// "In brief" column of the short items, each printed once and in full. Eight compositions arrange
// them differently (see compose.ts): which page carries the section's colour, where the photograph
// sits and how big, how the headline is set, whether the second story is ruled off or boxed, and
// whether the briefs run as a numbered column or a strip.

/** Display type that must fit a page's measure: sized by its longest word and its whole length. */
function fitted(text: string, max: number, perWord: number, perText: number): CSSProperties {
  const longest = Math.max(...text.split(/\s+/).map((w) => w.length), 1);
  const size = Math.min(max, perWord / longest, perText / Math.max(text.length, 1));
  return { "--fs": size.toFixed(2) } as CSSProperties;
}

type Parts = {
  name: string;
  tagline: string;
  main?: StoryItem;
  second?: StoryItem;
  briefs: StoryItem[];
  reading: Reading;
};

/** Main story, second story (a second feature, if there is one) and briefs. */
function split(stories: StoryItem[]) {
  const [main, ...rest] = ranked(stories);
  const second = rest[0] && rest[0].slot !== "brief" ? rest[0] : undefined;
  const briefs = second ? rest.slice(1) : rest;
  return { main, second, briefs };
}

const desk = (name: string) => `By the Yay ${name.toLowerCase()} desk`;
const byline = (name: string, s: StoryItem) => `${desk(name)} · ${minutes(s.readMinutes)} to read`;

function Sheet({
  page,
  name,
  date,
  ground,
  className,
  children,
}: {
  page: number;
  name: string;
  date: string;
  ground?: Ground;
  className?: string;
  children: ReactNode;
}) {
  return (
    <article
      className={`print-sheet print-sheet--bright m5-sheet-flow ${ground ? `m5-ground m5-ground--${ground}` : ""} ${className ?? ""}`}
      aria-label={`Page ${page}`}
    >
      <Folio page={page} section={name} date={date} />
      {children}
    </article>
  );
}

/** The main story's photograph bled off the top of the page, the section's name across its edge. */
function BleedTitle({ p, tall }: { p: Parts; tall?: boolean }) {
  const image = p.main?.images[0];
  return (
    <>
      {image ? (
        <div className={tall ? "m5k-bleed m5k-bleed--tall" : "m5k-bleed"}>
          <PrintPhoto image={image} priority sizes="(max-width: 760px) 100vw, 700px" />
        </div>
      ) : null}
      <h1 className="m5-display m5k-edge print-misreg" style={fitted(p.name, 30, 300, 480)}>
        {p.name}
      </h1>
    </>
  );
}

function Main({
  p,
  size,
  photo,
  drop = true,
}: {
  p: Parts;
  size: "hero" | "big" | "mid" | "quiet";
  photo: "top" | "inset" | "none";
  drop?: boolean;
}) {
  const s = p.main;
  if (!s) return null;
  const image = photo !== "none" ? s.images[0] : undefined;
  return (
    <section className="m5k-main" aria-labelledby={`h-${s.slug}`}>
      <StoryHead story={s} reading={p.reading} size={size} byline={byline(p.name, s)} />
      {image && photo === "top" ? (
        <Photo image={image} className="m5k-photo--top" sizes="(max-width: 760px) 100vw, 640px" />
      ) : null}
      {image && photo === "inset" ? (
        <div className="m5-body m5-read m5-read--2 m5k-inset-flow">
          <Photo
            image={image}
            className="m5k-photo--inset"
            sizes="(max-width: 760px) 100vw, 320px"
            pasted
          />
          {s.body.map((para, i) => (
            <p key={i} className={drop && i === 0 ? "m5-drop" : undefined}>
              {para}
            </p>
          ))}
        </div>
      ) : (
        <Body story={s} drop={drop} />
      )}
    </section>
  );
}

function MainText({ p }: { p: Parts }) {
  const s = p.main;
  if (!s) return null;
  return (
    <section className="m5k-main" aria-label={s.headline}>
      <p className="m5-byline m5k-by m5k-by--rule">{byline(p.name, s)}</p>
      <Body story={s} drop />
    </section>
  );
}

function Second({
  p,
  variant,
  photo,
}: {
  p: Parts;
  variant: "ruled" | "boxed" | "column";
  photo: "top" | "inset" | "none";
}) {
  const s = p.second;
  if (!s) return null;
  const image = photo !== "none" ? s.images[0] : undefined;
  const column = variant === "column";
  return (
    <section className={`m5k-second m5k-second--${variant}`} aria-labelledby={`h-${s.slug}`}>
      {image && photo === "top" ? (
        <Photo
          image={image}
          className="m5k-photo--second"
          sizes="(max-width: 760px) 100vw, 400px"
        />
      ) : null}
      <StoryHead story={s} reading={p.reading} size="mid" level={2} />
      {image && photo === "inset" ? (
        <div className="m5-body m5-read m5-read--2 m5k-inset-flow">
          <Photo
            image={image}
            className="m5k-photo--inset"
            sizes="(max-width: 760px) 100vw, 320px"
          />
          {s.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      ) : (
        <Body story={s} cols={column ? 1 : 2} />
      )}
    </section>
  );
}

function Spread({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <div className="print-sheet-wrap">
      <div className="print-spread">
        {left}
        {right}
      </div>
    </div>
  );
}

function compose(c: InsideComposition, p: Parts, pages: [number, number], date: string, g: Ground) {
  const sheet = (n: 0 | 1, children: ReactNode, ground?: boolean, cls?: string) => (
    <Sheet
      page={pages[n]}
      name={p.name}
      date={date}
      ground={ground ? g : undefined}
      className={cls}
    >
      {children}
    </Sheet>
  );
  const flow = (children: ReactNode, cls?: string) => (
    <div className={`m5-page-flow ${cls ?? ""}`}>{children}</div>
  );
  const band = <SectionTitle name={p.name} tagline={p.tagline} variant="band" />;
  const huge = <SectionTitle name={p.name} tagline={p.tagline} variant="huge" />;
  const secondPhoto = p.second?.images[0] ? "top" : "none";

  switch (c) {
    // Photograph bled off the top of the coloured page, the name across its edge, the main story
    // below it; the second story and a strip of briefs on paper opposite.
    case "photo-led":
      return (
        <Spread
          left={sheet(
            0,
            <>
              <BleedTitle p={p} />
              {flow(<Main p={p} size="big" photo="none" />, "m5k-under-bleed")}
            </>,
            true,
            "m5k-bleed-sheet",
          )}
          right={sheet(
            1,
            flow(
              <>
                <Second p={p} variant="ruled" photo={p.second?.images[0] ? "inset" : "none"} />
                <Briefs
                  stories={p.briefs}
                  reading={p.reading}
                  variant="strip"
                  className="m5k-foot"
                />
              </>,
            ),
          )}
        />
      );
    // The same idea mirrored: the coloured photo page is on the right, the second story (photo on
    // top) and a numbered briefs column share the left.
    case "photo-led-right":
      return (
        <Spread
          left={sheet(
            0,
            flow(
              <div className="m5k-two">
                <Second p={p} variant="column" photo={secondPhoto} />
                <Briefs stories={p.briefs} reading={p.reading} variant="numbered" />
              </div>,
            ),
          )}
          right={sheet(
            1,
            <>
              <BleedTitle p={p} />
              {flow(<Main p={p} size="big" photo="none" />, "m5k-under-bleed")}
            </>,
            true,
            "m5k-bleed-sheet",
          )}
        />
      );
    // A picture page: the main photograph large, the headline and standfirst under it and the briefs
    // at its foot; the story's text and the second story run on paper opposite.
    case "picture-story":
      return (
        <Spread
          left={sheet(
            0,
            <>
              <BleedTitle p={p} tall />
              {flow(
                <>
                  {p.main ? <StoryHead story={p.main} reading={p.reading} size="hero" /> : null}
                  <Briefs
                    stories={p.briefs}
                    reading={p.reading}
                    variant="strip"
                    className="m5k-foot"
                  />
                </>,
                "m5k-under-bleed",
              )}
            </>,
            true,
            "m5k-bleed-sheet",
          )}
          right={sheet(
            1,
            flow(
              <>
                <MainText p={p} />
                <Second p={p} variant="ruled" photo={p.second?.images[0] ? "inset" : "none"} />
              </>,
            ),
          )}
        />
      );
    // The headline set big across the top of a paper page, photograph under it; the coloured page
    // opposite splits into the second story and a numbered briefs column.
    case "headline-across":
      return (
        <Spread
          left={sheet(
            0,
            flow(
              <>
                {band}
                <Main p={p} size="hero" photo="top" />
              </>,
            ),
          )}
          right={sheet(
            1,
            flow(
              <div className="m5k-two">
                <Second p={p} variant="column" photo={secondPhoto} />
                <Briefs stories={p.briefs} reading={p.reading} variant="numbered" />
              </div>,
            ),
            true,
          )}
        />
      );
    case "headline-across-right":
      return (
        <Spread
          left={sheet(
            0,
            flow(
              <>
                {band}
                <div className="m5k-two">
                  <Briefs stories={p.briefs} reading={p.reading} variant="numbered" />
                  <Second p={p} variant="column" photo={secondPhoto} />
                </div>
              </>,
            ),
            true,
          )}
          right={sheet(1, flow(<Main p={p} size="hero" photo="top" />))}
        />
      );
    // The name huge on the coloured page, the second story boxed on paper stock pasted onto it and
    // the briefs as a strip; the main story opposite with its photograph across the top.
    case "boxed-feature":
      return (
        <Spread
          left={sheet(
            0,
            flow(
              <>
                {huge}
                <Second p={p} variant="boxed" photo={p.second?.images[0] ? "inset" : "none"} />
                <Briefs
                  stories={p.briefs}
                  reading={p.reading}
                  variant="strip"
                  className="m5k-foot"
                />
              </>,
            ),
            true,
          )}
          right={sheet(1, flow(<Main p={p} size="big" photo="top" />))}
        />
      );
    case "boxed-feature-right":
      return (
        <Spread
          left={sheet(0, flow(<Main p={p} size="hero" photo="top" />))}
          right={sheet(
            1,
            flow(
              <>
                {huge}
                <Briefs stories={p.briefs} reading={p.reading} variant="strip" />
                <Second p={p} variant="boxed" photo={p.second?.images[0] ? "inset" : "none"} />
              </>,
            ),
            true,
          )}
        />
      );
    // A quiet page: italic headline, the photograph pasted into the first column; the coloured page
    // opposite runs the second story under its photograph and the briefs along the foot.
    case "quiet-inset":
      return (
        <Spread
          left={sheet(
            0,
            flow(
              <>
                {band}
                <Main p={p} size="quiet" photo="inset" />
              </>,
            ),
          )}
          right={sheet(
            1,
            flow(
              <>
                <Second p={p} variant="ruled" photo={secondPhoto} />
                <Briefs
                  stories={p.briefs}
                  reading={p.reading}
                  variant="strip"
                  className="m5k-foot"
                />
              </>,
            ),
            true,
          )}
        />
      );
  }
}

/** A core section's inside page. */
export function Section({ edition, page, reading }: PageProps) {
  const name = page.section?.name ?? reading.current.label;
  const slug = page.section?.slug ?? reading.current.slug;
  const parts: Parts = {
    name,
    tagline: page.section?.tagline ?? "",
    reading,
    ...split(page.stories),
  };
  const composition = insideCompositions(edition).get(page.order) ?? "headline-across";
  return (
    <div className="m5k" data-composition={composition} data-ground={groundFor(slug)}>
      {compose(composition, parts, spreadNumbers(reading), edition.date, groundFor(slug))}
    </div>
  );
}

/**
 * The guest section, a visiting page, set apart from the core sections: a butter title page stamped
 * "Guest section". Two compositions: the title page carries the main story's headline and text with
 * the second story and brief opposite, or the main story runs on paper with its photograph and the
 * title page opposite carries the second story boxed and the brief.
 */
export function Guest({ edition, page, reading }: PageProps) {
  const name = page.section?.name ?? reading.current.label;
  const parts: Parts = {
    name,
    tagline: page.section?.tagline ?? "",
    reading,
    ...split(page.stories),
  };
  const [left, right] = spreadNumbers(reading);
  const composition = guestComposition(edition, page);
  const label = `Guest section · ${name}`;
  const title = (
    <header className="m5q-head">
      <p className="m5f-stamp m5q-stamp print-worn">Guest section</p>
      <h1 className="m5-display m5q-title" style={fitted(name, 22, 190, 560)}>
        {name}
      </h1>
      {parts.tagline ? <p className="m5q-tagline">{parts.tagline}</p> : null}
      <div className="m5q-rules" aria-hidden />
    </header>
  );
  const flow = (children: ReactNode) => <div className="m5-page-flow">{children}</div>;
  const sheet = (n: number, children: ReactNode, butter?: boolean) => (
    <article
      className={`print-sheet print-sheet--bright m5-sheet-flow ${butter ? "m5q-butter" : ""}`}
      aria-label={`Page ${n}`}
    >
      <Folio page={n} section={label} date={edition.date} />
      {children}
    </article>
  );
  const s = parts.second;
  return (
    <div className="m5k" data-composition={composition} data-ground="butter">
      <Spread
        left={
          composition === "guest-title"
            ? sheet(
                left,
                flow(
                  <>
                    {title}
                    <Main p={parts} size="big" photo="inset" />
                  </>,
                ),
                true,
              )
            : sheet(left, flow(<Main p={parts} size="hero" photo="top" />))
        }
        right={
          composition === "guest-title"
            ? sheet(
                right,
                flow(
                  <>
                    <Second p={parts} variant="ruled" photo={s?.images[0] ? "inset" : "none"} />
                    <Briefs
                      stories={parts.briefs}
                      reading={reading}
                      variant="strip"
                      className="m5k-foot"
                    />
                  </>,
                ),
              )
            : sheet(
                right,
                flow(
                  <>
                    {title}
                    <Second p={parts} variant="boxed" photo={s?.images[0] ? "inset" : "none"} />
                    <Briefs
                      stories={parts.briefs}
                      reading={reading}
                      variant="numbered"
                      className="m5k-foot"
                    />
                  </>,
                ),
                true,
              )
        }
      />
    </div>
  );
}
