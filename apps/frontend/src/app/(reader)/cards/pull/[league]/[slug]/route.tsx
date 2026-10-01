// GET /cards/pull/<league>/<slug> — "Share your pull": one Yay Attax card as a 1080×1350 PNG,
// taped to a torn sheet of the riot kit's plate A, with "Pulled in The Yay News" cut out under it,
// for sharing after a Rare or better pull. Rendered with next/og like the clippings (app/clip),
// then kept in memory; cards change only with the data.

import { ImageResponse } from "next/og";
import { asset } from "@/app/clip/_lib/assets";
import { loadFonts } from "@/app/clip/_lib/fonts";
import { CARD_BY_ID } from "@/features/cards/leagues/index";
import { ERA_NAME, LEAGUES, RARITY_NAME } from "@/features/cards/leagues/meta";
import { CARDS_COLOURWAY } from "@/features/cards/colourway";
import type { Card, Rarity } from "@/features/cards/types";
import { riotInks } from "@/features/riot/tokens/inks";

const W = 1080;
const H = 1350;
const rendered = new Map<string, ArrayBuffer>();

const EDGE: Record<Rarity, string> = {
  common: "#f4f4f4",
  rare: "linear-gradient(135deg, #b9bec5, #f7f8fa, #8e959e, #eef0f3, #a2a9b2)",
  epic: "linear-gradient(135deg, #6b3fc4, #f3d27a, #9b5de5, #ffe9a8, #7a47d1)",
  legendary: "linear-gradient(135deg, #ff6b8b, #ffd23f, #7cf29a, #5fd4ff, #b28dff, #ff6b8b)",
};

// The riot kit's house inks (the cards pages' colourway): paper, plate A, plate B, A × B, black.
const INKS = riotInks({ colourway: CARDS_COLOURWAY });

const TORN =
  "polygon(0 0, 100% 0, 99.2% 12%, 100% 27%, 99.4% 44%, 100% 61%, 99.1% 78%, 100% 92%, 98% 100%, 86% 99.1%, 71% 100%, 55% 99.2%, 38% 100%, 22% 99.3%, 8% 100%, 0 99%)";

/** "Pulled in The Yay News", cut from three or four papers, one letter reversed out of black. */
const CUTS: {
  ch: string;
  font: string;
  size: number;
  turn: number;
  paper: string;
  ink?: boolean;
}[] = [
  { ch: "PUL", font: "League Gothic", size: 112, turn: -1, paper: "#ede6d4" },
  { ch: "LED", font: "Alfa Slab One", size: 84, turn: 2, paper: "#f1ecdc" },
  { ch: "IN", font: "League Gothic", size: 104, turn: 0, paper: "#fdfbf6", ink: true },
  { ch: "THE", font: "Courier Prime", size: 58, turn: -3, paper: "#f4f1e8" },
  { ch: "YAY", font: "Alfa Slab One", size: 88, turn: 1, paper: "#fdfbf6" },
  { ch: "NEWS", font: "League Gothic", size: 112, turn: -2, paper: "#ede6d4" },
];

/** A halftone screen fading out from the sheet's top right corner: [x, y, r] dots. */
const SCREEN: [number, number, number][] = [];
for (let y = 9; y < 360; y += 18) {
  for (let x = 9 + ((y / 18) % 2) * 9; x < 420; x += 18) {
    const t = 1 - Math.hypot(420 - x, y) / 470;
    if (t > 0.04) SCREEN.push([x, y, Math.round(t * 5.5 * 10) / 10]);
  }
}

/** A strip of masking tape over a top corner of the card. */
function Tape({ left, rotate }: { left: number; rotate: number }) {
  return (
    <div
      style={{
        display: "flex",
        position: "absolute",
        top: -6,
        left,
        width: 120,
        height: 38,
        background: "rgba(236, 226, 196, 0.86)",
        transform: `rotate(${rotate}deg)`,
      }}
    />
  );
}

