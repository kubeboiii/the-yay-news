"use client";

import Link from "next/link";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { deviceId, exportLog, recordLinked } from "@/features/habits/api";
import { habitFonts } from "@/features/habits/fonts";
import { play } from "@/features/sound";
import { CardFaceDown, YayCard } from "./card-view";
import { BOX_PRICE, collectionOf, luckOn, type PendingReward } from "./collection";
import { drawCards, leaguesOn, poolFor, randomLeague, type RewardKind } from "./draw";
import { LEAGUES, RARITY_NAME, RARITY_RANK } from "./leagues/meta";
import { ShareButton } from "./share-button";
import { ScratchLayer } from "./scratch";
import type { Card, LeagueId } from "./types";
import { previewToday, useCardsToday, useCollection } from "./use-collection";
import "./rewards.css";

// Getting cards, only ever by reading: a finished paper's SCRATCH CARD (scratch the foil to see
// one card) and BLIND BOX (pick a league or let it surprise you, shake it, three cards inside);
// a Sunday paper's LUCKY DIP (reach into the paper bag: two cards from a random league, better
// odds); and a blind box bought with Yay Coins. The draw is seeded (draw.ts), so what's under the
// foil is decided before it's scratched, and reopening a tab can't reroll.
//
// The overlay lives in a host (RewardHost) outside whatever offered it, so the stamping card that
// offers a reward can slide away without closing it.

export type RewardRequest = {
  kind: RewardKind;
  /** "sc:42", "bx:42", "dp:39"; null for a bought box (a key is made when it's opened). */
  key: string | null;
  issue?: number;
  /** The paper's date (for the streak's luck). */
  date?: string;
  /** A league already chosen (a bought box from a league's album page). */
  league?: LeagueId;
};

// ——— The host's little store ———

let current: RewardRequest | null = null;
const listeners = new Set<() => void>();
const set = (next: RewardRequest | null) => {
  current = next;
  for (const l of listeners) l();
};
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/** Opens the reward overlay. */
export const openReward = (req: RewardRequest) => set(req);

/** Mount once on any page that can offer a reward. */
export function RewardHost() {
  const req = useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );
  if (!req) return null;
  return createPortal(
    <RewardOverlay key={`${req.kind}:${req.key}`} req={req} onClose={() => set(null)} />,
    document.body,
  );
}

// ——— Drawing and recording ———

type Pulled = Card & { isNew: boolean };
type Outcome = { cards: Pulled[]; coins: number; league: LeagueId | null };

const randomKey = () => {
  try {
    return crypto.randomUUID().slice(0, 13);
  } catch {
    return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  }
};

const todayNow = () => previewToday() ?? new Date().toISOString().slice(0, 10);

/** What a reward holds, before it's recorded (the same every time for the same key). */
function plan(req: RewardRequest, key: string, today: string, league: LeagueId | null) {
  const events = exportLog().events;
  const seed = `${deviceId()}:${key}`;
  const from =
    req.kind === "scratch"
      ? null
      : (league ?? (req.kind === "bought" ? null : randomLeague(today, seed)));
  const pool = poolFor(today, from);
  const luck = luckOn(events, req.date ?? today);
  const cards = drawCards({
    pool,
    kind: req.kind,
    seed: `${seed}:${from ?? "any"}`,
    streak: luck.streak,
    milestone: req.kind !== "bought" && luck.milestone,
  });
  return { cards, league: from };
}

