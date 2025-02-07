import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Récupérer tous les programmes ou un programme spécifique
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const status = searchParams.get('status');

    if (id) {
      const program = await prisma.program.findUnique({
        where: { id },
        include: {
          patient: {
            include: {
              user: true
            }
          },
          healthProfessional: {
            include: {
              user: true
            }
          },
          supplements: true,
          exercises: {
            include: {
              exercise: true
            }
          }
        }
      });

      if (!program) {
        return NextResponse.json(
          { error: 'Program not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(program);
    }

    const where = status ? { status } : {};
    const programs = await prisma.program.findMany({
      where,
      include: {
        patient: {
          include: {
            user: true
          }
        },
        healthProfessional: {
          include: {
            user: true
          }
        },
        supplements: true,
        exercises: {
          include: {
            exercise: true
          }
        }
      }
    });

    return NextResponse.json(programs);
  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch programs' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau programme
export async function POST(request) {
  try {
    const data = await request.json();

    // Validation des données requises
    if (!data.title || !data.patientId || !data.healthProfessionalId || !data.startDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const program = await prisma.program.create({
      data: {
        title: data.title,
        description: data.description,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        status: data.status || 'ACTIVE',
        patientId: data.patientId,
        healthProfessionalId: data.healthProfessionalId,
        supplements: {
          connect: data.supplementIds?.map(id => ({ id })) || []
        },
        exercises: {
          create: data.exercises?.map(exercise => ({
            exercise: { connect: { id: exercise.exerciseId } },
            sets: exercise.sets,
            reps: exercise.reps,
            duration: exercise.duration,
            notes: exercise.notes
          })) || []
        }
      },
      include: {
        patient: {
          include: {
            user: true
          }
        },
        healthProfessional: {
          include: {
            user: true
          }
        },
        supplements: true,
        exercises: {
          include: {
            exercise: true
          }
        }
      }
    });

    return NextResponse.json(program);
  } catch (error) {
    console.error('Error creating program:', error);
    return NextResponse.json(
      { error: 'Failed to create program' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un programme existant
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Program ID is required' },
        { status: 400 }
      );
    }

    const data = await request.json();

    // Vérifier si le programme existe
    const existingProgram = await prisma.program.findUnique({
      where: { id }
    });

    if (!existingProgram) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }

    // Mettre à jour le programme
    const program = await prisma.program.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : null,
        status: data.status,
        supplements: data.supplementIds ? {
          set: data.supplementIds.map(id => ({ id }))
        } : undefined,
        exercises: data.exercises ? {
          deleteMany: {},
          create: data.exercises.map(exercise => ({
            exercise: { connect: { id: exercise.exerciseId } },
            sets: exercise.sets,
            reps: exercise.reps,
            duration: exercise.duration,
            notes: exercise.notes
          }))
        } : undefined
      },
      include: {
        patient: {
          include: {
            user: true
          }
        },
        healthProfessional: {
          include: {
            user: true
          }
        },
        supplements: true,
        exercises: {
          include: {
            exercise: true
          }
        }
      }
    });

    return NextResponse.json(program);
  } catch (error) {
    console.error('Error updating program:', error);
    return NextResponse.json(
      { error: 'Failed to update program' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un programme
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Program ID is required' },
        { status: 400 }
      );
    }

    // Vérifier si le programme existe
    const existingProgram = await prisma.program.findUnique({
      where: { id },
      include: {
        exercises: true,
        supplements: true,
        mealTimes: true
      }
    });

    if (!existingProgram) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }

    // Supprimer toutes les relations dans une transaction
    await prisma.$transaction(async (prisma) => {
      // Supprimer les exercices du programme
      if (existingProgram.exercises.length > 0) {
        await prisma.programExercise.deleteMany({
          where: { programId: id }
        });
      }

      // Supprimer les relations avec les suppléments
      if (existingProgram.supplements.length > 0) {
        await prisma.program.update({
          where: { id },
          data: {
            supplements: {
              disconnect: existingProgram.supplements.map(s => ({ id: s.id }))
            }
          }
        });
      }

      // Supprimer les meal times
      if (existingProgram.mealTimes.length > 0) {
        await prisma.mealTime.deleteMany({
          where: { programId: id }
        });
      }

      // Finalement, supprimer le programme
      await prisma.program.delete({
        where: { id }
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting program:', error);
    return NextResponse.json(
      { error: 'Failed to delete program: ' + error.message },
      { status: 500 }
    );
  }
}
