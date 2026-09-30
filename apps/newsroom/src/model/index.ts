import type { z } from "zod";
import { ClaudeCodeModel } from "./claude-code.ts";
import { FakeModel } from "./fake.ts";
import { GeminiModel } from "./gemini.ts";
import { type CompleteOptions, type Model, ModelError } from "./types.ts";

export { ClaudeCodeModel } from "./claude-code.ts";
export { BrokenModel, FakeModel } from "./fake.ts";
export { GeminiModel } from "./gemini.ts";
export * from "./types.ts";

export type ProviderName = "claude-code" | "gemini" | "fake";
export const PROVIDERS: readonly ProviderName[] = ["claude-code", "gemini", "fake"];

export function createProvider(name: ProviderName): Model {
  switch (name) {
    case "claude-code":
      return new ClaudeCodeModel();
    case "gemini":
      return new GeminiModel();
    case "fake":
      return new FakeModel();
  }
}

type Log = (message: string) => void;

/**
 * Tries each provider in order for every call. When one fails (not installed, an error, a timeout
 * or a reply that does not match the schema), the next one serves the call and the switch is
 * logged. A provider that fails twice in a run is skipped for the rest of it.
 */
export class FallbackModel implements Model {
  readonly name: string;
  /** Providers that actually answered at least one call. */
  readonly served = new Set<string>();
  private readonly failures = new Map<string, number>();

  constructor(
    private readonly providers: Model[],
    private readonly log: Log = () => {},
  ) {
    if (!providers.length) throw new Error("no model providers");
    this.name = providers.map((p) => p.name).join(" → ");
  }

  complete<T>(prompt: string, options: CompleteOptions<T> & { schema: z.ZodType<T> }): Promise<T>;
  complete(prompt: string, options: CompleteOptions): Promise<string>;
  async complete<T>(prompt: string, options: CompleteOptions<T>): Promise<T | string> {
    const errors: string[] = [];
    for (const p of this.providers) {
      if ((this.failures.get(p.name) ?? 0) >= 2) continue;
      try {
        const result = await p.complete(prompt, options as CompleteOptions);
        this.served.add(p.name);
        return result as T | string;
      } catch (e) {
        this.failures.set(p.name, (this.failures.get(p.name) ?? 0) + 1);
        const message = e instanceof Error ? e.message : String(e);
        errors.push(message);
        this.log(
          `model ${p.name} failed on ${options.task ?? "a call"} (${message.slice(0, 200)}); falling back`,
        );
      }
    }
    throw new ModelError(this.name, `every provider failed: ${errors.join(" | ")}`);
  }
}

/**
 * The model for a run: NEWSROOM_MODEL picks the primary (default claude-code), then
 * NEWSROOM_MODEL_FALLBACK (comma-separated, default "gemini") lists the fallbacks in order. The fake
 * model is only used when named, so a real run never prints canned text.
 */
export function modelFromEnv({
  primary,
  fallback,
  log,
}: { primary?: string; fallback?: string; log?: Log } = {}): FallbackModel {
  const first = (primary ?? process.env.NEWSROOM_MODEL ?? "claude-code").trim();
  const rest = (
    fallback ??
    process.env.NEWSROOM_MODEL_FALLBACK ??
    (first === "fake" ? "" : "gemini")
  )
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const names = [...new Set([first, ...rest])];
  for (const n of names) {
    if (!(PROVIDERS as readonly string[]).includes(n)) {
      throw new Error(`unknown model provider "${n}" (use ${PROVIDERS.join(", ")})`);
    }
  }
  return new FallbackModel(
    names.map((n) => createProvider(n as ProviderName)),
    log,
  );
}
