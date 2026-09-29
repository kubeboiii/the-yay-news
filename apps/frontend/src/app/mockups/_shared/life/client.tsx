"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ageInDays, currentIssue } from "../edition-seed";
import { ageBackground, ageLook } from "./age";
import { editionPress, nudge } from "./imperfection";
import { currentHour, lightFor } from "./light";
import { rustle, thump, tick, unlockAudio } from "./sound";

const WRAP = ".print-sheet-wrap, .yn-sheet-wrap";
const SHEET = ".print-sheet, .yn-sheet";
const PAGES = ["", "/screen-and-sound", "/gaming", "/back"];

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const urlParam = (name: string) => new URLSearchParams(window.location.search).get(name);

function place(pathname: string) {
  const m = /^\/mockups\/(v\d+)(\/[^/?#]*)?\/?$/.exec(pathname);
  if (!m?.[1]) return null;
  const index = PAGES.indexOf(m[2] ?? "");
  return index < 0 ? null : { version: m[1], index };
}

function setVars(el: HTMLElement, vars: Record<string, string>) {
  for (const [k, v] of Object.entries(vars)) el.style.setProperty(k, v);
}

function layer(parent: HTMLElement, className: string) {
  const el = document.createElement("div");
  el.className = className;
  el.setAttribute("aria-hidden", "true");
  parent.appendChild(el);
  return el;
}

/** The paper, dropped on the desk folded in half; it settles, then opens out flat. Returns a
 *  function that tears the animation down without it counting as seen. */
function arrive(wrap: HTMLElement, seen: () => void) {
  const html = document.documentElement;
  const D = 1800;
  const shade = layer(wrap, "life-fold-shade");
  const edge = layer(wrap, "life-fold-edge");
  // Folded in half, and small enough that the fold itself lands in view. A long phone column
  // folds nearer the top instead, so the reader still sees an edge come down.
  const H = wrap.getBoundingClientRect().height || 1;
  const room = window.innerHeight * 0.62;
  let s = Math.min(0.86, room / (0.5 * H));
  let f = 0.5;
  if (s < 0.55) {
    s = 0.55;
    f = Math.min(0.5, room / (H * s));
  }
  const pct = (n: number) => `${Math.round(n * 1000) / 10}%`;
  shade.style.top = pct(f);
  edge.style.top = pct(f);
  const origin = wrap.style.transformOrigin;
  wrap.style.transformOrigin = "50% 0";
  const folded = `inset(0 0 ${pct(1 - f)} 0)`;
  const k = (n: number) => String(Math.round(s * n * 1000) / 1000);
  const wrapAnim = wrap.animate(
    [
      {
        offset: 0,
        opacity: 0,
        translate: "0 -80px",
        scale: k(0.96),
        rotate: "-3deg",
        clipPath: folded,
        easing: "cubic-bezier(.5,0,.9,.6)",
      },
      {
        offset: 0.26,
        opacity: 1,
        translate: "0 5px",
        scale: k(1.01),
        rotate: "-1.6deg",
        clipPath: folded,
        easing: "ease-out",
      },
      {
        offset: 0.33,
        translate: "0 -3px",
        scale: k(1),
        rotate: "-1.5deg",
        clipPath: folded,
        easing: "ease-in-out",
      },
      { offset: 0.4, translate: "0 0", scale: k(1), rotate: "-1.5deg", clipPath: folded },
      {
        offset: 0.5,
        translate: "0 0",
        scale: k(1),
        rotate: "-1.5deg",
        clipPath: folded,
        easing: "cubic-bezier(.45,0,.3,1)",
      },
      // Opened out where it lies, then drawn up to reading distance.
      {
        offset: 0.8,
        translate: "0 0",
        scale: k(1),
        rotate: "-1.1deg",
        clipPath: "inset(0 0 0% 0)",
        easing: "cubic-bezier(.3,0,.2,1)",
      },
      {
        offset: 1,
        opacity: 1,
        translate: "0 0",
        scale: "1",
        rotate: "0deg",
        clipPath: "inset(0 0 0% 0)",
      },
    ],
    { duration: D },
  );
  const unfold = {
    delay: D * 0.5,
    duration: D * 0.3,
    easing: "cubic-bezier(.45,0,.3,1)",
    fill: "both" as const,
  };
  const shadeAnim = shade.animate(
    [{ opacity: 1 }, { opacity: 0.6, offset: 0.5 }, { opacity: 0 }],
    unfold,
  );
  const edgeAnim = edge.animate(
    [
      { top: pct(f), opacity: 0 },
      { top: pct(f + (1 - f) * 0.2), opacity: 1, offset: 0.2 },
      { top: "100%", opacity: 0 },
    ],
    unfold,
  );
  const anims = [wrapAnim, shadeAnim, edgeAnim];
  const land = window.setTimeout(() => {
    thump();
    tick();
  }, D * 0.26);
  html.dataset.arriving = "1";

  let cancelled = false;
  const keys = ["pointerdown", "keydown"] as const;
  const tidy = () => {
    window.clearTimeout(land);
    for (const k of keys) window.removeEventListener(k, skip);
    shade.remove();
    edge.remove();
    wrap.style.transformOrigin = origin;
    delete html.dataset.arriving;
  };
  function skip() {
    window.clearTimeout(land);
    for (const a of anims) a.finish();
  }
  for (const k of keys) window.addEventListener(k, skip, { once: true });
  wrapAnim.finished.then(
    () => {
      tidy();
      if (!cancelled) seen();
    },
    () => tidy(),
  );
  return () => {
    cancelled = true;
    for (const a of anims) a.cancel();
    tidy();
  };
}

/** The next page swings in from the right edge (or back in from the left) with a curl shadow. */
function turn(wraps: HTMLElement[], forward: boolean) {
  if (reducedMotion()) {
    for (const w of wraps)
      w.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, easing: "ease-out" });
    return;
  }
  rustle();
  for (const w of wraps) {
    const desk = w.parentElement;
    const oldPerspective = desk?.style.perspective ?? "";
    const oldOrigin = desk?.style.perspectiveOrigin ?? "";
    if (desk) {
      desk.style.perspective = "2600px";
      desk.style.perspectiveOrigin = `${forward ? "0%" : "100%"} ${Math.round(window.innerHeight / 2)}px`;
    }
    const origin = w.style.transformOrigin;
    w.style.transformOrigin = forward ? "0% 30%" : "100% 30%";
    const curl = layer(w, "life-curl");
    const anim = w.animate(
      [
        { rotate: forward ? "y -28deg" : "y 28deg", opacity: 0.35 },
        { rotate: forward ? "y -8deg" : "y 8deg", opacity: 1, offset: 0.45 },
        { rotate: "y 0deg", opacity: 1 },
      ],
      { duration: 450, easing: "cubic-bezier(.2,.7,.3,1)" },
    );
    curl.animate(
      forward
        ? [
            { left: "70%", opacity: 1 },
            { left: "-40%", opacity: 0 },
          ]
        : [
            { left: "-10%", opacity: 1 },
            { left: "100%", opacity: 0 },
          ],
      { duration: 450, easing: "ease-out", fill: "both" },
    );
    anim.finished
      .catch(() => undefined)
      .then(() => {
        curl.remove();
        w.style.transformOrigin = origin;
        if (desk) {
          desk.style.perspective = oldPerspective;
          desk.style.perspectiveOrigin = oldOrigin;
        }
      });
  }
}

