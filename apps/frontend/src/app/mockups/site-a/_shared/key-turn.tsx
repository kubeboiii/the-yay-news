"use client";

import { useTurnKeys } from "@/features/riot/hooks/use-turn-keys";

/**
 * Turns the page with the arrow keys (← previous, → next), like flicking through the paper.
 * Ignored while typing in a field or with a modifier held. The hook lives in the riot kit.
 */
export function KeyTurn({ prev, next }: { prev: string | null; next: string | null }) {
  useTurnKeys(prev ?? undefined, next ?? undefined);
  return null;
}
