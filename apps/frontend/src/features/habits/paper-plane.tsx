"use client";

import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  type RefObject,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { play } from "@/features/sound";
import { useHabitsReady } from "./api";
import { habitFonts } from "./fonts";
import {
  BACK_FLIP,
  FACETS,
  SHEET_H,
  SHEET_W,
  STEPS,
  clipOf,
  css,
  facetMatrices,
  lightOf,
  mul,
  poseAt,
  poseMatrix,
  ap,
  centroid,
  dot,
  EYE,
  norm,
  PROJECT,
} from "./plane-geometry";
import "./paper-plane.css";

// The ending: "You're done for today." Fold today's paper into an aeroplane — four folds, each a
// tap (corners in, the other corner, in half, wings down) — then throw it: drag and let go in the
// direction you want it to fly, or press the button. It loops once and sails off, and a note says
// when tomorrow's paper lands. With reduced motion it folds in one go and simply leaves.

const HINTS = [
  "Fold the corner in",
  "And the other corner",
  "Now in half",
  "Wings down",
  "Throw it!",
];

type Phase = "folding" | "ready" | "flying" | "gone";

const FLAT: number[] = Array.from({ length: STEPS }, () => 0);

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

type FaceStyle = {
  front: string;
  back: string;
  lf: number;
  lb: number;
  facing: boolean;
  z: number;
};

/**
 * Every facet's projected transform, light, which side faces the reader, and its paint order.
 * The facets are drawn flat and stacked by hand rather than left to the browser's 3D sorting,
 * which drops or splits planes that lie almost on top of each other (as folded paper does).
 */
function stylesFor(progress: readonly number[]): Map<string, FaceStyle> {
  const mats = facetMatrices(progress);
  const pose = poseMatrix(poseAt(progress));
  const info = FACETS.map((f) => {
    const m = mul(pose, mats.get(f.id)!);
    const c = ap(m, centroid(f.pts));
    const n = norm([m[8]!, m[9]!, m[10]!]);
    const facing = dot(n, [EYE[0] - c[0], EYE[1] - c[1], EYE[2] - c[2]]) >= 0;
    return { f, m, c, n, facing };
  });
  // Painter's order: facets lying on each other go by which is nearer along their normal;
  // anything else by depth.
  const order = [...info].sort((A, B) => {
    if (Math.abs(dot(A.n, B.n)) > 0.995) {
      const toward = A.n[2] >= 0 ? 1 : -1;
      const d = dot(A.n, [B.c[0] - A.c[0], B.c[1] - A.c[1], B.c[2] - A.c[2]]) * toward;
      if (Math.abs(d) < 4) return d > 0 ? -1 : d < 0 ? 1 : 0;
    }
    return A.c[2] - B.c[2];
  });
  const out = new Map<string, FaceStyle>();
  order.forEach(({ f, m, facing }, z) => {
    const b = mul(m, BACK_FLIP);
    const light = lightOf(m);
    out.set(f.id, {
      front: css(mul(PROJECT, m)),
      back: css(mul(PROJECT, b)),
      lf: light,
      lb: -light,
      facing,
      z: z + 1,
    });
  });
  return out;
}

const shade = (l: number) => Math.min(0.55, Math.max(0, 0.42 - l * 0.42)).toFixed(3);

