// The Slow News Day edition (PLAN §9): when the pipeline can't produce a day's paper, it files
// this instead, built from a bank of timeless, cheerful items. Everything is chosen from the date,
// so the same date always gives the same paper, and each section's bank is walked in a fixed
// shuffled order so that consecutive slow days never repeat an item.

import { BROADSHEET_COLOURWAYS, isWeekend, PASTEL_COLOURWAYS, WEEKEND_DESIGNS } from "@repo/shared";
import { CORE_SECTIONS, type SectionSlug } from "../types.ts";
import { discoveries } from "./bank/discoveries.ts";
import { artAndDesign, foodAndDrink, shelf, wordNerd } from "./bank/guest.ts";
import { internet } from "./bank/internet.ts";
import { music } from "./bank/music.ts";
import { play, screen } from "./bank/screen-and-play.ts";
import { money, sports } from "./bank/sports-and-money.ts";
import { startups } from "./bank/startups.ts";
import { tech } from "./bank/tech.ts";
import type { DraftFeature, DraftStory, EditionDraft, EvergreenItem } from "./types.ts";

export type { DraftFeature, DraftStory, EditionDraft, EvergreenItem } from "./types.ts";

/** The source line on every evergreen story. They are our own words, from our own almanac. */
export const EVERGREEN_SOURCE = "The Yay News Almanac";

/**
 * Each section's bank, and how many items one slow day takes from it. Every daily section has a
 * bank, so a slow day prints the weekday lineup in full, three stories a page.
 */
export const BANKS = {
  tech: { items: tech, perDay: 3 },
  startups: { items: startups, perDay: 3 },
  screen: { items: screen, perDay: 3 },
  play: { items: play, perDay: 3 },
  music: { items: music, perDay: 3 },
  money: { items: money, perDay: 3 },
  sports: { items: sports, perDay: 3 },
  internet: { items: internet, perDay: 4 }, // front feature, three inside
  discoveries: { items: discoveries, perDay: 6 }, // front lead, three inside, two reserves
  // The guest sections with a bank run in pairs, the pairs taking turns (GUEST_PAIRS).
  "word-nerd": { items: wordNerd, perDay: 3 },
  "food-and-drink": { items: foodAndDrink, perDay: 3 },
  "art-and-design": { items: artAndDesign, perDay: 3 },
  shelf: { items: shelf, perDay: 3 },
} as const satisfies Partial<Record<SectionSlug, { items: EvergreenItem[]; perDay: number }>>;

type BankSection = keyof typeof BANKS;

/** A slow day's two guest pages: these pairs alternate day by day. */
export const GUEST_PAIRS = [
  ["word-nerd", "art-and-design"],
  ["food-and-drink", "shelf"],
] as const satisfies readonly (readonly [BankSection, BankSection])[];

const GUESTS = new Set<BankSection>(GUEST_PAIRS.flat());

/** The daily sections a slow day prints, in print order: every one with a bank. */
export const SLOW_DAY_LINEUP = CORE_SECTIONS.filter((s): s is BankSection => s in BANKS);

/**
 * The longest run of consecutive days guaranteed not to repeat an item. Each guest pair runs every
 * other day.
 */
export const NO_REPEAT_DAYS = Math.min(
  ...(Object.entries(BANKS) as [BankSection, (typeof BANKS)[BankSection]][]).map(
    ([section, b]) =>
      Math.floor(b.items.length / b.perDay) * (GUESTS.has(section) ? GUEST_PAIRS.length : 1),
  ),
);

// ——— Deterministic randomness ———

function hash(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 0x01000193);
  return h >>> 0;
}

function rng(seed: string) {
  let state = hash(seed);
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled<T>(items: readonly T[], seed: string): T[] {
  const next = rng(seed);
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [out[i], out[j]] = [out[j] as T, out[i] as T];
  }
  return out;
}

const DAY_MS = 24 * 60 * 60 * 1000;
const dayNumber = (date: string) => Math.floor(Date.parse(`${date}T00:00:00Z`) / DAY_MS);

/**
 * The items a section runs on a given turn: a window sliding along a fixed shuffle of its bank,
 * so turn n and turn n+1 never overlap while the bank lasts.
 */
function pick(section: BankSection, turn: number): EvergreenItem[] {
  const { items, perDay } = BANKS[section];
  const order = shuffled(items, `evergreen:${section}`);
  const start = (((turn * perDay) % order.length) + order.length) % order.length;
  return Array.from(
    { length: perDay },
    (_, i) => order[(start + i) % order.length] as EvergreenItem,
  );
}

