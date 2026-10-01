import { Lids, OMouth, Question, TornPage } from "../overlays";
import type { Ctx } from "../parts";
import { SIT, Sitting } from "./base";

/** Puzzled: a tilt, a question mark, and a torn page he can't make sense of. */
export function ConfusedScene({ c }: { c: Ctx }) {
  return (
    <g>
      <g transform="rotate(-11 240 440)">
        <Sitting
          c={c}
          face={
            <>
              <OMouth c={c} x={SIT.mouth.x} y={SIT.mouth.y} w={SIT.mouth.w} h={SIT.mouth.h} />
              <Lids c={c} eyes={SIT.eyes} r={SIT.eyeR} ground={c.k.white} />
            </>
          }
        />
      </g>
      <TornPage c={c} x={40} y={340} turn={-10} />
      <Question c={c} x={250} y={-20} />
    </g>
  );
}
