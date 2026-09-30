/** A crossword answer (upper-case A–Z) followed by one or more clues for it. */
export type Clued = readonly [answer: string, clue: string, ...more: string[]];

/** A word search theme: what links the words, and the words (upper-case A–Z, 3–10 letters). */
export type Theme = { readonly theme: string; readonly words: readonly string[] };

/** A riddle and its answer, e.g. ["What has hands but can't clap?", "A clock"]. */
export type Riddle = readonly [question: string, answer: string];
