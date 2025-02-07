import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Récupérer tous les aliments
export async function GET() {
  try {
    const foods = await prisma.food.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    return NextResponse.json(foods);
  } catch (error) {
    console.error('Erreur détaillée lors de la récupération des aliments:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la récupération des aliments',
        details: error.message,
        name: error.name,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }, 
      { status: 500 }
    );
  }
}

// POST - Créer un nouvel aliment
export async function POST(request) {
  try {
    const data = await request.json();
    const food = await prisma.food.create({
      data: {
        ...data,
        isCustom: true,
      },
    });
    return NextResponse.json(food);
  } catch (error) {
    console.error('Erreur détaillée lors de la création de l\'aliment:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la création de l\'aliment',
        details: error.message,
        name: error.name,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }, 
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un aliment
export async function PUT(request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    // Vérifier que l'aliment existe et est personnalisé
    const existingFood = await prisma.food.findUnique({
      where: { id },
    });

    if (!existingFood) {
      return NextResponse.json({ error: 'Aliment non trouvé' }, { status: 404 });
    }

    if (!existingFood.isCustom) {
      return NextResponse.json({ error: 'Impossible de modifier un aliment par défaut' }, { status: 403 });
    }

    const food = await prisma.food.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(food);
  } catch (error) {
    console.error('Erreur détaillée lors de la mise à jour de l\'aliment:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la mise à jour de l\'aliment',
        details: error.message,
        name: error.name,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }, 
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un aliment
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Vérifier que l'aliment existe et est personnalisé
    const existingFood = await prisma.food.findUnique({
      where: { id },
    });

    if (!existingFood) {
      return NextResponse.json({ error: 'Aliment non trouvé' }, { status: 404 });
    }

    if (!existingFood.isCustom) {
      return NextResponse.json({ error: 'Impossible de supprimer un aliment par défaut' }, { status: 403 });
    }

    await prisma.food.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Aliment supprimé avec succès' });
  } catch (error) {
    console.error('Erreur détaillée lors de la suppression de l\'aliment:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la suppression de l\'aliment',
        details: error.message,
        name: error.name,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }, 
      { status: 500 }
    );
  }
}
