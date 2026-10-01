import { describe, expect, it } from "vitest";
import { BrokenModel } from "../src/model/fake.ts";
import type { Model } from "../src/model/types.ts";
import {
  type LetterItem,
  type LetterSource,
  letterProblems,
  lettersReplySchema,
  writeLetters,
} from "../src/stages/letters.ts";
import { sourceText } from "./fixtures.ts";

const stories: LetterSource[] = ["tech", "music", "sports", "discoveries", "money"].map((s, n) => ({
  slug: `${s}-story-${n}`,
  headline: `A cheerful ${s} story from Leeds number ${n}`,
  section: s,
  sourceText: sourceText(s, n),
}));
const story = stories[0]!;
const letter = (extra: Partial<LetterItem> = {}): LetterItem => ({
  kind: "letter",
  storyId: story.slug,
  headline: "A kettle would like a word about the talk of the town",
  dek: "It has read the story twice and would like a third go.",
  body: ["Dear Editor, the news from Leeds made my spout whistle. More please."],
  signOff: "A kettle with opinions",
  ...extra,
});
const replying = (items: LetterItem[]): Model => ({
  name: "scripted",
  complete: (async () => lettersReplySchema.parse({ items })) as unknown as Model["complete"],
});
const opts = { date: "2026-10-05", issueNumber: 46, site: "https://yay.example", stories };

describe("Letters & Classifieds", () => {
  it("accepts an imaginary correspondent riffing on a real story", () => {
    expect(letterProblems(letter(), story)).toEqual([]);
    // A correspondent may borrow a name from the story: a place, not a person.
    expect(
      letterProblems(
        letter({ signOff: "The Leeds town hall clock", body: ["Dear Editor, I'm delighted."] }),
        story,
      ),
    ).toEqual([]);
  });

  it("never signs a letter from a person, and invents no names or numbers", () => {
    expect(letterProblems(letter({ signOff: "Margaret Thompson, Leeds" }), story)).toEqual([
      expect.stringMatching(/"Thompson" is not in the story/),
      expect.stringMatching(/could read as a real person/),
    ]);
    expect(letterProblems(letter({ signOff: "A neighbour in Leeds" }), story)).toEqual([
      expect.stringMatching(/could read as a real person/),
    ]);
    expect(letterProblems(letter({ signOff: "A reader called Margaret" }), story)).toEqual([
      expect.stringMatching(/"Margaret" is not in the story/),
      expect.stringMatching(/could read as a real person/),
    ]);
    expect(
      letterProblems(letter({ body: ["Dear Editor, 400 of us in Sheffield loved it."] }), story),
    ).toEqual([expect.stringMatching(/number "400"/), expect.stringMatching(/name "Sheffield"/)]);
    expect(
      letterProblems(letter({ body: ["Dear Editor, it cheered me up after the funeral."] }), story),
    ).toEqual([expect.stringMatching(/mentions "funeral"/)]);
  });

  it("writes two letters and two small ads, each clearly made up and linked to its story", async () => {
    const good = [
      letter(),
      letter({ storyId: stories[1]!.slug, signOff: "The pigeon on the windowsill" }),
      {
        ...letter({ storyId: stories[2]!.slug, signOff: "A generous armchair" }),
        kind: "classified" as const,
        heading: "WANTED",
        body: ["Company for a very long walk. Snacks provided."],
      },
    ];
    const out = await writeLetters(replying(good), opts);
    expect(out.stories.map((s) => s.kicker)).toEqual([
      "Letters",
      "Letters",
      "WANTED",
      expect.any(String),
    ]);
    expect(out.stories.map((s) => s.slot)).toEqual(["feature", "feature", "brief", "brief"]);
    expect(out.stories[0]!.body).toEqual([
      "Dear Editor, the news from Leeds made my spout whistle. More please.",
      "— A kettle with opinions",
      "(An imaginary letter, inspired by today's story “A cheerful tech story from Leeds number 0”.)",
    ]);
    expect(out.stories[0]!.sourceUrl).toBe("https://yay.example/issue/46/story/tech-story-0");
    // Four different stories, one each.
    expect(new Set(out.stories.map((s) => s.sourceUrl)).size).toBe(4);
    expect(out.problems).toEqual([]);
  });

  it("drops items that fail their checks and fills the page from templates", async () => {
    const out = await writeLetters(
      replying([letter({ signOff: "Dave from Leeds" }), letter({ storyId: "no-such-story" })]),
      opts,
    );
    expect(out.problems).toHaveLength(2);
    expect(out.stories).toHaveLength(4);
    for (const s of out.stories) expect(s.body.at(-1)).toMatch(/^\(An imaginary/);
  });

  it("still runs the page when the model is down", async () => {
    const out = await writeLetters(new BrokenModel(), opts);
    expect(out.stories).toHaveLength(4);
    expect(out.problems[0]).toMatch(/letters call failed/);
    for (const s of out.stories) expect(s.section).toBe("letters-and-classifieds");
  });
});
