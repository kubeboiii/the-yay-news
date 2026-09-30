import { LADDER_WORDS } from "./content/ladder-words.ts";
import { dayNumber, Rng, rngFor, rotation } from "./random.ts";
import type { WordLadderPuzzle } from "./types.ts";

const WORDS: readonly string[] = [...new Set(LADDER_WORDS)].sort();
const DICTIONARY: ReadonlySet<string> = new Set(WORDS);

/** Whether a word may appear in a ladder (the familiar four-letter dictionary). */
export const isLadderWord = (word: string) => DICTIONARY.has(word.toUpperCase());

/** Words one letter away, via "C_LD"-style buckets. */
const neighbours: ReadonlyMap<string, readonly string[]> = (() => {
  const buckets = new Map<string, string[]>();
  const key = (w: string, i: number) => `${w.slice(0, i)}_${w.slice(i + 1)}`;
  for (const w of WORDS) {
    for (let i = 0; i < w.length; i++) {
      const k = key(w, i);
      buckets.set(k, [...(buckets.get(k) ?? []), w]);
    }
  }
  return new Map(
    WORDS.map((w) => [
      w,
      [...w].flatMap((_, i) => (buckets.get(key(w, i)) ?? []).filter((x) => x !== w)).sort(),
    ]),
  );
})();

/** Breadth-first distances (in letter changes) from `start` to every reachable word. */
export function distancesFrom(start: string): Map<string, number> {
  const dist = new Map([[start, 0]]);
  const queue = [start];
  for (let i = 0; i < queue.length; i++) {
    const w = queue[i] as string;
    for (const next of neighbours.get(w) ?? []) {
      if (!dist.has(next)) {
        dist.set(next, (dist.get(w) as number) + 1);
        queue.push(next);
      }
    }
  }
  return dist;
}

/** A shortest ladder from `start` to `end`, picking at random among equally short ones. */
export function shortestLadder(start: string, end: string, rng = new Rng(0)): string[] | null {
  const fromEnd = distancesFrom(end);
  const total = fromEnd.get(start);
  if (total === undefined) return null;
  const ladder = [start];
  let at = start;
  for (let left = total; left > 0; left--) {
    at = rng.pick((neighbours.get(at) ?? []).filter((w) => fromEnd.get(w) === left - 1));
    ladder.push(at);
  }
  return ladder;
}

/** Whether `ladder` is a legal climb: dictionary words, one letter changed per rung. */
export function isValidLadder(ladder: readonly string[]): boolean {
  return (
    ladder.length >= 2 &&
    ladder.every(isLadderWord) &&
    ladder.slice(1).every((w, i) => {
      const prev = ladder[i] as string;
      return [...w].filter((ch, j) => ch !== prev[j]).length === 1;
    })
  );
}

/**
 * The intermediate words (the schema's `steps`) by weekday, Sunday to Saturday: gentle at the
 * start of the week, longest at the weekend.
 */
const STEPS_BY_WEEKDAY = [5, 3, 3, 4, 4, 4, 5] as const;

/** Every pair of words whose shortest ladder has exactly `steps` words in between, found once. */
const pairsByStep = new Map<number, [string, string][]>();
function pairsWith(steps: number): [string, string][] {
  const cached = pairsByStep.get(steps);
  if (cached) return cached;
  for (const s of new Set(STEPS_BY_WEEKDAY)) pairsByStep.set(s, []);
  for (const a of WORDS) {
    for (const [b, d] of distancesFrom(a)) {
      if (a < b) pairsByStep.get(d - 1)?.push([a, b]);
    }
  }
  return pairsByStep.get(steps) ?? [];
}

const rotations = new Map<number, ReturnType<typeof rotation<[string, string]>>>();
function poolFor(steps: number) {
  let pool = rotations.get(steps);
  if (!pool) rotations.set(steps, (pool = rotation(pairsWith(steps), `ladder-${steps}`)));
  return pool;
}

/** The day's word ladder: climb from one familiar word to another, one letter at a time. */
export function wordLadder(date: string): WordLadderPuzzle {
  const day = dayNumber(date);
  const weekday = new Date(`${date}T00:00:00Z`).getUTCDay();
  const steps = STEPS_BY_WEEKDAY[weekday] as number;
  // Each pool holds thousands of pairs, walked one step per day, so no ladder repeats for years.
  const rng = rngFor(date, "ladder");
  const pair = poolFor(steps).at(day);
  const [start, end] = rng.next() < 0.5 ? pair : ([pair[1], pair[0]] as const);
  const ladder = shortestLadder(start, end, rng);
  if (!ladder || ladder.length !== steps + 2) {
    throw new Error(`No ${steps}-step ladder from ${start} to ${end}`);
  }
  return {
    type: "word_ladder",
    data: {
      title: "Word Ladder",
      instructions: `Change one letter at a time to climb from ${start} to ${end}.`,
      start,
      end,
      steps,
    },
    solution: { ladder },
  };
}
