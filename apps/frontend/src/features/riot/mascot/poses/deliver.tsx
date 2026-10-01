import { RolledPaper, Skateboard } from "../overlays";
import type { Ctx } from "../parts";
import { SIT, Sitting } from "./base";

/** Riding a skateboard, today's paper rolled at his paws. */
export function DeliverScene({ c }: { c: Ctx }) {
  return (
    <g>
      <Skateboard c={c} x0={70} x1={410} y={SIT.ground + 2} />
      <g transform="translate(0 -8)">
        <Sitting c={c} over={<RolledPaper c={c} x0={150} y0={424} x1={262} y1={396} />} />
      </g>
    </g>
  );
}
