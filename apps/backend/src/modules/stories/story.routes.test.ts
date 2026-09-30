import type { Story } from "@repo/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@repo/db", () => ({ prisma: {} }));
vi.mock("../editions/edition.repository.js", async () => {
  const { fakeRepository, fixtureEditions } = await import("../editions/edition.fixtures.js");
  return { editionRepository: fakeRepository(fixtureEditions()) };
});

const { createApp } = await import("../../app.js");

type Body<T> = { data: T };

describe("stories routes", () => {
  const app = createApp();
  const get = async (path: string) => {
    const res = await app.request(path);
    return { res, body: res.status === 200 ? ((await res.json()) as Body<Story>).data : null };
  };

  // Issue 41 is out in UTC; issue 42 is not.
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-09-29T20:00:00Z"));
  });
  afterEach(() => vi.useRealTimers());

  it("serves the lead with its edition, page and next story", async () => {
    const { res, body } = await get("/api/v1/editions/41/stories/lead-41");
    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toBe("public, max-age=300, s-maxage=3600");
    expect(body).toMatchObject({
      story: { slug: "lead-41", slot: "lead", section: { slug: "discoveries" } },
      edition: { issueNumber: 41, date: "2026-09-29", lead: { slug: "lead-41" } },
      page: { order: 1, layout: "front", section: null },
      prev: null,
      next: { slug: "game-a-41", headline: "Headline for game-a-41" },
    });
  });

  it("links neighbours across pages in reading order", async () => {
    const { body: middle } = await get("/api/v1/editions/41/stories/game-a-41");
    expect(middle?.prev?.slug).toBe("lead-41");
    expect(middle?.next?.slug).toBe("game-b-41");
    expect(middle?.page).toMatchObject({ order: 2, section: { slug: "play" } });

    const { body: last } = await get("/api/v1/editions/41/stories/game-b-41");
    expect(last?.prev?.slug).toBe("game-a-41");
    expect(last?.next).toBeNull();
  });

  it("returns 404 for a story of an edition not yet released to the reader", async () => {
    const { res } = await get("/api/v1/editions/42/stories/lead-42");
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: { code: "NOT_FOUND", message: "Story not found" } });
    expect(
      (await get("/api/v1/editions/42/stories/lead-42?tz=Pacific/Kiritimati")).res.status,
    ).toBe(200);
  });

  it("returns 404 for an unknown slug or a slug from another edition", async () => {
    expect((await get("/api/v1/editions/41/stories/no-such-story")).res.status).toBe(404);
    expect((await get("/api/v1/editions/41/stories/lead-42")).res.status).toBe(404);
  });

  it("rejects a malformed slug", async () => {
    expect((await get("/api/v1/editions/41/stories/Not_A_Slug")).res.status).toBe(400);
  });
});
