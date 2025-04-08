import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Simuler une liste de pathologies puisque le modèle Prisma mock ne semble pas en avoir
    const pathologies = [
      { id: "p1", name: "Diabète de type 1", category: "METABOLIC" },
      { id: "p2", name: "Diabète de type 2", category: "METABOLIC" },
      { id: "p3", name: "Hypertension", category: "CARDIOVASCULAR" },
      { id: "p4", name: "Tendinite", category: "MUSCULOSKELETAL" },
      { id: "p5", name: "Arthrose", category: "MUSCULOSKELETAL" },
      { id: "p6", name: "Asthme", category: "RESPIRATORY" },
      { id: "p7", name: "Migraine", category: "NEUROLOGICAL" },
      { id: "p8", name: "Allergie alimentaire", category: "IMMUNE" },
      { id: "p9", name: "Syndrome du côlon irritable", category: "DIGESTIVE" },
      { id: "p10", name: "Insuffisance rénale", category: "RENAL" }
    ];
    
    return NextResponse.json(pathologies);
  } catch (error) {
    console.error("Erreur lors de la récupération des pathologies:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des pathologies" },
      { status: 500 }
    );
  }
}
