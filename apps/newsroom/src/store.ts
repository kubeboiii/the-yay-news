// Where the newsroom reads and writes. The Prisma store is the real one; the memory store backs
// tests (and nothing else), so the pipeline can run end to end without a database.
import { sections as SECTION_LIST } from "@repo/db/sections";
import type { Section } from "@repo/shared";
import type { Recent } from "./stages/dedup.ts";
import type { WeekStory } from "./stages/weekly.ts";
import { addDays } from "./text.ts";
import type { CandidateRecord, EditionDraft, LogEntry, SourceDef } from "./types.ts";

export const SECTIONS: Section[] = SECTION_LIST.map((s) => ({ ...s }));

export type ExistingEdition = { id: string; status: string; issueNumber: number; kind: string };

export type RunResult = {
  status: "succeeded" | "failed" | "slow_news_day" | "skipped";
  model: string | null;
  log: LogEntry[];
  candidates: CandidateRecord[];
  editionId: string | null;
};

export interface Store {
  /** Upsert the allowlist; returns the sources that are enabled. */
  syncSources(defs: SourceDef[]): Promise<SourceDef[]>;
  editionOn(date: string): Promise<ExistingEdition | null>;
  /** Issue numbers run continuously: the latest earlier issue plus the days since it. */
  issueNumberFor(date: string): Promise<number>;
  /** Stories (headline and source URL) from editions in the `days` before `date`. */
  recentStories(date: string, days: number): Promise<Recent[]>;
  /** Served stories from editions in the `days` before `date` (the weekend's week-in-review pages). */
  weekStories(date: string, days: number): Promise<WeekStory[]>;
  /** How often each "section/beat" ran in editions in the `days` before `date`. */
  recentBeats(date: string, days: number): Promise<Map<string, number>>;
  startRun(date: string, dryRun: boolean): Promise<string>;
  finishRun(runId: string, result: RunResult): Promise<void>;
  /**
   * Write an edition, replacing an unpublished one on the same date (or a published one only when
   * `replacePublished` is set). Returns its id.
   */
  saveEdition(
    draft: EditionDraft,
    runId: string,
    options?: { replacePublished?: boolean },
  ): Promise<string>;
}

// ——— In memory (tests) ———

export class MemoryStore implements Store {
  editions: (EditionDraft & { id: string })[] = [];
  runs = new Map<string, { date: string; dryRun: boolean; result?: RunResult }>();
  sources: SourceDef[] = [];
  recent: Recent[] = [];
  week: WeekStory[] = [];
  beats: { date: string; section: string; beat: string }[] = [];

  async syncSources(defs: SourceDef[]) {
    this.sources = defs;
    return defs;
  }
  async editionOn(date: string) {
    const e = this.editions.find((x) => x.date === date);
    return e ? { id: e.id, status: e.status, issueNumber: e.issueNumber, kind: e.kind } : null;
  }
  async issueNumberFor(date: string) {
    const earlier = this.editions
      .filter((e) => e.date < date)
      .sort((a, b) => b.date.localeCompare(a.date))[0];
    if (!earlier) return 1;
    return (
      earlier.issueNumber + Math.round((Date.parse(date) - Date.parse(earlier.date)) / 86_400_000)
    );
  }
  async recentStories(date: string, days: number) {
    const from = addDays(date, -days);
    return this.recent.filter((r) => r.date >= from && r.date < date);
  }
  async weekStories(date: string, days: number) {
    const from = addDays(date, -days);
    return this.week.filter((s) => s.date >= from && s.date < date);
  }
  async recentBeats(date: string, days: number) {
    const from = addDays(date, -days);
    return countBeats(this.beats.filter((b) => b.date >= from && b.date < date));
  }
  async startRun(date: string, dryRun: boolean) {
    const id = `run-${this.runs.size + 1}`;
    this.runs.set(id, { date, dryRun });
    return id;
  }
  async finishRun(runId: string, result: RunResult) {
    const run = this.runs.get(runId);
    if (run) run.result = result;
  }
  async saveEdition(draft: EditionDraft, _runId: string, { replacePublished = false } = {}) {
    if (
      this.editions.some((e) => e.date === draft.date && e.status === "published") &&
      !replacePublished
    ) {
      throw new Error(`edition ${draft.date} is already published`);
    }
    this.editions = this.editions.filter((e) => e.date !== draft.date);
    const id = `edition-${draft.issueNumber}`;
    this.editions.push({ ...draft, id });
    return id;
  }
}

