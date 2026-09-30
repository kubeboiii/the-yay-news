// pnpm --filter newsroom run edition -- --date YYYY-MM-DD [--dry-run] [--model fake]
//                                        [--fallback gemini] [--replace] [--slow-news-day]
//
// Builds the edition for a date (default: tomorrow, UTC) and files it as `scheduled`, so it
// releases at 07:00 local time on that date. Idempotent: an existing edition for the date is left
// alone unless --replace is given. --slow-news-day files the evergreen edition instead.
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { calendarDateSchema } from "@repo/shared";
import { toServedEdition } from "./contract.ts";
import { modelFromEnv } from "./model/index.ts";
import { runEdition } from "./pipeline.ts";
import { PrismaStore } from "./store.ts";
import { addDays } from "./text.ts";

const { values } = parseArgs({
  args: process.argv.slice(2).filter((a) => a !== "--"),
  options: {
    date: { type: "string" },
    "dry-run": { type: "boolean", default: false },
    model: { type: "string" },
    fallback: { type: "string" },
    replace: { type: "boolean", default: false },
    "slow-news-day": { type: "boolean", default: false },
    out: { type: "string" },
  },
});

const date = values.date ?? addDays(new Date().toISOString().slice(0, 10), 1);
if (!calendarDateSchema.safeParse(date).success) {
  console.error(`--date must be YYYY-MM-DD, not "${date}"`);
  process.exit(2);
}

const stamp = () => new Date().toISOString().slice(11, 19);
const model = modelFromEnv({
  primary: values.model,
  fallback: values.fallback,
  log: (m) => console.warn(`${stamp()} [model] ${m}`),
});

const outcome = await runEdition({
  date,
  store: new PrismaStore(),
  model,
  dryRun: values["dry-run"],
  replace: values.replace,
  forceSlowNewsDay: values["slow-news-day"],
  onLog: (e) => {
    const line = `${stamp()} [${e.stage}] ${e.message}`;
    if (e.level === "error") console.error(line);
    else if (e.level === "warn") console.warn(line);
    else console.log(line);
  },
});

if (outcome.draft && values["dry-run"]) {
  const file = path.resolve(values.out ?? path.join(import.meta.dirname, "../out", `${date}.json`));
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(toServedEdition(outcome.draft), null, 2));
  console.log(`${stamp()} [dry-run] wrote the edition to ${file}`);
}
console.log(`${stamp()} [done] ${outcome.status} (run ${outcome.runId ?? "none"})`);

const { prisma } = await import("@repo/db");
await prisma.$disconnect();
process.exit(outcome.status === "failed" ? 1 : 0);
