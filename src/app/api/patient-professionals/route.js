import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  try {
    // Obtenir l'ID du patient depuis les paramètres de requête
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    
    if (!patientId) {
      return new Response(
        JSON.stringify({ error: 'ID de patient requis' }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Vérifier que le patient existe
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      return new Response(
        JSON.stringify({ error: 'Patient non trouvé' }), 
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Récupérer les relations patient-professionnel
    const patientProfessionalRelations = await prisma.patientHealthProfessional.findMany({
      where: { 
        patientId: patientId,
        status: 'ACTIVE' // Optionnel: filtrer uniquement les relations actives
      },
      include: {
        healthProfessional: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                photoUrl: true,
                phoneNumber: true,
                createdAt: true
              }
            }
          }
        }
      }
    });

    // Formater les données pour le frontend
    const professionals = patientProfessionalRelations.map(relation => {
      const hp = relation.healthProfessional;
      const user = hp.user;
      
      return {
        id: hp.id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phoneNumber,
        photoUrl: user.photoUrl,
        specialty: hp.specialty,
        subSpecialty: hp.subSpecialty,
        description: hp.description,
        status: relation.status,
        specialNotes: relation.specialNotes,
        lastConsultation: relation.lastConsultation,
        nextConsultation: relation.nextConsultation,
        yearsExperience: hp.yearsExperience,
        // Construire l'adresse à partir des champs disponibles
        address: hp.street && hp.city 
          ? `${hp.street}, ${hp.postalCode} ${hp.city}, ${hp.country}`
          : null,
        // Les compétences sont stockées dans 'spokenLanguages', 'equipment', 'diplomas'
        skills: hp.diplomas || []
      };
    });

    return new Response(
      JSON.stringify({ professionals }), 
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Erreur lors de la récupération des professionnels de santé:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur lors de la récupération des professionnels de santé', details: error.message }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
