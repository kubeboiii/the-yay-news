// Deterministic randomness. Every generator derives its choices from the edition date (plus a salt
// per puzzle), so the same date always gives the same puzzles and nothing depends on the clock.

/** A 32-bit hash of a string (cyrb53, folded to 32 bits). */
export function hash(text: string): number {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < text.length; i++) {
    const ch = text.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h1 ^ h2) >>> 0;
}

/** A small seeded generator (mulberry32). */
export class Rng {
  private state: number;

  constructor(seed: number | string) {
    this.state = typeof seed === "string" ? hash(seed) : seed >>> 0;
  }

  /** A float in [0, 1). */
  next(): number {
    this.state = (this.state + 0x6d2b79f5) >>> 0;
    let t = this.state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** An integer in [0, n). */
  int(n: number): number {
    return Math.floor(this.next() * n);
  }

  /** An integer in [min, max]. */
  between(min: number, max: number): number {
    return min + this.int(max - min + 1);
  }

  pick<T>(items: readonly T[]): T {
    if (items.length === 0) throw new Error("Cannot pick from an empty list");
    return items[this.int(items.length)] as T;
  }

  /** A shuffled copy (Fisher–Yates). */
  shuffle<T>(items: readonly T[]): T[] {
    const out = [...items];
    for (let i = out.length - 1; i > 0; i--) {
      const j = this.int(i + 1);
      [out[i], out[j]] = [out[j] as T, out[i] as T];
    }
    return out;
  }

  /** `count` distinct items, in random order. */
  sample<T>(items: readonly T[], count: number): T[] {
    return this.shuffle(items).slice(0, count);
  }
}

const DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Days since 1970-01-01 for a calendar date ("YYYY-MM-DD"). Throws on anything else. */
export function dayNumber(date: string): number {
  const m = DATE.exec(date);
  const ms = m ? Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : NaN;
  if (!m || Number.isNaN(ms) || new Date(ms).toISOString().slice(0, 10) !== date) {
    throw new Error(`Not a calendar date: "${date}"`);
  }
  return Math.round(ms / 86_400_000);
}

/** Saturday or Sunday. */
export const isWeekend = (date: string) =>
  [0, 6].includes(new Date(`${date}T00:00:00Z`).getUTCDay());

/** The seeded generator for one puzzle on one date. */
export const rngFor = (date: string, salt: string) => new Rng(`${date}|${salt}`);

const mod = (a: number, n: number) => ((a % n) + n) % n;

/**
 * A fixed shuffle of `items`, walked one step per day: consecutive days never repeat an item until
 * the whole list has been used, so a bank of N items lasts N days without a repeat.
 */
export function rotation<T>(items: readonly T[], salt: string) {
  const order = new Rng(`rotation|${salt}`).shuffle(items.map((_, i) => i));
  return {
    size: items.length,
    /** The item at position `index` of the endless walk. */
    at(index: number): T {
      return items[order[mod(index, order.length)] as number] as T;
    },
  };
}
