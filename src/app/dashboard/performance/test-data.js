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
  { id: '1', name: 'Bruce Wayne', objective: 'Perte de poids' },
  { id: '2', name: 'Izuku Midoriya', objective: 'Endurance' },
  { id: '3', name: 'Son Goku', objective: 'Force' },
  { id: '4', name: 'Tony Stark', objective: 'Préparation marathon' }
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
      notes: 'Tous les indicateurs médicaux sont dans les normes. Prochain bilan dans 3 mois. - Tony Tony Chopper, Nutritionniste',
      datasets: [
        { label: 'Hémoglobine', data: [14.2, 14.3, 14.1, 14.5], normal: '13.5-17.5', unit: 'g/dL', criticalThreshold: 1.0 },
        { label: 'Ferritine', data: [75, 82, 80, 85], normal: '>30', unit: 'ng/mL', criticalThreshold: 15 },
        { label: 'Cortisol', data: [15.2, 14.8, 15.5, 15.0], normal: '5-25', unit: 'µg/dL', criticalThreshold: 5.0 },
        { label: 'Testostérone', data: [650, 675, 660, 670], normal: '280-1100', unit: 'ng/dL', criticalThreshold: 100 },
        { label: 'Vit D', data: [65, 70, 72, 75], normal: '>50', unit: 'ng/mL', criticalThreshold: 10 },
        { label: 'CRP', data: [1.2, 1.0, 0.8, 0.9], normal: '<3', unit: 'mg/L', criticalThreshold: 2.0 }
      ]
    },
    notes: {
      content: 'Bruce progresse bien dans son objectif de perte de poids. Il devrait améliorer son hydratation et son sommeil pour optimiser sa récupération. Prochaine étape : intégrer plus d\'exercices de résistance pour maintenir la masse musculaire pendant la perte de poids. - Banner, Diététicien',
      lastUpdate: '10/02/2023'
    }
  },
  '2': {
    weight: {
      current: 68.3,
      target: 65,
      status: 'success',
      notes: 'Bon maintien du poids, stabilité après la perte de 2 kg du mois dernier. - Tsunade, Diététicienne',
      datasets: [
        {
          label: 'Poids (kg)',
          data: [70.1, 69.8, 69.5, 69.2, 68.8, 68.5, 68.3]
        },
        {
          label: 'Masse Grasse (%)',
          data: [21.2, 21.0, 20.8, 20.5, 20.2, 19.8, 19.5]
        }
      ]
    },
    hydration: {
      current: 2.8,
      target: 2.5,
      status: 'success',
      notes: 'Excellente hydratation, maintien des bonnes habitudes.',
      datasets: [
        {
          label: 'Hydratation (L)',
          data: [2.5, 2.6, 2.8, 2.7, 2.9, 2.8, 2.8]
        }
      ]
    },
    calories: {
      current: 1850,
      target: 1800,
      burn: 2200,
      status: 'success',
      notes: 'Bon équilibre calorique. Légèrement au-dessus de la cible mais adéquat compte tenu des activités.',
      datasets: [
        {
          label: 'Calories Consommées',
          data: [1820, 1830, 1890, 1870, 1900, 1880, 1850]
        },
        {
          label: 'Calories Dépensées',
          data: [2150, 2180, 2250, 2220, 2300, 2280, 2200]
        }
      ]
    },
    notes: {
      content: 'Izuku maintient une excellente condition physique. Sa préparation pour le semi-marathon avance bien avec une amélioration constante de son endurance. - Tsunade, Diététicienne',
      lastUpdate: '15/02/2023'
    }
  },
  '3': {
    weight: {
      current: 90.2,
      target: 95,
      status: 'warning',
      notes: 'Prise de masse légèrement en-dessous de l\'objectif. Augmenter l\'apport calorique. - Sanji, Nutritionniste',
      datasets: [
        {
          label: 'Poids (kg)',
          data: [88.5, 88.9, 89.3, 89.6, 89.9, 90.1, 90.2]
        },
        {
          label: 'Masse Grasse (%)',
          data: [15.8, 15.6, 15.4, 15.2, 15.0, 14.9, 14.8]
        }
      ]
    },
    notes: {
      content: 'Goku progresse dans son objectif de prise de masse musculaire. Il est recommandé d\'augmenter légèrement l\'apport calorique et protéique pour atteindre la cible de poids. Bonne exécution des exercices de force. - Sanji, Nutritionniste',
      lastUpdate: '20/02/2023'
    }
  },
  '4': {
    weight: {
      current: 62.8,
      target: 62,
      status: 'success',
      notes: 'Poids idéal pour la compétition maintenu dans la fourchette cible. - Tony Tony Chopper, Nutritionniste',
      datasets: [
        {
          label: 'Poids (kg)',
          data: [63.5, 63.3, 63.1, 62.9, 62.8, 62.8, 62.8]
        },
        {
          label: 'Masse Grasse (%)',
          data: [18.2, 18.0, 17.8, 17.6, 17.5, 17.4, 17.3]
        }
      ]
    },
    notes: {
      content: 'Tony est parfaitement préparé pour son marathon. Sa condition cardiovasculaire est excellente et sa récupération optimale. Maintenir les routines actuelles et se concentrer sur la visualisation mentale de la course. - Tony Tony Chopper, Nutritionniste',
      lastUpdate: '25/02/2023'
    }
  },
  '12345': {
    medical: {
      weight: {
        current: 85.5,
        target: 82,
        status: 'warning',
        notes: 'En progression. - Banner, Diététicien',
        datasets: [
          { data: [86.2, 86.0, 85.8, 85.5, 85.3, 85.0, 84.7] }, // Poids
          { data: [22, 21.8, 21.5, 21.3, 21.0, 20.8, 20.5] }    // Masse grasse
        ]
      },
      hydration: {
        current: 2.1,
        target: 3,
        status: 'danger',
        notes: 'Hydratation insuffisante. - Tony Tony Chopper, Nutritionniste',
        datasets: [
          { data: [1.8, 2.0, 1.9, 2.1, 2.2, 2.0, 2.1] } // Hydratation
        ]
      },
      calories: {
        current: 2450,
        target: 2200,
        burn: 2800,
        status: 'success',
        notes: 'Bon équilibre calorique. - Tsunade, Diététicienne',
        datasets: [
          { data: [2500, 2400, 2350, 2450, 2400, 2300, 2450] }, // Consommées
          { data: [2700, 2750, 2650, 2800, 2900, 2750, 2800] }  // Dépensées
        ]
      }
    },
    macros: {
      status: 'warning',
      notes: 'Augmenter les protéines. - Sanji, Nutritionniste',
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
