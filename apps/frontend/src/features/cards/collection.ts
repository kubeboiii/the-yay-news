// Yay Attax: the reader's collection, as a fold over the habits log (features/habits/core.ts).
// Nothing here is stored as a total: the album, the Yay Coins balance and the rewards still to
// open are all worked out from the events, so merging two devices' logs (a union by event id)
// always gives one consistent collection.
//
// Merge rules:
//   · A reward key ("sc:42", "bx:42", "dp:39", "b:<id>") opens once. If two devices both opened
//     it before merging, the first opening event by (at, id) counts, and only the cards pulled
//     from that one.
//   · A card is owned from its first pull; every later copy is a duplicate, paid out in Yay Coins
//     (DUPE_COINS by its rarity) — except that a Pokémon that can still evolve keeps up to three
//     copies, unpaid, for evolving. Evolving (card_evolved) needs three copies and the next stage
//     not owned yet: it spends two copies and gives the next stage. A second device's evolution of
//     the same card, once merged, finds the next stage owned and does nothing.
//   · Coins = duplicates + Card Clash wins + Deck Battle wins − boxes bought (classic packs and
//     classic duplicates count too). Two devices spending the same coins offline can leave the
//     merged balance below zero; it is then earned back before the next purchase (the balance
//     shown never goes below 0).
//   · Classic (news) cards from the first version live on in `classic`, for the album's archive.

import {
  type EventOf,
  type HabitEvent,
  finishedDates,
  MILESTONES,
  runsOf,
  streakOf,
} from "../habits/core.ts";
import { CLASSIC_DUPE_COINS, isClassicCard, RARITY_RANK } from "./classic/legacy.ts";
import type { CardSnap } from "./classic/types.ts";
import { BOX_PRICE, DUPE_COINS } from "./draw.ts";
import { CARD_BY_ID } from "./leagues/index.ts";
import type { Card } from "./types.ts";

export type Owned = { card: Card; copies: number; at: string };

export type PendingReward = {
  key: string;
  kind: "scratch" | "box" | "dip";
  issue: number;
  date: string;
};

export type Collection = {
  owned: Map<string, Owned>;
  /** Classic (news) cards collected by the first version. */
  classic: Map<string, CardSnap>;
  coins: number;
  /** Reward keys already opened. */
  opened: Set<string>;
  /** Rewards earned by finishing papers and not opened yet, newest paper first. */
  pending: PendingReward[];
  /** Sets already marked complete. */
  sets: Set<string>;
  finished: Map<number, string>;
};

export const scratchKey = (issue: number) => `sc:${issue}`;
export const boxKey = (issue: number) => `bx:${issue}`;
export const dipKey = (issue: number) => `dp:${issue}`;

/** Only the newest few finished papers keep rewards waiting to be opened. */
export const PENDING_PAPERS = 7;
export const CLASSIC_PACK_PRICE = 10;

export const isSunday = (date: string) => new Date(`${date}T00:00:00Z`).getUTCDay() === 0;

type Opening = EventOf<"scratch_revealed"> | EventOf<"box_opened"> | EventOf<"dip_opened">;

/** Whether a card can still hold copies for evolving. */
const holdsForEvolving = (card: Card, owned: Map<string, Owned>) =>
  !!card.evolvesTo && !owned.has(`${card.league}:${card.evolvesTo}`);

