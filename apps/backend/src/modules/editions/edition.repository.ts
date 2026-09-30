import { SERVED_STATUSES } from "./status.js";
import { prisma, type Prisma } from "@repo/db";

// Database access for editions, kept apart from the release rules in edition.service.ts so the
// routes can be tested against fixtures without a database.

const sectionSelect = {
  slug: true,
  name: true,
  tagline: true,
  kind: true,
  colour: true,
  voice: true,
} satisfies Prisma.SectionSelect;

const storyInclude = {
  section: { select: sectionSelect },
  images: { orderBy: { order: "asc" } },
} satisfies Prisma.StoryInclude;

/** The stories a reader may see: never a reserve, never a story the admin has pulled. */
export const readableStoryWhere = {
  isReserve: false,
  pulledAt: null,
} satisfies Prisma.StoryWhereInput;

const guestsInclude = {
  orderBy: { order: "asc" },
  select: { section: { select: sectionSelect } },
} satisfies Prisma.Edition$guestsArgs;

/** Everything a reader needs to lay out a whole edition. Reserves and pulled stories are never loaded. */
export const editionInclude = {
  guests: guestsInclude,
  pages: {
    orderBy: { order: "asc" },
    include: {
      section: { select: sectionSelect },
      stories: { where: readableStoryWhere, orderBy: { order: "asc" }, include: storyInclude },
    },
  },
  features: { orderBy: [{ type: "asc" }, { order: "asc" }] },
  puzzles: { orderBy: { order: "asc" } },
} satisfies Prisma.EditionInclude;

/** Enough for an archive rack: the guest sections and the front-page lead. */
export const editionSummaryInclude = {
  guests: guestsInclude,
  stories: {
    where: { slot: "lead", ...readableStoryWhere },
    orderBy: [{ page: { order: "asc" } }, { order: "asc" }],
    take: 1,
    include: storyInclude,
  },
} satisfies Prisma.EditionInclude;

export type EditionRecord = Prisma.EditionGetPayload<{ include: typeof editionInclude }>;
export type EditionSummaryRecord = Prisma.EditionGetPayload<{
  include: typeof editionSummaryInclude;
}>;
export type StoryRecord = EditionRecord["pages"][number]["stories"][number];
export type PuzzleRecord = EditionRecord["puzzles"][number];

export const editionRepository = {
  findByIssue(issueNumber: number): Promise<EditionRecord | null> {
    return prisma.edition.findUnique({ where: { issueNumber }, include: editionInclude });
  },

  findByDate(date: Date): Promise<EditionRecord | null> {
    return prisma.edition.findUnique({ where: { date }, include: editionInclude });
  },

  /** The newest served edition dated on or before `date`. */
  findLatestServed(onOrBefore: Date): Promise<EditionRecord | null> {
    return prisma.edition.findFirst({
      where: { status: { in: [...SERVED_STATUSES] }, date: { lte: onOrBefore } },
      orderBy: { date: "desc" },
      include: editionInclude,
    });
  },

  /** The puzzles of the newest served edition dated before `date`. */
  findPreviousPuzzles(
    before: Date,
  ): Promise<{ issueNumber: number; puzzles: PuzzleRecord[] } | null> {
    return prisma.edition.findFirst({
      where: { status: { in: [...SERVED_STATUSES] }, date: { lt: before } },
      orderBy: { date: "desc" },
      select: { issueNumber: true, puzzles: { orderBy: { order: "asc" } } },
    });
  },

  /** Served editions dated on or before `onOrBefore` (and before `before`, if given), newest first. */
  listServed({
    onOrBefore,
    before,
    take,
  }: {
    onOrBefore: Date;
    before?: Date;
    take: number;
  }): Promise<EditionSummaryRecord[]> {
    return prisma.edition.findMany({
      where: {
        status: { in: [...SERVED_STATUSES] },
        date: { lte: onOrBefore, ...(before && { lt: before }) },
      },
      orderBy: { date: "desc" },
      take,
      include: editionSummaryInclude,
    });
  },
};
