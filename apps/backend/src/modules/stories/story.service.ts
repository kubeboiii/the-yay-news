import { storySchema, type Story } from "@repo/shared";
import { NotFoundError } from "../../lib/errors.js";
import { readingOrder, summariseEdition, toStoryItem } from "../editions/edition.mapper.js";
import { editionRepository } from "../editions/edition.repository.js";
import { visibleTo } from "../editions/edition.service.js";
import type { Reader } from "../editions/reader.js";

const neighbour = (s: { slug: string; headline: string } | undefined) =>
  s ? { slug: s.slug, headline: s.headline } : null;

export const storyService = {
  /** One story of a released edition, with its neighbours in reading order. */
  async get(issueNumber: number, slug: string, reader: Reader): Promise<Story> {
    const edition = await editionRepository.findByIssue(issueNumber);
    // An unreleased edition's stories are as invisible as the edition itself.
    if (!visibleTo(edition, reader)) throw new NotFoundError("Story");

    const stories = readingOrder(edition);
    const index = stories.findIndex((s) => s.slug === slug);
    const story = stories[index];
    if (!story) throw new NotFoundError("Story");
    const page = edition.pages.find((p) => p.id === story.pageId);
    if (!page) throw new NotFoundError("Story");

    return storySchema.parse({
      story: toStoryItem(story),
      edition: summariseEdition(edition),
      page: { order: page.order, layout: page.layout, section: page.section },
      prev: neighbour(stories[index - 1]),
      next: neighbour(stories[index + 1]),
    });
  },
};
