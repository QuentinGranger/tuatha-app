'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const Portal = ({ children, rootId = 'portal-root' }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Vérifier si l'élément portal-root existe déjà
    let portalRoot = document.getElementById(rootId);
    
    // Si non, le créer
    if (!portalRoot) {
      portalRoot = document.createElement('div');
      portalRoot.id = rootId;
      document.body.appendChild(portalRoot);
    }
    
    return () => {
      // Nettoyer uniquement si nous avons créé l'élément et qu'il n'a pas d'enfants
      const root = document.getElementById(rootId);
      if (root && root.childNodes.length === 0) {
        document.body.removeChild(root);
      }
    };
  }, [rootId]);
  
  return mounted ? createPortal(children, document.getElementById(rootId)) : null;
};

export default Portal;
