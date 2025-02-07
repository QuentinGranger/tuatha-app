import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const programs = await prisma.program.findMany({
      include: {
        exercises: {
          include: {
            exercise: true
          }
        },
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

    return NextResponse.json(programs);
  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch programs' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    const program = await prisma.program.create({
      data: {
        title: data.title,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        patientId: data.patientId,
        healthProfessionalId: data.healthProfessionalId,
        exercises: {
          create: data.exercises.map(exercise => ({
            exerciseId: exercise.exerciseId,
            sets: exercise.sets,
            reps: exercise.reps,
            duration: exercise.duration,
            notes: exercise.notes
          }))
        }
      },
      include: {
        exercises: {
          include: {
            exercise: true
          }
        },
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

    return NextResponse.json(program);
  } catch (error) {
    console.error('Error creating program:', error);
    return NextResponse.json(
      { error: 'Failed to create program' },
      { status: 500 }
    );
  }
}
