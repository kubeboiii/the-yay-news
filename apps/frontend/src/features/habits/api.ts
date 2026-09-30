"use client";

// The reader's habits, kept on the device (no account): what they've read, solved, collected and
// saved. Everything is an append-only log of events (see core.ts), so a later Google sign-in can
// merge a device's log into an account by taking the union of events — nothing is overwritten.
//
// Storage: one localStorage entry, `yn-habits:v1`, holding { v: 1, device, events }. The device
// id is kept beside it in `yn-device`. The log is compacted past 4,000 events (see core.ts for
// what that drops and why no view changes), and again, harder, if the browser says it's full.
// When storage is blocked (private mode, a sandboxed frame) everything still works for the visit,
// kept in memory. The log only exists on the device: during server rendering every hook returns
// its empty value, so pages render a placeholder first and fill in after hydration.

import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  COMPACT_AT,
  compact,
  editionDateAt,
  type HabitDoc,
  type HabitEvent,
  mergeDocs,
  moodsByDate,
  moodsByIssue,
  type NewHabitEvent,
  parseDoc,
  savedStories,
  stampsOf,
  stickersOf,
  streakOf,
  finishedDates,
} from "./core";

export type {
  HabitDoc,
  HabitEvent,
  HabitEventType,
  MoodId,
  NewHabitEvent,
  OwnedSticker,
  SavedStory,
  StampInfo,
  StickerPage,
  Streak,
} from "./core";
export { MOODS, mergeDocs, mergeEvents } from "./core";

const REAL_LOG = "yn-habits:v1";
/** The review page's demo data lives here, never in the reader's real log. */
export const DEMO_LOG = "yn-habits:demo:v1";
const DEVICE = "yn-device";

let activeKey = REAL_LOG;
const listeners = new Set<() => void>();
const notify = () => {
  for (const l of listeners) l();
};

// ——— Ids ———

