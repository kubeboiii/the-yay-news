"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import { earnSticker, record, recordOnce, useHabitsReady } from "@/features/habits/api";
import {
  type Cut,
  GAP,
  GoButton,
  Heading,
  Misprint,
  Poster,
  RansomHeading,
  RubberStamp,
  Scrap,
  Sticker,
} from "@/features/riot";
import { play } from "@/features/sound";
import { CardOutline, YayCard } from "./card-view";
import { GameCard as ClassicCard } from "./classic/game-card";
import { BOX_PRICE, evolvable } from "./collection";
import { nextDrop, releasedCards } from "./drops";
import { leaguesOn } from "./draw";
import { ERA_NAME, LEAGUES, RARITY_NAME } from "./leagues/meta";
import { openReward, RewardHost, RewardOffer } from "./rewards";
import { SEASONS, seasonOn } from "./seasons";
import { completeSets, setsOf } from "./sets";
import { ERAS, type Era, LEAGUE_IDS, type LeagueId, RARITIES, type Rarity } from "./types";
import { useCardsToday, useCollection } from "./use-collection";
import "./desk.css";
import "./album.css";

// The Yay Attax album: a tab per league, its season's sets with the cards you have in their places
// and outlines where the missing ones go, filters, a season switcher, rewards still to open, cards
// ready to evolve, and a blind box to buy with Yay Coins. Classic (news) cards from the first
// version keep a shelf of their own.

type Tab = LeagueId | "classic";

const DAY = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});
const dayName = (date: string) => DAY.format(new Date(`${date}T00:00:00Z`));

