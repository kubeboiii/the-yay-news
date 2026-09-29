import type { EditionDesign } from "@repo/shared";
import { paper as broadsheet } from "./broadsheet";
import { paper as midi } from "./midi";
import { paper as tabloid } from "./tabloid";
import { paper as zine } from "./zine";
import type { Paper } from "./types";

// Weekday editions print as the broadsheet; weekend editions as the tabloid, zine or midi. Each
// design lives in its own folder here and exports a `Paper`.
export const papers: Record<EditionDesign, Paper> = {
  broadsheet,
  tabloid,
  zine,
  midi,
};
