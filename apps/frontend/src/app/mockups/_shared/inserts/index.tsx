"use client";

// The insert tucked inside each edition: one printed thing per issue — a guest artist's print, a
// sticker sheet, a coupon, a postcard, a page to colour, or a fold-out poster. It peeks out of the
// paper as a slip of different stock with a printed tab; pulled out, it lands on the desk as an
// object of its own, and tucks back in when you are done with it.
//
// ?insert=<print|stickers|coupon|postcard|colouring|poster> previews a type. For still
// screenshots: ?insert-open=1 pulls it out on load, ?insert-side=back turns the postcard over,
// ?insert-torn=1 tears the coupon.

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent, RefObject } from "react";
import { createPortal } from "react-dom";
import { currentIssue, seeded } from "../edition-seed";
import { insertForIssue, parseInsertType, posterForIssue, tabLabel, type InsertType } from "./data";
import {
  ArtPrintInsert,
  ColouringInsert,
  CouponInsert,
  PostcardInsert,
  PosterInsert,
  StickerSheetInsert,
} from "./pieces";
import {
  StickerArt,
  readPlaced,
  savePlaced,
  stickerById,
  stickerDefs,
  type Placed,
} from "./stickers";
import { themeFor, themeVars } from "./themes";
import "./inserts.css";

type Setup = {
  issue: number;
  type: InsertType;
  wrap: HTMLElement;
  path: string;
  openOnLoad: boolean;
  postcardBack: boolean;
  couponTorn: boolean;
};

const NARROW = 760;
const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Width a sticker keeps in the hand: its share of the sheet, at the sheet's printed size. */
const sheetWidth = () => Math.min(440, window.innerWidth - 24);
const stickerPx = (id: string) => ((stickerById(id)?.w ?? 25) / 100) * sheetWidth();

