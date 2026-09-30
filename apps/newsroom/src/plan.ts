// The shape of a given day's paper: design and colourway by weekday, and which guest section (if
// any) takes a page. All deterministic from the date and issue number.
import {
  BROADSHEET_COLOURWAYS,
  PASTEL_COLOURWAYS,
  WEEKEND_DESIGNS,
  type EditionDesign,
  editionDesignProblems,
  isWeekend,
} from "@repo/shared";
import { dayIndex, hash } from "./text.ts";
import { CORE_SECTIONS, GUEST_SECTIONS, type SectionSlug, WEEKEND_SECTIONS } from "./types.ts";

/**
 * Weekdays print as a broadsheet in a rotating colourway; weekends rotate tabloid, midi and zine in
 * the house or pastel inks. Consecutive days never share a colourway, nor consecutive weekend days a
 * design.
 */
export function designFor(date: string): { design: EditionDesign; colourway: string } {
  const day = dayIndex(date);
  let choice: { design: EditionDesign; colourway: string };
  if (isWeekend(date)) {
    // Count weekend days since the epoch (1970-01-01 was a Thursday, so day 2 was a Saturday).
    const week = Math.floor((day - 2) / 7);
    const k = week * 2 + (new Date(`${date}T00:00:00Z`).getUTCDay() === 0 ? 1 : 0);
    const design = WEEKEND_DESIGNS[((k % 3) + 3) % 3] as EditionDesign;
    choice = { design, colourway: PASTEL_COLOURWAYS[((k % 4) + 4) % 4] as string };
  } else {
    choice = {
      design: "broadsheet",
      colourway: BROADSHEET_COLOURWAYS[day % BROADSHEET_COLOURWAYS.length] as string,
    };
  }
  const problems = editionDesignProblems({ date, ...choice });
  if (problems.length) throw new Error(problems.join("; "));
  return choice;
}

function seededShuffle<T>(items: readonly T[], seed: number): T[] {
  const out = [...items];
  let s = seed || 1;
  for (let i = out.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1103515245) + 12345) >>> 0;
    const j = s % (i + 1);
    [out[i], out[j]] = [out[j] as T, out[i] as T];
  }
  return out;
}

/** Guest pages a day: two, between Discoveries (or the weekend pages) and the back page. */
export const GUESTS_PER_DAY = 2;
/** Days in a guest cycle: every guest runs once per cycle (28 guests, two a day: 14 days). */
export const GUEST_CYCLE_DAYS = Math.ceil(GUEST_SECTIONS.length / GUESTS_PER_DAY);

const pairsOf = (order: SectionSlug[]) => {
  const out = new Set<string>();
  for (let i = 0; i + 1 < order.length; i += GUESTS_PER_DAY) out.add(`${order[i]}>${order[i + 1]}`);
  return out;
};

const orders = new Map<number, SectionSlug[]>();
/**
 * A cycle's guest order: a seeded shuffle, re-drawn until it neither opens with the guest that
 * closed the previous cycle nor repeats any of the previous cycle's pairs in the same order.
 */
export function cycleOrder(cycle: number): SectionSlug[] {
  const cached = orders.get(cycle);
  if (cached) return cached;
  // Cycles before the epoch never print; stop the look-back there.
  const previous = cycle > 0 ? cycleOrder(cycle - 1) : null;
  const seen = previous ? pairsOf(previous) : new Set<string>();
  let order = seededShuffle(GUEST_SECTIONS, hash(`guest-cycle-${cycle}`));
  for (let attempt = 1; attempt < 50 && previous; attempt++) {
    const clash = order[0] === previous.at(-1) || [...pairsOf(order)].some((p) => seen.has(p));
    if (!clash) break;
    order = seededShuffle(GUEST_SECTIONS, hash(`guest-cycle-${cycle}-${attempt}`));
  }
  orders.set(cycle, order);
  return order;
}

/**
 * PLAN §4's rotation: two guest pages a day, drawn by date from a seeded shuffle of all the guest
 * sections, so each runs once every GUEST_CYCLE_DAYS days and never twice within a cycle. The rest
 * of the day's cycle, in order, stands by in case a guest cannot fill its page (`fallbacks`).
 */
export function guestSectionsFor(date: string): {
  guests: SectionSlug[];
  fallbacks: SectionSlug[];
} {
  const day = dayIndex(date);
  const cycle = Math.floor(day / GUEST_CYCLE_DAYS);
  const k = day - cycle * GUEST_CYCLE_DAYS;
  const order = cycleOrder(cycle);
  const guests = order.slice(k * GUESTS_PER_DAY, (k + 1) * GUESTS_PER_DAY);
  // Later days' guests first (they can run again at their own turn), then earlier ones.
  const fallbacks = [
    ...order.slice((k + 1) * GUESTS_PER_DAY),
    ...order.slice(0, k * GUESTS_PER_DAY),
  ];
  return { guests, fallbacks };
}

/** The day's own sections in print order: the daily nine on weekdays, the weekend pages at weekends. */
export function lineupFor(date: string): readonly SectionSlug[] {
  const weekday = new Date(`${date}T00:00:00Z`).getUTCDay();
  if (weekday === 6) return WEEKEND_SECTIONS.saturday;
  if (weekday === 0) return WEEKEND_SECTIONS.sunday;
  return CORE_SECTIONS;
}

/**
 * At weekends the daily sections have no pages, so their sources feed the weekend pages: what to
 * watch and hear, the weekend's sport, the long reads, the makes and next week's diary.
 */
export const WEEKEND_FEEDS: Partial<Record<SectionSlug, SectionSlug[]>> = {
  screen: ["weekend-guide", "next-week"],
  music: ["weekend-guide", "next-week"],
  play: ["weekend-guide", "next-week"],
  sports: ["sports-weekend"],
  tech: ["next-week", "deep-dive"],
  startups: ["next-week"],
  discoveries: ["deep-dive", "slow-read"],
  internet: ["deep-dive"],
  money: ["deep-dive"],
  "time-machine": ["slow-read"],
  "dig-site": ["slow-read", "deep-dive"],
  "art-and-design": ["make-and-do", "slow-read"],
  "food-and-drink": ["make-and-do"],
  "future-stuff": ["next-week", "deep-dive"],
  postcards: ["slow-read"],
};
