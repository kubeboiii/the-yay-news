import type { SolvedPuzzle } from "@repo/shared";
import { crosswordFor } from "./crossword.ts";
import { fortuneTeller } from "./fortune-teller.ts";
import { riddle } from "./riddle.ts";
import { headlineWords, wordSearch } from "./word-search.ts";
import { wordLadder } from "./word-ladder.ts";

export {
  cluesFor,
  crosswordFor,
  CROSSWORD_ANSWERS,
  isSunday,
  miniCrossword,
  slotsOf,
  SUNDAY_TEMPLATES,
  sundayCrossword,
  TEMPLATES,
} from "./crossword.ts";
export { fortuneTeller, FORTUNE_CYCLE_DAYS } from "./fortune-teller.ts";
export { dayNumber, isWeekend } from "./random.ts";
export { riddle, RIDDLE_CYCLE_DAYS } from "./riddle.ts";
export { findAll, headlineWords, suitableWords, wordSearch } from "./word-search.ts";
export {
  distancesFrom,
  isLadderWord,
  isValidLadder,
  shortestLadder,
  wordLadder,
} from "./word-ladder.ts";
export type * from "./types.ts";

/**
 * The day's back page, in order: crossword (the 5×5 mini, or the 9×9 on Sundays), word ladder, riddle, word search and fortune
 * teller, each with its solution (serve the solutions only in the following edition). Pass the
 * edition's headlines to hide the day's own words in the word search.
 */
export function puzzlesFor(
  date: string,
  { headlines }: { headlines?: readonly string[] } = {},
): SolvedPuzzle[] {
  return [
    crosswordFor(date),
    wordLadder(date),
    riddle(date),
    wordSearch(date, headlines && headlineWords(headlines)),
    fortuneTeller(date),
  ].map((p, order) => ({ ...p, order }) as SolvedPuzzle);
}
