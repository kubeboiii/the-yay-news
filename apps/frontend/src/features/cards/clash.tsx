"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { exportLog, record, useHabitsReady } from "@/features/habits/api";
import { play } from "@/features/sound";
import { CardFaceDown, YayCard } from "./card-view";
import { CLASH_PAYOUTS, paidWinsOn } from "./collection";
import { releasedCards } from "./drops";
import { shuffle } from "./draw";
import { LEAGUES } from "./leagues/meta";
import type { Card, LeagueId } from "./types";
import { LEAGUE_IDS } from "./types";
import { nonce, useCardsToday, useCollection } from "./use-collection";
import "./play.css";

// Card Clash: Top Trumps against the computer, one league at a time. Best of five rounds: your
// cards dealt from your album's cards of that league, the computer's from every released card of
// the league. Whoever won the last round picks one of the league's four stats; the higher number
// takes the round (a tie is a draw). First to three wins, and a win pays a Yay Coin (the first
// three wins of the day).

export const ROUNDS = 5;
const WIN_AT = 3;
/** Cards of a league you need to play it. */
export const CLASH_MIN = 2;

type Round = {
  stat: number;
  by: "you" | "cpu";
  you: number;
  cpu: number;
  winner: "you" | "cpu" | "draw";
};

/** Five cards from `list`, shuffled, going round again when it has fewer. */
const deal = (list: readonly Card[], seed: string) => {
  const s = shuffle(list, seed);
  return Array.from({ length: ROUNDS }, (_, i) => s[i % s.length]!);
};

const best = (c: Card) => c.stats.indexOf(Math.max(...c.stats));

