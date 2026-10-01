// Stage 1: gather candidates from the allowlist, then fetch each survivor's article text (the only
// thing a story may be written from). Polite: one identifying user agent, robots.txt respected for
// article pages, a small concurrency limit and timeouts everywhere.
import { decodeEntities, stripHtml } from "../text.ts";
import type { Candidate, CandidateImage, SourceDef } from "../types.ts";
import { normaliseUrl } from "./dedup.ts";

export const USER_AGENT =
  "TheYayNewsBot/0.1 (a daily good-news paper; one fetch per source per day)";
/** For the few sites that refuse any unknown client (marked `browserAgent` in the allowlist). */
export const BROWSER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36 TheYayNews/0.1";

export type Http = (
  url: string,
  init?: { accept?: string; browser?: boolean },
) => Promise<{ ok: boolean; status: number; text: string; url: string }>;

export const http: Http = async (url, init = {}) => {
  const res = await fetch(url, {
    headers: {
      "user-agent": init.browser ? BROWSER_AGENT : USER_AGENT,
      accept: init.accept ?? "*/*",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(15_000),
  });
  return { ok: res.ok, status: res.status, text: await res.text(), url: res.url || url };
};

// ——— Feeds ———

export type FeedItem = {
  title: string;
  link: string;
  summary: string;
  content: string;
  published: Date | null;
  image: string | null;
  /** Every picture the item carries (media:content, enclosures, inline <img>), first = image. */
  images: string[];
};

const tag = (xml: string, name: string) => {
  const m = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"));
  return m ? m[1]!.replace(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/, "$1").trim() : "";
};
const attr = (xml: string, name: string, attribute: string, where?: RegExp) => {
  for (const m of xml.matchAll(new RegExp(`<${name}\\b([^>]*)/?>`, "gi"))) {
    const attrs = m[1] ?? "";
    if (where && !where.test(attrs)) continue;
    const v = attrs.match(new RegExp(`${attribute}\\s*=\\s*["']([^"']+)["']`, "i"));
    if (v) return decodeEntities(v[1]!);
  }
  return null;
};

const attrs = (xml: string, name: string, attribute: string, where?: RegExp) => {
  const out: string[] = [];
  for (const m of xml.matchAll(new RegExp(`<${name}\\b([^>]*)/?>`, "gi"))) {
    const a = m[1] ?? "";
    if (where && !where.test(a)) continue;
    const v = a.match(new RegExp(`${attribute}\\s*=\\s*["']([^"']+)["']`, "i"));
    if (v) out.push(decodeEntities(v[1]!));
  }
  return out;
};

/** Pictures that are never story pictures: logos, avatars, icons, ads, tracking pixels. */
export const UNUSABLE_IMAGE =
  /(logo|placeholder|default[-_]?image|avatar|icon|sprite|blank|spacer|gravatar|headshot|author|profile|badge|sponsor|advert|banner|masthead|stock[-_]?(photo|image)|generic|fallback|share[-_]?image|social[-_]?card|og[-_]?default|site[-_]?image|\bads?\b|doubleclick|pixel|tracking|emoji|favicon|\.svg|\.gif)(\?|$|[-_./])/i;

/** Query parameters that only resize or crop a picture. */
const SIZE_PARAMS = /^(w|h|width|height|resize|crop|fit|quality|q|dpr|auto|strip|zoom|ssl)$/i;

/** A picture's URL without resizing parameters or size suffixes (so copies count once). */
function unsized(url: string): URL | null {
  try {
    const u = new URL(url);
    for (const k of [...u.searchParams.keys()]) if (SIZE_PARAMS.test(k)) u.searchParams.delete(k);
    u.pathname = u.pathname.replace(/-(\d{2,4}x\d{2,4}|scaled)(?=\.[a-z]+$)/i, "");
    return u;
  } catch {
    return null;
  }
}

/**
 * The same picture at another size or with a resizing query string counts once, and so does a
 * feed thumbnail and the full-size copy it stands for (they press to the same picture).
 */
export function imageKey(url: string): string {
  const u = unsized(fullSize(url));
  return u ? normaliseUrl(u.toString()).toLowerCase() : url.toLowerCase();
}

/**
 * Feeds often carry thumbnails. Ask for the full-size copy where the CDN's pattern is known:
 * WordPress resize parameters and -480x320 suffixes, BBC's /standard/240/, Phys.org's /tmb/.
 */
export function fullSize(url: string): string {
  const u = unsized(url);
  if (!u) return url;
  u.pathname = u.pathname
    .replace(/\/(standard|news)\/(\d{2,3})\//, "/$1/1024/")
    .replace(/\/csz\/news\/tmb\//, "/csz/news/800a/");
  return u.toString();
}

/** Logos, avatars and the like, judged on the file name (paths like /logo/ can hold photos). */
export function unusableImage(url: string): boolean {
  try {
    const u = new URL(url);
    return (
      UNUSABLE_IMAGE.test(u.pathname.split("/").at(-1) ?? "") ||
      (/\/(avatars?|authors?|logos?|icons?)\/[^/]*$/i.test(u.pathname) &&
        !/\d{3,4}x\d{3,4}/.test(u.pathname))
    );
  } catch {
    return true;
  }
}

function unique(urls: string[]): string[] {
  const seen = new Set<string>();
  return urls.filter((u) => {
    const k = imageKey(u);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/** RSS 2.0 and Atom, without a dependency: feeds are regular enough for a careful regex pass. */
export function parseFeed(xml: string): FeedItem[] {
  const blocks = [...xml.matchAll(/<(item|entry)\b[\s\S]*?<\/\1>/gi)].map((m) => m[0]);
  return blocks.map((b) => {
    const content = tag(b, "content:encoded") || tag(b, "content");
    const summary = tag(b, "description") || tag(b, "summary");
    const link =
      attr(b, "link", "href", /rel=["']alternate["']/) ??
      (stripHtml(tag(b, "link")) || attr(b, "link", "href") || tag(b, "guid"));
    const date = tag(b, "pubDate") || tag(b, "published") || tag(b, "updated") || tag(b, "dc:date");
    const image =
      attr(b, "media:content", "url", /medium=["']image|type=["']image/) ??
      attr(b, "media:content", "url") ??
      attr(b, "media:thumbnail", "url") ??
      attr(b, "enclosure", "url", /type=["']image/) ??
      decodeEntities(`${content}${summary}`).match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] ??
      null;
    const images = unique(
      [
        image,
        ...attrs(b, "media:content", "url"),
        ...attrs(b, "media:thumbnail", "url"),
        ...attrs(b, "enclosure", "url", /type=["']image/),
        ...[
          ...decodeEntities(`${content}${summary}`).matchAll(/<img[^>]+src=["']([^"']+)["']/gi),
        ].map((m) => m[1]!),
      ].filter((u): u is string => !!u && /^https?:\/\//.test(u) && !unusableImage(u)),
    );
    const published = date ? new Date(stripHtml(date)) : null;
    return {
      title: stripHtml(tag(b, "title")),
      link: decodeEntities(link).trim(),
      summary: stripHtml(decodeEntities(summary)).slice(0, 1200),
      content: stripHtml(decodeEntities(content)),
      published: published && !Number.isNaN(published.getTime()) ? published : null,
      image: images[0] ?? null,
      images,
    };
  });
}

// ——— Articles ———

export type Article = {
  text: string;
  title: string | null;
  description: string | null;
  published: Date | null;
  image: string | null;
  /** og:image first, then large in-article pictures (min width 800 when the page says). */
  images: string[];
  imageAlt: string | null;
  siteName: string | null;
};

/** Pictures narrower than this are not worth a place on the page. */
export const MIN_IMAGE_WIDTH = 800;

const meta = (html: string, key: string) =>
  attr(html, "meta", "content", new RegExp(`(?:property|name)=["']${key}["']`, "i"));

/** The readable text of an article page: its paragraphs, from <article> or <main> when present. */
export function extractArticle(html: string): Article {
  const scope =
    html.match(/<article\b[\s\S]*<\/article>/i)?.[0] ??
    html.match(/<main\b[\s\S]*<\/main>/i)?.[0] ??
    html;
  const paragraphs = [...scope.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((m) => stripHtml(m[1]!).replace(/\s+/g, " ").trim())
    .filter(
      (p) =>
        p.length > 40 &&
        !/^(advertisement|sign up|subscribe|read more|related:|image:|photo:|credit:)/i.test(p),
    );
  const lead = meta(html, "og:image") ?? meta(html, "twitter:image");
  const inArticle = [...scope.matchAll(/<img\b[^>]*>/gi)].flatMap((m) => {
    const tagText = m[0];
    const width = Number(tagText.match(/\bwidth=["']?(\d+)/i)?.[1] ?? 0);
    const srcset = tagText.match(/\b(?:data-)?srcset=["']([^"']+)["']/i)?.[1];
    // The widest candidate in a srcset, if it is wide enough.
    const best = srcset
      ?.split(",")
      .map((part) => part.trim().split(/\s+/))
      .map(([u, w]) => ({ u: u ?? "", w: Number((w ?? "").replace(/w$/, "")) || 0 }))
      .sort((a, b) => b.w - a.w)[0];
    const src =
      best && best.w >= MIN_IMAGE_WIDTH
        ? best.u
        : width >= MIN_IMAGE_WIDTH
          ? (tagText.match(/\b(?:data-)?src=["']([^"']+)["']/i)?.[1] ?? null)
          : null;
    return src && !src.startsWith("data:") ? [decodeEntities(src)] : [];
  });
  const published = meta(html, "article:published_time") ?? meta(html, "og:published_time");
  const when = published ? new Date(published) : null;
  return {
    text: paragraphs.join("\n\n"),
    title: meta(html, "og:title") ?? (stripHtml(tag(html, "title")) || null),
    description: meta(html, "og:description") ?? meta(html, "description"),
    published: when && !Number.isNaN(when.getTime()) ? when : null,
    images: unique([lead, ...inArticle].filter((u): u is string => !!u && !unusableImage(u))),
    image: lead,
    imageAlt: meta(html, "og:image:alt"),
    siteName: meta(html, "og:site_name"),
  };
}

/** One Allow or Disallow line from robots.txt. */
export type RobotsRule = { allow: boolean; path: string };

/**
 * The rules that apply to us in a robots.txt (RFC 9309): the group naming our bot if there is one,
 * else the `*` group. Consecutive User-agent lines share one group.
 */
export function parseRobots(text: string): RobotsRule[] {
  const groups: { agents: string[]; rules: RobotsRule[] }[] = [];
  let current: { agents: string[]; rules: RobotsRule[] } | null = null;
  let lastWasAgent = false;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, "").trim();
    const i = line.indexOf(":");
    if (i < 0) continue;
    const key = line.slice(0, i).trim().toLowerCase();
    const value = line.slice(i + 1).trim();
    if (key === "user-agent") {
      if (!current || !lastWasAgent) groups.push((current = { agents: [], rules: [] }));
      current.agents.push(value.toLowerCase());
      lastWasAgent = true;
      continue;
    }
    lastWasAgent = false;
    // An empty Disallow allows everything; an empty Allow says nothing.
    if (current && (key === "allow" || key === "disallow") && value)
      current.rules.push({ allow: key === "allow", path: value });
  }
  const ours = groups.filter((g) => g.agents.some((a) => a !== "*" && /yaynews/.test(a)));
  const chosen = ours.length ? ours : groups.filter((g) => g.agents.includes("*"));
  return chosen.flatMap((g) => g.rules);
}

const ruleMatcher = (path: string) =>
  new RegExp(
    `^${path
      .split("*")
      .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, "\\$&"))
      .join(".*")
      .replace(/\\\$$/, "$")}`,
  );

/** Whether a path (with its query) may be fetched: the longest matching rule wins, Allow on ties. */
export function robotsAllow(rules: RobotsRule[], pathAndQuery: string): boolean {
  let best: RobotsRule | null = null;
  for (const r of rules) {
    if (!ruleMatcher(r.path).test(pathAndQuery)) continue;
    if (
      !best ||
      r.path.length > best.path.length ||
      (r.path.length === best.path.length && r.allow)
    )
      best = r;
  }
  return best ? best.allow : true;
}

const robotsCache = new Map<string, Promise<RobotsRule[]>>();

/** The robots.txt rules that apply to us on a site (none when it has no robots.txt). */
function robotsFor(origin: string, get: Http): Promise<RobotsRule[]> {
  if (!robotsCache.has(origin)) {
    robotsCache.set(
      origin,
      get(`${origin}/robots.txt`)
        .then((r) => (r.ok ? parseRobots(r.text) : []))
        .catch(() => []),
    );
  }
  return robotsCache.get(origin)!;
}

export async function allowedByRobots(url: string, get: Http): Promise<boolean> {
  try {
    const u = new URL(url);
    return robotsAllow(await robotsFor(u.origin, get), `${u.pathname}${u.search}`);
  } catch {
    return false;
  }
}

// ——— Sources ———

type Raw = Omit<Candidate, "id" | "fetchedAt" | "sourceSlug" | "sourceName" | "sourceSections"> & {
  sourceName?: string;
  /** From a listing page: title and date come from the article itself. */
  scraped?: boolean;
};

const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

const imagesOf = (urls: string[], credit: string | null = null): CandidateImage[] =>
  urls.map((url) => ({ url, credit, alt: null }));

async function fromFeed(source: SourceDef, get: Http): Promise<Raw[]> {
  const r = await get(source.url, {
    accept: "application/rss+xml, application/atom+xml, application/xml, text/xml",
    browser: source.browserAgent,
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const items = parseFeed(r.text);
  if (!items.length) throw new Error("the feed had no items");
  const only = source.linkPattern ? new RegExp(source.linkPattern) : null;
  return items
    .filter((i) => !only || only.test(i.link))
    .map((i) => ({
      url: i.link,
      title: i.title,
      summary: i.summary,
      text: i.content.length > 1200 ? i.content : "",
      imageUrl: i.image,
      images: imagesOf(i.images),
      imageCredit: null,
      imageLicence: null,
      embedUrl: null,
      publishedAt: i.published,
    }));
}

async function fromReddit(source: SourceDef, get: Http): Promise<Raw[]> {
  const r = await get(source.url, { accept: "application/json" });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  type Post = {
    data: {
      title: string;
      url: string;
      permalink: string;
      selftext: string;
      is_self: boolean;
      over_18: boolean;
      stickied: boolean;
      created_utc: number;
      domain: string;
    };
  };
  const posts = (JSON.parse(r.text) as { data: { children: Post[] } }).data.children;
  return posts
    .map((p) => p.data)
    .filter(
      (p) =>
        !p.over_18 &&
        !p.stickied &&
        !p.is_self &&
        /^https?:/.test(p.url) &&
        !/(reddit\.com|redd\.it|imgur|youtube|youtu\.be|twitter|x\.com)/.test(p.domain),
    )
    .map((p) => ({
      url: p.url,
      title: decodeEntities(p.title),
      summary: "",
      text: "",
      imageUrl: null,
      imageCredit: null,
      imageLicence: null,
      embedUrl: null,
      publishedAt: new Date(p.created_utc * 1000),
      // Link posts are someone else's article: credit the outlet, not the subreddit.
      sourceName: p.domain.replace(/^www\./, ""),
    }));
}

async function fromApi(source: SourceDef, get: Http, date: string): Promise<Raw[]> {
  if (source.adapter === "nasa-apod") {
    const key = process.env.NASA_API_KEY ?? "DEMO_KEY";
    const r = await get(`${source.url}?api_key=${encodeURIComponent(key)}`, {
      accept: "application/json",
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const a = JSON.parse(r.text) as {
      title: string;
      explanation: string;
      url: string;
      hdurl?: string;
      media_type: string;
      copyright?: string;
      date: string;
    };
    const page = `https://apod.nasa.gov/apod/ap${a.date.slice(2).replace(/-/g, "")}.html`;
    return [
      {
        url: page,
        title: a.title,
        summary: a.explanation.slice(0, 400),
        text: a.explanation,
        imageUrl: a.media_type === "image" ? a.url : null,
        imageCredit: a.copyright ? a.copyright.replace(/\s+/g, " ").trim() : "NASA",
        imageLicence: a.copyright
          ? { licence: "Credited to its source", licenceUrl: page }
          : {
              licence: "Public domain (NASA)",
              licenceUrl: "https://www.nasa.gov/nasa-brand-center/images-and-media/",
            },
        embedUrl: null,
        publishedAt: new Date(`${a.date}T12:00:00Z`),
        sourceName: "NASA APOD",
      },
    ];
  }
  if (source.adapter === "spaceflight-news") {
    const r = await get(source.url, { accept: "application/json" });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const body = JSON.parse(r.text) as {
      results: {
        title: string;
        url: string;
        image_url: string | null;
        news_site: string;
        summary: string;
        published_at: string;
      }[];
    };
    return body.results.map((a) => ({
      url: a.url,
      title: a.title,
      summary: a.summary,
      text: "",
      imageUrl: a.image_url,
      imageCredit: null,
      imageLicence: null,
      embedUrl: null,
      publishedAt: new Date(a.published_at),
      sourceName: a.news_site,
    }));
  }
  if (source.adapter === "scrape") {
    // A listing page: take the article links that match the pattern; the article fetch fills in
    // title, text, date and pictures later.
    const r = await get(source.url, { accept: "text/html", browser: source.browserAgent });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const only = new RegExp(source.linkPattern ?? "^$");
    const links = new Set<string>();
    for (const m of r.text.matchAll(/href=["']([^"'#]+)["']/gi)) {
      try {
        const u = new URL(decodeEntities(m[1]!), r.url);
        u.search = "";
        const href = u.toString().replace(/\/$/, "");
        if (only.test(href) || only.test(`${href}/`)) links.add(href);
      } catch {
        /* not a link */
      }
    }
    if (!links.size) throw new Error("no article links on the listing page");
    return [...links].map((url) => ({
      url,
      // A placeholder until the article page is read (the slug reads as a headline).
      title: (url.split("/").filter(Boolean).at(-1) ?? "").replace(/^a\d+$/, "").replace(/-/g, " "),
      summary: "",
      text: "",
      imageUrl: null,
      imageCredit: null,
      imageLicence: null,
      embedUrl: null,
      publishedAt: null,
      scraped: true,
    }));
  }
  if (source.adapter === "hn-algolia") {
    const r = await get(source.url, { accept: "application/json" });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const body = JSON.parse(r.text) as {
      hits: { title: string; url?: string; points: number; created_at: string }[];
    };
    return body.hits
      .filter(
        (h) => h.url && /^https?:/.test(h.url) && !/github\.com|youtube|twitter|x\.com/.test(h.url),
      )
      .sort((a, b) => b.points - a.points)
      .map((h) => ({
        url: h.url!,
        title: decodeEntities(h.title),
        summary: "",
        text: "",
        imageUrl: null,
        imageCredit: null,
        imageLicence: null,
        embedUrl: null,
        publishedAt: new Date(h.created_at),
        sourceName: hostOf(h.url!),
      }));
  }
  if (source.adapter === "wikipedia-onthisday") {
    const [, mm, dd] = date.split("-");
    const r = await get(`${source.url}/${mm}/${dd}`, { accept: "application/json" });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    type Page = {
      title: string;
      extract?: string;
      content_urls?: { desktop?: { page?: string } };
      originalimage?: { source: string };
    };
    const body = JSON.parse(r.text) as {
      selected?: { text: string; year: number; pages: Page[] }[];
    };
    return (body.selected ?? []).flatMap((e) => {
      const page = e.pages[0];
      const url = page?.content_urls?.desktop?.page;
      if (!page || !url) return [];
      return [
        {
          url,
          title: `${e.year}: ${e.text}`,
          summary: e.text,
          text: `On this day in ${e.year}: ${e.text}\n\n${e.pages.map((p) => p.extract ?? "").join("\n\n")}`,
          imageUrl: page.originalimage?.source ?? null,
          imageCredit: page.originalimage ? "Wikimedia Commons" : null,
          imageLicence: page.originalimage
            ? { licence: "See the file's Wikimedia Commons page", licenceUrl: url }
            : null,
          embedUrl: null,
          // Anniversaries are always today's news.
          publishedAt: new Date(),
          sourceName: "Wikipedia",
        },
      ];
    });
  }
  throw new Error(`no adapter for ${source.slug}`);
}

export type GatherResult = {
  candidates: Candidate[];
  /** Per-source outcome, for the run log. */
  sources: { slug: string; items: number; error?: string }[];
};

/**
 * Fetch every enabled source. Items older than `maxAgeHours` are skipped; each source contributes at
 * most `perSource` of its newest items.
 */
export async function gather(
  sources: SourceDef[],
  {
    date,
    get = http,
    maxAgeHours = 96,
    perSource = 15,
    now = new Date(),
  }: { date: string; get?: Http; maxAgeHours?: number; perSource?: number; now?: Date },
): Promise<GatherResult> {
  const results: GatherResult["sources"] = [];
  const candidates: Candidate[] = [];
  let n = 0;
  const seen = new Set<string>();
  await mapLimit(sources, 6, async (source) => {
    try {
      const raw =
        source.type === "rss"
          ? await fromFeed(source, get)
          : source.type === "reddit"
            ? await fromReddit(source, get)
            : await fromApi(source, get, date);
      const maxAge = (source.maxAgeHours ?? maxAgeHours) * 3_600_000;
      const fresh = raw
        .filter((r) => r.title && /^https?:\/\//.test(r.url))
        .filter((r) => !r.publishedAt || now.getTime() - r.publishedAt.getTime() < maxAge)
        .slice(0, source.perSource ?? perSource);
      for (const { scraped, ...r } of fresh) {
        if (seen.has(r.url)) continue;
        seen.add(r.url);
        candidates.push({
          ...r,
          images: r.images ?? (r.imageUrl ? imagesOf([r.imageUrl], r.imageCredit) : []),
          ...(source.paywalled ? { paywalled: true } : {}),
          ...(scraped ? { scraped: true, maxAgeHours: source.maxAgeHours ?? maxAgeHours } : {}),
          id: "",
          sourceSlug: source.slug,
          sourceName: r.sourceName ?? source.name,
          sourceSections: source.sections,
          fetchedAt: new Date(),
        });
      }
      results.push({ slug: source.slug, items: fresh.length });
    } catch (e) {
      results.push({ slug: source.slug, items: 0, error: (e as Error).message });
    }
  });
  // Ids are assigned after the parallel fetch so they are stable for a given set of results.
  candidates.sort((a, b) => a.sourceSlug.localeCompare(b.sourceSlug) || a.url.localeCompare(b.url));
  for (const c of candidates) c.id = `c${++n}`;
  return { candidates, sources: results };
}

/**
 * Fetch article text (and the article's own image) for candidates that do not have it yet. A page
 * robots.txt disallows is skipped, and so is the candidate.
 */
export async function fetchArticles(
  candidates: Candidate[],
  { get = http, now = new Date() }: { get?: Http; now?: Date } = {},
) {
  const failures: { candidate: Candidate; reason: string }[] = [];
  await mapLimit(candidates, 8, async (c) => {
    // Paywalled pages are not fetched: the feed summary is the source (see groundOnSummary).
    if (c.paywalled) {
      if (!c.text) c.text = c.summary;
      if (!c.text) failures.push({ candidate: c, reason: "paywalled and the feed had no summary" });
      return;
    }
    if (!(await allowedByRobots(c.url, get))) {
      if (!c.text && c.summary) c.text = c.summary;
      else if (!c.text)
        failures.push({ candidate: c, reason: "robots.txt disallows fetching the article" });
      return;
    }
    try {
      let r = await get(c.url, { accept: "text/html" });
      // A few sites turn away unknown bots but serve browsers; ask once more as one.
      if (r.status === 403) r = await get(c.url, { accept: "text/html", browser: true });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const a = extractArticle(r.text);
      if (c.scraped) {
        if (a.title)
          c.title = decodeEntities(a.title)
            .replace(/\s*[|–-]\s*[^|–-]+$/, "")
            .trim();
        if (a.description) c.summary = decodeEntities(a.description);
        if (a.published) c.publishedAt = a.published;
        const age = c.publishedAt ? now.getTime() - c.publishedAt.getTime() : 0;
        if (!a.published || age > (c.maxAgeHours ?? 96) * 3_600_000) {
          failures.push({ candidate: c, reason: "scraped article is undated or too old" });
          return;
        }
      }
      if (a.text.length > c.text.length) c.text = a.text;
      const found = a.images.flatMap((u) => {
        try {
          return [new URL(u, r.url).toString()];
        } catch {
          return [];
        }
      });
      // The article's own pictures (og:image first) beat the feed's thumbnails.
      const all = [...imagesOf(found), ...(c.images ?? [])];
      const seenKeys = new Set<string>();
      c.images = all.filter((i) => {
        const k = imageKey(i.url);
        if (seenKeys.has(k) || unusableImage(i.url)) return false;
        seenKeys.add(k);
        return true;
      });
      c.imageUrl = c.images[0]?.url ?? null;
      if (a.siteName && c.sourceName === hostOf(c.url)) c.sourceName = decodeEntities(a.siteName);
      if (!c.summary) c.summary = c.text.slice(0, 400);
    } catch (e) {
      // The feed summary can still ground a brief.
      if (!c.text && c.summary.length >= 200 && !c.scraped) c.text = c.summary;
      else if (!c.text)
        failures.push({
          candidate: c,
          reason: `could not fetch the article: ${(e as Error).message}`,
        });
    }
  });
  return failures;
}

export async function mapLimit<T>(items: T[], limit: number, fn: (item: T) => Promise<void>) {
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) await fn(items[next++] as T);
    }),
  );
}
