// A story (or the front page) torn out of the paper and laid on a desk, as JSX for Satori.
//
// Satori draws flexbox and a subset of CSS, with no blend modes, masks or filters, so the print is
// built up the way a pressman would stack it: the stock (a real newsprint scan), a pastel tint for
// coloured stock, the inks, then the same scan again over the top so its grain runs through the
// ink, and white fibre specks where the ink has worn. Satori will not clip a rotated element, so
// the torn sheet (its shape, paler fibre rim and blurred shadow) is drawn as one SVG underneath.

import type { CSSProperties, ReactNode } from "react";
import { edition, type Story } from "@/app/mockups/_data/sample-edition";
import { EDITION, type Picture, pictureFor, required } from "./assets";
import type { Look } from "./looks";
import { seedFrom, type Tear, tornOutline } from "./torn";

export const FORMATS = {
  story: { w: 1080, h: 1920 },
  post: { w: 1080, h: 1350 },
  link: { w: 1200, h: 630 },
} as const;
export type Format = keyof typeof FORMATS;

/** Where the piece lies on the desk: its size, centre and how crooked it was put down. */
const LAY: Record<
  Format,
  { w: number; h: number; x: number; y: number; turn: number; tear: number }
> = {
  story: { w: 930, h: 1660, x: 540, y: 985, turn: -1.8, tear: 20 },
  post: { w: 920, h: 1170, x: 540, y: 690, turn: 1.4, tear: 18 },
  link: { w: 1090, h: 530, x: 600, y: 320, turn: -1.1, tear: 14 },
};

export type Subject = { kind: "story"; story: Story } | { kind: "front"; story: Story };

/** WCAG relative luminance of a #rrggbb colour. */
const lum = (hex: string) =>
  [1, 3, 5].reduce((s, i, k) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    const lin = c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    return s + lin * [0.2126, 0.7152, 0.0722][k]!;
  }, 0);
const contrast = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m) as [number, number];
  return (x + 0.05) / (y + 0.05);
};
const PAPER_WHITE = "#fbfaf5";
/** Ink or paper-white, whichever reads better on a ground. */
const on = (ground: string, ink: string) =>
  contrast(ground, ink) >= contrast(ground, PAPER_WHITE) ? ink : PAPER_WHITE;

/** Fewer words, bigger type: a headline's size from its length, between two bounds. */
const fit = (text: string, big: number, small: number, from = 28, to = 90) => {
  const t = Math.max(0, Math.min(1, (text.length - from) / (to - from)));
  return Math.round(big + (small - big) * t);
};

const upper = (s: string) => s.toUpperCase();

