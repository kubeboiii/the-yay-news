import { seeded } from "../edition-seed";

// What goes into the edition. Everything here is chosen from the issue number, so an issue
// always falls open on the same insert, the same print and the same serial number.

export const INSERT_TYPES = [
  "print",
  "stickers",
  "coupon",
  "postcard",
  "colouring",
  "poster",
] as const;
export type InsertType = (typeof INSERT_TYPES)[number];

const aliases: Record<string, InsertType> = {
  print: "print",
  artist: "print",
  art: "print",
  "guest-artist": "print",
  stickers: "stickers",
  sticker: "stickers",
  coupon: "coupon",
  postcard: "postcard",
  colouring: "colouring",
  coloring: "colouring",
  colour: "colouring",
  poster: "poster",
  "fold-out": "poster",
  foldout: "poster",
};

export const parseInsertType = (raw: string | null): InsertType | null =>
  raw ? (aliases[raw.toLowerCase()] ?? null) : null;

/**
 * Six issues in a row carry six different inserts: each run of six is a seeded shuffle of the
 * types, so an insert never repeats the next day and every issue keeps its own for good.
 */
export function insertForIssue(issue: number): InsertType {
  const block = Math.floor(issue / INSERT_TYPES.length);
  const rand = seeded(block * 2654435761 + 97);
  const order: InsertType[] = [...INSERT_TYPES];
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j]!, order[i]!];
  }
  return order[issue % INSERT_TYPES.length]!;
}

export const tabLabel: Record<InsertType, string> = {
  print: "a guest artist print",
  stickers: "a sheet of stickers",
  coupon: "a coupon",
  postcard: "a postcard",
  colouring: "a page to colour in",
  poster: "a fold-out poster",
};

/** A number that belongs to one issue and one purpose. */
export const issueRand = (issue: number, salt: number) => seeded(issue * 7919 + salt * 104729);

// ——— Guest artist prints: real illustrations, credited to the people who drew them ———

export type ArtPrint = {
  src: string;
  artist: string;
  title: string;
  medium: string;
  /** Width over height of the artwork. */
  ratio: number;
};

export const artPrints: ArtPrint[] = [
  {
    src: "/mockup/inserts/print-squid-oliveira.jpg",
    artist: "Celso Oliveira",
    title: "Disco Pete, rehearsing",
    medium: "after the octopus filmed dancing 1,200 metres down",
    ratio: 1,
  },
  {
    src: "/mockup/inserts/print-koi-lissachenko.jpg",
    artist: "Viktoriya Lissachenko",
    title: "Two koi, keeping time",
    medium: "ink, for everybody who kept swimming this week",
    ratio: 1,
  },
  {
    src: "/mockup/inserts/print-octopus-sezer.jpg",
    artist: "Esma Melike Sezer",
    title: "Disco Pete, one scoop",
    medium: "after the octopus filmed dancing 1,200 metres down",
    ratio: 1600 / 2001,
  },
  {
    src: "/mockup/inserts/print-cat-spratt.jpg",
    artist: "Annie Spratt",
    title: "The bakery cat, off duty",
    medium: "pen, after the cosy game topping the charts",
    ratio: 1600 / 1120,
  },
];

export const artForIssue = (issue: number): ArtPrint => artPrints[issue % artPrints.length]!;

// ——— Colouring panel: real line drawings, big enough to colour ———

export type LineArt = { id: string; src: string; artist: string; subject: string; ratio: number };

export const lineArt: LineArt[] = [
  {
    id: "shells",
    src: "/mockup/inserts/colour-shells-lissachenko.jpg",
    artist: "Viktoriya Lissachenko",
    subject: "a seahorse and the shells it keeps",
    ratio: 1587 / 1237,
  },
  {
    id: "crab",
    src: "/mockup/inserts/colour-crab-khat.jpg",
    artist: "Husnal Khat",
    subject: "a very pleased crab",
    ratio: 1,
  },
  {
    id: "cat",
    src: "/mockup/inserts/colour-cat-sezer.jpg",
    artist: "Esma Melike Sezer",
    subject: "a cat having a long stretch",
    ratio: 871 / 811,
  },
];

