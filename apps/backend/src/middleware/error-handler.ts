import type { ApiError } from "@repo/shared";
import type { ErrorHandler, NotFoundHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { AppError } from "../lib/errors.js";

export const errorHandler: ErrorHandler = (err, c) => {
  if (err instanceof AppError) {
    return c.json<ApiError>(
      { error: { code: err.code, message: err.message, details: err.details } },
      err.status,
    );
  }
  if (err instanceof HTTPException) {
    return c.json<ApiError>({ error: { code: "HTTP_ERROR", message: err.message } }, err.status);
  }
  console.error(err);
  return c.json<ApiError>(
    { error: { code: "INTERNAL_SERVER_ERROR", message: "Something went wrong" } },
    500,
  );
};

export const notFoundHandler: NotFoundHandler = (c) =>
  c.json<ApiError>({ error: { code: "NOT_FOUND", message: `No route for ${c.req.path}` } }, 404);
