// Seeds the sections and the hand-made sample editions (PLAN §11, Phase 2), with back-page puzzles
// generated for each date by @repo/puzzles. Idempotent: it replaces the sample editions (by issue
// number) and upserts the sections, leaving newsroom-built editions untouched. Everything is
// validated against the shared contracts before anything is written, so a bad edit fails without
// touching the database.
import { existsSync } from "node:fs";
import path from "node:path";
import { puzzlesFor } from "@repo/puzzles";
import {
  editionDesignProblems,
  featureSchema,
  slugSchema,
  solvedPuzzleSchema,
  storySlotSchema,
} from "@repo/shared";
import { prisma, type Prisma } from "../src/index.js";
import { issue38 } from "./seed-data/editions/issue-38.ts";
import { issue39 } from "./seed-data/editions/issue-39.ts";
import { issue40 } from "./seed-data/editions/issue-40.ts";
import { issue41 } from "./seed-data/editions/issue-41.ts";
import { issue42 } from "./seed-data/editions/issue-42.ts";
import { issue43 } from "./seed-data/editions/issue-43.ts";
import { issue44 } from "./seed-data/editions/issue-44.ts";
import { issue45 } from "./seed-data/editions/issue-45.ts";
import { photos } from "./seed-data/photos.ts";
import { sectionRow, sections, type SectionSlug } from "./seed-data/sections.ts";
import type { SeedEdition, SeedStory } from "./seed-data/types.ts";

const editions: SeedEdition[] = [
  issue38,
  issue39,
  issue40,
  issue41,
  issue42,
  issue43,
  issue44,
  issue45,
];

const UNSPLASH_LICENCE = {
  licence: "Unsplash License",
  licenceUrl: "https://unsplash.com/license",
};
/** Where fetched story images live (see apps/frontend/scripts/fetch_image.py). */
const FRONTEND_PUBLIC = path.resolve(import.meta.dirname, "../../../apps/frontend/public");
const sectionKind = new Map(sections.map((s) => [s.slug as string, s.kind]));

type PlannedPage = {
  order: number;
  layout: "front" | "section" | "guest" | "back";
  section: SectionSlug | null;
  stories: SeedStory[];
};

/** Front page, inside pages, back page. */
function planPages(e: SeedEdition): PlannedPage[] {
  return [
    { order: 1, layout: "front", section: null, stories: e.front },
    ...e.inside.map((p, i) => ({
      order: i + 2,
      layout: sectionKind.get(p.section) === "guest" ? ("guest" as const) : ("section" as const),
      section: p.section,
      stories: p.stories,
    })),
    { order: e.inside.length + 2, layout: "back", section: null, stories: [] },
  ];
}

/** The edition's guest sections, in page order. */
const guestSectionsOf = (e: SeedEdition) =>
  e.inside.filter((p) => sectionKind.get(p.section) === "guest").map((p) => p.section);

/** The day's puzzles, with the word search hiding words from the edition's own headlines. */
const puzzlesOf = (e: SeedEdition) =>
  puzzlesFor(e.date, {
    headlines: [...e.front, ...e.inside.flatMap((p) => p.stories)]
      .filter((s) => !s.reserve)
      .map((s) => s.headline),
  });

const slotFor = (page: PlannedPage, index: number, s: SeedStory) =>
  s.slot ?? (page.layout === "front" ? "lead" : index === 0 ? "feature" : "brief");

const readMinutes = (s: SeedStory) =>
  s.readMinutes ?? Math.max(1, Math.round(s.body.join(" ").split(/\s+/).length / 200));

function photoFor(s: SeedStory) {
  if (!s.photo) return null;
  const [key, n] = typeof s.photo === "string" ? [s.photo, 0] : s.photo;
  const photo = photos[key][n];
  if (!photo) throw new Error(`No photo ${key}[${n}]`);
  return photo;
}

