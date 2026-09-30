import type { SearchPaper, SearchResult } from "@repo/shared";
import { fromCalendarDate, toCalendarDate } from "../editions/edition.mapper.js";
import type { Reader } from "../editions/reader.js";
import { releasedDate } from "../editions/release.js";
import { type SearchRow, searchRepository } from "./search.repository.js";

/** At most this many stories come back; `more` says there were others. */
export const SEARCH_LIMIT = 30;

/** Rows (already newest paper first) grouped into one entry per paper, in the same order. */
export function groupByPaper(rows: SearchRow[]): SearchPaper[] {
  const papers: SearchPaper[] = [];
  for (const r of rows) {
    const last = papers.at(-1);
    const hit = { slug: r.slug, kicker: r.kicker, headline: r.headline, dek: r.dek };
    if (last?.issueNumber === r.edition.issueNumber) last.stories.push(hit);
    else
      papers.push({
        issueNumber: r.edition.issueNumber,
        date: toCalendarDate(r.edition.date),
        design: r.edition.design as SearchPaper["design"],
        stories: [hit],
      });
  }
  return papers;
}

export const searchService = {
  /** Stories matching `q` from papers already released to this reader. */
  async search(q: string, reader: Reader): Promise<SearchResult> {
    const released = fromCalendarDate(releasedDate(reader.now, reader.timeZone));
    const rows = await searchRepository.find(q, released, SEARCH_LIMIT + 1);
    return {
      query: q,
      papers: groupByPaper(rows.slice(0, SEARCH_LIMIT)),
      more: rows.length > SEARCH_LIMIT,
    };
  },
};
