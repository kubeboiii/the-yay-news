// Stage 4: choose ~30 stories and some reserves under the balance rules (PLAN §9).
import { OTHER_BEAT, beatWeight } from "../beats.ts";
import { prominenceBoost } from "../prominence.ts";
import { GUESTS_PER_DAY } from "../plan.ts";
import {
  CORE_SECTIONS,
  FROM_THE_WEEK,
  type Assignment,
  type Classified,
  type SectionSlug,
} from "../types.ts";

export const RULES = {
  /** Stories on a full inside page: a main story, a second story and two briefs. */
  perPage: 4,
  /** A page runs only with at least this many stories: a main story, a second and a brief. */
  minPerPage: 3,
  /** Front page: the lead and two features. */
  frontStories: 3,
  /** No topic may take more than this many stories (the "not 12 AI stories" rule). */
  topicCap: 3,
  /** No source may supply more than this many served stories… */
  sourceCap: 4,
  /** …or more than this many on one page. */
  sourcePageCap: 2,
  reservesPerPage: 1,
  maxReserves: 10,
  /** How many days of editions the beat rotation looks back over. */
  beatDays: 7,
  /** Below this, the day's pipeline gives up and the Slow News Day edition runs instead. */
  minStories: 12,
  /**
   * Source text needed to write each kind of story. A brief can be grounded on a good feed summary
   * (plus other outlets on the same story), so its bar is low.
   */
  minText: { long: 3000, main: 900, second: 450, brief: 180 },
  /** The front-page lead wants a little more to go on. */
  minLeadText: 1200,
} as const;

export class NotEnoughNewsError extends Error {}

/** Weekend pages that run one long story (PLAN §6). */
export const LONG_READS: readonly SectionSlug[] = ["deep-dive", "slow-read"];

/** The fewest stories a page runs with: one for a long read, else a main, a second and a brief. */
export const minFor = (section: SectionSlug) =>
  LONG_READS.includes(section) ? 1 : FROM_THE_WEEK.includes(section) ? 3 : RULES.minPerPage;

/**
 * How good a candidate is for a slot: the classifier's score, plus the prominence of the names it is
 * about (mainstream beats niche), and a nudge for pictures and depth.
 */
export const merit = (c: Classified) =>
  c.score +
  prominenceBoost(c) +
  // A small bonus for a good picture: a paper full of pictures looks alive.
  (c.imageUrl || c.images?.length ? 1.5 : 0) +
  Math.min(c.text.length, 4000) / 2000;

/** How often each "section/beat" ran in the last RULES.beatDays days of editions. */
export type RecentBeats = Map<string, number>;

export const beatKey = (section: string, beat: string) => `${section}/${beat}`;

/**
 * Merit within a section: a beat left out lately gets a lift (rotation), and a heavier beat
 * (data/beats.json) a small one, so the same beat does not win every day by default.
 */
export const beatMerit = (c: Classified, recent: RecentBeats) => {
  if (c.beat === OTHER_BEAT) return merit(c);
  const seen = recent.get(beatKey(c.section, c.beat)) ?? 0;
  const rotation = seen === 0 ? 1.5 : seen === 1 ? 0.75 : seen === 2 ? 0.25 : 0;
  return merit(c) + rotation + 0.25 * beatWeight(c.section, c.beat);
};

export type Selection = {
  assignments: Assignment[];
  /** Candidates not used, with the rule that left them out. */
  unused: { candidate: Classified; reason: string }[];
  /** Page keys in print order (front first; back page is implicit). */
  pages: ("front" | SectionSlug)[];
};

export type SelectOptions = {
  /** The day's own sections in print order (plan.ts lineupFor). */
  lineup?: readonly SectionSlug[];
  /** The day's two guests, then the rest of their cycle to stand in (plan.ts guestSectionsFor). */
  guests?: readonly SectionSlug[];
  fallbacks?: readonly SectionSlug[];
  recentBeats?: RecentBeats;
  /** Stories retold from the past week, already chosen, for the FROM_THE_WEEK pages. */
  weekly?: Map<SectionSlug, Classified[]>;
};

