import { BROADSHEET_COLOURWAYS, PASTEL_COLOURWAYS, isWeekend } from "@repo/shared";
import { addDays, type HabitEvent, MOODS, type NewHabitEvent } from "./core";
import { hash, rng } from "./sketch";

// A month of made-up reading for the review page (/mockups/habits). It is written to the demo
// log only (api.ts DEMO_LOG), never to the reader's real one.

const WEEKEND = ["tabloid", "zine", "midi"] as const;

/** About a month of finished papers ending yesterday, with one rest day and one broken streak. */
export function demoEvents(today: string): HabitEvent[] {
  const r = rng(hash(`demo:${today}`));
  const events: HabitEvent[] = [];
  let n = 0;
  const push = (e: NewHabitEvent & { at: string }) =>
    events.push({ ...e, id: `demo-${++n}` } as HabitEvent);
  const firstIssue = 12;
  // Missed days: a break early on (two in a row), and one rest day in the current streak.
  const missed = new Set([addDays(today, -21), addDays(today, -20), addDays(today, -6)]);
  for (let back = 34; back >= 1; back--) {
    const date = addDays(today, -back);
    const issue = firstIssue + (34 - back);
    if (missed.has(date)) continue;
    const weekend = isWeekend(date);
    const design = weekend ? WEEKEND[issue % 3]! : "broadsheet";
    const colourway = weekend
      ? PASTEL_COLOURWAYS[issue % PASTEL_COLOURWAYS.length]!
      : BROADSHEET_COLOURWAYS[(issue * 5) % BROADSHEET_COLOURWAYS.length]!;
    const at = `${date}T08:${String(10 + (issue % 40)).padStart(2, "0")}:00.000Z`;
    for (const page of [1, 2, 3, 4, 5, 8]) push({ type: "page_read", issue, page, at });
    const solvedAll = r() < 0.3;
    if (solvedAll) {
      push({ type: "puzzle_solved", issue, puzzle: "crossword", at });
      push({ type: "puzzle_solved", issue, puzzle: "word_ladder", at });
      push({ type: "puzzle_solved", issue, puzzle: "riddle", at });
    }
    push({ type: "edition_finished", issue, date, design, colourway, puzzles: 3, at });
    if (r() < 0.8) {
      push({ type: "mood", issue, mood: MOODS[Math.floor(r() * MOODS.length)]!.id, date, at });
    }
  }
  const lastIssue = firstIssue + 33;
  const stickers = ["star", "yay", "hi", "heart", "bee", "rainbow", "smile", "issue"];
  stickers.forEach((sticker, i) =>
    push({
      type: "sticker_earned",
      issue: lastIssue - i,
      sticker,
      at: `${addDays(today, -1 - i)}T09:00:00.000Z`,
    }),
  );
  push({
    type: "story_saved",
    issue: lastIssue,
    slug: "octopus-art",
    headline: "Octopus paints its first masterpiece, gallery says it's 'mostly suckers'",
    kicker: "Discoveries",
    date: addDays(today, -1),
    at: `${addDays(today, -1)}T09:30:00.000Z`,
  });
  push({
    type: "story_saved",
    issue: lastIssue - 2,
    slug: "bakery-cat",
    headline: "The bakery cat who clocks in at 5am every day",
    kicker: "Internet",
    date: addDays(today, -3),
    at: `${addDays(today, -3)}T09:30:00.000Z`,
  });
  return events.sort((a, b) => (a.at < b.at ? -1 : a.at > b.at ? 1 : a.id < b.id ? -1 : 1));
}
