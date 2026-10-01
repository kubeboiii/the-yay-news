import type { CSSProperties, ReactNode } from "react";
import "./pip.css";

// Pip, the paper's pigeon: a plump blue-grey feral pigeon in a newsboy cap with a satchel of
// papers. One character model, hand-authored as SVG paths (no icon library), in five poses. Every
// direction draws him in its own pen: `look` sets the line (fine marker, photocopied scrawl or
// chunky cartoon ink) and `inks` lets a direction recolour him into its own riso plates.
//
// Idle life is CSS only: a blink every few seconds and a small head-bob (pigeons bob), plus a
// per-pose loop (wheels, swing, snoring Zs). All of it stops under prefers-reduced-motion.

export type PipPose = "stand" | "bike" | "sleep" | "sit" | "hang" | "confused";
export type PipLook = "marker" | "xerox" | "toon";

export type PipInks = {
  line: string;
  body: string;
  belly: string;
  wing: string;
  bar: string;
  tail: string;
  neck: string;
  neck2: string;
  cap: string;
  bag: string;
  strap: string;
  paper: string;
  legs: string;
  eye: string;
  /** The riso misregistration plate (marker look only). */
  shadow?: string;
};

export const PIP_INKS: PipInks = {
  line: "#1d1a22",
  body: "#b9bfcf",
  belly: "#d5d9e4",
  wing: "#9ca3b8",
  bar: "#3c3f4f",
  tail: "#565b6e",
  neck: "#2fc79b",
  neck2: "#a45cf0",
  cap: "#ff5a3c",
  bag: "#d9a466",
  strap: "#7a4a2a",
  paper: "#fbf6ea",
  legs: "#f07a96",
  eye: "#ff9b2f",
};

const STROKE: Record<PipLook, number> = { marker: 1.7, xerox: 2.3, toon: 3.6 };

const VIEW: Record<PipPose, string> = {
  stand: "0 0 120 120",
  sit: "0 0 120 116",
  sleep: "-14 -16 152 136",
  bike: "-4 -6 186 178",
  hang: "-12 -4 152 138",
  confused: "0 -18 146 138",
};

const LABEL: Record<PipPose, string> = {
  stand: "Pip the pigeon",
  bike: "Pip the pigeon delivering the paper on his bike",
  sleep: "Pip the pigeon asleep in a nest of newspaper",
  sit: "Pip the pigeon sitting on the pile",
  hang: "Pip the pigeon hanging off a string of fairy lights",
  confused: "Pip the pigeon, confused, holding a torn page",
};

// ——— Parts (standing, facing right, in a 120 × 120 box) ———
const TAIL = "M38 76 L10 88 C8 83 8 79 10 76 C7 73 7 68 9 64 L38 64 Z";
const TAILBAND = "M10 88 C8 83 8 79 10 76 C7 73 7 68 9 64 L16 64.5 C14 70 14 80 17 85.5 Z";
const BODY =
  "M32 72 C30 56 42 46 58 45 C66 44 71 40 73 33 L95 35 C96 44 96 54 97 64 C99 83 88 98 66 100 C46 102 33 90 32 72 Z";
const BELLY = "M66 100 C84 98 97 85 97 66 C92 80 80 92 62 96 Z";
const NECK = "M71 41 C74 52 84 58 97 60 L96 44 C88 47 78 46 71 41 Z";
const NECK2 = "M84 56 C88 58 93 59 97 60 L96.5 50 C93 53 89 55 84 56 Z";
const WING = "M44 61 C54 53 74 54 83 66 C81 80 67 90 49 88 C41 82 39 70 44 61 Z";
const BARS = "M51 68 C59 66 67 68 73 72 M49 76 C57 74 65 76 71 80";
const CAP = "M71 25 C70 13 85 8 96 13 C101 16 101 21 99 24 C90 22.5 80 23.5 71 25 Z";
const BRIM = "M95 21 C101 19.5 108 21 111 24.5 C105 26.5 99 26 95 24.5 Z";
const BEAK = "M99 30 C103 30 107 32 109 34.5 C105 35.5 102 35.5 99 35 Z";
const CERE = "M98 28.6 C100 27 103 27.6 103.4 29.8 C101.4 30.4 99.4 30.4 98 28.6 Z";
const STRAP = "M80 49 C70 62 58 76 50 88";
const BAG = "M36 84 L59 82 L61 99 L38 101 Z";
const FLAP = "M36 84 L59 82 L58.4 89.5 L36.8 91.4 Z";
const ROLL = "M41 84 L42.5 72.5 L55 71.5 L56 83";
/** An outstretched wing, shoulder at the origin, pointing along +x. */
const ARM = "M0 -7 C14 -13 34 -11 48 -5 L54 -2 L47 0 L52 4 L44 5 L48 9 L38 8 C26 11 10 10 0 6 Z";
const ARMBARS = "M12 -4 C22 -6 30 -5 36 -3 M12 2 C22 1 30 2 36 4";

