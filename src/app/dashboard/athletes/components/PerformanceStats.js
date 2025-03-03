'use client';

import { useState } from 'react';
import styles from './PerformanceStats.module.css';

export default function PerformanceStats({ patient }) {
  const [period, setPeriod] = useState('month');
  
  if (!patient) {
    return <div className={styles.emptyState}>Veuillez sélectionner un patient</div>;
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.periodSelector}>
        <button 
          className={`${styles.periodButton} ${period === 'week' ? styles.active : ''}`}
          onClick={() => setPeriod('week')}
        >
          Semaine
        </button>
        <button 
          className={`${styles.periodButton} ${period === 'month' ? styles.active : ''}`}
          onClick={() => setPeriod('month')}
        >
          Mois
        </button>
        <button 
          className={`${styles.periodButton} ${period === '3months' ? styles.active : ''}`}
          onClick={() => setPeriod('3months')}
        >
          3 Mois
        </button>
        <button 
          className={`${styles.periodButton} ${period === 'year' ? styles.active : ''}`}
          onClick={() => setPeriod('year')}
        >
          Année
        </button>
      </div>
      
      <div className={styles.statsGrid}>
        <div className={styles.statsCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <i className={`fas fa-running ${styles.cardIcon}`}></i>
              Activité Physique
            </div>
            <div className={styles.cardDate}>Dernière mise à jour: 01/03/2025</div>
          </div>
          
          <div className={styles.chartContainer}>
            {/* Emplacement pour graphique d'activité */}
            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-light)' }}>
              Graphique d'activité physique
            </div>
          </div>
          
          <div className={styles.statsSummary}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>12.5h</div>
              <div className={styles.statLabel}>Total</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>4</div>
              <div className={styles.statLabel}>Séances</div>
            </div>
            <div className={styles.statItem}>
              <div className={`${styles.statValue} ${styles.positiveChange}`}>+15%</div>
              <div className={styles.statLabel}>vs mois précédent</div>
            </div>
          </div>
        </div>
        
        <div className={styles.statsCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <i className={`fas fa-heartbeat ${styles.cardIcon}`}></i>
              Fréquence Cardiaque
            </div>
            <div className={styles.cardDate}>Dernière mise à jour: 01/03/2025</div>
          </div>
          
          <div className={styles.chartContainer}>
            {/* Emplacement pour graphique de fréquence cardiaque */}
            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-light)' }}>
              Graphique de fréquence cardiaque
            </div>
          </div>
          
          <div className={styles.statsSummary}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>62 bpm</div>
              <div className={styles.statLabel}>Repos</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>145 bpm</div>
              <div className={styles.statLabel}>Moyenne effort</div>
            </div>
            <div className={styles.statItem}>
              <div className={`${styles.statValue} ${styles.negativeChange}`}>+3 bpm</div>
              <div className={styles.statLabel}>vs mois précédent</div>
            </div>
          </div>
        </div>
        
        <div className={styles.statsCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <i className={`fas fa-dumbbell ${styles.cardIcon}`}></i>
              Force & Puissance
            </div>
            <div className={styles.cardDate}>Dernière mise à jour: 25/02/2025</div>
          </div>
          
          <div className={styles.chartContainer}>
            {/* Emplacement pour graphique de force */}
            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-light)' }}>
              Graphique de force et puissance
            </div>
          </div>
          
          <div className={styles.statsSummary}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>85 kg</div>
              <div className={styles.statLabel}>Squat 1RM</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>750 W</div>
              <div className={styles.statLabel}>Puissance max</div>
            </div>
            <div className={styles.statItem}>
              <div className={`${styles.statValue} ${styles.positiveChange}`}>+8%</div>
              <div className={styles.statLabel}>vs mois précédent</div>
            </div>
          </div>
        </div>
        
        <div className={styles.statsCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <i className={`fas fa-tachometer-alt ${styles.cardIcon}`}></i>
              Endurance
            </div>
            <div className={styles.cardDate}>Dernière mise à jour: 28/02/2025</div>
          </div>
          
          <div className={styles.chartContainer}>
            {/* Emplacement pour graphique d'endurance */}
            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-light)' }}>
              Graphique d'endurance
            </div>
          </div>
          
          <div className={styles.statsSummary}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>42.5</div>
              <div className={styles.statLabel}>VO2 Max</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>165 bpm</div>
              <div className={styles.statLabel}>Seuil anaérobie</div>
            </div>
            <div className={styles.statItem}>
              <div className={`${styles.statValue} ${styles.positiveChange}`}>+2.1</div>
              <div className={styles.statLabel}>vs mois précédent</div>
            </div>
          </div>
        </div>
      </div>
      
      <h3 className={styles.sectionTitle}>
        <i className="fas fa-chart-line" style={{ color: 'var(--color-accent)' }}></i>
        Comparaison avec les objectifs
      </h3>
      
      <div className={styles.comparisonGrid}>
        <div className={styles.comparisonCard}>
          <div className={styles.comparisonLabel}>Force Globale</div>
          <div className={styles.comparisonValue} style={{ color: '#4ade80' }}>92%</div>
          <div className={styles.comparisonChange} style={{ color: '#4ade80' }}>
            <i className="fas fa-arrow-up comparisonIcon"></i>
            +5% depuis le dernier bilan
          </div>
        </div>
        
        <div className={styles.comparisonCard}>
          <div className={styles.comparisonLabel}>Endurance Cardiovasculaire</div>
          <div className={styles.comparisonValue} style={{ color: '#f97316' }}>78%</div>
          <div className={styles.comparisonChange} style={{ color: '#f97316' }}>
            <i className="fas fa-arrow-right comparisonIcon"></i>
            +2% depuis le dernier bilan
          </div>
        </div>
        
        <div className={styles.comparisonCard}>
          <div className={styles.comparisonLabel}>Puissance Explosive</div>
          <div className={styles.comparisonValue} style={{ color: '#4ade80' }}>85%</div>
          <div className={styles.comparisonChange} style={{ color: '#4ade80' }}>
            <i className="fas fa-arrow-up comparisonIcon"></i>
            +8% depuis le dernier bilan
          </div>
        </div>
        
        <div className={styles.comparisonCard}>
          <div className={styles.comparisonLabel}>Mobilité & Souplesse</div>
          <div className={styles.comparisonValue} style={{ color: '#ef4444' }}>65%</div>
          <div className={styles.comparisonChange} style={{ color: '#ef4444' }}>
            <i className="fas fa-arrow-down comparisonIcon"></i>
            -3% depuis le dernier bilan
          </div>
        </div>
      </div>
    </div>
  );
}
