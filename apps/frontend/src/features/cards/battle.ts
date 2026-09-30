// Yay Attax Deck Battle: the pure rules (the screen is battle.tsx). Five cards a side, from one
// league or many. The front card of each deck fights; sides take turns. On your turn your card
// either STRIKES (its attack stat) or uses its SPECIAL (once per card, 1.4×). A card knocked out
// is replaced by the next in its deck; knock out all five to win.
//
//   HP      40 + 0.6 × the average of its four stats (Pokémon: 40 + 0.8 × HP)
//   damage  attack × mult × 60 / (60 + defence) × 1.1, ±15%, at least 3
// Each league brings its own rule (leagues/meta.ts `rule`): Pokémon types, WWE finishers, club
// chemistry, IPL clutch, UFC iron chin, heroes vs villains, the Omnitrix, anime power-ups, F1
// rain and TV fan favourites. Seeded, so a battle replays the same from its seed and moves.

import { hash, rng, shuffle } from "./draw.ts";
import { LEAGUES, RARITY_RANK } from "./leagues/meta.ts";
import type { Card } from "./types.ts";

export type Side = "you" | "cpu";
export type Move = "strike" | "special";

export type Fighter = {
  card: Card;
  hp: number;
  max: number;
  usedSpecial: boolean;
  chinUsed: boolean;
  /** Turns to skip (the Omnitrix timing out). */
  resting: number;
};

export type LogEntry = {
  side: Side;
  by: string;
  target: string;
  move: Move | "rest";
  damage: number;
  /** Notes on what happened: "Super effective!", "Dodged!"… */
  notes: string[];
  ko: boolean;
};

export type BattleState = {
  seed: string;
  rolls: number;
  you: Fighter[];
  cpu: Fighter[];
  turn: Side;
  wet: boolean;
  log: LogEntry[];
  winner: Side | null;
};

// ——— Pokémon types (attacking type → defending types it's strong against / resisted by) ———

const STRONG: Record<string, string[]> = {
  normal: [],
  fire: ["grass", "ice", "bug", "steel"],
  water: ["fire", "ground", "rock"],
  electric: ["water", "flying"],
  grass: ["water", "ground", "rock"],
  ice: ["grass", "ground", "flying", "dragon"],
  fighting: ["normal", "ice", "rock", "dark", "steel"],
  poison: ["grass", "fairy"],
  ground: ["fire", "electric", "poison", "rock", "steel"],
  flying: ["grass", "fighting", "bug"],
  psychic: ["fighting", "poison"],
  bug: ["grass", "psychic", "dark"],
  rock: ["fire", "ice", "flying", "bug"],
  ghost: ["psychic", "ghost"],
  dragon: ["dragon"],
  dark: ["psychic", "ghost"],
  steel: ["ice", "rock", "fairy"],
  fairy: ["fighting", "dragon", "dark"],
};

const WEAK: Record<string, string[]> = {
  normal: ["rock", "steel", "ghost"],
  fire: ["fire", "water", "rock", "dragon"],
  water: ["water", "grass", "dragon"],
  electric: ["electric", "grass", "dragon", "ground"],
  grass: ["fire", "grass", "poison", "flying", "bug", "dragon", "steel"],
  ice: ["fire", "water", "ice", "steel"],
  fighting: ["poison", "flying", "psychic", "bug", "fairy", "ghost"],
  poison: ["poison", "ground", "rock", "ghost", "steel"],
  ground: ["grass", "bug", "flying"],
  flying: ["electric", "rock", "steel"],
  psychic: ["psychic", "steel", "dark"],
  bug: ["fire", "fighting", "poison", "flying", "ghost", "steel", "fairy"],
  rock: ["fighting", "ground", "steel"],
  ghost: ["dark", "normal"],
  dragon: ["steel", "fairy"],
  dark: ["fighting", "dark", "fairy"],
  steel: ["fire", "water", "electric", "steel"],
  fairy: ["fire", "poison", "steel"],
};

