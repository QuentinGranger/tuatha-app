import pkg from '@prisma/client';
const { PrismaClient, UserRole, ConsultationType, Disponibilite, ModeReglement, StatutConventionnement, NutritionalStatus, ProgressionStatus, Specialty, ContactMethod } = pkg;
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

const healthProfessionals = [
  {
    user: {
      email: 'chopper.nutritionist@tuatha.app',
      password: await hash('password123', 10),
      firstName: 'Tony',
      lastName: 'Tony',
      role: UserRole.HEALTH_PROFESSIONAL,
      phoneNumber: '0677777777',
      photoUrl: '/img/professionel/chopper.jpg'
    },
    professional: {
      specialty: Specialty.NUTRITIONIST,
      subSpecialty: 'Médecine d\'aventure',
      availability: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true
      },
      preferredContactMethod: ContactMethod.EMAIL,
      emergencyContact: true,
      consultationTypes: [ConsultationType.PRESENTIEL, ConsultationType.VISIO],
      consultationFee: 80.00,
      conventionStatus: StatutConventionnement.SECTEUR_1,
      paymentMethods: [ModeReglement.CB, ModeReglement.ESPECES, ModeReglement.TIERS_PAYANT],
      acceptsHealthCard: true,
      description: "Médecin polyvalent spécialisé dans les soins d'urgence en mer.",
      yearsExperience: 5,
      spokenLanguages: ['Français', 'Anglais', 'Animal'],
      openingTime: '08:00',
      closingTime: '20:00',
      consultationDuration: 20,
      workingDays: ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI'],
      disponibilite: Disponibilite.DISPONIBLE,
      averageWaitTime: 1,
      street: 'Thousand Sunny',
      city: 'Grand Line',
      postalCode: '00001',
      country: 'Seas',
      handicapAccess: true,
      parking: false,
      equipment: ['Rumble Balls', 'Cabinet mobile', 'Herbes médicinales'],
      acceptsEmergencies: true,
      occupancyRate: 0.9,
      adeliNumber: '987654321',
      rppsNumber: '98765432101',
      diplomas: ['drum-kingdom-university.pdf']
    }
  },
  {
    user: {
      email: 'tsunade.dietitian@tuatha.app',
      password: await hash('password123', 10),
      firstName: 'Tsunade',
      lastName: 'Senju',
      role: UserRole.HEALTH_PROFESSIONAL,
      phoneNumber: '0688888888',
      photoUrl: '/img/professionel/tsunade.jpg'
    },
    professional: {
      specialty: Specialty.DIETITIAN,
      subSpecialty: 'Ninjutsu médical',
      availability: {
        monday: true,
        wednesday: true,
        friday: true
      },
      preferredContactMethod: ContactMethod.PHONE,
      emergencyContact: true,
      consultationTypes: [ConsultationType.PRESENTIEL],
      consultationFee: 200.00,
      conventionStatus: StatutConventionnement.SECTEUR_2,
      paymentMethods: [ModeReglement.CB, ModeReglement.ESPECES],
      acceptsHealthCard: true,
      description: "Chirurgienne de génie et experte en médecine ninja.",
      yearsExperience: 50,
      spokenLanguages: ['Français', 'Japonais', 'Ninja'],
      openingTime: '10:00',
      closingTime: '16:00',
      consultationDuration: 30,
      workingDays: ['LUNDI', 'MERCREDI', 'VENDREDI'],
      disponibilite: Disponibilite.DISPONIBLE,
      averageWaitTime: 14,
      street: 'Tour de l\'Hokage',
      city: 'Konoha',
      postalCode: '12345',
      country: 'Pays du Feu',
      handicapAccess: true,
      parking: true,
      equipment: ['Bloc opératoire', 'Salle de régénération', 'Machine à sous'],
      acceptsEmergencies: true,
      occupancyRate: 0.6,
      adeliNumber: '258369147',
      rppsNumber: '25836914701',
      diplomas: ['konoha-medical.pdf', 'hokage-certificate.pdf']
    }
  },
  {
    user: {
      email: 'sanji.nutritionist@tuatha.app',
      password: await hash('password123', 10),
      firstName: 'Sanji',
      lastName: 'Vinsmoke',
      role: UserRole.HEALTH_PROFESSIONAL,
      phoneNumber: '0699999999',
      photoUrl: '/img/professionel/sanji.jpg'
    },
    professional: {
      specialty: Specialty.NUTRITIONIST,
      subSpecialty: 'Cuisine thérapeutique',
      availability: {
        tuesday: true,
        thursday: true,
        saturday: true
      },
      preferredContactMethod: ContactMethod.EMAIL,
      emergencyContact: true,
      consultationTypes: [ConsultationType.PRESENTIEL, ConsultationType.VISIO],
      consultationFee: 90.00,
      conventionStatus: StatutConventionnement.SECTEUR_1,
      paymentMethods: [ModeReglement.CB, ModeReglement.ESPECES],
      acceptsHealthCard: true,
      description: "Expert en nutrition et cuisine thérapeutique.",
      yearsExperience: 10,
      spokenLanguages: ['Français', 'Anglais', 'Love'],
      openingTime: '11:00',
      closingTime: '23:00',
      consultationDuration: 40,
      workingDays: ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'],
      disponibilite: Disponibilite.DISPONIBLE,
      averageWaitTime: 3,
      street: 'Baratie Restaurant',
      city: 'East Blue',
      postalCode: '11111',
      country: 'Seas',
      handicapAccess: true,
      parking: false,
      equipment: ['Cuisine professionnelle', 'Jardin d\'herbes', 'Cave à vin médicinale'],
      acceptsEmergencies: true,
      occupancyRate: 0.95,
      adeliNumber: '147258369',
      rppsNumber: '14725836901',
      diplomas: ['baratie-culinary.pdf', 'all-blue-research.pdf']
    }
  },
  {
    user: {
      email: 'hulk.dietitian@tuatha.app',
      password: await hash('password123', 10),
      firstName: 'Bruce',
      lastName: 'Banner',
      role: UserRole.HEALTH_PROFESSIONAL,
      phoneNumber: '0666666666',
      photoUrl: '/img/professionel/Hulk.jpg'
    },
    professional: {
      specialty: Specialty.DIETITIAN,
      subSpecialty: 'Radiologie',
      availability: {
        monday: true,
        wednesday: true,
        friday: true
      },
      preferredContactMethod: ContactMethod.SMS,
      emergencyContact: true,
      consultationTypes: [ConsultationType.PRESENTIEL],
      consultationFee: 150.00,
      conventionStatus: StatutConventionnement.SECTEUR_2,
      paymentMethods: [ModeReglement.CB, ModeReglement.VIREMENT],
      acceptsHealthCard: true,
      description: "Spécialiste en radiologie et expert en rayons gamma.",
      yearsExperience: 15,
      spokenLanguages: ['Français', 'Anglais', 'Hulk'],
      openingTime: '09:00',
      closingTime: '17:00',
      consultationDuration: 30,
      workingDays: ['LUNDI', 'MERCREDI', 'VENDREDI'],
      disponibilite: Disponibilite.DISPONIBLE,
      averageWaitTime: 7,
      street: '177A Bleecker Street',
      city: 'New York',
      postalCode: '10012',
      country: 'USA',
      handicapAccess: true,
      parking: true,
      equipment: ['Scanner gamma', 'Salle de décompression', 'Murs renforcés'],
      acceptsEmergencies: true,
      occupancyRate: 0.8,
      adeliNumber: '123456789',
      rppsNumber: '12345678901',
      diplomas: ['harvard.pdf', 'gamma-research.pdf']
    }
  },
  {
    user: {
      email: 'recovery.girl@tuatha.app',
      password: await hash('password123', 10),
      firstName: 'Chiyo',
      lastName: 'Shuzenji',
      role: UserRole.HEALTH_PROFESSIONAL,
      phoneNumber: '0654321987',
      photoUrl: '/img/professionel/recovery-girl.jpg'
    },
    professional: {
      specialty: Specialty.PHYSIOTHERAPIST,
      subSpecialty: 'Récupération accélérée',
      availability: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true
      },
      preferredContactMethod: ContactMethod.PHONE,
      emergencyContact: true,
      consultationTypes: [ConsultationType.PRESENTIEL, ConsultationType.VISIO],
      consultationFee: 120.00,
      conventionStatus: StatutConventionnement.SECTEUR_1,
      paymentMethods: [ModeReglement.CB, ModeReglement.ESPECES],
      acceptsHealthCard: true,
      description: "Infirmière spécialisée dans la récupération rapide et les soins d'urgence pour les héros.",
      yearsExperience: 45,
      spokenLanguages: ['Français', 'Japonais', 'Anglais'],
      openingTime: '07:00',
      closingTime: '19:00',
      consultationDuration: 25,
      workingDays: ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI'],
      disponibilite: Disponibilite.DISPONIBLE,
      averageWaitTime: 5,
      street: 'Campus U.A.',
      city: 'Musutafu',
      postalCode: '12345',
      country: 'Japon',
      handicapAccess: true,
      parking: true,
      equipment: ['Lits médicalisés', 'Équipement de rééducation', 'Salle de repos'],
      acceptsEmergencies: true,
      occupancyRate: 0.85,
      adeliNumber: '654789321',
      rppsNumber: '65478932101',
      diplomas: ['ua-medical.pdf', 'hero-first-aid.pdf']
    }
  },
  {
    user: {
      email: 'orihime.healer@tuatha.app',
      password: await hash('password123', 10),
      firstName: 'Orihime',
      lastName: 'Inoue',
      role: UserRole.HEALTH_PROFESSIONAL,
      phoneNumber: '0698765432',
      photoUrl: '/img/professionel/orihime.jpg'
    },
    professional: {
      specialty: Specialty.PHYSICAL_TRAINER,
      subSpecialty: 'Guérison spirituelle',
      availability: {
        monday: true,
        wednesday: true,
        friday: true
      },
      preferredContactMethod: ContactMethod.EMAIL,
      emergencyContact: true,
      consultationTypes: [ConsultationType.PRESENTIEL, ConsultationType.VISIO],
      consultationFee: 95.00,
      conventionStatus: StatutConventionnement.SECTEUR_1,
      paymentMethods: [ModeReglement.CB, ModeReglement.ESPECES],
      acceptsHealthCard: true,
      description: "Spécialiste en guérison spirituelle et réhabilitation physique.",
      yearsExperience: 6,
      spokenLanguages: ['Français', 'Japonais'],
      openingTime: '09:00',
      closingTime: '18:00',
      consultationDuration: 35,
      workingDays: ['LUNDI', 'MERCREDI', 'VENDREDI'],
      disponibilite: Disponibilite.DISPONIBLE,
      averageWaitTime: 2,
      street: 'Karakura Town',
      city: 'Tokyo',
      postalCode: '56789',
      country: 'Japon',
      handicapAccess: true,
      parking: false,
      equipment: ['Centre de méditation', 'Espace de relaxation', 'Équipement spirituel'],
      acceptsEmergencies: true,
      occupancyRate: 0.7,
      adeliNumber: '321654987',
      rppsNumber: '32165498701',
      diplomas: ['karakura-high.pdf', 'spiritual-healing.pdf']
    }
  },
  {
    user: {
      email: 'zeno.psychologist@tuatha.app',
      password: await hash('password123', 10),
      firstName: 'Zeno',
      lastName: 'Sama',
      role: UserRole.HEALTH_PROFESSIONAL,
      phoneNumber: '0612345678',
      photoUrl: '/img/professionel/zeno.jpg'
    },
    professional: {
      specialty: Specialty.PSYCHOLOGIST,
      subSpecialty: 'Thérapie existentielle',
      availability: {
        tuesday: true,
        thursday: true
      },
      preferredContactMethod: ContactMethod.EMAIL,
      emergencyContact: false,
      consultationTypes: [ConsultationType.VISIO],
      consultationFee: 350.00,
      conventionStatus: StatutConventionnement.SECTEUR_2,
      paymentMethods: [ModeReglement.CB, ModeReglement.VIREMENT],
      acceptsHealthCard: false,
      description: "Psychologue cosmique spécialisé dans les problèmes d'identité et de pouvoir. Approche existentielle.",
      yearsExperience: 5000000,
      spokenLanguages: ['Universel', 'Japonais', 'Langue des dieux'],
      openingTime: '10:00',
      closingTime: '16:00',
      consultationDuration: 45,
      workingDays: ['MARDI', 'JEUDI'],
      disponibilite: Disponibilite.FAIBLE,
      averageWaitTime: 30,
      street: 'Palais Zeno',
      city: 'Royaume des Zenos',
      postalCode: '00000',
      country: 'Multivers',
      handicapAccess: true,
      parking: true,
      equipment: ['Fauteuil téléporteur', 'Bouton d\'effacement universel', 'Jeux de société'],
      acceptsEmergencies: false,
      occupancyRate: 0.3,
      adeliNumber: '111222333',
      rppsNumber: '11122233301',
      diplomas: ['omni-king-certificate.pdf', 'multiverse-psychology.pdf']
    }
  },
  {
    user: {
      email: 'saitama.trainer@tuatha.app',
      password: await hash('password123', 10),
      firstName: 'Saitama',
      lastName: '',
      role: UserRole.HEALTH_PROFESSIONAL,
      phoneNumber: '0611223344',
      photoUrl: '/img/professionel/saitama.jpg'
    },
    professional: {
      specialty: Specialty.PHYSICAL_TRAINER,
      subSpecialty: 'Entraînement de puissance',
      availability: {
        monday: true,
        wednesday: true,
        friday: true,
        saturday: true,
        sunday: true
      },
      preferredContactMethod: ContactMethod.PHONE,
      emergencyContact: true,
      consultationTypes: [ConsultationType.PRESENTIEL],
      consultationFee: 50.00,
      conventionStatus: StatutConventionnement.SECTEUR_1,
      paymentMethods: [ModeReglement.ESPECES],
      acceptsHealthCard: false,
      description: "Coach sportif avec une méthode d'entraînement simple mais extrêmement efficace. Programme : 100 pompes, 100 squats, 100 abdos et 10km de course TOUS LES JOURS.",
      yearsExperience: 3,
      spokenLanguages: ['Japonais', 'Français basique'],
      openingTime: '05:00',
      closingTime: '22:00',
      consultationDuration: 60,
      workingDays: ['LUNDI', 'MERCREDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE'],
      disponibilite: Disponibilite.DISPONIBLE,
      averageWaitTime: 0,
      street: 'Ville Z, Appartement 5',
      city: 'Ville Z',
      postalCode: '99999',
      country: 'Japon',
      handicapAccess: false,
      parking: false,
      equipment: ['Poids', 'Zone de frappe', 'Terrain de course'],
      acceptsEmergencies: true,
      occupancyRate: 0.4,
      adeliNumber: '999888777',
      rppsNumber: '99988877701',
      diplomas: ['hero-association-s-class.pdf']
    }
  }
];

