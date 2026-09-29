"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { seeded } from "@/app/mockups/_shared/edition-seed";
import { Mark } from "@/features/print/mark";
import {
  addClipping,
  type Clipping,
  listClippings,
  onBoardChange,
  removeClipping,
  seedOf,
  updateClipping,
} from "@/app/mockups/_shared/tools/board-store";
import { useStoredChoice } from "@/app/mockups/_shared/use-stored-choice";
import {
  edgeFor,
  edgeStyle,
  printClipping,
  tapesFor,
} from "@/app/mockups/_shared/tools/print-clipping";

const VERSIONS: Record<string, string> = {
  v1: "Fluoro Broadsheet",
  v3: "Tabloid Brights",
  v4: "Mini Zine",
  v5: "Midi Magazine",
};

const PAGES: Record<string, string> = {
  "": "Front page",
  "/screen-and-sound": "Screen & Sound",
  "/gaming": "Gaming",
  "/back": "Back page",
};

/** "Mini Zine, Gaming" — where a clipping was cut from, in words. */
function sourceOf(c: Clipping) {
  const rest = c.page.replace(/^\/mockups\/v\d/, "");
  return `${VERSIONS[c.version] ?? c.version}, ${PAGES[rest] ?? "a page"}`;
}

const dateOf = (t: number) =>
  new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

type Placed = Clipping & { x: number; y: number; rot: number; z: number };

/** Display size of a clipping on a board of width W: a newspaper story shrinks to fridge scale. */
function sizeOn(c: Clipping, W: number, phone: boolean) {
  const fw = phone
    ? Math.max(0.52, Math.min(0.86, c.w / 400))
    : Math.max(0.14, Math.min(0.36, c.w / 1500));
  const w = fw * W;
  return { fw, w, h: (w * c.h) / Math.max(1, c.w) };
}

/**
 * Finds somewhere to hang each clipping that has not been placed yet: wherever along the board the
 * pile is lowest across its width, tucked a little under what is already up, as a real board fills.
 */
function place(
  all: Clipping[],
  phone: boolean,
  top0: number,
): { placed: Placed[]; fresh: Placed[] } {
  const placed: Placed[] = [];
  const fresh: Placed[] = [];
  const bottomUnder = (x: number, fw: number) =>
    placed.reduce((b, p) => {
      const s = sizeOn(p, 1, phone);
      return p.x < x + fw && p.x + s.fw > x ? Math.max(b, p.y + s.h) : b;
    }, top0);
  let z = all.reduce((m, c) => Math.max(m, c.z ?? 0), 0);
  for (const c of all) {
    const sx = phone ? c.nx : c.x;
    const sy = phone ? c.ny : c.y;
    if (sx !== undefined && sy !== undefined) {
      placed.push({ ...c, x: sx, y: sy, rot: c.rot ?? 0, z: c.z ?? 0 });
      continue;
    }
    const r = seeded(seedOf(c.id));
    const { fw, h } = sizeOn(c, 1, phone);
    let best = { x: 0.04, b: Infinity };
    for (let x = 0.03; x + fw <= 0.98; x += 0.04) {
      const b = bottomUnder(x, fw) + r() * 0.006;
      if (b < best.b) best = { x, b };
    }
    const tuck = Math.min(0.02, h * 0.12);
    const p: Placed = {
      ...c,
      x: best.x + (r() - 0.5) * 0.02,
      y: best.b - tuck + 0.012 + r() * 0.02,
      rot: c.rot ?? (r() - 0.5) * 7,
      z: ++z,
    };
    placed.push(p);
    fresh.push(p);
  }
  return { placed, fresh };
}

const isPaper = (v: string | null): v is "newsprint" | "white" =>
  v === "white" || v === "newsprint";

function usePaper() {
  return useStoredChoice("yn-paper", "paper", isPaper, "newsprint")[0];
}

