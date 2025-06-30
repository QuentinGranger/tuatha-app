import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Extraction des données du formulaire
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      phoneNumber, 
      specialty,
      licenseNumber,
      bio,
      photoUrl, // Ceci viendra d'un service de stockage d'images dans une implémentation réelle
      verificationDocumentUrl // Document de vérification professionnelle
    } = data;

    // Vérification si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 400 }
      );
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur et du professionnel de santé dans une transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Création de l'utilisateur
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          role: 'HEALTH_PROFESSIONAL', // Utilisation de la valeur de l'enum UserRole
          phoneNumber,
          photoUrl,
          bio
        },
      });

      // Création du profil de professionnel de santé
      const healthProfessional = await prisma.healthProfessional.create({
        data: {
          specialty,
          licenseNumber,
          userId: user.id,
          verificationDocumentUrl,
          verificationStatus: 'PENDING',
          verificationSubmittedAt: new Date()
        },
      });

      return { user, healthProfessional };
    });

    // Retour de la réponse sans inclure le mot de passe
    const { user, healthProfessional } = result;
    const userWithoutPassword = { ...user, password: undefined };

    return NextResponse.json({ 
      success: true, 
      user: userWithoutPassword,
      healthProfessional
    }, { status: 201 });
    
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'inscription", details: error.message },
      { status: 500 }
    );
  }
}
