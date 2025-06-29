-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_partnerId_fkey";

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "partnerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE SET NULL ON UPDATE CASCADE;
