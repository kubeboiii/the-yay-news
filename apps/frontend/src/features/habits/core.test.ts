// Unit tests for the pure habits logic. No test runner is installed in the frontend, so these use
// Node's own: `node --test src/features/habits/core.test.ts` (Node 24 strips the types).

import assert from "node:assert/strict";
import { test } from "node:test";
import {
  addDays,
  compact,
  editionDateAt,
  finishes,
  type HabitEvent,
  mergeEvents,
  type NewHabitEvent,
  moodsByDate,
  parseDoc,
  runsOf,
  savedStories,
  stampsOf,
  stickersOf,
  streakOf,
} from "./core.ts";

let n = 0;
const ev = (e: NewHabitEvent & { at?: string; id?: string }): HabitEvent =>
  ({
    ...e,
    id: e.id ?? `e${++n}`,
    at: e.at ?? `2026-09-${String(10 + (n % 20)).padStart(2, "0")}T08:00:00.000Z`,
  }) as HabitEvent;

const finished = (date: string, issue: number, at = `${date}T09:00:00.000Z`) =>
  ev({ type: "edition_finished", issue, date, design: "broadsheet", colourway: "original", at });

const dates = (...ds: string[]) => new Set(ds);

test("merge is a union by id, in (at, id) order", () => {
  const a = [ev({ id: "b", at: "2026-01-02T00:00:00Z", type: "page_read", issue: 1, page: 1 })];
  const b = [
    ev({ id: "a", at: "2026-01-02T00:00:00Z", type: "page_read", issue: 1, page: 2 }),
    ev({ id: "c", at: "2026-01-01T00:00:00Z", type: "page_read", issue: 1, page: 3 }),
    a[0]!,
  ];
  const m = mergeEvents(a, b);
  assert.deepEqual(
    m.map((e) => e.id),
    ["c", "a", "b"],
  );
});

test("merge is commutative, associative and idempotent", () => {
  const x = [finished("2026-09-01", 1), finished("2026-09-02", 2)];
  const y = [finished("2026-09-03", 3), x[0]!];
  const z = [finished("2026-09-02", 2, "2026-09-05T00:00:00Z")];
  const ids = (l: HabitEvent[]) => l.map((e) => e.id);
  assert.deepEqual(ids(mergeEvents(x, y)), ids(mergeEvents(y, x)));
  assert.deepEqual(ids(mergeEvents(mergeEvents(x, y), z)), ids(mergeEvents(x, mergeEvents(y, z))));
  assert.deepEqual(ids(mergeEvents(x, x)), ids(mergeEvents(x)));
});

test("parseDoc reads v1 documents, v0 bare arrays and garbage", () => {
  const e = finished("2026-09-01", 1);
  assert.equal(parseDoc(JSON.stringify([e]), "dev").events.length, 1);
  const doc = parseDoc(JSON.stringify({ v: 1, device: "abc", events: [e, { nope: 1 }] }), "dev");
  assert.equal(doc.device, "abc");
  assert.equal(doc.events.length, 1);
  assert.deepEqual(parseDoc("{not json", "dev").events, []);
  assert.deepEqual(parseDoc(null, "dev").events, []);
});

test("streak counts consecutive edition dates, and today's paper never breaks it", () => {
  const d = dates("2026-09-26", "2026-09-27", "2026-09-28", "2026-09-29");
  assert.equal(streakOf(d, "2026-09-29").current, 4);
  assert.equal(streakOf(d, "2026-09-29").doneToday, true);
  // Today (the 30th) not read yet: still 4.
  assert.equal(streakOf(d, "2026-09-30").current, 4);
  assert.equal(streakOf(d, "2026-09-30").doneToday, false);
});

test("one missed paper in seven days is a rest day", () => {
  // Missed the 28th.
  const d = dates("2026-09-25", "2026-09-26", "2026-09-27", "2026-09-29", "2026-09-30");
  const s = streakOf(d, "2026-09-30");
  assert.equal(s.current, 5);
  assert.deepEqual(s.restDays, ["2026-09-28"]);
  // Yesterday missed and today not read yet: yesterday is the rest day.
  const s2 = streakOf(dates("2026-09-27", "2026-09-28"), "2026-09-30");
  assert.equal(s2.current, 2);
  assert.deepEqual(s2.restDays, ["2026-09-29"]);
});

test("two misses in a row, or two within seven days, end the streak", () => {
  assert.equal(streakOf(dates("2026-09-26", "2026-09-27"), "2026-09-30").current, 0);
  // Missed the 24th and the 28th: only the run after the second miss counts.
  const d = dates(
    "2026-09-22",
    "2026-09-23",
    "2026-09-25",
    "2026-09-26",
    "2026-09-27",
    "2026-09-29",
  );
  const s = streakOf(d, "2026-09-29");
  assert.equal(s.current, 4);
  // Misses eight days apart are both forgiven.
  const far = dates(
    "2026-09-18",
    "2026-09-19",
    "2026-09-21",
    "2026-09-22",
    "2026-09-23",
    "2026-09-24",
    "2026-09-25",
    "2026-09-26",
    "2026-09-27",
    "2026-09-28",
    "2026-09-30",
  );
  assert.equal(streakOf(far, "2026-09-30").current, 11);
});

