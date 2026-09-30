import { searchQuerySchema } from "@repo/shared";
import { Hono } from "hono";
import { validate } from "../../lib/validator.js";
import { setEditionCache } from "../editions/cache.js";
import { readerFrom, TIME_ZONE_HEADER } from "../editions/reader.js";
import { searchService } from "./search.service.js";

/** GET /api/v1/search?q=octopus: find a story again, grouped by the paper it ran in. */
export const searchRoutes = new Hono().get("/", validate("query", searchQuerySchema), async (c) => {
  const { q, ...query } = c.req.valid("query");
  const reader = readerFrom(query, c.req.header(TIME_ZONE_HEADER));
  const data = await searchService.search(q, reader);
  // A new paper every morning can add results, so the short policy.
  setEditionCache(c, "today", reader);
  return c.json({ data });
});
