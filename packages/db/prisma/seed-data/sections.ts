// The sections of PLAN §4. Colours are the Original Fluoro inks for core sections and pastel
// inks for guest sections; a design's colourway may override them.

export const sections = [
  // Core sections
  {
    slug: "screen-and-sound",
    name: "Screen & Sound",
    tagline: "Shows, films, music and the odd trailer",
    kind: "core",
    colour: "#ff3d9a",
    voice: "witty",
  },
  {
    slug: "gaming",
    name: "Gaming",
    tagline: "Releases, indie gems and gaming culture",
    kind: "core",
    colour: "#36f28a",
    voice: "witty",
  },
  {
    slug: "sports",
    name: "Sports",
    tagline: "The moments worth talking about",
    kind: "core",
    colour: "#ff6a1f",
    voice: "witty",
  },
  {
    slug: "tech",
    name: "Tech",
    tagline: "Clever things people made",
    kind: "core",
    colour: "#2f5bff",
    voice: "witty",
  },
  {
    slug: "discoveries",
    name: "Discoveries",
    tagline: "Space, animals, plants and science finds",
    kind: "core",
    colour: "#e9ff1f",
    voice: "warm",
  },
  {
    slug: "money",
    name: "Money",
    tagline: "Only the fun kind",
    kind: "core",
    colour: "#ffd21f",
    voice: "witty",
  },
  {
    slug: "internet-and-culture",
    name: "Internet & Culture",
    tagline: "The best of the internet, so you don't have to scroll",
    kind: "core",
    colour: "#b14bff",
    voice: "quirky",
  },
  // Rotating guest sections (one, every other day)
  {
    slug: "food-and-words",
    name: "Food & Words",
    tagline: "A weird food, a good word and an odd etymology",
    kind: "guest",
    colour: "#ffc6cc",
    voice: "quirky",
  },
  {
    slug: "on-this-day",
    name: "On This Day & 100 Years Ago",
    tagline: "Fun firsts, odd inventions and strange old headlines",
    kind: "guest",
    colour: "#f6e3b0",
    voice: "quirky",
  },
  {
    slug: "art-design-and-books",
    name: "Art, Design & Books",
    tagline: "A poster, a building, a typeface, and one good read",
    kind: "guest",
    colour: "#c8d8f5",
    voice: "warm",
  },
  {
    slug: "reader-made",
    name: "Reader-made",
    tagline: "Small wins, letters and classifieds from readers",
    kind: "guest",
    colour: "#d6ecc0",
    voice: "warm",
  },
] as const satisfies readonly {
  slug: string;
  name: string;
  tagline: string;
  kind: "core" | "guest";
  colour: string;
  voice: "witty" | "quirky" | "warm";
}[];

export type SectionSlug = (typeof sections)[number]["slug"];
