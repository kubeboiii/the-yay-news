// Seeds the sections and the hand-made sample editions (PLAN §11, Phase 2). Idempotent: it wipes
// every edition and section, then recreates them. Everything is validated against the shared
// contracts before anything is written, so a bad edit fails without touching the database.
import { existsSync } from "node:fs";
import path from "node:path";
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
import { sections, type SectionSlug } from "./seed-data/sections.ts";
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

const guestSectionOf = (e: SeedEdition) =>
  e.inside.find((p) => sectionKind.get(p.section) === "guest")?.section ?? null;

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

/** Everything the database won't catch on its own. */
function validate(e: SeedEdition) {
  const problems = [...editionDesignProblems(e)];
  const pages = planPages(e);
  const slugs = new Set<string>();
  const guests = e.inside.filter((p) => sectionKind.get(p.section) === "guest");
  if (guests.length > 1) problems.push("more than one guest section");

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
      const picture = s.image?.file ?? (s.photo ? JSON.stringify(s.photo) : null);
      if (picture && pictures.has(picture)) problems.push(`picture ${picture} used twice`);
      if (picture) pictures.add(picture);
    });
  }
  if (!pages[0]?.stories.some((s, i) => slotFor(pages[0] as PlannedPage, i, s) === "lead")) {
    problems.push("no lead story on the front page");
  }
  e.features.forEach((f) => {
    const r = featureSchema.safeParse({ ...f, order: 0 });
    if (!r.success) problems.push(`feature ${f.type}: ${r.error.message}`);
  });
  e.puzzles.forEach((p) => {
    const r = solvedPuzzleSchema.safeParse({ ...p, order: 0 });
    if (!r.success) problems.push(`puzzle ${p.type}: ${r.error.message}`);
  });
  if (problems.length) {
    throw new Error(`Issue ${e.issueNumber} is invalid:\n  - ${problems.join("\n  - ")}`);
  }
}

async function createEdition(e: SeedEdition, sectionIds: Map<string, string>) {
  const sectionId = (slug: string) => sectionIds.get(slug) as string;
  const guest = guestSectionOf(e);

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
        guestSectionId: guest ? sectionId(guest) : null,
        features: { create: features },
        puzzles: {
          create: e.puzzles.map((p, order) => ({
            type: p.type,
            order,
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
                      create: {
                        order: 0,
                        url: s.image.file,
                        alt: s.image.alt,
                        credit: s.image.credit,
                        kind: "photo" as const,
                        licence: "Credited to its source",
                        licenceUrl: s.image.from,
                      },
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

  // Editions cascade to their pages, stories, images, features and puzzles.
  await prisma.edition.deleteMany();
  await prisma.section.deleteMany();

  await prisma.section.createMany({ data: [...sections] });
  const sectionIds = new Map(
    (await prisma.section.findMany({ select: { id: true, slug: true } })).map((s) => [
      s.slug,
      s.id,
    ]),
  );

  for (const e of editions) await createEdition(e, sectionIds);

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
