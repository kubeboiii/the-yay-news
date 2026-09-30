import { BEATS, OTHER_BEAT } from "../src/beats.ts";
import type { WeekStory } from "../src/stages/weekly.ts";
import { CORE_SECTIONS, type Candidate, type Classified, type SectionSlug } from "../src/types.ts";

const PLACES = ["Leeds", "Osaka", "Porto", "Tromsø", "Galway", "Quito", "Hobart", "Lyon"];
const PEOPLE = [
  "Priya Natarajan",
  "Tomás Ferreira",
  "Aiko Tanaka",
  "Grace Okafor",
  "Lars Nilsson",
  "Maya Cohen",
];
const THINGS: Record<string, string[]> = {
  tech: [
    "a solar-powered bicycle",
    "an open-source weather station",
    "a tiny robot gardener",
    "a repair café",
  ],
  startups: ["a seed-swap app", "a bicycle courier co-op", "a tiny tea company", "a toy library"],
  screen: ["a stop-motion film", "a cosy detective series", "an anime short", "a village cinema"],
  play: [
    "an indie puzzle game",
    "a cosy farming game",
    "a pixel-art platformer",
    "a board-game café",
  ],
  music: ["a string quartet", "a brass band", "a choir of librarians", "a ukulele orchestra"],
  money: [
    "a coin collection",
    "a lemonade stand",
    "a record auction for a teapot",
    "a village bakery",
  ],
  sports: ["a village cricket team", "a rowing club", "a junior football side", "a climbing wall"],
  internet: [
    "a knitting forum",
    "a photo of a smiling dog",
    "a crowd-made mural",
    "a very long pun thread",
  ],
  discoveries: [
    "a family of otters",
    "a newly named moss",
    "a bright comet",
    "a colony of puffins",
  ],
  "word-nerd": [
    "a new word for drizzle",
    "a spelling bee",
    "a dictionary of dialect",
    "a pun club",
  ],
  "food-and-drink": [
    "a pie made of nine fruits",
    "a giant cheese wheel",
    "a noodle festival",
    "a community orchard",
  ],
  "time-machine": [
    "the first crossword",
    "a centenary of a teddy bear",
    "an early roller coaster",
    "the first postage stamp",
  ],
  "art-and-design": [
    "a paper sculpture",
    "a typeface made of leaves",
    "a library in a phone box",
    "a mural of bees",
  ],
};

/** Long, cheerful, blocklist-free source text with numbers and names the writer can quote. */
export function sourceText(section: string, n: number): string {
  const thing = THINGS[section]?.[n % 4] ?? "a small project";
  const place = PLACES[n % PLACES.length]!;
  const person = PEOPLE[n % PEOPLE.length]!;
  const count = 40 + n * 7;
  const year = 2000 + (n % 26);
  return [
    `In ${place}, ${thing} has become the talk of the town this week.`,
    `The project was started in ${year} by ${person}, who says it began as a weekend hobby.`,
    `Since then more than ${count} people have joined in, and the group meets every Saturday morning.`,
    `“We never expected it to grow like this, and we are thrilled,” said ${person}.`,
    `Visitors from ${PLACES[(n + 1) % PLACES.length]} have travelled to see it for themselves.`,
    `Local schools have started lessons inspired by the project, with ${count * 2} pupils taking part.`,
    `The group plans to share its instructions online so that anyone can try it at home.`,
    `A small exhibition about the project opens next month, with free entry for everyone.`,
    `Organisers say the best part is the friendships that have formed along the way.`,
    `Several neighbours have started similar projects of their own on nearby streets.`,
    `A local radio station has invited ${person} to talk about it on air next week.`,
    `The group keeps a scrapbook of every milestone, which now fills ${3 + (n % 5)} volumes.`,
    `Children who joined at the start now help to teach the newcomers.`,
    `Next spring, the organisers hope to host a festival celebrating everything they have made.`,
    `For now, they are simply enjoying the attention and the many cups of tea.`,
  ].join(" ");
}

let serial = 0;

const ADJ =
  "amber bouncy clever dapper eager fizzy gentle hearty jolly keen lively merry nimble perky quirky rosy sunny tidy upbeat vivid witty zesty breezy cheery dandy".split(
    " ",
  );
