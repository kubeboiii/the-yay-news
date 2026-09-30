// The 2026-09 newsroom improvements: more sources (scrapes, Hacker News, paywalled feeds), several
// pictures per story, corroboration from other outlets, the prominence signal and the tone rules.
import { describe, expect, it } from "vitest";
import { PROMINENT, loadProminent, prominenceBoost, prominentIn } from "../src/prominence.ts";
import { SOURCES } from "../src/sources.ts";
import { blocklistHit } from "../src/stages/blocklist.ts";
import { corroborate } from "../src/stages/dedup.ts";
import {
  type Http,
  extractArticle,
  fetchArticles,
  gather,
  fullSize,
  imageKey,
  parseFeed,
  unusableImage,
} from "../src/stages/gather.ts";
import { type Presser, illustrate, picturesOf } from "../src/stages/illustrate.ts";
import { CORE_SECTIONS, type SectionSlug } from "../src/types.ts";
import { candidate } from "./fixtures.ts";

const now = new Date("2026-10-03T12:00:00Z");
const site =
  (pages: Record<string, string>): Http =>
  async (url) =>
    pages[url] !== undefined
      ? { ok: true, status: 200, url, text: pages[url]! }
      : { ok: false, status: 404, url, text: "" };

describe("the allowlist", () => {
  it("has unique slugs, valid patterns and feeds every section", () => {
    const slugs = SOURCES.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of SOURCES) {
      if (s.linkPattern) expect(() => new RegExp(s.linkPattern!)).not.toThrow();
      if (s.adapter === "scrape") expect(s.linkPattern).toBeTruthy();
    }
    for (const section of [...CORE_SECTIONS, "time-machine", "art-and-design"] as SectionSlug[]) {
      expect(SOURCES.filter((s) => s.sections[0] === section).length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe("pictures in feeds and articles", () => {
  it("collects every picture an item carries, without logos or repeats", () => {
    const [item] = parseFeed(`<rss><item><title>Pandas</title><link>https://ex.org/p</link>
<media:content url="https://ex.org/a.jpg" medium="image"/>
<media:content url="https://ex.org/a.jpg?w=300" medium="image"/>
<media:thumbnail url="https://ex.org/site-logo.png"/>
<content:encoded><![CDATA[<p><img src="https://ex.org/b.jpg"></p>]]></content:encoded></item></rss>`);
    expect(item!.images).toEqual(["https://ex.org/a.jpg", "https://ex.org/b.jpg"]);
  });

  it("takes og:image and wide in-article pictures, skipping thumbnails and avatars", () => {
    const a = extractArticle(`<head><meta property="og:image" content="https://ex.org/lead.jpg">
<meta property="article:published_time" content="2026-10-03T08:00:00Z"></head><article>
<img src="https://ex.org/wide.jpg" width="1200"><img src="https://ex.org/tiny.jpg" width="150">
<img src="https://ex.org/author-avatar.jpg" width="1200">
<img srcset="https://ex.org/s-400.jpg 400w, https://ex.org/s-1600.jpg 1600w">
<p>The pandas of Chengdu have taken up gentle morning stretches in the sunshine.</p></article>`);
    expect(a.images).toEqual([
      "https://ex.org/lead.jpg",
      "https://ex.org/wide.jpg",
      "https://ex.org/s-1600.jpg",
    ]);
    expect(a.published?.toISOString()).toBe("2026-10-03T08:00:00.000Z");
  });

  it("treats resized copies of a picture as the same picture, but not different pictures", () => {
    expect(imageKey("https://ex.org/cat-1024x768.jpg?w=300&h=200")).toBe(
      imageKey("https://ex.org/cat.jpg"),
    );
    // CDNs that name the picture in the query string are different pictures.
    expect(imageKey("https://cdn.ex/i?img=a.jpg")).not.toBe(imageKey("https://cdn.ex/i?img=b.jpg"));
  });

  it("asks for the full-size copy of a feed thumbnail", () => {
    expect(fullSize("https://ex.org/wp-content/uploads/pic-480x320.jpg?w=237&h=147&crop=1")).toBe(
      "https://ex.org/wp-content/uploads/pic.jpg",
    );
    expect(fullSize("https://ichef.bbci.co.uk/ace/standard/240/cpsprodpb/x.jpg")).toBe(
      "https://ichef.bbci.co.uk/ace/standard/1024/cpsprodpb/x.jpg",
    );
  });

  it("judges logos on the file name, not on folders", () => {
    expect(unusableImage("https://ex.org/img/1600x900/logo/Gemini_photo.png")).toBe(false);
    expect(unusableImage("https://ex.org/assets/site-logo.png")).toBe(true);
    expect(unusableImage("https://ex.org/authors/jane.jpg")).toBe(true);
  });
});

describe("new source adapters", () => {
  it("scrapes a listing page and dates each article from its own page", async () => {
    const get = site({
      "https://news.ex.org/list": `<a href="/news/pandas-learn-to-dance-daily">x</a>
<a href="/news/old-story-from-last-year">y</a><a href="/about">z</a>`,
      "https://news.ex.org/robots.txt": "",
      "https://news.ex.org/news/pandas-learn-to-dance-daily": `<meta property="og:title" content="Pandas learn to dance | Ex News">
<meta property="og:description" content="A dance class for pandas.">
<meta property="article:published_time" content="2026-10-03T06:00:00Z"><article><p>${"The pandas dance every morning in the zoo garden. ".repeat(10)}</p></article>`,
      "https://news.ex.org/news/old-story-from-last-year": `<meta property="article:published_time" content="2025-01-01T06:00:00Z"><article><p>${"Old text here for the story that ran long ago. ".repeat(5)}</p></article>`,
    });
    const g = await gather(
      [
        {
          slug: "ex",
          name: "Ex News",
          url: "https://news.ex.org/list",
          type: "api",
          adapter: "scrape",
          linkPattern: "^https://news\\.ex\\.org/news/[a-z-]{10,}$",
          sections: ["discoveries"],
        },
      ],
      { date: "2026-10-04", get, now },
    );
    expect(g.candidates).toHaveLength(2);
    const failures = await fetchArticles(g.candidates, { get, now });
    expect(failures.map((f) => f.candidate.url)).toEqual([
      "https://news.ex.org/news/old-story-from-last-year",
    ]);
    const panda = g.candidates.find((c) => c.url.includes("pandas"))!;
    expect(panda).toMatchObject({
      title: "Pandas learn to dance",
      summary: "A dance class for pandas.",
    });
  });

  it("reads the Hacker News front page, best first", async () => {
    // With room for one item, the highest-scoring link wins; self posts are skipped.
    const get = site({
      "https://hn.example/api": JSON.stringify({
        hits: [
          {
            title: "Small",
            url: "https://a.org/1",
            points: 200,
            created_at: "2026-10-03T01:00:00Z",
          },
          { title: "Big", url: "https://b.org/2", points: 900, created_at: "2026-10-03T01:00:00Z" },
          { title: "Ask HN", points: 999, created_at: "2026-10-03T01:00:00Z" },
        ],
      }),
    });
    const g = await gather(
      [
        {
          slug: "hn",
          name: "Hacker News",
          url: "https://hn.example/api",
          type: "api",
          adapter: "hn-algolia",
          perSource: 1,
          sections: ["tech"],
        },
      ],
      { date: "2026-10-04", get, now },
    );
    expect(g.candidates.map((c) => [c.title, c.sourceName])).toEqual([["Big", "b.org"]]);
  });

  it("keeps only matching links from a filtered feed, and grounds paywalled items on the summary", async () => {
    const get = site({
      "https://pay.ex/feed": `<rss><item><title>Nature news</title><link>https://pay.ex/articles/d41586-1</link>
<description>${"A long and cheerful summary of the finding. ".repeat(6)}</description><pubDate>Fri, 02 Oct 2026 08:00:00 GMT</pubDate></item>
<item><title>A paper</title><link>https://pay.ex/articles/s123</link><pubDate>Fri, 02 Oct 2026 08:00:00 GMT</pubDate></item></rss>`,
    });
    const g = await gather(
      [
        {
          slug: "pay",
          name: "Pay",
          url: "https://pay.ex/feed",
          type: "rss",
          linkPattern: "/articles/d41586-",
          paywalled: true,
          sections: ["discoveries"],
        },
      ],
      { date: "2026-10-04", get, now },
    );
    expect(g.candidates.map((c) => c.title)).toEqual(["Nature news"]);
    expect(await fetchArticles(g.candidates, { get, now })).toEqual([]);
    expect(g.candidates[0]!.text).toBe(g.candidates[0]!.summary);
  });
});

describe("corroboration", () => {
  it("backs a thin story with other outlets' text and pictures", () => {
    const thin = { ...candidate("money", 1), text: "Short summary.", images: [] };
    const other = {
      ...candidate("money", 2),
      sourceName: "Other Outlet",
      images: [{ url: "https://o.org/x.jpg", credit: null, alt: null }],
    };
    corroborate([thin], [{ item: other, twinId: thin.id }]);
    expect(thin.text).toContain("Other coverage (Other Outlet)");
    expect(thin.images).toEqual([
      { url: "https://o.org/x.jpg", credit: "Other Outlet", alt: null },
    ]);
  });
});

describe("illustrate with several pictures", () => {
  const press: Presser = async (url, issue, slug, minWidth) =>
    url.includes("small") && (minWidth ?? 0) >= 800 ? null : `/editions/${issue}/${slug}.jpg`;

  it("presses up to the story's allowance, credits each, and never reuses a picture", async () => {
    const lead = {
      ...candidate("tech", 1),
      imageUrl: "https://x.org/a.jpg",
      imageCredit: "Ada Photo",
      images: [
        { url: "https://x.org/b.jpg", credit: "Bo Pix", alt: null },
        { url: "https://x.org/small.jpg", credit: null, alt: null },
        { url: "https://x.org/c.jpg", credit: null, alt: null },
        { url: "https://x.org/d.jpg", credit: null, alt: null },
      ],
    };
    const brief = {
      ...candidate("tech", 2),
      imageUrl: "https://x.org/a.jpg",
      images: [{ url: "https://x.org/e.jpg", credit: null, alt: null }],
    };
    const out = await illustrate(
      [
        { slug: "lead", headline: "Lead", candidate: lead, max: 3 },
        { slug: "brief", headline: "Brief", candidate: brief, max: 1 },
      ],
      { issue: 46, press },
    );
    const l = out.get("lead")!.images;
    expect(l.map((i) => i.url)).toEqual([
      "/editions/46/lead.jpg",
      "/editions/46/lead-2.jpg",
      "/editions/46/lead-3.jpg",
    ]);
    expect(l.map((i) => i.credit)).toEqual(["Ada Photo", "Bo Pix", lead.sourceName]);
    // Every story gets one picture first; the brief's first was the lead's, so it takes its next.
    expect(out.get("brief")!.images.map((i) => i.url)).toEqual(["/editions/46/brief.jpg"]);
    expect(picturesOf(brief)).toHaveLength(2);
  });
});

describe("prominence and tone", () => {
  it("reads the editable entity list and finds whole names only", () => {
    expect(loadProminent()["sports"]).toContain("Premier League");
    expect(prominentIn("Arsenal win the Premier League", "sports")).toEqual(
      expect.arrayContaining(["Arsenal", "Premier League"]),
    );
    expect(prominentIn("Tomorrowland tickets", "music")).toContain("Tomorrowland");
    expect(prominentIn("a formula for bread", "sports")).toEqual([]);
    expect(
      prominenceBoost({ title: "Zendaya joins Dune", summary: "", section: "screen" }),
    ).toBeGreaterThan(0);
    expect(Object.keys(PROMINENT)).toEqual(expect.arrayContaining([...CORE_SECTIONS]));
  });

  it.each([
    "Commuters endure a sweltering subway ride",
    "Workers push back on return-to-office rules",
    "Star striker banned for three matches",
    "Fans furious after derby",
  ])("rejects the gripe %j", (h) => expect(blocklistHit(h)).not.toBeNull());
});
