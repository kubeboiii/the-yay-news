// Yay Attax · TV Favourites. Charm, Brains, Chaos and Fan-fave; `team` is the show.

import type { CardDef } from "../types.ts";

export const cards: CardDef[] = [
  {
    slug: "eleven",
    name: "Eleven",
    kind: "Hero",
    team: "Stranger Things",
    stats: [70, 66, 86, 97],
    rarity: "common",
    era: "current",
    bio: "Escaped from Hawkins Lab with powers, a shaved head and a love of Eggos.",
    move: "Telekinesis",
    colour: "#b3001b",
  },
  {
    slug: "wednesday-addams",
    name: "Wednesday Addams",
    kind: "Detective",
    team: "Wednesday",
    stats: [55, 93, 76, 94],
    rarity: "common",
    era: "current",
    bio: "Nevermore Academy's deadpan detective. Does not do hugs.",
    move: "The dance",
    colour: "#3b3b58",
  },
  {
    slug: "walter-white",
    name: "Walter White",
    kind: "Antihero",
    team: "Breaking Bad",
    stats: [40, 98, 92, 95],
    rarity: "rare",
    era: "2010s",
    bio: "A chemistry teacher from Albuquerque who became Heisenberg.",
    move: "Say my name",
    colour: "#2e7d32",
  },
  {
    slug: "michael-scott",
    name: "Michael Scott",
    kind: "Boss",
    team: "The Office",
    stats: [84, 30, 94, 96],
    rarity: "epic",
    era: "2000s",
    bio: "Regional manager of Dunder Mifflin Scranton, World's Best Boss (mug).",
    move: "That's what she said",
    colour: "#1f4e79",
  },
];