export function select(
  pool: Classified[],
  {
    lineup = CORE_SECTIONS,
    guests = [],
    fallbacks = [],
    recentBeats = new Map(),
    weekly = new Map(),
  }: SelectOptions = {},
): Selection {
  const ranked = [...pool].sort((a, b) => merit(b) - merit(a));
  const used = new Set<string>();
  const topicCount = new Map<string, number>();
  const sourceCount = new Map<string, number>();
  const assignments: Assignment[] = [];
  const whyNot = new Map<string, string>();

  const fits = (
    c: Classified,
    page: string,
    minText: number,
    onPage: Assignment[],
    relaxed = false,
  ) => {
    if (used.has(c.id)) return false;
    if (c.text.length < minText) return note(c, "not enough source text for this slot");
    // A page short of its minimum may bend the edition-wide caps (never the per-page one).
    if (!relaxed && (topicCount.get(c.topic) ?? 0) >= RULES.topicCap)
      return note(c, `topic cap: already ${RULES.topicCap} "${c.topic}" stories`);
    if (!relaxed && (sourceCount.get(c.sourceSlug) ?? 0) >= RULES.sourceCap)
      return note(c, `source cap: already ${RULES.sourceCap} from ${c.sourceName}`);
    const samePage = onPage.filter((a) => a.candidate.sourceSlug === c.sourceSlug).length;
    if (samePage >= RULES.sourcePageCap)
      return note(c, `page ${page} already has two from this source`);
    return true;
  };
  function note(c: Classified, reason: string) {
    whyNot.set(c.id, reason);
    return false;
  }
  const take = (
    c: Classified,
    page: Assignment["page"],
    slot: Assignment["slot"],
    reserve = false,
  ) => {
    used.add(c.id);
    if (!reserve) {
      topicCount.set(c.topic, (topicCount.get(c.topic) ?? 0) + 1);
      sourceCount.set(c.sourceSlug, (sourceCount.get(c.sourceSlug) ?? 0) + 1);
    }
    const a = { candidate: c, page, slot, reserve };
    assignments.push(a);
    return a;
  };

  // The inside pages come first so each section keeps its best story for its own page; the front
  // then takes the strongest remaining candidates, with a strong lead (preferably with a picture).
  const pageStories = new Map<SectionSlug, Assignment[]>();
  const slotsFor = (section: SectionSlug) =>
    LONG_READS.includes(section)
      ? ([{ slot: "feature", min: RULES.minText.long }] as const)
      : ([
          { slot: "feature", min: RULES.minText.main },
          { slot: "feature", min: RULES.minText.second },
          { slot: "brief", min: RULES.minText.brief },
          { slot: "brief", min: RULES.minText.brief },
        ] as const);
  const fill = (
    section: SectionSlug,
    pool: Classified[],
    onPage: Assignment[],
    { upTo = RULES.perPage as number, relaxed = false } = {},
  ) => {
    // Rotation: beats left out lately rank higher within the section.
    const byBeat = [...pool].sort((a, b) => beatMerit(b, recentBeats) - beatMerit(a, recentBeats));
    const slots = slotsFor(section);
    for (const s of slots.slice(onPage.length, Math.min(upTo, slots.length))) {
      // Variety first: no second story from a beat while another beat still has a candidate.
      const onBeats = new Set(onPage.map((a) => a.candidate.beat).filter((b) => b !== OTHER_BEAT));
      const fresh = byBeat.filter((x) => !onBeats.has(x.beat));
      const pick = (min: number) =>
        fresh.find((x) => fits(x, section, min, onPage, relaxed)) ??
        byBeat.find((x) => fits(x, section, min, onPage, relaxed));
      // A slot with no candidate long enough falls back to a shorter one written at brief length
      // (a long read never does: a thin deep dive is no deep dive).
      const c = pick(s.min) ?? (slots.length > 1 ? pick(RULES.minText.brief) : undefined);
      if (!c) break;
      onPage.push(take(c, section, s.slot));
    }
  };
  const pulled = (onPage: Assignment[], from: number, section: SectionSlug, why: string) => {
    for (const a of onPage.slice(from)) {
      a.candidate = { ...a.candidate, section, beat: OTHER_BEAT };
      a.candidate.reason = `${a.candidate.reason} (pulled into ${section} ${why})`;
    }
  };
  const running = new Set<SectionSlug>([...lineup, ...guests]);
  /**
   * One page: its own candidates, then its secondary sources (candidates filed elsewhere, or in a
   * section with no page today, whose source can also feed it), then, if it is still short of a
   * main story, a second and a brief, the same again with the edition-wide caps bent.
   */
  const buildPage = (section: SectionSlug) => {
    const onPage: Assignment[] = [];
    pageStories.set(section, onPage);
    fill(
      section,
      ranked.filter((c) => c.section === section),
      onPage,
    );
    const secondary = () =>
      ranked
        .filter(
          (c) => !used.has(c.id) && c.section !== section && c.sourceSections.includes(section),
        )
        // Candidates whose own section has no page today go first: otherwise they are wasted.
        .sort((a, b) => Number(running.has(a.section)) - Number(running.has(b.section)));
    let before = onPage.length;
    fill(section, secondary(), onPage);
    pulled(onPage, before, section, "from a secondary source");
    const min = minFor(section);
    if (onPage.length < min) {
      fill(
        section,
        ranked.filter((c) => c.section === section),
        onPage,
        { upTo: min, relaxed: true },
      );
      before = onPage.length;
      fill(section, secondary(), onPage, { upTo: min, relaxed: true });
      pulled(onPage, before, section, "to fill the page");
    }
    return onPage;
  };
  /** Undo a page that cannot run (a guest that gives way to the next in its cycle). */
  const release = (section: SectionSlug) => {
    for (const a of pageStories.get(section) ?? []) {
      used.delete(a.candidate.id);
      topicCount.set(a.candidate.topic, (topicCount.get(a.candidate.topic) ?? 1) - 1);
      sourceCount.set(a.candidate.sourceSlug, (sourceCount.get(a.candidate.sourceSlug) ?? 1) - 1);
      assignments.splice(assignments.indexOf(a), 1);
    }
    pageStories.delete(section);
  };

  // Pages built from the past week's editions (the weekend's Week in 10, Photo Album and Hall of
  // Fame) arrive already chosen, and count against no caps.
  for (const section of lineup) {
    const chosen = weekly.get(section);
    if (!FROM_THE_WEEK.includes(section) || !chosen) continue;
    const onPage: Assignment[] = [];
    for (const c of chosen) {
      used.add(c.id);
      const a: Assignment = { candidate: c, page: section, slot: "brief", reserve: false };
      assignments.push(a);
      onPage.push(a);
    }
    pageStories.set(section, onPage);
  }
  for (const section of lineup) if (!FROM_THE_WEEK.includes(section)) buildPage(section);
  // Two guest pages: a guest that cannot fill its page gives way to the next in its cycle.
  const guestsRun: SectionSlug[] = [];
  for (const g of [...guests, ...fallbacks]) {
    if (guestsRun.length >= GUESTS_PER_DAY) break;
    if (buildPage(g).length >= minFor(g)) guestsRun.push(g);
    else release(g);
  }
  const insideSections = [...lineup, ...guestsRun];

  // Front page: best leftover with a picture and plenty of text leads; two features follow. Only
  // stories from a section with a page today can go on the front (the "jump" must land somewhere).
  const hasPage = (c: Classified) =>
    (pageStories.get(c.section)?.length ?? 0) >= minFor(c.section) &&
    !FROM_THE_WEEK.includes(c.section);
  const front: Assignment[] = [];
  const leftovers = () => ranked.filter((c) => !used.has(c.id) && hasPage(c));
  const lead =
    leftovers().find((c) => c.imageUrl && fits(c, "front", RULES.minLeadText, front)) ??
    leftovers().find((c) => fits(c, "front", RULES.minText.main, front));
  if (lead) front.push(take(lead, "front", "lead"));
  for (let i = front.length; i < RULES.frontStories; i++) {
    const c =
      leftovers().find(
        (x) =>
          !front.some((f) => f.candidate.section === x.section) &&
          fits(x, "front", RULES.minText.second, front),
      ) ?? leftovers().find((x) => fits(x, "front", RULES.minText.second, front));
    if (c) front.push(take(c, "front", "feature"));
  }
  if (!lead) {
    // Nothing left for the front: promote the strongest page's main story.
    const best = [...pageStories.values()]
      .filter(
        (p) => p.length > RULES.minPerPage && !FROM_THE_WEEK.includes(p[0]!.page as SectionSlug),
      )
      .map((p) => p[0] as Assignment)
      .sort((a, b) => merit(b.candidate) - merit(a.candidate))[0];
    if (best) {
      best.page = "front";
      best.slot = "lead";
      front.unshift(best);
      for (const p of pageStories.values()) {
        const i = p.indexOf(best);
        if (i >= 0) p.splice(i, 1);
      }
    }
  }

  // Thin pages fold: their stories become reserves rather than a half-empty page.
  const pages: Selection["pages"] = ["front"];
  for (const section of insideSections) {
    const onPage = pageStories.get(section) ?? [];
    if (onPage.length >= minFor(section)) {
      pages.push(section);
      // The best-supported story on the page leads it; a page from the week is all short items.
      onPage.forEach((a, i) => {
        a.slot = i < 2 && !FROM_THE_WEEK.includes(section) ? "feature" : "brief";
        a.main = i === 0 && !FROM_THE_WEEK.includes(section);
      });
    } else {
      for (const a of onPage) {
        a.reserve = true;
        topicCount.set(a.candidate.topic, (topicCount.get(a.candidate.topic) ?? 1) - 1);
        sourceCount.set(a.candidate.sourceSlug, (sourceCount.get(a.candidate.sourceSlug) ?? 1) - 1);
      }
    }
  }

  // Reserves: one spare per running page, from the same section, to replace a pulled story.
  let reserves = assignments.filter((a) => a.reserve).length;
  for (const page of pages.slice(1) as SectionSlug[]) {
    if (reserves >= RULES.maxReserves) break;
    if (FROM_THE_WEEK.includes(page) || LONG_READS.includes(page)) continue;
    const spare = ranked.find(
      (c) => !used.has(c.id) && c.section === page && c.text.length >= RULES.minText.brief,
    );
    if (spare) {
      take(spare, page, "brief", true);
      reserves++;
    }
  }
  // Reserves orphaned by a folded page move to a running page so they can still stand in.
  for (const a of assignments) {
    if (a.reserve && !pages.includes(a.page))
      a.page = (pages[1] as SectionSlug | undefined) ?? "front";
  }

  const served = assignments.filter((a) => !a.reserve);
  if (!front.some((a) => a.slot === "lead") || served.length < RULES.minStories) {
    throw new NotEnoughNewsError(
      `only ${served.length} usable stories (need ${RULES.minStories} and a lead)`,
    );
  }

  const unused = ranked
    .filter((c) => !used.has(c.id))
    .map((c) => ({ candidate: c, reason: whyNot.get(c.id) ?? "not needed: pages were full" }));
  return { assignments, unused, pages };
}