function randomId(): string {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    const b = crypto.getRandomValues(new Uint8Array(16));
    return Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  } catch {
    return `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
  }
}

let device: string | null = null;

/** This device's id, made once and remembered (in memory only when storage is blocked). */
export function deviceId(): string {
  if (device) return device;
  try {
    device = localStorage.getItem(DEVICE);
    if (!device) {
      device = randomId();
      localStorage.setItem(DEVICE, device);
    }
  } catch {
    device ??= randomId();
  }
  return device;
}

// ——— Reading and writing the document ———

const caches = new Map<string, { raw: string | null; doc: HabitDoc }>();
/** Documents that couldn't be written (storage blocked or full), kept for this visit. */
const memory = new Map<string, HabitDoc>();

function readDoc(key = activeKey): HabitDoc {
  const held = memory.get(key);
  if (held) return held;
  let raw: string | null;
  try {
    raw = localStorage.getItem(key);
  } catch {
    const doc = { v: 1 as const, device: deviceId(), events: [] };
    memory.set(key, doc);
    return doc;
  }
  const cached = caches.get(key);
  if (cached && cached.raw === raw) return cached.doc;
  const doc = parseDoc(raw, deviceId());
  caches.set(key, { raw, doc });
  return doc;
}

function writeDoc(doc: HabitDoc, key = activeKey): void {
  const attempt = (d: HabitDoc) => {
    const raw = JSON.stringify(d);
    localStorage.setItem(key, raw);
    caches.set(key, { raw, doc: d });
    memory.delete(key);
  };
  try {
    attempt(doc);
    return;
  } catch {
    // Full or blocked: compact and try once more, then fall back to memory.
  }
  const smaller = { ...doc, events: compact(doc.events, Date.now()) };
  try {
    attempt(smaller);
  } catch {
    memory.set(key, smaller);
  }
}

function append(events: HabitEvent[], key = activeKey) {
  const doc = readDoc(key);
  let next = [...doc.events, ...events];
  if (next.length > COMPACT_AT) next = compact(next, Date.now());
  writeDoc({ ...doc, device: doc.device || deviceId(), events: next }, key);
  notify();
}

function stamp(event: NewHabitEvent): HabitEvent {
  return {
    ...event,
    id: `${deviceId().slice(0, 8)}-${randomId()}`,
    at: new Date().toISOString(),
  } as HabitEvent;
}

/** Appends an event to the device's log. */
export function record(event: NewHabitEvent): void {
  append([stamp(event)]);
}

/**
 * Records an event only if no matching event is in the log yet (`same` decides what matches).
 * Returns whether it was recorded.
 */
export function recordOnce(event: NewHabitEvent, same: (e: HabitEvent) => boolean): boolean {
  if (readDoc().events.some(same)) return false;
  record(event);
  return true;
}

/** Gives the reader a sticker for an issue, once (solving a puzzle again doesn't add another). */
export function earnSticker(issue: number, sticker: string): boolean {
  return recordOnce(
    { type: "sticker_earned", issue, sticker },
    (e) => e.type === "sticker_earned" && e.issue === issue && e.sticker === sticker,
  );
}

/** The whole log as a document, for a future sign-in to upload. */
export function exportLog(): HabitDoc {
  return readDoc();
}

/** Merges another document (from an account or another device) into this device's log. */
export function importLog(other: HabitDoc): void {
  const doc = readDoc();
  writeDoc(mergeDocs({ ...doc, device: doc.device || deviceId() }, other));
  notify();
}

// ——— The demo log (review page only) ———

/** Points every habits hook and `record` at the demo log (true) or back at the real one. */
export function useDemoLogSwitch(): [boolean, (on: boolean) => void] {
  const on = useSyncExternalStore(
    subscribe,
    () => activeKey === DEMO_LOG,
    () => false,
  );
  const set = useCallback((next: boolean) => {
    activeKey = next ? DEMO_LOG : REAL_LOG;
    notify();
  }, []);
  return [on, set];
}

/** Replaces the demo log's events (never touches the real log). */
export function writeDemoLog(events: HabitEvent[]): void {
  writeDoc({ v: 1, device: deviceId(), events }, DEMO_LOG);
  notify();
}

// ——— Subscriptions and hooks ———

function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === activeKey || e.key.startsWith("yn-puzzle:")) l();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

const EMPTY: HabitEvent[] = [];
const getEvents = () => readDoc().events;
const serverEvents = () => EMPTY;

/** Every event on this device, oldest first (empty during server rendering). */
export function useHabitLog(): HabitEvent[] {
  return useSyncExternalStore(subscribe, getEvents, serverEvents);
}

const noop = () => () => {};

/** False on the server and during hydration, true once the device's log can be read. */
export function useHabitsReady(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

function subscribeClock(l: () => void) {
  const t = window.setInterval(l, 60_000);
  document.addEventListener("visibilitychange", l);
  return () => {
    window.clearInterval(t);
    document.removeEventListener("visibilitychange", l);
  };
}

/** Today's edition date on this device (07:00 local release), or null during server rendering. */
export function useEditionToday(): string | null {
  return useSyncExternalStore(
    subscribeClock,
    () => editionDateAt(new Date()),
    () => null,
  );
}

/** The reader's streak (see core.ts for the rules). `today` defaults to the device's date. */
export function useStreak(today?: string) {
  const events = useHabitLog();
  const deviceToday = useEditionToday();
  const day = today ?? deviceToday;
  return useMemo(() => (day ? streakOf(finishedDates(events), day) : null), [events, day]);
}

/** One stamp per finished edition, oldest first. */
export function useStamps() {
  const events = useHabitLog();
  return useMemo(() => stampsOf(events), [events]);
}

/** Every sticker owned, with where it's stuck. */
export function useStickers() {
  const events = useHabitLog();
  return useMemo(() => stickersOf(events), [events]);
}

/** Moods by edition date and by issue. */
export function useMoods() {
  const events = useHabitLog();
  return useMemo(() => ({ byDate: moodsByDate(events), byIssue: moodsByIssue(events) }), [events]);
}

/** Kept stories, newest first. */
export function useSavedStories() {
  const events = useHabitLog();
  return useMemo(() => savedStories(events), [events]);
}

/**
 * Work in progress on one puzzle (letters typed, words circled…), kept on the device so leaving
 * and coming back doesn't lose it. `key` should include the issue, e.g. "42:crossword".
 */
export function usePuzzleProgress<T>(key: string, initial: T): [T, (next: T) => void] {
  const storageKey = `yn-puzzle:${key}`;
  const read = useCallback((): string | null => {
    const held = progressMemory.get(storageKey);
    if (held !== undefined) return held;
    try {
      return localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  }, [storageKey]);
  const raw = useSyncExternalStore(subscribe, read, () => null);
  const value = useMemo(() => {
    if (!raw) return initial;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return initial;
    }
    // `initial` is only the fallback; a new literal each render shouldn't re-parse.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raw]);
  const set = useCallback(
    (next: T) => {
      const json = JSON.stringify(next);
      try {
        localStorage.setItem(storageKey, json);
        progressMemory.delete(storageKey);
      } catch {
        // Storage blocked: progress lasts for this page view only.
        progressMemory.set(storageKey, json);
      }
      notify();
    },
    [storageKey],
  );
  return [value, set];
}

const progressMemory = new Map<string, string>();
