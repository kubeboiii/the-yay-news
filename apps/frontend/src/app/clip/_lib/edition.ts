// Clipping subjects from real editions (`?issue=<n>&story=<slug|front>`), read from the API the same
// way the reader does: an edition is only served once it has reached 07:00 in the reader's timezone,
// passed through as `?tz=` (a crawler fetching a link preview sends none, so it gets UTC).

import "server-only";
import {
  type EditionSummary,
  type Image,
  type StoryItem,
  editionSchema,
  storySchema,
} from "@repo/shared";
import { z } from "zod";
import { ApiRequestError, apiGet } from "@/lib/api/client";
import { type Picture, photoSrc } from "./assets";
import type { ClipIssue, Subject } from "./clipping";
import { editionLook, type Look } from "./looks";

const TAGLINE = "Only good news. Mostly fun. Occasionally weird.";

function picture(image: Image | undefined | null): Picture | null {
  if (!image) return null;
  const kind = image.kind === "photo" ? "Photograph" : "Illustration";
  return {
    src: photoSrc(image.url),
    alt: image.alt,
    credit: `${kind}: ${image.credit}${image.licence ? ` / ${image.licence.replace(/ License$/, "")}` : ""}`,
    focus: "50% 50%",
  };
}

const clipStory = (s: StoryItem) => ({
  slug: s.slug,
  section: s.section.name,
  kicker: s.kicker,
  headline: s.headline,
  dek: s.dek,
  body: s.body,
  sticker: s.sticker,
});

const long = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
const short = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function issueOf(e: EditionSummary, inside: ClipIssue["inside"]): ClipIssue {
  const d = new Date(`${e.date}T00:00:00Z`);
  return {
    date: long.format(d).replace(/^(\w+) /, "$1, "),
    shortDate: short.format(d),
    volume: e.volume,
    issue: e.issueNumber,
    tagline: TAGLINE,
    inside,
  };
}

export type EditionSubject = { subject: Subject; look: Look };

const envelope = <T extends z.ZodType>(schema: T) => z.object({ data: schema });

/** Reads an API path, or null when the API says there is nothing (yet) at it. */
async function read<T extends z.ZodType>(path: string, schema: T): Promise<z.infer<T> | null> {
  try {
    const body = (await apiGet(path, envelope(schema))) as { data: z.infer<T> };
    return body.data;
  } catch (error) {
    if (error instanceof ApiRequestError && (error.status === 404 || error.status === 400)) {
      return null;
    }
    throw error;
  }
}

/**
 * A story of a released edition, or its front page when `slug` is "front", ready to print; null
 * when there is no such story, or it has not been released where the reader is.
 */
export async function editionSubject(
  issue: number,
  slug: string,
  tz: string | null,
): Promise<EditionSubject | null> {
  const qs = tz ? `?tz=${encodeURIComponent(tz)}` : "";

  if (slug === "front") {
    const edition = await read(`/api/v1/editions/${issue}${qs}`, editionSchema);
    if (!edition) return null;
    const pages = [...edition.pages].sort((a, b) => a.order - b.order);
    const front = pages.find((p) => p.layout === "front") ?? pages[0];
    const lead = front?.stories.find((s) => s.slot === "lead") ?? front?.stories[0];
    if (!lead) return null;
    const inside = pages
      .filter((p) => p.section && p.stories.length > 0)
      .map((p) => ({ name: p.section!.name, head: p.stories[0]!.headline }));
    return {
      look: editionLook(edition),
      subject: {
        kind: "front",
        story: clipStory(lead),
        issue: issueOf(edition, inside),
        picture: picture(lead.images[0]),
        continuedOn: front?.order ?? 1,
      },
    };
  }

  const data = await read(
    `/api/v1/editions/${issue}/stories/${encodeURIComponent(slug)}${qs}`,
    storySchema,
  );
  if (!data) return null;
  return {
    look: editionLook(data.edition),
    subject: {
      kind: "story",
      story: clipStory(data.story),
      issue: issueOf(data.edition, []),
      picture: picture(data.story.images[0]),
      continuedOn: data.page.order,
    },
  };
}