/** The run log's record of the beats an edition printed (read back for beat rotation). */
export const BEATS_STAGE = "beats";
export type BeatRecord = { slug: string; section: string; beat: string };

function countBeats(rows: { section: string; beat: string }[]) {
  const out = new Map<string, number>();
  for (const r of rows)
    out.set(`${r.section}/${r.beat}`, (out.get(`${r.section}/${r.beat}`) ?? 0) + 1);
  return out;
}

// ——— Postgres, through @repo/db ———

type Db = typeof import("@repo/db");

/** Loaded lazily: @repo/db needs DATABASE_URL at import time, and tests may not have one. */
async function db(): Promise<Db> {
  return import("@repo/db");
}

const asDate = (d: string) => new Date(`${d}T00:00:00.000Z`);
const isoDate = (d: Date) => d.toISOString().slice(0, 10);

export class PrismaStore implements Store {
  async syncSources(defs: SourceDef[]) {
    const { prisma } = await db();
    for (const s of defs) {
      await prisma.source.upsert({
        where: { slug: s.slug },
        // `enabled` is left alone on update: switching a source off in the database sticks.
        update: { name: s.name, url: s.url, type: s.type, sections: s.sections },
        create: { slug: s.slug, name: s.name, url: s.url, type: s.type, sections: s.sections },
      });
    }
    const enabled = new Set(
      (await prisma.source.findMany({ where: { enabled: true }, select: { slug: true } })).map(
        (s) => s.slug,
      ),
    );
    return defs.filter((d) => enabled.has(d.slug));
  }

  async editionOn(date: string) {
    const { prisma } = await db();
    const e = await prisma.edition.findUnique({ where: { date: asDate(date) } });
    return e ? { id: e.id, status: e.status, issueNumber: e.issueNumber, kind: e.kind } : null;
  }

  async issueNumberFor(date: string) {
    const { prisma } = await db();
    const earlier = await prisma.edition.findFirst({
      where: { date: { lt: asDate(date) } },
      orderBy: { date: "desc" },
    });
    const n = earlier
      ? earlier.issueNumber +
        Math.round((asDate(date).getTime() - earlier.date.getTime()) / 86_400_000)
      : 1;
    // Never collide with an issue already filed (e.g. a later date built first).
    const clash = await prisma.edition.findUnique({ where: { issueNumber: n } });
    if (clash && isoDate(clash.date) !== date) {
      const max = await prisma.edition.aggregate({ _max: { issueNumber: true } });
      return (max._max.issueNumber ?? 0) + 1;
    }
    return n;
  }

  async recentStories(date: string, days: number) {
    const { prisma } = await db();
    const stories = await prisma.story.findMany({
      where: { edition: { date: { gte: asDate(addDays(date, -days)), lt: asDate(date) } } },
      select: { headline: true, sourceUrl: true, edition: { select: { date: true } } },
    });
    return stories.map((s) => ({
      headline: s.headline,
      sourceUrl: s.sourceUrl,
      date: isoDate(s.edition.date),
    }));
  }

  async weekStories(date: string, days: number) {
    const { prisma } = await db();
    const stories = await prisma.story.findMany({
      where: {
        isReserve: false,
        edition: {
          date: { gte: asDate(addDays(date, -days)), lt: asDate(date) },
          status: { in: ["published", "scheduled"] },
        },
      },
      include: {
        edition: { select: { date: true, issueNumber: true } },
        page: { select: { layout: true, section: { select: { slug: true } } } },
        section: { select: { slug: true } },
        images: { orderBy: { order: "asc" } },
      },
    });
    return stories.map((s): WeekStory => ({
      slug: s.slug,
      issueNumber: s.edition.issueNumber,
      date: isoDate(s.edition.date),
      page: s.page.section?.slug ?? s.page.layout,
      section: s.section.slug,
      slot: s.slot,
      order: s.order,
      kicker: s.kicker,
      headline: s.headline,
      dek: s.dek,
      body: s.body,
      sourceName: s.sourceName,
      images: s.images.map(({ url, alt, credit, licence, licenceUrl, kind }) => ({
        url,
        alt,
        credit,
        licence,
        licenceUrl,
        kind,
      })),
    }));
  }

