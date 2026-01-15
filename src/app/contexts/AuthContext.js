'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Créer le contexte d'authentification
const AuthContext = createContext();

// Identifiants fixes pour la démonstration
const VALID_USERNAME = "quentin";
const VALID_EMAIL = "quentin@tuatha-app.com";
const VALID_PASSWORD = "password123";

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé avec un AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Vérifier si l'utilisateur a un cookie d'authentification
        const hasAuthCookie = document.cookie.includes('tuatha-auth=');

        if (hasAuthCookie) {
          // Simulons un utilisateur connecté pour la démonstration
          setUser({
            id: '12345',
            name: 'Quentin Granger',
            email: 'quentin@tuatha-app.com',
            role: 'nutritionniste'
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Fonction pour se connecter
  const login = async (emailOrUsername, password) => {
    console.log("AuthContext - Tentative de login avec:", emailOrUsername, password);
    console.log("Valeurs attendues:", VALID_USERNAME, VALID_PASSWORD);

    try {
      // Vérifier si les identifiants correspondent aux valeurs attendues
      if ((emailOrUsername === VALID_USERNAME || emailOrUsername === VALID_EMAIL) && password === VALID_PASSWORD) {
        console.log("AuthContext - Identifiants valides");

        // Créer un cookie d'authentification
        const date = new Date();
        date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000); // expire dans 7 jours
        document.cookie = `tuatha-auth=valid_token; expires=${date.toUTCString()}; path=/`;

        setUser({
          id: '12345',
          name: 'Quentin Granger',
          email: 'quentin@tuatha-app.com',
          role: 'nutritionniste'
        });

        // Rediriger vers le dashboard
        router.push('/dashboard');
        return true;
      } else {
        console.log("AuthContext - Identifiants invalides");
        return false;
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return false;
    }
  };

  // Fonction pour se déconnecter
  const logout = () => {
    // Supprimer le cookie d'authentification
    document.cookie = 'tuatha-auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setUser(null);
    router.push('/');
  };

  // Exposer les fonctions et l'état d'authentification
  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
