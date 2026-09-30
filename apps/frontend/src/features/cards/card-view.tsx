"use client";

import {
  type CSSProperties,
  type PointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { play } from "@/features/sound";
import { ERA_NAME, LEAGUES, RARITY_NAME } from "./leagues/meta";
import type { Card, Rarity } from "./types";
import "./attax.css";

// A Yay Attax card: a glossy trading card in its league's frame, with the picture, name, the
// league's four stats and the rarity mark on the front, and a bio line, the stats in full, the
// signature move and the picture's credit on the back. Tap to turn it over. Rare cards have a
// silver foil edge, Epic ones a violet-gold foil with a shimmer, and Legendary ones a holographic
// sheen that follows the pointer (or the phone's tilt); with reduced motion it all holds still.
// Older eras print with their own stamp and a retro finish.

const reduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function RarityMark({ rarity, className }: { rarity: Rarity; className?: string }) {
  const p = { className, viewBox: "0 0 24 24", "aria-hidden": true } as const;
  switch (rarity) {
    case "common":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="6" />
        </svg>
      );
    case "rare":
      return (
        <svg {...p}>
          <path d="M12 3l7 9-7 9-7-9z" />
        </svg>
      );
    case "epic":
      return (
        <svg {...p}>
          <path d="M12 1.8l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9l7.1-.6z" />
        </svg>
      );
    case "legendary":
      return (
        <svg {...p}>
          <path d="M3 8l4.5 3.5L12 4l4.5 7.5L21 8l-2 11H5z" />
        </svg>
      );
  }
}

/** The number printed big in the corner, and what it is. */
function headline(card: Card): { value: string; label: string } | null {
  if (card.league === "pokemon")
    return { value: String(card.base?.[0] ?? card.stats[0]), label: "HP" };
  if (card.rating) return { value: String(card.rating), label: "OVR" };
  const avg = Math.round(card.stats.reduce((s, x) => s + x, 0) / 4);
  return { value: String(avg), label: "AVG" };
}

const nameSize = (name: string) => (name.length > 18 ? 8.4 : name.length > 13 ? 9.6 : 11);

const kindLabel = (card: Card) =>
  card.league === "pokemon"
    ? card.kind
        .split("/")
        .map((t) => t[0]!.toUpperCase() + t.slice(1))
        .join(" · ")
    : card.kind[0]!.toUpperCase() + card.kind.slice(1);

export function CardArt({ card, className }: { card: Card; className?: string }) {
  const L = LEAGUES[card.league];
  if (card.image) {
    return (
      // Plain <img>: a local picture already sized for a card.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={card.image.src}
        alt={card.name}
        className={`yc-art ${card.image.src.endsWith(".png") ? "is-cutout" : ""} ${className ?? ""}`}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    );
  }
  // No picture: the name set big in the league's type, like a printer's proof.
  const initials = card.name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 3);
  return (
    <span className={`yc-art yc-art--type ${className ?? ""}`} aria-hidden>
      <span className="yc-art__initials">{initials}</span>
      <span className="yc-art__league">{L.short}</span>
    </span>
  );
}

