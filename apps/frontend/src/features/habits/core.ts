// The pure half of the habits log: event types, merging, compaction and every derived view
// (streaks, stamps, stickers, moods, saved stories). No React and no browser APIs, so it can be
// unit-tested with `node --test` and reused by a server when accounts arrive.
//
// ——— The log ———
// Everything the reader does is an append-only list of events. An event is never edited or
// removed by the reader's actions; "un-saving" a story or peeling a sticker off is a new event.
// Every derived view is a fold over the list in (at, id) order, so the latest event wins.
//
// ——— Merging (for a future Google sign-in) ———
// `mergeEvents(a, b)` is the union of two logs by event id, sorted by (at, id). It is commutative,
// associative and idempotent, so any number of devices can be merged into an account, in any
// order, any number of times, and every device ends up with the same log and the same streak.

import type { PuzzleType } from "@repo/shared";

export type MoodId = "sunny" | "grin" | "calm" | "silly" | "sleepy" | "wow";

export const MOODS: readonly { id: MoodId; label: string }[] = [
  { id: "sunny", label: "Sunny" },
  { id: "grin", label: "Grinning" },
  { id: "calm", label: "Calm" },
  { id: "silly", label: "Silly" },
  { id: "sleepy", label: "Sleepy" },
  { id: "wow", label: "Wowed" },
];

/** Where a sticker can be stuck: a page's order in its edition, or any other stable key. */
export type StickerPage = number | string;

export type HabitEvent = { id: string; at: string } & (
  | { type: "page_read"; issue: number; page: number }
  | {
      type: "edition_finished";
      issue: number;
      date: string;
      design: string;
      colourway: string;
      /** How many puzzles there were to solve (fortune tellers excluded), for the "all solved" stamp. */
      puzzles?: number;
    }
  | { type: "puzzle_solved"; issue: number; puzzle: PuzzleType }
  | { type: "puzzle_peeked"; issue: number; puzzle: PuzzleType }
  | { type: "fortune_read"; issue: number; fortune: string }
  | { type: "sticker_earned"; issue: number; sticker: string }
  | {
      type: "sticker_placed";
      /** The id of the sticker_earned event: which sticker off the sheet this is. */
      sticker: string;
      issue: number;
      page: StickerPage;
      /** Centre, as a share (0–1) of the page's width and height. */
      x: number;
      y: number;
      /** Degrees. */
      rot: number;
    }
  | { type: "sticker_peeled"; sticker: string }
  | { type: "mood"; issue: number; mood: MoodId; date?: string }
  | {
      type: "story_saved";
      issue: number;
      slug: string;
      headline: string;
      kicker?: string;
      date?: string;
    }
  | { type: "story_unsaved"; issue: number; slug: string }
);

export type HabitEventType = HabitEvent["type"];
export type EventOf<T extends HabitEventType> = Extract<HabitEvent, { type: T }>;

export type NewHabitEvent = HabitEvent extends infer E
  ? E extends HabitEvent
    ? Omit<E, "id" | "at">
    : never
  : never;

/** The document kept on a device (and, later, in an account). */
export type HabitDoc = { v: 1; device: string; events: HabitEvent[] };

export const SCHEMA_VERSION = 1;

// ——— Ordering and merging ———

export const byTime = (a: HabitEvent, b: HabitEvent) =>
  a.at < b.at ? -1 : a.at > b.at ? 1 : a.id < b.id ? -1 : a.id > b.id ? 1 : 0;

/**
 * The union of any number of logs by event id, oldest first ((at, id) order). When two logs hold
 * the same id the first one's copy is kept (ids are unique, so the copies are the same event).
 */
export function mergeEvents(...logs: readonly (readonly HabitEvent[])[]): HabitEvent[] {
  const seen = new Map<string, HabitEvent>();
  for (const log of logs) for (const e of log) if (!seen.has(e.id)) seen.set(e.id, e);
  return [...seen.values()].sort(byTime);
}

/** Merges two documents; the result keeps `into`'s device id. */
export function mergeDocs(into: HabitDoc, other: HabitDoc): HabitDoc {
  return { v: 1, device: into.device, events: mergeEvents(into.events, other.events) };
}

const isObj = (x: unknown): x is Record<string, unknown> => typeof x === "object" && x !== null;

/** Keeps only well-formed events (a corrupt or future-version entry is skipped, not fatal). */
export function sanitize(raw: unknown): HabitEvent[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (e): e is HabitEvent =>
      isObj(e) &&
      typeof e.id === "string" &&
      typeof e.at === "string" &&
      typeof e.type === "string" &&
      KNOWN.has(e.type),
  );
}

