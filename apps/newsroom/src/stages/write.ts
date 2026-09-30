// Stage 5: write each story from its fetched source text only, in its section's voice, then fact
// check it. A story that fails is rewritten once with the problems listed; if it fails again it is
// dropped and a reserve takes its place.
import { z } from "zod";
import { withData } from "../model/prompt-data.ts";
import type { Model } from "../model/types.ts";
import { prominentIn } from "../prominence.ts";
import { LENGTHS, type Length, SECTION_FOCUS, VOICES, VOICE_GUIDE } from "../rubric.ts";
import type { Assignment, SectionSlug } from "../types.ts";
import { LONG_READS, RULES } from "./select.ts";
import { blocklistHit } from "./blocklist.ts";
import { factCheck } from "./factcheck.ts";

export type SectionInfo = { slug: SectionSlug; name: string; voice: "witty" | "quirky" | "warm" };

export type WriteItem = {
  id: string;
  length: Length;
  section: string;
  voice: string;
  sourceName: string;
  sourceTitle: string;
  sourceText: string;
  /** The section's focus (what its readers come for). */
  focus?: string;
  /** Well-known names the source mentions: lead with them. */
  prominent?: string[];
  /** Only a feed summary (and maybe other outlets) to go on: keep it brief and exact. */
  summaryOnly?: boolean;
  /** Present on a rewrite: what the fact check could not find in the source. */
  problems?: string[];
};
export type WriteInput = { stories: WriteItem[] };

export const writtenSchema = z.object({
  id: z.string(),
  kicker: z.string().min(1).max(40),
  headline: z.string().min(10).max(160),
  dek: z.string().min(10).max(260),
  body: z.array(z.string().min(1)).min(1).max(12),
  sticker: z.string().max(24).nullable().optional(),
});
export const writeReplySchema = z.object({ stories: z.array(writtenSchema) });
export type Written = z.infer<typeof writtenSchema>;

/** Source text sent to the writer per story (enough for a lead, bounded for batching). */
export const SOURCE_CHARS = 6000;
/** A long read gets more: it is written from several outlets. */
export const LONG_SOURCE_CHARS = 12000;

/** Below this much source text a story is written at brief length, whatever its slot. */
export const SUMMARY_ONLY_BELOW = 700;
/** Below this, a would-be main story is written at the second story's length. */
export const MAIN_NEEDS = 1200;

export const lengthOf = (a: Assignment): Length => {
  const n = a.candidate.text.length;
  if (LONG_READS.includes(a.page as SectionSlug) && n >= RULES.minText.long) return "long";
  if (a.slot === "brief" || n < SUMMARY_ONLY_BELOW) return "brief";
  if (a.slot === "lead" || (a.page !== "front" && isPageMain(a)))
    return n < MAIN_NEEDS ? "second" : "main";
  return "second";
};
/** The first feature on an inside page is its main story (the select stage fills it first). */
const isPageMain = (a: Assignment) => a.slot === "feature" && a.main === true;

const INSTRUCTIONS = `
You are writing stories for today's edition of The Yay News.
${VOICE_GUIDE}
Voices by section:
- witty: ${VOICES.witty}
- quirky: ${VOICES.quirky}
- warm: ${VOICES.warm}

Lengths:
- long: ${LENGTHS.long.paragraphs} paragraphs, ${LENGTHS.long.words} words: a relaxed, fascinating
  feature that tells the whole story, drawing on every outlet in the source text.
- main: ${LENGTHS.main.paragraphs} paragraphs, ${LENGTHS.main.words} words in all.
- second: ${LENGTHS.second.paragraphs} paragraphs, ${LENGTHS.second.words} words.
- brief: ${LENGTHS.brief.paragraphs} paragraph, ${LENGTHS.brief.words} words.

For every story below, write a kicker, a headline, a dek and the body (one string per paragraph),
from its sourceText ONLY, in our own words (never copy the source's sentences). Where a story has
"focus", angle it that way; where it has "prominent" names, lead with them. Optionally add a sticker: a two-to-four-word exclamation for a star story,
otherwise null. If a story has "problems", your previous draft used those numbers or names that are
not in the source: rewrite it without them. Return one story per id.
`;

