import type { StampInfo } from "@/features/habits/core";

// A month as the stamp calendar prints it: Monday-first weeks, each day with its stamp (if the
// paper of that date was finished), whether it was a rest day inside the run, and whether it's
// today. Shared by the three directions' stamp calendars.

export type CalDay = {
  date: string;
  day: number;
  stamp: StampInfo | null;
  rest: boolean;
  today: boolean;
  future: boolean;
};

export function monthGrid(
  month: string,
  stamps: readonly StampInfo[],
  restDays: readonly string[],
  today: string,
): { label: string; weeks: (CalDay | null)[][] } {
  const first = new Date(`${month}-01T00:00:00Z`);
  const label = first.toLocaleString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
  const byDate = new Map(stamps.map((s) => [s.date, s]));
  const rest = new Set(restDays);
  const lead = (first.getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
  const cells: (CalDay | null)[] = Array.from({ length: lead }, () => null);
  for (let d = 1; d <= days; d++) {
    const date = `${month}-${String(d).padStart(2, "0")}`;
    cells.push({
      date,
      day: d,
      stamp: byDate.get(date) ?? null,
      rest: rest.has(date),
      today: date === today,
      future: date > today,
    });
  }
  while (cells.length % 7) cells.push(null);
  const weeks: (CalDay | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return { label, weeks };
}

export const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];
