import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Récupérer l'ID du programme à partir des paramètres de requête
    const { searchParams } = new URL(request.url);
    const programId = searchParams.get('id');

    if (!programId) {
      return NextResponse.json({ error: 'ID du programme manquant' }, { status: 400 });
    }

    // Vérifier que le programme existe
    const program = await prisma.program.findUnique({
      where: { id: programId },
      include: {
        healthProfessional: true
      }
    });

    if (!program) {
      return NextResponse.json({ error: 'Programme non trouvé' }, { status: 404 });
    }

    // Vérifier que l'utilisateur est autorisé à partager ce programme
    if (program.healthProfessionalId !== session.user.id && !session.user.isAdmin) {
      return NextResponse.json({ error: 'Non autorisé à partager ce programme' }, { status: 403 });
    }

    // Vérifier si un lien de partage existe déjà pour ce programme
    let shareLink = await prisma.programShareLink.findFirst({
      where: { programId }
    });

    // Si aucun lien de partage n'existe, en créer un nouveau
    if (!shareLink) {
      // Générer un token unique
      const token = crypto.randomBytes(32).toString('hex');
      
      // Créer le lien de partage
      shareLink = await prisma.programShareLink.create({
        data: {
          token,
          programId,
          createdById: session.user.id,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expire dans 30 jours
        }
      });
    }

    // Construire et retourner l'URL complète de partage
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const shareUrl = `${baseUrl}/programmes/shared/${shareLink.token}`;

    return NextResponse.json({ 
      shareUrl,
      token: shareLink.token,
      expiresAt: shareLink.expiresAt 
    });
    
  } catch (error) {
    console.error('Erreur lors de la création du lien de partage :', error);
    return NextResponse.json({ error: 'Erreur lors de la création du lien de partage' }, { status: 500 });
  }
}
