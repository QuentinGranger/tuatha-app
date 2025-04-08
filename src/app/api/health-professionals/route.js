import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const healthProfessionals = await prisma.healthProfessional.findMany({
      include: {
        user: true,
        patients: {
          include: {
            user: true
          }
        }
      }
    });
    
    return NextResponse.json(healthProfessionals);
  } catch (error) {
    console.error("Erreur lors de la récupération des professionnels de santé:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des professionnels de santé" },
      { status: 500 }
    );
  }
}
