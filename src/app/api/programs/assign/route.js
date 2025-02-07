import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validation des données requises
    if (!data.programId || !data.patientId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Récupérer le programme template
    const templateProgram = await prisma.program.findFirst({
      where: {
        id: data.programId,
        status: 'TEMPLATE'
      },
      include: {
        exercises: true,
        supplements: true,
        healthProfessional: true
      }
    });

    if (!templateProgram) {
      return NextResponse.json(
        { error: 'Template program not found' },
        { status: 404 }
      );
    }

    // Créer une copie du programme pour le patient
    const assignedProgram = await prisma.program.create({
      data: {
        title: templateProgram.title,
        description: templateProgram.description,
        startDate: templateProgram.startDate,
        endDate: templateProgram.endDate,
        status: 'ACTIVE',
        patientId: data.patientId,
        healthProfessionalId: templateProgram.healthProfessionalId,
        exercises: {
          create: templateProgram.exercises.map(exercise => ({
            exerciseId: exercise.exerciseId,
            sets: exercise.sets,
            reps: exercise.reps,
            duration: exercise.duration,
            notes: exercise.notes
          }))
        },
        supplements: {
          connect: templateProgram.supplements.map(supplement => ({
            id: supplement.id
          }))
        }
      },
      include: {
        exercises: {
          include: {
            exercise: true
          }
        },
        supplements: true,
        patient: {
          include: {
            user: true
          }
        },
        healthProfessional: {
          include: {
            user: true
          }
        }
      }
    });

    return NextResponse.json(assignedProgram);
  } catch (error) {
    console.error('Error assigning program:', error);
    return NextResponse.json(
      { error: 'Failed to assign program: ' + error.message },
      { status: 500 }
    );
  }
}
