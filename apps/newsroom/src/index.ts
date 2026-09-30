// The newsroom's public entry points, for the CLI and for other apps (e.g. the admin's "replace").
import { modelFromEnv } from "./model/index.ts";
import { type RunOutcome, runEdition } from "./pipeline.ts";
import { PrismaStore } from "./store.ts";

export { runEdition, type RunOptions, type RunOutcome } from "./pipeline.ts";
export { modelFromEnv, type Model } from "./model/index.ts";
export { PrismaStore, MemoryStore, type Store } from "./store.ts";
export type { EditionDraft } from "./types.ts";

/**
 * Rebuild the edition for `date`, replacing whatever is filed for it (published or not). With
 * `slowNewsDay`, the evergreen edition is filed without looking at the news.
 */
export function rebuildEdition(
  date: string,
  { slowNewsDay = false }: { slowNewsDay?: boolean } = {},
): Promise<RunOutcome> {
  return runEdition({
    date,
    store: new PrismaStore(),
    model: modelFromEnv(),
    replace: true,
    forceSlowNewsDay: slowNewsDay,
  });
}
