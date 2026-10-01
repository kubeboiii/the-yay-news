import type { Edition, EditionDesign, Story } from "@repo/shared";
import type { CSSProperties } from "react";
import { RewardHost, RewardOffer } from "@/features/cards/rewards";
import { ReadingTracker } from "@/features/habits/reading";
import { SaveStoryButton } from "@/features/habits/save-story";
import { StickerLayer } from "@/features/habits/stickers";
import { ShareBar, StoryCut } from "@/features/reader/share-bar";
import { Pager } from "@/features/site/pager";
import { pagerPages } from "@/features/site/pager-pages";
import { Heading, RiotTheme, riotInks } from "@/features/riot";
import { ZineLink } from "@/features/zine/zine-link";
import "./take-zine.css";
import { Balance } from "./balance";
import { withOnePictureGroup } from "./plates";
import { readingFor, storyLinks } from "./reading";
import { papers } from "./registry";
import type { EditionPage, PageProps } from "./types";

/** Printing an edition in another design (a dev preview) uses that design's house colourway. */
function designed<T extends { design: EditionDesign; colourway: string }>(
  e: T,
  design?: EditionDesign,
): T {
  if (!design || design === e.design) return e;
  return { ...e, design, colourway: design === "broadsheet" ? "original" : "house" };
}

/** One page of an edition, printed in the edition's design and colourway. */
export function EditionPageView({
  edition: printed,
  page,
  design,
}: {
  edition: Edition;
  page: EditionPage;
  design?: EditionDesign;
}) {
  const edition = designed(printed, design);
  return (
    <>
      <div className="ys-reading">
        <PrintedPage edition={edition} page={page} live />
      </div>
      {page.layout === "back" ? (
        <RiotTheme
          as="section"
          inks={riotInks({ design: edition.design, colourway: edition.colourway })}
          surface={false}
          className="yz-take print:hidden"
          aria-labelledby="yz-take-h"
        >
          <div className="yz-take__in">
            <Heading as="h2" id="yz-take-h" className="yz-take__h">
              Take today with you
            </Heading>
            <p className="yz-take__what rt-meta">One A4 sheet · one cut · eight pages</p>
            <ZineLink issue={edition.issueNumber} className="rt-go rt-go--ink yz-take__go">
              <span className="rt-go__label">Download the mini zine</span>
              <span className="rt-go__sub">a PDF to print, fold and keep</span>
            </ZineLink>
          </div>
        </RiotTheme>
      ) : null}
      <ReadingTracker
        edition={edition}
        page={page}
        extra={<RewardOffer key="reward-offer" issue={edition.issueNumber} />}
      />
      <RewardHost />
      <Pager
        issue={edition.issueNumber}
        date={edition.date}
        pages={pagerPages(edition)}
        current={page.order}
      />
    </>
  );
}

/**
 * One page inside its design's frame, with nothing around it. `live` (the reading view, not the
 * print view) adds the reader's stickers stuck on the page.
 */
function PrintedPage({
  edition: whole,
  page: wholePage,
  live,
}: {
  edition: Edition;
  page: EditionPage;
  live?: boolean;
}) {
  const edition = withOnePictureGroup(whole);
  const page = edition.pages.find((p) => p.order === wholePage.order) ?? wholePage;
  const paper = papers[edition.design];
  const props: PageProps = { edition, page, reading: readingFor(edition, page) };
  const printed =
    page.layout === "front" ? (
      <paper.Front {...props} />
    ) : page.layout === "back" ? (
      <paper.Back {...props} />
    ) : page.layout === "guest" ? (
      <paper.Guest {...props} />
    ) : (
      <paper.Section {...props} />
    );
  const coloured = (
    <div
      className="yn-sec"
      data-section={page.section?.slug}
      style={
        page.section ? ({ "--section-colour": page.section.colour } as CSSProperties) : undefined
      }
    >
      {printed}
    </div>
  );
  return (
    <paper.Frame colourway={edition.colourway}>
      <Balance />
      {live ? (
        <div className="relative w-full">
          {coloured}
          <StickerLayer issue={edition.issueNumber} page={page.order} />
        </div>
      ) : (
        coloured
      )}
    </paper.Frame>
  );
}

/**
 * The whole edition, every page in order, for printing or saving as a PDF: no page bar, each page
 * in its own frame, one printed sheet apiece (see features/reader/print-edition.css).
 */
export function EditionPrintView({
  edition: printed,
  design,
}: {
  edition: Edition;
  design?: EditionDesign;
}) {
  const edition = designed(printed, design);
  return [...edition.pages]
    .sort((a, b) => a.order - b.order)
    .map((page) => (
      <section
        key={page.order}
        className="yn-print-page"
        data-design={edition.design}
        aria-label={`Page ${page.order}`}
      >
        <PrintedPage edition={edition} page={page} />
      </section>
    ));
}

/** A story's own page, in its edition's design. */
export function StoryView({ data: printed, design }: { data: Story; design?: EditionDesign }) {
  const data = { ...printed, edition: designed(printed.edition, design) };
  const paper = papers[data.edition.design];
  return (
    <>
      <paper.Frame colourway={data.edition.colourway}>
        <paper.Story data={data} links={storyLinks(data)} />
      </paper.Frame>
      <div className="flex flex-wrap items-start justify-center gap-x-8 gap-y-4 bg-[#e4ded3] px-4 pt-8 font-sans text-base text-[#1c1a17] print:hidden">
        <StoryCut data={printed} />
        <SaveStoryButton
          issue={printed.edition.issueNumber}
          slug={printed.story.slug}
          headline={printed.story.headline}
          kicker={printed.story.kicker}
          date={printed.edition.date}
        />
      </div>
      <ShareBar data={printed} />
    </>
  );
}
