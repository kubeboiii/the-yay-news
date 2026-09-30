import type { Edition, EditionDesign, Story } from "@repo/shared";
import type { CSSProperties } from "react";
import { ReadingTracker } from "@/features/habits/reading";
import { SaveStoryButton } from "@/features/habits/save-story";
import { StickerLayer } from "@/features/habits/stickers";
import { PageBar } from "@/features/reader/page-bar";
import { ShareBar } from "@/features/reader/share-bar";
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
      <PrintedPage edition={edition} page={page} live />
      <ReadingTracker edition={edition} page={page} />
      <PageBar issue={edition.issueNumber} reading={readingFor(edition, page)} />
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
      <div className="flex justify-center bg-[#e4ded3] px-4 pt-8 font-sans text-base text-[#1c1a17] print:hidden">
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
