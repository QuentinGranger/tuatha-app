-- CreateEnum
CREATE TYPE "ProgramStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED', 'PAUSED');

-- CreateTable
CREATE TABLE "RecommendedFood" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "benefits" TEXT[],
    "nutritionalValues" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecommendedFood_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplement" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "recommendations" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramAssignment" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "customizationNotes" TEXT,
    "status" "ProgramStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgramAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProgramFoods" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProgramSupplements" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "ProgramAssignment_programId_idx" ON "ProgramAssignment"("programId");

-- CreateIndex
CREATE INDEX "ProgramAssignment_patientId_idx" ON "ProgramAssignment"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "_ProgramFoods_AB_unique" ON "_ProgramFoods"("A", "B");

-- CreateIndex
CREATE INDEX "_ProgramFoods_B_index" ON "_ProgramFoods"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProgramSupplements_AB_unique" ON "_ProgramSupplements"("A", "B");

-- CreateIndex
CREATE INDEX "_ProgramSupplements_B_index" ON "_ProgramSupplements"("B");

-- AddForeignKey
ALTER TABLE "ProgramAssignment" ADD CONSTRAINT "ProgramAssignment_programId_fkey" FOREIGN KEY ("programId") REFERENCES "NutritionalProgram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramAssignment" ADD CONSTRAINT "ProgramAssignment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProgramFoods" ADD CONSTRAINT "_ProgramFoods_A_fkey" FOREIGN KEY ("A") REFERENCES "NutritionalProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProgramFoods" ADD CONSTRAINT "_ProgramFoods_B_fkey" FOREIGN KEY ("B") REFERENCES "RecommendedFood"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProgramSupplements" ADD CONSTRAINT "_ProgramSupplements_A_fkey" FOREIGN KEY ("A") REFERENCES "NutritionalProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProgramSupplements" ADD CONSTRAINT "_ProgramSupplements_B_fkey" FOREIGN KEY ("B") REFERENCES "Supplement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
