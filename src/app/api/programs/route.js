import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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
        return new Response(
          JSON.stringify({ error: 'Program not found' }),
          { 
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      return new Response(
        JSON.stringify(program),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
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

    return new Response(
      JSON.stringify(programs),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error fetching programs:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch programs' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// POST - Créer un nouveau programme
export async function POST(request) {
  try {
    const data = await request.json();
    console.log('API Programs POST - Données reçues:', JSON.stringify(data, null, 2));

    // Assigner healthProfessionalId depuis nutritionistId si present
    if (data.nutritionistId && !data.healthProfessionalId) {
      data.healthProfessionalId = data.nutritionistId;
      console.log('API Programs POST - healthProfessionalId assigné depuis nutritionistId:', data.healthProfessionalId);
    }

    // Validation détaillée
    const missingFields = [];
    if (!data.title) missingFields.push('title');
    if (!data.patientId) missingFields.push('patientId');
    if (!data.healthProfessionalId) missingFields.push('healthProfessionalId');
    if (!data.startDate) missingFields.push('startDate');

    // Validation des données requises
    if (missingFields.length > 0) {
      console.log('API Programs POST - Champs manquants:', missingFields);
      return new Response(
        JSON.stringify({ error: `Missing required fields: ${missingFields.join(', ')}` }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
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

    return new Response(
      JSON.stringify(program),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error creating program:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create program' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// PUT - Mettre à jour un programme existant
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Program ID is required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const data = await request.json();

    // Vérifier si le programme existe
    const existingProgram = await prisma.program.findUnique({
      where: { id }
    });

    if (!existingProgram) {
      return new Response(
        JSON.stringify({ error: 'Program not found' }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
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

    return new Response(
      JSON.stringify(program),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error updating program:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update program' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// DELETE - Supprimer un programme
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Program ID is required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
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
      return new Response(
        JSON.stringify({ error: 'Program not found' }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
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

    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error deleting program:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to delete program: ' + error.message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
