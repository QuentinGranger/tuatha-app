'use client';

import { useState } from 'react';
import styles from './styles.module.css';

export default function IndicatorsTracking({ athlete }) {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  if (!athlete) {
    return (
      <div className={styles.empty}>
        Sélectionnez un athlète pour voir ses indicateurs
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.periods}>
          <button
            className={`${styles.periodButton} ${selectedPeriod === 'week' ? styles.active : ''}`}
            onClick={() => setSelectedPeriod('week')}
          >
            Semaine
          </button>
          <button
            className={`${styles.periodButton} ${selectedPeriod === 'month' ? styles.active : ''}`}
            onClick={() => setSelectedPeriod('month')}
          >
            Mois
          </button>
          <button
            className={`${styles.periodButton} ${selectedPeriod === 'year' ? styles.active : ''}`}
            onClick={() => setSelectedPeriod('year')}
          >
            Année
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Composition Corporelle</h3>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.label}>Poids</span>
              <span className={styles.value}>{athlete.weight} kg</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.label}>% Graisse</span>
              <span className={styles.value}>{athlete.bodyFat}%</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.label}>Masse Musculaire</span>
              <span className={styles.value}>{athlete.muscleMass} kg</span>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Performances Cardio</h3>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.label}>FC Repos</span>
              <span className={styles.value}>{athlete.restingHeartRate} bpm</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.label}>FC Max</span>
              <span className={styles.value}>{athlete.maxHeartRate} bpm</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.label}>VO2 Max</span>
              <span className={styles.value}>{athlete.vo2max} ml/kg/min</span>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Scores de Performance</h3>
          <div className={styles.scores}>
            <div className={styles.score}>
              <div className={styles.scoreBar} style={{ width: `${athlete.strengthScore}%` }}>
                <span className={styles.scoreLabel}>Force</span>
                <span className={styles.scoreValue}>{athlete.strengthScore}</span>
              </div>
            </div>
            <div className={styles.score}>
              <div className={styles.scoreBar} style={{ width: `${athlete.enduranceScore}%` }}>
                <span className={styles.scoreLabel}>Endurance</span>
                <span className={styles.scoreValue}>{athlete.enduranceScore}</span>
              </div>
            </div>
            <div className={styles.score}>
              <div className={styles.scoreBar} style={{ width: `${athlete.flexibilityScore}%` }}>
                <span className={styles.scoreLabel}>Flexibilité</span>
                <span className={styles.scoreValue}>{athlete.flexibilityScore}</span>
              </div>
            </div>
            <div className={styles.score}>
              <div className={styles.scoreBar} style={{ width: `${athlete.recoveryScore}%` }}>
                <span className={styles.scoreLabel}>Récupération</span>
                <span className={styles.scoreValue}>{athlete.recoveryScore}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Bien-être</h3>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.label}>Qualité Sommeil</span>
              <span className={styles.value}>{athlete.sleepQuality}%</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.label}>Niveau Stress</span>
              <span className={styles.value}>{athlete.stressLevel}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
