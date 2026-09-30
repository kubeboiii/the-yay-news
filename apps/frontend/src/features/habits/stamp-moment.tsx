"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { play } from "@/features/sound";
import { stampInk } from "./catalogue";
import type { StampInfo } from "./core";
import { habitFonts } from "./fonts";
import { RubberStamp, longDate } from "./stamp";
import "./stamp-moment.css";

/** A wooden hand stamp seen from the side: knob, neck, block, rubber inked in `ink`. */
export function Stamper({ ink }: { ink: string }) {
  return (
    <svg viewBox="0 0 200 230" className="hb-stamper__art" aria-hidden>
      {/* Knob */}
      <ellipse cx={100} cy={40} rx={42} ry={34} fill="#9a6a3e" />
      <ellipse cx={92} cy={32} rx={24} ry={15} fill="#b7834f" />
      <path
        d="M72 30 C80 20 96 16 110 20"
        stroke="#d8a86f"
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
      />
      {/* Neck */}
      <path d="M80 66 C84 90 84 110 76 128 L124 128 C116 110 116 90 120 66 Z" fill="#8a5d34" />
      <path d="M92 72 C94 92 94 108 90 124" stroke="#6f4826" strokeWidth={2} fill="none" />
      {/* Block */}
      <path d="M22 128 L178 128 L182 186 L18 186 Z" fill="#b98652" />
      <path d="M22 128 L178 128 L180 140 L20 140 Z" fill="#cd9a62" />
      {[146, 156, 168, 178].map((y, i) => (
        <path
          key={y}
          d={`M${26 + i * 3} ${y} C70 ${y - 4} 120 ${y + 4} ${174 - i * 2} ${y - 1}`}
          stroke="#9a6a3e"
          strokeWidth={1.6}
          fill="none"
          opacity={0.7}
        />
      ))}
      {/* A paper label on the block */}
      <rect x={70} y={148} width={60} height={24} fill="#efe4cc" transform="rotate(-2 100 160)" />
      <text
        x={100}
        y={165}
        textAnchor="middle"
        fontSize={11}
        fill="#3a2d20"
        transform="rotate(-2 100 160)"
        style={{ fontFamily: "var(--hb-stamp), monospace" }}
      >
        YAY
      </text>
      {/* Rubber, with ink on it */}
      <rect x={24} y={186} width={152} height={12} fill="#3b3430" />
      <rect x={26} y={198} width={148} height={8} fill={ink} />
    </svg>
  );
}

/**
 * The stamping moment: the book's page, a rubber stamp coming down on it with a thunk, and the
 * impression left behind. Plays once on mount (remount with a new `key` to play again).
 */
export function StampingScene({
  stamp,
  onLanded,
  className,
}: {
  stamp: StampInfo;
  onLanded?: () => void;
  className?: string;
}) {
  const ink = stampInk(stamp.design, stamp.colourway);
  const landed = useRef(onLanded);
  useEffect(() => {
    landed.current = onLanded;
  }, [onLanded]);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = window.setTimeout(
      () => {
        play("stamp");
        landed.current?.();
      },
      reduce ? 0 : 520,
    );
    return () => window.clearTimeout(t);
  }, []);
  return (
    <div className={`hb-scene ${habitFonts} ${className ?? ""}`}>
      <div className="hb-scene__page">
        <span className="hb-scene__slot" aria-hidden />
        <RubberStamp stamp={stamp} className="hb-scene__impression" />
        <div className="hb-stamper" aria-hidden>
          <span className="hb-stamper__shadow" />
          <Stamper ink={ink} />
        </div>
      </div>
    </div>
  );
}

/**
 * The card that slides in when an edition is finished: the stamp going into the book, the streak,
 * and a way to the stamp book. Not a modal; it stays out of the way and can be closed.
 */
export function StampMoment({
  stamp,
  streak,
  onClose,
  floating = true,
}: {
  stamp: StampInfo;
  /** The streak including this paper, if known. */
  streak?: number | null;
  onClose?: () => void;
  /** Pinned to the corner of the screen (true) or laid in the page flow. */
  floating?: boolean;
}) {
  const [landed, setLanded] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  return (
    <aside
      className={`hb-moment ${habitFonts} ${floating ? "is-floating" : ""}`}
      role="status"
      aria-label={`Stamped: No. ${stamp.issue}`}
    >
      <StampingScene stamp={stamp} onLanded={() => setLanded(true)} />
      <div className={`hb-moment__note ${landed ? "is-in" : ""}`}>
        <p className="hb-moment__big">That&rsquo;s today&rsquo;s paper, finished.</p>
        <p className="hb-moment__small">
          No. {stamp.issue} · {longDate(stamp.date)} is stamped in your book
          {streak && streak > 1 ? (
            <>
              {" "}
              · <b>{streak} days</b> in a row
            </>
          ) : null}
          .
        </p>
        <p className="hb-moment__links">
          <Link href="/stamps" className="hb-moment__link">
            Open your stamp book
          </Link>
          {onClose ? (
            <button ref={closeRef} type="button" className="hb-moment__close" onClick={onClose}>
              Close
            </button>
          ) : null}
        </p>
      </div>
    </aside>
  );
}
