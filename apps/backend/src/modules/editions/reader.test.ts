import { describe, expect, it, vi } from "vitest";

vi.mock("../../config/env.js", () => ({ env: { NODE_ENV: "production" } }));
const { readerFrom } = await import("./reader.js");

describe("readerFrom in production", () => {
  it("ignores ?now= so the release clock can't be moved", () => {
    const before = Date.now();
    const reader = readerFrom({ now: "2099-01-01T00:00:00Z", tz: "Europe/Paris" }, undefined);
    expect(reader.preview).toBe(false);
    expect(reader.now.getTime()).toBeGreaterThanOrEqual(before);
    expect(reader.now.getTime()).toBeLessThan(new Date("2099-01-01").getTime());
    expect(reader.timeZone).toBe("Europe/Paris");
  });
});
