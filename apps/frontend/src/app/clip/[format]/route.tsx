// GET /clip/story|post|link?story=<slug|front>&look=v1|v3|v4|v5&theme=<v1 colourway>&pastel=<slug>
//
// A story, or the front page, as a torn-out newspaper clipping: 1080×1920 for Stories, 1080×1350
// for a feed post, 1200×630 as the link preview. Rendered on demand, then kept: in memory here and
// for a year by anything downstream, since a given URL always draws the same picture.

import { ImageResponse } from "next/og";
import { allStories, edition } from "@/app/mockups/_data/sample-edition";
import { Clipping, type Format, FORMATS, type Subject } from "../_lib/clipping";
import { loadFonts } from "../_lib/fonts";
import { type LookId, LOOKS, lookFor } from "../_lib/looks";

const CACHE = "public, max-age=31536000, immutable";
const rendered = new Map<string, ArrayBuffer>();
const KEEP = 96;

const isFormat = (f: string): f is Format => f in FORMATS;
const isLook = (l: string | null): l is LookId => !!l && (LOOKS as readonly string[]).includes(l);

export async function GET(request: Request, ctx: RouteContext<"/clip/[format]">) {
  const { format } = await ctx.params;
  if (!isFormat(format))
    return new Response("Unknown format: use story, post or link", { status: 404 });

  const q = new URL(request.url).searchParams;
  const slug = q.get("story") ?? "front";
  const lookParam = q.get("look");
  const lookId: LookId = isLook(lookParam) ? lookParam : "v1";
  const theme = q.get("theme");
  const pastel = q.get("pastel");

  const subject: Subject | null =
    slug === "front"
      ? { kind: "front", story: edition.lead }
      : (() => {
          const story = allStories.find((s) => s.slug === slug);
          return story ? { kind: "story", story } : null;
        })();
  if (!subject) return new Response(`No story called "${slug}"`, { status: 404 });

  const key = [format, slug, lookId, theme ?? "", pastel ?? ""].join("|");
  const hit = rendered.get(key);
  if (hit) return png(hit);

  const look = lookFor(lookId, theme, pastel);
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
    console.error("clipping render failed", key, err);
    return new Response(`Could not render this clipping: ${String(err)}`, { status: 500 });
  }
  if (rendered.size >= KEEP) rendered.delete(rendered.keys().next().value as string);
  rendered.set(key, body);
  return png(body);
}

const png = (body: ArrayBuffer) =>
  new Response(body, { headers: { "Content-Type": "image/png", "Cache-Control": CACHE } });
