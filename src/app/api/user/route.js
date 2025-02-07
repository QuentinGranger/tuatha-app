import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Pour la démo, on retourne toujours le premier utilisateur
    const user = await prisma.user.findFirst({
      where: {
        healthProfessional: {
          isNot: null
        }
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phoneNumber: true,
        photoUrl: true,
        healthProfessional: {
          select: {
            id: true,
            specialty: true,
            subSpecialty: true,
            availability: true,
            preferredContactMethod: true,
            emergencyContact: true,
            consultationTypes: true,
            consultationFee: true,
            conventionStatus: true,
            paymentMethods: true,
            acceptsHealthCard: true,
            description: true,
            yearsExperience: true,
            spokenLanguages: true,
            openingTime: true,
            closingTime: true,
            consultationDuration: true,
            workingDays: true,
            disponibilite: true,
            averageWaitTime: true,
            street: true,
            city: true,
            postalCode: true,
            country: true,
            handicapAccess: true,
            parking: true,
            equipment: true,
            acceptsEmergencies: true,
            occupancyRate: true,
            adeliNumber: true,
            rppsNumber: true,
            diplomas: true,
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}
