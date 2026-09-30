import { FIVE_LETTER_WORDS } from "./content/words-5.ts";
import { NINE_LETTER_WORDS } from "./content/words-9.ts";
import { FOUR_LETTER_WORDS, THREE_LETTER_WORDS } from "./content/words-short.ts";
import type { Clued } from "./content/types.ts";
import { dayNumber, rngFor, type Rng } from "./random.ts";
import type { CrosswordPuzzle } from "./types.ts";

/**
 * 5×5 mini crossword shapes, "#" black and "." white. All have half-turn symmetry and every answer
 * is at least three letters long; some squares are checked by only one answer, British style.
 */
export const TEMPLATES: readonly (readonly string[])[] = [
  // The house: three across, two down.
  [".....", ".###.", ".....", ".###.", "....."],
  // The same, turned on its side.
  [".....", ".#.#.", ".#.#.", ".#.#.", "....."],
  // The waffle: three across, three down.
  [".....", ".#.#.", ".....", ".#.#.", "....."],
  // Rungs: two across, three down.
  [".#.#.", ".....", ".#.#.", ".....", ".#.#."],
  // Rails: three across, two down.
  [".....", "#.#.#", ".....", "#.#.#", "....."],
  // The staircase, stepping down to the right…
  ["#....", ".#.#.", ".....", ".#.#.", "....#"],
  // …and to the left.
  ["....#", ".#.#.", ".....", ".#.#.", "#...."],
  // The diamond.
  ["#...#", ".#.#.", ".....", ".#.#.", "#...#"],
];

export type Direction = "across" | "down";

export type Slot = {
  n: number;
  direction: Direction;
  row: number;
  col: number;
  length: number;
  /** [row, col] of each square, in reading order. */
  cells: [number, number][];
};

const isWhite = (rows: readonly string[], r: number, c: number) => rows[r]?.[c] === ".";

/** Number a grid like a real crossword and list its answers (runs of two or more squares). */
export function slotsOf(rows: readonly string[]): {
  numbers: { row: number; col: number; n: number }[];
  slots: Slot[];
} {
  const numbers: { row: number; col: number; n: number }[] = [];
  const slots: Slot[] = [];
  let n = 0;
  rows.forEach((line, r) => {
    [...line].forEach((_, c) => {
      if (!isWhite(rows, r, c)) return;
      const starts = (["across", "down"] as const).filter((d) => {
        const [dr, dc] = d === "across" ? [0, 1] : [1, 0];
        return !isWhite(rows, r - dr, c - dc) && isWhite(rows, r + dr, c + dc);
      });
      if (!starts.length) return;
      n++;
      numbers.push({ row: r, col: c, n });
      for (const direction of starts) {
        const [dr, dc] = direction === "across" ? [0, 1] : [1, 0];
        const cells: [number, number][] = [];
        for (let i = 0; isWhite(rows, r + dr * i, c + dc * i); i++) {
          cells.push([r + dr * i, c + dc * i]);
        }
        slots.push({ n, direction, row: r, col: c, length: cells.length, cells });
      }
    });
  });
  return { numbers, slots };
}

const BY_LENGTH = new Map<number, readonly Clued[]>([
  [3, THREE_LETTER_WORDS],
  [4, FOUR_LETTER_WORDS],
  [5, FIVE_LETTER_WORDS],
  [9, NINE_LETTER_WORDS],
]);

/** Every crossword answer the paper can print, for the word search allowlist and tests. */
export const CROSSWORD_ANSWERS: ReadonlySet<string> = new Set(
  [...BY_LENGTH.values()].flatMap((list) => list.map(([answer]) => answer)),
);

const clueBank = new Map<string, readonly string[]>(
  [...BY_LENGTH.values()].flatMap((list) =>
    list.map(([answer, ...clues]) => [answer, clues] as const),
  ),
);

/** The clues on file for an answer (empty if it isn't one). */
export const cluesFor = (answer: string): readonly string[] => clueBank.get(answer) ?? [];

