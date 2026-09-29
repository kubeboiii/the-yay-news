"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  CSSProperties,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import { edition } from "@/app/mockups/_data/sample-edition";
import { Burst } from "../burst";
import { Mark } from "../mark";
import {
  artForIssue,
  couponForIssue,
  issueRand,
  lineArtForIssue,
  postcardForIssue,
  posterForIssue,
  stampPhoto,
} from "./data";
import { StickerArt, stickerDefs } from "./stickers";

const pad = (n: number, w: number) => String(n).padStart(w, "0");

/** The date an issue came out: one issue a day, counted back from today's. */
function issueDate(issue: number) {
  const d = new Date(Date.UTC(2026, 8, 30));
  d.setUTCDate(d.getUTCDate() - (edition.issue - issue));
  return d;
}

const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function read(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Storage blocked: the change lasts for this visit.
  }
}

// ———————————————————————————— 1. Guest artist print ————————————————————————————

export function ArtPrintInsert({ issue }: { issue: number }) {
  const art = artForIssue(issue);
  const number = Math.floor(issueRand(issue, 11)() * 100) + 1;
  return (
    <div className="yi-print">
      <div className="yi-print__sheet">
        <p className="yi-print__over">
          <span>The Yay News</span>
          <span>Guest artist print · No. {issue}</span>
        </p>
        <div className="yi-print__plate">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={art.src}
            alt={`${art.title}, drawn by ${art.artist}`}
            className="yi-print__art"
            style={{
              aspectRatio: String(art.ratio),
              width: art.ratio < 1 ? `${Math.round(art.ratio * 100)}%` : "100%",
            }}
            draggable={false}
          />
        </div>
        <div className="yi-print__pencil">
          <span className="yi-print__num">{number}/100</span>
          <span className="yi-print__title">“{art.title}”</span>
          <span className="yi-print__sig">
            {art.artist}
            <Mark name="brush-03" ink="#6f6b66" className="yi-print__flourish" />
          </span>
        </div>
        <div className="yi-print__colophon">
          <p>
            Guest artist this week: <b>{art.artist}</b> · via Unsplash
          </p>
          <p>
            {art.medium} · printed for issue {issue} on 300gsm cotton rag, edition of 100
          </p>
        </div>
        <span className="yi-print__chop" aria-hidden>
          YN
        </span>
      </div>
    </div>
  );
}

// ———————————————————————————— 2. Sticker sheet ————————————————————————————

// Where each sticker sits on the printed sheet: centre x and y as shares of the sheet, and a tilt.
const sheetLayout: Record<string, { x: number; y: number; rot: number }> = {
  "good-news": { x: 28, y: 31, rot: -7 },
  yay: { x: 72, y: 20, rot: 5 },
  issue: { x: 77, y: 42, rot: 0 },
  heart: { x: 19, y: 58, rot: -10 },
  finished: { x: 58, y: 60, rot: 3 },
  smile: { x: 23, y: 80, rot: 0 },
  star: { x: 53, y: 81, rot: 12 },
  hi: { x: 81, y: 77, rot: -4 },
};

export function StickerSheetInsert({
  issue,
  onSheet,
  onGrab,
  onPlace,
}: {
  issue: number;
  /** Stickers still on the sheet (not yet stuck on this page). */
  onSheet: Set<string>;
  onGrab: (id: string, e: ReactPointerEvent<HTMLElement>) => void;
  /** Keyboard: stick it somewhere on the page without dragging. */
  onPlace: (id: string) => void;
}) {
  return (
    <div className="yi-stickers">
      <div className="yi-stickers__sheet">
        <p className="yi-stickers__head">
          <span>The Yay News</span>
          <span>Sticker sheet · No. {issue}</span>
        </p>
        {stickerDefs.map((s) => {
          const at = sheetLayout[s.id] ?? { x: 50, y: 50, rot: 0 };
          const there = onSheet.has(s.id);
          const style = {
            left: `${at.x}%`,
            top: `${at.y}%`,
            width: `${s.w}%`,
            aspectRatio: String(1 / s.ratio),
            "--st-rot": `${at.rot}deg`,
          } as CSSProperties;
          return there ? (
            <button
              key={s.id}
              type="button"
              className="yi-slot"
              style={style}
              aria-label={`Sticker: ${s.label}. Drag it onto the page, or press Enter to stick it on`}
              onPointerDown={(e) => onGrab(s.id, e)}
              onClick={(e) => {
                // A drag ends in a click too; only a keyboard press (detail 0) places it from here.
                if (e.detail === 0) onPlace(s.id);
              }}
            >
              <span className="yi-vinyl">
                <StickerArt id={s.id} issue={issue} />
              </span>
            </button>
          ) : (
            <span key={s.id} className="yi-slot yi-slot--empty" style={style} aria-hidden>
              <span className="yi-vinyl">
                <StickerArt id={s.id} issue={issue} />
              </span>
            </span>
          );
        })}
        <p className="yi-stickers__foot">
          Peel one off and stick it anywhere on the page. Double-click a sticker to peel it back.
        </p>
      </div>
    </div>
  );
}

