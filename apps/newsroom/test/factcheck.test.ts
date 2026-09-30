import { describe, expect, it } from "vitest";
import { factCheck, numbersIn, properNounsIn } from "../src/stages/factcheck.ts";
import { checkWritten } from "../src/stages/write.ts";

const SOURCE =
  "Wistow Maze in Leicestershire cut a gorilla into 1,200 metres of maize for Sir David Attenborough, who turned 100. " +
  "It took 11 months to plan, said the owner, Diana Brooks. About 3.5 miles of paths.";

describe("the fact check", () => {
  it("finds numbers and proper nouns", () => {
    expect(numbersIn("It cost £1,200 and 3.5m people saw it in 2026.")).toEqual([
      "1200",
      "3.5",
      "2026",
    ]);
    expect(
      properNounsIn(
        "The maze is in Leicestershire. Diana Brooks said so. “Lovely,” said McKenzie of NASA.",
      ),
    ).toEqual([
      "Leicestershire",
      // "Diana" starts a sentence, so only "Brooks" marks the name.
      "Brooks",
      "McKenzie",
      "NASA",
    ]);
  });

  it("passes a story whose facts are all in the source", () => {
    const r = factCheck(
      "A farm in Leicestershire has cut 1200 metres of maize into a gorilla.\nThe owner, Diana Brooks, spent 11 months planning it for Sir David Attenborough.",
      SOURCE,
    );
    expect(r).toEqual({ ok: true, missing: [] });
  });

  it("fails a story with an invented number or name", () => {
    const r = factCheck("It took 14 months, according to Brooks and her friend Gerald.", SOURCE);
    expect(r.ok).toBe(false);
    expect(r.missing).toEqual([
      { kind: "number", value: "14" },
      { kind: "name", value: "Gerald" },
    ]);
  });

  it("also rejects written copy that brings in bad news", () => {
    const check = checkWritten(
      {
        id: "x",
        kicker: "Mazes",
        headline: "A gorilla maze for a birthday",
        dek: "In Leicestershire.",
        body: ["The owner, Diana Brooks, said the previous design died a death."],
      },
      `${SOURCE} The previous design died a death.`,
    );
    expect(check.ok).toBe(false);
    expect(check.problems.join()).toMatch(/death|died/);
  });
});
