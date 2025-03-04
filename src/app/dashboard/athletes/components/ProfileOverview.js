'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './ProfileOverview.module.css';

export default function ProfileOverview({ athlete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleContact = () => {
    // TODO: Implémenter la fonctionnalité de contact
  };

  return (
    <div className={styles.overview}>
      {/* En-tête avec avatar, nom et boutons d'action */}
      <div className={styles.header}>
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

      {/* Section d'état de santé */}
      <h3 className={styles.sectionTitle}>État Actuel</h3>
      <div className={styles.grid}>
        <div className={styles.item}>
          <span className={styles.label}>Blessure</span>
          <span className={styles.value}>{athlete?.injury || '-'}</span>
        </div>
        
        <div className={styles.item}>
          <span className={styles.label}>État Nutritionnel</span>
          <div className={styles.statusValue}>
            <span>Bon</span>
            <span className={`${styles.status} ${styles.statusGood}`} />
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

      {/* Section notes */}
      <h3 className={styles.sectionTitle}>Notes Importantes</h3>
      <div className={styles.notes}>
        {athlete?.notes ? (
          athlete.notes.map((note, index) => (
            <div key={index} className={styles.note}>
              <span className={styles.noteLabel}>{note.type}</span>
              <span className={styles.noteValue}>{note.content}</span>
            </div>
          ))
        ) : (
          <div className={styles.emptyNotes}>Aucune note</div>
        )}
      </div>
    </div>
  );
}
