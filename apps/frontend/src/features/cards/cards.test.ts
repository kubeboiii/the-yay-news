// Unit tests for Yay Attax's pure logic: `node --test src/features/cards/cards.test.ts`.

import assert from "node:assert/strict";
import { test } from "node:test";
import type { HabitEvent } from "../habits/core.ts";
import { mergeEvents } from "../habits/core.ts";
import { act, cpuDeck, cpuMove, createBattle, DECK_SIZE, typeMultiplier } from "./battle.ts";
import { boxKey, collectionOf, dipKey, evolvable, luckOn, scratchKey } from "./collection.ts";
import { isReleased, LAUNCH_DATE, nextDrop, PLANNED, releasedCards } from "./drops.ts";
import { drawCards, leaguesOn, oddsFor, poolFor, randomLeague, rarityFor } from "./draw.ts";
import { ALL_CARDS, CARD_BY_ID } from "./leagues/index.ts";
import { ERA_FLOOR, LEAGUES, RARITY_RANK } from "./leagues/meta.ts";
import { seasonOn } from "./seasons.ts";
import { completeSets, setsOf } from "./sets.ts";
import { LEAGUE_IDS } from "./types.ts";

let n = 0;
const ev = (e: Record<string, unknown>, at = "2026-10-04T10:00:00.000Z"): HabitEvent =>
  ({ id: `e${String(++n).padStart(4, "0")}`, at, ...e }) as HabitEvent;

const finished = (issue: number, date: string) =>
  ev({ type: "edition_finished", issue, date, design: "broadsheet", colourway: "original" });

test("data: every card is well-formed, 1–99, unique, with a known league", () => {
  const ids = new Set<string>();
  for (const c of ALL_CARDS) {
    assert.ok(!ids.has(c.id), `duplicate ${c.id}`);
    ids.add(c.id);
    assert.match(c.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/);
    assert.equal(c.stats.length, 4);
    for (const s of c.stats) assert.ok(Number.isInteger(s) && s >= 1 && s <= 99, `${c.id} ${s}`);
    assert.ok(c.bio.length > 10 && c.bio.length < 110, `${c.id} bio length`);
    assert.ok(LEAGUES[c.league]);
    if (c.evolvesTo) assert.ok(CARD_BY_ID.has(`${c.league}:${c.evolvesTo}`), c.id);
  }
  for (const l of LEAGUE_IDS)
    assert.ok(
      ALL_CARDS.some((c) => c.league === l),
      l,
    );
});

test("data: older eras are rarer, legends are Legendary or Epic", () => {
  for (const c of ALL_CARDS) {
    assert.ok(RARITY_RANK[c.rarity] >= RARITY_RANK[ERA_FLOOR[c.era]], `${c.id} ${c.era}`);
  }
  assert.ok(ALL_CARDS.filter((c) => c.era === "legend").every((c) => c.rarity !== "common"));
});

test("data: Pokémon stats follow their official base stats", () => {
  const pika = CARD_BY_ID.get("pokemon:pikachu")!;
  assert.deepEqual(pika.base, [35, 55, 40, 90]);
  assert.deepEqual(pika.stats, [39, 50, 42, 70]);
  const mewtwo = CARD_BY_ID.get("pokemon:mewtwo")!;
  assert.equal(mewtwo.stats[1], 99);
});

test("drops: launch with 50 cards; only released cards; the next drop is announced", () => {
  assert.equal(releasedCards(LAUNCH_DATE).length, 50);
  assert.equal(releasedCards("2026-09-30").length, 0);
  assert.ok(isReleased({ releasedOn: "2026-10-01" }, "2026-10-04"));
  assert.ok(!isReleased({ releasedOn: "2026-10-07" }, "2026-10-04"));
  assert.ok(PLANNED.length >= 2);
  const next = nextDrop("2026-10-04");
  assert.ok(next && next.date > "2026-10-04");
  assert.equal(nextDrop("2026-10-01")?.date, "2026-10-04");
});

test("seasons: dates map to their season; before the first is the first", () => {
  assert.equal(seasonOn("2026-09-27").n, 1);
  assert.equal(seasonOn("2026-11-15").n, 1);
  assert.equal(seasonOn("2027-02-01").n, 2);
  // Season 2 has no cards written yet: its packs would be empty, not Season 1's.
  assert.equal(poolFor("2027-02-01").length, 0);
  assert.equal(poolFor("2026-10-04").length, 50);
  assert.equal(poolFor("2026-10-04", "pokemon").length, 5);
  assert.equal(leaguesOn("2026-10-04").length, 12);
});

