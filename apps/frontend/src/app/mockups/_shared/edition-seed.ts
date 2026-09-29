// Every edition prints a little differently, but the same edition always prints the same way.
// The seed comes from the issue number (`?edition=41` previews another issue; default is today's 42).

export const TODAY_ISSUE = 42;

/** Issue number being viewed: `?edition=N` in the URL, otherwise today's issue. Client-side only. */
export function currentIssue(): number {
  if (typeof window === "undefined") return TODAY_ISSUE;
  const n = Number(new URLSearchParams(window.location.search).get("edition"));
  return Number.isInteger(n) && n > 0 ? n : TODAY_ISSUE;
}

/** Deterministic pseudo-random generator (mulberry32): same seed, same sequence. */
export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Days between an issue and today's issue (one issue per day). */
export const ageInDays = (issue: number) => Math.max(0, TODAY_ISSUE - issue);