export function Clash() {
  const ready = useHabitsReady();
  const today = useCardsToday();
  const { owned } = useCollection();
  const [league, setLeague] = useState<LeagueId | null>(null);
  const [game, setGame] = useState<{
    seed: string;
    you: Card[];
    cpu: Card[];
    league: LeagueId;
  } | null>(null);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [paid, setPaid] = useState<number | null>(null);

  const mineBy = useMemo(() => {
    const m = new Map<LeagueId, Card[]>();
    for (const o of owned.values()) m.set(o.card.league, [...(m.get(o.card.league) ?? []), o.card]);
    return m;
  }, [owned]);
  const playable = LEAGUE_IDS.filter((l) => (mineBy.get(l)?.length ?? 0) >= CLASH_MIN);

  const start = (l: LeagueId) => {
    if (!today) return;
    const played = exportLog().events.filter((e) => e.type === "clash_played").length;
    const seed = `${today}:${played}:${nonce()}`;
    const pool = releasedCards(today).filter((c) => c.league === l);
    setGame({
      seed,
      league: l,
      you: deal(mineBy.get(l) ?? [], `you:${seed}`),
      cpu: deal(pool, `cpu:${seed}`),
    });
    setLeague(l);
    setRounds([]);
    setRevealed(false);
    setPaid(null);
    play("rustle");
  };

  if (!ready || !today) return <p className="yp-note">Shuffling…</p>;
  if (!game) {
    return (
      <div className="yp-intro">
        <p className="yp-note">
          Pick a league. Five rounds against the computer&rsquo;s cards from the same league: pick a
          stat, higher number wins the round. First to three wins.
        </p>
        {playable.length ? (
          <div className="yp-leagues" role="group" aria-label="Leagues you can play">
            {LEAGUE_IDS.map((l) => {
              const n = mineBy.get(l)?.length ?? 0;
              return (
                <button
                  key={l}
                  type="button"
                  className="yp-league"
                  data-league={l}
                  disabled={n < CLASH_MIN}
                  aria-pressed={league === l}
                  onClick={() => start(l)}
                >
                  {LEAGUES[l].name}
                  <small>
                    {n < CLASH_MIN
                      ? `${CLASH_MIN - n} more card${CLASH_MIN - n === 1 ? "" : "s"} to play`
                      : `${n} cards`}
                  </small>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="yp-note">
            You need {CLASH_MIN} cards from one league to play. Finish a paper for a scratch card
            and a blind box. <Link href="/">Read today&rsquo;s paper</Link>
          </p>
        )}
      </div>
    );
  }

  const L = LEAGUES[game.league];
  const n = rounds.length;
  const score = {
    you: rounds.filter((r) => r.winner === "you").length,
    cpu: rounds.filter((r) => r.winner === "cpu").length,
  };
  const over = score.you >= WIN_AT || score.cpu >= WIN_AT || n >= ROUNDS;
  const showing = revealed ? rounds[n - 1] : null;
  const at = revealed ? n - 1 : n;
  const yours = game.you[at]!;
  const theirs = game.cpu[at]!;
  const picker: "you" | "cpu" = rounds.at(-1)?.winner === "cpu" ? "cpu" : "you";

  const playStat = (stat: number, by: "you" | "cpu") => {
    const you = yours.stats[stat]!;
    const cpu = theirs.stats[stat]!;
    const winner = you > cpu ? "you" : cpu > you ? "cpu" : "draw";
    const next = [...rounds, { stat, by, you, cpu, winner } as Round];
    setRounds(next);
    setRevealed(true);
    play(winner === "you" ? "tick" : "flip");
    const s = {
      you: next.filter((r) => r.winner === "you").length,
      cpu: next.filter((r) => r.winner === "cpu").length,
    };
    if (s.you >= WIN_AT || s.cpu >= WIN_AT || next.length >= ROUNDS) {
      const result = s.you > s.cpu ? "won" : s.cpu > s.you ? "lost" : "drawn";
      const coins =
        result === "won" && paidWinsOn(exportLog().events, today) < CLASH_PAYOUTS ? 1 : 0;
      record({ type: "clash_played", result, coins, date: today, league: game.league });
      setPaid(coins);
      if (result === "won") play("stamp");
    }
  };

  const result = score.you > score.cpu ? "won" : score.cpu > score.you ? "lost" : "drawn";

  return (
    <div className="yp-clash">
      <p className="yp-league-name">{L.name}</p>
      <ol className="yp-pips" aria-label="Rounds">
        {Array.from({ length: ROUNDS }, (_, i) => {
          const r = rounds[i];
          return (
            <li key={i} className="yp-pip" data-winner={r?.winner ?? "none"}>
              <span className="sr-only">
                Round {i + 1}:{" "}
                {r
                  ? r.winner === "draw"
                    ? "a draw"
                    : `${r.winner === "you" ? "you" : "the computer"} won`
                  : "to play"}
              </span>
            </li>
          );
        })}
      </ol>
      <p className="yp-tally" aria-live="polite">
        You <b>{score.you}</b> · <b>{score.cpu}</b> Computer
      </p>
      <div className="yp-table">
        <div className="yp-side">
          <p className="yp-who">Your card</p>
          <YayCard
            card={yours}
            highlight={showing?.stat ?? null}
            onPickStat={
              !showing && !over && picker === "you" ? (k) => playStat(k, "you") : undefined
            }
          />
        </div>
        <div className="yp-vs" aria-hidden>
          vs
        </div>
        <div className="yp-side">
          <p className="yp-who">The computer&rsquo;s</p>
          {showing ? <YayCard card={theirs} highlight={showing.stat} still /> : <CardFaceDown />}
        </div>
      </div>
      <div className="yp-call" role="status" aria-live="polite">
        {showing ? (
          <p className="yp-line">
            {showing.by === "cpu" ? "The computer picked" : "You picked"}{" "}
            <b>{L.stats[showing.stat]}</b>: {showing.you} against {showing.cpu}.{" "}
            {showing.winner === "you"
              ? "Your round!"
              : showing.winner === "cpu"
                ? "The computer's round."
                : "A draw."}
          </p>
        ) : picker === "you" ? (
          <p className="yp-line">Your pick: tap a stat on your card.</p>
        ) : (
          <p className="yp-line">
            The computer won that one, so it picks.{" "}
            <button type="button" className="yp-btn" onClick={() => playStat(best(theirs), "cpu")}>
              See what it picks
            </button>
          </p>
        )}
        {over && showing ? (
          <div className="yp-end">
            <p className="yp-big">
              {result === "won" ? "You win!" : result === "lost" ? "The computer wins." : "A draw!"}
            </p>
            <p className="yp-line">
              {result === "won"
                ? paid
                  ? "+1 Yay Coin for your album."
                  : `A win, though today's ${CLASH_PAYOUTS} coins are already paid out.`
                : "Deal again for a rematch."}
            </p>
            <p className="yp-actions">
              <button
                type="button"
                className="yp-btn yp-btn--big"
                onClick={() => start(game.league)}
              >
                Play again
              </button>
              <button type="button" className="yp-btn yp-btn--quiet" onClick={() => setGame(null)}>
                Another league
              </button>
              <Link href="/cards" className="yp-link">
                Back to the album
              </Link>
            </p>
          </div>
        ) : showing ? (
          <button
            type="button"
            className="yp-btn yp-btn--big"
            onClick={() => {
              setRevealed(false);
              play("fold");
            }}
          >
            Next round
          </button>
        ) : null}
      </div>
    </div>
  );
}
