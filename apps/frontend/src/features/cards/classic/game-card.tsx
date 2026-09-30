"use client";

import Link from "next/link";
import {
  type CSSProperties,
  type PointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { play } from "@/features/sound";
import { RarityGlyph, TypeGlyph } from "./glyphs";
import { homeSetName, RARITY_NAME, setMark, shownStats, TYPE_NAME } from "./legacy";
import type { CardSnap, StatKey } from "./types";
import "./cards.css";

// A Yay Attax card: a printed trading card in its type's frame, with the photo, name, four stats
// and rarity mark on the front, and the story's summary and a link on the back. Tap to turn it
// over. Rare cards have a foil border, Epic ones a shimmer, and Legendary ones a holographic
// sheen that follows the pointer (or the phone's tilt); with reduced motion it all holds still.

export const STAT_NAME: Record<StatKey, string> = {
  wow: "Wow",
  giggle: "Giggle",
  aww: "Aww",
  reach: "Reach",
};

const DATE = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** Fewer words, bigger type: the name's size (in cqw) from its length. */
const nameSize = (name: string) =>
  name.length > 88 ? 5.6 : name.length > 70 ? 6.1 : name.length > 52 ? 6.8 : 7.8;

const reduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function GameCard({
  card,
  flipped: controlled,
  onFlip,
  highlight,
  onPickStat,
  className,
}: {
  card: CardSnap;
  /** Controlled side (else the card keeps its own). */
  flipped?: boolean;
  onFlip?: (flipped: boolean) => void;
  /** A stat to ring (Card Clash). */
  highlight?: StatKey | null;
  /** Makes the stats buttons (Card Clash). */
  onPickStat?: (stat: StatKey) => void;
  className?: string;
}) {
  const [own, setOwn] = useState(false);
  const flipped = controlled ?? own;
  const tilt = useRef<HTMLDivElement>(null);
  const stats = shownStats(card);
  const legendary = card.rarity === "legendary";

  const turn = useCallback(() => {
    const next = !flipped;
    play("flip");
    if (controlled === undefined) setOwn(next);
    onFlip?.(next);
  }, [flipped, controlled, onFlip]);

  // Holographic tilt: pointer on a computer, the phone's own tilt on a phone.
  const aim = useCallback((x: number, y: number) => {
    const el = tilt.current;
    if (!el) return;
    el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
    el.style.setProperty("--rx", `${((0.5 - y) * 14).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${((x - 0.5) * 18).toFixed(2)}deg`);
  }, []);
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!legendary || reduced() || e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    aim((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    if (legendary) aim(0.5, 0.5);
  };
  useEffect(() => {
    if (!legendary || reduced()) return;
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      const x = Math.max(0, Math.min(1, 0.5 + e.gamma / 60));
      const y = Math.max(0, Math.min(1, 0.5 + (e.beta - 40) / 60));
      aim(x, y);
    };
    window.addEventListener("deviceorientation", onTilt);
    return () => window.removeEventListener("deviceorientation", onTilt);
  }, [legendary, aim]);

  const style = { "--sec": card.sec.colour } as CSSProperties;
  const label = `${card.name}: ${RARITY_NAME[card.rarity]} ${TYPE_NAME[card.type]} card`;
  return (
    <div
      className={`ya-card ${className ?? ""}`}
      data-type={card.type}
      data-rarity={card.rarity}
      style={style}
    >
      <div ref={tilt} className="ya-card__tilt" onPointerMove={onMove} onPointerLeave={onLeave}>
        <div className={`ya-card__inner ${flipped ? "is-flipped" : ""}`}>
          <article
            className="ya-card__face ya-card__front"
            aria-label={label}
            aria-hidden={flipped}
          >
            <div className="ya-card__frame">
              <span className="ya-card__deco" aria-hidden />
              <header className="ya-card__top">
                <span className="ya-card__badge">
                  <TypeGlyph type={card.type} className="ya-card__glyph" />
                  {card.type === "generic" ? card.sec.name : TYPE_NAME[card.type]}
                </span>
                <span className="ya-card__set" title={`From the set ${homeSetName(card)}`}>
                  <TypeGlyph type={card.type} className="ya-card__set-glyph" />
                  {setMark(card.date)}
                </span>
              </header>
              <div className="ya-card__window">
                {card.photo ? (
                  // Plain <img>: the photo is the paper's own pressed print, shown at card size.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={card.photo}
                    alt={card.alt}
                    className="ya-card__photo"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span className="ya-card__nophoto" aria-hidden>
                    <TypeGlyph type={card.type} className="ya-card__nophoto-glyph" />
                  </span>
                )}
                <span className="ya-card__vinyl" aria-hidden />
              </div>
              <div className="ya-card__plate">
                <h3 className="ya-card__name" style={{ fontSize: `${nameSize(card.name)}cqw` }}>
                  {card.name}
                </h3>
                <p className="ya-card__kicker">{card.kicker}</p>
              </div>
              <dl className="ya-card__stats">
                {(Object.keys(STAT_NAME) as StatKey[]).map((k) => (
                  <div
                    key={k}
                    className={`ya-card__stat ${highlight === k ? "is-picked" : ""}`}
                    data-stat={k}
                  >
                    <dt>{STAT_NAME[k]}</dt>
                    <dd>{stats[k]}</dd>
                    {onPickStat ? (
                      <button
                        type="button"
                        className="ya-card__stat-pick"
                        onClick={() => onPickStat(k)}
                        aria-label={`Play ${STAT_NAME[k]}: ${stats[k]}`}
                      />
                    ) : null}
                  </div>
                ))}
              </dl>
              <footer className="ya-card__foot">
                <span className="ya-card__rarity">
                  <RarityGlyph rarity={card.rarity} className="ya-card__rarity-glyph" />
                  {RARITY_NAME[card.rarity]}
                </span>
                <span className="ya-card__no">No. {card.issue}</span>
              </footer>
            </div>
            <span className="ya-card__shine" aria-hidden />
            <span className="ya-card__holo" aria-hidden />
            {onPickStat ? null : (
              <button
                type="button"
                className="ya-card__turn"
                onClick={turn}
                aria-label={`Turn over: ${card.name}`}
                tabIndex={flipped ? -1 : 0}
              />
            )}
          </article>
          <article className="ya-card__face ya-card__back" aria-hidden={!flipped}>
            <div className="ya-card__back-in">
              <TypeGlyph type={card.type} className="ya-card__watermark" />
              <p className="ya-card__logo">
                Yay <b>Attax</b>
              </p>
              <p className="ya-card__back-type">
                <TypeGlyph type={card.type} className="ya-card__glyph" />
                {RARITY_NAME[card.rarity]} · {TYPE_NAME[card.type]}
              </p>
              <h3 className="ya-card__back-name">{card.name}</h3>
              <p className="ya-card__summary">{card.summary}</p>
              <p className="ya-card__meta">
                {card.sec.name} · No. {card.issue} ·{" "}
                {DATE.format(new Date(`${card.date}T00:00:00Z`))}
              </p>
              <p className="ya-card__back-links">
                <Link
                  href={`/issue/${card.issue}/story/${card.slug}`}
                  className="ya-card__read"
                  tabIndex={flipped ? 0 : -1}
                >
                  Read the story
                </Link>
                <button
                  type="button"
                  className="ya-card__turn-back"
                  onClick={turn}
                  tabIndex={flipped ? 0 : -1}
                >
                  Turn back
                </button>
              </p>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}

/** An empty slot in the album: the outline where a missing card goes. */
export function CardSlot({ label, sub }: { label: string; sub?: string }) {
  return (
    <div className="ya-slot" role="img" aria-label={`Missing card: ${label}`}>
      <span className="ya-slot__q" aria-hidden>
        ?
      </span>
      <span className="ya-slot__label">{label}</span>
      {sub ? <span className="ya-slot__sub">{sub}</span> : null}
    </div>
  );
}

/** The back of a face-down card (in a pack, or the computer's hand in Card Clash). */
export function CardBackside({ className }: { className?: string }) {
  return (
    <div className={`ya-card ya-card--down ${className ?? ""}`} aria-hidden>
      <div className="ya-card__tilt">
        <div className="ya-card__inner">
          <div className="ya-card__face ya-card__cover">
            <span className="ya-card__cover-burst" />
            <span className="ya-card__cover-word">
              Yay
              <br />
              Attax
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