export function Album() {
  const ready = useHabitsReady();
  const today = useCardsToday();
  const col = useCollection();
  const [tab, setTab] = useState<Tab>("pokemon");
  const [seasonPick, setSeason] = useState<number | null>(null);
  const [rarity, setRarity] = useState<Rarity | "all">("all");
  const [era, setEra] = useState<Era | "all">("all");
  const [show, setShow] = useState<"all" | "owned" | "missing">("all");
  const [buyLeague, setBuyLeague] = useState<LeagueId>("pokemon");
  const [toast, setToast] = useState<string | null>(null);

  const released = useMemo(() => (today ? releasedCards(today) : []), [today]);
  const sets = useMemo(() => setsOf(released), [released]);
  const season = seasonPick ?? (today ? seasonOn(today).n : 1);
  const drop = today ? nextDrop(today) : null;
  const buyable = today ? leaguesOn(today) : [];

  // Finished sets: marked once, with a "Full set!" sticker for the sheet.
  useEffect(() => {
    if (!ready || !today) return;
    const done = completeSets(sets, col.owned).filter((s) => !col.sets.has(s.id));
    if (!done.length) return;
    // The sticker is dated by the newest paper finished (it's what earned the last card).
    const latest = Math.max(0, ...col.finished.keys());
    for (const s of done) {
      const marked = recordOnce(
        { type: "set_completed", set: s.id },
        (e) => e.type === "set_completed" && e.set === s.id,
      );
      if (marked) earnSticker(latest, "full-set");
    }
    const first = done[0]!;
    play("sticker");
    const t = window.setTimeout(
      () => setToast(`Set complete: ${first.name}. A “Full set!” sticker is on your sheet.`),
      0,
    );
    return () => window.clearTimeout(t);
  }, [ready, today, sets, col.owned, col.sets, col.finished]);

  const evolve = useMemo(() => evolvable(col), [col]);
  const doEvolve = (from: string, to: string, name: string) => {
    record({ type: "card_evolved", from, to });
    play("chime");
    setToast(`Your three copies evolved into ${name}!`);
  };

  const inSeason = released.filter((c) => c.season === season);
  const total = inSeason.length;
  const have = inSeason.filter((c) => col.owned.has(c.id)).length;
  const tabs: Tab[] = [...LEAGUE_IDS, ...(col.classic.size ? (["classic"] as const) : [])];
  const seasonInfo = SEASONS.find((s) => s.n === season)!;
  const leagueSets =
    tab === "classic" ? [] : sets.filter((s) => s.league === tab && s.season === season);
  const byId = new Map(released.map((c) => [c.id, c]));

  const pass = (id: string) => {
    const c = byId.get(id);
    if (!c) return false;
    if (rarity !== "all" && c.rarity !== rarity) return false;
    if (era !== "all" && c.era !== era) return false;
    const owned = col.owned.has(id);
    if (show === "owned" && !owned) return false;
    if (show === "missing" && owned) return false;
    return true;
  };

  const waiting = ready ? col.pending.length : 0;
  return (
    <div className="ya-album">
      <RewardHost />
      <Poster
        seed="attax-album"
        className="ya-hero"
        aria-label="Yay Attax, your card album"
        screen={{ fade: "corner", density: 0.5, area: "0 0 46% 58%", w: 460, h: 380 }}
      >
        <p className="ya-hero__kicker rt-meta">The Yay News presents</p>
        <RansomHeading as="h1" text="YAY ATTAX" seed="attax" cuts={TITLE} className="ya-hero__h" />
        <p className="ya-hero__line">
          Twelve leagues of cards, earned only by reading. Finish a paper for a scratch card and a
          blind box.
        </p>
        <dl className="ya-ledger" aria-label="Your collection">
          <div className="ya-ledger__item">
            <dt>cards this season</dt>
            <dd>
              <Misprint className="ya-ledger__n">{ready ? have : "–"}</Misprint>
              <span className="ya-ledger__of"> of {total}</span>
            </dd>
          </div>
          <div className="ya-ledger__item">
            <dt>Yay Coin{col.coins === 1 ? "" : "s"}</dt>
            <dd className="ya-ledger__n">{ready ? col.coins : "–"}</dd>
          </div>
          <div className="ya-ledger__item">
            <dt>set{col.sets.size === 1 ? "" : "s"} complete</dt>
            <dd className="ya-ledger__n">{ready ? col.sets.size : "–"}</dd>
          </div>
        </dl>
        <div className="ya-hero__cta">
          {waiting ? (
            <div className="ya-hero__offer">
              <p className="ya-hero__waiting">
                {waiting} reward{waiting === 1 ? "" : "s"} waiting to be opened:
              </p>
              <RewardOffer />
            </div>
          ) : (
            <GoButton href="/" sub="a scratch card and a blind box for finishing it">
              Read today&rsquo;s paper
            </GoButton>
          )}
          <nav className="ya-hero__games" aria-label="Games">
            <GoButton tone="quiet" href="/cards/clash">
              Card Clash
            </GoButton>
            <GoButton tone="quiet" href="/cards/battle">
              Deck Battle
            </GoButton>
          </nav>
        </div>
        {drop ? (
          <Sticker seed="drop" ground="b" tilt={4} pinned className="ya-hero__drop">
            <span className="ya-drop__when">New cards {shortDay(drop.date)}</span>
            <span className="ya-drop__what">
              {drop.name}, {drop.count} card{drop.count === 1 ? "" : "s"}
            </span>
          </Sticker>
        ) : null}
      </Poster>

      {toast ? (
        <p className="ya-toast" role="status">
          {toast}{" "}
          <button type="button" className="yk-btn yk-btn--a" onClick={() => setToast(null)}>
            OK
          </button>
        </p>
      ) : null}

      {ready && evolve.length ? (
        <Scrap seed="evolve" ground="white" as="aside" className="ya-panel">
          <Heading as="h2" id="ya-evolve-h" className="ya-h2">
            Ready to evolve
          </Heading>
          <ul className="ya-evolve" aria-labelledby="ya-evolve-h">
            {evolve.map(({ from, to }) => (
              <li key={from.id}>
                <button
                  type="button"
                  className="yk-btn"
                  onClick={() => doEvolve(from.id, to.id, to.name)}
                >
                  Evolve 3 × {from.name} into {to.name}
                </button>
              </li>
            ))}
          </ul>
        </Scrap>
      ) : null}

      <div className="ya-browse">
        <nav className="ya-seasons" aria-label="Season">
          {SEASONS.map((s) => (
            <button
              key={s.n}
              type="button"
              className="yk-toggle"
              aria-pressed={season === s.n}
              onClick={() => setSeason(s.n)}
            >
              {s.name}
            </button>
          ))}
        </nav>

        <div className="ya-tabs" role="tablist" aria-label="Leagues">
          {tabs.map((t) => {
            const count =
              t === "classic"
                ? col.classic.size
                : inSeason.filter((c) => c.league === t && col.owned.has(c.id)).length;
            const of = t === "classic" ? null : inSeason.filter((c) => c.league === t).length;
            return (
              <button
                key={t}
                type="button"
                role="tab"
                className="ya-tab"
                data-league={t}
                aria-selected={tab === t}
                onClick={() => setTab(t)}
              >
                <span className="ya-tab__name">
                  {t === "classic" ? "Classic (news)" : LEAGUES[t].short}
                </span>
                <small className="rt-meta">
                  {ready ? (of === null ? count : `${count}/${of}`) : ""}
                </small>
              </button>
            );
          })}
        </div>

        {tab !== "classic" ? (
          <section className="ya-filters" aria-label="Filter the album">
            <Chips label="Show">
              {(["all", "owned", "missing"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  className="yk-toggle"
                  aria-pressed={show === s}
                  onClick={() => setShow(s)}
                >
                  {s === "all" ? "Every card" : s === "owned" ? "Collected" : "Missing"}
                </button>
              ))}
            </Chips>
            <Chips label="Rarity">
              <button
                type="button"
                className="yk-toggle"
                aria-pressed={rarity === "all"}
                onClick={() => setRarity("all")}
              >
                Any
              </button>
              {RARITIES.map((r) => (
                <button
                  key={r}
                  type="button"
                  className="yk-toggle"
                  data-rarity={r}
                  aria-pressed={rarity === r}
                  onClick={() => setRarity(r)}
                >
                  {RARITY_NAME[r]}
                </button>
              ))}
            </Chips>
            <Chips label="Era">
              <button
                type="button"
                className="yk-toggle"
                aria-pressed={era === "all"}
                onClick={() => setEra("all")}
              >
                Any
              </button>
              {ERAS.map((e) => (
                <button
                  key={e}
                  type="button"
                  className="yk-toggle"
                  data-era={e}
                  aria-pressed={era === e}
                  onClick={() => setEra(e)}
                >
                  {ERA_NAME[e]}
                </button>
              ))}
            </Chips>
          </section>
        ) : null}
      </div>

      {tab === "classic" ? (
        <section className="ya-set" aria-labelledby="set-classic">
          <header className="ya-set__head">
            <Heading as="h2" id="set-classic" className="ya-set__name">
              Classic (news) cards
            </Heading>
            <p className="ya-set__sub">
              The first Yay Attax cards, made from the paper&rsquo;s stories. No new ones are
              printed; these are yours to keep.
            </p>
          </header>
          <ul className="ya-grid">
            {[...col.classic.values()].map((c) => (
              <li key={c.id} className="yk-sleeve">
                <ClassicCard card={c} />
              </li>
            ))}
          </ul>
        </section>
      ) : !ready || !today ? (
        <p className="ya-empty">Opening your album…</p>
      ) : leagueSets.length === 0 ? (
        <p className="ya-empty">
          {season > seasonOn(today).n
            ? `${seasonInfo.name} starts on ${dayName(seasonInfo.start)}, with ${seasonInfo.leagues
                .map((l) => LEAGUES[l].short)
                .join(", ")}.`
            : `No ${LEAGUES[tab].name} cards in ${seasonInfo.name}.`}
        </p>
      ) : (
        leagueSets.map((s) => {
          const ids = s.members.filter(pass);
          const got = s.members.filter((id) => col.owned.has(id)).length;
          const complete = got === s.members.length;
          return (
            <section key={s.id} className="ya-set" aria-labelledby={`set-${s.id}`}>
              <header className="ya-set__head">
                <Heading as="h2" id={`set-${s.id}`} className="ya-set__name">
                  {s.name}
                </Heading>
                <p className="ya-set__sub">{s.sub}</p>
                <p className="ya-set__count rt-meta">
                  {got} of {s.members.length} collected
                  {complete ? " · full set!" : ""}
                </p>
                {complete ? (
                  <RubberStamp seed={`full-${s.id}`} ink="a" tilt={-8} className="ya-set__stamp">
                    Full set
                  </RubberStamp>
                ) : null}
              </header>
              {ids.length ? (
                <ul className="ya-grid">
                  {ids.map((id) => {
                    const o = col.owned.get(id);
                    const c = byId.get(id)!;
                    return (
                      <li key={id} className={o ? "yk-sleeve" : "ya-grid__empty"}>
                        {o ? <YayCard card={c} copies={o.copies} /> : <CardOutline card={c} />}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="ya-empty">Nothing here with those filters.</p>
              )}
            </section>
          );
        })
      )}

      <Scrap
        seed="shop"
        ground="white"
        edge="zigzag"
        sides={["bottom"]}
        as="aside"
        className="ya-shop"
      >
        <Heading as="h2" id="ya-shop-h" className="ya-h2">
          Spend your coins
        </Heading>
        <p className="ya-shop__text">
          Duplicates turn into Yay Coins, and so do Card Clash and Deck Battle wins. {BOX_PRICE}{" "}
          coins buys a blind box of three from the league you choose. Coins can&rsquo;t be bought:
          only read, collected and won.
        </p>
        <div className="ya-shop__row">
          <label className="ya-shop__label">
            <span className="rt-meta">League</span>
            <select
              className="ya-shop__select"
              value={buyLeague}
              onChange={(e) => setBuyLeague(e.target.value as LeagueId)}
            >
              {buyable.map((l) => (
                <option key={l} value={l}>
                  {LEAGUES[l].name}
                </option>
              ))}
            </select>
          </label>
          <GoButton
            tone="ink"
            disabled={!ready || col.coins < BOX_PRICE || !buyable.includes(buyLeague)}
            onClick={() => openReward({ kind: "bought", key: null, league: buyLeague })}
            sub={
              ready && col.coins < BOX_PRICE
                ? `${BOX_PRICE - col.coins} more coin${BOX_PRICE - col.coins === 1 ? "" : "s"} to go`
                : `three ${LEAGUES[buyLeague].short} cards`
            }
          >
            Buy a blind box · {BOX_PRICE} coins
          </GoButton>
        </div>
      </Scrap>
    </div>
  );
}

const TITLE: readonly (Cut | typeof GAP)[] = [
  { ch: "YA", from: "gothic", size: 1.14 },
  { ch: "Y", from: "didone", size: 0.96, lift: 0.07, tuck: 0.03, turn: -4 },
  GAP,
  { ch: "AT", from: "slab", size: 1, turn: 1.5 },
  { ch: "T", from: "roman", size: 1.04, tuck: 0.03, lift: -0.03 },
  { ch: "A", from: "gothic", size: 1.12, tuck: 0.02, ground: "ink" },
  { ch: "X", from: "slab", size: 0.94, tuck: 0.03, lift: 0.05, turn: 3 },
];

const SHORT_DAY = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});
const shortDay = (date: string) => SHORT_DAY.format(new Date(`${date}T00:00:00Z`));

function Chips({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="ya-chips" role="group" aria-label={label}>
      <span className="ya-chips__label rt-meta" aria-hidden>
        {label}
      </span>
      {children}
    </div>
  );
}