  async recentBeats(date: string, days: number) {
    const { prisma } = await db();
    const runs = await prisma.pipelineRun.findMany({
      where: {
        editionId: { not: null },
        dryRun: false,
        date: { gte: asDate(addDays(date, -days)), lt: asDate(date) },
      },
      select: { log: true },
    });
    const rows: BeatRecord[] = [];
    for (const r of runs) {
      const log = Array.isArray(r.log) ? (r.log as LogEntry[]) : [];
      for (const e of log)
        if (e.stage === BEATS_STAGE && Array.isArray(e.data))
          rows.push(...(e.data as BeatRecord[]));
    }
    return countBeats(rows);
  }

  async startRun(date: string, dryRun: boolean) {
    const { prisma } = await db();
    return (await prisma.pipelineRun.create({ data: { date: asDate(date), dryRun } })).id;
  }

  async finishRun(runId: string, result: RunResult) {
    const { prisma } = await db();
    const sources = new Map(
      (await prisma.source.findMany({ select: { id: true, slug: true } })).map((s) => [
        s.slug,
        s.id,
      ]),
    );
    await prisma.pipelineRun.update({
      where: { id: runId },
      data: {
        status: result.status,
        model: result.model,
        finishedAt: new Date(),
        editionId: result.editionId,
        log: JSON.parse(JSON.stringify(result.log)),
      },
    });
    const rows = result.candidates.map((r) => ({
      runId,
      sourceId: sources.get(r.candidate.sourceSlug) ?? null,
      url: r.candidate.url.slice(0, 2000),
      title: r.candidate.title.slice(0, 500),
      summary: r.candidate.summary.slice(0, 1000),
      imageUrl: r.candidate.imageUrl,
      fetchedAt: r.candidate.fetchedAt,
      decision: r.decision,
      decisionReason: r.reason,
      stage: r.stage,
      section: r.section,
      storySlug: r.storySlug,
    }));
    for (let i = 0; i < rows.length; i += 500) {
      await prisma.candidate.createMany({ data: rows.slice(i, i + 500), skipDuplicates: true });
    }
  }

  async saveEdition(draft: EditionDraft, runId: string, { replacePublished = false } = {}) {
    const { prisma } = await db();
    const sectionIds = new Map(
      (await prisma.section.findMany({ select: { id: true, slug: true } })).map((s) => [
        s.slug,
        s.id,
      ]),
    );
    const sectionId = (slug: string) => {
      const id = sectionIds.get(slug);
      if (!id) throw new Error(`section "${slug}" is not in the database (run the seed)`);
      return id;
    };
    return prisma.$transaction(async (tx) => {
      const existing = await tx.edition.findUnique({ where: { date: asDate(draft.date) } });
      if (existing?.status === "published" && !replacePublished) {
        throw new Error(`edition ${draft.date} is already published; refusing to replace it`);
      }
      if (existing) await tx.edition.delete({ where: { id: existing.id } });
      const edition = await tx.edition.create({
        data: {
          date: asDate(draft.date),
          issueNumber: draft.issueNumber,
          volume: draft.volume,
          status: draft.status,
          kind: draft.kind,
          design: draft.design,
          colourway: draft.colourway,
          guestSectionId: draft.guestSection ? sectionId(draft.guestSection) : null,
          features: {
            create: draft.features.map((f) => ({
              type: f.type,
              order: f.order,
              content: f.content,
            })),
          },
          puzzles: {
            create: draft.puzzles.map((p) => ({
              type: p.type,
              order: p.order,
              data: p.data as object,
              solution: p.solution as object,
            })),
          },
        },
      });
      for (const page of draft.pages) {
        await tx.page.create({
          data: {
            editionId: edition.id,
            order: page.order,
            layout: page.layout,
            sectionId: page.section ? sectionId(page.section) : null,
            stories: {
              create: page.stories.map((s, i) => ({
                editionId: edition.id,
                order: i + 1,
                slot: s.slot,
                slug: s.slug,
                sectionId: sectionId(s.section),
                kicker: s.kicker,
                headline: s.headline,
                dek: s.dek,
                body: s.body,
                readMinutes: s.readMinutes,
                sticker: s.sticker,
                sourceUrl: s.sourceUrl,
                sourceName: s.sourceName,
                embedUrl: s.embedUrl,
                isReserve: s.isReserve,
                images: { create: s.images.map((img, order) => ({ ...img, order })) },
              })),
            },
          },
        });
      }
      await tx.pipelineRun.update({ where: { id: runId }, data: { editionId: edition.id } });
      return edition.id;
    });
  }
}
