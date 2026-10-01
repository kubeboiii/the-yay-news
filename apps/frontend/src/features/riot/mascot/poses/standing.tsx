import type { Ctx } from "../parts";
import { Sitting } from "./base";

/** The master pose: sitting up, grinning. (Kept as "standing" for the API.) */
export function StandingScene({ c }: { c: Ctx }) {
  return <Sitting c={c} />;
}
