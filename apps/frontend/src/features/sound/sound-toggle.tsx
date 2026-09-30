"use client";

import { useSyncExternalStore } from "react";
import { handwriting } from "@/features/habits/fonts";
import { play, setSound, soundOn, subscribeSound } from "./index";
import "./sound-toggle.css";

/**
 * The paper-sounds switch: a little cut-out card with a pencilled speaker. Off, the sound waves
 * are scribbled out. For the page bar (or anywhere); it remembers the choice on the device.
 */
export function SoundToggle({ className }: { className?: string }) {
  const on = useSyncExternalStore(subscribeSound, soundOn, () => false);
  return (
    <button
      type="button"
      className={`snd ${handwriting.className} ${on ? "is-on" : ""} ${className ?? ""}`}
      aria-pressed={on}
      aria-label="Paper sounds"
      onClick={() => {
        setSound(!on);
        if (!on) play("tick");
      }}
    >
      <svg viewBox="0 0 48 32" className="snd__art" aria-hidden>
        <path
          className="snd__line"
          d="M5 12.5 C6.5 12 9 12.2 11.2 12.1 L19 5.6 C19.6 5 20.4 5.3 20.3 6.4 C20 13 20.1 19.5 20.5 26 C20.6 27 19.7 27.3 19.1 26.7 L11.3 20.3 C9 20.2 6.8 20.4 5.1 20 C4.6 17.5 4.7 15 5 12.5 Z"
        />
        <path className="snd__wave snd__wave--1" d="M25.5 11.5 C27.8 14 27.9 18 25.6 20.6" />
        <path className="snd__wave snd__wave--2" d="M29.8 8 C34 12.6 34.2 19.6 30 24.4" />
        <path className="snd__wave snd__wave--3" d="M34.4 4.6 C40.4 11.4 40.6 21 34.7 27.8" />
        <path className="snd__scribble" d="M25 9 L39 25 M24.5 24.5 C29 19 34 13 39.5 7.5" />
      </svg>
      <span className="snd__word">{on ? "sound on" : "sound off"}</span>
    </button>
  );
}