const patients = [
  {
    firstName: 'Bruce',
    lastName: 'Wayne',
    email: 'batman@wayne-enterprises.com',
    phone: '0666666666',
    profilePicture: '/img/patient/batman.jpg',
    sport: 'Arts Martiaux',
    injury: 'Multiples fractures dues aux chutes de buildings',
    lastAppointment: new Date('2025-02-05'),
    nutritionalStatus: NutritionalStatus.GOOD,
    progressionStatus: ProgressionStatus.IMPROVING
  },
  {
    firstName: 'Izuku',
    lastName: 'Midoriya',
    email: 'deku@ua.edu',
    phone: '0677777777',
    profilePicture: '/img/patient/deku.jpg',
    sport: 'Super-Héroïsme',
    injury: 'Bras cassés à répétition (One For All)',
    lastAppointment: new Date('2025-02-04'),
    nutritionalStatus: NutritionalStatus.AVERAGE,
    progressionStatus: ProgressionStatus.IMPROVING
  },
  {
    firstName: 'Son',
    lastName: 'Goku',
    email: 'goku@capsule-corp.com',
    phone: '0688888888',
    profilePicture: '/img/patient/goku.jpg',
    sport: 'Arts Martiaux',
    injury: 'Surmenage dû aux entraînements à 100x la gravité',
    lastAppointment: new Date('2025-02-03'),
    nutritionalStatus: NutritionalStatus.GOOD,
    progressionStatus: ProgressionStatus.IMPROVING
  },
  {
    firstName: 'Tony',
    lastName: 'Stark',
    email: 'tony@stark-industries.com',
    phone: '0699999999',
    profilePicture: '/img/patient/ironman.jpg',
    sport: 'Vol en armure',
    injury: 'Problèmes cardiaques (réacteur ARK)',
    lastAppointment: new Date('2025-02-02'),
    nutritionalStatus: NutritionalStatus.CRITICAL,
    progressionStatus: ProgressionStatus.STAGNATING
  },
  {
    firstName: 'Monkey D.',
    lastName: 'Luffy',
    email: 'luffy@thousand-sunny.com',
    phone: '0611111111',
    profilePicture: '/img/patient/luffy.jpg',
    sport: 'Piraterie',
    injury: 'Élongation excessive des membres (fruit du Gomu Gomu)',
    lastAppointment: new Date('2025-02-01'),
    nutritionalStatus: NutritionalStatus.GOOD,
    progressionStatus: ProgressionStatus.IMPROVING
  },
  {
    firstName: 'Naruto',
    lastName: 'Uzumaki',
    email: 'naruto@konoha.gov',
    phone: '0622222222',
    profilePicture: '/img/patient/naruto.jpg',
    sport: 'Ninjutsu',
    injury: 'Épuisement de chakra',
    lastAppointment: new Date('2025-01-31'),
    nutritionalStatus: NutritionalStatus.AVERAGE,
    progressionStatus: ProgressionStatus.IMPROVING
  },
  {
    firstName: 'Saitama',
    lastName: 'Unknown',
    email: 'saitama@hero-association.org',
    phone: '0633333333',
    profilePicture: '/img/patient/saitama.jpg',
    sport: 'Super-Héroïsme',
    injury: 'Dépression due à la facilité des combats',
    lastAppointment: new Date('2025-01-30'),
    nutritionalStatus: NutritionalStatus.GOOD,
    progressionStatus: ProgressionStatus.STAGNATING
  },
  {
    firstName: 'Peter',
    lastName: 'Parker',
    email: 'spidey@daily-bugle.com',
    phone: '0644444444',
    profilePicture: '/img/patient/spiderman.jpg',
    sport: 'Acrobaties urbaines',
    injury: 'Tendinite aux poignets (lancer de toiles)',
    lastAppointment: new Date('2025-01-29'),
    nutritionalStatus: NutritionalStatus.AVERAGE,
    progressionStatus: ProgressionStatus.IMPROVING
  },
  {
    firstName: 'Thor',
    lastName: 'Odinson',
    email: 'thor@asgard.realm',
    phone: '0655555555',
    profilePicture: '/img/patient/thor.jpg',
    sport: 'Lancer de marteau',
    injury: 'Syndrome du canal carpien (Mjolnir)',
    lastAppointment: new Date('2025-01-28'),
    nutritionalStatus: NutritionalStatus.GOOD,
    progressionStatus: ProgressionStatus.IMPROVING
  },
  {
    firstName: 'Diana',
    lastName: 'Prince',
    email: 'wonder@themyscira.com',
    phone: '0666123456',
    profilePicture: '/img/patient/wonderwoman.jpg',
    sport: 'Combat amazonien',
    injury: 'Tendinite à l\'épaule (lancer de lasso)',
    lastAppointment: new Date('2025-01-27'),
    nutritionalStatus: NutritionalStatus.GOOD,
    progressionStatus: ProgressionStatus.IMPROVING
  }
];

