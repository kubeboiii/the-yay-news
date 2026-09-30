// Delete the leftover run records (PipelineRun + its Candidate rows) of failed attempts for one
// edition date: runs that filed no edition and did not succeed. Nothing else is touched.
//
//   pnpm --filter newsroom exec tsx --env-file=../../packages/db/.env scripts/delete-failed-runs.ts --date 2026-10-04 [--yes]
//
// Without --yes it only lists what it would delete.
import { parseArgs } from "node:util";
import { prisma } from "@repo/db";

const { values } = parseArgs({
  args: process.argv.slice(2).filter((a) => a !== "--"),
  options: { date: { type: "string" }, yes: { type: "boolean", default: false } },
});
if (!values.date || !/^\d{4}-\d{2}-\d{2}$/.test(values.date)) {
  console.error("--date YYYY-MM-DD is required");
  process.exit(2);
}

const runs = await prisma.pipelineRun.findMany({
  where: {
    date: new Date(`${values.date}T00:00:00.000Z`),
    editionId: null,
    status: { not: "succeeded" },
  },
  include: { _count: { select: { candidates: true } } },
});
for (const r of runs)
  console.log(
    `${r.id}  ${r.status}  started ${r.startedAt.toISOString()}  ${r._count.candidates} candidates`,
  );
if (!runs.length) console.log("nothing to delete");
else if (values.yes) {
  const ids = runs.map((r) => r.id);
  const [c, p] = await prisma.$transaction([
    prisma.candidate.deleteMany({ where: { runId: { in: ids } } }),
    prisma.pipelineRun.deleteMany({ where: { id: { in: ids } } }),
  ]);
  console.log(`deleted ${p.count} run(s) and ${c.count} candidate(s)`);
} else console.log("dry run: pass --yes to delete");
await prisma.$disconnect();