function CardImage({ card }: { card: Card }) {
  const L = LEAGUES[card.league];
  const accent = card.colour ?? L.accent;
  const pic = card.image ? asset(card.image.src.slice(1)) : null;
  const cutout = card.image?.src.endsWith(".png");
  const head =
    card.league === "pokemon"
      ? { v: String(card.base?.[0] ?? card.stats[0]), l: "HP" }
      : card.rating
        ? { v: String(card.rating), l: "OVR" }
        : { v: String(Math.round(card.stats.reduce((s, x) => s + x, 0) / 4)), l: "AVG" };
  const dark = !["pokemon", "nba", "tv"].includes(card.league);
  const ink = dark ? "#ffffff" : L.ink;
  return (
    <div
      style={{
        display: "flex",
        width: 660,
        height: 924,
        padding: 20,
        borderRadius: 34,
        background: EDGE[card.rarity],
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: 22,
          gap: 14,
          borderRadius: 20,
          background:
            card.league === "pokemon"
              ? `linear-gradient(160deg, #fff7d1, ${accent})`
              : `linear-gradient(160deg, ${dark ? "#2a2a3a" : L.paper}, ${L.ink})`,
          color: ink,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              fontFamily: "League Gothic",
              fontSize: card.name.length > 16 ? 64 : 80,
              lineHeight: 0.95,
              textTransform: "uppercase",
              maxWidth: 440,
            }}
          >
            {card.name}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontSize: 22, fontWeight: 800 }}>{head.l}</span>
            <span style={{ fontFamily: "League Gothic", fontSize: 80, lineHeight: 1 }}>
              {head.v}
            </span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            position: "relative",
            flexGrow: 1,
            borderRadius: 14,
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
            background: `radial-gradient(circle at 50% 40%, #ffffff, ${accent})`,
          }}
        >
          {pic ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={pic}
              alt=""
              width={576}
              height={560}
              style={{
                width: "100%",
                height: "100%",
                objectFit: cutout ? "contain" : "cover",
                objectPosition: "50% 18%",
              }}
            />
          ) : (
            <span style={{ fontFamily: "League Gothic", fontSize: 200, color: "#fff" }}>
              {card.name
                .split(/\s+/)
                .map((w) => w[0])
                .join("")
                .slice(0, 3)}
            </span>
          )}
          {card.era !== "current" ? (
            <div
              style={{
                display: "flex",
                position: "absolute",
                top: 18,
                left: 18,
                padding: "6px 18px",
                borderRadius: 8,
                background: card.era === "legend" ? "#d4af37" : "rgba(0,0,0,0.75)",
                color: card.era === "legend" ? "#2a1a00" : "#ffb347",
                fontFamily: "League Gothic",
                fontSize: 40,
                letterSpacing: 4,
                textTransform: "uppercase",
              }}
            >
              {card.era === "legend" ? "Legend" : card.era}
            </div>
          ) : null}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "8px 16px",
            borderRadius: 10,
            background: accent,
            color: "#111",
            fontSize: 24,
            fontWeight: 800,
            textTransform: "uppercase",
          }}
        >
          <span>{card.league === "pokemon" ? card.kind.replace("/", " · ") : card.kind}</span>
          <span>{card.team}</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {L.abbr.map((a, i) => (
            <div
              key={a + i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                width: 283,
                padding: "4px 16px",
                borderRadius: 10,
                background: "rgba(255,255,255,0.92)",
                color: "#111",
              }}
            >
              <span style={{ fontSize: 24, fontWeight: 800 }}>{a}</span>
              <span style={{ fontFamily: "League Gothic", fontSize: 52 }}>{card.stats[i]}</span>
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            fontWeight: 800,
            textTransform: "uppercase",
          }}
        >
          <span>{RARITY_NAME[card.rarity]}</span>
          <span>
            {L.short} · S{card.season}
          </span>
          <span>
            {card.no}/{card.of}
          </span>
        </div>
      </div>
    </div>
  );
}

export async function GET(_request: Request, ctx: RouteContext<"/cards/pull/[league]/[slug]">) {
  const { league, slug } = await ctx.params;
  const card = CARD_BY_ID.get(`${league}:${slug}`);
  if (!card) return new Response("No such card", { status: 404 });
  const hit = rendered.get(card.id);
  if (hit) return png(hit);
  const L = LEAGUES[card.league];
  let body: ArrayBuffer;
  try {
    const image = new ImageResponse(
      <div
        style={{
          display: "flex",
          position: "relative",
          flexDirection: "column",
          alignItems: "center",
          width: W,
          height: H,
          background: INKS.paper,
          color: INKS.k,
          fontFamily: "Inter",
        }}
      >
        {/* One flat sheet of plate A, torn along the bottom and right, with a screen of
            plate B's dots overprinting its top corner. */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            left: 64,
            top: 60,
            width: 952,
            height: 1010,
            background: INKS.a,
            clipPath: TORN,
          }}
        />
        <svg
          width={420}
          height={360}
          viewBox="0 0 420 360"
          style={{ position: "absolute", right: 64, top: 60 }}
        >
          {SCREEN.map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill={INKS.over} />
          ))}
        </svg>
        <div style={{ display: "flex", position: "relative", marginTop: 104 }}>
          <CardImage card={card} />
          <Tape left={-40} rotate={-34} />
          <Tape left={600} rotate={34} />
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 22, marginTop: 64 }}>
          {[CUTS.slice(0, 2), CUTS.slice(2, 4), CUTS.slice(4)].map((word, w) => (
            <div key={w} style={{ display: "flex", alignItems: "flex-end" }}>
              {word.map((c, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    padding: "4px 8px 0",
                    background: c.ink ? INKS.k : c.paper,
                    color: c.ink ? INKS.paper : INKS.k,
                    fontFamily: c.font,
                    fontSize: c.size,
                    lineHeight: 1,
                    transform: `rotate(${c.turn}deg)`,
                  }}
                >
                  {c.ch}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 22,
            fontFamily: "Courier Prime",
            fontWeight: 700,
            fontSize: 30,
          }}
        >
          {`${RARITY_NAME[card.rarity]}${card.era === "current" ? "" : ` · ${ERA_NAME[card.era]}`} · Yay Attax ${L.name}`}
        </div>
      </div>,
      {
        width: W,
        height: H,
        fonts: await loadFonts([
          { family: "League Gothic", axes: "" },
          { family: "Alfa Slab One", axes: "" },
          { family: "Courier Prime", axes: "wght@700" },
          { family: "Inter", axes: "wght@400;700;800" },
        ]),
      },
    );
    body = await image.arrayBuffer();
  } catch (err) {
    console.error("pull image failed", card.id, err);
    return new Response("Could not render this card", { status: 500 });
  }
  rendered.set(card.id, body);
  return png(body);
}

const png = (body: ArrayBuffer) =>
  new Response(body, {
    headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400" },
  });
