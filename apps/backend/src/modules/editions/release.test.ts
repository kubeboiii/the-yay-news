import { describe, expect, it } from "vitest";
import { isReleased, releasedDate, resolveTimeZone } from "./release.js";

const at = (iso: string) => new Date(iso);

describe("releasedDate", () => {
  it("releases at 07:00 UTC for a UTC reader", () => {
    expect(releasedDate(at("2026-09-30T06:59:59.999Z"), "UTC")).toBe("2026-09-29");
    expect(releasedDate(at("2026-09-30T07:00:00.000Z"), "UTC")).toBe("2026-09-30");
    expect(releasedDate(at("2026-09-30T23:59:59.999Z"), "UTC")).toBe("2026-09-30");
    expect(releasedDate(at("2026-10-01T00:00:00.000Z"), "UTC")).toBe("2026-09-30");
  });

  it("releases the earliest zone (UTC+14) at 17:00 UTC the day before", () => {
    expect(releasedDate(at("2026-09-29T16:59:59Z"), "Pacific/Kiritimati")).toBe("2026-09-29");
    expect(releasedDate(at("2026-09-29T17:00:00Z"), "Pacific/Kiritimati")).toBe("2026-09-30");
  });

  it("releases the latest zone (UTC−12) at 19:00 UTC the same day", () => {
    expect(releasedDate(at("2026-09-30T18:59:59Z"), "Etc/GMT+12")).toBe("2026-09-29");
    expect(releasedDate(at("2026-09-30T19:00:00Z"), "Etc/GMT+12")).toBe("2026-09-30");
  });

  it("handles half-hour and quarter-hour offsets", () => {
    expect(releasedDate(at("2026-09-30T01:29:59Z"), "Asia/Kolkata")).toBe("2026-09-29");
    expect(releasedDate(at("2026-09-30T01:30:00Z"), "Asia/Kolkata")).toBe("2026-09-30");
    expect(releasedDate(at("2026-09-30T01:14:59Z"), "Asia/Kathmandu")).toBe("2026-09-29");
    expect(releasedDate(at("2026-09-30T01:15:00Z"), "Asia/Kathmandu")).toBe("2026-09-30");
  });

  describe("America/New_York across daylight saving", () => {
    it("uses EST (UTC−5) the day before clocks go forward", () => {
      expect(releasedDate(at("2026-03-07T11:59:59Z"), "America/New_York")).toBe("2026-03-06");
      expect(releasedDate(at("2026-03-07T12:00:00Z"), "America/New_York")).toBe("2026-03-07");
    });

    it("uses EDT (UTC−4) on the morning clocks go forward", () => {
      expect(releasedDate(at("2026-03-08T10:59:59Z"), "America/New_York")).toBe("2026-03-07");
      expect(releasedDate(at("2026-03-08T11:00:00Z"), "America/New_York")).toBe("2026-03-08");
    });

    it("uses EST (UTC−5) on the morning clocks go back", () => {
      // 06:00 EDT happened at 10:00Z; after the 02:00 fall-back, 07:00 EST is 12:00Z.
      expect(releasedDate(at("2026-11-01T11:59:59Z"), "America/New_York")).toBe("2026-10-31");
      expect(releasedDate(at("2026-11-01T12:00:00Z"), "America/New_York")).toBe("2026-11-01");
    });
  });

  it("rolls back across month, year and leap-day boundaries", () => {
    expect(releasedDate(at("2026-10-01T06:00:00Z"), "UTC")).toBe("2026-09-30");
    expect(releasedDate(at("2027-01-01T06:00:00Z"), "UTC")).toBe("2026-12-31");
    expect(releasedDate(at("2028-03-01T06:00:00Z"), "UTC")).toBe("2028-02-29");
    expect(releasedDate(at("2026-12-31T17:00:00Z"), "Pacific/Kiritimati")).toBe("2027-01-01");
  });

  it("treats an unknown zone as UTC", () => {
    expect(releasedDate(at("2026-09-30T06:59:59Z"), "Mars/Olympus_Mons")).toBe("2026-09-29");
    expect(releasedDate(at("2026-09-30T07:00:00Z"), "Mars/Olympus_Mons")).toBe("2026-09-30");
    expect(releasedDate(at("2026-09-30T07:00:00Z"), "")).toBe("2026-09-30");
  });
});

describe("isReleased", () => {
  it("is true for the released date and earlier, false after", () => {
    const now = at("2026-09-29T17:00:00Z");
    expect(isReleased("2026-09-30", now, "Pacific/Kiritimati")).toBe(true);
    expect(isReleased("2026-09-30", now, "UTC")).toBe(false);
    expect(isReleased("2026-09-29", now, "UTC")).toBe(true);
    expect(isReleased("2026-10-01", now, "Pacific/Kiritimati")).toBe(false);
  });
});

describe("resolveTimeZone", () => {
  it("keeps known IANA zones", () => {
    expect(resolveTimeZone("Europe/London")).toBe("Europe/London");
    expect(resolveTimeZone("Pacific/Kiritimati")).toBe("Pacific/Kiritimati");
  });

  it("canonicalises the spelling", () => {
    expect(resolveTimeZone("america/new_york")).toBe("America/New_York");
  });

  it("falls back to UTC when missing or unknown", () => {
    expect(resolveTimeZone(undefined)).toBe("UTC");
    expect(resolveTimeZone(null)).toBe("UTC");
    expect(resolveTimeZone("")).toBe("UTC");
    expect(resolveTimeZone("Not/AZone")).toBe("UTC");
    expect(resolveTimeZone("'; DROP TABLE")).toBe("UTC");
  });
});
