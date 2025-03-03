'use client';

import { useState } from 'react';
import styles from './styles.module.css';

export default function NutritionHistory({ athlete }) {
  const [activeSection, setActiveSection] = useState('current');

  if (!athlete) {
    return (
      <div className={styles.empty}>
        Sélectionnez un athlète pour voir son historique nutritionnel
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.sections}>
          <button
            className={`${styles.sectionButton} ${activeSection === 'current' ? styles.active : ''}`}
            onClick={() => setActiveSection('current')}
          >
            Plan Actuel
          </button>
          <button
            className={`${styles.sectionButton} ${activeSection === 'history' ? styles.active : ''}`}
            onClick={() => setActiveSection('history')}
          >
            Historique
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {activeSection === 'current' ? (
          <div className={styles.currentPlan}>
            <div className={styles.nutritionStats}>
              <div className={styles.stat}>
                <span className={styles.label}>Protéines</span>
                <span className={styles.value}>{athlete.proteinIntake}g/kg</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.label}>Glucides</span>
                <span className={styles.value}>{athlete.carbIntake}g/kg</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.label}>Lipides</span>
                <span className={styles.value}>{athlete.fatIntake}g/kg</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.label}>Hydratation</span>
                <span className={styles.value}>{athlete.hydration}L</span>
              </div>
            </div>

            <div className={styles.alerts}>
              <h3 className={styles.alertsTitle}>Alertes & Recommandations</h3>
              {athlete.alerts?.deficiencies?.map((deficiency, index) => (
                <div key={index} className={styles.alert}>
                  <div className={styles.alertHeader}>
                    <span className={styles.alertType}>{deficiency.type}</span>
                    <span className={`${styles.alertLevel} ${styles[deficiency.level.toLowerCase()]}`}>
                      {deficiency.level}
                    </span>
                  </div>
                  <p className={styles.alertMessage}>{deficiency.message}</p>
                  <p className={styles.alertRecommendation}>{deficiency.recommendations}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.history}>
            <div className={styles.timeline}>
              {/* TODO: Ajouter l'historique des plans nutritionnels */}
              <p className={styles.placeholder}>
                L'historique des plans nutritionnels sera affiché ici
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
