import { issueParamSchema } from "@repo/shared";
import { Hono } from "hono";
import { z } from "zod";
import { AppError } from "../../lib/errors.js";
import { validate } from "../../lib/validator.js";
import {
  adminPassword,
  checkLoginAllowed,
  endSession,
  passwordMatches,
  recordLoginFailure,
  recordLoginSuccess,
  requireSession,
  startSession,
} from "./admin.auth.js";
import { adminService } from "./admin.service.js";

// The emergency control (PLAN §9): pull a story, pull or republish an edition, roll back. Every
// response is private and uncached; every action is logged.

const loginSchema = z.object({ password: z.string().min(1).max(200) });
const listQuerySchema = z.object({ limit: z.coerce.number().int().min(1).max(60).default(14) });
const storyParamSchema = issueParamSchema.extend({ slug: z.string().min(1).max(120) });

const audit = (action: string, detail: unknown) =>
  console.warn(`[admin] ${new Date().toISOString()} ${action}`, JSON.stringify(detail));

export const adminRoutes = new Hono()
  .use(async (c, next) => {
    await next();
    c.header("Cache-Control", "no-store");
  })
  .post("/login", validate("json", loginSchema), async (c) => {
    const expected = adminPassword();
    checkLoginAllowed(c);
    if (!passwordMatches(c.req.valid("json").password, expected)) {
      recordLoginFailure(c);
      throw new AppError(401, "WRONG_PASSWORD", "That isn't the password");
    }
    recordLoginSuccess(c);
    await startSession(c);
    return c.json({ data: { ok: true } });
  })
  .post("/logout", (c) => {
    endSession(c);
    return c.json({ data: { ok: true } });
  })
  .use(requireSession)
  .get("/session", (c) => c.json({ data: { ok: true } }))
  .get("/editions", validate("query", listQuerySchema), async (c) =>
    c.json({ data: await adminService.list(c.req.valid("query").limit) }),
  )
  .post("/editions/:issue/stories/:slug/pull", validate("param", storyParamSchema), async (c) => {
    const { issue, slug } = c.req.valid("param");
    const data = await adminService.pullStory(issue, slug);
    audit("pull-story", { issue, slug, replacement: data.replacement?.slug ?? null });
    return c.json({ data });
  })
  .post("/editions/:issue/pull", validate("param", issueParamSchema), async (c) => {
    const { issue } = c.req.valid("param");
    const data = await adminService.pullEdition(issue);
    audit("pull-edition", { issue });
    return c.json({ data });
  })
  .post("/editions/:issue/republish", validate("param", issueParamSchema), async (c) => {
    const { issue } = c.req.valid("param");
    const data = await adminService.republish(issue);
    audit("republish", { issue });
    return c.json({ data });
  })
  .post("/rollback", async (c) => {
    const data = await adminService.rollback();
    audit("rollback", data);
    return c.json({ data });
  });
