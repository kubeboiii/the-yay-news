"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useEditionToday, useHabitLog } from "@/features/habits/api";
import { type DumpFonts, drawDump } from "./dump-canvas";
import { monthRecap, type Recap, weekRecap } from "./recap";

// Your week and your month, as numbers on the wall and as a picture to post: the weekly dump is a
// 1080×1350 corkboard of the week's clippings and stamps; the month in Yay is the same board for
// the whole month. Drawn on the device from the reader's own log; nothing is uploaded.

/** The families the page's fonts actually loaded under (next/font renames them). */
function pageFonts(probe: HTMLElement): DumpFonts {
  const family = (v: string) => {
    probe.style.fontFamily = `var(${v})`;
    return getComputedStyle(probe).fontFamily || "sans-serif";
  };
  return {
    gothic: family("--ar-gothic"),
    type: family("--ar-type"),
    hand: family("--hb-hand"),
    sans: family("--ar-franklin"),
  };
}

function Numbers({ r }: { r: Recap }) {
  return (
    <ul className="wl-nums">
      <li>
        <b>{r.papers}</b> paper{r.papers === 1 ? "" : "s"} read{r.late ? ` (${r.late} late)` : ""}
      </li>
      <li>
        <b>{r.clippings.length}</b> torn out
      </li>
      <li>
        <b>{r.puzzles}</b> puzzle{r.puzzles === 1 ? "" : "s"} solved
      </li>
      <li>
        <b>{r.stickers}</b> sticker{r.stickers === 1 ? "" : "s"} earned
      </li>
    </ul>
  );
}

function Maker({ recap, title, file }: { recap: Recap; title: string; file: string }) {
  const probe = useRef<HTMLSpanElement>(null);
  const [img, setImg] = useState<{ url: string; blob: Blob } | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(
    () => () => {
      if (img) URL.revokeObjectURL(img.url);
    },
    [img],
  );

  const make = async () => {
    if (!probe.current) return;
    await document.fonts.ready;
    const canvas = document.createElement("canvas");
    drawDump(canvas, recap, pageFonts(probe.current), title);
    canvas.toBlob((blob) => {
      if (!blob) return setMsg("Couldn't draw that. Try again?");
      setImg({ url: URL.createObjectURL(blob), blob });
      setMsg(null);
    }, "image/png");
  };

  const share = async () => {
    if (!img) return;
    const f = new File([img.blob], file, { type: "image/png" });
    try {
      if (navigator.canShare?.({ files: [f] })) {
        await navigator.share({ files: [f], title: `The Yay News · ${title}` });
      } else {
        setMsg("Your browser can't share pictures straight away, so save it and post it.");
      }
    } catch (e) {
      if ((e as Error)?.name !== "AbortError") setMsg("Couldn't share that. Try again?");
    }
  };

  return (
    <div className="wl-maker">
      <span ref={probe} className="wl-maker__probe" aria-hidden />
      {img ? (
        <>
          {/* A blob: URL of a picture drawn on the device, which next/image can't optimise. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.url}
            alt={`Your ${title.toLowerCase()}: a corkboard of the stories you kept and the papers you stamped`}
            className="wl-maker__img"
          />
          <p className="wl-maker__row">
            <button type="button" className="wl-btn" onClick={share}>
              Share it
            </button>
            <a href={img.url} download={file} className="wl-btn wl-btn--ink">
              Save the picture
            </a>
          </p>
        </>
      ) : (
        <button type="button" className="wl-btn" onClick={make}>
          Make my {title.toLowerCase()}
        </button>
      )}
      {msg ? (
        <p className="wl-move__msg" role="status">
          {msg}
        </p>
      ) : null}
    </div>
  );
}

export function Dumps() {
  const events = useHabitLog();
  const today = useEditionToday();
  const week = useMemo(() => (today ? weekRecap(events, today) : null), [events, today]);
  const month = useMemo(() => (today ? monthRecap(events, today) : null), [events, today]);
  if (!week || !month) return null;
  return (
    <div className="wl-dumps">
      <div className="wl-card wl-card--dump">
        <span className="wl-label wl-label--in">Your weekly dump · {week.label}</span>
        <Numbers r={week} />
        <Maker recap={week} title="Weekly dump" file={`yay-weekly-dump-${week.from}.png`} />
      </div>
      <div className="wl-card wl-card--month">
        <span className="wl-label wl-label--in">Your month in Yay · {month.label}</span>
        <Numbers r={month} />
        <p className="wl-card__hint">Best streak so far: {month.best}</p>
        <Maker
          recap={month}
          title="Month in Yay"
          file={`yay-month-${month.from.slice(0, 7)}.png`}
        />
      </div>
    </div>
  );
}
