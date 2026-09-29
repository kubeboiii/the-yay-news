// Colourways for the broadsheet (v1), specified the way a printer would: a paper stock, black ink,
// and spot inks. Neon colourways use fluorescent inks; pastel colourways use soft candy inks plus
// deeper tones of each for type that must stay readable.
//
// `kept` marks the colourways the owner chose to keep; the rest are new options on trial.

export type Ink = { name: string; hex: string; ref: string; role: string };

export type Theme = {
  slug: string;
  family: "Neon" | "Pastel";
  name: string;
  story: string;
  paper: "newsprint" | "bright";
  inks: Ink[];
  /** Deeper tones for pastel text accents (pastel inks are too light for small type). */
  deep?: [string, string];
  best: string;
  kept?: boolean;
};

export const themes: Theme[] = [
  // ——— Kept ———
  {
    slug: "original",
    family: "Neon",
    name: "Original Fluoro",
    story:
      "The broadsheet's own set: six fluoro inks, each section printed in its own pair. The most carnival of the lot.",
    paper: "newsprint",
    kept: true,
    inks: [
      {
        name: "Fluoro Yellow",
        hex: "#e9ff1f",
        ref: "≈ Pantone 803 C",
        role: "Front banner, stickers",
      },
      {
        name: "Fluoro Pink",
        hex: "#ff3d9a",
        ref: "≈ Pantone 806 C",
        role: "Headline cards, Screen & Sound",
      },
      { name: "Fluoro Green", hex: "#36f28a", ref: "≈ Pantone 802 C", role: "Gaming HUD, blocks" },
      { name: "Fluoro Orange", hex: "#ff6a1f", ref: "≈ Pantone 804 C", role: "Back page" },
      {
        name: "Electric Blue",
        hex: "#2f5bff",
        ref: "≈ Pantone 2728 C",
        role: "Reversed type, listings",
      },
      { name: "Violet", hex: "#b14bff", ref: "≈ Pantone 2592 C", role: "Gaming partner ink" },
    ],
    best: "The everyday front page; a different pair per section.",
  },
  {
    slug: "acid-garden",
    family: "Neon",
    name: "Acid Garden",
    story:
      "Laser lime with ultraviolet. Sharp and a little techy, with a deep bronze where they overprint.",
    paper: "bright",
    kept: true,
    inks: [
      {
        name: "Laser Lime",
        hex: "#c8ff1e",
        ref: "≈ Pantone 802 C",
        role: "Blocks, highlights, HUD bands",
      },
      {
        name: "Ultraviolet",
        hex: "#7b3cff",
        ref: "≈ Pantone 2587 C",
        role: "Stickers, stamps, reversed type",
      },
    ],
    best: "Gaming, tech and internet-culture sections; night editions.",
  },
  {
    slug: "pool-party",
    family: "Neon",
    name: "Pool Party",
    story:
      "Fluoro aqua and a hot red-pink, like a lido poster in August. Summery, bright, a little retro.",
    paper: "newsprint",
    kept: true,
    inks: [
      {
        name: "Fluoro Aqua",
        hex: "#00d8c8",
        ref: "≈ Pantone 3252 C, fluoro-boosted",
        role: "Blocks, water-y duotones",
      },
      {
        name: "Hot Coral",
        hex: "#ff2e5b",
        ref: "≈ Pantone 805 C",
        role: "Headlines, stickers, stamps",
      },
    ],
    best: "Weekend and summer editions, sport, travel.",
  },

  {
    slug: "blacklight",
    family: "Neon",
    kept: true,
    name: "Blacklight",
    story:
      "Electric cyan and fluoro magenta: the two brightest inks under a UV lamp. Club flyer energy, pure and cold-hot.",
    paper: "bright",
    inks: [
      {
        name: "Electric Cyan",
        hex: "#00e1ff",
        ref: "≈ Pantone 801 C",
        role: "Banners, blocks, highlights",
      },
      {
        name: "Fluoro Magenta",
        hex: "#ff1fce",
        ref: "≈ Pantone 807 C",
        role: "Headline cards, stickers",
      },
    ],
    best: "Screen & Sound, music, nights out.",
  },
  {
    slug: "tropic-punch",
    family: "Neon",
    kept: true,
    name: "Tropic Punch",
    story:
      "Neon mint-teal with a blazing tangerine. Warm meets cool again, but fruitier than Pool Party.",
    paper: "newsprint",
    inks: [
      {
        name: "Neon Teal",
        hex: "#00e59b",
        ref: "≈ Pantone 7479 C, fluoro-boosted",
        role: "Banners, blocks",
      },
      {
        name: "Blaze Tangerine",
        hex: "#ff7a00",
        ref: "≈ Pantone 804 C",
        role: "Headline cards, stickers",
      },
    ],
    best: "Food, summer, sport.",
  },
  {
    slug: "lemon-laser",
    family: "Neon",
    kept: true,
    name: "Lemon Laser",
    story:
      "Fluoro lemon with a saturated electric blue: the classic high-vis pair, crisp and optimistic, with white type reversed out of the blue.",
    paper: "bright",
    inks: [
      {
        name: "Fluoro Lemon",
        hex: "#fff200",
        ref: "≈ Pantone 803 C, cool",
        role: "Banners, highlights, stickers",
      },
      {
        name: "Electric Blue",
        hex: "#2d5bff",
        ref: "≈ Pantone 2728 C",
        role: "Cards, reversed type, stamps",
      },
    ],
    best: "Tech, science and discovery pages; the front page on a Monday.",
  },

  {
    slug: "tangerine-dream",
    family: "Neon",
    kept: true,
    name: "Tangerine Dream",
    story:
      "Blazing tangerine against ultraviolet: sunset over a synth record sleeve. Hot and cool at the far ends of the wheel.",
    paper: "newsprint",
    inks: [
      {
        name: "Blaze Tangerine",
        hex: "#ff8a00",
        ref: "≈ Pantone 804 C",
        role: "Banners, highlights, stickers",
      },
      {
        name: "Ultraviolet",
        hex: "#7b3cff",
        ref: "≈ Pantone 2587 C",
        role: "Cards, stamps, reversed type",
      },
    ],
    best: "Screen & Sound, music, evening editions.",
  },
  {
    slug: "laser-tag",
    family: "Neon",
    kept: true,
    name: "Laser Tag",
    story:
      "Fluoro red against electric green: the stop–go pair at full blast. Arcade-bright and very sporty.",
    paper: "newsprint",
    inks: [
      {
        name: "Electric Green",
        hex: "#00ff8c",
        ref: "≈ Pantone 802 C, cool",
        role: "Banners, HUD bands",
      },
      {
        name: "Fluoro Red",
        hex: "#ff2a1f",
        ref: "≈ Pantone 805 C, hot",
        role: "Cards, stamps, stickers",
      },
    ],
    best: "Sport, gaming, results pages.",
  },
  {
    slug: "fluoro-cmy",
    family: "Neon",
    kept: true,
    name: "Fluoro CMY",
    story:
      "A printer's joke: process colours swapped for fluorescents — fluoro cyan, magenta and yellow. Three inks, like the Original, but tighter and cleaner.",
    paper: "bright",
    inks: [
      {
        name: "Fluoro Yellow",
        hex: "#fff200",
        ref: "≈ Pantone 803 C",
        role: "Front banner, highlights",
      },
      {
        name: "Fluoro Magenta",
        hex: "#ff1fce",
        ref: "≈ Pantone 807 C",
        role: "Headline cards, stamps",
      },
      {
        name: "Fluoro Cyan",
        hex: "#00d9ff",
        ref: "≈ Pantone 801 C",
        role: "Section blocks, gaming, listings",
      },
    ],
    best: "Every section in its own ink; the most 'printed' of the new set.",
  },

  {
    slug: "sunburst-uv",
    family: "Neon",
    kept: true,
    name: "Sunburst UV",
    story:
      "Sun yellow with a deep ultraviolet — true complementaries. Warmer and bolder than Acid Garden, with white type reversed out of the violet.",
    paper: "newsprint",
    inks: [
      {
        name: "Sun Yellow",
        hex: "#ffe600",
        ref: "≈ Pantone 803 C, warm",
        role: "Banners, highlights, stickers",
      },
      {
        name: "Deep UV",
        hex: "#5a2bff",
        ref: "≈ Pantone 2593 C, fluoro-bright",
        role: "Cards, reversed type, stamps",
      },
    ],
    best: "Screen & Sound, weekend fronts, anything celebratory.",
  },
  {
    slug: "rave-grape",
    family: "Neon",
    kept: true,
    name: "Rave Grape",
    story:
      "Electric cyan and ultraviolet, cool on cool — a glow-stick at a warehouse party. Moody for a neon, still luminous.",
    paper: "bright",
    inks: [
      {
        name: "Electric Cyan",
        hex: "#00e8ff",
        ref: "≈ Pantone 801 C",
        role: "Banners, HUD, highlights",
      },
      {
        name: "Ultraviolet",
        hex: "#8a3cff",
        ref: "≈ Pantone 2587 C",
        role: "Cards, reversed type, stamps",
      },
    ],
    best: "Music, night editions, internet culture.",
  },

  // ——— Multi-ink: every section gets its own pair from one family ———
  {
    slug: "candy-shop",
    family: "Neon",
    kept: true,
    name: "Candy Shop",
    story:
      "Five fluoro sweets from the pick-and-mix: lemon, lime, bubblegum, tangerine and grape. Every section gets its own pair, all from one jar.",
    paper: "newsprint",
    inks: [
      {
        name: "Lemon",
        hex: "#fff200",
        ref: "≈ Pantone 803 C",
        role: "Front banner, back-page partner",
      },
      { name: "Lime", hex: "#b6ff2e", ref: "≈ Pantone 802 C", role: "Gaming HUD" },
      {
        name: "Bubblegum",
        hex: "#ff4fb8",
        ref: "≈ Pantone 806 C",
        role: "Front cards, Screen & Sound",
      },
      { name: "Tangerine", hex: "#ff8a00", ref: "≈ Pantone 804 C", role: "Back page" },
      {
        name: "Grape",
        hex: "#8a3cff",
        ref: "≈ Pantone 2587 C",
        role: "Gaming partner, reversed type",
      },
    ],
    best: "The everyday paper, with more flavours than the Original.",
  },
  {
    slug: "night-market",
    family: "Neon",
    kept: true,
    name: "Night Market",
    story:
      "Lime, cyan, magenta and ultraviolet: neon signs over a street-food market after dark. Cooler and more electric than Candy Shop.",
    paper: "bright",
    inks: [
      {
        name: "Laser Lime",
        hex: "#c8ff1e",
        ref: "≈ Pantone 802 C",
        role: "Front banner, back page",
      },
      {
        name: "Electric Cyan",
        hex: "#00e1ff",
        ref: "≈ Pantone 801 C",
        role: "Gaming HUD, back page",
      },
      {
        name: "Fluoro Magenta",
        hex: "#ff1fce",
        ref: "≈ Pantone 807 C",
        role: "Front cards, Screen & Sound",
      },
      {
        name: "Ultraviolet",
        hex: "#5a2bff",
        ref: "≈ Pantone 2593 C",
        role: "Gaming partner, reversed type",
      },
    ],
    best: "Screen & Sound, gaming, night editions.",
  },
  {
    slug: "tropical-rave",
    family: "Neon",
    kept: true,
    name: "Tropical Rave",
    story:
      "Mango, teal, flamingo, coral red and a bright lagoon blue: a beach party with the volume up.",
    paper: "newsprint",
    inks: [
      {
        name: "Mango",
        hex: "#ffb000",
        ref: "≈ Pantone 1235 C, fluoro-boosted",
        role: "Front banner, back-page partner",
      },
      { name: "Neon Teal", hex: "#00e59b", ref: "≈ Pantone 7479 C", role: "Gaming HUD" },
      {
        name: "Flamingo",
        hex: "#ff4f9a",
        ref: "≈ Pantone 806 C",
        role: "Front cards, Screen & Sound",
      },
      { name: "Coral Red", hex: "#ff3d3d", ref: "≈ Pantone 805 C", role: "Back page" },
      { name: "Lagoon", hex: "#00b3ff", ref: "≈ Pantone 801 C, deep", role: "Gaming partner" },
      {
        name: "Deep Blue",
        hex: "#2448ff",
        ref: "≈ Pantone 2728 C",
        role: "Reversed type, listings",
      },
    ],
    best: "Summer, food, weekend editions.",
  },
  {
    slug: "miami",
    family: "Neon",
    kept: true,
    name: "Miami",
    story:
      "Aqua, hot pink, sunset orange and violet: an art-deco hotel sign at dusk. Warm and cool in balance.",
    paper: "newsprint",
    inks: [
      {
        name: "Sunset Orange",
        hex: "#ff7a1a",
        ref: "≈ Pantone 804 C",
        role: "Front banner, back page",
      },
      { name: "Aqua", hex: "#00d8c8", ref: "≈ Pantone 3252 C", role: "Gaming HUD" },
      {
        name: "Hot Pink",
        hex: "#ff2e8a",
        ref: "≈ Pantone 806 C, deep",
        role: "Front cards, Screen & Sound",
      },
      { name: "Violet", hex: "#b14bff", ref: "≈ Pantone 2592 C", role: "Gaming partner" },
      { name: "Deep Violet", hex: "#6a2cff", ref: "≈ Pantone 2593 C", role: "Reversed type" },
    ],
    best: "Weekend fronts, travel, music.",
  },
  {
    slug: "highlighter-pack",
    family: "Neon",
    kept: true,
    name: "Highlighter Pack",
    story:
      "The six-pen highlighter wallet from every pencil case: yellow, green, pink, orange, sky blue and purple. The most nostalgic, and the most colourful.",
    paper: "bright",
    inks: [
      { name: "Highlighter Yellow", hex: "#fff200", ref: "≈ Pantone 803 C", role: "Front banner" },
      { name: "Highlighter Green", hex: "#5cff5c", ref: "≈ Pantone 802 C", role: "Gaming HUD" },
      {
        name: "Highlighter Pink",
        hex: "#ff5ec4",
        ref: "≈ Pantone 806 C",
        role: "Front cards, Screen & Sound",
      },
      { name: "Highlighter Orange", hex: "#ff9a1f", ref: "≈ Pantone 804 C", role: "Back page" },
      { name: "Highlighter Blue", hex: "#3db8ff", ref: "≈ Pantone 801 C", role: "Gaming partner" },
      { name: "Purple Pen", hex: "#6b3cff", ref: "≈ Pantone 2593 C", role: "Reversed type" },
    ],
    best: "Puzzles, the back page, anything that should feel like school holidays.",
  },
  {
    slug: "festival",
    family: "Neon",
    kept: true,
    name: "Festival",
    story:
      "A mix of your favourites: tangerine, laser green, hot coral, ice cyan and ultraviolet. Like wristbands from five different stages.",
    paper: "newsprint",
    inks: [
      {
        name: "Blaze Tangerine",
        hex: "#ff8a00",
        ref: "≈ Pantone 804 C",
        role: "Front banner, back-page partner",
      },
      { name: "Laser Green", hex: "#00ff8c", ref: "≈ Pantone 802 C", role: "Gaming HUD" },
      {
        name: "Hot Coral",
        hex: "#ff2e5b",
        ref: "≈ Pantone 805 C",
        role: "Front cards, Screen & Sound",
      },
      { name: "Ice Cyan", hex: "#00e1ff", ref: "≈ Pantone 801 C", role: "Back page" },
      {
        name: "Ultraviolet",
        hex: "#7b3cff",
        ref: "≈ Pantone 2587 C",
        role: "Gaming partner, reversed type",
      },
    ],
    best: "The front page on a big day; every section a different stage.",
  },
];

/** Colour where two inks overprint: multiply, as on press. */
export const overprint = (a: string, b: string) => {
  const ch = (h: string, i: number) => parseInt(h.slice(1 + i * 2, 3 + i * 2), 16);
  return `#${[0, 1, 2]
    .map((i) =>
      Math.round((ch(a, i) * ch(b, i)) / 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
};
