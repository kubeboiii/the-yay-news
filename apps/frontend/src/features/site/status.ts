"use client";

import { useMemo } from "react";
import { useHabitLog } from "@/features/habits/api";
import { editionDateAt, type HabitEvent, stampsOf } from "@/features/habits/core";

// What the reader has done with each paper, from the habits log on this device. A paper is
// STAMPED when finished, LATE when it was finished after its own date had passed (the streak still
// counts it by the date printed on it; "late" is only how the stamp looks), STARTED when any page
// has been read, and UNREAD otherwise.

export type PaperState = "stamped" | "late" | "started" | "unread";

export type PaperStatus = {
  state: PaperState;
  /** Pages read so far (by page order). */
  pages: number;
};

export function statusesOf(events: readonly HabitEvent[]): Map<number, PaperStatus> {
  const out = new Map<number, PaperStatus>();
  const pages = new Map<number, Set<number>>();
  for (const e of events) {
    if (e.type !== "page_read") continue;
    const set = pages.get(e.issue) ?? new Set<number>();
    set.add(e.page);
    pages.set(e.issue, set);
  }
  for (const [issue, set] of pages) out.set(issue, { state: "started", pages: set.size });
  for (const s of stampsOf(events)) {
    const late = editionDateAt(new Date(s.at)) > s.date;
    out.set(s.issue, { state: late ? "late" : "stamped", pages: pages.get(s.issue)?.size ?? 0 });
  }
  return out;
}

const UNREAD: PaperStatus = { state: "unread", pages: 0 };

/** Every paper's status on this device (empty during server rendering). */
export function usePaperStatuses(): (issue: number) => PaperStatus {
  const events = useHabitLog();
  const map = useMemo(() => statusesOf(events), [events]);
  return (issue: number) => map.get(issue) ?? UNREAD;
}

/** The date of the reader's first recorded action, or null for a first visit. */
export function useFirstSeen(): string | null {
  const events = useHabitLog();
  return useMemo(() => {
    const first = events[0];
    return first ? editionDateAt(new Date(first.at)) : null;
  }, [events]);
}

export const STATE_LABEL: Record<PaperState, string> = {
  stamped: "Stamped",
  late: "Read late",
  started: "Dog-eared",
  unread: "Unread",
};
