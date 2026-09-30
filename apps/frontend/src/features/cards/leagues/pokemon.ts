// Yay Attax · Pokémon. Stats come from each Pokémon's official base stats (HP, the higher of
// Attack and Sp. Atk, Defense, Speed), mapped onto the 1–99 scale by `poke` below; the card's
// back prints the official numbers. Collect three copies of a stage to evolve it.

import type { CardDef, Stats4 } from "../types.ts";

/** Official base stat → the card's 1–99 stat: 20 + 0.55 × base, capped at 99. */
const poke = (base: Stats4): Stats4 =>
  base.map((b) => Math.max(1, Math.min(99, Math.round(20 + 0.55 * b)))) as unknown as Stats4;

const mon = (c: Omit<CardDef, "stats"> & { base: Stats4 }): CardDef => ({
  ...c,
  stats: poke(c.base),
});

export const cards: CardDef[] = [
  mon({
    slug: "pikachu",
    name: "Pikachu",
    kind: "electric",
    team: "Kanto",
    base: [35, 55, 40, 90],
    rarity: "rare",
    era: "current",
    weight: 0.8,
    dex: 25,
    stage: 1,
    bio: "The Mouse Pokémon, storing electricity in its red cheeks.",
    move: "Thunderbolt",
    colour: "#f7d02c",
  }),
  mon({
    slug: "charmander",
    name: "Charmander",
    kind: "fire",
    team: "Kanto",
    base: [39, 60, 43, 65],
    rarity: "common",
    era: "current",
    dex: 4,
    stage: 1,
    evolvesTo: "charmeleon",
    bio: "The flame on its tail shows how it's feeling.",
    move: "Ember",
    colour: "#ee8130",
  }),
  mon({
    slug: "charmeleon",
    name: "Charmeleon",
    kind: "fire",
    team: "Kanto",
    base: [58, 80, 58, 80],
    rarity: "rare",
    era: "current",
    dex: 5,
    stage: 2,
    evolvesTo: "charizard",
    bio: "Fierce and hot-headed, it lashes out with its fiery tail.",
    move: "Flamethrower",
    colour: "#ee8130",
  }),
  mon({
    slug: "charizard",
    name: "Charizard",
    kind: "fire/flying",
    team: "Kanto",
    base: [78, 109, 78, 100],
    rarity: "epic",
    era: "current",
    weight: 0.8,
    dex: 6,
    stage: 3,
    bio: "Breathes flames hot enough to melt boulders, but never at a weaker foe.",
    move: "Blast Burn",
    colour: "#ee8130",
  }),
  mon({
    slug: "mewtwo",
    name: "Mewtwo",
    kind: "psychic",
    team: "Kanto",
    base: [106, 154, 90, 130],
    rarity: "legendary",
    era: "legend",
    dex: 150,
    stage: 1,
    bio: "The original Gen 1 legend, made from Mew's genes: the strongest of the 151.",
    move: "Psystrike",
    colour: "#f95587",
  }),
];
