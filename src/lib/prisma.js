// Client Prisma mockée avec les données du fichier seed.mjs
// Cette approche est temporaire pour contourner les problèmes de génération Prisma

import { NutritionalStatus, ProgressionStatus, UserRole, Specialty } from '@prisma/client';

// Mock data pour les patients basée sur seed.mjs
const patients = [
  {
    id: 'pat-001',
    userId: 'user-001',
    sport: 'Arts Martiaux',
    injury: 'Multiples fractures dues aux chutes de buildings',
    lastAppointment: new Date('2025-02-05'),
    nutritionalStatus: NutritionalStatus.GOOD,
    progressionStatus: ProgressionStatus.IMPROVING,
    healthProfessionalId: 'hp-001',
    user: {
      id: 'user-001',
      email: 'batman@wayne-enterprises.com',
      firstName: 'Bruce',
      lastName: 'Wayne',
      role: UserRole.PATIENT,
      phoneNumber: '0666666666',
      photoUrl: '/img/patient/batman.jpg'
    }
  },
  {
    id: 'pat-002',
    userId: 'user-002',
    sport: 'Super-Héroïsme',
    injury: 'Bras cassés à répétition (One For All)',
    lastAppointment: new Date('2025-02-04'),
    nutritionalStatus: NutritionalStatus.AVERAGE,
    progressionStatus: ProgressionStatus.IMPROVING,
    healthProfessionalId: 'hp-001',
    user: {
      id: 'user-002',
      email: 'deku@ua.edu',
      firstName: 'Izuku',
      lastName: 'Midoriya',
      role: UserRole.PATIENT,
      phoneNumber: '0677777777',
      photoUrl: '/img/patient/deku.jpg'
    }
  },
  {
    id: 'pat-003',
    userId: 'user-003',
    sport: 'Arts Martiaux',
    injury: 'Surmenage dû aux entraînements à 100x la gravité',
    lastAppointment: new Date('2025-02-03'),
    nutritionalStatus: NutritionalStatus.GOOD,
    progressionStatus: ProgressionStatus.IMPROVING,
    healthProfessionalId: 'hp-002',
    user: {
      id: 'user-003',
      email: 'goku@capsule-corp.com',
      firstName: 'Son',
      lastName: 'Goku',
      role: UserRole.PATIENT,
      phoneNumber: '0688888888',
      photoUrl: '/img/patient/goku.jpg'
    }
  },
  {
    id: 'pat-004',
    userId: 'user-004',
    sport: 'Vol en armure',
    injury: 'Problèmes cardiaques (réacteur ARK)',
    lastAppointment: new Date('2025-02-02'),
    nutritionalStatus: NutritionalStatus.CRITICAL,
    progressionStatus: ProgressionStatus.STAGNATING,
    healthProfessionalId: 'hp-003',
    user: {
      id: 'user-004',
      email: 'tony@stark-industries.com',
      firstName: 'Tony',
      lastName: 'Stark',
      role: UserRole.PATIENT,
      phoneNumber: '0699999999',
      photoUrl: '/img/patient/ironman.jpg'
    }
  },
  {
    id: 'pat-005',
    userId: 'user-005',
    sport: 'Piraterie',
    injury: 'Élongation excessive des membres (fruit du Gomu Gomu)',
    lastAppointment: new Date('2025-02-01'),
    nutritionalStatus: NutritionalStatus.GOOD,
    progressionStatus: ProgressionStatus.IMPROVING,
    healthProfessionalId: 'hp-001',
    user: {
      id: 'user-005',
      email: 'luffy@thousand-sunny.com',
      firstName: 'Monkey D.',
      lastName: 'Luffy',
      role: UserRole.PATIENT,
      phoneNumber: '0611111111',
      photoUrl: '/img/patient/luffy.jpg'
    }
  },
  {
    id: 'pat-006',
    userId: 'user-006',
    sport: 'Ninjutsu',
    injury: 'Épuisement de chakra',
    lastAppointment: new Date('2025-01-31'),
    nutritionalStatus: NutritionalStatus.AVERAGE,
    progressionStatus: ProgressionStatus.IMPROVING,
    healthProfessionalId: 'hp-002',
    user: {
      id: 'user-006',
      email: 'naruto@konoha.gov',
      firstName: 'Naruto',
      lastName: 'Uzumaki',
      role: UserRole.PATIENT,
      phoneNumber: '0622222222',
      photoUrl: '/img/patient/naruto.jpg'
    }
  },
  {
    id: 'pat-007',
    userId: 'user-007',
    sport: 'Super-Héroïsme',
    injury: 'Dépression due à la facilité des combats',
    lastAppointment: new Date('2025-01-30'),
    nutritionalStatus: NutritionalStatus.GOOD,
    progressionStatus: ProgressionStatus.STAGNATING,
    healthProfessionalId: 'hp-002',
    user: {
      id: 'user-007',
      email: 'saitama@hero-association.org',
      firstName: 'Saitama',
      lastName: 'Unknown',
      role: UserRole.PATIENT,
      phoneNumber: '0633333333',
      photoUrl: '/img/patient/saitama.jpg'
    }
  },
  {
    id: 'pat-008',
    userId: 'user-008',
    sport: 'Acrobaties urbaines',
    injury: 'Tendinite aux poignets (lancer de toiles)',
    lastAppointment: new Date('2025-01-29'),
    nutritionalStatus: NutritionalStatus.AVERAGE,
    progressionStatus: ProgressionStatus.IMPROVING,
    healthProfessionalId: 'hp-003',
    user: {
      id: 'user-008',
      email: 'spidey@daily-bugle.com',
      firstName: 'Peter',
      lastName: 'Parker',
      role: UserRole.PATIENT,
      phoneNumber: '0644444444',
      photoUrl: '/img/patient/spiderman.jpg'
    }
  },
  {
    id: 'pat-009',
    userId: 'user-009',
    sport: 'Lancer de marteau',
    injury: 'Syndrome du canal carpien (Mjolnir)',
    lastAppointment: new Date('2025-01-28'),
    nutritionalStatus: NutritionalStatus.GOOD,
    progressionStatus: ProgressionStatus.IMPROVING,
    healthProfessionalId: 'hp-003',
    user: {
      id: 'user-009',
      email: 'thor@asgard.realm',
      firstName: 'Thor',
      lastName: 'Odinson',
      role: UserRole.PATIENT,
      phoneNumber: '0655555555',
      photoUrl: '/img/patient/thor.jpg'
    }
  },
  {
    id: 'pat-010',
    userId: 'user-010',
    sport: 'Combat amazonien',
    injury: 'Tendinite à l\'épaule (lancer de lasso)',
    lastAppointment: new Date('2025-01-27'),
    nutritionalStatus: NutritionalStatus.GOOD,
    progressionStatus: ProgressionStatus.IMPROVING,
    healthProfessionalId: 'hp-001',
    user: {
      id: 'user-010',
      email: 'wonder@themyscira.com',
      firstName: 'Diana',
      lastName: 'Prince',
      role: UserRole.PATIENT,
      phoneNumber: '0666123456',
      photoUrl: '/img/patient/wonderwoman.jpg'
    }
  }
];

