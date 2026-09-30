"use client";

import { useEffect } from "react";

// Column balancing. A compositor setting a page doesn't leave a hand's width of bare paper under
// one column while the one beside it runs on: they widen or narrow the columns until both end at
// the same depth. Compositions set their side-by-side columns as grids; the words each column
// holds change every day, so the right split can only be found by measuring. After the page is
// laid out, every two-column grid on the sheet has its split nudged (within limits that keep both
// columns readable) until its columns end level, or as near level as the limits allow. It only
// touches the columns' widths — never what is in them — and it redoes the work when the window
// changes size, so the phone's single column is never affected.

const SHEETS = ".yn-sheet, .tb-sheet, .print-sheet, .z-page";
/** How far a split may move: the first column takes between these shares of the width. */
const MIN = 0.22;
const MAX = 0.78;
/** A difference smaller than this (px) is level enough. */
const LEVEL = 12;

/** The lowest point of anything printed in `el`: text, pictures, rules — not its empty box. */
function inkBottom(el: Element): number {
  let bottom = -Infinity;
  const walk = (e: Element) => {
    const r = e.getBoundingClientRect();
    // A wrapper with no box of its own (display: contents) still holds what's printed in it.
    if (r.height === 0 && r.width === 0 && getComputedStyle(e).display !== "contents") return;
    const kids = e.children;
    if (
      !kids.length ||
      e.tagName === "IMG" ||
      e.tagName === "P" ||
      e.tagName === "FIGURE" ||
      /^H\d$/.test(e.tagName)
    ) {
      bottom = Math.max(bottom, r.bottom);
      return;
    }
    for (const k of kids) walk(k);
    for (const n of e.childNodes) {
      if (n.nodeType === 3 && n.textContent?.trim()) bottom = Math.max(bottom, r.bottom);
    }
  };
  walk(el);
  return bottom;
}

type Pair = {
  grid: HTMLElement;
  left: HTMLElement[];
  right: HTMLElement[];
  /** Two areas sharing a row of a wider grid: their widths are the grid's, so only the pictures move. */
  fixed?: boolean;
  /** For a wider grid split in two by its only two items: how many tracks the first spans. */
  span?: number;
};

/** Two-column grids on the sheet whose columns sit side by side, with the items in each. */
function pairs(root: ParentNode): Pair[] {
  const out: Pair[] = [];
  for (const sheet of root.querySelectorAll(SHEETS)) {
    for (const grid of sheet.querySelectorAll<HTMLElement>("*")) {
      const cs = getComputedStyle(grid);
      if (!cs.display.includes("grid")) continue;
      if (grid.closest("[data-balance='off']")) continue;
      // The word search's letters beside its word list are drawn to their own proportions, not a
      // page's columns: squeezing them shrinks the letters to a smudge.
      if (grid.closest(".tb-tile .pl-search")) continue;
      // Tracks an auto-fit grid collapsed (0px) aren't columns.
      const tracks = cs.gridTemplateColumns.split(" ").filter((t) => t && Number.parseFloat(t) > 0);
      if (tracks.length < 2) continue;
      const items = [...grid.children].filter(
        (c): c is HTMLElement =>
          c instanceof HTMLElement && getComputedStyle(c).position !== "absolute",
      );
      if (tracks.length > 2 && items.length === 2) {
        // Two items across a wider grid (a story's head beside its columns of text): split the
        // tracks between them.
        const [a, b] = items.sort(
          (m, n) => m.getBoundingClientRect().left - n.getBoundingClientRect().left,
        );
        const ra = a!.getBoundingClientRect();
        const rb = b!.getBoundingClientRect();
        if (ra.right <= rb.left + 2) {
          const span = Math.round((tracks.length * ra.width) / (ra.width + rb.width));
          if (span > 0 && span < tracks.length) {
            out.push({ grid, left: [a!], right: [b!], span });
            continue;
          }
        }
      }
      if (tracks.length > 2) {
        // A wider grid (the tabloid's three columns, a strip of briefs): pair each area that
        // starts a row with the deepest area beside it.
        const tops = items.map((c) => c.getBoundingClientRect().top);
        for (const [i, a] of items.entries()) {
          const row = items.filter((_, j) => Math.abs(tops[j]! - tops[i]!) < 8);
          if (row.length < 2) continue;
          const deepest = row.reduce((m, c) => (inkBottom(c) > inkBottom(m) ? c : m));
          if (deepest === a) continue;
          out.push({ grid, left: [a], right: [deepest], fixed: true });
        }
        continue;
      }
      // Items fall into the two columns by where they start (measured on screen, so a sheet
      // scaled to fit its window is judged the same way).
      const lefts = items.map((c) => c.getBoundingClientRect().left);
      const first = Math.min(...lefts);
      const left = items.filter((_, i) => lefts[i]! - first < 8);
      const right = items.filter((_, i) => lefts[i]! - first >= 8);
      // Only a grid whose items fall cleanly into two columns, and both hold something.
      if (!left.length || !right.length || left.length + right.length !== items.length) continue;
      out.push({ grid, left, right });
    }
  }
  return out;
}

