import { describe, expect, it } from "vitest";
import { GUEST_CYCLE_DAYS, GUESTS_PER_DAY, guestSectionsFor, lineupFor } from "../src/plan.ts";
import { dayIndex } from "../src/text.ts";
import { CORE_SECTIONS, GUEST_SECTIONS, WEEKEND_SECTIONS } from "../src/types.ts";

const dateOf = (day: number) => new Date(day * 86_400_000).toISOString().slice(0, 10);
/** The guests of each day of cycle `c`, in order. */
const cycle = (c: number) =>
  Array.from(
    { length: GUEST_CYCLE_DAYS },
    (_, k) => guestSectionsFor(dateOf(c * GUEST_CYCLE_DAYS + k)).guests,
  );

describe("the day's lineup", () => {
  it("prints the daily sections on weekdays", () => {
    for (const date of ["2026-09-28", "2026-09-30", "2026-10-02"])
      expect(lineupFor(date)).toEqual(CORE_SECTIONS);
    expect(CORE_SECTIONS).toEqual([
      "tech",
      "startups",
      "screen",
      "play",
      "music",
      "money",
      "sports",
      "internet",
      "discoveries",
    ]);
  });

  it("prints The Big Weekend on Saturdays and The Scrapbook on Sundays", () => {
    expect(lineupFor("2026-10-03")).toEqual(WEEKEND_SECTIONS.saturday);
    expect(lineupFor("2026-10-03")).toEqual([
      "week-in-10",
      "weekend-guide",
      "sports-weekend",
      "deep-dive",
    ]);
    expect(lineupFor("2026-10-04")).toEqual(WEEKEND_SECTIONS.sunday);
    expect(lineupFor("2026-10-04")).toEqual([
      "photo-album",
      "hall-of-fame",
      "slow-read",
      "make-and-do",
      "next-week",
    ]);
  });
});

describe("the guest rotation", () => {
  const first = Math.floor(dayIndex("2026-09-30") / GUEST_CYCLE_DAYS);
  const cycles = Array.from({ length: 30 }, (_, i) => first + i);

  it("runs two different guests a day", () => {
    for (const c of cycles) {
      for (const guests of cycle(c)) {
        expect(guests).toHaveLength(GUESTS_PER_DAY);
        expect(new Set(guests).size).toBe(GUESTS_PER_DAY);
      }
    }
  });

  it("runs every guest exactly once per cycle", () => {
    expect(GUEST_CYCLE_DAYS).toBe(Math.ceil(GUEST_SECTIONS.length / GUESTS_PER_DAY));
    for (const c of cycles) {
      const all = cycle(c).flat();
      expect(new Set(all).size, `cycle ${c}`).toBe(all.length);
      expect([...all].sort()).toEqual([...GUEST_SECTIONS].sort());
    }
  });

  it("never repeats a day's ordered pair in the next cycle, nor opens with the last guest", () => {
    for (const c of cycles) {
      const pairs = (x: number) => new Set(cycle(x).map((g) => g.join(">")));
      const before = pairs(c - 1);
      for (const p of pairs(c))
        expect(before.has(p), `${p} in cycles ${c - 1} and ${c}`).toBe(false);
      expect(cycle(c)[0]![0]).not.toBe(
        cycle(c - 1)
          .at(-1)!
          .at(-1),
      );
    }
  });

  it("stands the rest of the cycle by, later days first, never the day's own guests", () => {
    const date = "2026-09-30";
    const { guests, fallbacks } = guestSectionsFor(date);
    expect(fallbacks).toHaveLength(GUEST_SECTIONS.length - GUESTS_PER_DAY);
    expect(fallbacks.some((f) => guests.includes(f))).toBe(false);
    const k = dayIndex(date) % GUEST_CYCLE_DAYS;
    if (k < GUEST_CYCLE_DAYS - 1) {
      const tomorrow = guestSectionsFor(dateOf(dayIndex(date) + 1)).guests;
      expect(fallbacks.slice(0, GUESTS_PER_DAY)).toEqual(tomorrow);
    }
  });

  it("is the same for the same date", () => {
    expect(guestSectionsFor("2026-11-11")).toEqual(guestSectionsFor("2026-11-11"));
  });
});
