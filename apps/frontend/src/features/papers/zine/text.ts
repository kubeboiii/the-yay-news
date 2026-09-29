import type { Edition, Feature } from "@repo/shared";
import type { EditionPage, Reading } from "../types";

// Small, pure helpers the zine templates share: dates, folios, grounds, and the sizes of type that
// has to fit a measure whatever the edition's copy is.

const at = (date: string) => new Date(`${date}T00:00:00Z`);

/** "Saturday 3 October 2026", from a YYYY-MM-DD calendar date, in UTC. */
export const longDate = (date: string) =>
  new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(at(date));

/** "Sat 3 Oct 2026", for folios. */
export const shortDate = (date: string) =>
  new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(at(date));

export const weekday = (date: string) =>
  new Intl.DateTimeFormat("en-GB", { weekday: "long", timeZone: "UTC" }).format(at(date));

/**
 * One edition page (one route) prints as one spread of two mini pages, so the page at index i of
 * the edition is mini pages 2i + 1 (left) and 2i + 2 (right). The front route is the cover and
 * page 2; the first inside section starts on page 3.
 */
export function folios(reading: Reading, order: number): [number, number] {
  const i = Math.max(
    0,
    reading.pages.findIndex((p) => p.order === order),
  );
  return [2 * i + 1, 2 * i + 2];
}

export const pad2 = (n: number) => String(n).padStart(2, "0");

export type Ground = "mint" | "pink" | "lilac" | "blue" | "butter" | "peach";

// Each spread sits on its own pair of grounds. Which inks lead changes day to day: the pair is
// picked from the six grounds by (issue, page order), stepping so neighbouring spreads never share
// a pair and the same edition always prints the same way.
const ORDER: Ground[] = ["mint", "pink", "lilac", "blue", "butter", "peach"];

export function groundsFor(issue: number, order: number): [Ground, Ground] {
  const i = (issue * 5 + order * 2) % 6;
  const j = (i + 1 + ((issue + order) % 4)) % 6;
  return [ORDER[i]!, ORDER[j === i ? (i + 1) % 6 : j]!];
}

/** The size (mm) that fits `text` on one line of `width` mm in the slab face, within bounds. */
export function fitSize(text: string, width: number, max: number, min: number): number {
  const est = width / (Math.max(text.length, 1) * 0.62);
  return Math.round(Math.min(max, Math.max(min, est)) * 10) / 10;
}

/** A headline's size (mm) on a mini page, stepped down as it gets longer. */
export function headSize(text: string, steps: [number, number, number, number]): number {
  const n = text.length;
  return n <= 32 ? steps[0] : n <= 56 ? steps[1] : n <= 80 ? steps[2] : steps[3];
}

/** Splits out the first figure in a headline ("10 million", "60", "1994") so it can be ringed. */
export function ringSplit(text: string): [string, string, string] | null {
  const m = /\b\d[\d,.:]*(?:\s(?:million|billion|thousand|years?|minutes?|km|per cent))?/.exec(
    text,
  );
  if (!m) return null;
  return [text.slice(0, m.index), m[0], text.slice(m.index + m[0].length)];
}

export const features = <T extends Feature["type"]>(edition: Edition, type: T) =>
  edition.features
    .filter((f): f is Extract<Feature, { type: T }> => f.type === type)
    .sort((a, b) => a.order - b.order);

export const feature = <T extends Feature["type"]>(edition: Edition, type: T) =>
  features(edition, type)[0] ?? null;

export const byOrder = <T extends { order: number }>(xs: T[]) =>
  [...xs].sort((a, b) => a.order - b.order);

/** The line the front-page index prints for a page: its main headline (the back: its puzzles). */
export function teaseFor(edition: Edition, order: number): string {
  const page: EditionPage | undefined = edition.pages.find((p) => p.order === order);
  if (!page) return "";
  if (page.layout === "back") {
    const kinds = edition.puzzles.map((p) =>
      p.type === "crossword"
        ? "the Mini crossword"
        : p.type === "riddle"
          ? "a riddle"
          : "a word ladder",
    );
    const comic = feature(edition, "comic");
    const bits = [...kinds, comic ? comic.content.title : null].filter(Boolean) as string[];
    return bits.length
      ? `${bits.slice(0, -1).join(", ")}${bits.length > 1 ? " and " : ""}${bits.at(-1)}.`
      : "Corrections, classifieds and the sign-off.";
  }
  return byOrder(page.stories)[0]?.headline ?? page.section?.tagline ?? "";
}

/** Splits the sign-off into its first sentence (set big) and the rest. */
export function signOffLines(edition: Edition): [string, string] {
  const text =
    feature(edition, "sign_off")?.content.text ?? "You’re done for today. See you tomorrow.";
  const i = text.search(/[.!?]\s/);
  if (i === -1) return [text, ""];
  return [text.slice(0, i + 1), text.slice(i + 2)];
}
