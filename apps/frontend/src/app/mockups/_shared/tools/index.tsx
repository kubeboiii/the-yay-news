"use client";

// Reader tools: draw on the paper, cut out stories, pin them to the pinboard.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { countClippings, onBoardChange } from "./board-store";
import { packStroke, type Stroke, type Tool } from "./ink";
import { MarkerLayer } from "./marker";
import { ScissorsLayer } from "./scissors";
import "./tools.css";

type Mode = "off" | "marker" | "scissors";

const WRAPS = ".print-sheet-wrap, .yn-sheet-wrap";

const TOOLS: { id: Tool; label: string }[] = [
  { id: "pencil", label: "Blue pencil" },
  { id: "felt", label: "Red felt-tip" },
  { id: "highlighter", label: "Highlighter" },
];

/** The sheet's wrap on the current page, found again whenever the page changes. */
function useWrap(pathname: string) {
  const [wrap, setWrap] = useState<HTMLElement | null>(null);
  useEffect(() => {
    let raf = 0;
    let tries = 0;
    const find = () => {
      const el = document.querySelector<HTMLElement>(WRAPS);
      if (el || tries++ > 120) setWrap(el);
      else raf = requestAnimationFrame(find);
    };
    find();
    return () => cancelAnimationFrame(raf);
  }, [pathname]);
  return wrap;
}

function useSize(el: HTMLElement | null) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    if (!el) return;
    const read = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [el]);
  return size;
}

const load = (key: string): Stroke[] => {
  try {
    const raw = localStorage.getItem(key);
    const v = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(v) ? (v as Stroke[]) : [];
  } catch {
    return [];
  }
};

const save = (key: string, strokes: Stroke[]) => {
  try {
    if (strokes.length) localStorage.setItem(key, JSON.stringify(strokes));
    else localStorage.removeItem(key);
  } catch {
    // Storage full or blocked: the drawing stays for this visit.
  }
};

/** A tiny sample of each nib's mark, for its button. */
function Swatch({ tool }: { tool: Tool }) {
  const stroke = { pencil: "#3f63b8", felt: "#d42a2f", highlighter: "#f7e23a" }[tool];
  const width = { pencil: 1.3, felt: 2.6, highlighter: 6 }[tool];
  return (
    <svg viewBox="0 0 24 10" width="22" height="9" aria-hidden className="shrink-0">
      <path
        d="M2 7c4-5 6 1 10-2s6-3 10-1"
        fill="none"
        stroke={stroke}
        strokeWidth={width}
        strokeLinecap={tool === "highlighter" ? "butt" : "round"}
        opacity={tool === "pencil" ? 0.9 : 1}
      />
    </svg>
  );
}

