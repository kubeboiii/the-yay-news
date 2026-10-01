// The stricter tone rules: a planted story for each kind of bad news the paper never prints, each
// dressed up with a cheerful headline so only the rule (not the mood) can catch it, and control
// stories that must pass. Planted bad news sits in the backstory of the source text, where only
// the full-text check sees it.
import { describe, expect, it } from "vitest";
import { FakeModel } from "../src/model/fake.ts";
import { DELIGHT_RUBRIC } from "../src/rubric.ts";
import { blocklistHit } from "../src/stages/blocklist.ts";
import { delightCheck } from "../src/stages/delight.ts";
import { candidate, sourceText } from "./fixtures.ts";

const PLANTED: [category: string, group: string, headline: string, backstory: string][] = [
  [
    "illness backstory",
    "illness",
    "Baker's giant rainbow cake wows the village fete",
    "She took up baking after her diagnosis two years ago.",
  ],
  [
    "disease",
    "illness",
    "Community choir sings its hundredth concert",
    "The choir was founded to raise money for dementia research.",
  ],
  [
    "death backstory",
    "death",
    "Marathon runner completes a record fifty races",
    "He runs every race in memory of his late wife.",
  ],
  [
    "layoffs",
    "jobs",
    "Games studio unveils a cosy farming sequel",
    "The launch follows job cuts at the studio earlier this year.",
  ],
  [
    "layoffs (restructuring)",
    "jobs",
    "Toy maker's new robot dog is a hit with kids",
    "The company says the restructuring will let it focus on robots.",
  ],
  [
    "lawsuit",
    "legal",
    "Sneaker brand drops a glow-in-the-dark trainer",
    "The design follows a legal battle with a rival brand.",
  ],
  [
    "court case",
    "legal",
    "Artist's giant mural brightens the high street",
    "The mural went ahead after a court ruling in the artist's favour.",
  ],
  [
    "prices rising",
    "prices",
    "Coffee chain launches a pumpkin spice doughnut",
    "The launch comes as the chain announced price rises across its menu.",
  ],
  [
    "cost of living",
    "prices",
    "Family saves enough to build a treehouse",
    "They found clever savings despite energy bills climbing all year.",
  ],
  [
    "war relocation",
    "relocation",
    "Youth orchestra wins a European music prize",
    "The orchestra was relocated from its home city because of the war.",
  ],
  [
    "conflict displacement",
    "relocation",
    "Chess prodigy, 11, becomes a grandmaster-in-waiting",
    "His family fled to the city when he was five.",
  ],
  [
    "scandal",
    "scandal",
    "Football club unveils a retro-style home kit",
    "The kit follows allegations of misconduct at the club last season.",
  ],
  [
    "resignation",
    "scandal",
    "Chocolate maker launches a spicy mango bar",
    "The bar is the first since the chief executive resigned in the summer.",
  ],
  [
    "sad but framing",
    "sadBut",
    "Grandmother, 90, learns to skateboard",
    "Sadly, she had given up hobbies for years before a friend coaxed her out.",
  ],
  [
    "sad but framing (survivor)",
    "sadBut",
    "Teen climber conquers the tallest indoor wall",
    "She is a survivor who once doubted she would climb again.",
  ],
  [
    "animal harm",
    "animalHarm",
    "Fox cub makes friends with the local ducks",
    "The cub was found abandoned in a garden in the spring.",
  ],
  [
    "animal harm (rescue)",
    "animalHarm",
    "Seal pup waddles back into the sea to cheers",
    "It was rescued from a fishing net and cared for at a centre.",
  ],
  [
    "disaster with a happy ending",
    "disaster",
    "Village reopens its much-loved pub",
    "The pub was rebuilt after the floods destroyed its ground floor.",
  ],
  [
    "storm",
    "disaster",
    "Surfers enjoy record waves off the coast",
    "The waves followed a tropical storm that battered the region.",
  ],
  [
    "politics",
    "politics",
    "New cycle lane opens along the seafront",
    "The lane was championed by the transport minister before the vote.",
  ],
  [
    "politics (elections)",
    "politics",
    "Dog becomes the most photographed on the high street",
    "Voters queued past him on their way to the polling station.",
  ],
  [
    "crime",
    "crime",
    "Library's rare book returns to the shelves",
    "The book had been stolen and was recovered by detectives.",
  ],
  [
    "crime (quirky heist)",
    "crime",
    "Cheese wheel finally finds its way home",
    "It went missing in a heist that puzzled the town for weeks.",
  ],
];

