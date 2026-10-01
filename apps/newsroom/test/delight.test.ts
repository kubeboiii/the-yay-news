import { describe, expect, it } from "vitest";
import { FakeModel } from "../src/model/fake.ts";
import type { Model } from "../src/model/types.ts";
import { blocklistHit } from "../src/stages/blocklist.ts";
import { blocklistFilter, delightCheck, delightReplySchema } from "../src/stages/delight.ts";
import { PLANTED_GRIM, candidate } from "./fixtures.ts";

describe("the blocklist", () => {
  it.each([
    "Three killed as storm hits coast",
    "Beloved actor dies aged 90",
    "War of words as senators clash over budget",
    "Layoffs hit games studio",
    "Stocks plunge on recession fears",
    "You won't believe this heartwarming story",
    "Police arrest man after bakery break-in",
  ])("rejects %j", (headline) => expect(blocklistHit(headline)).not.toBeNull());

  it.each([
    "Otters learn to juggle pebbles at Tokyo aquarium",
    "Indie game about gardening snails tops the charts",
    "A new moss is named after a librarian",
    "Warwick rowing club wins its first regatta",
    "Skilled potter makes a teapot that pours two ways",
  ])("allows %j", (headline) => expect(blocklistHit(headline)).toBeNull());

  it("reads the full source text, so bad news in the backstory is caught", () => {
    const grim = PLANTED_GRIM();
    expect(blocklistHit(`${grim.title} ${grim.summary}`)).toBeNull();
    const { clean, rejected } = blocklistFilter([grim, candidate("discoveries", 1)]);
    expect(rejected.map((r) => r.candidate.id)).toEqual([grim.id]);
    expect(rejected[0]?.reason).toMatch(/blocklist \(death\)/);
    expect(clean).toHaveLength(1);
  });
});

describe("the delight check", () => {
  it("rejects the planted grim story and keeps the good ones", async () => {
    const grim = PLANTED_GRIM();
    const good = [candidate("discoveries", 1), candidate("play", 2)];
    const out = await delightCheck(new FakeModel(), [grim, ...good]);
    expect(out.allowed.map((c) => c.id)).toEqual(good.map((c) => c.id));
    expect(out.rejected).toEqual([
      expect.objectContaining({ candidate: grim, stage: "blocklist" }),
    ]);
  });

  it("lets the classifier reject what the blocklist cannot see", async () => {
    const gloomy = candidate("tech", 3, {
      title: "A bleak week for gadget fans",
      summary: "Gloomily, nothing launched.",
    });
    const out = await delightCheck(new FakeModel(), [gloomy]);
    expect(out.allowed).toEqual([]);
    expect(out.rejected[0]).toMatchObject({
      stage: "delight",
      reason: expect.stringMatching(/^reject/),
    });
  });

  it("treats uncertain, missing and out-of-section verdicts safely", async () => {
    const [a, b, c] = [candidate("tech", 4), candidate("tech", 5), candidate("tech", 6)];
    const unsure: Model = {
      name: "unsure",
      complete: (async () =>
        delightReplySchema.parse({
          results: [
            { id: a.id, decision: "uncertain", reason: "hard to say" },
            {
              id: c.id,
              decision: "allow",
              reason: "fun",
              section: "sports",
              topic: "robots",
              score: 8,
            },
          ],
        })) as unknown as Model["complete"],
    };
    const out = await delightCheck(unsure, [a, b, c]);
    expect(out.rejected.map((r) => [r.candidate.id, r.reason])).toEqual([
      [a.id, "uncertain: hard to say"],
      [b.id, "classifier gave no verdict"],
    ]);
    // A section the source cannot feed falls back to the source's own section.
    expect(out.allowed).toEqual([
      expect.objectContaining({ id: c.id, section: "tech", topic: "robots", score: 8 }),
    ]);
  });

  it("batches every candidate into as few calls as possible", async () => {
    const model = new FakeModel();
    await delightCheck(
      model,
      Array.from({ length: 70 }, (_, i) => candidate("play", i)),
    );
    // 70 items in batches of 30: three calls.
    expect(model.calls).toEqual(
      Array.from({ length: 3 }, () => ({ task: "delight", tier: "cheap" })),
    );
  });

  it("rejects only a batch the classifier cannot answer, and keeps the rest", async () => {
    const model = new FakeModel();
    const real = model.complete.bind(model);
    const items = Array.from({ length: 40 }, (_, i) => candidate("play", i));
    // The first batch fails both attempts; the second succeeds (batches run concurrently, so the
    // failing one is picked by its contents, not by call order).
    let failures = 0;
    model.complete = ((...args: Parameters<typeof real>) =>
      args[0].includes(`"${items[0]!.id}"`)
        ? (failures++, Promise.reject(new Error("timed out")))
        : real(...args)) as typeof real;
    const flaky = model;
    const out = await delightCheck(flaky, items);
    expect(out.rejected.filter((r) => r.reason.includes("unavailable"))).toHaveLength(30);
    expect(out.allowed.length + out.rejected.length).toBe(40);
    expect(failures).toBe(2);
  });
});
