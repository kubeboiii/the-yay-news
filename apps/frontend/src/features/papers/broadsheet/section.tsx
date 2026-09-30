import { Band } from "../plates";
import type { PageProps, Reading, StoryItem } from "../types";
import { Briefs, Copy, InkPull, Media, StoryBlock, StoryHead, frameFor } from "./blocks";
import { SectionDress, dressed } from "../dress";
import { Special, specialParts } from "../spreads";
import { type SectionComp, type Theme, isSpecial, sectionComps, storiesOf, themeFor } from "./lib";
import { Folio, RunningHead, Zigzag } from "./parts";

// An inside page for a core section. Every page carries its main story, its second story and
// its briefs, each printed whole, and is composed in one of seven ways (see sectionComps in
// lib.ts): the same grid, type and inks as every other page, set differently each day.

export function Section({ edition, page, reading }: PageProps) {
  const comp = sectionComps(edition).get(page.order) ?? "rail";
  const theme = themeFor(page);
  const section = page.section;
  const stories = storiesOf(page.stories);

  return (
    <div className="yn-sheet-wrap">
      <article
        className={`yn-sheet yn-inside yn-theme-${theme} bs-inside bs-comp--${comp}`}
        data-comp={comp}
      >
        <RunningHead
          edition={edition}
          reading={reading}
          title={section?.name ?? "Inside"}
          tagline={section?.tagline ?? ""}
        />
        <Zigzag />
        <div className="bs-page">
          {section && dressed(section.slug, edition.issueNumber, page.order) ? (
            <SectionDress
              slug={section.slug}
              stories={page.stories}
              issue={edition.issueNumber}
              page={page.order}
              date={edition.date}
            />
          ) : null}
          {isSpecial(comp) ? (
            <SpecialPage
              comp={comp}
              page={page}
              reading={reading}
              seed={`${edition.issueNumber}:${page.order}`}
            />
          ) : (
            <Composition comp={comp} theme={theme} reading={reading} {...stories} />
          )}
        </div>
        <Folio edition={edition} reading={reading} section={section?.name ?? "Inside"} />
      </article>
    </div>
  );
}

function SpecialPage({
  comp,
  page,
  reading,
  seed,
}: {
  comp: Parameters<typeof Special>[0]["kind"];
  page: PageProps["page"];
  reading: Reading;
  seed: string;
}) {
  const parts = specialParts(page.stories, reading.storyHref, "news", seed);
  return parts ? <Special kind={comp} parts={parts} /> : null;
}

type Parts = {
  comp: SectionComp;
  theme: Theme;
  reading: Reading;
  main: StoryItem | null;
  second: StoryItem | null;
  extra: StoryItem[];
  briefs: StoryItem[];
};

/** The main story's picture in its section's frame, or its standfirst on ink when it has none. */
function MainMedia({
  story,
  theme,
  className,
  frame,
}: {
  story: StoryItem;
  theme: Theme;
  className?: string;
  frame?: ReturnType<typeof frameFor>;
}) {
  return story.images[0] ? (
    <Media
      story={story}
      frame={frame ?? frameFor(theme)}
      className={className}
      sizes="(max-width: 760px) 100vw, 760px"
      priority
    />
  ) : (
    <InkPull story={story} className={className} />
  );
}

/** Second and any further long stories, set whole one after another. */
function Seconds({
  stories,
  reading,
  cols,
  className,
  mediaFirst,
  pictures,
}: {
  stories: StoryItem[];
  reading: Reading;
  cols: 1 | 2 | 3;
  className?: string;
  mediaFirst?: boolean;
  pictures?: boolean;
}) {
  return (
    <>
      {stories.map((s) => (
        <StoryBlock
          key={s.slug}
          story={s}
          reading={reading}
          cols={cols}
          size="lg"
          className={className}
          mediaFirst={mediaFirst}
          pictures={pictures}
        />
      ))}
    </>
  );
}

/** How much a story fills, roughly: its words, and its picture if it has one. */
const weight = (stories: StoryItem[]) =>
  stories.reduce(
    (n, s) =>
      n + s.headline.length + s.dek.length + s.body.join(" ").length + (s.images[0] ? 700 : 0),
    0,
  );

