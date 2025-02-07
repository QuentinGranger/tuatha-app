/*
  Warnings:

  - You are about to drop the `_ProgramFood` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProgramFood" DROP CONSTRAINT "_ProgramFood_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProgramFood" DROP CONSTRAINT "_ProgramFood_B_fkey";

-- DropTable
DROP TABLE "_ProgramFood";

-- CreateTable
CREATE TABLE "MealTime" (
    "id" TEXT NOT NULL,
    "timeOfDay" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "foodId" TEXT NOT NULL,

    CONSTRAINT "MealTime_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MealTime_programId_foodId_key" ON "MealTime"("programId", "foodId");

-- AddForeignKey
ALTER TABLE "MealTime" ADD CONSTRAINT "MealTime_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealTime" ADD CONSTRAINT "MealTime_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
