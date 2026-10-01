import { type Ctx, ln } from "./parts";

// Small SVG layers drawn over the traced art, in the traced drawings' own units. The cap and the
// satchel carry the day's plates; the eyelids blink; the rest are a pose's props.

/** The newsboy cap, centred at (x, y), `s` × its 15-unit design size. */
export function Cap({
  c,
  x,
  y,
  s,
  turn = -6,
}: {
  c: Ctx;
  x: number;
  y: number;
  s: number;
  turn?: number;
}) {
  const { k } = c;
  return (
    <g transform={`translate(${x} ${y}) rotate(${turn}) scale(${s}) translate(-68 -19)`}>
      <path
        d="M61.4 20.6 C60.4 15.4 64 12.4 68.4 12.4 C72.8 12.4 76.2 15.2 75.4 20.6 C70.8 19.4 65.8 19.4 61.4 20.6 Z"
        fill={k.cap}
        {...ln(c, 0.9 / s)}
      />
      <path d="M68.4 12.8 C68.2 15.2 68.2 17.4 68.4 19.4" fill="none" {...ln(c, 0.45 / s)} />
      <path
        d="M61.6 20.4 C66 19 71.2 19 75.2 20.4 C74.4 22.4 71.6 23.2 68.4 23.2 C65.2 23.2 62.6 22.4 61.6 20.4 Z"
        fill={k.cap}
        {...ln(c, 0.9 / s)}
      />
      <circle cx="68.4" cy="12.4" r={0.9} fill={k.line} />
    </g>
  );
}

/** The satchel: a strap across the chest from (x0, y0) to a small bag at (x1, y1). */
export function Satchel({
  c,
  x0,
  y0,
  x1,
  y1,
}: {
  c: Ctx;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}) {
  const { k } = c;
  const mx = (x0 + x1) / 2;
  const my = Math.max(y0, y1) + 18;
  return (
    <g>
      <path
        d={`M${x0} ${y0} Q${mx} ${my} ${x1} ${y1}`}
        fill="none"
        stroke={k.bag}
        strokeWidth={c.w * 2.4}
        strokeLinecap="round"
      />
      <path
        d={`M${x1 - 10} ${y1 + 2} L${x1 - 9} ${y1 - 8} L${x1 + 6} ${y1 - 9} L${x1 + 7} ${y1 + 1}`}
        fill={k.paper}
        {...ln(c, 0.8)}
      />
      <path
        d={`M${x1 - 16} ${y1} L${x1 + 14} ${y1 - 2} L${x1 + 15} ${y1 + 22} L${x1 - 15} ${y1 + 24} Z`}
        fill={k.bag}
        {...ln(c)}
      />
      <path
        d={`M${x1 - 16} ${y1} L${x1 + 14} ${y1 - 2} L${x1 + 14.4} ${y1 + 8} L${x1 - 15.6} ${y1 + 10} Z`}
        fill={k.line}
        fillOpacity=".22"
      />
    </g>
  );
}

/**
 * Eyelids over round eyes at `eyes` (radius r): hidden until a blink, or `shut` (asleep), when
 * they're closed with a contented downward arc.
 */
export function Lids({
  c,
  eyes,
  r,
  ground,
  shut,
}: {
  c: Ctx;
  eyes: readonly [number, number][];
  r: number;
  /** The fur colour round the eyes. */
  ground: string;
  shut?: boolean;
}) {
  return (
    <g className={shut ? "rt-odin__lids rt-odin__lids--shut" : "rt-odin__lids"}>
      {eyes.map(([x, y]) => (
        <g key={x} className="rt-odin__lid">
          <circle cx={x} cy={y} r={r * 1.18} fill={ground} />
          <path
            d={`M${x - r * 1.05} ${y - r * 0.1} Q${x} ${y + r * 0.95} ${x + r * 1.05} ${y - r * 0.1}`}
            fill="none"
            {...ln(c, 1.1)}
          />
        </g>
      ))}
    </g>
  );
}

/** Sparkles in the eyes (the trace drops the tiny highlights). */
export function Catchlights({ eyes, r }: { eyes: readonly [number, number][]; r: number }) {
  return (
    <g>
      {eyes.map(([x, y]) => (
        <circle key={x} cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.32} fill="#fff" />
      ))}
    </g>
  );
}

/** Paints over the open mouth and draws a closed, contented smile instead. */
export function ClosedSmile({
  c,
  x,
  y,
  w,
  h,
}: {
  c: Ctx;
  x: number;
  y: number;
  w: number;
  h: number;
}) {
  return (
    <g>
      <ellipse cx={x} cy={y + h * 0.5} rx={w / 2} ry={h / 2} fill={c.k.white} />
      <path
        d={`M${x - w * 0.36} ${y + h * 0.1} Q${x - w * 0.18} ${y + h * 0.42} ${x} ${y + h * 0.12} Q${x + w * 0.18} ${y + h * 0.42} ${x + w * 0.36} ${y + h * 0.1}`}
        fill="none"
        {...ln(c, 1.2)}
      />
      <path d={`M${x} ${y - h * 0.18} L${x} ${y + h * 0.12}`} fill="none" {...ln(c, 1.2)} />
    </g>
  );
}

