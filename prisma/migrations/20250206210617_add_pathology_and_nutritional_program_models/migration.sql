/*
  Warnings:

  - Made the column `lastAppointment` on table `Patient` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "PathologyStatus" AS ENUM ('ACTIVE', 'RECOVERING', 'RESOLVED');

-- AlterTable
ALTER TABLE "Patient" ALTER COLUMN "sport" DROP NOT NULL,
ALTER COLUMN "sport" DROP DEFAULT,
ALTER COLUMN "lastAppointment" SET NOT NULL,
ALTER COLUMN "nutritionalStatus" DROP DEFAULT,
ALTER COLUMN "progressionStatus" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Pathology" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pathology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientPathology" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "pathologyId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "status" "PathologyStatus" NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatientPathology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NutritionalProgram" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pathologyId" TEXT NOT NULL,
    "objectives" TEXT[],
    "duration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NutritionalProgram_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PatientPathology_patientId_idx" ON "PatientPathology"("patientId");

-- CreateIndex
CREATE INDEX "PatientPathology_pathologyId_idx" ON "PatientPathology"("pathologyId");

-- CreateIndex
CREATE INDEX "NutritionalProgram_pathologyId_idx" ON "NutritionalProgram"("pathologyId");

-- AddForeignKey
ALTER TABLE "PatientPathology" ADD CONSTRAINT "PatientPathology_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientPathology" ADD CONSTRAINT "PatientPathology_pathologyId_fkey" FOREIGN KEY ("pathologyId") REFERENCES "Pathology"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionalProgram" ADD CONSTRAINT "NutritionalProgram_pathologyId_fkey" FOREIGN KEY ("pathologyId") REFERENCES "Pathology"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
