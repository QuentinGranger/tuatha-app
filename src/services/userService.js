/**
 * Service pour gérer les informations de l'utilisateur connecté
 */

// Variable pour stocker les informations de l'utilisateur
let currentUser = null;

/**
 * Récupère l'utilisateur connecté depuis l'API
 * @returns {Promise<Object>} L'utilisateur connecté
 */
export const fetchCurrentUser = async () => {
  try {
    if (currentUser) return currentUser;

    const response = await fetch('/api/health-professional/current');
    if (!response.ok) {
      throw new Error('Failed to fetch health professional');
    }
    
    const data = await response.json();
    currentUser = data;
    return currentUser;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
};

/**
 * Récupère l'utilisateur connecté (synchrone)
 * @returns {Object|null} L'utilisateur connecté ou null
 */
export const getCurrentUser = () => {
  return currentUser;
};

/**
 * Récupère une version formatée des informations du professionnel de santé
 * utilisable pour le PDF
 * @returns {Object} Informations formatées du professionnel
 */
export const getFormattedProfessionalInfo = () => {
  if (!currentUser) return null;
  
  return {
    name: `${currentUser.user.firstName} ${currentUser.user.lastName}`,
    speciality: getSpecialityLabel(currentUser.specialty),
    organization: currentUser.organization || '',
    phone: currentUser.user.phoneNumber || '',
    email: currentUser.user.email || '',
    // Adresse fictive pour la démonstration, à remplacer par des données réelles
    address: '42 Avenue de la Santé',
    postalCode: '75001',
    city: 'Paris',
    country: 'France',
    siret: '123 456 789 00012'
  };
};

/**
 * Convertit le code de spécialité en libellé
 * @param {string} specialty - Code de la spécialité
 * @returns {string} Libellé de la spécialité
 */
export const getSpecialityLabel = (specialty) => {
  const specialties = {
    NUTRITIONIST: 'Nutritionniste',
    GENERAL_PRACTITIONER: 'Médecin Généraliste',
    PHYSICAL_THERAPIST: 'Kinésithérapeute',
    OPHTHALMOLOGIST: 'Ophtalmologue',
    CARDIOLOGIST: 'Cardiologue',
    DERMATOLOGIST: 'Dermatologue',
    NEUROLOGIST: 'Neurologue',
    ORTHOPEDIST: 'Orthopédiste',
    PSYCHIATRIST: 'Psychiatre',
    RADIOLOGIST: 'Radiologue',
    SURGEON: 'Chirurgien',
    UROLOGIST: 'Urologue',
    GYNECOLOGIST: 'Gynécologue',
    PEDIATRICIAN: 'Pédiatre',
    OTHER: 'Autre spécialité'
  };
  
  return specialties[specialty] || specialty;
};

/**
 * Définit l'utilisateur courant (utilisé pour la synchronisation entre composants)
 * @param {Object} user - L'utilisateur à définir
 */
export const setCurrentUser = (user) => {
  currentUser = user;
};