function issueOf(ref: { current: number | null }) {
  if (ref.current === null) ref.current = currentIssue();
  return ref.current;
}

type Press = ReturnType<typeof editionPress>["filter"];

/** A second copy of the press filter with this edition's seeds and ink weight. */
function EditionPress({ f, soften }: { f: Press; soften: number }) {
  return (
    <svg aria-hidden width="0" height="0" style={{ position: "absolute" }}>
      <defs>
        <filter
          id="press-edition"
          x="0"
          y="0"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.1"
            numOctaves="2"
            seed={f.fibreSeed}
            result="fibre"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="fibre"
            scale={f.scale}
            xChannelSelector="R"
            yChannelSelector="G"
            result="wicked"
          />
          <feGaussianBlur
            in="wicked"
            stdDeviation={Math.round((f.blur + soften) * 100) / 100}
            result="spread"
          />
          <feComponentTransfer in="spread" result="gained">
            <feFuncR type="linear" slope={f.slope} intercept={f.intercept} />
            <feFuncG type="linear" slope={f.slope} intercept={f.intercept} />
            <feFuncB type="linear" slope={f.slope} intercept={f.intercept} />
          </feComponentTransfer>
          <feTurbulence
            type="fractalNoise"
            baseFrequency={f.blotchFreq}
            numOctaves="3"
            seed={f.blotchSeed}
            result="blotch"
          />
          <feColorMatrix
            in="blotch"
            type="matrix"
            values={`0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  ${f.lift} 0 0 0 -0.31`}
            result="lift"
          />
          <feBlend in="gained" in2="lift" mode="screen" result="inked" />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="2.2"
            numOctaves="1"
            seed={f.dustSeed}
            result="dust"
          />
          <feColorMatrix
            in="dust"
            type="matrix"
            values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  7 0 0 0 -5.15"
            result="specks"
          />
          <feBlend in="inked" in2="specks" mode="screen" />
        </filter>
      </defs>
    </svg>
  );
}

