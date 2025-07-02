-- DropIndex
DROP INDEX "Partner_secondPhone_key";

-- AlterTable
ALTER TABLE "Partner" ALTER COLUMN "secondPhone" DROP DEFAULT;