const NOUN =
  "badgers kettles lanterns marmots noodles orchards parrots quilts rockets sandcastles tulips umbrellas violins walruses yachts zebras acorns bagpipes cobblers dumplings".split(
    " ",
  );
const VERB = "charm dazzle enchant gladden amuse cheer inspire".split(" ");

/** Headlines that share no more than a word or two, so dedup keeps them apart. */
const titleFor = (n: number) =>
  `${ADJ[n % ADJ.length]} ${NOUN[(n * 7) % NOUN.length]} ${VERB[n % VERB.length]} ${PLACES[(n * 3) % PLACES.length]}`;

export function candidate(
  section: SectionSlug,
  n: number,
  extra: Partial<Candidate> = {},
): Candidate {
  serial++;
  const text = sourceText(section, n);
  return {
    id: `c${serial}`,
    sourceSlug: `source-${section}-${n % 3}`,
    sourceName: `The ${section} Gazette ${n % 3}`,
    sourceSections: [section],
    url: `https://example.org/${section}/${n}-${serial}`,
    title: titleFor(serial),
    summary: text.slice(0, 200),
    text,
    imageUrl: n % 2 === 0 ? `https://example.org/img/${section}-${n}.jpg` : null,
    imageCredit: null,
    imageLicence: null,
    embedUrl: null,
    publishedAt: new Date("2026-10-03T08:00:00Z"),
    fetchedAt: new Date("2026-10-03T09:00:00Z"),
    ...extra,
  };
}

export function classified(
  section: SectionSlug,
  n: number,
  extra: Partial<Classified> = {},
): Classified {
  return {
    ...candidate(section, n),
    section,
    topic: `${section}-${n % 5}`,
    beat: beatOf(section, n),
    score: 5 + (n % 5),
    reason: "fun",
    ...extra,
  };
}

/** The section's nth beat (data/beats.json), round and round; "other" when it has none. */
export const beatOf = (section: SectionSlug, n: number) => {
  const beats = Object.keys(BEATS[section] ?? {});
  return beats.length ? (beats[n % beats.length] as string) : OTHER_BEAT;
};

/** The daily sections and four guests with sources of their own. */
export const ALL_SECTIONS: SectionSlug[] = [
  ...CORE_SECTIONS,
  "word-nerd",
  "food-and-drink",
  "time-machine",
  "art-and-design",
];

/** A healthy day's haul: seven items per section, plus a planted grim story. */
export function daysHaul(): Candidate[] {
  const items = ALL_SECTIONS.flatMap((s) => Array.from({ length: 7 }, (_, n) => candidate(s, n)));
  items.push(PLANTED_GRIM());
  return items;
}

export const PLANTED_GRIM = () =>
  candidate("discoveries", 99, {
    title: "Rare whale calf spotted off the coast of Galway",
    summary: "Marine biologists were delighted by the sighting.",
    // The bad news is in the backstory, where only the full-text check can see it.
    text: `${sourceText("discoveries", 99)} The calf's mother died last year after a collision with a ship.`,
  });

/** A story printed in a past edition, for the weekend's pages built from the week. */
export function weekStory(
  date: string,
  section: string,
  n: number,
  extra: Partial<WeekStory> = {},
): WeekStory {
  const slug = `${section}-${date}-${n}`;
  return {
    slug,
    issueNumber: 40 + Number(date.slice(-2)),
    date,
    page: section,
    section,
    slot: n === 1 ? "feature" : "brief",
    order: n,
    kicker: "Good news",
    headline: `${titleFor(n + Number(date.slice(-2)) * 3)}, story ${n}`,
    dek: "A cheerful story from earlier in the week.",
    body: sourceText(section, n).split(". ").slice(0, 6),
    sourceName: `The ${section} Gazette`,
    images: [
      {
        url: `https://example.org/week/${slug}.jpg`,
        alt: "A picture",
        credit: "A photographer",
        licence: "CC BY 4.0",
        licenceUrl: "https://creativecommons.org/licenses/by/4.0/",
        kind: "photo",
      },
    ],
    ...extra,
  };
}
