import type { ArchiveList, Edition } from "@repo/shared";
import { NotFoundError } from "../../lib/errors.js";
import { fromCalendarDate, toCalendarDate, toEdition, toEditionSummary } from "./edition.mapper.js";
import { editionRepository, type EditionRecord } from "./edition.repository.js";
import { SERVED_STATUSES } from "./status.js";
import type { Reader } from "./reader.js";
import { isReleased, releasedDate } from "./release.js";

/**
 * A reader may see an edition once it is published or scheduled and 07:00 on its date has passed
 * where they are. Anything else is reported as not found, so unreleased editions don't leak their existence.
 */
export function visibleTo(edition: EditionRecord | null, reader: Reader): edition is EditionRecord {
  return (
    edition !== null &&
    (SERVED_STATUSES as readonly string[]).includes(edition.status) &&
    isReleased(toCalendarDate(edition.date), reader.now, reader.timeZone)
  );
}

async function withYesterday(edition: EditionRecord): Promise<Edition> {
  return toEdition(edition, await editionRepository.findPreviousPuzzles(edition.date));
}

export const editionService = {
  /** The newest edition released to this reader. */
  async today(reader: Reader): Promise<Edition> {
    const released = fromCalendarDate(releasedDate(reader.now, reader.timeZone));
    const edition = await editionRepository.findLatestServed(released);
    if (!edition) throw new NotFoundError("Edition");
    return withYesterday(edition);
  },

  async getByIssue(issueNumber: number, reader: Reader): Promise<Edition> {
    const edition = await editionRepository.findByIssue(issueNumber);
    if (!visibleTo(edition, reader)) throw new NotFoundError("Edition");
    return withYesterday(edition);
  },

  async getByDate(date: string, reader: Reader): Promise<Edition> {
    const edition = await editionRepository.findByDate(fromCalendarDate(date));
    if (!visibleTo(edition, reader)) throw new NotFoundError("Edition");
    return withYesterday(edition);
  },

  /** Released editions, newest first. The cursor is the date of the last edition on the previous page. */
  async archive(
    { cursor, limit }: { cursor?: string; limit: number },
    reader: Reader,
  ): Promise<ArchiveList> {
    const rows = await editionRepository.listServed({
      onOrBefore: fromCalendarDate(releasedDate(reader.now, reader.timeZone)),
      before: cursor ? fromCalendarDate(cursor) : undefined,
      take: limit + 1, // one extra to learn whether another page exists
    });
    const page = rows.slice(0, limit);
    const last = page.at(-1);
    return {
      items: page.map(toEditionSummary),
      nextCursor: rows.length > limit && last ? toCalendarDate(last.date) : null,
    };
  },
};
