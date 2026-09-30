import type { PuzzleType, SolvedPuzzle } from "@repo/shared";

/** A generated puzzle with its solution, in the shared contract's shape (before it gets an order). */
export type Generated<T extends PuzzleType> = Omit<Extract<SolvedPuzzle, { type: T }>, "order">;

export type CrosswordPuzzle = Generated<"crossword">;
export type WordLadderPuzzle = Generated<"word_ladder">;
export type RiddlePuzzle = Generated<"riddle">;
export type WordSearchPuzzle = Generated<"word_search">;
export type FortuneTellerPuzzle = Generated<"fortune_teller">;