export function YayCard({
  card,
  flipped: controlled,
  onFlip,
  highlight,
  onPickStat,
  copies,
  className,
  still,
}: {
  card: Card;
  /** Controlled side (else the card keeps its own). */
  flipped?: boolean;
  onFlip?: (flipped: boolean) => void;
  /** A stat to ring (Card Clash). */
  highlight?: number | null;
  /** Makes the stats buttons (Card Clash). */
  onPickStat?: (stat: number) => void;
  /** Copies owned, shown as a small tab when more than one. */
  copies?: number;
  className?: string;
  /** No turning over (in a battle, a share preview). */
  still?: boolean;
}) {
  const [own, setOwn] = useState(false);
  const flipped = controlled ?? own;
  const tilt = useRef<HTMLDivElement>(null);
  const L = LEAGUES[card.league];
  const legendary = card.rarity === "legendary";
  const head = headline(card);

  const turn = useCallback(() => {
    const next = !flipped;
    play("flip");
    if (controlled === undefined) setOwn(next);
    onFlip?.(next);
  }, [flipped, controlled, onFlip]);

  const aim = useCallback((x: number, y: number) => {
    const el = tilt.current;
    if (!el) return;
    el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
    el.style.setProperty("--rx", `${((0.5 - y) * 14).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${((x - 0.5) * 18).toFixed(2)}deg`);
  }, []);
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduced() || e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    aim((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
  };
  const onLeave = () => aim(0.5, 0.5);
  useEffect(() => {
    if (!legendary || reduced()) return;
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      aim(
        Math.max(0, Math.min(1, 0.5 + e.gamma / 60)),
        Math.max(0, Math.min(1, 0.5 + (e.beta - 40) / 60)),
      );
    };
    window.addEventListener("deviceorientation", onTilt);
    return () => window.removeEventListener("deviceorientation", onTilt);
  }, [legendary, aim]);

  const style = { "--accent": card.colour ?? L.accent } as CSSProperties;
  const label = `${card.name}: ${RARITY_NAME[card.rarity]} ${L.short} card${card.era === "current" ? "" : `, ${ERA_NAME[card.era]}`}`;
  return (
    <div
      className={`yc-card ${className ?? ""}`}
      data-league={card.league}
      data-rarity={card.rarity}
      data-era={card.era}
      data-kind={card.league === "pokemon" ? card.kind.split("/")[0] : undefined}
      style={style}
    >
      <div ref={tilt} className="yc-tilt" onPointerMove={onMove} onPointerLeave={onLeave}>
        <div className={`yc-inner ${flipped ? "is-flipped" : ""}`}>
          <article className="yc-face yc-front" aria-label={label} aria-hidden={flipped}>
            <div className="yc-frame">
              <span className="yc-deco" aria-hidden />
              <header className="yc-top">
                <h3 className="yc-name" style={{ fontSize: `${nameSize(card.name)}cqw` }}>
                  {card.name}
                </h3>
                {head ? (
                  <span className="yc-head">
                    <small>{head.label}</small>
                    {head.value}
                  </span>
                ) : null}
              </header>
              <div className="yc-window">
                <CardArt card={card} />
                {card.era !== "current" ? (
                  <span className="yc-era" aria-hidden>
                    {card.era === "legend" ? "Legend" : card.era}
                  </span>
                ) : null}
                <span className="yc-season" title={`Season ${card.season}`}>
                  S{card.season}
                </span>
              </div>
              <p className="yc-strip">
                <span>{kindLabel(card)}</span>
                <span className="yc-strip__team">{card.team}</span>
              </p>
              <dl className="yc-stats">
                {L.abbr.map((abbr, i) => (
                  <div key={abbr + i} className={`yc-stat ${highlight === i ? "is-picked" : ""}`}>
                    <dt>{abbr}</dt>
                    <dd>{card.stats[i]}</dd>
                    <span className="yc-bar" style={{ width: `${card.stats[i]}%` }} aria-hidden />
                    {onPickStat ? (
                      <button
                        type="button"
                        className="yc-stat__pick"
                        onClick={() => onPickStat(i)}
                        aria-label={`Play ${L.stats[i]}: ${card.stats[i]}`}
                      />
                    ) : null}
                  </div>
                ))}
              </dl>
              <footer className="yc-foot">
                <span className="yc-rarity">
                  <RarityMark rarity={card.rarity} className="yc-rarity__mark" />
                  {RARITY_NAME[card.rarity]}
                </span>
                <span className="yc-logo">{L.short}</span>
                <span className="yc-no">
                  {card.no}/{card.of}
                </span>
              </footer>
            </div>
            <span className="yc-gloss" aria-hidden />
            <span className="yc-shine" aria-hidden />
            <span className="yc-holo" aria-hidden />
            {copies && copies > 1 ? <span className="yc-copies">×{copies}</span> : null}
            {onPickStat || still ? null : (
              <button
                type="button"
                className="yc-turn"
                onClick={turn}
                aria-label={`Turn over: ${card.name}`}
                tabIndex={flipped ? -1 : 0}
              />
            )}
          </article>
          {still ? null : (
            <article className="yc-face yc-back" aria-hidden={!flipped}>
              <div className="yc-back__in">
                <p className="yc-back__logo">
                  Yay <b>Attax</b> · {L.name}
                </p>
                <h3 className="yc-back__name">{card.name}</h3>
                <p className="yc-back__meta">
                  {RARITY_NAME[card.rarity]} · {ERA_NAME[card.era]} · Season {card.season} · No.{" "}
                  {card.no}
                </p>
                <p className="yc-back__bio">{card.bio}</p>
                <dl className="yc-back__stats">
                  {L.stats.map((s, i) => (
                    <div key={s}>
                      <dt>{s}</dt>
                      <dd>
                        {card.stats[i]}
                        {card.base ? <small> (base {card.base[i]})</small> : null}
                      </dd>
                    </div>
                  ))}
                </dl>
                {card.move ? (
                  <p className="yc-back__move">
                    <b>{card.league === "wwe" ? "Finisher" : "Signature"}:</b> {card.move}
                  </p>
                ) : null}
                <p className="yc-back__credit">
                  {card.image ? `Picture: ${card.image.credit}` : "No picture yet"}
                </p>
                <button
                  type="button"
                  className="yc-back__turn"
                  onClick={turn}
                  tabIndex={flipped ? 0 : -1}
                >
                  Turn back
                </button>
              </div>
            </article>
          )}
        </div>
      </div>
    </div>
  );
}

/** An empty slot in the album: the outline where a missing card goes. */
export function CardOutline({ card }: { card: Card }) {
  return (
    <div
      className="yc-slot"
      data-league={card.league}
      role="img"
      aria-label={`Missing card: ${card.name}`}
    >
      <span className="yc-slot__q" aria-hidden>
        ?
      </span>
      <span className="yc-slot__label">{card.name}</span>
      <span className="yc-slot__sub">
        No. {card.no} · {RARITY_NAME[card.rarity]}
        {card.era !== "current" ? ` · ${ERA_NAME[card.era]}` : ""}
      </span>
    </div>
  );
}

/** The back of a face-down card (in a box, or the computer's hand). */
export function CardFaceDown({ className }: { className?: string }) {
  return (
    <div className={`yc-card yc-card--down ${className ?? ""}`} aria-hidden>
      <div className="yc-tilt">
        <div className="yc-inner">
          <div className="yc-face yc-cover">
            <span className="yc-cover__burst" />
            <span className="yc-cover__word">
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
