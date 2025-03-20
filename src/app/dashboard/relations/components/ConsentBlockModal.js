'use client';

import React from 'react';
import Image from 'next/image';
import styles from './ConsentBlockModal.module.css';

export default function ConsentBlockModal({ patient, onRequestConsent, onClose }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <svg className={styles.warningIcon} width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM12 20C16.418 20 20 16.418 20 12C20 7.582 16.418 4 12 4C7.582 4 4 7.582 4 12C4 16.418 7.582 20 12 20ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z" fill="white"/>
          </svg>
          <h2>Consentement requis</h2>
        </div>
        
        <div className={styles.modalContent}>
          <div className={styles.patientInfo}>
            <div className={styles.patientAvatar}>
              {patient?.user?.photoUrl ? (
                <Image
                  src={patient.user.photoUrl}
                  alt={`Photo de ${patient.user?.firstName} ${patient.user?.lastName}`}
                  width={80}
                  height={80}
                  className={styles.avatarImage}
                />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {patient.user?.firstName?.charAt(0)}{patient.user?.lastName?.charAt(0)}
                </div>
              )}
            </div>
            <div className={styles.patientName}>
              {patient?.user?.firstName} {patient?.user?.lastName}
            </div>
            <div className={styles.patientDetail}>
              {patient?.sport || 'Sport non spécifié'}
            </div>
          </div>
          
          <div className={styles.divider}></div>
          
          <div className={styles.messageBox}>
            <svg className={styles.lockIcon} width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 10H17V7C17 4.24 14.76 2 12 2C9.24 2 7 4.24 7 7V10H5C3.9 10 3 10.9 3 12V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V12C21 10.9 20.1 10 19 10ZM9 7C9 5.34 10.34 4 12 4C13.66 4 15 5.34 15 7V10H9V7ZM19 20H5V12H19V20ZM12 17C13.1 17 14 16.1 14 15C14 13.9 13.1 13 12 13C10.9 13 10 13.9 10 15C10 16.1 10.9 17 12 17Z" fill="#E74C3C"/>
            </svg>
            <p>
              <strong>L'accès aux données de ce patient est restreint.</strong>
            </p>
            <p>
              Le patient n'a pas encore donné son consentement pour le partage de ses données 
              personnelles et de santé tel que requis par le RGPD (GDPR).
            </p>
          </div>
          
          <div className={styles.infoBox}>
            <svg className={styles.shieldIcon} width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM19 11C19 15.52 16.02 19.69 12 20.93C7.98 19.69 5 15.52 5 11V6.3L12 3.19L19 6.3V11ZM7.7 13.7L11 17L16.3 11.7L14.9 10.3L11 14.2L9.1 12.3L7.7 13.7Z" fill="#3498DB"/>
            </svg>
            <div>
              <p><strong>Conformité RGPD (GDPR)</strong></p>
              <p>
                Vous ne pouvez accéder aux informations détaillées de ce patient qu'après avoir 
                obtenu son consentement explicite pour le traitement de ses données personnelles.
              </p>
            </div>
          </div>
        </div>
        
        <div className={styles.modalActions}>
          <button 
            className={styles.secondaryButton} 
            onClick={onClose}
          >
            Retour
          </button>
          <button 
            className={styles.primaryButton} 
            onClick={onRequestConsent}
          >
            Demander le consentement
          </button>
        </div>
      </div>
    </div>
  );
}
