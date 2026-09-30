"use client";

import {
  type AnimationEvent,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  useCallback,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { play } from "@/features/sound";

// A little booklet whose pages turn like paper: on a wide screen it lies open as a spread (the
// cover alone on the right when shut), on a phone it shows one page at a time. A turning page is
// a leaf hinged at the spine, printed on both sides, with the light falling across it as it goes.

const WIDE = "(min-width: 760px)";
const subscribeWide = (l: () => void) => {
  const mq = window.matchMedia(WIDE);
  mq.addEventListener("change", l);
  return () => mq.removeEventListener("change", l);
};
const useWide = () =>
  useSyncExternalStore(
    subscribeWide,
    () => window.matchMedia(WIDE).matches,
    () => true,
  );

const reduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type Turn = { dir: 1 | -1; to: number };

export function Book({
  pages,
  label,
  start = 0,
  className,
}: {
  /** pages[0] is the front cover; the rest are the inside pages in order. */
  pages: ReactNode[];
  label: string;
  /** The page to open at. */
  start?: number;
  className?: string;
}) {
  const wide = useWide();
  const [page, setPage] = useState(start);
  const [turn, setTurn] = useState<Turn | null>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const last = pages.length - 1;

  // A spread s shows pages 2s−1 (left) and 2s (right); the shut book is spread 0.
  const spread = Math.ceil(page / 2);
  const lastSpread = Math.ceil(last / 2);
  const at = (i: number) => (i >= 0 && i <= last ? pages[i] : null);

  const canNext = wide ? spread < lastSpread : page < last;
  const canPrev = wide ? spread > 0 : page > 0;

  const go = useCallback(
    (dir: 1 | -1) => {
      if (turn) return;
      const to = wide
        ? Math.max(0, 2 * (spread + dir) - 1)
        : Math.min(last, Math.max(0, page + dir));
      if (to === page || (wide && spread + dir < 0) || (wide && spread + dir > lastSpread)) return;
      play("rustle");
      if (reduced()) setPage(to);
      else setTurn({ dir, to });
    },
    [turn, wide, spread, last, page, lastSpread],
  );

  const done = (e: AnimationEvent) => {
    if (e.target !== e.currentTarget || !turn) return;
    setPage(turn.to);
    setTurn(null);
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  };
  const onDown = (e: PointerEvent) => {
    swipe.current = { x: e.clientX, y: e.clientY };
  };
  const onUp = (e: PointerEvent) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(e.clientY - s.y) * 1.5) go(dx < 0 ? 1 : -1);
  };

  let left: ReactNode = null;
  let right: ReactNode;
  let front: ReactNode = null;
  let back: ReactNode = null;
  if (wide) {
    const s = spread;
    const t = turn ? Math.ceil(turn.to / 2) : s;
    if (!turn) {
      left = s > 0 ? at(2 * s - 1) : null;
      right = at(2 * s);
    } else if (turn.dir === 1) {
      left = s > 0 ? at(2 * s - 1) : null;
      right = at(2 * t);
      front = at(2 * s);
      back = at(2 * t - 1);
    } else {
      left = t > 0 ? at(2 * t - 1) : null;
      right = at(2 * s);
      front = at(2 * t);
      back = at(2 * s - 1);
    }
  } else {
    if (!turn) right = at(page);
    else if (turn.dir === 1) {
      right = at(turn.to);
      front = at(page);
    } else {
      right = at(page);
      front = at(turn.to);
    }
  }
  const shut = wide && (turn ? Math.ceil(turn.to / 2) : spread) === 0;

  const where = wide
    ? spread === 0
      ? "Front cover"
      : `Pages ${2 * spread - 1}–${Math.min(2 * spread, last)} of ${last}`
    : page === 0
      ? "Front cover"
      : `Page ${page} of ${last}`;

  return (
    <div
      className={`hb-book ${wide ? "is-wide" : "is-single"} ${shut ? "is-shut" : ""} ${className ?? ""}`}
      role="region"
      aria-roledescription="booklet"
      aria-label={label}
      onKeyDown={onKey}
    >
      <div className="hb-book__stage" onPointerDown={onDown} onPointerUp={onUp}>
        {wide ? (
          <div className="hb-book__half hb-book__half--left" aria-hidden={!!turn}>
            {left ? <div className="hb-book__page hb-book__page--left">{left}</div> : null}
          </div>
        ) : null}
        <div className="hb-book__half hb-book__half--right">
          {right ? <div className="hb-book__page hb-book__page--right">{right}</div> : null}
          {turn ? (
            <div
              className={`hb-book__leaf ${turn.dir === 1 ? "turn-next" : "turn-prev"}`}
              onAnimationEnd={done}
              aria-hidden
            >
              <div className="hb-book__face hb-book__face--front">
                <div className="hb-book__page hb-book__page--right">{front}</div>
                <span className="hb-book__light" />
              </div>
              <div className="hb-book__face hb-book__face--back">
                {back ? (
                  <div className="hb-book__page hb-book__page--left">{back}</div>
                ) : (
                  <div className="hb-book__page hb-book__page--left hb-book__page--blank" />
                )}
                <span className="hb-book__light" />
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <div className="hb-book__controls">
        <button
          type="button"
          className="hb-book__turn"
          onClick={() => go(-1)}
          disabled={!canPrev || !!turn}
        >
          <span aria-hidden>←</span> turn back
        </button>
        <span className="hb-book__where" aria-live="polite">
          {where}
        </span>
        <button
          type="button"
          className="hb-book__turn"
          onClick={() => go(1)}
          disabled={!canNext || !!turn}
        >
          {spread === 0 && page === 0 ? "open it" : "turn over"} <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}
