"use client";

import { useEffect, useSyncExternalStore } from "react";

// Which of the site's three places a page belongs to, when its URL can't tell: an /issue/… page is
// Today while it's today's paper, and part of the Pile once it's an older one (the PileBand says so).

type Place = "today" | "pile" | "wall";
let override: Place | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function usePlaceOverride(): Place | null {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => override,
    () => null,
  );
}

/** Rendered by a page to claim its place in the site bar while it's on screen. */
export function SetPlace({ place }: { place: Place }) {
  useEffect(() => {
    override = place;
    emit();
    return () => {
      override = null;
      emit();
    };
  }, [place]);
  return null;
}
