import { editionSchema } from "@repo/shared";
import { describe, expect, it } from "vitest";
import { toServedEdition } from "../src/contract.ts";
import { BrokenModel, FakeModel, FallbackModel } from "../src/model/index.ts";
import { designFor, guestSectionsFor } from "../src/plan.ts";
import { runEdition } from "../src/pipeline.ts";
import type { Presser } from "../src/stages/illustrate.ts";
import { BEATS_STAGE, MemoryStore } from "../src/store.ts";
import { CORE_SECTIONS, WEEKEND_SECTIONS, type SectionSlug } from "../src/types.ts";
import {
  ALL_SECTIONS,
  PLANTED_GRIM,
  candidate,
  daysHaul,
  sourceText,
  weekStory,
} from "./fixtures.ts";

const press: Presser = async (_url, issue, slug) => `/editions/${issue}/${slug}.jpg`;
const offline = { press, get: async (url: string) => ({ ok: false, status: 599, url, text: "" }) };

function storeWithHistory() {
  const store = new MemoryStore();
  // Yesterday's issue, so today's number follows on.
  store.editions.push({
    id: "e45",
    date: "2026-10-04",
    issueNumber: 45,
    volume: 1,
    status: "scheduled",
    kind: "regular",
    design: "zine",
    colourway: "paint-box",
    guestSections: [],
    pages: [],
    features: [],
    puzzles: [],
  });
  return store;
}