const KNOWN = new Set<string>([
  "page_read",
  "edition_finished",
  "puzzle_solved",
  "puzzle_peeked",
  "fortune_read",
  "sticker_earned",
  "sticker_placed",
  "sticker_peeled",
  "mood",
  "story_saved",
  "story_unsaved",
]);

/** Reads a stored document: the current shape, or v0's bare array of events. */
export function parseDoc(raw: string | null, device: string): HabitDoc {
  if (!raw) return { v: 1, device, events: [] };
  try {
    const data = JSON.parse(raw) as unknown;
    if (Array.isArray(data)) return { v: 1, device, events: sanitize(data).sort(byTime) };
    if (isObj(data)) {
      return {
        v: 1,
        device: typeof data.device === "string" ? data.device : device,
        events: sanitize(data.events).sort(byTime),
      };
    }
  } catch {
    // Unreadable: start again rather than break the paper.
  }
  return { v: 1, device, events: [] };
}

// ——— Compaction ———
//
// A keen reader writes ~25 events a day (~5 KB), so a year is ~2 MB, under the ~5 MB localStorage
// allows. Past COMPACT_AT events the log is compacted, which only ever drops events that no view
// needs any more, so every derived view is identical before and after:
//   · page_read older than 60 days (they only decide whether an edition is finished, and an old
//     edition is either already finished or never will be by those reads);
//   · puzzle_peeked older than 60 days;
//   · all but the latest sticker_placed/sticker_peeled per sticker;
//   · all but the latest mood per issue;
//   · all but the latest story_saved/story_unsaved per story (the latest is kept, even when it is
//     an unsave, as a tombstone, so merging with an older device can't resurrect the story).
// Merging a compacted log with an uncompacted one gives the same views, because every rule above
// is "latest wins" or a read-only history nobody looks at.

export const COMPACT_AT = 4000;
const OLD_MS = 60 * 24 * 3600 * 1000;

export function compact(events: readonly HabitEvent[], now: number): HabitEvent[] {
  const cutoff = new Date(now - OLD_MS).toISOString();
  const latest = new Map<string, string>();
  const keyOf = (e: HabitEvent): string | null => {
    switch (e.type) {
      case "sticker_placed":
      case "sticker_peeled":
        return `st:${e.sticker}`;
      case "mood":
        return `mood:${e.issue}`;
      case "story_saved":
      case "story_unsaved":
        return `story:${e.issue}:${e.slug}`;
      default:
        return null;
    }
  };
  const sorted = [...events].sort(byTime);
  for (const e of sorted) {
    const k = keyOf(e);
    if (k) latest.set(k, e.id);
  }
  return sorted.filter((e) => {
    if ((e.type === "page_read" || e.type === "puzzle_peeked") && e.at < cutoff) return false;
    const k = keyOf(e);
    return k === null || latest.get(k) === e.id;
  });
}

// ——— Dates ———

const DAY = 24 * 3600 * 1000;
const toDay = (date: string) => Math.round(Date.parse(`${date}T00:00:00Z`) / DAY);
const fromDay = (n: number) => new Date(n * DAY).toISOString().slice(0, 10);
export const addDays = (date: string, n: number) => fromDay(toDay(date) + n);
export const daysBetween = (a: string, b: string) => toDay(b) - toDay(a);

/**
 * Today's edition date on this device: editions land at 07:00 local time, so before 7am the
 * newest paper is still yesterday's.
 */
