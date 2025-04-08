import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const supplements = await prisma.supplement.findMany();
    return NextResponse.json(supplements);
  } catch (error) {
    console.error("Erreur lors de la récupération des suppléments:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des suppléments" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validation des données
    if (!data.name) {
      return NextResponse.json({ error: "Nom du supplément requis" }, { status: 400 });
    }
    
    // Création du supplément
    const newSupplement = await prisma.supplement.create({
      data: {
        name: data.name,
        description: data.description || "",
        type: data.type || "OTHER",
        dosage: data.dosage || "",
        frequency: data.frequency || "",
        isCustom: data.isCustom || false
      }
    });
    
    return NextResponse.json(newSupplement, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du supplément:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du supplément" },
      { status: 500 }
    );
  }
}
