-- CreateTable
CREATE TABLE "PatientHealthProfessional" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "healthProfessionalId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "specialNotes" TEXT,
    "lastConsultation" TIMESTAMP(3),
    "nextConsultation" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatientHealthProfessional_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PatientHealthProfessional_patientId_healthProfessionalId_key" ON "PatientHealthProfessional"("patientId", "healthProfessionalId");

-- AddForeignKey
ALTER TABLE "PatientHealthProfessional" ADD CONSTRAINT "PatientHealthProfessional_healthProfessionalId_fkey" FOREIGN KEY ("healthProfessionalId") REFERENCES "HealthProfessional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientHealthProfessional" ADD CONSTRAINT "PatientHealthProfessional_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
