import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Simuler la récupération des messages IA
    const messages = [
      {
        id: 'msg-001',
        content: 'Bonjour, je suis l\'assistant Tuatha. Comment puis-je vous aider aujourd\'hui?',
        createdAt: new Date(),
        isAi: true
      }
    ];
    
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Erreur lors de la récupération des messages:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des messages" },
      { status: 500 }
    );
  }
}
