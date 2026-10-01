// Letters & Classifieds: the one guest page with no sources. The writer makes it from the day's own
// stories: imaginary letters to the editor and playful small ads, each riffing on one printed story.
// They are openly made up (the page says so on every item) and are "from" obviously imaginary
// correspondents (a kettle, the pigeon on the windowsill), never a person, real or realistic. Every
// name and number in them must come from the story they riff on. If the model cannot manage that,
// stand-ins built from templates fill the page, so a day that draws this guest always runs it.
import { z } from "zod";
import { withData } from "../model/prompt-data.ts";
import type { Model } from "../model/types.ts";
import { VOICES } from "../rubric.ts";
import { hash, slugify } from "../text.ts";
import type { DraftStory, SectionSlug } from "../types.ts";
import { blocklistHit } from "./blocklist.ts";
import { factCheck } from "./factcheck.ts";
import { storyUrl } from "./weekly.ts";

export const LETTERS_SECTION: SectionSlug = "letters-and-classifieds";
/** Two letters (the page's features), then two small ads (its briefs). */
export const LETTERS_PER_PAGE = 2;
export const CLASSIFIEDS_PER_PAGE = 2;
export const CLASSIFIED_HEADINGS = ["WANTED", "FOR SALE", "FREE", "LOST", "FOUND", "SEEKING"];

/** One of today's printed stories, for a letter to riff on. */
export type LetterSource = { slug: string; headline: string; section: string; sourceText: string };
export type LettersInput = {
  date: string;
  stories: { id: string; headline: string; section: string; sourceText: string }[];
};

export const letterItemSchema = z.object({
  kind: z.enum(["letter", "classified"]),
  /** For a classified: WANTED, FOR SALE, FREE, LOST, FOUND or SEEKING. */
  heading: z.string().max(20).optional(),
  storyId: z.string(),
  headline: z.string().min(10).max(160),
  dek: z.string().min(10).max(260),
  body: z.array(z.string().min(1)).min(1).max(3),
  signOff: z.string().min(3).max(80),
});
export const lettersReplySchema = z.object({ items: z.array(letterItemSchema).min(1).max(8) });
export type LetterItem = z.infer<typeof letterItemSchema>;

const INSTRUCTIONS = `
Write today's Letters & Classifieds page for The Yay News: ${LETTERS_PER_PAGE} imaginary letters to the
editor and ${CLASSIFIEDS_PER_PAGE} playful small ads. Each one riffs on ONE of today's stories below
(give its id as storyId); use a different story for each. Voice: ${VOICES.quirky}

- They are openly made up. The joke is a reader's delighted reaction to the story, never new news.
- The writer (signOff) is an obviously imaginary correspondent: an object, an animal, a place or a
  playful description, starting with "A", "An" or "The" and otherwise all lower case, e.g. "A kettle
  with opinions", "The pigeon on the windowsill", "A reader who has now read the otter story nine
  times". NEVER a person's name, never a real or realistic person, never a real organisation.
- Every name and number you mention must appear in that story's sourceText. Add no facts.
- Letters: kind "letter", headline a playful sentence (8 to 16 words, no colon, no exclamation
  mark), a one-sentence dek, and a body of one or two short paragraphs that opens "Dear Editor,".
- Classifieds: kind "classified", heading one of ${CLASSIFIED_HEADINGS.join(", ")}, a playful
  headline, a one-sentence dek and a body of one short paragraph.
- British English. Nothing sad, dangerous or bad, not even as a joke. No emoji.
`;

/** Capitalised words a letter may use without a source. */
const LETTER_WORDS = new Set([
  "Dear",
  "Editor",
  "Yay",
  "News",
  "P.S",
  "PS",
  "I'm",
  "I've",
  "I'd",
  "I'll",
  "I’m",
  "I’ve",
  "I’d",
  "I’ll",
  ...CLASSIFIED_HEADINGS.flatMap((h) => h.split(" ")),
]);

/** Sign-offs that name or describe a person ("called Margaret", "Mrs T", "from Leeds, aged 9"). */
const PERSONAL =
  /\b(called|named|aka|known as|mr|mrs|ms|miss|dr|aged|age \d|years old|grandma|grandad|granny|mum|dad|auntie|uncle|neighbour|reader from)\b|,\s*\p{Lu}/iu;

