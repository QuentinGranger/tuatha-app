import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const patients = await prisma.patient.findMany({
      include: {
        user: true,
        healthProfessional: {
          include: {
            user: true
          }
        }
      }
    });
    
    return NextResponse.json(patients);
  } catch (error) {
    console.error("Erreur lors de la récupération des patients:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des patients" },
      { status: 500 }
    );
  }
}
