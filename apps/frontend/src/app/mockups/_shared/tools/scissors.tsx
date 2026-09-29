"use client";

import { domToBlob, domToCanvas } from "modern-screenshot";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { addClipping } from "./board-store";

const SHEETS = ".print-sheet, .yn-sheet";
const SEMANTIC = new Set(["FIGURE", "ARTICLE", "SECTION", "ASIDE"]);

type Box = { x: number; y: number; w: number; h: number };

/** What the scissors go round: one element, or a run of sibling blocks that read as one story. */
export type Piece = { els: HTMLElement[]; sheet: HTMLElement; box: Box };

const shareOf = (el: HTMLElement, sheetArea: number) => (el.offsetWidth * el.offsetHeight) / sheetArea;

const isBlock = (el: Element): el is HTMLElement =>
  el instanceof HTMLElement && !["inline", "contents", "none"].includes(getComputedStyle(el).display);

const HEADS = "h1, h2, h3";
const startsStory = (el: Element) => el.matches(HEADS) || !!el.querySelector(HEADS);

/**
 * The piece a pair of scissors would go round: the nearest story-shaped ancestor of what is under
 * the pointer — a figure, article, section or aside, or failing that any block that is a sensible
 * share of the page — but never the whole sheet. Some pages set a story as loose blocks straight
 * on the sheet (a headline, then a photo, then the text); there the cut takes the run of blocks
 * from the headline to the next one.
 */
export function pickPiece(target: Element | null, wrap: HTMLElement): Piece | null {
  if (!target) return null;
  const sheet = target.closest<HTMLElement>(SHEETS);
  if (!sheet || !wrap.contains(sheet)) return null;
  const sheetArea = sheet.offsetWidth * sheet.offsetHeight;
  if (!sheetArea) return null;
  let el: Element | null = target;
  let top: HTMLElement | null = null;
  while (el && el !== sheet) {
    if (isBlock(el) && !el.matches(SHEETS)) {
      const share = shareOf(el, sheetArea);
      if (share <= 0.6 && ((SEMANTIC.has(el.tagName) && share >= 0.012) || share >= 0.06)) {
        return { els: [el], sheet, box: boxWithin(el, wrap) };
      }
    }
    if (el.parentElement === sheet && el instanceof HTMLElement) top = el;
    el = el.parentElement;
  }
  if (!top) return null;

  // A run of loose blocks: back to the headline that opens it, forward to the next headline.
  const kids = [...sheet.children].filter(isBlock);
  const at = kids.indexOf(top);
  if (at < 0) return null;
  let from = at;
  while (from > 0 && at - from < 6 && !startsStory(kids[from] as Element)) from--;
  if (!startsStory(kids[from] as Element)) from = at;
  const run: HTMLElement[] = [];
  for (let i = from; i < kids.length; i++) {
    const k = kids[i] as HTMLElement;
    if (i > from && startsStory(k)) break;
    run.push(k);
  }
  if (!run.includes(top)) return null;
  const boxes = run.map((k) => boxWithin(k, wrap));
  const x = Math.min(...boxes.map((b) => b.x));
  const y = Math.min(...boxes.map((b) => b.y));
  const w = Math.max(...boxes.map((b) => b.x + b.w)) - x;
  const h = Math.max(...boxes.map((b) => b.y + b.h)) - y;
  const share = (w * h) / sheetArea;
  if (share < 0.04 || share > 0.6) return null;
  return { els: run, sheet, box: { x, y, w, h } };
}

