// Yay Attax · DC. Power, Intellect, Speed and Durability; `kind` is the side.

import type { CardDef } from "../types.ts";

export const cards: CardDef[] = [
  {
    slug: "batman",
    name: "Batman",
    kind: "hero",
    team: "Justice League",
    stats: [70, 98, 72, 80],
    rarity: "rare",
    era: "current",
    bio: "Bruce Wayne: the world's greatest detective, and no superpowers at all.",
    move: "Batarang",
    colour: "#2b2b2b",
  },
  {
    slug: "superman",
    name: "Superman",
    kind: "hero",
    team: "Justice League",
    stats: [99, 78, 97, 99],
    rarity: "common",
    era: "current",
    bio: "The last son of Krypton: faster than a speeding bullet.",
    move: "Heat vision",
    colour: "#0476f2",
  },
  {
    slug: "wonder-woman",
    name: "Wonder Woman",
    kind: "hero",
    team: "Justice League",
    stats: [92, 80, 86, 92],
    rarity: "common",
    era: "current",
    bio: "Diana, Amazon princess of Themyscira.",
    move: "Lasso of Truth",
    colour: "#c8102e",
  },
  {
    slug: "joker",
    name: "The Joker",
    kind: "villain",
    team: "Gotham",
    stats: [40, 94, 62, 72],
    rarity: "epic",
    era: "2000s",
    bio: "Heath Ledger's agent of chaos in The Dark Knight (2008).",
    move: "Why so serious?",
    colour: "#5b2a86",
  },
];
