import { solvedPuzzleSchema } from "@repo/shared";
import { describe, expect, it } from "vitest";
import { COLOURS, FORTUNES } from "./content/fortunes.ts";
import { LADDER_WORDS } from "./content/ladder-words.ts";
import { RIDDLES } from "./content/riddles.ts";
import { THEMES } from "./content/themes.ts";
import { FIVE_LETTER_WORDS } from "./content/words-5.ts";
import { NINE_LETTER_WORDS } from "./content/words-9.ts";
import { FOUR_LETTER_WORDS, THREE_LETTER_WORDS } from "./content/words-short.ts";
import {
  cluesFor,
  CROSSWORD_ANSWERS,
  distancesFrom,
  findAll,
  FORTUNE_CYCLE_DAYS,
  fortuneTeller,
  headlineWords,
  isValidLadder,
  miniCrossword,
  puzzlesFor,
  riddle,
  RIDDLE_CYCLE_DAYS,
  slotsOf,
  SUNDAY_TEMPLATES,
  sundayCrossword,
  TEMPLATES,
  wordLadder,
  wordSearch,
  type CrosswordPuzzle,
} from "./index.ts";

/** `count` consecutive calendar dates from `from`. */
const dates = (from: string, count: number) =>
  Array.from({ length: count }, (_, i) =>
    new Date(Date.parse(`${from}T00:00:00Z`) + i * 86_400_000).toISOString().slice(0, 10),
  );

const YEAR = dates("2026-09-26", 365);

const HEADLINES = [
  "The goblin shark, the deep sea’s oddest face, is finally filmed at home",
  "Astronomers find a baby planet less than a million years old",
  "Gardeners grow a pumpkin the size of a small car",
  "Otters hold hands at the river while the orchestra plays a picnic concert",
  "A library lends out kites, and the whole village goes flying on the beach",
];

describe("content", () => {
  const all = [
    ...THREE_LETTER_WORDS,
    ...FOUR_LETTER_WORDS,
    ...FIVE_LETTER_WORDS,
    ...NINE_LETTER_WORDS,
  ];

  it("has a clue for every crossword answer, and no answer twice", () => {
    for (const [answer, ...clues] of all) {
      expect(answer).toMatch(/^(?:[A-Z]{3,5}|[A-Z]{9})$/);
      expect(clues.length).toBeGreaterThan(0);
      for (const clue of clues) expect(clue).not.toMatch(new RegExp(`\\b${answer}\\b`, "i"));
    }
    expect(new Set(all.map(([a]) => a)).size).toBe(all.length);
    expect(NINE_LETTER_WORDS.length).toBeGreaterThanOrEqual(150);
  });

  it("keeps the banks big enough for a year", () => {
    expect(RIDDLES.length).toBeGreaterThanOrEqual(120);
    expect(new Set(RIDDLES.map(([q]) => q)).size).toBe(RIDDLES.length);
    expect(FORTUNES.length).toBeGreaterThanOrEqual(150);
    expect(new Set(FORTUNES).size).toBe(FORTUNES.length);
    expect(THEMES.length).toBeGreaterThanOrEqual(40);
    expect(new Set(COLOURS).size).toBe(COLOURS.length);
    for (const w of LADDER_WORDS) expect(w).toMatch(/^[A-Z]{4}$/);
  });
});

describe("determinism", () => {
  it("gives the same puzzles for the same date, and different ones on different dates", () => {
    const opts = { headlines: HEADLINES };
    expect(puzzlesFor("2026-09-30", opts)).toEqual(puzzlesFor("2026-09-30", opts));
    const a = puzzlesFor("2026-09-30");
    const b = puzzlesFor("2026-10-01");
    a.forEach((p, i) => expect(p.data).not.toEqual(b[i]?.data));
  });

  it("returns the back page in order, each fitting the shared contract", () => {
    const set = puzzlesFor("2026-10-03", { headlines: HEADLINES });
    expect(set.map((p) => [p.type, p.order])).toEqual([
      ["crossword", 0],
      ["word_ladder", 1],
      ["riddle", 2],
      ["word_search", 3],
      ["fortune_teller", 4],
    ]);
    for (const p of set) expect(solvedPuzzleSchema.parse(p)).toEqual(p);
  });

  it("rejects something that isn't a date", () => {
    expect(() => puzzlesFor("2026-02-30")).toThrow();
    expect(() => riddle("yesterday")).toThrow();
  });
});

