// The automated newsroom (PLAN §9): gather → delight check → dedup → select → write → illustrate →
// features → lay out and publish. Every decision about every candidate is recorded on the run, and
// if the day's news cannot make an edition, the Slow News Day edition runs instead.
import { draftProblems } from "./contract.ts";
import type { FallbackModel } from "./model/index.ts";
import type { Model } from "./model/types.ts";
import { designFor, guestSectionsFor, lineupFor, WEEKEND_FEEDS } from "./plan.ts";
import { type SlowNewsDayBuilder, slowNewsDay } from "./slow-news-day.ts";
import { SOURCES } from "./sources.ts";
import { corroborate, dedup } from "./stages/dedup.ts";
import { blocklistFilter, delightCheck } from "./stages/delight.ts";
import { generateFeatures, puzzlesOf } from "./stages/features.ts";
import { type Http, fetchArticles, gather, http } from "./stages/gather.ts";
import {
  PICTURES,
  type Presser,
  illustrate,
  noPress,
  pressWithPython,
} from "./stages/illustrate.ts";
import { layOut } from "./stages/layout.ts";
import { writeLetters } from "./stages/letters.ts";
import { GENERATED_GUESTS, NotEnoughNewsError, RULES, select } from "./stages/select.ts";
import { weeklyPicks } from "./stages/weekly.ts";
import { type SectionInfo, writeStories } from "./stages/write.ts";
import { BEATS_STAGE, type BeatRecord, SECTIONS, type Store } from "./store.ts";
import {
  FROM_THE_WEEK,
  guestSectionsOf,
  type Candidate,
  type CandidateRecord,
  type Decision,
  type EditionDraft,
  type LogEntry,
  type SectionSlug,
  type SourceDef,
} from "./types.ts";

export type RunOptions = {
  date: string;
  store: Store;
  model: Model;
  dryRun?: boolean;
  /**
   * Rebuild an edition that already exists for the date, published or not. Without it, an existing
   * edition is always left alone.
   */
  replace?: boolean;
  /** Skip the news entirely and file the Slow News Day edition (the admin's "replace" button). */
  forceSlowNewsDay?: boolean;
  sources?: SourceDef[];
  /** Replace the gather stage entirely (tests). */
  gatherer?: () => Promise<Candidate[]>;
  get?: Http;
  /** Where the reader lives: the weekend's retellings link back to their stories there. */
  siteUrl?: string;
  press?: Presser;
  buildSlowNewsDay?: SlowNewsDayBuilder;
  /** Attempts per stage before giving up on it. */
  attempts?: number;
  now?: Date;
  onLog?: (entry: LogEntry) => void;
};

export type RunOutcome = {
  status: "succeeded" | "failed" | "slow_news_day" | "skipped";
  runId: string | null;
  editionId: string | null;
  draft: EditionDraft | null;
  log: LogEntry[];
  records: CandidateRecord[];
};

/** How far back dedup looks (PLAN: the last 14 days of editions). */
export const DEDUP_DAYS = 14;

