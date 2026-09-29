import type { StoryItem } from "@repo/shared";
import type { PageProps } from "../types";
import { Briefs, StoryBlock, type BriefsVariant, type StoryVariant } from "./blocks";
import { balance, briefMM, insideComposition, storyMM } from "./compose";
import { Across, doodleFor, Folio, Head, Page, RunningHead, Spread } from "./parts";
import { byOrder, fitSize, folios, groundsFor, shortDate } from "./text";

/*
 * A core section prints as one spread: the main story on the left page under the section's head,
 * the second story and the "In brief" column on the right — every story in full. The treatment of
 * each (print on top, floated, after the opening paragraph, in a side rail; the second story
 * floated, under a taped brief box or on a block of ink; numbered, boxed or ruled briefs) comes
 * from compose.ts, so no two inside spreads of an edition are laid out alike.
 *
 * Screen & Sound's main picture goes onto a strip of film and Gaming's main story into its
 * cartridge label when the composition puts the print across the top; Gaming keeps its pixel head.
 */
export function Section({ edition, page, reading }: PageProps) {
  const slug = page.section?.slug ?? reading.current.slug;
  const name = page.section?.name ?? reading.current.label;
  const tagline = page.section?.tagline ?? "";
  const stories = byOrder(page.stories);
  const main = stories.filter((s) => s.slot !== "brief");
  const briefs = stories.filter((s) => s.slot === "brief");
  const [first, second, ...more] = main;
  const [gl, gr] = groundsFor(edition.issueNumber, page.order);
  const [lf, rf] = folios(reading, page.order);
  const date = shortDate(edition.date);
  const size = fitSize(name, 300, 23, 12);
  const comp = insideComposition(edition, page);
  const next = reading.next ? { ...reading.next, n: folios(reading, reading.next.order)[0] } : null;

  const leftVariant: StoryVariant =
    comp.left.variant === "top" && slug === "gaming"
      ? "cart"
      : comp.left.variant === "top" && slug === "screen-and-sound"
        ? "film"
        : comp.left.variant;

  const head = (side: "left" | "right") =>
    slug === "gaming" && side === "left" ? (
      <GamingMast name={name} tagline={tagline} />
    ) : slug === "gaming" ? null : (
      <Across side={side} height={size + 9}>
        <Head as={side === "left" ? "h1" : "div"} top={tagline} bottom={name} size={size} />
      </Across>
    );

  const secondBlock = (s: StoryItem, i: number) => (
    <StoryBlock
      key={s.slug}
      story={s}
      href={reading.storyHref(s.slug)}
      variant={i === 0 ? comp.right.second : "float"}
      side={i === 0 ? comp.right.secondSide : "right"}
      size="m"
      className="zc-second"
    />
  );
  const rest = [second, ...more].filter((s): s is StoryItem => !!s);
  // Share the copy out so the two pages come out close in length: the briefs (or the second
  // story) move under the main story when the right page would otherwise run much longer.
  const est = [
    first ? storyMM(first, leftVariant, comp.left.size) + (slug === "gaming" ? 40 : 0) : 0,
    rest.reduce((n, s) => n + storyMM(s, comp.right.second, "m") + 8, 0),
    briefs.map(briefMM),
  ] as const;
  const place = balance(est[0], est[1], est[2]);
  const leftBriefs = briefs.slice(0, place.briefsLeft);
  const rightBriefs = briefs.slice(place.briefsLeft);
  const leftSeconds = place.secondLeft ? rest : [];
  const rightSeconds = place.secondLeft ? [] : rest;
  const briefBlock = (items: StoryItem[], variant: BriefsVariant, from = 0) => (
    <Briefs
      stories={items}
      storyHref={reading.storyHref}
      variant={variant}
      mark={doodleFor(slug)}
      from={from}
    />
  );

  return (
    <Spread label={`${name} spread`}>
      <Page
        ground={gl}
        side="left"
        className="zc-page"
        composition={`${comp.name} · ${place.name}`}
        data-estimate={[est[0], est[1], ...est[2]].map(Math.round).join("/")}
      >
        <RunningHead>The Yay Zine · {name}</RunningHead>
        {head("left")}
        {first ? (
          <StoryBlock
            story={first}
            href={reading.storyHref(first.slug)}
            variant={leftVariant}
            size={comp.left.size}
            dots={comp.left.dots}
            side={comp.left.side}
            priority
            className="zc-main"
          />
        ) : (
          <p className="zs-empty">Nothing in {name} today.</p>
        )}
        {leftSeconds.map(secondBlock)}
        {briefBlock(leftBriefs, comp.right.briefs)}
        <Folio n={lf} date={date} />
      </Page>

      <Page ground={gr} side="right" className="zc-page">
        <RunningHead>The Yay Zine · {name}</RunningHead>
        {head("right")}
        {comp.right.briefsFirst
          ? briefBlock(rightBriefs, comp.right.briefs, leftBriefs.length)
          : null}
        {rightSeconds.map(secondBlock)}
        {comp.right.briefsFirst
          ? null
          : briefBlock(rightBriefs, comp.right.briefs, leftBriefs.length)}
        <Folio n={rf} date={date} next={next} />
      </Page>
    </Spread>
  );
}

// ——— Gaming's head: the section name as a mosaic of lit cells ———

// A 5 × 7 bitmap for each letter of "GAMING"; "1" is a lit cell.
const GLYPHS: Record<string, string[]> = {
  G: ["01110", "10001", "10000", "10111", "10001", "10001", "01111"],
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
  I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
  N: ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
};

function GamingMast({ name, tagline }: { name: string; tagline: string }) {
  return (
    <>
      <h1 className="z-sr">{name}</h1>
      <div className="z-mosaic zc-mosaic" aria-hidden>
        {[..."GAMING"].map((ch, i) => (
          <div className="z-mosaic__letter" key={`${ch}${i}`}>
            {(GLYPHS[ch] ?? []).flatMap((row, r) =>
              [...row].map((bit, c) => (
                <span key={`${r}-${c}`} className={bit === "1" ? "on" : undefined} />
              )),
            )}
          </div>
        ))}
      </div>
      {tagline ? <p className="z-game__tag">{tagline}</p> : null}
    </>
  );
}
