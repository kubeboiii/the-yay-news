import { prisma, type Prisma } from "@repo/db";
import type { ArticleListQuery } from "@repo/shared";
import { NotFoundError } from "../../lib/errors.js";

// Only the fields the public contract exposes.
const articleSelect = {
  id: true,
  slug: true,
  title: true,
  summary: true,
  body: true,
  imageUrl: true,
  publishedAt: true,
  category: { select: { id: true, slug: true, name: true } },
} satisfies Prisma.ArticleSelect;

export const articleService = {
  list({ category, limit }: ArticleListQuery) {
    return prisma.article.findMany({
      where: category ? { category: { slug: category } } : undefined,
      select: articleSelect,
      orderBy: { publishedAt: "desc" },
      take: limit,
    });
  },

  async getBySlug(slug: string) {
    const article = await prisma.article.findUnique({ where: { slug }, select: articleSelect });
    if (!article) throw new NotFoundError("Article");
    return article;
  },
};
