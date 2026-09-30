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
const repo = adminRepository as unknown as {
  editions: ReturnType<typeof adminFixtures>;
  actions: { action: string; issue: number | null; slug: string | null; detail: unknown }[];
};

type Json = { data?: any; error?: { code: string } }; // eslint-disable-line @typescript-eslint/no-explicit-any

describe("admin routes", () => {
  const app = createApp();
  let ip = 0;
  const get = async (path: string, headers: Record<string, string>) =>
    (await (await app.request(`/api/v1/admin${path}`, { headers })).json()) as Json;
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
    repo.actions.splice(0);
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

    it("marks a pulled story rather than deleting it, and puts a same-section reserve in its place", async () => {
      const res = await post(
        "/editions/41/stories/otter/pull",
        { reason: "Wrong otter" },
        await session(),
      );
      expect(res.status).toBe(200);
      const { data } = (await res.json()) as Json;
      expect(data.pulled).toMatchObject({ slug: "otter", pulledReason: "Wrong otter" });
      expect(data.replacement.slug).toBe("spare-kitten");
      const e41 = repo.editions.find((e) => e.issueNumber === 41);
      expect(e41?.stories.find((s) => s.slug === "otter")).toMatchObject({
        pulledReason: "Wrong otter",
        pulledAt: expect.any(Date),
        isReserve: false,
        pageId: "41-p2",
        order: -1, // out of the reserve's way
      });
      expect(e41?.stories.find((s) => s.slug === "spare-kitten")).toMatchObject({
        isReserve: false,
        pageId: "41-p2",
        order: 0,
        slot: "feature",
      });
      expect(data.edition.stories.map((s: { slug: string }) => s.slug)).toEqual([
        "lead",
        "spare-kitten",
        "comet",
      ]);
      expect(data.edition.reserves.map((s: { slug: string }) => s.slug)).toEqual(["spare-rocket"]);
      expect(data.edition.pulled).toMatchObject([{ slug: "otter", pulledReason: "Wrong otter" }]);
    });

    it("pulls without a reason, and refuses a bad one", async () => {
      const headers = await session();
      const res = await post("/editions/41/stories/otter/pull", undefined, headers);
      expect(((await res.json()) as Json).data.pulled.pulledReason).toBeNull();
      const long = await post(
        "/editions/41/stories/comet/pull",
        { reason: "x".repeat(301) },
        headers,
      );
      expect(long.status).toBe(400);
    });

    it("won't pull a story twice", async () => {
      const headers = await session();
      await post("/editions/41/stories/otter/pull", undefined, headers);
      expect((await post("/editions/41/stories/otter/pull", undefined, headers)).status).toBe(404);
    });

    it("un-pulls a displaced story back among the reserves", async () => {
      const headers = await session();
      await post("/editions/41/stories/otter/pull", undefined, headers);
      const res = await post("/editions/41/stories/otter/unpull", undefined, headers);
      const { data } = (await res.json()) as Json;
      expect(data.outcome).toBe("reserve");
      expect(data.edition.pulled).toEqual([]);
      expect(data.edition.reserves.map((s: { slug: string }) => s.slug)).toContain("otter");
      expect(data.edition.stories.map((s: { slug: string }) => s.slug)).not.toContain("otter");
    });

    it("un-pulls a story that kept its place straight back into it", async () => {
      const headers = await session();
      const e = repo.editions.find((x) => x.issueNumber === 41);
      if (e) e.stories = e.stories.filter((s) => !s.isReserve);
      await post("/editions/41/stories/comet/pull", undefined, headers);
      const { data } = (await (
        await post("/editions/41/stories/comet/unpull", undefined, headers)
      ).json()) as Json;
      expect(data.outcome).toBe("restored");
      expect(data.edition.stories.find((s: { slug: string }) => s.slug === "comet")).toBeDefined();
      expect((await post("/editions/41/stories/comet/unpull", undefined, headers)).status).toBe(
        404,
      );
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

  describe("audit log", () => {
    it("writes one row per action, newest first on GET /actions", async () => {
      const headers = await session();
      await post("/editions/41/stories/otter/pull", { reason: "Wrong otter" }, headers);
      await post("/editions/41/stories/otter/unpull", undefined, headers);
      await post("/editions/40/pull", undefined, headers);
      await post("/editions/40/republish", undefined, headers);
      await post("/rollback", undefined, headers);
      await post("/editions/99/pull", undefined, headers); // a 404 changes nothing, so no row
      expect(repo.actions.map((a) => a.action)).toEqual([
        "login",
        "pull-story",
        "unpull-story",
        "pull-edition",
        "republish",
        "rollback",
      ]);
      expect(repo.actions[1]).toMatchObject({
        issue: 41,
        slug: "otter",
        detail: { reason: "Wrong otter", replacement: "spare-kitten" },
      });
      expect(repo.actions[5]).toMatchObject({ issue: 42, detail: { nowServing: 41 } });

      const { data } = await get("/actions?limit=2", headers);
      expect(data.map((a: { action: string }) => a.action)).toEqual(["rollback", "republish"]);
      expect(data[0].at).toMatch(/^\d{4}-\d\d-\d\dT/);
    });

    it("logs failed logins without the password, and not rate-limited ones", async () => {
      for (let i = 0; i < 6; i++) await login("hunter2", "1.2.3.4");
      expect(repo.actions).toHaveLength(5);
      expect(repo.actions[0]).toMatchObject({
        action: "login-failed",
        detail: { client: "1.2.3.4" },
      });
      expect(JSON.stringify(repo.actions)).not.toContain("hunter2");
    });

    it("needs a session", async () => {
      expect((await app.request("/api/v1/admin/actions")).status).toBe(401);
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
