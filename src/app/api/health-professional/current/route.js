import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Pour la démo, on retourne toujours le premier professionnel de santé
    const healthProfessional = await prisma.healthProfessional.findFirst({
      include: {
        user: true
      }
    });

    if (!healthProfessional) {
      return NextResponse.json(
        { error: 'Health professional not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(healthProfessional);
  } catch (error) {
    console.error('Error fetching health professional:', error);
    return NextResponse.json(
      { error: 'Failed to fetch current health professional' },
      { status: 500 }
    );
  }
}
