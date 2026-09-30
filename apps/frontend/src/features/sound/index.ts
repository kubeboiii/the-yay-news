"use client";

// Paper sounds, synthesised with Web Audio (nothing to download). Every sound is off until the
// reader turns sound on, and each call is safe to make at any time: it does nothing when sound is
// off, audio is locked, or the browser has no Web Audio.
//
// The choice is remembered on the device (`yn-sound`). Browsers only let audio start from a user
// gesture, so the first tap or key press after sound is on wakes the audio context.
//
// Every sound is filtered noise or a short oscillator with a hand-shaped envelope:
//   pencil  graphite grain: a narrow high band of noise, jittered in level like a nib on fibres
//   erase   three soft rubs of low-mid noise, back and forth
//   tick    two quick pencil strokes, the second longer (a tick is down-then-up)
//   stamp   a rubber thunk (a falling low sine) with a muffled slap on top and a sticky lift-off
//   sticker a crackly rising peel;  press  a soft thumb press
//   fold    a crisp crease: a sharp noise attack swept downwards, then a papery settle
//   rustle  a page turning: uneven crinkles across a sweeping band
//   whoosh  air past a paper aeroplane: a band of noise swelling and falling, panned across

export type PaperSound =
  | "pencil" // a short graphite scratch, per letter written
  | "erase" // an eraser rub
  | "tick" // a pencil tick when something is solved
  | "stamp" // a rubber stamp thunk
  | "sticker" // peeling a sticker off its backing
  | "press" // pressing a sticker down
  | "fold" // a paper fold/crease
  | "rustle" // a page turning
  | "whoosh"; // a paper aeroplane leaving

const KEY = "yn-sound";
const listeners = new Set<() => void>();
let on: boolean | null = null;
let ctx: AudioContext | null = null;
let grain: AudioBuffer | null = null;

function readOn(): boolean {
  if (on !== null) return on;
  try {
    on = localStorage.getItem(KEY) === "on";
  } catch {
    on = false;
  }
  return on;
}

/** Whether the reader has sound switched on. */
export function soundOn(): boolean {
  if (typeof window === "undefined") return false;
  return readOn();
}

/** Switches paper sounds on or off (remembered on the device). */
export function setSound(next: boolean): void {
  on = next;
  try {
    localStorage.setItem(KEY, next ? "on" : "off");
  } catch {
    // Storage blocked: the choice lasts for this visit.
  }
  if (next) unlock();
  for (const l of listeners) l();
}

/** For a toggle: subscribe to changes of the sound switch. */
export function subscribeSound(l: () => void): () => void {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      on = null;
      l();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

/** Creates (or wakes) the audio context. Must run inside a user gesture the first time. */
export function unlock(): void {
  if (typeof window === "undefined") return;
  try {
    if (!ctx) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      ctx = new Ctor();
    }
    if (ctx.state === "suspended") void ctx.resume();
  } catch {
    ctx = null;
  }
}

// Wake audio on the first gesture of the visit, if sound is on.
if (typeof window !== "undefined") {
  const first = () => {
    if (readOn()) unlock();
    if (ctx) {
      window.removeEventListener("pointerdown", first, true);
      window.removeEventListener("keydown", first, true);
    }
  };
  window.addEventListener("pointerdown", first, true);
  window.addEventListener("keydown", first, true);
}

function ready(): AudioContext | null {
  if (!soundOn()) return null;
  unlock();
  return ctx && ctx.state !== "closed" ? ctx : null;
}

/** Two seconds of fixed-seed white noise, shared by every sound. */
function noiseBuffer(ac: AudioContext): AudioBuffer {
  if (grain && grain.sampleRate === ac.sampleRate) return grain;
  const buffer = ac.createBuffer(1, Math.ceil(ac.sampleRate * 2), ac.sampleRate);
  const data = buffer.getChannelData(0);
  let s = 0x9e3779b9;
  for (let i = 0; i < data.length; i++) {
    s = (Math.imul(s ^ (s >>> 15), 0x2c1b3c6d) + 0x297a2d39) >>> 0;
    data[i] = (s / 4294967296) * 2 - 1;
  }
  grain = buffer;
  return buffer;
}