const LEGS_STAND =
  "M56 99 L55 111 M55 111 l-6 2.5 M55 111 l0.5 4.6 M55 111 l6 1.4 M68 99 L68 111 M68 111 l-6 2.5 M68 111 l0.6 4.6 M68 111 l6 1.4";
const LEGS_SIT =
  "M58 98 C60 104 64 108 71 109 M71 109 l4 -3 M71 109 l5 0.6 M71 109 l3 3.4 M70 97 C72 102 76 105 83 105 M83 105 l4 -3 M83 105 l5 0.6 M83 105 l3 3.4";
const LEGS_HANG =
  "M57 99 L56 109 M56 109 l-4 4 M56 109 l0 5 M56 109 l4 4 M68 99 L69 108 M69 108 l-4 4 M69 108 l0.4 5 M69 108 l4 3.6";

type BirdProps = {
  inks: PipInks;
  sw: number;
  look: PipLook;
  legs?: string;
  arm?: string;
  closed?: boolean;
  lookUp?: boolean;
  headTransform?: string;
  capTransform?: string;
  bag?: boolean;
  folded?: boolean;
};

function Bird({
  inks,
  sw,
  look,
  legs,
  arm,
  closed,
  lookUp,
  headTransform,
  capTransform,
  bag = true,
  folded = true,
}: BirdProps) {
  const line = { stroke: inks.line, strokeWidth: sw, strokeLinejoin: "round" as const };
  const thin = { ...line, strokeWidth: sw * 0.7, fill: "none", strokeLinecap: "round" as const };
  return (
    <g>
      {inks.shadow ? (
        <g transform="translate(3.2 2.4)" style={{ mixBlendMode: "multiply" }} aria-hidden>
          <path d={BODY} fill={inks.shadow} />
          <path d={TAIL} fill={inks.shadow} />
          <circle cx="85" cy="30" r="15" fill={inks.shadow} />
        </g>
      ) : null}
      {legs ? (
        <g>
          {look === "toon" ? (
            <path d={legs} stroke={inks.line} strokeWidth={sw + 2.6} strokeLinecap="round" />
          ) : null}
          <path
            d={legs}
            stroke={inks.legs}
            strokeWidth={look === "toon" ? 2.8 : 2.4}
            strokeLinecap="round"
          />
        </g>
      ) : null}
      <path d={TAIL} fill={inks.tail} {...line} />
      <path d={TAILBAND} fill={inks.bar} />
      <g className={look === "toon" ? "pip-squash" : undefined}>
        <path d={BODY} fill={inks.body} {...line} />
        <path d={BELLY} fill={inks.belly} />
        {look === "toon" ? (
          <path
            d="M42 58 C47 52 54 49 61 49"
            stroke="#fff"
            strokeOpacity=".75"
            strokeWidth="3.4"
            fill="none"
            strokeLinecap="round"
          />
        ) : null}
        {folded ? (
          <>
            <path d={WING} fill={inks.wing} {...line} />
            <path d={BARS} {...thin} stroke={inks.bar} strokeWidth={sw * 1.1} />
          </>
        ) : null}
        {bag ? (
          <g>
            <path d={STRAP} stroke={inks.strap} strokeWidth={3.4} fill="none" />
            <path d={ROLL} fill={inks.paper} {...line} strokeWidth={sw * 0.8} />
            <path d="M45 76 h8 M45 79 h6" {...thin} strokeWidth={0.9} />
            <path d={BAG} fill={inks.bag} {...line} />
            <path d={FLAP} fill={inks.strap} fillOpacity=".35" />
          </g>
        ) : null}
        {arm ? (
          <g transform={arm}>
            <path d={ARM} fill={inks.wing} {...line} />
            <path d={ARMBARS} {...thin} stroke={inks.bar} strokeWidth={sw * 1.05} />
          </g>
        ) : null}
        <path d={NECK} fill={inks.neck} />
        <path d={NECK2} fill={inks.neck2} />
        <g className="pip-head" transform={headTransform}>
          <circle cx="85" cy="30" r="15" fill={inks.body} {...line} />
          <ellipse cx="94" cy="38.5" rx="3.3" ry="1.9" fill="#ff8fb1" fillOpacity=".65" />
          {closed ? (
            <path d="M85.6 30.6 Q90 34 94.6 30.6" {...thin} strokeWidth={sw} />
          ) : (
            <g className="pip-eye">
              <circle cx="90" cy="30" r="4.6" fill={inks.eye} {...line} strokeWidth={sw * 0.6} />
              <circle cx={lookUp ? 90.8 : 91.2} cy={lookUp ? 28.4 : 30} r="2.3" fill={inks.line} />
              <circle cx={lookUp ? 91.7 : 92.1} cy={lookUp ? 27.4 : 29} r=".85" fill="#fff" />
            </g>
          )}
          <path d={BEAK} fill="#4a4352" {...line} strokeWidth={sw * 0.6} />
          <path d={CERE} fill="#f4efe8" />
          <g transform={capTransform}>
            <path d={CAP} fill={inks.cap} {...line} />
            <path d="M84 11 C83 16 82 20 82 24" {...thin} strokeWidth={0.9} />
            <path d={BRIM} fill={inks.cap} {...line} />
            <circle cx="84" cy="10.6" r="1.7" fill={inks.line} />
          </g>
        </g>
      </g>
    </g>
  );
}

