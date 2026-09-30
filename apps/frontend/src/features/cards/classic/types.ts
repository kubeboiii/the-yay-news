// Classic (news) Yay Attax cards: the shapes stored in the habits log by the first version, when
// cards were made from stories. Kept so collected ones still show in the album archive.

export type CardType =
  | "animal"
  | "hero"
  | "record"
  | "internet"
  | "sports"
  | "music"
  | "play"
  | "screen"
  | "space"
  | "tech"
  | "money"
  | "generic";

export const CARD_TYPES: readonly CardType[] = [
  "animal",
  "hero",
  "record",
  "internet",
  "sports",
  "music",
  "play",
  "screen",
  "space",
  "tech",
  "money",
  "generic",
];

export type Rarity = "common" | "rare" | "epic" | "legendary";

export const RARITIES: readonly Rarity[] = ["common", "rare", "epic", "legendary"];

export type StatKey = "wow" | "giggle" | "aww" | "reach";

export const STAT_KEYS: readonly StatKey[] = ["wow", "giggle", "aww", "reach"];

export type Stats = Record<StatKey, number>;

/** A card as the paper prints it: everything but its rarity, which is rolled when a pack opens. */
export type CardBase = {
  /** `${issue}:${slug}` of the story's original printing (a retelling points at the original). */
  id: string;
  issue: number;
  slug: string;
  /** The original edition's date (YYYY-MM-DD). */
  date: string;
  /** The card's name: the story's headline. */
  name: string;
  kicker: string;
  type: CardType;
  /** The section it ran in, for the generic frame's colour and the small print. */
  sec: { slug: string; name: string; colour: string };
  /** A short summary for the back. */
  summary: string;
  /** The printed (newsprint-pressed) photo, or null. */
  photo: string | null;
  alt: string;
  /** Base stats, 1–99, before the rarity bonus. */
  stats: Stats;
  /** The edition's lead story (may be Legendary). */
  lead: boolean;
  /** A Hall of Fame winner (may be Legendary). */
  hof: boolean;
};

/** A card as collected: its base plus the rarity it came out of the pack with. */
export type CardSnap = CardBase & { rarity: Rarity };