/** Backtracking fill, most constrained answer first, candidates in seeded order. */
function fill(rows: readonly string[], slots: Slot[], rng: Rng): Map<Slot, string> | null {
  const grid = rows.map((line) => [...line].map((ch) => (ch === "." ? "" : "#")));
  const candidates = new Map(
    slots.map((s) => [s, rng.shuffle((BY_LENGTH.get(s.length) ?? []).map(([w]) => w))]),
  );
  const chosen = new Map<Slot, string>();
  const used = new Set<string>();
  let budget = 50_000;

  const fits = (s: Slot, word: string) =>
    !used.has(word) &&
    s.cells.every(([r, c], i) => {
      const ch = grid[r]?.[c];
      return !ch || ch === word[i];
    });

  const solve = (): boolean => {
    if (budget-- <= 0) return false;
    let best: Slot | null = null;
    let bestOptions: string[] = [];
    for (const s of slots) {
      if (chosen.has(s)) continue;
      const options = (candidates.get(s) ?? []).filter((w) => fits(s, w));
      if (!best || options.length < bestOptions.length) [best, bestOptions] = [s, options];
      if (!options.length) return false;
    }
    if (!best) return true;
    for (const word of bestOptions) {
      const before = best.cells.map(([r, c]) => grid[r]?.[c] ?? "");
      best.cells.forEach(([r, c], i) => ((grid[r] as string[])[c] = word[i] as string));
      chosen.set(best, word);
      used.add(word);
      if (solve()) return true;
      used.delete(word);
      chosen.delete(best);
      best.cells.forEach(([r, c], i) => ((grid[r] as string[])[c] = before[i] as string));
    }
    return false;
  };

  return solve() ? chosen : null;
}

/** The puzzle and its solution, for a filled grid, with a clue picked for every answer. */
function publish(
  title: string,
  rows: readonly string[],
  { numbers, slots }: ReturnType<typeof slotsOf>,
  answers: Map<Slot, string>,
  rng: Rng,
): CrosswordPuzzle {
  const grid = rows.map((line) => [...line]);
  for (const [s, word] of answers) {
    s.cells.forEach(([r, c], i) => ((grid[r] as string[])[c] = word[i] as string));
  }
  const listed = (d: Direction) =>
    slots
      .filter((s) => s.direction === d)
      .map((s) => ({ s, answer: answers.get(s) as string }))
      .sort((a, b) => a.s.n - b.s.n);
  const clues = (d: Direction) =>
    listed(d).map(({ s, answer }) => ({
      n: s.n,
      clue: rng.pick(cluesFor(answer)),
      length: s.length,
    }));

  return {
    type: "crossword",
    data: {
      title,
      rows: [...rows],
      numbers,
      across: clues("across"),
      down: clues("down"),
    },
    solution: {
      grid: grid.map((line) => line.join("")),
      across: listed("across").map(({ s, answer }) => ({ n: s.n, answer })),
      down: listed("down").map(({ s, answer }) => ({ n: s.n, answer })),
    },
  };
}

/** The day's 5×5 mini crossword, with a clue for every answer. */
export function miniCrossword(date: string): CrosswordPuzzle {
  const rng = rngFor(date, "crossword");
  for (const rows of rng.shuffle(TEMPLATES)) {
    const shape = slotsOf(rows);
    const answers = fill(rows, shape.slots, rng);
    if (answers) return publish("The Mini", rows, shape, answers, rng);
  }
  throw new Error(`Could not fill a mini crossword for ${date}`);
}

// ——— The Sunday crossword (9×9) ———

/**
 * How an edge-to-edge line of nine squares (an even row or column) is broken into answers: whole,
 * or split by a black square into three and five, or five and three.
 */
const LINES = [".........", "...#.....", ".....#..."] as const;
const reverse = (line: string) => [...line].reverse().join("");

/** Whether every white square can be reached from every other, so the grid is all one piece. */
function isConnected(rows: readonly string[]): boolean {
  const whites = rows.flatMap((line, r) =>
    [...line].flatMap((ch, c) => (ch === "." ? [[r, c] as const] : [])),
  );
  const first = whites[0];
  if (!first) return false;
  const seen = new Set([`${first[0]},${first[1]}`]);
  const queue = [first];
  for (let i = 0; i < queue.length; i++) {
    const [r, c] = queue[i] as readonly [number, number];
    for (const [nr, nc] of [
      [r + 1, c],
      [r - 1, c],
      [r, c + 1],
      [r, c - 1],
    ] as const) {
      if (isWhite(rows, nr, nc) && !seen.has(`${nr},${nc}`)) {
        seen.add(`${nr},${nc}`);
        queue.push([nr, nc]);
      }
    }
  }
  return seen.size === whites.length;
}

