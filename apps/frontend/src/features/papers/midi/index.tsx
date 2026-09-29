import type { Paper } from "../types";
import { Back } from "./back";
import { Frame } from "./frame";
import { Front } from "./front";
import { Guest, Section } from "./section";
import { Story } from "./story";

/**
 * Midi Magazine (the v5 mockup): 220 × 310 mm magazine-format sheets. Every route of an edition
 * prints as one two-page spread — the front is the cover and page 2; each inside page is its
 * section's opener beside its stories; the back page is the puzzles beside the back page — so the
 * spread's page numbers run 1–2, then 4–5, 6–7 and on. A story's own page is a single sheet.
 * Below 760px of width the sheets stack and reflow into one readable column.
 */
export const paper: Paper = {
  design: "midi",
  Frame,
  Front,
  Section,
  Guest,
  Back,
  Story,
};