/** Positive when the left column runs deeper than the right. */
const difference = (p: Pair) =>
  Math.max(...p.left.map(inkBottom)) - Math.max(...p.right.map(inkBottom));

function balance(p: Pair) {
  if (p.fixed) return deepen(p);
  const cs = getComputedStyle(p.grid);
  const tracks = cs.gridTemplateColumns
    .split(" ")
    .map(Number.parseFloat)
    .filter((t) => t > 0);
  const k = p.span ?? 1;
  if (tracks.length < 2 || k >= tracks.length) return deepen(p);
  const width = tracks.reduce((n, t) => n + t, 0);
  const set = (share: number) => {
    const l = `minmax(0, ${share / k}fr) `.repeat(k);
    const r = `minmax(0, ${(1 - share) / (tracks.length - k)}fr) `.repeat(tracks.length - k);
    p.grid.style.gridTemplateColumns = (l + r).trim();
  };
  const start = tracks.slice(0, k).reduce((n, t) => n + t, 0) / width;
  const d0 = difference(p);
  if (Math.abs(d0) <= LEVEL) return;
  // Moving width towards the deeper column shortens it. Search the split between the current one
  // and the limit in that direction.
  // A grid may keep its split nearer even (data-balance-span="0.4"): its pictures take up the rest.
  const span = Number(p.grid.dataset.balanceSpan) || 0;
  const min = span ? Math.max(MIN, 0.5 - span / 2) : MIN;
  const max = span ? Math.min(MAX, 0.5 + span / 2) : MAX;
  let lo = d0 > 0 ? start : min;
  let hi = d0 > 0 ? max : start;
  let best = { share: start, d: Math.abs(d0) };
  for (let i = 0; i < 12; i++) {
    const share = (lo + hi) / 2;
    set(share);
    const d = difference(p);
    if (Math.abs(d) < best.d) best = { share, d: Math.abs(d) };
    if (Math.abs(d) <= LEVEL) break;
    // Left still deeper: give it more width.
    if (d > 0) lo = share;
    else hi = share;
  }
  // A column of pictures gets deeper, not shallower, as it widens: when widening the deeper
  // column didn't level them, try the whole range the other way too.
  if (best.d > LEVEL * 3) {
    for (let share = min; share <= max + 1e-6; share += 0.04) {
      set(share);
      const d = Math.abs(difference(p));
      if (d < best.d) best = { share, d };
    }
  }
  if (best.share === start) p.grid.style.gridTemplateColumns = "";
  else set(best.share);
  deepen(p);
}

const PHOTOS =
  ".yn-photo, .tb-photo, .z-photo, .m5-photo, .bs-inkpull, .ba-top > .ba-pic, .ba-behind > .ba-pic, .sp-fill";
