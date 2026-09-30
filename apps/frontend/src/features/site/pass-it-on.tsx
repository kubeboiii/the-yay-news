"use client";

import { useSearchParams } from "next/navigation";
import { useId, useState } from "react";
import "./pass-it-on.css";

// Pass it on: send a friend a story with a note scribbled on it ("page 4 lol, the bees"). The note
// travels in the link itself (?note=), so there's no account and nothing stored anywhere; whoever
// opens the link sees it stuck to the top of the story.

export const NOTE_MAX = 140;

export function PassItOn({ path, headline }: { path: string; headline: string }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const send = async () => {
    const url = new URL(path, window.location.origin);
    const text = note.trim().slice(0, NOTE_MAX);
    if (text) url.searchParams.set("note", text);
    const link = url.toString();
    try {
      if (navigator.share) {
        await navigator.share({ title: headline, text: text || headline, url: link });
        setMsg("Passed on.");
      } else {
        await navigator.clipboard.writeText(link);
        setMsg("Link copied. Your note is stuck on it.");
      }
      setOpen(false);
      setNote("");
    } catch (e) {
      if ((e as Error)?.name === "AbortError") return;
      setMsg("Couldn't share that. Try again?");
    }
  };

  return (
    <div className="ys-pass">
      <button
        type="button"
        className="ys-pass__open"
        aria-expanded={open}
        aria-controls={`${id}-note`}
        onClick={() => setOpen((o) => !o)}
      >
        <svg viewBox="0 0 24 24" aria-hidden>
          <path d="M22 2 11 13" />
          <path d="m22 2-7 20-4-9-9-4 20-7z" />
        </svg>
        Pass it on
      </button>
      {open ? (
        <div id={`${id}-note`} className="ys-pass__note">
          <label htmlFor={`${id}-text`} className="ys-pass__label">
            Scribble a note for a friend (or don&rsquo;t)
          </label>
          <textarea
            id={`${id}-text`}
            rows={2}
            maxLength={NOTE_MAX}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="you have to read this one"
            className="ys-pass__text"
          />
          <button type="button" className="ys-pass__send" onClick={send}>
            Stick it on and send
          </button>
        </div>
      ) : null}
      {msg ? (
        <p className="ys-pass__msg" role="status">
          {msg}
        </p>
      ) : null}
    </div>
  );
}

/** The note a friend stuck on this story, if the link came with one. */
export function PassedNote() {
  const params = useSearchParams();
  const [gone, setGone] = useState(false);
  const note = params.get("note")?.trim().slice(0, NOTE_MAX);
  if (!note || gone) return null;
  return (
    <aside className="ys-passed" aria-label="A note from whoever sent you this">
      <span className="ys-passed__tape" aria-hidden />
      <p className="ys-passed__k">Someone passed this on:</p>
      <p className="ys-passed__note">{note}</p>
      <button
        type="button"
        className="ys-passed__x"
        aria-label="Peel the note off"
        onClick={() => setGone(true)}
      >
        <svg viewBox="0 0 24 24" aria-hidden>
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </aside>
  );
}
