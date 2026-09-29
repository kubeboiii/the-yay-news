"use client";

import { useCallback, useSyncExternalStore } from "react";

/*
 * A reader preference kept in localStorage (paper stock, colourway), read without a second render
 * after hydration. The server and the first client render use the fallback; React then reads the
 * saved value through useSyncExternalStore. A valid ?<param>= in the URL wins once per page load,
 * so a choice can be linked or screenshotted, and it is saved like a normal pick. If storage is
 * blocked, choices live in memory for this page view.
 */

const memory = new Map<string, string>();
const listeners = new Set<() => void>();
const urlApplied = new Set<string>();

function write(key: string, value: string) {
  memory.set(key, value);
  try {
    localStorage.setItem(key, value);
  } catch {
    // Private mode or blocked storage: the in-memory value still applies to this page view.
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function useStoredChoice<T extends string>(
  key: string,
  param: string,
  isValid: (value: string | null) => value is T,
  fallback: T,
): [T, (value: T) => void] {
  const read = useCallback((): T => {
    if (!urlApplied.has(key)) {
      urlApplied.add(key);
      const fromUrl = new URLSearchParams(window.location.search).get(param);
      if (isValid(fromUrl)) write(key, fromUrl);
    }
    let saved: string | null;
    try {
      saved = localStorage.getItem(key);
    } catch {
      saved = memory.get(key) ?? null;
    }
    return isValid(saved) ? saved : fallback;
  }, [key, param, isValid, fallback]);

  const value = useSyncExternalStore(subscribe, read, () => fallback);

  const set = useCallback(
    (next: T) => {
      write(key, next);
      for (const l of listeners) l();
    },
    [key],
  );

  return [value, set];
}
