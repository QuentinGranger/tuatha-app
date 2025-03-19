import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  try {
    // Ne pas filtrer les professionnels de santé avec patientHealthProfessional
    // car cela n'est pas implémenté dans le mock
    const professionals = await prisma.healthProfessional.findMany();

    return Response.json(professionals);
  } catch (error) {
    console.error('Error fetching health professionals:', error);
    return Response.json(
      { error: 'Failed to fetch health professionals' },
      { status: 500 }
    );
  }
}