export function Zs({ c, x, y }: { c: Ctx; x: number; y: number }) {
  return (
    <g className="rt-odin__z" fill="none" {...ln(c, 2)}>
      <path d={`M${x} ${y} h22 l-22 26 h22`} />
      <path d={`M${x + 34} ${y - 36} h15 l-15 18 h15`} />
    </g>
  );
}

/** A stack of papers from x0 to x1 with its top at y. `tied` bundles them with string. */
export function Stack({
  c,
  x0,
  x1,
  y,
  tied,
}: {
  c: Ctx;
  x0: number;
  x1: number;
  y: number;
  tied?: boolean;
}) {
  const { k } = c;
  const sheets = [
    [x0 + 6, y, x1 - 4, y + 2, x1 - 2, y + 22, x0 + 4, y + 21],
    [x0, y + 21, x1 + 4, y + 20, x1 + 2, y + 40, x0 + 2, y + 42],
  ];
  return (
    <g>
      {sheets.map((p, i) => (
        <g key={i}>
          <path
            d={`M${p[0]} ${p[1]} L${p[2]} ${p[3]} L${p[4]} ${p[5]} L${p[6]} ${p[7]} Z`}
            fill={k.paper}
            {...ln(c)}
          />
          <path
            d={`M${x0 + 20} ${y + 8 + i * 21} h${(x1 - x0) * 0.35} M${x0 + 20} ${y + 14 + i * 21} h${(x1 - x0) * 0.22} M${x0 + (x1 - x0) * 0.55} ${y + 8 + i * 21} h${(x1 - x0) * 0.3}`}
            fill="none"
            {...ln(c, 0.5)}
          />
        </g>
      ))}
      {tied ? (
        <path
          d={`M${x0 + (x1 - x0) * 0.3} ${y} L${x0 + (x1 - x0) * 0.3} ${y + 42} M${x0 + (x1 - x0) * 0.72} ${y + 1} L${x0 + (x1 - x0) * 0.72} ${y + 41}`}
          stroke={k.bag}
          strokeWidth={c.w * 2}
        />
      ) : null}
    </g>
  );
}

export function Skateboard({ c, x0, x1, y }: { c: Ctx; x0: number; x1: number; y: number }) {
  const { k } = c;
  const wheel = (cx: number) => (
    <g key={cx}>
      <circle cx={cx} cy={y + 26} r="11" fill={k.white} {...ln(c)} />
      <g className="rt-odin__spin">
        <path
          d={`M${cx - 7} ${y + 26} H${cx + 7} M${cx} ${y + 19} V${y + 33}`}
          fill="none"
          {...ln(c, 0.7)}
        />
      </g>
    </g>
  );
  return (
    <g>
      <path d={`M${x0 + 40} ${y + 12} v6 M${x1 - 40} ${y + 12} v6`} {...ln(c, 2)} />
      {wheel(x0 + 40)}
      {wheel(x1 - 40)}
      <path
        d={`M${x0} ${y + 6} C${x0 - 4} ${y} ${x0 + 4} ${y - 2} ${x0 + 12} ${y - 2} L${x1 - 12} ${y - 2} C${x1 - 4} ${y - 2} ${x1 + 4} ${y} ${x1} ${y + 6} C${x1 - 2} ${y + 12} ${x1 - 8} ${y + 14} ${x1 - 16} ${y + 14} L${x0 + 16} ${y + 14} C${x0 + 8} ${y + 14} ${x0 + 2} ${y + 12} ${x0} ${y + 6} Z`}
        fill={k.cap}
        {...ln(c)}
      />
      <path
        d={`M${x0 - 50} ${y - 90} h34 M${x0 - 62} ${y - 60} h44 M${x0 - 46} ${y - 30} h30`}
        fill="none"
        {...ln(c, 1.6)}
      />
    </g>
  );
}

/** Today's paper, rolled and tied, lying from (x0, y0) to (x1, y1). */
export function RolledPaper({
  c,
  x0,
  y0,
  x1,
  y1,
}: {
  c: Ctx;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}) {
  const { k } = c;
  const len = Math.hypot(x1 - x0, y1 - y0);
  const ang = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI;
  return (
    <g transform={`translate(${x0} ${y0}) rotate(${ang})`}>
      <rect x="0" y="-12" width={len} height="24" rx="12" fill={k.paper} {...ln(c)} />
      <path d={`M${len * 0.62} -12 V12`} stroke={k.bag} strokeWidth={c.w * 2.4} />
      <path
        d={`M12 -4 h${len * 0.3} M12 4 h${len * 0.22} M${len * 0.7} -4 h${len * 0.18}`}
        fill="none"
        {...ln(c, 0.5)}
      />
      <ellipse cx={len - 2} cy="0" rx="6" ry="12" fill={k.paper} {...ln(c)} />
    </g>
  );
}

