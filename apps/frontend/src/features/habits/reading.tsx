"use client";

import type { Edition } from "@repo/shared";
import { type RefObject, useCallback, useEffect, useMemo, useState } from "react";
import { play } from "@/features/sound";
import { earnSticker, exportLog, recordOnce, useHabitLog, useHabitsReady } from "./api";
import { ALL_SOLVED_STICKER } from "./catalogue";
import {
  finishedDates,
  finishes,
  isFinished,
  pagesRead,
  READ_DWELL_MS,
  SKIM_DWELL_MS,
  type StampInfo,
  solvedByIssue,
  stampsOf,
  streakOf,
} from "./core";
import { StampMoment } from "./stamp-moment";

// What counts as reading (the rules are in core.ts):
//   · a page is read after READ_DWELL_MS (6 s) on screen while the tab is visible, or after
//     SKIM_DWELL_MS (3 s) if the reader has also scrolled to the end of it;
//   · an edition is finished once its back page and more than half its pages have been read.
// Each is recorded once per edition, however many times the reader comes back.

type EditionLike = Pick<Edition, "issueNumber" | "date" | "design" | "colourway"> & {
  pages: readonly { order: number; layout: string }[];
  puzzles: readonly { type: string }[];
};

export type ReadingState = {
  /** This page has been read (false during server rendering). */
  read: boolean;
  /** The edition has been finished (on this visit or before). */
  finished: boolean;
  /** Pages of this edition read so far. */
  pagesRead: number;
  /** The stamp, set only when the edition was finished during this visit. */
  justFinished: StampInfo | null;
  /** The streak including the finished paper, alongside `justFinished`. */
  streak: number | null;
  dismiss: () => void;
};

const puzzleCount = (e: EditionLike) => e.puzzles.filter((p) => p.type !== "fortune_teller").length;

/** Records the edition as finished if its read pages now finish it. Returns its stamp if so. */
function finishIfDone(edition: EditionLike): StampInfo | null {
  const events = exportLog().events;
  const issue = edition.issueNumber;
  if (isFinished(events, issue)) return null;
  const back =
    edition.pages.find((p) => p.layout === "back")?.order ??
    Math.max(...edition.pages.map((p) => p.order));
  if (!finishes(pagesRead(events, issue), edition.pages.length, back)) return null;
  const done = recordOnce(
    {
      type: "edition_finished",
      issue,
      date: edition.date,
      design: edition.design,
      colourway: edition.colourway,
      puzzles: puzzleCount(edition),
    },
    (e) => e.type === "edition_finished" && e.issue === issue,
  );
  if (!done) return null;
  return stampsOf(exportLog().events).find((s) => s.issue === issue) ?? null;
}

/**
 * Watches one page of an edition being read, and records `page_read` and `edition_finished`.
 * `target` is the page's element (defaults to the whole document): it must be on screen for its
 * time to count, and "scrolled to the end" means its bottom has come into view.
 */
export function useReadingTracker({
  edition,
  page,
  target,
}: {
  edition: EditionLike;
  /** The page being read (its `order` is what's recorded). */
  page: { order: number };
  target?: RefObject<HTMLElement | null>;
}): ReadingState {
  const events = useHabitLog();
  const ready = useHabitsReady();
  const issue = edition.issueNumber;
  const order = page.order;
  const read = useMemo(() => pagesRead(events, issue), [events, issue]);
  const finished = useMemo(() => isFinished(events, issue), [events, issue]);
  const [justFinished, setJustFinished] = useState<StampInfo | null>(null);
  const alreadyRead = read.has(order);

  // Every puzzle solved: the "Finished it!" sticker, once.
  const solved = useMemo(() => solvedByIssue(events).get(issue)?.size ?? 0, [events, issue]);
  const need = puzzleCount(edition);
  useEffect(() => {
    if (ready && need > 0 && solved >= need) earnSticker(issue, ALL_SOLVED_STICKER);
  }, [ready, need, solved, issue]);

  useEffect(() => {
    if (!ready) return;
    if (alreadyRead) {
      // Read before (perhaps on another visit): the edition may still need finishing.
      const t = window.setTimeout(() => {
        const s = finishIfDone(edition);
        if (s) setJustFinished(s);
      }, 0);
      return () => window.clearTimeout(t);
    }
    let shown = 0;
    let last = performance.now();
    let inView = true;
    let reachedEnd = false;
    const el = target?.current ?? null;
    let io: IntersectionObserver | null = null;
    if (el && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        ([entry]) => {
          inView = !!entry && entry.isIntersecting && entry.intersectionRatio > 0.05;
        },
        { threshold: [0, 0.05, 0.25] },
      );
      io.observe(el);
    }
    const checkEnd = () => {
      if (reachedEnd) return;
      const bottom = el
        ? el.getBoundingClientRect().bottom
        : document.documentElement.scrollHeight - window.scrollY;
      if (bottom <= window.innerHeight + 80) reachedEnd = true;
    };
    const tick = () => {
      const now = performance.now();
      if (document.visibilityState === "visible" && inView) shown += Math.min(now - last, 1500);
      last = now;
      checkEnd();
      if (shown >= READ_DWELL_MS || (reachedEnd && shown >= SKIM_DWELL_MS)) {
        window.clearInterval(timer);
        recordOnce(
          { type: "page_read", issue, page: order },
          (e) => e.type === "page_read" && e.issue === issue && e.page === order,
        );
        const s = finishIfDone(edition);
        if (s) setJustFinished(s);
      }
    };
    const timer = window.setInterval(tick, 500);
    window.addEventListener("scroll", checkEnd, { passive: true });
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("scroll", checkEnd);
      io?.disconnect();
    };
    // `edition` is identified by its issue; a new object for the same issue shouldn't restart.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, alreadyRead, issue, order, target]);

  const streak = useMemo(() => {
    if (!justFinished) return null;
    return streakOf(finishedDates(events), justFinished.date).current;
  }, [events, justFinished]);

  const dismiss = useCallback(() => setJustFinished(null), []);
  return {
    read: ready && alreadyRead,
    finished: ready && finished,
    pagesRead: ready ? read.size : 0,
    justFinished,
    streak,
    dismiss,
  };
}

/**
 * Drop-in for any page of an edition: tracks reading, and when the edition is finished during
 * this visit, slides in the stamping card. Renders nothing otherwise.
 */
export function ReadingTracker({
  edition,
  page,
  target,
}: {
  edition: EditionLike;
  page: { order: number };
  target?: RefObject<HTMLElement | null>;
}) {
  const state = useReadingTracker({ edition, page, target });
  const { justFinished, dismiss } = state;
  useEffect(() => {
    if (!justFinished) return;
    play("rustle");
    const t = window.setTimeout(dismiss, 12000);
    return () => window.clearTimeout(t);
  }, [justFinished, dismiss]);
  if (!justFinished) return null;
  return <StampMoment stamp={justFinished} streak={state.streak} onClose={dismiss} />;
}
