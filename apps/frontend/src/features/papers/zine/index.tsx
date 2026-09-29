import type { Paper } from "../types";
import { Back } from "./back";
import { Frame } from "./frame";
import { Front } from "./front";
import { Guest } from "./guest";
import { Section } from "./section";
import { Story } from "./story";

/*
 * The Mini Zine (weekend design): 170 × 250 mm mini pages. Every route prints one two-page spread,
 * each spread on its own pair of pastel grounds — the front route is the cover and page 2, each
 * inside section is a spread, the back route is the puzzles and the sign-off, and a story's own
 * page is a spread of its own. Below 900px the spread splits into its two pages; below 760px the
 * pages reflow into a single readable column.
 */
export const paper: Paper = {
  design: "zine",
  Frame,
  Front,
  Section,
  Guest,
  Back,
  Story,
};