/** The first words of a story, stopped at a sentence end near `chars`. */
function opening(story: Story, chars: number) {
  const text = story.body.join(" ");
  if (text.length <= chars) return text;
  const cut = text.slice(0, chars);
  const end = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("” "), cut.lastIndexOf("? "));
  return end > chars * 0.5 ? cut.slice(0, end + 1) : `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

/** Split a run of text into two columns of roughly equal length, at a word. */
function columns(text: string): [string, string] {
  const mid = Math.floor(text.length / 2);
  const at = text.indexOf(" ", mid);
  return at < 0 ? [text, ""] : [text.slice(0, at), text.slice(at + 1)];
}

// ——— Per-look furniture ———

type Parts = {
  look: Look;
  fmt: Format;
  story: Story;
  front: boolean;
};

function Folio({ look, fmt }: Parts) {
  const size = fmt === "link" ? 17 : 23;
  const base: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: size,
    color: look.ink,
    letterSpacing: "0.04em",
  };
  const left = `${EDITION.date}`;
  const right = `Vol. ${EDITION.volume} · No. ${EDITION.issue}`;
  switch (look.id) {
    case "v1":
      return (
        <div
          style={{ ...base, fontFamily: look.sans, fontWeight: 700, textTransform: "uppercase" }}
        >
          <span>{left}</span>
          <span>{right}</span>
        </div>
      );
    case "v3":
      return (
        <div style={{ ...base, fontFamily: look.mono, fontWeight: 700 }}>
          <span>{left}</span>
          <span>{right}</span>
        </div>
      );
    case "v4":
      return (
        <div style={{ ...base, fontFamily: look.mono }}>
          <span>{`${EDITION.shortDate} · zine`}</span>
          <span>{right}</span>
        </div>
      );
    case "v5":
      return (
        <div
          style={{
            ...base,
            fontFamily: look.sans,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            fontSize: size - 2,
          }}
        >
          <span>{left}</span>
          <span>{right}</span>
        </div>
      );
  }
}

function Masthead({ look, fmt, front }: Parts) {
  const scale = fmt === "link" ? 0.42 : fmt === "post" ? 0.66 : 0.8;
  const big = front ? 1.15 : 1;
  const s = (n: number) => Math.round(n * scale * big);
  switch (look.id) {
    case "v1":
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              justifyContent: front ? "center" : "flex-start",
              fontFamily: look.head,
              fontSize: s(150),
              lineHeight: 0.86,
              letterSpacing: "0.01em",
              color: look.ink,
              paddingTop: s(6),
            }}
          >
            THE YAY NEWS
          </div>
          <div
            style={{
              display: "flex",
              marginTop: s(10),
              borderTop: `${Math.max(3, s(6))}px solid ${look.ink}`,
              borderBottom: `${Math.max(1, s(2))}px solid ${look.ink}`,
              height: s(12),
            }}
          />
        </div>
      );
    case "v3":
      return (
        <div style={{ display: "flex", alignItems: "stretch", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              fontFamily: look.head,
              fontWeight: 900,
              fontSize: s(104),
              lineHeight: 0.9,
              letterSpacing: "-0.035em",
              color: look.ink,
            }}
          >
            THE YAY NEWS
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              background: look.a,
              color: on(look.a, look.ink),
              fontFamily: look.head,
              fontWeight: 900,
              fontSize: s(30),
              lineHeight: 1,
              padding: `${s(8)}px ${s(12)}px`,
              textTransform: "uppercase",
            }}
          >
            <span>Free</span>
            <span style={{ fontSize: s(17), fontWeight: 700, letterSpacing: "0.02em" }}>
              forever
            </span>
          </div>
        </div>
      );
    case "v4":
      return (
        <div
          style={{
            display: "flex",
            justifyContent: front ? "center" : "flex-start",
            fontFamily: look.head,
            fontSize: s(96),
            lineHeight: 0.95,
            color: look.ink,
            textShadow: `${s(6)}px ${s(6)}px 0 ${look.bDeep}`,
            letterSpacing: "0.01em",
          }}
        >
          THE YAY NEWS
        </div>
      );
    case "v5":
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: front ? "center" : "flex-start",
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: look.head,
              fontWeight: 800,
              fontSize: s(120),
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              color: look.ink,
            }}
          >
            The Yay News
          </div>
          <div
            style={{
              display: "flex",
              width: "100%",
              marginTop: s(12),
              borderTop: `2px solid ${look.ink}`,
            }}
          />
        </div>
      );
  }
}

function Kicker({ look, fmt, story }: Parts) {
  const size = fmt === "link" ? 18 : 26;
  const label = `${story.section} · ${story.kicker}`;
  switch (look.id) {
    case "v1":
      return (
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              background: look.a,
              color: on(look.a, look.ink),
              fontFamily: look.sans,
              fontWeight: 800,
              fontSize: size,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              padding: `${size * 0.3}px ${size * 0.55}px`,
            }}
          >
            {label}
          </div>
        </div>
      );
    case "v3":
      return (
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              background: look.b,
              color: on(look.b, look.ink),
              fontFamily: look.mono,
              fontWeight: 700,
              fontSize: size,
              textTransform: "uppercase",
              padding: `${size * 0.25}px ${size * 0.5}px`,
            }}
          >
            {label}
          </div>
        </div>
      );
    case "v4":
      return (
        <div
          style={{
            display: "flex",
            fontFamily: look.mono,
            fontWeight: 700,
            fontSize: size,
            color: look.ink,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {`— ${label} —`}
        </div>
      );
    case "v5":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: size * 0.5 }}>
          <div
            style={{
              display: "flex",
              width: size * 0.7,
              height: size * 0.7,
              background: look.aDeep,
            }}
          />
          <div
            style={{
              display: "flex",
              fontFamily: look.sans,
              fontWeight: 600,
              fontSize: size - 2,
              color: look.ink,
              textTransform: "uppercase",
              letterSpacing: "0.16em",
            }}
          >
            {label}
          </div>
        </div>
      );
  }
}

function Headline({ look, fmt, story, front }: Parts) {
  const text = story.headline;
  const bounds: Record<Format, [number, number]> = {
    story: [116, 88],
    post: [104, 76],
    link: [66, 48],
  };
  const [big, small] = bounds[fmt];
  switch (look.id) {
    case "v1": {
      const size = fit(text, big * 1.08, small * 1.08);
      return (
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              background: look.b,
              color: on(look.b, look.ink),
              fontFamily: look.head,
              fontSize: size,
              lineHeight: 0.92,
              padding: `${size * 0.14}px ${size * 0.16}px ${size * 0.06}px`,
              textWrap: "balance",
            }}
          >
            {upper(text)}
          </div>
        </div>
      );
    }
    case "v3": {
      const size = fit(text, big * 0.8, small * 0.78);
      return (
        <div
          style={{
            display: "flex",
            fontFamily: look.head,
            fontWeight: 900,
            fontSize: size,
            lineHeight: 0.96,
            letterSpacing: "-0.03em",
            color: look.ink,
            textWrap: "balance",
          }}
        >
          {upper(text)}
        </div>
      );
    }
    case "v4": {
      const size = fit(text, big * 0.72, small * 0.72);
      return (
        <div
          style={{
            display: "flex",
            fontFamily: look.head,
            fontSize: size,
            lineHeight: 1.02,
            color: look.ink,
            textWrap: "balance",
          }}
        >
          {text}
        </div>
      );
    }
    case "v5": {
      const size = fit(text, big * 0.82, small * 0.8);
      return (
        <div
          style={{
            display: "flex",
            fontFamily: look.head,
            fontWeight: 800,
            fontSize: front ? size * 0.95 : size,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            color: look.ink,
            textWrap: "balance",
          }}
        >
          {text}
        </div>
      );
    }
  }
}

function Standfirst({ look, fmt, story }: Parts) {
  const size = fmt === "link" ? 24 : fmt === "post" ? 34 : 40;
  const family = look.text;
  const italic = look.id === "v1" || look.id === "v5" || look.id === "v4";
  return (
    <div
      style={{
        display: "flex",
        fontFamily: family,
        fontStyle: italic ? "italic" : "normal",
        fontWeight: look.id === "v3" ? 700 : 400,
        fontSize: look.id === "v5" ? size * 1.1 : size,
        lineHeight: 1.22,
        color: look.ink,
      }}
    >
      {story.dek}
    </div>
  );
}

function Credit({ look, fmt, pic }: Parts & { pic: Picture }) {
  const size = fmt === "link" ? 15 : 20;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        marginTop: 8,
        fontFamily: look.id === "v5" ? look.sans : look.mono,
        fontSize: size,
        letterSpacing: look.id === "v5" ? "0.1em" : "0.02em",
        textTransform: look.id === "v5" ? "uppercase" : "none",
        color: look.ink,
      }}
    >
      {`Photograph: ${pic.credit} / Unsplash`}
    </div>
  );
}

function Sticker({ look, fmt, story }: Parts) {
  if (!story.sticker || (look.id !== "v1" && look.id !== "v4")) return null;
  const d = fmt === "link" ? 104 : fmt === "post" ? 170 : 196;
  const ground = look.id === "v1" ? look.a : look.b;
  return (
    <div
      style={{
        position: "absolute",
        right: d * 0.12,
        top: d * 0.12,
        width: d,
        height: d,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: d,
        background: ground,
        border: look.id === "v4" ? `4px solid ${look.ink}` : "none",
        color: on(ground, look.ink),
        fontFamily: look.head,
        fontSize: d * (story.sticker.length > 5 ? 0.22 : 0.3),
        lineHeight: 0.9,
        textAlign: "center",
        transform: "rotate(12deg)",
      }}
    >
      {look.id === "v1" ? upper(story.sticker) : story.sticker}
    </div>
  );
}

function PhotoBlock(p: Parts & { pic: Picture; grow?: boolean }) {
  const { look, pic, grow, fmt } = p;
  // The magazine sets its pictures on a pastel ground; the others run them straight on the page.
  const mount = look.id === "v5";
  const pad = fmt === "link" ? 12 : 20;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexGrow: grow ? 1 : 0,
        minHeight: 0,
        background: mount ? look.a : "transparent",
        padding: mount ? `${pad}px ${pad}px ${pad * 0.6}px` : 0,
      }}
    >
      <div
        style={{
          display: "flex",
          position: "relative",
          flexGrow: 1,
          minHeight: 0,
          border: look.id === "v4" ? `5px solid ${look.ink}` : "none",
          background: "#777",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pic.src}
          alt={pic.alt}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: pic.focus,
          }}
        />
        <Sticker {...p} />
      </div>
      <Credit {...p} />
    </div>
  );
}

function Body({ look, story }: Parts) {
  const text = opening(story, look.id === "v5" ? 250 : 290);
  const [a, b] = columns(text);
  const col: CSSProperties = {
    display: "flex",
    flex: 1,
    fontFamily: look.text,
    fontSize: look.id === "v5" ? 32 : 29,
    lineHeight: 1.34,
    color: look.ink,
  };
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", gap: 36 }}>
        <div style={col}>{a}</div>
        <div style={{ display: "flex", width: 1.5, background: look.ink }} />
        <div style={col}>{b}</div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 10,
          fontFamily: look.id === "v5" ? look.sans : look.mono,
          fontWeight: 700,
          fontSize: 22,
          color: look.ink,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        {`Continued on page ${story.section === "Discoveries" ? 3 : 7} →`}
      </div>
    </div>
  );
}

function InsideToday({ look }: Parts) {
  const rows = edition.sections
    .slice(0, 3)
    .map((s) => ({ name: s.name, head: s.stories[0]?.headline ?? "" }));
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        borderTop: `3px solid ${look.ink}`,
        paddingTop: 14,
      }}
    >
      <div
        style={{
          display: "flex",
          fontFamily: look.id === "v5" ? look.sans : look.mono,
          fontWeight: 700,
          fontSize: 24,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: look.ink,
          marginBottom: 8,
        }}
      >
        Inside today
      </div>
      {rows.map((r) => (
        <div
          key={r.name}
          style={{
            display: "flex",
            gap: 18,
            alignItems: "flex-start",
            borderBottom: `1px solid ${look.ink}`,
            padding: "8px 0",
            color: look.ink,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 210,
              paddingTop: 4,
              fontFamily: look.sans,
              fontWeight: 700,
              fontSize: 22,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            {r.name}
          </div>
          <div
            style={{
              display: "flex",
              flex: 1,
              fontFamily: look.text,
              fontSize: 28,
              lineHeight: 1.2,
            }}
          >
            {r.head}
          </div>
        </div>
      ))}
    </div>
  );
}

/** A block that keeps its natural height; only the photograph gives way when space runs short. */
const Fixed = ({ children }: { children: ReactNode }) => (
  <div style={{ display: "flex", flexDirection: "column", flexShrink: 0 }}>{children}</div>
);

/** The printed content of the piece, laid out for its format. */
function Printed(p: Parts & { pic: Picture | null }) {
  const { fmt, front, pic } = p;
  const pad = fmt === "link" ? 44 : 60;
  const gap = fmt === "link" ? 14 : fmt === "post" ? 22 : 26;
  const column: CSSProperties = { display: "flex", flexDirection: "column", gap };

  if (fmt === "link") {
    return (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          padding: `${pad}px ${pad + 6}px`,
          gap: 34,
        }}
      >
        <div style={{ ...column, flex: 1, minWidth: 0 }}>
          <Folio {...p} />
          <Masthead {...p} />
          <Kicker {...p} />
          <Headline {...p} />
          {front ? null : <Standfirst {...p} />}
        </div>
        {pic ? (
          <div style={{ display: "flex", width: 420 }}>
            <PhotoBlock {...p} pic={pic} grow />
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div
      style={{
        ...column,
        width: "100%",
        height: "100%",
        padding: `${pad + 8}px ${pad}px ${pad}px`,
      }}
    >
      <Fixed>
        <Folio {...p} />
      </Fixed>
      <Fixed>
        <Masthead {...p} />
      </Fixed>
      {front ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            fontFamily: p.look.text,
            fontStyle: "italic",
            fontSize: fmt === "story" ? 34 : 28,
            color: p.look.ink,
            marginTop: -6,
          }}
        >
          {EDITION.tagline}
        </div>
      ) : null}
      <Fixed>
        <Kicker {...p} />
      </Fixed>
      <Fixed>
        <Headline {...p} />
      </Fixed>
      {front ? null : (
        <Fixed>
          <Standfirst {...p} />
        </Fixed>
      )}
      {pic ? (
        <PhotoBlock {...p} pic={pic} grow />
      ) : (
        <div style={{ display: "flex", flexGrow: 1 }} />
      )}
      {fmt === "story" ? <Fixed>{front ? <InsideToday {...p} /> : <Body {...p} />}</Fixed> : null}
    </div>
  );
}

/**
 * The sheet itself as one SVG: its soft shadow on the desk, the pale fibre rim of the tear, and the
 * stock inside it (with a pastel tint for coloured stock). Satori cannot clip a rotated element,
 * so the torn shape lives here, where resvg draws real paths, patterns and blur.
 */
function sheetSvg(lay: (typeof LAY)[Format], tearing: Tear, stock: string, tint?: string) {
  const m = lay.tear * 5; // room round the sheet for the shadow to spread into
  const w = lay.w + m * 2;
  const h = lay.h + m * 2;
  const blur = lay.tear * 0.9;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs>
<filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${blur}"/></filter>
<filter id="contact" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="2.2"/></filter>
<pattern id="stock" patternUnits="userSpaceOnUse" x="0" y="0" width="${lay.w}" height="${lay.h}"><image xlink:href="${stock}" href="${stock}" width="${lay.w}" height="${lay.h}" preserveAspectRatio="xMidYMid slice"/></pattern>
</defs>
<g transform="translate(${m} ${m + lay.tear * 1.1})"><path d="${tearing.rim}" fill="#1c140a" opacity="0.30" filter="url(#soft)"/></g>
<g transform="translate(${m} ${m + 2})"><path d="${tearing.rim}" fill="#1c140a" opacity="0.28" filter="url(#contact)"/></g>
<g transform="translate(${m} ${m})">
<path d="${tearing.rim}" fill="#f6f3ea"/>
<path d="${tearing.paper}" fill="url(#stock)"/>
${tint ? `<path d="${tearing.paper}" fill="${tint}" opacity="0.8"/>` : ""}
</g>
</svg>`;
  return { src: `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`, m, w, h };
}

