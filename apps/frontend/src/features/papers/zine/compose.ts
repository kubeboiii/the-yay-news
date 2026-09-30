import type { Edition } from "@repo/shared";
import type { EditionPage } from "../types";
import type { BriefsVariant, HeadSize, StoryVariant } from "./blocks";
import { byOrder } from "./text";

/*
 * How each spread is composed. A real paper keeps its grid, type and furniture but lays each page
 * out around the day's stories, so every page type has several deliberate compositions and the
 * choice is made from a seed of (issue, page order, section) plus the content's shape — the same
 * edition always prints the same way, consecutive fronts differ, and no two inside pages in one
 * edition share a composition.
 */

/** FNV-1a: a small, stable string hash. */
export function hash(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** A seeded shuffle (mulberry32), so a permutation is the same on every render. */
function shuffle<T>(items: readonly T[], seed: number): T[] {
  let a = seed || 1;
  const rand = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

// ——— Inside section spreads: the main story's treatment (left page) × the right page's order ———

export type InsideLeft = {
  name: string;
  variant: StoryVariant;
  size: HeadSize;
  dots?: boolean;
  side: "left" | "right";
  /**
   * Picture-led: the main story's first picture on top and its others as a band of frames under
   * it. Only offered when the main story has three or more pictures.
   */
  pics?: "filmstrip" | "contact";
};
export type InsideRight = {
  name: string;
  /** Briefs above or below the second story. */
  briefsFirst: boolean;
  second: StoryVariant;
  secondSide: "left" | "right";
  briefs: BriefsVariant;
};

const LEFTS: InsideLeft[] = [
  { name: "print on top", variant: "top", size: "l", side: "right" },
  { name: "head first, print floated in", variant: "float", size: "xl", side: "right" },
  {
    name: "picture after the opening paragraph",
    variant: "after1",
    size: "l",
    dots: true,
    side: "left",
  },
  { name: "head in a side rail", variant: "rail", size: "m", side: "left" },
  {
    name: "print on top, the rest of the roll on a filmstrip",
    variant: "top",
    size: "l",
    side: "right",
    pics: "filmstrip",
  },
  {
    name: "contact sheet under the print",
    variant: "top",
    size: "xl",
    side: "left",
    pics: "contact",
  },
];

const RIGHTS: InsideRight[] = [
  {
    name: "second story, numbered briefs below",
    briefsFirst: false,
    second: "float",
    secondSide: "left",
    briefs: "numbered",
  },
  {
    name: "taped brief box, second story below",
    briefsFirst: true,
    second: "top",
    secondSide: "left",
    briefs: "box",
  },
  {
    name: "second story on a block of ink, ruled briefs",
    briefsFirst: false,
    second: "boxed",
    secondSide: "right",
    briefs: "ruled",
  },
];

export type InsideComposition = { left: InsideLeft; right: InsideRight; name: string };

const INSIDE: InsideComposition[] = LEFTS.flatMap((left) =>
  RIGHTS.map((right) => ({ left, right, name: `${left.name} / ${right.name}` })),
);

/** The composition of a core section's spread. */
export function insideComposition(edition: Edition, page: EditionPage): InsideComposition {
  const inside = byOrder(edition.pages).filter((p) => p.layout === "section");
  // The shape of the day: which inside pages lead with a picture, and how long their mains run.
  const shape = inside
    .map((p) => {
      const main = byOrder(p.stories)[0];
      return `${p.section?.slug ?? p.order}:${main?.images.length ? "p" : "t"}${Math.round((main?.body.join("").length ?? 0) / 400)}`;
    })
    .join(",");
  const order = shuffle(INSIDE, hash(`${edition.issueNumber}|${shape}`));
  // Walk the pages in order so no two share a composition, skipping picture-led ones for a page
  // whose main story hasn't the pictures for them.
  const used = new Set<string>();
  let pick = order[0]!;
  inside.forEach((p, at) => {
    const main = byOrder(p.stories).find((s) => s.slot !== "brief");
    const pictures = main?.images.length ?? 0;
    // Picture-led spreads need the pictures; a head in a side rail needs a print to run down the
    // rail under it, or the rail stops short of the text beside it.
    const fits = (c: InsideComposition) =>
      (!c.left.pics || pictures >= 3) && (c.left.variant !== "rail" || pictures >= 1);
    const rotation = [...order.slice(at % order.length), ...order.slice(0, at % order.length)];
    const c =
      rotation.find((x) => fits(x) && !used.has(x.name)) ?? rotation.find(fits) ?? order[0]!;
    used.add(c.name);
    if (p.order === page.order) pick = c;
  });
  return pick;
}

// ——— Fronts: three compositions, rotated by issue so consecutive days always differ ———

export type FrontComposition = "cover" | "banner" | "poster";
const FRONTS: FrontComposition[] = ["cover", "banner", "poster"];

export function frontComposition(edition: Edition): FrontComposition {
  return FRONTS[edition.issueNumber % FRONTS.length]!;
}

// ——— Guest and back: two each ———

export type GuestComposition = "clippings" | "split";
export function guestComposition(edition: Edition, page: EditionPage): GuestComposition {
  const main = byOrder(page.stories)[0];
  return (hash(`${edition.issueNumber}|${page.section?.slug}`) + (main?.images.length ? 1 : 0)) %
    2 ===
    0
    ? "clippings"
    : "split";
}

export type BackComposition = "puzzles-left" | "comic-left";
export function backComposition(edition: Edition): BackComposition {
  return edition.issueNumber % 2 === 0 ? "puzzles-left" : "comic-left";
}

// ——— Balancing a spread: both mini pages grow to the taller one, so copy is shared out ———

type Copy = { body: string[]; dek: string; headline: string; images: unknown[] };

/** Millimetres of a full-width reading column that `chars` of body text take (16px, 1.46). */
const textMM = (chars: number, measure = 1) => (chars / 12.5) * measure;

/** A story's rough height on a mini page, in millimetres, for the treatment it is given. */
export function storyMM(story: Copy, variant: StoryVariant, size: HeadSize = "l"): number {
  const chars = story.body.join("").length;
  const pic = story.images.length > 0;
  const headLines = Math.ceil(
    story.headline.length / (size === "xl" ? 22 : size === "l" ? 28 : 36),
  );
  const head =
    headLines * (size === "xl" ? 11 : size === "l" ? 9 : 7.5) +
    8 +
    textMM(story.dek.length) * 1.2 +
    8;
  switch (variant) {
    case "rail":
      return Math.max(head * 1.6 + (pic ? 90 : 0), textMM(chars, 1.55)) + 6;
    case "float":
      return head + textMM(chars) + (pic ? 26 : 0);
    case "boxed":
      return head + textMM(chars, 1.08) + (pic ? 18 : 0) + 12;
    case "after1":
    case "film":
      return head + textMM(chars) + (pic ? 82 : 0);
    case "cart":
      return head + textMM(chars) + 50;
    case "clip":
      return head + textMM(chars, 1.1) + (pic ? 72 : 0) + 18;
    default:
      return head + textMM(chars) + (pic ? 104 : 0);
  }
}

/** A brief's rough height: kicker, two-line head, standfirst and text. */
export const briefMM = (b: Copy) =>
  26 + textMM(b.dek.length) * 1.2 + textMM(b.body.join("").length);

export type Placement = { briefsLeft: number; secondLeft: boolean; name: string };

/**
 * Where the copy goes so the two pages come out closest in length: some or all of the briefs
 * under the main story (the column continues on the right), or the second story under the main.
 */
export function balance(left: number, second: number, briefs: number[]): Placement {
  const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
  const options: [Placement, number][] = [];
  for (let k = 0; k <= briefs.length; k++) {
    const l = left + (k ? 14 + sum(briefs.slice(0, k)) : 0);
    const r = second + (k < briefs.length ? 14 + sum(briefs.slice(k)) : 0);
    options.push([
      { briefsLeft: k, secondLeft: false, name: k ? `${k} brief(s) left` : "briefs right" },
      Math.max(l, r),
    ]);
  }
  options.push([
    { briefsLeft: 0, secondLeft: true, name: "second story left" },
    Math.max(left + second + 8, 14 + sum(briefs)),
  ]);
  const base = options[0]!;
  const best = options.reduce((a, b) => (b[1] < a[1] ? b : a));
  return best[1] < base[1] - 6 ? best[0] : base[0];
}
