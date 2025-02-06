-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ATHLETE', 'MEDECIN');

-- CreateEnum
CREATE TYPE "ConsultationType" AS ENUM ('PRESENTIEL', 'VISIO', 'HYBRIDE');

-- CreateEnum
CREATE TYPE "Disponibilite" AS ENUM ('DISPONIBLE', 'OCCUPE', 'CONGE');

-- CreateEnum
CREATE TYPE "ModeReglement" AS ENUM ('CB', 'ESPECES', 'CHEQUE', 'TIERS_PAYANT', 'VIREMENT');

-- CreateEnum
CREATE TYPE "StatutConventionnement" AS ENUM ('SECTEUR_1', 'SECTEUR_2', 'NON_CONVENTIONNE');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "telephone" TEXT,
    "photo_url" TEXT,
    "role" "UserRole" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "specialisation" TEXT,
    "sous_specialite" TEXT,
    "diplomes_urls" TEXT[],
    "numero_adeli" TEXT,
    "numero_rpps" TEXT,
    "consultation_type" "ConsultationType"[],
    "tarif_consultation" DECIMAL(10,2),
    "statut_conventionnement" "StatutConventionnement",
    "modes_reglement" "ModeReglement"[],
    "carte_vitale" BOOLEAN NOT NULL DEFAULT true,
    "tiers_payant" BOOLEAN NOT NULL DEFAULT false,
    "horaire_ouverture" TEXT,
    "horaire_fermeture" TEXT,
    "duree_consultation" INTEGER,
    "jours_travail" TEXT[],
    "disponibilite" "Disponibilite" NOT NULL DEFAULT 'DISPONIBLE',
    "delai_rdv_moyen" INTEGER,
    "adresse_rue" TEXT,
    "adresse_complement" TEXT,
    "code_postal" TEXT,
    "ville" TEXT,
    "pays" TEXT DEFAULT 'France',
    "coordonnees_gps" JSONB,
    "acces_pmr" BOOLEAN NOT NULL DEFAULT false,
    "parking" BOOLEAN NOT NULL DEFAULT false,
    "transport_commun" TEXT,
    "description" TEXT,
    "experience_annees" INTEGER,
    "langues_parlees" TEXT[],
    "assurance_rcp" TEXT,
    "type_cabinet" TEXT,
    "equipements" TEXT[],
    "salle_attente" BOOLEAN NOT NULL DEFAULT true,
    "wifi_patients" BOOLEAN NOT NULL DEFAULT false,
    "site_web" TEXT,
    "reseaux_sociaux" JSONB,
    "logiciel_medical" TEXT,
    "nombre_patients_max" INTEGER,
    "patients_actuels" INTEGER,
    "age_minimum_patient" INTEGER,
    "age_maximum_patient" INTEGER,
    "accepte_urgences" BOOLEAN NOT NULL DEFAULT false,
    "remplacant_habituel" TEXT,
    "notifications_email" BOOLEAN NOT NULL DEFAULT true,
    "notifications_sms" BOOLEAN NOT NULL DEFAULT false,
    "rappel_rdv_delai" INTEGER,
    "note_moyenne" DECIMAL(3,2),
    "nombre_avis" INTEGER NOT NULL DEFAULT 0,
    "consultations_total" INTEGER NOT NULL DEFAULT 0,
    "taux_remplissage" DECIMAL(3,2),
    "email_verifie" BOOLEAN NOT NULL DEFAULT false,
    "telephone_verifie" BOOLEAN NOT NULL DEFAULT false,
    "compte_verifie" BOOLEAN NOT NULL DEFAULT false,
    "derniere_connexion" TIMESTAMP(3),
    "supprime" BOOLEAN NOT NULL DEFAULT false,
    "date_suppression" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
