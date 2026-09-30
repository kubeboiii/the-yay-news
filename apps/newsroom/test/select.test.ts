import { describe, expect, it } from "vitest";
import {
  NotEnoughNewsError,
  RULES,
  beatKey,
  merit,
  select,
  type RecentBeats,
} from "../src/stages/select.ts";
import { CORE_SECTIONS, type Classified } from "../src/types.ts";
import { ALL_SECTIONS, classified } from "./fixtures.ts";

const pool = () =>
  ALL_SECTIONS.flatMap((s) => Array.from({ length: 7 }, (_, n) => classified(s, n)));
const GUESTS = { guests: ["word-nerd", "food-and-drink"] } as const;
const served = (s: ReturnType<typeof select>, page?: string) =>
  s.assignments.filter((a) => !a.reserve && (page === undefined || a.page === page));

describe("select", () => {
  it("fills the front page, every daily page and two guest pages, with reserves", () => {
    const selection = select(pool(), GUESTS);
    const { assignments, pages } = selection;
    expect(pages).toEqual(["front", ...CORE_SECTIONS, "word-nerd", "food-and-drink"]);
    expect(served(selection, "front").map((a) => a.slot)).toEqual(["lead", "feature", "feature"]);
    for (const s of CORE_SECTIONS) {
      expect(served(selection, s).map((a) => a.slot)).toEqual([
        "feature",
        "feature",
        "brief",
        "brief",
      ]);
    }
    expect(served(selection).length).toBeGreaterThanOrEqual(40);
    expect(assignments.filter((a) => a.reserve).length).toBeGreaterThan(0);
    expect(new Set(assignments.map((a) => a.candidate.id)).size).toBe(assignments.length);
  });

  it("runs no guest pages when none are given", () => {
    const { pages } = select(pool());
    expect(pages).toEqual(["front", ...CORE_SECTIONS]);
  });

  it("caps any one topic (not 12 AI stories)", () => {
    const ai = Array.from({ length: 12 }, (_, n) =>
      classified("tech", n, { topic: "ai", score: 10, sourceSlug: `ai-${n}` }),
    );
    const { assignments } = select([...pool(), ...ai]);
    expect(assignments.filter((a) => !a.reserve && a.candidate.topic === "ai")).toHaveLength(
      RULES.topicCap,
    );
  });

  it("caps any one source, overall and per page", () => {
    const flood = Array.from({ length: 10 }, (_, n) =>
      classified("play", n + 20, { sourceSlug: "one-outlet", topic: `t${n}`, score: 10 }),
    );
    const selection = select([...pool(), ...flood]);
    const fromOne = served(selection).filter((a) => a.candidate.sourceSlug === "one-outlet");
    expect(fromOne.length).toBeLessThanOrEqual(RULES.sourceCap);
    expect(fromOne.filter((a) => a.page === "play").length).toBeLessThanOrEqual(
      RULES.sourcePageCap,
    );
  });

  it("leads with a strong story that has a picture", () => {
    const star = classified("sports", 50, { score: 10, imageUrl: "https://example.org/star.jpg" });
    const { assignments, unused } = select([...pool(), star]);
    const lead = assignments.find((a) => a.slot === "lead");
    expect(lead?.candidate.imageUrl).toBeTruthy();
    // Nothing left over with a picture was a better lead (merit: score, prominence, depth).
    const better = unused.filter(
      (u) =>
        u.candidate.imageUrl &&
        CORE_SECTIONS.includes(u.candidate.section) &&
        merit(u.candidate) > merit(lead!.candidate),
    );
    expect(better).toEqual([]);
  });

  it("gives up on a thin day", () => {
    expect(() => select(pool().slice(0, 8))).toThrow(NotEnoughNewsError);
  });

  it("never leads with a story from a section that has no page today", () => {
    // A brilliant food story on a day whose guests are other sections.
    const food = classified("food-and-drink", 90, {
      score: 10,
      imageUrl: "https://example.org/pie.jpg",
    });
    const { assignments, pages } = select([...pool(), food], {
      guests: ["word-nerd", "time-machine"],
    });
    const front = assignments.filter((a) => a.page === "front" && !a.reserve);
    for (const a of front) expect(pages).toContain(a.candidate.section);
  });

  it("boosts prominent names above niche ones of equal charm", () => {
    const niche = classified("music", 60, { title: "A choir of librarians sings" });
    const big = classified("music", 60, {
      title: "Billie Eilish announces a surprise acoustic set",
    });
    expect(merit(big)).toBeGreaterThan(merit(niche));
  });

  it("fills a short page from its secondary sources", () => {
    const thin = pool().filter((c) => c.section !== "money" || c.id.endsWith("0"));
    const helpers = Array.from({ length: 6 }, (_, n) =>
      classified("tech", 70 + n, {
        sourceSections: ["tech", "money"],
        sourceSlug: `helper-${n}`,
        topic: `helper-${n}`,
      }),
    );
    const selection = select([...thin, ...helpers]);
    expect(selection.pages).toContain("money");
    const money = served(selection, "money");
    expect(money.length).toBe(RULES.perPage);
    expect(money.some((a) => a.candidate.sourceSlug.startsWith("helper-"))).toBe(true);
    expect(money.every((a) => a.candidate.section === "money")).toBe(true);
  });

  it("writes briefs from a feed summary when that is all there is", () => {
    const short = pool().map((c) =>
      c.section === "money" ? { ...c, text: c.summary, paywalled: true } : c,
    );
    expect(served(select(short), "money").length).toBeGreaterThan(1);
  });
});

