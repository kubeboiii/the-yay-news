// Every Yay Attax card, from the twelve league data files, numbered and matched to its picture.
// To add cards, edit a league's file (and its image manifest); see ../README.md.

import type { Card, CardDef, LeagueId } from "../types.ts";
import { LEAGUE_IDS } from "../types.ts";
import { cards as anime } from "./anime.ts";
import { images as animeImages } from "./anime.images.ts";
import { cards as ben10 } from "./ben10.ts";
import { images as ben10Images } from "./ben10.images.ts";
import { cards as dc } from "./dc.ts";
import { images as dcImages } from "./dc.images.ts";
import { cards as f1 } from "./f1.ts";
import { images as f1Images } from "./f1.images.ts";
import { cards as football } from "./football.ts";
import { images as footballImages } from "./football.images.ts";
import { cards as ipl } from "./ipl.ts";
import { images as iplImages } from "./ipl.images.ts";
import { cards as marvel } from "./marvel.ts";
import { images as marvelImages } from "./marvel.images.ts";
import { cards as nba } from "./nba.ts";
import { images as nbaImages } from "./nba.images.ts";
import { cards as pokemon } from "./pokemon.ts";
import { images as pokemonImages } from "./pokemon.images.ts";
import { cards as tv } from "./tv.ts";
import { images as tvImages } from "./tv.images.ts";
import { cards as ufc } from "./ufc.ts";
import { images as ufcImages } from "./ufc.images.ts";
import { cards as wwe } from "./wwe.ts";
import { images as wweImages } from "./wwe.images.ts";
import { SEASONS } from "../seasons.ts";

const DATA: Record<LeagueId, { cards: CardDef[]; images: Record<string, Card["image"]> }> = {
  pokemon: { cards: pokemon, images: pokemonImages },
  wwe: { cards: wwe, images: wweImages },
  football: { cards: football, images: footballImages },
  ipl: { cards: ipl, images: iplImages },
  ufc: { cards: ufc, images: ufcImages },
  nba: { cards: nba, images: nbaImages },
  marvel: { cards: marvel, images: marvelImages },
  dc: { cards: dc, images: dcImages },
  ben10: { cards: ben10, images: ben10Images },
  anime: { cards: anime, images: animeImages },
  f1: { cards: f1, images: f1Images },
  tv: { cards: tv, images: tvImages },
};

const seasonStart = (n: number) => SEASONS.find((s) => s.n === n)?.start ?? SEASONS[0]!.start;

/** Every card, league by league, in data order. */
export const ALL_CARDS: readonly Card[] = LEAGUE_IDS.flatMap((league) => {
  const { cards, images } = DATA[league];
  return cards.map((c, i) => {
    const season = c.season ?? 1;
    return {
      ...c,
      id: `${league}:${c.slug}`,
      league,
      set: c.set ?? c.team,
      season,
      releasedOn: c.releasedOn ?? seasonStart(season),
      no: i + 1,
      of: cards.length,
      image: images[c.slug] ?? null,
    };
  });
});

export const CARD_BY_ID: ReadonlyMap<string, Card> = new Map(ALL_CARDS.map((c) => [c.id, c]));

export const cardsOf = (league: LeagueId) => ALL_CARDS.filter((c) => c.league === league);
