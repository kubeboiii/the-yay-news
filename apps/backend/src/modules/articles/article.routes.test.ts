import type { ApiError } from "@repo/shared";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NotFoundError } from "../../lib/errors.js";

vi.mock("@repo/db", () => ({ prisma: {} }));
vi.mock("./article.service.js", () => ({
  articleService: { list: vi.fn(), getBySlug: vi.fn() },
}));

const { createApp } = await import("../../app.js");
const { articleService } = await import("./article.service.js");

const article = {
  id: "a1",
  slug: "good-news",
  title: "Good news",
  summary: "Summary",
  body: "Body",
  imageUrl: null,
  publishedAt: new Date("2026-01-01T00:00:00.000Z"),
  category: null,
};

describe("articles routes", () => {
  const app = createApp();
  beforeEach(() => vi.clearAllMocks());

  it("lists articles with the default limit", async () => {
    vi.mocked(articleService.list).mockResolvedValue([article]);
    const res = await app.request("/api/v1/articles");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      data: [{ ...article, publishedAt: "2026-01-01T00:00:00.000Z" }],
    });
    expect(articleService.list).toHaveBeenCalledWith({ limit: 20 });
  });

  it("rejects an out-of-range limit", async () => {
    const res = await app.request("/api/v1/articles?limit=1000");
    expect(res.status).toBe(400);
    expect(((await res.json()) as ApiError).error.code).toBe("VALIDATION_ERROR");
    expect(articleService.list).not.toHaveBeenCalled();
  });

  it("returns 404 for a missing article", async () => {
    vi.mocked(articleService.getBySlug).mockRejectedValue(new NotFoundError("Article"));
    const res = await app.request("/api/v1/articles/missing");
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({
      error: { code: "NOT_FOUND", message: "Article not found" },
    });
  });

  it("returns 404 in the standard shape for unknown routes", async () => {
    const res = await app.request("/nope");
    expect(res.status).toBe(404);
    expect(((await res.json()) as ApiError).error.code).toBe("NOT_FOUND");
  });
});
