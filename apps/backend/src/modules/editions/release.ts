// Local-time release (PLAN §6): there is one edition per calendar date, and a reader sees edition D
// once it is 07:00 on D where they are. These helpers are pure so the rule can be tested exhaustively.

export const RELEASE_HOUR = 7;
export const DEFAULT_TIME_ZONE = "UTC";

// One formatter per zone; formatters are expensive to build. Capped so arbitrary input can't grow it.
const formatters = new Map<string, Intl.DateTimeFormat>();
const MAX_FORMATTERS = 1000;

function formatterFor(timeZone: string): Intl.DateTimeFormat | null {
  const cached = formatters.get(timeZone);
  if (cached) return cached;
  let formatter: Intl.DateTimeFormat;
  try {
    formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      hourCycle: "h23",
    });
  } catch {
    return null; // RangeError: not a time zone Intl knows
  }
  if (formatters.size < MAX_FORMATTERS) formatters.set(timeZone, formatter);
  return formatter;
}

/** The IANA zone to use for a reader: the canonical form of `candidate`, or UTC if it is missing or unknown. */
export function resolveTimeZone(candidate: string | null | undefined): string {
  if (!candidate) return DEFAULT_TIME_ZONE;
  return formatterFor(candidate)?.resolvedOptions().timeZone ?? DEFAULT_TIME_ZONE;
}

/** Calendar date and hour on the wall clock in `timeZone` at the instant `now`. */
function wallClock(now: Date, timeZone: string) {
  const formatter =
    formatterFor(timeZone) ?? (formatterFor(DEFAULT_TIME_ZONE) as Intl.DateTimeFormat);
  const parts = Object.fromEntries(formatter.formatToParts(now).map((p) => [p.type, p.value]));
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
  };
}

const pad = (n: number, width = 2) => String(n).padStart(width, "0");

/**
 * The latest calendar date D (`YYYY-MM-DD`) such that 07:00 on D in `timeZone` is at or before
 * `now`. Every edition dated on or before it has been released to this reader. An unknown zone is
 * treated as UTC.
 *
 * Comparing wall-clock hours is exact here: 07:00 on today's local date has passed iff the local
 * hour is 7 or later, and 07:00 yesterday always has. DST changes happen at night, never at 07:00.
 */
export function releasedDate(now: Date, timeZone: string): string {
  const { year, month, day, hour } = wallClock(now, timeZone);
  // Date.UTC normalises day 0 to the last day of the previous month (and year).
  const date = new Date(Date.UTC(year, month - 1, hour >= RELEASE_HOUR ? day : day - 1));
  return `${pad(date.getUTCFullYear(), 4)}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

/** Whether the edition dated `date` (`YYYY-MM-DD`) has been released to a reader in `timeZone`. */
export const isReleased = (date: string, now: Date, timeZone: string) =>
  date <= releasedDate(now, timeZone);
