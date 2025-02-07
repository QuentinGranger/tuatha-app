/*
  Warnings:

  - You are about to drop the column `category` on the `Pathology` table. All the data in the column will be lost.
  - You are about to drop the `NutritionalProgram` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RecommendedFood` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProgramFoods` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProgramSupplements` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "NutritionalProgram" DROP CONSTRAINT "NutritionalProgram_pathologyId_fkey";

-- DropForeignKey
ALTER TABLE "ProgramAssignment" DROP CONSTRAINT "ProgramAssignment_programId_fkey";

-- DropForeignKey
ALTER TABLE "_ProgramFoods" DROP CONSTRAINT "_ProgramFoods_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProgramFoods" DROP CONSTRAINT "_ProgramFoods_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProgramSupplements" DROP CONSTRAINT "_ProgramSupplements_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProgramSupplements" DROP CONSTRAINT "_ProgramSupplements_B_fkey";

-- AlterTable
ALTER TABLE "Pathology" DROP COLUMN "category";

-- DropTable
DROP TABLE "NutritionalProgram";

-- DropTable
DROP TABLE "RecommendedFood";

-- DropTable
DROP TABLE "_ProgramFoods";

-- DropTable
DROP TABLE "_ProgramSupplements";

-- CreateTable
CREATE TABLE "Food" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "benefits" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Food_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "objectives" TEXT[],
    "duration" INTEGER NOT NULL,
    "pathologyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FoodToProgram" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProgramToSupplement" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "Program_pathologyId_idx" ON "Program"("pathologyId");

-- CreateIndex
CREATE INDEX "Program_createdById_idx" ON "Program"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "_FoodToProgram_AB_unique" ON "_FoodToProgram"("A", "B");

-- CreateIndex
CREATE INDEX "_FoodToProgram_B_index" ON "_FoodToProgram"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProgramToSupplement_AB_unique" ON "_ProgramToSupplement"("A", "B");

-- CreateIndex
CREATE INDEX "_ProgramToSupplement_B_index" ON "_ProgramToSupplement"("B");

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_pathologyId_fkey" FOREIGN KEY ("pathologyId") REFERENCES "Pathology"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "HealthProfessional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramAssignment" ADD CONSTRAINT "ProgramAssignment_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FoodToProgram" ADD CONSTRAINT "_FoodToProgram_A_fkey" FOREIGN KEY ("A") REFERENCES "Food"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FoodToProgram" ADD CONSTRAINT "_FoodToProgram_B_fkey" FOREIGN KEY ("B") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProgramToSupplement" ADD CONSTRAINT "_ProgramToSupplement_A_fkey" FOREIGN KEY ("A") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProgramToSupplement" ADD CONSTRAINT "_ProgramToSupplement_B_fkey" FOREIGN KEY ("B") REFERENCES "Supplement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