/** How much deeper, or shallower, than set a picture may be printed to level its columns. */
const DEEPEN = 3.5;
const SHALLOW = 0.6;

/** The biggest picture in a column (not one inside another). */
function biggest(column: HTMLElement[]) {
  const area = (el: Element) => {
    const r = el.getBoundingClientRect();
    return r.width * r.height;
  };
  return column
    .flatMap((c) => [...c.querySelectorAll<HTMLElement>(PHOTOS)])
    .filter((el) => !el.parentElement?.closest(PHOTOS) && area(el) > 0)
    .sort((a, b) => area(b) - area(a))[0];
}

/**
 * Print a picture `by` screen pixels deeper (or shallower, when negative), never beyond the
 * limits of the depth it was set at.
 */
function resize(photo: HTMLElement, by: number) {
  const rect = photo.getBoundingClientRect();
  // Layout pixels per screen pixel, for a sheet scaled to fit its window.
  const scale = photo.offsetHeight / rect.height || 1;
  // The depth the composition set it at, measured before anything moved (see run()).
  const set = Number(photo.dataset.set || rect.height);
  photo.dataset.deepened = "";
  const to = Math.min(set * DEEPEN, Math.max(set * SHALLOW, rect.height + by));
  photo.style.aspectRatio = "auto";
  photo.style.minHeight = "0";
  photo.style.height = `${to * scale}px`;
}

/**
 * When the split alone can't level the columns, the pictures take up the difference, as a
 * compositor would size a picture to fit: the deeper column's briefs set their pictures beside
 * the text rather than across it, the deeper column's picture is printed shallower and, if that isn't
 * enough, the shorter column's deeper — each within limits of the depth it was set at.
 */
function deepen(p: Pair) {
  let d = difference(p);
  if (Math.abs(d) <= LEVEL) return;
  const deep = d > 0 ? p.left : p.right;
  const wide = deep.flatMap((c) => [...c.querySelectorAll<HTMLElement>(".ba-top")]);
  if (wide.length) {
    for (const w of wide) w.dataset.compact = "";
    d = difference(p);
    if (Math.abs(d) <= LEVEL) return;
    if ((d > 0 ? p.left : p.right) !== deep) {
      // Compact briefs overshot: put them back.
      for (const w of wide) delete w.dataset.compact;
      d = difference(p);
    }
  }
  // The shorter column's briefs take their pictures across the column instead of set into the
  // text, one at a time, while that brings the columns nearer level.
  const floats = (d > 0 ? p.right : p.left).flatMap((c) => [
    ...c.querySelectorAll<HTMLElement>(".ba-float:not([data-fallback])"),
  ]);
  for (const f of floats) {
    const before = d;
    f.dataset.fallback = "";
    d = difference(p);
    if (Math.abs(d) <= LEVEL) return;
    if (Math.sign(d) !== Math.sign(before) && Math.abs(d) > Math.abs(before)) {
      delete f.dataset.fallback;
      d = difference(p);
      break;
    }
  }
  // The deeper column's picture printed shallower, then the shorter column's deeper.
  const tall = biggest(d > 0 ? p.left : p.right);
  if (tall) {
    resize(tall, -Math.abs(d));
    d = difference(p);
    if (Math.abs(d) <= LEVEL) return;
  }
  const short = biggest(d > 0 ? p.right : p.left);
  if (short) resize(short, Math.abs(d));
  lead(p);
}

/** A paragraph's line spacing in px ("normal" taken as 1.2 of its size). */
function lineOf(el: HTMLElement) {
  const cs = getComputedStyle(el);
  return Number.parseFloat(cs.lineHeight) || Number.parseFloat(cs.fontSize) * 1.2;
}

/** How far a column's leading may be opened to reach the foot of the one beside it. */
const LEAD = 1.3;

