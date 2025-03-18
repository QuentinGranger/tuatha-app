import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request, { params }) {
  try {
    // Dans Next.js 13+, params est un objet régulier
    // Déstructuration des paramètres en tant qu'argument pour éviter l'avertissement
    const { id } = params;
    
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            photoUrl: true,
            phoneNumber: true
          }
        }
      }
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

    // Formater les données pour le frontend
    const formattedPatient = {
      id: patient.id,
      userId: patient.userId,
      firstName: patient.user.firstName,
      lastName: patient.user.lastName,
      userName: `${patient.user.firstName} ${patient.user.lastName}`,
      email: patient.user.email,
      phone: patient.user.phoneNumber,
      photo: patient.user.photoUrl, // Ajout explicite de la photo
      age: patient.age || null, // Ajout de l'âge (peut être null)
      sport: patient.sport,
      injury: patient.injury,
      lastAppointment: patient.lastAppointment,
      nutritionalStatus: patient.nutritionalStatus,
      progressionStatus: patient.progressionStatus,
      alerts: patient.alerts || {},
      metrics: {
        nutrition: {
          proteinIntake: patient.proteinIntake,
          carbIntake: patient.carbIntake,
          fatIntake: patient.fatIntake,
          hydration: patient.hydration,
          nutritionalStatus: patient.nutritionalStatus
        },
        physical: {
          weight: patient.weight,
          height: patient.height,
          bodyFat: patient.bodyFat,
          muscleMass: patient.muscleMass
        },
        cardio: {
          vo2max: patient.vo2max,
          restingHeartRate: patient.restingHeartRate,
          maxHeartRate: patient.maxHeartRate
        },
        performance: {
          strengthScore: patient.strengthScore,
          enduranceScore: patient.enduranceScore,
          flexibilityScore: patient.flexibilityScore
        },
        recovery: {
          recoveryScore: patient.recoveryScore,
          sleepQuality: patient.sleepQuality,
          stressLevel: patient.stressLevel
        }
      }
    };

    return new Response(
      JSON.stringify(formattedPatient), 
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Erreur lors de la récupération du patient:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur lors de la récupération du patient' }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
