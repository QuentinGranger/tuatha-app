import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const { token } = params;
    
    if (!token) {
      return NextResponse.json({ error: 'Token invalide ou manquant' }, { status: 400 });
    }

    // Récupérer le lien de partage correspondant au token
    const shareLink = await prisma.programShareLink.findFirst({
      where: { 
        token,
        expiresAt: {
          gt: new Date() // Vérifier que le lien n'a pas expiré
        }
      },
      include: {
        program: {
          include: {
            supplements: true,
            exercises: {
              include: {
                exercise: true,
              }
            },
            healthProfessional: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                  }
                }
              }
            }
          }
        }
      }
    });

    // Si le lien n'existe pas ou a expiré
    if (!shareLink) {
      return NextResponse.json({ error: 'Lien de partage invalide ou expiré' }, { status: 404 });
    }

    // Incrémenter le compteur de vues
    await prisma.programShareLink.update({
      where: { id: shareLink.id },
      data: { viewCount: { increment: 1 } }
    });

    // Retourner les informations du programme sans les informations sensibles
    return NextResponse.json({
      program: {
        id: shareLink.program.id,
        title: shareLink.program.title,
        description: shareLink.program.description,
        category: shareLink.program.category,
        objective: shareLink.program.objective,
        createdAt: shareLink.program.createdAt,
        updatedAt: shareLink.program.updatedAt,
        supplements: shareLink.program.supplements,
        exercises: shareLink.program.exercises,
        healthProfessional: {
          id: shareLink.program.healthProfessional?.id,
          user: {
            firstName: shareLink.program.healthProfessional?.user?.firstName,
            lastName: shareLink.program.healthProfessional?.user?.lastName,
          }
        }
      },
      shareInfo: {
        expiresAt: shareLink.expiresAt,
        createdAt: shareLink.createdAt,
        viewCount: shareLink.viewCount + 1
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du programme partagé :', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération du programme partagé' }, { status: 500 });
  }
}
