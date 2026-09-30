// Saturday's "The Big Weekend" and Sunday's "The Scrapbook": which weekend sections print on a page
// of their own shape (weekend.tsx), and the editions' names.

export const WEEKEND_PAGES = {
  "week-in-10": "ten",
  "deep-dive": "longread",
  "slow-read": "longread",
  "photo-album": "album",
  "hall-of-fame": "fame",
  "make-and-do": "makedo",
  "next-week": "calendar",
} as const;
export type WeekendKind = (typeof WEEKEND_PAGES)[keyof typeof WEEKEND_PAGES];

/** The weekend page shape for a section, or null for a page on the design's own grid. */
export const weekendKind = (slug: string | null | undefined): WeekendKind | null =>
  slug && slug in WEEKEND_PAGES ? WEEKEND_PAGES[slug as keyof typeof WEEKEND_PAGES] : null;

/** Saturday or Sunday (the date's weekday in UTC), else null. */
export function weekendDay(date: string): "saturday" | "sunday" | null {
  const d = new Date(`${date}T00:00:00Z`).getUTCDay();
  return d === 6 ? "saturday" : d === 0 ? "sunday" : null;
}

/** The weekend edition's own name: "The Big Weekend" on Saturdays, "The Scrapbook" on Sundays. */
export function editionName(date: string): string | null {
  const day = weekendDay(date);
  return day === "saturday" ? "The Big Weekend" : day === "sunday" ? "The Scrapbook" : null;
}