export const lineArtForIssue = (issue: number): LineArt => lineArt[issue % lineArt.length]!;

// ——— Coupon ———

export const coupons = [
  {
    head: "Good for one compliment",
    small: "Redeemable from anyone, about anything, at any time of day.",
  },
  {
    head: "One free high-five",
    small: "Present to a friend, a colleague or a bus driver who looks like they need it.",
  },
  {
    head: "Redeemable for one long lunch",
    small: "Valid on any weekday. The second sandwich is on the house.",
  },
  {
    head: "Good for five more minutes in bed",
    small: "Not valid on days with a train to catch. Very valid on all the others.",
  },
  {
    head: "Admits one to the front of the biscuit tin",
    small: "First pick of the chocolate ones. No swaps, no refunds.",
  },
  {
    head: "Good for one excellent nap",
    small: "Twenty minutes, one blanket, zero guilt. Cat not included.",
  },
];

export const couponForIssue = (issue: number) =>
  coupons[Math.floor(issueRand(issue, 3)() * coupons.length)]!;

// ——— Postcard: pressed photographs, printed like a picture postcard ———

export const postcards = [
  {
    photo: "/mockup/press/photo-1633967920376-33b2d94f091f.jpg",
    credit: "Kedar Gadge",
    caption: "Otters, holding hands",
    note: "Weather lovely. An octopus was filmed dancing a mile down and nobody knows why. Thought of you straight away.",
  },
  {
    photo: "/mockup/press/photo-1552160793-cbaf3ebcba72.jpg",
    credit: "Jordan Cormack",
    caption: "Greetings from the sunflowers",
    note: "Twelve thousand picnic blankets laid end to end. I brought the sandwiches. Wish you were here, obviously.",
  },
  {
    photo: "/mockup/press/photo-1591198936750-16d8e15edb9e.jpg",
    credit: "Joshua J. Cotten",
    caption: "A goldfinch, identified by an old phone",
    note: "Someone turned a drawer of old phones into birdsong identifiers. This one is apparently a goldfinch. Hello!",
  },
  {
    photo: "/mockup/press/photo-1780650548384-6c91e653e809.jpg",
    credit: "Tom Macret",
    caption: "The bench with the best view",
    note: "Found the bench off the map. Sat on it for an hour. Recommend. Saving you the left side.",
  },
];

export const postcardForIssue = (issue: number) =>
  postcards[Math.floor(issueRand(issue, 5)() * postcards.length)]!;

export const stampPhoto = "/mockup/press/photo-1609421543722-919530d6b864.jpg";

// ——— Fold-out poster ———

export const posters = [
  {
    photo: "/mockup/press/photo-1552160793-cbaf3ebcba72.jpg",
    credit: "Jordan Cormack",
    head: "Look up. The sunflowers did.",
    sub: "A field in full bloom, for the wall above your desk",
  },
  {
    photo: "/mockup/press/photo-1633967920376-33b2d94f091f.jpg",
    credit: "Kedar Gadge",
    head: "Hold hands. Don't drift.",
    sub: "Sea otters, photographed doing the sensible thing",
  },
  {
    photo: "/mockup/press/photo-1706800696671-570820e7ff39.jpg",
    credit: "NASA Hubble Space Telescope",
    head: "Plenty of room up there",
    sub: "A star cluster, a long way off and in no hurry",
  },
  {
    photo: "/mockup/press/photo-1720186576697-24c1496a07e1.jpg",
    credit: "Green Liu",
    head: "Everybody, from the top",
    sub: "The village choir whose power ballad passed ten million",
  },
];

export const posterForIssue = (issue: number) =>
  posters[Math.floor(issueRand(issue, 7)() * posters.length)]!;