test("draws are seeded, distinct within a reward, and respect the league", () => {
  const pool = poolFor("2026-10-04", "football");
  const a = drawCards({ pool, kind: "box", seed: "dev:bx:42" });
  const b = drawCards({ pool, kind: "box", seed: "dev:bx:42" });
  assert.deepEqual(
    a.map((c) => c.id),
    b.map((c) => c.id),
  );
  assert.equal(a.length, 3);
  assert.equal(new Set(a.map((c) => c.id)).size, 3);
  assert.ok(a.every((c) => c.league === "football"));
  assert.equal(drawCards({ pool, kind: "scratch", seed: "x" }).length, 1);
  assert.equal(drawCards({ pool, kind: "dip", seed: "x" }).length, 2);
  assert.equal(randomLeague("2026-10-04", "s"), randomLeague("2026-10-04", "s"));
});

test("odds: ~62/25/10/3, streaks help, the dip is never Common", () => {
  const counts = { common: 0, rare: 0, epic: 0, legendary: 0 };
  for (let i = 0; i < 10000; i++) counts[rarityFor((i + 0.5) / 10000, 0)]++;
  assert.equal(counts.legendary, 300);
  assert.equal(counts.epic, 1000);
  assert.equal(counts.rare, 2500);
  const lucky = oddsFor(20);
  assert.ok(lucky[3] > 0.03 && lucky[0] < 0.62);
  assert.ok(Math.abs(lucky.reduce((s, x) => s + x, 0) - 1) < 1e-9);
  for (let i = 0; i < 100; i++) assert.notEqual(rarityFor(i / 100, 0, true), "common");
});

test("a milestone reward has an Epic or better", () => {
  for (let i = 0; i < 30; i++) {
    const cards = drawCards({
      pool: poolFor("2026-10-04"),
      kind: "box",
      seed: `m${i}`,
      milestone: true,
    });
    assert.ok(cards.some((c) => RARITY_RANK[c.rarity] >= 2));
  }
});

test("collection: rewards pending per finished paper, the Sunday dip, dupes pay coins", () => {
  const events = [finished(42, "2026-09-30"), finished(39, "2026-09-27")];
  let col = collectionOf(events);
  assert.deepEqual(
    col.pending.map((p) => p.key),
    [scratchKey(42), boxKey(42), scratchKey(39), boxKey(39), dipKey(39)],
  );
  const open = ev({ type: "box_opened", pack: boxKey(42), issue: 42, league: "nba", chosen: true });
  const pulls = ["nba:stephen-curry", "nba:stephen-curry", "nba:kobe-bryant"].map((card) =>
    ev({ type: "card_pulled", from: open.id, card }),
  );
  col = collectionOf([...events, open, ...pulls]);
  assert.equal(col.owned.size, 2);
  assert.equal(col.owned.get("nba:stephen-curry")!.copies, 2);
  assert.equal(col.coins, 1);
  assert.ok(!col.pending.some((p) => p.key === boxKey(42)));
  // A bought box costs coins; unknown cards are skipped.
  const buy = ev({ type: "box_opened", pack: "b:1", league: "f1", chosen: true, cost: 12 });
  const junk = ev({ type: "card_pulled", from: buy.id, card: "f1:nobody" });
  col = collectionOf([...events, open, ...pulls, buy, junk]);
  assert.equal(col.coins, 0);
});

test("collection merges: a reward opened on two devices counts once", () => {
  const f = finished(42, "2026-09-30");
  const a = ev(
    { type: "scratch_revealed", pack: scratchKey(42), issue: 42 },
    "2026-10-04T10:00:00Z",
  );
  const ac = ev({ type: "card_pulled", from: a.id, card: "tv:eleven" }, "2026-10-04T10:00:00Z");
  const b = ev(
    { type: "scratch_revealed", pack: scratchKey(42), issue: 42 },
    "2026-10-04T11:00:00Z",
  );
  const bc = ev(
    { type: "card_pulled", from: b.id, card: "tv:walter-white" },
    "2026-10-04T11:00:00Z",
  );
  const one = mergeEvents([f, a, ac], [f, b, bc]);
  const two = mergeEvents([f, b, bc], [f, a, ac]);
  assert.deepEqual([...collectionOf(one).owned.keys()], ["tv:eleven"]);
  assert.deepEqual(collectionOf(one), collectionOf(two));
});

