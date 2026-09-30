"use client";

import { useState } from "react";
import { exportLog, importLog } from "@/features/habits/api";
import { sanitize } from "@/features/habits/core";

// Everything on the wall lives on this device until accounts arrive, so a new phone would start
// from nothing. This packs the reader's whole log into a code to copy across, and merges a pasted
// code into this device's log (a union of events, so nothing here is lost either way).

const PREFIX = "YAY1:";

function encode(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function decode(code: string): string {
  const bin = atob(code);
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

export function MoveMyWall() {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const copy = async () => {
    const doc = exportLog();
    const packed = PREFIX + encode(JSON.stringify(doc.events));
    try {
      await navigator.clipboard.writeText(packed);
      setMsg("Copied your wall. Paste it into Your Wall on the new phone.");
    } catch {
      setCode(packed);
      setMsg("Couldn't copy automatically, so the code is in the box: copy it from there.");
    }
  };

  const bring = () => {
    const raw = code.trim();
    try {
      if (!raw.startsWith(PREFIX)) throw new Error("not ours");
      const events = sanitize(JSON.parse(decode(raw.slice(PREFIX.length))));
      if (events.length === 0) throw new Error("empty");
      importLog({ v: 1, device: "moved", events });
      setCode("");
      setMsg(`Moved in: ${events.length} things from your other phone are on this wall now.`);
    } catch {
      setMsg("That code didn't work. Copy it again from your old phone and paste the whole thing.");
    }
  };

  return (
    <div className="wl-card wl-move">
      <p className="wl-card__line">
        Your stamps, clippings and cards live on this device. Move them to another one:
      </p>
      <button type="button" className="wl-btn" onClick={copy}>
        Copy my wall
      </button>
      <label htmlFor="wl-code" className="wl-move__label">
        Or paste a code from your old phone
      </label>
      <textarea
        id="wl-code"
        className="wl-move__code"
        rows={2}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="YAY1:…"
        spellCheck={false}
      />
      <button type="button" className="wl-btn wl-btn--ink" onClick={bring} disabled={!code.trim()}>
        Bring it here
      </button>
      {msg ? (
        <p className="wl-move__msg" role="status">
          {msg}
        </p>
      ) : null}
    </div>
  );
}
