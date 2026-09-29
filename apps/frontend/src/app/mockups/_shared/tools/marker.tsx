"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { type InkPoint, nextWidth, outline, type Stroke, type Tool } from "./ink";

/**
 * The drawing layer: an SVG laid over the paper inside its wrap, so it tilts and moves with the
 * sheet. Strokes are multiplied into the page, which is how pencil and ink actually sit on paper —
 * they darken what is under them and never cover it.
 */
export function MarkerLayer({
  wrap,
  size,
  active,
  tool,
  strokes,
  onStroke,
}: {
  wrap: HTMLElement;
  size: { w: number; h: number };
  active: boolean;
  tool: Tool;
  strokes: Stroke[];
  onStroke: (s: Stroke) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [live, setLive] = useState<Stroke | null>(null);
  const drawing = useRef<{ id: number; stroke: Stroke; last: { x: number; y: number; t: number } } | null>(null);
  const touches = useRef(new Map<number, { x: number; y: number }>());
  const panY = useRef<number | null>(null);
  const frame = useRef(0);

  const unitsPerPx = size.w > 0 ? 1000 / size.w : 1;
  const height = size.w > 0 ? (size.h / size.w) * 1000 : 1000;

  // Leaving marker mode mid-stroke drops the unfinished line rather than committing half of it.
  useEffect(() => {
    if (!active) {
      drawing.current = null;
      touches.current.clear();
      panY.current = null;
      setLive(null);
    }
  }, [active]);

  const toUnits = (e: PointerEvent) => ({
    // offsetX/Y are in the overlay's own untransformed box, so the sheet's tilt is already undone.
    x: e.offsetX * unitsPerPx,
    y: e.offsetY * unitsPerPx,
  });

  const paint = () => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const d = drawing.current;
      setLive(d ? { tool: d.stroke.tool, pts: [...d.stroke.pts] } : null);
    });
  };

  const midY = () => {
    let y = 0;
    for (const t of touches.current.values()) y += t.y;
    return y / Math.max(1, touches.current.size);
  };

  const onDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!active) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();
    if (e.pointerType === "touch") {
      touches.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      // A second finger means the reader wants to scroll, not draw: drop the line just started.
      if (touches.current.size >= 2) {
        drawing.current = null;
        setLive(null);
        panY.current = midY();
        return;
      }
    }
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // The pointer already went away; the stroke simply ends with it.
    }
    const p = toUnits(e.nativeEvent);
    const w = nextWidth(tool, undefined, 0, e.pointerType === "pen" ? e.pressure : undefined);
    drawing.current = {
      id: e.pointerId,
      stroke: { tool, pts: [[p.x, p.y, w]] },
      last: { x: p.x, y: p.y, t: e.timeStamp },
    };
    paint();
  };

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.pointerType === "touch" && touches.current.has(e.pointerId)) {
      touches.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (panY.current !== null) {
        const y = midY();
        window.scrollBy(0, panY.current - y);
        panY.current = y;
        return;
      }
    }
    const d = drawing.current;
    if (!d || d.id !== e.pointerId) return;
    const samples = e.nativeEvent.getCoalescedEvents?.() ?? [];
    for (const s of samples.length ? samples : [e.nativeEvent]) {
      const p = toUnits(s);
      const dist = Math.hypot(p.x - d.last.x, p.y - d.last.y);
      if (dist < 0.25) continue;
      const dt = Math.max(1, s.timeStamp - d.last.t);
      const prev = d.stroke.pts[d.stroke.pts.length - 1] as InkPoint;
      const w = nextWidth(tool, prev[2], dist / unitsPerPx / dt, s.pointerType === "pen" ? s.pressure : undefined);
      d.stroke.pts.push([p.x, p.y, w]);
      d.last = { x: p.x, y: p.y, t: s.timeStamp };
    }
    paint();
  };

  const onUp = (e: React.PointerEvent<SVGSVGElement>) => {
    touches.current.delete(e.pointerId);
    if (touches.current.size < 2) panY.current = null;
    const d = drawing.current;
    if (!d || d.id !== e.pointerId) return;
    drawing.current = null;
    cancelAnimationFrame(frame.current);
    setLive(null);
    if (e.type === "pointerup") onStroke(d.stroke);
  };

  const layer = (
    <svg
      ref={svgRef}
      className="rt-ink"
      data-active={active || undefined}
      data-tool={tool}
      viewBox={`0 0 1000 ${height.toFixed(1)}`}
      preserveAspectRatio="xMinYMin meet"
      aria-hidden
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <defs>
        {/* Graphite and wax catch only the tops of the paper's tooth, so a pencil line is broken
            up by fine grain; the gaps let the sheet through. */}
        <filter id="rt-grain" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="1.35" numOctaves="2" seed="7" result="tooth" />
          <feColorMatrix
            in="tooth"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 1.75"
            result="takes"
          />
          <feComposite in="SourceGraphic" in2="takes" operator="in" />
        </filter>
        {/* A felt nib bleeds a hair into the fibres: its edge wobbles by a fraction of a unit. */}
        <filter id="rt-bleed" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="1" seed="3" result="fibre" />
          <feDisplacementMap in="SourceGraphic" in2="fibre" scale="0.9" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      {strokes.map((s, i) => (
        <path key={i} d={outline(s)} className={`rt-stroke rt-stroke--${s.tool}`} />
      ))}
      {live && <path d={outline(live)} className={`rt-stroke rt-stroke--${live.tool}`} />}
    </svg>
  );

  return createPortal(layer, wrap);
}
