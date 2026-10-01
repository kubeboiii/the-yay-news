"use client";

import { useMemo, useState } from "react";
import { exportLog, record, useHabitsReady } from "@/features/habits/api";
import { GoButton, Heading, Misprint, Scrap, Tape } from "@/features/riot";
import { play } from "@/features/sound";
import { CardFaceDown, YayCard } from "./card-view";
import { CLASH_PAYOUTS, paidWinsOn } from "./collection";
import { releasedCards } from "./drops";
import { shuffle } from "./draw";
import { LEAGUES } from "./leagues/meta";
import type { Card, LeagueId } from "./types";
import { LEAGUE_IDS } from "./types";
import { nonce, useCardsToday, useCollection } from "./use-collection";
import "./desk.css";
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
        {playable.length ? (
          <section className="yp-pickleague" aria-labelledby="yp-pick-h">
            <Heading as="h2" id="yp-pick-h" className="yp-h2">
              Pick a league
            </Heading>
            <p className="yp-note">
              Five rounds against the computer&rsquo;s cards from the same league. First to three
              wins; a win pays a Yay Coin.
            </p>
            <div className="yp-leagues" role="group" aria-labelledby="yp-pick-h">
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
                    <span className="yp-league__name">{LEAGUES[l].name}</span>
                    <small className="rt-meta">
                      {n < CLASH_MIN
                        ? `${CLASH_MIN - n} more card${CLASH_MIN - n === 1 ? "" : "s"} to play`
                        : `${n} cards`}
                    </small>
                  </button>
                );
              })}
            </div>
          </section>
        ) : (
          <Scrap seed="clash-empty" ground="white" className="yp-empty">
            <p>
              You need {CLASH_MIN} cards from one league to play. Finish a paper for a scratch card
              and a blind box.
            </p>
            <GoButton href="/" sub="a scratch card and a blind box for finishing it">
              Read today&rsquo;s paper
            </GoButton>
          </Scrap>
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
      <header className="yp-score">
        <Heading as="h2" className="yp-league-name">
          {L.name}
        </Heading>
        <ol className="yp-pips" aria-label="Rounds">
          {Array.from({ length: ROUNDS }, (_, i) => {
            const r = rounds[i];
            return (
              <li key={i} className="yp-pip" data-winner={r?.winner ?? "none"}>
                <span aria-hidden>
                  {r ? (r.winner === "you" ? "You" : r.winner === "cpu" ? "CPU" : "Draw") : i + 1}
                </span>
                <span className="rt-sr">
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
      </header>
      <div className="yp-table yk-band">
        <div className="yp-side">
          <p className="yp-who">Your card</p>
          <div className="yk-sleeve">
            <Tape at="top" seed="clash-yours" className="yp-tape" />
            <YayCard card={yours} highlight={showing?.stat ?? null} still />
          </div>
        </div>
        <span className="yp-vs" aria-hidden>
          <Misprint>VS</Misprint>
        </span>
        <div className="yp-side">
          <p className="yp-who">The computer&rsquo;s</p>
          <div className="yk-sleeve">
            {showing ? <YayCard card={theirs} highlight={showing.stat} still /> : <CardFaceDown />}
          </div>
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
          <p className="yp-line">Your pick: which of your card&rsquo;s stats will win it?</p>
        ) : (
          <p className="yp-line">The computer won that one, so it picks.</p>
        )}
      </div>
      {!showing && !over ? (
        picker === "you" ? (
          <div className="yp-stats" role="group" aria-label="Play a stat">
            {L.stats.map((name, k) => (
              <button
                key={name}
                type="button"
                className="yp-stat"
                onClick={() => playStat(k, "you")}
              >
                <span className="yp-stat__name">{name}</span>
                <span className="yp-stat__n">{yours.stats[k]}</span>
              </button>
            ))}
          </div>
        ) : (
          <GoButton onClick={() => playStat(best(theirs), "cpu")} sub="it plays its best stat">
            See what it picks
          </GoButton>
        )
      ) : null}
      {over && showing ? (
        <Scrap seed="clash-end" ground="white" tape="top" className="yp-end">
          <Heading as="p" className="yp-big">
            {result === "won" ? "You win!" : result === "lost" ? "The computer wins." : "A draw!"}
          </Heading>
          <p className="yp-line">
            {result === "won"
              ? paid
                ? "+1 Yay Coin for your album."
                : `A win, though today's ${CLASH_PAYOUTS} coins are already paid out.`
              : "Deal again for a rematch."}
          </p>
          <div className="yp-actions">
            <GoButton onClick={() => start(game.league)} sub={`five new ${L.short} cards`}>
              Play again
            </GoButton>
            <GoButton tone="quiet" onClick={() => setGame(null)}>
              Another league
            </GoButton>
          </div>
        </Scrap>
      ) : showing ? (
        <GoButton
          onClick={() => {
            setRevealed(false);
            play("fold");
          }}
          sub={`round ${n + 1} of ${ROUNDS}`}
        >
          Next round
        </GoButton>
      ) : null}
    </div>
  );
}
