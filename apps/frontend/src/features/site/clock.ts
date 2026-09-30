import "server-only";
import { cookies } from "next/headers";
import type { Preview } from "@/features/editions/api";
import { TZ_COOKIE } from "@/features/editions/timezone";

// The reader's own clock, as the server sees it: the timezone cookie the browser set, and the
// preview clock (`?now=`) outside production. It decides which state today's front page is in.

export type ReaderClock = {
  /** The reader's calendar date, YYYY-MM-DD. */
  date: string;
  /** Minutes since the reader's local midnight. */
  minutes: number;
};

/** Papers land at 07:00 local time. */
export const RELEASE_MINUTES = 7 * 60;

function validZone(tz: string | undefined): string {
  if (!tz) return "UTC";
  try {
    new Intl.DateTimeFormat("en-GB", { timeZone: tz });
    return tz;
  } catch {
    return "UTC";
  }
}

export async function readerClock(preview: Preview = {}): Promise<ReaderClock> {
  const tz = validZone((await cookies()).get(TZ_COOKIE)?.value);
  const now = preview.now ? new Date(preview.now) : new Date();
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  );
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
}

/**
 * Before 07:00 the newest paper a reader can have is yesterday's: today's is still on the press.
 * Returns the minutes until it lands, or null once it has (or when the served paper is today's).
 */
export function minutesToPress(clock: ReaderClock, servedDate: string): number | null {
  if (servedDate >= clock.date) return null;
  if (clock.minutes >= RELEASE_MINUTES) return null;
  return RELEASE_MINUTES - clock.minutes;
}
