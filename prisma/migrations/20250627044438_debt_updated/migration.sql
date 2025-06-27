/*
  Warnings:

  - Added the required column `contractId` to the `Debt` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Debt_partnerId_key";

-- AlterTable
ALTER TABLE "Debt" ADD COLUMN     "contractId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PaymentSchedule" ALTER COLUMN "paidAt" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Debt" ADD CONSTRAINT "Debt_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
