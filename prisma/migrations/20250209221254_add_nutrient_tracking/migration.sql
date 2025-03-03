-- CreateEnum
CREATE TYPE "DeficiencyLevel" AS ENUM ('NONE', 'MILD', 'MODERATE', 'SEVERE');

-- CreateEnum
CREATE TYPE "NutrientType" AS ENUM ('IRON', 'VITAMIN_D', 'VITAMIN_B12', 'MAGNESIUM', 'ZINC', 'CALCIUM', 'PROTEIN');

-- CreateTable
CREATE TABLE "NutrientDeficiency" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "nutrient" "NutrientType" NOT NULL,
    "level" "DeficiencyLevel" NOT NULL,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "status" "ProgressionStatus" NOT NULL,
    "treatment" TEXT,

    CONSTRAINT "NutrientDeficiency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NutrientTracking" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ironLevel" DOUBLE PRECISION,
    "vitaminD" DOUBLE PRECISION,
    "vitaminB12" DOUBLE PRECISION,
    "magnesium" DOUBLE PRECISION,
    "zinc" DOUBLE PRECISION,
    "calcium" DOUBLE PRECISION,
    "protein" DOUBLE PRECISION,
    "notes" TEXT,

    CONSTRAINT "NutrientTracking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NutrientDeficiency_patientId_nutrient_key" ON "NutrientDeficiency"("patientId", "nutrient");

-- CreateIndex
CREATE INDEX "NutrientTracking_patientId_date_idx" ON "NutrientTracking"("patientId", "date");

-- AddForeignKey
ALTER TABLE "NutrientDeficiency" ADD CONSTRAINT "NutrientDeficiency_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutrientTracking" ADD CONSTRAINT "NutrientTracking_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
