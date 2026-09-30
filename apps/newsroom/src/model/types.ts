import type { z } from "zod";

/** Cheap models filter and classify; the writer model writes briefs and features (PLAN §9). */
export type Tier = "cheap" | "writer";

export type CompleteOptions<T = unknown> = {
  tier: Tier;
  /** When given, the reply is parsed as JSON and validated against it. */
  schema?: z.ZodType<T>;
  /**
   * What the call is for ("delight", "write", "features"…). Real models ignore it; the fake model
   * uses it to answer deterministically.
   */
  task?: string;
};

/** The provider-neutral model interface. */
export interface Model {
  readonly name: string;
  complete<T>(prompt: string, options: CompleteOptions<T> & { schema: z.ZodType<T> }): Promise<T>;
  complete(prompt: string, options: CompleteOptions): Promise<string>;
}

/** Thrown when a provider cannot serve a call (not installed, no key, timeout, bad reply). */
export class ModelError extends Error {
  constructor(
    readonly provider: string,
    message: string,
    readonly cause?: unknown,
  ) {
    super(`${provider}: ${message}`);
  }
}

/** Pull the first JSON value out of a model's reply (tolerates code fences and chatter). */
export function extractJson(text: string): unknown {
  const trimmed = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/, "");
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.search(/[[{]/);
    if (start < 0) throw new Error("no JSON in reply");
    const open = trimmed[start];
    const close = open === "{" ? "}" : "]";
    const end = trimmed.lastIndexOf(close);
    if (end <= start) throw new Error("no JSON in reply");
    return JSON.parse(trimmed.slice(start, end + 1));
  }
}

/** Validate a parsed reply, turning schema failures into ModelErrors so the caller can fall back. */
export function parseWith<T>(provider: string, schema: z.ZodType<T>, value: unknown): T {
  const r = schema.safeParse(value);
  if (!r.success) {
    throw new ModelError(
      provider,
      `reply did not match the schema: ${r.error.message.slice(0, 500)}`,
    );
  }
  return r.data;
}
