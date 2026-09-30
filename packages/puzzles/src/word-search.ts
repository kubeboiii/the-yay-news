import { THEMES } from "./content/themes.ts";
import { CROSSWORD_ANSWERS } from "./crossword.ts";
import { dayNumber, isWeekend, rngFor, rotation, type Rng } from "./random.ts";
import type { WordSearchPuzzle } from "./types.ts";

type Cell = [row: number, col: number];
export type Placement = { word: string; start: Cell; end: Cell };

/** Across, down and both diagonals, each forwards and backwards. */
const DIRECTIONS: readonly Cell[] = [
  [0, 1],
  [1, 0],
  [1, 1],
  [-1, 1],
  [0, -1],
  [-1, 0],
  [-1, -1],
  [1, -1],
];

/** Filler letters, weighted roughly like English so the grid looks like words are everywhere. */
const FILLER = "AAAAABBCCCDDDEEEEEEEFFGGGHHHIIIIIKLLLLMMMNNNNNOOOOOPPPRRRRRSSSSSTTTTTUUUVWWYY";

const MIN_WORDS = 6;

const themes = rotation(THEMES, "word-search");

/**
 * Everyday words that are fine in a crossword but dull to hunt for, so headline words like these
 * are skipped.
 */
const DULL = new Set(
  (
    "ALSO AWAY BACK BEEN BEST BOTH CAME COME DONE EACH EVEN EVER FIND FROM GAVE GIVE GOES GONE " +
    "GOOD HAVE HELD HERE HOLD INTO JUST KEEP KEPT LAST LATE LEFT LESS LIKE LONG LOOK MADE MAKE " +
    "MANY MORE MOST MUCH NEAR NEXT ONCE ONLY OPEN OVER PART SAID SAME SUCH TAKE TELL THAN THAT " +
    "THEM THEN THEY THIS TOLD TURN UPON VERY WENT WERE WHAT WHEN WITH ABOUT AFTER AGAIN BEGIN " +
    "BELOW BRING EVERY FIRST LATER OTHER START THREE UNDER UNTIL WHOLE ISSUE ITEMS POINT"
  ).split(" "),
);

/** Words the paper's own lists know (crossword answers and theme words), minus the dull ones. */
const KNOWN_WORDS: ReadonlySet<string> = new Set(
  [...CROSSWORD_ANSWERS, ...THEMES.flatMap((t) => t.words)].filter((w) => !DULL.has(w)),
);

const reverse = (w: string) => [...w].reverse().join("");

/** A word (or its plural) the allowlist knows. */
function isKnown(word: string): boolean {
  const stems = [word, word.replace(/S$/, ""), word.replace(/ES$/, ""), word.replace(/IES$/, "Y")];
  return stems.some((s) => s.length >= 4 && KNOWN_WORDS.has(s));
}

/**
 * The words from `words` that suit a grid of `size`: familiar (on the allowlist), 4 letters or
 * more, fitting the grid, not palindromes, and none hiding inside another (or its reverse), so each
 * can be found exactly once.
 */
export function suitableWords(words: readonly string[], size = 10): string[] {
  const clean = [
    ...new Set(words.map((w) => w.toUpperCase()).filter((w) => /^[A-Z]{4,}$/.test(w))),
  ].filter((w) => w.length <= size && w !== reverse(w) && isKnown(w));
  // Longest first, so a shorter word inside a longer one is the one dropped.
  const kept: string[] = [];
  for (const w of clean.sort((a, b) => b.length - a.length || a.localeCompare(b))) {
    if (!kept.some((k) => k.includes(w) || reverse(k).includes(w))) kept.push(w);
  }
  return kept;
}

/** Words (four letters or more) of the given headlines, e.g. to hide the day's news in the grid. */
export const headlineWords = (headlines: readonly string[]) =>
  headlines.flatMap((h) =>
    h
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .split(/[^A-Za-z]+/)
      .filter((w) => w.length >= 4),
  );

/** Every place `word` can be read in the grid, in any of the eight directions. */
export function findAll(grid: readonly string[], word: string): Placement[] {
  const found: Placement[] = [];
  const size = grid.length;
  const at = (r: number, c: number) => grid[r]?.[c];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      for (const [dr, dc] of DIRECTIONS) {
        if ([...word].every((ch, i) => at(r + dr * i, c + dc * i) === ch)) {
          const n = word.length - 1;
          found.push({ word, start: [r, c], end: [r + dr * n, c + dc * n] });
        }
      }
    }
  }
  return found;
}

/** One attempt at hiding the words and filling the gaps; null if it didn't work out. */
function attempt(size: number, words: readonly string[], rng: Rng) {
  const cells = Array.from({ length: size }, () => Array<string>(size).fill(""));
  const placements: Placement[] = [];
  for (const word of [...words].sort((a, b) => b.length - a.length)) {
    const n = word.length - 1;
    const options: Placement[] = [];
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        for (const [dr, dc] of DIRECTIONS) {
          const [er, ec] = [r + dr * n, c + dc * n];
          if (er < 0 || er >= size || ec < 0 || ec >= size) continue;
          const fits = [...word].every((ch, i) => {
            const there = cells[r + dr * i]?.[c + dc * i];
            return there === "" || there === ch;
          });
          if (fits) options.push({ word, start: [r, c], end: [er, ec] });
        }
      }
    }
    if (!options.length) return null;
    const p = rng.pick(options);
    const [dr, dc] = [Math.sign(p.end[0] - p.start[0]), Math.sign(p.end[1] - p.start[1])];
    [...word].forEach((ch, i) => {
      (cells[p.start[0] + dr * i] as string[])[p.start[1] + dc * i] = ch;
    });
    placements.push(p);
  }
  const grid = cells.map((row) => row.map((ch) => ch || rng.pick([...FILLER])).join(""));
  // Filler letters can spell a word by accident; insist that each word is there exactly once.
  if (words.some((w) => findAll(grid, w).length !== 1)) return null;
  return { grid, placements };
}

/**
 * The day's word search: a 10×10 grid (12×12 at weekends) hiding 6–8 words in any direction. Given
 * `words` (say, from the day's headlines), it hides the suitable ones; otherwise, or if too few
 * suit, it uses the day's theme.
 */
export function wordSearch(date: string, words?: readonly string[]): WordSearchPuzzle {
  const rng = rngFor(date, "word-search");
  const weekend = isWeekend(date);
  const size = weekend ? 12 : 10;
  const count = weekend ? 8 : rng.between(6, 7);

  const fromNews = words ? suitableWords(words, size) : [];
  const [theme, pool] =
    fromNews.length >= MIN_WORDS
      ? ["Hidden in today's headlines", fromNews]
      : (() => {
          const t = themes.at(dayNumber(date));
          return [t.theme, suitableWords(t.words, size)] as const;
        })();
  // Longer words make better hunting, so they go in first.
  const long = rng.shuffle(pool.filter((w) => w.length >= 5));
  const short = rng.shuffle(pool.filter((w) => w.length < 5));
  const chosen = [...long, ...short].slice(0, count).sort();
  if (chosen.length < MIN_WORDS) throw new Error(`Too few words for a word search on ${date}`);

  for (let i = 0; i < 200; i++) {
    const result = attempt(size, chosen, rng);
    if (!result) continue;
    const byWord = new Map(result.placements.map((p) => [p.word, p]));
    return {
      type: "word_search",
      data: { title: "Word Search", theme, grid: result.grid, words: chosen },
      solution: { placements: chosen.map((w) => byWord.get(w) as Placement) },
    };
  }
  throw new Error(`Could not build a word search for ${date}`);
}
