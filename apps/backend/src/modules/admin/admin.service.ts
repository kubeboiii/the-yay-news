import type { AdminEdition, AdminStory } from "./admin.types.js";
import { AppError, NotFoundError } from "../../lib/errors.js";
import {
  adminRepository,
  type AdminEditionRecord,
  type AdminStoryRecord,
} from "./admin.repository.js";

/** An edition releases at 07:00 local time, so the first readers to get a date are at UTC+14. */
const EARLIEST_ZONE_MS = 14 * 60 * 60 * 1000;

const toStory = (s: AdminStoryRecord): AdminStory => ({
  id: s.id,
  slug: s.slug,
  headline: s.headline,
  section: s.section.slug,
  slot: s.slot,
  page: s.page.order,
  isReserve: s.isReserve,
});

const toEdition = (e: AdminEditionRecord): AdminEdition => ({
  issueNumber: e.issueNumber,
  date: e.date.toISOString().slice(0, 10),
  status: e.status,
  kind: e.kind,
  design: e.design,
  stories: e.stories.filter((s) => !s.isReserve).map(toStory),
  reserves: e.stories.filter((s) => s.isReserve).map(toStory),
});

async function edition(issueNumber: number) {
  const e = await adminRepository.findByIssue(issueNumber);
  if (!e) throw new NotFoundError(`Issue ${issueNumber}`);
  return e;
}

/** The latest date any reader anywhere can have reached. */
const latestLiveDate = (now = new Date()) =>
  new Date(`${new Date(now.getTime() + EARLIEST_ZONE_MS).toISOString().slice(0, 10)}T00:00:00Z`);

/** A reserve from the same section if there is one, else any reserve; the first in page order. */
export function pickReserve(e: AdminEditionRecord, pulled: AdminStoryRecord) {
  const reserves = e.stories.filter((s) => s.isReserve);
  return reserves.find((s) => s.section.slug === pulled.section.slug) ?? reserves[0] ?? null;
}

export const adminService = {
  async list(limit: number): Promise<AdminEdition[]> {
    return (await adminRepository.listRecent(limit)).map(toEdition);
  },

  async pullStory(issueNumber: number, slug: string) {
    const e = await edition(issueNumber);
    const pulled = e.stories.find((s) => s.slug === slug && !s.isReserve);
    if (!pulled) throw new NotFoundError(`Story "${slug}" in issue ${issueNumber}`);
    const reserve = pickReserve(e, pulled);
    await adminRepository.pullStory(pulled, reserve);
    return {
      pulled: toStory(pulled),
      replacement: reserve ? { ...toStory(reserve), isReserve: false } : null,
      edition: toEdition(await edition(issueNumber)),
    };
  },

  /** Takes a whole edition off the stands. Readers get the previous served edition instead. */
  async pullEdition(issueNumber: number) {
    await edition(issueNumber);
    await adminRepository.setStatus(issueNumber, "pulled");
    return toEdition(await edition(issueNumber));
  },

  /** Puts an edition (a pulled one, or a fixed or replacement draft) back on the stands. */
  async republish(issueNumber: number) {
    const e = await edition(issueNumber);
    if (!e.stories.some((s) => !s.isReserve && s.slot === "lead")) {
      throw new AppError(409, "NO_LEAD", `Issue ${issueNumber} has no lead story to publish`);
    }
    await adminRepository.setStatus(issueNumber, "published");
    return toEdition(await edition(issueNumber));
  },

  /** Pulls whatever is being served now, so the previous served edition takes its place. */
  async rollback(now = new Date()) {
    const current = await adminRepository.findLatestServed(latestLiveDate(now));
    if (!current) throw new AppError(409, "NOTHING_TO_ROLL_BACK", "No edition is being served");
    await adminRepository.setStatus(current.issueNumber, "pulled");
    const nowServed = await adminRepository.findLatestServed(latestLiveDate(now));
    return { pulled: current.issueNumber, nowServing: nowServed?.issueNumber ?? null };
  },
};
