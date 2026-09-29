import type { StoryItem } from "@repo/shared";
import type { PageProps } from "../types";
import { type Area, gridStyle, insideComposition, places } from "./compose";
import { folioDate, ordered, pad2 } from "./edition-data";
import { Folio, Masthead, MiniMark, PixelType, Sheet, themeFor, type Theme } from "./parts";
import {
  AreaBox,
  Briefs,
  MainPhoto,
  SecondStory,
  StoryHead,
  StoryText,
  measureOf,
} from "./story-bits";

// A core section's inside page: the main story with its photograph, the second story and the
// briefs, set in the composition this page drew for the day (see compose.ts). Every story on the
// page is printed whole; nothing here trails another page.

/** The page's stories by role: the main story, the second, and the briefs. */
export function roles(stories: StoryItem[]) {
  const all = ordered(stories);
  const features = all.filter((s) => s.slot !== "brief");
  const briefs = all.filter((s) => s.slot === "brief");
  // A page with no brief slot still gets a column: anything after the first two runs as a brief.
  const [main, second, ...extra] = features;
  return { main, second, briefs: [...extra, ...briefs] };
}

export function StoriesGrid({
  page,
  reading,
  composition,
  slug,
}: Pick<PageProps, "page" | "reading"> & {
  composition: ReturnType<typeof insideComposition>;
  slug: string;
}) {
  const { main, second, briefs } = roles(page.stories);
  const at = places(composition);
  const present: Area[] = [
    ...(main ? (["head", "body"] as Area[]) : []),
    ...(main?.images.length ? (["photo"] as Area[]) : []),
    ...(second ? (["second"] as Area[]) : []),
    ...(briefs.length ? (["briefs"] as Area[]) : []),
  ];
  const href = (s: StoryItem) => reading.storyHref(s.slug);
  const onPhoto = composition.onPhoto && Boolean(main?.images.length);
  return (
    <div
      className={`tb-comp ${composition.boxed ? "tb-comp--boxed" : ""}`}
      data-composition={composition.name}
      style={gridStyle(composition, present)}
    >
      {main ? (
        <article className="tb-main" aria-label={main.headline}>
          {onPhoto ? null : (
            <AreaBox area="head" place={at.head}>
              <StoryHead story={main} href={href(main)} span={at.head?.span ?? 3} />
            </AreaBox>
          )}
          <AreaBox area="photo" place={at.photo}>
            <MainPhoto
              story={main}
              href={href(main)}
              measure={measureOf(at.photo?.span ?? 3) - 24}
              onPhoto={onPhoto}
              priority
              sizes="(max-width: 760px) 100vw, 740px"
            />
          </AreaBox>
          <AreaBox area="body" place={at.body}>
            {onPhoto ? <p className="tb-dek">{main.dek}</p> : null}
            <StoryText story={main} dropcap />
          </AreaBox>
        </article>
      ) : null}
      {second ? (
        <AreaBox
          area="second"
          place={at.second}
          as="article"
          label={second.headline}
          className={composition.boxed ? "tb-boxed" : ""}
        >
          <SecondStory story={second} href={href(second)} span={at.second?.span ?? 1} slug={slug} />
        </AreaBox>
      ) : null}
      {briefs.length ? (
        <AreaBox area="briefs" place={at.briefs} as="aside" label="In brief">
          <Briefs stories={briefs} storyHref={reading.storyHref} span={at.briefs?.span ?? 1} />
        </AreaBox>
      ) : null}
    </div>
  );
}

export function Section({ edition, page, reading }: PageProps) {
  const section = page.section;
  const slug = section?.slug ?? "";
  const name = section?.name ?? reading.current.label;
  const theme: Theme = slug === "gaming" ? "gaming" : themeFor(page.order);
  const date = folioDate(edition.date);
  const composition = insideComposition(edition, page);

  return (
    <Sheet theme={theme} label={`${name}, page ${page.order}`}>
      <Masthead
        eyebrow={
          <MiniMark href={reading.pages[0]?.href ?? "/"}>
            Page {page.order} · {name} · {date}
          </MiniMark>
        }
        title={name}
        size={{ measure: 158, max: slug === "gaming" ? 24 : 17.5 }}
        aside={section ? <p className="tb-mast-tagline">{section.tagline}.</p> : undefined}
        box={
          slug === "gaming" ? (
            <>
              <PixelType text={pad2(page.order)} />
              <span className="tb-box-words">
                Page
                <small>{name}</small>
              </span>
            </>
          ) : (
            <>
              <span className="tb-box-num">{pad2(page.order)}</span>
              <span className="tb-box-words">
                Page
                <small>{name}</small>
              </span>
            </>
          )
        }
      />

      <StoriesGrid page={page} reading={reading} composition={composition} slug={slug} />

      <Folio page={page.order} section={name} date={date} next={reading.next} />
    </Sheet>
  );
}
