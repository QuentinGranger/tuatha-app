import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const pathologies = await prisma.pathology.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(pathologies);
  } catch (error) {
    console.error('Error fetching pathologies:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des pathologies' },
      { status: 500 }
    );
  }
}
