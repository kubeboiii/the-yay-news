import { FairyLights } from "../overlays";
import type { Ctx } from "../parts";
import { Sitting } from "./base";

/** Tangled in a string of fairy lights, still grinning. */
export function LightsScene({ c }: { c: Ctx }) {
  return (
    <Sitting
      c={c}
      over={
        <FairyLights
          c={c}
          paths={[
            "M96 250 C140 300 230 320 300 290 C340 270 360 300 390 330",
            "M200 18 C230 0 250 20 240 50 C232 80 250 110 262 130",
            "M110 380 C160 400 240 404 300 376",
          ]}
          bulbs={[
            [120, 270, -24],
            [168, 302, 10],
            [222, 312, -8],
            [276, 296, 16],
            [330, 282, -14],
            [370, 312, 22],
            [220, 4, -30],
            [244, 52, 18],
            [150, 392, -10],
            [208, 400, 12],
            [270, 388, -16],
          ]}
        />
      }
    />
  );
}
