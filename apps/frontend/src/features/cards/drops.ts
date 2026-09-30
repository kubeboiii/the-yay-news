// Yay Attax drops: Season 1 launched with 50 cards on 1 October 2026, and more arrive as the days
// go by: a small drop (3–5 cards) every few days, and a bigger themed drop on Sundays.
//
// A card is RELEASED on a date when its `releasedOn` (default: its season's first day) is on or
// before that date. Packs, scratch cards, the lucky dip, Card Clash's computer and Deck Battle's
// computer only ever use released cards, and the album only shows released ones (as cards, or
// empty outlines). "Today" is the reader's edition date (or `?now=` in previews).
//
// PLANNED holds the next drops as placeholders (name, league, era): they are not cards yet and
// never reach a pack. To ship one, write each card into its league's data file with
// `releasedOn: "<the drop's date>"`, add its picture to the league's image manifest, run
// scripts/fetch_card_images.py, and delete the placeholder here (see README.md).

import { ALL_CARDS } from "./leagues/index.ts";
import type { Card, Era, LeagueId } from "./types.ts";

export const LAUNCH_DATE = "2026-10-01";

export type PlannedCard = { name: string; league: LeagueId; era: Era };

export type PlannedDrop = {
  date: string;
  name: string;
  /** Sunday drops are bigger and themed. */
  sunday: boolean;
  cards: readonly PlannedCard[];
};

export const PLANNED: readonly PlannedDrop[] = [
  {
    date: "2026-10-04",
    name: "Sunday Legends",
    sunday: true,
    cards: [
      { name: "Pelé", league: "football", era: "legend" },
      { name: "Diego Maradona", league: "football", era: "legend" },
      { name: "Hulk Hogan", league: "wwe", era: "legend" },
      { name: "Sachin Tendulkar", league: "ipl", era: "legend" },
      { name: "Michael Schumacher", league: "f1", era: "legend" },
      { name: "Magic Johnson", league: "nba", era: "legend" },
      { name: "Vegeta", league: "anime", era: "legend" },
      { name: "Mew", league: "pokemon", era: "legend" },
    ],
  },
  {
    date: "2026-10-07",
    name: "Midweek Drop",
    sunday: false,
    cards: [
      { name: "Mohamed Salah", league: "football", era: "current" },
      { name: "Jude Bellingham", league: "football", era: "current" },
      { name: "Shubman Gill", league: "ipl", era: "current" },
      { name: "Nikola Jokić", league: "nba", era: "current" },
      { name: "Cody Rhodes", league: "wwe", era: "current" },
    ],
  },
  {
    date: "2026-10-11",
    name: "Heroes Sunday",
    sunday: true,
    cards: [
      { name: "Captain America", league: "marvel", era: "current" },
      { name: "Wolverine", league: "marvel", era: "2000s" },
      { name: "Batman (Christian Bale)", league: "dc", era: "2000s" },
      { name: "The Flash", league: "dc", era: "current" },
      { name: "Diamondhead", league: "ben10", era: "current" },
      { name: "Gwen Tennyson", league: "ben10", era: "current" },
      { name: "Tanjiro Kamado", league: "anime", era: "current" },
      { name: "Light Yagami", league: "anime", era: "2000s" },
    ],
  },
];

export const isReleased = (c: Pick<Card, "releasedOn">, today: string) => c.releasedOn <= today;

/** Every card released by `today`. */
export const releasedCards = (today: string): Card[] =>
  ALL_CARDS.filter((c) => isReleased(c, today));

/**
 * What the album's teaser line says: the next day new cards arrive (a written card with a later
 * `releasedOn`, or a planned drop), and whether it's a planned (placeholder) drop.
 */
export function nextDrop(today: string): { date: string; name: string; count: number } | null {
  const upcoming = new Map<string, { name: string; count: number }>();
  for (const c of ALL_CARDS) {
    if (c.releasedOn <= today) continue;
    const had = upcoming.get(c.releasedOn);
    upcoming.set(c.releasedOn, { name: had?.name ?? "New cards", count: (had?.count ?? 0) + 1 });
  }
  for (const d of PLANNED) {
    if (d.date <= today) continue;
    const had = upcoming.get(d.date);
    upcoming.set(d.date, { name: d.name, count: (had?.count ?? 0) + d.cards.length });
  }
  const date = [...upcoming.keys()].sort()[0];
  return date ? { date, ...upcoming.get(date)! } : null;
}
