// Yay Attax sets: which cards belong together in the album. Each league has, per season, its
// season set (every card of that league released in the season) and an "Eras" set (its 2010s,
// 2000s and legend cards, when it has two or more). Sets grow as drops land; one that was
// complete stays marked complete (set_completed, and the "Full set!" sticker, are once only).

import { LEAGUES } from "./leagues/meta.ts";
import type { Card, LeagueId } from "./types.ts";

export type CardSet = {
  id: string;
  league: LeagueId;
  season: number;
  name: string;
  sub: string;
  members: string[];
};

export function setsOf(cards: readonly Card[]): CardSet[] {
  const out = new Map<string, CardSet>();
  const add = (id: string, make: () => Omit<CardSet, "members">, c: Card) => {
    let s = out.get(id);
    if (!s) {
      s = { ...make(), members: [] };
      out.set(id, s);
    }
    s.members.push(c.id);
  };
  for (const c of cards) {
    const L = LEAGUES[c.league];
    add(
      `${c.league}:s${c.season}`,
      () => ({
        id: `${c.league}:s${c.season}`,
        league: c.league,
        season: c.season,
        name: `${L.name}`,
        sub: `Season ${c.season} · every card`,
      }),
      c,
    );
    if (c.era !== "current") {
      add(
        `${c.league}:s${c.season}:eras`,
        () => ({
          id: `${c.league}:s${c.season}:eras`,
          league: c.league,
          season: c.season,
          name: `${L.short} Eras`,
          sub: "2010s, 2000s and all-time legends",
        }),
        c,
      );
    }
  }
  return [...out.values()].filter((s) => !s.id.endsWith(":eras") || s.members.length >= 2);
}

/** Sets whose every card is owned. */
export const completeSets = (sets: readonly CardSet[], owned: { has: (id: string) => boolean }) =>
  sets.filter((s) => s.members.length > 0 && s.members.every((id) => owned.has(id)));
