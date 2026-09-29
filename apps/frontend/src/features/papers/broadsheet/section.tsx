import type { PageProps, Reading, StoryItem } from "../types";
import { Briefs, Copy, InkPull, Media, StoryBlock, StoryHead, frameFor } from "./blocks";
import { type SectionComp, type Theme, sectionComps, storiesOf, themeFor } from "./lib";
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
          <Composition comp={comp} theme={theme} reading={reading} {...stories} />
        </div>
        <Folio edition={edition} reading={reading} section={section?.name ?? "Inside"} />
      </article>
    </div>
  );
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
}: {
  stories: StoryItem[];
  reading: Reading;
  cols: 1 | 2 | 3;
  className?: string;
  mediaFirst?: boolean;
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
        />
      ))}
    </>
  );
}

function Composition({ comp, theme, reading, main, second, extra, briefs }: Parts) {
  if (!main) return null;
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
          <div className="bs-grid bs-g-foot">
            <div className="bs-stack">
              <Seconds stories={more} reading={reading} cols={2} className="bs-second-split" />
            </div>
            <Briefs stories={briefs} reading={reading} variant="numbered" />
          </div>
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
          <div className="bs-grid bs-g-picture">
            <p className="yn-dek bs-dek-big">{main.dek}</p>
            <Copy story={main} cols={2} dropcap />
          </div>
          <Zigzag />
          <div className="bs-grid bs-g-foot">
            <div className="bs-stack">
              <Seconds stories={more} reading={reading} cols={2} className="bs-second-split" />
            </div>
            <Briefs stories={briefs} reading={reading} variant="rail" />
          </div>
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
          <div className="bs-grid bs-g-foot">
            <div className="bs-stack">
              <Seconds stories={more} reading={reading} cols={2} className="bs-second-split" />
            </div>
            <Briefs stories={briefs} reading={reading} variant="numbered" />
          </div>
        </>
      );
  }
}