export type WriteOutcome = {
  written: Map<string, Written>;
  /** Candidate ids that could not be written to pass, with why. */
  failed: Map<string, string>;
};

export function checkWritten(w: Written, source: string) {
  const text = [w.kicker, w.headline, w.dek, ...w.body, w.sticker ?? ""].join("\n");
  const grim = blocklistHit(text);
  const fc = factCheck(text, source);
  return {
    ok: fc.ok && !grim,
    problems: [
      ...fc.missing.map((m) => `${m.kind} "${m.value}" is not in the source`),
      ...(grim ? [`mentions "${grim.word}", which The Yay News never prints`] : []),
    ],
  };
}

/** Group assignments into batches of about one page each, so each call stays a sensible size. */
function batches<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

export async function writeStories(
  model: Model,
  assignments: Assignment[],
  sections: Map<string, SectionInfo>,
  { batchSize = 5 }: { batchSize?: number } = {},
): Promise<WriteOutcome> {
  const written = new Map<string, Written>();
  const failed = new Map<string, string>();
  const item = (a: Assignment, problems?: string[]): WriteItem => {
    const info = sections.get(a.candidate.section);
    return {
      id: a.candidate.id,
      length: lengthOf(a),
      section: info?.name ?? a.candidate.section,
      voice: a.page === "front" && a.slot === "lead" ? "witty" : (info?.voice ?? "witty"),
      sourceName: a.candidate.sourceName,
      sourceTitle: a.candidate.title,
      sourceText: a.candidate.text.slice(
        0,
        lengthOf(a) === "long" ? LONG_SOURCE_CHARS : SOURCE_CHARS,
      ),
      ...(SECTION_FOCUS[a.candidate.section] ? { focus: SECTION_FOCUS[a.candidate.section] } : {}),
      ...(() => {
        const names = prominentIn(
          `${a.candidate.title}\n${a.candidate.summary}`,
          a.candidate.section,
        );
        return names.length ? { prominent: names.slice(0, 6) } : {};
      })(),
      ...(a.candidate.paywalled || a.candidate.text.length < SUMMARY_ONLY_BELOW
        ? { summaryOnly: true }
        : {}),
      ...(problems ? { problems } : {}),
    };
  };

  const call = async (items: WriteItem[]) => {
    const reply = await model.complete(
      withData(INSTRUCTIONS, { stories: items } satisfies WriteInput),
      {
        tier: "writer",
        schema: writeReplySchema,
        task: "write",
      },
    );
    return new Map(reply.stories.map((s) => [s.id, s]));
  };

  const retry: { a: Assignment; problems: string[] }[] = [];
  for (const group of batches(assignments, batchSize)) {
    const got = await call(group.map((a) => item(a)));
    for (const a of group) {
      const w = got.get(a.candidate.id);
      if (!w) {
        retry.push({ a, problems: ["the story was missing from the reply"] });
        continue;
      }
      const check = checkWritten(w, a.candidate.text);
      if (check.ok) written.set(a.candidate.id, w);
      else retry.push({ a, problems: check.problems });
    }
  }

  // One rewrite for everything that failed, batched.
  for (const group of batches(retry, batchSize)) {
    let got: Map<string, Written>;
    try {
      got = await call(group.map((r) => item(r.a, r.problems)));
    } catch (e) {
      for (const r of group)
        failed.set(r.a.candidate.id, `rewrite call failed: ${(e as Error).message}`);
      continue;
    }
    for (const r of group) {
      const w = got.get(r.a.candidate.id);
      const check = w
        ? checkWritten(w, r.a.candidate.text)
        : { ok: false, problems: ["missing again"] };
      if (w && check.ok) written.set(r.a.candidate.id, w);
      else
        failed.set(
          r.a.candidate.id,
          `failed the fact check twice: ${check.problems.slice(0, 5).join("; ")}`,
        );
    }
  }
  return { written, failed };
}
