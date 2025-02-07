import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const professionals = await prisma.healthProfessional.findMany({
      include: {
        user: true
      }
    });

    return NextResponse.json(professionals);
  } catch (error) {
    console.error('Error fetching health professionals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch health professionals' },
      { status: 500 }
    );
  }
}
