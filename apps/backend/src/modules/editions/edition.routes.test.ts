import type { ApiError, ArchiveList, Edition } from "@repo/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@repo/db", () => ({ prisma: {} }));
vi.mock("./edition.repository.js", async () => {
  const { fakeRepository, fixtureEditions } = await import("./edition.fixtures.js");
  return { editionRepository: fakeRepository(fixtureEditions()) };
});

const { createApp } = await import("../../app.js");

type Body<T> = { data: T };
const KIRITIMATI = "Pacific/Kiritimati"; // UTC+14

describe("editions routes", () => {
  const app = createApp();
  const get = (path: string, headers?: Record<string, string>) => app.request(path, { headers });

  // 20:00 UTC on Tue 29 Sep: issue 41 (29 Sep) is out everywhere west of UTC+13; issue 42
  // (30 Sep) is out only where it is already 07:00 on Wednesday, i.e. UTC+14.
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-09-29T20:00:00Z"));
  });
  afterEach(() => vi.useRealTimers());

  describe("GET /api/v1/editions/today", () => {
    it("serves a UTC reader the edition released in UTC", async () => {
      const res = await get("/api/v1/editions/today");
      expect(res.status).toBe(200);
      const { data } = (await res.json()) as Body<Edition>;
      expect(data.issueNumber).toBe(41);
      expect(data.date).toBe("2026-09-29");
      expect(data.design).toBe("broadsheet");
      expect(data.colourway).toBe("acid-garden");
    });

    it("takes the timezone from the x-timezone header", async () => {
      const res = await get("/api/v1/editions/today", { "x-timezone": KIRITIMATI });
      expect(((await res.json()) as Body<Edition>).data.issueNumber).toBe(42);
    });

    it("prefers ?tz= over the header", async () => {
      const res = await get(`/api/v1/editions/today?tz=UTC`, { "x-timezone": KIRITIMATI });
      expect(((await res.json()) as Body<Edition>).data.issueNumber).toBe(41);
    });

    it("falls back to UTC for an unknown timezone", async () => {
      const res = await get("/api/v1/editions/today?tz=Mars/Olympus_Mons");
      expect(res.status).toBe(200);
      expect(((await res.json()) as Body<Edition>).data.issueNumber).toBe(41);
    });

    it("releases a scheduled edition on its date, and never serves a draft", async () => {
      vi.setSystemTime(new Date("2026-10-05T12:00:00Z"));
      const res = await get("/api/v1/editions/today");
      expect(((await res.json()) as Body<Edition>).data.issueNumber).toBe(43);
    });

    it("returns the whole edition, with yesterday's answers but not today's", async () => {
      const res = await get("/api/v1/editions/today", { "x-timezone": KIRITIMATI });
      const { data } = (await res.json()) as Body<Edition>;
      expect(data.pages.map((p) => p.layout)).toEqual(["front", "section", "back"]);
      expect(data.lead?.slug).toBe("lead-42");
      expect(data.lead?.image?.licence).toBe("Unsplash License");
      expect(data.guestSection?.slug).toBe("word-nerd");
      expect(data.features.map((f) => f.type)).toEqual(["number_of_day", "weather"]);
      expect(data.puzzles.map((p) => p.type)).toEqual(["riddle", "word_search", "fortune_teller"]);
      expect(data.puzzles[0]).toEqual({
        type: "riddle",
        order: 0,
        data: { title: "The Riddle", question: "Riddle number 42?" },
      });
      expect(data.puzzles.some((p) => "solution" in p)).toBe(false);
      expect(data.puzzles[2]).toMatchObject({
        data: { fortunes: expect.arrayContaining(["Fortune 42.1"]) },
      });
      expect(data.yesterday?.issueNumber).toBe(41);
      expect(data.yesterday?.puzzles.map((p) => [p.type, p.solution])).toEqual([
        ["riddle", { answer: "Answer 41" }],
        [
          "word_search",
          {
            placements: [
              { word: "CAT", start: [0, 0], end: [0, 2] },
              { word: "DOG", start: [1, 1], end: [1, 3] },
              { word: "XXXXX", start: [4, 0], end: [4, 4] },
            ],
          },
        ],
        ["fortune_teller", {}],
      ]);
    });

    it("caches briefly and varies by timezone", async () => {
      const res = await get("/api/v1/editions/today");
      expect(res.headers.get("cache-control")).toBe("public, max-age=60, s-maxage=60");
      expect(res.headers.get("vary")).toContain("x-timezone");
    });

    it("honours ?now= outside production, uncached", async () => {
      const res = await get("/api/v1/editions/today?now=2026-09-30T07:00:00Z");
      expect(((await res.json()) as Body<Edition>).data.issueNumber).toBe(42);
      expect(res.headers.get("cache-control")).toBe("no-store");
    });

    it("rejects a malformed ?now=", async () => {
      const res = await get("/api/v1/editions/today?now=yesterday");
      expect(res.status).toBe(400);
      expect(((await res.json()) as ApiError).error.code).toBe("VALIDATION_ERROR");
    });

    it("returns 404 when nothing has been released yet", async () => {
      vi.setSystemTime(new Date("2026-09-01T12:00:00Z"));
      const res = await get("/api/v1/editions/today");
      expect(res.status).toBe(404);
      expect(res.headers.get("cache-control")).toBeNull();
    });
  });

  describe("GET /api/v1/editions/:issue", () => {
    it("serves a released edition with the long cache policy", async () => {
      const res = await get("/api/v1/editions/41");
      expect(res.status).toBe(200);
      expect(((await res.json()) as Body<Edition>).data.issueNumber).toBe(41);
      expect(res.headers.get("cache-control")).toBe("public, max-age=300, s-maxage=3600");
      expect(res.headers.get("vary")).toContain("x-timezone");
    });

    it("hides an edition not yet released in the reader's zone as a 404", async () => {
      const res = await get("/api/v1/editions/42");
      expect(res.status).toBe(404);
      expect(await res.json()).toEqual({
        error: { code: "NOT_FOUND", message: "Edition not found" },
      });
      expect(res.headers.get("cache-control")).toBeNull();
    });

    it("serves the same edition to a reader where it is already out", async () => {
      const res = await get(`/api/v1/editions/42?tz=${KIRITIMATI}`);
      expect(res.status).toBe(200);
    });

    it("serves a scheduled edition after its date, but never a draft", async () => {
      vi.setSystemTime(new Date("2026-10-05T12:00:00Z"));
      expect((await get("/api/v1/editions/43")).status).toBe(200);
      expect((await get("/api/v1/editions/44")).status).toBe(404);
    });

    it("returns 404 for an unknown issue and 400 for a non-number", async () => {
      expect((await get("/api/v1/editions/999")).status).toBe(404);
      expect((await get("/api/v1/editions/forty-two")).status).toBe(400);
    });
  });

  describe("GET /api/v1/editions/date/:date", () => {
    it("serves a released edition by date", async () => {
      const res = await get("/api/v1/editions/date/2026-09-29");
      expect(((await res.json()) as Body<Edition>).data.issueNumber).toBe(41);
    });

    it("hides an unreleased date as a 404", async () => {
      expect((await get("/api/v1/editions/date/2026-09-30")).status).toBe(404);
      expect((await get("/api/v1/editions/date/2026-10-01")).status).toBe(404);
    });

    it("rejects an impossible date", async () => {
      expect((await get("/api/v1/editions/date/2026-02-30")).status).toBe(400);
    });
  });

  describe("GET /api/v1/editions", () => {
    it("lists released editions newest first", async () => {
      const res = await get(`/api/v1/editions?tz=${KIRITIMATI}`);
      const { data } = (await res.json()) as Body<ArchiveList>;
      expect(data.items.map((e) => e.issueNumber)).toEqual([42, 41]);
      expect(data.items[0]).toMatchObject({
        date: "2026-09-30",
        lead: { slug: "lead-42", headline: "Headline for lead-42" },
        guestSection: { slug: "word-nerd" },
      });
      expect(data.nextCursor).toBeNull();
      expect(res.headers.get("vary")).toContain("x-timezone");
    });

    it("leaves out editions not yet released to the reader", async () => {
      const { data } = (await (await get("/api/v1/editions")).json()) as Body<ArchiveList>;
      expect(data.items.map((e) => e.issueNumber)).toEqual([41]);
    });

    it("paginates with a date cursor", async () => {
      const first = (await (
        await get(`/api/v1/editions?tz=${KIRITIMATI}&limit=1`)
      ).json()) as Body<ArchiveList>;
      expect(first.data.items.map((e) => e.issueNumber)).toEqual([42]);
      expect(first.data.nextCursor).toBe("2026-09-30");

      const second = (await (
        await get(`/api/v1/editions?tz=${KIRITIMATI}&limit=1&cursor=${first.data.nextCursor}`)
      ).json()) as Body<ArchiveList>;
      expect(second.data.items.map((e) => e.issueNumber)).toEqual([41]);
      expect(second.data.nextCursor).toBeNull();
    });

    it("rejects an out-of-range limit", async () => {
      expect((await get("/api/v1/editions?limit=1000")).status).toBe(400);
    });
  });

  it("returns 404 in the standard shape for unknown routes", async () => {
    const res = await get("/nope");
    expect(res.status).toBe(404);
    expect(((await res.json()) as ApiError).error.code).toBe("NOT_FOUND");
  });
});
