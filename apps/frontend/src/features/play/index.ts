// The playable back page: each puzzle is a client component taking `{ issue, data, solution? }`
// plus the style props in ./types (inks, className, style, headingLevel, hideTitle).

export { Crossword, CrosswordAnswers, type CrosswordProps } from "./crossword";
export { FortuneTeller, type FortuneTellerProps } from "./fortune-teller";
export { Riddle, type RiddleProps, type YesterdaysRiddle } from "./riddle";
export { WordLadder, type WordLadderProps } from "./word-ladder";
export { WordSearch, type WordSearchProps } from "./word-search";
export { Pencil, PencilLetter } from "./pencil";
export { Arrow, CrossOut, Loop, Star, Tick, Underline } from "./rough";
export { paperStyle } from "./paper-style";
export type * from "./types";