describe("beats", () => {
  /** Sports stories with the given beats, each from its own outlet, best first. */
  const sports = (beats: string[], extra: Partial<Classified> = {}) =>
    beats.map((beat, i) =>
      classified("sports", 2, {
        beat,
        score: 9 - i * 0.1,
        topic: `sports-beat-${i}`,
        sourceSlug: `sports-outlet-${i}`,
        ...extra,
      }),
    );
  const withSports = (s: Classified[]) => [...pool().filter((c) => c.section !== "sports"), ...s];

  it("spreads a page across its beats: no second story from a beat while another has one", () => {
    const three = sports(["football", "football", "football", "boxing", "f1"]);
    const page = served(select(withSports(three)), "sports").map((a) => a.candidate.beat);
    expect(page).toHaveLength(4);
    // The best football story leads; boxing and F1 get in before a second football story.
    expect(page[0]).toBe("football");
    expect(new Set(page.slice(0, 3))).toEqual(new Set(["football", "boxing", "f1"]));
    expect(page[3]).toBe("football");
  });

  it("takes a second story from a beat only once every beat has had a turn", () => {
    const page = served(
      select(withSports(sports(["tennis", "tennis", "tennis", "tennis"]))),
      "sports",
    );
    expect(page.map((a) => a.candidate.beat)).toEqual(["tennis", "tennis", "tennis", "tennis"]);
  });

  it("rotates in a beat left out lately over an equal-merit beat seen every day", () => {
    // Tennis and cricket weigh the same (data/beats.json) and the stories are equally good.
    const pair = () => [
      ...sports(["tennis", "cricket"], { score: 9 }),
      ...sports(["running", "olympics"], { score: 5 }).map((c, i) => ({
        ...c,
        sourceSlug: `slow-${i}`,
      })),
    ];
    const main = (recentBeats?: RecentBeats) =>
      select(withSports(pair()), { recentBeats }).assignments.find(
        (a) => a.page === "sports" && a.main,
      )?.candidate.beat;
    expect(main()).toBe("tennis"); // a tie goes to the first in the pool
    expect(main(new Map([[beatKey("sports", "tennis"), 4]]))).toBe("cricket");
  });

  it("brings every daily page up to three stories, bending the edition-wide caps if it must", () => {
    // Tech (built first) prints three "ai" stories, using up the topic. Startups has none of its own; the only
    // stories whose sources can feed it are more "ai" tech stories, which only a page short of its
    // minimum may take.
    const capped = Array.from({ length: 3 }, (_, n) =>
      classified("tech", 80 + n, { topic: "ai", score: 10, sourceSlug: `tech-ai-${n}` }),
    );
    const helpers = Array.from({ length: 4 }, (_, n) =>
      classified("tech", 90 + n, {
        topic: "ai",
        score: 1,
        sourceSections: ["tech", "startups"],
        sourceSlug: `wire-${n}`,
      }),
    );
    const base = pool().filter((c) => c.section !== "startups");
    const selection = select([...base, ...capped, ...helpers]);
    expect(selection.pages).toEqual(["front", ...CORE_SECTIONS]);
    for (const s of CORE_SECTIONS)
      expect(served(selection, s).length, s).toBeGreaterThanOrEqual(RULES.minPerPage);
    const startups = served(selection, "startups");
    expect(startups).toHaveLength(RULES.minPerPage);
    expect(startups.every((a) => a.candidate.sourceSlug.startsWith("wire-"))).toBe(true);
    expect(startups.every((a) => a.candidate.section === "startups")).toBe(true);
    expect(served(selection).filter((a) => a.candidate.topic === "ai").length).toBeGreaterThan(
      RULES.topicCap,
    );
  });
});

describe("guest pages", () => {
  it("lets a guest with nothing to print give way to the next in its cycle", () => {
    // Nothing at all for brain-snacks today.
    const selection = select(pool(), {
      guests: ["brain-snacks", "word-nerd"],
      fallbacks: ["food-and-drink", "time-machine"],
    });
    expect(selection.pages.slice(-2)).toEqual(["word-nerd", "food-and-drink"]);
    expect(selection.assignments.some((a) => a.page === "brain-snacks")).toBe(false);
    expect(selection.assignments.some((a) => a.page === "time-machine")).toBe(false);
  });

  it("runs the day's own guests when they can fill their pages", () => {
    const selection = select(pool(), {
      guests: ["time-machine", "art-and-design"],
      fallbacks: ["word-nerd"],
    });
    expect(selection.pages.slice(-2)).toEqual(["time-machine", "art-and-design"]);
  });
});
