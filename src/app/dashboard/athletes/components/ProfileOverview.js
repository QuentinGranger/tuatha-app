'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './ProfileOverview.module.css';

const StatusIndicator = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'good': return styles.statusGood;
      case 'warning': return styles.statusWarning;
      case 'critical': return styles.statusCritical;
      default: return '';
    }
  };

  return <div className={`${styles.status} ${getStatusColor()}`} />;
};

export default function ProfileOverview({ athlete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleContact = () => {
    // TODO: Implémenter la fonctionnalité de contact
  };

  return (
    <div className={styles.overview}>
      <div className={styles.header}>
        <div className={styles.profile}>
          <div className={styles.avatar}>
            <Image
              src={athlete?.photoUrl || '/placeholder-avatar.png'}
              alt={athlete?.name || 'Photo de profil'}
              width={80}
              height={80}
            />
          </div>
          <div className={styles.info}>
            <h2 className={styles.name}>{athlete?.name || 'Sélectionnez un athlète'}</h2>
            <p className={styles.sport}>{athlete?.sport || '-'}</p>
          </div>
        </div>
        <div className={styles.actions}>
          <button 
            className={`${styles.button} ${styles.edit}`}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Enregistrer' : 'Modifier'}
          </button>
          <button 
            className={`${styles.button} ${styles.contact}`}
            onClick={handleContact}
          >
            Contacter
          </button>
        </div>
      </div>

      <div className={styles.details}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>État Actuel</h3>
          <div className={styles.grid}>
            <div className={styles.item}>
              <span className={styles.label}>Blessure</span>
              <span className={styles.value}>{athlete?.injury || '-'}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.label}>État Nutritionnel</span>
              <div className={styles.statusWrapper}>
                <span className={styles.value}>Bon</span>
                <StatusIndicator status="good" />
              </div>
            </div>
            <div className={styles.item}>
              <span className={styles.label}>Dernier Suivi</span>
              <span className={styles.value}>{athlete?.lastCheckup || '-'}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.label}>Prochain RDV</span>
              <span className={styles.value}>{athlete?.nextAppointment || '-'}</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Notes Importantes</h3>
          <div className={styles.notes}>
            {athlete?.notes?.map((note, index) => (
              <div key={index} className={styles.note}>
                <span className={styles.noteLabel}>{note.type}</span>
                <span className={styles.noteValue}>{note.content}</span>
              </div>
            )) || 'Aucune note'}
          </div>
        </div>
      </div>
    </div>
  );
}
