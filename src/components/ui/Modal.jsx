"use client";

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { IoMdClose } from 'react-icons/io';
import styles from './modal.module.css';

const Modal = ({ isOpen, onClose, title, children, size = 'medium' }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      // Empêche le défilement lorsque la modale est ouverte
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      // Réactive le défilement lorsque la modale est fermée
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Création du contenu de la modale
  const modalContent = (
    <div className={styles.modalOverlay} aria-modal="true" role="dialog">
      <div 
        ref={modalRef} 
        className={`${styles.modalContainer} ${styles[size]}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2>{title}</h2>
          <button 
            className={styles.closeButton} 
            onClick={onClose}
            aria-label="Fermer"
          >
            <IoMdClose size={24} />
          </button>
        </div>
        <div className={styles.modalContent}>
          {children}
        </div>
      </div>
    </div>
  );

  // Utiliser createPortal pour rendre la modale directement dans le body
  return typeof document !== 'undefined' 
    ? createPortal(modalContent, document.body) 
    : null;
};

export default Modal;
