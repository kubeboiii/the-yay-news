// Test fixtures for the admin: editions with reserves, and an in-memory stand-in for
// admin.repository.ts. Used only by *.test.ts files.

import { SERVED_STATUSES } from "../editions/status.js";
import type {
  AdminActionRecord,
  AdminEditionRecord,
  AdminStoryRecord,
  adminRepository,
} from "./admin.repository.js";

const story = (
  issue: number,
  slug: string,
  section: string,
  page: number,
  order: number,
  slot: AdminStoryRecord["slot"],
  isReserve = false,
): AdminStoryRecord => ({
  id: `${issue}-${slug}`,
  slug,
  headline: `Headline for ${slug}`,
  slot,
  isReserve,
  pulledAt: null,
  pulledReason: null,
  pageId: `${issue}-p${page}`,
  order,
  section: { slug: section },
  page: { order: page },
});

const edition = (
  issueNumber: number,
  date: string,
  status: AdminEditionRecord["status"],
  stories: AdminStoryRecord[],
): AdminEditionRecord => ({
  id: `e${issueNumber}`,
  issueNumber,
  date: new Date(`${date}T00:00:00Z`),
  status,
  kind: "regular",
  design: "broadsheet",
  stories,
});

export function adminFixtures(): AdminEditionRecord[] {
  return [40, 41, 42].map((n, i) =>
    edition(n, `2026-09-${28 + i}`, n === 42 ? "scheduled" : "published", [
      story(n, "lead", "animals", 1, 0, "lead"),
      story(n, "otter", "animals", 2, 0, "feature"),
      story(n, "comet", "discoveries", 3, 0, "feature"),
      story(n, "spare-rocket", "discoveries", 3, 90, "brief", true),
      story(n, "spare-kitten", "animals", 3, 91, "brief", true),
    ]),
  );
}

type Repo = typeof adminRepository;

export function fakeAdminRepository(editions: AdminEditionRecord[]): Repo & {
  editions: AdminEditionRecord[];
  actions: AdminActionRecord[];
} {
  const actions: AdminActionRecord[] = [];
  const byIssue = (n: number) => editions.find((e) => e.issueNumber === n) ?? null;
  /** As the Prisma select orders them: by page, then position. */
  const ordered = (e: AdminEditionRecord): AdminEditionRecord => ({
    ...e,
    stories: [...e.stories].sort((a, b) => a.page.order - b.page.order || a.order - b.order),
  });
  const served = (d: Date) =>
    editions
      .filter((e) => (SERVED_STATUSES as readonly string[]).includes(e.status) && e.date <= d)
      .sort((a, b) => b.date.getTime() - a.date.getTime())[0] ?? null;
  const find = (id: string) => editions.flatMap((e) => e.stories).find((s) => s.id === id) ?? null;
  const onPage = (pageId: string) =>
    editions.flatMap((e) => e.stories).filter((s) => s.pageId === pageId);
  return {
    editions,
    actions,
    listRecent: async (take) =>
      [...editions]
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, take)
        .map(ordered),
    findByIssue: async (n) => {
      const e = byIssue(n);
      return e && ordered(e);
    },
    findLatestServed: async (d) => {
      const e = served(d);
      return e && { issueNumber: e.issueNumber };
    },
    setStatus: async (n, status) => {
      const e = byIssue(n);
      if (e) e.status = status;
    },
    pullStory: async (pulled, reserve, { reason, at }) => {
      const p = find(pulled.id);
      const r = reserve && find(reserve.id);
      if (!p) return;
      // `pulled` may be the very record we change, so take its place first.
      const place = { pageId: p.pageId, order: p.order, slot: p.slot, page: p.page };
      const order = r ? Math.min(0, ...onPage(pulled.pageId).map((s) => s.order)) - 1 : place.order;
      Object.assign(p, { pulledAt: at, pulledReason: reason, order });
      if (r) Object.assign(r, { isReserve: false, ...place });
    },
    unpullStory: async (story) => {
      const s = find(story.id);
      if (!s) throw new Error("no such story");
      if (s.order >= 0) {
        Object.assign(s, { pulledAt: null, pulledReason: null });
        return "restored";
      }
      const order = Math.max(0, ...onPage(s.pageId).map((x) => x.order)) + 1;
      Object.assign(s, { pulledAt: null, pulledReason: null, isReserve: true, order });
      return "reserve";
    },
    recordAction: async (row) => {
      actions.push({
        id: `a${actions.length + 1}`,
        action: row.action,
        issue: row.issue ?? null,
        slug: row.slug ?? null,
        detail: (row.detail ?? null) as AdminActionRecord["detail"],
        at: new Date(),
      });
    },
    listActions: async (take) => [...actions].reverse().slice(0, take),
  };
}
