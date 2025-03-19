/**
 * Formate une date en chaîne localisée en français
 * @param {string|Date} dateString - La date à formater
 * @param {Object} options - Options de formatage
 * @returns {string} - Date formatée
 */
export default function formatDate(dateString, options = {}) {
  if (!dateString) return 'Non définie';
  
  // Options par défaut
  const defaultOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options
  };
  
  try {
    return new Date(dateString).toLocaleDateString('fr-FR', defaultOptions);
  } catch (error) {
    console.error('Erreur lors du formatage de la date:', error);
    return 'Date invalide';
  }
}
