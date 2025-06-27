/*
  Warnings:

  - A unique constraint covering the columns `[partnerId]` on the table `Debt` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Debt_partnerId_key" ON "Debt"("partnerId");
