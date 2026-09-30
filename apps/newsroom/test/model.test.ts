import { chmodSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import {
  BrokenModel,
  ClaudeCodeModel,
  FakeModel,
  FallbackModel,
  GeminiModel,
  ModelError,
  modelFromEnv,
} from "../src/model/index.ts";
import { withData } from "../src/model/prompt-data.ts";

const schema = z.object({ ok: z.boolean(), why: z.string() });

/** A stand-in `claude` binary that answers like `claude -p --output-format json`. */
function fakeCli(reply: object, exitCode = 0) {
  const dir = mkdtempSync(path.join(tmpdir(), "newsroom-cli-"));
  const bin = path.join(dir, "claude");
  writeFileSync(
    bin,
    `#!/usr/bin/env node
let input = "";
process.stdin.on("data", (d) => (input += d));
process.stdin.on("end", () => {
  require("fs").writeFileSync(${JSON.stringify(path.join(dir, "args.json"))}, JSON.stringify({ args: process.argv.slice(2), input }));
  process.stdout.write(${JSON.stringify(JSON.stringify(reply))});
  process.exit(${exitCode});
});
`,
  );
  chmodSync(bin, 0o755);
  return { bin, dir };
}

describe("the claude-code provider", () => {
  it("sends the prompt on stdin with the tier's model and a schema, and reads structured output", async () => {
    const { bin, dir } = fakeCli({
      is_error: false,
      result: "",
      structured_output: { ok: true, why: "otters" },
    });
    const model = new ClaudeCodeModel({ bin });
    await expect(model.complete("hello", { tier: "cheap", schema })).resolves.toEqual({
      ok: true,
      why: "otters",
    });
    const { readFileSync } = await import("node:fs");
    const call = JSON.parse(readFileSync(path.join(dir, "args.json"), "utf8"));
    expect(call.input).toBe("hello");
    expect(call.args).toEqual(
      expect.arrayContaining([
        "-p",
        "--output-format",
        "json",
        "--model",
        "haiku",
        "--json-schema",
      ]),
    );
    // The CLI rejects the draft-2020-12 meta-schema reference, so it is stripped.
    expect(JSON.parse(call.args[call.args.indexOf("--json-schema") + 1])).not.toHaveProperty(
      "$schema",
    );
    await model.complete("again", { tier: "writer", schema });
    expect(JSON.parse(readFileSync(path.join(dir, "args.json"), "utf8")).args).toContain("sonnet");
  });

  it("falls back to parsing JSON from the text result", async () => {
    const { bin } = fakeCli({
      is_error: false,
      result: '```json\n{"ok": false, "why": "no"}\n```',
    });
    await expect(
      new ClaudeCodeModel({ bin }).complete("x", { tier: "cheap", schema }),
    ).resolves.toEqual({ ok: false, why: "no" });
  });

  it("fails cleanly when the CLI is missing, errors or replies off-schema", async () => {
    await expect(
      new ClaudeCodeModel({ bin: "/nonexistent/claude" }).complete("x", { tier: "cheap" }),
    ).rejects.toBeInstanceOf(ModelError);
    const broken = fakeCli({ is_error: true, result: "usage limit" });
    await expect(
      new ClaudeCodeModel({ bin: broken.bin }).complete("x", { tier: "cheap" }),
    ).rejects.toThrow(/usage limit/);
    const exits = fakeCli({}, 1);
    await expect(
      new ClaudeCodeModel({ bin: exits.bin }).complete("x", { tier: "cheap" }),
    ).rejects.toThrow(/exited with 1/);
    const off = fakeCli({ is_error: false, result: "", structured_output: { nope: 1 } });
    await expect(
      new ClaudeCodeModel({ bin: off.bin }).complete("x", { tier: "cheap", schema }),
    ).rejects.toThrow(/schema/);
  });
});

describe("the gemini provider", () => {
  it("posts JSON-mode requests with the key in a header", async () => {
    let seen: { url: string; init: RequestInit } | undefined;
    const fetch = (async (url: string, init: RequestInit) => {
      seen = { url, init };
      return new Response(
        JSON.stringify({
          candidates: [{ content: { parts: [{ text: '{"ok":true,"why":"yes"}' }] } }],
        }),
      );
    }) as unknown as typeof globalThis.fetch;
    const model = new GeminiModel({ apiKey: "k", fetch });
    await expect(model.complete("hi", { tier: "writer", schema })).resolves.toEqual({
      ok: true,
      why: "yes",
    });
    expect(seen?.url).toMatch(/gemini-2\.5-flash:generateContent$/);
    expect(seen?.url).not.toContain("k=");
    expect((seen?.init.headers as Record<string, string>)["x-goog-api-key"]).toBe("k");
    expect(JSON.parse(String(seen?.init.body)).generationConfig.responseMimeType).toBe(
      "application/json",
    );
  });

  it("refuses to run without a key", async () => {
    await expect(new GeminiModel({ apiKey: "" }).complete("x", { tier: "cheap" })).rejects.toThrow(
      /GEMINI_API_KEY/,
    );
  });
});

describe("provider fallback", () => {
  const prompt = withData("classify", {
    items: [
      {
        id: "c1",
        title: "Otters juggle",
        summary: "",
        excerpt: "",
        source: "x",
        sections: ["discoveries"],
      },
    ],
  });

  it("switches to the next provider when the primary fails, and logs it", async () => {
    const broken = new BrokenModel("claude-code");
    const logs: string[] = [];
    const model = new FallbackModel([broken, new FakeModel()], (m) => logs.push(m));
    const reply = await model.complete(prompt, {
      tier: "cheap",
      task: "delight",
      schema: z.object({ results: z.array(z.object({ id: z.string() }).passthrough()) }),
    });
    expect(reply.results[0]?.id).toBe("c1");
    expect(logs[0]).toMatch(/claude-code failed on delight.*falling back/);
    expect([...model.served]).toEqual(["fake"]);
  });

  it("stops asking a provider that keeps failing", async () => {
    const broken = new BrokenModel("claude-code");
    const model = new FallbackModel([broken, new FakeModel()]);
    for (let i = 0; i < 4; i++) await model.complete("x", { tier: "cheap" });
    expect(broken.calls).toBe(2);
  });

  it("throws when every provider fails", async () => {
    await expect(
      new FallbackModel([new BrokenModel("a"), new BrokenModel("b")]).complete("x", {
        tier: "cheap",
      }),
    ).rejects.toThrow(/every provider failed/);
  });

  it("reads the provider order from the environment", () => {
    expect(modelFromEnv({ primary: "claude-code", fallback: "gemini" }).name).toBe(
      "claude-code → gemini",
    );
    expect(modelFromEnv({ primary: "fake" }).name).toBe("fake");
    expect(modelFromEnv({ primary: "gemini", fallback: "claude-code,fake" }).name).toBe(
      "gemini → claude-code → fake",
    );
    expect(() => modelFromEnv({ primary: "gpt" })).toThrow(/unknown model provider/);
  });
});
