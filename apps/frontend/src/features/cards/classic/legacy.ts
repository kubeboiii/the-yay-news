// Classic (news) cards: the first Yay Attax cards, made from the paper's own stories before the
// leagues arrived. No new ones are made; the album keeps the ones already collected in an archive
// shelf, drawn by classic/game-card.tsx. These are the few helpers that drawing still needs.

import type { CardSnap, CardType, Rarity, Stats } from "./types.ts";

export const RARITY_NAME: Record<Rarity, string> = {
  common: "Common",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
};

export const RARITY_RANK: Record<Rarity, number> = { common: 0, rare: 1, epic: 2, legendary: 3 };

/** Yay Coins a classic duplicate paid, by its rarity. */
export const CLASSIC_DUPE_COINS: Record<Rarity, number> = {
  common: 1,
  rare: 2,
  epic: 3,
  legendary: 5,
};

const RARITY_BONUS: Record<Rarity, number> = { common: 0, rare: 3, epic: 6, legendary: 10 };

/** The stats as shown: the base plus the rarity bonus, capped at 99. */
export const shownStats = (c: Pick<CardSnap, "stats" | "rarity">): Stats => {
  const b = RARITY_BONUS[c.rarity];
  return {
    wow: Math.min(99, c.stats.wow + b),
    giggle: Math.min(99, c.stats.giggle + b),
    aww: Math.min(99, c.stats.aww + b),
    reach: Math.min(99, c.stats.reach + b),
  };
};

export const TYPE_NAME: Record<CardType, string> = {
  animal: "Wild One",
  hero: "Superstar",
  record: "Record Breaker",
  internet: "Viral",
  sports: "Match Winner",
  music: "Headliner",
  play: "Player One",
  screen: "Screen Time",
  space: "Discovery",
  tech: "Inventor",
  money: "Money Maker",
  generic: "Special",
};

const MONTH = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });

/** The full name of a classic card's home set, e.g. "Wild One · September 2026". */
export const homeSetName = (c: Pick<CardSnap, "date" | "type">) =>
  `${TYPE_NAME[c.type]} · ${MONTH.format(new Date(`${c.date.slice(0, 7)}-01T00:00:00Z`))}`;

/** The set symbol's words, e.g. "Set · Sep ’26". */
export const setMark = (date: string) => {
  const d = new Date(`${date}T00:00:00Z`);
  const mon = d.toLocaleString("en-GB", { month: "short", timeZone: "UTC" }).slice(0, 3);
  return `Set · ${mon} ’${String(d.getUTCFullYear()).slice(2)}`;
};

/** Whether a stored card is a well-formed classic card. */
export function isClassicCard(c: unknown): c is CardSnap {
  if (typeof c !== "object" || c === null) return false;
  const x = c as Record<string, unknown>;
  return (
    typeof x.id === "string" &&
    typeof x.name === "string" &&
    typeof x.type === "string" &&
    typeof x.rarity === "string" &&
    x.rarity in RARITY_RANK &&
    typeof x.stats === "object" &&
    x.stats !== null
  );
}