/** A string of fairy lights along `path`, bulbs at `bulbs`. */
export function FairyLights({
  c,
  paths,
  bulbs,
}: {
  c: Ctx;
  paths: readonly string[];
  bulbs: readonly [number, number, number][];
}) {
  const { k } = c;
  const fills = [k.cap, k.bag, k.eye, k.tongue];
  return (
    <g>
      {paths.map((d, i) => (
        <path key={i} d={d} fill="none" {...ln(c, 0.9)} />
      ))}
      {bulbs.map(([x, y, rot], i) => (
        <g key={i} transform={`rotate(${rot} ${x} ${y})`}>
          <g className="rt-odin__glow" style={{ animationDelay: `${i * 0.4}s` }}>
            <rect x={x - 4} y={y} width="8" height="7" fill={k.line} />
            <path
              d={`M${x - 7.5} ${y + 16} C${x - 7.5} ${y + 6} ${x + 7.5} ${y + 6} ${x + 7.5} ${y + 16} C${x + 7.5} ${y + 23} ${x} ${y + 28} ${x} ${y + 28} C${x} ${y + 28} ${x - 7.5} ${y + 23} ${x - 7.5} ${y + 16} Z`}
              fill={fills[i % fills.length]}
              {...ln(c, 0.8)}
            />
          </g>
        </g>
      ))}
    </g>
  );
}

export function TornPage({ c, x, y, turn = -8 }: { c: Ctx; x: number; y: number; turn?: number }) {
  const { k } = c;
  return (
    <g transform={`translate(${x} ${y}) rotate(${turn})`}>
      <path
        d="M0 0 L64 -4 L68 82 L58 74 L50 86 L40 74 L30 88 L20 76 L10 86 L2 78 Z"
        fill={k.paper}
        {...ln(c)}
      />
      <path d="M8 12 h46" {...ln(c, 2.4)} />
      <path d="M8 24 h42 M8 32 h46 M8 40 h34 M8 48 h44 M8 56 h26" fill="none" {...ln(c, 0.6)} />
    </g>
  );
}

export function Question({ c, x, y }: { c: Ctx; x: number; y: number }) {
  return (
    <g>
      <path
        d={`M${x} ${y} C${x - 2} ${y - 22} ${x + 34} ${y - 26} ${x + 34} ${y - 4} C${x + 34} ${y + 10} ${x + 16} ${y + 12} ${x + 17} ${y + 28}`}
        fill="none"
        {...ln(c, 3.2)}
      />
      <circle cx={x + 17} cy={y + 42} r={c.w * 2.4} fill={c.k.line} />
    </g>
  );
}

/** Paints over the open mouth and draws a small round "o" of surprise. */
export function OMouth({ c, x, y, w, h }: { c: Ctx; x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <ellipse cx={x} cy={y + h * 0.5} rx={w / 2} ry={h / 2} fill={c.k.white} />
      <path d={`M${x} ${y - h * 0.18} L${x} ${y + h * 0.12}`} fill="none" {...ln(c, 1.2)} />
      <ellipse cx={x} cy={y + h * 0.42} rx={w * 0.1} ry={h * 0.2} fill={c.k.line} />
      <ellipse cx={x} cy={y + h * 0.5} rx={w * 0.06} ry={h * 0.09} fill={c.k.tongue} />
    </g>
  );
}

/**
 * Round, bright eyes with soft brows arched up and away, for a trace whose own eyes slant in
 * (which reads cross). The caller leaves the traced eyes out and draws these instead.
 */
export function HappyEyes({
  c,
  eyes,
  r,
}: {
  c: Ctx;
  eyes: readonly [number, number][];
  r: number;
}) {
  const mid = (eyes[0]![0] + eyes[1]![0]) / 2;
  return (
    <g>
      {eyes.map(([x, y]) => {
        const out = x < mid ? -1 : 1;
        return (
          <g key={x}>
            <circle cx={x} cy={y} r={r * 1.15} fill={c.k.line} />
            <path
              d={`M${x - out * r * 0.9} ${y - r * 2.1} Q${x + out * r * 0.25} ${y - r * 3} ${x + out * r * 1.35} ${y - r * 1.85}`}
              fill="none"
              {...ln(c, 0.8)}
            />
          </g>
        );
      })}
    </g>
  );
}
