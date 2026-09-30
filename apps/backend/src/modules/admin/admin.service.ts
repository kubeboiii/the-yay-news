import type { AdminAction, AdminEdition, AdminStory } from "./admin.types.js";
import { AppError, NotFoundError } from "../../lib/errors.js";
import {
  adminRepository,
  type AdminActionInput,
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
  pulledAt: s.pulledAt?.toISOString() ?? null,
  pulledReason: s.pulledReason,
});

const isPulled = (s: AdminStoryRecord) => s.pulledAt !== null;
/** Served to readers: in the paper and not pulled. */
const isLive = (s: AdminStoryRecord) => !s.isReserve && !isPulled(s);
const isStandby = (s: AdminStoryRecord) => s.isReserve && !isPulled(s);

const toEdition = (e: AdminEditionRecord): AdminEdition => ({
  issueNumber: e.issueNumber,
  date: e.date.toISOString().slice(0, 10),
  status: e.status,
  kind: e.kind,
  design: e.design,
  stories: e.stories.filter(isLive).map(toStory),
  reserves: e.stories.filter(isStandby).map(toStory),
  pulled: e.stories.filter(isPulled).map(toStory),
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
  const reserves = e.stories.filter(isStandby);
  return reserves.find((s) => s.section.slug === pulled.section.slug) ?? reserves[0] ?? null;
}

/**
 * Writes one audit row (and a log line). The action has already happened by now, so a failed write
 * is reported rather than thrown: an error here would tempt the admin to repeat it.
 */
async function audit(row: AdminActionInput) {
  console.warn(`[admin] ${new Date().toISOString()} ${row.action}`, JSON.stringify(row));
  try {
    await adminRepository.recordAction(row);
  } catch (err) {
    console.error("[admin] could not write the audit log", err);
  }
}

export const adminService = {
  async list(limit: number): Promise<AdminEdition[]> {
    return (await adminRepository.listRecent(limit)).map(toEdition);
  },

  /** The audit log, newest first. */
  async actions(limit: number): Promise<AdminAction[]> {
    return (await adminRepository.listActions(limit)).map((a) => ({
      id: a.id,
      action: a.action,
      issue: a.issue,
      slug: a.slug,
      detail: a.detail,
      at: a.at.toISOString(),
    }));
  },

  /** Logs a login attempt. Never given the password. */
  async recordLogin(ok: boolean, client: string) {
    await audit({ action: ok ? "login" : "login-failed", detail: { client } });
  },

  async pullStory(issueNumber: number, slug: string, reason: string | null, now = new Date()) {
    const e = await edition(issueNumber);
    const pulled = e.stories.find((s) => s.slug === slug && isLive(s));
    if (!pulled) throw new NotFoundError(`Story "${slug}" in issue ${issueNumber}`);
    const reserve = pickReserve(e, pulled);
    await adminRepository.pullStory(pulled, reserve, { reason, at: now });
    await audit({
      action: "pull-story",
      issue: issueNumber,
      slug,
      detail: { reason, replacement: reserve?.slug ?? null },
    });
    return {
      pulled: { ...toStory(pulled), pulledAt: now.toISOString(), pulledReason: reason },
      replacement: reserve ? { ...toStory(reserve), isReserve: false } : null,
      edition: toEdition(await edition(issueNumber)),
    };
  },

  /** Undoes a pull: back in its place if it kept it, else back among the reserves. */
  async unpullStory(issueNumber: number, slug: string) {
    const e = await edition(issueNumber);
    const story = e.stories.find((s) => s.slug === slug && isPulled(s));
    if (!story) throw new NotFoundError(`Pulled story "${slug}" in issue ${issueNumber}`);
    const outcome = await adminRepository.unpullStory(story);
    await audit({ action: "unpull-story", issue: issueNumber, slug, detail: { outcome } });
    return { restored: slug, outcome, edition: toEdition(await edition(issueNumber)) };
  },

  /** Takes a whole edition off the stands. Readers get the previous served edition instead. */
  async pullEdition(issueNumber: number) {
    await edition(issueNumber);
    await adminRepository.setStatus(issueNumber, "pulled");
    await audit({ action: "pull-edition", issue: issueNumber });
    return toEdition(await edition(issueNumber));
  },

  /** Puts an edition (a pulled one, or a fixed or replacement draft) back on the stands. */
  async republish(issueNumber: number) {
    const e = await edition(issueNumber);
    if (!e.stories.some((s) => isLive(s) && s.slot === "lead")) {
      throw new AppError(409, "NO_LEAD", `Issue ${issueNumber} has no lead story to publish`);
    }
    await adminRepository.setStatus(issueNumber, "published");
    await audit({ action: "republish", issue: issueNumber });
    return toEdition(await edition(issueNumber));
  },

  /** Pulls whatever is being served now, so the previous served edition takes its place. */
  async rollback(now = new Date()) {
    const current = await adminRepository.findLatestServed(latestLiveDate(now));
    if (!current) throw new AppError(409, "NOTHING_TO_ROLL_BACK", "No edition is being served");
    await adminRepository.setStatus(current.issueNumber, "pulled");
    const nowServed = await adminRepository.findLatestServed(latestLiveDate(now));
    const result = { pulled: current.issueNumber, nowServing: nowServed?.issueNumber ?? null };
    await audit({
      action: "rollback",
      issue: current.issueNumber,
      detail: { nowServing: result.nowServing },
    });
    return result;
  },
};
