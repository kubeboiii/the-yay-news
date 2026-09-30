import { type CSSProperties, type ReactNode, useId } from "react";
import { DESIGN_NAME, type Motif, motifFor, stampInk } from "./catalogue";
import type { StampInfo } from "./core";
import { hash, polygon, rng, scallop } from "./sketch";
import "./stamp.css";

// A rubber-stamp impression, drawn as SVG and then "printed" through a filter: the edges wander
// where the rubber squashed, the ink is uneven where the pad was dry, there are voids where the
// paper's tooth didn't take it, and a faint bleed spreads into the fibres. Every stamp is seeded
// by its issue, so its tilt, offset, shape and ink blotches are the same every time it's shown.

/** Trig differs in the last digits between server and browser: round before printing. */
const q = (n: number) => Math.round(n * 100) / 100;

export type StampShape = "postmark" | "ticket" | "scallop" | "octagon" | "oval";

const SHAPES: Record<string, StampShape[]> = {
  broadsheet: ["postmark", "ticket", "postmark", "oval"],
  tabloid: ["scallop", "ticket"],
  zine: ["oval", "scallop"],
  midi: ["octagon", "postmark"],
};

export const shapeFor = (design: string, issue: number): StampShape => {
  const set = SHAPES[design] ?? SHAPES.broadsheet!;
  return set[issue % set.length]!;
};

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
export const stampDate = (date: string) => {
  const [y, m, d] = date.split("-");
  return `${Number(d)} ${MONTHS[Number(m) - 1] ?? ""} ${y}`;
};

const LONG = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
export const longDate = (date: string) => LONG.format(new Date(`${date}T00:00:00Z`));

/** The tilt and nudge a stamp lands with, seeded by issue (degrees, % of its box). */
export function landing(issue: number) {
  const r = rng(hash(`land:${issue}`));
  return { rot: (r() * 2 - 1) * 11, dx: (r() * 2 - 1) * 6, dy: (r() * 2 - 1) * 6 };
}

export function stampLabel(s: StampInfo): string {
  const bits = [`Stamp for No. ${s.issue}, ${longDate(s.date)}`];
  if (s.first) bits.push("your first issue");
  if (s.weekend) bits.push("weekend edition");
  if (s.milestone) bits.push(`${s.milestone}-day streak`);
  if (s.allSolved) bits.push("every puzzle solved");
  return bits.join(", ");
}

/** The ink filter. `seed` changes the blotches; `wear` (0–1) how dry the pad was. */
function InkFilter({ id, seed, wear = 0.5 }: { id: string; seed: number; wear?: number }) {
  // Alpha from the grit noise: solid ink below a threshold, voids above it.
  const a = 6 + wear * 3;
  const b = 4.4 + (1 - wear) * 0.8;
  return (
    <filter id={id} x="-6%" y="-6%" width="112%" height="112%" colorInterpolationFilters="sRGB">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.03"
        numOctaves={2}
        seed={seed}
        result="warp"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="warp"
        scale={3}
        xChannelSelector="R"
        yChannelSelector="G"
        result="shape"
      />
      <feMorphology in="shape" operator="dilate" radius={0.6} result="fat" />
      <feGaussianBlur in="fat" stdDeviation={1.1} result="bleed" />
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.9"
        numOctaves={2}
        seed={seed + 7}
        result="grit"
      />
      <feColorMatrix
        in="grit"
        type="matrix"
        values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${-a} 0 0 0 ${b}`}
        result="holes"
      />
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.018"
        numOctaves={2}
        seed={seed + 3}
        result="press"
      />
      <feColorMatrix
        in="press"
        type="matrix"
        values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 3.4 0 0 ${-0.5 - wear * 0.45}`}
        result="pressure"
      />
      <feComposite in="shape" in2="holes" operator="in" result="inked" />
      <feComposite in="inked" in2="pressure" operator="in" result="pressed" />
      <feComponentTransfer in="bleed" result="halo">
        <feFuncA type="linear" slope={0.22} />
      </feComponentTransfer>
      <feComposite in="halo" in2="pressure" operator="in" result="halo2" />
      <feMerge>
        <feMergeNode in="halo2" />
        <feMergeNode in="pressed" />
      </feMerge>
    </filter>
  );
}

