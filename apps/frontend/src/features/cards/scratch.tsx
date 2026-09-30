"use client";

import { useEffect, useRef } from "react";
import { play } from "@/features/sound";

// The scratch card's foil: a canvas over the card, painted silver, that the pointer (a finger or
// a mouse held down) scratches away. Once about half of it is gone the rest flakes off by itself.

const BRUSH = 0.075; // of the card's width
const DONE_AT = 0.5;

export function ScratchLayer({ onDone, done }: { onDone: () => void; done: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const finished = useRef(onDone);
  useEffect(() => {
    finished.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    const w = canvas.width;
    const h = canvas.height;
    // The foil: brushed silver, a sparkle of glints, and the words.
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#b8bec6");
    g.addColorStop(0.3, "#eef1f4");
    g.addColorStop(0.55, "#9aa2ac");
    g.addColorStop(0.8, "#e3e7eb");
    g.addColorStop(1, "#a9b0b8");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, w * 0.046);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    for (let i = 0; i < 160; i++) {
      const x = (Math.sin(i * 12.9898) * 43758.5453) % 1;
      const y = (Math.sin(i * 78.233) * 12345.678) % 1;
      ctx.fillRect(Math.abs(x) * w, Math.abs(y) * h, 1.5 * dpr, 1.5 * dpr);
    }
    ctx.fillStyle = "rgba(40,44,52,0.75)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${Math.round(w * 0.13)}px Impact, "League Gothic", sans-serif`;
    ctx.fillText("SCRATCH", w / 2, h * 0.42);
    ctx.fillText("ME!", w / 2, h * 0.55);
    ctx.font = `${Math.round(w * 0.045)}px Arial, sans-serif`;
    ctx.fillText("The Yay News · Yay Attax", w / 2, h * 0.7);
    ctx.globalCompositeOperation = "destination-out";

    let down = false;
    let last: [number, number] | null = null;
    let lastSound = 0;
    let strokes = 0;
    let over = false;
    const at = (e: PointerEvent): [number, number] => {
      const r = canvas.getBoundingClientRect();
      return [((e.clientX - r.left) / r.width) * w, ((e.clientY - r.top) / r.height) * h];
    };
    const cleared = () => {
      const data = ctx.getImageData(0, 0, w, h).data;
      let clear = 0;
      let n = 0;
      for (let i = 3; i < data.length; i += 4 * 37) {
        n++;
        if (data[i]! < 60) clear++;
      }
      return n ? clear / n : 0;
    };
    const scratch = (p: [number, number]) => {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = w * BRUSH * 2;
      ctx.beginPath();
      ctx.moveTo(...(last ?? p));
      ctx.lineTo(...p);
      ctx.stroke();
      last = p;
      const now = performance.now();
      if (now - lastSound > 70) {
        play("scratch");
        lastSound = now;
      }
      if (++strokes % 8 === 0 && !over && cleared() >= DONE_AT) {
        over = true;
        finished.current();
      }
    };
    const onDown = (e: PointerEvent) => {
      down = true;
      last = null;
      canvas.setPointerCapture(e.pointerId);
      scratch(at(e));
    };
    const onMove = (e: PointerEvent) => {
      if (down) scratch(at(e));
    };
    const onUp = () => {
      down = false;
      last = null;
      if (!over && cleared() >= DONE_AT) {
        over = true;
        finished.current();
      }
    };
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    return () => {
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className={`yr-foil ${done ? "is-gone" : ""}`}
      aria-label="Scratch-off foil"
      role="img"
    />
  );
}