/** A noise source starting at a random point in the shared buffer, so repeats don't sound alike. */
function noise(ac: AudioContext, t: number, seconds: number) {
  const src = ac.createBufferSource();
  src.buffer = noiseBuffer(ac);
  src.start(t, Math.random() * 1.2, seconds + 0.05);
  return src;
}

function filter(ac: AudioContext, type: BiquadFilterType, freq: number, q = 0.7) {
  const f = ac.createBiquadFilter();
  f.type = type;
  f.frequency.value = freq;
  f.Q.value = q;
  return f;
}

function envelope(ac: AudioContext, points: [number, number][], t: number) {
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, t);
  for (const [at, level] of points) g.gain.linearRampToValueAtTime(Math.max(level, 0.0001), t + at);
  return g;
}

const jitter = (n: number, spread: number) => n * (1 + (Math.random() * 2 - 1) * spread);

function pencil(ac: AudioContext, t: number, length = 0.07, level = 0.07) {
  const src = noise(ac, t, length);
  const band = filter(ac, "bandpass", jitter(4200, 0.15), 1.6);
  const high = filter(ac, "highpass", 1800);
  const pts: [number, number][] = [];
  const steps = Math.max(4, Math.round(length / 0.012));
  for (let i = 1; i <= steps; i++) {
    pts.push([(length * i) / steps, level * (0.45 + Math.random() * 0.55) * (i === steps ? 0 : 1)]);
  }
  src
    .connect(band)
    .connect(high)
    .connect(envelope(ac, pts, t))
    .connect(ac.destination);
}

function erase(ac: AudioContext, t: number) {
  for (let i = 0; i < 3; i++) {
    const at = t + i * 0.12;
    const src = noise(ac, at, 0.12);
    const band = filter(ac, "bandpass", jitter(i % 2 ? 1100 : 900, 0.1), 0.9);
    const low = filter(ac, "lowpass", 2400);
    src
      .connect(band)
      .connect(low)
      .connect(
        envelope(
          ac,
          [
            [0.03, 0.09],
            [0.08, 0.06],
            [0.115, 0],
          ],
          at,
        ),
      )
      .connect(ac.destination);
  }
}

function stampThunk(ac: AudioContext, t: number) {
  // The wooden block and rubber hitting the desk.
  const osc = ac.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(130, t);
  osc.frequency.exponentialRampToValueAtTime(46, t + 0.14);
  const body = ac.createGain();
  body.gain.setValueAtTime(0.0001, t);
  body.gain.exponentialRampToValueAtTime(0.55, t + 0.006);
  body.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
  osc.connect(body).connect(ac.destination);
  osc.start(t);
  osc.stop(t + 0.25);
  // The slap of rubber on paper.
  const slap = noise(ac, t, 0.09);
  slap
    .connect(filter(ac, "lowpass", 900))
    .connect(
      envelope(
        ac,
        [
          [0.004, 0.35],
          [0.05, 0.05],
          [0.09, 0],
        ],
        t,
      ),
    )
    .connect(ac.destination);
  // The sticky lift as the stamp comes away.
  const lift = t + 0.24;
  const peel = noise(ac, lift, 0.08);
  peel
    .connect(filter(ac, "bandpass", 2600, 1.2))
    .connect(
      envelope(
        ac,
        [
          [0.02, 0.025],
          [0.05, 0.012],
          [0.08, 0],
        ],
        lift,
      ),
    )
    .connect(ac.destination);
}

function peel(ac: AudioContext, t: number) {
  const src = noise(ac, t, 0.3);
  const band = filter(ac, "bandpass", 1800, 1.4);
  band.frequency.setValueAtTime(1400, t);
  band.frequency.exponentialRampToValueAtTime(5200, t + 0.28);
  const pts: [number, number][] = [];
  for (let i = 1; i <= 14; i++) pts.push([i * 0.02, (i % 2 ? 0.07 : 0.025) * (1 - i / 16)]);
  pts.push([0.3, 0]);
  src
    .connect(band)
    .connect(envelope(ac, pts, t))
    .connect(ac.destination);
}

