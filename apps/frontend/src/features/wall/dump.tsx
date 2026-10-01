"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useEditionToday, useHabitLog } from "@/features/habits/api";
import { Heading } from "@/features/riot";
import { GoAction } from "@/features/site/go-action";
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
    gothic: family("--rt-ff-head"),
    type: family("--rt-ff-meta"),
    hand: family("--rt-ff-hand"),
    sans: family("--rt-ff-read"),
  };
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
    <div className="ys-maker">
      <span ref={probe} className="ys-maker__probe" aria-hidden />
      {img ? (
        <>
          {/* A blob: URL of a picture drawn on the device, which next/image can't optimise. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.url}
            alt={`Your ${title.toLowerCase()}: a corkboard of the stories you kept and the papers you stamped`}
            className="ys-maker__img"
          />
          <p className="ys-maker__row">
            <GoAction onClick={share}>Share it</GoAction>
            <a href={img.url} download={file} className="rt-go rt-go--quiet">
              <span className="rt-go__label">Save the picture</span>
            </a>
          </p>
        </>
      ) : (
        <GoAction tone="paper" onClick={make} sub="a picture to post, made on this phone">
          Post the dump
        </GoAction>
      )}
      {msg ? (
        <p className="ys-note rt-meta" role="status">
          {msg}
        </p>
      ) : null}
    </div>
  );
}

export function Dumps() {
  const events = useHabitLog();
  const today = useEditionToday();
  const [month, setMonth] = useState(false);
  const recap = useMemo(
    () => (today ? (month ? monthRecap(events, today) : weekRecap(events, today)) : null),
    [events, today, month],
  );
  if (!recap) return null;
  const frames = [
    { n: recap.papers, l: recap.papers === 1 ? "paper" : "papers" },
    { n: recap.puzzles, l: recap.puzzles === 1 ? "puzzle" : "puzzles" },
    { n: recap.stickers, l: recap.stickers === 1 ? "sticker" : "stickers" },
    { n: recap.best, l: "best run" },
    { n: recap.clippings.length, l: "kept" },
  ];
  const title = month ? "Month in Yay" : "Weekly dump";
  return (
    <section className="sb-film" aria-labelledby="film-h">
      <div className="sb-film__top">
        <Heading id="film-h" className="sb-h">
          {month ? "Month in yay" : "Photo dump"}
        </Heading>
        <div className="sb-film__switch" role="group" aria-label="Photo dump period">
          <button type="button" aria-pressed={!month} onClick={() => setMonth(false)}>
            Week
          </button>
          <button type="button" aria-pressed={month} onClick={() => setMonth(true)}>
            Month
          </button>
        </div>
        <p className="sb-film__when">{recap.label}</p>
      </div>
      <ol className="sb-film__strip">
        {frames.map((f, i) => (
          <li key={f.l}>
            <span className="sb-film__frame">
              <span className="sb-film__n">{f.n}</span>
            </span>
            <span className="sb-film__l">
              {String(i + 12)}A · {f.l}
            </span>
          </li>
        ))}
      </ol>
      <Maker
        key={title}
        recap={recap}
        title={title}
        file={
          month ? `yay-month-${recap.from.slice(0, 7)}.png` : `yay-weekly-dump-${recap.from}.png`
        }
      />
    </section>
  );
}
