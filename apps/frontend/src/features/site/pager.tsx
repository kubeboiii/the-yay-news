"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useEditionToday, useHabitLog, useHabitsReady } from "@/features/habits/api";
import { isFinished, pagesRead } from "@/features/habits/core";
import { issueHref } from "@/features/papers/reading";
import { SoundToggle } from "@/features/sound/sound-toggle";
import type { PagerPage } from "./pager-pages";
import "./pager.css";

// Where you are in the paper, at the foot of every page: back a page, "Page 4 of 13 · Music"
// (tap it for every page of the edition, with the ones you've read ticked), forward a page, and a
// thin edge along the bottom that fills as you read. On the back page, forward becomes the fold:
// "3 pages to go" until the paper is finished, then "Fold it", which closes up shop for the day
// (or, for an older paper, puts it back on the pile).

type Props = { issue: number; date: string; pages: PagerPage[]; current: number };

function AllPages({
  issue,
  pages,
  current,
  read,
  onClose,
}: Props & { read: Set<number>; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    panel.current?.focus();
  }, []);
  return (
    <div className="yp-all">
      <button type="button" className="yp-all__scrim" aria-label="Close" onClick={onClose} />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={`Every page of No. ${issue}`}
        tabIndex={-1}
        className="yp-all__panel"
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
      >
        <div className="yp-all__head">
          <p className="yp-all__title">All pages · No. {issue}</p>
          <button type="button" className="yp-round" aria-label="Close" onClick={onClose}>
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <ol className="yp-all__grid">
          {pages.map((p, i) => {
            const here = p.order === current;
            return (
              <li key={p.order}>
                <Link
                  href={p.href}
                  className="yp-tile"
                  aria-current={here ? "page" : undefined}
                  onClick={onClose}
                >
                  <span className="yp-tile__ink" style={{ background: p.colour }} aria-hidden />
                  <span className="yp-tile__n">{i + 1}</span>
                  <span className="yp-tile__label">{p.label}</span>
                  <span className="yp-tile__state">
                    {here ? "You're here" : read.has(p.order) ? "Read" : "Not yet"}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
        <div className="yp-all__foot">
          <Link href={`${issueHref(issue)}/print`} className="yp-link">
            Printable edition
          </Link>
          <SoundToggle />
        </div>
      </div>
    </div>
  );
}

export function Pager(props: Props) {
  const { issue, date, pages, current } = props;
  const events = useHabitLog();
  const ready = useHabitsReady();
  const today = useEditionToday();
  const [open, setOpen] = useState(false);
  const read = useMemo(() => pagesRead(events, issue), [events, issue]);
  const finished = ready && isFinished(events, issue);
  const i = Math.max(
    0,
    pages.findIndex((p) => p.order === current),
  );
  const prev = pages[i - 1] ?? null;
  const next = pages[i + 1] ?? null;
  const here = pages[i]!;
  const left = pages.filter((p) => !read.has(p.order) && p.order !== current);
  const firstLeft = left[0] ?? null;
  const isToday = today !== null && date >= today;
  const progress = pages.length ? Math.round((read.size / pages.length) * 100) : 0;

  let forward;
  if (next) {
    forward = (
      <Link href={next.href} rel="next" className="yp-step" aria-label={`Next page: ${next.label}`}>
        <span className="yp-step__label">{next.label}</span>
        <svg viewBox="0 0 24 24" aria-hidden>
          <path d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    );
  } else if (finished) {
    forward = (
      <Link href={isToday ? "/" : "/pile"} className="yp-fold">
        {isToday ? "Fold it · close up shop" : "Fold it · back on the pile"}
      </Link>
    );
  } else if (ready && firstLeft) {
    forward = (
      <Link href={firstLeft.href} className="yp-fold yp-fold--todo">
        {left.length} page{left.length === 1 ? "" : "s"} to go
      </Link>
    );
  } else {
    forward = <span className="yp-step yp-step--off" aria-hidden />;
  }

  return (
    <>
      <nav aria-label="Pages" className="yp-bar">
        {prev ? (
          <Link
            href={prev.href}
            rel="prev"
            className="yp-step yp-step--back"
            aria-label={`Previous page: ${prev.label}`}
          >
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </Link>
        ) : (
          <span className="yp-step yp-step--off" aria-hidden />
        )}
        <button
          type="button"
          className="yp-where"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
        >
          <svg viewBox="0 0 24 24" aria-hidden>
            <rect x="3.5" y="3.5" width="7" height="7" />
            <rect x="13.5" y="3.5" width="7" height="7" />
            <rect x="3.5" y="13.5" width="7" height="7" />
            <rect x="13.5" y="13.5" width="7" height="7" />
          </svg>
          <span>
            Page {i + 1} of {pages.length}
            <span className="yp-where__label"> · {here.label}</span>
          </span>
        </button>
        {forward}
        <span className="yp-edge" style={{ width: `${progress}%` }} aria-hidden />
      </nav>
      {open ? <AllPages {...props} read={read} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
