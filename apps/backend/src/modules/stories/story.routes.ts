import { readerQuerySchema, storyParamSchema } from "@repo/shared";
import { Hono } from "hono";
import { validate } from "../../lib/validator.js";
import { setEditionCache } from "../editions/cache.js";
import { readerFrom, TIME_ZONE_HEADER } from "../editions/reader.js";
import { storyService } from "./story.service.js";

/** Mounted under /api/v1/editions: every story lives inside the edition it was printed in. */
export const storyRoutes = new Hono().get(
  "/:issue/stories/:slug",
  validate("param", storyParamSchema),
  validate("query", readerQuerySchema),
  async (c) => {
    const reader = readerFrom(c.req.valid("query"), c.req.header(TIME_ZONE_HEADER));
    const { issue, slug } = c.req.valid("param");
    const data = await storyService.get(issue, slug, reader);
    setEditionCache(c, "released", reader);
    return c.json({ data });
  },
);
