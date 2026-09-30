import { SectionDress, dressed } from "../dress";
import type { PageProps } from "../types";
import { Briefs, StoryBlock } from "./blocks";
import { balance, briefMM, guestComposition, storyMM } from "./compose";
import { doodleFor, Folio, Head, Page, RunningHead, Spread } from "./parts";
import { byOrder, fitSize, folios, groundsFor, shortDate } from "./text";

/*
 * The rotating guest section is a visitor, so it prints as one: a stamped "Guest section" head and
 * its stories as clippings of white stock taped onto the spread. Two compositions (compose.ts):
 *
 *   clippings — both stories as torn clippings; the brief in a ruled column
 *   split     — the first story printed straight onto the page under its print; the second as a
 *               clipping; the brief in a taped box
 *
 * The brief goes to whichever page is shorter.
 */
export function Guest({ edition, page, reading }: PageProps) {
  const name = page.section?.name ?? reading.current.label;
  const tagline = page.section?.tagline ?? "";
  const slug = page.section?.slug ?? reading.current.slug;
  const [gl, gr] = groundsFor(edition.issueNumber, page.order);
  const [lf, rf] = folios(reading, page.order);
  const date = shortDate(edition.date);
  const stories = byOrder(page.stories);
  const mains = stories.filter((s) => s.slot !== "brief");
  const briefs = stories.filter((s) => s.slot === "brief");
  const [first, ...rest] = mains;
  const comp = guestComposition(edition, page);
  const next = reading.next ? { ...reading.next, n: folios(reading, reading.next.order)[0] } : null;
  const href = reading.storyHref;
  const firstVariant = comp === "clippings" ? "clip" : "top";
  const place = balance(
    first ? storyMM(first, firstVariant) + 30 : 0,
    rest.reduce((n, s) => n + storyMM(s, "clip", "m") + 8, 0),
    briefs.map(briefMM),
  );
  const briefsVariant = comp === "split" ? "box" : "ruled";
  const leftBriefs = briefs.slice(0, place.briefsLeft);
  const rightBriefs = briefs.slice(place.briefsLeft);

  return (
    <Spread label={`${name} spread`}>
      <Page ground={gl} side="left" className="zg-page zc-page" composition={comp}>
        <RunningHead>The Yay Zine · Guest section</RunningHead>
        <div className="zg-mast">
          <p className="z-stamp print-worn zg-stamp">Guest section</p>
        </div>
        <Head
          as="h1"
          top={tagline || "A visiting section"}
          bottom={name}
          size={fitSize(name, 146, 16, 8.6)}
          wrap
        />
        {dressed(slug, edition.issueNumber, page.order) ? (
          <SectionDress
            slug={slug}
            stories={page.stories}
            issue={edition.issueNumber}
            page={page.order}
            date={edition.date}
          />
        ) : null}
        {first ? (
          <StoryBlock
            story={first}
            href={href(first.slug)}
            variant={firstVariant}
            size="l"
            side="left"
            priority
            className="zc-main"
          />
        ) : null}
        <Briefs
          stories={leftBriefs}
          storyHref={href}
          variant={briefsVariant}
          mark={doodleFor(slug)}
        />
        <Folio n={lf} date={date} />
      </Page>

      <Page ground={gr} side="right" className="zg-page zc-page">
        <RunningHead>The Yay Zine · {name}</RunningHead>
        {rest.map((s, i) => (
          <StoryBlock
            key={s.slug}
            story={s}
            href={href(s.slug)}
            variant="clip"
            size="m"
            side={i % 2 ? "left" : "right"}
            className="zc-second"
          />
        ))}
        <Briefs
          stories={rightBriefs}
          storyHref={href}
          variant={briefsVariant}
          mark={doodleFor(slug)}
          from={leftBriefs.length}
        />
        <Folio n={rf} date={date} next={next} />
      </Page>
    </Spread>
  );
}
