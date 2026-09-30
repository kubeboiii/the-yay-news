import { describe, expect, it } from "vitest";
import { HALL_OF_FAME, storyUrl, weeklyPicks } from "../src/stages/weekly.ts";
import { WEEKEND_SECTIONS } from "../src/types.ts";
import { weekStory } from "./fixtures.ts";

const SITE = "https://yay.example";
const WEEKDAYS = ["2026-09-28", "2026-09-29", "2026-09-30", "2026-10-01", "2026-10-02"];
const DAILY = ["tech", "startups", "screen", "play", "music", "money", "sports", "internet"];

/** A week of editions: two stories per daily section per weekday, plus last weekend's pages. */
const week = () => [
  ...WEEKDAYS.flatMap((date) =>
    DAILY.flatMap((section) => [1, 2].map((n) => weekStory(date, section, n))),
  ),
  weekStory("2026-09-26", "weekend-guide", 1, { slot: "lead", page: "front" }),
  weekStory("2026-09-27", "hall-of-fame", 1),
];

describe("the week in 10", () => {
  it("takes at most ten Monday–Friday stories, spread across the sections", () => {
    const { picks } = weeklyPicks(WEEKEND_SECTIONS.saturday, week(), {
      date: "2026-10-03",
      site: SITE,
    });
    const ten = picks.get("week-in-10")!;
    expect(ten.length).toBeLessThanOrEqual(10);
    expect(ten).toHaveLength(10);
    // Only weekday stories: last weekend's pages are not retold.
    expect(ten.every((c) => WEEKDAYS.includes(c.publishedAt!.toISOString().slice(0, 10)))).toBe(
      true,
    );
    // No section's second story before every section has had one.
    const per = new Map<string, number>();
    for (const c of ten) per.set(c.topic, (per.get(c.topic) ?? 0) + 1);
    expect(per.size).toBe(DAILY.length);
    expect(Math.max(...per.values())).toBeLessThanOrEqual(2);
    // Each retelling is filed under the page, links to our story and keeps its picture.
    for (const c of ten) {
      expect(c.section).toBe("week-in-10");
      expect(c.url.startsWith(`${SITE}/issue/`)).toBe(true);
      expect(c.presetImages).toHaveLength(1);
    }
    expect(picks.has("photo-album")).toBe(false);
  });

  it("never retells a back-page story", () => {
    const back = WEEKDAYS.map((d) => weekStory(d, "internet", 9, { page: "back", slot: "lead" }));
    const { picks } = weeklyPicks(["week-in-10"], back, { date: "2026-10-03", site: SITE });
    expect(picks.get("week-in-10")).toEqual([]);
  });
});

describe("the Sunday pages", () => {
  const sunday = [
    ...week(),
    weekStory("2026-09-29", "animal-kingdom", 1, { headline: "An otter learns to juggle pebbles" }),
    weekStory("2026-09-30", "good-humans", 1, {
      headline: "A volunteer knits hats for a whole town",
    }),
    weekStory("2026-10-01", "world-records", 1, { headline: "The longest ever conga line" }),
    weekStory("2026-10-02", "internet", 5, { headline: "A viral video of a dancing goose" }),
    weekStory("2026-10-03", "weekend-guide", 1, { images: [] }),
    weekStory("2026-10-03", "deep-dive", 1, { images: [] }),
  ];
  const run = () =>
    weeklyPicks(WEEKEND_SECTIONS.sunday, sunday, { date: "2026-10-04", site: SITE });

  it("names the week's four Hall of Fame winners, one story each", () => {
    const { picks, awards } = run();
    const hall = picks.get("hall-of-fame")!;
    expect(hall).toHaveLength(4);
    expect(new Set(hall.map((c) => c.id)).size).toBe(4);
    expect(hall.map((c) => awards.get(c.id))).toEqual(HALL_OF_FAME.map((h) => h.award));
    expect(hall.map((c) => c.title)).toEqual([
      "An otter learns to juggle pebbles",
      "A volunteer knits hats for a whole town",
      "The longest ever conga line",
      "A viral video of a dancing goose",
    ]);
  });

  it("prints only pictured stories in the Photo Album, none of them Hall of Fame winners", () => {
    const { picks } = run();
    const album = picks.get("photo-album")!;
    const hall = new Set(picks.get("hall-of-fame")!.map((c) => c.url));
    expect(album.length).toBeGreaterThan(0);
    for (const c of album) {
      expect(c.presetImages).toHaveLength(1);
      expect(c.imageUrl).toBeTruthy();
      expect(hall.has(c.url)).toBe(false);
    }
    // The unpictured weekend pages never make the album.
    const unpictured = sunday.filter((s) => !s.images.length).map((s) => storyUrl(SITE, s));
    expect(album.some((c) => unpictured.includes(c.url))).toBe(false);
  });

  it("builds nothing for pages not in the lineup", () => {
    const { picks } = weeklyPicks(WEEKEND_SECTIONS.saturday, sunday, {
      date: "2026-10-03",
      site: SITE,
    });
    expect([...picks.keys()]).toEqual(["week-in-10"]);
  });
});
