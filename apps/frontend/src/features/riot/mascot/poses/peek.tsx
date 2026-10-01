import type { Ctx } from "../parts";
import { Peeking } from "./base";

/** Peeking over an edge, paws up: the small icon (nav, corners, favicon size). */
export function PeekScene({ c }: { c: Ctx }) {
  return <Peeking c={c} />;
}
