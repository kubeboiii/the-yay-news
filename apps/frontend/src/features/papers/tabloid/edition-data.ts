import type { Edition, EditionSummary, Feature, FeatureType, StoryItem } from "@repo/shared";

// Small readers over an edition's data, shared by every tabloid template.

type FeatureOf<T extends FeatureType> = Extract<Feature, { type: T }>;

/** Every feature of one type, in print order. */
export function featuresOf<T extends FeatureType>(edition: Edition, type: T): FeatureOf<T>[] {
  return edition.features
    .filter((f): f is FeatureOf<T> => f.type === type)
    .sort((a, b) => a.order - b.order);
}

export const featureOf = <T extends FeatureType>(edition: Edition, type: T) =>
  featuresOf(edition, type)[0] ?? null;

const utcDate = (date: string) => new Date(`${date}T00:00:00Z`);

/** "Sat 26 Sept 2026": the folio date, taken in UTC because `date` is a calendar date. */
export const folioDate = (date: string) =>
  new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })
    .formatToParts(utcDate(date))
    .map((p) => (p.type === "literal" ? " " : p.value))
    .join("")
    .replace(/\s+/g, " ");

/** "Saturday 26 September 2026". */
export const longDate = (date: string) =>
  new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
    .formatToParts(utcDate(date))
    .map((p) => (p.type === "literal" ? " " : p.value))
    .join("")
    .replace(/\s+/g, " ");

/** "Saturday". */
export const weekday = (date: string) =>
  new Intl.DateTimeFormat("en-GB", { weekday: "long", timeZone: "UTC" }).format(utcDate(date));

export const isWeekendDate = (date: string) => {
  const d = utcDate(date).getUTCDay();
  return d === 0 || d === 6;
};

export const issueLine = (e: Pick<EditionSummary, "volume" | "issueNumber">) =>
  `Vol. ${e.volume} · No. ${e.issueNumber}`;

/** Minutes to read every story in the edition. */
export const editionMinutes = (edition: Edition) =>
  edition.pages.reduce((n, p) => n + p.stories.reduce((m, s) => m + s.readMinutes, 0), 0);

/** A page's stories in print order, the lead or feature first. */
export function ordered(stories: StoryItem[]): StoryItem[] {
  const rank = { lead: 0, feature: 1, brief: 2 } as const;
  return [...stories].sort((a, b) => rank[a.slot] - rank[b.slot] || a.order - b.order);
}

export const pad2 = (n: number) => String(n).padStart(2, "0");

/** "Headline." — full stop only where the text doesn't already end in punctuation. */
export const sentence = (s: string) => (/[.!?…’”"')]$/.test(s.trim()) ? s.trim() : `${s.trim()}.`);

export const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** "WANTED" → "Wanted". */
export const titleCase = (s: string) =>
  s === s.toUpperCase() ? s.charAt(0) + s.slice(1).toLowerCase() : s;

/** Splits "PIP: Hello" into the speaker and the line. */
export function speech(line: string) {
  const m = /^([A-Z][A-Z .'’-]{0,24}):\s*(.*)$/.exec(line);
  return m ? { who: titleCase(m[1]!), said: m[2]! } : { who: "", said: line };
}

/** Splits "You're done for today. See you tomorrow." into its first sentence and the rest. */
export function splitFirstSentence(text: string): [string, string] {
  const m = /^(.+?[.!?])\s+(.+)$/.exec(text.trim());
  return m ? [m[1]!, m[2]!] : [text.trim(), ""];
}

/** The longest word in a string, for sizing type that must not break inside a word. */
export const longestWord = (s: string) =>
  s.split(/\s+/).reduce((n, w) => Math.max(n, [...w].length), 0);

/** The source's host, for a printed source line. */
export function host(url: string) {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}
