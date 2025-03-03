'use client';

import { useEffect } from 'react';

/**
 * Composant qui nettoie les attributs ajoutés par les extensions de navigateur
 * comme Grammarly, Dashlane, etc. pour éviter les erreurs d'hydratation React.
 */
export default function ExtensionAttributesCleaner() {
  useEffect(() => {
    // Fonction pour nettoyer les attributs liés aux extensions
    const cleanupExtensionAttributes = () => {
      // Supprimer les attributs ajoutés par Grammarly
      document.body.removeAttribute('data-new-gr-c-s-check-loaded');
      document.body.removeAttribute('data-gr-ext-installed');
      
      // Supprimer les attributs ajoutés par Dashlane
      const dashlaneElements = document.querySelectorAll('[data-dashlane-rid], [data-dashlane-classification]');
      dashlaneElements.forEach(element => {
        element.removeAttribute('data-dashlane-rid');
        element.removeAttribute('data-dashlane-classification');
      });
    };

    // Exécuter immédiatement
    cleanupExtensionAttributes();
    
    // Exécuter régulièrement pour attraper les nouveaux éléments
    const intervalId = setInterval(cleanupExtensionAttributes, 2000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  return null; // Ce composant ne rend rien
}
