import { describe, expect, it } from "vitest";
import {
  type Http,
  allowedByRobots,
  extractArticle,
  gather,
  parseFeed,
} from "../src/stages/gather.ts";

const RSS = `<?xml version="1.0"?><rss><channel>
<item><title><![CDATA[Otters &amp; friends juggle]]></title><link>https://example.org/otters</link>
<description><![CDATA[<p>A <b>raft</b> of otters.</p>]]></description>
<pubDate>Thu, 01 Oct 2026 08:00:00 GMT</pubDate>
<media:content url="https://example.org/otters.jpg" medium="image"/></item>
<item><title>Old news</title><link>https://example.org/old</link><pubDate>Mon, 01 Jan 2024 08:00:00 GMT</pubDate></item>
</channel></rss>`;

const ATOM = `<feed><entry><title>A comet</title><link rel="alternate" href="https://example.org/comet"/>
<summary>Bright.</summary><updated>2026-10-01T09:00:00Z</updated></entry></feed>`;

describe("gather", () => {
  it("parses RSS and Atom", () => {
    expect(parseFeed(RSS)[0]).toMatchObject({
      title: "Otters & friends juggle",
      link: "https://example.org/otters",
      summary: "A raft of otters.",
      image: "https://example.org/otters.jpg",
    });
    expect(parseFeed(ATOM)[0]).toMatchObject({
      title: "A comet",
      link: "https://example.org/comet",
      summary: "Bright.",
    });
  });

  it("extracts an article's paragraphs, image and site name", () => {
    const html = `<html><head><meta property="og:image" content="/pic.jpg"><meta property="og:site_name" content="The Otter Times"></head>
<body><nav><p>Menu menu menu menu menu menu menu menu menu menu</p></nav><article><p>The otters of Leeds have learned to juggle small pebbles in the harbour.</p>
<p>Subscribe to our newsletter for more stories like this one every day</p><p>Short.</p></article></body></html>`;
    const a = extractArticle(html);
    expect(a.text).toBe("The otters of Leeds have learned to juggle small pebbles in the harbour.");
    expect(a).toMatchObject({ image: "/pic.jpg", siteName: "The Otter Times" });
  });

  it("respects robots.txt", async () => {
    const get: Http = async (url) => ({
      ok: true,
      status: 200,
      url,
      text: "User-agent: *\nDisallow: /private/\n",
    });
    expect(await allowedByRobots("https://robots.example/private/page", get)).toBe(false);
    expect(await allowedByRobots("https://robots.example/public/page", get)).toBe(true);
  });

  it("gathers fresh items from each source and records broken ones", async () => {
    const get: Http = async (url) =>
      url.includes("broken")
        ? { ok: false, status: 500, url, text: "" }
        : { ok: true, status: 200, url, text: RSS };
    const out = await gather(
      [
        {
          slug: "ok",
          name: "OK Feed",
          url: "https://ok.example/feed",
          type: "rss",
          sections: ["discoveries"],
        },
        {
          slug: "broken",
          name: "Broken",
          url: "https://broken.example/feed",
          type: "rss",
          sections: ["tech"],
        },
      ],
      { date: "2026-10-04", get, now: new Date("2026-10-02T00:00:00Z") },
    );
    expect(out.candidates.map((c) => [c.id, c.title, c.sourceName])).toEqual([
      ["c1", "Otters & friends juggle", "OK Feed"],
    ]);
    expect(out.sources).toContainEqual({ slug: "broken", items: 0, error: "HTTP 500" });
  });
});
