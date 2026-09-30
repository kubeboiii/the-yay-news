// GET /issue/<n>/zine[?now=] — the edition as a printable one-sheet mini zine: an A4 landscape PDF
// that folds, with one cut, into an eight-page booklet (see features/zine/build.ts). Only served
// once the edition is out where the reader is, like every reader page; `?now=` previews outside
// production. Built on demand and kept in memory for a while.

import { getEdition, issueParam } from "@/features/editions/api";
import { buildZine } from "@/features/zine/build";

const kept = new Map<string, { at: number; pdf: Promise<Buffer> }>();
const TTL = 10 * 60 * 1000;
const KEEP = 24;

const isNotFound = (e: unknown) =>
  typeof e === "object" &&
  e !== null &&
  "digest" in e &&
  typeof e.digest === "string" &&
  e.digest.includes("404");

export async function GET(request: Request, ctx: RouteContext<"/issue/[issue]/zine">) {
  const now = new URL(request.url).searchParams.get("now");
  const preview = process.env.NODE_ENV !== "production" && now ? { now } : {};
  let edition;
  try {
    edition = await getEdition(issueParam((await ctx.params).issue), preview);
  } catch (e) {
    if (isNotFound(e)) return new Response("No such edition (yet)", { status: 404 });
    throw e;
  }
  const key = `${edition.issueNumber}:${edition.design}:${edition.colourway}:${JSON.stringify(edition.pages.map((p) => p.stories.map((s) => s.slug)))}`;
  let hit = kept.get(key);
  if (!hit || Date.now() - hit.at > TTL) {
    hit = { at: Date.now(), pdf: buildZine(edition) };
    hit.pdf.catch(() => kept.delete(key));
    if (kept.size >= KEEP) kept.delete(kept.keys().next().value as string);
    kept.set(key, hit);
  }
  let pdf: Buffer;
  try {
    pdf = await hit.pdf;
  } catch (err) {
    console.error("zine build failed", edition.issueNumber, err);
    return new Response("Couldn't fold the zine just now.", { status: 500 });
  }
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="the-yay-news-${edition.issueNumber}-mini-zine.pdf"`,
      "Cache-Control": "private, max-age=600",
    },
  });
}
