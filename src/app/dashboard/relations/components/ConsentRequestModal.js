'use client';

import React, { useEffect } from 'react';
import styles from './ConsentBlockModal.module.css';

export default function ConsentRequestModal({ patient, onClose }) {
  // Bloquer le scroll du contenu quand la modale est ouverte
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Fermer la modale après 3 secondes
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={`${styles.modalHeader} ${styles.successHeader}`}>
          <svg className={styles.successIcon} width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM12 20C16.418 20 20 16.418 20 12C20 7.582 16.418 4 12 4C7.582 4 4 7.582 4 12C4 16.418 7.582 20 12 20ZM11.003 16L6.76 11.757L8.174 10.343L11.003 13.172L16.659 7.515L18.074 8.929L11.003 16Z" fill="white"/>
          </svg>
          <h2>Demande Envoyée</h2>
        </div>
        
        <div className={styles.modalContent}>
          <div className={styles.successMessage}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.emailIcon}>
              <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V8L12 13L20 8V18ZM12 11L4 6H20L12 11Z" fill="#4CAF50"/>
            </svg>
            <p className={styles.successTitle}>
              Demande de consentement envoyée !
            </p>
            <p className={styles.patientName}>
              {patient?.user?.firstName} {patient?.user?.lastName}
            </p>
            <p className={styles.successSubtitle}>
              Le patient sera notifié et pourra donner son consentement via l'application patient.
            </p>
            <div className={styles.progressContainer}>
              <div className={styles.progressBar}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