/**
 * Vertical justification, the compositor's last resort: when the shorter column still ends well
 * above the other, its text is leaded out (line spacing opened a little, within limits) until the
 * two end level.
 */
function lead(p: Pair, min = LEVEL * 3) {
  const d = difference(p);
  if (Math.abs(d) <= min) return;
  const short = d > 0 ? p.right : p.left;
  const paras = short.flatMap((c) => [...c.querySelectorAll<HTMLElement>("p")]);
  if (!paras.length) return;
  const base = paras.map(lineOf);
  const set = (k: number) =>
    paras.forEach((el, i) => {
      el.style.lineHeight = `${base[i]! * k}px`;
      el.dataset.leaded = "";
    });
  let lo = 1;
  let hi = LEAD;
  const sign = Math.sign(d);
  for (let i = 0; i < 8; i++) {
    const k = (lo + hi) / 2;
    set(k);
    if (Math.sign(difference(p)) === sign) lo = k;
    else hi = k;
  }
  set(lo);
}

/** Undo every adjustment, so the page is judged afresh. */
function reset(found: Pair[]) {
  for (const p of found) if (!p.fixed) p.grid.style.gridTemplateColumns = "";
  for (const el of document.querySelectorAll<HTMLElement>("[data-deepened]")) {
    el.style.aspectRatio = "";
    el.style.minHeight = "";
    el.style.height = "";
    delete el.dataset.deepened;
  }
  for (const el of document.querySelectorAll<HTMLElement>("[data-compact]")) {
    delete el.dataset.compact;
  }
  for (const el of document.querySelectorAll<HTMLElement>("[data-leaded]")) {
    el.style.lineHeight = "";
    delete el.dataset.leaded;
  }
  for (const el of document.querySelectorAll<HTMLElement>("[data-filled]")) {
    el.style.zoom = "";
    delete el.dataset.filled;
  }
  for (const el of document.querySelectorAll<HTMLElement>("[data-fallback]")) {
    delete el.dataset.fallback;
  }
}

/**
 * A spread's two pages share some pieces (spreads.tsx: data-sp-flow): the left page's last piece
 * moves over the fold, or the right page's first comes back, while that brings the two pages'
 * ends nearer level. Only when the pages sit side by side; on a phone they run one after another.
 */
function spreadFlow() {
  const groups = new Map<string, HTMLElement[]>();
  for (const el of document.querySelectorAll<HTMLElement>("[data-sp-flow]")) {
    const id = el.dataset.spFlow!;
    groups.set(id, [...(groups.get(id) ?? []), el]);
  }
  for (const [, pair] of groups) {
    const left = pair.find((e) => e.dataset.half === "0");
    const right = pair.find((e) => e.dataset.half === "1");
    if (!left || !right) continue;
    const pl = left.closest(SHEETS);
    const pr = right.closest(SHEETS);
    if (!pl || !pr) continue;
    // Two pages of a spread, or two columns of one page: only when they sit side by side.
    const [rl, rr] =
      pl === pr
        ? [left.getBoundingClientRect(), right.getBoundingClientRect()]
        : [pl.getBoundingClientRect(), pr.getBoundingClientRect()];
    if (rr.left < rl.left + rl.width * 0.8 || Math.abs(rr.top - rl.top) > 40) continue;
    const end = (el: HTMLElement, page: Element) => {
      const b = inkBottom(el);
      return (
        (Number.isFinite(b) ? b : el.getBoundingClientRect().top) - page.getBoundingClientRect().top
      );
    };
    const diff = () => end(left, pl) - end(right, pr);
    for (let i = 0; i < 8; i++) {
      const d = diff();
      if (Math.abs(d) <= LEVEL * 4) break;
      const piece = d > 0 ? left.lastElementChild : right.firstElementChild;
      if (!piece) break;
      if (d > 0) right.prepend(piece);
      else left.append(piece);
      // Both sides always keep something, and a move that doesn't help is undone.
      if (Math.abs(diff()) >= Math.abs(d) || !right.children.length || !left.children.length) {
        if (d > 0) left.append(piece);
        else right.prepend(piece);
        break;
      }
    }
    // Whole pieces seldom level two pages to the line: across a spread the shorter page's text is
    // leaded out (a little, within limits) to meet the other's foot.
    if (pl !== pr) lead({ grid: left, left: [left], right: [right] }, LEVEL);
  }
}

