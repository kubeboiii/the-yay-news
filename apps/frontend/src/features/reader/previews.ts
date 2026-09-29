import "server-only";
import type { EditionSummary, StoryItem } from "@repo/shared";
import type { Metadata } from "next";
import { clipPath } from "./site";

// Link previews: every story, and every page of an edition, unfurls as its 1200×630 clipping.

type Preview = {
  title: string;
  description: string;
  /** The page's own path, e.g. "/issue/41/story/…". */
  path: string;
  issue: number;
  /** The story to clip, or "front" for the edition's front page. */
  clip: string;
  alt: string;
  type?: "article" | "website";
};

export function linkPreview({
  title,
  description,
  path,
  issue,
  clip,
  alt,
  type = "article",
}: Preview): Pick<Metadata, "openGraph" | "twitter" | "alternates"> {
  const image = { url: clipPath("link", issue, clip), width: 1200, height: 630, alt };
  return {
    alternates: { canonical: path },
    openGraph: {
      type,
      siteName: "The Yay News",
      title,
      description,
      url: path,
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

/** The preview for an edition's front page: its front-page clipping (the lead story). */
export function frontPreview(
  edition: Pick<EditionSummary, "issueNumber" | "lead">,
  path: string,
): ReturnType<typeof linkPreview> {
  const lead = edition.lead;
  return linkPreview({
    title: lead ? lead.headline : `No. ${edition.issueNumber}`,
    description: `The front page of The Yay News, No. ${edition.issueNumber}: only good news, mostly fun, occasionally weird.`,
    path,
    issue: edition.issueNumber,
    clip: "front",
    alt: lead ? `Front page clipping: ${lead.headline}` : `The Yay News No. ${edition.issueNumber}`,
    type: "website",
  });
}

/** The preview for a story (or an inside page, by its first story). */
export function storyPreview(
  issue: number,
  story: Pick<StoryItem, "slug" | "headline" | "dek">,
  path: string,
): ReturnType<typeof linkPreview> {
  return linkPreview({
    title: story.headline,
    description: story.dek,
    path,
    issue,
    clip: story.slug,
    alt: `Newspaper clipping: ${story.headline}`,
  });
}
