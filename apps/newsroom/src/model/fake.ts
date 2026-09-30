// A deterministic offline model for tests and dry runs. It reads the data block of each prompt and
// answers from the source text alone (so its stories pass the fact check), with no network.
import { BEATS } from "../beats.ts";
import type { SectionSlug } from "../types.ts";
import type { z } from "zod";
import type { DelightInput, DelightVerdict } from "../stages/delight.ts";
import type { FeaturesInput, FeaturesReply } from "../stages/features.ts";
import { numbersIn } from "../stages/factcheck.ts";
import type { WriteInput, Written } from "../stages/write.ts";
import { hash, sentences } from "../text.ts";
import { readData } from "./prompt-data.ts";
import { type CompleteOptions, type Model, ModelError, parseWith } from "./types.ts";

/** Words the fake classifier treats as a sign an item is not delightful (beyond the blocklist). */
const GLOOM =
  /\b(sad|sadly|gloom|grim|bleak|worst|terrible|awful|tears|mourned|failure|worried)\b/i;

const TOPICS: [RegExp, string][] = [
  [/\b(ai|artificial intelligence|machine learning|chatbot|llm)\b/i, "ai"],
  [/\b(space|nasa|galaxy|planet|moon|star|telescope|rocket|mars)\b/i, "space"],
  [/\b(game|games|gaming|nintendo|console|indie)\b/i, "games"],
  [/\b(dog|dogs|puppy|cat|cats|kitten)\b/i, "pets"],
  [/\b(film|movie|trailer|album|song|band|concert)\b/i, "entertainment"],
  [/\b(football|cricket|f1|formula|match|tennis|olympic)\b/i, "sport"],
];

export class FakeModel implements Model {
  readonly name = "fake";
  calls: { task?: string; tier: string }[] = [];

  complete<T>(prompt: string, options: CompleteOptions<T> & { schema: z.ZodType<T> }): Promise<T>;
  complete(prompt: string, options: CompleteOptions): Promise<string>;
  async complete<T>(prompt: string, options: CompleteOptions<T>): Promise<T | string> {
    this.calls.push({ task: options.task, tier: options.tier });
    let reply: unknown;
    switch (options.task) {
      case "delight":
        reply = { results: readData<DelightInput>(prompt).items.map(classify) };
        break;
      case "write":
        reply = { stories: readData<WriteInput>(prompt).stories.map(write) };
        break;
      case "features":
        reply = features(readData<FeaturesInput>(prompt));
        break;
      default:
        if (!options.schema) return "ok";
        throw new ModelError(this.name, `no fake answer for task "${options.task}"`);
    }
    return options.schema ? parseWith(this.name, options.schema, reply) : JSON.stringify(reply);
  }
}

function classify(item: DelightInput["items"][number]): DelightVerdict {
  const text = `${item.title} ${item.summary} ${item.excerpt}`;
  if (GLOOM.test(text)) return { id: item.id, decision: "reject", reason: "gloomy in tone" };
  const topic = TOPICS.find(([re]) => re.test(text))?.[1] ?? `misc-${hash(item.id) % 40}`;
  return {
    id: item.id,
    decision: "allow",
    reason: "cheerful and factual",
    section: item.sections[0],
    beat: (() => {
      const beats = Object.keys(BEATS[item.sections[0] as SectionSlug] ?? {});
      const named = beats.find((b) => new RegExp(`\\b${b.split("-")[0]}`, "i").test(text));
      return named ?? beats[hash(item.id) % Math.max(1, beats.length)] ?? "other";
    })(),
    topic,
    score: 4 + (hash(item.id) % 6),
  };
}

const clip = (s: string, max: number) => {
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:]$/, "");
};

function write(item: WriteInput["stories"][number]): Written {
  const ss = sentences(item.sourceText);
  const shape = {
    long: [3, 3, 3, 3, 3, 3, 3, 3],
    main: [3, 3, 3, 3, 2],
    second: [2, 2, 2],
    brief: [2],
  }[item.length];
  const body: string[] = [];
  let i = 2;
  for (const n of shape) {
    const para = ss.slice(i, i + n).join(" ");
    if (para) body.push(para);
    i += n;
  }
  return {
    id: item.id,
    kicker: item.section.split(/[\s&,]+/)[0] ?? "News",
    headline: clip(ss[0] ?? item.sourceTitle, 150).padEnd(10, "."),
    dek: clip(ss[1] ?? ss[0] ?? "More inside.", 250).padEnd(10, "."),
    body: body.length ? body : [ss[0] ?? "More soon."],
    sticker: null,
  };
}

function features(input: FeaturesInput): FeaturesReply {
  const withNumber = input.stories.find((s) => numbersIn(s.sourceText).length > 0);
  const number = withNumber ? numbersIn(withNumber.sourceText)[0]! : String(input.stories.length);
  const quoted = input.stories
    .map((s) => ({ s, m: s.sourceText.match(/“([^”]{20,160})”/) }))
    .find((x) => x.m);
  return {
    numberOfDay: {
      value: number,
      caption: withNumber ? `a figure from “${withNumber.headline}”` : "stories in today's paper",
      storyId: withNumber?.id ?? input.stories[0]?.id ?? "",
    },
    weather: {
      headline: `${input.weekday}: bright, with scattered memes`,
      detail: "A ridge of good news settles over the front page. Light puns by lunchtime.",
    },
    quote: quoted
      ? { text: quoted.m![1]!, by: "A source in today's paper", storyId: quoted.s.id }
      : null,
    corrections: [
      "Yesterday we said a goose was large. It was merely confident.",
      "An earlier edition called a teapot ‘small’. It holds four cups and would like that known.",
    ],
    classifieds: [
      {
        heading: "WANTED",
        text: "Players for a game about gardening snails. Slow and steady applicants only.",
      },
      { heading: "FREE", text: "A font made entirely of spoons. Stirring stuff." },
      {
        heading: "FOUND",
        text: "One sunny mood, on the back page. Owner may collect at any time.",
      },
    ],
    comic: {
      panels: [
        "PIP: Any news?",
        "PIGEON: Only good news.",
        "PIP: Every day?",
        "PIGEON: Every single day.",
      ],
    },
  };
}

/** A model that always fails, for testing provider fallback. */
export class BrokenModel implements Model {
  constructor(readonly name = "broken") {}
  calls = 0;
  complete<T>(prompt: string, options: CompleteOptions<T> & { schema: z.ZodType<T> }): Promise<T>;
  complete(prompt: string, options: CompleteOptions): Promise<string>;
  async complete(): Promise<never> {
    this.calls++;
    throw new ModelError(this.name, "not available");
  }
}
