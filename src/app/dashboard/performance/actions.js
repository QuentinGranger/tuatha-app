'use server';

import prisma from '@/lib/prisma';
import { athletes, athleteData } from './test-data';

export async function getAllPatients() {
  try {
    console.log('Trying to fetch patients from database...');
    const patients = await prisma.patient.findMany({
      include: {
        user: true,
        healthProfessional: true,
        performanceData: true
      }
    });
    
    console.log('Database returned patients:', patients?.length || 0);
    
    // Vérifier si les patients ont bien été récupérés
    if (!patients || patients.length === 0) {
      console.log('No patients found in database, using test data');
      // Transformer les athlètes de test au format attendu
      return athletes.map(athlete => ({
        id: athlete.id,
        name: athlete.name, 
        objective: athlete.objective,
        status: athlete.status
      }));
    }
    
    // Transformer les patients au format attendu par le composant
    const formattedPatients = patients.map(patient => ({
      id: patient.id,
      name: patient.user ? `${patient.user.firstName} ${patient.user.lastName}` : 'Patient Sans Nom',
      objective: patient.objective || 'Objectif non défini',
      status: patient.status || 'active'
    }));
    
    console.log('Formatted patients:', formattedPatients);
    return formattedPatients;
  } catch (error) {
    console.error('Error fetching patients:', error);
    // Retourner les données de test en cas d'erreur
    console.log('Returning test athletes due to error');
    return athletes;
  }
}

export async function getFirstPatient() {
  try {
    const patient = await prisma.patient.findFirst({
      include: {
        user: true,
        healthProfessional: true,
        performanceData: true
      }
    });
    
    return patient;
  } catch (error) {
    console.error('Error fetching first patient:', error);
    // Retourner le premier athlète de test en cas d'erreur
    return athletes[0];
  }
}

export async function debugPatientData(patientId) {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        user: true,
        healthProfessional: true,
        performanceData: true
      }
    });
    
    if (!patient) {
      return {
        success: false,
        message: `Aucun patient trouvé avec l'ID: ${patientId}`,
        data: null
      };
    }
    
    return {
      success: true,
      message: 'Données patient récupérées avec succès',
      data: patient
    };
  } catch (error) {
    console.error(`Error fetching patient with ID ${patientId}:`, error);
    
    // Retourner les données de test pour cet athlète si disponibles
    const testData = athleteData[patientId];
    if (testData) {
      return {
        success: true,
        message: 'Données de test récupérées (base de données non disponible)',
        data: testData
      };
    }
    
    return {
      success: false,
      message: `Erreur lors de la récupération des données: ${error.message}`,
      data: null
    };
  }
}
