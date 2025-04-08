'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { IoMdClose } from 'react-icons/io';
import styles from './SimpleModal.module.css';

export default function SimpleModal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  size = 'medium'
}) {
  useEffect(() => {
    if (isOpen) {
      // Bloquer le scroll du body quand la modale est ouverte
      document.body.style.overflow = 'hidden';
      
      // Fermer avec la touche Escape
      const handleEscKey = (e) => {
        if (e.key === 'Escape') onClose();
      };
      
      document.addEventListener('keydown', handleEscKey);
      
      return () => {
        document.body.style.overflow = 'auto';
        document.removeEventListener('keydown', handleEscKey);
      };
    }
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  // Nous utilisons createPortal directement, sans composant Portal intermédiaire
  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div 
        className={`${styles.modalContainer} ${styles[size]}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{title}</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <IoMdClose />
          </button>
        </div>
        
        <div className={styles.modalContent}>{children}</div>
        
        {footer && (
          <div className={styles.modalFooter}>{footer}</div>
        )}
      </div>
    </div>,
    document.body
  );
}