/** A crossword is numbered properly, crosses correctly and clues every answer once. */
const checkCrossword = (p: CrosswordPuzzle) => {
  const { rows, numbers, across, down } = p.data;
  const { grid } = p.solution;
  expect(grid.map((row) => row.replace(/[A-Z]/g, "."))).toEqual(rows);

  // Numbered like a real crossword: row by row, a square that starts an answer gets the next n.
  const expected = slotsOf(rows);
  expect(numbers).toEqual(expected.numbers);

  for (const direction of ["across", "down"] as const) {
    const clues = direction === "across" ? across : down;
    const answers = p.solution[direction];
    const slots = expected.slots.filter((s) => s.direction === direction);
    expect(clues.map((c) => c.n)).toEqual(slots.map((s) => s.n));
    expect(answers.map((a) => a.n)).toEqual(slots.map((s) => s.n));
    slots.forEach((s, i) => {
      const answer = answers[i]?.answer as string;
      // The answer reads off the solved grid, so every crossing agrees.
      expect(s.cells.map(([r, c]) => grid[r]?.[c]).join("")).toBe(answer);
      expect(clues[i]?.length).toBe(answer.length);
      expect(cluesFor(answer)).toContain(clues[i]?.clue);
    });
  }
  const words = [...p.solution.across, ...p.solution.down].map((a) => a.answer);
  expect(new Set(words).size).toBe(words.length);
};

/** Half-turn symmetric, answers of three or more, every white square in an answer, all joined up. */
const checkShape = (rows: readonly string[], size: number) => {
  expect(rows).toHaveLength(size);
  for (const row of rows) expect(row).toMatch(new RegExp(`^[.#]{${size}}$`));
  expect([...rows].reverse().map((r) => [...r].reverse().join(""))).toEqual(rows);
  const { slots } = slotsOf(rows);
  for (const s of slots) expect(s.length).toBeGreaterThanOrEqual(3);
  const covered = new Set(slots.flatMap((s) => s.cells.map(([r, c]) => `${r},${c}`)));
  const whites = rows.flatMap((line, r) =>
    [...line].flatMap((ch, c) => (ch === "." ? [`${r},${c}`] : [])),
  );
  for (const w of whites) expect(covered.has(w)).toBe(true);
  // Connected: a flood fill from one white square reaches them all.
  const seen = new Set([whites[0]]);
  const queue = [whites[0] as string];
  for (let i = 0; i < queue.length; i++) {
    const [r, c] = (queue[i] as string).split(",").map(Number) as [number, number];
    for (const [dr, dc] of [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ] as const) {
      const key = `${r + dr},${c + dc}`;
      if (rows[r + dr]?.[c + dc] === "." && !seen.has(key)) {
        seen.add(key);
        queue.push(key);
      }
    }
  }
  expect(seen.size).toBe(whites.length);
  return slots;
};

describe("mini crossword", () => {
  it("only uses templates whose answers are all three letters or more", () => {
    for (const rows of TEMPLATES) checkShape(rows, 5);
  });

  it("crosses correctly, is numbered properly and clues every answer, all year", () => {
    const shapes = new Set<string>();
    const grids = new Set<string>();
    for (const date of YEAR) {
      const p = miniCrossword(date);
      checkCrossword(p);
      shapes.add(p.data.rows.join("/"));
      grids.add(p.solution.grid.join("/"));
    }
    expect(shapes.size).toBeGreaterThanOrEqual(5);
    expect(grids.size).toBe(YEAR.length);
  });
});

