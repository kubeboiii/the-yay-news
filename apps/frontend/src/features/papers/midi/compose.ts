import type { Edition } from "@repo/shared";
import type { EditionPage } from "../types";
import { ranked } from "./print";

// A real paper keeps its grid, type and furniture but composes every page around the day's
// stories. Each page type has several compositions; which one a page gets is fixed by a seed from
// the issue, the page and its section, and by the content's shape (a composition built around a
// photograph is only offered when the main story has one). No two inside pages of an edition share
// a composition, and the same edition always renders the same way.

/** FNV-1a, so the choice is stable across renders and machines. */
export function seed(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export const FRONTS = ["photo-cover", "type-cover", "framed-cover"] as const;
export type FrontComposition = (typeof FRONTS)[number];

/** Consecutive issues always get different fronts; a cover built on the photo needs one. */
export function frontComposition(edition: Edition, page: EditionPage): FrontComposition {
  const lead = ranked(page.stories)[0];
  const choice = FRONTS[edition.issueNumber % FRONTS.length]!;
  return !lead?.images[0] && choice !== "type-cover" ? "type-cover" : choice;
}

export const INSIDE = [
  "photo-led",
  "photo-led-right",
  "picture-story",
  "headline-across",
  "headline-across-right",
  "boxed-feature",
  "boxed-feature-right",
  "quiet-inset",
  "contact-sheet",
] as const;
export type InsideComposition = (typeof INSIDE)[number];
const PHOTO_LED = new Set<InsideComposition>(["photo-led", "photo-led-right", "picture-story"]);

/** The composition of every core-section page of an edition, by page order. */
export function insideCompositions(edition: Edition): Map<number, InsideComposition> {
  const pages = edition.pages.filter((p) => p.layout === "section");
  const shape = (p: EditionPage) => {
    const main = ranked(p.stories)[0];
    return {
      photo: Boolean(main?.images[0]),
      roll: (main?.images.length ?? 0) >= 3,
      long: (main?.headline.length ?? 0) > 72,
      words: main?.body.join(" ").split(/\s+/).length ?? 0,
    };
  };
  // Pages that can't take a photo-led composition choose first, so they are never left without one.
  const queue = [...pages].sort(
    (a, b) => Number(shape(a).photo) - Number(shape(b).photo) || a.order - b.order,
  );
  const used = new Set<InsideComposition>();
  const out = new Map<number, InsideComposition>();
  for (const p of queue) {
    const s = shape(p);
    const eligible = INSIDE.filter(
      (c) => (s.photo || !PHOTO_LED.has(c)) && (c !== "contact-sheet" || s.roll),
    );
    const start =
      seed(`${edition.issueNumber}:${p.order}:${p.section?.slug}:${s.long}:${s.words > 250}`) %
      eligible.length;
    const rotation = [...eligible.slice(start), ...eligible.slice(0, start)];
    const pick = rotation.find((c) => !used.has(c)) ?? rotation[0]!;
    used.add(pick);
    out.set(p.order, pick);
  }
  return out;
}

export const GUESTS = ["guest-title", "guest-photo"] as const;
export type GuestComposition = (typeof GUESTS)[number];

export function guestComposition(edition: Edition, page: EditionPage): GuestComposition {
  const main = ranked(page.stories)[0];
  const choice = GUESTS[seed(`${edition.issueNumber}:${page.section?.slug}`) % GUESTS.length]!;
  return choice === "guest-photo" && !main?.images[0] ? "guest-title" : choice;
}

export const BACKS = ["puzzles-left", "puzzles-right"] as const;
export type BackComposition = (typeof BACKS)[number];

export const backComposition = (edition: Edition): BackComposition =>
  BACKS[edition.issueNumber % BACKS.length]!;