/** Where an element sits inside the wrap, in the wrap's own untransformed layout pixels. */
function boxWithin(el: HTMLElement, wrap: HTMLElement) {
  let x = 0;
  let y = 0;
  let n: HTMLElement | null = el;
  while (n && n !== wrap) {
    x += n.offsetLeft;
    y += n.offsetTop;
    const parent = n.offsetParent as HTMLElement | null;
    if (parent && parent !== wrap) {
      x += parent.clientLeft;
      y += parent.clientTop;
    }
    n = parent;
  }
  if (n !== wrap) {
    const a = el.getBoundingClientRect();
    const b = wrap.getBoundingClientRect();
    return { x: a.left - b.left, y: a.top - b.top, w: a.width, h: a.height };
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

/** The colour of the stock under an element: the first ancestor that paints a background. */
function paperOf(el: HTMLElement) {
  let n: HTMLElement | null = el;
  while (n) {
    const bg = getComputedStyle(n).backgroundColor;
    const alpha = /rgba?\([^)]*,\s*([\d.]+)\)/.exec(bg)?.[1];
    // A tint laid over the page is not the stock; keep looking for something opaque.
    if (bg && bg !== "transparent" && (alpha === undefined || Number(alpha) > 0.9)) return bg;
    n = n.parentElement;
  }
  return "#f4efe4";
}

function headlineOf(el: HTMLElement) {
  const h = el.querySelector("h1, h2, h3, h4, h5, figcaption, strong");
  const text = ((h as HTMLElement | null)?.innerText || h?.textContent || el.innerText || "").replace(/\s+/g, " ").trim();
  return text.length > 90 ? `${text.slice(0, 87).trimEnd()}…` : text;
}

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** The piece's outline on screen, for the lift-off. */
function screenRect(p: Piece) {
  const rs = p.els.map((e) => e.getBoundingClientRect());
  const left = Math.min(...rs.map((r) => r.left));
  const top = Math.min(...rs.map((r) => r.top));
  return new DOMRect(left, top, Math.max(...rs.map((r) => r.right)) - left, Math.max(...rs.map((r) => r.bottom)) - top);
}

const ours = (n: Node) => !(n instanceof Element && n.closest(".rt-ink, .rt-cutline"));

/**
 * The piece as an image at twice its size. A single element is rendered on its own; a run of loose
 * blocks is rendered as the whole sheet and cut out of that, since it has no element of its own.
 */
async function rasterise(p: Piece, wrap: HTMLElement, paper: string): Promise<Blob> {
  const only = p.els.length === 1 ? p.els[0] : undefined;
  if (only) return domToBlob(only, { scale: 2, backgroundColor: paper, type: "image/png", filter: ours });
  const s = boxWithin(p.sheet, wrap);
  // Keep the whole-sheet render inside what a phone's canvas can hold.
  const scale = Math.min(2, Math.sqrt(15e6 / Math.max(1, s.w * s.h)));
  const full = await domToCanvas(p.sheet, { scale, backgroundColor: paper, filter: ours });
  const k = full.width / Math.max(1, p.sheet.offsetWidth);
  const out = document.createElement("canvas");
  out.width = Math.round(p.box.w * 2);
  out.height = Math.round(p.box.h * 2);
  const ctx = out.getContext("2d");
  if (!ctx) throw new Error("No canvas");
  ctx.drawImage(full, (p.box.x - s.x) * k, (p.box.y - s.y) * k, p.box.w * k, p.box.h * k, 0, 0, out.width, out.height);
  return new Promise((resolve, reject) => out.toBlob((b) => (b ? resolve(b) : reject(new Error("No image"))), "image/png"));
}

/** The same piece measured again after the page reflowed. */
function pickFresh(p: Piece, wrap: HTMLElement): Piece | null {
  const boxes = p.els.map((e) => boxWithin(e, wrap));
  const x = Math.min(...boxes.map((b) => b.x));
  const y = Math.min(...boxes.map((b) => b.y));
  return { ...p, box: { x, y, w: Math.max(...boxes.map((b) => b.x + b.w)) - x, h: Math.max(...boxes.map((b) => b.y + b.h)) - y } };
}

/** The scissors glyph: two blades crossing at a screw, two finger rings. Drawn, not typed. */
function ScissorsGlyph() {
  return (
    <svg viewBox="0 0 32 32" width="22" height="22" aria-hidden className="rt-snips">
      <path d="M13.2 17.6 29 4.8c.7-.5 1.4.3.9.9L16 19.6Z" fill="#2a2a2a" />
      <path d="M13.2 14.4 29 27.2c.7.5 1.4-.3.9-.9L16 12.4Z" fill="#3a3a3a" />
      <circle cx="7.6" cy="9.6" r="4.6" fill="none" stroke="#b3262d" strokeWidth="2.6" />
      <circle cx="7.6" cy="22.4" r="4.6" fill="none" stroke="#b3262d" strokeWidth="2.6" />
      <path d="M11.4 12.2 14.4 16l-3 3.8" fill="none" stroke="#b3262d" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="16" cy="16" r="1.2" fill="#d9d4c8" />
    </svg>
  );
}

/**
 * Scissors mode: hovering outlines the story under the pointer with a dashed cut line; clicking
 * cuts round it, lifts the piece off and sends it to the board. The page itself is left intact.
 */
export function ScissorsLayer({
  wrap,
  active,
  version,
  onCut,
  onSlip,
}: {
  wrap: HTMLElement;
  active: boolean;
  version: string;
  onCut: () => void;
  onSlip: (text: string) => void;
}) {
  const [hover, setHover] = useState<Piece | null>(null);
  const [cutting, setCutting] = useState<Box | null>(null);
  const busy = useRef(false);
  const touchPicked = useRef<HTMLElement | null>(null);
  const same = (a: Piece | null, b: Piece | null) => a?.els[0] === b?.els[0] && a?.els.length === b?.els.length;

  const point = useCallback(
    (x: number, y: number) => {
      return pickPiece(document.elementFromPoint(x, y), wrap);
    },
    [wrap],
  );

  const cut = useCallback(
    async (piece: Piece) => {
      if (busy.current) return;
      busy.current = true;
      const first = piece.els[0] as HTMLElement;
      setHover(null);
      setCutting(piece.box);
      const started = performance.now();
      const paper = paperOf(first);
      try {
        const blob = await rasterise(piece, wrap, paper);
        // Let the scissors finish going round before the piece comes away.
        const wait = reduced() ? 0 : Math.max(0, 760 - (performance.now() - started));
        await new Promise((r) => setTimeout(r, wait));
        setCutting(null);
        const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
        await addClipping({
          id,
          version,
          page: window.location.pathname,
          headline: headlineOf(piece.els.find((e) => e.matches(HEADS) || e.querySelector(HEADS)) ?? first),
          createdAt: Date.now(),
          image: blob,
          w: Math.round(piece.box.w),
          h: Math.round(piece.box.h),
          paper,
        });
        await fly(blob, screenRect(piece));
        onCut();
        onSlip("Cut out — pinned to your board");
      } catch {
        setCutting(null);
        onSlip("The scissors slipped. Try that one again?");
      } finally {
        busy.current = false;
      }
    },
    [onCut, onSlip, version, wrap],
  );

  useEffect(() => {
    if (!active) {
      setHover(null);
      touchPicked.current = null;
      return;
    }
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch" || busy.current) return;
      const hit = point(e.clientX, e.clientY);
      setHover((h) => (same(h, hit) ? h : hit));
    };
    const click = (e: MouseEvent) => {
      if (!(e.target instanceof Element) || !wrap.contains(e.target)) return;
      // A click in scissors mode is a cut, never a link being followed.
      e.preventDefault();
      e.stopPropagation();
      const hit = point(e.clientX, e.clientY);
      if (!hit) return;
      const touch = (e as PointerEvent).pointerType === "touch" || matchMedia("(hover: none)").matches;
      if (touch && touchPicked.current !== hit.els[0]) {
        // On a phone there is no hover: the first tap shows the cut line, the second cuts.
        touchPicked.current = hit.els[0] ?? null;
        setHover(hit);
        return;
      }
      touchPicked.current = null;
      void cut(hit);
    };
    const leave = () => setHover(null);
    document.addEventListener("pointermove", move);
    document.addEventListener("click", click, true);
    wrap.addEventListener("pointerleave", leave);
    return () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("click", click, true);
      wrap.removeEventListener("pointerleave", leave);
    };
  }, [active, cut, point, wrap]);

  // Keep the outline on its piece while the page scrolls or reflows.
  useEffect(() => {
    if (!hover) return;
    const ro = new ResizeObserver(() => setHover((h) => (h ? (pickFresh(h, wrap) ?? h) : h)));
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [hover, wrap]);

  const shown = cutting ?? hover?.box ?? null;
  if (!shown) return null;
  const pad = 5;
  const w = shown.w + pad * 2;
  const h = shown.h + pad * 2;
  const perimeter = 2 * (w + h) - 8;
  const d = `M${pad * 0.6} 1.5H${w - 1.5}V${h - 1.5}H1.5V1.5Z`;

  return createPortal(
    <div
      className="rt-cutline"
      data-cutting={cutting ? "" : undefined}
      style={{ left: shown.x - pad, top: shown.y - pad, width: w, height: h }}
      aria-hidden
    >
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <rect x="1.5" y="1.5" width={w - 3} height={h - 3} rx="1.5" className="rt-cutline__halo" />
        <rect x="1.5" y="1.5" width={w - 3} height={h - 3} rx="1.5" className="rt-cutline__dash" />
        {cutting && (
          <path d={d} className="rt-cutline__cut" style={{ strokeDasharray: perimeter, strokeDashoffset: perimeter }} />
        )}
      </svg>
      <span className="rt-cutline__snips" style={cutting ? { offsetPath: `path("${d}")` } : undefined}>
        <ScissorsGlyph />
      </span>
    </div>,
    wrap,
  );
}

