import type { Paper } from "../types";
import { Back } from "./back";
import { Frame } from "./frame";
import { Front } from "./front";
import { Guest } from "./guest";
import { Section } from "./section";
import { Story } from "./story";

// The Fluoro Broadsheet (mockup v1): the weekday paper. A 380 × 578 mm sheet of newsprint, fluoro
// inks, a condensed gothic for heads and an old-style serif to read.
export const paper: Paper = {
  design: "broadsheet",
  Frame,
  Front,
  Section,
  Guest,
  Back,
  Story,
};
