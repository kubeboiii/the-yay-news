"use client";

import {
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { play } from "@/features/sound";
import { record, useHabitsReady, useStickers } from "./api";
import { STICKERS, stickerDef } from "./catalogue";
import { type OwnedSticker, type StickerPage, samePage } from "./core";
import { habitFonts } from "./fonts";
import { hash, rng } from "./sketch";
import { StickerArt } from "./sticker-art";
import "./stickers.css";

// Stickers: earned by solving puzzles, kept on a backing sheet, peeled off and stuck anywhere on
// the paper, where they stay (per issue and page, as a share of the sheet's width and height, so
// they survive resizes). A stuck sticker can be moved or peeled off again (it goes back on the
// sheet). All of it is events in the habits log: sticker_earned, sticker_placed, sticker_peeled.

// ——— The sticker in your hand ———

type Hand = {
  owned: OwnedSticker;
  x: number;
  y: number;
  /** Picked up with a tap or a key: waiting for a tap (or Enter) on the paper. */
  waiting: boolean;
};

let hand: Hand | null = null;
const handListeners = new Set<() => void>();
const setHand = (next: Hand | null) => {
  hand = next;
  for (const l of handListeners) l();
};
const subscribeHand = (l: () => void) => {
  handListeners.add(l);
  return () => handListeners.delete(l);
};
const useHand = () =>
  useSyncExternalStore(
    subscribeHand,
    () => hand,
    () => null,
  );

/** A slight, stable tilt for a sticker. */
const tiltOf = (id: string) => Math.round((rng(hash(id))() * 2 - 1) * 9);

function StickerFace({
  owned,
  issue,
}: {
  owned: { sticker: string; issue: number };
  issue?: number;
}) {
  return (
    <span className="hb-vinyl">
      <StickerArt id={owned.sticker} issue={issue ?? owned.issue} />
    </span>
  );
}

/** Where on a layer a point falls, as shares of its box; null when it's not over one. */
function layerAt(x: number, y: number) {
  for (const el of document.elementsFromPoint(x, y)) {
    if (el instanceof HTMLElement && el.dataset.stickerLayer) {
      const r = el.getBoundingClientRect();
      return {
        el,
        issue: Number(el.dataset.issue),
        page: el.dataset.page ?? "",
        x: Math.min(0.98, Math.max(0.02, (x - r.left) / r.width)),
        y: Math.min(0.98, Math.max(0.02, (y - r.top) / r.height)),
      };
    }
  }
  return null;
}

function stick(owned: OwnedSticker, issue: number, page: StickerPage, x: number, y: number) {
  record({
    type: "sticker_placed",
    sticker: owned.id,
    issue,
    page,
    x: Math.round(x * 10000) / 10000,
    y: Math.round(y * 10000) / 10000,
    rot: tiltOf(owned.id),
  });
  play("press");
}

/** The sticker following the pointer while it's being carried. */
function HandView() {
  const h = useHand();
  const ready = useHabitsReady();
  useEffect(() => {
    if (!h) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setHand(null);
    };
    const onMove = (e: PointerEvent) => {
      if (hand?.waiting && e.pointerType === "mouse")
        setHand({ ...hand, x: e.clientX, y: e.clientY });
    };
    const onDown = (e: PointerEvent) => {
      // Tapping anything but the paper or the sheet puts the sticker back.
      const t = e.target;
      if (hand?.waiting && t instanceof Element && !t.closest("[data-sticker-layer], .hb-sheet")) {
        setHand(null);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown, true);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown, true);
    };
  }, [h]);
  if (!ready || !h) return null;
  const def = stickerDef(h.owned.sticker);
  return createPortal(
    <div
      className={`hb-hand ${habitFonts} ${h.waiting ? "is-waiting" : ""}`}
      style={
        {
          left: h.x,
          top: h.y,
          width: `${Math.max(64, def.w * 7)}px`,
          aspectRatio: `1 / ${def.ratio}`,
          "--st-rot": `${tiltOf(h.owned.id)}deg`,
        } as CSSProperties
      }
      aria-hidden
    >
      <StickerFace owned={h.owned} />
    </div>,
    document.body,
  );
}

// ——— The sheet ———

/**
 * The reader's sticker sheet: every sticker they own that isn't stuck anywhere, die-cut on a
 * glossy backing, plus the empty kiss-cut shapes of the ones still to earn. Press and drag one
 * onto the paper, or tap it and then tap the paper.
 */