test("evolving: three copies, held unpaid, evolve once, then dupes pay", () => {
  const open = ev({ type: "box_opened", pack: "bx:1", issue: 1, league: "pokemon", chosen: true });
  const pull = () => ev({ type: "card_pulled", from: open.id, card: "pokemon:charmander" });
  const three = [open, pull(), pull(), pull()];
  let col = collectionOf(three);
  assert.equal(col.coins, 0);
  assert.deepEqual(
    evolvable(col).map((x) => x.to.id),
    ["pokemon:charmeleon"],
  );
  const evo = ev({ type: "card_evolved", from: "pokemon:charmander", to: "pokemon:charmeleon" });
  col = collectionOf([...three, evo, { ...evo, id: "zz-second-device" }]);
  assert.ok(col.owned.has("pokemon:charmeleon"));
  assert.equal(col.owned.get("pokemon:charmander")!.copies, 1);
  assert.equal(evolvable(col).length, 0);
  col = collectionOf([...three, evo, pull()]);
  assert.equal(col.coins, 1);
});

test("classic (news) cards stay in their own archive and keep their coins", () => {
  const pack = ev({ type: "pack_opened", pack: "d:30", issue: 30, kind: "daily" });
  const card = {
    id: "30:penguins",
    issue: 30,
    slug: "penguins",
    date: "2026-09-18",
    name: "Penguins",
    kicker: "Animals",
    type: "animal",
    sec: { slug: "a", name: "A", colour: "#000" },
    summary: "",
    photo: null,
    alt: "",
    stats: { wow: 1, giggle: 1, aww: 1, reach: 1 },
    lead: false,
    hof: false,
    rarity: "rare",
  };
  const col = collectionOf([
    pack,
    ev({ type: "card_collected", pack: pack.id, card }),
    ev({ type: "card_collected", pack: pack.id, card }),
  ]);
  assert.equal(col.classic.size, 1);
  assert.equal(col.owned.size, 0);
  assert.equal(col.coins, 2);
});

test("luck: the streak on a paper's date", () => {
  const events = ["2026-09-28", "2026-09-29", "2026-09-30"].map((d, i) => finished(40 + i, d));
  assert.deepEqual(luckOn(events, "2026-09-30"), { streak: 3, milestone: true });
});

test("sets: a season set per league, and an Eras set, completion", () => {
  const sets = setsOf(releasedCards("2026-10-04"));
  const nba = sets.find((s) => s.id === "nba:s1")!;
  assert.equal(nba.members.length, 4);
  const eras = sets.find((s) => s.id === "nba:s1:eras")!;
  assert.deepEqual(eras.members, ["nba:kobe-bryant", "nba:michael-jordan"]);
  const owned = new Set(eras.members);
  assert.deepEqual(
    completeSets(sets, owned).map((s) => s.id),
    ["nba:s1:eras"],
  );
});

test("battle: types, a full game plays out, seeded", () => {
  assert.equal(typeMultiplier("water", "fire/flying"), 1.5);
  assert.equal(typeMultiplier("fire", "water"), 0.6);
  assert.equal(typeMultiplier("electric", "water/flying"), 2.25);
  const released = releasedCards("2026-10-04");
  const mine = released.filter((c) => c.league === "football").slice(0, DECK_SIZE);
  const theirs = cpuDeck(released, mine, "s1");
  assert.equal(theirs.length, DECK_SIZE);
  assert.ok(theirs.every((c) => !mine.includes(c)));
  const play = () => {
    let s = createBattle(mine, theirs, "s1");
    for (let i = 0; i < 400 && !s.winner; i++) s = act(s, cpuMove(s));
    return s;
  };
  const a = play();
  assert.ok(a.winner);
  assert.deepEqual(a.log, play().log);
  // Each card's special is used at most once.
  const specials = a.log.filter((l) => l.move === "special").map((l) => `${l.side}:${l.by}`);
  assert.equal(new Set(specials).size, specials.length);
});

test("battle: UFC iron chin survives one knockout blow", () => {
  const khabib = CARD_BY_ID.get("ufc:khabib-nurmagomedov")!;
  const goku = CARD_BY_ID.get("anime:goku")!;
  let s = createBattle([goku], [khabib], "chin");
  s = { ...s, turn: "you", cpu: s.cpu.map((f) => ({ ...f, hp: 2 })) };
  s = act(s, "special");
  assert.equal(s.cpu[0]!.hp, 1);
  assert.ok(s.log[0]!.notes.some((x) => x.includes("Iron chin")));
});
