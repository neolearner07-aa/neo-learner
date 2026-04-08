/*
  Warnings:

  - You are about to drop the column `lastUsed` on the `AIUsage` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `AIUsage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AIUsage" DROP COLUMN "lastUsed",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "count" SET DEFAULT 0;