// Mock data pour les professionnels de santé
const healthProfessionals = [
  {
    id: 'hp-001',
    userId: 'user-hp-001',
    specialty: Specialty.NUTRITIONIST,
    subSpecialty: 'Médecine d\'aventure',
    organization: 'Drum Island Medical Center',
    user: {
      id: 'user-hp-001',
      email: 'chopper.nutritionist@tuatha.app',
      firstName: 'Tony',
      lastName: 'Tony',
      role: UserRole.HEALTH_PROFESSIONAL,
      phoneNumber: '0677777777',
      photoUrl: '/img/professionel/chopper.jpg'
    }
  },
  {
    id: 'hp-002',
    userId: 'user-hp-002',
    specialty: Specialty.DIETITIAN,
    subSpecialty: 'Ninjutsu médical',
    organization: 'Konoha Hospital',
    user: {
      id: 'user-hp-002',
      email: 'tsunade.dietitian@tuatha.app',
      firstName: 'Tsunade',
      lastName: 'Senju',
      role: UserRole.HEALTH_PROFESSIONAL,
      phoneNumber: '0688888888',
      photoUrl: '/img/professionel/tsunade.jpg'
    }
  },
  {
    id: 'hp-003',
    userId: 'user-hp-003',
    specialty: Specialty.NUTRITIONIST,
    subSpecialty: 'Cuisine thérapeutique',
    organization: 'Baratie Restaurant',
    user: {
      id: 'user-hp-003',
      email: 'sanji.nutritionist@tuatha.app',
      firstName: 'Sanji',
      lastName: 'Vinsmoke',
      role: UserRole.HEALTH_PROFESSIONAL,
      phoneNumber: '0699999999',
      photoUrl: '/img/professionel/sanji.jpg'
    }
  },
  {
    id: 'hp-004',
    userId: 'user-hp-004',
    specialty: Specialty.DIETITIAN,
    subSpecialty: 'Radiologie',
    organization: 'Avengers Tower Medical Center',
    user: {
      id: 'user-hp-004',
      email: 'hulk.dietitian@tuatha.app',
      firstName: 'Bruce',
      lastName: 'Banner',
      role: UserRole.HEALTH_PROFESSIONAL,
      phoneNumber: '0666666666',
      photoUrl: '/img/professionel/hulk.jpg'
    }
  }
];

