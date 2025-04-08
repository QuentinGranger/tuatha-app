import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const { token } = params;
    
    if (!token) {
      return NextResponse.json({ error: "Token non fourni" }, { status: 400 });
    }
    
    // Recherche du programme partagé par token
    const program = await prisma.program.findFirst({
      where: {
        shareToken: token
      },
      include: {
        healthProfessional: {
          include: {
            user: true
          }
        },
        exercises: {
          include: {
            exercise: true
          }
        },
        supplements: true
      }
    });
    
    if (!program) {
      return NextResponse.json({ error: "Programme non trouvé" }, { status: 404 });
    }
    
    // Informations sur le partage
    const shareInfo = {
      viewCount: Math.floor(Math.random() * 10) + 1, // Simulation
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 jours
    };
    
    return NextResponse.json({
      program,
      shareInfo
    });
    
  } catch (error) {
    console.error("Erreur lors de la récupération du programme:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du programme" },
      { status: 500 }
    );
  }
}
