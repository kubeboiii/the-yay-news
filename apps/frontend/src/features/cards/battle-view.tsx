"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { exportLog, record, useHabitsReady } from "@/features/habits/api";
import { play } from "@/features/sound";
import {
  act,
  active,
  alive,
  type BattleState,
  canSpecial,
  cpuDeck,
  cpuMove,
  createBattle,
  DECK_SIZE,
  type Fighter,
  hpOf,
  type Move,
} from "./battle";
import { YayCard } from "./card-view";
import { BATTLE_COINS, BATTLE_PAYOUTS, paidWinsOn } from "./collection";
import { releasedCards } from "./drops";
import { shuffle } from "./draw";
import { LEAGUES, RARITY_RANK } from "./leagues/meta";
import type { Card, LeagueId } from "./types";
import { nonce, useCardsToday, useCollection } from "./use-collection";
import "./play.css";

// Deck Battle: build a deck of five from your album (one league or mixed), then fight the
// computer's deck turn by turn. The rules are in battle.ts; this is the table they're played on.

const CPU_DELAY = 900;

type Struck = { side: "you" | "cpu"; n: number; key: number } | null;

/** Plays a move, with the sound of it, and says who was hit for how much. */
function advance(state: BattleState, m: Move): { next: BattleState; struck: Struck } {
  const next = act(state, m);
  const last = next.log.at(-1);
  if (!last) return { next, struck: null };
  play(last.ko ? "stamp" : last.move === "special" ? "tear" : "flip");
  return {
    next,
    struck: { side: last.side === "you" ? "cpu" : "you", n: last.damage, key: next.log.length },
  };
}