/** A Pokémon's attack against another's types: 1.5 per weakness hit, 0.6 per resistance. */
export function typeMultiplier(attacker: string, defender: string): number {
  const atk = attacker.split("/")[0] ?? "normal";
  let m = 1;
  for (const t of defender.split("/")) {
    if (STRONG[atk]?.includes(t)) m *= 1.5;
    else if (WEAK[atk]?.includes(t)) m *= 0.6;
  }
  return Math.max(0.36, Math.min(2.25, m));
}

// ——— Setting up ———

export const DECK_SIZE = 5;

const avg = (c: Card) => (c.stats[0] + c.stats[1] + c.stats[2] + c.stats[3]) / 4;

export const hpOf = (c: Card) =>
  Math.round(c.league === "pokemon" ? 40 + 0.8 * c.stats[0] : 40 + 0.6 * avg(c));

const fighter = (card: Card): Fighter => {
  const max = hpOf(card);
  return { card, hp: max, max, usedSpecial: false, chinUsed: false, resting: 0 };
};

export function createBattle(
  you: readonly Card[],
  cpu: readonly Card[],
  seed: string,
): BattleState {
  const r = rng(hash(`battle:${seed}`));
  const wet = r() < 0.3;
  const a = you[0];
  const b = cpu[0];
  const first: Side = a && b && speedOf(b, wet) > speedOf(a, wet) ? "cpu" : "you";
  return {
    seed,
    rolls: 0,
    you: you.map(fighter),
    cpu: cpu.map(fighter),
    turn: first,
    wet,
    log: [],
    winner: null,
  };
}

const speedOf = (c: Card, wet: boolean) =>
  c.stats[LEAGUES[c.league].roles.spd]! + (wet && c.league === "f1" ? c.stats[3] - c.stats[0] : 0);

/**
 * The computer's deck: for each of your cards, a released card from the same league of about
 * the same rarity (never one of yours), shuffled.
 */
export function cpuDeck(pool: readonly Card[], yours: readonly Card[], seed: string): Card[] {
  const out: Card[] = [];
  const mine = new Set(yours.map((c) => c.id));
  const all = shuffle(pool, `cpu:${seed}`);
  for (const c of yours) {
    const taken = (x: Card) => mine.has(x.id) || out.includes(x);
    const near = (x: Card) => Math.abs(RARITY_RANK[x.rarity] - RARITY_RANK[c.rarity]);
    const options = all
      .filter((x) => !taken(x))
      .sort(
        (x, y) =>
          (x.league === c.league ? 0 : 2) + near(x) - ((y.league === c.league ? 0 : 2) + near(y)),
      );
    const pick = options[0] ?? all.find((x) => !out.includes(x));
    if (pick) out.push(pick);
  }
  return shuffle(out, `cpu-order:${seed}`);
}

// ——— Playing ———

export const active = (list: readonly Fighter[]) => list.find((f) => f.hp > 0) ?? null;
export const alive = (list: readonly Fighter[]) => list.filter((f) => f.hp > 0).length;

const HERO_SIDES = new Set(["marvel", "dc"]);

/** What a move would do, before the dice: the multiplier and the notes for it. */
function sizeUp(state: BattleState, side: Side, move: Move) {
  const mine = state[side];
  const theirs = state[side === "you" ? "cpu" : "you"];
  const f = active(mine)!;
  const t = active(theirs)!;
  const c = f.card;
  const L = LEAGUES[c.league];
  const notes: string[] = [];
  let atk = c.stats[move === "special" ? L.roles.special : L.roles.atk]!;
  if (c.league === "f1" && state.wet && move === "strike") {
    atk = c.stats[3];
    notes.push("Wet track: attacks with Wet.");
  }
  let mult = move === "special" ? 1.4 : 1;
  if (move === "special") {
    if (c.league === "wwe") mult = 1.8;
    if (c.league === "ben10") mult = 1.6;
    if (c.league === "anime") mult = 1 + c.stats[3] / 110;
    if (c.league === "ipl" && alive(mine) < alive(theirs)) {
      mult *= 1.5;
      notes.push("Clutch!");
    }
  }
  if (c.league === "pokemon" && t.card.league === "pokemon") {
    const m = typeMultiplier(c.kind, t.card.kind);
    mult *= m;
    if (m > 1) notes.push("Super effective!");
    else if (m < 1) notes.push("Not very effective…");
  }
  if (c.league === "football" || c.league === "nba") {
    const mates = mine.filter(
      (x) => x !== f && x.card.league === c.league && x.card.team === c.team,
    );
    if (mates.length) {
      mult *= 1 + 0.1 * mates.length;
      notes.push(`Team chemistry +${mates.length * 10}%`);
    }
  }
  if (HERO_SIDES.has(c.league) && HERO_SIDES.has(t.card.league)) {
    const a = c.kind;
    const b = t.card.kind;
    if ((a === "hero" && b === "villain") || (a === "villain" && b === "hero")) {
      mult *= 1.25;
      notes.push(a === "hero" ? "Hero vs villain!" : "Villain vs hero!");
    }
  }
  const def = t.card.stats[LEAGUES[t.card.league].roles.def]!;
  return { f, t, atk, def, mult, notes };
}