export function StickerSheet({
  className,
  title = "Sticker sheet",
}: {
  className?: string;
  title?: string;
}) {
  const ready = useHabitsReady();
  const owned = useStickers();
  const h = useHand();
  const loose = useMemo(() => owned.filter((s) => !s.placed), [owned]);
  const have = useMemo(() => new Set(owned.map((s) => s.sticker)), [owned]);
  const toEarn = STICKERS.filter((d) => !have.has(d.id) && d.earnedBy !== "a bonus");
  const [peeling, setPeeling] = useState<string | null>(null);

  const pickUp = (s: OwnedSticker, e: ReactPointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const start = { x: e.clientX, y: e.clientY };
    let moved = false;
    setPeeling(s.id);
    play("sticker");
    const lift = window.setTimeout(() => setPeeling(null), 260);
    setHand({ owned: s, x: e.clientX, y: e.clientY, waiting: false });
    const move = (ev: PointerEvent) => {
      if (Math.hypot(ev.clientX - start.x, ev.clientY - start.y) > 8) moved = true;
      setHand({ owned: s, x: ev.clientX, y: ev.clientY, waiting: false });
    };
    const up = (ev: PointerEvent) => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.clearTimeout(lift);
      setPeeling(null);
      if (!moved) {
        // A tap: carry it until the reader taps the paper.
        setHand({ owned: s, x: ev.clientX, y: ev.clientY, waiting: true });
        return;
      }
      const at = layerAt(ev.clientX, ev.clientY);
      if (at) stick(s, at.issue, at.page, at.x, at.y);
      setHand(null);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  };

  const onKey = (s: OwnedSticker, e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    const r = e.currentTarget.getBoundingClientRect();
    play("sticker");
    setHand(
      hand?.owned.id === s.id
        ? null
        : { owned: s, x: r.left + r.width / 2, y: r.top, waiting: true },
    );
  };

  return (
    <section className={`hb-sheet ${habitFonts} ${className ?? ""}`} aria-label={title}>
      <header className="hb-sheet__head">
        <span className="hb-sheet__title">{title}</span>
        <span className="hb-sheet__sub">
          {h?.waiting
            ? "Now tap the paper where it should go (Esc to put it back)"
            : "Peel one off and stick it anywhere on the paper"}
        </span>
      </header>
      <ul className="hb-sheet__grid">
        {ready
          ? loose.map((s) => {
              const def = stickerDef(s.sticker);
              const held = h?.owned.id === s.id;
              return (
                <li key={s.id} className="hb-sheet__cell">
                  <span
                    className="hb-sheet__kiss"
                    style={{ width: `${def.w * 7}px`, aspectRatio: `1 / ${def.ratio}` }}
                    aria-hidden
                  />
                  <button
                    type="button"
                    className={`hb-sheet__sticker ${peeling === s.id ? "is-peeling" : ""} ${held ? "is-held" : ""}`}
                    style={
                      {
                        width: `${def.w * 7}px`,
                        aspectRatio: `1 / ${def.ratio}`,
                        "--st-rot": `${tiltOf(s.id)}deg`,
                      } as CSSProperties
                    }
                    aria-label={`${def.label} (from No. ${s.issue}). Press Enter to pick it up, then Enter on the paper to stick it.`}
                    aria-pressed={held}
                    onPointerDown={(e) => pickUp(s, e)}
                    onKeyDown={(e) => onKey(s, e)}
                  >
                    <StickerFace owned={s} />
                  </button>
                </li>
              );
            })
          : null}
        {toEarn.map((d) => (
          <li key={d.id} className="hb-sheet__cell hb-sheet__cell--empty">
            <span
              className="hb-sheet__ghost"
              style={{ width: `${d.w * 7}px`, aspectRatio: `1 / ${d.ratio}` }}
              aria-hidden
            >
              <StickerArt id={d.id} />
            </span>
            <span className="hb-sheet__earn">{d.hint ?? `Solve ${d.earnedBy}`}</span>
          </li>
        ))}
      </ul>
      {ready && loose.length === 0 && owned.length > 0 ? (
        <p className="hb-sheet__empty">
          All your stickers are stuck on the paper. Solve a puzzle for more.
        </p>
      ) : null}
      <HandView />
    </section>
  );
}

// ——— Stickers stuck on a page ———

/**
 * The stickers stuck on one page of one issue. Mount it inside the printed sheet (it fills its
 * nearest positioned ancestor) — `position: relative` on the sheet. It takes no clicks except on
 * the stickers themselves, until a sticker is being carried, when the whole page accepts it.
 */
