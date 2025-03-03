'use client';

import { useState, useEffect } from 'react';
import styles from './styles.module.css';

const StatusIndicator = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'GOOD': return styles.statusGood;
      case 'AVERAGE': return styles.statusWarning;
      case 'CRITICAL': return styles.statusCritical;
      default: return styles.statusWarning;
    }
  };

  return <div className={`${styles.status} ${getStatusColor()}`} />;
};

// Fonction d'aide pour construire l'URL de l'image
const getImageUrl = (photoUrl) => {
  if (!photoUrl) return '/img/patient/default-avatar.jpg';
  
  // Si l'URL commence par /img, c'est une image locale dans public
  if (photoUrl.startsWith('/img')) {
    return photoUrl;
  }
  
  // Si l'URL est un nom de fichier sans chemin, on suppose qu'il s'agit d'un athlète
  if (!photoUrl.includes('/')) {
    return `/img/patient/${photoUrl}`;
  }
  
  return photoUrl;
};

export default function ProfileOverview({ athlete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (athlete?.user) {
      console.log('ProfileOverview - athlete:', athlete);
      console.log('ProfileOverview - athlete.user:', athlete.user);
      console.log('ProfileOverview - firstName:', athlete.user.firstName);
      console.log('ProfileOverview - lastName:', athlete.user.lastName);
      console.log('ProfileOverview - photoUrl:', athlete.user.photoUrl);
    }
  }, [athlete]);

  if (!athlete?.user) {
    console.log('ProfileOverview - No athlete or athlete.user');
    return (
      <div className={styles.empty}>
        Sélectionnez un patient pour voir son profil
      </div>
    );
  }

  const handleContact = () => {
    if (athlete.user.phoneNumber) {
      window.location.href = `tel:${athlete.user.phoneNumber}`;
    } else if (athlete.user.email) {
      window.location.href = `mailto:${athlete.user.email}`;
    }
  };

  // Utiliser la fonction d'aide pour obtenir l'URL de l'image
  const photoUrl = getImageUrl(athlete.user.photoUrl);

  console.log('ProfileOverview - Rendering with:', {
    firstName: athlete.user.firstName,
    lastName: athlete.user.lastName,
    photoUrl: athlete.user.photoUrl,
    processedPhotoUrl: photoUrl,
    sport: athlete.sport
  });

  const { firstName, lastName } = athlete.user;
  const { 
    sport, 
    injury, 
    nutritionalStatus, 
    progressionStatus, 
    lastAppointment 
  } = athlete;

  return (
    <div className={styles.overview}>
      <div className={styles.header}>
        <div className={styles.profile}>
          <div className={styles.avatar}>
            <img
              src={photoUrl}
              alt={`${firstName} ${lastName}`}
              width={80}
              height={80}
              className={styles.avatarImage}
              onError={(e) => {
                console.error('Error loading image:', e);
                e.target.src = '/img/patient/default-avatar.jpg';
              }}
            />
          </div>
          <div className={styles.info}>
            <h2 className={styles.name}>{firstName} {lastName}</h2>
            <p className={styles.sport}>{sport || '-'}</p>
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
              <span className={styles.value}>{injury || '-'}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.label}>État Nutritionnel</span>
              <div className={styles.statusWrapper}>
                <span className={styles.value}>{nutritionalStatus}</span>
                <StatusIndicator status={nutritionalStatus} />
              </div>
            </div>
            <div className={styles.item}>
              <span className={styles.label}>Dernier Suivi</span>
              <span className={styles.value}>
                {lastAppointment ? new Date(lastAppointment).toLocaleDateString('fr-FR') : '-'}
              </span>
            </div>
            <div className={styles.item}>
              <span className={styles.label}>Progression</span>
              <span className={styles.value}>{progressionStatus}</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Notes Importantes</h3>
          <div className={styles.notes}>
            {athlete.alerts?.deficiencies?.map((note, index) => (
              <div key={index} className={styles.note}>
                <span className={styles.noteLabel}>{note.type}</span>
                <div className={styles.noteContent}>
                  <p className={styles.noteMessage}>{note.message}</p>
                  <p className={styles.noteRecommendation}>{note.recommendations}</p>
                </div>
              </div>
            )) || 'Aucune note'}
          </div>
        </div>
      </div>
    </div>
  );
}
