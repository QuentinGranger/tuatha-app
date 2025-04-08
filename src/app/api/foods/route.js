import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const foods = await prisma.food.findMany();
    return NextResponse.json(foods);
  } catch (error) {
    console.error("Erreur lors de la récupération des aliments:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des aliments" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validation des données
    if (!data.name) {
      return NextResponse.json({ error: "Nom de l'aliment requis" }, { status: 400 });
    }
    
    // Création de l'aliment
    const newFood = await prisma.food.create({
      data: {
        name: data.name,
        category: data.category || "DIVERS",
        description: data.description || "",
        calories: data.calories || 0,
        proteins: data.proteins || 0,
        carbs: data.carbs || 0,
        fats: data.fats || 0,
        isCustom: data.isCustom || true,
        createdById: data.createdById
      }
    });
    
    return NextResponse.json(newFood, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de l'aliment:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'aliment" },
      { status: 500 }
    );
  }
}

// Méthode PUT pour mettre à jour un aliment
export async function PUT(request) {
  try {
    const data = await request.json();
    
    if (!data.id) {
      return NextResponse.json({ error: "ID de l'aliment requis" }, { status: 400 });
    }
    
    const updatedFood = await prisma.food.update({
      where: { id: data.id },
      data: {
        name: data.name,
        category: data.category,
        description: data.description,
        calories: data.calories,
        proteins: data.proteins,
        carbs: data.carbs,
        fats: data.fats
      }
    });
    
    return NextResponse.json(updatedFood);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'aliment:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'aliment" },
      { status: 500 }
    );
  }
}

// Méthode DELETE pour supprimer un aliment
export async function DELETE(request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: "ID de l'aliment requis" }, { status: 400 });
  }
  
  try {
    await prisma.food.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'aliment:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'aliment" },
      { status: 500 }
    );
  }
}
