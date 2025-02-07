/*
  Warnings:

  - You are about to drop the column `fiber` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Food` table. All the data in the column will be lost.
  - Made the column `calories` on table `Food` required. This step will fail if there are existing NULL values in that column.
  - Made the column `carbs` on table `Food` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fats` on table `Food` required. This step will fail if there are existing NULL values in that column.
  - Made the column `proteins` on table `Food` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Food_name_key";

-- AlterTable
ALTER TABLE "Food" DROP COLUMN "fiber",
DROP COLUMN "imageUrl",
ADD COLUMN     "isCustom" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "calories" SET NOT NULL,
ALTER COLUMN "carbs" SET NOT NULL,
ALTER COLUMN "fats" SET NOT NULL,
ALTER COLUMN "proteins" SET NOT NULL;

-- CreateTable
CREATE TABLE "_ProgramSupplement" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProgramFood" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProgramSupplement_AB_unique" ON "_ProgramSupplement"("A", "B");

-- CreateIndex
CREATE INDEX "_ProgramSupplement_B_index" ON "_ProgramSupplement"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProgramFood_AB_unique" ON "_ProgramFood"("A", "B");

-- CreateIndex
CREATE INDEX "_ProgramFood_B_index" ON "_ProgramFood"("B");

-- AddForeignKey
ALTER TABLE "_ProgramSupplement" ADD CONSTRAINT "_ProgramSupplement_A_fkey" FOREIGN KEY ("A") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProgramSupplement" ADD CONSTRAINT "_ProgramSupplement_B_fkey" FOREIGN KEY ("B") REFERENCES "Supplement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProgramFood" ADD CONSTRAINT "_ProgramFood_A_fkey" FOREIGN KEY ("A") REFERENCES "Food"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProgramFood" ADD CONSTRAINT "_ProgramFood_B_fkey" FOREIGN KEY ("B") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;