function Nest({ inks, sw }: { inks: PipInks; sw: number }) {
  const line = { stroke: inks.line, strokeWidth: sw, strokeLinejoin: "round" as const };
  const scraps = [
    "M-6 92 L22 80 L40 96 L30 116 L-2 114 Z",
    "M18 98 L52 88 L66 104 L60 120 L22 120 Z",
    "M50 96 L86 90 L96 106 L84 120 L52 120 Z",
    "M80 92 L116 84 L128 100 L118 118 L86 118 Z",
    "M104 98 L136 92 L138 112 L116 120 Z",
  ];
  return (
    <g>
      {scraps.map((d, i) => (
        <g key={i}>
          <path d={d} fill={inks.paper} {...line} />
          <path
            d={`M${4 + i * 28} ${102 + (i % 2) * 3} l18 -4 M${6 + i * 28} ${108 + (i % 2) * 3} l14 -3`}
            stroke={inks.line}
            strokeWidth={0.9}
            strokeOpacity=".6"
          />
        </g>
      ))}
      <path d="M22 84 C40 78 62 80 76 76" stroke={inks.line} strokeWidth={0.9} fill="none" />
    </g>
  );
}

function Bike({ inks, sw }: { inks: PipInks; sw: number }) {
  const line = {
    stroke: inks.line,
    strokeWidth: sw * 1.2,
    fill: "none",
    strokeLinecap: "round" as const,
  };
  const wheel = (cx: number) => (
    <g>
      <circle cx={cx} cy="140" r="24" {...line} strokeWidth={sw * 2.2} />
      <g className="pip-spin">
        <path
          d={`M${cx - 22} 140 H${cx + 22} M${cx} 118 V162 M${cx - 15.5} 124.5 L${cx + 15.5} 155.5 M${cx + 15.5} 124.5 L${cx - 15.5} 155.5`}
          stroke={inks.line}
          strokeWidth={sw * 0.5}
        />
      </g>
      <circle cx={cx} cy="140" r="2.6" fill={inks.line} />
    </g>
  );
  return (
    <g>
      {wheel(36)}
      {wheel(150)}
      <path
        d="M36 140 L86 140 L66 104 Z M66 104 L138 98 M86 140 L138 98 M138 98 L150 140 M136 92 L139 100"
        stroke={inks.cap}
        strokeWidth={sw * 2.2}
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path d="M86 140 L94 148" {...line} />
      <path d="M56 102 C60 99 70 99 76 101" {...line} strokeWidth={sw * 2.6} />
      <path d="M130 91 C136 86 144 87 148 91" {...line} strokeWidth={sw * 1.8} />
      {/* The basket of papers */}
      <path
        d="M140 102 L176 100 L172 122 L144 123 Z"
        fill={inks.bag}
        stroke={inks.line}
        strokeWidth={sw}
      />
      <path
        d="M146 101 L144 88 L158 86 L159 101"
        fill={inks.paper}
        stroke={inks.line}
        strokeWidth={sw * 0.8}
      />
      <path
        d="M157 101 L159 84 L172 85 L170 100"
        fill={inks.paper}
        stroke={inks.line}
        strokeWidth={sw * 0.8}
      />
      <path d="M147 92 h8 M161 90 h7 M161 94 h6" stroke={inks.line} strokeWidth={0.8} />
      <path d="M144 108 L172 107 M145 115 L171 114" stroke={inks.line} strokeWidth={sw * 0.6} />
    </g>
  );
}

