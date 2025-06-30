-- CreateEnum
CREATE TYPE "ProgramStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Specialty" ADD VALUE 'COACH_SPORTIF';
ALTER TYPE "Specialty" ADD VALUE 'NUTRITIONNISTE';
ALTER TYPE "Specialty" ADD VALUE 'MEDECIN_SPORT';
ALTER TYPE "Specialty" ADD VALUE 'KINESITHERAPEUTE';
ALTER TYPE "Specialty" ADD VALUE 'OSTEOPATHE';
ALTER TYPE "Specialty" ADD VALUE 'AUTRE';

-- AlterTable
ALTER TABLE "HealthProfessional" ADD COLUMN     "licenseNumber" TEXT,
ALTER COLUMN "availability" DROP NOT NULL,
ALTER COLUMN "availability" SET DEFAULT '{}',
ALTER COLUMN "emergencyContact" DROP NOT NULL,
ALTER COLUMN "emergencyContact" SET DEFAULT false,
ALTER COLUMN "acceptsEmergencies" DROP NOT NULL,
ALTER COLUMN "acceptsEmergencies" SET DEFAULT false,
ALTER COLUMN "acceptsHealthCard" DROP NOT NULL,
ALTER COLUMN "acceptsHealthCard" SET DEFAULT false,
ALTER COLUMN "averageWaitTime" DROP NOT NULL,
ALTER COLUMN "averageWaitTime" SET DEFAULT 30,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "city" SET DEFAULT '',
ALTER COLUMN "closingTime" DROP NOT NULL,
ALTER COLUMN "closingTime" SET DEFAULT '18:00',
ALTER COLUMN "consultationDuration" DROP NOT NULL,
ALTER COLUMN "consultationDuration" SET DEFAULT 30,
ALTER COLUMN "consultationFee" DROP NOT NULL,
ALTER COLUMN "consultationFee" SET DEFAULT 0.0,
ALTER COLUMN "consultationTypes" SET DEFAULT ARRAY[]::"ConsultationType"[],
ALTER COLUMN "conventionStatus" DROP NOT NULL,
ALTER COLUMN "conventionStatus" SET DEFAULT 'SECTEUR_1',
ALTER COLUMN "country" DROP NOT NULL,
ALTER COLUMN "country" SET DEFAULT 'France',
ALTER COLUMN "diplomas" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "disponibilite" DROP NOT NULL,
ALTER COLUMN "disponibilite" SET DEFAULT 'DISPONIBLE',
ALTER COLUMN "equipment" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "handicapAccess" DROP NOT NULL,
ALTER COLUMN "handicapAccess" SET DEFAULT false,
ALTER COLUMN "occupancyRate" DROP NOT NULL,
ALTER COLUMN "occupancyRate" SET DEFAULT 0.0,
ALTER COLUMN "openingTime" DROP NOT NULL,
ALTER COLUMN "openingTime" SET DEFAULT '09:00',
ALTER COLUMN "parking" DROP NOT NULL,
ALTER COLUMN "parking" SET DEFAULT false,
ALTER COLUMN "paymentMethods" SET DEFAULT ARRAY[]::"ModeReglement"[],
ALTER COLUMN "postalCode" DROP NOT NULL,
ALTER COLUMN "postalCode" SET DEFAULT '',
ALTER COLUMN "spokenLanguages" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "street" DROP NOT NULL,
ALTER COLUMN "street" SET DEFAULT '',
ALTER COLUMN "subSpecialty" SET DEFAULT '',
ALTER COLUMN "workingDays" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "yearsExperience" DROP NOT NULL,
ALTER COLUMN "yearsExperience" SET DEFAULT 0,
ALTER COLUMN "preferredContactMethod" DROP NOT NULL,
ALTER COLUMN "preferredContactMethod" SET DEFAULT 'EMAIL';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT;

-- CreateTable
CREATE TABLE "NutritionProgram" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "ProgramStatus" NOT NULL DEFAULT 'ACTIVE',
    "dietType" TEXT,
    "dietGoal" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "healthProfessionalId" TEXT,
    "patientId" TEXT,

    CONSTRAINT "NutritionProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meal" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "calories" INTEGER,
    "protein" DOUBLE PRECISION,
    "carbohydrates" DOUBLE PRECISION,
    "fat" DOUBLE PRECISION,
    "fiber" DOUBLE PRECISION,
    "sodium" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nutritionProgramId" TEXT,

    CONSTRAINT "Meal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NutritionSupplement" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "dosage" TEXT,
    "frequency" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nutritionProgramId" TEXT,

    CONSTRAINT "NutritionSupplement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramShareLink" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,
    "programId" TEXT NOT NULL,

    CONSTRAINT "ProgramShareLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProgramShareLink_token_key" ON "ProgramShareLink"("token");

-- AddForeignKey
ALTER TABLE "NutritionProgram" ADD CONSTRAINT "NutritionProgram_healthProfessionalId_fkey" FOREIGN KEY ("healthProfessionalId") REFERENCES "HealthProfessional"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionProgram" ADD CONSTRAINT "NutritionProgram_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meal" ADD CONSTRAINT "Meal_nutritionProgramId_fkey" FOREIGN KEY ("nutritionProgramId") REFERENCES "NutritionProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionSupplement" ADD CONSTRAINT "NutritionSupplement_nutritionProgramId_fkey" FOREIGN KEY ("nutritionProgramId") REFERENCES "NutritionProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramShareLink" ADD CONSTRAINT "ProgramShareLink_programId_fkey" FOREIGN KEY ("programId") REFERENCES "NutritionProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;
