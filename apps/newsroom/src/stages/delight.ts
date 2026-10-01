import { z } from "zod";
import { withData } from "../model/prompt-data.ts";
import type { Model } from "../model/types.ts";
import { beatFor, beatsPrompt } from "../beats.ts";
import { DELIGHT_RUBRIC } from "../rubric.ts";
import { type Candidate, type Classified, type SectionSlug } from "../types.ts";
import { blocklistHit } from "./blocklist.ts";
import { mapLimit } from "./gather.ts";

export type DelightItem = {
  id: string;
  title: string;
  summary: string;
  excerpt: string;
  source: string;
  sections: SectionSlug[];
};
export type DelightInput = { items: DelightItem[] };

export const delightVerdictSchema = z.object({
  id: z.string(),
  decision: z.enum(["allow", "reject", "uncertain"]),
  reason: z.string(),
  section: z.string().optional(),
  beat: z.string().optional(),
  topic: z.string().optional(),
  score: z.number().optional(),
});
export const delightReplySchema = z.object({ results: z.array(delightVerdictSchema) });
export type DelightVerdict = z.infer<typeof delightVerdictSchema>;

export type DelightOutcome = {
  allowed: Classified[];
  rejected: { candidate: Candidate; stage: "blocklist" | "delight"; reason: string }[];
};

/** Candidates per classifier call: one call for a typical day, a few on a busy one. */
export const DELIGHT_BATCH = 30;
/** Classifier calls in flight at once. */
export const DELIGHT_CONCURRENCY = 3;

/** The deterministic half: the blocklist over headline, summary and the full source text. */
export function blocklistFilter(candidates: Candidate[]) {
  const clean: Candidate[] = [];
  const rejected: DelightOutcome["rejected"] = [];
  for (const c of candidates) {
    const hit = blocklistHit(`${c.title}\n${c.summary}`) ?? (c.text ? blocklistHit(c.text) : null);
    if (hit) {
      rejected.push({
        candidate: c,
        stage: "blocklist",
        reason: `blocklist (${hit.group}): "${hit.word}"`,
      });
    } else clean.push(c);
  }
  return { clean, rejected };
}

/**
 * The delight check (PLAN §9, stage 2): blocklist first, then the model classifier against the
 * rubric, batched. Anything the model is unsure of, forgets to mention, or files under a section the
 * source cannot feed is rejected.
 */
export async function delightCheck(model: Model, candidates: Candidate[]): Promise<DelightOutcome> {
  const { clean, rejected } = blocklistFilter(candidates);
  const allowed: Classified[] = [];
  let failedBatches = 0;
  let lastError = null as Error | null;

  const groups: Candidate[][] = [];
  for (let i = 0; i < clean.length; i += DELIGHT_BATCH)
    groups.push(clean.slice(i, i + DELIGHT_BATCH));
  const batches = groups.length;
  // Batches run a few at a time (a big day is 30+ batches); results keep the batch order.
  const outcomes: { batch: Candidate[]; reply: z.infer<typeof delightReplySchema> | null }[] = [];
  await mapLimit(
    groups.map((batch, i) => ({ batch, i })),
    DELIGHT_CONCURRENCY,
    async ({ batch, i }) => {
      const input: DelightInput = {
        items: batch.map((c) => ({
          id: c.id,
          title: c.title,
          summary: c.summary.slice(0, 400),
          excerpt: c.text.slice(0, 700),
          source: c.sourceName,
          sections: c.sourceSections,
        })),
      };
      const prompt = withData(
        `${DELIGHT_RUBRIC}\n${beatsPrompt()}\n\nClassify every item below. Return one result per item id, in the same order.`,
        input,
      );
      // A batch that fails twice is rejected on its own (a false reject costs nothing); only when
      // every batch fails does the stage fail, so one slow call cannot sink the day's edition.
      let reply: z.infer<typeof delightReplySchema> | null = null;
      for (let attempt = 0; attempt < 2 && !reply; attempt++) {
        try {
          reply = await model.complete(prompt, {
            tier: "cheap",
            schema: delightReplySchema,
            task: "delight",
          });
        } catch (e) {
          lastError = e as Error;
        }
      }
      outcomes[i] = { batch, reply };
    },
  );
  for (const { batch, reply } of outcomes) {
    if (!reply) {
      failedBatches++;
      for (const c of batch)
        rejected.push({
          candidate: c,
          stage: "delight",
          reason: "classifier unavailable for this batch",
        });
      continue;
    }
    const byId = new Map(reply.results.map((r) => [r.id, r]));
    for (const c of batch) {
      const v = byId.get(c.id);
      if (!v) {
        rejected.push({ candidate: c, stage: "delight", reason: "classifier gave no verdict" });
      } else if (v.decision !== "allow") {
        rejected.push({ candidate: c, stage: "delight", reason: `${v.decision}: ${v.reason}` });
      } else {
        const section = (c.sourceSections as string[]).includes(v.section ?? "")
          ? (v.section as SectionSlug)
          : c.sourceSections[0];
        if (!section) {
          rejected.push({ candidate: c, stage: "delight", reason: "no section to run in" });
          continue;
        }
        allowed.push({
          ...c,
          section,
          beat: beatFor(section, v.beat),
          topic: (v.topic ?? "general").toLowerCase().trim() || "general",
          score: Math.max(1, Math.min(10, Math.round(v.score ?? 5))),
          reason: v.reason,
        });
      }
    }
  }
  if (batches && failedBatches === batches)
    throw lastError ?? new Error("every classifier batch failed");
  return { allowed, rejected };
}