// Partie 1: Ajout des métriques de base aux patients
// Ajout de propriétés directement sur les patients pour correspondre à ce que les composants attendent
const patientsWithProps = patients.map(patient => {
  // Données de base communes à tous les patients
  const baseMetrics = {
    // Propriétés utilisées dans les composants
    firstName: patient.user.firstName,
    lastName: patient.user.lastName,
    email: patient.user.email,
    phoneNumber: patient.user.phoneNumber,
    photoUrl: patient.user.photoUrl,
    
    // Métriques nutritionnelles
    proteinIntake: Math.floor(Math.random() * 200) + 100, // 100-300g
    carbIntake: Math.floor(Math.random() * 300) + 150,    // 150-450g
    fatIntake: Math.floor(Math.random() * 100) + 50,      // 50-150g
    hydration: Math.floor(Math.random() * 50) + 50,       // 50-100%
    
    // Métriques physiques
    weight: Math.floor(Math.random() * 40) + 60,          // 60-100kg
    height: Math.floor(Math.random() * 40) + 160,         // 160-200cm
    bodyFat: Math.floor(Math.random() * 20) + 5,          // 5-25%
    muscleMass: Math.floor(Math.random() * 20) + 30,      // 30-50%
    
    // Métriques cardio
    vo2max: Math.floor(Math.random() * 30) + 40,          // 40-70 ml/kg/min
    restingHeartRate: Math.floor(Math.random() * 30) + 40, // 40-70 bpm
    maxHeartRate: Math.floor(Math.random() * 20) + 180,    // 180-200 bpm
    
    // Métriques de performance
    strengthScore: Math.floor(Math.random() * 50) + 50,    // 50-100
    enduranceScore: Math.floor(Math.random() * 50) + 50,   // 50-100
    flexibilityScore: Math.floor(Math.random() * 50) + 50, // 50-100
    
    // Métriques de récupération
    recoveryScore: Math.floor(Math.random() * 50) + 50,    // 50-100
    sleepQuality: Math.floor(Math.random() * 50) + 50,     // 50-100
    stressLevel: Math.floor(Math.random() * 8) + 2,        // 2-10
    
    // Alertes (structure vide par défaut)
    alerts: {},
  };
  
  return {
    ...patient,
    ...baseMetrics,
  };
});

