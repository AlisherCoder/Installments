/*
  Warnings:

  - The `paidToday` column on the `Partner` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Partner" DROP COLUMN "paidToday",
ADD COLUMN     "paidToday" TIMESTAMP(3);
