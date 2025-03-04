'use client';

import Image from 'next/image';
import { useState } from 'react';
import styles from './PatientHeader.module.css';

export default function PatientHeader({ patient }) {
  const [showContact, setShowContact] = useState(false);
  
  if (!patient) {
    return null;
  }

  const formatLastConsultationDate = (date) => {
    if (!date) return 'Aucune consultation';
    
    const consultationDate = new Date(date);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(consultationDate);
  };

  const lastConsultationDate = patient.lastConsultation 
    ? formatLastConsultationDate(patient.lastConsultation)
    : 'Aucune consultation';

  const handleShareClick = () => {
    alert('Fonctionnalité de partage à implémenter');
  };

  const handleMessageClick = () => {
    alert('Fonctionnalité de messagerie à implémenter');
  };

  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerMain}>
        <div className={styles.patientInfo}>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatar}>
              <Image
                src={patient.photo || '/placeholder-avatar.png'}
                alt={`Photo de ${patient.firstName} ${patient.lastName}`}
                width={80}
                height={80}
                className={styles.avatarImage}
              />
              <span className={styles.status}></span>
            </div>
          </div>
          
          <div className={styles.details}>
            <div className={styles.name}>
              <h1>{patient.firstName} {patient.lastName}</h1>
              {patient.isVIP && <span className={styles.vipBadge}>VIP</span>}
            </div>
            
            <div className={styles.basicInfo}>
              <span className={styles.infoItem}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF8800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                {patient.age || 'Non renseigné'} ans
              </span>
              <span className={styles.infoItem}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF8800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                {patient.gender || 'Non renseigné'}
              </span>
              <span 
                className={styles.infoItem} 
                onClick={() => setShowContact(!showContact)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF8800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                Contact
                {showContact && (
                  <div className={styles.contactPopup}>
                    <p className={styles.contactItem}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF8800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      <span>{patient.phone || 'Non renseigné'}</span>
                    </p>
                    <p className={styles.contactItem}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF8800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                      <span>{patient.email || 'Non renseigné'}</span>
                    </p>
                    <p className={styles.contactItem}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF8800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span>{patient.address || 'Non renseignée'}</span>
                    </p>
                  </div>
                )}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.headerSecondary}>
          <div className={styles.infoCards}>
            <div className={styles.infoCard}>
              <div className={styles.infoCardLabel}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF8800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 20V10"></path>
                  <path d="M12 20V4"></path>
                  <path d="M6 20v-6"></path>
                </svg>
                Objectif
              </div>
              <div className={styles.infoCardValue}>
                {patient.goal || 'Objectif non défini'}
              </div>
            </div>
            
            <div className={styles.infoCard}>
              <div className={styles.infoCardLabel}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF8800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
                Dernière consultation
              </div>
              <div className={styles.infoCardValue}>
                {lastConsultationDate}
              </div>
            </div>
          </div>
          
          <div className={styles.actions}>
            <button className={styles.actionButton} onClick={handleShareClick} title="Partager">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF8800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
            </button>
            <button className={styles.actionButton} onClick={handleMessageClick} title="Message">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF8800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
            <button className={styles.actionButton} title="Rapport">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF8800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
