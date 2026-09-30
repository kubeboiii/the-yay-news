import { spawn } from "node:child_process";
import { z } from "zod";
import { type CompleteOptions, type Model, ModelError, extractJson, parseWith } from "./types.ts";

const SYSTEM_PROMPT =
  "You are a sub-editor at The Yay News, a daily newspaper of only good news. Follow the " +
  "instructions in the message exactly. You have no tools; answer from the message alone.";

export type ClaudeCodeOptions = {
  /** The CLI binary; defaults to NEWSROOM_CLAUDE_BIN or `claude` on the PATH. */
  bin?: string;
  /** Per-call timeout. Writing a page of briefs can take a couple of minutes. */
  timeoutMs?: number;
  models?: { cheap: string; writer: string };
};

/**
 * The primary provider: the local Claude Code CLI in print mode (`claude -p`), which runs on the
 * user's subscription, so no API key is needed. The prompt goes in on stdin; with a schema, the CLI
 * is asked for structured output and its `structured_output` is used.
 */
export class ClaudeCodeModel implements Model {
  readonly name = "claude-code";
  private readonly bin: string;
  private readonly timeoutMs: number;
  private readonly models: { cheap: string; writer: string };

  constructor(options: ClaudeCodeOptions = {}) {
    this.bin = options.bin ?? process.env.NEWSROOM_CLAUDE_BIN ?? "claude";
    this.timeoutMs = options.timeoutMs ?? Number(process.env.NEWSROOM_TIMEOUT_MS ?? 300_000);
    this.models = options.models ?? { cheap: "haiku", writer: "sonnet" };
  }

  complete<T>(prompt: string, options: CompleteOptions<T> & { schema: z.ZodType<T> }): Promise<T>;
  complete(prompt: string, options: CompleteOptions): Promise<string>;
  async complete<T>(prompt: string, options: CompleteOptions<T>): Promise<T | string> {
    const args = [
      "-p",
      "--output-format",
      "json",
      "--model",
      this.models[options.tier],
      "--tools",
      "",
      "--no-session-persistence",
      "--system-prompt",
      SYSTEM_PROMPT,
    ];
    if (options.schema) {
      // The CLI's validator does not resolve the draft-2020-12 meta-schema URI, so leave it out.
      const { $schema: _meta, ...jsonSchema } = z.toJSONSchema(options.schema) as Record<
        string,
        unknown
      >;
      args.push("--json-schema", JSON.stringify(jsonSchema));
    }
    const stdout = await this.run(args, prompt);

    let envelope: { is_error?: boolean; result?: string; structured_output?: unknown };
    try {
      envelope = JSON.parse(stdout);
    } catch (e) {
      throw new ModelError(this.name, `unreadable CLI output: ${stdout.slice(0, 200)}`, e);
    }
    if (envelope.is_error) {
      throw new ModelError(
        this.name,
        `CLI reported an error: ${String(envelope.result).slice(0, 300)}`,
      );
    }
    if (!options.schema) return envelope.result ?? "";
    let value = envelope.structured_output;
    if (value === undefined) {
      try {
        value = extractJson(envelope.result ?? "");
      } catch (e) {
        throw new ModelError(this.name, "reply was not JSON", e);
      }
    }
    return parseWith(this.name, options.schema, value);
  }

  private run(args: string[], input: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // Run it as a fresh session: drop any variables from a parent Claude Code session.
      const env = Object.fromEntries(
        Object.entries(process.env).filter(
          ([k]) => !k.startsWith("CLAUDE") && k !== "AI_AGENT" && k !== "ANTHROPIC_API_KEY",
        ),
      );
      const child = spawn(this.bin, args, { env, stdio: ["pipe", "pipe", "pipe"] });
      let out = "";
      let err = "";
      const timer = setTimeout(() => {
        child.kill("SIGKILL");
        reject(new ModelError(this.name, `timed out after ${this.timeoutMs} ms`));
      }, this.timeoutMs);
      child.stdout.on("data", (d: Buffer) => (out += d.toString()));
      child.stderr.on("data", (d: Buffer) => (err += d.toString()));
      child.on("error", (e) => {
        clearTimeout(timer);
        reject(new ModelError(this.name, `could not start "${this.bin}": ${e.message}`, e));
      });
      child.on("close", (code) => {
        clearTimeout(timer);
        if (code === 0) resolve(out);
        else
          reject(new ModelError(this.name, `exited with ${code}: ${(err || out).slice(0, 300)}`));
      });
      child.stdin.on("error", () => {});
      child.stdin.end(input);
    });
  }
}
