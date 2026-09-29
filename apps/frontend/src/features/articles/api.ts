import "server-only";
import { articleSchema, type ArticleListQuery } from "@repo/shared";
import { z } from "zod";
import { ApiRequestError, apiGet } from "@/lib/api/client";

export function listArticles(query: Partial<ArticleListQuery> = {}) {
  const params = new URLSearchParams();
  if (query.category) params.set("category", query.category);
  if (query.limit) params.set("limit", String(query.limit));
  const qs = params.size ? `?${params}` : "";
  return apiGet(`/api/v1/articles${qs}`, z.object({ data: z.array(articleSchema) }));
}

/** Returns `null` when the article does not exist. */
export async function getArticle(slug: string) {
  try {
    const { data } = await apiGet(
      `/api/v1/articles/${encodeURIComponent(slug)}`,
      z.object({ data: articleSchema }),
    );
    return data;
  } catch (e) {
    if (e instanceof ApiRequestError && e.status === 404) return null;
    throw e;
  }
}
