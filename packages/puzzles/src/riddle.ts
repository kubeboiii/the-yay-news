import { RIDDLES } from "./content/riddles.ts";
import { dayNumber, rotation } from "./random.ts";
import type { RiddlePuzzle } from "./types.ts";

const riddles = rotation(RIDDLES, "riddle");

/** How many days pass before a riddle can come round again. */
export const RIDDLE_CYCLE_DAYS = riddles.size;

/** The day's riddle, from the bank; none repeats until every one has run. */
export function riddle(date: string): RiddlePuzzle {
  const [question, answer] = riddles.at(dayNumber(date));
  return { type: "riddle", data: { title: "The Riddle", question }, solution: { answer } };
}
