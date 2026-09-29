import type { Edition, Story } from "@repo/shared";
import type { EditionPage, PageLink, Reading, StoryLinks } from "./types";

export const issueHref = (issue: number) => `/issue/${issue}`;

export function pageSlug(page: Pick<EditionPage, "order" | "layout" | "section">): string {
  if (page.layout === "front") return "";
  if (page.layout === "back") return "back";
  return page.section?.slug ?? `page-${page.order}`;
}

export function pageLabel(page: Pick<EditionPage, "layout" | "section">): string {
  if (page.layout === "front") return "Front page";
  if (page.layout === "back") return "Back page";
  return page.section?.name ?? "Inside";
}

export const pageHref = (issue: number, slug: string) =>
  slug ? `${issueHref(issue)}/${slug}` : issueHref(issue);

export const storyHref = (issue: number, slug: string) => `${issueHref(issue)}/story/${slug}`;

export function pageLinks(edition: Edition): PageLink[] {
  return [...edition.pages]
    .sort((a, b) => a.order - b.order)
    .map((p) => {
      const slug = pageSlug(p);
      return {
        order: p.order,
        slug,
        label: pageLabel(p),
        href: pageHref(edition.issueNumber, slug),
      };
    });
}

export function readingFor(edition: Edition, page: EditionPage): Reading {
  const pages = pageLinks(edition);
  const i = pages.findIndex((p) => p.order === page.order);
  const current = pages[i]!;
  return {
    pages,
    current,
    prev: pages[i - 1] ?? null,
    next: pages[i + 1] ?? null,
    pageFor: (sectionSlug) => pages.find((p) => p.slug === sectionSlug) ?? null,
    storyHref: (slug) => storyHref(edition.issueNumber, slug),
  };
}

export function storyLinks(data: Story): StoryLinks {
  const issue = data.edition.issueNumber;
  const neighbour = (n: Story["prev"]) =>
    n ? { href: storyHref(issue, n.slug), headline: n.headline } : null;
  return {
    edition: issueHref(issue),
    page: pageHref(issue, pageSlug(data.page)),
    prev: neighbour(data.prev),
    next: neighbour(data.next),
  };
}
