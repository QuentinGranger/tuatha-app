import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    
    if (!query || query.trim().length < 2) {
      return NextResponse.json({ results: [] });
    }

    const searchTerm = query.toLowerCase();

    // Rechercher les patients
    const patients = await prisma.patient.findMany({
      where: {
        OR: [
          { firstName: { contains: searchTerm, mode: 'insensitive' } },
          { lastName: { contains: searchTerm, mode: 'insensitive' } },
          { email: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      take: 5,
    });

    // Rechercher les professionnels de santé
    const professionals = await prisma.healthProfessional.findMany({
      where: {
        OR: [
          { user: { firstName: { contains: searchTerm, mode: 'insensitive' } } },
          { user: { lastName: { contains: searchTerm, mode: 'insensitive' } } },
          { specialty: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      include: {
        user: true,
      },
      take: 5,
    });

    // Formater les résultats
    const formattedResults = [
      ...patients.map(patient => ({
        id: patient.id,
        name: `${patient.firstName} ${patient.lastName}`,
        category: 'patients',
        avatar: patient.avatar || null,
        details: `Email: ${patient.email}`,
        url: `/dashboard/patients/${patient.id}`
      })),
      ...professionals.map(pro => ({
        id: pro.id,
        name: `${pro.user.firstName} ${pro.user.lastName}`,
        category: 'professionals',
        avatar: pro.user.photoUrl || null,
        details: pro.specialty,
        url: `/dashboard/relations?professional=${pro.id}`
      })),
    ];

    // Classer les résultats par pertinence (débute par le terme de recherche)
    formattedResults.sort((a, b) => {
      const aStartsWithQuery = a.name.toLowerCase().startsWith(searchTerm);
      const bStartsWithQuery = b.name.toLowerCase().startsWith(searchTerm);
      
      if (aStartsWithQuery && !bStartsWithQuery) return -1;
      if (!aStartsWithQuery && bStartsWithQuery) return 1;
      return 0;
    });

    return NextResponse.json({ results: formattedResults });
    
  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json({ error: 'An error occurred while searching' }, { status: 500 });
  }
}
