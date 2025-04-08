import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
// Suppression des importations NextAuth qui posent problème
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    // Dans un environnement réel, récupérer l'ID du professionnel à partir de la session
    // Commenté car l'authentification n'est pas configurée correctement
    // const session = await getServerSession(authOptions);
    // if (!session || !session.user) {
    //   return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    // }
    
    // Pour la démo, on utilise un ID fixe
    const healthProId = 'hp-001';
    
    const healthProfessional = await prisma.healthProfessional.findUnique({
      where: { id: healthProId },
      include: {
        user: true,
        patients: {
          include: {
            user: true
          }
        }
      }
    });
    
    if (!healthProfessional) {
      return NextResponse.json({ error: "Professionnel de santé non trouvé" }, { status: 404 });
    }
    
    return NextResponse.json(healthProfessional);
  } catch (error) {
    console.error("Erreur lors de la récupération du professionnel de santé:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du professionnel de santé" },
      { status: 500 }
    );
  }
}