/** The whole picture: desk, shadow, torn piece, tape. */
export function Clipping({
  look,
  fmt,
  subject,
}: {
  look: Look;
  fmt: Format;
  subject: Subject;
}): ReactNode {
  const { w: W, h: H } = FORMATS[fmt];
  const lay = LAY[fmt];
  const story = subject.story;
  const front = subject.kind === "front";
  const seed = seedFrom(`${look.id}:${fmt}:${subject.kind}:${story.slug}`);
  const tearing = tornOutline(lay.w, lay.h, seed, lay.tear);
  const paper = required(
    look.stock === "white" ? "mockup/press/newsprint-white.jpg" : "mockup/press/newsprint.jpg",
  );
  const specks = required("mockup/fx/ink-wear-specks.png");
  const tape = required("mockup/fx/tape.png");
  const sheet = sheetSvg(lay, tearing, paper, look.tint);
  const pic = pictureFor(story);
  const parts: Parts = { look, fmt, story, front };
  const tapeW = fmt === "link" ? 220 : 300;
  // Grain and wear run over the printed area only, clear of the torn edge.
  const inset = lay.tear * 2;
  const over: CSSProperties = {
    position: "absolute",
    left: inset,
    top: inset,
    width: lay.w - inset * 2,
    height: lay.h - inset * 2,
  };

  return (
    <div
      style={{ display: "flex", width: W, height: H, background: look.desk, position: "relative" }}
    >
      <div
        style={{
          display: "flex",
          position: "absolute",
          left: lay.x - lay.w / 2,
          top: lay.y - lay.h / 2,
          width: lay.w,
          height: lay.h,
          transform: `rotate(${lay.turn}deg)`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={sheet.src}
          alt=""
          width={sheet.w}
          height={sheet.h}
          style={{
            position: "absolute",
            left: -sheet.m,
            top: -sheet.m,
            width: sheet.w,
            height: sheet.h,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: lay.w,
            height: lay.h,
            display: "flex",
          }}
        >
          <Printed {...parts} pic={pic} />
        </div>
        {/* The same stock again, faintly, so its grain runs through the ink; then the worn specks. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={paper}
          alt=""
          style={{ ...over, objectFit: "cover", objectPosition: "50% 50%", opacity: 0.2 }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={specks} alt="" style={{ ...over, objectFit: "cover", opacity: 0.16 }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={tape}
          alt=""
          style={{
            position: "absolute",
            width: tapeW,
            height: tapeW * 0.267,
            left: lay.w / 2 - tapeW / 2 + (seed % 60) - 30,
            top: -tapeW * 0.13,
            transform: `rotate(${((seed >> 8) % 9) - 6}deg)`,
            opacity: 0.9,
          }}
        />
      </div>
    </div>
  );
}
