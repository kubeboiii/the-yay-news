import { ClosedSmile, Lids, Stack, Zs } from "../overlays";
import type { Ctx } from "../parts";
import { SIT, Sitting } from "./base";

/** Dozing on tied bundles: eyes shut, a contented smile, Zs. */
export function AsleepScene({ c }: { c: Ctx }) {
  const m = SIT.mouth;
  return (
    <g>
      <Stack c={c} x0={70} x1={410} y={SIT.ground - 8} tied />
      <g transform="translate(0 -6)">
        <Sitting
          c={c}
          face={
            <>
              <ClosedSmile c={c} x={m.x} y={m.y} w={m.w} h={m.h} />
              <Lids c={c} eyes={SIT.eyes} r={SIT.eyeR} ground={c.k.white} shut />
            </>
          }
        />
      </g>
      <Zs c={c} x={262} y={20} />
    </g>
  );
}
