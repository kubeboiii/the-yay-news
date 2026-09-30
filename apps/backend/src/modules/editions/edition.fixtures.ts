// Test fixtures: editions shaped like the repository's records, and an in-memory stand-in for the
// repository that answers the same questions the Prisma queries do. Used only by *.test.ts files.

import { SERVED_STATUSES } from "./status.js";
import type { EditionRecord, editionRepository, StoryRecord } from "./edition.repository.js";

const at = new Date("2026-09-01T00:00:00.000Z");

const section = (slug: string, name: string, kind: "core" | "guest" = "core") => ({
  slug,
  name,
  tagline: `All about ${name}`,
  kind,
  colour: "#ff3d9a",
  voice: "witty" as const,
});

const discoveries = section("discoveries", "Discoveries");
const play = section("play", "Play");
const wordNerd = section("word-nerd", "Word Nerd", "guest");
const foodAndDrink = section("food-and-drink", "Food & Drink", "guest");

function story(
  id: string,
  pageId: string,
  order: number,
  slot: StoryRecord["slot"],
  sec: StoryRecord["section"],
  withImage = false,
  pulled = false,
): StoryRecord {
  return {
    id,
    editionId: "unused",
    pageId,
    order,
    slot,
    slug: id,
    sectionId: sec.slug,
    section: sec,
    kicker: "Kicker",
    headline: `Headline for ${id}`,
    dek: "A dek.",
    body: ["First paragraph.", "Second paragraph."],
    readMinutes: 1,
    sticker: null,
    sourceUrl: `https://example.com/${id}`,
    sourceName: "Example Source (sample)",
    embedUrl: null,
    isReserve: false,
    pulledAt: pulled ? at : null,
    pulledReason: pulled ? "A reader spotted a mistake" : null,
    createdAt: at,
    updatedAt: at,
    images: withImage
      ? [
          {
            id: `${id}-img`,
            storyId: id,
            order: 0,
            url: "https://images.unsplash.com/photo-1561479639-747efc0d0bf2",
            alt: "An orange octopus",
            credit: "NOAA",
            licence: "Unsplash License",
            licenceUrl: "https://unsplash.com/license",
            kind: "photo",
          },
        ]
      : [],
  };
}

export function makeEdition({
  issueNumber,
  date,
  status = "published",
  design = "broadsheet",
  colourway = "original",
  guest = false,
}: {
  issueNumber: number;
  date: string;
  status?: EditionRecord["status"];
  design?: EditionRecord["design"];
  colourway?: string;
  guest?: boolean;
}): EditionRecord {
  const id = `e${issueNumber}`;
  const p = (n: number) => `${id}-p${n}`;
  return {
    id,
    date: new Date(`${date}T00:00:00.000Z`),
    issueNumber,
    volume: 1,
    status,
    kind: "regular",
    design,
    colourway,
    guests: guest ? [{ section: wordNerd }, { section: foodAndDrink }] : [],
    createdAt: at,
    updatedAt: at,
    pages: [
      {
        id: p(1),
        editionId: id,
        order: 1,
        sectionId: null,
        section: null,
        layout: "front",
        stories: [story(`lead-${issueNumber}`, p(1), 1, "lead", discoveries, true)],
      },
      {
        id: p(2),
        editionId: id,
        order: 2,
        sectionId: "play",
        section: play,
        layout: "section",
        stories: [
          story(`game-a-${issueNumber}`, p(2), 1, "feature", play),
          story(`game-b-${issueNumber}`, p(2), 2, "brief", play),
          // Pulled by the admin: kept in the database, never served.
          story(`pulled-${issueNumber}`, p(2), -1, "brief", play, false, true),
        ],
      },
      {
        id: p(3),
        editionId: id,
        order: 3,
        sectionId: null,
        section: null,
        layout: "back",
        stories: [],
      },
    ],
    features: [
      {
        id: `${id}-f1`,
        editionId: id,
        type: "number_of_day",
        order: 0,
        content: { value: "12,408", caption: "picnic blankets" },
      },
      {
        id: `${id}-f2`,
        editionId: id,
        type: "weather",
        order: 0,
        content: { headline: "Sunny with scattered memes", detail: "Light drizzle of puns." },
      },
    ],
    puzzles: [
      {
        id: `${id}-z1`,
        editionId: id,
        type: "riddle",
        order: 0,
        data: { title: "The Riddle", question: `Riddle number ${issueNumber}?` },
        solution: { answer: `Answer ${issueNumber}` },
      },
      {
        id: `${id}-z2`,
        editionId: id,
        type: "word_search",
        order: 1,
        data: {
          title: "Word Search",
          theme: "Pets",
          grid: ["CATXX", "XDOGX", "XXXXX", "XXXXX", "XXXXX"],
          words: ["CAT", "DOG", "XXXXX"],
        },
        solution: {
          placements: [
            { word: "CAT", start: [0, 0], end: [0, 2] },
            { word: "DOG", start: [1, 1], end: [1, 3] },
            { word: "XXXXX", start: [4, 0], end: [4, 4] },
          ],
        },
      },
      {
        id: `${id}-z3`,
        editionId: id,
        type: "fortune_teller",
        order: 2,
        data: {
          title: "Fortune Teller",
          colours: ["RED", "BLUE", "TEAL", "LILAC"],
          numbers: [1, 2, 3, 4, 5, 6, 7, 8],
          fortunes: Array.from({ length: 8 }, (_, i) => `Fortune ${issueNumber}.${i + 1}`),
        },
        solution: {},
      },
    ],
  };
}