const story = (item: EvergreenItem, extra: Partial<DraftStory> = {}): DraftStory => ({
  slug: item.slug,
  kicker: item.kicker,
  headline: item.headline,
  dek: item.dek,
  body: item.body,
  ...(item.sticker && { sticker: item.sticker }),
  source: EVERGREEN_SOURCE,
  ...extra,
});

// ——— The edition ———

const NOTE: DraftStory = {
  slug: "slow-news-day",
  section: "internet",
  slot: "brief",
  kicker: "A note from the desk",
  headline: "It's a slow news day, so we've opened the almanac",
  dek: "Nothing new came in that was good enough for you, so today's paper is full of old favourites.",
  body: [
    "Every morning we go looking for the best good news in the world, and every so often the world is having a quiet one. Rather than print something that isn't up to scratch, we've reached for our almanac: a big drawer of things that were true yesterday, are true today and will still be true tomorrow.",
    "So today you'll find otters and octopuses, inventions and oddities, and a small amount of trivia you are now legally obliged to tell someone at lunch. Normal service resumes tomorrow. Enjoy the slow lane.",
  ],
  source: EVERGREEN_SOURCE,
};

function features(date: string): DraftFeature[] {
  const total = Object.values(BANKS).reduce((n, b) => n + b.items.length, 0);
  const day = new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    weekday: "long",
    timeZone: "UTC",
  });
  return [
    {
      type: "number_of_day",
      content: {
        value: String(total),
        caption: "timeless things in the drawer we opened this morning",
      },
    },
    {
      type: "weather",
      content: {
        headline: `${day}: calm, with scattered facts`,
        detail:
          "A slow-moving front of trivia settles over the region by mid-morning, bringing light outbreaks of ‘did you know?’ and a strong chance of telling someone about otters.",
      },
    },
    {
      type: "correction",
      content: {
        text: "Nothing in today's paper happened yesterday. We regret nothing, and will be back to the news tomorrow.",
      },
    },
    {
      type: "classified",
      content: {
        heading: "WANTED",
        text: "Good news, any size, for tomorrow's paper. Otters considered. Apply to the desk.",
      },
    },
    {
      type: "sign_off",
      content: { text: "That's the almanac for today. Go and tell someone a fact." },
    },
  ];
}

/** The day's design: a broadsheet on weekdays, one of the weekend designs at weekends. */
function designFor(date: string) {
  const next = rng(`evergreen:design:${date}`);
  const choose = <T>(xs: readonly T[]) => xs[Math.floor(next() * xs.length)] as T;
  if (!isWeekend(date))
    return { design: "broadsheet" as const, colourway: choose(BROADSHEET_COLOURWAYS) };
  return { design: choose(WEEKEND_DESIGNS), colourway: choose(PASTEL_COLOURWAYS) };
}

/** Builds the Slow News Day edition for `date` (YYYY-MM-DD). Async for the pipeline's sake. */
export async function buildSlowNewsDay(date: string): Promise<EditionDraft> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) {
    throw new Error(`Not a calendar date: "${date}"`);
  }
  const day = dayNumber(date);
  const [lead, d1, d2, d3, r1, r2] = pick("discoveries", day) as [
    EvergreenItem,
    ...EvergreenItem[],
  ];
  const [feature, ...onPage] = pick("internet", day) as [EvergreenItem, ...EvergreenItem[]];
  const page = (section: BankSection, turn = day) => ({
    section,
    stories: pick(section, turn).map((item) => story(item)),
  });
  // The guest pairs take turns, so each guest counts its own turns.
  const guests = GUEST_PAIRS[day % GUEST_PAIRS.length] as readonly BankSection[];
  const guestTurn = Math.floor(day / GUEST_PAIRS.length);

  // The weekday lineup, every day: at weekends too, since the weekend pages (the week in review,
  // the weekend guide, next week's diary) are about the news and cannot come from a bank.
  const inside = SLOW_DAY_LINEUP.map((section) => {
    if (section === "discoveries") {
      return {
        section,
        stories: [
          ...[d1, d2, d3].map((item) => story(item as EvergreenItem)),
          ...[r1, r2].map((item) => story(item as EvergreenItem, { slot: "brief", reserve: true })),
        ],
      };
    }
    if (section === "internet") return { section, stories: onPage.map((item) => story(item)) };
    return page(section);
  });

  return {
    date,
    status: "scheduled",
    kind: "slow_news_day",
    ...designFor(date),
    front: [
      story(lead, { section: "discoveries", slot: "lead" }),
      NOTE,
      story(feature, { section: "internet", slot: "feature" }),
    ],
    inside: [...inside, ...guests.map((g) => page(g, guestTurn))],
    features: features(date),
  };
}
