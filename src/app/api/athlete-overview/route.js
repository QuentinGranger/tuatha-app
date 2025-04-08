import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    let patientId = searchParams.get('patientId');
    const period = searchParams.get('period') || 'week';

    if (!patientId) {
      return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 });
    }

    // En mode développement ou si Prisma n'est pas disponible, utiliser les données de test
    console.log('Mode développement: utilisation des données de test pour AthleteOverview');
    return NextResponse.json(getMockAthleteOverviewData(patientId, period));

    // Le code suivant est commenté car l'accès à la base de données n'est pas configuré
    // Ce code sera décommenté une fois que la base de données sera prête
    /*
    // Récupérer les informations du patient
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        user: true,
        PatientHealthProfessional: {
          include: {
            HealthProfessional: {
              include: {
                user: true
              }
            }
          }
        }
      }
    });

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Logique existante pour récupérer les données...
    // ...
    */
  } catch (error) {
    console.error('Error in athlete overview API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Fonction pour générer des données de test
function getMockAthleteOverviewData(patientId, period) {
  // Générer les dates pour les 7 derniers jours
  const now = new Date();
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date(now);
    day.setDate(day.getDate() - i);
    const formattedDate = `${day.getDate().toString().padStart(2, '0')}/${(day.getMonth() + 1).toString().padStart(2, '0')}`;
    
    last7Days.push({
      date: formattedDate,
      type: '',
      duration: '',
      muscleGroups: [],
      fatigueLevel: 0,
      painAreas: []
    });
  }
  
  // Remplir avec des activités aléatoires
  const workoutTypes = ['Force', 'Cardio', 'Métcon', 'Mobilité'];
  const muscleGroups = [
    ['Épaules', 'Push'], 
    ['Jambes'], 
    ['Pull', 'Core'], 
    ['Full'], 
    ['Hanches', 'Dos']
  ];
  
  // Déterminer combien de jours d'entraînement (entre 3 et 5)
  const trainingDays = Math.floor(Math.random() * 3) + 3;
  const trainingIndices = [];
  
  while (trainingIndices.length < trainingDays) {
    const index = Math.floor(Math.random() * 7);
    if (!trainingIndices.includes(index)) {
      trainingIndices.push(index);
    }
  }
  
  trainingIndices.forEach(index => {
    const typeIndex = Math.floor(Math.random() * workoutTypes.length);
    const muscleIndex = Math.floor(Math.random() * muscleGroups.length);
    const duration = Math.floor(Math.random() * 30) + 30; // Entre 30 et 60 minutes
    const fatigue = Math.floor(Math.random() * 4) + 1; // Entre 1 et 5
    
    last7Days[index].type = workoutTypes[typeIndex];
    last7Days[index].duration = `${duration} min`;
    last7Days[index].muscleGroups = muscleGroups[muscleIndex];
    last7Days[index].fatigueLevel = fatigue;
  });
  
  // Générer des statistiques
  const stats = {
    frequenceHebdo: trainingDays,
    joursRepos: 7 - trainingDays,
    chaineSollicitation: {
      push: Math.floor(Math.random() * 3) + 1,
      pull: Math.floor(Math.random() * 3) + 1,
      jambes: Math.floor(Math.random() * 3) + 1,
      core: Math.floor(Math.random() * 3) + 1,
      epaules: Math.floor(Math.random() * 3) + 1
    },
    douleurs: []
  };
  
  // Ajouter des zones de douleur aléatoires
  const painZones = [
    { zone: 'Genou droit', occurrences: Math.floor(Math.random() * 3) + 1 },
    { zone: 'Épaule gauche', occurrences: Math.floor(Math.random() * 2) + 1 },
    { zone: 'Poignet droit', occurrences: Math.floor(Math.random() * 2) + 1 }
  ];
  
  // Ajouter seulement 1 ou 2 zones de douleur
  const numPainZones = Math.floor(Math.random() * 2) + 1;
  for (let i = 0; i < numPainZones; i++) {
    stats.douleurs.push(painZones[i]);
  }
  
  // Générer des points de douleur pour la silhouette
  const painPoints = [
    { top: '60%', left: '45%', severity: 'high' },   // Genou droit
    { top: '20%', left: '65%', severity: 'medium' }, // Épaule gauche
    { top: '30%', left: '35%', severity: 'low' }     // Poignet droit
  ].slice(0, numPainZones);
  
  // Générer des commentaires de professionnel
  const professionals = [
    { name: "Tony Tony Chopper", specialty: "Nutritionniste" },
    { name: "Banner", specialty: "Diététicien" },
    { name: "Tsunade", specialty: "Diététicienne" },
    { name: "Sanji", specialty: "Nutritionniste" }
  ];
  
  const proIndex = Math.floor(Math.random() * professionals.length);
  const selectedPro = professionals[proIndex];
  
  let comments = "";
  if (selectedPro.name === "Tony Tony Chopper") {
    comments = "L'athlète présente une bonne récupération entre les sessions. Attention particulière sur la mobilité articulaire et le renforcement proprioceptif.";
  } else if (selectedPro.name === "Sanji") {
    comments = "Équilibre alimentaire satisfaisant. Recommande d'augmenter les apports en protéines après les séances de force et de maintenir une bonne hydratation.";
  } else if (selectedPro.name === "Banner") {
    comments = "Tous les indicateurs de santé sont normaux. Continuer à surveiller le niveau de fatigue et la qualité du sommeil pour optimiser la récupération.";
  } else if (selectedPro.name === "Tsunade") {
    comments = "Bonne condition générale. Poursuivre le programme actuel en ajustant l'intensité selon la fatigue ressentie.";
  }

  const proComments = {
    alerts: [],
    comments: comments,
    professional: `${selectedPro.name}, ${selectedPro.specialty}`
  };
  
  // Ajouter des alertes si nécessaire
  if (stats.douleurs.length > 0 && stats.douleurs[0].occurrences > 2) {
    proComments.alerts.push(`${stats.douleurs[0].zone} signalé fréquemment (${stats.douleurs[0].occurrences}x)`);
  }
  
  return {
    patient: {
      id: patientId,
      name: 'Test Athlete',
    },
    workoutData: last7Days,
    stats,
    painPoints,
    proComments
  };
}
