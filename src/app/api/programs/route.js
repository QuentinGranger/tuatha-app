import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const programs = await prisma.program.findMany({
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
    
    return NextResponse.json(programs);
  } catch (error) {
    console.error("Erreur lors de la récupération des programmes:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des programmes" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validation des données
    if (!data.title) {
      return NextResponse.json({ error: "Le titre est requis" }, { status: 400 });
    }
    
    // Création du programme
    const newProgram = await prisma.program.create({
      data: {
        title: data.title,
        description: data.description || "",
        objective: data.objective || "",
        category: data.category || "GENERAL",
        shareToken: `token-${Date.now()}`, // Token généré pour le partage
        healthProfessionalId: data.healthProfessionalId || "hp-001", // ID par défaut si non fourni
        exercises: {
          create: data.exercises?.map(ex => ({
            sets: ex.sets,
            reps: ex.reps,
            rest: ex.rest,
            exerciseId: ex.exerciseId
          })) || []
        },
        supplements: {
          connect: data.supplementIds?.map(id => ({ id })) || []
        }
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
    
    return NextResponse.json(newProgram, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du programme:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du programme" },
      { status: 500 }
    );
  }
}
