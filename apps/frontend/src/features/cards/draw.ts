// Yay Attax: what comes out of a scratch card, a blind box or the lucky dip. Pure and seeded: the
// same device opening the same reward always gets the same cards, so reopening a tab can't reroll.
//
// ——— Rewards (earned only by reading; nothing is ever sold) ———
//   scratch   finishing a paper: a scratch card hiding 1 card
//   box       finishing a paper: a blind box of 3 cards, from a league you choose or a random one
//   dip       finishing a Sunday paper as well: the lucky dip, 2 cards, a random league, better odds
//   bought    BOX_PRICE Yay Coins: a blind box of 3 from a league you choose
//
// ——— Odds, per card ———
//   Legendary 3%, Epic 10%, Rare 25%, Common 62%. The lucky dip: 10 / 30 / 60 / 0.
// A streak moves the odds towards the rare end: +1 point per day of streak (max 20) taken from
// Common, split 60/28/12 between Rare, Epic and Legendary. A reward from a paper that reached a
// streak milestone (3, 7, 30, 100) has at least one Epic or better.
// A card of the rolled rarity is then picked from the pool (by its `weight`); when the pool has
// none of that rarity, the nearest rarity below it is used, then above. No card comes twice in one
// reward while the pool has others.

import { RARITY_RANK } from "./leagues/meta.ts";
import { seasonOn } from "./seasons.ts";
import { isReleased } from "./drops.ts";
import { ALL_CARDS } from "./leagues/index.ts";
import type { Card, LeagueId, Rarity } from "./types.ts";
import { RARITIES } from "./types.ts";

export type RewardKind = "scratch" | "box" | "dip" | "bought";

export const REWARD_SIZE: Record<RewardKind, number> = { scratch: 1, box: 3, dip: 2, bought: 3 };
export const BOX_PRICE = 12;
/** Yay Coins for a duplicate, by its rarity. */
export const DUPE_COINS: Record<Rarity, number> = { common: 1, rare: 2, epic: 4, legendary: 8 };

/** A string to a 32-bit seed (FNV-1a). */
export function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** mulberry32: a tiny seeded PRNG, [0, 1). */
export function rng(seed: number): () => number {
  let a = seed >>> 0 || 0x9e3779b9;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(list: readonly T[], seed: string): T[] {
  const r = rng(hash(seed));
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/** The odds of each rarity, [common, rare, epic, legendary], summing to 1. */
export function oddsFor(streak: number, dip = false): [number, number, number, number] {
  if (dip) return [0, 0.6, 0.3, 0.1];
  const b = Math.min(20, Math.max(0, streak)) / 100;
  return [0.62 - b, 0.25 + b * 0.6, 0.1 + b * 0.28, 0.03 + b * 0.12];
}

/** The rarity for a roll `r` in [0, 1). */
export function rarityFor(r: number, streak: number, dip = false): Rarity {
  const odds = oddsFor(streak, dip);
  let at = 0;
  for (let i = RARITIES.length - 1; i >= 0; i--) {
    at += odds[i]!;
    if (r < at) return RARITIES[i]!;
  }
  return "common";
}

/** The cards a reward can hold on `today`: released, in today's season, of `league` if given. */
export function poolFor(today: string, league?: LeagueId | null): Card[] {
  const season = seasonOn(today);
  return ALL_CARDS.filter(
    (c) =>
      isReleased(c, today) &&
      c.season === season.n &&
      season.leagues.includes(c.league) &&
      (!league || c.league === league),
  );
}

/** The leagues with cards to pull on `today`. */
export function leaguesOn(today: string): LeagueId[] {
  const set = new Set(poolFor(today).map((c) => c.league));
  return seasonOn(today).leagues.filter((l) => set.has(l));
}

/** Picks one card of (about) `rarity` from `left`, by weight. */
function pick(left: readonly Card[], rarity: Rarity, r: () => number): Card | null {
  if (!left.length) return null;
  const want = RARITY_RANK[rarity];
  // Nearest rarity present: the same, then below, then above.
  const order = [
    want,
    ...[3, 2, 1, 0].filter((n) => n < want),
    ...[0, 1, 2, 3].filter((n) => n > want),
  ];
  for (const rank of order) {
    const of = left.filter((c) => RARITY_RANK[c.rarity] === rank);
    if (!of.length) continue;
    const total = of.reduce((s, c) => s + (c.weight ?? 1), 0);
    let at = r() * total;
    for (const c of of) {
      at -= c.weight ?? 1;
      if (at < 0) return c;
    }
    return of.at(-1)!;
  }
  return null;
}

/**
 * The cards in a reward. `seed` is `${deviceId}:${key}`; `pool` the cards it can hold (poolFor);
 * `streak` the reader's streak for that paper; `milestone` whether that paper hit a milestone.
 */
export function drawCards({
  pool,
  kind,
  seed,
  streak = 0,
  milestone = false,
}: {
  pool: readonly Card[];
  kind: RewardKind;
  seed: string;
  streak?: number;
  milestone?: boolean;
}): Card[] {
  const r = rng(hash(`draw:${seed}`));
  const sorted = [...pool].sort((a, b) => (a.id < b.id ? -1 : 1));
  const out: Card[] = [];
  const n = REWARD_SIZE[kind];
  for (let i = 0; i < n; i++) {
    let rarity = rarityFor(r(), streak, kind === "dip");
    if (milestone && i === n - 1 && !out.some((c) => RARITY_RANK[c.rarity] >= 2)) {
      rarity = RARITY_RANK[rarity] >= 2 ? rarity : "epic";
    }
    const left = sorted.filter((c) => !out.includes(c));
    const c = pick(left.length ? left : sorted, rarity, r);
    if (c) out.push(c);
  }
  return out;
}

/** A random league for a reward that didn't choose one (seeded). */
export function randomLeague(today: string, seed: string): LeagueId | null {
  const list = leaguesOn(today);
  if (!list.length) return null;
  return list[Math.floor(rng(hash(`league:${seed}`))() * list.length)]!;
}