const patientHealthTeams = [
  {
    patientId: 'pat-001',
    role: 'PRIMARY',
    startDate: new Date('2024-01-01'),
    notes: 'Suivi régulier pour optimisation des performances',
    lastContactDate: new Date('2024-02-01'),
    communicationPreference: 'EMAIL'
  },
  {
    patientId: 'pat-002',
    role: 'SECONDARY',
    startDate: new Date('2024-01-15'),
    notes: 'Programme de récupération post-traumatique',
    lastContactDate: new Date('2024-02-03'),
    communicationPreference: 'PHONE'
  },
  {
    patientId: 'pat-003',
    role: 'PRIMARY',
    startDate: new Date('2024-01-10'),
    notes: 'Suivi nutritionnel et performance',
    lastContactDate: new Date('2024-02-02'),
    communicationPreference: 'SMS'
  }
];

const foods = [
  {
    id: 'food_1',
    name: "Poulet",
    category: "Protéines",
    calories: 165,
    proteins: 31,
    carbs: 0,
    fats: 3.6,
    description: "Viande maigre riche en protéines"
  },
  {
    id: 'food_2',
    name: "Saumon",
    category: "Protéines",
    calories: 208,
    proteins: 22,
    carbs: 0,
    fats: 13,
    description: "Poisson gras riche en oméga-3"
  },
  {
    id: 'food_3',
    name: "Quinoa",
    category: "Céréales",
    calories: 120,
    proteins: 4.4,
    carbs: 21.3,
    fats: 1.9,
    description: "Céréale complète riche en protéines végétales"
  },
  {
    id: 'food_4',
    name: "Avocat",
    category: "Fruits",
    calories: 160,
    proteins: 2,
    carbs: 8.5,
    fats: 14.7,
    description: "Fruit riche en graisses saines"
  },
  {
    id: 'food_5',
    name: "Épinards",
    category: "Légumes",
    calories: 23,
    proteins: 2.9,
    carbs: 3.6,
    fats: 0.4,
    description: "Légume vert riche en fer"
  }
];