export function PaperLifeClient({ version }: { version: string }) {
  const pathname = usePathname();
  const previous = useRef<string | null>(null);
  // The edition is fixed when the paper is picked up: the page links inside a version don't carry
  // `?edition=`, and turning a page must not swap the reader onto today's issue halfway through.
  const issueRef = useRef<number | null>(null);

  const [edition, setEdition] = useState<{ press: Press; soften: number } | null>(null);

  // Edition-wide state: the light, the press run, the paper's age.
  useEffect(() => {
    const html = document.documentElement;
    const issue = issueOf(issueRef);
    const press = editionPress(issue);
    const look = ageLook(ageInDays(issue), issue);
    html.dataset.life = "on";
    setVars(html, press.vars);
    setVars(html, {
      "--age-sepia": String(look.sepia),
      "--age-brightness": String(look.brightness),
      "--age-contrast": String(look.contrast),
      "--age-saturate": String(look.saturate),
      "--age-edge-on": look.edge > 0 ? "1" : "0",
      "--age-layers": look.edge > 0 ? ageBackground(look) : "none",
    });
    setEdition({ press: press.filter, soften: look.soften });

    const light = () => {
      const l = lightFor(currentHour());
      html.dataset.light = l.name;
      setVars(html, {
        "--light-tint": l.tint,
        "--light-opacity": String(l.opacity),
        "--light-sx": `${l.shadowX}px`,
        "--light-sy": `${l.shadowY}px`,
        "--light-stretch": String(l.shadowStretch),
        "--light-strength": String(l.shadowStrength),
      });
    };
    light();
    const clock = window.setInterval(light, 5 * 60 * 1000);

    // With sound switched on, the first touch of the page is what lets the browser play it.
    const wake = () => {
      if (html.dataset.sound === "on") unlockAudio();
    };
    window.addEventListener("pointerdown", wake);
    return () => {
      window.clearInterval(clock);
      window.removeEventListener("pointerdown", wake);
    };
  }, []);

  // Reading mode is known before the first paint, so the early stylesheet can hand over to it.
  useLayoutEffect(() => {
    const url = urlParam("reading");
    let saved: string | null;
    try {
      saved = localStorage.getItem("yn-reading");
    } catch {
      saved = null;
    }
    const on = url === "on" || (url !== "off" && saved === "on");
    document.documentElement.dataset.reading = on ? "on" : "off";
  }, []);

  // Per page: drift, age layer, end marker, and the arrival or page turn that brought it here.
  useLayoutEffect(() => {
    const issue = issueOf(issueRef);
    const here = place(pathname);
    // A re-run for the same page (React re-mounting effects in development) is not a navigation.
    const before =
      previous.current && previous.current !== pathname ? place(previous.current) : null;
    previous.current = pathname;
    if (!here || here.version !== version) {
      document.getElementById("life-early")?.remove();
      return;
    }

    const sheets = Array.from(document.querySelectorAll<HTMLElement>(SHEET));
    const added: HTMLElement[] = [];
    for (const sheet of sheets) {
      if (!sheet.querySelector(":scope > .life-age")) added.push(layer(sheet, "life-age"));
    }
    nudge(issue);
    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => nudge(issue), 200);
    };
    window.addEventListener("resize", onResize);

    // Reaching the foot of the back page earns a small tick on a phone.
    let observer: IntersectionObserver | null = null;
    const last = sheets.at(-1);
    if (here.index === PAGES.length - 1 && last) {
      const end = layer(last, "life-end");
      added.push(end);
      observer = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          tick();
          observer?.disconnect();
        }
      });
      observer.observe(end);
    }

    const wraps = Array.from(document.querySelectorAll<HTMLElement>(WRAP));
    const key = `yn-arrived-${version}`;
    let stopArrival: (() => void) | null = null;
    const force = urlParam("arrive");
    const seen = (() => {
      try {
        return sessionStorage.getItem(key) === "1";
      } catch {
        return false;
      }
    })();
    const markSeen = () => {
      try {
        sessionStorage.setItem(key, "1");
      } catch {
        // Storage blocked: the paper will simply arrive again next time.
      }
    };

    if (before && before.version === here.version && before.index !== here.index) {
      markSeen();
      turn(wraps, here.index > before.index);
    } else if (
      !before &&
      here.index === 0 &&
      force !== "0" &&
      (force === "1" || !seen) &&
      !reducedMotion() &&
      wraps[0]
    ) {
      stopArrival = arrive(wraps[0], markSeen);
    } else if (!before && here.index === 0 && force !== "1" && !seen) {
      markSeen();
    }
    if (!stopArrival) delete document.documentElement.dataset.arriving;
    document.getElementById("life-early")?.remove();

    return () => {
      window.removeEventListener("resize", onResize);
      window.clearTimeout(resizeTimer);
      observer?.disconnect();
      stopArrival?.();
      for (const el of added) el.remove();
    };
  }, [pathname, version]);

  return (
    <>
      <div className="life-room" aria-hidden />
      {edition ? <EditionPress f={edition.press} soften={edition.soften} /> : null}
    </>
  );
}

