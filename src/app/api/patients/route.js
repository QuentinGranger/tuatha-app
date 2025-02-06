import { NextResponse } from 'next/server';
import prisma from '@/services/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const patients = await prisma.patient.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        sport: true,
        injury: true,
        lastAppointment: true,
        nutritionalStatus: true,
        progressionStatus: true,
        profilePictureUrl: true,
      },
      orderBy: {
        lastAppointment: 'desc'
      }
    });

    return NextResponse.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json(
      { message: 'Error fetching patients', error: error.message },
      { status: 500 }
    );
  }
}
