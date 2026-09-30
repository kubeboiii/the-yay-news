-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('rss', 'reddit', 'api');

-- CreateEnum
CREATE TYPE "CandidateDecision" AS ENUM ('pending', 'rejected_blocklist', 'rejected_delight', 'duplicate', 'not_selected', 'selected', 'reserve', 'failed_fact_check', 'published');

-- CreateEnum
CREATE TYPE "PipelineRunStatus" AS ENUM ('running', 'succeeded', 'failed', 'slow_news_day', 'skipped');

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "SourceType" NOT NULL,
    "sections" TEXT[],
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Candidate" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "sourceId" TEXT,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "imageUrl" TEXT,
    "fetchedAt" TIMESTAMP(3) NOT NULL,
    "decision" "CandidateDecision" NOT NULL DEFAULT 'pending',
    "decisionReason" TEXT,
    "stage" TEXT,
    "section" TEXT,
    "storySlug" TEXT,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PipelineRun" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "editionId" TEXT,
    "status" "PipelineRunStatus" NOT NULL DEFAULT 'running',
    "dryRun" BOOLEAN NOT NULL DEFAULT false,
    "model" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "log" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "PipelineRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Source_slug_key" ON "Source"("slug");

-- CreateIndex
CREATE INDEX "Candidate_sourceId_idx" ON "Candidate"("sourceId");

-- CreateIndex
CREATE INDEX "Candidate_decision_idx" ON "Candidate"("decision");

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_runId_url_key" ON "Candidate"("runId", "url");

-- CreateIndex
CREATE INDEX "PipelineRun_date_idx" ON "PipelineRun"("date");

-- CreateIndex
CREATE INDEX "PipelineRun_editionId_idx" ON "PipelineRun"("editionId");

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_runId_fkey" FOREIGN KEY ("runId") REFERENCES "PipelineRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PipelineRun" ADD CONSTRAINT "PipelineRun_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "Edition"("id") ON DELETE SET NULL ON UPDATE CASCADE;
