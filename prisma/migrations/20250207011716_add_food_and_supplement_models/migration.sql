/*
  Warnings:

  - You are about to drop the column `benefits` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `HealthProfessional` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `HealthProfessional` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `HealthProfessional` table. All the data in the column will be lost.
  - You are about to drop the column `licenseNumber` on the `HealthProfessional` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `HealthProfessional` table. All the data in the column will be lost.
  - You are about to drop the column `profilePictureUrl` on the `HealthProfessional` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `profilePictureUrl` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `PatientPathology` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `Program` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Program` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Program` table. All the data in the column will be lost.
  - You are about to drop the column `objectives` on the `Program` table. All the data in the column will be lost.
  - You are about to drop the column `pathologyId` on the `Program` table. All the data in the column will be lost.
  - You are about to drop the column `recommendations` on the `Supplement` table. All the data in the column will be lost.
  - You are about to drop the `PatientHealthTeam` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProgramAssignment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FoodToProgram` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProgramToSupplement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Food` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `HealthProfessional` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Pathology` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[patientId,pathologyId]` on the table `PatientPathology` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Supplement` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `acceptsEmergencies` to the `HealthProfessional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `acceptsHealthCard` to the `HealthProfessional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `averageWaitTime` to the `HealthProfessional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `HealthProfessional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `closingTime` to the `HealthProfessional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `consultationDuration` to the `HealthProfessional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `consultationFee` to the `HealthProfessional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `conventionStatus` to the `HealthProfessional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `HealthProfessional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `disponibilite` to the `HealthProfessional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `handicapAccess` to the `HealthProfessional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `occupancyRate` to the `HealthProfessional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `openingTime` to the `HealthProfessional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parking` to the `HealthProfessional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `HealthProfessional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `HealthProfessional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `HealthProfessional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yearsExperience` to the `HealthProfessional` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `specialty` on the `HealthProfessional` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `preferredContactMethod` on the `HealthProfessional` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `userId` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `healthProfessionalId` to the `Program` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientId` to the `Program` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Program` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Program` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Specialty" AS ENUM ('NUTRITIONIST', 'PHYSIOTHERAPIST', 'PSYCHOLOGIST', 'DOCTOR', 'GENERAL', 'RADIOLOGIST', 'PEDIATRICIAN', 'PHYSICAL_TRAINER', 'DIETITIAN');

-- CreateEnum
CREATE TYPE "ContactMethod" AS ENUM ('EMAIL', 'PHONE', 'SMS');

-- AlterEnum
ALTER TYPE "ProgressionStatus" ADD VALUE 'WORSENING';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserRole" ADD VALUE 'ADMIN';
ALTER TYPE "UserRole" ADD VALUE 'HEALTH_PROFESSIONAL';
ALTER TYPE "UserRole" ADD VALUE 'PATIENT';

-- DropForeignKey
ALTER TABLE "PatientHealthTeam" DROP CONSTRAINT "PatientHealthTeam_healthProfessionalId_fkey";

-- DropForeignKey
ALTER TABLE "PatientHealthTeam" DROP CONSTRAINT "PatientHealthTeam_patientId_fkey";

-- DropForeignKey
ALTER TABLE "Program" DROP CONSTRAINT "Program_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Program" DROP CONSTRAINT "Program_pathologyId_fkey";

-- DropForeignKey
ALTER TABLE "ProgramAssignment" DROP CONSTRAINT "ProgramAssignment_patientId_fkey";

-- DropForeignKey
ALTER TABLE "ProgramAssignment" DROP CONSTRAINT "ProgramAssignment_programId_fkey";

-- DropForeignKey
ALTER TABLE "_FoodToProgram" DROP CONSTRAINT "_FoodToProgram_A_fkey";

-- DropForeignKey
ALTER TABLE "_FoodToProgram" DROP CONSTRAINT "_FoodToProgram_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProgramToSupplement" DROP CONSTRAINT "_ProgramToSupplement_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProgramToSupplement" DROP CONSTRAINT "_ProgramToSupplement_B_fkey";

-- DropIndex
DROP INDEX "HealthProfessional_email_key";

-- DropIndex
DROP INDEX "HealthProfessional_licenseNumber_key";

-- DropIndex
DROP INDEX "Patient_email_key";

-- DropIndex
DROP INDEX "PatientPathology_pathologyId_idx";

-- DropIndex
DROP INDEX "PatientPathology_patientId_idx";

-- DropIndex
DROP INDEX "Program_createdById_idx";

-- DropIndex
DROP INDEX "Program_pathologyId_idx";

-- AlterTable
ALTER TABLE "Food" DROP COLUMN "benefits",
ADD COLUMN     "calories" DOUBLE PRECISION,
ADD COLUMN     "carbs" DOUBLE PRECISION,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "fats" DOUBLE PRECISION,
ADD COLUMN     "fiber" DOUBLE PRECISION,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "proteins" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "HealthProfessional" DROP COLUMN "email",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "licenseNumber",
DROP COLUMN "phone",
DROP COLUMN "profilePictureUrl",
ADD COLUMN     "acceptsEmergencies" BOOLEAN NOT NULL,
ADD COLUMN     "acceptsHealthCard" BOOLEAN NOT NULL,
ADD COLUMN     "adeliNumber" TEXT,
ADD COLUMN     "averageWaitTime" INTEGER NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "closingTime" TEXT NOT NULL,
ADD COLUMN     "consultationDuration" INTEGER NOT NULL,
ADD COLUMN     "consultationFee" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "consultationTypes" "ConsultationType"[],
ADD COLUMN     "conventionStatus" "StatutConventionnement" NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "diplomas" TEXT[],
ADD COLUMN     "disponibilite" "Disponibilite" NOT NULL,
ADD COLUMN     "equipment" TEXT[],
ADD COLUMN     "handicapAccess" BOOLEAN NOT NULL,
ADD COLUMN     "occupancyRate" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "openingTime" TEXT NOT NULL,
ADD COLUMN     "parking" BOOLEAN NOT NULL,
ADD COLUMN     "paymentMethods" "ModeReglement"[],
ADD COLUMN     "postalCode" TEXT NOT NULL,
ADD COLUMN     "rppsNumber" TEXT,
ADD COLUMN     "spokenLanguages" TEXT[],
ADD COLUMN     "street" TEXT NOT NULL,
ADD COLUMN     "subSpecialty" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "workingDays" TEXT[],
ADD COLUMN     "yearsExperience" INTEGER NOT NULL,
DROP COLUMN "specialty",
ADD COLUMN     "specialty" "Specialty" NOT NULL,
DROP COLUMN "preferredContactMethod",
ADD COLUMN     "preferredContactMethod" "ContactMethod" NOT NULL,
ALTER COLUMN "emergencyContact" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Pathology" ADD COLUMN     "symptoms" TEXT[],
ADD COLUMN     "treatments" TEXT[];

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "email",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "phone",
DROP COLUMN "profilePictureUrl",
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "lastAppointment" DROP NOT NULL,
ALTER COLUMN "nutritionalStatus" DROP NOT NULL,
ALTER COLUMN "progressionStatus" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PatientPathology" DROP COLUMN "status",
ADD COLUMN     "diagnosis" TEXT,
ADD COLUMN     "severity" TEXT,
ALTER COLUMN "startDate" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Program" DROP COLUMN "createdById",
DROP COLUMN "duration",
DROP COLUMN "name",
DROP COLUMN "objectives",
DROP COLUMN "pathologyId",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "healthProfessionalId" TEXT NOT NULL,
ADD COLUMN     "patientId" TEXT NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Supplement" DROP COLUMN "recommendations",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "frequency" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "sideEffects" TEXT[],
ADD COLUMN     "warnings" TEXT[],
ALTER COLUMN "dosage" DROP NOT NULL;

-- DropTable
DROP TABLE "PatientHealthTeam";

-- DropTable
DROP TABLE "ProgramAssignment";

-- DropTable
DROP TABLE "_FoodToProgram";

-- DropTable
DROP TABLE "_ProgramToSupplement";

-- DropTable
DROP TABLE "users";

-- DropEnum
DROP TYPE "CommunicationPreference";

-- DropEnum
DROP TYPE "HealthProfessionalSpecialty";

-- DropEnum
DROP TYPE "PathologyStatus";

-- DropEnum
DROP TYPE "ProgramStatus";

-- DropEnum
DROP TYPE "TeamRole";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "phoneNumber" TEXT,
    "photoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "videoUrl" TEXT,
    "imageUrl" TEXT,
    "category" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "equipment" TEXT[],
    "muscleGroups" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramExercise" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "sets" INTEGER,
    "reps" INTEGER,
    "duration" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgramExercise_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Food_name_key" ON "Food"("name");

-- CreateIndex
CREATE UNIQUE INDEX "HealthProfessional_userId_key" ON "HealthProfessional"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Pathology_name_key" ON "Pathology"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_userId_key" ON "Patient"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PatientPathology_patientId_pathologyId_key" ON "PatientPathology"("patientId", "pathologyId");

-- CreateIndex
CREATE UNIQUE INDEX "Supplement_name_key" ON "Supplement"("name");

-- AddForeignKey
ALTER TABLE "HealthProfessional" ADD CONSTRAINT "HealthProfessional_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_healthProfessionalId_fkey" FOREIGN KEY ("healthProfessionalId") REFERENCES "HealthProfessional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramExercise" ADD CONSTRAINT "ProgramExercise_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramExercise" ADD CONSTRAINT "ProgramExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