type Toggle = "on" | "off";

function useToggle(name: "reading" | "sound", storageKey: string, fromUrl: boolean) {
  // Unknown until the saved choice is read, so the first render never switches anything off.
  const [value, setValue] = useState<Toggle | null>(null);
  useEffect(() => {
    const url = fromUrl ? urlParam(name) : null;
    let saved: string | null;
    try {
      saved = localStorage.getItem(storageKey);
    } catch {
      saved = null;
    }
    // Read once after mount: the value is unknown (null) on the server and the first render, and
    // becomes known here, so nothing is switched off before the saved choice is read.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of browser storage
    setValue(url === "on" || url === "off" ? url : saved === "on" ? "on" : "off");
  }, [name, storageKey, fromUrl]);
  useEffect(() => {
    if (value) document.documentElement.dataset[name] = value;
  }, [name, value]);
  const choose = (next: Toggle) => {
    setValue(next);
    try {
      localStorage.setItem(storageKey, next);
    } catch {
      // Blocked storage: the choice still holds for this page view.
    }
  };
  return [value ?? "off", choose] as const;
}

const pill = "flex items-center gap-0.5 rounded-full bg-white/15 p-0.5";
const option = (on: boolean) =>
  `rounded-full px-2.5 py-0.5 ${on ? "bg-white text-black" : "hover:bg-white/15"}`;

/** Toolbar controls for paper life: reading mode, sound and touch, and the archive of back issues. */
export function LifeControls() {
  const [reading, setReading] = useToggle("reading", "yn-reading", true);
  const [sound, setSound] = useToggle("sound", "yn-sound", false);
  return (
    <span className={pill} role="group" aria-label="Reading and sound">
      <button
        type="button"
        aria-pressed={reading === "on"}
        aria-label="Reading mode"
        onClick={() => setReading(reading === "on" ? "off" : "on")}
        className={option(reading === "on")}
      >
        Reading
      </button>
      <button
        type="button"
        aria-pressed={sound === "on"}
        aria-label="Sound and touch"
        onClick={() => {
          const next = sound === "on" ? "off" : "on";
          if (next === "on") {
            document.documentElement.dataset.sound = "on";
            unlockAudio();
            rustle();
          }
          setSound(next);
        }}
        className={option(sound === "on")}
      >
        Sound
      </button>
      <Link href="/mockups/archive" className="rounded-full px-2.5 py-0.5 hover:bg-white/15">
        Archive
      </Link>
    </span>
  );
}