/** The lowest text or picture in `el` (not an empty box stretched to fill its parent). */
function matterBottom(el: Element): number {
  let bottom = -Infinity;
  for (const pic of el.querySelectorAll("img, svg, .sp-pic")) {
    bottom = Math.max(bottom, pic.getBoundingClientRect().bottom);
  }
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.textContent?.trim()) continue;
    range.selectNodeContents(n);
    const r = range.getBoundingClientRect();
    if (r.height) bottom = Math.max(bottom, r.bottom);
  }
  return bottom;
}

/** The matter of a page that may be set a size up to fill its sheet, design by design. */
const FILLABLE = [
  ".bs-page",
  ".tb-comp",
  ".tb-special",
  ".m5-page-flow",
  ".zc-page > :is(.zc-main, .zc-second, .zc-briefs, .zc-pics, .sp, .dr, section, article)",
  ".z-page > .sp",
].join(", ");

/**
 * A sheet is a fixed size: when the day's stories end well short of its foot, the page's matter is
 * set a size or two up (never smaller than set), and a special page's pictures printed deeper, to
 * take up the paper — as a compositor would re-set a page that came out short.
 */
function fillSheets() {
  const sheets = [...document.querySelectorAll<HTMLElement>(SHEETS)].filter(
    (s) => !s.querySelector(SHEETS),
  );
  for (const sheet of sheets) {
    const items = [...sheet.querySelectorAll<HTMLElement>(FILLABLE)].filter(
      (el) => !el.parentElement?.closest(FILLABLE) || el.parentElement.closest(SHEETS) !== sheet,
    );
    const mine = items.filter((el) => el.closest(SHEETS) === sheet);
    if (!mine.length) continue;
    const last = mine.at(-1)!;
    // The foot of the matter: the first thing printed after it (the folio), or the sheet's foot.
    let limit = sheet.getBoundingClientRect().bottom - 24;
    for (const el of sheet.querySelectorAll<HTMLElement>("*")) {
      if (mine.some((m) => m.contains(el) || el.contains(m))) continue;
      if (!(last.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING)) continue;
      const r = el.getBoundingClientRect();
      if (r.height && r.width) limit = Math.min(limit, r.top);
    }
    const room = () => limit - 24 - Math.max(...mine.map(matterBottom));
    if (room() < 40) continue;
    let lo = 1;
    let hi = 1.3;
    for (let i = 0; i < 7; i++) {
      const k = (lo + hi) / 2;
      for (const el of mine) el.style.zoom = String(k);
      if (room() >= 0) lo = k;
      else hi = k;
    }
    for (const el of mine) {
      el.style.zoom = lo > 1.01 ? String(lo) : "";
      el.dataset.filled = "";
    }
    // Then the text leaded out a little...
    if (room() > 60) {
      const paras = mine.flatMap((m) => [...m.querySelectorAll<HTMLElement>("p")]);
      const base = paras.map(lineOf);
      if (paras.length) {
        const set = (k: number) =>
          paras.forEach((el, i) => {
            el.style.lineHeight = `${base[i]! * k}px`;
            el.dataset.leaded = "";
          });
        let a = 1;
        let z = LEAD;
        for (let i = 0; i < 7; i++) {
          const k = (a + z) / 2;
          set(k);
          if (room() >= 0) a = k;
          else z = k;
        }
        set(a);
      }
    }
    // ...and a special page's pictures deeper, to take up what's left.
    const free = room();
    if (free < 30) continue;
    const special = mine
      .flatMap((m) => [...m.querySelectorAll<HTMLElement>(".sp-pic")])
      .filter((el) => !el.closest(".sp-cols, .sp-story--side, .sp-scrap-top, .ba-float"));
    // On the design's own compositions, the page's biggest picture that has the column to itself.
    const own = biggest(mine.filter((m) => !m.querySelector(".sp")));
    const pics = special.length ? special : own && !own.closest(".ba-float") ? [own] : [];
    if (!pics.length) continue;
    const share = free / pics.length;
    for (const pic of pics) {
      const r = pic.getBoundingClientRect();
      const scale = pic.offsetHeight / r.height || 1;
      pic.dataset.deepened = "";
      pic.style.aspectRatio = "auto";
      pic.style.height = `${Math.min(r.height * 2.2, r.height + share) * scale}px`;
    }
  }
}

