// Définition des types de programmes et de suivis disponibles pour les paiements récurrents
export const programTypes = [
  { id: 'nutri-basic', name: 'Suivi Nutritionnel de Base', amount: 75 },
  { id: 'nutri-advanced', name: 'Suivi Nutritionnel Avancé', amount: 120 },
  { id: 'nutri-premium', name: 'Programme Nutritionnel Premium', amount: 180 },
  { id: 'sport-recovery', name: 'Récupération Sportive', amount: 95 },
  { id: 'sport-performance', name: 'Performance Sportive', amount: 150 },
  { id: 'joint-health', name: 'Santé Articulaire', amount: 85 },
  { id: 'weight-management', name: 'Gestion du Poids', amount: 110 },
  { id: 'metabolic-health', name: 'Santé Métabolique', amount: 130 },
  { id: 'immunity-boost', name: 'Renforcement Immunitaire', amount: 90 },
  { id: 'custom', name: 'Programme Personnalisé', amount: 0 },
];
