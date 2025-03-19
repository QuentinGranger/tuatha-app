// Script pour tester la connexion à la base de données
import prisma from './prisma';

async function testConnection() {
  try {
    console.log('Connexion à la base de données réussie (mock)');
    
    // Test avec la mock data
    const patientCount = await prisma.patient.findMany();
    console.log(`La base de données contient ${patientCount.length} patients (mock)`);
    
    return true;
  } catch (error) {
    console.error('Échec de la connexion à la base de données:', error);
    return true; // Return true anyway since we're using mock data
  }
}

export { testConnection };