export function editionDateAt(now: Date): string {
  const d = new Date(now.getTime() - 7 * 3600 * 1000);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

// ——— Streaks ———
//
// A streak counts EDITIONS FINISHED ON CONSECUTIVE EDITION DATES — by the date printed on the
// paper, not the day you read it. So reading yesterday's paper this morning still counts for
// yesterday, and a reader in any timezone gets the same answer.
//
// It is kind:
//   · Today's paper never breaks a streak: until it's finished the streak runs to yesterday.
//   · One missed paper in any seven days is forgiven as a "rest day": it doesn't add to the
//     count, but the streak carries on across it. Two missed papers in a row, or a second miss
//     within seven days of the last rest day, ends the streak.
//   · A streak is the number of papers finished in it (rest days don't count).
// `current` is the streak you'd extend by finishing today's paper; 0 when it has ended.

export type Streak = {
  current: number;
  best: number;
  /** Rest days inside the current streak. */
  restDays: string[];
  /** The newest finished edition date, if any. */
  last: string | null;
  /** Whether today's paper is already finished (the streak is safe for today). */
  doneToday: boolean;
};

export const REST_EVERY = 7;

export function finishedDates(events: readonly HabitEvent[]): Set<string> {
  const set = new Set<string>();
  for (const e of events) if (e.type === "edition_finished") set.add(e.date);
  return set;
}

export function streakOf(dates: ReadonlySet<string>, today: string): Streak {
  const sorted = [...dates].sort();
  const last = sorted.at(-1) ?? null;
  const doneToday = dates.has(today);
  let current = 0;
  const restDays: string[] = [];
  // Walk back from today (or yesterday, while today's paper is still unread).
  let d = doneToday ? today : addDays(today, -1);
  // Never count papers dated after today (a preview clock, a device clock that jumped).
  for (let guard = 0; guard < 20000; guard++) {
    if (dates.has(d)) {
      current++;
    } else {
      const prevRest = restDays.at(-1);
      const canRest =
        dates.has(addDays(d, -1)) &&
        (prevRest === undefined || daysBetween(d, prevRest) >= REST_EVERY);
      if (!canRest) break;
      restDays.push(d);
    }
    d = addDays(d, -1);
  }
  const best = Math.max(current, ...runsOf(dates).values(), 0);
  return { current, best, restDays: restDays.reverse(), last, doneToday };
}

/**
 * The streak as it stood on each finished date (the count including that date), walking the
 * history forwards with the same rules. Used for the milestone stamps.
 */
export function runsOf(dates: ReadonlySet<string>): Map<string, number> {
  const out = new Map<string, number>();
  const sorted = [...dates].sort();
  const first = sorted[0];
  const lastDate = sorted.at(-1);
  if (!first || !lastDate) return out;
  let count = 0;
  let lastRest: string | null = null;
  for (let d = first; d <= lastDate; d = addDays(d, 1)) {
    if (dates.has(d)) {
      count++;
      out.set(d, count);
      continue;
    }
    const canRest =
      count > 0 &&
      dates.has(addDays(d, 1)) &&
      (lastRest === null || daysBetween(lastRest, d) >= REST_EVERY);
    if (canRest) lastRest = d;
    else {
      count = 0;
      lastRest = null;
    }
  }
  return out;
}

export const MILESTONES = [3, 7, 30, 100] as const;

// ——— What counts as reading ———
//
// A page is READ when it has been on screen for READ_DWELL_MS in all (while the tab is visible),
// or the reader has scrolled to its end after at least SKIM_DWELL_MS on it.
// An edition is FINISHED when the reader has read the back page and more than half of all its
// pages (the back page included). Both are recorded once per edition, however often you return.

export const READ_DWELL_MS = 6000;
export const SKIM_DWELL_MS = 3000;

export function pagesRead(events: readonly HabitEvent[], issue: number): Set<number> {
  const set = new Set<number>();
  for (const e of events) if (e.type === "page_read" && e.issue === issue) set.add(e.page);
  return set;
}

export function isFinished(events: readonly HabitEvent[], issue: number): boolean {
  return events.some((e) => e.type === "edition_finished" && e.issue === issue);
}

/** Whether a set of read pages finishes an edition of `total` pages whose back page is `back`. */
export function finishes(read: ReadonlySet<number>, total: number, back: number): boolean {
  return read.has(back) && read.size > total / 2;
}

// ——— Stamps ———

export type StampInfo = {
  issue: number;
  date: string;
  design: string;
  colourway: string;
  /** Saturday or Sunday. */
  weekend: boolean;
  /** The first stamp in the book. */
  first: boolean;
  /** The streak reached a milestone (3, 7, 30, 100) with this paper. */
  milestone: number | null;
  /** Every puzzle in the paper solved. */
  allSolved: boolean;
  /** When it was stamped. */
  at: string;
};

const isWeekendDate = (date: string) => {
  const day = new Date(`${date}T00:00:00Z`).getUTCDay();
  return day === 0 || day === 6;
};

/** Solved puzzles by issue (fortune tellers are not puzzles to solve). */
export function solvedByIssue(events: readonly HabitEvent[]): Map<number, Set<PuzzleType>> {
  const out = new Map<number, Set<PuzzleType>>();
  for (const e of events) {
    if (e.type !== "puzzle_solved" || e.puzzle === "fortune_teller") continue;
    const set = out.get(e.issue) ?? new Set<PuzzleType>();
    set.add(e.puzzle);
    out.set(e.issue, set);
  }
  return out;
}

/** One stamp per finished edition, oldest edition date first. */
export function stampsOf(events: readonly HabitEvent[]): StampInfo[] {
  const firsts = new Map<number, EventOf<"edition_finished">>();
  for (const e of events) {
    if (e.type === "edition_finished" && !firsts.has(e.issue)) firsts.set(e.issue, e);
  }
  const list = [...firsts.values()].sort((a, b) =>
    a.date < b.date ? -1 : a.date > b.date ? 1 : a.issue - b.issue,
  );
  const runs = runsOf(new Set(list.map((e) => e.date)));
  const solved = solvedByIssue(events);
  return list.map((e, i) => {
    const run = runs.get(e.date) ?? 0;
    // Stamped every time a streak reaches a milestone, not just the first time.
    const milestone = (MILESTONES as readonly number[]).includes(run) ? run : null;
    const need = e.puzzles ?? 0;
    return {
      issue: e.issue,
      date: e.date,
      design: e.design,
      colourway: e.colourway,
      weekend: isWeekendDate(e.date),
      first: i === 0,
      milestone,
      allSolved: need > 0 && (solved.get(e.issue)?.size ?? 0) >= need,
      at: e.at,
    };
  });
}

// ——— Stickers ———

export type OwnedSticker = {
  /** The sticker_earned event's id: this particular sticker. */
  id: string;
  /** Which design it is (see catalogue.ts). */
  sticker: string;
  /** The issue it was earned in. */
  issue: number;
  at: string;
  /** Where it's stuck, or null while it's still on the sheet. */
  placed: { issue: number; page: StickerPage; x: number; y: number; rot: number } | null;
};

/**
 * Every sticker the reader owns. Earning the same sticker twice for the same issue (a puzzle
 * solved again) gives one sticker, not two. A sticker's place is its latest placed/peeled event.
 */
export function stickersOf(events: readonly HabitEvent[]): OwnedSticker[] {
  const owned = new Map<string, OwnedSticker>();
  const seen = new Set<string>();
  for (const e of events) {
    if (e.type === "sticker_earned") {
      const k = `${e.issue}:${e.sticker}`;
      if (seen.has(k)) continue;
      seen.add(k);
      owned.set(e.id, { id: e.id, sticker: e.sticker, issue: e.issue, at: e.at, placed: null });
    } else if (e.type === "sticker_placed") {
      const s = owned.get(e.sticker);
      if (s) s.placed = { issue: e.issue, page: e.page, x: e.x, y: e.y, rot: e.rot };
    } else if (e.type === "sticker_peeled") {
      const s = owned.get(e.sticker);
      if (s) s.placed = null;
    }
  }
  return [...owned.values()];
}

export const samePage = (a: StickerPage, b: StickerPage) => String(a) === String(b);

// ——— Moods ———

/** The latest mood picked for each issue. */
export function moodsByIssue(events: readonly HabitEvent[]): Map<number, MoodId> {
  const out = new Map<number, MoodId>();
  for (const e of events) if (e.type === "mood") out.set(e.issue, e.mood);
  return out;
}

/** The latest mood for each edition date (from the mood's own date, or its finished edition). */
export function moodsByDate(events: readonly HabitEvent[]): Map<string, MoodId> {
  const dateOf = new Map<number, string>();
  for (const e of events) if (e.type === "edition_finished") dateOf.set(e.issue, e.date);
  const out = new Map<string, MoodId>();
  for (const e of events) {
    if (e.type !== "mood") continue;
    const date = e.date ?? dateOf.get(e.issue);
    if (date) out.set(date, e.mood);
  }
  return out;
}

// ——— Saved stories ———

export type SavedStory = {
  issue: number;
  slug: string;
  headline: string;
  kicker?: string;
  date?: string;
  at: string;
};

/** Stories kept, newest first. The latest save/unsave per story wins. */
export function savedStories(events: readonly HabitEvent[]): SavedStory[] {
  const out = new Map<string, SavedStory>();
  for (const e of events) {
    if (e.type !== "story_saved" && e.type !== "story_unsaved") continue;
    const k = `${e.issue}:${e.slug}`;
    if (e.type === "story_saved") {
      out.set(k, {
        issue: e.issue,
        slug: e.slug,
        headline: e.headline,
        kicker: e.kicker,
        date: e.date,
        at: e.at,
      });
    } else {
      out.delete(k);
    }
  }
  return [...out.values()].sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0));
}
