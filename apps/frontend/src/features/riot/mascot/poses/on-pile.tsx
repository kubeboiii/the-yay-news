import { Stack } from "../overlays";
import type { Ctx } from "../parts";
import { SIT, Sitting } from "./base";

/** Sitting on a pile of papers. */
export function OnPileScene({ c }: { c: Ctx }) {
  return (
    <g>
      <Stack c={c} x0={80} x1={400} y={SIT.ground - 8} />
      <g transform="translate(0 -6)">
        <Sitting c={c} />
      </g>
    </g>
  );
}