/** A small line doodle centred on (0, 0), about 36 units across. */
export function MotifArt({ motif }: { motif: Motif }) {
  switch (motif) {
    case "sun":
      return (
        <g>
          <circle r={8.5} />
          {Array.from({ length: 10 }, (_, i) => {
            const a = (Math.PI * 2 * i) / 10;
            return (
              <line
                key={i}
                x1={q(Math.cos(a) * 12)}
                y1={q(Math.sin(a) * 12)}
                x2={q(Math.cos(a) * (i % 2 ? 15.5 : 18))}
                y2={q(Math.sin(a) * (i % 2 ? 15.5 : 18))}
              />
            );
          })}
          <path d="M-4 1.5 Q0 5.5 4 1.5" />
          <circle cx={-3} cy={-2.5} r={0.9} className="hb-fill" />
          <circle cx={3} cy={-2.5} r={0.9} className="hb-fill" />
        </g>
      );
    case "star":
      return (
        <g>
          <polygon points="0,-17 4.6,-5.6 16.6,-5.2 7.2,2.4 10.4,14.2 0,7.4 -10.4,14.2 -7.2,2.4 -16.6,-5.2 -4.6,-5.6" />
          <path d="M-2 -1 L-1.4 1.2 M2 -1 L1.6 1.2" />
        </g>
      );
    case "heart":
      return (
        <g>
          <path d="M0 15 C-20 2 -15 -16 0 -6.5 C15 -16 20 2 0 15 Z" />
          <path d="M-7.5 -5 C-9.5 -3 -9.8 0 -8.4 2" />
        </g>
      );
    case "flower":
      return (
        <g>
          {Array.from({ length: 5 }, (_, i) => (
            <ellipse key={i} cx={0} cy={-9.5} rx={5.2} ry={8} transform={`rotate(${i * 72})`} />
          ))}
          <circle r={4} className="hb-fill" />
        </g>
      );
    case "planet":
      return (
        <g>
          <circle r={9.5} />
          <ellipse rx={18} ry={5} transform="rotate(-18)" />
          <circle cx={13} cy={-12} r={1.4} className="hb-fill" />
          <circle cx={-15} cy={11} r={1} className="hb-fill" />
        </g>
      );
    case "bolt":
      return <polygon points="-3,-18 9,-18 2,-4 10,-4 -7,18 -2,2 -9,2" />;
    case "cup":
      return (
        <g>
          <path d="M-11 -3 L11 -3 L9 13 C8.6 15 7 16 5 16 L-5 16 C-7 16 -8.6 15 -9 13 Z" />
          <path d="M11 1 C17 0 17 9 10 9" />
          <path d="M-4 -8 C-6 -11 -2 -13 -4 -16 M3 -8 C1 -11 5 -13 3 -16" />
        </g>
      );
    case "plane":
      return (
        <g>
          <path d="M-17 1 L17 -11 L-1 14 L-4 5 Z" />
          <path d="M-4 5 L17 -11" />
          <path d="M-1 14 L-2.5 7.5" />
        </g>
      );
  }
}

type Props = {
  stamp: StampInfo;
  /** Skip the tilt and offset (for a stamp shown on its own, e.g. mid-stamping). */
  flat?: boolean;
  className?: string;
  style?: CSSProperties;
};

/** One edition's stamp impression. Fills its box (square); size it with CSS. */
export function RubberStamp({ stamp, flat, className, style }: Props) {
  const raw = useId();
  const id = `hbs${raw.replace(/[^a-zA-Z0-9]/g, "")}`;
  const ink = stampInk(stamp.design, stamp.colourway);
  const seed = hash(`stamp:${stamp.issue}`) % 997;
  const wear = rng(seed)() * 0.6;
  const land = landing(stamp.issue);
  const shape = shapeFor(stamp.design, stamp.issue);
  const motif = motifFor(stamp.design, stamp.issue);
  const date = stampDate(stamp.date);
  const tilt = flat ? {} : { rotate: `${land.rot}deg`, translate: `${land.dx}% ${land.dy}%` };
  return (
    <span
      role="img"
      aria-label={stampLabel(stamp)}
      className={`hb-stamp ${className ?? ""}`}
      style={{ ...tilt, ...style }}
    >
      <svg viewBox="0 0 220 220" className="hb-stamp__svg" aria-hidden>
        <defs>
          <InkFilter id={`${id}f`} seed={seed} wear={wear} />
          <InkFilter id={`${id}g`} seed={seed + 40} wear={0.4} />
          <path id={`${id}top`} d="M40 110 A70 70 0 0 1 180 110" />
          <path id={`${id}bot`} d="M30 110 A80 80 0 0 0 190 110" />
        </defs>
        <g
          filter={`url(#${id}f)`}
          fill="none"
          stroke={ink}
          style={{ color: ink }}
          className="hb-stamp__ink"
        >
          {stamp.milestone ? <Sunburst /> : null}
          <Body shape={shape} id={id} date={date} issue={stamp.issue} motif={motif} ink={ink} />
          {stamp.weekend ? <Band text="WEEKEND" ink={ink} /> : null}
          {stamp.milestone ? <Ribbon text={`${stamp.milestone}-DAY STREAK`} ink={ink} /> : null}
          {stamp.first ? <FirstStar ink={ink} /> : null}
        </g>
        {stamp.allSolved ? (
          <g filter={`url(#${id}g)`} className="hb-stamp__ink">
            <AllSolved />
          </g>
        ) : null}
      </svg>
    </span>
  );
}

