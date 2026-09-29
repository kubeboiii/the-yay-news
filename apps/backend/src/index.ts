import { serve } from "@hono/node-server";
import { prisma } from "@repo/db";
import { createApp } from "./app.js";
import { env } from "./config/env.js";

const server = serve({ fetch: createApp().fetch, port: env.PORT }, (info) => {
  console.log(`Backend listening on http://localhost:${info.port}`);
});

// Finish in-flight requests and release DB connections before exiting.
const shutdown = (signal: string) => {
  console.log(`${signal} received, shutting down`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
