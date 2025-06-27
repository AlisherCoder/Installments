/*
  Warnings:

  - You are about to drop the column `contractId` on the `PaymentSchedule` table. All the data in the column will be lost.
  - Added the required column `debtId` to the `PaymentSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PaymentSchedule" DROP CONSTRAINT "PaymentSchedule_contractId_fkey";

-- AlterTable
ALTER TABLE "PaymentSchedule" DROP COLUMN "contractId",
ADD COLUMN     "debtId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "PaymentSchedule" ADD CONSTRAINT "PaymentSchedule_debtId_fkey" FOREIGN KEY ("debtId") REFERENCES "Debt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