describe("Sunday crossword", () => {
  it("only uses sensible 9×9 shapes", () => {
    expect(SUNDAY_TEMPLATES.length).toBeGreaterThanOrEqual(20);
    expect(new Set(SUNDAY_TEMPLATES.map((rows) => rows.join("/"))).size).toBe(
      SUNDAY_TEMPLATES.length,
    );
    for (const rows of SUNDAY_TEMPLATES) {
      const slots = checkShape(rows, 9);
      expect(slots.filter((s) => s.length === 9).length).toBeGreaterThanOrEqual(2);
      // British style: every answer has at least half its letters (rounded down) crossed.
      const crossed = new Map<string, number>();
      for (const s of slots)
        for (const [r, c] of s.cells) crossed.set(`${r},${c}`, (crossed.get(`${r},${c}`) ?? 0) + 1);
      for (const s of slots) {
        const checked = s.cells.filter(([r, c]) => crossed.get(`${r},${c}`) === 2).length;
        expect(checked).toBeGreaterThanOrEqual(Math.floor(s.length / 2));
      }
    }
  });

  it("fills every Sunday of 2026, quickly, from the word list with no answer twice", () => {
    const sundays = Array.from({ length: 53 }, (_, i) =>
      new Date(Date.UTC(2026, 0, 4) + i * 7 * 86_400_000).toISOString().slice(0, 10),
    ).filter((d) => d.startsWith("2026"));
    expect(sundays).toHaveLength(52);
    const grids = new Set<string>();
    for (const date of sundays) {
      expect(new Date(`${date}T00:00:00Z`).getUTCDay()).toBe(0);
      const started = performance.now();
      const p = sundayCrossword(date);
      expect(performance.now() - started).toBeLessThan(200);
      checkCrossword(p);
      expect(p.data.title).toBe("The Sunday Crossword");
      expect(SUNDAY_TEMPLATES.map((rows) => rows.join("/"))).toContain(p.data.rows.join("/"));
      for (const { answer } of [...p.solution.across, ...p.solution.down]) {
        expect(CROSSWORD_ANSWERS.has(answer)).toBe(true);
      }
      for (const c of [...p.data.across, ...p.data.down]) expect(c.clue.length).toBeGreaterThan(0);
      grids.add(p.solution.grid.join("/"));
    }
    expect(grids.size).toBe(sundays.length);
  });

  it("keeps filling for years of Sundays", () => {
    for (let i = 0; i < 520; i++) {
      const date = new Date(Date.UTC(2027, 0, 3) + i * 7 * 86_400_000).toISOString().slice(0, 10);
      checkCrossword(sundayCrossword(date));
    }
  });

  it("replaces the mini on Sundays only", () => {
    for (const date of dates("2026-10-01", 14)) {
      const [crossword] = puzzlesFor(date);
      const sunday = new Date(`${date}T00:00:00Z`).getUTCDay() === 0;
      expect(crossword?.type).toBe("crossword");
      expect(crossword?.order).toBe(0);
      if (crossword?.type !== "crossword") continue;
      expect(crossword.data.rows).toHaveLength(sunday ? 9 : 5);
      expect(crossword.data).toEqual((sunday ? sundayCrossword : miniCrossword)(date).data);
      expect(solvedPuzzleSchema.parse(crossword)).toEqual(crossword);
    }
  });
});

