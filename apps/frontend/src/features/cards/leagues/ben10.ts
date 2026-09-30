// Yay Attax · Ben 10. Power, Speed, Smarts and Toughness; `kind` is the alien's species.

import type { CardDef } from "../types.ts";

export const cards: CardDef[] = [
  {
    slug: "ben-tennyson",
    name: "Ben Tennyson",
    kind: "Human",
    team: "Ben 10",
    stats: [40, 55, 62, 45],
    rarity: "common",
    era: "current",
    bio: "A ten-year-old who found the Omnitrix on a summer road trip.",
    move: "It's hero time!",
    colour: "#5bd12f",
  },
  {
    slug: "heatblast",
    name: "Heatblast",
    kind: "Pyronite",
    team: "Ben 10",
    stats: [82, 62, 45, 74],
    rarity: "common",
    era: "current",
    bio: "A walking fireball from the star-like planet Pyros.",
    move: "Fire blast",
    colour: "#f26b1d",
  },
  {
    slug: "four-arms",
    name: "Four Arms",
    kind: "Tetramand",
    team: "Ben 10",
    stats: [95, 40, 35, 88],
    rarity: "common",
    era: "current",
    bio: "Twelve feet tall with four arms, and a clap that knocks enemies flat.",
    move: "Shockwave clap",
    colour: "#c81d25",
  },
  {
    slug: "xlr8",
    name: "XLR8",
    kind: "Kineceleran",
    team: "Ben 10 (2005)",
    stats: [50, 99, 52, 45],
    rarity: "epic",
    era: "2000s",
    bio: "The classic 2005 speedster, faster than the eye can follow.",
    move: "Super speed",
    colour: "#2a7de1",
  },
];
