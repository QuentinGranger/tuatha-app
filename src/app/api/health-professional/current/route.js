import prisma from '@/lib/prisma';
import { testConnection } from '@/lib/db-connect';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    console.log('Attempting to fetch health professional');
    
    // Tester la connexion avant de faire des requêtes
    const connected = await testConnection();
    
    if (!connected) {
      return new Response(
        JSON.stringify({ error: 'Database connection failed' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Pour la démo, on retourne toujours le premier professionnel de santé
    const healthProfessional = await prisma.healthProfessional.findFirst({
      include: {
        user: true
      }
    });

    if (!healthProfessional) {
      return new Response(
        JSON.stringify({ error: 'Health professional not found' }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify(healthProfessional),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error fetching health professional:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch current health professional', details: error.message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
