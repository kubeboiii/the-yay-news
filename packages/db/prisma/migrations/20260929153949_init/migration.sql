-- CreateEnum
CREATE TYPE "EditionStatus" AS ENUM ('draft', 'scheduled', 'published', 'pulled');

-- CreateEnum
CREATE TYPE "EditionKind" AS ENUM ('regular', 'slow_news_day');

-- CreateEnum
CREATE TYPE "EditionDesign" AS ENUM ('broadsheet', 'tabloid', 'zine', 'midi');

-- CreateEnum
CREATE TYPE "SectionKind" AS ENUM ('core', 'guest');

-- CreateEnum
CREATE TYPE "SectionVoice" AS ENUM ('witty', 'quirky', 'warm');

-- CreateEnum
CREATE TYPE "StorySlot" AS ENUM ('lead', 'feature', 'brief');

-- CreateEnum
CREATE TYPE "ImageKind" AS ENUM ('photo', 'illustration');

-- CreateEnum
CREATE TYPE "FeatureType" AS ENUM ('number_of_day', 'weather', 'quote', 'correction', 'classified', 'letter', 'word_of_the_day', 'comic', 'sign_off');

-- CreateEnum
CREATE TYPE "PuzzleType" AS ENUM ('crossword', 'word_ladder', 'riddle');

-- CreateTable
CREATE TABLE "Section" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "kind" "SectionKind" NOT NULL,
    "colour" TEXT NOT NULL,
    "voice" "SectionVoice" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Edition" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "issueNumber" INTEGER NOT NULL,
    "volume" INTEGER NOT NULL DEFAULT 1,
    "status" "EditionStatus" NOT NULL DEFAULT 'draft',
    "kind" "EditionKind" NOT NULL DEFAULT 'regular',
    "design" "EditionDesign" NOT NULL,
    "colourway" TEXT NOT NULL,
    "guestSectionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Edition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "editionId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "sectionId" TEXT,
    "layout" TEXT NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Story" (
    "id" TEXT NOT NULL,
    "editionId" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "slot" "StorySlot" NOT NULL,
    "slug" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "kicker" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "dek" TEXT NOT NULL,
    "body" TEXT[],
    "readMinutes" INTEGER NOT NULL,
    "sticker" TEXT,
    "sourceUrl" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "embedUrl" TEXT,
    "isReserve" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "credit" TEXT NOT NULL,
    "licence" TEXT NOT NULL,
    "licenceUrl" TEXT NOT NULL,
    "kind" "ImageKind" NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feature" (
    "id" TEXT NOT NULL,
    "editionId" TEXT NOT NULL,
    "type" "FeatureType" NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "content" JSONB NOT NULL,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Puzzle" (
    "id" TEXT NOT NULL,
    "editionId" TEXT NOT NULL,
    "type" "PuzzleType" NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "data" JSONB NOT NULL,
    "solution" JSONB NOT NULL,

    CONSTRAINT "Puzzle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Section_slug_key" ON "Section"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Edition_date_key" ON "Edition"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Edition_issueNumber_key" ON "Edition"("issueNumber");

-- CreateIndex
CREATE INDEX "Edition_status_date_idx" ON "Edition"("status", "date");

-- CreateIndex
CREATE INDEX "Edition_guestSectionId_idx" ON "Edition"("guestSectionId");

-- CreateIndex
CREATE INDEX "Page_sectionId_idx" ON "Page"("sectionId");

-- CreateIndex
CREATE UNIQUE INDEX "Page_editionId_order_key" ON "Page"("editionId", "order");

-- CreateIndex
CREATE INDEX "Story_sectionId_idx" ON "Story"("sectionId");

-- CreateIndex
CREATE UNIQUE INDEX "Story_editionId_slug_key" ON "Story"("editionId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Story_pageId_order_key" ON "Story"("pageId", "order");

-- CreateIndex
CREATE INDEX "Image_storyId_idx" ON "Image"("storyId");

-- CreateIndex
CREATE UNIQUE INDEX "Feature_editionId_type_order_key" ON "Feature"("editionId", "type", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Puzzle_editionId_order_key" ON "Puzzle"("editionId", "order");

-- AddForeignKey
ALTER TABLE "Edition" ADD CONSTRAINT "Edition_guestSectionId_fkey" FOREIGN KEY ("guestSectionId") REFERENCES "Section"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "Edition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "Edition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feature" ADD CONSTRAINT "Feature_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "Edition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Puzzle" ADD CONSTRAINT "Puzzle_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "Edition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

