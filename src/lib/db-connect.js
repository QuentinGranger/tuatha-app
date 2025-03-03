// Script pour tester la connexion à la base de données
import prisma from './prisma';

async function testConnection() {
  let retries = 5;
  while (retries > 0) {
    try {
      console.log('Tentative de connexion à la base de données...');
      // Essayer de se connecter
      const connected = await prisma.$connect();
      console.log('Connexion à la base de données réussie');
      
      // Tester une requête simple
      const patientCount = await prisma.patient.findMany();
      console.log(`La base de données contient ${patientCount.length} patients`);
      
      return true;
    } catch (error) {
      console.error('Échec de la connexion à la base de données:', error);
      retries -= 1;
      console.log(`Tentatives restantes: ${retries}`);
      // Attendre 1 seconde avant de réessayer
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  return false;
}

export { testConnection };
