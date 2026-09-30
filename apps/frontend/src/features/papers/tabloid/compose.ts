import type { Edition, StoryItem } from "@repo/shared";
import type { CSSProperties } from "react";
import type { EditionPage } from "../types";
import { ordered } from "./edition-data";

// Page compositions. The tabloid keeps one grid — three columns, the width that gives body type a
// comfortable measure — and composes each page differently around that day's stories: where the
// photograph sits and how big, which story leads, where the briefs go, and which side of the page
// things fall. Every composition is a named, fixed arrangement a designer drew; which one a page
// gets is decided from the issue, the page and the shape of its stories, so the same edition
// always prints the same way, consecutive fronts differ and no two inside pages of an edition
// share a composition.

export type Area =
  "head" | "photo" | "body" | "second" | "briefs" | "rail" | "f1" | "f2" | "extra" | "pics";

export type Composition = {
  /** "across", "across/m" (mirrored)… — what the report and the page's data attribute call it. */
  name: string;
  /** Rows of grid-template-areas, three columns each. */
  areas: string[];
  /** The photograph's row, which is given a generous minimum height (a splash more still). */
  grow?: number;
  /** The headline is printed on the photograph rather than above it. */
  onPhoto?: boolean;
  /** The second story is set in a tinted box. */
  boxed?: boolean;
  /**
   * The main story's further pictures run as a band of their own in the "pics" area: frames on
   * a filmstrip, or off the contact sheet.
   */
  pics?: "filmstrip" | "contact";
};

/** Where an area sits: its first row and column and how many columns it spans. */
export type Place = { row: number; col: number; span: number };

export function places(c: Composition): Partial<Record<Area, Place>> {
  const out: Partial<Record<Area, Place>> = {};
  c.areas.forEach((row, r) => {
    const cells = row.split(" ");
    cells.forEach((cell, col) => {
      const a = cell as Area;
      if (cell === "." || out[a]) return;
      out[a] = { row: r, col, span: cells.filter((x) => x === cell).length };
    });
  });
  return out;
}

const mirror = (c: Composition): Composition => ({
  ...c,
  name: `${c.name}/m`,
  areas: c.areas.map((r) => r.split(" ").reverse().join(" ")),
});

// ---------- inside pages ----------

/** Compositions for a main story with a photograph. */
const INSIDE_PHOTO: Composition[] = [
  {
    name: "splash",
    areas: ["photo photo photo", "body body briefs", "second second briefs"],
    grow: 0,
    onPhoto: true,
  },
  {
    name: "across",
    areas: ["head head head", "photo photo body", "second briefs briefs"],
    grow: 1,
  },
  { name: "side", areas: ["photo head head", "photo body body", "briefs second second"], grow: 1 },
  {
    name: "boxed",
    areas: ["head head second", "photo photo second", "body body second", "briefs briefs briefs"],
    grow: 1,
    boxed: true,
  },
  {
    name: "strip",
    areas: ["briefs briefs briefs", "photo photo head", "photo photo body", "second second second"],
    grow: 2,
  },
];

/**
 * Picture-led compositions, offered only when the main story has three or more photographs: the
 * best one set big, the rest printed as a band of frames beneath it.
 */
const INSIDE_PICS: Composition[] = [
  {
    name: "reel",
    areas: ["photo photo photo", "pics pics pics", "body body briefs", "second second briefs"],
    grow: 0,
    onPhoto: true,
    pics: "filmstrip",
  },
  {
    name: "contact",
    areas: ["head head head", "photo photo body", "pics pics body", "second briefs briefs"],
    grow: 1,
    pics: "contact",
  },
];

/** Compositions for a main story without one: type-led pages. */
const INSIDE_TYPE: Composition[] = [
  { name: "across", areas: ["head head head", "body body body", "second second briefs"] },
  { name: "side", areas: ["briefs head head", "briefs body body", "briefs second second"] },
  {
    name: "boxed",
    areas: ["head head second", "body body second", "briefs briefs briefs"],
    boxed: true,
  },
  { name: "strip", areas: ["briefs briefs briefs", "head head head", "body body second"] },
];

const withMirrors = (list: Composition[]) => list.flatMap((c) => [c, mirror(c)]);

