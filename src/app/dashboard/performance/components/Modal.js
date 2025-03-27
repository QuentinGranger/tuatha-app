'use client';

import React, { useEffect, useRef } from 'react';
import { IoMdClose } from 'react-icons/io';
import styles from './Modal.module.css';
import Portal from '../../../dashboard/components/Portal';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer, 
  size = 'medium',
  danger = false
}) => {
  const modalRef = useRef(null);
  
  // Ferme le modal quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Bloquer le scroll du body quand le modal est ouvert
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'visible';
    };
  }, [isOpen, onClose]);
  
  // Permet de fermer avec la touche Escape
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  // Déterminer la classe de taille
  const sizeClass = size === 'large' ? styles.modalLarge : 
                    size === 'small' ? styles.modalSmall : '';
  
  // Contenu de la modale
  const modalContent = (
    <div className={`${styles.modalOverlay} ${isOpen ? styles.open : ''}`} 
         aria-hidden={!isOpen}
         role="presentation">
      <div 
        ref={modalRef}
        className={`${styles.modal} ${sizeClass} ${danger ? styles.dangerModal : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className={styles.modalHeader}>
          <h3 id="modal-title" className={styles.modalTitle}>
            {title}
            <span className={styles.modalGlow}></span>
          </h3>
          <button 
            className={styles.closeButton} 
            onClick={onClose}
            aria-label="Fermer"
          >
            <IoMdClose />
          </button>
        </div>
        
        <div className={styles.modalBody}>
          {children}
        </div>
        
        {footer && (
          <div className={styles.modalFooter}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
  
  // Rendu avec Portal
  return <Portal rootId="modal-root">{modalContent}</Portal>;
};

export const ModalButton = ({ 
  children, 
  onClick, 
  variant = 'primary',
  disabled = false,
  type = 'button',
  icon
}) => {
  const getButtonClass = () => {
    switch (variant) {
      case 'cancel':
        return styles.cancelButton;
      case 'danger':
        return styles.dangerButton;
      case 'confirm':
      default:
        return styles.confirmButton;
    }
  };
  
  return (
    <button
      type={type}
      className={`${styles.button} ${getButtonClass()}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className={styles.buttonIcon}>{icon}</span>}
      {children}
    </button>
  );
};

export default Modal;
