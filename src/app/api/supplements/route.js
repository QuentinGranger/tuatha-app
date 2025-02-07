import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Récupérer tous les suppléments
export async function GET() {
  try {
    const supplements = await prisma.supplement.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    return NextResponse.json(supplements);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la récupération des suppléments' }, { status: 500 });
  }
}

// POST - Créer un nouveau supplément
export async function POST(request) {
  try {
    const data = await request.json();
    const supplement = await prisma.supplement.create({
      data: {
        ...data,
        isCustom: true,
        sideEffects: data.sideEffects || [],
        warnings: data.warnings || [],
      },
    });
    return NextResponse.json(supplement);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la création du supplément' }, { status: 500 });
  }
}

// PUT - Mettre à jour un supplément
export async function PUT(request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    // Vérifier que le supplément existe et est personnalisé
    const existingSupplement = await prisma.supplement.findUnique({
      where: { id },
    });

    if (!existingSupplement) {
      return NextResponse.json({ error: 'Supplément non trouvé' }, { status: 404 });
    }

    if (!existingSupplement.isCustom) {
      return NextResponse.json({ error: 'Impossible de modifier un supplément par défaut' }, { status: 403 });
    }

    const supplement = await prisma.supplement.update({
      where: { id },
      data: {
        ...updateData,
        sideEffects: updateData.sideEffects || [],
        warnings: updateData.warnings || [],
      },
    });

    return NextResponse.json(supplement);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la mise à jour du supplément' }, { status: 500 });
  }
}

// DELETE - Supprimer un supplément
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Vérifier que le supplément existe et est personnalisé
    const existingSupplement = await prisma.supplement.findUnique({
      where: { id },
    });

    if (!existingSupplement) {
      return NextResponse.json({ error: 'Supplément non trouvé' }, { status: 404 });
    }

    if (!existingSupplement.isCustom) {
      return NextResponse.json({ error: 'Impossible de supprimer un supplément par défaut' }, { status: 403 });
    }

    await prisma.supplement.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Supplément supprimé avec succès' });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la suppression du supplément' }, { status: 500 });
  }
}
