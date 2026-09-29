import { articleListQuerySchema, slugSchema } from "@repo/shared";
import { Hono } from "hono";
import { z } from "zod";
import { validate } from "../../lib/validator.js";
import { articleService } from "./article.service.js";

export const articleRoutes = new Hono()
  .get("/", validate("query", articleListQuerySchema), async (c) => {
    const data = await articleService.list(c.req.valid("query"));
    return c.json({ data });
  })
  .get("/:slug", validate("param", z.object({ slug: slugSchema })), async (c) => {
    const data = await articleService.getBySlug(c.req.valid("param").slug);
    return c.json({ data });
  });
