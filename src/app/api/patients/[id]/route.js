import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  const { id } = params;
  
  try {
    const patient = await prisma.patient.findUnique({
      where: {
        id: id
      },
      include: {
        user: true,
        healthProfessional: {
          include: {
            user: true
          }
        },
        programs: true,
        consultations: true,
        measurements: {
          orderBy: {
            date: 'desc'
          }
        }
      }
    });
    
    if (!patient) {
      return NextResponse.json(
        { error: "Patient non trouvé" },
        { status: 404 }
      );
    }
    
    // Liste des images de super-héros disponibles
    const heroImages = [
      'batman.jpg',
      'deku.jpg',
      'goku.jpg',
      'ironman.jpg',
      'luffy.jpg',
      'naruto.jpg',
      'saitama.jpg',
      'spiderman.jpg',
      'thor.jpg',
      'wonderwoman.jpg'
    ];
    
    // L'id du patient est généralement sous la forme pat-001, pat-002, etc.
    const patientNumber = parseInt(id.replace('pat-', ''), 10) || 1;
    const heroIndex = (patientNumber - 1) % heroImages.length;
    
    // Créer une copie enrichie du patient avec la photo
    const enrichedPatient = {
      ...patient,
      photo: `/img/patient/${heroImages[heroIndex]}`
    };
    
    return NextResponse.json(enrichedPatient);
  } catch (error) {
    console.error(`Erreur lors de la récupération du patient ${id}:`, error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du patient" },
      { status: 500 }
    );
  }
}
