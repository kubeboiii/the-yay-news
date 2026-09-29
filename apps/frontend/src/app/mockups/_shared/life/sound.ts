// Paper sounds, synthesised rather than recorded: a rustle is a burst of filtered noise with a
// crackly envelope, and the thump of a paper landing is a low sine that falls in pitch and dies
// fast, with a puff of muffled noise on top. Nothing plays unless the reader has switched sound on.

let ctx: AudioContext | null = null;

export const soundOn = () => document.documentElement.dataset.sound === "on";

/** Creates (or wakes) the audio context. Call from a click so the browser allows it. */
export function unlockAudio() {
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

function ready(): AudioContext | null {
  if (!soundOn()) return null;
  unlockAudio();
  // A context still waking up queues the sound and plays it the moment it resumes.
  return ctx && ctx.state !== "closed" ? ctx : null;
}

function noise(ac: AudioContext, seconds: number) {
  const buffer = ac.createBuffer(1, Math.ceil(ac.sampleRate * seconds), ac.sampleRate);
  const data = buffer.getChannelData(0);
  // Fixed-seed noise, so every rustle has the same grain.
  let s = 0x9e3779b9;
  for (let i = 0; i < data.length; i++) {
    s = (Math.imul(s ^ (s >>> 15), 0x2c1b3c6d) + 0x297a2d39) >>> 0;
    data[i] = (s / 4294967296) * 2 - 1;
  }
  const src = ac.createBufferSource();
  src.buffer = buffer;
  return src;
}

/** A soft sheet-of-paper rustle, about a third of a second. */
export function rustle() {
  const ac = ready();
  if (!ac) return;
  const t = ac.currentTime;
  const src = noise(ac, 0.45);
  const band = ac.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.setValueAtTime(2200, t);
  band.frequency.linearRampToValueAtTime(3600, t + 0.3);
  band.Q.value = 0.8;
  const high = ac.createBiquadFilter();
  high.type = "highpass";
  high.frequency.value = 700;
  const gain = ac.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  // A few uneven crinkles rather than one smooth swell.
  const peaks = [0.03, 0.09, 0.14, 0.22, 0.3];
  const levels = [0.09, 0.05, 0.12, 0.07, 0.04];
  peaks.forEach((p, i) => {
    gain.gain.linearRampToValueAtTime(levels[i] ?? 0.05, t + p);
    gain.gain.linearRampToValueAtTime(0.02, t + p + 0.03);
  });
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.42);
  src.connect(band).connect(high).connect(gain).connect(ac.destination);
  src.start(t);
  src.stop(t + 0.45);
}

/** One dull thump: a folded paper dropped on a table. */
export function thump() {
  const ac = ready();
  if (!ac) return;
  const t = ac.currentTime;
  const osc = ac.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(110, t);
  osc.frequency.exponentialRampToValueAtTime(42, t + 0.16);
  const body = ac.createGain();
  body.gain.setValueAtTime(0.0001, t);
  body.gain.exponentialRampToValueAtTime(0.5, t + 0.008);
  body.gain.exponentialRampToValueAtTime(0.0001, t + 0.24);
  osc.connect(body).connect(ac.destination);
  osc.start(t);
  osc.stop(t + 0.26);

  const puff = noise(ac, 0.12);
  const low = ac.createBiquadFilter();
  low.type = "lowpass";
  low.frequency.value = 420;
  const pg = ac.createGain();
  pg.gain.setValueAtTime(0.25, t);
  pg.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
  puff.connect(low).connect(pg).connect(ac.destination);
  puff.start(t);
  puff.stop(t + 0.12);
}

/** A tiny haptic tick on phones that support it; part of the same "sound and touch" switch. */
export function tick() {
  if (!soundOn()) return;
  try {
    navigator.vibrate?.(12);
  } catch {
    // Not supported, or not allowed yet: silence is the right fallback.
  }
}