/**
 * The cut piece lifting off the page and flying into the Board link in the nav: a picture of the
 * clipping at the exact place it was cut, which tilts up, casts a shadow, and goes.
 */
async function fly(blob: Blob, from: DOMRect) {
  if (reduced()) return;
  const url = URL.createObjectURL(blob);
  const piece = document.createElement("div");
  piece.className = "rt-flying";
  piece.style.cssText = `left:${from.left}px;top:${from.top}px;width:${from.width}px;height:${from.height}px`;
  const img = document.createElement("img");
  img.alt = "";
  img.src = url;
  piece.appendChild(img);
  document.body.appendChild(piece);
  try {
    await img.decode().catch(() => undefined);
    const board = document.querySelector("[data-rt-board]")?.getBoundingClientRect();
    const tx = board ? board.left + board.width / 2 - (from.left + from.width / 2) : 0;
    const ty = board ? board.top + board.height / 2 - (from.top + from.height / 2) : window.innerHeight;
    const s = Math.max(0.04, Math.min(0.2, 60 / Math.max(from.width, from.height)));
    const anim = piece.animate(
      [
        { transform: "none", boxShadow: "0 0 0 rgb(0 0 0 / 0)", opacity: 1 },
        {
          transform: "translate(-6px, -14px) rotate(-3deg) scale(1.03)",
          boxShadow: "8px 22px 30px -8px rgb(30 20 10 / 0.45)",
          opacity: 1,
          offset: 0.32,
        },
        {
          transform: "translate(-6px, -16px) rotate(-3.4deg) scale(1.03)",
          boxShadow: "8px 24px 32px -8px rgb(30 20 10 / 0.45)",
          opacity: 1,
          offset: 0.45,
          easing: "cubic-bezier(.5,0,.75,.2)",
        },
        {
          transform: `translate(${tx}px, ${ty}px) rotate(16deg) scale(${s})`,
          boxShadow: "2px 6px 8px -2px rgb(30 20 10 / 0.3)",
          opacity: 0.85,
        },
      ],
      { duration: 1250, easing: "ease-out", fill: "forwards" },
    );
    await anim.finished;
  } finally {
    piece.remove();
    URL.revokeObjectURL(url);
  }
}