// Création de programmes d'exemple
const mockExercises = [
  { id: '1', name: 'Squat', type: 'STRENGTH', targetArea: 'LOWER_BODY', description: 'Squat traditionnel travaillant les quadriceps, fessiers et ischio-jambiers.' },
  { id: '2', name: 'Bench Press', type: 'STRENGTH', targetArea: 'UPPER_BODY', description: 'Développé couché travaillant les pectoraux, triceps et épaules.' },
  { id: '3', name: 'Deadlift', type: 'STRENGTH', targetArea: 'FULL_BODY', description: 'Soulevé de terre travaillant le dos, les fessiers et les ischio-jambiers.' },
  { id: '4', name: 'Sprint', type: 'CARDIO', targetArea: 'FULL_BODY', description: 'Sprint de haute intensité pour améliorer l\'explosivité et la capacité cardiovasculaire.' },
  { id: '5', name: 'Plank', type: 'STABILITY', targetArea: 'CORE', description: 'Planche isométrique travaillant les muscles centraux et la stabilité.' }
];

const mockSupplements = [
  { id: '1', name: 'Whey Protein', type: 'PROTEIN', description: 'Protéine de lactosérum pour la récupération musculaire.', dosage: '25g', frequency: '1-2 fois par jour' },
  { id: '2', name: 'BCAA', type: 'AMINO_ACIDS', description: 'Acides aminés à chaîne ramifiée favorisant la récupération musculaire.', dosage: '5g', frequency: 'Avant et après l\'entraînement' },
  { id: '3', name: 'Creatine Monohydrate', type: 'PERFORMANCE', description: 'Supplément de créatine pour améliorer la force et la puissance musculaire.', dosage: '5g', frequency: 'Quotidien' },
  { id: '4', name: 'Multivitamines', type: 'VITAMINS', description: 'Complément multivitaminique pour combler les carences nutritionnelles.', dosage: '1 comprimé', frequency: 'Quotidien' },
  { id: '5', name: 'Oméga-3', type: 'ESSENTIAL_FATS', description: 'Acides gras essentiels pour la santé cardiovasculaire et la récupération.', dosage: '1000mg', frequency: 'Quotidien' }
];

// Programme d'exercices pour chaque patient
const mockProgramExercises = [
  { id: '1', exerciseId: '1', sets: 4, reps: 10, duration: 0, notes: 'Augmenter le poids progressivement' },
  { id: '2', exerciseId: '2', sets: 3, reps: 12, duration: 0, notes: 'Temps de repos de 90 secondes entre les séries' },
  { id: '3', exerciseId: '3', sets: 5, reps: 5, duration: 0, notes: 'Attention à la technique' },
  { id: '4', exerciseId: '4', sets: 0, reps: 0, duration: 15, notes: '5 sprints de 30 secondes avec 1 minute de repos' },
  { id: '5', exerciseId: '5', sets: 3, reps: 0, duration: 1, notes: 'Tenir 1 minute par série' }
];

