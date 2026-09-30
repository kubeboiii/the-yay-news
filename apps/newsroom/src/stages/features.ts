// Stage 7: the recurring features (Number of the Day, the Internet Weather Report, a quote,
// Corrections, Classifieds, the comic and the sign-off) and the back-page puzzles.
import { puzzlesFor } from "@repo/puzzles";
import { type Feature, type SolvedPuzzle, featureSchema } from "@repo/shared";
import { z } from "zod";
import { withData } from "../model/prompt-data.ts";
import type { Model } from "../model/types.ts";
import { VOICES } from "../rubric.ts";
import { hash, weekdayName } from "../text.ts";
import { blocklistHit } from "./blocklist.ts";
import { numbersIn } from "./factcheck.ts";

export type FeatureStory = { id: string; headline: string; section: string; sourceText: string };
export type FeaturesInput = { date: string; weekday: string; stories: FeatureStory[] };

export const featuresReplySchema = z.object({
  numberOfDay: z.object({ value: z.string(), caption: z.string(), storyId: z.string() }),
  weather: z.object({ headline: z.string(), detail: z.string() }),
  quote: z.object({ text: z.string(), by: z.string(), storyId: z.string() }).nullable(),
  corrections: z.array(z.string()).min(1).max(3),
  classifieds: z
    .array(z.object({ heading: z.string(), text: z.string() }))
    .min(2)
    .max(4),
  comic: z.object({ panels: z.array(z.string()).min(3).max(5) }),
});
export type FeaturesReply = z.infer<typeof featuresReplySchema>;

const INSTRUCTIONS = `
Write today's recurring features for The Yay News. Voice for all of them: ${VOICES.quirky}
Never mention anything sad, dangerous or bad.

- numberOfDay: one surprising figure taken from ONE of today's stories (give its storyId). "value" is
  the figure as printed big on the front page, e.g. "66.5m" or "3,000"; its digits must appear in
  that story's sourceText. "caption" says what it counts in one line, lower-case start, no full stop.
- weather: the Internet Weather Report, the day's online mood as a forecast. "headline" starts with
  the weekday and a colon, e.g. "Tuesday: fair, with scattered ducks". "detail" is two or three
  absurd forecast sentences that nod to today's stories.
- quote: a short quotation copied EXACTLY, word for word, from one story's sourceText, with who said
  it and in what capacity; or null if no source has a good one.
- corrections: two joke corrections to "yesterday's edition", e.g. "Yesterday we said otters hold
  hands. They hold hands more than we said." Invent nothing bad.
- classifieds: three free joke ads with a heading of WANTED, FOR SALE, FREE, LOST, FOUND or
  SEEKING, in the spirit of indie games, open-source projects and small creators.
- comic: the "Pip & Pigeon" strip, four panels, each "PIP: …" or "PIGEON: …", gently silly.
`;

const fold = (s: string) =>
  s.replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/\s+/g, " ").toLowerCase();

/** Deterministic stand-ins, used whenever the model's features fail validation. */
export function fallbackFeatures(input: FeaturesInput): FeaturesReply {
  const withNumber = input.stories.find((s) => numbersIn(s.headline).length > 0);
  const n = withNumber ? numbersIn(withNumber.headline)[0] : null;
  const pick = <T>(xs: T[]) => xs[hash(input.date) % xs.length] as T;
  return {
    numberOfDay: {
      value: n ?? String(input.stories.length),
      caption: n
        ? `as in today's story: ${withNumber!.headline.toLowerCase().replace(/\.$/, "")}`
        : "good things in today's paper, and we counted twice",
      storyId: withNumber?.id ?? "",
    },
    weather: {
      headline: `${input.weekday}: ${pick(["bright, with scattered memes", "sunny spells of good news", "fair, with a light drizzle of puns"])}`,
      detail:
        "A warm front of good news moves in from the east by breakfast. Scattered chuckles clear by lunchtime. Visibility excellent all the way to the back page.",
    },
    quote: null,
    corrections: [
      "Yesterday we said a cat was the size of a loaf. It was the size of a slightly larger loaf. We regret the crumbs.",
      "An earlier edition described a pigeon as ‘unbothered’. It has since asked us to say ‘serene’.",
    ],
    classifieds: [
      {
        heading: "WANTED",
        text: "Beta testers for a game about stacking teacups. Steady hands preferred. Biscuits provided in spirit.",
      },
      {
        heading: "FREE",
        text: "An open-source app that reminds you to drink water in the voice of a very polite duck.",
      },
      {
        heading: "LOST",
        text: "One good mood, last seen on the front page. Answers to ‘yay’. Please return to reader.",
      },
    ],
    comic: {
      panels: [
        "PIP: What's in the paper today?",
        "PIGEON: Only good news.",
        "PIP: Is that allowed?",
        "PIGEON: It is now.",
      ],
    },
  };
}