test("best streak and runs use the same rules walking forwards", () => {
  const d = dates("2026-09-01", "2026-09-02", "2026-09-03", "2026-09-10", "2026-09-11");
  const runs = runsOf(d);
  assert.equal(runs.get("2026-09-03"), 3);
  assert.equal(runs.get("2026-09-10"), 1);
  assert.equal(streakOf(d, "2026-09-30").best, 3);
  assert.equal(streakOf(d, "2026-09-30").current, 0);
  const rest = runsOf(dates("2026-09-01", "2026-09-02", "2026-09-04"));
  assert.equal(rest.get("2026-09-04"), 3);
});

test("editions land at 07:00 local", () => {
  assert.equal(editionDateAt(new Date(2026, 8, 30, 6, 59)), "2026-09-29");
  assert.equal(editionDateAt(new Date(2026, 8, 30, 7, 0)), "2026-09-30");
  assert.equal(addDays("2026-12-31", 1), "2027-01-01");
});

test("finishing needs the back page and more than half the pages", () => {
  assert.equal(finishes(new Set([1, 2, 3, 8]), 8, 8), false);
  assert.equal(finishes(new Set([1, 2, 3, 4, 8]), 8, 8), true);
  assert.equal(finishes(new Set([1, 2, 3, 4, 5]), 8, 8), false);
});

test("stamps: one per edition, with first, weekend, milestone and all-solved marks", () => {
  const log = [
    finished("2026-09-25", 40),
    finished("2026-09-26", 41),
    finished("2026-09-27", 42),
    finished("2026-09-27", 42),
    { ...finished("2026-09-28", 43), puzzles: 2 } as HabitEvent,
    ev({ type: "puzzle_solved", issue: 43, puzzle: "crossword" }),
    ev({ type: "puzzle_solved", issue: 43, puzzle: "riddle" }),
    ev({ type: "puzzle_solved", issue: 43, puzzle: "riddle" }),
  ];
  const s = stampsOf(log);
  assert.equal(s.length, 4);
  assert.equal(s[0]!.first, true);
  assert.equal(s[1]!.weekend, true); // Saturday
  assert.equal(s[2]!.milestone, 3);
  assert.equal(s[3]!.allSolved, true);
  assert.equal(s[2]!.allSolved, false);
});

test("stickers: earned once per issue, placed and peeled by the latest event", () => {
  const earned = ev({
    type: "sticker_earned",
    issue: 42,
    sticker: "star",
    at: "2026-09-01T00:00:00Z",
  });
  const log = [
    earned,
    ev({ type: "sticker_earned", issue: 42, sticker: "star", at: "2026-09-01T00:01:00Z" }),
    ev({
      type: "sticker_placed",
      sticker: earned.id,
      issue: 42,
      page: 1,
      x: 0.2,
      y: 0.3,
      rot: 4,
      at: "2026-09-02T00:00:00Z",
    }),
    ev({
      type: "sticker_placed",
      sticker: earned.id,
      issue: 42,
      page: 1,
      x: 0.5,
      y: 0.5,
      rot: 4,
      at: "2026-09-03T00:00:00Z",
    }),
  ];
  const s = stickersOf(log);
  assert.equal(s.length, 1);
  assert.equal(s[0]!.placed?.x, 0.5);
  const peeled = stickersOf([
    ...log,
    ev({ type: "sticker_peeled", sticker: earned.id, at: "2026-09-04T00:00:00Z" }),
  ]);
  assert.equal(peeled[0]!.placed, null);
});

test("saved stories: latest wins, unsave is a tombstone that survives compaction and merge", () => {
  const saved = ev({
    type: "story_saved",
    issue: 42,
    slug: "otters",
    headline: "Otters",
    at: "2026-09-01T00:00:00Z",
  });
  const unsaved = ev({
    type: "story_unsaved",
    issue: 42,
    slug: "otters",
    at: "2026-09-02T00:00:00Z",
  });
  assert.equal(savedStories([saved]).length, 1);
  assert.equal(savedStories([saved, unsaved]).length, 0);
  const compacted = compact([saved, unsaved], Date.parse("2026-09-03T00:00:00Z"));
  assert.equal(compacted.length, 1);
  // Another device that only saw the save: merging must not bring the story back.
  assert.equal(savedStories(mergeEvents(compacted, [saved])).length, 0);
});

test("compaction keeps every derived view the same", () => {
  const now = Date.parse("2026-12-30T00:00:00Z");
  const log = [
    ev({ type: "page_read", issue: 1, page: 1, at: "2026-09-01T00:00:00Z" }),
    ev({ type: "page_read", issue: 99, page: 1, at: "2026-12-29T00:00:00Z" }),
    finished("2026-09-01", 1),
    ev({ type: "mood", issue: 1, mood: "calm", date: "2026-09-01", at: "2026-09-01T10:00:00Z" }),
    ev({ type: "mood", issue: 1, mood: "wow", date: "2026-09-01", at: "2026-09-01T11:00:00Z" }),
  ];
  const c = compact(log, now);
  assert.equal(c.length, 3);
  assert.deepEqual(
    stampsOf(c).map((s) => s.issue),
    stampsOf(log).map((s) => s.issue),
  );
  assert.deepEqual([...moodsByDate(c)], [...moodsByDate(log)]);
});