/** Records the reward's opening and its cards. Returns null if it can't be opened. */
function commit(
  req: RewardRequest,
  key: string,
  planned: { cards: Card[]; league: LeagueId | null },
  chosen: boolean,
): Outcome | null {
  const events = exportLog().events;
  const before = collectionOf(events);
  if (before.opened.has(key) || !planned.cards.length) return null;
  if (req.kind === "bought" && before.coins < BOX_PRICE) return null;
  const issue = req.issue ?? 0;
  const opening =
    req.kind === "scratch"
      ? ({ type: "scratch_revealed", pack: key, issue } as const)
      : req.kind === "dip"
        ? ({ type: "dip_opened", pack: key, issue } as const)
        : ({
            type: "box_opened",
            pack: key,
            ...(req.issue ? { issue } : {}),
            league: planned.league ?? planned.cards[0]!.league,
            chosen,
            ...(req.kind === "bought" ? { cost: BOX_PRICE } : {}),
          } as const);
  recordLinked(opening, (id) =>
    planned.cards.map((c) => ({ type: "card_pulled" as const, from: id, card: c.id })),
  );
  const after = collectionOf(exportLog().events);
  const seen = new Set(before.owned.keys());
  const cards = planned.cards.map((c) => {
    const isNew = !seen.has(c.id);
    seen.add(c.id);
    return { ...c, isNew };
  });
  const spent = req.kind === "bought" ? BOX_PRICE : 0;
  return { cards, coins: Math.max(0, after.coins - before.coins + spent), league: planned.league };
}

// ——— The overlay ———

const NAME: Record<RewardKind, string> = {
  scratch: "Scratch card",
  box: "Blind box",
  dip: "Sunday lucky dip",
  bought: "Blind box",
};

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function RewardOverlay({ req, onClose }: { req: RewardRequest; onClose: () => void }) {
  const [key] = useState(() => req.key ?? `b:${randomKey()}`);
  const [today] = useState(todayNow);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const open = useCallback(
    (league: LeagueId | null, chosen: boolean) => {
      const planned = plan(req, key, today, league);
      const out = commit(req, key, planned, chosen);
      if (!out) {
        setError(
          planned.cards.length
            ? "This one's already been opened."
            : "No cards to pull just yet: the next drop is on its way.",
        );
        return null;
      }
      setOutcome(out);
      return out;
    },
    [req, key, today],
  );

  const title = `${NAME[req.kind]}${req.issue ? `, No. ${req.issue}` : ""}`;
  return (
    <div className={`yr-overlay ${habitFonts}`} role="dialog" aria-modal="true" aria-label={title}>
      <div className="yr-stage">
        <p className="yr-kicker">{title}</p>
        {error ? (
          <div className="yr-note">
            <p>{error}</p>
            <button type="button" className="yr-btn" onClick={onClose}>
              Close
            </button>
          </div>
        ) : req.kind === "scratch" ? (
          <ScratchStage req={req} rkey={key} today={today} open={open} />
        ) : req.kind === "dip" ? (
          <DipStage open={open} outcome={outcome} />
        ) : (
          <BoxStage req={req} today={today} open={open} outcome={outcome} />
        )}
        {outcome ? <Summary outcome={outcome} onClose={onClose} /> : null}
        {!outcome && !error ? (
          <button type="button" className="yr-btn yr-btn--quiet yr-later" onClick={onClose}>
            {req.kind === "bought" ? "Not now" : "Keep it for later"}
          </button>
        ) : null}
      </div>
    </div>
  );
}

type OpenFn = (league: LeagueId | null, chosen: boolean) => Outcome | null;

// ——— Scratch card ———

function ScratchStage({
  req,
  rkey,
  today,
  open,
}: {
  req: RewardRequest;
  rkey: string;
  today: string;
  open: OpenFn;
}) {
  // Decided before it's scratched: the same seeded draw commit() will make.
  const [card] = useState(() => plan(req, rkey, today, null).cards[0] ?? null);
  const [done, setDone] = useState(false);
  const reveal = () => {
    if (done) return;
    setDone(true);
    open(null, false);
    play("chime");
  };
  if (!card) return <p className="yr-note">No cards to pull just yet.</p>;
  return (
    <div className="yr-scratch">
      <p className="yr-help">
        {done ? "You scratched…" : "Scratch the foil with your finger or mouse."}
      </p>
      <div className={`yr-scratch__card ${done ? "is-done" : ""}`}>
        <YayCard card={card} still />
        <ScratchLayer onDone={reveal} done={done} />
      </div>
      {!done ? (
        <button type="button" className="yr-btn yr-btn--quiet" onClick={reveal}>
          Reveal it without scratching
        </button>
      ) : null}
    </div>
  );
}

