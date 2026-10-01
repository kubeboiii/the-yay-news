"use client";

import { useEffect, useRef } from "react";
import { play } from "@/features/sound";

// The scratch card's foil: a canvas over the card, printed in plate B, that the pointer (a finger or
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
    // The foil, printed riso-style: a flat slab of plate B with a coarse halftone of black
    // through it, and the words in the kit's condensed face (read off the page's inks).
    const paint = () => {
      ctx.globalCompositeOperation = "source-over";
      const css = getComputedStyle(canvas);
      const ink = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback;
      ctx.fillStyle = ink("--rt-b", "#2fa8ff");
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "rgba(17,17,17,0.2)";
      const pitch = w * 0.045;
      for (let y = pitch / 2, row = 0; y < h; y += pitch * 0.87, row++) {
        for (let x = (row % 2 ? pitch / 2 : 0) + pitch / 4; x < w; x += pitch) {
          // Bigger dots toward the bottom corner, like a tone fading across the sheet.
          const t = Math.min(1, (x / w + y / h) / 1.6);
          ctx.beginPath();
          ctx.arc(x, y, pitch * (0.08 + 0.3 * t), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      const head = ink("--rt-ff-gothic", "") || '"League Gothic", Impact';
      ctx.fillStyle = ink("--rt-k", "#111");
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `${Math.round(w * 0.2)}px ${head}, Impact, sans-serif`;
      ctx.fillText("SCRATCH", w / 2, h * 0.4);
      ctx.fillText("ME!", w / 2, h * 0.57);
      ctx.font = `bold ${Math.round(w * 0.045)}px "Courier New", monospace`;
      ctx.fillText("The Yay News · Yay Attax", w / 2, h * 0.72);
      ctx.globalCompositeOperation = "destination-out";
    };
    paint();

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
    // The heading face may still be loading: print the foil again once it's in, if untouched.
    let live = true;
    void document.fonts?.ready.then(() => {
      if (live && !strokes) paint();
    });
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    return () => {
      live = false;
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