/** A small, stable hash (FNV-1a) of the things a choice depends on. */
export function hash(...parts: (string | number)[]): number {
  let h = 2166136261;
  for (const ch of parts.join("|")) {
    h ^= ch.codePointAt(0)!;
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const base = (name: string) => name.split("/")[0]!;

/** The composition of every inside page of an edition, by page order. */
export function insideCompositions(edition: Edition): Map<number, Composition> {
  const pages = [...edition.pages]
    .filter((p) => p.layout === "section")
    .sort((a, b) => a.order - b.order);
  const used = new Set<string>();
  // Each of the arrangements is used once before any comes back mirrored.
  const usedBases = new Set<string>();
  const out = new Map<number, Composition>();
  let prev = "";
  for (const p of pages) {
    const [main, second] = ordered(p.stories);
    const photo = Boolean(main?.images.length);
    const pics = (main?.images.length ?? 0) >= 3;
    const pool = withMirrors(photo ? [...INSIDE_PHOTO, ...(pics ? INSIDE_PICS : [])] : INSIDE_TYPE);
    // The content's shape nudges the choice: a long headline reads better across the page than
    // on a photograph, and a second story with its own picture suits being boxed or run wide.
    const bias = (c: Composition) =>
      (main && main.headline.length > 82 && c.onPhoto ? 3 : 0) +
      (second?.images.length && (c.boxed || base(c.name) === "strip") ? -1 : 0);
    const ranked = pool
      .map((c) => ({
        c,
        k: bias(c) * 1e10 + hash(edition.issueNumber, p.order, p.section?.slug ?? "", c.name),
      }))
      .sort((a, b) => a.k - b.k)
      .map((x) => x.c);
    const pick =
      ranked.find((c) => !usedBases.has(base(c.name))) ??
      ranked.find((c) => !used.has(c.name) && base(c.name) !== prev) ??
      ranked.find((c) => !used.has(c.name)) ??
      ranked[0]!;
    used.add(pick.name);
    usedBases.add(base(pick.name));
    prev = base(pick.name);
    out.set(p.order, pick);
  }
  return out;
}

/** How much a story fills: its text, its head, and its picture if it has one. */
const weight = (stories: StoryItem[]) =>
  stories.reduce(
    (n, s) => n + s.body.join(" ").length + s.dek.length + 260 + (s.images.length ? 1100 : 0),
    0,
  );

/**
 * Where the second story and the briefs share a row, split its three columns between them so the
 * two end at about the same depth rather than leaving one column of empty paper.
 */
export function balanced(c: Composition, page: EditionPage): Composition {
  const all = ordered(page.stories);
  const feats = all.filter((s) => s.slot !== "brief");
  const second = feats.slice(1, 2);
  const briefs = [...feats.slice(2), ...all.filter((s) => s.slot === "brief")];
  if (!second.length) return { ...c, areas: withoutSecond(c.areas) };
  const areas = c.areas.map((row) => {
    const cells = row.split(" ");
    if (cells.length !== 3 || !cells.every((x) => x === "second" || x === "briefs")) return row;
    if (!cells.includes("second") || !cells.includes("briefs")) return row;
    // Only a row the two have to themselves: an area that also runs through another row must keep
    // its columns, or the grid's areas stop being rectangles.
    if (c.areas.some((r) => r !== row && /\b(second|briefs)\b/.test(r))) return row;
    const secondFirst = cells[0] === "second";
    const ws = weight(second);
    const wb = weight(briefs);
    const spanS = Math.abs(ws / 2 - wb) < Math.abs(ws - wb / 2) ? 2 : 1;
    const out = [
      ...Array<string>(spanS).fill("second"),
      ...Array<string>(3 - spanS).fill("briefs"),
    ];
    return (secondFirst ? out : out.reverse()).join(" ");
  });
  return { ...c, areas };
}

/** Whether every area of a grid is a rectangle (grid-template-areas' own rule). */
function rectangular(rows: string[][]): boolean {
  const names = new Set(rows.flat());
  for (const name of names) {
    const at = rows.flatMap((r, y) => r.flatMap((x, i) => (x === name ? [[y, i] as const] : [])));
    const ys = at.map(([y]) => y);
    const xs = at.map(([, i]) => i);
    const h = Math.max(...ys) - Math.min(...ys) + 1;
    const w = Math.max(...xs) - Math.min(...xs) + 1;
    if (h * w !== at.length) return false;
  }
  return true;
}

/**
 * A page with no second story: its area would be a stretch of bare paper, so a neighbouring
 * area takes its cells over — the one beside it in its row, or the one above or below — whichever
 * keeps every area a rectangle.
 */
function withoutSecond(areas: string[]): string[] {
  const rows = areas.map((r) => r.split(" "));
  // Briefs down a column beside the story's text would run on far below it: the briefs go across
  // the foot instead, and the story's areas widen into their columns.
  const across = rows
    .map((r) => {
      const keep = r.filter((x) => x !== "second" && x !== "briefs");
      return keep.length ? r.map((x) => (x === "second" || x === "briefs" ? keep[0]! : x)) : null;
    })
    .filter((r): r is string[] => r !== null);
  if (rows.flat().includes("briefs") && across.length) {
    const trial = [...across, ["briefs", "briefs", "briefs"]];
    if (rectangular(trial)) return trial.map((r) => r.join(" "));
  }
  for (let y = 0; y < rows.length; y++) {
    if (!rows[y]!.includes("second")) continue;
    const row = rows[y]!;
    const others = [...new Set(row.filter((x) => x !== "second"))];
    const candidates = [
      ...others,
      ...(y > 0 ? rows[y - 1]!.filter((x) => x !== "second") : []),
      ...(y < rows.length - 1 ? rows[y + 1]!.filter((x) => x !== "second") : []),
    ];
    for (const name of new Set(candidates)) {
      const trial = rows.map((r) => r.map((x) => (x === "second" ? name : x)));
      if (rectangular(trial)) return trial.map((r) => r.join(" "));
    }
  }
  return areas;
}

export function insideComposition(edition: Edition, page: EditionPage): Composition {
  return balanced(insideCompositions(edition).get(page.order) ?? INSIDE_TYPE[0]!, page);
}

// ---------- the front ----------

const FRONT: Composition[] = [
  {
    name: "splash",
    areas: ["photo photo photo", "body body rail", "f1 f2 rail"],
    grow: 0,
    onPhoto: true,
  },
  {
    name: "across",
    areas: ["head head head", "photo photo rail", "body body body", "f1 f1 f2"],
    grow: 1,
  },
  {
    name: "side",
    // The rail stands beside the head and the picture only (the picture fills its depth); the
    // text runs across under both, so the rail never ends in bare paper above the story's foot.
    areas: ["rail head head", "rail photo photo", "body body body", "f1 f1 f2"],
    grow: 1,
  },
];
const FRONT_TYPE: Composition = {
  name: "type",
  areas: ["head head head", "body body rail", "f1 f2 rail"],
};

/** Consecutive issues always get different fronts: the issue number walks the three in turn. */
export function frontComposition(edition: Edition, lead: StoryItem | undefined): Composition {
  if (!lead?.images.length) return FRONT_TYPE;
  return FRONT[edition.issueNumber % FRONT.length]!;
}

// ---------- guest and back ----------

const GUEST: Composition[] = [
  {
    name: "guest-across",
    areas: ["head head head", "photo photo body", "second second briefs"],
    grow: 1,
  },
  {
    name: "guest-side",
    areas: ["photo head head", "photo body body", "briefs second second"],
    grow: 1,
  },
];
const GUEST_TYPE: Composition[] = [
  { name: "guest-across", areas: ["head head head", "body body body", "second second briefs"] },
  { name: "guest-side", areas: ["briefs head head", "briefs body body", "briefs second second"] },
];

export function guestComposition(edition: Edition, page: EditionPage): Composition {
  const [main] = ordered(page.stories);
  const list = main?.images.length ? GUEST : GUEST_TYPE;
  return balanced(list[(edition.issueNumber + page.order) % list.length]!, page);
}

/** The back page: puzzles first, or the comic first. */
export const backComposition = (edition: Edition) =>
  edition.issueNumber % 2 === 0 ? "puzzles-first" : "comic-first";

// ---------- CSS ----------

const PHONE_ORDER: Area[] = [
  "head",
  "photo",
  "pics",
  "body",
  "rail",
  "f1",
  "f2",
  "second",
  "briefs",
  "extra",
];

/** The grid for a composition: desktop areas, the row that grows, and the phone's single column. */
export function gridStyle(c: Composition, present: Area[]): CSSProperties {
  const tall = c.onPhoto ? 150 : 100;
  const rows = c.areas.map((_, i) =>
    // The growing row is flexible, so an area running down beside it (a rail) deepens that row,
    // the picture's, rather than opening space under a headline.
    i === c.grow ? `minmax(calc(var(--u) * ${tall}), 1fr)` : "auto",
  );
  const phone = PHONE_ORDER.filter(
    (a) => present.includes(a) && c.areas.some((r) => r.includes(a)),
  );
  return {
    "--areas": c.areas.map((r) => `"${r}"`).join(" "),
    "--rows": rows.join(" "),
    "--areas-phone": phone.map((a) => `"${a}"`).join(" "),
  } as CSSProperties;
}
