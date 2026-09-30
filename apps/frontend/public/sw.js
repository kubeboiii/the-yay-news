// The Yay News service worker: keeps the papers you've opened, so they still read on the Tube.
//
//   · Pages (and Next's page data): network first, so today's paper is always today's; the copy
//     from the last visit is kept and served when there's no connection.
//   · Built assets (/_next/static, fonts, icons): cache first; their names change when they do.
//   · Pictures: from the cache when kept, and kept as they're fetched.
//   · No connection and nothing kept for a page: the offline page.
// Only GET requests to this site are touched. Nothing here holds personal data: the reader's
// stamps and clippings live in localStorage, not in these caches.

const VERSION = "v2";
const PAGES = `yay-pages-${VERSION}`;
const ASSETS = `yay-assets-${VERSION}`;
const PICTURES = `yay-pictures-${VERSION}`;
const OFFLINE = "/offline";
const KEEP_PAGES = 80;
const KEEP_PICTURES = 200;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PAGES)
      .then((c) => c.add(new Request(OFFLINE, { cache: "reload" })))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith("yay-") && ![PAGES, ASSETS, PICTURES].includes(k))
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

async function trim(name, max) {
  const cache = await caches.open(name);
  const keys = await cache.keys();
  for (const k of keys.slice(0, Math.max(0, keys.length - max))) await cache.delete(k);
}

async function networkFirst(request, isPage) {
  const cache = await caches.open(PAGES);
  try {
    const response = await fetch(request);
    if (response.ok && response.type === "basic") {
      cache.put(request, response.clone()).then(() => trim(PAGES, KEEP_PAGES));
    }
    return response;
  } catch {
    const kept = await cache.match(request);
    if (kept) return kept;
    if (isPage) return (await cache.match(OFFLINE)) ?? Response.error();
    return Response.error();
  }
}

/** A kept copy of the same picture at any size (Next's image URLs differ only by w= and q=). */
async function anySize(cache, request) {
  const url = new URL(request.url);
  if (url.pathname !== "/_next/image") return undefined;
  const src = url.searchParams.get("url");
  for (const key of await cache.keys()) {
    const k = new URL(key.url);
    if (k.pathname === "/_next/image" && k.searchParams.get("url") === src) return cache.match(key);
  }
  return undefined;
}

async function cacheFirst(request, name, max) {
  const cache = await caches.open(name);
  const kept = await cache.match(request);
  if (kept) return kept;
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone()).then(() => max && trim(name, max));
    return response;
  } catch {
    return (await anySize(cache, request)) ?? Response.error();
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // Never cache the admin, the API proxy or anything a reader downloads (zines, clippings).
  if (/^\/(admin|api|clip)\b/.test(url.pathname) || url.pathname.endsWith("/zine")) return;

  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/")) {
    event.respondWith(cacheFirst(request, ASSETS, 0));
    return;
  }
  if (
    request.destination === "image" ||
    url.pathname.startsWith("/_next/image") ||
    url.pathname.startsWith("/editions/")
  ) {
    event.respondWith(cacheFirst(request, PICTURES, KEEP_PICTURES));
    return;
  }
  const isPage = request.mode === "navigate";
  const isPageData = request.headers.get("RSC") === "1";
  if (isPage || isPageData) event.respondWith(networkFirst(request, isPage));
});
