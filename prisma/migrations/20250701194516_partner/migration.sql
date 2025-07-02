-- AlterTable
ALTER TABLE "Partner" ADD COLUMN     "location" JSONB,
ALTER COLUMN "address" DROP NOT NULL;
