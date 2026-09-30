import { prisma, type Prisma } from "@repo/db";
import { readableStoryWhere } from "../editions/edition.repository.js";
import { SERVED_STATUSES } from "../editions/status.js";

// Database access for search, apart from the grouping in search.service.ts so routes can be
// tested without a database.

const hitSelect = {
  slug: true,
  kicker: true,
  headline: true,
  dek: true,
  edition: { select: { issueNumber: true, date: true, design: true } },
} satisfies Prisma.StorySelect;

export type SearchRow = Prisma.StoryGetPayload<{ select: typeof hitSelect }>;

export const searchRepository = {
  /**
   * Readable stories whose headline, standfirst or kicker contains `q` (any case), from served
   * editions dated on or before `released`, newest edition first, front of the paper first.
   */
  async find(q: string, released: Date, take: number): Promise<SearchRow[]> {
    const contains = { contains: q, mode: "insensitive" } as const;
    return prisma.story.findMany({
      where: {
        ...readableStoryWhere,
        OR: [{ headline: contains }, { dek: contains }, { kicker: contains }],
        edition: { status: { in: [...SERVED_STATUSES] }, date: { lte: released } },
      },
      orderBy: [{ edition: { date: "desc" } }, { page: { order: "asc" } }, { order: "asc" }],
      take,
      select: hitSelect,
    });
  },
};
