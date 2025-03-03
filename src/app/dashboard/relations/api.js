/**
 * API pour la gestion des relations professionnels-patients
 * Fonctions pour récupérer, créer et gérer les relations entre les patients et les professionnels de santé
 */

import { getBaseUrl } from '@/lib/utils';

const API_BASE_URL = getBaseUrl();

/**
 * Récupère la liste des professionnels de santé associés à un patient
 * @param {string} patientId - Identifiant du patient
 * @returns {Promise<Array>} - Liste des professionnels de santé
 */
export async function getProfessionalsByPatient(patientId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/patients/${patientId}/professionals`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des professionnels: ${response.status}`);
    }

    const data = await response.json();
    
    // Traitement des images des professionnels
    return data.map(professional => ({
      ...professional,
      // Ajouter une image par défaut si aucune image n'est fournie
      imageUrl: professional.imageUrl || getDefaultImageBySpecialty(professional.specialty),
      // Assurer que le statut est correctement formaté
      relationStatus: professional.relationStatus || 'PENDING',
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des professionnels:', error);
    return [];
  }
}

/**
 * Récupère les détails d'un professionnel de santé
 * @param {string} professionalId - Identifiant du professionnel
 * @returns {Promise<Object>} - Détails du professionnel
 */
export async function getProfessionalDetails(professionalId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/professionals/${professionalId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des détails du professionnel: ${response.status}`);
    }

    const professional = await response.json();
    
    return {
      ...professional,
      imageUrl: professional.imageUrl || getDefaultImageBySpecialty(professional.specialty),
      // Formater les données supplémentaires si nécessaire
      qualifications: professional.qualifications || [],
      specialties: professional.specialties || [],
      contactInfo: professional.contactInfo || {},
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du professionnel:', error);
    return null;
  }
}

/**
 * Crée ou met à jour une relation entre un patient et un professionnel
 * @param {string} patientId - Identifiant du patient
 * @param {string} professionalId - Identifiant du professionnel
 * @param {string} status - Statut de la relation (ACTIVE, PENDING, REJECTED)
 * @returns {Promise<Object>} - Relation mise à jour
 */
export async function updateRelation(patientId, professionalId, status) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/relations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        patientId,
        professionalId,
        status,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la mise à jour de la relation: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la relation:', error);
    throw error;
  }
}

/**
 * Recherche des professionnels de santé
 * @param {string} query - Terme de recherche
 * @param {Array<string>} specialties - Liste des spécialités à filtrer
 * @returns {Promise<Array>} - Liste des professionnels correspondants
 */
export async function searchProfessionals(query, specialties = []) {
  try {
    const queryParams = new URLSearchParams();
    if (query) queryParams.append('q', query);
    if (specialties.length > 0) {
      specialties.forEach(specialty => queryParams.append('specialty', specialty));
    }

    const response = await fetch(`${API_BASE_URL}/api/professionals/search?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la recherche de professionnels: ${response.status}`);
    }

    const data = await response.json();
    
    return data.map(professional => ({
      ...professional,
      imageUrl: professional.imageUrl || getDefaultImageBySpecialty(professional.specialty),
    }));
  } catch (error) {
    console.error('Erreur lors de la recherche de professionnels:', error);
    return [];
  }
}

/**
 * Récupère tous les messages échangés entre un patient et un professionnel
 * @param {string} patientId - Identifiant du patient
 * @param {string} professionalId - Identifiant du professionnel
 * @returns {Promise<Array>} - Liste des messages
 */
export async function getMessageHistory(patientId, professionalId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/messages?patientId=${patientId}&professionalId=${professionalId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des messages: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    return [];
  }
}

/**
 * Envoie un nouveau message entre un patient et un professionnel
 * @param {string} senderId - Identifiant de l'expéditeur
 * @param {string} receiverId - Identifiant du destinataire
 * @param {string} content - Contenu du message
 * @param {Array} attachments - Pièces jointes optionnelles
 * @returns {Promise<Object>} - Le message créé
 */
export async function sendMessage(senderId, receiverId, content, attachments = []) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        senderId,
        receiverId,
        content,
        attachments,
        sentAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de l'envoi du message: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    throw error;
  }
}

/**
 * Retourne une image par défaut en fonction de la spécialité du professionnel
 * @param {string} specialty - Spécialité du professionnel
 * @returns {string} - URL de l'image par défaut
 */
function getDefaultImageBySpecialty(specialty) {
  // Utiliser des images réelles du dossier des professionnels
  const professionalImages = {
    DOCTOR: '/img/professionel/tsunade.jpg', // médecin
    PHYSIOTHERAPIST: '/img/professionel/recovery-girl.jpg', // kinésithérapeute
    PHYSICAL_TRAINER: '/img/professionel/saitama.jpg', // entraîneur sportif
    NUTRITIONIST: '/img/professionel/chopper.jpg', // nutritionniste
    DIETITIAN: '/img/professionel/sanji.jpg', // diététicien
    DEFAULT: '/img/patient/default-avatar.jpg',
  };

  return professionalImages[specialty] || professionalImages.DEFAULT;
}

/**
 * Récupère les types de relations disponibles
 * @returns {Array} - Liste des types de relations
 */
export function getRelationshipTypes() {
  return [
    { id: 'DOCTOR', label: 'Médecin', description: 'Médecin traitant ou spécialiste' },
    { id: 'PHYSIOTHERAPIST', label: 'Kinésithérapeute', description: 'Spécialiste en rééducation physique' },
    { id: 'PHYSICAL_TRAINER', label: 'Entraîneur Sportif', description: 'Coach sportif personnel' },
    { id: 'NUTRITIONIST', label: 'Nutritionniste', description: 'Spécialiste en nutrition' },
    { id: 'DIETITIAN', label: 'Diététicien', description: 'Spécialiste en alimentation et diététique' },
  ];
}

/**
 * Formate la date pour l'affichage
 * @param {string} dateString - Date au format ISO
 * @returns {string} - Date formatée
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Formate le statut de la relation pour l'affichage
 * @param {string} status - Statut de la relation
 * @returns {Object} - Informations sur le statut formaté
 */
export function formatRelationStatus(status) {
  const statusInfo = {
    ACTIVE: { 
      label: 'Actif', 
      color: '#32CD32',
      bgColor: 'rgba(50, 205, 50, 0.1)',
      borderColor: 'rgba(50, 205, 50, 0.3)',
      icon: 'check-circle'
    },
    PENDING: { 
      label: 'En attente', 
      color: '#FFA500',
      bgColor: 'rgba(255, 165, 0, 0.1)',
      borderColor: 'rgba(255, 165, 0, 0.3)',
      icon: 'clock'
    },
    REJECTED: { 
      label: 'Refusé', 
      color: '#DC3545',
      bgColor: 'rgba(220, 53, 69, 0.1)',
      borderColor: 'rgba(220, 53, 69, 0.3)',
      icon: 'times-circle'
    },
    INACTIVE: { 
      label: 'Inactif', 
      color: '#6C757D',
      bgColor: 'rgba(108, 117, 125, 0.1)',
      borderColor: 'rgba(108, 117, 125, 0.3)',
      icon: 'pause-circle'
    }
  };

  return statusInfo[status] || statusInfo.PENDING;
}
