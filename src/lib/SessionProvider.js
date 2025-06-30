'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import SessionManager from './sessionStorage';

// Contexte pour la session utilisateur
const SessionContext = createContext({
  session: null,
  isLoading: true,
  isAuthenticated: false,
  user: null,
  healthProfessional: null,
  refreshSession: () => {},
  clearSession: () => {},
  debugSession: () => {}
});

// Provider pour gérer la session globalement
export function SessionProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger la session au démarrage
  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = () => {
    try {
      setIsLoading(true);
      const currentSession = SessionManager.getCurrentSession();
      setSession(currentSession);
      
      if (currentSession?.isAuthenticated) {
        console.log('✅ Session utilisateur restaurée:', currentSession.user.email);
      } else {
        console.log('ℹ️ Aucune session active trouvée');
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement de la session:', error);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSession = () => {
    console.log('🔄 Actualisation de la session...');
    loadSession();
  };

  const clearSession = () => {
    console.log('🚪 Déconnexion...');
    SessionManager.clearSession();
    setSession(null);
  };

  const debugSession = () => {
    SessionManager.debugSession();
  };

  const contextValue = {
    session,
    isLoading,
    isAuthenticated: session?.isAuthenticated || false,
    user: session?.user || null,
    healthProfessional: session?.healthProfessional || null,
    refreshSession,
    clearSession,
    debugSession
  };

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
}

// Hook pour utiliser la session
export function useSession() {
  const context = useContext(SessionContext);
  
  if (context === undefined) {
    throw new Error('useSession doit être utilisé dans un SessionProvider');
  }
  
  return context;
}

export default SessionProvider;