export async function runEdition(o: RunOptions): Promise<RunOutcome> {
  const log: LogEntry[] = [];
  const say = (
    stage: string,
    message: string,
    level: LogEntry["level"] = "info",
    data?: unknown,
  ) => {
    const entry = {
      at: new Date().toISOString(),
      stage,
      level,
      message,
      ...(data === undefined ? {} : { data }),
    };
    log.push(entry);
    o.onLog?.(entry);
  };
  const attempts = o.attempts ?? 3;
  const records = new Map<string, CandidateRecord>();
  const decide = (
    c: Candidate,
    decision: Decision,
    stage: string,
    reason: string | null,
    extra: Partial<CandidateRecord> = {},
  ) => {
    const r = records.get(c.id) ?? {
      candidate: c,
      decision,
      reason,
      stage,
      section: null,
      storySlug: null,
    };
    records.set(c.id, { ...r, decision, stage, reason, ...extra });
  };

  /** Run a stage, retrying with a short back-off. */
  async function stage<T>(name: string, fn: () => Promise<T>): Promise<T> {
    for (let i = 1; ; i++) {
      try {
        return await fn();
      } catch (e) {
        if (e instanceof NotEnoughNewsError || i >= attempts) throw e;
        say(name, `attempt ${i} failed: ${(e as Error).message}; retrying`, "warn");
        await new Promise((r) =>
          setTimeout(
            r,
            Math.min(30_000, 1000 * 2 ** i) * (process.env.NODE_ENV === "test" ? 0 : 1),
          ),
        );
      }
    }
  }

  const existing = await o.store.editionOn(o.date);
  if (existing && !o.replace) {
    say(
      "start",
      `an edition for ${o.date} already exists (issue ${existing.issueNumber}, ${existing.status}); leaving it alone`,
    );
    return {
      status: "skipped",
      runId: null,
      editionId: existing.id,
      draft: null,
      log,
      records: [],
    };
  }

  const runId = await o.store.startRun(o.date, o.dryRun ?? false);
  const issueNumber = existing?.issueNumber ?? (await o.store.issueNumberFor(o.date));
  const { design, colourway } = designFor(o.date);
  const lineup = lineupFor(o.date);
  const { guests, fallbacks } = guestSectionsFor(o.date);
  say(
    "start",
    `building issue ${issueNumber} for ${o.date}: ${design} / ${colourway}, pages ${lineup.join(", ")}, guests ${guests.join(" and ")}${o.dryRun ? " (dry run)" : ""}`,
  );

  let draft: EditionDraft | null = null;
  let status: RunOutcome["status"] = "succeeded";
  try {
    if (o.forceSlowNewsDay) throw new Error("the Slow News Day edition was asked for");
    draft = await build();
  } catch (e) {
    say("pipeline", `could not build a regular edition: ${(e as Error).message}`, "error");
    const fallback = await slowNewsDay(o.date, issueNumber, o.buildSlowNewsDay).then(
      (d) => ({ d, problems: draftProblems(d) }),
      (e2: Error) => ({ d: null, problems: [e2.message] }),
    );
    if (fallback.d && !fallback.problems.length) {
      draft = fallback.d;
      status = "slow_news_day";
      say(
        "slow-news-day",
        `filed the Slow News Day edition instead (${draft.pages.flatMap((p) => p.stories).length} evergreen stories)`,
        "warn",
      );
    } else {
      say(
        "slow-news-day",
        `the Slow News Day edition failed too: ${fallback.problems.join("; ")}`,
        "error",
      );
      status = "failed";
    }
  }

  let editionId: string | null = null;
  if (draft && !o.dryRun) {
    try {
      editionId = await o.store.saveEdition(draft, runId, { replacePublished: o.replace });
      say(
        "publish",
        `filed issue ${draft.issueNumber} as ${draft.status} (${draft.kind}); it releases at 07:00 local time on ${draft.date}`,
      );
      if (status === "succeeded") {
        for (const r of records.values()) if (r.decision === "selected") r.decision = "published";
      }
    } catch (e) {
      say("publish", `could not save the edition: ${(e as Error).message}`, "error");
      status = "failed";
    }
  } else if (draft) say("publish", "dry run: nothing written");

  const served = (o.model as Partial<FallbackModel>).served;
  const modelName = served?.size ? [...served].join(", ") : o.model.name;
  await o.store.finishRun(runId, {
    status,
    model: modelName,
    log,
    candidates: [...records.values()],
    editionId,
  });
  return { status, runId, editionId, draft, log, records: [...records.values()] };

  async function build(): Promise<EditionDraft> {
    // 1. Gather.
    const sources = await o.store.syncSources(o.sources ?? SOURCES);
    const candidates = await stage("gather", async () => {
      if (o.gatherer) return o.gatherer();
      const g = await gather(sources, { date: o.date, get: o.get ?? http, now: o.now });
      const broken = g.sources.filter((s) => s.error);
      say(
        "gather",
        `${g.candidates.length} items from ${g.sources.length - broken.length}/${g.sources.length} sources`,
        "info",
        g.sources,
      );
      if (!g.candidates.length) throw new Error("no source returned anything");
      return g.candidates;
    });
    for (const c of candidates) decide(c, "pending", "gather", null);

    // Only sections with a page today can take a story. At weekends the daily sections' sources
    // feed the weekend pages instead (plan.ts WEEKEND_FEEDS).
    const today = new Set<SectionSlug>([
      ...lineup.filter((x) => !FROM_THE_WEEK.includes(x)),
      ...guests,
      ...fallbacks,
    ]);
    for (const c of candidates) {
      const widened = [
        ...c.sourceSections,
        ...c.sourceSections.flatMap((x) => WEEKEND_FEEDS[x] ?? []),
      ];
      c.sourceSections = [...new Set(widened)].filter((x) => today.has(x));
    }
    for (const c of candidates.filter((x) => !x.sourceSections.length))
      decide(c, "not_selected", "gather", "none of its sections has a page today");
    candidates.splice(0, candidates.length, ...candidates.filter((c) => c.sourceSections.length));

    // 2. The delight check: blocklist on headlines first (cheap), then fetch text for the rest,
    // then blocklist again over the full text and the model classifier (inside delightCheck).
    const first = blocklistFilter(candidates);
    for (const r of first.rejected) decide(r.candidate, "rejected_blocklist", "delight", r.reason);
    const unfetched = await fetchArticles(first.clean, { get: o.get ?? http, now: o.now });
    const failedFetch = new Set(unfetched.map((u) => u.candidate.id));
    for (const u of unfetched) decide(u.candidate, "not_selected", "gather", u.reason);
    const fetched = first.clean.filter((c) => !failedFetch.has(c.id) && c.text.length > 0);
    say(
      "gather",
      `article text for ${fetched.length} of ${first.clean.length} candidates that passed the headline blocklist`,
    );

    const checked = await stage("delight", () => delightCheck(o.model, fetched));
    for (const r of checked.rejected) {
      decide(
        r.candidate,
        r.stage === "blocklist" ? "rejected_blocklist" : "rejected_delight",
        "delight",
        r.reason,
      );
    }
    say(
      "delight",
      `${checked.allowed.length} allowed, ${checked.rejected.length + first.rejected.length} rejected`,
    );

    // 3. Dedup against the last two weeks and within the batch.
    const recent = await o.store.recentStories(o.date, DEDUP_DAYS);
    const { kept: unique, duplicates } = dedup(checked.allowed, recent);
    // Other outlets on the same story back up thin (e.g. paywalled) tellings, and lend pictures.
    const kept = corroborate(unique, duplicates);
    for (const d of duplicates) decide(d.item, "duplicate", "dedup", d.reason);
    say(
      "dedup",
      `${kept.length} unique, ${duplicates.length} duplicates (checked against ${recent.length} recent stories)`,
    );

    // 4. Select, spreading each page across its beats and rotating in beats left out lately.
    const site = o.siteUrl ?? process.env.NEWSROOM_SITE_URL ?? "http://localhost:3108";
    const recentBeats = await o.store.recentBeats(o.date, RULES.beatDays);
    const weekPages = lineup.filter((x) => FROM_THE_WEEK.includes(x));
    const { picks: weekly, awards } = weekPages.length
      ? weeklyPicks(lineup, await o.store.weekStories(o.date, 7), {
          date: o.date,
          site,
          now: o.now,
        })
      : { picks: new Map(), awards: new Map<string, string>() };
    for (const [page, picks] of weekly)
      say("select", `${page}: ${picks.length} stories from the past week's editions`);
    const selection = select(kept, { lineup, guests, fallbacks, recentBeats, weekly });
    for (const u of selection.unused)
      decide(u.candidate, "not_selected", "select", u.reason, { section: u.candidate.section });
    for (const a of selection.assignments) {
      decide(
        a.candidate,
        a.reserve ? "reserve" : "selected",
        "select",
        `${a.page} / ${a.slot}${a.reserve ? " (reserve)" : ""}; ${a.candidate.reason}`,
        { section: a.candidate.section },
      );
    }
    const guestRuns = selection.pages.filter((p) => p !== "front" && !lineup.includes(p));
    say(
      "select",
      `${selection.assignments.filter((a) => !a.reserve).length} stories and ${selection.assignments.filter((a) => a.reserve).length} reserves on ${selection.pages.length} pages; guests ${guestRuns.join(" and ") || "none"}`,
    );

    // 5. Write, with the fact check and one rewrite.
    const info = new Map<string, SectionInfo>(
      SECTIONS.map((s) => [s.slug, { slug: s.slug as SectionSlug, name: s.name, voice: s.voice }]),
    );
    const { written, failed } = await stage("write", () =>
      writeStories(o.model, selection.assignments, info),
    );
    for (const [id, reason] of failed) {
      const c = selection.assignments.find((a) => a.candidate.id === id)?.candidate;
      if (c) decide(c, "failed_fact_check", "write", reason, { section: c.section });
    }
    say("write", `${written.size} written and fact-checked, ${failed.size} failed`);
    // The Hall of Fame's kickers are its awards.
    for (const [id, award] of awards) {
      const w = written.get(id);
      if (w) w.kicker = award;
    }

    const laid = layOut(selection, written);
    for (const [id, note] of laid.notes) {
      const r = records.get(id);
      if (r && r.decision !== "failed_fact_check") r.reason = `${r.reason ?? ""}; ${note}`;
    }
    for (const { story, assignment } of laid.placed.values()) {
      const reason = records.get(assignment.candidate.id)?.reason ?? null;
      decide(assignment.candidate, story.isReserve ? "reserve" : "selected", "layout", reason, {
        section: story.section,
        storySlug: story.slug,
      });
    }
    // A generated guest (Letters & Classifieds) is written now, from the stories just laid out.
    for (const section of selection.pages.filter((p) =>
      GENERATED_GUESTS.includes(p as SectionSlug),
    ) as SectionSlug[]) {
      const printed = laid.pages
        .flatMap((p) => p.stories)
        .filter((s) => !s.isReserve && s.candidateId && laid.placed.has(s.candidateId));
      const letters = await writeLetters(o.model, {
        date: o.date,
        issueNumber,
        site,
        stories: printed.map((s) => ({
          slug: s.slug,
          headline: s.headline,
          section: s.section,
          sourceText: laid.placed.get(s.candidateId as string)!.assignment.candidate.text,
        })),
        takenSlugs: new Set(laid.pages.flatMap((p) => p.stories.map((s) => s.slug))),
      });
      if (letters.problems.length)
        say("write", `${section}: ${letters.problems.join("; ")}`, "warn");
      if (!letters.stories.length) continue;
      // Its page goes where the selection put it: before the next page that made it into print.
      const after = selection.pages.slice(selection.pages.indexOf(section) + 1);
      let at = laid.pages.findIndex((p) => p.section !== null && after.includes(p.section));
      if (at < 0) at = laid.pages.length - 1;
      laid.pages.splice(at, 0, { order: 0, layout: "guest", section, stories: letters.stories });
      laid.pages.forEach((p, i) => (p.order = i + 1));
      say("write", `${section}: ${letters.stories.length} made up from today's stories`);
    }
    const beats: BeatRecord[] = [];
    for (const { story, assignment } of laid.placed.values()) {
      story.beat = assignment.candidate.beat;
      if (!story.isReserve)
        beats.push({ slug: story.slug, section: story.section, beat: story.beat });
    }
    for (const p of laid.pages)
      for (const s of p.stories)
        if (!s.candidateId && s.beat)
          beats.push({ slug: s.slug, section: s.section, beat: s.beat });
    say(
      BEATS_STAGE,
      `${beats.length} stories across ${new Set(beats.map((b) => `${b.section}/${b.beat}`)).size} beats`,
      "info",
      beats,
    );
    const servedCount = laid.pages.flatMap((p) => p.stories).filter((s) => !s.isReserve).length;
    if (servedCount < 12)
      throw new NotEnoughNewsError(`only ${servedCount} stories survived writing`);

    // 6. Illustrate.
    const press = o.dryRun ? noPress : (o.press ?? pressWithPython);
    const all = laid.pages.flatMap((p) => p.stories);
    // Served stories claim pictures first, front page first.
    // Retellings of the week's stories keep the pictures they were printed with.
    const preset = (s: (typeof all)[number]) =>
      laid.placed.get(s.candidateId as string)?.assignment.candidate.presetImages;
    // Stories made up in-house (Letters & Classifieds) have no source picture to press.
    const sourced = (s: (typeof all)[number]) => !!s.candidateId && laid.placed.has(s.candidateId);
    const order = [...all.filter((s) => !s.isReserve), ...all.filter((s) => s.isReserve)].filter(
      (s) => sourced(s) && !preset(s),
    );
    const pictures = await stage("illustrate", () =>
      illustrate(
        order.map((s) => ({
          slug: s.slug,
          headline: s.headline,
          candidate: laid.placed.get(s.candidateId as string)!.assignment.candidate,
          // One picture each; only the front lead and first front feature may carry extras.
          max:
            s.slot === "lead"
              ? PICTURES.lead
              : s.slug === laid.pages[0]?.stories.find((x) => x.slot === "feature")?.slug
                ? PICTURES.frontFeature
                : PICTURES.story,
        })),
        { issue: issueNumber, press },
      ),
    );
    for (const s of all) s.images = preset(s) ?? pictures.get(s.slug)?.images ?? [];
    const servedAll = all.filter((s) => !s.isReserve).length;
    const servedPics = all.filter((s) => !s.isReserve && s.images.length).length;
    say(
      "illustrate",
      `${all.filter((s) => s.images.length).length} of ${all.length} stories have a picture, ${Math.round((100 * servedPics) / Math.max(1, servedAll))}% of served stories (${all.reduce((n, s) => n + s.images.length, 0)} pictures)`,
      "info",
      Object.fromEntries([...pictures].map(([k, v]) => [k, v.note])),
    );

    // 7. Features and puzzles.
    const servedStories = all.filter((s) => !s.isReserve);
    const { features, problems } = await stage("features", () =>
      generateFeatures(
        o.model,
        o.date,
        servedStories.filter(sourced).map((s) => ({
          id: s.slug,
          headline: s.headline,
          section: s.section,
          sourceText: laid.placed.get(s.candidateId as string)!.assignment.candidate.text,
        })),
      ),
    );
    if (problems.length) say("features", `adjusted: ${problems.join("; ")}`, "warn");
    const puzzles = puzzlesOf(
      o.date,
      servedStories.map((s) => s.headline),
    );

    // 8. Lay out (done) and check the whole edition against the contracts.
    const d: EditionDraft = {
      date: o.date,
      issueNumber,
      volume: 1,
      status: "scheduled",
      kind: "regular",
      design,
      colourway,
      guestSections: guestSectionsOf(laid.pages),
      pages: laid.pages,
      features,
      puzzles,
    };
    const problemsWithDraft = draftProblems(d);
    if (problemsWithDraft.length)
      throw new Error(`the edition failed its checks: ${problemsWithDraft.join("; ")}`);
    const words = servedStories.reduce((n, s) => n + s.body.join(" ").split(/\s+/).length, 0);
    say(
      "layout",
      `${servedStories.length} stories, ${words} words, ${laid.pages.length} pages, ${features.length} features, ${puzzles.length} puzzles`,
      "info",
      laid.pages.map((p) => ({
        page: p.section ?? p.layout,
        stories: p.stories.filter((s) => !s.isReserve).length,
        words: p.stories
          .filter((s) => !s.isReserve)
          .reduce((n, s) => n + s.body.join(" ").split(/\s+/).length, 0),
        images: p.stories.filter((s) => !s.isReserve).map((s) => s.images.length),
      })),
    );
    const missing = lineup.filter((c) => !laid.pages.some((p) => p.section === c));
    if (missing.length) say("layout", `no page today for: ${missing.join(", ")}`, "warn");
    const guestPages = laid.pages.filter((p) => p.layout === "guest").map((p) => p.section);
    if (guestPages.length < 2)
      say("layout", `only ${guestPages.length} guest page(s) could be filled`, "warn");
    else if (guestPages.join() !== guests.join())
      say(
        "layout",
        `guests ${guests.join(" and ")} gave way to ${guestPages.join(" and ")}`,
        "warn",
      );
    return d;
  }
}
