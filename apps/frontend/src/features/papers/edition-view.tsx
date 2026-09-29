import type { Edition, EditionDesign, Story } from "@repo/shared";
import { PageBar } from "@/features/reader/page-bar";
import { ShareBar } from "@/features/reader/share-bar";
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
      <PrintedPage edition={edition} page={page} />
      <PageBar issue={edition.issueNumber} reading={readingFor(edition, page)} />
    </>
  );
}

/** One page inside its design's frame, with nothing around it. */
function PrintedPage({ edition, page }: { edition: Edition; page: EditionPage }) {
  const paper = papers[edition.design];
  const props: PageProps = { edition, page, reading: readingFor(edition, page) };
  return (
    <paper.Frame colourway={edition.colourway}>
      {page.layout === "front" ? (
        <paper.Front {...props} />
      ) : page.layout === "back" ? (
        <paper.Back {...props} />
      ) : page.layout === "guest" ? (
        <paper.Guest {...props} />
      ) : (
        <paper.Section {...props} />
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
      <ShareBar data={printed} />
    </>
  );
}
