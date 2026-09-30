import { describe, expect, it } from "vitest";
import { dedup, normaliseUrl, similarity } from "../src/stages/dedup.ts";

const item = (id: string, title: string, url = `https://example.org/${id}`, score = 5) => ({
  id,
  title,
  url,
  score,
  text: "",
});

describe("dedup", () => {
  it("normalises URLs", () => {
    expect(normaliseUrl("https://www.Example.org/a/b/?utm_source=x#top")).toBe("example.org/a/b");
  });

  it("drops stories that ran in the last two weeks, by URL or by headline", () => {
    const recent = [
      {
        headline: "Giant gorilla maze celebrates David Attenborough's 100th birthday",
        sourceUrl: "https://example.org/maze",
        date: "2026-09-30",
      },
    ];
    const { kept, duplicates } = dedup(
      [
        item("a", "Something else", "https://www.example.org/maze?utm_campaign=x"),
        item("b", "Farm's gorilla maze celebrates Attenborough's 100th birthday"),
        item("c", "Otters learn to juggle"),
      ],
      recent,
    );
    expect(kept.map((k) => k.id)).toEqual(["c"]);
    expect(duplicates.map((d) => d.item.id).sort()).toEqual(["a", "b"]);
  });

  it("keeps the better telling when three outlets have the same story", () => {
    const { kept, duplicates } = dedup(
      [
        item("a", "NASA's Webb telescope spots a smiling galaxy cluster", undefined, 6),
        item(
          "b",
          "Webb telescope spots galaxy cluster that looks like it is smiling",
          undefined,
          9,
        ),
        item("c", "Smiling galaxy cluster spotted by NASA Webb telescope", undefined, 4),
        item("d", "Cricket club bowls out rivals with a teapot", undefined, 5),
      ],
      [],
    );
    expect(kept.map((k) => k.id)).toEqual(["b", "d"]);
    expect(duplicates).toHaveLength(2);
  });

  it("does not merge stories that only share a word or two", () => {
    expect(
      similarity("New indie game about snails", "New indie game about space trains"),
    ).toBeLessThan(1);
    const { kept } = dedup(
      [item("a", "Indie game about gardening snails"), item("b", "Indie game about space trains")],
      [],
    );
    expect(kept).toHaveLength(2);
  });
});