/**
 * Every 9×9 Sunday shape, in the British blocked style: answers run along the even rows and
 * columns, crossing at every other letter, and the squares between them are black. A shape picks
 * how rows 0 and 2 and columns 0 and 2 break (rows 6 and 8 and columns 6 and 8 mirror them, for
 * half-turn symmetry), and whether the middle row and column are whole or split in two by a black
 * centre square. Only shapes in one piece, with two to four nine-letter answers, are kept: long enough to feel
 * like Sunday, loose enough to fill every week.
 */
export const SUNDAY_TEMPLATES: readonly (readonly string[])[] = (() => {
  const shapes: string[][] = [];
  for (const r0 of LINES) {
    for (const r2 of LINES) {
      for (const c0 of LINES) {
        for (const c2 of LINES) {
          for (const middle of [".........", "....#...."]) {
            const across = [r0, r2, middle, reverse(r2), reverse(r0)];
            const down = [c0, c2, middle, reverse(c2), reverse(c0)];
            const rows = Array.from({ length: 9 }, (_, r) =>
              Array.from({ length: 9 }, (_, c) => {
                if (r % 2 === 0) return across[r / 2]?.[c] === "#" ? "#" : ".";
                if (c % 2 === 0) return down[c / 2]?.[r] === "#" ? "#" : ".";
                return "#";
              }).join(""),
            );
            const long = [...across, ...down].filter((l) => !l.includes("#")).length;
            if (long >= 2 && long <= 4 && isConnected(rows)) shapes.push(rows);
          }
        }
      }
    }
  }
  return shapes;
})();

/**
 * Backtracking fill for bigger grids: most constrained answer first, candidates in seeded order,
 * each choice narrowing the answers that cross it (and undoing that on the way back).
 */
function fillBig(slots: Slot[], rng: Rng, budget: number): Map<Slot, string> | null {
  const crossings = new Map<Slot, [at: number, other: Slot, theirs: number][]>(
    slots.map((s) => [s, []]),
  );
  const owner = new Map<string, [Slot, number][]>();
  for (const s of slots) {
    s.cells.forEach(([r, c], i) => {
      const key = `${r},${c}`;
      for (const [t, j] of owner.get(key) ?? []) {
        crossings.get(s)?.push([i, t, j]);
        crossings.get(t)?.push([j, s, i]);
      }
      owner.set(key, [...(owner.get(key) ?? []), [s, i]]);
    });
  }
  const options = new Map(
    slots.map((s) => [s, rng.shuffle((BY_LENGTH.get(s.length) ?? []).map(([w]) => w))]),
  );
  const chosen = new Map<Slot, string>();
  const used = new Set<string>();

  const solve = (): boolean => {
    if (budget-- <= 0) return false;
    let best: Slot | null = null;
    for (const s of slots) {
      if (chosen.has(s)) continue;
      const count = options.get(s)?.length ?? 0;
      if (!count) return false;
      if (!best || count < (options.get(best)?.length ?? 0)) best = s;
    }
    if (!best) return true;
    for (const word of options.get(best) ?? []) {
      if (used.has(word)) continue;
      const saved: [Slot, string[]][] = [];
      let dead = false;
      for (const [at, other, theirs] of crossings.get(best) ?? []) {
        if (chosen.has(other)) continue;
        const before = options.get(other) ?? [];
        const after = before.filter((w) => w[theirs] === word[at]);
        saved.push([other, before]);
        options.set(other, after);
        if (!after.length) {
          dead = true;
          break;
        }
      }
      if (!dead) {
        chosen.set(best, word);
        used.add(word);
        if (solve()) return true;
        used.delete(word);
        chosen.delete(best);
      }
      for (const [other, before] of saved) options.set(other, before);
      if (budget <= 0) return false;
    }
    return false;
  };

  return solve() ? chosen : null;
}

/** Sunday (UTC) by the calendar date. */
export const isSunday = (date: string) => (dayNumber(date) + 4) % 7 === 0;

/** The Sunday 9×9 crossword, with a clue for every answer. */
export function sundayCrossword(date: string): CrosswordPuzzle {
  const rng = rngFor(date, "sunday-crossword");
  for (const rows of rng.shuffle(SUNDAY_TEMPLATES)) {
    const shape = slotsOf(rows);
    const answers = fillBig(shape.slots, rng, 2_000);
    if (answers) return publish("The Sunday Crossword", rows, shape, answers, rng);
  }
  throw new Error(`Could not fill a Sunday crossword for ${date}`);
}

/** The day's crossword: the 9×9 on Sundays, the mini the rest of the week. */
export const crosswordFor = (date: string): CrosswordPuzzle =>
  isSunday(date) ? sundayCrossword(date) : miniCrossword(date);