// ———————————————————————————— 3. Coupon ————————————————————————————

/** A torn edge along the perforation: the same jagged line on both halves, so they fit. */
function tearPath(issue: number) {
  const rand = issueRand(issue, 13);
  const pts: [number, number][] = [];
  const steps = 26;
  for (let i = 0; i <= steps; i++) pts.push([rand() * 1.6, (i / steps) * 100]);
  return pts;
}

export function CouponInsert({ issue, startTorn }: { issue: number; startTorn: boolean }) {
  const coupon = couponForIssue(issue);
  const serialRand = issueRand(issue, 17);
  const serial = `${pad(issue, 3)}·${pad(Math.floor(serialRand() * 90000) + 10000, 5)}`;
  const storeKey = `yn-insert-coupon:${issue}`;
  const [torn, setTorn] = useState(false);
  const [tearing, setTearing] = useState(false);

  useEffect(() => {
    // The coupon renders whole on the server; a saved tear is only known once storage is readable.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of browser storage
    setTorn(startTorn || read(storeKey) === "torn");
  }, [startTorn, storeKey]);

  const edge = useMemo(() => tearPath(issue), [issue]);
  // The stub keeps the left of the tear, the coupon the right; both clip to the same line.
  const stubClip = `polygon(0 0, ${edge.map(([x, y]) => `calc(100% - 1.6% + ${x}%) ${y}%`).join(", ")}, 0 100%)`;
  const mainClip = `polygon(${edge.map(([x, y]) => `${x}% ${y}%`).join(", ")}, 100% 100%, 100% 0)`;

  const tear = () => {
    if (torn) return;
    setTearing(true);
    setTorn(true);
    write(storeKey, "torn");
  };
  const mainRef = useRef<HTMLButtonElement>(null);
  const mend = () => {
    setTorn(false);
    setTearing(false);
    write(storeKey, null);
    // The mend button goes with the tear, so the coupon itself takes the focus back.
    mainRef.current?.focus();
  };

  return (
    <div className={`yi-coupon ${torn ? "is-torn" : ""} ${tearing ? "is-tearing" : ""}`}>
      <div className="yi-coupon__stub" style={torn ? { clipPath: stubClip } : undefined}>
        <p className="yi-coupon__keep">Keep this half</p>
        <p className="yi-coupon__serial">No. {serial}</p>
        <Mark name="stars-21" ink="var(--yi-ink)" className="yi-coupon__stubstar" />
      </div>
      <div className="yi-coupon__perf" aria-hidden>
        <span className="yi-coupon__scissors">✂</span>
      </div>
      <button
        ref={mainRef}
        type="button"
        className="yi-coupon__main"
        style={torn ? { clipPath: mainClip } : undefined}
        onClick={tear}
        aria-label={
          torn
            ? `${coupon.head} — torn off and yours to keep`
            : `${coupon.head}. Tear it off along the dotted line`
        }
      >
        <span className="yi-coupon__over">
          <span>The Yay News · Coupon</span>
          <span>Issue {issue}</span>
        </span>
        <span className="yi-coupon__head">{coupon.head}</span>
        <span className="yi-coupon__small">{coupon.small} No cash value. Never expires.</span>
        <span className="yi-coupon__foot">
          <span className="yi-coupon__no">Serial {serial}</span>
          <span className="yi-coupon__tear">
            {torn ? "Yours now. Spend it well." : "Tear along the dotted line"}
          </span>
        </span>
        <Burst fill="var(--yi-a)" points={18} depth={0.16} className="yi-coupon__burst print-worn">
          <span className="yi-coupon__free">Free</span>
        </Burst>
      </button>
      {torn ? (
        <button type="button" className="yi-coupon__mend" onClick={mend}>
          Tape it back on
        </button>
      ) : null}
    </div>
  );
}