export function DeckBattle() {
  const ready = useHabitsReady();
  const today = useCardsToday();
  const { owned } = useCollection();
  const mine = useMemo(
    () =>
      [...owned.values()]
        .map((o) => o.card)
        .sort(
          (a, b) =>
            a.league.localeCompare(b.league) || RARITY_RANK[b.rarity] - RARITY_RANK[a.rarity],
        ),
    [owned],
  );
  const [deck, setDeck] = useState<string[]>([]);
  const [state, setState] = useState<BattleState | null>(null);
  const [paid, setPaid] = useState<number | null>(null);
  const [hit, setHit] = useState<Struck>(null);
  const [auto, setAuto] = useState(false);
  const logged = useRef(false);

  const chosen = deck.map((id) => mine.find((c) => c.id === id)).filter((c): c is Card => !!c);

  const toggle = (id: string) =>
    setDeck((d) =>
      d.includes(id) ? d.filter((x) => x !== id) : d.length < DECK_SIZE ? [...d, id] : d,
    );

  const begin = () => {
    if (!today || chosen.length !== DECK_SIZE) return;
    const n = exportLog().events.filter((e) => e.type === "battle_played").length;
    const seed = `${today}:${n}:${nonce()}`;
    const cpu = cpuDeck(releasedCards(today), chosen, seed);
    logged.current = false;
    setPaid(null);
    setHit(null);
    setState(createBattle(chosen, cpu, seed));
    play("rustle");
  };

  const move = (m: Move) => {
    if (!state || state.winner) return;
    const { next, struck } = advance(state, m);
    setHit(struck);
    setState(next);
  };

  // The computer's turn (and yours too, on auto-play).
  useEffect(() => {
    if (!state || state.winner) return;
    if (state.turn === "you" && !auto) return;
    const t = window.setTimeout(
      () => {
        const { next, struck } = advance(state, cpuMove(state));
        setHit(struck);
        setState(next);
      },
      auto ? 450 : CPU_DELAY,
    );
    return () => window.clearTimeout(t);
  }, [state, auto]);

  // The result, once.
  useEffect(() => {
    if (!state?.winner || !today || logged.current) return;
    logged.current = true;
    const won = state.winner === "you";
    const coins =
      won && paidWinsOn(exportLog().events, today, "battle_played") < BATTLE_PAYOUTS
        ? BATTLE_COINS
        : 0;
    record({
      type: "battle_played",
      result: won ? "won" : "lost",
      coins,
      date: today,
      deck: state.you.map((f) => f.card.id),
    });
    const t = window.setTimeout(() => setPaid(coins), 0);
    if (won) play("chime");
    return () => window.clearTimeout(t);
  }, [state, today]);

  if (!ready || !today) return <p className="yp-note">Shuffling…</p>;

  if (!state) {
    const leagues = [...new Set(chosen.map((c) => c.league))];
    return (
      <div className="yp-builder">
        <p className="yp-note">
          Pick five cards for your deck, from one league or mixed. Each league brings its own rule.
          A win pays {BATTLE_COINS} Yay Coins (the first {BATTLE_PAYOUTS} wins a day).
        </p>
        {mine.length < DECK_SIZE ? (
          <p className="yp-note">
            You need {DECK_SIZE} cards, and you have {mine.length}.{" "}
            <Link href="/">Finish today&rsquo;s paper</Link> for more.
          </p>
        ) : (
          <>
            <div className="yp-deckbar">
              <p className="yp-deckbar__count">
                Deck: <b>{chosen.length}</b>/{DECK_SIZE}
              </p>
              <button
                type="button"
                className="yp-btn yp-btn--quiet"
                onClick={() =>
                  setDeck(
                    shuffle(mine, nonce())
                      .slice(0, DECK_SIZE)
                      .map((c) => c.id),
                  )
                }
              >
                Random deck
              </button>
              <button
                type="button"
                className="yp-btn yp-btn--big"
                disabled={chosen.length !== DECK_SIZE}
                onClick={begin}
              >
                Battle!
              </button>
            </div>
            {leagues.length ? (
              <ul className="yp-rules">
                {leagues.map((l) => (
                  <li key={l}>
                    <b>{LEAGUES[l].short}:</b> {LEAGUES[l].rule}
                  </li>
                ))}
              </ul>
            ) : null}
            <ul className="yp-pick">
              {mine.map((c) => {
                const on = deck.includes(c.id);
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      className={`yp-pick__card ${on ? "is-on" : ""}`}
                      aria-pressed={on}
                      aria-label={`${on ? "Remove" : "Add"} ${c.name}`}
                      onClick={() => toggle(c.id)}
                    >
                      <YayCard card={c} still />
                      <span className="yp-pick__hp">HP {hpOf(c)}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    );
  }

  const me = active(state.you);
  const them = active(state.cpu);
  const last = state.log.at(-1);
  const leagues = [
    ...new Set([...state.you, ...state.cpu].map((f) => f.card.league)),
  ] as LeagueId[];
  const yourTurn = state.turn === "you" && !state.winner && !auto;
  return (
    <div className="yp-battle">
      <ul className="yp-rules yp-rules--small">
        {state.wet && leagues.includes("f1") ? (
          <li className="yp-wet">It&rsquo;s raining: a wet track.</li>
        ) : null}
        {leagues.map((l) => (
          <li key={l}>
            <b>{LEAGUES[l].short}:</b> {LEAGUES[l].rule}
          </li>
        ))}
      </ul>
      <Bench fighters={state.cpu} label="The computer's deck" />
      <div className="yp-arena">
        <Combatant
          f={them}
          side="cpu"
          hit={hit}
          lunge={last?.side === "cpu" ? state.log.length : null}
        />
        <div className="yp-arena__mid" aria-live="polite">
          {last ? (
            <p className="yp-log" key={state.log.length}>
              <b>{last.by}</b>{" "}
              {last.move === "rest"
                ? "rests"
                : `${last.move === "special" ? "uses its special on" : "strikes"} ${last.target}: ${last.damage} damage`}
              {last.notes.length ? (
                <span className="yp-log__notes"> {last.notes.join(" ")}</span>
              ) : null}
              {last.ko ? <span className="yp-log__ko"> Knocked out!</span> : null}
            </p>
          ) : (
            <p className="yp-log">
              {state.turn === "you" ? "You're faster: your move." : "The computer's faster…"}
            </p>
          )}
        </div>
        <Combatant
          f={me}
          side="you"
          hit={hit}
          lunge={last?.side === "you" ? state.log.length : null}
        />
      </div>
      <Bench fighters={state.you} label="Your deck" />
      {state.winner ? (
        <div className="yp-end">
          <p className="yp-big">
            {state.winner === "you" ? "You win the battle!" : "The computer wins."}
          </p>
          <p className="yp-line">
            {state.winner === "you"
              ? paid
                ? `+${paid} Yay Coins for your album.`
                : `A win, though today's ${BATTLE_PAYOUTS} paid wins are done.`
              : `You knocked out ${DECK_SIZE - alive(state.cpu)} of its ${DECK_SIZE}. Rematch?`}
          </p>
          <p className="yp-actions">
            <button type="button" className="yp-btn yp-btn--big" onClick={begin}>
              Rematch
            </button>
            <button type="button" className="yp-btn yp-btn--quiet" onClick={() => setState(null)}>
              Change deck
            </button>
            <Link href="/cards" className="yp-link">
              Back to the album
            </Link>
          </p>
        </div>
      ) : (
        <div className="yp-moves">
          {me ? (
            <>
              <button
                type="button"
                className="yp-btn yp-btn--big"
                disabled={!yourTurn}
                onClick={() => move("strike")}
              >
                Strike · {LEAGUES[me.card.league].stats[LEAGUES[me.card.league].roles.atk]}
              </button>
              <button
                type="button"
                className="yp-btn yp-btn--big yp-btn--special"
                disabled={!yourTurn || !canSpecial(state)}
                onClick={() => move("special")}
              >
                {me.usedSpecial ? "Special used" : `Special · ${me.card.move ?? "Power move"}`}
              </button>
            </>
          ) : null}
          <label className="yp-auto">
            <input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} />{" "}
            Auto-play
          </label>
          {!yourTurn && !auto ? <p className="yp-line">The computer is thinking…</p> : null}
        </div>
      )}
    </div>
  );
}

function Combatant({
  f,
  side,
  hit,
  lunge,
}: {
  f: Fighter | null;
  side: "you" | "cpu";
  hit: { side: "you" | "cpu"; n: number; key: number } | null;
  lunge: number | null;
}) {
  if (!f) return <div className="yp-fighter" />;
  const pct = Math.round((f.hp / f.max) * 100);
  const struck = hit?.side === side;
  return (
    <div className="yp-fighter" data-side={side}>
      <div
        key={`${f.card.id}:${lunge ?? 0}:${struck ? hit.key : 0}`}
        className={`yp-fighter__card ${lunge !== null ? "is-lunging" : ""} ${struck ? "is-struck" : ""}`}
      >
        <YayCard card={f.card} still />
        {struck ? (
          <span className="yp-dmg" aria-hidden>
            {hit.n ? `−${hit.n}` : "Miss"}
          </span>
        ) : null}
      </div>
      <div className="yp-hp" aria-label={`${f.card.name}: ${f.hp} of ${f.max} HP`}>
        <span className="yp-hp__bar" data-low={pct < 30} style={{ width: `${pct}%` }} />
        <span className="yp-hp__text">
          {f.hp}/{f.max} HP{f.usedSpecial ? " · special used" : ""}
        </span>
      </div>
    </div>
  );
}

function Bench({ fighters, label }: { fighters: Fighter[]; label: string }) {
  return (
    <ol className="yp-bench" aria-label={label}>
      {fighters.map((f, i) => (
        <li
          key={`${f.card.id}:${i}`}
          className="yp-bench__slot"
          data-out={f.hp === 0}
          data-league={f.card.league}
        >
          <span>{f.card.name}</span>
          <span className="yp-bench__hp" style={{ width: `${(f.hp / f.max) * 100}%` }} />
        </li>
      ))}
    </ol>
  );
}
