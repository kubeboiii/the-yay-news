import type { Edition, Feature, Puzzle, SolvedPuzzle } from "@repo/shared";
import type { EditionPage, Reading, StoryItem } from "../types";

// Everything the broadsheet reads out of an edition: dates set the way the paper prints them,
// the features and puzzles by type, and the section inks each page is printed in.

const day = (date: string) => new Date(`${date}T00:00:00Z`);
const fmt = (date: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", ...options }).format(day(date));

/** "Tuesday" */
export const weekday = (date: string) => fmt(date, { weekday: "long" });
/** "30 September 2026" */
export const longDate = (date: string) =>
  fmt(date, { day: "numeric", month: "long", year: "numeric" });
/** "Wed 30 Sep 2026" */
export const shortDate = (date: string) =>
  `${fmt(date, { weekday: "short" }).slice(0, 3)} ${fmt(date, { day: "numeric" })} ${fmt(date, { month: "long" }).slice(0, 3)} ${fmt(date, { year: "numeric" })}`;
/** "30.09.26" */
export const dotDate = (date: string) =>
  fmt(date, { day: "2-digit", month: "2-digit", year: "2-digit" }).replaceAll("/", ".");

export type FeatureOf<T extends Feature["type"]> = Extract<Feature, { type: T }>["content"];

export function featuresOf<T extends Feature["type"]>(edition: Edition, type: T): FeatureOf<T>[] {
  return edition.features
    .filter((f): f is Extract<Feature, { type: T }> => f.type === type)
    .sort((a, b) => a.order - b.order)
    .map((f) => f.content as FeatureOf<T>);
}

export const featureOf = <T extends Feature["type"]>(edition: Edition, type: T) =>
  featuresOf(edition, type)[0] ?? null;

export const puzzleOf = <T extends Puzzle["type"]>(edition: Edition, type: T) =>
  (edition.puzzles.find((p) => p.type === type) as Extract<Puzzle, { type: T }> | undefined) ??
  null;

export const solvedOf = <T extends SolvedPuzzle["type"]>(edition: Edition, type: T) =>
  (edition.yesterday?.puzzles.find((p) => p.type === type) as
    Extract<SolvedPuzzle, { type: T }> | undefined) ?? null;

export const allStories = (edition: Edition): StoryItem[] =>
  [...edition.pages].sort((a, b) => a.order - b.order).flatMap((p) => p.stories);

export const readMinutes = (edition: Edition) =>
  allStories(edition).reduce((sum, s) => sum + s.readMinutes, 0);

/** The printed page number of a page link: its place in the edition, front page = 1. */
export const pageNumber = (reading: Reading, slug: string) =>
  reading.pages.findIndex((p) => p.slug === slug) + 1;

/** Splits a headline so its last word can carry a hand-drawn ring. */
export function lastWord(text: string): [string, string] {
  const i = text.trimEnd().lastIndexOf(" ");
  return i < 0 ? ["", text] : [text.slice(0, i + 1), text.slice(i + 1)];
}

/** Size (in sheet mm) for a line of League Gothic to span `width` mm, capped at `max`. */
export const fitSize = (text: string, width: number, max: number, perChar = 0.3) =>
  Math.min(max, width / Math.max(1, text.length * perChar));

/** Headline size (sheet mm) for a poster of solid ink: as big as the words allow. */
export function posterSize(headline: string, area = 300_000, width = 1050, max = 58) {
  const longest = Math.max(...headline.split(/\s+/).map((w) => w.length), 1);
  return Math.min(max, Math.sqrt(area / Math.max(headline.length, 1)), width / longest);
}

/** Two columns only pay off when there is enough text to fill them. */
export const isLong = (paragraphs: string[]) => paragraphs.join(" ").length > 650;

// ——— Section inks ———
// Each page prints in a pair of the six fluoro tokens: --pop (the loud one) and --pop2. The front,
// Screen & Sound, Gaming and the back page keep the mockup's pairs; the other sections get their
// own pair from the same set, so every colourway still gives each page one family of inks.

export type Theme =
  "screen" | "gaming" | "sports" | "tech" | "discoveries" | "money" | "internet" | "guest" | "back";

const THEMES: Record<string, Theme> = {
  "screen-and-sound": "screen",
  gaming: "gaming",
  sports: "sports",
  tech: "tech",
  discoveries: "discoveries",
  money: "money",
  "internet-and-culture": "internet",
};

export const themeFor = (page: Pick<EditionPage, "layout" | "section">): Theme =>
  page.layout === "guest"
    ? "guest"
    : page.layout === "back"
      ? "back"
      : (THEMES[page.section?.slug ?? ""] ?? "screen");

// ——— Compositions ———
// A real paper keeps its grid, type and inks and composes each page afresh around the day's
// stories. Every page type has several compositions; which one a page gets is worked out from the
// issue number, the page's place and section, and the shape of its stories, so consecutive days
// differ, no two inside pages of one edition match, and an edition always prints the same way.

const SLOT_RANK = { lead: 0, feature: 1, brief: 2 } as const;

/** A page's stories as the paper sets them: the main story, the second, and the briefs. */
export function storiesOf(stories: StoryItem[]) {
  const sorted = [...stories].sort(
    (a, b) => SLOT_RANK[a.slot] - SLOT_RANK[b.slot] || a.order - b.order,
  );
  const long = sorted.filter((s) => s.slot !== "brief");
  const briefs = sorted.filter((s) => s.slot === "brief");
  return { main: long[0] ?? null, second: long[1] ?? null, extra: long.slice(2), briefs };
}

const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

export const FRONT_COMPS = ["classic", "headline", "rail", "split", "poster"] as const;
export type FrontComp = (typeof FRONT_COMPS)[number];

/** The front page's composition: a different one each day, among those the lead suits. */
export function frontComp(edition: Edition, page: EditionPage): FrontComp {
  const { main } = storiesOf(page.stories);
  const photo = Boolean(main?.images[0]);
  const needsPhoto: FrontComp[] = ["classic", "split"];
  for (let k = 0; k < FRONT_COMPS.length; k++) {
    const c = FRONT_COMPS[(edition.issueNumber + k) % FRONT_COMPS.length]!;
    if (photo || !needsPhoto.includes(c)) return c;
  }
  return "poster";
}

export const SECTION_COMPS = [
  "rail",
  "boxed",
  "inset",
  "side",
  "picture",
  "ticker",
  "poster",
] as const;
export type SectionComp = (typeof SECTION_COMPS)[number];

function fitsSection(c: SectionComp, page: EditionPage) {
  const { main, second, briefs } = storiesOf(page.stories);
  const photo = Boolean(main?.images[0]);
  if (c === "picture" || c === "side") return photo;
  if (c === "ticker") return briefs.length >= 2;
  if (c === "boxed") return Boolean(second);
  return true;
}

/** Compositions for every core inside page of an edition, keyed by page order. */
export function sectionComps(edition: Edition): Map<number, SectionComp> {
  const inside = [...edition.pages]
    .filter((p) => p.layout === "section")
    .sort((a, b) => a.order - b.order);
  const used = new Set<SectionComp>();
  const out = new Map<number, SectionComp>();
  const n = SECTION_COMPS.length;
  inside.forEach((p, i) => {
    const start = (edition.issueNumber * 3 + i * 2 + hash(p.section?.slug ?? "")) % n;
    const order = SECTION_COMPS.map((_, k) => SECTION_COMPS[(start + k) % n]!);
    const pick =
      order.find((c) => !used.has(c) && fitsSection(c, p)) ??
      order.find((c) => !used.has(c)) ??
      order[0]!;
    used.add(pick);
    out.set(p.order, pick);
  });
  return out;
}

/** The back page and the guest page each have two compositions, alternating day by day. */
export const backComp = (edition: Edition): "strip-first" | "puzzles-first" =>
  edition.issueNumber % 2 === 0 ? "strip-first" : "puzzles-first";

export const guestComp = (edition: Edition, page: EditionPage): "cover" | "columns" => {
  const { main } = storiesOf(page.stories);
  // Guest sections come every other day, so alternate on every other issue.
  return main?.images[0] && Math.floor(edition.issueNumber / 2) % 2 === 1 ? "cover" : "columns";
};