/** The printed side of the sheet: a tiny edition of the paper, masthead and all. */
function Print({ issue }: { issue: number }) {
  return (
    <div className="pp-print">
      <div className="pp-print__mast">The Yay News</div>
      <div className="pp-print__rule">No. {issue} · good news only</div>
      <div className="pp-print__head" />
      <div className="pp-print__head pp-print__head--2" />
      <div className="pp-print__cols">
        <span />
        <span />
        <span />
      </div>
      <div className="pp-print__block" />
      <div className="pp-print__cols pp-print__cols--low">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

function Model({
  issue,
  initial,
  refs,
}: {
  issue: number;
  initial: Map<string, FaceStyle>;
  refs?: RefObject<Map<string, { f: HTMLDivElement | null; b: HTMLDivElement | null }>>;
}) {
  const setRef = (id: string, side: "f" | "b") => (el: HTMLDivElement | null) => {
    if (!refs) return;
    const cur = refs.current.get(id) ?? { f: null, b: null };
    refs.current.set(id, { ...cur, [side]: el });
  };
  return (
    <div className="pp-model" style={{ width: SHEET_W, height: SHEET_H }}>
      {FACETS.map((f) => {
        const s = initial.get(f.id)!;
        return [
          <div
            key={`${f.id}f`}
            ref={setRef(f.id, "f")}
            className="pp-face pp-face--front"
            style={
              {
                clipPath: clipOf(f.pts),
                transform: s.front,
                "--shade": shade(s.lf),
                zIndex: s.z,
                visibility: s.facing ? "visible" : "hidden",
              } as CSSProperties
            }
          >
            <Print issue={issue} />
          </div>,
          <div
            key={`${f.id}b`}
            ref={setRef(f.id, "b")}
            className="pp-face pp-face--back"
            style={
              {
                clipPath: clipOf(f.pts, true),
                transform: s.back,
                "--shade": shade(s.lb),
                zIndex: s.z,
                visibility: s.facing ? "hidden" : "visible",
              } as CSSProperties
            }
          />,
        ];
      })}
    </div>
  );
}

/** The flight: a loop, then off the screen in the thrown direction. */
function flightFrames(dx: number, dy: number, w: number, h: number) {
  const len = Math.hypot(dx, dy) || 1;
  // Work as if it's thrown to the right, and mirror a throw to the left.
  const flip = dx < 0;
  const ux = Math.abs(dx) / len;
  const uy = dy / len;
  const heading = (Math.atan2(uy, ux) * 180) / Math.PI;
  const far = Math.hypot(w, h) * 1.1;
  const loopR = Math.min(90, w * 0.14);
  const frames: Keyframe[] = [];
  const N = 40;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    // Forward progress speeds up after the loop.
    const fwd = t < 0.55 ? t * 0.35 : 0.1925 + ((t - 0.55) / 0.45) ** 1.6 * 0.8075;
    let lx = 0;
    let ly = 0;
    let pitch = 0;
    if (t > 0.12 && t < 0.52) {
      const s = (t - 0.12) / 0.4;
      const a = s * Math.PI * 2;
      // A loop drawn up and over (in the plane's own frame, "up" is to its left).
      lx = Math.sin(a) * loopR;
      ly = -(1 - Math.cos(a)) * loopR;
      pitch = -s * 360;
    }
    const x = ux * fwd * far;
    const y = uy * fwd * far;
    // Turn the loop from the plane's own frame into the direction of travel.
    const ox = lx * ux - ly * uy;
    const oy = lx * uy + ly * ux;
    frames.push({
      transform: `translate(${((flip ? -1 : 1) * (x + ox)).toFixed(1)}px, ${(y + oy).toFixed(1)}px) scale(${flip ? -1 : 1}, 1) rotate(${(heading + pitch).toFixed(1)}deg) scale(${(1 - t * 0.35).toFixed(3)})`,
      opacity: t > 0.92 ? String((1 - t) / 0.08) : "1",
    });
  }
  return frames;
}

export function PaperPlaneEnding({
  issue,
  nextReleaseText = "Tomorrow’s paper lands at 7am",
  title = "You’re done for today.",
  className,
}: {
  issue: number;
  /** The hand-written note left after the plane flies off. */
  nextReleaseText?: string;
  title?: string;
  className?: string;
}) {
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<Phase>("folding");
  const [throwDir, setThrowDir] = useState<{
    dx: number;
    dy: number;
    rect: DOMRect;
    styles: Map<string, FaceStyle>;
  } | null>(null);
  const mounted = useHabitsReady();
  const progress = useRef<number[]>(Array.from({ length: STEPS }, () => 0));
  const refs = useRef(new Map<string, { f: HTMLDivElement | null; b: HTMLDivElement | null }>());
  const stageRef = useRef<HTMLDivElement>(null);
  const flyRef = useRef<HTMLDivElement>(null);
  const anim = useRef<number | null>(null);
  const drag = useRef<{
    x: number;
    y: number;
    t: number;
    pts: { x: number; y: number; t: number }[];
  } | null>(null);
  const [initial] = useState(() => stylesFor(FLAT));

  const paint = useCallback(() => {
    const styles = stylesFor(progress.current);
    for (const f of FACETS) {
      const s = styles.get(f.id)!;
      const el = refs.current.get(f.id);
      if (el?.f) {
        el.f.style.transform = s.front;
        el.f.style.setProperty("--shade", shade(s.lf));
        el.f.style.visibility = s.facing ? "visible" : "hidden";
        el.f.style.zIndex = String(s.z);
      }
      if (el?.b) {
        el.b.style.transform = s.back;
        el.b.style.setProperty("--shade", shade(s.lb));
        el.b.style.visibility = s.facing ? "hidden" : "visible";
        el.b.style.zIndex = String(s.z);
      }
    }
  }, []);

  useEffect(
    () => () => {
      if (anim.current) cancelAnimationFrame(anim.current);
    },
    [],
  );

  const fold = useCallback(() => {
    if (phase !== "folding" || anim.current) return;
    if (reduced()) {
      progress.current = progress.current.map(() => 1);
      paint();
      play("fold");
      setStep(STEPS);
      setPhase("ready");
      return;
    }
    const i = step;
    play("fold");
    const start = performance.now();
    const dur = i === 3 ? 900 : 700;
    const frame = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      progress.current[i] = ease(t);
      paint();
      if (t < 1) anim.current = requestAnimationFrame(frame);
      else {
        anim.current = null;
        setStep(i + 1);
        if (i + 1 === STEPS) setPhase("ready");
      }
    };
    anim.current = requestAnimationFrame(frame);
  }, [phase, step, paint]);

  const launch = useCallback((dx: number, dy: number) => {
    const el = stageRef.current?.querySelector(".pp-model");
    if (!el) return;
    play("whoosh");
    setThrowDir({ dx, dy, rect: el.getBoundingClientRect(), styles: stylesFor(progress.current) });
    setPhase("flying");
  }, []);

  // Fly: once the portal copy is on screen, animate it along the path.
  useLayoutEffect(() => {
    if (phase !== "flying" || !throwDir || !flyRef.current) return;
    const node = flyRef.current;
    if (reduced()) {
      const a = node.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: "forwards" });
      a.onfinish = () => setPhase("gone");
      return () => a.cancel();
    }
    const a = node.animate(
      flightFrames(throwDir.dx, throwDir.dy, window.innerWidth, window.innerHeight),
      {
        duration: 1900,
        easing: "linear",
        fill: "forwards",
      },
    );
    a.onfinish = () => setPhase("gone");
    return () => a.cancel();
  }, [phase, throwDir]);

  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (phase === "folding") return;
    if (phase !== "ready" || e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const now = performance.now();
    drag.current = {
      x: e.clientX,
      y: e.clientY,
      t: now,
      pts: [{ x: e.clientX, y: e.clientY, t: now }],
    };
  };
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const now = performance.now();
    d.pts.push({ x: e.clientX, y: e.clientY, t: now });
    if (d.pts.length > 8) d.pts.shift();
    const wrap = e.currentTarget.querySelector<HTMLElement>(".pp-hold");
    if (wrap) {
      const ox = Math.max(-40, Math.min(40, (e.clientX - d.x) * 0.4));
      const oy = Math.max(-40, Math.min(40, (e.clientY - d.y) * 0.4));
      wrap.style.transform = `translate(${ox}px, ${oy}px)`;
    }
  };
  const onUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    drag.current = null;
    const wrap = e.currentTarget.querySelector<HTMLElement>(".pp-hold");
    if (wrap) wrap.style.transform = "";
    if (!d) return;
    const first = d.pts[0]!;
    const last = d.pts.at(-1)!;
    const dx = last.x - first.x;
    const dy = last.y - first.y;
    if (Math.hypot(dx, dy) < 24) launch(1, -0.35);
    else launch(dx, dy);
  };

  const reset = () => {
    progress.current = progress.current.map(() => 0);
    setStep(0);
    setThrowDir(null);
    setPhase("folding");
    requestAnimationFrame(paint);
  };

  const hint = HINTS[Math.min(step, STEPS)]!;
  return (
    <section
      className={`pp ${habitFonts} ${className ?? ""}`}
      aria-label="The end of today’s paper"
    >
      <h2 className="pp__title">{title}</h2>
      {phase !== "gone" ? (
        <>
          <div
            ref={stageRef}
            className={`pp__stage ${phase === "ready" ? "is-ready" : ""} ${phase === "flying" ? "is-away" : ""}`}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={() => {
              drag.current = null;
            }}
            onClick={() => {
              if (phase === "folding") fold();
            }}
          >
            <div className="pp-hold">
              <Model issue={issue} initial={initial} refs={refs} />
            </div>
          </div>
          <p className="pp__hint" aria-live="polite">
            {phase === "ready"
              ? "Now throw it! Drag and let go, any way you like."
              : phase === "flying"
                ? "Wheee…"
                : `${hint}: tap the paper.`}
          </p>
          <div className="pp__actions">
            {phase === "folding" ? (
              <button type="button" className="pp__btn" onClick={fold}>
                {step === 0 ? "Fold it into a plane" : `Next fold (${step + 1} of ${STEPS})`}
              </button>
            ) : phase === "ready" ? (
              <button type="button" className="pp__btn" onClick={() => launch(1, -0.35)}>
                Throw it
              </button>
            ) : null}
          </div>
        </>
      ) : (
        <div className="pp__after">
          <p className="pp__note">{nextReleaseText}</p>
          <svg viewBox="0 0 220 60" className="pp__trail" aria-hidden>
            <path d="M6 44 C40 58 70 20 100 30 C130 40 120 58 104 52 C88 46 110 18 150 16 C176 15 196 22 214 10" />
          </svg>
          <button type="button" className="pp__again" onClick={reset}>
            fold another
          </button>
        </div>
      )}
      {mounted && phase === "flying" && throwDir
        ? createPortal(
            <div
              ref={flyRef}
              className={`pp-flight ${habitFonts}`}
              style={{
                left: throwDir.rect.left + throwDir.rect.width / 2 - SHEET_W / 2,
                top: throwDir.rect.top + throwDir.rect.height / 2 - SHEET_H / 2,
              }}
              aria-hidden
            >
              <div className="pp-flight__scale">
                <Model issue={issue} initial={throwDir.styles} />
              </div>
            </div>,
            document.body,
          )
        : null}
    </section>
  );
}
