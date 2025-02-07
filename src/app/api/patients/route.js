import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const patients = await prisma.patient.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            photoUrl: true
          }
        }
      },
      orderBy: {
        lastAppointment: 'desc'
      }
    });

    const formattedPatients = patients.map(patient => ({
      id: patient.id,
      firstName: patient.user.firstName,
      lastName: patient.user.lastName,
      email: patient.user.email,
      phoneNumber: patient.user.phoneNumber,
      photoUrl: patient.user.photoUrl,
      sport: patient.sport,
      injury: patient.injury,
      lastAppointment: patient.lastAppointment,
      nutritionalStatus: patient.nutritionalStatus,
      progressionStatus: patient.progressionStatus
    }));

    return NextResponse.json(formattedPatients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
      { status: 500 }
    );
  }
}
