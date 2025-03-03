import prisma from '@/lib/prisma';
import { testConnection } from '@/lib/db-connect';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    console.log('Attempting to fetch patients');
    
    // Tester la connexion avant de faire des requêtes
    const connected = await testConnection();
    
    if (!connected) {
      return new Response(
        JSON.stringify([]),  // Retourner un tableau vide en cas d'erreur
        { 
          status: 200,  // Retourner 200 même en cas d'erreur pour éviter les erreurs côté client
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    const patients = await prisma.patient.findMany({
      include: {
        user: true
      }
    });

    console.log(`Found ${patients.length} patients`);
    console.log('Sample patient data:', JSON.stringify(patients[0], null, 2));
    
    // Formater les données pour faciliter l'utilisation côté client
    const formattedPatients = patients.map(patient => ({
      id: patient.id,
      userId: patient.userId,
      firstName: patient.user.firstName,
      lastName: patient.user.lastName,
      userName: `${patient.user.firstName} ${patient.user.lastName}`,
      email: patient.user.email,
      phone: patient.user.phoneNumber,
      photo: patient.user.photoUrl,
      age: patient.age || null,
      sport: patient.sport,
      injury: patient.injury,
      lastAppointment: patient.lastAppointment,
      nutritionalStatus: patient.nutritionalStatus,
      progressionStatus: patient.progressionStatus,
      alerts: patient.alerts || {},
      // Conserver également l'objet user pour compatibilité avec le code existant
      user: patient.user
    }));

    console.log('Sample formatted patient:', JSON.stringify(formattedPatients[0], null, 2));
    
    return new Response(
      JSON.stringify(formattedPatients),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error fetching patients:', error);
    // Retourner un tableau vide en cas d'erreur
    return new Response(
      JSON.stringify([]),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
