import { editionDesignProblems, featureSchema, slugSchema } from "@repo/shared";
import { describe, expect, it } from "vitest";
import { draftProblems, toServedEdition } from "../contract.ts";
import { fromEvergreen } from "../slow-news-day.ts";
import { CORE_SECTIONS, GUEST_SECTIONS, type SectionSlug } from "../types.ts";
import {
  BANKS,
  buildSlowNewsDay,
  GUEST_PAIRS,
  NO_REPEAT_DAYS,
  SLOW_DAY_LINEUP,
  type EditionDraft,
} from "./index.ts";

const SECTIONS = new Set([...Object.keys(BANKS)]);
const BANKED_GUESTS = new Set<string>(GUEST_PAIRS.flat());
const allItems = Object.values(BANKS).flatMap((b) => b.items);
const storiesOf = (e: EditionDraft) => [...e.front, ...e.inside.flatMap((p) => p.stories)];
const bankSlugsOf = (e: EditionDraft) =>
  storiesOf(e)
    .map((s) => s.slug)
    .filter((slug) => slug !== "slow-news-day");

const addDays = (date: string, n: number) =>
  new Date(Date.parse(`${date}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);

/** Words that would bring bad news in, even as backstory. */
const GLOOM =
  /\b(died|death|dead|kill\w*|war|disaster\w*|tragedy|tragic|extinct\w*|cancer|murder\w*|crash\w*|flood\w*|famine|pandemic|victims?)\b/i;

describe("the evergreen bank", () => {
  it("holds about 190 items with unique, valid slugs", () => {
    expect(allItems.length).toBeGreaterThanOrEqual(190);
    const slugs = allItems.map((i) => i.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slugSchema.safeParse(slug).success, slug).toBe(true);
    expect(slugs).not.toContain("slow-news-day");
  });

  it("keeps every item complete and free of bad news", () => {
    for (const item of allItems) {
      expect(item.headline.length, item.slug).toBeGreaterThan(10);
      expect(item.dek.length, item.slug).toBeGreaterThan(10);
      expect(item.body.length, item.slug).toBeGreaterThanOrEqual(2);
      const text = [item.kicker, item.headline, item.dek, ...item.body].join(" ");
      expect(text, item.slug).not.toMatch(GLOOM);
    }
  });

  it("files every bank under a real section, and has a bank for every daily section", () => {
    for (const s of Object.keys(BANKS))
      expect([...CORE_SECTIONS, ...GUEST_SECTIONS], s).toContain(s as SectionSlug);
    expect(SLOW_DAY_LINEUP).toEqual(CORE_SECTIONS);
    for (const g of BANKED_GUESTS) expect(GUEST_SECTIONS).toContain(g as SectionSlug);
    for (const b of Object.values(BANKS)) expect(b.perDay).toBeGreaterThanOrEqual(3);
  });
});

describe("buildSlowNewsDay", () => {
  it("builds a slow news day edition with a friendly note on the front", async () => {
    const e = await buildSlowNewsDay("2026-09-30");
    expect(e.kind).toBe("slow_news_day");
    expect(e.date).toBe("2026-09-30");
    expect(e.front.find((s) => s.slot === "lead")?.section).toBe("discoveries");
    const note = e.front.find((s) => s.slug === "slow-news-day");
    expect(note?.headline).toMatch(/slow news day/i);
  });

  it("is a valid edition: design, sections, slugs, features and reserves", async () => {
    for (let i = 0; i < 14; i++) {
      const e = await buildSlowNewsDay(addDays("2026-10-01", i));
      expect(editionDesignProblems(e)).toEqual([]);
      const slugs = storiesOf(e).map((s) => s.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
      for (const s of e.front) expect(SECTIONS.has(s.section ?? "")).toBe(true);
      for (const p of e.inside) expect(SECTIONS.has(p.section)).toBe(true);
      for (const f of e.features)
        expect(featureSchema.safeParse({ ...f, order: 0 }).success).toBe(true);
      expect(storiesOf(e).filter((s) => s.reserve)).toHaveLength(2);
      const guests = e.inside.filter((p) => BANKED_GUESTS.has(p.section));
      expect(guests).toHaveLength(2);
      expect(new Set(guests.map((p) => p.section)).size).toBe(2);
      expect(storiesOf(e).every((s) => s.source === "The Yay News Almanac")).toBe(true);
    }
  });

  it("follows the weekday lineup, then two guest pages, three stories or more a page", async () => {
    // At weekends too: the weekend pages are about the week's news, which no bank can fill.
    for (const date of ["2026-09-30", "2026-10-03", "2026-10-04"]) {
      const e = await buildSlowNewsDay(date);
      expect(e.inside.map((p) => p.section).slice(0, CORE_SECTIONS.length)).toEqual(CORE_SECTIONS);
      expect(e.inside.slice(CORE_SECTIONS.length).every((p) => BANKED_GUESTS.has(p.section))).toBe(
        true,
      );
      expect(e.inside).toHaveLength(CORE_SECTIONS.length + 2);
      for (const p of e.inside)
        expect(p.stories.filter((s) => !s.reserve).length, p.section).toBeGreaterThanOrEqual(3);
    }
  });

  it("passes the edition contract once filed, weekdays and weekends", async () => {
    for (let i = 0; i < 7; i++) {
      const d = fromEvergreen(await buildSlowNewsDay(addDays("2026-10-05", i)), 50 + i);
      expect(draftProblems(d)).toEqual([]);
      expect(d.pages.filter((p) => p.layout === "guest")).toHaveLength(2);
      expect(d.guestSections).toEqual(
        d.pages.filter((p) => p.layout === "guest").map((p) => p.section),
      );
      expect(d.guestSections).toHaveLength(2);
      expect(toServedEdition(d).guestSection?.slug).toBe(d.guestSections[0]);
    }
  });

  it("flags guest sections that do not match the guest pages", async () => {
    const d = fromEvergreen(await buildSlowNewsDay("2026-10-05"), 50);
    const swapped = { ...d, guestSections: [...d.guestSections].reverse() };
    expect(draftProblems(swapped)).toContain("guest sections do not match their pages");
    expect(draftProblems({ ...d, guestSections: d.guestSections.slice(0, 1) })).toContain(
      "guest sections do not match their pages",
    );
  });

  it("prints a broadsheet on weekdays and a weekend design at weekends", async () => {
    expect((await buildSlowNewsDay("2026-09-30")).design).toBe("broadsheet");
    expect(["tabloid", "zine", "midi"]).toContain((await buildSlowNewsDay("2026-10-03")).design);
  });

  it("gives the same paper for the same date", async () => {
    expect(await buildSlowNewsDay("2026-11-11")).toEqual(await buildSlowNewsDay("2026-11-11"));
  });

  it("never repeats an item across consecutive slow days", async () => {
    expect(NO_REPEAT_DAYS).toBeGreaterThanOrEqual(5);
    for (const start of ["2026-01-01", "2026-09-30", "2031-06-15"]) {
      const seen = new Map<string, string>();
      for (let i = 0; i < NO_REPEAT_DAYS; i++) {
        const date = addDays(start, i);
        for (const slug of bankSlugsOf(await buildSlowNewsDay(date))) {
          expect(seen.get(slug), `${slug} on ${date}`).toBeUndefined();
          seen.set(slug, date);
        }
      }
    }
  });

  it("works its way through the whole bank over time", async () => {
    const seen = new Set<string>();
    for (let i = 0; i < 60; i++) {
      for (const slug of bankSlugsOf(await buildSlowNewsDay(addDays("2026-09-30", i))))
        seen.add(slug);
    }
    expect(seen.size).toBe(allItems.length);
  });

  it("rejects something that isn't a date", async () => {
    await expect(buildSlowNewsDay("tomorrow")).rejects.toThrow(/calendar date/);
  });
});
