import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const data = await request.json();
    
    if (!data.patientId) {
      return NextResponse.json({ error: "ID du patient requis" }, { status: 400 });
    }
    
    if (!data.type || !['DOCUMENT', 'PROGRAM', 'TEST_RESULT'].includes(data.type)) {
      return NextResponse.json({ error: "Type de partage invalide" }, { status: 400 });
    }
    
    if (!data.itemId) {
      return NextResponse.json({ error: "ID de l'élément à partager requis" }, { status: 400 });
    }
    
    // Dans un vrai système, vérifier si l'élément existe et si l'utilisateur a le droit de le partager
    
    // Générer un token de partage unique
    const shareToken = `share-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    
    // Durée de validité (30 jours par défaut)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (data.expiresInDays || 30));
    
    // Simuler la création d'un enregistrement de partage
    const share = {
      id: `share-${Date.now()}`,
      type: data.type,
      patientId: data.patientId,
      itemId: data.itemId,
      shareToken,
      expiresAt,
      createdAt: new Date(),
      message: data.message || "",
      createdById: data.createdById || "hp-001"
    };
    
    // Générer l'URL de partage
    const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const shareUrl = `${origin}/${data.type.toLowerCase()}s/shared/${shareToken}`;
    
    return NextResponse.json({
      success: true,
      share,
      shareUrl
    });
    
  } catch (error) {
    console.error("Erreur lors du partage:", error);
    return NextResponse.json(
      { error: "Erreur lors du partage" },
      { status: 500 }
    );
  }
}