describe("word ladder", () => {
  it("climbs by real words, one letter at a time, by a shortest route", () => {
    const seen = new Set<string>();
    for (const date of YEAR) {
      const p = wordLadder(date);
      const { ladder } = p.solution;
      expect(isValidLadder(ladder)).toBe(true);
      expect(ladder[0]).toBe(p.data.start);
      expect(ladder.at(-1)).toBe(p.data.end);
      expect(ladder).toHaveLength(p.data.steps + 2);
      expect(p.data.steps).toBeGreaterThanOrEqual(3);
      expect(p.data.steps).toBeLessThanOrEqual(5);
      // Shortest: no route with fewer changes exists.
      expect(distancesFrom(p.data.start).get(p.data.end)).toBe(ladder.length - 1);
      expect(new Set(ladder).size).toBe(ladder.length);
      const key = [p.data.start, p.data.end].sort().join("-");
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
  });

  it("rejects illegal ladders", () => {
    expect(isValidLadder(["COLD", "WARM"])).toBe(false);
    expect(isValidLadder(["COLD", "CXLD"])).toBe(false);
  });
});

describe("riddle", () => {
  it(`never repeats within ${RIDDLE_CYCLE_DAYS} consecutive days`, () => {
    expect(RIDDLE_CYCLE_DAYS).toBeGreaterThanOrEqual(120);
    for (const from of ["2026-09-26", "2027-03-01", "2031-12-25"]) {
      const questions = dates(from, RIDDLE_CYCLE_DAYS).map((d) => riddle(d).data.question);
      expect(new Set(questions).size).toBe(questions.length);
    }
  });
});

describe("word search", () => {
  const check = (p: ReturnType<typeof wordSearch>, size: number) => {
    const { grid, words } = p.data;
    expect(grid).toHaveLength(size);
    for (const row of grid) expect(row).toMatch(new RegExp(`^[A-Z]{${size}}$`));
    expect(words.length).toBeGreaterThanOrEqual(6);
    expect(words.length).toBeLessThanOrEqual(8);
    expect(p.solution.placements.map((pl) => pl.word)).toEqual(words);
    for (const pl of p.solution.placements) {
      // Exactly one place in the grid spells the word, and it's the one in the solution.
      expect(findAll(grid, pl.word)).toEqual([pl]);
      const [dr, dc] = [pl.end[0] - pl.start[0], pl.end[1] - pl.start[1]];
      expect(Math.max(Math.abs(dr), Math.abs(dc))).toBe(pl.word.length - 1);
      expect(dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)).toBe(true);
    }
  };

  it("hides every word exactly once, 10×10 on weekdays and 12×12 at weekends, all year", () => {
    for (const date of YEAR) {
      const weekend = [0, 6].includes(new Date(`${date}T00:00:00Z`).getUTCDay());
      check(wordSearch(date), weekend ? 12 : 10);
    }
  });

  it("uses the day's headline words when there are enough", () => {
    const p = wordSearch("2026-09-30", headlineWords(HEADLINES));
    check(p, 10);
    expect(p.data.theme).toBe("Hidden in today's headlines");
    const inNews = new Set(headlineWords(HEADLINES).map((w) => w.toUpperCase()));
    for (const w of p.data.words) expect(inNews.has(w)).toBe(true);
  });

  it("falls back to a theme when the headlines have too few familiar words", () => {
    const p = wordSearch("2026-09-30", ["Verstappen", "Baku", "Castlevania"]);
    check(p, 10);
    expect(THEMES.map((t) => t.theme)).toContain(p.data.theme);
  });
});

describe("fortune teller", () => {
  it("has four colours, eight numbers and eight fortunes", () => {
    for (const date of YEAR.slice(0, 60)) {
      const { data, solution } = fortuneTeller(date);
      expect(solution).toEqual({});
      expect(data.colours).toHaveLength(4);
      expect(new Set(data.colours).size).toBe(4);
      expect(data.numbers).toHaveLength(8);
      expect(new Set(data.numbers).size).toBe(8);
      for (const n of data.numbers) expect(n >= 1 && n <= 12).toBe(true);
      expect(data.fortunes).toHaveLength(8);
    }
  });

  it("repeats no fortune within a month", () => {
    expect(FORTUNE_CYCLE_DAYS).toBeGreaterThanOrEqual(31);
    for (const from of ["2026-09-26", "2028-02-10"]) {
      const all = dates(from, 31).flatMap((d) => fortuneTeller(d).data.fortunes);
      expect(new Set(all).size).toBe(all.length);
    }
  });
});

describe("a year of back pages", () => {
  it("generates 365 consecutive days without failure", () => {
    for (const date of YEAR) {
      for (const p of puzzlesFor(date, { headlines: HEADLINES })) solvedPuzzleSchema.parse(p);
    }
  });
});
