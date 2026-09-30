// The deterministic fact check (PLAN §9, stage 5): every number and proper noun in a written story
// must appear in the source text it was written from.

/** Capitalised words that are fine without a source: calendar words, and ones our voice uses. */
const ALWAYS_OK = new Set(
  (
    "I Monday Tuesday Wednesday Thursday Friday Saturday Sunday January February March April May " +
    "June July August September October November December Mr Mrs Ms Dr Sir Dame St OK TV Earth " +
    "Moon Sun Yay News Internet English British American Christmas Easter Halloween"
  ).split(" "),
);

/** Numbers as written: 1,200 · 3.5 · 66.5m · 100th · 2026 · £5 → their digits. */
export function numbersIn(text: string): string[] {
  return [...text.matchAll(/\d[\d,]*(?:\.\d+)?/g)]
    .map((m) => m[0].replace(/,(?=\d{3}\b)/g, "").replace(/[.,]$/, ""))
    .filter((n) => n.length > 0);
}

/**
 * Proper nouns: capitalised words that do not start a sentence (or a quotation), plus sentence-
 * initial words that are capitalised mid-word (e.g. "McDonald", "iPhone", "NASA").
 */
export function properNounsIn(text: string): string[] {
  const out: string[] = [];
  const tokens = [...text.matchAll(/[\p{L}][\p{L}\p{M}'’-]*/gu)];
  for (const m of tokens) {
    const word = m[0].replace(/['’]s$/, "").replace(/['’-]+$/, "");
    const at = m.index ?? 0;
    const before = text.slice(Math.max(0, at - 3), at);
    const sentenceStart =
      at === 0 || /(?:[.!?:;]["”’)]?\s+|["“‘(]\s*|\n\s*|—\s*|–\s*)$/u.test(before);
    const isCap = /^\p{Lu}/u.test(word);
    const innerCap = /^\p{L}+\p{Lu}/u.test(word) || /^\p{Lu}{2,}$/u.test(word);
    if (!isCap && !innerCap) continue;
    if (sentenceStart && !innerCap) continue;
    if (ALWAYS_OK.has(word)) continue;
    out.push(word);
  }
  return out;
}

const fold = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’‘]/g, "'")
    .toLowerCase();

export type FactCheckResult = {
  ok: boolean;
  missing: { kind: "number" | "name"; value: string }[];
};

/** Check a story's words against its source. */
export function factCheck(written: string, source: string): FactCheckResult {
  const src = fold(source);
  const srcNumbers = new Set(numbersIn(source.replace(/,(?=\d{3}\b)/g, "")));
  const missing: FactCheckResult["missing"] = [];
  for (const n of new Set(numbersIn(written))) {
    if (!srcNumbers.has(n) && !src.includes(n)) missing.push({ kind: "number", value: n });
  }
  for (const name of new Set(properNounsIn(written))) {
    // Hyphenated names pass when each part appears ("Tyne-side" from "Tyne").
    const parts = fold(name).split(/-/).filter(Boolean);
    if (
      !parts.every((p) =>
        new RegExp(`(^|[^\\p{L}])${p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "u").test(src),
      )
    ) {
      missing.push({ kind: "name", value: name });
    }
  }
  return { ok: missing.length === 0, missing };
}