/** Whether the side to move can use its card's special. */
export const canSpecial = (state: BattleState) => {
  const f = active(state[state.turn]);
  return !!f && !f.usedSpecial;
};

/** Plays the side-to-move's move and passes the turn. Returns a new state. */
export function act(prev: BattleState, move: Move): BattleState {
  if (prev.winner) return prev;
  const state: BattleState = {
    ...prev,
    you: prev.you.map((f) => ({ ...f })),
    cpu: prev.cpu.map((f) => ({ ...f })),
    log: [...prev.log],
  };
  const side = state.turn;
  const other: Side = side === "you" ? "cpu" : "you";
  const r = rng(hash(`${state.seed}:${state.rolls}`));
  state.rolls++;
  const me = active(state[side]);
  const them = active(state[other]);
  if (!me || !them) return prev;
  if (me.resting > 0) {
    me.resting--;
    state.log.push({
      side,
      by: me.card.name,
      target: them.card.name,
      move: "rest",
      damage: 0,
      notes: ["The Omnitrix is recharging."],
      ko: false,
    });
    state.turn = other;
    return state;
  }
  const useSpecial = move === "special" && !me.usedSpecial;
  const m: Move = useSpecial ? "special" : "strike";
  const { atk, def, mult, notes } = sizeUp(state, side, m);
  if (useSpecial) me.usedSpecial = true;
  if (useSpecial && me.card.league === "ben10") me.resting = 1;
  let damage = Math.max(3, Math.round(atk * mult * (60 / (60 + def)) * 1.1 * (0.85 + r() * 0.3)));
  const dodge = them.card.league === "tv" && !(useSpecial && me.card.league === "wwe");
  if (dodge && r() < them.card.stats[3] / 600) {
    damage = 0;
    notes.push("The fans saved it! Dodged.");
  }
  if (
    damage >= them.hp &&
    them.card.league === "ufc" &&
    them.card.stats[3] >= 80 &&
    !them.chinUsed
  ) {
    them.chinUsed = true;
    damage = them.hp - 1;
    notes.push("Iron chin! Still standing on 1 HP.");
  }
  them.hp = Math.max(0, them.hp - damage);
  const ko = them.hp === 0;
  state.log.push({ side, by: me.card.name, target: them.card.name, move: m, damage, notes, ko });
  if (!alive(state[other])) state.winner = side;
  state.turn = other;
  return state;
}

/** The computer's choice: a special when it would knock out, or when it's worth it, else strike. */
export function cpuMove(state: BattleState): Move {
  const me = active(state[state.turn]);
  const them = active(state[state.turn === "you" ? "cpu" : "you"]);
  if (!me || !them || me.usedSpecial) return "strike";
  const strike = sizeUp(state, state.turn, "strike");
  const special = sizeUp(state, state.turn, "special");
  const hit = (s: typeof strike) => s.atk * s.mult * (60 / (60 + s.def)) * 1.1;
  if (hit(special) >= them.hp) return "special";
  if (hit(strike) >= them.hp) return "strike";
  return them.hp > them.max * 0.5 && hit(special) > hit(strike) * 1.2 ? "special" : "strike";
}
