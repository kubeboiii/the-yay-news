import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";
import { adminRoutes } from "./modules/admin/admin.routes.js";
import { editionRoutes } from "./modules/editions/edition.routes.js";
import { healthRoutes } from "./modules/health/health.routes.js";
import { searchRoutes } from "./modules/search/search.routes.js";
import { storyRoutes } from "./modules/stories/story.routes.js";

export function createApp() {
  const app = new Hono();

  // Middleware only wraps routes registered after it, so it goes first.
  if (env.NODE_ENV !== "test") app.use(logger());
  app.use(requestId(), secureHeaders(), cors({ origin: env.CORS_ORIGIN }));

  const routes = app
    .route("/health", healthRoutes)
    .route("/api/v1/editions", editionRoutes)
    .route("/api/v1/editions", storyRoutes)
    .route("/api/v1/search", searchRoutes)
    .route("/api/v1/admin", adminRoutes);

  app.onError(errorHandler);
  app.notFound(notFoundHandler);
  return routes;
}

export type AppType = ReturnType<typeof createApp>;
