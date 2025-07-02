/*
  Warnings:

  - A unique constraint covering the columns `[secondPhone]` on the table `Partner` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Partner" ADD COLUMN     "paidToday" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "secondPhone" TEXT DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "Partner_secondPhone_key" ON "Partner"("secondPhone");
