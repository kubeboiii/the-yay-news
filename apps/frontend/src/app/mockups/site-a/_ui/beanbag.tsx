"use client";

import { useMemo } from "react";
import { opts, RoughPaths, roughGen, toPaths } from "@/features/play/rough";

/** A slumped beanbag and a mug, drawn with Rough.js so the line wobbles like a felt-tip. */
export function Beanbag({ className }: { className?: string }) {
  const paths = useMemo(
    () =>
      toPaths(
        roughGen.curve(
          [
            [20, 150],
            [8, 112],
            [30, 66],
            [82, 40],
            [140, 52],
            [196, 84],
            [214, 128],
            [200, 156],
            [120, 166],
            [40, 162],
            [20, 150],
          ],
          opts({
            roughness: 1.4,
            strokeWidth: 2.4,
            fill: "x",
            fillStyle: "hachure",
            hachureGap: 7,
            hachureAngle: -30,
            seed: 7,
          }),
        ),
        roughGen.curve(
          [
            [56, 92],
            [96, 104],
            [150, 96],
            [180, 108],
          ],
          opts({ roughness: 1.2, strokeWidth: 1.8, seed: 9 }),
        ),
      ),
    [],
  );
  const mug = useMemo(
    () =>
      toPaths(
        roughGen.rectangle(
          236,
          128,
          30,
          34,
          opts({ roughness: 1, strokeWidth: 2, fill: "x", fillStyle: "solid", seed: 3 }),
        ),
        roughGen.arc(
          268,
          145,
          18,
          18,
          -Math.PI / 2,
          Math.PI / 2,
          false,
          opts({ roughness: 0.8, strokeWidth: 2, seed: 4 }),
        ),
        roughGen.curve(
          [
            [244, 120],
            [240, 108],
            [248, 98],
          ],
          opts({ roughness: 0.6, strokeWidth: 1.4, seed: 5 }),
        ),
      ),
    [],
  );
  return (
    <svg
      viewBox="0 0 290 180"
      className={className}
      aria-hidden
      focusable="false"
      overflow="visible"
    >
      <RoughPaths paths={paths} stroke="var(--sa-ink)" fill="var(--sa-l3)" />
      <RoughPaths paths={mug} stroke="var(--sa-ink)" fill="var(--sa-l0)" />
    </svg>
  );
}
