"use client";

import { useEffect, useState } from "react";

type InstallPrompt = Event & { prompt: () => Promise<void> };
let installPrompt: InstallPrompt | null = null;

/** The browser's own "install this app" prompt, when it has offered one (Chrome, Edge, Android). */
export const takeInstallPrompt = () => {
  const p = installPrompt;
  installPrompt = null;
  return p;
};

// The service worker (public/sw.js), registered in production only: in development it would
// cache pages under Next's hot reloading and serve stale code. Also keeps the browser's install
// prompt for the "put it on your home screen" offer.
export function ServiceWorker() {
  useEffect(() => {
    const keep = (e: Event) => {
      e.preventDefault();
      installPrompt = e as InstallPrompt;
    };
    window.addEventListener("beforeinstallprompt", keep);
    return () => window.removeEventListener("beforeinstallprompt", keep);
  }, []);
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* No offline copy this time; the site works the same without it. */
    });
  }, []);
  return null;
}

type Kept = { href: string; label: string };

/** The papers this device has kept for reading offline, newest first. */
export function KeptPapers() {
  const [kept, setKept] = useState<Kept[] | null>(null);
  useEffect(() => {
    let live = true;
    (async () => {
      const found = new Map<number, Kept>();
      try {
        for (const name of await caches.keys()) {
          if (!name.startsWith("yay-pages-")) continue;
          for (const req of await (await caches.open(name)).keys()) {
            const url = new URL(req.url);
            // Page data prefetched for a link isn't a page that opens offline; only whole pages are.
            if (url.searchParams.has("_rsc")) continue;
            const m = /^\/issue\/(\d+)\/?$/.exec(url.pathname);
            if (m) found.set(Number(m[1]), { href: `/issue/${m[1]}`, label: `No. ${m[1]}` });
          }
        }
      } catch {
        /* No caches: nothing kept. */
      }
      if (live) setKept([...found.entries()].sort((a, b) => b[0] - a[0]).map(([, k]) => k));
    })();
    return () => {
      live = false;
    };
  }, []);
  if (!kept) return null;
  if (kept.length === 0) {
    return (
      <p className="ar-sign__note">
        No papers kept on this device yet. Open one while you&rsquo;re online and it&rsquo;ll be
        here next time.
      </p>
    );
  }
  return (
    <p className="ar-nf__links">
      {kept.map((k) => (
        // A full page load, not a client-side one: offline, only the kept page itself is there.
        <a key={k.href} href={k.href} className="ar-ticket">
          {k.label}
        </a>
      ))}
    </p>
  );
}
