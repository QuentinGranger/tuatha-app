import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const program = await prisma.program.findUnique({
      where: { 
        id 
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
        exercises: {
          include: {
            exercise: true
          }
        },
        mealTimes: {
          include: {
            food: true
          }
        },
        supplements: true
      }
    });

    if (!program) {
      return new Response(
        JSON.stringify({ error: 'Programme non trouvé' }), 
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
  } catch (error) {
    console.error('Error fetching program:', error);
    return new Response(
      JSON.stringify({ error: 'Error fetching program' }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    console.log('Tentative de suppression du programme:', id);

    // Vérifier si le programme existe
    const program = await prisma.program.findUnique({
      where: { id },
      include: {
        exercises: true,
        mealTimes: true,
        supplements: true
      }
    });

    if (!program) {
      console.log('Programme non trouvé:', id);
      return new Response(
        JSON.stringify({ error: 'Programme non trouvé' }), 
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Programme trouvé avec ID:', id);

    // Supprimer toutes les relations dans une transaction
    await prisma.$transaction(async (tx) => {
      // 1. Supprimer les exercices du programme
      await tx.programExercise.deleteMany({
        where: {
          programId: id
        }
      });

      // 2. Supprimer les repas du programme (la relation onDelete: Cascade s'en charge)
      // Pas besoin de le faire manuellement grâce au onDelete: Cascade dans le schéma

      // 3. Supprimer les relations avec les suppléments
      // Pas besoin de supprimer explicitement car c'est une relation many-to-many

      // 4. Enfin, supprimer le programme
      await tx.program.delete({
        where: {
          id
        }
      });
    });

    console.log('Programme et relations supprimés avec succès');

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Programme et toutes ses relations supprimés avec succès' 
      }), 
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Erreur détaillée lors de la suppression:', error);
    
    // Vérifier si c'est une erreur Prisma
    if (error.code) {
      console.error('Code erreur Prisma:', error.code);
      console.error('Meta:', error.meta);
    }

    return new Response(
      JSON.stringify({ 
        error: 'Erreur lors de la suppression du programme',
        details: error.message,
        code: error.code
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
