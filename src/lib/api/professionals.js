/**
 * Récupère les professionnels associés à un patient
 * @param {string} patientId - ID du patient
 * @returns {Promise<Array>} Liste des professionnels de santé
 */
export async function getProfessionalsForPatient(patientId) {
  try {
    const response = await fetch(`/api/patients/${patientId}/professionals`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch professionals');
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : (data.professionals || []);
  } catch (error) {
    console.error('Error fetching professionals:', error);
    // Pour le développement, retourner des données fictives
    return getMockProfessionalsForPatient(patientId);
  }
}

/**
 * Récupère un professionnel par son ID
 * @param {string} id - ID du professionnel
 * @returns {Promise<Object>} Données du professionnel
 */
export async function getProfessionalById(id) {
  try {
    const response = await fetch(`/api/professionals/${id}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch professional');
    }
    
    const data = await response.json();
    return data.professional || data;
  } catch (error) {
    console.error(`Error fetching professional ${id}:`, error);
    // Pour le développement, retourner des données fictives
    return mockProfessionals.find(pro => pro.id === id) || null;
  }
}

// Données fictives pour le développement
const mockProfessionals = [
  {
    id: 'pro1',
    name: 'Dr. Alexandre Martin',
    type: 'medecin',
    specialty: 'Médecin généraliste',
    status: 'active',
    lastContact: '1 jour',
    email: 'a.martin@exemple.com',
    phone: '+33 6 12 34 56 78',
    address: '15 rue de la Médecine, 75001 Paris',
    notes: 'Médecin traitant du patient depuis 2019. Suivi régulier.',
    sharedData: ['dossier médical', 'analyses', 'prescriptions'],
  },
  {
    id: 'pro2',
    name: 'Sophie Dubois',
    type: 'kine',
    specialty: 'Kinésithérapeute',
    status: 'active',
    lastContact: '3 jours',
    email: 's.dubois@exemple.com',
    phone: '+33 6 23 45 67 89',
    address: '8 rue de la Réhabilitation, 75002 Paris',
    notes: 'Suivi hebdomadaire pour rééducation post-blessure.',
    sharedData: ['programme d\'exercices', 'suivi de progression'],
  },
  {
    id: 'pro3',
    name: 'Thomas Laurent',
    type: 'coach',
    specialty: 'Coach sportif',
    status: 'active',
    lastContact: '5 heures',
    email: 't.laurent@exemple.com',
    phone: '+33 6 34 56 78 90',
    address: 'Centre sportif Alpha, 75003 Paris',
    notes: 'Coaching 3 fois par semaine, spécialiste en renforcement musculaire.',
    sharedData: ['plan d\'entraînement', 'performances'],
  },
  {
    id: 'pro4',
    name: 'Emma Petit',
    type: 'nutritionniste',
    specialty: 'Nutritionniste',
    status: 'pending',
    lastContact: 'Jamais',
    email: 'e.petit@exemple.com',
    phone: '+33 6 45 67 89 01',
    address: '22 rue de l\'Alimentation, 75004 Paris',
    notes: 'Nouvelle dans l\'équipe, pas encore de première consultation.',
    sharedData: [],
  },
  {
    id: 'pro5',
    name: 'Dr. Julie Bernard',
    type: 'psychologue',
    specialty: 'Psychologue du sport',
    status: 'history',
    lastContact: '2 mois',
    email: 'j.bernard@exemple.com',
    phone: '+33 6 56 78 90 12',
    address: '10 rue de la Psychologie, 75005 Paris',
    notes: 'Suivi terminé après 10 séances de préparation mentale.',
    sharedData: ['rapports de séances'],
  },
  {
    id: 'pro6',
    name: 'Marc Leroy',
    type: 'infirmier',
    specialty: 'Infirmier spécialisé',
    status: 'active',
    lastContact: '1 semaine',
    email: 'm.leroy@exemple.com',
    phone: '+33 6 67 89 01 23',
    address: 'Clinique des Athlètes, 75006 Paris',
    notes: 'Responsable des soins post-opératoires.',
    sharedData: ['soins', 'traitements'],
  },
  {
    id: 'pro7',
    name: 'Dr. Nathalie Moreau',
    type: 'dentiste',
    specialty: 'Dentiste',
    status: 'history',
    lastContact: '6 mois',
    email: 'n.moreau@exemple.com',
    phone: '+33 6 78 90 12 34',
    address: '5 rue Dentaire, 75007 Paris',
    notes: 'Dernier contrôle il y a 6 mois, RDV annuel prévu.',
    sharedData: ['dossier dentaire'],
  }
];

// Fonction pour obtenir des professionnels fictifs pour un patient donné
function getMockProfessionalsForPatient(patientId) {
  // Ici, on pourrait adapter les données en fonction de l'ID du patient
  // Pour simplifier, on retourne toujours la même liste
  return mockProfessionals;
}
