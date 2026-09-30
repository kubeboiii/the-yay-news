import {
  addDays,
  editionDateAt,
  type HabitEvent,
  savedStories,
  stampsOf,
  streakOf,
  finishedDates,
} from "@/features/habits/core";

// The numbers behind the weekly dump and the month in Yay, from the reader's own log. Pure, so the
// wall can show them and the canvas can draw them from the same answer.

export type Recap = {
  /** "28 Sept – 4 Oct", "October 2026". */
  label: string;
  from: string;
  to: string;
  papers: number;
  late: number;
  clippings: { headline: string; kicker?: string; issue: number }[];
  stamps: { issue: number; date: string; late: boolean }[];
  puzzles: number;
  stickers: number;
  best: number;
};

const DAY = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
const MONTH = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
const utc = (d: string) => new Date(`${d}T00:00:00Z`);

/** Monday of the week holding `date`. */
export function mondayOf(date: string): string {
  const day = (utc(date).getUTCDay() + 6) % 7;
  return addDays(date, -day);
}

function recapBetween(events: readonly HabitEvent[], from: string, to: string, label: string): Recap {
  const inside = (d: string) => d >= from && d <= to;
  const localDay = (at: string) => editionDateAt(new Date(at));
  const stamps = stampsOf(events)
    .filter((s) => inside(s.date))
    .map((s) => ({ issue: s.issue, date: s.date, late: localDay(s.at) > s.date }));
  const clippings = savedStories(events)
    .filter((s) => inside(localDay(s.at)))
    .map((s) => ({ headline: s.headline, kicker: s.kicker, issue: s.issue }));
  let puzzles = 0;
  let stickers = 0;
  for (const e of events) {
    if (!inside(localDay(e.at))) continue;
    if (e.type === "puzzle_solved") puzzles++;
    if (e.type === "sticker_earned") stickers++;
  }
  const best = streakOf(finishedDates(events), to).best;
  return {
    label,
    from,
    to,
    papers: stamps.length,
    late: stamps.filter((s) => s.late).length,
    clippings,
    stamps,
    puzzles,
    stickers,
    best,
  };
}

/** This week so far (Monday to today). */
export function weekRecap(events: readonly HabitEvent[], today: string): Recap {
  const from = mondayOf(today);
  const to = addDays(from, 6);
  return recapBetween(events, from, to, `${DAY.format(utc(from))} – ${DAY.format(utc(to))}`);
}

/** The calendar month holding `today`. */
export function monthRecap(events: readonly HabitEvent[], today: string): Recap {
  const from = `${today.slice(0, 7)}-01`;
  const next = utc(from);
  next.setUTCMonth(next.getUTCMonth() + 1);
  const to = addDays(next.toISOString().slice(0, 10), -1);
  return recapBetween(events, from, to, MONTH.format(utc(from)));
}
