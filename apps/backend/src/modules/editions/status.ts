/**
 * Statuses a reader can ever be served. A scheduled edition is finished and releases itself at
 * 07:00 on its date in each reader's zone (PLAN §6); publishing it early changes nothing for
 * readers. Drafts and pulled editions are never served.
 */
export const SERVED_STATUSES = ["published", "scheduled"] as const;