/** Weekend pages that deliberately retell stories from earlier sample editions. */
const RETELLING_PAGES = new Set<string>(["week-in-10", "photo-album", "hall-of-fame"]);
const normalUrl = (u: string) =>
  u
    .replace(/[?#].*$/, "")
    .replace(/\/+$/, "")
    .toLowerCase();
const headlineWords = (h: string) =>
  new Set(
    h
      .toLowerCase()
      .replace(/[’']/g, "")
      .match(/[a-z0-9]+/g)
      ?.filter((w) => w.length > 2) ?? [],
  );
/**
 * The names and numbers in a text (not counting a sentence's first word), with a run of
 * capitalised words kept as one name: what makes two write-ups the same story.
 */
const keyTokens = (...texts: string[]) => {
  const keys = new Set<string>();
  for (const sentence of texts.flatMap((t) => t.split(/(?<=[.!?:])\s+/))) {
    const words = sentence
      .replace(/[’']s\b/g, "")
      .replace(/(\d),(?=\d{3})/g, "$1")
      .split(/[^\p{L}\p{N}]+/u)
      .filter(Boolean)
      .slice(1);
    let name: string[] = [];
    const flush = () => {
      if (name.length) keys.add(name.join(" ").toLowerCase());
      name = [];
    };
    for (const w of words) {
      if (/\d/.test(w)) {
        flush();
        keys.add(w);
      } else if (/^\p{Lu}/u.test(w) && !/^(I|A|The|An|And|Of|In|On|For|To)$/.test(w)) {
        name.push(w);
      } else flush();
    }
    flush();
  }
  return keys;
};
/**
 * Pairs of stories that share a subject (a name, or two slug words) but are checked and genuinely
 * different stories: a follow-up, or another event of the same games or tour. Add a pair here only
 * after reading both.
 */
const DIFFERENT_STORIES: [string, string][] = [
  ["38/walking-robot-hand", "40/robot-hand-learns-piano-by-ear"],
  ["38/berlin-marathon-sunday", "40/berlin-marathon-2026-results"],
  ["39/lego-one-piece-netflix", "42/luffy-beetles-named-after-one-piece"],
  ["38/scroll-lead-ink", "42/endgame-encore-tops-box-office"],
  ["40/olivia-rodrigo-unraveled-tour", "42/pink-baja-blast-olivia-rodrigo"],
  ["42/center-pivot-lawn-mower", "43/lawn-mower-racing-blades-off"],
  ["38/asian-games-marathon", "42/asian-games-cricket-baseball-park-tents"],
  ["38/asian-games-marathon", "43/eleven-year-old-puyo-puyo-asian-games-gold"],
  ["38/asian-games-marathon", "45/asian-games-final-weekend"],
  ["42/asian-games-cricket-baseball-park-tents", "43/eleven-year-old-puyo-puyo-asian-games-gold"],
  ["42/asian-games-cricket-baseball-park-tents", "45/asian-games-final-weekend"],
  ["43/eleven-year-old-puyo-puyo-asian-games-gold", "45/asian-games-final-weekend"],
];
const differentStories = new Set(DIFFERENT_STORIES.flatMap(([a, b]) => [`${a} ${b}`, `${b} ${a}`]));

/** Slug words too common to say two stories share a subject. */
const COMMON_SLUG_WORDS = new Set(
  "the and for with from into over new first old big small world record records day year years week best".split(
    " ",
  ),
);
const slugTokens = (slug: string) =>
  new Set(
    slug.split("-").filter((w) => w.length > 2 && !/^\d+$/.test(w) && !COMMON_SLUG_WORDS.has(w)),
  );
const jaccard = (a: Set<string>, b: Set<string>) => {
  const shared = [...a].filter((w) => b.has(w)).length;
  return shared / (a.size + b.size - shared || 1);
};

/**
 * No story may run twice across the sample editions, even from a different URL. Two stories count
 * as the same when they share a sourceUrl, have near-identical headlines (word Jaccard ≥ 0.7), share
 * ≥ 0.5 of their headline-and-dek words, share three names or numbers in headline and dek, or share
 * a subject (a multi-word name, or two slug words) and are not a pair listed in DIFFERENT_STORIES.
 * The exception is a retelling page (week in 10, photo album, hall of fame) retelling a story from
 * an earlier issue.
 */
function assertNoRepeats(all: SeedEdition[]) {
  type Seen = {
    issue: number;
    page: string;
    slug: string;
    url?: string;
    words: Set<string>;
    text: Set<string>;
    keys: Set<string>;
    slugWords: Set<string>;
  };
  const seen: Seen[] = [];
  const problems: string[] = [];
  for (const e of [...all].sort((a, b) => a.issueNumber - b.issueNumber)) {
    for (const page of planPages(e)) {
      const pageName = page.section ?? page.layout;
      for (const s of page.stories) {
        const me: Seen = {
          issue: e.issueNumber,
          page: pageName,
          slug: s.slug,
          url: s.sourceUrl && normalUrl(s.sourceUrl),
          words: headlineWords(s.headline),
          text: headlineWords(`${s.headline} ${s.dek}`),
          keys: keyTokens(s.headline, s.dek),
          slugWords: slugTokens(s.slug),
        };
        for (const o of seen) {
          if (o.issue === me.issue) continue;
          const sameUrl = !!me.url && me.url === o.url;
          const sharedKeys = [...me.keys].filter((k) => o.keys.has(k));
          const sharedName = sharedKeys.find((k) => k.includes(" "));
          const sharedSlug = [...me.slugWords].filter((w) => o.slugWords.has(w));
          const why = sameUrl
            ? "same sourceUrl"
            : jaccard(me.words, o.words) >= 0.7
              ? "near-identical headline"
              : jaccard(me.text, o.text) >= 0.5
                ? "near-identical headline and dek"
                : sharedKeys.length >= 3
                  ? `shared names/numbers: ${sharedKeys.join(", ")}`
                  : differentStories.has(`${o.issue}/${o.slug} ${me.issue}/${me.slug}`)
                    ? null
                    : sharedName
                      ? `shared name: ${sharedName}`
                      : sharedSlug.length >= 2
                        ? `shared slug words: ${sharedSlug.join(", ")}`
                        : null;
          if (!why) continue;
          if (RETELLING_PAGES.has(me.page) && o.issue < me.issue) continue;
          problems.push(
            `issue ${me.issue} ${me.page}/${me.slug} repeats issue ${o.issue} ${o.page}/${o.slug}` +
              ` (${why})`,
          );
        }
        seen.push(me);
      }
    }
  }
  if (problems.length) {
    throw new Error(`Stories repeated across editions:\n  - ${problems.join("\n  - ")}`);
  }
}

/** Everything the database won't catch on its own. */
function validate(e: SeedEdition) {
  const problems = [...editionDesignProblems(e)];
  const pages = planPages(e);
  const slugs = new Set<string>();
  const guests = e.inside.filter((p) => sectionKind.get(p.section) === "guest");
  if (guests.length > 2) problems.push("more than two guest sections");
  if (new Set(guests.map((p) => p.section)).size < guests.length)
    problems.push("a guest section appears twice");

  const pictures = new Set<string>();
  for (const page of pages) {
    page.stories.forEach((s, i) => {
      if (!slugSchema.safeParse(s.slug).success) problems.push(`bad slug "${s.slug}"`);
      if (slugs.has(s.slug)) problems.push(`duplicate slug "${s.slug}"`);
      slugs.add(s.slug);
      if (!storySlotSchema.safeParse(slotFor(page, i, s)).success) problems.push(`bad slot`);
      if (!s.section && !page.section) problems.push(`story "${s.slug}" has no section`);
      photoFor(s);
      if (s.image && s.photo) problems.push(`story "${s.slug}" has both a photo and an image`);
      if (s.image && !existsSync(path.join(FRONTEND_PUBLIC, s.image.file))) {
        problems.push(`story "${s.slug}": image ${s.image.file} not found (run fetch_image.py)`);
      }
      if (s.more?.length && !s.image)
        problems.push(`story "${s.slug}" has more images but no image`);
      for (const img of s.more ?? []) {
        if (!existsSync(path.join(FRONTEND_PUBLIC, img.file))) {
          problems.push(`story "${s.slug}": image ${img.file} not found (run fetch_image.py)`);
        }
      }
      const own = s.image
        ? [s.image.file, ...(s.more ?? []).map((i) => i.file)]
        : s.photo
          ? [JSON.stringify(s.photo)]
          : [];
      for (const picture of own) {
        if (pictures.has(picture)) problems.push(`picture ${picture} used twice`);
        pictures.add(picture);
      }
    });
  }
  if (!pages[0]?.stories.some((s, i) => slotFor(pages[0] as PlannedPage, i, s) === "lead")) {
    problems.push("no lead story on the front page");
  }
  e.features.forEach((f) => {
    const r = featureSchema.safeParse({ ...f, order: 0 });
    if (!r.success) problems.push(`feature ${f.type}: ${r.error.message}`);
  });
  puzzlesOf(e).forEach((p) => {
    const r = solvedPuzzleSchema.safeParse(p);
    if (!r.success) problems.push(`puzzle ${p.type}: ${r.error.message}`);
  });
  if (problems.length) {
    throw new Error(`Issue ${e.issueNumber} is invalid:\n  - ${problems.join("\n  - ")}`);
  }
}

async function createEdition(e: SeedEdition, sectionIds: Map<string, string>) {
  const sectionId = (slug: string) => sectionIds.get(slug) as string;
  const guests = guestSectionsOf(e);

  // Features are ordered within their type, in the order they are listed.
  const seen = new Map<string, number>();
  const features = e.features.map((f) => {
    const order = seen.get(f.type) ?? 0;
    seen.set(f.type, order + 1);
    return { type: f.type, order, content: f.content as Prisma.InputJsonValue };
  });

  await prisma.$transaction(async (tx) => {
    const edition = await tx.edition.create({
      data: {
        date: new Date(`${e.date}T00:00:00.000Z`),
        issueNumber: e.issueNumber,
        volume: 1,
        status: e.status,
        kind: e.kind ?? "regular",
        design: e.design,
        colourway: e.colourway,
        guests: { create: guests.map((g, order) => ({ sectionId: sectionId(g), order })) },
        features: { create: features },
        puzzles: {
          create: puzzlesOf(e).map((p) => ({
            type: p.type,
            order: p.order,
            data: p.data as Prisma.InputJsonValue,
            solution: p.solution as Prisma.InputJsonValue,
          })),
        },
      },
    });

    for (const page of planPages(e)) {
      await tx.page.create({
        data: {
          editionId: edition.id,
          order: page.order,
          layout: page.layout,
          sectionId: page.section ? sectionId(page.section) : null,
          stories: {
            create: page.stories.map((s, i) => {
              const photo = photoFor(s);
              return {
                editionId: edition.id,
                order: i + 1,
                slot: slotFor(page, i, s),
                slug: s.slug,
                sectionId: sectionId((s.section ?? page.section) as string),
                kicker: s.kicker,
                headline: s.headline,
                dek: s.dek,
                body: s.body,
                readMinutes: readMinutes(s),
                sticker: s.sticker ?? null,
                sourceUrl: s.sourceUrl ?? `https://example.com/sample/${e.issueNumber}/${s.slug}`,
                sourceName: s.source,
                embedUrl: s.embedUrl ?? null,
                isReserve: s.reserve ?? false,
                images: s.image
                  ? {
                      create: [s.image, ...(s.more ?? [])].map((img, order) => ({
                        order,
                        url: img.file,
                        alt: img.alt,
                        credit: img.credit,
                        kind: "photo" as const,
                        licence: "Credited to its source",
                        licenceUrl: img.from,
                      })),
                    }
                  : photo
                    ? {
                        create: {
                          order: 0,
                          url: `https://images.unsplash.com/${photo.id}`,
                          alt: photo.alt,
                          credit: photo.credit,
                          kind: "photo" as const,
                          ...UNSPLASH_LICENCE,
                        },
                      }
                    : undefined,
              };
            }),
          },
        },
      });
    }
  });
}

async function main() {
  editions.forEach(validate);
  assertNoRepeats(editions);

  // Only the sample editions are replaced: editions cascade to their pages, stories, images,
  // features and puzzles, and anything built in the newsroom (issue numbers not in seed-data) is
  // left alone. Sections are upserted by slug for the same reason: newsroom stories point at them.
  await prisma.edition.deleteMany({
    where: { issueNumber: { in: editions.map((e) => e.issueNumber) } },
  });
  for (const s of sections) {
    const row = sectionRow(s);
    await prisma.section.upsert({ where: { slug: s.slug }, update: row, create: row });
  }
  const sectionIds = new Map(
    (await prisma.section.findMany({ select: { id: true, slug: true } })).map((s) => [
      s.slug,
      s.id,
    ]),
  );

  for (const e of editions) await createEdition(e, sectionIds);

  // Sections retired from the lineup go once nothing points at them any more (a newsroom edition
  // still printing an old section keeps it until that edition is rebuilt).
  const retired = await prisma.section.findMany({
    where: {
      slug: { notIn: sections.map((s) => s.slug) },
      pages: { none: {} },
      stories: { none: {} },
      editions: { none: {} },
    },
    select: { slug: true },
  });
  if (retired.length) {
    await prisma.section.deleteMany({ where: { slug: { in: retired.map((s) => s.slug) } } });
    console.log(`Removed retired sections: ${retired.map((s) => s.slug).join(", ")}`);
  }

  const stories = await prisma.story.count();
  console.log(
    `Seeded ${sections.length} sections and ${editions.length} editions ` +
      `(issues ${editions[0]?.issueNumber}–${editions.at(-1)?.issueNumber}, ${stories} stories)`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
