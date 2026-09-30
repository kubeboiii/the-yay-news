import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

process.env.ADMIN_PASSWORD = "correct horse battery staple";

vi.mock("@repo/db", () => ({ prisma: {} }));
vi.mock("./admin.repository.js", async () => {
  const { fakeAdminRepository, adminFixtures } = await import("./admin.fixtures.js");
  return { adminRepository: fakeAdminRepository(adminFixtures()) };
});
vi.spyOn(console, "warn").mockImplementation(() => {});

const { createApp } = await import("../../app.js");
const { adminRepository } = await import("./admin.repository.js");
const { adminFixtures } = await import("./admin.fixtures.js");
const { resetLoginLimits } = await import("./admin.auth.js");
const repo = adminRepository as unknown as { editions: ReturnType<typeof adminFixtures> };

type Json = { data?: any; error?: { code: string } }; // eslint-disable-line @typescript-eslint/no-explicit-any

describe("admin routes", () => {
  const app = createApp();
  let ip = 0;
  const post = (path: string, body?: unknown, headers: Record<string, string> = {}) =>
    app.request(`/api/v1/admin${path}`, {
      method: "POST",
      headers: { "content-type": "application/json", ...headers },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  const login = async (password = "correct horse battery staple", from = `10.0.0.${++ip}`) =>
    post("/login", { password }, { "x-forwarded-for": from });
  const session = async () => {
    const res = await login();
    const cookie = res.headers.get("set-cookie")?.split(";")[0];
    if (!cookie) throw new Error("no cookie");
    return { cookie };
  };

  beforeEach(() => {
    repo.editions.splice(0, repo.editions.length, ...adminFixtures());
    resetLoginLimits();
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-09-29T20:00:00Z")); // 30 Sep already at UTC+14
  });
  afterEach(() => vi.useRealTimers());

  describe("login", () => {
    it("sets an HTTP-only, strict, signed session cookie for the right password", async () => {
      const res = await login();
      expect(res.status).toBe(200);
      const cookie = res.headers.get("set-cookie") ?? "";
      expect(cookie).toMatch(/^yay_admin=admin\.\d+\.[^;]+;/);
      expect(cookie).toContain("HttpOnly");
      expect(cookie).toContain("SameSite=Strict");
      expect(cookie).toContain("Path=/api/v1/admin");
      expect(res.headers.get("cache-control")).toBe("no-store");
    });

    it("refuses a wrong password", async () => {
      const res = await login("nope");
      expect(res.status).toBe(401);
      expect(res.headers.get("set-cookie")).toBeNull();
    });

    it("rate limits a client after five failures, even with the right password", async () => {
      for (let i = 0; i < 5; i++) expect((await login("nope", "1.2.3.4")).status).toBe(401);
      const res = await login(undefined, "1.2.3.4");
      expect(res.status).toBe(429);
      expect(Number(res.headers.get("retry-after"))).toBeGreaterThan(0);
      expect((await login(undefined, "5.6.7.8")).status).toBe(200);
    });

    it("lets a client in again after the window", async () => {
      for (let i = 0; i < 5; i++) await login("nope", "1.2.3.4");
      vi.setSystemTime(new Date("2026-09-29T20:16:00Z"));
      expect((await login(undefined, "1.2.3.4")).status).toBe(200);
    });
  });

  describe("sessions", () => {
    it("rejects requests without a session, or with a forged one", async () => {
      expect((await app.request("/api/v1/admin/editions")).status).toBe(401);
      const forged = { cookie: `yay_admin=admin.${Date.now() + 1e9}.AAAA` };
      expect((await app.request("/api/v1/admin/editions", { headers: forged })).status).toBe(401);
      expect((await post("/rollback", undefined, forged)).status).toBe(401);
    });

    it("expires after eight hours", async () => {
      const headers = await session();
      vi.setSystemTime(new Date("2026-09-30T04:01:00Z"));
      expect((await app.request("/api/v1/admin/session", { headers })).status).toBe(401);
    });
  });

  describe("editions", () => {
    it("lists recent editions newest first, with reserves apart", async () => {
      const res = await app.request("/api/v1/admin/editions?limit=2", {
        headers: await session(),
      });
      const { data } = (await res.json()) as Json;
      expect(data.map((e: { issueNumber: number }) => e.issueNumber)).toEqual([42, 41]);
      expect(data[0].stories).toHaveLength(3);
      expect(data[0].reserves.map((s: { slug: string }) => s.slug)).toEqual([
        "spare-rocket",
        "spare-kitten",
      ]);
    });

    it("pulls a story and puts a same-section reserve in its place", async () => {
      const res = await post("/editions/41/stories/otter/pull", undefined, await session());
      expect(res.status).toBe(200);
      const { data } = (await res.json()) as Json;
      expect(data.pulled.slug).toBe("otter");
      expect(data.replacement.slug).toBe("spare-kitten");
      const e41 = repo.editions.find((e) => e.issueNumber === 41);
      expect(e41?.stories.find((s) => s.slug === "otter")).toBeUndefined();
      expect(e41?.stories.find((s) => s.slug === "spare-kitten")).toMatchObject({
        isReserve: false,
        pageId: "41-p2",
        order: 0,
        slot: "feature",
      });
      expect(data.edition.reserves.map((s: { slug: string }) => s.slug)).toEqual(["spare-rocket"]);
    });

    it("falls back to any reserve, and to none when they run out", async () => {
      const headers = await session();
      await post("/editions/41/stories/otter/pull", undefined, headers);
      const second = (await (
        await post("/editions/41/stories/lead/pull", undefined, headers)
      ).json()) as Json;
      expect(second.data.replacement.slug).toBe("spare-rocket");
      expect(second.data.replacement.slot).toBe("lead");
      const third = (await (
        await post("/editions/41/stories/comet/pull", undefined, headers)
      ).json()) as Json;
      expect(third.data.replacement).toBeNull();
    });

    it("never pulls a reserve, and 404s an unknown story or issue", async () => {
      const headers = await session();
      expect(
        (await post("/editions/41/stories/spare-kitten/pull", undefined, headers)).status,
      ).toBe(404);
      expect((await post("/editions/41/stories/nope/pull", undefined, headers)).status).toBe(404);
      expect((await post("/editions/99/pull", undefined, headers)).status).toBe(404);
    });

    it("pulls and republishes a whole edition", async () => {
      const headers = await session();
      const pulled = (await (await post("/editions/41/pull", undefined, headers)).json()) as Json;
      expect(pulled.data.status).toBe("pulled");
      const back = (await (
        await post("/editions/41/republish", undefined, headers)
      ).json()) as Json;
      expect(back.data.status).toBe("published");
    });

    it("won't republish an edition without a lead", async () => {
      const headers = await session();
      const e = repo.editions.find((x) => x.issueNumber === 40);
      if (e) e.stories = e.stories.filter((s) => s.slot !== "lead");
      expect((await post("/editions/40/republish", undefined, headers)).status).toBe(409);
    });
  });

  describe("rollback", () => {
    it("pulls the newest edition any reader has, leaving the previous one", async () => {
      const headers = await session();
      const res = await post("/rollback", undefined, headers);
      expect(((await res.json()) as Json).data).toEqual({ pulled: 42, nowServing: 41 });
      const again = await post("/rollback", undefined, headers);
      expect(((await again.json()) as Json).data).toEqual({ pulled: 41, nowServing: 40 });
    });

    it("says so when there is nothing left", async () => {
      const headers = await session();
      for (const e of repo.editions) e.status = "pulled";
      expect((await post("/rollback", undefined, headers)).status).toBe(409);
    });
  });
});
