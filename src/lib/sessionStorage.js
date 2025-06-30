// Gestionnaire de session localStorage pour l'app Tuatha
// Persiste les données utilisateur entre les rechargements de page

const SESSION_KEYS = {
  USER: 'tuatha-user',
  AUTH: 'tuatha-auth',
  HEALTH_PROFESSIONAL: 'tuatha-health-professional',
  SIGNUP_COMPLETE: 'inscription-complete',
  MOCK_USERS: 'tuatha-mock-users',
  MOCK_HEALTH_PROFESSIONALS: 'tuatha-mock-health-professionals'
};

class SessionManager {
  // Vérifier si on est côté client
  static isClient() {
    return typeof window !== 'undefined';
  }

  // Sauvegarder les données utilisateur après inscription
  static saveUserSession(user, healthProfessional = null, authToken = null) {
    if (!this.isClient()) return;

    try {
      // Sauvegarder l'utilisateur principal
      localStorage.setItem(SESSION_KEYS.USER, JSON.stringify(user));
      
      // Sauvegarder le professionnel de santé si présent
      if (healthProfessional) {
        localStorage.setItem(SESSION_KEYS.HEALTH_PROFESSIONAL, JSON.stringify(healthProfessional));
      }
      
      // Sauvegarder le token d'authentification
      if (authToken) {
        localStorage.setItem(SESSION_KEYS.AUTH, JSON.stringify(authToken));
        // Aussi en cookie pour compatibilité
        document.cookie = `tuatha-auth=${JSON.stringify(authToken)}; path=/; max-age=${60*60*24}; SameSite=Lax`;
      }
      
      // Marquer l'inscription comme complète
      localStorage.setItem(SESSION_KEYS.SIGNUP_COMPLETE, 'true');
      
      console.log('Session utilisateur sauvegardée:', user.email);
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de session:', error);
      return false;
    }
  }

  // Récupérer la session utilisateur actuelle
  static getCurrentSession() {
    if (!this.isClient()) return null;

    try {
      const user = JSON.parse(localStorage.getItem(SESSION_KEYS.USER) || 'null');
      const healthProfessional = JSON.parse(localStorage.getItem(SESSION_KEYS.HEALTH_PROFESSIONAL) || 'null');
      const authToken = JSON.parse(localStorage.getItem(SESSION_KEYS.AUTH) || 'null');
      const isSignupComplete = localStorage.getItem(SESSION_KEYS.SIGNUP_COMPLETE) === 'true';

      if (user) {
        return {
          user,
          healthProfessional,
          authToken,
          isSignupComplete,
          isAuthenticated: !!user && isSignupComplete
        };
      }
      
      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération de session:', error);
      return null;
    }
  }

  // Vérifier si l'utilisateur est connecté
  static isAuthenticated() {
    const session = this.getCurrentSession();
    return session?.isAuthenticated || false;
  }

  // Récupérer tous les utilisateurs créés (pour debugging)
  static getAllCreatedUsers() {
    if (!this.isClient()) return [];
    
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEYS.MOCK_USERS) || '[]');
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      return [];
    }
  }

  // Récupérer tous les professionnels de santé créés
  static getAllCreatedHealthProfessionals() {
    if (!this.isClient()) return [];
    
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEYS.MOCK_HEALTH_PROFESSIONALS) || '[]');
    } catch (error) {
      console.error('Erreur lors de la récupération des professionnels:', error);
      return [];
    }
  }

  // Effacer la session (déconnexion)
  static clearSession() {
    if (!this.isClient()) return;

    Object.values(SESSION_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });

    // Effacer aussi le cookie
    document.cookie = 'tuatha-auth=; path=/; max-age=0';
    
    console.log('Session effacée');
  }

  // Vérifier si des données existent en localStorage
  static hasPersistedData() {
    if (!this.isClient()) return false;
    
    return localStorage.getItem(SESSION_KEYS.USER) !== null ||
           localStorage.getItem(SESSION_KEYS.MOCK_USERS) !== null;
  }

  // Debug: afficher toutes les données localStorage
  static debugSession() {
    if (!this.isClient()) {
      console.log('Not running on client side');
      return;
    }

    console.group('🔍 Session Debug Info');
    console.log('Current Session:', this.getCurrentSession());
    console.log('All Created Users:', this.getAllCreatedUsers());
    console.log('All Health Professionals:', this.getAllCreatedHealthProfessionals());
    console.log('Has Persisted Data:', this.hasPersistedData());
    console.groupEnd();
  }
}

export default SessionManager;
export { SESSION_KEYS };
