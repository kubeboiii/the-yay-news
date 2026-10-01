"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { useTurnKeys } from "../hooks/use-turn-keys";
import { HandArrow } from "./marks";
import "../riot.css";

/** One page of the paper, as the pager lists it (features/site/pager-pages' PagerPage fits). */
export type TrackPage = { order: number; label: string; href: string; colour: string };

/**
 * The page-turner: a mixtape J-card docked to the bottom of the screen. Every page is a numbered
 * track; Back on the left, and the biggest button is Next, naming the page it goes to. ← → keys
 * turn too. On a phone it folds to Back · 3/9 · Next. Links only: the caller owns the hrefs.
 */
export function Tracklist({
  pages,
  current,
  read = [],
  finished = false,
  doneHref,
  doneLabel,
  doneSub,
  side = "Side A",
  sideNote,
  label = "Pages in today's paper",
  mascot,
  keys = true,
  docked = true,
  scroll = false,
  className,
}: {
  pages: readonly TrackPage[];
  /** The `order` of the page on screen. */
  current: number;
  /** Orders already read. */
  read?: readonly number[];
  /** The whole paper's done (every track counts as read). */
  finished?: boolean;
  /** Where Next goes from the last page. */
  doneHref: string;
  doneLabel?: string;
  doneSub?: string;
  side?: string;
  /** Under the side label, e.g. "No. 46". */
  sideNote?: string;
  label?: string;
  /** Something sitting on the card (the mascot). Decorative. */
  mascot?: ReactNode;
  /** Arrow-key turning. Turn off when more than one pager is on screen. */
  keys?: boolean;
  /** Fixed to the bottom of the viewport; false lays it inline (kit sheets). */
  docked?: boolean;
  scroll?: boolean;
  className?: string;
}) {
  const i = Math.max(
    0,
    pages.findIndex((p) => p.order === current),
  );
  const now = pages[i];
  const prev = pages[i - 1];
  const next = pages[i + 1];
  useTurnKeys(keys ? prev?.href : undefined, keys ? next?.href : undefined);
  const isRead = (o: number) => finished || read.includes(o);
  return (
    <nav
      className={`rt-jcard ${docked ? "rt-jcard--docked" : ""} ${className ?? ""}`}
      aria-label={label}
    >
      <div className="rt-jcard__side" aria-hidden>
        <span>{side}</span>
        {sideNote ? <span>{sideNote}</span> : null}
      </div>
      {prev ? (
        <Link href={prev.href} scroll={scroll} className="rt-skip rt-skip--prev">
          <HandArrow
            seed="jc-prev"
            w={60}
            h={30}
            points={[
              [56, 16],
              [30, 13],
              [6, 15],
            ]}
            head={9}
            width={3.2}
            className="rt-skip__arrow"
          />
          <span className="rt-skip__label">
            Back <span className="rt-sr">to {prev.label}</span>
          </span>
        </Link>
      ) : (
        <span className="rt-skip rt-skip--prev rt-skip--off" aria-hidden>
          Start
        </span>
      )}
      <ol className="rt-tracks">
        {pages.map((p, k) => (
          <li key={p.order} style={{ "--tc": p.colour } as CSSProperties}>
            <Link
              href={p.href}
              scroll={scroll}
              className={`rt-track ${isRead(p.order) ? "is-read" : ""}`}
              aria-current={p.order === current ? "page" : undefined}
            >
              <span className="rt-track__n">{String(k + 1).padStart(2, "0")}</span>
              <span className="rt-track__name">{p.label}</span>
              {isRead(p.order) && p.order !== current ? (
                <span className="rt-sr">, read</span>
              ) : null}
            </Link>
          </li>
        ))}
      </ol>
      <p className="rt-jcard__now" aria-hidden>
        {i + 1}/{pages.length}
        <span>{now?.label}</span>
      </p>
      {next ? (
        <Link href={next.href} scroll={scroll} className="rt-skip rt-skip--next">
          <span className="rt-skip__label">
            Next
            <span className="rt-skip__what">
              {i + 2}. {next.label}
            </span>
          </span>
          <HandArrow
            seed="jc-next"
            w={60}
            h={30}
            points={[
              [4, 15],
              [30, 17],
              [54, 14],
            ]}
            head={9}
            width={3.2}
            className="rt-skip__arrow"
          />
        </Link>
      ) : (
        <Link href={doneHref} className="rt-skip rt-skip--next">
          <span className="rt-skip__label">
            {doneLabel ?? (finished ? "Finished" : "Done")}
            <span className="rt-skip__what">
              {doneSub ?? (finished ? "see your stamp" : "get your stamp")}
            </span>
          </span>
        </Link>
      )}
      {mascot ? (
        <span className="rt-jcard__mascot" aria-hidden>
          {mascot}
        </span>
      ) : null}
    </nav>
  );
}
