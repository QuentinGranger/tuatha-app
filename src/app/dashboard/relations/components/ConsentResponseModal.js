'use client';

import React, { useEffect } from 'react';
import styles from './ConsentBlockModal.module.css';

export default function ConsentResponseModal({ patient, responseType = 'accept', onClose }) {
  // Fermer automatiquement après 4 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Fermer la modale après 4 secondes
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={`${styles.modalHeader} ${responseType === 'accept' ? styles.successHeader : styles.declineHeader}`}>
          <svg className={styles.successIcon} width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {responseType === 'accept' ? (
              <path d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM12 20C16.418 20 20 16.418 20 12C20 7.582 16.418 4 12 4C7.582 4 4 7.582 4 12C4 16.418 7.582 20 12 20ZM11.003 16L6.76 11.757L8.174 10.343L11.003 13.172L16.659 7.515L18.074 8.929L11.003 16Z" fill="white"/>
            ) : (
              <path d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM12 20C16.418 20 20 16.418 20 12C20 7.582 16.418 4 12 4C7.582 4 4 7.582 4 12C4 16.418 7.582 20 12 20ZM13.414 12L16.243 9.172L14.828 7.757L12 10.586L9.172 7.757L7.757 9.172L10.586 12L7.757 14.828L9.172 16.243L12 13.414L14.828 16.243L16.243 14.828L13.414 12Z" fill="white"/>
            )}
          </svg>
          <h2>{responseType === 'accept' ? 'Consentement Accordé' : 'Consentement Refusé'}</h2>
        </div>
        
        <div className={styles.modalContent}>
          <div className={styles.successMessage}>
            {responseType === 'accept' ? (
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.emailIcon}>
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="#4CAF50"/>
              </svg>
            ) : (
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.emailIcon}>
                <path d="M12 2C6.47 2 2 6.47 2 12C2 17.53 6.47 22 12 22C17.53 22 22 17.53 22 12C22 6.47 17.53 2 12 2ZM16.3 16.3C15.91 16.69 15.28 16.69 14.89 16.3L12 13.41L9.11 16.3C8.72 16.69 8.09 16.69 7.7 16.3C7.31 15.91 7.31 15.28 7.7 14.89L10.59 12L7.7 9.11C7.31 8.72 7.31 8.09 7.7 7.7C8.09 7.31 8.72 7.31 9.11 7.7L12 10.59L14.89 7.7C15.28 7.31 15.91 7.31 16.3 7.7C16.69 8.09 16.69 8.72 16.3 9.11L13.41 12L16.3 14.89C16.68 15.27 16.68 15.91 16.3 16.3Z" fill="#F44336"/>
              </svg>
            )}
            <p className={responseType === 'accept' ? styles.successTitle : styles.declineTitle}>
              {responseType === 'accept' ? 'Consentement accordé par le patient' : 'Consentement refusé par le patient'}
            </p>
            <p className={styles.patientName}>
              {patient?.user?.firstName} {patient?.user?.lastName}
            </p>
            <p className={styles.successSubtitle}>
              {responseType === 'accept' 
                ? 'Vous pouvez maintenant accéder aux données de ce patient.' 
                : 'Vous ne pouvez pas accéder aux données de ce patient pour le moment.'}
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
