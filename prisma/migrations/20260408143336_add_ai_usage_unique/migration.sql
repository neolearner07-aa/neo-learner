/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `AIUsage` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "AIUsage" ALTER COLUMN "count" DROP DEFAULT,
ALTER COLUMN "lastUsed" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "AIUsage_userId_key" ON "AIUsage"("userId");