function press(ac: AudioContext, t: number) {
  const src = noise(ac, t, 0.1);
  src
    .connect(filter(ac, "lowpass", 600))
    .connect(
      envelope(
        ac,
        [
          [0.01, 0.2],
          [0.1, 0],
        ],
        t,
      ),
    )
    .connect(ac.destination);
}

function fold(ac: AudioContext, t: number) {
  const src = noise(ac, t, 0.26);
  const band = filter(ac, "bandpass", 3800, 1.1);
  band.frequency.setValueAtTime(4800, t);
  band.frequency.exponentialRampToValueAtTime(1200, t + 0.2);
  src
    .connect(band)
    .connect(
      envelope(
        ac,
        [
          [0.005, 0.16],
          [0.03, 0.05],
          [0.09, 0.07],
          [0.12, 0.02],
          [0.24, 0],
        ],
        t,
      ),
    )
    .connect(ac.destination);
  // The crease itself: a tiny dry click.
  const click = noise(ac, t + 0.1, 0.012);
  click
    .connect(filter(ac, "highpass", 3000))
    .connect(
      envelope(
        ac,
        [
          [0.001, 0.12],
          [0.012, 0],
        ],
        t + 0.1,
      ),
    )
    .connect(ac.destination);
}

function rustle(ac: AudioContext, t: number) {
  const src = noise(ac, t, 0.45);
  const band = filter(ac, "bandpass", 2200, 0.8);
  band.frequency.setValueAtTime(2200, t);
  band.frequency.linearRampToValueAtTime(3600, t + 0.3);
  const high = filter(ac, "highpass", 700);
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, t);
  [0.03, 0.09, 0.14, 0.22, 0.3].forEach((p, i) => {
    g.gain.linearRampToValueAtTime(jitter([0.09, 0.05, 0.12, 0.07, 0.04][i] ?? 0.05, 0.3), t + p);
    g.gain.linearRampToValueAtTime(0.02, t + p + 0.03);
  });
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.42);
  src.connect(band).connect(high).connect(g).connect(ac.destination);
}

function whoosh(ac: AudioContext, t: number) {
  const src = noise(ac, t, 0.9);
  const band = filter(ac, "bandpass", 500, 1.8);
  band.frequency.setValueAtTime(380, t);
  band.frequency.exponentialRampToValueAtTime(1500, t + 0.35);
  band.frequency.exponentialRampToValueAtTime(600, t + 0.85);
  const g = envelope(
    ac,
    [
      [0.3, 0.22],
      [0.5, 0.14],
      [0.88, 0],
    ],
    t,
  );
  let out: AudioNode = src.connect(band).connect(g);
  if (typeof ac.createStereoPanner === "function") {
    const pan = ac.createStereoPanner();
    pan.pan.setValueAtTime(-0.6, t);
    pan.pan.linearRampToValueAtTime(0.7, t + 0.85);
    out = out.connect(pan);
  }
  out.connect(ac.destination);
}

/** Plays a paper sound if sound is on. */
export function play(sound: PaperSound): void {
  const ac = ready();
  if (!ac) return;
  try {
    const t = ac.currentTime + 0.005;
    switch (sound) {
      case "pencil":
        pencil(ac, t);
        break;
      case "erase":
        erase(ac, t);
        break;
      case "tick":
        pencil(ac, t, 0.05, 0.08);
        pencil(ac, t + 0.07, 0.11, 0.09);
        break;
      case "stamp":
        stampThunk(ac, t);
        break;
      case "sticker":
        peel(ac, t);
        break;
      case "press":
        press(ac, t);
        break;
      case "fold":
        fold(ac, t);
        break;
      case "rustle":
        rustle(ac, t);
        break;
      case "whoosh":
        whoosh(ac, t);
        break;
    }
  } catch {
    // A sound is never worth an error.
  }
}