// ———————————————————————————— 4. Postcard ————————————————————————————

export function PostcardInsert({ issue, startBack }: { issue: number; startBack: boolean }) {
  const card = postcardForIssue(issue);
  const [back, setBack] = useState(startBack);
  const [sent, setSent] = useState<null | "shared" | "copied" | "failed">(null);
  const [shareUrl, setShareUrl] = useState("");
  const d = issueDate(issue);
  const postmarkDate = `${pad(d.getUTCDate(), 2)} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;

  const send = async () => {
    // Send the page itself, without the switches used to preview this card.
    const u = new URL(window.location.href);
    for (const k of ["insert-open", "insert-side", "insert-torn", "arrive"])
      u.searchParams.delete(k);
    u.hash = "";
    const url = u.toString();
    setShareUrl(url);
    const text = `${card.caption}. ${card.note} — from The Yay News, issue ${issue}`;
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title: "A postcard from The Yay News", text, url });
        setSent("shared");
        return;
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setSent("copied");
      return;
    } catch {
      // Clipboard refused (no permission, or an embedded frame): try the older copy route.
    }
    const field = document.createElement("textarea");
    field.value = url;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    const copied = document.execCommand("copy");
    field.remove();
    setSent(copied ? "copied" : "failed");
  };

  const flipFromFace = (e: ReactMouseEvent) => {
    if ((e.target as HTMLElement).closest("button, a")) return;
    setBack((b) => !b);
  };

  return (
    <div className={`yi-post ${back ? "is-back" : ""}`}>
      <div className="yi-post__card">
        <div className="yi-post__face yi-post__front" onClick={flipFromFace} aria-hidden={back}>
          <div
            className="yi-post__photo"
            style={{ backgroundImage: `url(${card.photo})` }}
            role="img"
            aria-label={card.caption}
          />
          <p className="yi-post__caption">{card.caption}</p>
          <p className="yi-post__credit">
            Photograph: {card.credit} · The Yay News, issue {issue}
          </p>
          <button
            type="button"
            className="yi-post__turn"
            onClick={() => setBack(true)}
            tabIndex={back ? -1 : 0}
          >
            Turn it over
          </button>
        </div>
        <div className="yi-post__face yi-post__back" onClick={flipFromFace} aria-hidden={!back}>
          <p className="yi-post__label">Post card</p>
          <div className="yi-post__left">
            <p className="yi-post__note">{card.note}</p>
            <p className="yi-post__sign">— with love from the desk at The Yay News</p>
            <p className="yi-post__fine">
              Printed on recycled card for issue {issue}. Front: {card.credit}.
            </p>
          </div>
          <div className="yi-post__right">
            <div className="yi-post__stamp">
              <div
                className="yi-post__stamp-photo"
                style={{ backgroundImage: `url(${stampPhoto})` }}
              />
              <span className="yi-post__stamp-val">{issue}p</span>
            </div>
            <div className="yi-post__postmark" aria-hidden>
              <svg viewBox="0 0 100 100" className="yi-post__postmark-ring">
                <defs>
                  <path
                    id={`yi-pm-${issue}`}
                    d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0"
                  />
                </defs>
                <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle
                  cx="50"
                  cy="50"
                  r="27"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <text fontSize="10.5" letterSpacing="2.2" fill="currentColor">
                  <textPath href={`#yi-pm-${issue}`} startOffset="2%">
                    THE YAY NEWS · GOOD NEWS DESK ·
                  </textPath>
                </text>
                <text x="50" y="47" fontSize="6.6" textAnchor="middle" fill="currentColor">
                  {postmarkDate}
                </text>
                <text
                  x="50"
                  y="60"
                  fontSize="10"
                  textAnchor="middle"
                  fill="currentColor"
                  fontWeight="700"
                >
                  No. {issue}
                </text>
              </svg>
              <Mark
                name="brush-02"
                ink="currentColor"
                className="yi-post__cancel yi-post__cancel--1"
              />
              <Mark
                name="brush-02"
                ink="currentColor"
                className="yi-post__cancel yi-post__cancel--2"
              />
            </div>
            <div className="yi-post__address">
              <p>
                <span>To</span> someone who could do
              </p>
              <p>with a bit of good news,</p>
              <p>wherever they are today</p>
              <p>Earth</p>
            </div>
            <button type="button" className="yi-post__send" onClick={send} tabIndex={back ? 0 : -1}>
              Send it to someone →
            </button>
          </div>
          {sent === "shared" || sent === "copied" ? (
            <span className="yi-post__sent print-worn" role="status">
              {sent === "shared" ? "Sent!" : "Link copied"}
            </span>
          ) : null}
          {sent === "failed" ? (
            <p className="yi-post__url" role="status">
              Copy this address to send it: <span>{shareUrl}</span>
            </p>
          ) : null}
          <button
            type="button"
            className="yi-post__turn yi-post__turn--back"
            onClick={() => setBack(false)}
            tabIndex={back ? 0 : -1}
          >
            Turn it over
          </button>
        </div>
      </div>
    </div>
  );
}

