// Fonts for the clipping renderer. Satori only reads TTF/OTF/WOFF (not the WOFF2 that next/font
// serves), so each look's faces are fetched as static TrueType instances from the Google Fonts CSS
// API the first time they are needed, then kept in memory for the life of the server.

import "server-only";

export type FontSpec = { family: string; axes: string };
export type SatoriFont = {
  name: string;
  data: ArrayBuffer;
  weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  style: "normal" | "italic";
};

// A plain user agent gets TrueType URLs back instead of WOFF2.
const UA = "Mozilla/5.0 (compatible; YayNewsClippings/1.0)";

const cache = new Map<string, Promise<SatoriFont[]>>();

async function fetchFamily({ family, axes }: FontSpec): Promise<SatoriFont[]> {
  const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}${axes ? `:${axes}` : ""}`;
  const css = await fetch(url, { headers: { "User-Agent": UA } }).then((r) => {
    if (!r.ok) throw new Error(`Google Fonts CSS ${r.status} for ${family}`);
    return r.text();
  });
  const faces = [...css.matchAll(/@font-face\s*{([^}]*)}/g)].map((m) => {
    const block = m[1] ?? "";
    const src = /src:\s*url\(([^)]+)\)/.exec(block)?.[1];
    const weight = Number(/font-weight:\s*(\d+)/.exec(block)?.[1] ?? 400);
    const style = /font-style:\s*italic/.test(block) ? "italic" : "normal";
    return { src, weight, style } as const;
  });
  return Promise.all(
    faces
      .filter((f): f is typeof f & { src: string } => !!f.src)
      .map(async (f) => ({
        name: family,
        data: await fetch(f.src).then((r) => r.arrayBuffer()),
        weight: f.weight as SatoriFont["weight"],
        style: f.style,
      })),
  );
}

/** Every face a look needs, loaded once per server. A failed fetch is retried on the next request. */
export function loadFonts(specs: FontSpec[]): Promise<SatoriFont[]> {
  const key = specs.map((s) => `${s.family}:${s.axes}`).join("|");
  let hit = cache.get(key);
  if (!hit) {
    hit = Promise.all(specs.map(fetchFamily)).then((all) => all.flat());
    hit.catch(() => cache.delete(key));
    cache.set(key, hit);
  }
  return hit;
}
