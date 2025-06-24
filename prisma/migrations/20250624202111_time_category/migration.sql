/*
  Warnings:

  - Added the required column `time` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "time" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Partner" ALTER COLUMN "isActive" SET DEFAULT true;