// ———————————————————————————— 5. Colouring panel ————————————————————————————

const CANVAS_W = 1000;

export function ColouringInsert({ issue }: { issue: number }) {
  const art = lineArtForIssue(issue);
  const canvasH = Math.round(CANVAS_W / art.ratio);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const last = useRef<{ x: number; y: number } | null>(null);
  const drawing = useRef(false);
  const [crayon, setCrayon] = useState(0);
  const crayons = ["var(--yi-a)", "var(--yi-b)", "var(--yi-c)", "var(--yi-d)", "var(--yi-ink)"];
  const names = ["first colour", "second colour", "third colour", "fourth colour", "black"];
  const [inks, setInks] = useState<string[]>([]);
  const storeKey = `yn-insert-colour:${issue}:${art.id}`;

  // Crayon colours are custom properties; the canvas needs them resolved to real colours.
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const cs = getComputedStyle(el);
    setInks(
      ["--yi-a", "--yi-b", "--yi-c", "--yi-d", "--yi-ink"].map(
        (v) => cs.getPropertyValue(v).trim() || "#e33",
      ),
    );
    const saved = read(storeKey);
    if (saved) {
      const img = new Image();
      img.onload = () => el.getContext("2d")?.drawImage(img, 0, 0, CANVAS_W, canvasH);
      img.src = saved;
    }
  }, [storeKey, canvasH]);

  const at = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    // The panel lies almost square on the desk (a fraction of a degree), so its on-screen box
    // maps straight onto the canvas without a visible offset.
    const r = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * CANVAS_W,
      y: ((e.clientY - r.top) / r.height) * canvasH,
    };
  };

  const strokeTo = useCallback(
    (p: { x: number; y: number }) => {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      const from = last.current ?? p;
      const dist = Math.hypot(p.x - from.x, p.y - from.y);
      const steps = Math.max(1, Math.ceil(dist / 1.6));
      ctx.globalCompositeOperation = "multiply";
      ctx.fillStyle = inks[crayon] ?? "#e33";
      // Wax on paper: many small, uneven specks rather than a smooth line, so the grain shows.
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const cx = from.x + (p.x - from.x) * t;
        const cy = from.y + (p.y - from.y) * t;
        for (let k = 0; k < 7; k++) {
          const a = Math.random() * Math.PI * 2;
          const r = Math.sqrt(Math.random()) * 11;
          ctx.globalAlpha = 0.1 + Math.random() * 0.22;
          ctx.fillRect(
            cx + Math.cos(a) * r,
            cy + Math.sin(a) * r,
            1.4 + Math.random() * 2.2,
            1.2 + Math.random() * 1.8,
          );
        }
      }
      ctx.globalAlpha = 1;
      last.current = p;
    },
    [crayon, inks],
  );

  const save = () => {
    const el = canvasRef.current;
    if (el) write(storeKey, el.toDataURL("image/png"));
  };

  const clear = () => {
    const el = canvasRef.current;
    el?.getContext("2d")?.clearRect(0, 0, CANVAS_W, canvasH);
    write(storeKey, null);
  };

  return (
    <div className="yi-colour">
      <div className="yi-colour__sheet">
        <p className="yi-colour__over">
          <span>The Yay News · Colouring page</span>
          <span>Issue {issue}</span>
        </p>
        <h2 className="yi-colour__head">Colour me in, then pin me up</h2>
        <div className="yi-colour__frame">
          <div className="yi-colour__art" style={{ aspectRatio: String(art.ratio) }}>
            <canvas
              ref={canvasRef}
              width={CANVAS_W}
              height={canvasH}
              className="yi-colour__canvas"
              aria-label={`Colouring area: ${art.subject}. Pick a crayon, then draw over the picture`}
              role="img"
              onPointerDown={(e) => {
                try {
                  e.currentTarget.setPointerCapture(e.pointerId);
                } catch {
                  // No live pointer to capture (a synthetic event): colour without capture.
                }
                drawing.current = true;
                last.current = null;
                strokeTo(at(e));
              }}
              onPointerMove={(e) => {
                if (!drawing.current) return;
                strokeTo(at(e));
              }}
              onPointerUp={() => {
                drawing.current = false;
                last.current = null;
                save();
              }}
              onPointerCancel={() => {
                drawing.current = false;
                last.current = null;
                save();
              }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={art.src} alt="" className="yi-colour__lines" draggable={false} />
          </div>
        </div>
        <div className="yi-colour__tray" role="radiogroup" aria-label="Crayons">
          {crayons.map((c, i) => (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={crayon === i}
              aria-label={`${names[i]} crayon`}
              className="yi-crayon"
              onClick={() => setCrayon(i)}
            >
              <Mark name="doodles-07" ink={c} className="yi-crayon__mark" />
            </button>
          ))}
          <button type="button" className="yi-colour__clear" onClick={clear}>
            Start again
          </button>
        </div>
        <p className="yi-colour__credit">
          Line drawing: {art.subject}, by <b>{art.artist}</b> · via Unsplash
        </p>
      </div>
    </div>
  );
}