const CONTROLS: [headline: string, text: string][] = [
  [
    "Otters learn to juggle pebbles at Tokyo aquarium",
    "Keepers say the otters practise for an hour every morning and now juggle three pebbles at once.",
  ],
  [
    "Sensex hits a record high as a festive rally lifts markets",
    "The index closed at a record, with shoppers and investors in a cheerful mood before the festival.",
  ],
  [
    "Eleven-year-old becomes the youngest chess master in her club",
    "She has played since she was six and now teaches younger children on Saturdays.",
  ],
  [
    "Village names its giant pumpkin after the town's dog mayor",
    "The pumpkin weighed in at the autumn show, and the dog mayor attended in a bow tie.",
  ],
  [
    "Former accountant becomes a professional ice-cream taster",
    "She tastes up to forty flavours a day and says it is the best job she has ever had.",
  ],
  [
    "Tiny tea company's biscuit subscription sells out in an hour",
    "The two founders bake every batch themselves and plan to double production next spring.",
  ],
  [
    "Kids build a solar-powered reading lamp for their school library",
    "The pupils designed it in science club and it now lights the reading corner every afternoon.",
  ],
];

describe("the tone rules", () => {
  it.each(PLANTED)("rejects a planted story: %s", async (_category, group, headline, backstory) => {
    const planted = candidate("internet", 7, {
      title: headline,
      summary: "A cheerful story with a lovely ending.",
      text: `${sourceText("internet", 7)} ${backstory}`,
    });
    const out = await delightCheck(new FakeModel(), [planted]);
    expect(out.allowed).toEqual([]);
    expect(out.rejected).toEqual([
      expect.objectContaining({
        stage: "blocklist",
        reason: expect.stringContaining(`blocklist (${group})`),
      }),
    ]);
    // The headline alone is clean: it is the backstory that sinks it.
    expect(blocklistHit(headline)).toBeNull();
  });

  it.each(CONTROLS)("lets a happy control story through: %s", async (headline, text) => {
    expect(blocklistHit(`${headline}\n${text}`)).toBeNull();
    const good = candidate("money", 3, {
      title: headline,
      summary: text,
      text: `${sourceText("money", 3)} ${text}`,
    });
    const out = await delightCheck(new FakeModel(), [good]);
    expect(out.allowed.map((c) => c.id)).toEqual([good.id]);
  });

  it("does not trip on everyday phrases that only look grim", () => {
    for (const ok of [
      "KPop Demon Hunters tops the streaming chart again",
      "A guilty pleasure: the cosy detective show everyone is bingeing",
      "Harry Potter and the Prisoner of Azkaban returns to cinemas",
      "Couple downsize to a tiny house on a hillside",
      "UFC star picks a disco classic for his walkout song",
      "Black Widow director signs on for a new Marvel film",
      "Lonely Planet names its best cities for 2027",
      "A book you cannot put down, say readers",
      "Sue Perkins hosts a baking special",
      "Tennis court in Paris gets a pink makeover",
    ])
      expect(blocklistHit(ok), ok).toBeNull();
  });

  it("spells every category out for the classifier", () => {
    for (const rule of [
      "illness, disease or a death",
      "layoffs, job cuts",
      "lawsuits, court cases",
      "prices rising",
      "war or conflict, including a team, festival or person relocated",
      "scandal",
      '"sad but…" framing',
      "animals harmed",
      "disasters",
      "politics",
      "crime of any kind",
    ])
      expect(DELIGHT_RUBRIC).toContain(rule);
  });
});
