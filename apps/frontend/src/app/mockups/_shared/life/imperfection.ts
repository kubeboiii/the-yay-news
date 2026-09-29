// Seeded imperfection: no two editions come off the press identically. Tape lands a little
// crooked, pasted prints sit at a slightly different angle, the second plate drifts out of
// register by a different amount, worn ink wears in a different place. All of it follows from the
// issue number, so the same edition always prints the same way.
//
// The versions' own CSS sets the base angles and offsets; this reads what the stylesheet computed
// and adds the edition's drift on top, so a design change underneath still shows through.

import { seeded } from "../edition-seed";

const TILTED = [
  ".print-tape",
  ".print-print",
  '[class*="burst"]',
  'div.relative:has(> svg[viewBox="0 0 100 100"] > path)',
].join(", ");

type Nudged = HTMLElement & { dataset: DOMStringMap };

const round = (n: number, p = 1000) => Math.round(n * p) / p;

/** Hash an element's place on the page into the edition's sequence, so order changes elsewhere
 *  don't reshuffle every other element's drift. */
function drift(issue: number, key: string) {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 16777619);
  return seeded((issue * 2654435761) ^ h);
}

function keyOf(el: Element, i: number) {
  return `${el.tagName}.${typeof el.className === "string" ? el.className : ""}#${i}`;
}

// Put back whatever inline value the page itself gave the element before the drift was added.
function clear(el: Nudged) {
  if (el.dataset.lifeRot === undefined) el.dataset.lifeRotOwn = el.style.rotate;
  else el.style.rotate = el.dataset.lifeRotOwn ?? "";
  if (el.dataset.lifeReg === undefined) el.dataset.lifeRegOwn = el.style.textShadow;
  else el.style.textShadow = el.dataset.lifeRegOwn ?? "";
}

/** Apply (or re-apply after a resize) the edition's drift to everything printed on the sheets. */
export function nudge(issue: number, root: ParentNode = document) {
  const sheets = root.querySelectorAll<HTMLElement>(".print-sheet, .yn-sheet");
  sheets.forEach((sheet, s) => {
    const tilted = Array.from(sheet.querySelectorAll<Nudged>(TILTED));
    // Only the outermost of nested matches (a burst and its own label) turns.
    const outer = tilted.filter((el) => !tilted.some((o) => o !== el && o.contains(el)));
    outer.forEach((el, i) => {
      clear(el);
      const r = drift(issue, `s${s}:${keyOf(el, i)}`);
      const delta =
        el.dataset.lifeRot ?? String(round((r() < 0.5 ? -1 : 1) * (0.2 + r() * 1.3), 100));
      el.dataset.lifeRot = delta;
      const base = getComputedStyle(el).rotate;
      const baseDeg =
        base === "none" ? 0 : /^-?[\d.]+deg$/.test(base) ? Number.parseFloat(base) : null;
      // An element turned about another axis keeps its own rotation untouched.
      if (baseDeg === null) return;
      el.style.rotate = `${round(baseDeg + Number(delta), 100)}deg`;
    });

    sheet.querySelectorAll<Nudged>(".print-misreg").forEach((el, i) => {
      clear(el);
      const r = drift(issue, `m${s}:${keyOf(el, i)}`);
      const fx =
        el.dataset.lifeReg ?? `${round(0.45 + r() * 1.2, 100)},${round(0.4 + r() * 1.3, 100)}`;
      el.dataset.lifeReg = fx;
      const [kx, ky] = fx.split(",").map(Number);
      const shadow = getComputedStyle(el).textShadow;
      // One shadow, "colour x y blur": scale its offsets by this edition's drift.
      const m = /^(.*?)\s(-?[\d.]+)px\s(-?[\d.]+)px\s(-?[\d.]+)px$/.exec(shadow);
      if (!m || kx === undefined || ky === undefined) return;
      const [, colour, x, y, blur] = m;
      el.style.textShadow = `${colour} ${round(Number(x) * kx)}px ${round(Number(y) * ky)}px ${blur}px`;
    });

    sheet.querySelectorAll<Nudged>(".print-worn").forEach((el, i) => {
      const r = drift(issue, `w${s}:${keyOf(el, i)}`);
      const pos = `${Math.round(r() * 100)}% ${Math.round(r() * 100)}%`;
      el.style.setProperty("mask-position", pos);
      el.style.setProperty("-webkit-mask-position", pos);
    });
  });
}

/** Paper and press settings for the whole edition, as CSS custom properties and filter values. */
export function editionPress(issue: number) {
  const r = seeded(issue * 40503 + 7);
  const scale = round(1.3 + r() * 0.5, 100);
  const slope = round(1.1 + r() * 0.16, 1000);
  return {
    vars: {
      "--paper-x": `${Math.round(r() * 100)}%`,
      "--paper-y": `${Math.round(r() * 100)}%`,
      "--paper-zoom": `${104 + Math.round(r() * 8)}%`,
      "--paper-flip": r() < 0.5 ? "1" : "-1",
    } as Record<string, string>,
    filter: {
      fibreSeed: 1 + Math.floor(r() * 90),
      blotchSeed: 1 + Math.floor(r() * 90),
      dustSeed: 1 + Math.floor(r() * 90),
      scale,
      slope,
      intercept: round(-(slope - 1) / 2, 1000),
      blotchFreq: `${round(0.009 + r() * 0.007, 10000)} ${round(0.022 + r() * 0.016, 10000)}`,
      // How thin the ink runs: more lift in the pale patches on a thin-ink day.
      lift: round(0.45 + r() * 0.15, 100),
      blur: 0.35,
    },
  };
}
