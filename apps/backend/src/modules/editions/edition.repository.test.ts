import { describe, expect, it, vi } from "vitest";

vi.mock("@repo/db", () => ({ prisma: {} }));

const { editionInclude, editionSummaryInclude, readableStoryWhere } =
  await import("./edition.repository.js");

// The route tests run against fixtures.ts's in-memory repository; this pins the real Prisma
// queries to the same rule, so neither can drift from the other.
describe("edition queries", () => {
  it("load only stories that are neither reserves nor pulled", () => {
    expect(readableStoryWhere).toEqual({ isReserve: false, pulledAt: null });
    expect(editionInclude.pages.include.stories.where).toBe(readableStoryWhere);
    expect(editionSummaryInclude.stories.where).toMatchObject(readableStoryWhere);
  });

  it("load the guest sections in page order", () => {
    expect(editionInclude.guests.orderBy).toEqual({ order: "asc" });
    expect(editionSummaryInclude.guests).toBe(editionInclude.guests);
  });
});