/** Issue 41 (Tue), 42 (Wed, with two guest sections), 43 (Thu, scheduled) and 44 (Fri, a draft). */
export const fixtureEditions = (): EditionRecord[] => [
  makeEdition({ issueNumber: 41, date: "2026-09-29", colourway: "acid-garden" }),
  makeEdition({ issueNumber: 42, date: "2026-09-30", guest: true }),
  makeEdition({
    issueNumber: 43,
    date: "2026-10-01",
    status: "scheduled",
    colourway: "blacklight",
  }),
  makeEdition({
    issueNumber: 44,
    date: "2026-10-02",
    status: "draft",
    colourway: "tropic-punch",
  }),
];

type Repository = typeof editionRepository;

/** The JS twin of `readableStoryWhere` (edition.repository.test.ts keeps the two in step). */
export const isReadable = (s: StoryRecord) => !s.isReserve && s.pulledAt === null;

/** What the Prisma include loads: only readable stories on each page. */
const loaded = (e: EditionRecord): EditionRecord => ({
  ...e,
  pages: e.pages.map((pg) => ({ ...pg, stories: pg.stories.filter(isReadable) })),
});

/** An in-memory repository over `editions`, with the same semantics as the Prisma queries. */
export function fakeRepository(stored: EditionRecord[]): Repository {
  const editions = stored.map(loaded);
  const newestFirst = [...editions].sort((a, b) => b.date.getTime() - a.date.getTime());
  const published = newestFirst.filter((e) =>
    (SERVED_STATUSES as readonly string[]).includes(e.status),
  );
  return {
    findByIssue: async (issue) => editions.find((e) => e.issueNumber === issue) ?? null,
    findByDate: async (date) => editions.find((e) => e.date.getTime() === date.getTime()) ?? null,
    findLatestServed: async (onOrBefore) => published.find((e) => e.date <= onOrBefore) ?? null,
    findPreviousPuzzles: async (before) => {
      const e = published.find((x) => x.date < before);
      return e ? { issueNumber: e.issueNumber, puzzles: e.puzzles } : null;
    },
    listServed: async ({ onOrBefore, before, take }) =>
      published
        .filter((e) => e.date <= onOrBefore && (!before || e.date < before))
        .slice(0, take)
        .map(({ pages, features: _f, puzzles: _p, ...e }) => ({
          ...e,
          stories: pages.flatMap((pg) => pg.stories).filter((s) => s.slot === "lead"),
        })),
  };
}
