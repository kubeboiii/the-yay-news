import { prisma, type Prisma } from "@repo/db";
import { SERVED_STATUSES } from "../editions/status.js";

// Database access for the emergency admin (PLAN §9). Unlike the reader's queries, these see
// reserves and every status. Kept apart from admin.service.ts so the routes test against fixtures.

const adminEditionSelect = {
  id: true,
  issueNumber: true,
  date: true,
  status: true,
  kind: true,
  design: true,
  stories: {
    orderBy: [{ page: { order: "asc" } }, { order: "asc" }],
    select: {
      id: true,
      slug: true,
      headline: true,
      slot: true,
      isReserve: true,
      pageId: true,
      order: true,
      section: { select: { slug: true } },
      page: { select: { order: true } },
    },
  },
} satisfies Prisma.EditionSelect;

export type AdminEditionRecord = Prisma.EditionGetPayload<{ select: typeof adminEditionSelect }>;
export type AdminStoryRecord = AdminEditionRecord["stories"][number];
export type EditionStatus = AdminEditionRecord["status"];

export const adminRepository = {
  listRecent(take: number): Promise<AdminEditionRecord[]> {
    return prisma.edition.findMany({
      orderBy: { date: "desc" },
      take,
      select: adminEditionSelect,
    });
  },

  findByIssue(issueNumber: number): Promise<AdminEditionRecord | null> {
    return prisma.edition.findUnique({ where: { issueNumber }, select: adminEditionSelect });
  },

  /** The newest served edition dated on or before `onOrBefore`. */
  async findLatestServed(onOrBefore: Date): Promise<{ issueNumber: number } | null> {
    return prisma.edition.findFirst({
      where: { status: { in: [...SERVED_STATUSES] }, date: { lte: onOrBefore } },
      orderBy: { date: "desc" },
      select: { issueNumber: true },
    });
  },

  async setStatus(issueNumber: number, status: EditionStatus): Promise<void> {
    await prisma.edition.update({ where: { issueNumber }, data: { status } });
  },

  /**
   * Takes a story out of its edition and, if given, puts a reserve in its place: same page, same
   * position, same slot. The pulled story is deleted (Story has no "pulled" state yet).
   */
  async pullStory(pulled: AdminStoryRecord, reserve: AdminStoryRecord | null): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await tx.story.delete({ where: { id: pulled.id } });
      if (reserve) {
        await tx.story.update({
          where: { id: reserve.id },
          data: { isReserve: false, pageId: pulled.pageId, order: pulled.order, slot: pulled.slot },
        });
      }
    });
  },
};
