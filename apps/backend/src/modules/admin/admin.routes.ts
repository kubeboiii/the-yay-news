import { issueParamSchema } from "@repo/shared";
import { Hono } from "hono";
import { z } from "zod";
import { AppError, ValidationError } from "../../lib/errors.js";
import { validate } from "../../lib/validator.js";
import {
  adminPassword,
  checkLoginAllowed,
  clientKey,
  endSession,
  passwordMatches,
  recordLoginFailure,
  recordLoginSuccess,
  requireSession,
  startSession,
} from "./admin.auth.js";
import { adminService } from "./admin.service.js";

// The emergency control (PLAN §9): pull a story, pull or republish an edition, roll back. Every
// response is private and uncached; every action (and every login attempt that reaches the
// password check) is written to the audit log by admin.service.ts.

const loginSchema = z.object({ password: z.string().min(1).max(200) });
const listQuerySchema = z.object({ limit: z.coerce.number().int().min(1).max(60).default(14) });
const actionsQuerySchema = z.object({ limit: z.coerce.number().int().min(1).max(200).default(50) });
const storyParamSchema = issueParamSchema.extend({ slug: z.string().min(1).max(120) });
/** The body of a story pull is optional: `{ reason }`, or nothing at all. */
const pullBodySchema = z.object({ reason: z.string().trim().max(300).optional() });

async function pullReason(req: Request) {
  const text = await req.text();
  let body: unknown = {};
  try {
    if (text.trim()) body = JSON.parse(text);
  } catch {
    throw new AppError(400, "BAD_JSON", "The body is not JSON");
  }
  const parsed = pullBodySchema.safeParse(body);
  if (!parsed.success) throw new ValidationError(z.flattenError(parsed.error));
  return parsed.data.reason || null;
}

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
      await adminService.recordLogin(false, clientKey(c));
      throw new AppError(401, "WRONG_PASSWORD", "That isn't the password");
    }
    recordLoginSuccess(c);
    await adminService.recordLogin(true, clientKey(c));
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
  .get("/actions", validate("query", actionsQuerySchema), async (c) =>
    c.json({ data: await adminService.actions(c.req.valid("query").limit) }),
  )
  .post("/editions/:issue/stories/:slug/pull", validate("param", storyParamSchema), async (c) => {
    const { issue, slug } = c.req.valid("param");
    const data = await adminService.pullStory(issue, slug, await pullReason(c.req.raw));
    return c.json({ data });
  })
  .post("/editions/:issue/stories/:slug/unpull", validate("param", storyParamSchema), async (c) => {
    const { issue, slug } = c.req.valid("param");
    return c.json({ data: await adminService.unpullStory(issue, slug) });
  })
  .post("/editions/:issue/pull", validate("param", issueParamSchema), async (c) => {
    const { issue } = c.req.valid("param");
    const data = await adminService.pullEdition(issue);
    return c.json({ data });
  })
  .post("/editions/:issue/republish", validate("param", issueParamSchema), async (c) => {
    const { issue } = c.req.valid("param");
    const data = await adminService.republish(issue);
    return c.json({ data });
  })
  .post("/rollback", async (c) => {
    const data = await adminService.rollback();
    return c.json({ data });
  });
