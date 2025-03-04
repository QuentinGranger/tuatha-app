'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './PerformanceStats.module.css';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Enregistrer les composants nécessaires de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

// Configuration commune pour les graphiques
const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'rgba(20, 30, 51, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: 'rgba(255, 136, 0, 0.3)',
      borderWidth: 1,
      padding: 10,
      cornerRadius: 8,
      displayColors: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.6)',
        font: {
          size: 10,
        },
        maxRotation: 0,
      },
    },
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
        drawBorder: false,
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.6)',
        font: {
          size: 10,
        },
        padding: 8,
      },
      beginAtZero: true,
    },
  },
  elements: {
    line: {
      tension: 0.4,
    },
    point: {
      radius: 3,
      hoverRadius: 5,
    },
  },
};

// Génération de données aléatoires pour la démo
const generateRandomData = (min, max, count) => {
  return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min);
};

// La fonction principale du composant
export default function PerformanceStats({ patient }) {
  const [period, setPeriod] = useState('month');
  
  // Référence au conteneur pour les animations
  const containerRef = useRef(null);
  
  // Définir les données en fonction de la période
  const labels = {
    week: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    month: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
    '3months': ['Jan', 'Fév', 'Mar'],
    year: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']
  };
  
  // Données pour l'activité physique
  const activityData = {
    labels: labels[period],
    datasets: [
      {
        label: 'Heures d\'activité',
        data: generateRandomData(1, 5, labels[period].length),
        backgroundColor: 'rgba(255, 136, 0, 0.2)',
        borderColor: '#FF8800',
        fill: true,
        borderWidth: 2,
      },
    ],
  };
  
  // Données pour la fréquence cardiaque
  const heartRateData = {
    labels: labels[period],
    datasets: [
      {
        label: 'BPM',
        data: generateRandomData(60, 160, labels[period].length),
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderColor: '#ef4444',
        fill: true,
        borderWidth: 2,
        pointBackgroundColor: '#ef4444',
      },
    ],
  };
  
  // Données pour la force
  const strengthData = {
    labels: labels[period],
    datasets: [
      {
        label: 'Force (kg)',
        data: generateRandomData(70, 90, labels[period].length),
        backgroundColor: 'rgba(255, 136, 0, 0.5)',
        borderColor: '#FF8800',
        borderWidth: 0,
        borderRadius: 4,
      },
    ],
  };
  
  // Données pour l'endurance
  const enduranceData = {
    labels: labels[period],
    datasets: [
      {
        label: 'Endurance',
        data: generateRandomData(35, 45, labels[period].length),
        backgroundColor: 'rgba(74, 222, 128, 0.2)',
        borderColor: '#4ade80',
        fill: true,
        borderWidth: 2,
      },
    ],
  };
  
  // Animation au changement de période
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.classList.add(styles.periodChange);
      const timer = setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.classList.remove(styles.periodChange);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [period]);
  
  if (!patient) {
    return <div className={styles.emptyState}>Veuillez sélectionner un patient</div>;
  }
  
  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.periodSelectorWrapper}>
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
      </div>
      
      <div className={styles.statsGrid}>
        <div className={styles.statsCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <svg className={styles.cardIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                <line x1="4" y1="22" x2="4" y2="15"></line>
              </svg>
              Activité Physique
            </div>
            <div className={styles.cardDate}>Dernière mise à jour: 01/03/2025</div>
          </div>
          
          <div className={styles.chartContainer}>
            <Line 
              data={activityData} 
              options={{
                ...commonOptions,
                plugins: {
                  ...commonOptions.plugins,
                  tooltip: {
                    ...commonOptions.plugins.tooltip,
                    callbacks: {
                      label: function(context) {
                        return `${context.parsed.y} heures`;
                      }
                    }
                  }
                }
              }}
            />
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
              <div className={`${styles.statValue} ${styles.positiveChange}`}>
                <span className={styles.changeIcon}>▲</span>15%
              </div>
              <div className={styles.statLabel}>vs mois précédent</div>
            </div>
          </div>
        </div>
        
        <div className={styles.statsCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <svg className={styles.cardIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
              </svg>
              Fréquence Cardiaque
            </div>
            <div className={styles.cardDate}>Dernière mise à jour: 01/03/2025</div>
          </div>
          
          <div className={styles.chartContainer}>
            <Line 
              data={heartRateData} 
              options={{
                ...commonOptions,
                plugins: {
                  ...commonOptions.plugins,
                  tooltip: {
                    ...commonOptions.plugins.tooltip,
                    callbacks: {
                      label: function(context) {
                        return `${context.parsed.y} bpm`;
                      }
                    }
                  }
                }
              }}
            />
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
              <div className={`${styles.statValue} ${styles.negativeChange}`}>
                <span className={styles.changeIcon}>▲</span>3 bpm
              </div>
              <div className={styles.statLabel}>vs mois précédent</div>
            </div>
          </div>
        </div>
        
        <div className={styles.statsCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <svg className={styles.cardIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 18h8"></path>
                <path d="M3 22h18"></path>
                <path d="M14 22a7 7 0 1 0 0-14h-1"></path>
                <path d="M9 14h2"></path>
                <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2h-2z"></path>
              </svg>
              Force & Puissance
            </div>
            <div className={styles.cardDate}>Dernière mise à jour: 25/02/2025</div>
          </div>
          
          <div className={styles.chartContainer}>
            <Bar 
              data={strengthData} 
              options={{
                ...commonOptions,
                plugins: {
                  ...commonOptions.plugins,
                  tooltip: {
                    ...commonOptions.plugins.tooltip,
                    callbacks: {
                      label: function(context) {
                        return `${context.parsed.y} kg`;
                      }
                    }
                  }
                }
              }}
            />
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
              <div className={`${styles.statValue} ${styles.positiveChange}`}>
                <span className={styles.changeIcon}>▲</span>8%
              </div>
              <div className={styles.statLabel}>vs mois précédent</div>
            </div>
          </div>
        </div>
        
        <div className={styles.statsCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <svg className={styles.cardIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
              Endurance
            </div>
            <div className={styles.cardDate}>Dernière mise à jour: 28/02/2025</div>
          </div>
          
          <div className={styles.chartContainer}>
            <Line 
              data={enduranceData} 
              options={{
                ...commonOptions,
                plugins: {
                  ...commonOptions.plugins,
                  tooltip: {
                    ...commonOptions.plugins.tooltip,
                    callbacks: {
                      label: function(context) {
                        return `VO2 Max: ${context.parsed.y}`;
                      }
                    }
                  }
                }
              }}
            />
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
              <div className={`${styles.statValue} ${styles.positiveChange}`}>
                <span className={styles.changeIcon}>▲</span>2.1
              </div>
              <div className={styles.statLabel}>vs mois précédent</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.sectionTitleContainer}>
        <h3 className={styles.sectionTitle}>
          <svg className={styles.sectionIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
            <polyline points="16 7 22 7 22 13"></polyline>
          </svg>
          Comparaison avec les objectifs
        </h3>
      </div>
      
      <div className={styles.comparisonGrid}>
        <div className={styles.comparisonCard}>
          <div className={styles.comparisonLabel}>Force Globale</div>
          <div className={styles.comparisonProgress}>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: '92%' }}></div>
            </div>
            <div className={styles.comparisonValue}>92%</div>
          </div>
          <div className={styles.comparisonChange}>
            <svg className={styles.trendIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
            +5% depuis le dernier bilan
          </div>
        </div>
        
        <div className={styles.comparisonCard}>
          <div className={styles.comparisonLabel}>Endurance Cardiovasculaire</div>
          <div className={styles.comparisonProgress}>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: '78%' }}></div>
            </div>
            <div className={styles.comparisonValue}>78%</div>
          </div>
          <div className={styles.comparisonChange}>
            <svg className={styles.trendIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            +2% depuis le dernier bilan
          </div>
        </div>
        
        <div className={styles.comparisonCard}>
          <div className={styles.comparisonLabel}>Puissance Explosive</div>
          <div className={styles.comparisonProgress}>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: '85%' }}></div>
            </div>
            <div className={styles.comparisonValue}>85%</div>
          </div>
          <div className={styles.comparisonChange}>
            <svg className={styles.trendIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
            +8% depuis le dernier bilan
          </div>
        </div>
        
        <div className={styles.comparisonCard}>
          <div className={styles.comparisonLabel}>Mobilité & Souplesse</div>
          <div className={styles.comparisonProgress}>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: '65%' }}></div>
            </div>
            <div className={styles.comparisonValue}>65%</div>
          </div>
          <div className={styles.comparisonChange}>
            <svg className={styles.trendIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
            -3% depuis le dernier bilan
          </div>
        </div>
      </div>
    </div>
  );
}
