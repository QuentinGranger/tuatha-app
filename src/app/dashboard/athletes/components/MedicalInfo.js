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
        <h4>Informations Générales</h4>
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
        <h4>Allergies</h4>
        <ul className={styles.list}>
          {medicalData.general.allergies.map((allergy, index) => (
            <li key={index} className={styles.listItem}>{allergy}</li>
          ))}
        </ul>
      </div>
      
      <div className={styles.infoCard}>
        <h4>Conditions Chroniques</h4>
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
              {new Date(event.date).toLocaleDateString('fr-FR')}
            </div>
            <div className={styles.timelineDot}></div>
            <div className={styles.timelineContent}>
              <h4 className={styles.eventTitle}>{event.type}</h4>
              <div className={styles.eventProvider}>{event.provider}</div>
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
          <i className="fas fa-user-md"></i>
          Général
        </button>
        <button 
          className={`${styles.tabButton} ${activeSection === 'measurements' ? styles.active : ''}`}
          onClick={() => setActiveSection('measurements')}
        >
          <i className="fas fa-weight"></i>
          Mesures
        </button>
        <button 
          className={`${styles.tabButton} ${activeSection === 'history' ? styles.active : ''}`}
          onClick={() => setActiveSection('history')}
        >
          <i className="fas fa-history"></i>
          Historique
        </button>
      </div>
      
      <div className={styles.sectionContent}>
        {renderActiveSection()}
      </div>
    </div>
  );
}
