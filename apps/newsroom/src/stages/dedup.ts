// Stage 3: dedup against recent editions and within the day's batch (the same story from three
// outlets). Deterministic: normalised URLs, then word-overlap of headlines.

const STOPWORDS = new Set(
  "a an and are as at be by for from has have in into is it its of on or that the this to was were will with after over new first its their his her how why what who up out off about than more most just".split(
    " ",
  ),
);

/** Lower-cased, de-pluralised content words of a headline. */
export function keywords(title: string): Set<string> {
  return new Set(
    title
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/['’]s\b/g, "")
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 2 && !STOPWORDS.has(w))
      .map((w) => (w.length > 4 && w.endsWith("s") && !w.endsWith("ss") ? w.slice(0, -1) : w)),
  );
}

export function similarity(a: string, b: string): number {
  const x = keywords(a);
  const y = keywords(b);
  if (!x.size || !y.size) return 0;
  let shared = 0;
  for (const w of x) if (y.has(w)) shared++;
  // Overlap coefficient: short rewrites of a long headline still match.
  return shared / Math.min(x.size, y.size);
}

export function normaliseUrl(url: string): string {
  try {
    const u = new URL(url);
    u.hash = "";
    for (const k of [...u.searchParams.keys()]) {
      if (/^(utm_|fbclid|gclid|ref|cmp|src)/i.test(k)) u.searchParams.delete(k);
    }
    return `${u.hostname.replace(/^www\./, "")}${u.pathname.replace(/\/+$/, "")}${u.search}`.toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

/** Headlines that share this much of their vocabulary are treated as the same story. */
export const DUPLICATE_THRESHOLD = 0.6;
/** Short headlines need at least this many shared keywords to count as the same story. */
const MIN_SHARED = 3;

function isSame(a: string, b: string) {
  const x = keywords(a);
  const y = keywords(b);
  let shared = 0;
  for (const w of x) if (y.has(w)) shared++;
  return shared >= Math.min(MIN_SHARED, x.size, y.size) && similarity(a, b) >= DUPLICATE_THRESHOLD;
}

export type Recent = { headline: string; sourceUrl: string; date: string };

export type DedupItem = { id: string; url: string; title: string; score?: number; text?: string };

/**
 * Split items into keepers and duplicates. Within the batch the better item wins (higher score,
 * then longer source text), so the strongest telling of a story survives.
 */
export function dedup<T extends DedupItem>(items: T[], recent: Recent[]) {
  const recentUrls = new Set(recent.map((r) => normaliseUrl(r.sourceUrl)));
  const kept: T[] = [];
  /** `twinId`: the kept item telling the same story, when the duplicate is within the batch. */
  const duplicates: { item: T; reason: string; twinId?: string }[] = [];
  const ranked = [...items].sort(
    (a, b) => (b.score ?? 0) - (a.score ?? 0) || (b.text?.length ?? 0) - (a.text?.length ?? 0),
  );
  for (const item of ranked) {
    const url = normaliseUrl(item.url);
    if (recentUrls.has(url)) {
      duplicates.push({ item, reason: "already ran in a recent edition (same source URL)" });
      continue;
    }
    const old = recent.find((r) => isSame(item.title, r.headline));
    if (old) {
      duplicates.push({ item, reason: `ran on ${old.date}: "${old.headline}"` });
      continue;
    }
    const twin = kept.find((k) => normaliseUrl(k.url) === url || isSame(item.title, k.title));
    if (twin) {
      duplicates.push({ item, reason: `same story as "${twin.title}"`, twinId: twin.id });
      continue;
    }
    kept.push(item);
  }
  return { kept, duplicates };
}

/** Below this much text, a story borrows other outlets' telling of it. */
export const CORROBORATE_BELOW = 1500;

/**
 * Other outlets on the same story (within-batch duplicates) back up a thin telling: their text is
 * appended as extra grounding (so the writer and the fact check may use it), and their pictures
 * join the story's. Mutates and returns `kept`.
 */
export function corroborate<
  T extends DedupItem & {
    sourceName: string;
    images?: { url: string; credit: string | null; alt: string | null }[];
  },
>(kept: T[], duplicates: { item: T; twinId?: string }[]): T[] {
  const byId = new Map(kept.map((k) => [k.id, k]));
  for (const d of duplicates) {
    const k = d.twinId ? byId.get(d.twinId) : undefined;
    if (!k) continue;
    const extra = d.item.text ?? "";
    if ((k.text?.length ?? 0) < CORROBORATE_BELOW && extra.length > 100) {
      k.text =
        `${k.text ?? ""}\n\nOther coverage (${d.item.sourceName}):\n${extra.slice(0, 3000)}`.trim();
    }
    const imgs = d.item.images ?? [];
    if (imgs.length) {
      const credited = imgs.map((i) => ({ ...i, credit: i.credit ?? d.item.sourceName }));
      k.images = [...(k.images ?? []), ...credited];
    }
  }
  return kept;
}
