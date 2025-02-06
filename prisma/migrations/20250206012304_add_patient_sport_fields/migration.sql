/*
  Warnings:

  - Added the required column `sport` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NutritionalStatus" AS ENUM ('GOOD', 'AVERAGE', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ProgressionStatus" AS ENUM ('IMPROVING', 'STAGNATING', 'DECLINING');

-- AlterTable
ALTER TABLE "Patient" 
ADD COLUMN "sport" TEXT NOT NULL DEFAULT 'Non spécifié',
ADD COLUMN "injury" TEXT,
ADD COLUMN "lastAppointment" TIMESTAMP(3),
ADD COLUMN "nutritionalStatus" "NutritionalStatus" NOT NULL DEFAULT 'GOOD',
ADD COLUMN "progressionStatus" "ProgressionStatus" NOT NULL DEFAULT 'IMPROVING';

-- Update existing records with default values
UPDATE "Patient" SET "sport" = 'Non spécifié';