// ———————————————————————————— 6. Fold-out poster ————————————————————————————

export function PosterInsert({
  issue,
  open,
  onFoldAway,
}: {
  issue: number;
  open: boolean;
  onFoldAway: () => void;
}) {
  const poster = posterForIssue(issue);
  const art = (offset: number) => (
    <div className="yi-poster__art" style={{ left: `${-offset * 100}%` }}>
      <div className="yi-poster__photo" style={{ backgroundImage: `url(${poster.photo})` }} />
      <p className="yi-poster__head">{poster.head}</p>
      <div className="yi-poster__band">
        <span>{poster.sub}</span>
        <span>
          Photograph: {poster.credit} · The Yay News fold-out, issue {issue}
        </span>
      </div>
    </div>
  );
  return (
    <div className={`yi-poster ${open ? "is-open" : ""}`}>
      <div
        className="yi-poster__scroller"
        tabIndex={0}
        aria-label={`Fold-out poster: ${poster.head}`}
      >
        <div className="yi-poster__track">
          <div className="yi-fold yi-fold--0">
            <div className="yi-fold__face">{art(0)}</div>
            <div className="yi-fold__shade" />
            <div className="yi-fold yi-fold--1">
              <div className="yi-fold__face">{art(1)}</div>
              <div className="yi-fold__back" />
              <div className="yi-fold__shade" />
              <div className="yi-fold yi-fold--2">
                <div className="yi-fold__face">{art(2)}</div>
                <div className="yi-fold__back" />
                <div className="yi-fold__shade" />
                <button type="button" className="yi-poster__away" onClick={onFoldAway}>
                  Fold it away
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
