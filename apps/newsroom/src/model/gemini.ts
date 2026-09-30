import { z } from "zod";
import { type CompleteOptions, type Model, ModelError, extractJson, parseWith } from "./types.ts";

export type GeminiOptions = {
  apiKey?: string;
  models?: { cheap: string; writer: string };
  timeoutMs?: number;
  fetch?: typeof fetch;
};

const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

/**
 * The fallback provider: Google Gemini Flash on the free tier, over REST, with JSON-mode output.
 * Needs GEMINI_API_KEY (free from Google AI Studio). The key goes in a header, never the URL.
 */
export class GeminiModel implements Model {
  readonly name = "gemini";
  private readonly apiKey: string | undefined;
  private readonly models: { cheap: string; writer: string };
  private readonly timeoutMs: number;
  private readonly fetch: typeof fetch;

  constructor(options: GeminiOptions = {}) {
    this.apiKey = options.apiKey ?? process.env.GEMINI_API_KEY;
    const flash = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
    this.models = options.models ?? {
      cheap: process.env.GEMINI_CHEAP_MODEL ?? "gemini-2.5-flash-lite",
      writer: flash,
    };
    this.timeoutMs = options.timeoutMs ?? 180_000;
    this.fetch = options.fetch ?? globalThis.fetch;
  }

  complete<T>(prompt: string, options: CompleteOptions<T> & { schema: z.ZodType<T> }): Promise<T>;
  complete(prompt: string, options: CompleteOptions): Promise<string>;
  async complete<T>(prompt: string, options: CompleteOptions<T>): Promise<T | string> {
    if (!this.apiKey) throw new ModelError(this.name, "GEMINI_API_KEY is not set");
    const text = options.schema
      ? `${prompt}\n\nReply with JSON only, matching this JSON Schema:\n${JSON.stringify(z.toJSONSchema(options.schema))}`
      : prompt;
    let res: Response;
    try {
      res = await this.fetch(`${ENDPOINT}/${this.models[options.tier]}:generateContent`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-goog-api-key": this.apiKey },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text }] }],
          generationConfig: {
            temperature: options.tier === "cheap" ? 0 : 0.7,
            ...(options.schema ? { responseMimeType: "application/json" } : {}),
          },
        }),
        signal: AbortSignal.timeout(this.timeoutMs),
      });
    } catch (e) {
      throw new ModelError(this.name, `request failed: ${(e as Error).message}`, e);
    }
    if (!res.ok) {
      throw new ModelError(this.name, `HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
    }
    const body = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const reply = body.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
    if (!options.schema) return reply;
    let value: unknown;
    try {
      value = extractJson(reply);
    } catch (e) {
      throw new ModelError(this.name, "reply was not JSON", e);
    }
    return parseWith(this.name, options.schema, value);
  }
}