export function StickerLayer({
  issue,
  page,
  className,
}: {
  issue: number;
  /** The page's order in the edition (or any stable key, e.g. "back"). */
  page: StickerPage;
  className?: string;
}) {
  const ready = useHabitsReady();
  const owned = useStickers();
  const h = useHand();
  const ref = useRef<HTMLDivElement>(null);
  const here = useMemo(
    () =>
      owned.filter((s) => s.placed && s.placed.issue === issue && samePage(s.placed.page, page)),
    [owned, issue, page],
  );
  const drop = (x: number, y: number) => {
    const el = ref.current;
    if (!hand || !el) return;
    const r = el.getBoundingClientRect();
    stick(
      hand.owned,
      issue,
      page,
      Math.min(0.98, Math.max(0.02, (x - r.left) / r.width)),
      Math.min(0.98, Math.max(0.02, (y - r.top) / r.height)),
    );
    setHand(null);
  };
  return (
    <div
      ref={ref}
      className={`hb-layer ${habitFonts} ${h ? "is-accepting" : ""} ${className ?? ""}`}
      data-sticker-layer="1"
      data-issue={issue}
      data-page={String(page)}
      onClick={(e) => {
        if (hand?.waiting) {
          e.preventDefault();
          e.stopPropagation();
          drop(e.clientX, e.clientY);
        }
      }}
      onKeyDown={(e) => {
        if (hand?.waiting && (e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) {
          e.preventDefault();
          const r = e.currentTarget.getBoundingClientRect();
          drop(
            r.left + r.width / 2,
            r.top + Math.min(r.height / 2, window.innerHeight / 2 - r.top),
          );
        }
      }}
      tabIndex={h?.waiting ? 0 : -1}
      role={h?.waiting ? "button" : undefined}
      aria-label={h?.waiting ? "Stick the sticker here" : undefined}
    >
      {ready ? here.map((s) => <Stuck key={s.id} owned={s} layer={ref} />) : null}
    </div>
  );
}

function Stuck({ owned, layer }: { owned: OwnedSticker; layer: RefObject<HTMLDivElement | null> }) {
  const def = stickerDef(owned.sticker);
  const placed = owned.placed!;
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const [open, setOpen] = useState(false);
  const [peeling, setPeeling] = useState(false);
  const x = drag?.x ?? placed.x;
  const y = drag?.y ?? placed.y;

  const peel = () => {
    setPeeling(true);
    play("sticker");
    window.setTimeout(() => record({ type: "sticker_peeled", sticker: owned.id }), 420);
  };
  const moveTo = (nx: number, ny: number) =>
    record({
      type: "sticker_placed",
      sticker: owned.id,
      issue: placed.issue,
      page: placed.page,
      x: Math.min(0.98, Math.max(0.02, nx)),
      y: Math.min(0.98, Math.max(0.02, ny)),
      rot: placed.rot,
    });

  const onPointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0 || hand) return;
    const el = layer.current;
    if (!el) return;
    e.preventDefault();
    const r = el.getBoundingClientRect();
    const start = { x: e.clientX, y: e.clientY };
    let moved = false;
    let last = { x: placed.x, y: placed.y };
    const move = (ev: PointerEvent) => {
      if (Math.hypot(ev.clientX - start.x, ev.clientY - start.y) > 6) moved = true;
      if (!moved) return;
      last = {
        x: Math.min(0.98, Math.max(0.02, placed.x + (ev.clientX - start.x) / r.width)),
        y: Math.min(0.98, Math.max(0.02, placed.y + (ev.clientY - start.y) / r.height)),
      };
      setDrag(last);
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      if (moved) {
        moveTo(last.x, last.y);
        play("press");
        setOpen(false);
      } else setOpen((o) => !o);
      setDrag(null);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    const step = e.shiftKey ? 0.05 : 0.01;
    const d: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const v = d[e.key];
    if (v) {
      e.preventDefault();
      moveTo(placed.x + v[0], placed.y + v[1]);
    } else if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      peel();
    }
  };

  return (
    <span
      className={`hb-stuck ${drag ? "is-moving" : ""} ${peeling ? "is-peeling" : ""}`}
      style={
        {
          left: `${x * 100}%`,
          top: `${y * 100}%`,
          width: `max(46px, ${def.w}%)`,
          aspectRatio: `1 / ${def.ratio}`,
          "--st-rot": `${placed.rot}deg`,
        } as CSSProperties
      }
    >
      <button
        type="button"
        className="hb-stuck__face"
        aria-label={`${def.label} sticker. Drag or use the arrow keys to move it; Delete peels it off.`}
        aria-expanded={open}
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
      >
        <StickerFace owned={owned} />
      </button>
      {open && !peeling ? (
        <button type="button" className="hb-stuck__peel" onClick={peel}>
          peel off
        </button>
      ) : null}
    </span>
  );
}
