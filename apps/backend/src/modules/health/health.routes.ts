import { prisma } from "@repo/db";
import { Hono } from "hono";

export const healthRoutes = new Hono()
  // Liveness: the process is up.
  .get("/", (c) => c.json({ status: "ok" }))
  // Readiness: dependencies are reachable.
  .get("/ready", async (c) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return c.json({ status: "ok", database: "up" });
    } catch {
      return c.json({ status: "error", database: "down" }, 503);
    }
  });