export function EditionInsert({ version }: { version: string }) {
  const pathname = usePathname();
  const [setup, setSetup] = useState<Setup | null>(null);
  const [open, setOpen] = useState(false);
  const [placed, setPlaced] = useState<Placed[]>([]);
  const slipRef = useRef<HTMLButtonElement>(null);
  const theme = themeFor(version);
  const vars = useMemo(() => themeVars(theme), [theme]);

  useEffect(() => {
    const wrap = document.querySelector<HTMLElement>(".print-sheet-wrap, .yn-sheet-wrap");
    if (!wrap) {
      // The insert attaches to the printed sheet, which only exists in the DOM after mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reads the rendered page
      setSetup(null);
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const issue = currentIssue();
    const type = parseInsertType(params.get("insert")) ?? insertForIssue(issue);
    const s: Setup = {
      issue,
      type,
      wrap,
      path: pathname,
      openOnLoad: params.get("insert-open") === "1",
      postcardBack: params.get("insert-side") === "back",
      couponTorn: params.get("insert-torn") === "1",
    };
    setSetup(s);
    setPlaced(readPlaced(pathname));
    setOpen(s.openOnLoad);
  }, [pathname]);

  const updatePlaced = useCallback(
    (next: Placed[]) => {
      setPlaced(next);
      savePlaced(pathname, next);
    },
    [pathname],
  );

  if (!setup) return null;

  const close = () => {
    setOpen(false);
    slipRef.current?.focus({ preventScroll: true });
  };

  return (
    <>
      <Slip
        ref={slipRef}
        setup={setup}
        vars={vars}
        version={version}
        out={open}
        onOpen={() => setOpen(true)}
      />
      <Stuck
        wrap={setup.wrap}
        placed={placed}
        issue={setup.issue}
        vars={vars}
        version={version}
        onChange={updatePlaced}
      />
      {open ? (
        <Desk
          setup={setup}
          vars={vars}
          version={version}
          slipRef={slipRef}
          placed={placed}
          onPlaced={updatePlaced}
          onClosed={close}
        />
      ) : null}
    </>
  );
}

// ———————————————————————————— The slip peeking out of the paper ————————————————————————————

type SlipPos = { narrow: boolean; top: number; left: number; peek: number };

function Slip({
  ref,
  setup,
  vars,
  version,
  out,
  onOpen,
}: {
  ref: RefObject<HTMLButtonElement | null>;
  setup: Setup;
  vars: CSSProperties;
  version: string;
  out: boolean;
  onOpen: () => void;
}) {
  const [pos, setPos] = useState<SlipPos | null>(null);
  const { wrap, issue, type } = setup;

  useLayoutEffect(() => {
    const measure = () => {
      const sheets = wrap.querySelectorAll<HTMLElement>(".print-sheet, .yn-sheet");
      const first = sheets[0];
      const lastSheet = sheets[sheets.length - 1];
      if (!first || !lastSheet) return;
      const w = wrap.getBoundingClientRect();
      // The wrap may be scaled mid-animation (arriving, turning), so screen distances are
      // converted back into the wrap's own layout pixels before they are used to place the slip.
      const k = w.width > 0 ? wrap.offsetWidth / w.width : 1;
      const width = wrap.offsetWidth;
      const narrow = window.innerWidth < NARROW;
      const rand = seeded(issue * 31 + 5);
      if (narrow) {
        const r = lastSheet.getBoundingClientRect();
        setPos({
          narrow,
          top: (r.bottom - w.top) * k,
          left: width * (0.42 + rand() * 0.16),
          peek: 30,
        });
      } else {
        const r = first.getBoundingClientRect();
        const room = window.innerWidth - (w.left + wrap.offsetWidth);
        const peek = Math.max(18, Math.min(46, room - 10));
        const top = (r.top - w.top) * k + Math.min(r.height * k * (0.14 + rand() * 0.12), 420);
        setPos({ narrow, top, left: width, peek });
      }
    };
    measure();
    // Once the paper has finished arriving, measure again where it finally lies.
    const settle = window.setTimeout(measure, 2200);
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    window.addEventListener("resize", measure);
    return () => {
      window.clearTimeout(settle);
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [wrap, issue]);

  if (!pos) return null;
  const poster = type === "poster" ? posterForIssue(issue) : null;
  const style = {
    ...vars,
    top: pos.top,
    left: pos.left,
    "--peek": `${pos.peek}px`,
    ...(poster ? { "--poster-photo": `url(${poster.photo})` } : {}),
  } as CSSProperties;

  return createPortal(
    <button
      ref={ref}
      type="button"
      className={`yi-slip yi-slip--${type} yi-${version} ${pos.narrow ? "yi-slip--foot" : "yi-slip--edge"} ${out ? "is-out" : ""}`}
      style={style}
      onClick={onOpen}
      aria-label={`Inside today: ${tabLabel[type]}. Pull it out`}
      aria-haspopup="dialog"
      tabIndex={out ? -1 : 0}
    >
      <span className="yi-slip__stock" aria-hidden />
      <span className="yi-slip__tab" aria-hidden>
        <span className="yi-slip__inside">Inside today</span>
        <span className="yi-slip__what">{tabLabel[type]}</span>
      </span>
    </button>,
    wrap,
  );
}

// ———————————————————————————— Stickers stuck on the page ————————————————————————————

function Stuck({
  wrap,
  placed,
  issue,
  vars,
  version,
  onChange,
}: {
  wrap: HTMLElement;
  placed: Placed[];
  issue: number;
  vars: CSSProperties;
  version: string;
  onChange: (next: Placed[]) => void;
}) {
  const [peeling, setPeeling] = useState<string | null>(null);
  const [moving, setMoving] = useState<{ id: string; x: number; y: number } | null>(null);
  const press = useRef<{
    id: string;
    sx: number;
    sy: number;
    moved: boolean;
    timer: number;
  } | null>(null);

  const peel = (id: string) => {
    setPeeling(id);
    window.setTimeout(
      () => {
        setPeeling(null);
        onChange(placed.filter((p) => p.id !== id));
      },
      reducedMotion() ? 0 : 420,
    );
  };

  const toFraction = (clientX: number, clientY: number) => {
    const r = wrap.getBoundingClientRect();
    return { x: (clientX - r.left) / r.width, y: (clientY - r.top) / r.height };
  };

  const down = (id: string, e: ReactPointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    // A long press peels it off, as a double-click does with a mouse.
    const timer = window.setTimeout(() => {
      if (press.current && !press.current.moved) {
        press.current = null;
        peel(id);
      }
    }, 650);
    press.current = { id, sx: e.clientX, sy: e.clientY, moved: false, timer };
  };
  const move = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const p = press.current;
    if (!p) return;
    if (!p.moved && Math.hypot(e.clientX - p.sx, e.clientY - p.sy) < 5) return;
    p.moved = true;
    window.clearTimeout(p.timer);
    setMoving({ id: p.id, ...toFraction(e.clientX, e.clientY) });
  };
  const up = () => {
    const p = press.current;
    press.current = null;
    if (!p) return;
    window.clearTimeout(p.timer);
    if (p.moved && moving) {
      onChange(placed.map((s) => (s.id === p.id ? { ...s, x: moving.x, y: moving.y } : s)));
    }
    setMoving(null);
  };

  if (placed.length === 0) return null;
  return createPortal(
    <div className={`yi-stuck yi-${version}`} style={vars}>
      {placed.map((p) => {
        const def = stickerById(p.id);
        if (!def) return null;
        const at = moving?.id === p.id ? moving : p;
        return (
          <button
            key={p.id}
            type="button"
            className={`yi-stuck__one ${peeling === p.id ? "is-peeling" : ""} ${moving?.id === p.id ? "is-moving" : ""}`}
            style={
              {
                left: `${at.x * 100}%`,
                top: `${at.y * 100}%`,
                width: stickerPx(p.id),
                aspectRatio: String(1 / def.ratio),
                "--st-rot": `${p.rot}deg`,
              } as CSSProperties
            }
            aria-label={`Sticker on the page: ${def.label}. Press Delete or Enter to peel it off`}
            onDoubleClick={() => peel(p.id)}
            onPointerDown={(e) => down(p.id, e)}
            onPointerMove={move}
            onPointerUp={up}
            onPointerCancel={up}
            onContextMenu={(e) => e.preventDefault()}
            onKeyDown={(e) => {
              if (
                e.key === "Delete" ||
                e.key === "Backspace" ||
                e.key === "Enter" ||
                e.key === " "
              ) {
                e.preventDefault();
                peel(p.id);
              }
            }}
          >
            <span className="yi-vinyl">
              <StickerArt id={p.id} issue={issue} />
            </span>
          </button>
        );
      })}
    </div>,
    wrap,
  );
}

// ———————————————————————————— The desk: the insert pulled out ————————————————————————————

type Phase = "enter" | "open" | "folding" | "leave";

function Desk({
  setup,
  vars,
  version,
  slipRef,
  placed,
  onPlaced,
  onClosed,
}: {
  setup: Setup;
  vars: CSSProperties;
  version: string;
  slipRef: RefObject<HTMLElement | null>;
  placed: Placed[];
  onPlaced: (next: Placed[]) => void;
  onClosed: () => void;
}) {
  const { issue, type, wrap } = setup;
  const [phase, setPhase] = useState<Phase>(setup.openOnLoad || reducedMotion() ? "open" : "enter");
  const [drag, setDrag] = useState<{ id: string; x: number; y: number } | null>(null);
  const objectRef = useRef<HTMLDivElement>(null);
  const closing = useRef(false);

  const rot = useMemo(() => {
    if (type === "poster" || type === "colouring") return -0.4;
    const r = seeded(issue * 13 + type.length)();
    return (r * 5 - 2.5).toFixed(2);
  }, [issue, type]);

  // The object starts where the slip is, so it visibly comes out of the paper. Measured after
  // mount but before paint, and before the enter effect below lays out the starting pose.
  useLayoutEffect(() => {
    const slip = slipRef.current;
    const object = objectRef.current;
    if (!slip || !object) return;
    const r = slip.getBoundingClientRect();
    object.style.setProperty(
      "--from-x",
      `${Math.round(r.left + r.width / 2 - window.innerWidth / 2)}px`,
    );
    object.style.setProperty(
      "--from-y",
      `${Math.round(r.top + r.height / 2 - window.innerHeight / 2)}px`,
    );
  }, [slipRef]);

  useEffect(() => {
    if (phase !== "enter") return;
    // Lay out the starting pose first, so the move out of the paper is a transition from it.
    objectRef.current?.getBoundingClientRect();
    const id = window.setTimeout(() => setPhase("open"), 20);
    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    objectRef.current?.focus({ preventScroll: true });
  }, []);

  const requestClose = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    const quick = reducedMotion();
    const leave = () => {
      setPhase("leave");
      window.setTimeout(onClosed, quick ? 0 : 480);
    };
    if (type === "poster" && !quick) {
      setPhase("folding");
      window.setTimeout(leave, 850);
    } else leave();
  }, [onClosed, type]);

  // Esc tucks it back; Tab stays inside the insert while it is out.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        requestClose();
      } else if (e.key === "Tab" && objectRef.current) {
        const f = [
          ...objectRef.current.querySelectorAll<HTMLElement>(
            "button:not([tabindex='-1']), [tabindex='0']",
          ),
        ].filter((el) => el.offsetParent !== null);
        const firstEl = f[0];
        const lastEl = f[f.length - 1];
        if (!firstEl || !lastEl) return;
        if (
          e.shiftKey &&
          (document.activeElement === firstEl || document.activeElement === objectRef.current)
        ) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [requestClose]);

  // ——— Peeling a sticker off the sheet and carrying it to the page ———
  const onSheet = useMemo(
    () => new Set(stickerDefs.map((s) => s.id).filter((id) => !placed.some((p) => p.id === id))),
    [placed],
  );

  const stickAt = useCallback(
    (id: string, clientX: number, clientY: number) => {
      const r = wrap.getBoundingClientRect();
      const x = (clientX - r.left) / r.width;
      const y = (clientY - r.top) / r.height;
      if (x < 0 || x > 1 || y < 0 || y > 1) return false;
      const rot =
        Math.round((seeded(issue * 101 + id.length * 7 + Math.round(x * 97))() * 24 - 12) * 10) /
        10;
      onPlaced([...placed.filter((p) => p.id !== id), { id, x, y, rot }]);
      return true;
    },
    [wrap, issue, placed, onPlaced],
  );

  const grab = (id: string, e: ReactPointerEvent<HTMLElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const sx = e.clientX;
    const sy = e.clientY;
    let started = false;
    const onMove = (ev: PointerEvent) => {
      if (!started && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 4) return;
      started = true;
      setDrag({ id, x: ev.clientX, y: ev.clientY });
    };
    const onUp = (ev: PointerEvent) => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      if (started) stickAt(id, ev.clientX, ev.clientY);
      setDrag(null);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  // Keyboard: stick it somewhere on the part of the page in view.
  const placeByKey = (id: string) => {
    const r = wrap.getBoundingClientRect();
    const rand = seeded(issue * 53 + id.length * 11 + placed.length);
    const vx0 = Math.max(r.left, 0);
    const vx1 = Math.min(r.right, window.innerWidth);
    const vy0 = Math.max(r.top, 0);
    const vy1 = Math.min(r.bottom, window.innerHeight);
    stickAt(
      id,
      vx0 + (vx1 - vx0) * (0.15 + rand() * 0.7),
      vy0 + (vy1 - vy0) * (0.2 + rand() * 0.6),
    );
  };

  const piece = (() => {
    switch (type) {
      case "print":
        return <ArtPrintInsert issue={issue} />;
      case "stickers":
        return (
          <StickerSheetInsert issue={issue} onSheet={onSheet} onGrab={grab} onPlace={placeByKey} />
        );
      case "coupon":
        return <CouponInsert issue={issue} startTorn={setup.couponTorn} />;
      case "postcard":
        return <PostcardInsert issue={issue} startBack={setup.postcardBack} />;
      case "colouring":
        return <ColouringInsert issue={issue} />;
      case "poster":
        return <PosterInsert issue={issue} open={phase === "open"} onFoldAway={requestClose} />;
    }
  })();

  const dragDef = drag ? stickerById(drag.id) : undefined;

  return (
    <div
      className={`yi-desk yi-${version} ${drag ? "is-dragging" : ""}`}
      data-phase={phase}
      style={
        { ...vars, "--from-x": "40vw", "--from-y": "0px", "--rot": `${rot}deg` } as CSSProperties
      }
    >
      <div className="yi-desk__scrim" onClick={requestClose} aria-hidden />
      <div className="yi-desk__place">
        <div
          ref={objectRef}
          className={`yi-object yi-object--${type}`}
          role="dialog"
          aria-modal="true"
          aria-label={`Inside today: ${tabLabel[type]}`}
          tabIndex={-1}
        >
          {piece}
          <button type="button" className="yi-tuck" onClick={requestClose}>
            Tuck it back in <span aria-hidden>×</span>
          </button>
        </div>
      </div>
      {drag && dragDef ? (
        <span
          className="yi-ghost"
          style={
            {
              left: drag.x,
              top: drag.y,
              width: stickerPx(drag.id),
              aspectRatio: String(1 / dragDef.ratio),
            } as CSSProperties
          }
          aria-hidden
        >
          <span className="yi-vinyl">
            <StickerArt id={drag.id} issue={issue} />
          </span>
        </span>
      ) : null}
    </div>
  );
}
