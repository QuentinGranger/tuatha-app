import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validation des données
    if (!data.programId) {
      return NextResponse.json({ error: "ID du programme requis" }, { status: 400 });
    }
    
    if (!data.patientIds || !Array.isArray(data.patientIds) || data.patientIds.length === 0) {
      return NextResponse.json({ error: "Liste des patients requise" }, { status: 400 });
    }
    
    // Récupérer le programme existant
    const program = await prisma.program.findUnique({
      where: { id: data.programId },
      include: {
        exercises: true,
        supplements: true
      }
    });
    
    if (!program) {
      return NextResponse.json({ error: "Programme non trouvé" }, { status: 404 });
    }
    
    // Créer des copies du programme pour chaque patient sélectionné
    const assignedPrograms = await Promise.all(
      data.patientIds.map(async (patientId) => {
        const patient = await prisma.patient.findUnique({
          where: { id: patientId }
        });
        
        if (!patient) {
          return { error: `Patient ${patientId} non trouvé`, patientId };
        }
        
        // Créer une copie du programme pour ce patient
        const newProgram = await prisma.program.create({
          data: {
            title: program.title,
            description: program.description,
            objective: program.objective,
            category: program.category,
            status: "ACTIVE",
            patientId: patientId,
            healthProfessionalId: program.healthProfessionalId,
            shareToken: `share-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            // Copier les exercices
            exercises: {
              create: program.exercises.map(ex => ({
                sets: ex.sets,
                reps: ex.reps,
                rest: ex.rest,
                exerciseId: ex.exerciseId,
                notes: ex.notes
              }))
            },
            // Copier les suppléments
            supplements: {
              connect: program.supplements.map(supp => ({
                id: supp.id
              }))
            }
          }
        });
        
        return { 
          success: true, 
          patientId, 
          programId: newProgram.id,
          patientName: `${patient.user?.firstName || ''} ${patient.user?.lastName || ''}`
        };
      })
    );
    
    return NextResponse.json({ assignedPrograms });
    
  } catch (error) {
    console.error("Erreur lors de l'assignation du programme:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'assignation du programme" },
      { status: 500 }
    );
  }
}
