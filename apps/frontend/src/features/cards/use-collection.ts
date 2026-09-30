"use client";

import { useMemo } from "react";
import { useEditionToday, useHabitLog } from "@/features/habits/api";
import { collectionOf } from "./collection";

/** The reader's Yay Attax collection (empty during server rendering). */
export function useCollection() {
  const events = useHabitLog();
  return useMemo(() => collectionOf(events), [events]);
}

/** `?now=`'s date from the page's URL (previews outside production only), else null. */
export function previewToday(): string | null {
  if (typeof window === "undefined" || process.env.NODE_ENV === "production") return null;
  const now = new URLSearchParams(window.location.search).get("now");
  if (!now) return null;
  const d = new Date(now);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

/**
 * "Today" for card releases and seasons: the device's edition date, or `?now=`'s in a preview.
 * Null during server rendering.
 */
export function useCardsToday(): string | null {
  const device = useEditionToday();
  return device ? (previewToday() ?? device) : null;
}

/** A little randomness for a new game's seed (outside render). */
export const nonce = () => `${Date.now() % 100000}`;