/**
 * The foot of a page: the second story beside the briefs — unless the briefs would run far
 * deeper than the story in their narrower column, when the story goes across and the briefs
 * across beneath it, so neither leaves a column of bare paper.
 */
function Foot({
  more,
  briefs,
  reading,
  variant,
}: {
  more: StoryItem[];
  briefs: StoryItem[];
  reading: Reading;
  variant: "rail" | "numbered";
}) {
  // The briefs' column is about 1/1.7 the width of the story's.
  const across = !more.length || weight(briefs) * 1.7 > weight(more) * 1.8;
  if (across) {
    return (
      <>
        {more.length ? (
          <Seconds stories={more} reading={reading} cols={3} className="bs-second-across" />
        ) : null}
        {more.length && briefs.length ? <Zigzag /> : null}
        <Briefs stories={briefs} reading={reading} variant="strip" />
      </>
    );
  }
  return (
    <div className="bs-grid bs-g-foot">
      <div className="bs-stack">
        <Seconds stories={more} reading={reading} cols={2} className="bs-second-split" />
      </div>
      <Briefs stories={briefs} reading={reading} variant={variant} />
    </div>
  );
}

function Composition({ comp, theme, reading, main, second, extra, briefs }: Parts) {
  if (!main || isSpecial(comp)) return null;
  const photo = Boolean(main.images[0]);
  const more = [second, ...extra].filter((s): s is StoryItem => Boolean(s));

  switch (comp) {
    // Photo-led top with the briefs down a rail beside it; the second story across the foot.
    case "rail":
      return (
        <>
          <div className="bs-grid bs-g-rail">
            <div className="bs-stack">
              <MainMedia story={main} theme={theme} className="bs-m-wide" />
              <StoryHead story={main} reading={reading} size="xl" dek={photo} />
              <Copy story={main} cols={2} dropcap />
            </div>
            <Briefs stories={briefs} reading={reading} variant="rail" />
          </div>
          {more.length ? (
            <>
              <Zigzag />
              <Seconds stories={more} reading={reading} cols={3} className="bs-second-across" />
            </>
          ) : null}
        </>
      );

    // The headline across the page, the lead in two columns, the second story boxed in ink.
    case "boxed":
      return (
        <>
          <StoryHead
            story={main}
            reading={reading}
            size="xxl"
            dek={photo}
            className="bs-head--across"
          />
          <div className="bs-grid bs-g-boxed">
            <div className="bs-stack">
              <MainMedia story={main} theme={theme} className="bs-m-wide" />
              <Copy story={main} cols={2} dropcap />
            </div>
            <div className="bs-stack">
              <Seconds stories={more} reading={reading} cols={1} className="bs-box" mediaFirst />
            </div>
          </div>
          {briefs.length ? (
            <>
              <Zigzag />
              <Briefs stories={briefs} reading={reading} variant="strip" />
            </>
          ) : null}
        </>
      );

    // A big head across the top, the picture inset on the right, the briefs numbered along the
    // foot beside the second story.
    case "inset":
      return (
        <>
          <StoryHead
            story={main}
            reading={reading}
            size="xxl"
            dek={photo}
            className="bs-head--across bs-head--rule"
          />
          <div className="bs-grid bs-g-inset">
            <Copy story={main} cols={2} dropcap />
            <MainMedia story={main} theme={theme} frame="flat" className="bs-m-tall" />
          </div>
          <Zigzag />
          <Foot more={more} briefs={briefs} reading={reading} variant="numbered" />
        </>
      );

    // The picture down one side with the briefs under it; the stories stacked beside.
    case "side":
      return (
        <div className="bs-grid bs-g-side">
          <div className="bs-stack">
            <MainMedia story={main} theme={theme} className="bs-m-portrait" />
            <Briefs stories={briefs} reading={reading} variant="numbered" />
          </div>
          <div className="bs-stack">
            <StoryHead story={main} reading={reading} size="xl" dek={photo} />
            <Copy story={main} cols={2} dropcap />
            {more.length ? (
              <>
                <Zigzag />
                <Seconds stories={more} reading={reading} cols={2} />
              </>
            ) : null}
          </div>
        </div>
      );

    // A picture story: the photo across the page with the headline pasted on a card over it.
    case "picture":
      return (
        <>
          <figure className="yn-hero bs-picture">
            {main.images[0] ? (
              <MainMedia story={main} theme={theme} frame="flat" className="bs-picture-media" />
            ) : null}
            <div className="yn-hero-card bs-picture-card">
              <span className="print-tape fr-card-tape-l" aria-hidden />
              <span className="print-tape fr-card-tape-r" aria-hidden />
              <StoryHead story={main} reading={reading} size="xl" dek={false} />
            </div>
          </figure>
          <p className="yn-dek bs-dek-big bs-dek-across">{main.dek}</p>
          <Copy story={main} cols={3} dropcap />
          <Zigzag />
          <Foot more={more} briefs={briefs} reading={reading} variant="rail" />
        </>
      );

    // The briefs first, as a strip of ink under the running head; then the two stories side
    // by side, parted by a rule.
    case "ticker":
      return (
        <>
          <Briefs stories={briefs} reading={reading} variant="ink" />
          <div className="bs-grid bs-g-ticker">
            <div className="bs-stack">
              <MainMedia story={main} theme={theme} className="bs-m-wide" />
              <StoryHead story={main} reading={reading} size="xl" dek={photo} />
              <Copy story={main} cols={2} dropcap />
            </div>
            <div className="bs-stack bs-ruled-left">
              <Seconds stories={more} reading={reading} cols={1} mediaFirst />
            </div>
          </div>
        </>
      );

    // A picture page: every photograph on the page gathered in a grid across the top, each keyed
    // to its story, and the stories set as type beneath.
    case "album": {
      // One picture per story: the page's stories in pictures, not one story's roll.
      const pics = [main, ...more, ...briefs].flatMap((s) =>
        s.images[0] ? [{ image: s.images[0], kicker: s.kicker }] : [],
      );
      return (
        <>
          <section className="bs-album" aria-label="The page in pictures">
            <p className="yn-label bs-album-title">The page in pictures</p>
            <Band
              arrangement="grid"
              images={pics.slice(0, 7).map((p) => p.image)}
              labels={pics.slice(0, 7).map((p) => p.kicker)}
            />
          </section>
          <Zigzag />
          <div className="bs-grid bs-g-rail">
            <div className="bs-stack">
              <StoryHead story={main} reading={reading} size="xl" dek />
              <Copy story={main} cols={2} dropcap />
            </div>
            <Briefs stories={briefs} reading={reading} variant="rail" thumbs={false} />
          </div>
          {more.length ? (
            <>
              <Zigzag />
              <Seconds
                stories={more}
                reading={reading}
                cols={3}
                className="bs-second-across"
                pictures={false}
              />
            </>
          ) : null}
        </>
      );
    }

    // The lead's frames off the contact sheet across the page, the editor's pick ringed; the
    // headline under them and the text in three columns.
    case "contact":
      return (
        <>
          <Band arrangement="contact" images={main.images.slice(0, 5)} className="bs-contact" />
          <p className="yn-caption bs-cap bs-contact-cap">
            {main.images.slice(0, 5).map((img, i) => (
              <span key={img.url}>
                <b>{i + 1}.</b> {img.alt}{" "}
              </span>
            ))}
          </p>
          <StoryHead
            story={main}
            reading={reading}
            size="xxl"
            dek
            className="bs-head--across bs-head--rule"
          />
          <Copy story={main} cols={3} dropcap />
          <Zigzag />
          <Foot more={more} briefs={briefs} reading={reading} variant="numbered" />
        </>
      );

    // The lead's head set big on a block of ink with its picture pasted over the edge; the text
    // in three columns beneath.
    case "poster":
      return (
        <>
          <div className={`bs-postblock ${photo ? "bs-postblock--photo" : ""}`}>
            <div className="bs-postblock-ink print-worn" aria-hidden />
            <StoryHead story={main} reading={reading} size="xxl" className="bs-postblock-head" />
            {photo ? <Media story={main} frame="print" className="bs-postblock-media" /> : null}
          </div>
          <Copy story={main} cols={3} dropcap />
          <Zigzag />
          <Foot more={more} briefs={briefs} reading={reading} variant="numbered" />
        </>
      );
  }
}
