import type { SeedPuzzle } from "./types.ts";

type Entry = [answer: string, clue: string];

/**
 * A 5×5 mini crossword in the house shape: three across answers on rows 1, 3 and 5, and two down
 * answers in the outer columns. Throws if the answers don't cross.
 *
 *   1 . . . 2
 *   . # # # .
 *   3 . . . .
 *   . # # # .
 *   4 . . . .
 */
export function mini(
  across: [Entry, Entry, Entry],
  down: [Entry, Entry],
  title = "The Mini",
): SeedPuzzle {
  const [[a1], [a3], [a4]] = across;
  const [[d1], [d2]] = down;
  const grid = [a1, `${d1[1]}###${d2[1]}`, a3, `${d1[3]}###${d2[3]}`, a4];
  const column = (c: number) => grid.map((row) => row[c]).join("");
  if ([a1, a3, a4, d1, d2].some((w) => w.length !== 5) || column(0) !== d1 || column(4) !== d2) {
    throw new Error(`Mini crossword answers don't cross: ${[a1, a3, a4, d1, d2].join(", ")}`);
  }
  const clue = (n: number, [answer, text]: Entry) => ({ n, clue: text, length: answer.length });
  const [acrossClues, downClues] = [
    across.map((e, i) => clue([1, 3, 4][i] as number, e)),
    down.map((e, i) => clue(i + 1, e)),
  ];
  return {
    type: "crossword",
    data: {
      title,
      rows: grid.map((row) => row.replace(/[A-Z]/g, ".")),
      numbers: [
        { row: 0, col: 0, n: 1 },
        { row: 0, col: 4, n: 2 },
        { row: 2, col: 0, n: 3 },
        { row: 4, col: 0, n: 4 },
      ],
      across: acrossClues,
      down: downClues,
    },
    solution: {
      grid,
      across: acrossClues.map(({ n }, i) => ({ n, answer: (across[i] as Entry)[0] })),
      down: downClues.map(({ n }, i) => ({ n, answer: (down[i] as Entry)[0] })),
    },
  };
}

/** Change one letter at a time from the first word to the last. Throws on an illegal step. */
export function ladder(ladderWords: string[], title = "Word Ladder"): SeedPuzzle {
  const start = ladderWords[0] as string;
  const end = ladderWords.at(-1) as string;
  ladderWords.slice(1).forEach((word, i) => {
    const prev = ladderWords[i] as string;
    const changed = [...word].filter((ch, j) => ch !== prev[j]).length;
    if (word.length !== prev.length || changed !== 1) {
      throw new Error(`Illegal ladder step ${prev} → ${word}`);
    }
  });
  return {
    type: "word_ladder",
    data: {
      title,
      instructions: `Change one letter at a time to climb from ${start} to ${end}.`,
      start,
      end,
      steps: ladderWords.length - 2,
    },
    solution: { ladder: ladderWords },
  };
}

export const riddle = (question: string, answer: string, title = "The Riddle"): SeedPuzzle => ({
  type: "riddle",
  data: { title, question },
  solution: { answer },
});
