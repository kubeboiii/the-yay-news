// Yay Attax · WWE Superstars. Slam Attax style: Power, Speed, Charisma and Finisher, with each
// Superstar's signature move.

import type { CardDef } from "../types.ts";

export const cards: CardDef[] = [
  {
    slug: "roman-reigns",
    name: "Roman Reigns",
    kind: "Powerhouse",
    team: "SmackDown",
    stats: [90, 70, 92, 95],
    rarity: "common",
    era: "current",
    bio: "The Tribal Chief held the Universal title for 1,316 days.",
    move: "Spear",
    colour: "#1a3c8f",
  },
  {
    slug: "john-cena",
    name: "John Cena",
    kind: "All-rounder",
    team: "Raw",
    stats: [86, 72, 98, 91],
    rarity: "epic",
    era: "2000s",
    bio: "A record 17-time world champion. You can't see him.",
    move: "Attitude Adjustment",
    colour: "#d62828",
  },
  {
    slug: "the-rock",
    name: "The Rock",
    kind: "Showman",
    team: "SmackDown",
    stats: [88, 76, 99, 93],
    rarity: "epic",
    era: "2000s",
    bio: "The People's Champion, and the most electrifying man in entertainment.",
    move: "Rock Bottom",
    colour: "#1a3c8f",
  },
  {
    slug: "the-undertaker",
    name: "The Undertaker",
    kind: "Deadman",
    team: "SmackDown",
    stats: [93, 60, 95, 99],
    rarity: "legendary",
    era: "legend",
    weight: 0.8,
    bio: "The Deadman won 21 WrestleMania matches in a row.",
    move: "Tombstone Piledriver",
    colour: "#4b2c6b",
  },
];
