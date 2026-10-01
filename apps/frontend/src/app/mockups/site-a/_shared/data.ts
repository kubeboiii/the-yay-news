import "server-only";
import type { Edition, EditionSummary, SearchResult } from "@repo/shared";
import { printedPhoto } from "@repo/ui/print/photo";
import { getArchive, getEdition, searchPile } from "@/features/editions/api";
import {
  addDays,
  finishedDates,
  type HabitEvent,
  type StampInfo,
  stampsOf,
  streakOf,
  type Streak,
} from "@/features/habits/core";
import { demoEvents } from "@/features/habits/demo";
import { heroProps } from "@/features/site/hero-props";
import { type PagerPage, pagerPages } from "@/features/site/pager-pages";
import { monthRecap, type Recap, weekRecap } from "@/features/wall/recap";
import { type Palette, paletteFor } from "./palette";

// Everything the site mockups (site-a, site-b, site-c) print, from the real API and the real
// habit rules. The reader's history is the habits demo month (features/habits/demo.ts) run
// through the same pure functions the live site uses, so stamps, streaks and recaps are honest.

export const MOCK_NOW = "2026-10-04T12:00:00Z";
/** Before the press: 05:46 the next morning, while No. 46 is still "yesterday's paper". */
export const SHUTTER_CLOCK = { date: "2026-10-05", minutes: 5 * 60 + 46 };

export type Clipping = {
  issue: number;
  slug: string;
  kicker: string;
  headline: string;
  photo: string | null;
  alt: string;
};

export type PileItem = EditionSummary & {
  lead: NonNullable<EditionSummary["lead"]>;
  photo: string | null;
};

export type SiteData = {
  today: string;
  palette: Palette;
  edition: Edition;
  pages: PagerPage[];
  pile: PileItem[];
  events: HabitEvent[];
  /** The reader's events once today's paper is finished too. */
  eventsDone: HabitEvent[];
  stamps: StampInfo[];
  streak: Streak;
  streakDone: Streak;
  week: Recap;
  month: Recap;
  search: SearchResult;
  clippings: Clipping[];
  pressIn: number;
  tags: string[];
  puzzles: number;
};

type Params = Promise<Record<string, string | string[] | undefined>>;

const one = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined);

export async function loadSite(searchParams: Params): Promise<SiteData> {
  const sp = await searchParams;
  const now = one(sp.now) ?? MOCK_NOW;
  const preview = { now };
  const today = now.slice(0, 10);
  const [list, search] = await Promise.all([
    getArchive(undefined, preview, 30),
    searchPile(one(sp.q) ?? "dinosaur", preview),
  ]);
  const lead = list.items[0]!;
  const edition = await getEdition(lead.issueNumber, preview);

  const events = demoEvents(today);
  const finish: HabitEvent = {
    id: "mock-finish",
    type: "edition_finished",
    issue: edition.issueNumber,
    date: edition.date,
    design: edition.design,
    colourway: edition.colourway,
    puzzles: 3,
    at: `${today}T09:12:00.000Z`,
  } as HabitEvent;
  const eventsDone = [...events, finish];

  const clippings: Clipping[] = edition.pages
    .flatMap((p) => p.stories)
    .filter((s) => s.images[0])
    .slice(0, 7)
    .map((s) => ({
      issue: edition.issueNumber,
      slug: s.slug,
      kicker: s.kicker,
      headline: s.headline,
      photo: s.images[0] ? printedPhoto(s.images[0].url, 700) : null,
      alt: s.images[0]?.alt ?? "",
    }));

  const hero = heroProps(edition, SHUTTER_CLOCK);

  return {
    today,
    palette: paletteFor(one(sp.cw) ?? edition.colourway),
    edition,
    pages: pagerPages(edition),
    pile: list.items.flatMap((i) =>
      i.lead
        ? [{ ...i, lead: i.lead, photo: i.lead.image ? printedPhoto(i.lead.image.url, 600) : null }]
        : [],
    ),
    events,
    eventsDone,
    stamps: stampsOf(eventsDone),
    streak: streakOf(finishedDates(events), today),
    streakDone: streakOf(finishedDates(eventsDone), today),
    week: weekRecap(eventsDone, today),
    month: monthRecap(eventsDone, today),
    search,
    clippings,
    pressIn: hero.pressIn ?? 74,
    tags: hero.tags,
    puzzles: edition.puzzles.length,
  };
}

const LONG = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});
const SHORT = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

export const longDate = (d: string) => LONG.format(new Date(`${d}T00:00:00Z`));
export const shortDate = (d: string) => SHORT.format(new Date(`${d}T00:00:00Z`));
export const dayBefore = (d: string) => addDays(d, -1);

/** "1h 14m" */
export const pressLabel = (min: number) =>
  min >= 60 ? `${Math.floor(min / 60)}h ${String(min % 60).padStart(2, "0")}m` : `${min}m`;