// Création de programmes d'exemple
const mockPrograms = [
  {
    id: '1',
    title: 'Réhabilitation post-blessure Batman',
    description: 'Programme de récupération après blessure au ligament croisé antérieur',
    patientId: patients[0].id, // Batman
    healthProfessionalId: healthProfessionals[0].id, // Chopper
    startDate: new Date('2024-01-10').toISOString(),
    endDate: new Date('2024-04-10').toISOString(),
    status: 'ACTIVE',
    createdAt: new Date('2024-01-05').toISOString(),
    updatedAt: new Date('2024-01-05').toISOString(),
    patient: patients[0],
    healthProfessional: healthProfessionals[0],
    supplements: [mockSupplements[0], mockSupplements[4]],
    exercises: [
      { ...mockProgramExercises[0], exercise: mockExercises[0] },
      { ...mockProgramExercises[4], exercise: mockExercises[4] }
    ]
  },
  {
    id: '2',
    title: 'Plan de préparation One For All',
    description: 'Préparation physique et nutritionnelle pour maîtriser le One For All',
    patientId: patients[1].id, // Deku
    healthProfessionalId: healthProfessionals[1].id, // Tsunade
    startDate: new Date('2024-02-01').toISOString(),
    endDate: new Date('2024-07-31').toISOString(),
    status: 'ACTIVE',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-20').toISOString(),
    patient: patients[1],
    healthProfessional: healthProfessionals[1],
    supplements: [mockSupplements[0], mockSupplements[2], mockSupplements[3]],
    exercises: [
      { ...mockProgramExercises[0], exercise: mockExercises[0] },
      { ...mockProgramExercises[1], exercise: mockExercises[1] },
      { ...mockProgramExercises[2], exercise: mockExercises[2] }
    ]
  },
  {
    id: '3',
    title: 'Programme Ultra Instinct',
    description: 'Développement des réflexes et de la vitesse pour atteindre l\'Ultra Instinct',
    patientId: patients[2].id, // Goku
    healthProfessionalId: healthProfessionals[2].id, // Sanji
    startDate: new Date('2024-01-15').toISOString(),
    endDate: new Date('2024-12-31').toISOString(),
    status: 'ACTIVE',
    createdAt: new Date('2024-01-10').toISOString(),
    updatedAt: new Date('2024-02-05').toISOString(),
    patient: patients[2],
    healthProfessional: healthProfessionals[2],
    supplements: [mockSupplements[1], mockSupplements[2]],
    exercises: [
      { ...mockProgramExercises[2], exercise: mockExercises[2] },
      { ...mockProgramExercises[3], exercise: mockExercises[3] }
    ]
  },
  {
    id: '4',
    title: 'Récupération post-Hulk',
    description: 'Protocole de récupération après transformation en Hulk',
    patientId: patients[3].id, // Iron Man
    healthProfessionalId: healthProfessionals[3].id, // Bruce Banner
    startDate: new Date('2024-03-01').toISOString(),
    endDate: new Date('2024-05-31').toISOString(),
    status: 'TEMPLATE',
    createdAt: new Date('2024-02-25').toISOString(),
    updatedAt: new Date('2024-02-25').toISOString(),
    patient: patients[3],
    healthProfessional: healthProfessionals[3],
    supplements: [mockSupplements[3], mockSupplements[4]],
    exercises: [
      { ...mockProgramExercises[4], exercise: mockExercises[4] }
    ]
  }
];

