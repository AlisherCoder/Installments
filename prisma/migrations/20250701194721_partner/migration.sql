-- DropForeignKey
ALTER TABLE "Partner" DROP CONSTRAINT "Partner_regionId_fkey";

-- AlterTable
ALTER TABLE "Partner" ALTER COLUMN "regionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;
