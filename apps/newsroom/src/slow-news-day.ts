// The fallback when the pipeline cannot produce an edition (PLAN §9): the Slow News Day edition,
// built from the evergreen bank in ./evergreen. The bank's builder returns a seed-shaped draft; this
// turns it into the newsroom's EditionDraft (slots, orders, puzzles) so it is checked and filed the
// same way as any other edition.
import { buildSlowNewsDay } from "./evergreen/index.ts";
import type {
  EditionDraft as EvergreenDraft,
  DraftStory as EvergreenStory,
} from "./evergreen/types.ts";
import { puzzlesOf } from "./stages/features.ts";
import { SECTIONS } from "./store.ts";
import { slugify, wordCount } from "./text.ts";
import type { DraftPage, DraftStory, EditionDraft, SectionSlug } from "./types.ts";

/**
 * Evergreen items are our own words, so their "source" is the paper itself: the site's about page
 * (NEWSROOM_SITE_URL, the reader's public origin; the column needs an absolute URL).
 */
export const EVERGREEN_SOURCE_URL = `${(process.env.NEWSROOM_SITE_URL ?? "http://localhost:3108").replace(/\/+$/, "")}/about`;

const kindOf = new Map(SECTIONS.map((s) => [s.slug, s.kind]));

function story(
  s: EvergreenStory,
  pageSection: string | null,
  slot: DraftStory["slot"],
): DraftStory {
  const section = (s.section ?? pageSection) as SectionSlug;
  return {
    slug: slugify(s.slug),
    slot: s.slot ?? slot,
    section,
    kicker: s.kicker,
    headline: s.headline,
    dek: s.dek,
    body: s.body,
    readMinutes: s.readMinutes ?? Math.max(1, Math.round(wordCount(s.body.join(" ")) / 200)),
    sticker: s.sticker ?? null,
    sourceUrl: s.sourceUrl ?? EVERGREEN_SOURCE_URL,
    sourceName: s.source,
    embedUrl: null,
    images: [],
    isReserve: s.reserve ?? false,
  };
}

export function fromEvergreen(e: EvergreenDraft, issueNumber: number): EditionDraft {
  const pages: DraftPage[] = [
    {
      order: 1,
      layout: "front",
      section: null,
      stories: e.front.map((s, i) => story(s, null, i === 0 ? "lead" : "feature")),
    },
    ...e.inside.map((p, i) => ({
      order: i + 2,
      layout: kindOf.get(p.section) === "guest" ? ("guest" as const) : ("section" as const),
      section: p.section as SectionSlug,
      stories: p.stories.map((s, j) => story(s, p.section, j < 2 ? "feature" : "brief")),
    })),
  ];
  pages.push({ order: pages.length + 1, layout: "back", section: null, stories: [] });
  const seen = new Map<string, number>();
  const features = e.features.map((f) => {
    const order = seen.get(f.type) ?? 0;
    seen.set(f.type, order + 1);
    return { ...f, order } as EditionDraft["features"][number];
  });
  const headlines = pages.flatMap((p) =>
    p.stories.filter((s) => !s.isReserve).map((s) => s.headline),
  );
  return {
    date: e.date,
    issueNumber: e.issueNumber ?? issueNumber,
    volume: 1,
    status: e.status === "pulled" ? "scheduled" : e.status,
    kind: "slow_news_day",
    design: e.design,
    colourway: e.colourway,
    guestSection: (pages.find((p) => p.layout === "guest")?.section ?? null) as SectionSlug | null,
    pages,
    features,
    puzzles: puzzlesOf(e.date, headlines),
  };
}

export type SlowNewsDayBuilder = (date: string) => Promise<EvergreenDraft>;

export async function slowNewsDay(
  date: string,
  issueNumber: number,
  build: SlowNewsDayBuilder = buildSlowNewsDay,
): Promise<EditionDraft> {
  return fromEvergreen(await build(date), issueNumber);
}
