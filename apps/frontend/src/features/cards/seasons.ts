// Yay Attax seasons: a quarter each. A season features some leagues; its packs only hold cards
// released in it. Cards from past seasons stay in the album but aren't in new packs.

import type { LeagueId } from "./types.ts";
import { LEAGUE_IDS } from "./types.ts";

export type Season = {
  n: number;
  name: string;
  /** First and last edition dates, inclusive (YYYY-MM-DD). */
  start: string;
  end: string;
  leagues: readonly LeagueId[];
};

export const SEASONS: readonly Season[] = [
  {
    n: 1,
    name: "Season 1 · Kick-off",
    start: "2026-10-01",
    end: "2026-12-31",
    leagues: LEAGUE_IDS,
  },
  {
    n: 2,
    name: "Season 2 · Winter Clash",
    start: "2027-01-01",
    end: "2027-03-31",
    leagues: ["pokemon", "football", "nba", "anime", "marvel", "f1"],
  },
];

/** The season on a date: the one it falls in, the first before any, the last after all. */
export function seasonOn(date: string): Season {
  const first = SEASONS[0]!;
  if (date < first.start) return first;
  return SEASONS.find((s) => date >= s.start && date <= s.end) ?? SEASONS.at(-1)!;
}
