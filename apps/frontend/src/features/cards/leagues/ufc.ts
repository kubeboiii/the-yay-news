// Yay Attax · UFC Fighters. Striking, Grappling, Cardio and Chin; `team` is the division.

import type { CardDef } from "../types.ts";

export const cards: CardDef[] = [
  {
    slug: "alex-pereira",
    name: "Alex Pereira",
    kind: "Striker",
    team: "Light Heavyweight",
    stats: [97, 55, 78, 88],
    rarity: "common",
    era: "current",
    bio: "Poatan: champion at middleweight and light heavyweight, with a left hook to fear.",
    move: "Left hook",
    colour: "#d20a0a",
  },
  {
    slug: "jon-jones",
    name: "Jon Jones",
    kind: "All-rounder",
    team: "Heavyweight",
    stats: [88, 92, 90, 92],
    rarity: "rare",
    era: "2010s",
    bio: "The youngest champion in UFC history, later heavyweight champion too.",
    move: "Spinning elbow",
    colour: "#8a6d1f",
  },
  {
    slug: "conor-mcgregor",
    name: "Conor McGregor",
    kind: "Striker",
    team: "Lightweight",
    stats: [94, 60, 70, 82],
    rarity: "epic",
    era: "2010s",
    bio: "The first fighter to hold two UFC titles at once, in 2016.",
    move: "Left straight",
    colour: "#169b62",
  },
  {
    slug: "khabib-nurmagomedov",
    name: "Khabib Nurmagomedov",
    kind: "Grappler",
    team: "Lightweight",
    stats: [74, 99, 96, 88],
    rarity: "epic",
    era: "2010s",
    bio: "The Eagle retired unbeaten at 29 wins and no defeats.",
    move: "Smesh",
    colour: "#0f5e2e",
  },
];
