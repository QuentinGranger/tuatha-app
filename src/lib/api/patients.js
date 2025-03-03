/**
 * Récupère les patients associés à une clinique
 * @returns {Promise<Array>} Liste des patients
 */
export async function getPatientsForClinic() {
  try {
    const response = await fetch('/api/patients');
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch patients');
    }
    
    const data = await response.json();
    // L'API peut renvoyer directement un tableau ou un objet avec une propriété patients
    return Array.isArray(data) ? data : (data.patients || []);
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
}

/**
 * Récupère un patient par son ID
 * @param {string} id - ID du patient
 * @returns {Promise<Object>} Données du patient
 */
export async function getPatientById(id) {
  try {
    const response = await fetch(`/api/patients/${id}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch patient');
    }
    
    const data = await response.json();
    // L'API peut renvoyer directement un objet patient ou un objet avec une propriété patient
    return data.patient || data;
  } catch (error) {
    console.error(`Error fetching patient ${id}:`, error);
    throw error;
  }
}
