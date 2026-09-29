import {
  archiveQuerySchema,
  dateParamSchema,
  issueParamSchema,
  readerQuerySchema,
} from "@repo/shared";
import { Hono } from "hono";
import { validate } from "../../lib/validator.js";
import { setEditionCache } from "./cache.js";
import { editionService } from "./edition.service.js";
import { readerFrom, TIME_ZONE_HEADER } from "./reader.js";

export const editionRoutes = new Hono()
  // Registered before "/:issue" so "today" isn't read as an issue number.
  .get("/today", validate("query", readerQuerySchema), async (c) => {
    const reader = readerFrom(c.req.valid("query"), c.req.header(TIME_ZONE_HEADER));
    const data = await editionService.today(reader);
    setEditionCache(c, "today", reader);
    return c.json({ data });
  })
  .get(
    "/date/:date",
    validate("param", dateParamSchema),
    validate("query", readerQuerySchema),
    async (c) => {
      const reader = readerFrom(c.req.valid("query"), c.req.header(TIME_ZONE_HEADER));
      const data = await editionService.getByDate(c.req.valid("param").date, reader);
      setEditionCache(c, "released", reader);
      return c.json({ data });
    },
  )
  .get(
    "/:issue",
    validate("param", issueParamSchema),
    validate("query", readerQuerySchema),
    async (c) => {
      const reader = readerFrom(c.req.valid("query"), c.req.header(TIME_ZONE_HEADER));
      const data = await editionService.getByIssue(c.req.valid("param").issue, reader);
      setEditionCache(c, "released", reader);
      return c.json({ data });
    },
  )
  .get("/", validate("query", archiveQuerySchema), async (c) => {
    const { cursor, limit, ...query } = c.req.valid("query");
    const reader = readerFrom(query, c.req.header(TIME_ZONE_HEADER));
    const data = await editionService.archive({ cursor, limit }, reader);
    // The first page gains an edition every morning, so it gets the short policy.
    setEditionCache(c, "today", reader);
    return c.json({ data });
  });
