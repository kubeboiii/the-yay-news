// A fake-model dry plan over 28 days (two full guest cycles, every guest drawn twice), fed by the
// real allowlist: does each day's pair of guests fill its pages from the sources that list them?
// Each source contributes the same small haul (ITEMS_PER_SOURCE items that pass the delight check),
// so this measures the allowlist's coverage of each guest, not any one day's news.
import { describe, expect, it } from "vitest";
import { FakeModel } from "../src/model/fake.ts";
import { GUEST_CYCLE_DAYS, guestSectionsFor } from "../src/plan.ts";
import { runEdition } from "../src/pipeline.ts";
import { SOURCES } from "../src/sources.ts";
import type { Presser } from "../src/stages/illustrate.ts";
import { MemoryStore } from "../src/store.ts";
import { addDays, dayIndex } from "../src/text.ts";
import { GUEST_SECTIONS, type Candidate, type SectionSlug } from "../src/types.ts";
import { candidate } from "./fixtures.ts";

/** A lean day: one usable item per source after the blocklist and the delight check. */
const ITEMS_PER_SOURCE = 1;
const DAYS = 2 * GUEST_CYCLE_DAYS;
/** The first day of a guest cycle (day index a multiple of GUEST_CYCLE_DAYS). */
const START = "2026-10-08";

/** Guests that used to have no sources of their own, and must now fill every time. */
const NEWLY_SOURCED: SectionSlug[] = [
  "your-small-wins",
  "letters-and-classifieds",
  "kids-and-schools",
  "weird-local",
  "weird-jobs",
];

const press: Presser = async (_url, issue, slug) => `/editions/${issue}/${slug}.jpg`;
const offline = async (url: string) => ({ ok: false, status: 599, url, text: "" });

/** A pronounceable token unique to n, so no two headlines look like the same story. */
const token = (n: number) => {
  let s = "";
  for (let i = 0; i < 4; i++, n = Math.floor(n / 26)) s += String.fromCharCode(97 + (n % 26));
  return s;
};

let serial = 0;
function haul(date: string): Candidate[] {
  return SOURCES.flatMap((source) =>
    Array.from({ length: ITEMS_PER_SOURCE }, (_, n) => {
      const i = ++serial;
      return candidate(source.sections[0]!, n + i, {
        sourceSlug: source.slug,
        sourceName: source.name,
        sourceSections: [...source.sections],
        url: `https://example.org/${source.slug}/${date}/${n}`,
        title: `${token(i)} ${token(i + 5000)} ${token(i + 9000)} brightens the morning`,
      });
    }),
  );
}

describe("guest pages over two full cycles", () => {
  it("fills every day's two guest pages from the allowlist", { timeout: 180_000 }, async () => {
    expect(dayIndex(START) % GUEST_CYCLE_DAYS).toBe(0);
    const drawn = new Map<SectionSlug, number>();
    const filled = new Map<SectionSlug, number>();
    const short: string[] = [];
    for (let day = 0; day < DAYS; day++) {
      const date = addDays(START, day);
      const { guests } = guestSectionsFor(date);
      const out = await runEdition({
        date,
        store: new MemoryStore(),
        model: new FakeModel(),
        dryRun: true,
        gatherer: async () => haul(date),
        press,
        get: offline,
      });
      expect(out.status, date).toBe("succeeded");
      const pages = out.draft!.pages.filter((p) => p.layout === "guest");
      for (const g of guests) {
        drawn.set(g, (drawn.get(g) ?? 0) + 1);
        const n = pages.find((p) => p.section === g)?.stories.filter((s) => !s.isReserve).length;
        if ((n ?? 0) >= 3) filled.set(g, (filled.get(g) ?? 0) + 1);
        else short.push(`${date} ${g} (${n ?? 0} stories; ran ${pages.map((p) => p.section)})`);
      }
      expect(pages, date).toHaveLength(2);
    }

    const rate = (g: SectionSlug) => (filled.get(g) ?? 0) / (drawn.get(g) ?? 1);
    const total = [...filled.values()].reduce((a, b) => a + b, 0) / (DAYS * 2);
    console.log(
      `guest fill rate over ${DAYS} days: ${(100 * total).toFixed(0)}% of ${DAYS * 2} guest pages\n` +
        GUEST_SECTIONS.map(
          (g) => `  ${g.padEnd(24)} ${filled.get(g) ?? 0}/${drawn.get(g) ?? 0}`,
        ).join("\n") +
        (short.length ? `\nshort:\n  ${short.join("\n  ")}` : ""),
    );
    // Every guest is drawn twice in two cycles.
    for (const g of GUEST_SECTIONS) expect(drawn.get(g), g).toBe(2);
    for (const g of NEWLY_SOURCED) expect(rate(g), g).toBe(1);
    expect(total).toBeGreaterThanOrEqual(0.85);
  });
});
