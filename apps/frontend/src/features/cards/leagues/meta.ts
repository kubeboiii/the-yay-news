// Yay Attax: the twelve leagues. Each is a set family with its own frame (attax.css, by
// `data-league`), its own four stats, and its own Deck Battle rule. Editing a league's cards is
// done in its data file (leagues/<id>.ts); this file only names things.

import type { Era, LeagueId, Rarity } from "../types.ts";

/** Which of a league's four stats Deck Battle uses for what (indices into `stats`). */
export type BattleRoles = { atk: number; def: number; spd: number; special: number };

export type League = {
  id: LeagueId;
  name: string;
  /** Short name for tabs and badges. */
  short: string;
  /** What its cards are called ("Pokémon", "Superstars", "Players"…). */
  noun: string;
  /** The four stats, in data order. */
  stats: readonly [string, string, string, string];
  /** Three-letter versions for tight spots. */
  abbr: readonly [string, string, string, string];
  /** What `kind` means in this league ("Type", "Position"…). */
  kindName: string;
  /** What `team` means ("Club", "Series"…). */
  teamName: string;
  roles: BattleRoles;
  /** Deck Battle's league rule, in a line. */
  rule: string;
  /** The frame's main colours (the share image and placeholders use them). */
  ink: string;
  paper: string;
  accent: string;
};