const T = ({
  children,
  size,
  x = 110,
  y,
  font = "stamp",
  fill,
  spacing = 0,
}: {
  children: ReactNode;
  size: number;
  x?: number;
  y: number;
  font?: "stamp" | "gothic";
  fill: string;
  spacing?: number;
}) => (
  <text
    x={x}
    y={y}
    textAnchor="middle"
    fill={fill}
    stroke="none"
    fontSize={size}
    letterSpacing={spacing}
    style={{
      fontFamily:
        font === "gothic"
          ? "var(--hb-gothic), Impact, sans-serif"
          : "var(--hb-stamp), 'Courier New', monospace",
    }}
  >
    {children}
  </text>
);

function Body({
  shape,
  id,
  date,
  issue,
  motif,
  ink,
}: {
  shape: StampShape;
  id: string;
  date: string;
  issue: number;
  motif: Motif;
  ink: string;
}) {
  const centre = (
    <>
      <g
        transform="translate(110 92) scale(0.95)"
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <MotifArt motif={motif} />
      </g>
      <T size={13} y={130} fill={ink} spacing={1}>
        No.
      </T>
      <T size={40} y={160} font="gothic" fill={ink} spacing={1}>
        {issue}
      </T>
    </>
  );
  switch (shape) {
    case "postmark":
      return (
        <g strokeWidth={4}>
          <circle cx={110} cy={110} r={96} />
          <circle cx={110} cy={110} r={89} strokeWidth={1.6} />
          <circle cx={110} cy={110} r={58} strokeWidth={2} strokeDasharray="3 4" />
          <text
            fill={ink}
            stroke="none"
            fontSize={15}
            letterSpacing={3}
            style={{ fontFamily: "var(--hb-stamp), monospace" }}
          >
            <textPath href={`#${id}top`} startOffset="50%" textAnchor="middle">
              THE YAY NEWS
            </textPath>
          </text>
          <text
            fill={ink}
            stroke="none"
            fontSize={13}
            letterSpacing={2}
            style={{ fontFamily: "var(--hb-stamp), monospace" }}
          >
            <textPath href={`#${id}bot`} startOffset="50%" textAnchor="middle">
              {`· ${date} ·`}
            </textPath>
          </text>
          <g transform="translate(0 -6) scale(1)">{centre}</g>
        </g>
      );
    case "ticket":
      return (
        <g strokeWidth={4}>
          <path d="M22 50 Q30 50 30 42 L190 42 Q190 50 198 50 L198 170 Q190 170 190 178 L30 178 Q30 170 22 170 Z" />
          <rect x={36} y={52} width={148} height={116} strokeWidth={1.5} />
          <T size={13} y={70} fill={ink} spacing={2.5}>
            THE YAY NEWS
          </T>
          <line x1={46} y1={78} x2={174} y2={78} strokeWidth={1.4} />
          <g
            transform="translate(76 118) scale(0.95)"
            strokeWidth={2.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <MotifArt motif={motif} />
          </g>
          <T size={12} x={140} y={102} fill={ink}>
            No.
          </T>
          <T size={46} x={140} y={144} font="gothic" fill={ink}>
            {issue}
          </T>
          <line x1={46} y1={150} x2={174} y2={150} strokeWidth={1.4} />
          <T size={12} y={164} fill={ink} spacing={1.5}>
            {date}
          </T>
        </g>
      );
    case "scallop":
      return (
        <g strokeWidth={3.6}>
          <path d={scallop(110, 110, 88, 22, 4)} />
          <circle cx={110} cy={110} r={74} strokeWidth={1.6} />
          <T size={12} y={60} fill={ink} spacing={2.5}>
            YAY NEWS
          </T>
          <g transform="translate(0 -2)">{centre}</g>
          <T size={11} y={180} fill={ink} spacing={1}>
            {date}
          </T>
        </g>
      );
    case "octagon":
      return (
        <g strokeWidth={4}>
          <polygon points={polygon(110, 110, 96, 8, Math.PI / 8)} />
          <polygon points={polygon(110, 110, 87, 8, Math.PI / 8)} strokeWidth={1.4} />
          <T size={13} y={56} fill={ink} spacing={2.5}>
            THE YAY NEWS
          </T>
          <g transform="translate(0 -2)">{centre}</g>
          <T size={12} y={184} fill={ink} spacing={1.5}>
            {date}
          </T>
        </g>
      );
    case "oval":
      return (
        <g strokeWidth={4}>
          <ellipse cx={110} cy={110} rx={98} ry={80} />
          <ellipse
            cx={110}
            cy={110}
            rx={90}
            ry={72}
            strokeWidth={1.5}
            strokeDasharray="1 5"
            strokeLinecap="round"
          />
          <T size={13} y={64} fill={ink} spacing={2.5}>
            THE YAY NEWS
          </T>
          <g
            transform="translate(-44 110) scale(0.85)"
            strokeWidth={2.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <MotifArt motif={motif} />
          </g>
          <T size={12} x={124} y={96} fill={ink}>
            No.
          </T>
          <T size={50} x={124} y={140} font="gothic" fill={ink}>
            {issue}
          </T>
          <T size={12} y={166} fill={ink} spacing={1.5}>
            {date}
          </T>
        </g>
      );
  }
}

/** A band struck across the middle, reversed out of the ink. */
function Band({ text, ink }: { text: string; ink: string }) {
  return (
    <g transform="rotate(-8 110 110)">
      <rect x={34} y={96} width={152} height={26} fill={ink} stroke="none" />
      <text
        x={110}
        y={115}
        textAnchor="middle"
        fontSize={17}
        letterSpacing={5}
        fill="#f3e7cf"
        stroke="none"
        style={{ fontFamily: "var(--hb-gothic), Impact, sans-serif" }}
      >
        {text}
      </text>
    </g>
  );
}

/** A ring of short rays round the stamp, for a streak milestone. */
function Sunburst() {
  return (
    <g strokeWidth={3} strokeLinecap="round">
      {Array.from({ length: 36 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 36;
        const r1 = 101;
        const r2 = i % 2 ? 106 : 110;
        return (
          <line
            key={i}
            x1={q(110 + Math.cos(a) * r1)}
            y1={q(110 + Math.sin(a) * r1)}
            x2={q(110 + Math.cos(a) * r2)}
            y2={q(110 + Math.sin(a) * r2)}
          />
        );
      })}
    </g>
  );
}

function Ribbon({ text, ink }: { text: string; ink: string }) {
  return (
    <g transform="rotate(6 110 196)">
      <path
        d="M40 184 L180 184 L172 196 L180 208 L40 208 L48 196 Z"
        fill="#f3e7cf"
        strokeWidth={2.4}
      />
      <text
        x={110}
        y={202}
        textAnchor="middle"
        fontSize={15}
        letterSpacing={2}
        fill={ink}
        stroke="none"
        style={{ fontFamily: "var(--hb-gothic), Impact, sans-serif" }}
      >
        {text}
      </text>
    </g>
  );
}

function FirstStar({ ink }: { ink: string }) {
  return (
    <g transform="translate(182 34) rotate(12)">
      <polygon
        points="0,-24 6.5,-8 24,-7.5 10.4,3.4 15,20.4 0,10.6 -15,20.4 -10.4,3.4 -24,-7.5 -6.5,-8"
        fill={ink}
        stroke="none"
      />
      <text
        y={4}
        textAnchor="middle"
        fontSize={8.5}
        fill="#f3e7cf"
        stroke="none"
        letterSpacing={0.5}
        style={{ fontFamily: "var(--hb-gothic), Impact, sans-serif" }}
      >
        FIRST
      </text>
    </g>
  );
}

/** A second, smaller stamp in black: every puzzle solved. */
function AllSolved() {
  return (
    <g transform="translate(150 168) rotate(-14)" stroke="#23201c" fill="none">
      <rect x={-52} y={-20} width={104} height={40} strokeWidth={3} />
      <path
        d="M-43 -2 L-36 7 L-24 -12"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x={10}
        y={-3}
        textAnchor="middle"
        fontSize={11}
        fill="#23201c"
        stroke="none"
        letterSpacing={1}
        style={{ fontFamily: "var(--hb-stamp), monospace" }}
      >
        ALL PUZZLES
      </text>
      <text
        x={10}
        y={12}
        textAnchor="middle"
        fontSize={13}
        fill="#23201c"
        stroke="none"
        letterSpacing={2}
        style={{ fontFamily: "var(--hb-gothic), Impact, sans-serif" }}
      >
        SOLVED
      </text>
    </g>
  );
}

export { DESIGN_NAME };
