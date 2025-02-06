-- CreateEnum
CREATE TYPE "CommunicationPreference" AS ENUM ('EMAIL', 'PHONE', 'SMS');

-- CreateEnum
CREATE TYPE "HealthProfessionalSpecialty" AS ENUM ('DOCTOR', 'PHYSIOTHERAPIST', 'NUTRITIONIST', 'COACH');

-- CreateEnum
CREATE TYPE "TeamRole" AS ENUM ('PRIMARY', 'SECONDARY');

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "profilePictureUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthProfessional" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "specialty" "HealthProfessionalSpecialty" NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "profilePictureUrl" TEXT,
    "availability" JSONB NOT NULL,
    "preferredContactMethod" "CommunicationPreference" NOT NULL,
    "emergencyContact" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HealthProfessional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientHealthTeam" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "healthProfessionalId" TEXT NOT NULL,
    "role" "TeamRole" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "lastContactDate" TIMESTAMP(3),
    "communicationPreference" "CommunicationPreference" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatientHealthTeam_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Patient_email_key" ON "Patient"("email");

-- CreateIndex
CREATE UNIQUE INDEX "HealthProfessional_email_key" ON "HealthProfessional"("email");

-- CreateIndex
CREATE UNIQUE INDEX "HealthProfessional_licenseNumber_key" ON "HealthProfessional"("licenseNumber");

-- CreateIndex
CREATE INDEX "PatientHealthTeam_patientId_idx" ON "PatientHealthTeam"("patientId");

-- CreateIndex
CREATE INDEX "PatientHealthTeam_healthProfessionalId_idx" ON "PatientHealthTeam"("healthProfessionalId");

-- AddForeignKey
ALTER TABLE "PatientHealthTeam" ADD CONSTRAINT "PatientHealthTeam_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientHealthTeam" ADD CONSTRAINT "PatientHealthTeam_healthProfessionalId_fkey" FOREIGN KEY ("healthProfessionalId") REFERENCES "HealthProfessional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
