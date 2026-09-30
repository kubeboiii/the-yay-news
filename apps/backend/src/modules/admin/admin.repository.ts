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
      pulledAt: true,
      pulledReason: true,
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

/** One row for the audit log, as the service hands it over. */
export type AdminActionInput = {
  action: string;
  issue?: number | null;
  slug?: string | null;
  detail?: Prisma.InputJsonValue;
};
export type AdminActionRecord = {
  id: string;
  action: string;
  issue: number | null;
  slug: string | null;
  detail: Prisma.JsonValue | null;
  at: Date;
};

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
   * Takes a story out of its edition, marking it pulled rather than deleting it, and, if given,
   * puts a reserve in its place: same page, same position, same slot. A pulled story that gives up
   * its place moves to a negative order on its page (below every served story), which frees the
   * position for the reserve and records that it was displaced.
   */
  async pullStory(
    pulled: AdminStoryRecord,
    reserve: AdminStoryRecord | null,
    { reason, at }: { reason: string | null; at: Date },
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      let order = pulled.order;
      if (reserve) {
        const lowest = await tx.story.aggregate({
          where: { pageId: pulled.pageId },
          _min: { order: true },
        });
        order = Math.min(0, lowest._min.order ?? 0) - 1;
      }
      await tx.story.update({
        where: { id: pulled.id },
        data: { pulledAt: at, pulledReason: reason, order },
      });
      if (reserve) {
        await tx.story.update({
          where: { id: reserve.id },
          data: { isReserve: false, pageId: pulled.pageId, order: pulled.order, slot: pulled.slot },
        });
      }
    });
  },

  /**
   * Undoes a pull. A story that kept its place goes straight back into it; one that gave its place
   * to a reserve joins the reserves at the end of its page instead.
   */
  async unpullStory(story: AdminStoryRecord): Promise<"restored" | "reserve"> {
    return prisma.$transaction(async (tx) => {
      if (story.order >= 0) {
        await tx.story.update({
          where: { id: story.id },
          data: { pulledAt: null, pulledReason: null },
        });
        return "restored";
      }
      const highest = await tx.story.aggregate({
        where: { pageId: story.pageId },
        _max: { order: true },
      });
      await tx.story.update({
        where: { id: story.id },
        data: {
          pulledAt: null,
          pulledReason: null,
          isReserve: true,
          order: Math.max(0, highest._max.order ?? 0) + 1,
        },
      });
      return "reserve";
    });
  },

  async recordAction(row: AdminActionInput): Promise<void> {
    await prisma.adminAction.create({ data: row });
  },

  listActions(take: number): Promise<AdminActionRecord[]> {
    return prisma.adminAction.findMany({ orderBy: { at: "desc" }, take });
  },
};
