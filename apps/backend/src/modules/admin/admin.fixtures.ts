// Test fixtures for the admin: editions with reserves, and an in-memory stand-in for
// admin.repository.ts. Used only by *.test.ts files.

import { SERVED_STATUSES } from "../editions/status.js";
import type { AdminEditionRecord, AdminStoryRecord, adminRepository } from "./admin.repository.js";

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
} {
  const byIssue = (n: number) => editions.find((e) => e.issueNumber === n) ?? null;
  const served = (d: Date) =>
    editions
      .filter((e) => (SERVED_STATUSES as readonly string[]).includes(e.status) && e.date <= d)
      .sort((a, b) => b.date.getTime() - a.date.getTime())[0] ?? null;
  return {
    editions,
    listRecent: async (take) =>
      [...editions].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, take),
    findByIssue: async (n) => byIssue(n),
    findLatestServed: async (d) => {
      const e = served(d);
      return e && { issueNumber: e.issueNumber };
    },
    setStatus: async (n, status) => {
      const e = byIssue(n);
      if (e) e.status = status;
    },
    pullStory: async (pulled, reserve) => {
      for (const e of editions) {
        e.stories = e.stories.filter((s) => s.id !== pulled.id);
        const r = reserve && e.stories.find((s) => s.id === reserve.id);
        if (r)
          Object.assign(r, {
            isReserve: false,
            pageId: pulled.pageId,
            order: pulled.order,
            slot: pulled.slot,
            page: pulled.page,
          });
      }
    },
  };
}
