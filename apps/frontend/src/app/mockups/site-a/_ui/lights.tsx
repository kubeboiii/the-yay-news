"use client";

import { useMemo } from "react";
import { opts, RoughPaths, roughGen, toPaths } from "@/features/play/rough";

const W = 1400;
const sag = (x: number) =>
  Math.round((18 + Math.sin((x / W) * Math.PI) * 62 + Math.sin((x / W) * Math.PI * 3) * 8) * 10) /
  10;

/** A string of fairy lights pinned across the top of the wall, its wire drawn with Rough.js. */
export function FairyLights() {
  const wire = useMemo(() => {
    const pts: [number, number][] = [];
    for (let x = -10; x <= W + 10; x += 50) pts.push([x, sag(x)]);
    return toPaths(roughGen.curve(pts, opts({ roughness: 0.8, strokeWidth: 1.6, seed: 21 })));
  }, []);
  const bulbs = Array.from({ length: 22 }, (_, i) => {
    const x = 30 + i * 62;
    return { x, y: sag(x), ink: `var(--sa-l${i % 5})`, delay: (i * 0.37) % 2.4 };
  });
  return (
    <svg viewBox={`0 0 ${W} 120`} className="sa-lights" aria-hidden focusable="false">
      <RoughPaths paths={wire} stroke="var(--sa-ink)" />
      {bulbs.map((b, i) => (
        <g key={i} transform={`translate(${b.x} ${b.y}) rotate(${(i % 3) * 8 - 8})`}>
          <rect x="-3" y="0" width="6" height="6" fill="var(--sa-ink)" />
          <circle
            cx="0"
            cy="17"
            r="14"
            fill={b.ink}
            className="sa-lights__glow"
            style={{ animationDelay: `${b.delay}s` }}
          />
          <path
            d="M-6 9 C-6 3 6 3 6 9 C6 15 0 22 0 22 C0 22 -6 15 -6 9 Z"
            fill={b.ink}
            stroke="var(--sa-ink)"
            strokeWidth="1.4"
          />
        </g>
      ))}
    </svg>
  );
}
