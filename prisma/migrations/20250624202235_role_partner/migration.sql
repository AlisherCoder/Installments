/*
  Warnings:

  - The `role` column on the `Partner` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Partner" DROP COLUMN "role",
ADD COLUMN     "role" "RolePartner" NOT NULL DEFAULT 'CUSTOMER';
