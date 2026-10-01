"use client";

import { useState } from "react";
import { exportLog, importLog } from "@/features/habits/api";
import { sanitize } from "@/features/habits/core";
import { Heading, Scrap, Sticker } from "@/features/riot";
import { GoAction } from "@/features/site/go-action";

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
      setMsg("Packed and copied. Paste it into Your Wall on the new phone.");
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
    <Scrap
      seed="smuggle"
      as="aside"
      ground="white"
      edge="zigzag"
      sides={["top"]}
      className="sb-smuggle"
    >
      <Sticker seed="smug" ground="a" pinned className="sb-smuggle__sticker">
        new phone?
      </Sticker>
      <Heading as="h2" className="sb-h">
        Smuggle your wall out
      </Heading>
      <p>
        Everything on this wall lives on this device. Pack it into one code and paste it on the new
        phone. No account.
      </p>
      <div className="sb-smuggle__row">
        <GoAction onClick={copy}>Pack it</GoAction>
      </div>
      <label htmlFor="wl-code" className="ys-smuggle__label rt-meta">
        Got a code from your old phone? Paste it here
      </label>
      <textarea
        id="wl-code"
        className="ys-smuggle__code"
        rows={2}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="YAY1:…"
        spellCheck={false}
      />
      <div className="sb-smuggle__row">
        <GoAction tone="quiet" onClick={bring} disabled={!code.trim()}>
          Unpack it here
        </GoAction>
      </div>
      {msg ? (
        <p className="ys-note rt-meta" role="status">
          {msg}
        </p>
      ) : null}
    </Scrap>
  );
}