const supplements = [
  {
    name: 'Whey Protein',
    type: 'Protéine',
    description: 'Protéine de lactosérum de haute qualité',
    dosage: '30g par portion',
    frequency: '1-2 fois par jour',
    sideEffects: ['Ballonnements possibles', 'Intolérance au lactose'],
    warnings: ['Contient du lactose']
  },
  {
    name: 'BCAA',
    type: 'Acides aminés',
    description: 'Acides aminés ramifiés essentiels',
    dosage: '5-10g',
    frequency: 'Avant ou pendant l\'entraînement',
    sideEffects: ['Fatigue possible'],
    warnings: ['Ne pas dépasser la dose recommandée']
  },
  {
    name: 'Créatine',
    type: 'Performance',
    description: 'Améliore la force et la récupération musculaire',
    dosage: '5g par jour',
    frequency: 'Quotidien',
    sideEffects: ['Rétention d\'eau'],
    warnings: ['Maintenir une bonne hydratation']
  }
];

async function main() {
  console.log('Start seeding...');

  // Create health professionals
  for (const hp of healthProfessionals) {
    const user = await prisma.user.create({
      data: hp.user
    });
    console.log(`Created user with id: ${user.id}`);

    const professional = await prisma.healthProfessional.create({
      data: {
        userId: user.id,
        ...hp.professional
      }
    });
    console.log(`Created professional with id: ${professional.id}`);
  }

  // Create patients
  for (const patient of patients) {
    const user = await prisma.user.create({
      data: {
        email: patient.email,
        password: await hash('password123', 10),
        firstName: patient.firstName,
        lastName: patient.lastName,
        role: UserRole.PATIENT,
        phoneNumber: patient.phone,
        photoUrl: patient.profilePicture
      }
    });
    console.log(`Created user with id: ${user.id}`);

    await prisma.patient.create({
      data: {
        userId: user.id,
        sport: patient.sport,
        injury: patient.injury,
        lastAppointment: patient.lastAppointment,
        nutritionalStatus: patient.nutritionalStatus,
        progressionStatus: patient.progressionStatus
      }
    });
  }

  // Créer l'utilisateur template
  const templateUser = await prisma.user.create({
    data: {
      email: 'template@tuatha.health',
      password: 'template',
      firstName: 'Template',
      lastName: 'User',
      role: 'PATIENT',
    },
  });

  // Créer le patient template
  const templatePatient = await prisma.patient.create({
    data: {
      userId: templateUser.id,
      sport: 'Template',
      nutritionalStatus: 'GOOD',
      progressionStatus: 'IMPROVING',
    },
  });

  // Créer des exercices
  const exercises = await prisma.exercise.createMany({
    data: [
      {
        name: "Squat",
        description: "Un exercice fondamental pour renforcer les jambes",
        videoUrl: "https://example.com/squat.mp4",
        imageUrl: "/exercises/squat.jpg",
        category: "LOWER_BODY",
        difficulty: "INTERMEDIATE",
        equipment: ["BODYWEIGHT"],
        muscleGroups: ["QUADRICEPS", "HAMSTRINGS", "GLUTES"]
      },
      {
        name: "Pompes",
        description: "Excellent exercice pour le haut du corps",
        videoUrl: "https://example.com/pushup.mp4",
        imageUrl: "/exercises/pushup.jpg",
        category: "UPPER_BODY",
        difficulty: "BEGINNER",
        equipment: ["BODYWEIGHT"],
        muscleGroups: ["CHEST", "SHOULDERS", "TRICEPS"]
      },
      {
        name: "Planche",
        description: "Renforce les abdominaux et améliore la stabilité",
        videoUrl: "https://example.com/plank.mp4",
        imageUrl: "/exercises/plank.jpg",
        category: "CORE",
        difficulty: "BEGINNER",
        equipment: ["BODYWEIGHT"],
        muscleGroups: ["CORE", "SHOULDERS"]
      }
    ]
  });

  // Créer un programme d'exemple
  const luffyUser = await prisma.user.findFirst({ 
    where: { email: 'luffy@thousand-sunny.com' },
    include: { patient: true }
  });
  const chopperUser = await prisma.user.findFirst({ 
    where: { email: 'chopper.nutritionist@tuatha.app' },
    include: { healthProfessional: true }
  });

  const program = await prisma.program.create({
    data: {
      title: "Programme de Renforcement Débutant",
      description: "Un programme complet pour débutants visant à améliorer la force générale",
      startDate: new Date(),
      status: "ACTIVE",
      patientId: luffyUser.patient.id,
      healthProfessionalId: chopperUser.healthProfessional.id,
      exercises: {
        create: [
          {
            exerciseId: (await prisma.exercise.findFirst({ where: { name: "Squat" } })).id,
            sets: 3,
            reps: 12,
            notes: "Gardez le dos droit et descendez jusqu'à ce que vos cuisses soient parallèles au sol"
          },
          {
            exerciseId: (await prisma.exercise.findFirst({ where: { name: "Pompes" } })).id,
            sets: 3,
            reps: 10,
            notes: "Commencez sur les genoux si nécessaire"
          },
          {
            exerciseId: (await prisma.exercise.findFirst({ where: { name: "Planche" } })).id,
            sets: 3,
            duration: 30,
            notes: "Maintenez la position pendant 30 secondes"
          }
        ]
      }
    }
  });

  // Seed Foods
  for (const food of foods) {
    await prisma.food.upsert({
      where: { id: food.id },
      update: food,
      create: food,
    });
  }

  // Seed Supplements
  for (const supplement of supplements) {
    await prisma.supplement.upsert({
      where: { name: supplement.name },
      update: supplement,
      create: supplement,
    });
  }

  // Récupérer tous les patients et professionnels de santé pour créer des relations
  const allPatients = await prisma.patient.findMany();
  const allProfessionals = await prisma.healthProfessional.findMany({
    include: { user: true }
  });

  console.log('Création des relations entre patients et professionnels de santé...');

  // Créer des relations PatientHealthProfessional pour simuler le partage de dossiers
  const patientHealthProfessionalRelations = [];

  // Associer Chopper (nutritionniste) à tous les patients
  const chopperPro = allProfessionals.find(p => p.user.email === 'chopper.nutritionist@tuatha.app');
  if (chopperPro) {
    for (const patient of allPatients) {
      patientHealthProfessionalRelations.push({
        id: `php-chopper-${patient.id}`,
        patientId: patient.id,
        healthProfessionalId: chopperPro.id,
        status: 'ACTIVE',
        specialNotes: 'Suivi nutritionnel régulier',
        lastConsultation: new Date('2025-02-15'),
        nextConsultation: new Date('2025-03-25'),
        updatedAt: new Date(),
      });
    }
  }

  // Associer Bruce Banner (diététicien) à certains patients
  const bannerPro = allProfessionals.find(p => p.user.email === 'hulk.dietitian@tuatha.app');
  if (bannerPro && allPatients.length >= 3) {
    patientHealthProfessionalRelations.push({
      id: `php-banner-${allPatients[0].id}`,
      patientId: allPatients[0].id,
      healthProfessionalId: bannerPro.id,
      status: 'ACTIVE',
      specialNotes: 'Programme diététique spécial',
      lastConsultation: new Date('2025-02-10'),
      nextConsultation: new Date('2025-03-20'),
      updatedAt: new Date(),
    });
    patientHealthProfessionalRelations.push({
      id: `php-banner-${allPatients[2].id}`,
      patientId: allPatients[2].id,
      healthProfessionalId: bannerPro.id,
      status: 'ACTIVE',
      specialNotes: 'Suivi mensuel',
      lastConsultation: new Date('2025-02-05'),
      nextConsultation: new Date('2025-03-15'),
      updatedAt: new Date(),
    });
  }

  // Associer Tsunade (diététicienne) à certains patients
  const tsunadePro = allProfessionals.find(p => p.user.email === 'tsunade.dietitian@tuatha.app');
  if (tsunadePro && allPatients.length >= 2) {
    patientHealthProfessionalRelations.push({
      id: `php-tsunade-${allPatients[1].id}`,
      patientId: allPatients[1].id,
      healthProfessionalId: tsunadePro.id,
      status: 'ACTIVE',
      specialNotes: 'Régime spécial récupération',
      lastConsultation: new Date('2025-01-25'),
      nextConsultation: new Date('2025-03-05'),
      updatedAt: new Date(),
    });
  }

  // Associer Sanji (nutritionniste) à certains patients
  const sanjiPro = allProfessionals.find(p => p.user.email === 'sanji.nutritionist@tuatha.app');
  if (sanjiPro && allPatients.length >= 4) {
    patientHealthProfessionalRelations.push({
      id: `php-sanji-${allPatients[3].id}`,
      patientId: allPatients[3].id,
      healthProfessionalId: sanjiPro.id,
      status: 'ACTIVE',
      specialNotes: 'Régime haute performance',
      lastConsultation: new Date('2025-02-20'),
      nextConsultation: new Date('2025-03-30'),
      updatedAt: new Date(),
    });
  }

  // Créer les relations dans la base de données
  if (patientHealthProfessionalRelations.length > 0) {
    try {
      await prisma.patientHealthProfessional.createMany({
        data: patientHealthProfessionalRelations,
        skipDuplicates: true,
      });
      console.log(`${patientHealthProfessionalRelations.length} relations patient-professionnel créées avec succès.`);
    } catch (error) {
      console.error('Erreur lors de la création des relations patient-professionnel:', error);
    }
  }

  console.log('Seeding finished');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