export const LEAGUES: Record<LeagueId, League> = {
  pokemon: {
    id: "pokemon",
    name: "Pokémon",
    short: "Pokémon",
    noun: "Pokémon",
    stats: ["HP", "Attack", "Defense", "Speed"],
    abbr: ["HP", "ATK", "DEF", "SPD"],
    kindName: "Type",
    teamName: "Region",
    roles: { atk: 1, def: 2, spd: 3, special: 1 },
    rule: "Type advantage: super-effective hits do 1.5×, resisted ones 0.6×.",
    ink: "#1d2a5c",
    paper: "#fff6c9",
    accent: "#ffcb05",
  },
  wwe: {
    id: "wwe",
    name: "WWE Superstars",
    short: "WWE",
    noun: "Superstars",
    stats: ["Power", "Speed", "Charisma", "Finisher"],
    abbr: ["PWR", "SPD", "CHA", "FIN"],
    kindName: "Style",
    teamName: "Brand",
    roles: { atk: 0, def: 2, spd: 1, special: 3 },
    rule: "Finisher: a Superstar's special hits 1.8× and can't be dodged.",
    ink: "#0d0d0d",
    paper: "#1b1b1b",
    accent: "#d4a72c",
  },
  football: {
    id: "football",
    name: "Club Football",
    short: "Football",
    noun: "Players",
    stats: ["Attack", "Defence", "Control", "Pace"],
    abbr: ["ATT", "DEF", "CTL", "PAC"],
    kindName: "Position",
    teamName: "Club",
    roles: { atk: 0, def: 1, spd: 3, special: 2 },
    rule: "Team chemistry: +10% attack for each other card from the same club in your deck.",
    ink: "#101a4a",
    paper: "#e9eefc",
    accent: "#37e0ff",
  },
  ipl: {
    id: "ipl",
    name: "IPL Cricket",
    short: "IPL",
    noun: "Players",
    stats: ["Batting", "Bowling", "Fielding", "Clutch"],
    abbr: ["BAT", "BWL", "FLD", "CLT"],
    kindName: "Role",
    teamName: "Team",
    roles: { atk: 0, def: 1, spd: 2, special: 3 },
    rule: "Clutch: when your side is behind on cards, specials hit 1.5×.",
    ink: "#0b1f4d",
    paper: "#fdf3e4",
    accent: "#ff7a1a",
  },
  ufc: {
    id: "ufc",
    name: "UFC Fighters",
    short: "UFC",
    noun: "Fighters",
    stats: ["Striking", "Grappling", "Cardio", "Chin"],
    abbr: ["STR", "GRP", "CRD", "CHN"],
    kindName: "Style",
    teamName: "Division",
    roles: { atk: 0, def: 3, spd: 2, special: 1 },
    rule: "Iron chin: a fighter with Chin 80+ survives one knockout blow on 1 HP.",
    ink: "#120606",
    paper: "#f3ece6",
    accent: "#d20a0a",
  },
  nba: {
    id: "nba",
    name: "NBA Basketball",
    short: "NBA",
    noun: "Players",
    stats: ["Scoring", "Playmaking", "Defense", "Athleticism"],
    abbr: ["SCR", "PLY", "DEF", "ATH"],
    kindName: "Position",
    teamName: "Team",
    roles: { atk: 0, def: 2, spd: 3, special: 1 },
    rule: "Team chemistry: +10% attack for each other card from the same team in your deck.",
    ink: "#1a1208",
    paper: "#f6e2c2",
    accent: "#ee6730",
  },
  marvel: {
    id: "marvel",
    name: "Marvel",
    short: "Marvel",
    noun: "Heroes & villains",
    stats: ["Power", "Intellect", "Speed", "Durability"],
    abbr: ["PWR", "INT", "SPD", "DUR"],
    kindName: "Side",
    teamName: "Team",
    roles: { atk: 0, def: 3, spd: 2, special: 1 },
    rule: "Heroes vs villains: hitting the other side does 1.25×.",
    ink: "#1a0406",
    paper: "#fff4e8",
    accent: "#e23636",
  },
  dc: {
    id: "dc",
    name: "DC",
    short: "DC",
    noun: "Heroes & villains",
    stats: ["Power", "Intellect", "Speed", "Durability"],
    abbr: ["PWR", "INT", "SPD", "DUR"],
    kindName: "Side",
    teamName: "Team",
    roles: { atk: 0, def: 3, spd: 2, special: 1 },
    rule: "Heroes vs villains: hitting the other side does 1.25×.",
    ink: "#050b1f",
    paper: "#e8eefb",
    accent: "#0476f2",
  },
  ben10: {
    id: "ben10",
    name: "Ben 10",
    short: "Ben 10",
    noun: "Aliens & heroes",
    stats: ["Power", "Speed", "Smarts", "Toughness"],
    abbr: ["PWR", "SPD", "SMT", "TGH"],
    kindName: "Species",
    teamName: "Series",
    roles: { atk: 0, def: 3, spd: 1, special: 2 },
    rule: "Omnitrix: a special transforms the hit, 1.6×, but the card then times out for a turn.",
    ink: "#0b140b",
    paper: "#eaf7e6",
    accent: "#5bd12f",
  },
  anime: {
    id: "anime",
    name: "Anime",
    short: "Anime",
    noun: "Characters",
    stats: ["Power", "Technique", "Speed", "Aura"],
    abbr: ["PWR", "TEC", "SPD", "AUR"],
    kindName: "Role",
    teamName: "Series",
    roles: { atk: 0, def: 1, spd: 2, special: 3 },
    rule: "Power-up: specials grow with Aura, up to 1.9× at Aura 99.",
    ink: "#1d0b2e",
    paper: "#fff0f6",
    accent: "#ff4fa3",
  },
  f1: {
    id: "f1",
    name: "Formula 1",
    short: "F1",
    noun: "Drivers & cars",
    stats: ["Pace", "Racecraft", "Consistency", "Wet"],
    abbr: ["PAC", "RCR", "CON", "WET"],
    kindName: "Role",
    teamName: "Team",
    roles: { atk: 0, def: 2, spd: 0, special: 1 },
    rule: "Rain: if the battle is wet, drivers attack with their Wet stat instead of Pace.",
    ink: "#111111",
    paper: "#f2f2f2",
    accent: "#e10600",
  },
  tv: {
    id: "tv",
    name: "TV Favourites",
    short: "TV",
    noun: "Characters",
    stats: ["Charm", "Brains", "Chaos", "Fan-fave"],
    abbr: ["CHM", "BRN", "CHS", "FAN"],
    kindName: "Role",
    teamName: "Show",
    roles: { atk: 2, def: 1, spd: 0, special: 3 },
    rule: "Fan favourite: the crowd saves a card from a hit, one in (100 ÷ Fan-fave × 6) turns.",
    ink: "#161223",
    paper: "#f7f3ea",
    accent: "#ffb300",
  },
};

export const RARITY_NAME: Record<Rarity, string> = {
  common: "Common",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
};

export const RARITY_RANK: Record<Rarity, number> = { common: 0, rare: 1, epic: 2, legendary: 3 };

export const ERA_NAME: Record<Era, string> = {
  current: "Now",
  "2010s": "2010s",
  "2000s": "2000s",
  legend: "Legend",
};

/** The lowest rarity a card of each era may have. */
export const ERA_FLOOR: Record<Era, Rarity> = {
  current: "common",
  "2010s": "rare",
  "2000s": "epic",
  legend: "epic",
};
