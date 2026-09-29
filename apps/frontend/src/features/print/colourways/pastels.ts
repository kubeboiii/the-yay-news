// Pastel colourways for the pastel versions: Tabloid (v3), Mini Zine (v4) and Midi Magazine (v5).
//
// Each colourway is a set of soft inks, every one paired with a deeper tone of itself (pastels are
// too light for small type, rules and extrusions), plus the colour of the "black" ink, which some
// sets swap for a brown or a plum. The versions don't share a layout, so each colourway is spread
// over six named grounds that every version maps onto its own tokens:
//
//   mint · pink · lilac · blue · butter · peach
//
// Every set has six inks, so each ground gets its own.
// The tabloid prints just two plates: `a` (inks[0]) and `b` (inks[1]).

export type PastelInk = { name: string; soft: string; deep: string };

export const GROUNDS = ["mint", "pink", "lilac", "blue", "butter", "peach"] as const;
export type Ground = (typeof GROUNDS)[number];

export type Pastel = {
  slug: string;
  name: string;
  story: string;
  /** The colour every word prints in. */
  ink: string;
  inks: PastelInk[];
  /** Which ink (index into `inks`) fills each ground. */
  grounds: Record<Ground, number>;
  best: string;
};

export const pastels: Pastel[] = [
  {
    slug: "gelato-counter",
    name: "Gelato Counter",
    story:
      "Six tubs behind the glass at an Italian gelateria: fragola, pistacchio, limone, mirtillo, pesca and stracciatella, all printed in espresso brown. Creamy rather than sugary.",
    ink: "#2a1d17",
    inks: [
      { name: "Fragola", soft: "#ffc6cc", deep: "#ec7d8a" },
      { name: "Pistacchio", soft: "#d6ecc0", deep: "#8fbf63" },
      { name: "Limone", soft: "#fff4b5", deep: "#e8cd46" },
      { name: "Mirtillo", soft: "#d7cff2", deep: "#9582d8" },
      { name: "Pesca", soft: "#ffd9bf", deep: "#f39c68" },
      { name: "Stracciatella", soft: "#f2eadb", deep: "#bfa47c" },
    ],
    grounds: { mint: 1, pink: 0, lilac: 3, blue: 5, butter: 2, peach: 4 },
    best: "Food, summer and weekend editions; warm on newsprint.",
  },
  {
    slug: "paint-box",
    name: "Paint Box",
    story:
      "A child's watercolour tin: cobalt, rose madder, sap green, yellow ochre, cadmium orange and violet, washed thin. Earthier than the candy sets, with an indigo-black ink.",
    ink: "#1c1c2a",
    inks: [
      { name: "Cobalt Wash", soft: "#c8d8f5", deep: "#6f93dc" },
      { name: "Rose Madder", soft: "#f7c8d4", deep: "#dc7f98" },
      { name: "Sap Green", soft: "#d0e8c4", deep: "#7fb468" },
      { name: "Yellow Ochre", soft: "#f6e3b0", deep: "#d8b153" },
      { name: "Cadmium Orange", soft: "#ffd2b6", deep: "#f08f58" },
      { name: "Violet", soft: "#dccdf0", deep: "#9c80d4" },
    ],
    grounds: { mint: 0, pink: 4, lilac: 5, blue: 2, butter: 3, peach: 1 },
    best: "Arts, kids, the colouring insert, the guest section.",
  },
  {
    slug: "carousel",
    name: "Carousel",
    story:
      "The painted horses on a seaside merry-go-round: pony pink, saddle blue, mane lilac, mint barley-twist poles and candy-apple red, all trimmed in brass. The one pastel set with a gold.",
    ink: "#231a2a",
    inks: [
      { name: "Pony Pink", soft: "#ffcfdd", deep: "#ee86a6" },
      { name: "Brass", soft: "#f6e4a6", deep: "#c9a232" },
      { name: "Saddle Blue", soft: "#c7e0f5", deep: "#6ea8dc" },
      { name: "Mane Lilac", soft: "#e0d2f6", deep: "#a68ae2" },
      { name: "Mint Pole", soft: "#c9efdc", deep: "#6cc49b" },
      { name: "Candy Apple", soft: "#ffc9bc", deep: "#ec7a64" },
    ],
    grounds: { mint: 2, pink: 0, lilac: 3, blue: 4, butter: 1, peach: 5 },
    best: "Front pages, celebrations, the Friday edition.",
  },
];

/** CSS custom properties for one colourway, in the shared --pz-* vocabulary the versions read. */
export function pastelVars(p: Pastel): Record<string, string> {
  const at = (i: number) => p.inks[i] ?? p.inks[0]!;
  const vars: Record<string, string> = {
    "--pz-ink": p.ink,
    "--pz-a": at(0).soft,
    "--pz-a-deep": at(0).deep,
    "--pz-b": at(1).soft,
    "--pz-b-deep": at(1).deep,
  };
  for (const g of GROUNDS) {
    vars[`--pz-${g}`] = at(p.grounds[g]).soft;
    vars[`--pz-${g}-deep`] = at(p.grounds[g]).deep;
  }
  return vars;
}
