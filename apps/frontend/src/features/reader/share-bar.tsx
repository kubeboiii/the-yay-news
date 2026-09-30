import "server-only";
import type { Story } from "@repo/shared";
import { cookies } from "next/headers";
import { TZ_COOKIE } from "@/features/editions/timezone";
import { storyHref } from "@/features/papers/reading";
import { CutItOut } from "./cut-it-out";
import { qrPath } from "./qr";
import { ShareButtons } from "./share-buttons";
import { absoluteUrl, clipPath } from "./site";

/**
 * Sharing for a story, below its printed page: each platform's own composer, the clipping for
 * Instagram (the share sheet on a phone; a download and a QR code on a desktop), copy link and
 * email. URLs are made absolute here, on the server, and handed to the client buttons.
 */
export async function ShareBar({ data }: { data: Story }) {
  const issue = data.edition.issueNumber;
  const { slug, headline, dek } = data.story;
  const url = absoluteUrl(storyHref(issue, slug));
  // The clipping only renders once the story is released where the reader is, so pass their zone.
  const tz = (await cookies()).get(TZ_COOKIE)?.value;
  const clip = (format: "story" | "post") =>
    absoluteUrl(`${clipPath(format, issue, slug)}${tz ? `&tz=${encodeURIComponent(tz)}` : ""}`);
  return (
    <ShareButtons
      url={url}
      headline={headline}
      dek={dek}
      storyImage={clip("story")}
      postImage={clip("post")}
      fileName={`the-yay-news-${issue}-${slug}`}
      qr={qrPath(url)}
    />
  );
}

/** "Cut it out" for a story: its clipping as a Stories or square image, shared or downloaded. */
export async function StoryCut({ data }: { data: Story }) {
  const tz = (await cookies()).get(TZ_COOKIE)?.value;
  return (
    <CutItOut
      issue={data.edition.issueNumber}
      slug={data.story.slug}
      headline={data.story.headline}
      tz={tz}
    />
  );
}
