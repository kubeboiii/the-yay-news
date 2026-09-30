// Yay Attax · IPL Cricket. Batting, Bowling, Fielding and Clutch (big-match temperament).

import type { CardDef } from "../types.ts";

export const cards: CardDef[] = [
  {
    slug: "virat-kohli",
    name: "Virat Kohli",
    kind: "Batter",
    team: "Royal Challengers Bengaluru",
    stats: [96, 18, 88, 92],
    rarity: "rare",
    era: "current",
    bio: "The IPL's all-time top run-scorer, and a champion with RCB in 2025.",
    move: "Cover drive",
    colour: "#d71920",
  },
  {
    slug: "rohit-sharma",
    name: "Rohit Sharma",
    kind: "Batter",
    team: "Mumbai Indians",
    stats: [92, 22, 78, 90],
    rarity: "common",
    era: "current",
    bio: "Captained Mumbai Indians to five IPL titles. Hits sixes for fun.",
    move: "Pull shot",
    colour: "#004ba0",
  },
  {
    slug: "jasprit-bumrah",
    name: "Jasprit Bumrah",
    kind: "Bowler",
    team: "Mumbai Indians",
    stats: [20, 97, 80, 94],
    rarity: "common",
    era: "current",
    bio: "Yorkers on demand, from one of cricket's strangest run-ups.",
    move: "Toe-crushing yorker",
    colour: "#004ba0",
  },
  {
    slug: "ms-dhoni",
    name: "MS Dhoni",
    kind: "Wicketkeeper",
    team: "Chennai Super Kings",
    stats: [88, 10, 94, 99],
    rarity: "epic",
    era: "2010s",
    bio: "Captain Cool: five IPL titles with Chennai, and the helicopter shot.",
    move: "Helicopter shot",
    colour: "#fdb913",
  },
];
