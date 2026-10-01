import type { ReactNode } from "react";
import { PEEK_ART } from "../art/peek";
import { SITTING_ART } from "../art/sitting";
import { Cap, Catchlights, Lids, Satchel } from "../overlays";
import { ArtLayers, type Ctx } from "../parts";

/** Where things are on the sitting drawing (its own units). */
export const SIT = {
  eyes: [
    [135, 130],
    [193, 131],
  ] as [number, number][],
  eyeR: 7.6,
  mouth: { x: 160, y: 174, w: 70, h: 46 },
  ground: 438,
};

/** The master Odin, sitting, in his cap and satchel. `face` replaces the eyelids layer. */
export function Sitting({
  c,
  face,
  under,
  over,
}: {
  c: Ctx;
  face?: ReactNode;
  under?: ReactNode;
  over?: ReactNode;
}) {
  return (
    <g>
      {under}
      <g className="rt-odin__breath">
        <ArtLayers art={SITTING_ART} c={c} />
        <Catchlights eyes={SIT.eyes} r={SIT.eyeR} />
        {face ?? <Lids c={c} eyes={SIT.eyes} r={SIT.eyeR} ground={c.k.white} />}
        <Satchel c={c} x0={118} y0={238} x1={244} y1={262} />
        <Cap c={c} x={161} y={64} s={4.2} />
      </g>
      {over}
    </g>
  );
}

const PEEK_EYES: [number, number][] = [
  [160, 184],
  [224, 184],
];

/** The small peeking Odin: head and paws over a line. */
export function Peeking({ c }: { c: Ctx }) {
  return (
    <g>
      <ArtLayers art={PEEK_ART} c={c} />
      <Catchlights eyes={PEEK_EYES} r={8} />
      <Lids c={c} eyes={PEEK_EYES} r={8} ground={c.k.white} />
      <Cap c={c} x={192} y={150} s={3.6} />
    </g>
  );
}