const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/** Everything wrong with one item, checked against the story it riffs on. */
export function letterProblems(item: LetterItem, story: LetterSource | undefined): string[] {
  if (!story) return ["unknown story"];
  const problems: string[] = [];
  const text = [item.headline, item.dek, ...item.body, item.signOff].join("\n");
  const grim = blocklistHit(text);
  if (grim) problems.push(`mentions "${grim.word}"`);
  const fc = factCheck(text, `${story.headline}\n${story.sourceText}`);
  const missing = fc.missing.filter((m) => m.kind === "number" || !LETTER_WORDS.has(m.value));
  for (const m of missing) problems.push(`${m.kind} "${m.value}" is not in the story`);
  // The correspondent is imaginary: "A/An/The" something, naming nobody. Names it borrows (a
  // place, a planet, an app) must come from the story, which the fact check above sees to.
  if (!/^(a|an|the)\s/i.test(item.signOff) || PERSONAL.test(item.signOff))
    problems.push(`sign-off "${item.signOff}" could read as a real person`);
  if (
    item.kind === "classified" &&
    !CLASSIFIED_HEADINGS.includes((item.heading ?? "").toUpperCase())
  )
    problems.push("classified without a heading");
  return problems;
}

const LETTER_TEMPLATES = [
  {
    headline: "A kettle would like to register its delight with today's paper",
    dek: "It read one story three times and boiled over with joy.",
    body: (h: string) =>
      `Dear Editor, I read “${h}” over breakfast and have been whistling ever since. Please print more of this sort of thing.`,
    signOff: "A kettle on the kitchen counter",
  },
  {
    headline: "The pigeon on the windowsill has read the paper again",
    dek: "It has one request, and it is mostly about crumbs.",
    body: (h: string) =>
      `Dear Editor, I pecked my way through “${h}” and would like it framed. Also crumbs. Mostly crumbs.`,
    signOff: "The pigeon on the windowsill",
  },
  {
    headline: "A houseplant writes to say it grew a new leaf over the news",
    dek: "It credits sunlight, water and one story in particular.",
    body: (h: string) =>
      `Dear Editor, since you printed “${h}” I have put out a brand-new leaf. Coincidence? I think not.`,
    signOff: "A houseplant by the window",
  },
  {
    headline: "A very patient snail has finally reached the end of a story",
    dek: "It set off on Monday and regrets nothing.",
    body: (h: string) =>
      `Dear Editor, it took me a while to get through “${h}”, but it was worth every millimetre.`,
    signOff: "A very patient snail",
  },
];

const CLASSIFIED_TEMPLATES = [
  {
    heading: "WANTED",
    headline: "Wanted, one more story as cheerful as today's, will pay in biscuits",
    dek: "Applicants should be sunny, factual and fond of tea.",
    body: (h: string) =>
      `Another story as good as “${h}”. Biscuits offered. No reasonable offer refused.`,
    signOff: "The biscuit tin in the back office",
  },
  {
    heading: "FOUND",
    headline: "Found near today's paper, one very good mood that answers to yay",
    dek: "The owner may collect it at any time, no questions asked.",
    body: (h: string) =>
      `One good mood, last seen near “${h}”. Please collect it before it cheers up everybody else.`,
    signOff: "The lost property desk",
  },
  {
    heading: "FREE",
    headline: "Free to a good home, one spare smile left over from the news",
    dek: "Slightly used, still works, fits all faces.",
    body: (h: string) =>
      `One spare smile, left over after reading “${h}”. Collect in person, or simply turn the page.`,
    signOff: "A generous armchair",
  },
  {
    heading: "SEEKING",
    headline: "Seeking a pen pal who also enjoyed today's good news very much",
    dek: "Must like stories, stamps and the occasional pun.",
    body: (h: string) =>
      `A pen pal to discuss “${h}” at great length. Stamps provided, puns expected.`,
    signOff: "A postbox with a lot of time",
  },
];

/** Stand-in letters (or small ads) built from templates, one per story given. */
export function templateLetters(
  date: string,
  stories: { id: string; headline: string }[],
  kind: LetterItem["kind"],
): LetterItem[] {
  const k = hash(`${date}-${kind}`);
  return stories.map((s, i) => {
    const h = s.headline.replace(/[.!]$/, "");
    if (kind === "letter") {
      const t = LETTER_TEMPLATES[(k + i) % LETTER_TEMPLATES.length]!;
      return {
        kind,
        storyId: s.id,
        headline: t.headline,
        dek: t.dek,
        body: [t.body(h)],
        signOff: t.signOff,
      };
    }
    const t = CLASSIFIED_TEMPLATES[(k + i) % CLASSIFIED_TEMPLATES.length]!;
    return {
      kind,
      heading: t.heading,
      storyId: s.id,
      headline: t.headline,
      dek: t.dek,
      body: [t.body(h)],
      signOff: t.signOff,
    };
  });
}