/** The reader's clippings, taped up on a wall of newsprint. */
export function Pinboard() {
  const [items, setItems] = useState<Placed[] | null>(null);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [W, setW] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [slip, setSlip] = useState<{ text: string; n: number; undo?: Clipping } | null>(null);
  const [back, setBack] = useState("/mockups");
  const [dragId, setDragId] = useState<string | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: string; dx: number; dy: number; moved: boolean } | null>(null);
  const paper = usePaper();
  const phone = W > 0 && W < 640;
  // Where a clipping hangs, in the fields for this board's layout.
  const at = useCallback((x: number, y: number) => (phone ? { nx: x, ny: y } : { x, y }), [phone]);

  const refresh = useCallback(async () => {
    if (!W) return;
    try {
      const all = await listClippings();
      // Clear of the bar across the top of the screen.
      const { placed, fresh } = place(all, phone, (phone ? 130 : 90) / W);
      for (const p of fresh) void updateClipping(p.id, { ...at(p.x, p.y), rot: p.rot, z: p.z });
      setItems(placed);
    } catch {
      setItems([]);
    }
  }, [W, phone, at]);

  // Clippings live in IndexedDB, so the board loads them after mount.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async load from IndexedDB
    void refresh();
  }, [refresh]);

  useEffect(() => {
    try {
      const r = localStorage.getItem("yn-board-return");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of browser storage
      if (r?.startsWith("/mockups/")) setBack(r);
    } catch {
      // The list of mockups is a fine place to go back to.
    }
  }, []);

  useEffect(() => onBoardChange(() => void refresh()), [refresh]);

  // One object URL per clipping image, released when the clipping goes.
  useEffect(() => {
    if (!items) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- object URLs are browser resources
    setUrls((prev) => {
      const next: Record<string, string> = {};
      for (const c of items) next[c.id] = prev[c.id] ?? URL.createObjectURL(c.image);
      for (const [id, u] of Object.entries(prev)) if (!next[id]) URL.revokeObjectURL(u);
      return next;
    });
  }, [items]);

  useLayoutEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    const read = () => setW(el.clientWidth);
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!slip) return;
    const t = setTimeout(() => setSlip(null), slip.undo ? 6000 : 3400);
    return () => clearTimeout(t);
  }, [slip]);

  // Each message gets a fresh key, so saying the same thing twice still replays the slip.
  const said = useRef(0);
  const say = (text: string, undo?: Clipping) => setSlip({ text, n: ++said.current, undo });

  const layout = useMemo(() => {
    if (!items || !W) return [];
    return items.map((c) => {
      const s = sizeOn(c, W, phone);
      const x = Math.min(c.x, 1 - s.fw - 0.01);
      return { c, left: Math.max(0.01, x) * W, top: c.y * W, ...s };
    });
  }, [items, W, phone]);

  const height = layout.reduce((m, l) => Math.max(m, l.top + l.h), 0) + 160;

  const lift = (id: string) =>
    setItems((cur) => {
      if (!cur) return cur;
      const top = cur.reduce((m, c) => Math.max(m, c.z), 0);
      const me = cur.find((c) => c.id === id);
      if (!me || me.z === top) return cur;
      void updateClipping(id, { z: top + 1 });
      return cur.map((c) => (c.id === id ? { ...c, z: top + 1 } : c));
    });

  const onDown = (e: React.PointerEvent<HTMLDivElement>, id: string, left: number, top: number) => {
    if ((e.target as HTMLElement).closest("button, a")) return;
    // On a phone a finger on a clipping is usually a scroll: pick it up with a tap first.
    if (e.pointerType === "touch" && selected !== id) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const b = boardRef.current?.getBoundingClientRect();
    if (!b) return;
    drag.current = { id, dx: e.clientX - b.left - left, dy: e.clientY - b.top - top, moved: false };
    setSelected(id);
    setDragId(id);
    lift(id);
  };

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const b = boardRef.current?.getBoundingClientRect();
    if (!d || !b || !W) return;
    d.moved = true;
    const x = (e.clientX - b.left - d.dx) / W;
    const y = (e.clientY - b.top - d.dy) / W;
    setItems(
      (cur) =>
        cur?.map((c) =>
          c.id === d.id ? { ...c, x: Math.max(-0.05, Math.min(0.98, x)), y: Math.max(0.04, y) } : c,
        ) ?? cur,
    );
  };

  const onUp = () => {
    const d = drag.current;
    drag.current = null;
    setDragId(null);
    if (!d?.moved) return;
    const me = items?.find((c) => c.id === d.id);
    if (me) void updateClipping(me.id, at(me.x, me.y));
  };

  const save = async (c: Clipping) => {
    try {
      const blob = await printClipping(c, paper);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `yay-news-${
        c.headline
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .slice(0, 40) || "clipping"
      }.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    } catch {
      say("That one wouldn't print. Try again?");
    }
  };

  const share = async (c: Clipping) => {
    const link = `${window.location.origin}${c.page}`;
    try {
      const blob = await printClipping(c, paper);
      const file = new File([blob], "yay-news-clipping.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "The Yay News",
          text: c.headline || "Cut from The Yay News",
        });
        return;
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
    }
    try {
      await navigator.clipboard.writeText(link);
      say("Link copied — paste it anywhere");
    } catch {
      say(link);
    }
  };

  const takeDown = async (c: Placed) => {
    setItems((cur) => cur?.filter((x) => x.id !== c.id) ?? cur);
    setSelected(null);
    await removeClipping(c.id);
    say("Taken down.", c);
  };

  const putBack = async (c: Clipping) => {
    setSlip(null);
    await addClipping(c);
  };

  return (
    <div
      className="pb-room"
      data-paper={paper}
      onPointerDown={(e) => e.target === e.currentTarget && setSelected(null)}
    >
      <nav
        aria-label="Board"
        className="pb-bar fixed inset-x-0 top-3 z-50 mx-auto flex w-fit max-w-[calc(100%-1.5rem)] flex-wrap items-center justify-center gap-1 rounded-full bg-black/85 px-2 py-1.5 font-sans text-xs text-white shadow-lg backdrop-blur"
      >
        <Link href={back} className="rounded-full px-3 py-1 hover:bg-white/15">
          ← Back to the paper
        </Link>
        <span className="px-2 font-semibold">Your board</span>
        {items && items.length > 0 && (
          <span className="px-2 text-white/70">
            {items.length} clipping{items.length === 1 ? "" : "s"}
          </span>
        )}
        <Link href="/mockups" className="rounded-full px-3 py-1 hover:bg-white/15">
          All mockups
        </Link>
      </nav>

      <div
        ref={boardRef}
        className="pb-wall"
        style={{ height: items && items.length ? Math.max(height, 640) : undefined }}
        onPointerDown={(e) => e.target === e.currentTarget && setSelected(null)}
      >
        {items && items.length === 0 && <EmptyNote back={back} />}

        {layout.map(({ c, left, top, w, h }) => {
          const url = urls[c.id];
          const edge = edgeFor(c);
          const scale = w / Math.max(1, c.w);
          const isSel = selected === c.id;
          return (
            <div
              key={c.id}
              className="pb-clip"
              data-selected={isSel || undefined}
              data-dragging={dragId === c.id || undefined}
              style={{ left, top, width: w, zIndex: c.z, rotate: `${c.rot}deg` }}
              onPointerDown={(e) => onDown(e, c.id, left, top)}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
              onClick={() => setSelected(c.id)}
            >
              <div className="pb-piece">
                <div
                  className="pb-paper"
                  style={{ height: h, backgroundColor: c.paper, ...edgeStyle(edge, scale) }}
                >
                  {/* A blob: URL from IndexedDB, which next/image cannot optimise. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {url && <img src={url} alt={c.headline || "A clipping"} draggable={false} />}
                  <span className="pb-grain" aria-hidden />
                </div>
                {tapesFor(c).map((t, i) => {
                  const tw = t.w * w;
                  return (
                    <span
                      key={i}
                      className="pb-tape"
                      aria-hidden
                      style={{
                        left: t.x * w - tw / 2,
                        top: t.y * h - tw * 0.13,
                        width: tw,
                        height: tw * 0.27,
                        rotate: `${t.angle}deg`,
                      }}
                    />
                  );
                })}
              </div>
              <div className="pb-tag" style={{ rotate: `${-c.rot * 0.6}deg` }}>
                <span className="pb-tag__from">
                  {sourceOf(c)} · {dateOf(c.createdAt)}
                </span>
                <span className="pb-tag__acts">
                  <button type="button" onClick={() => void save(c)}>
                    Save image
                  </button>
                  <button type="button" onClick={() => void share(c)}>
                    Share
                  </button>
                  <Link href={c.page}>Read it</Link>
                  <button
                    type="button"
                    onClick={() => void takeDown(c)}
                    aria-label={`Take down ${c.headline}`}
                  >
                    Take down
                  </button>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {slip && (
        <p key={slip.n} className="pb-slip" role="status">
          <span className="pb-slip__tape" aria-hidden />
          {slip.text}
          {slip.undo && (
            <button type="button" onClick={() => slip.undo && void putBack(slip.undo)}>
              Put it back
            </button>
          )}
        </p>
      )}
    </div>
  );
}

/** What an empty board has on it: a note, pinned up, saying how to fill it. */
function EmptyNote({ back }: { back: string }) {
  return (
    <div className="pb-note">
      <span className="pb-tape pb-note__tape" aria-hidden />
      <div className="pb-note__paper">
        <p className="pb-note__head">Nothing up here yet!</p>
        <Mark name="brush-03" ink="#d42a2f" className="pb-note__swash" />
        <p>
          Open any page of the paper, pick <b>Scissors</b> in the black bar at the bottom, then
          click a story you like.
        </p>
        <p>
          It gets cut out and taped up right here — drag it about, save it, send it to a friend.
        </p>
        <Link href={back} className="pb-note__go">
          Back to the paper
          <Mark name="arrows-06" ink="currentColor" className="pb-note__arrow" />
        </Link>
      </div>
    </div>
  );
}
