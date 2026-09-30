import type { SearchResult } from "@repo/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { SearchRow } from "./search.repository.js";

vi.mock("@repo/db", () => ({ prisma: {} }));

const find = vi.fn<(q: string, released: Date, take: number) => Promise<SearchRow[]>>();
vi.mock("./search.repository.js", () => ({ searchRepository: { find } }));

const { createApp } = await import("../../app.js");
const { SEARCH_LIMIT } = await import("./search.service.js");

const row = (issue: number, date: string, slug: string): SearchRow => ({
  slug,
  kicker: "Deep sea",
  headline: `Headline for ${slug}`,
  dek: "A standfirst.",
  edition: { issueNumber: issue, date: new Date(`${date}T00:00:00Z`), design: "broadsheet" },
});

describe("search routes", () => {
  const app = createApp();
  const get = async (path: string, init?: RequestInit) => {
    const res = await app.request(path, init);
    return {
      res,
      body: res.status === 200 ? ((await res.json()) as { data: SearchResult }).data : null,
    };
  };

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    // 06:30 on 30 September in Kolkata: the 30 September paper isn't out there yet.
    vi.setSystemTime(new Date("2026-09-30T01:00:00Z"));
    find.mockReset();
  });
  afterEach(() => vi.useRealTimers());

  it("groups matching stories by the paper they ran in, newest paper first", async () => {
    find.mockResolvedValue([
      row(42, "2026-09-30", "goblin-shark"),
      row(42, "2026-09-30", "shark-two"),
      row(38, "2026-09-26", "old-shark"),
    ]);
    const { res, body } = await get("/api/v1/search?q=shark");
    expect(res.status).toBe(200);
    expect(body).toEqual({
      query: "shark",
      more: false,
      papers: [
        {
          issueNumber: 42,
          date: "2026-09-30",
          design: "broadsheet",
          stories: [
            expect.objectContaining({ slug: "goblin-shark" }),
            expect.objectContaining({ slug: "shark-two" }),
          ],
        },
        expect.objectContaining({
          issueNumber: 38,
          stories: [expect.objectContaining({ slug: "old-shark" })],
        }),
      ],
    });
  });

  it("only asks for papers already released where the reader is", async () => {
    find.mockResolvedValue([]);
    await get("/api/v1/search?q=shark&tz=Asia/Kolkata");
    expect(find.mock.calls[0]?.[1].toISOString().slice(0, 10)).toBe("2026-09-29");
    await get("/api/v1/search?q=shark&tz=UTC");
    expect(find.mock.calls[1]?.[1].toISOString().slice(0, 10)).toBe("2026-09-29");
    vi.setSystemTime(new Date("2026-09-30T08:00:00Z"));
    await get("/api/v1/search?q=shark&tz=UTC");
    expect(find.mock.calls[2]?.[1].toISOString().slice(0, 10)).toBe("2026-09-30");
  });

  it("trims the query and says when there were more matches than it returned", async () => {
    find.mockResolvedValue(
      Array.from({ length: SEARCH_LIMIT + 1 }, (_, i) => row(40, "2026-09-28", `s-${i}`)),
    );
    const { body } = await get("/api/v1/search?q=%20%20shark%20");
    expect(find.mock.calls[0]?.[0]).toBe("shark");
    expect(find.mock.calls[0]?.[2]).toBe(SEARCH_LIMIT + 1);
    expect(body?.more).toBe(true);
    expect(body?.papers[0]?.stories).toHaveLength(SEARCH_LIMIT);
  });

  it("rejects a query that is too short or too long", async () => {
    expect((await get("/api/v1/search?q=a")).res.status).toBe(400);
    expect((await get("/api/v1/search")).res.status).toBe(400);
    expect((await get(`/api/v1/search?q=${"x".repeat(81)}`)).res.status).toBe(400);
    expect(find).not.toHaveBeenCalled();
  });
});
