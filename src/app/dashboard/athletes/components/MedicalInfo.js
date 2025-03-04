'use client';

import { useState } from 'react';
import styles from './MedicalInfo.module.css';

export default function MedicalInfo({ patient }) {
  const [activeSection, setActiveSection] = useState('general');
  
  if (!patient) {
    return <div className={styles.emptyState}>Veuillez sélectionner un patient</div>;
  }
  
  const medicalData = patient.medical || {
    general: {
      height: 180,
      weight: 75,
      allergies: ['Aucune allergie connue'],
      bloodType: 'O+',
      chronicConditions: ['Aucune maladie chronique connue'],
    },
    measurements: {
      lastUpdated: '2023-12-15',
      bmi: 23.1,
      bodyFat: 18,
      muscleMass: 42,
      boneMass: 3.2,
      visceralFat: 7,
      metabolicAge: 28,
    },
    history: [
      {
        date: '2023-11-10',
        type: 'Bilan Initial',
        provider: 'Dr. Martin',
        notes: 'Bilan de santé général excellent. Recommandation de suivi nutritionnel pour optimisation des performances sportives.',
      },
      {
        date: '2023-12-15',
        type: 'Suivi Nutritionnel',
        provider: 'Mme Dubois (Nutritionniste)',
        notes: 'Ajustement du plan alimentaire. Amélioration de l\'hydratation recommandée.',
      }
    ]
  };
  
  const renderGeneralInfo = () => (
    <div className={styles.infoGrid}>
      <div className={styles.infoCard}>
        <h4>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.cardIcon}>
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 6C13.93 6 15.5 7.57 15.5 9.5C15.5 11.43 13.93 13 12 13C10.07 13 8.5 11.43 8.5 9.5C8.5 7.57 10.07 6 12 6ZM12 20C9.97 20 8.1 19.33 6.66 18.12C6.23 17.78 5.96 17.28 5.96 16.76C5.96 14.08 8.29 12 12 12C15.71 12 18.04 14.08 18.04 16.76C18.04 17.28 17.77 17.78 17.34 18.12C15.9 19.33 14.03 20 12 20Z" fill="#FF8800"/>
          </svg>
          Informations Générales
        </h4>
        <div className={styles.infoItem}>
          <span className={styles.label}>Taille</span>
          <span className={styles.value}>{medicalData.general.height} cm</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Poids</span>
          <span className={styles.value}>{medicalData.general.weight} kg</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Groupe Sanguin</span>
          <span className={styles.value}>{medicalData.general.bloodType}</span>
        </div>
      </div>
      
      <div className={styles.infoCard}>
        <h4>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.cardIcon}>
            <path d="M10.5 15H8V12H4V9.5H8V6.5H10.5V9.5H13.5V12H10.5V15ZM13 7H7V9H13V7ZM7 15H13V17H7V15ZM17 7V9H15V7H17ZM15 13H17V15H15V13ZM17 11V13H15V11H17ZM21 3H3C1.9 3 1 3.9 1 5V19C1 20.1 1.9 21 3 21H21C22.1 21 23 20.1 23 19V5C23 3.9 22.1 3 21 3ZM21 19H3V5H21V19Z" fill="#FF8800"/>
            <path d="M17 22H3C2.45 22 2 21.55 2 21V7C2 6.45 2.45 6 3 6H7V7.5H4V20.5H16V17H17.5V21C17.5 21.55 17.05 22 16.5 22L17 22Z" fill="#FF8800"/>
          </svg>
          Allergies
        </h4>
        <ul className={styles.list}>
          {medicalData.general.allergies.map((allergy, index) => (
            <li key={index} className={styles.listItem}>{allergy}</li>
          ))}
        </ul>
      </div>
      
      <div className={styles.infoCard}>
        <h4>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.cardIcon}>
            <path d="M8 3V5H4C2.9 5 2 5.9 2 7V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V7C22 5.9 21.1 5 20 5H16V3H8ZM16 7V5H20V7H16ZM4 7H14V5H16V7H20V9H4V7ZM4 11H20V19H4V11ZM9 13V17H11V13H9ZM13 13V17H15V13H13Z" fill="#FF8800"/>
          </svg>
          Conditions Chroniques
        </h4>
        <ul className={styles.list}>
          {medicalData.general.chronicConditions.map((condition, index) => (
            <li key={index} className={styles.listItem}>{condition}</li>
          ))}
        </ul>
      </div>
    </div>
  );
  
  const renderMeasurements = () => (
    <div className={styles.measurementsContainer}>
      <div className={styles.lastUpdated}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.inlineIcon}>
          <path d="M13 11H7V13H13V11ZM13 7H7V9H13V7ZM7 15H13V17H7V15ZM17 7V9H15V7H17ZM15 13H17V15H15V13ZM17 11V13H15V11H17ZM21 3H3C1.9 3 1 3.9 1 5V19C1 20.1 1.9 21 3 21H21C22.1 21 23 20.1 23 19V5C23 3.9 22.1 3 21 3ZM21 19H3V5H21V19Z" fill="#FF8800"/>
        </svg>
        Dernière mise à jour: {new Date(medicalData.measurements.lastUpdated).toLocaleDateString('fr-FR')}
      </div>
      
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>{medicalData.measurements.bmi}</div>
          <div className={styles.metricLabel}>IMC</div>
          <div className={styles.metricInterpretation}>
            {medicalData.measurements.bmi < 18.5 ? 'Insuffisance pondérale' :
             medicalData.measurements.bmi < 25 ? 'Poids normal' :
             medicalData.measurements.bmi < 30 ? 'Surpoids' : 'Obésité'}
          </div>
        </div>
        
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>{medicalData.measurements.bodyFat}%</div>
          <div className={styles.metricLabel}>Masse Grasse</div>
        </div>
        
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>{medicalData.measurements.muscleMass}%</div>
          <div className={styles.metricLabel}>Masse Musculaire</div>
        </div>
        
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>{medicalData.measurements.boneMass} kg</div>
          <div className={styles.metricLabel}>Masse Osseuse</div>
        </div>
        
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>{medicalData.measurements.visceralFat}</div>
          <div className={styles.metricLabel}>Graisse Viscérale</div>
        </div>
        
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>{medicalData.measurements.metabolicAge} ans</div>
          <div className={styles.metricLabel}>Âge Métabolique</div>
        </div>
      </div>
    </div>
  );
  
  const renderHistory = () => (
    <div className={styles.historyContainer}>
      <div className={styles.timeline}>
        {medicalData.history.map((event, index) => (
          <div key={index} className={styles.timelineEvent}>
            <div className={styles.timelineDate}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.inlineIcon}>
                <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H12V15H7V10Z" fill="#FF8800"/>
              </svg>
              {new Date(event.date).toLocaleDateString('fr-FR')}
            </div>
            <div className={styles.timelineDot}></div>
            <div className={styles.timelineContent}>
              <h4 className={styles.eventTitle}>{event.type}</h4>
              <div className={styles.eventProvider}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.inlineIcon}>
                  <path d="M17.5 4.5C15.8 4.5 14.4 5.8 14.3 7.5H14C13.7 7.5 13.5 7.7 13.5 8C13.5 8.3 13.7 8.5 14 8.5H14.3C14.5 10.2 15.8 11.5 17.5 11.5C19.4 11.5 21 9.9 21 8C21 6.1 19.4 4.5 17.5 4.5ZM17.5 10.5C16.4 10.5 15.5 9.6 15.5 8.5C15.5 7.4 16.4 6.5 17.5 6.5C18.6 6.5 19.5 7.4 19.5 8.5C19.5 9.6 18.6 10.5 17.5 10.5ZM13.1 11.5H10.9L10.3 10H14C14.3 10 14.5 9.8 14.5 9.5C14.5 9.2 14.3 9 14 9H9.4L9.2 8H13C13.3 8 13.5 7.8 13.5 7.5C13.5 7.2 13.3 7 13 7H8.9L8.6 4.8C8.5 4.3 8.1 4 7.6 4H5.8C5.4 4 5 4.4 5 4.8C5 5.2 5.4 5.5 5.8 5.5H6.8L9.2 14.2C9.3 14.7 9.7 15 10.2 15H13.8C14.3 15 14.7 14.7 14.8 14.2L15.4 12.4C15.4 12.2 15.3 12.1 15.2 12C15 11.6 14.7 11.5 14.3 11.5H13.1Z" fill="#FF8800"/>
                  <path d="M14.5 18C14.5 19.1 13.6 20 12.5 20C11.4 20 10.5 19.1 10.5 18C10.5 16.9 11.4 16 12.5 16C13.6 16 14.5 16.9 14.5 18Z" fill="#FF8800"/>
                  <path d="M9.5 18C9.5 19.1 8.6 20 7.5 20C6.4 20 5.5 19.1 5.5 18C5.5 16.9 6.4 16 7.5 16C8.6 16 9.5 16.9 9.5 18Z" fill="#FF8800"/>
                </svg>
                {event.provider}
              </div>
              <p className={styles.eventNotes}>{event.notes}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralInfo();
      case 'measurements':
        return renderMeasurements();
      case 'history':
        return renderHistory();
      default:
        return renderGeneralInfo();
    }
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.sectionTabs}>
        <button 
          className={`${styles.tabButton} ${activeSection === 'general' ? styles.active : ''}`}
          onClick={() => setActiveSection('general')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 6C13.1 6 14 6.9 14 8C14 9.1 13.1 10 12 10C10.9 10 10 9.1 10 8C10 6.9 10.9 6 12 6ZM12 13C9.33 13 4 14.34 4 17V20H20V17C20 14.34 14.67 13 12 13ZM18 18H6V17.01C6.2 16.29 9.3 15 12 15C14.7 15 17.8 16.29 18 17V18Z" fill="#FF8800"/>
          </svg>
          Général
        </button>
        <button 
          className={`${styles.tabButton} ${activeSection === 'measurements' ? styles.active : ''}`}
          onClick={() => setActiveSection('measurements')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM5 19V5H19V19H5ZM7 10H9V17H7V10ZM11 7H13V17H11V7ZM15 13H17V17H15V13Z" fill="#FF8800"/>
          </svg>
          Mesures
        </button>
        <button 
          className={`${styles.tabButton} ${activeSection === 'history' ? styles.active : ''}`}
          onClick={() => setActiveSection('history')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 3C8.03 3 4 7.03 4 12H1L4.89 15.89L4.96 16.03L9 12H6C6 8.13 9.13 5 13 5C16.87 5 20 8.13 20 12C20 15.87 16.87 19 13 19C11.07 19 9.32 18.21 8.06 16.94L6.64 18.36C8.27 19.99 10.51 21 13 21C17.97 21 22 16.97 22 12C22 7.03 17.97 3 13 3ZM12 8V13L16.28 15.54L17 14.33L13.5 12.25V8H12Z" fill="#FF8800"/>
          </svg>
          Historique
        </button>
      </div>
      
      <div className={styles.sectionContent}>
        {renderActiveSection()}
      </div>
    </div>
  );
}
