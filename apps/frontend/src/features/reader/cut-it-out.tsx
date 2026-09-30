"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { handwriting } from "@/features/habits/fonts";
import { play } from "@/features/sound";
import "./cut-it-out.css";

// "Cut it out": the story torn out of the paper as an image, for Stories (1080×1920) or a square
// post (1080×1080), drawn by the clipping route (app/clip). On a phone that can hand files to its
// share sheet it opens the sheet with the image; anywhere else it downloads the file. The image
// carries the story's address and a QR code, so whoever sees it can find the rest.

type Format = "story" | "square";

const FORMATS: { id: Format; label: string; size: string }[] = [
  { id: "story", label: "Stories", size: "1080×1920" },
  { id: "square", label: "Square", size: "1080×1080" },
];

let filesShareable: boolean | undefined;
function canShareFiles(): boolean {
  if (filesShareable === undefined) {
    try {
      const probe = new File([new Uint8Array(1)], "probe.png", { type: "image/png" });
      filesShareable =
        typeof navigator.share === "function" && !!navigator.canShare?.({ files: [probe] });
    } catch {
      filesShareable = false;
    }
  }
  return filesShareable;
}
const noSubscribe = () => () => {};

/** `?now=` from the page (previews outside production), so the clipping renders the same paper. */
const previewNow = () => {
  const now = new URLSearchParams(window.location.search).get("now");
  return now ? `&now=${encodeURIComponent(now)}` : "";
};

export function CutItOut({
  issue,
  slug,
  headline,
  tz,
}: {
  issue: number;
  slug: string;
  headline: string;
  /** The reader's timezone, so the clipping renders once the story is out where they are. */
  tz?: string;
}) {
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<Format>("story");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const shares = useSyncExternalStore(noSubscribe, canShareFiles, () => false);
  const files = useRef(new Map<string, Promise<File>>());
  const panel = useId();

  const src = (f: Format) =>
    `/clip/${f}?issue=${issue}&story=${encodeURIComponent(slug)}${tz ? `&tz=${encodeURIComponent(tz)}` : ""}${typeof window === "undefined" ? "" : previewNow()}`;
  const name = `the-yay-news-${issue}-${slug}-${format === "story" ? "stories" : "square"}.png`;

  const file = (f: Format) => {
    const url = src(f);
    let hit = files.current.get(url);
    if (!hit) {
      hit = fetch(url)
        .then((r) => {
          if (!r.ok) throw new Error(`clipping ${r.status}`);
          return r.blob();
        })
        .then(
          (b) =>
            new File(
              [b],
              `the-yay-news-${issue}-${slug}-${f === "story" ? "stories" : "square"}.png`,
              {
                type: "image/png",
              },
            ),
        );
      hit.catch(() => files.current.delete(url));
      files.current.set(url, hit);
    }
    return hit;
  };

  // Fetch ahead once the panel is open, so the share sheet opens straight from the tap (Safari
  // refuses a share that waits too long after the gesture).
  useEffect(() => {
    if (open) file(format).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, format]);

  async function cut() {
    setBusy(true);
    setStatus("");
    play("tear");
    try {
      const f = await file(format);
      if (shares) {
        try {
          await navigator.share({ files: [f], title: headline });
          setStatus("");
          return;
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") return;
          // Fall through to a download.
        }
      }
      const url = URL.createObjectURL(f);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
      setStatus("Saved to your downloads.");
    } catch {
      setStatus("The scissors slipped. Try again in a moment.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={`cut ${handwriting.className}`}>
      <button
        type="button"
        className="cut__open"
        aria-expanded={open}
        aria-controls={panel}
        onClick={() => {
          setOpen((o) => !o);
          play("fold");
        }}
      >
        <svg viewBox="0 0 24 24" className="cut__scissors" aria-hidden>
          <circle cx="6" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
          <path d="M8.3 7.9L20 16.5M8.3 16.1L20 7.5" />
        </svg>
        <span className="cut__label">Cut it out</span>
      </button>
      {open ? (
        <div id={panel} className="cut__panel" role="group" aria-label="Cut this story out">
          <div className="cut__formats" role="radiogroup" aria-label="Size">
            {FORMATS.map((f) => (
              <label key={f.id} className="cut__format">
                <input
                  type="radio"
                  name={`${panel}-fmt`}
                  value={f.id}
                  checked={format === f.id}
                  onChange={() => setFormat(f.id)}
                />
                <span>
                  {f.label} <small>{f.size}</small>
                </span>
              </label>
            ))}
          </div>
          {/* The clipping itself, small: what you'll get. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={format}
            src={src(format)}
            alt={`The clipping: ${headline}`}
            className={`cut__preview cut__preview--${format}`}
          />
          <p className="cut__actions">
            <button type="button" className="cut__go" onClick={cut} disabled={busy}>
              {busy ? "Cutting…" : shares ? "Share the clipping" : "Download the clipping"}
            </button>
          </p>
          <p role="status" aria-live="polite" className="cut__status">
            {status}
          </p>
        </div>
      ) : null}
    </div>
  );
}
