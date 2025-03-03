// Fichier de données de test uniquement
// N'inclut plus de directives 'use server'

// Données de périodes pour les graphiques
export const periodLabels = {
  week: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
  month: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
  quarter: Array.from({ length: 12 }, (_, i) => `S${i + 1}`),
  year: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
};

// Athlètes test (à remplacer par des données réelles)
export const athletes = [
  { id: '1', name: 'Jean Dupont', objective: 'Perte de poids' },
  { id: '2', name: 'Marie Durand', objective: 'Endurance' },
  { id: '3', name: 'Thomas Martin', objective: 'Force' },
  { id: '4', name: 'Sophie Bernard', objective: 'Préparation marathon' }
];

// Données de performance pour les athlètes
export const athleteData = {
  '1': {
    weight: {
      current: 82.5,
      target: 75,
      status: 'warning',
      notes: 'Perte de poids stable mais légèrement en-dessous de l\'objectif hebdomadaire.',
      datasets: [
        {
          label: 'Poids (kg)',
          data: [85.2, 84.8, 84.3, 83.9, 83.2, 82.8, 82.5]
        },
        {
          label: 'Masse Grasse (%)',
          data: [24.2, 24.0, 23.8, 23.5, 23.2, 22.8, 22.5]
        }
      ]
    },
    hydration: {
      current: 2.1,
      target: 2.5,
      status: 'warning',
      notes: 'Hydratation en-dessous des recommandations. Rappeler l\'importance de boire pendant les entraînements.',
      datasets: [
        {
          label: 'Hydratation (L)',
          data: [1.8, 2.0, 1.9, 2.2, 2.0, 2.1, 2.1]
        }
      ]
    },
    calories: {
      current: 2250,
      target: 2000,
      burn: 2450,
      status: 'success',
      notes: 'Bon équilibre calorique avec un léger déficit qui correspond à l\'objectif de perte de poids.',
      datasets: [
        {
          label: 'Calories Consommées',
          data: [2300, 2180, 2350, 2220, 2275, 2200, 2250]
        },
        {
          label: 'Calories Dépensées',
          data: [2400, 2500, 2350, 2450, 2500, 2420, 2450]
        }
      ]
    },
    macros: {
      current: {
        protein: 145,
        carbs: 220,
        fat: 65
      },
      target: {
        protein: 160,
        carbs: 200,
        fat: 60
      },
      status: 'success',
      notes: 'Bonne répartition des macronutriments. Légère augmentation des protéines recommandée.',
      items: [
        { label: 'Protéines', current: 145, target: 160 },
        { label: 'Glucides', current: 220, target: 200 },
        { label: 'Lipides', current: 65, target: 60 }
      ]
    },
    sleep: {
      current: 6.5,
      target: 8,
      status: 'danger',
      notes: 'Sommeil insuffisant qui peut affecter la récupération et les performances. Recommander des stratégies d\'amélioration du sommeil.'
    },
    medical: {
      status: 'success',
      notes: 'Tous les indicateurs médicaux sont dans les normes. Prochain bilan dans 3 mois.',
      datasets: [
        { label: 'Hémoglobine', data: [14.2, 14.3, 14.1, 14.5], normal: '13.5-17.5' },
        { label: 'Ferritine', data: [75, 82, 80, 85], normal: '>30' },
        { label: 'Cortisol', data: [15.2, 14.8, 15.5, 15.0], normal: '5-25' },
        { label: 'Testostérone', data: [650, 675, 660, 670], normal: '280-1100' },
        { label: 'Vit D', data: [65, 70, 72, 75], normal: '>50' },
        { label: 'CRP', data: [1.2, 1.0, 0.8, 0.9], normal: '<3' }
      ]
    },
    notes: {
      content: 'Jean progresse bien dans son objectif de perte de poids. Il devrait améliorer son hydratation et son sommeil pour optimiser sa récupération. Prochaine étape : intégrer plus d\'exercices de résistance pour maintenir la masse musculaire pendant la perte de poids.',
      lastUpdate: '10/02/2023'
    }
  },
  '12345': {
    medical: {
      weight: {
        current: 85.5,
        target: 82,
        status: 'warning',
        notes: 'En progression',
        datasets: [
          { data: [86.2, 86.0, 85.8, 85.5, 85.3, 85.0, 84.7] }, // Poids
          { data: [22, 21.8, 21.5, 21.3, 21.0, 20.8, 20.5] }    // Masse grasse
        ]
      },
      hydration: {
        current: 2.1,
        target: 3,
        status: 'danger',
        notes: 'Hydratation insuffisante',
        datasets: [
          { data: [1.8, 2.0, 1.9, 2.1, 2.2, 2.0, 2.1] } // Hydratation
        ]
      },
      calories: {
        current: 2450,
        target: 2200,
        burn: 2800,
        status: 'success',
        notes: 'Bon équilibre calorique',
        datasets: [
          { data: [2500, 2400, 2350, 2450, 2400, 2300, 2450] }, // Consommées
          { data: [2700, 2750, 2650, 2800, 2900, 2750, 2800] }  // Dépensées
        ]
      }
    },
    macros: {
      status: 'warning',
      notes: 'Augmenter les protéines',
      current: {
        protein: 120,
        carbs: 220,
        fat: 70
      },
      target: {
        protein: 150,
        carbs: 200,
        fat: 60
      },
      items: [
        { label: 'Protéines', current: 120, target: 150, unit: 'g' },
        { label: 'Glucides', current: 220, target: 200, unit: 'g' },
        { label: 'Lipides', current: 70, target: 60, unit: 'g' }
      ]
    }
  }
};
