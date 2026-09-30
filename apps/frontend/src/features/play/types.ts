import type { Puzzle, SolvedPuzzle } from "@repo/shared";
import type { CSSProperties } from "react";

type DataOf<T extends Puzzle["type"]> = Extract<Puzzle, { type: T }>["data"];
type SolutionOf<T extends SolvedPuzzle["type"]> = Extract<SolvedPuzzle, { type: T }>["solution"];

export type CrosswordData = DataOf<"crossword">;
export type CrosswordSolution = SolutionOf<"crossword">;
export type WordLadderData = DataOf<"word_ladder">;
export type WordLadderSolution = SolutionOf<"word_ladder">;
export type RiddleData = DataOf<"riddle">;
export type RiddleSolution = SolutionOf<"riddle">;
export type WordSearchData = DataOf<"word_search">;
export type WordSearchSolution = SolutionOf<"word_search">;
export type FortuneTellerData = DataOf<"fortune_teller">;

/**
 * The inks a newspaper design can recolour the reader's marks with. Anything left out falls back
 * to the defaults in play.css (graphite pencil, fluoro-yellow marker, red-pencil ticks on newsprint).
 */
export type PlayInks = {
  /** The reader's pencil (letters, notes, crossings-out). */
  ink?: string;
  /** The marker used to circle words in the word search. */
  highlight?: string;
  /** The paper the puzzle is printed on (strips, the folded corner, the fortune teller). */
  paper?: string;
  /** Ticks and stars when something is solved. */
  mark?: string;
  /** The printed ink: grid lines, clue numbers, the words in the list. */
  print?: string;
};

/** Props every puzzle takes besides its data, so each paper design can place and recolour it. */
export type PlayStyleProps = {
  inks?: PlayInks;
  className?: string;
  style?: CSSProperties;
  /** Heading level for the puzzle's title (default 3), to fit the page's outline. */
  headingLevel?: 2 | 3 | 4;
  /** Hide the printed title when the page prints its own. */
  hideTitle?: boolean;
};