// ——— Blind box ———

function BoxStage({
  req,
  today,
  open,
  outcome,
}: {
  req: RewardRequest;
  today: string;
  open: OpenFn;
  outcome: Outcome | null;
}) {
  const leagues = useMemo(() => leaguesOn(today), [today]);
  const [league, setLeague] = useState<LeagueId | null>(req.league ?? null);
  const [stage, setStage] = useState<"choose" | "shaking" | "open">("choose");
  const bought = req.kind === "bought";
  const shake = () => {
    if (bought && !league) return;
    setStage("shaking");
    play("rattle");
    const t1 = window.setTimeout(() => play("rattle"), 450);
    window.setTimeout(
      () => {
        window.clearTimeout(t1);
        const out = open(league, !!league);
        if (out) {
          setStage("open");
          play("tear");
        } else setStage("choose");
      },
      reduced() ? 0 : 1100,
    );
  };
  const boxLeague = outcome?.league ?? league;
  return (
    <div className="yr-box-wrap">
      {stage === "choose" ? (
        <div className="yr-choose" role="group" aria-label="Pick a league">
          <p className="yr-help">
            {bought ? "Pick a league for your box:" : "Pick a league, or let the box surprise you:"}
          </p>
          <div className="yr-chips">
            {bought ? null : (
              <button
                type="button"
                className="yr-chip"
                aria-pressed={league === null}
                onClick={() => setLeague(null)}
              >
                Surprise me
              </button>
            )}
            {leagues.map((l) => (
              <button
                key={l}
                type="button"
                className="yr-chip"
                data-league={l}
                aria-pressed={league === l}
                onClick={() => setLeague(l)}
              >
                {LEAGUES[l].short}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      <div
        className={`yr-box ${stage === "shaking" ? "is-shaking" : ""} ${stage === "open" ? "is-open" : ""}`}
        data-league={boxLeague ?? "any"}
        aria-hidden
      >
        <span className="yr-box__lid">
          <span className="yr-box__ribbon" />
        </span>
        <span className="yr-box__body">
          <span className="yr-box__q">?</span>
          <span className="yr-box__word">Yay Attax</span>
          <span className="yr-box__info">
            {boxLeague ? LEAGUES[boxLeague].name : "Mystery league"} · 3 cards
          </span>
        </span>
      </div>
      {stage === "choose" ? (
        <button
          type="button"
          className="yr-btn yr-btn--big"
          onClick={shake}
          disabled={bought && !league}
        >
          {bought ? `Open it · ${BOX_PRICE} coins` : "Shake it and open it"}
        </button>
      ) : null}
      {stage === "open" && outcome ? <Deal cards={outcome.cards} /> : null}
    </div>
  );
}

// ——— Lucky dip ———

function DipStage({ open, outcome }: { open: OpenFn; outcome: Outcome | null }) {
  const [stage, setStage] = useState<"bag" | "reaching" | "out">("bag");
  const reach = () => {
    setStage("reaching");
    play("bag");
    window.setTimeout(
      () => {
        const out = open(null, false);
        if (out) {
          setStage("out");
          play("chime");
        } else setStage("bag");
      },
      reduced() ? 0 : 1300,
    );
  };
  return (
    <div className="yr-dip-wrap">
      <p className="yr-help">
        {stage === "out"
          ? "Out of the bag…"
          : "It's Sunday: reach into the bag for two bonus cards, with better odds."}
      </p>
      <div
        className={`yr-bag ${stage !== "bag" ? "is-reaching" : ""} ${stage === "out" ? "is-out" : ""}`}
        aria-hidden
      >
        <span className="yr-bag__hand" />
        <span className="yr-bag__back" />
        <span className="yr-bag__front">
          <span className="yr-bag__word">Lucky dip</span>
          <span className="yr-bag__sub">Sunday special</span>
        </span>
      </div>
      {stage === "bag" ? (
        <button type="button" className="yr-btn yr-btn--big" onClick={reach}>
          Reach in
        </button>
      ) : null}
      {stage === "out" && outcome ? <Deal cards={outcome.cards} /> : null}
    </div>
  );
}

// ——— Dealt cards, face down, to turn over ———

function Deal({ cards }: { cards: Pulled[] }) {
  const [shown, setShown] = useState(() => cards.map(() => reduced()));
  const turn = (i: number) => {
    setShown((s) => s.map((v, k) => (k === i ? true : v)));
    const c = cards[i];
    play(c && RARITY_RANK[c.rarity] >= 2 ? "chime" : "flip");
  };
  const all = shown.every(Boolean);
  return (
    <>
      <ul className="yr-deal" aria-label="Your new cards">
        {cards.map((c, i) => (
          <li key={`${c.id}:${i}`} className="yr-deal__card" style={{ ["--i" as string]: i }}>
            {shown[i] ? (
              <div className="yr-reveal" data-rarity={c.rarity}>
                <YayCard card={c} />
                <Tag card={c} />
              </div>
            ) : (
              <button
                type="button"
                className="yr-down"
                onClick={() => turn(i)}
                aria-label={`Turn over card ${i + 1}`}
              >
                <CardFaceDown />
              </button>
            )}
          </li>
        ))}
      </ul>
      {!all ? (
        <button
          type="button"
          className="yr-btn"
          onClick={() => {
            setShown((s) => s.map(() => true));
            play("flip");
          }}
        >
          Turn them all over
        </button>
      ) : null}
    </>
  );
}

function Tag({ card }: { card: Pulled }) {
  return (
    <div className="yr-tag">
      <p>
        {card.isNew ? "New!" : "Duplicate"} · {RARITY_NAME[card.rarity]}
      </p>
      {RARITY_RANK[card.rarity] >= 1 ? <ShareButton card={card} /> : null}
    </div>
  );
}

function Summary({ outcome, onClose }: { outcome: Outcome; onClose: () => void }) {
  const fresh = outcome.cards.filter((c) => c.isNew).length;
  const n = outcome.cards.length;
  let line: ReactNode =
    fresh === n
      ? `${fresh} new card${fresh === 1 ? "" : "s"} for your album`
      : `${fresh} new, ${n - fresh} duplicate${n - fresh === 1 ? "" : "s"}`;
  if (outcome.coins) line = `${line} · +${outcome.coins} Yay Coin${outcome.coins === 1 ? "" : "s"}`;
  return (
    <div className="yr-actions" role="status" aria-live="polite">
      <p className="yr-sum">{line}</p>
      <Link href="/cards" className="yr-btn yr-btn--big" onClick={onClose}>
        See your album
      </Link>
      <button type="button" className="yr-btn yr-btn--quiet" onClick={onClose}>
        Close
      </button>
    </div>
  );
}

// ——— The offer on the stamping card ———

const OFFER: Record<PendingReward["kind"], string> = {
  scratch: "Scratch your card",
  box: "Open your blind box",
  dip: "Sunday lucky dip",
};

/** The rewards a finished paper has waiting, as buttons (the stamping card, the album). */
export function RewardOffer({ issue }: { issue?: number }) {
  const { pending } = useCollection();
  const today = useCardsToday();
  const mine = issue === undefined ? pending : pending.filter((p) => p.issue === issue);
  if (!today || !mine.length) return null;
  return (
    <span className="yr-offer">
      {mine.map((p) => (
        <button
          key={p.key}
          type="button"
          className="yr-offer__btn"
          data-kind={p.kind}
          onClick={() => openReward({ kind: p.kind, key: p.key, issue: p.issue, date: p.date })}
        >
          {OFFER[p.kind]}
          {issue === undefined ? <small> · No. {p.issue}</small> : null}
        </button>
      ))}
    </span>
  );
}
