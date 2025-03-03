import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const professionals = await prisma.healthProfessional.findMany({
      include: {
        user: true
      }
    });

    return Response.json({ professionals });
  } catch (error) {
    console.error('Error fetching health professionals:', error);
    return Response.json(
      { error: 'Failed to fetch health professionals' },
      { status: 500 }
    );
  }
}
