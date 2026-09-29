import "server-only";
import { env } from "@/config/env";

/** The site's origin, for metadataBase. */
export const siteUrl = new URL(env.SITE_URL);

/** An absolute URL on this site for a path like "/issue/41". */
export const absoluteUrl = (path: string) => new URL(path, siteUrl).toString();

type ClipFormat = "story" | "post" | "link";

/** The path of a story's clipping in one of its three formats (see app/clip/[format]). */
export const clipPath = (format: ClipFormat, issue: number, story: string) =>
  `/clip/${format}?issue=${issue}&story=${encodeURIComponent(story)}`;