/** Toolbar controls plus the drawing / cutting overlays. */
export function ReaderTools({ version }: { version: string }) {
  const pathname = usePathname();
  const wrap = useWrap(pathname);
  const size = useSize(wrap);
  const [mode, setMode] = useState<Mode>("off");
  const [tool, setTool] = useState<Tool>("pencil");
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [count, setCount] = useState<number | null>(null);
  const [slip, setSlip] = useState<{ text: string; n: number } | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [mounted, setMounted] = useState(false);

  // A drawing belongs to its page and to its layout: the phone reflows the page into a column, so
  // lines drawn over the broadsheet would land on the wrong words there.
  const layout = size.w > 760 ? "wide" : "narrow";
  const key = `yn-ink:${pathname}:${layout}`;
  const loadedKey = useRef<string | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!size.w) return;
    setStrokes(load(key));
    loadedKey.current = key;
  }, [key, size.w]);

  const commit = useCallback(
    (next: Stroke[]) => {
      setStrokes(next);
      if (loadedKey.current === key) save(key, next);
    },
    [key],
  );

  // ?tool=marker or ?tool=scissors opens a page with a tool already in hand, for previews.
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("tool");
    if (t === "marker" || t === "scissors") setMode(t);
  }, []);

  useEffect(() => {
    const refresh = () =>
      countClippings()
        .then(setCount)
        .catch(() => setCount(null));
    refresh();
    return onBoardChange(refresh);
  }, []);

  // Remember which paper the reader came from, so the board can send them back to it.
  useEffect(() => {
    try {
      localStorage.setItem("yn-board-return", pathname);
    } catch {
      // Not important enough to mention.
    }
  }, [pathname]);

  useEffect(() => {
    const root = document.documentElement;
    if (mode === "off") delete root.dataset.readerTool;
    else root.dataset.readerTool = mode === "marker" ? `marker-${tool}` : "scissors";
    return () => {
      delete root.dataset.readerTool;
    };
  }, [mode, tool]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMode("off");
      if (mode === "marker" && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        commit(strokes.slice(0, -1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [commit, mode, strokes]);

  // Turning the page puts the tool down.
  const lastPath = useRef(pathname);
  useEffect(() => {
    if (lastPath.current !== pathname) setMode("off");
    lastPath.current = pathname;
  }, [pathname]);

  useEffect(() => {
    if (!confirmClear) return;
    const t = setTimeout(() => setConfirmClear(false), 3000);
    return () => clearTimeout(t);
  }, [confirmClear]);

  useEffect(() => {
    if (!slip) return;
    const t = setTimeout(() => setSlip(null), 3400);
    return () => clearTimeout(t);
  }, [slip]);

  const showSlip = useCallback((text: string) => setSlip({ text, n: Date.now() }), []);
  const bump = useCallback(() => {
    countClippings()
      .then(setCount)
      .catch(() => undefined);
  }, []);

  const toggle = (m: Mode) => setMode((cur) => (cur === m ? "off" : m));
  const pill = (on: boolean) => `rounded-full px-2.5 py-0.5 ${on ? "bg-white text-black" : "hover:bg-white/15"}`;

  return (
    <>
      <span className="flex items-center gap-0.5 rounded-full bg-white/15 p-0.5" role="group" aria-label="Reader tools">
        <button type="button" aria-pressed={mode === "marker"} onClick={() => toggle("marker")} className={pill(mode === "marker")}>
          Marker
        </button>
        <button
          type="button"
          aria-pressed={mode === "scissors"}
          onClick={() => toggle("scissors")}
          className={pill(mode === "scissors")}
        >
          Scissors
        </button>
        <Link href="/mockups/pinboard" data-rt-board className={`${pill(false)} rt-board-link`} aria-label={`Your board, ${count ?? 0} clippings`}>
          Board{count !== null ? ` (${count})` : ""}
        </Link>
      </span>

      {mode !== "off" && (
        <div className="rt-tray" role="toolbar" aria-label={mode === "marker" ? "Marker" : "Scissors"}>
          {mode === "marker" ? (
            <>
              {TOOLS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={tool === t.id}
                  onClick={() => setTool(t.id)}
                  className={`flex items-center gap-1.5 ${pill(tool === t.id)}`}
                >
                  <Swatch tool={t.id} />
                  {t.label}
                </button>
              ))}
              <span className="mx-1 h-4 w-px bg-white/25" aria-hidden />
              <button type="button" onClick={() => commit(strokes.slice(0, -1))} disabled={!strokes.length} className={`${pill(false)} disabled:opacity-40`}>
                Undo
              </button>
              <button
                type="button"
                disabled={!strokes.length}
                onClick={() => {
                  if (!confirmClear) return setConfirmClear(true);
                  setConfirmClear(false);
                  commit([]);
                }}
                className={`${pill(confirmClear)} disabled:opacity-40`}
              >
                {confirmClear ? "Clear page? Yes" : "Clear page"}
              </button>
            </>
          ) : (
            <span className="px-2 py-0.5 text-white/80">
              <span className="rt-hover-only">Click a story to cut it out</span>
              <span className="rt-touch-only">Tap a story, tap again to cut</span>
            </span>
          )}
          <button type="button" onClick={() => setMode("off")} className={pill(false)} aria-label="Put the tool down (Esc)">
            Done
          </button>
        </div>
      )}

      {wrap && (
        <MarkerLayer
          wrap={wrap}
          size={size}
          active={mode === "marker"}
          tool={tool}
          strokes={strokes}
          onStroke={(s) => commit([...strokes, packStroke(s)])}
        />
      )}
      {wrap && <ScissorsLayer wrap={wrap} active={mode === "scissors"} version={version} onCut={bump} onSlip={showSlip} />}

      {mounted &&
        slip &&
        createPortal(
          <p key={slip.n} className="rt-slip" role="status">
            <span className="rt-slip__tape" aria-hidden />
            {slip.text}
          </p>,
          document.body,
        )}
    </>
  );
}
