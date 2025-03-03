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
    
    // On suppose que la date est un string ISO ou un objet Date
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
    // Logique pour partager le dossier patient
    alert('Fonctionnalité de partage à implémenter');
  };

  const handleMessageClick = () => {
    // Logique pour envoyer un message
    alert('Fonctionnalité de messagerie à implémenter');
  };

  return (
    <div className={styles.header}>
      <div className={styles.patientInfo}>
        <div className={styles.avatar}>
          <Image
            src={patient.photo || '/placeholder-avatar.png'}
            alt={`Photo de ${patient.firstName} ${patient.lastName}`}
            width={90}
            height={90}
            className={styles.avatarImage}
          />
          <span className={styles.status}></span>
        </div>
        
        <div className={styles.details}>
          <div className={styles.name}>
            <h1>{patient.firstName} {patient.lastName}</h1>
            {patient.isVIP && <span className={styles.vipBadge}>VIP</span>}
          </div>
          
          <div className={styles.basicInfo}>
            <span className={styles.infoItem}>
              <i className="fas fa-birthday-cake"></i> {patient.age || 'Non renseigné'} ans
            </span>
            <span className={styles.infoItem}>
              <i className="fas fa-venus-mars"></i> {patient.gender || 'Non renseigné'}
            </span>
            <span className={styles.infoItem} onClick={() => setShowContact(!showContact)}>
              <i className="fas fa-phone-alt"></i> Contact
              {showContact && (
                <div className={styles.contactPopup}>
                  <p><strong>Tél:</strong> {patient.phone || 'Non renseigné'}</p>
                  <p><strong>Email:</strong> {patient.email || 'Non renseigné'}</p>
                  <p><strong>Adresse:</strong> {patient.address || 'Non renseignée'}</p>
                </div>
              )}
            </span>
          </div>
        </div>
      </div>
      
      <div className={styles.nutritionGoal}>
        <div className={styles.goalLabel}>Objectif nutritionnel</div>
        <div className={styles.goalValue}>{patient.goal || 'Objectif non défini'}</div>
      </div>
      
      <div className={styles.actions}>
        <button className={styles.actionButton} onClick={handleShareClick}>
          <i className="fas fa-share-alt"></i>
          <span>Partager</span>
        </button>
        <button className={styles.actionButton} onClick={handleMessageClick}>
          <i className="fas fa-comment-dots"></i>
          <span>Message</span>
        </button>
        <button className={styles.actionButton}>
          <i className="fas fa-file-medical"></i>
          <span>Rapport</span>
        </button>
      </div>
      
      <div className={styles.lastConsultation}>
        <div className={styles.consultationLabel}>Dernière consultation</div>
        <div className={styles.consultationDate}>{lastConsultationDate}</div>
      </div>
    </div>
  );
}
