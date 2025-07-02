/*
  Warnings:

  - Made the column `regionId` on table `Partner` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Partner" DROP CONSTRAINT "Partner_regionId_fkey";

-- AlterTable
ALTER TABLE "Partner" ALTER COLUMN "regionId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
