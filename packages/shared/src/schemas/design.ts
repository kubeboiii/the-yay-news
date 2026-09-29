import { z } from "zod";

// Each edition prints in one of four designs (the Phase 1 mockups v1, v3, v4 and v5) and one of
// that design's colourways. Weekdays always print as a broadsheet; weekends rotate between the
// other three. The lists mirror apps/frontend/src/features/print/colourways/{themes,pastels}.ts.

export const editionDesignSchema = z.enum(["broadsheet", "tabloid", "zine", "midi"]);
export type EditionDesign = z.infer<typeof editionDesignSchema>;

/** Broadsheet colourways (neon and pastel inks), from colourways/themes.ts. */
export const BROADSHEET_COLOURWAYS = [
  "original",
  "acid-garden",
  "pool-party",
  "blacklight",
  "tropic-punch",
  "lemon-laser",
  "tangerine-dream",
  "laser-tag",
  "fluoro-cmy",
  "sunburst-uv",
  "rave-grape",
  "candy-shop",
  "night-market",
  "tropical-rave",
  "miami",
  "highlighter-pack",
  "festival",
] as const;

/** Tabloid, zine and midi print in their house inks or one of the pastel sets in colourways/pastels.ts. */
export const PASTEL_COLOURWAYS = ["house", "gelato-counter", "paint-box", "carousel"] as const;

export const COLOURWAYS: Record<EditionDesign, readonly string[]> = {
  broadsheet: BROADSHEET_COLOURWAYS,
  tabloid: PASTEL_COLOURWAYS,
  zine: PASTEL_COLOURWAYS,
  midi: PASTEL_COLOURWAYS,
};

export const WEEKDAY_DESIGNS: readonly EditionDesign[] = ["broadsheet"];
export const WEEKEND_DESIGNS: readonly EditionDesign[] = ["tabloid", "zine", "midi"];

/** Saturday or Sunday. `date` is a calendar date (`YYYY-MM-DD`), so its weekday is taken in UTC. */
export const isWeekend = (date: string) => {
  const day = new Date(`${date}T00:00:00Z`).getUTCDay();
  return day === 0 || day === 6;
};

/** Problems with an edition's design choice, or an empty list when it is valid. */
export function editionDesignProblems({
  date,
  design,
  colourway,
}: {
  date: string;
  design: EditionDesign;
  colourway: string;
}): string[] {
  const problems: string[] = [];
  if (!COLOURWAYS[design].includes(colourway)) {
    problems.push(`colourway "${colourway}" is not one of the ${design} colourways`);
  }
  const allowed = isWeekend(date) ? WEEKEND_DESIGNS : WEEKDAY_DESIGNS;
  if (!allowed.includes(design)) {
    problems.push(
      `${isWeekend(date) ? "weekend" : "weekday"} edition ${date} must print as ${allowed.join(" | ")}, not ${design}`,
    );
  }
  return problems;
}