/** The stories a page's letters riff on: page mains first, one per section. */
export function lettersSources<T extends LetterSource>(stories: T[], n: number): T[] {
  const out: T[] = [];
  const sections = new Set<string>();
  for (const s of stories) {
    if (out.length >= n) break;
    if (sections.has(s.section)) continue;
    sections.add(s.section);
    out.push(s);
  }
  for (const s of stories) if (out.length < n && !out.includes(s)) out.push(s);
  return out;
}

export type LettersOutcome = { stories: DraftStory[]; problems: string[] };

/**
 * The Letters & Classifieds page's stories, from the day's printed stories (best first). Items that
 * fail their checks are replaced by template stand-ins about other stories.
 */
export async function writeLetters(
  model: Model,
  {
    date,
    issueNumber,
    site,
    stories,
    takenSlugs = new Set<string>(),
  }: {
    date: string;
    issueNumber: number;
    site: string;
    stories: LetterSource[];
    takenSlugs?: Set<string>;
  },
): Promise<LettersOutcome> {
  const want = LETTERS_PER_PAGE + CLASSIFIEDS_PER_PAGE;
  const pool = lettersSources(stories, 12);
  const byId = new Map(pool.map((s) => [s.slug, s]));
  const problems: string[] = [];
  let items: LetterItem[] = [];
  if (pool.length) {
    try {
      const input: LettersInput = {
        date,
        stories: pool.map((s) => ({
          id: s.slug,
          headline: s.headline,
          section: s.section,
          sourceText: s.sourceText.slice(0, 1500),
        })),
      };
      const reply = await model.complete(withData(INSTRUCTIONS, input), {
        tier: "writer",
        schema: lettersReplySchema,
        task: "letters",
      });
      const used = new Set<string>();
      for (const item of reply.items) {
        const p = letterProblems(item, byId.get(item.storyId));
        if (used.has(item.storyId)) p.push("second item about the same story");
        if (p.length) problems.push(`dropped a ${item.kind}: ${p.join("; ")}`);
        else {
          items.push(item);
          used.add(item.storyId);
        }
      }
    } catch (e) {
      problems.push(`letters call failed, using stand-ins: ${(e as Error).message}`);
    }
  }
  // Letters first, then small ads; top each kind up from the templates, about stories not yet used.
  const letters = items.filter((i) => i.kind === "letter").slice(0, LETTERS_PER_PAGE);
  const ads = items.filter((i) => i.kind === "classified").slice(0, CLASSIFIEDS_PER_PAGE);
  const free = pool
    .filter((s) => ![...letters, ...ads].some((i) => i.storyId === s.slug))
    .map((s) => ({ id: s.slug, headline: s.headline }));
  const needLetters = LETTERS_PER_PAGE - letters.length;
  letters.push(...templateLetters(date, free.slice(0, needLetters), "letter"));
  ads.push(
    ...templateLetters(
      date,
      free.slice(needLetters, needLetters + CLASSIFIEDS_PER_PAGE - ads.length),
      "classified",
    ),
  );
  if (letters.length + ads.length < want && pool.length)
    problems.push(`only ${letters.length + ads.length} letters and ads`);
  items = [...letters, ...ads];

  const slugs = new Set(takenSlugs);
  const uniqueSlug = (headline: string) => {
    const base = slugify(headline);
    let slug = base;
    for (let n = 2; slugs.has(slug); n++) slug = `${base}-${n}`;
    slugs.add(slug);
    return slug;
  };
  const out = items.map((item, i): DraftStory => {
    const story = byId.get(item.storyId)!;
    const note =
      item.kind === "letter"
        ? `(An imaginary letter, inspired by today's story “${story.headline.replace(/[.!]$/, "")}”.)`
        : `(An imaginary small ad, inspired by today's story “${story.headline.replace(/[.!]$/, "")}”.)`;
    const body =
      item.kind === "letter"
        ? [...item.body, `— ${item.signOff}`, note]
        : [...item.body, `Reply to: ${lowerFirst(item.signOff)}.`, note];
    return {
      slug: uniqueSlug(item.headline),
      slot: i < 2 ? "feature" : "brief",
      section: LETTERS_SECTION,
      kicker: item.kind === "letter" ? "Letters" : (item.heading ?? "Classifieds").toUpperCase(),
      headline: item.headline,
      dek: item.dek,
      body,
      readMinutes: 1,
      sticker: null,
      sourceUrl: storyUrl(site, { issueNumber, slug: story.slug }),
      sourceName: "The Yay News letters desk",
      embedUrl: null,
      images: [],
      isReserve: false,
      beat: item.kind === "letter" ? "letters" : "classifieds",
    };
  });
  return { stories: out, problems };
}