// Mock client Prisma
const prisma = {
  patient: {
    findMany: async (options) => {
      console.log('Mock prisma.patient.findMany called');
      if (options?.include?.user) {
        return patientsWithProps;
      }
      return patientsWithProps;
    },
    findUnique: async (options) => {
      console.log('Mock prisma.patient.findUnique called', options);
      const patient = patientsWithProps.find(p => p.id === options.where.id);
      
      // Si patient non trouvé, retourner null comme le ferait Prisma
      if (!patient) return null;
      
      // Si la requête inclut l'utilisateur, s'assurer que les champs nécessaires sont présents
      if (options?.include?.user) {
        // La structure est déjà correcte dans patientsWithProps
        return patient;
      }
      
      return patient;
    },
    findFirst: async (options) => {
      console.log('Mock prisma.patient.findFirst called', options);
      if (options?.where?.userId) {
        return patientsWithProps.find(p => p.userId === options.where.userId);
      }
      return patientsWithProps[0];
    }
  },
  healthProfessional: {
    findFirst: async (options) => {
      console.log('Mock prisma.healthProfessional.findFirst called');
      if (options?.where?.userId) {
        return healthProfessionals.find(hp => hp.userId === options.where.userId);
      }
      return healthProfessionals[0];
    },
    findMany: async () => {
      return healthProfessionals;
    },
    findUnique: async (options) => {
      return healthProfessionals.find(hp => hp.id === options.where.id);
    }
  },
  food: {
    findMany: async () => [],
    create: async () => ({}),
    update: async () => ({}),
    delete: async () => ({}),
    findUnique: async () => null
  },
  supplement: {
    findMany: async () => {
      console.log('Mock prisma.supplement.findMany called');
      return mockSupplements;
    },
    findUnique: async (options) => {
      console.log('Mock prisma.supplement.findUnique called', options);
      return mockSupplements.find(s => s.id === options.where.id);
    }
  },
  program: {
    findMany: async (options) => {
      console.log('Mock prisma.program.findMany called', options);
      
      // Filtrer si nécessaire
      let filteredPrograms = [...mockPrograms];
      
      if (options?.where?.status) {
        filteredPrograms = filteredPrograms.filter(p => p.status === options.where.status);
      }
      
      return filteredPrograms;
    },
    findUnique: async (options) => {
      console.log('Mock prisma.program.findUnique called', options);
      return mockPrograms.find(p => p.id === options.where.id);
    },
    create: async (options) => {
      console.log('Mock prisma.program.create called', options);
      const data = options.data;
      
      // Génération d'un ID unique pour le nouveau programme
      const newId = (mockPrograms.length + 1).toString();
      
      // Création du nouveau programme
      const newProgram = {
        id: newId,
        title: data.title,
        description: data.description || '',
        patientId: data.patientId,
        healthProfessionalId: data.healthProfessionalId,
        startDate: data.startDate,
        endDate: data.endDate || null,
        status: data.status || 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        
        // Inclusion des relations si nécessaire
        patient: patients.find(p => p.id === data.patientId),
        healthProfessional: healthProfessionals.find(hp => hp.id === data.healthProfessionalId),
        supplements: [],
        exercises: []
      };
      
      // Ajout à la liste des programmes
      mockPrograms.push(newProgram);
      
      return newProgram;
    },
    update: async (options) => {
      console.log('Mock prisma.program.update called', options);
      const { id } = options.where;
      const data = options.data;
      
      const programIndex = mockPrograms.findIndex(p => p.id === id);
      if (programIndex === -1) {
        throw new Error('Program not found');
      }
      
      // Mise à jour du programme
      const updatedProgram = {
        ...mockPrograms[programIndex],
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      mockPrograms[programIndex] = updatedProgram;
      
      return updatedProgram;
    },
    delete: async (options) => {
      console.log('Mock prisma.program.delete called', options);
      const { id } = options.where;
      
      const programIndex = mockPrograms.findIndex(p => p.id === id);
      if (programIndex === -1) {
        throw new Error('Program not found');
      }
      
      const deletedProgram = mockPrograms[programIndex];
      mockPrograms.splice(programIndex, 1);
      
      return deletedProgram;
    }
  },
  
  exercise: {
    findMany: async () => {
      console.log('Mock prisma.exercise.findMany called');
      return mockExercises;
    },
    findUnique: async (options) => {
      console.log('Mock prisma.exercise.findUnique called', options);
      return mockExercises.find(e => e.id === options.where.id);
    }
  },
  
  programExercise: {
    deleteMany: async () => ({})
  },
  mealTime: {
    deleteMany: async () => ({})
  },
  user: {
    findFirst: async (options) => {
      if (options?.where?.email) {
        const foundUser = 
          healthProfessionals.find(hp => hp.user.email === options.where.email)?.user ||
          patients.find(p => p.user.email === options.where.email)?.user;
        return foundUser || null;
      }
      return healthProfessionals[0].user;
    },
    findUnique: async (options) => {
      if (options?.where?.id) {
        const foundUser = 
          healthProfessionals.find(hp => hp.user.id === options.where.id)?.user ||
          patients.find(p => p.user.id === options.where.id)?.user;
        return foundUser || null;
      }
      return null;
    }
  },
  $transaction: async (callback) => {
    return callback(prisma);
  },
  $connect: async () => {
    console.log('Mock prisma.$connect called - connection simulation successful');
    return true;
  }
};

export default prisma;