function Lights({ inks, sw }: { inks: PipInks; sw: number }) {
  const bulbs: [number, number, string][] = [
    [-2, 9, inks.cap],
    [30, 15, inks.neck],
    [112, 14, inks.eye],
    [138, 5, inks.neck2],
  ];
  return (
    <g>
      <path
        d="M-12 4 C20 18 54 22 76 18 C100 14 120 12 142 0"
        stroke={inks.line}
        strokeWidth={sw * 0.9}
        fill="none"
      />
      {bulbs.map(([x, y, c], i) => (
        <g key={i} className="pip-glow" style={{ animationDelay: `${i * 0.7}s` }}>
          <rect x={x - 2} y={y} width="4" height="4" fill={inks.line} />
          <path
            d={`M${x - 4} ${y + 9} C${x - 4} ${y + 3} ${x + 4} ${y + 3} ${x + 4} ${y + 9} C${x + 4} ${y + 13} ${x} ${y + 16} ${x} ${y + 16} C${x} ${y + 16} ${x - 4} ${y + 13} ${x - 4} ${y + 9} Z`}
            fill={c}
            stroke={inks.line}
            strokeWidth={sw * 0.6}
          />
        </g>
      ))}
    </g>
  );
}

function TornPage({ inks, sw }: { inks: PipInks; sw: number }) {
  return (
    <g transform="rotate(8 122 72)">
      <path
        d="M102 50 L134 48 L136 92 L130 88 L125 94 L120 88 L114 95 L109 89 L104 93 Z"
        fill={inks.paper}
        stroke={inks.line}
        strokeWidth={sw}
        strokeLinejoin="round"
      />
      <path d="M107 56 h22" stroke={inks.line} strokeWidth={sw * 1.6} />
      <path
        d="M107 63 h20 M107 67 h22 M107 71 h17 M107 75 h21 M107 79 h12"
        stroke={inks.line}
        strokeWidth={0.8}
        strokeOpacity=".7"
      />
    </g>
  );
}

export function Pip({
  pose = "stand",
  look = "marker",
  inks: given,
  className,
  style,
  label,
  still,
}: {
  pose?: PipPose;
  look?: PipLook;
  inks?: Partial<PipInks>;
  className?: string;
  style?: CSSProperties;
  /** Overrides the default description; pass "" to make Pip decorative. */
  label?: string;
  /** No idle animation (for printing several on one sheet). */
  still?: boolean;
}) {
  const inks = { ...PIP_INKS, ...given };
  const sw = STROKE[look];
  const alt = label ?? LABEL[pose];
  let scene: ReactNode;
  switch (pose) {
    case "bike":
      scene = (
        <>
          <Bike inks={inks} sw={sw} />
          <g transform="translate(6 2) rotate(-4 64 100)">
            <Bird
              inks={inks}
              sw={sw}
              look={look}
              legs="M64 98 L80 122 L94 146 M94 146 l6 -1"
              arm="translate(74 60) rotate(27) scale(1.25 1)"
            />
          </g>
        </>
      );
      break;
    case "sleep":
      scene = (
        <>
          <g transform="translate(4 10) scale(1.02 0.94)">
            <Bird
              inks={inks}
              sw={sw}
              look={look}
              closed
              bag={false}
              headTransform="translate(-2 3) rotate(-9 85 44)"
              capTransform="rotate(14 86 18) translate(1 4)"
            />
          </g>
          <Nest inks={inks} sw={sw} />
          <g className="pip-z" fill="none" stroke={inks.line} strokeWidth={sw * 0.9}>
            <path d="M104 4 h8 l-8 9 h8" />
            <path d="M118 -10 h6 l-6 7 h6" />
          </g>
        </>
      );
      break;
    case "sit":
      scene = <Bird inks={inks} sw={sw} look={look} legs={LEGS_SIT} />;
      break;
    case "hang":
      scene = (
        <>
          <Lights inks={inks} sw={sw} />
          <g className="pip-swing">
            <g transform="translate(-4 16)">
              <Bird
                inks={inks}
                sw={sw}
                look={look}
                legs={LEGS_HANG}
                folded
                arm="translate(58 54) rotate(-104) scale(1.02 1)"
                headTransform="rotate(-6 85 44)"
                lookUp
              />
            </g>
          </g>
        </>
      );
      break;
    case "confused":
      scene = (
        <>
          <Bird
            inks={inks}
            sw={sw}
            look={look}
            legs={LEGS_STAND}
            headTransform="rotate(9 86 46)"
            lookUp
            bag={false}
            arm="translate(72 64) rotate(-12) scale(0.86 1)"
          />
          <TornPage inks={inks} sw={sw} />
          <path
            d="M112 -12 C111 -20 124 -21 124.5 -13.5 C125 -8 118 -7.5 118.5 -1.5"
            stroke={inks.line}
            strokeWidth={sw * 1.2}
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="118.6" cy="4.5" r={sw * 0.9} fill={inks.line} />
        </>
      );
      break;
    default:
      scene = <Bird inks={inks} sw={sw} look={look} legs={LEGS_STAND} />;
  }
  return (
    <svg
      viewBox={VIEW[pose]}
      className={`pip pip--${look} pip--${pose} ${still ? "pip--still" : ""} ${className ?? ""}`}
      style={style}
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      focusable="false"
      overflow="visible"
    >
      {scene}
    </svg>
  );
}