export function collectionOf(events: readonly HabitEvent[]): Collection {
  const opened = new Set<string>();
  const counted = new Set<string>();
  const classicCounted = new Set<string>();
  const owned = new Map<string, Owned>();
  const classic = new Map<string, CardSnap>();
  const sets = new Set<string>();
  const finished = new Map<number, string>();
  let coins = 0;

  // First, which opening counts for each key: a reward and its cards share a timestamp, and
  // (at, id) order may put a card before its reward.
  const classicOpened = new Set<string>();
  for (const e of events) {
    if (e.type === "scratch_revealed" || e.type === "box_opened" || e.type === "dip_opened") {
      const o = e as Opening;
      if (opened.has(o.pack)) continue;
      opened.add(o.pack);
      counted.add(o.id);
      if (o.type === "box_opened" && o.cost) coins -= Math.max(0, Number(o.cost) || 0);
    } else if (e.type === "pack_opened") {
      if (classicOpened.has(e.pack)) continue;
      classicOpened.add(e.pack);
      classicCounted.add(e.id);
      if (e.kind === "bought") {
        coins -= Math.max(0, Number(e.cost ?? CLASSIC_PACK_PRICE) || 0);
      }
    }
  }

  const gain = (card: Card, at: string) => {
    const had = owned.get(card.id);
    if (!had) {
      owned.set(card.id, { card, copies: 1, at });
      return;
    }
    const held = holdsForEvolving(card, owned) && had.copies < 3;
    if (!held) coins += DUPE_COINS[card.rarity];
    owned.set(card.id, { ...had, copies: had.copies + 1 });
  };

  for (const e of events) {
    switch (e.type) {
      case "edition_finished":
        if (!finished.has(e.issue)) finished.set(e.issue, e.date);
        break;
      case "card_pulled": {
        if (!counted.has(e.from)) break;
        const card = CARD_BY_ID.get(e.card);
        if (card) gain(card, e.at);
        break;
      }
      case "card_evolved": {
        const from = owned.get(e.from);
        const to = CARD_BY_ID.get(e.to);
        if (!from || !to || from.copies < 3) break;
        if (`${from.card.league}:${from.card.evolvesTo}` !== to.id || owned.has(to.id)) break;
        owned.set(e.from, { ...from, copies: from.copies - 2 });
        gain(to, e.at);
        break;
      }
      case "card_collected": {
        // A classic (news) card.
        if (!classicCounted.has(e.pack) || !isClassicCard(e.card)) break;
        const had = classic.get(e.card.id);
        if (!had) {
          classic.set(e.card.id, e.card);
          break;
        }
        const keepNew = RARITY_RANK[e.card.rarity] > RARITY_RANK[had.rarity];
        coins += CLASSIC_DUPE_COINS[keepNew ? had.rarity : e.card.rarity];
        if (keepNew) classic.set(e.card.id, e.card);
        break;
      }
      case "clash_played":
        coins += Math.max(0, Math.min(1, Number(e.coins) || 0));
        break;
      case "battle_played":
        coins += Math.max(0, Math.min(BATTLE_COINS, Number(e.coins) || 0));
        break;
      case "set_completed":
        sets.add(e.set);
        break;
      default:
        break;
    }
  }

  const pending: PendingReward[] = [];
  const newest = [...finished].sort((a, b) => b[0] - a[0]).slice(0, PENDING_PAPERS);
  for (const [issue, date] of newest) {
    if (!opened.has(scratchKey(issue))) {
      pending.push({ key: scratchKey(issue), kind: "scratch", issue, date });
    }
    if (!opened.has(boxKey(issue))) pending.push({ key: boxKey(issue), kind: "box", issue, date });
    if (isSunday(date) && !opened.has(dipKey(issue))) {
      pending.push({ key: dipKey(issue), kind: "dip", issue, date });
    }
  }
  return { owned, classic, coins: Math.max(0, coins), opened, pending, sets, finished };
}

/** Cards that can evolve now: three copies, and the next stage not owned. */
export function evolvable(col: Pick<Collection, "owned">): { from: Card; to: Card }[] {
  const out: { from: Card; to: Card }[] = [];
  for (const o of col.owned.values()) {
    if (o.copies < 3 || !o.card.evolvesTo) continue;
    const to = CARD_BY_ID.get(`${o.card.league}:${o.card.evolvesTo}`);
    if (to && !col.owned.has(to.id)) out.push({ from: o.card, to });
  }
  return out;
}

/** The reader's streak on a paper's date, and whether that paper reached a streak milestone. */
export function luckOn(events: readonly HabitEvent[], date: string) {
  const dates = finishedDates(events);
  const streak = dates.has(date) ? (runsOf(dates).get(date) ?? 0) : streakOf(dates, date).current;
  return {
    streak,
    milestone: dates.has(date) && (MILESTONES as readonly number[]).includes(streak),
  };
}

/** Card Clash: only the first CLASH_PAYOUTS wins a day pay a coin. */
export const CLASH_PAYOUTS = 3;
/** Deck Battle: a win pays BATTLE_COINS, for the first BATTLE_PAYOUTS wins a day. */
export const BATTLE_COINS = 3;
export const BATTLE_PAYOUTS = 2;

export function paidWinsOn(
  events: readonly HabitEvent[],
  date: string,
  type: "clash_played" | "battle_played" = "clash_played",
): number {
  return events.filter((e) => e.type === type && e.date === date && e.coins > 0).length;
}

export { BOX_PRICE };
