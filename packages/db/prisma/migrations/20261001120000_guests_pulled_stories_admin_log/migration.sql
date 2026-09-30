-- Edition guests: a list of guest sections in page order, replacing Edition.guestSectionId.

-- CreateTable
CREATE TABLE "EditionGuest" (
    "editionId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "EditionGuest_pkey" PRIMARY KEY ("editionId","order")
);

-- CreateIndex
CREATE INDEX "EditionGuest_sectionId_idx" ON "EditionGuest"("sectionId");

-- CreateIndex
CREATE UNIQUE INDEX "EditionGuest_editionId_sectionId_key" ON "EditionGuest"("editionId", "sectionId");

-- AddForeignKey
ALTER TABLE "EditionGuest" ADD CONSTRAINT "EditionGuest_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "Edition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EditionGuest" ADD CONSTRAINT "EditionGuest_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill from the guest pages each edition already has, first guest page first.
INSERT INTO "EditionGuest" ("editionId", "sectionId", "order")
SELECT p."editionId", p."sectionId", (ROW_NUMBER() OVER (PARTITION BY p."editionId" ORDER BY p."order") - 1)::INTEGER
FROM "Page" p
WHERE p."layout" = 'guest' AND p."sectionId" IS NOT NULL
ON CONFLICT DO NOTHING;

-- Then keep any recorded guest section that has no guest page.
INSERT INTO "EditionGuest" ("editionId", "sectionId", "order")
SELECT e."id", e."guestSectionId", 0
FROM "Edition" e
WHERE e."guestSectionId" IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM "EditionGuest" g WHERE g."editionId" = e."id")
ON CONFLICT DO NOTHING;

-- DropForeignKey
ALTER TABLE "Edition" DROP CONSTRAINT "Edition_guestSectionId_fkey";

-- DropIndex
DROP INDEX "Edition_guestSectionId_idx";

-- AlterTable
ALTER TABLE "Edition" DROP COLUMN "guestSectionId";

-- Pulled stories are marked, not deleted.

-- AlterTable
ALTER TABLE "Story" ADD COLUMN     "pulledAt" TIMESTAMP(3),
ADD COLUMN     "pulledReason" TEXT;

-- The admin's audit log.

-- CreateTable
CREATE TABLE "AdminAction" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "issue" INTEGER,
    "slug" TEXT,
    "detail" JSONB,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminAction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AdminAction_at_idx" ON "AdminAction"("at");
