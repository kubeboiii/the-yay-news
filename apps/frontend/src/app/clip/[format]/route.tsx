// GET /clip/story|post|link?issue=<n>&story=<slug|front>[&tz=<IANA zone>]
// GET /clip/story|post|link?story=<slug|front>&look=v1|v3|v4|v5&theme=<v1 colourway>&pastel=<slug>
//
// A story, or the front page, as a torn-out newspaper clipping: 1080×1920 for Stories, 1080×1350
// for a feed post, 1200×630 as the link preview.
//
// With `?issue=` the story comes from that edition through the API, printed in the edition's own
// design and colourway, and only once the edition is released (in `?tz=`, else UTC). Without it the
// Phase 1 sample edition is used, in any look (the /mockups/clippings proofs).
//
// Rendered on demand, then kept in memory. Sample clippings never change, so they are cached for a
// year downstream; real ones for a day, since an edition can still be corrected or pulled.

import { createHash } from "node:crypto";
import { slugSchema } from "@repo/shared";
import { ImageResponse } from "next/og";
import { Clipping, type Format, FORMATS, type Subject } from "../_lib/clipping";
import { editionSubject } from "../_lib/edition";
import { loadFonts } from "../_lib/fonts";
import { type Look, type LookId, LOOKS, lookFor } from "../_lib/looks";
import { sampleSubject } from "../_lib/sample";

const FOREVER = "public, max-age=31536000, immutable";
const A_DAY = "public, max-age=3600, s-maxage=86400";
const rendered = new Map<string, ArrayBuffer>();
const KEEP = 96;

const isFormat = (f: string): f is Format => f in FORMATS;
const isLook = (l: string | null): l is LookId => !!l && (LOOKS as readonly string[]).includes(l);
const notFound = (message: string) => new Response(message, { status: 404 });

export async function GET(request: Request, ctx: RouteContext<"/clip/[format]">) {
  const { format } = await ctx.params;
  if (!isFormat(format)) return notFound("Unknown format: use story, post or link");

  const q = new URL(request.url).searchParams;
  const slug = q.get("story") ?? "front";
  if (slug !== "front" && !slugSchema.safeParse(slug).success) return notFound("Bad story slug");

  let subject: Subject;
  let look: Look;
  let cache: string;
  const issueParam = q.get("issue");
  if (issueParam !== null) {
    const issue = Number(issueParam);
    if (!Number.isInteger(issue) || issue < 1 || String(issue) !== issueParam) {
      return notFound("Bad issue number");
    }
    const tz = q.get("tz");
    const found = await editionSubject(issue, slug, tz && tz.length <= 100 ? tz : null);
    if (!found) return notFound(`No released story "${slug}" in No. ${issue}`);
    ({ subject, look } = found);
    cache = A_DAY;
  } else {
    const sample = sampleSubject(slug);
    if (!sample) return notFound(`No story called "${slug}"`);
    const lookParam = q.get("look");
    subject = sample;
    look = lookFor(isLook(lookParam) ? lookParam : "v1", q.get("theme"), q.get("pastel"));
    cache = FOREVER;
  }

  // Keyed by what is drawn, so a corrected story renders afresh.
  const key = createHash("sha1")
    .update(JSON.stringify([format, look, subject]))
    .digest("base64url");
  const hit = rendered.get(key);
  if (hit) return png(hit, cache);

  const { w, h } = FORMATS[format];
  let body: ArrayBuffer;
  try {
    const image = new ImageResponse(<Clipping look={look} fmt={format} subject={subject} />, {
      width: w,
      height: h,
      fonts: await loadFonts(look.fonts),
    });
    body = await image.arrayBuffer();
  } catch (err) {
    console.error("clipping render failed", format, slug, err);
    return new Response(`Could not render this clipping: ${String(err)}`, { status: 500 });
  }
  if (rendered.size >= KEEP) rendered.delete(rendered.keys().next().value as string);
  rendered.set(key, body);
  return png(body, cache);
}

const png = (body: ArrayBuffer, cache: string) =>
  new Response(body, { headers: { "Content-Type": "image/png", "Cache-Control": cache } });