/** How far short of a picture's foot the words set beside it may stop (px). */
const BESIDE = 40;

/**
 * Bare paper beside a picture: a picture set into a brief's text leaves a hole beside it when the
 * words stop well short of its foot. Such a picture goes across the top of its brief instead.
 */
function unhole() {
  for (const fig of document.querySelectorAll<HTMLElement>(
    `:is(${SHEETS}) .ba-float:not([data-fallback])`,
  )) {
    const box = fig.parentElement;
    if (!box) continue;
    const r = fig.getBoundingClientRect();
    let text = -Infinity;
    for (const el of box.children) {
      if (el === fig || !(el instanceof HTMLElement)) continue;
      text = Math.max(text, inkBottom(el));
    }
    if (r.bottom - text > BESIDE) fig.dataset.fallback = "";
  }
}

// One pass over the whole document per frame, however many pages (the print view) ask for it.
let frame = 0;

export function Balance() {
  useEffect(() => {
    const run = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        // Start from the composition's own split every time, so a resize is judged afresh.
        reset(pairs(document));
        for (const el of document.querySelectorAll<HTMLElement>(`:is(${SHEETS}) :is(${PHOTOS})`)) {
          el.dataset.set = String(el.getBoundingClientRect().height);
        }
        // The page's columns first, then the columns inside a story (whose width they set); a
        // second pass settles the page's columns around the stories as they came out.
        unhole();
        spreadFlow();
        for (let pass = 0; pass < 2; pass++) for (const p of pairs(document)) balance(p);
        unhole();
        // Pictures that went across their briefs change the columns' depths: level them again.
        for (const p of pairs(document)) balance(p);
        // The columns' new splits change the pages' depths: let a piece cross the fold again.
        spreadFlow();
        fillSheets();
        // A last pass over what is still out of level (a story's own columns settling can leave
        // the page's split behind), kept only where it brings the columns nearer level.
        for (const p of pairs(document)) {
          const before = Math.abs(difference(p));
          if (before <= LEVEL || p.fixed) continue;
          const kept = p.grid.style.gridTemplateColumns;
          balance(p);
          if (Math.abs(difference(p)) >= before) p.grid.style.gridTemplateColumns = kept;
        }
      });
    };
    run();
    void document.fonts.ready.then(run);
    // The puzzles and other client pieces settle their size just after they mount, and pictures
    // as they load: judge the page again once they have.
    const later = window.setTimeout(run, 400);
    // Some settle later still (a puzzle drawing its grid once its fonts and state are in): judge
    // again whenever a sheet changes depth. What this pass sets settles, so it doesn't loop.
    const watch = new ResizeObserver(run);
    for (const el of document.querySelectorAll(SHEETS)) watch.observe(el);
    window.addEventListener("load", run);
    window.addEventListener("resize", run);
    return () => {
      window.clearTimeout(later);
      watch.disconnect();
      window.removeEventListener("load", run);
      window.removeEventListener("resize", run);
    };
  }, []);
  return null;
}
