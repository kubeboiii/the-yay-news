// The four printed looks a clipping can come from, each with its own faces and inks. Colours are
// resolved from the same colourway files the mockups use: ?theme= for the broadsheet (v1),
// ?pastel= for the Tabloid, Mini Zine and Midi Magazine (house inks when it is left off).

import type { EditionDesign } from "@repo/shared";
import { type Pastel, pastels } from "@/features/print/colourways/pastels";
import { themes } from "@/features/print/colourways/themes";
import type { FontSpec } from "./fonts";

export const LOOKS = ["v1", "v3", "v4", "v5"] as const;
export type LookId = (typeof LOOKS)[number];

export const LOOK_NAMES: Record<LookId, string> = {
  v1: "Fluoro Broadsheet",
  v3: "Tabloid",
  v4: "Mini Zine",
  v5: "Midi Magazine",
};

export type Look = {
  id: LookId;
  fonts: FontSpec[];
  /** Families by role. */
  head: string;
  text: string;
  sans: string;
  mono: string;
  /** Which newsprint the piece is torn from; `tint` lays a pastel stock colour under the grain. */
  stock: "newsprint" | "white";
  tint?: string;
  /** The black plate: every word prints in it. */
  ink: string;
  /** Spot inks: a is loud, b is its partner; the deep tones are for type and rules. */
  a: string;
  aDeep: string;
  b: string;
  bDeep: string;
  /** The plain surface the clipping has been laid on. */
  desk: string;
};

const FONTS: Record<LookId, FontSpec[]> = {
  v1: [
    { family: "League Gothic", axes: "" },
    { family: "Libre Caslon Text", axes: "ital,wght@0,400;0,700;1,400" },
    { family: "Libre Franklin", axes: "wght@500;700;800" },
  ],
  v3: [
    { family: "Libre Franklin", axes: "ital,wght@0,500;0,700;0,900;1,800" },
    { family: "Tinos", axes: "ital,wght@0,400;0,700;1,400" },
    { family: "Courier Prime", axes: "wght@400;700" },
  ],
  v4: [
    { family: "Alfa Slab One", axes: "" },
    { family: "PT Serif", axes: "ital,wght@0,400;0,700;1,400" },
    { family: "Courier Prime", axes: "wght@400;700" },
  ],
  v5: [
    { family: "Bodoni Moda", axes: "ital,wght@0,500;0,800;1,500" },
    { family: "Crimson Pro", axes: "ital,wght@0,400;0,600;1,400" },
    { family: "IBM Plex Sans Condensed", axes: "wght@500;600" },
  ],
};

const ground = (p: Pastel, g: keyof Pastel["grounds"]) => p.inks[p.grounds[g]] ?? p.inks[0]!;

/** The look for a version, in a colourway. Unknown slugs fall back to the house inks. */
export function lookFor(id: LookId, theme?: string | null, pastel?: string | null): Look {
  const pz = pastels.find((p) => p.slug === pastel);
  switch (id) {
    case "v1": {
      const t = themes.find((x) => x.slug === theme) ?? themes[0]!;
      const [a, b] = [t.inks[0]?.hex ?? "#e9ff1f", t.inks[1]?.hex ?? "#ff3d9a"];
      // The desk takes the colourway's darkest ink, so the neon paper piece sings against it.
      const lum = (h: string) =>
        [1, 3, 5].reduce(
          (s, i, k) => s + parseInt(h.slice(i, i + 2), 16) * [0.3, 0.59, 0.11][k]!,
          0,
        );
      const desk = [...t.inks].sort((x, y) => lum(x.hex) - lum(y.hex))[0]?.hex ?? "#2f5bff";
      return {
        id,
        fonts: FONTS.v1,
        head: "League Gothic",
        text: "Libre Caslon Text",
        sans: "Libre Franklin",
        mono: "Libre Franklin",
        stock: t.paper === "bright" ? "white" : "newsprint",
        ink: "#161616",
        a,
        aDeep: t.deep?.[0] ?? "#161616",
        b,
        bDeep: t.deep?.[1] ?? "#161616",
        desk,
      };
    }
    case "v3": {
      const a = pz?.inks[0] ?? { soft: "#ff5a1f", deep: "#ff5a1f" };
      const b = pz?.inks[1] ?? { soft: "#0078bf", deep: "#0078bf" };
      return {
        id,
        fonts: FONTS.v3,
        head: "Libre Franklin",
        text: "Tinos",
        sans: "Libre Franklin",
        mono: "Courier Prime",
        stock: "newsprint",
        ink: pz?.ink ?? "#151515",
        a: a.soft,
        aDeep: a.deep,
        b: b.soft,
        bDeep: b.deep,
        desk: pz ? b.deep : "#0078bf",
      };
    }
    case "v4": {
      const paper = pz ? ground(pz, "pink") : { soft: "#ffd3e3", deep: "#f19bbd" };
      const b = pz ? ground(pz, "butter") : { soft: "#fff3a0", deep: "#f7d348" };
      const desk = pz ? ground(pz, "blue") : { soft: "#bdeafc", deep: "#72bfe0" };
      return {
        id,
        fonts: FONTS.v4,
        head: "Alfa Slab One",
        text: "PT Serif",
        sans: "Courier Prime",
        mono: "Courier Prime",
        stock: "white",
        tint: paper.soft,
        ink: pz?.ink ?? "#141414",
        a: paper.soft,
        aDeep: paper.deep,
        b: b.soft,
        bDeep: b.deep,
        desk: desk.deep,
      };
    }
    case "v5": {
      const a = pz ? ground(pz, "peach") : { soft: "#ffc9a8", deep: "#f6a47c" };
      const b = pz ? ground(pz, "lilac") : { soft: "#d9ccff", deep: "#b4a2f2" };
      const desk = pz ? ground(pz, "mint") : { soft: "#cdf3df", deep: "#92d8b4" };
      return {
        id,
        fonts: FONTS.v5,
        head: "Bodoni Moda",
        text: "Crimson Pro",
        sans: "IBM Plex Sans Condensed",
        mono: "IBM Plex Sans Condensed",
        stock: "white",
        ink: pz?.ink ?? "#1b1712",
        a: a.soft,
        aDeep: a.deep,
        b: b.soft,
        bDeep: b.deep,
        desk: desk.soft,
      };
    }
  }
}

/** Which printed look each edition design's clippings (and archive copies) come from. */
export const LOOK_OF: Record<EditionDesign, LookId> = {
  broadsheet: "v1",
  tabloid: "v3",
  zine: "v4",
  midi: "v5",
};

/** The look for an edition: its design's, in its colourway (a neon theme or a pastel set). */
export const editionLook = (e: { design: EditionDesign; colourway: string }): Look =>
  e.design === "broadsheet"
    ? lookFor("v1", e.colourway, null)
    : lookFor(LOOK_OF[e.design], null, e.colourway);
