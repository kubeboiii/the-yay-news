// The weekend pages built from the past week's editions (PLAN §6): Saturday's Week in 10 retells
// the ten best stories from Monday to Friday, Sunday's Photo Album prints the week's best pictures
// and its Hall of Fame names the week's best animal, human hero, weird record and internet moment.
// Each retelling is written from our own printed story, links back to it, and reuses its picture.
import type { Image } from "@repo/shared";
import { OTHER_BEAT } from "../beats.ts";
import type { Classified, SectionSlug } from "../types.ts";

/** A story printed in one of the past week's editions. */
export type WeekStory = {
  slug: string;
  issueNumber: number;
  date: string;
  /** The page it ran on ("front" for the front page). */
  page: string;
  section: string;
  slot: "lead" | "feature" | "brief";
  /** Its order on its page (1 = the page's main story). */
  order: number;
  kicker: string;
  headline: string;
  dek: string;
  body: string[];
  sourceName: string;
  images: Image[];
};

/** Where a retelling links: the original story in the reader. */
export const storyUrl = (site: string, s: Pick<WeekStory, "issueNumber" | "slug">) =>
  new URL(`/issue/${s.issueNumber}/story/${s.slug}`, site).toString();

const standing = (s: WeekStory) =>
  (s.slot === "lead" ? 4 : s.order === 1 ? 3 : s.slot === "feature" ? 2 : 1) +
  (s.images.length ? 1 : 0) +
  Math.min(s.body.join(" ").length, 2000) / 2000;

/** Best first, spread across sections: no section's second story until each has had one. */
function spread(stories: WeekStory[], n: number): WeekStory[] {
  const ranked = [...stories].sort((a, b) => standing(b) - standing(a));
  const out: WeekStory[] = [];
  for (let round = 0; out.length < n && round < 5; round++) {
    const taken = new Map<string, number>();
    for (const s of out) taken.set(s.section, (taken.get(s.section) ?? 0) + 1);
    for (const s of ranked) {
      if (out.length >= n) break;
      if (out.includes(s) || (taken.get(s.section) ?? 0) > round) continue;
      out.push(s);
      taken.set(s.section, (taken.get(s.section) ?? 0) + 1);
    }
  }
  return out;
}

export const HALL_OF_FAME = [
  {
    award: "Best animal",
    sections: ["animal-kingdom", "pets-corner", "discoveries"],
    words:
      /\b(animal|dog|cat|bird|whale|bear|otter|penguin|owl|fox|seal|dolphin|zoo|puppy|kitten|species)s?\b/i,
  },
  {
    award: "Human hero",
    sections: ["good-humans", "kids-and-schools", "your-small-wins", "india-desk"],
    words: /\b(kind|volunteer|neighbour|community|donat\w*|helped|gift|teacher|pupils?)\b/i,
  },
  {
    award: "Weird record",
    sections: ["world-records", "internet", "sports"],
    words: /\b(record|biggest|largest|longest|fastest|smallest|Guinness)\b/i,
  },
  {
    award: "Internet moment",
    sections: ["internet", "creators"],
    words: /\b(viral|meme|online|internet|TikTok|YouTube|video|creator|streamer)\b/i,
  },
] as const;

/** The Hall of Fame: one story per award, from its sections first, then by what it is about. */
function hallOfFame(stories: WeekStory[]): { story: WeekStory; award: string }[] {
  const out: { story: WeekStory; award: string }[] = [];
  const ranked = [...stories].sort((a, b) => standing(b) - standing(a));
  for (const h of HALL_OF_FAME) {
    const text = (s: WeekStory) => `${s.kicker} ${s.headline} ${s.dek}`;
    const free = ranked.filter((s) => !out.some((o) => o.story === s));
    const pick =
      free.find(
        (s) => (h.sections as readonly string[]).includes(s.section) && h.words.test(text(s)),
      ) ??
      free.find((s) => h.words.test(text(s))) ??
      free.find((s) => (h.sections as readonly string[]).includes(s.section));
    if (pick) out.push({ story: pick, award: h.award });
  }
  return out;
}

const asCandidate = (
  s: WeekStory,
  section: SectionSlug,
  site: string,
  fetchedAt: Date,
  reason: string,
): Classified => ({
  id: `week-${s.issueNumber}-${s.slug}`,
  sourceSlug: "the-yay-news",
  sourceName: `The Yay News, issue ${s.issueNumber}`,
  sourceSections: [section],
  url: storyUrl(site, s),
  title: s.headline,
  summary: s.dek,
  // Grounding: the retelling may use only what we printed (which was grounded on its source).
  text: [s.kicker, s.headline, s.dek, ...s.body].join("\n\n"),
  imageUrl: s.images[0]?.url ?? null,
  imageCredit: s.images[0]?.credit ?? null,
  presetImages: s.images.slice(0, 1),
  imageLicence: null,
  embedUrl: null,
  publishedAt: new Date(`${s.date}T07:00:00Z`),
  fetchedAt,
  section,
  beat: OTHER_BEAT,
  topic: `week:${s.section}`,
  score: 10,
  reason,
});

/**
 * The chosen stories for each FROM_THE_WEEK page in `lineup`. Week in 10 takes Monday to Friday;
 * the Sunday pages take the whole past week.
 */
export function weeklyPicks(
  lineup: readonly SectionSlug[],
  week: WeekStory[],
  { date, site, now = new Date() }: { date: string; site: string; now?: Date },
): { picks: Map<SectionSlug, Classified[]>; awards: Map<string, string> } {
  const picks = new Map<SectionSlug, Classified[]>();
  /** Candidate id → the award (Hall of Fame kicker). */
  const awards = new Map<string, string>();
  const weekdays = week.filter((s) => {
    const d = new Date(`${s.date}T00:00:00Z`).getUTCDay();
    return d >= 1 && d <= 5;
  });
  const retold = (s: WeekStory) => s.page !== "back";
  if (lineup.includes("week-in-10")) {
    picks.set(
      "week-in-10",
      spread(weekdays.filter(retold), 10).map((s) =>
        asCandidate(
          s,
          "week-in-10",
          site,
          now,
          `one of the week's ten best (issue ${s.issueNumber})`,
        ),
      ),
    );
  }
  const used = new Set<string>();
  if (lineup.includes("hall-of-fame")) {
    const hall = hallOfFame(week.filter(retold));
    picks.set(
      "hall-of-fame",
      hall.map(({ story, award }) => {
        used.add(`${story.issueNumber}/${story.slug}`);
        const c = asCandidate(story, "hall-of-fame", site, now, `Hall of Fame: ${award}`);
        awards.set(c.id, award);
        return c;
      }),
    );
  }
  if (lineup.includes("photo-album")) {
    const pictured = week.filter(
      (s) => retold(s) && s.images.length && !used.has(`${s.issueNumber}/${s.slug}`),
    );
    picks.set(
      "photo-album",
      spread(pictured, 8).map((s) =>
        asCandidate(s, "photo-album", site, now, `one of the week's best pictures (${date})`),
      ),
    );
  }
  return { picks, awards };
}
