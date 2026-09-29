import type { Paper } from "../types";
import { Back } from "./back";
import { Frame } from "./frame";
import { Front } from "./front";
import { Guest } from "./guest";
import { Section } from "./section";
import { Story } from "./story";

// Tabloid Brights (mockup v3): a 289 × 380 mm weekend tabloid on bright white stock, printed in
// two spot inks — orange and blue in the house colourway, or a pastel pair.
export const paper: Paper = { design: "tabloid", Frame, Front, Section, Guest, Back, Story };