/** Check the model's features against the stories they claim to come from. */
export function validateFeatures(reply: FeaturesReply, input: FeaturesInput): string[] {
  const problems: string[] = [];
  const story = (id: string) => input.stories.find((s) => s.id === id);
  const n = story(reply.numberOfDay.storyId);
  const digits = numbersIn(reply.numberOfDay.value);
  if (!n) problems.push("number of the day: unknown story");
  else if (
    !digits.length ||
    !digits.every((d) => numbersIn(n.sourceText.replace(/,(?=\d{3}\b)/g, "")).includes(d))
  )
    problems.push("number of the day: figure not in its story's source");
  if (reply.quote) {
    const q = story(reply.quote.storyId);
    if (!q || !fold(q.sourceText).includes(fold(reply.quote.text).replace(/^"|"$/g, "")))
      problems.push("quote: not word for word from its source");
  }
  const everything = JSON.stringify(reply);
  const grim = blocklistHit(everything);
  if (grim) problems.push(`features mention "${grim.word}"`);
  return problems;
}

export function toFeatures(reply: FeaturesReply): Feature[] {
  const list: Omit<Feature, "order">[] = [
    {
      type: "number_of_day",
      content: { value: reply.numberOfDay.value, caption: reply.numberOfDay.caption },
    },
    { type: "weather", content: reply.weather },
    ...(reply.quote
      ? [{ type: "quote" as const, content: { text: reply.quote.text, by: reply.quote.by } }]
      : []),
    ...reply.corrections
      .slice(0, 2)
      .map((text) => ({ type: "correction" as const, content: { text } })),
    ...reply.classifieds.slice(0, 3).map((c) => ({ type: "classified" as const, content: c })),
    { type: "comic", content: { title: "Pip & Pigeon", panels: reply.comic.panels } },
    { type: "sign_off", content: { text: "You're done for today. See you tomorrow." } },
  ] as Omit<Feature, "order">[];
  const seen = new Map<string, number>();
  return list.map((f) => {
    const order = seen.get(f.type) ?? 0;
    seen.set(f.type, order + 1);
    return featureSchema.parse({ ...f, order });
  });
}

export async function generateFeatures(
  model: Model,
  date: string,
  stories: FeatureStory[],
): Promise<{ features: Feature[]; problems: string[] }> {
  const input: FeaturesInput = {
    date,
    weekday: weekdayName(date),
    stories: stories.map((s) => ({ ...s, sourceText: s.sourceText.slice(0, 1500) })),
  };
  let reply: FeaturesReply;
  let problems: string[];
  try {
    reply = await model.complete(withData(INSTRUCTIONS, input), {
      tier: "writer",
      schema: featuresReplySchema,
      task: "features",
    });
    problems = validateFeatures(reply, input);
    if (problems.some((p) => p.startsWith("quote"))) reply = { ...reply, quote: null };
    if (problems.some((p) => p.startsWith("number"))) {
      reply = { ...reply, numberOfDay: fallbackFeatures(input).numberOfDay };
    }
    if (problems.some((p) => p.startsWith("features mention"))) reply = fallbackFeatures(input);
  } catch (e) {
    problems = [`feature call failed, using stand-ins: ${(e as Error).message}`];
    reply = fallbackFeatures(input);
  }
  return { features: toFeatures(reply), problems };
}

/** The back page's puzzles, with the word search hiding words from the day's own headlines. */
export const puzzlesOf = (date: string, headlines: string[]): SolvedPuzzle[] =>
  puzzlesFor(date, { headlines });
