import "server-only";
import { apiErrorSchema } from "@repo/shared";
import type { z } from "zod";
import { env } from "@/config/env";

export class ApiRequestError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

/** Fetches a backend path and validates the JSON body against `schema`. */
export async function apiGet<T extends z.ZodType>(
  path: string,
  schema: T,
  init?: RequestInit,
): Promise<z.infer<T>> {
  const res = await fetch(new URL(path, env.BACKEND_URL), { cache: "no-store", ...init });
  const body: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    const parsed = apiErrorSchema.safeParse(body);
    const { code, message } = parsed.success
      ? parsed.data.error
      : { code: "UNKNOWN", message: `Request to ${path} failed` };
    throw new ApiRequestError(res.status, code, message);
  }
  return schema.parse(body);
}