describe("the pipeline, end to end with the fake model", () => {
  it("builds a valid weekday edition from a day's haul and records every decision", async () => {
    const store = storeWithHistory();
    // Yesterday's beats, read back by the store for beat rotation.
    store.beats.push(
      { date: "2026-10-04", section: "sports", beat: "football" },
      { date: "2026-10-04", section: "sports", beat: "tennis" },
    );
    const haul = daysHaul();
    const grim = haul.find((c) => c.title === PLANTED_GRIM().title)!;
    const out = await runEdition({
      date: "2026-10-05",
      store,
      model: new FakeModel(),
      dryRun: true,
      gatherer: async () => haul,
      ...offline,
    });

    expect(out.status).toBe("succeeded");
    const d = out.draft!;
    expect(d).toMatchObject({
      issueNumber: 46,
      status: "scheduled",
      kind: "regular",
      ...designFor("2026-10-05"),
    });
    expect(d.design).toBe("broadsheet"); // a Monday
    // Every daily section has a page, in print order, then two guests: the day's own where the
    // haul has stories for them, otherwise the next in their cycle.
    const inside = d.pages.filter((p) => p.layout === "section").map((p) => p.section);
    expect(inside).toEqual(CORE_SECTIONS);
    const { guests, fallbacks } = guestSectionsFor("2026-10-05");
    const fed = new Set<SectionSlug>(ALL_SECTIONS);
    const guestPages = d.pages.filter((p) => p.layout === "guest").map((p) => p.section);
    expect(guestPages).toEqual([...guests, ...fallbacks].filter((g) => fed.has(g)).slice(0, 2));
    expect(d.guestSections).toEqual(guestPages);
    for (const p of d.pages.slice(1, -1))
      expect(p.stories.filter((s) => !s.isReserve).length, p.section ?? "").toBeGreaterThanOrEqual(
        3,
      );
    // The beats printed are logged for tomorrow's rotation.
    const beats = out.log.find((l) => l.stage === BEATS_STAGE);
    expect(Array.isArray(beats?.data) && beats.data.length).toBeGreaterThan(20);

    const served = toServedEdition(d);
    expect(editionSchema.safeParse(served).success).toBe(true);
    const stories = served.pages.flatMap((p) => p.stories);
    expect(stories.length).toBeGreaterThanOrEqual(28);
    expect(served.pages[0]?.layout).toBe("front");
    expect(served.pages.at(-1)?.layout).toBe("back");
    expect(served.pages[0]?.stories[0]?.slot).toBe("lead");
    expect(d.pages.flatMap((p) => p.stories).some((s) => s.isReserve)).toBe(true);
    expect(served.features.map((f) => f.type)).toEqual(
      expect.arrayContaining([
        "number_of_day",
        "weather",
        "correction",
        "classified",
        "comic",
        "sign_off",
      ]),
    );
    expect(served.puzzles).toHaveLength(5);
    // Dry runs leave the pictures where they are; each is credited and licensed, and none repeats.
    const images = stories.flatMap((s) => s.images);
    expect(images.length).toBeGreaterThan(0);
    for (const i of images) expect(i.licence && i.licenceUrl && i.credit).toBeTruthy();
    expect(new Set(images.map((i) => i.url)).size).toBe(images.length);

    // Every candidate has a recorded decision; the planted grim story was rejected with a reason.
    expect(out.records).toHaveLength(haul.length);
    expect(out.records.find((r) => r.candidate.id === grim.id)).toMatchObject({
      decision: "rejected_blocklist",
      stage: "delight",
    });
    expect(out.records.every((r) => r.decision !== "pending")).toBe(true);
    expect(store.editions).toHaveLength(1); // dry run: nothing filed
    expect(store.runs.get(out.runId!)?.result?.status).toBe("succeeded");
  });

  it("files the edition and presses pictures on a real run, then leaves it alone on a rerun", async () => {
    const store = storeWithHistory();
    const run = () =>
      runEdition({
        date: "2026-10-05",
        store,
        model: new FakeModel(),
        gatherer: async () => daysHaul(),
        ...offline,
      });
    const first = await run();
    expect(first.status).toBe("succeeded");
    const filed = store.editions.find((e) => e.date === "2026-10-05")!;
    expect(filed.pages.flatMap((p) => p.stories).flatMap((s) => s.images)[0]?.url).toMatch(
      /^\/editions\/46\//,
    );
    expect(first.records.filter((r) => r.decision === "published").length).toBeGreaterThanOrEqual(
      28,
    );

    const again = await run();
    expect(again.status).toBe("skipped");
    filed.status = "published";
    expect((await run()).status).toBe("skipped");
  });

  it("builds Saturday's Big Weekend from the week's editions and the weekend's sources", async () => {
    const store = new MemoryStore();
    const weekdays = ["2026-09-28", "2026-09-29", "2026-09-30", "2026-10-01", "2026-10-02"];
    store.week = weekdays.flatMap((date) =>
      ["tech", "music", "sports", "internet", "discoveries"].flatMap((s) =>
        [1, 2].map((n) => weekStory(date, s, n)),
      ),
    );
    // Two long pieces the Deep Dive can be written from.
    const long = [0, 1].map((n) =>
      candidate("discoveries", 40 + n, {
        text: [0, 1, 2].map((k) => sourceText("discoveries", 40 + n + k * 8)).join(" "),
      }),
    );
    const out = await runEdition({
      date: "2026-10-03",
      store,
      model: new FakeModel(),
      dryRun: true,
      gatherer: async () => [...daysHaul(), ...long],
      siteUrl: "https://yay.example",
      ...offline,
    });
    expect(out.status).toBe("succeeded");
    const d = out.draft!;
    expect(d.design).not.toBe("broadsheet");
    expect(editionSchema.safeParse(toServedEdition(d)).success).toBe(true);
    const sections = d.pages.filter((p) => p.layout === "section").map((p) => p.section);
    expect(sections).toEqual(WEEKEND_SECTIONS.saturday);
    expect(d.pages.filter((p) => p.layout === "guest")).toHaveLength(2);
    const page = (s: SectionSlug) =>
      d.pages.find((p) => p.section === s)!.stories.filter((x) => !x.isReserve);
    // The Week in 10 retells ten weekday stories and keeps the pictures they ran with.
    const ten = page("week-in-10");
    expect(ten).toHaveLength(10);
    for (const s of ten) {
      expect(s.sourceUrl).toMatch(/^https:\/\/yay\.example\/issue\/\d+\/story\//);
      expect(s.images[0]?.url).toMatch(/^https:\/\/example\.org\/week\//);
    }
    // The Deep Dive is one long story; the other pages are fed by the daily sections' sources.
    expect(page("deep-dive")).toHaveLength(1);
    expect(page("weekend-guide").length).toBeGreaterThanOrEqual(3);
    expect(page("sports-weekend").length).toBeGreaterThanOrEqual(3);
    // Nothing from a daily section with no page today reaches the paper under its own name.
    const printed = d.pages.flatMap((p) => p.stories).map((s) => s.section);
    for (const s of CORE_SECTIONS) expect(printed).not.toContain(s);
  });

  it("falls back from a broken primary model to the next provider", async () => {
    const model = new FallbackModel([new BrokenModel("claude-code"), new FakeModel()]);
    const out = await runEdition({
      date: "2026-10-05",
      store: new MemoryStore(),
      model,
      dryRun: true,
      gatherer: async () => daysHaul(),
      ...offline,
    });
    expect(out.status).toBe("succeeded");
    expect(out.draft?.design).toBe("broadsheet"); // a Monday
    expect(out.log.some((l) => l.message.includes("claude-code"))).toBe(false); // the model logs itself
  });

  it("files the Slow News Day edition when the news runs dry", async () => {
    const store = new MemoryStore();
    const out = await runEdition({
      date: "2026-10-06",
      store,
      model: new FakeModel(),
      gatherer: async () => [],
      attempts: 1,
      ...offline,
    });
    expect(out.status).toBe("slow_news_day");
    expect(out.draft?.kind).toBe("slow_news_day");
    expect(editionSchema.safeParse(toServedEdition(out.draft!)).success).toBe(true);
    expect(store.editions[0]?.kind).toBe("slow_news_day");
  });

  it("files the Slow News Day edition when every model fails", async () => {
    const out = await runEdition({
      date: "2026-10-07",
      store: new MemoryStore(),
      model: new BrokenModel(),
      dryRun: true,
      gatherer: async () => daysHaul(),
      attempts: 2,
      ...offline,
    });
    expect(out.status).toBe("slow_news_day");
    expect(
      out.log.filter((l) => l.level === "warn" && /retrying/.test(l.message)).length,
    ).toBeGreaterThan(0);
  });
});

describe("the day's design", () => {
  it("prints a broadsheet on weekdays in a rotating colourway, and rotates the weekend designs", () => {
    const week = ["2026-09-28", "2026-09-29", "2026-09-30", "2026-10-01", "2026-10-02"].map(
      designFor,
    );
    expect(new Set(week.map((w) => w.design))).toEqual(new Set(["broadsheet"]));
    expect(new Set(week.map((w) => w.colourway)).size).toBe(5);
    const weekend = ["2026-10-03", "2026-10-04", "2026-10-10", "2026-10-11"].map(
      (d) => designFor(d).design,
    );
    for (let i = 1; i < weekend.length; i++) expect(weekend[i]).not.toBe(weekend[i - 1]);
  });
});
