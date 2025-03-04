'use client';

import { useState } from 'react';
import styles from './NutritionTracking.module.css';

// Import des composants de graphiques si nécessaire
// import { Line, Bar, Doughnut } from 'react-chartjs-2';

export default function NutritionTracking({ patient }) {
  const [period, setPeriod] = useState('week');
  const [activeSection, setActiveSection] = useState('summary');
  
  if (!patient) {
    return <div className={styles.emptyState}>Veuillez sélectionner un patient</div>;
  }
  
  // Données nutritionnelles fictives
  const nutritionData = patient.nutrition || {
    currentPlan: {
      name: 'Plan Performance Sportive',
      startDate: '2023-11-15',
      endDate: '2024-02-15',
      goal: 'Optimisation de la composition corporelle',
      calories: 2600,
      macros: {
        protein: 180,
        carbs: 300,
        fat: 80
      },
      meals: 4,
      hydration: 3.2,
    },
    progress: {
      adherence: 85,
      weightChange: -2.3,
      muscleGain: 1.1,
      fatLoss: 3.4,
      startDate: '2023-11-15'
    },
    dailyLog: {
      averageCalories: 2520,
      averageProtein: 175,
      averageCarbs: 290,
      averageFat: 75,
      averageHydration: 2.8,
      adherenceByMeal: {
        breakfast: 95,
        lunch: 85,
        dinner: 90,
        snacks: 75
      }
    },
    history: [
      {
        date: '2023-11-15',
        type: 'Consultation Initiale',
        notes: 'Établissement du plan nutritionnel pour optimiser les performances sportives tout en réduisant légèrement le taux de masse grasse.',
        metrics: {
          calories: 2500,
          protein: 170,
          carbs: 280,
          fat: 70
        }
      },
      {
        date: '2023-12-10',
        type: 'Suivi Mensuel',
        notes: 'Bonne adhérence au plan. Ajustement des apports en glucides les jours d\'entraînement intense. Résultats positifs sur la composition corporelle.',
        metrics: {
          calories: 2550,
          protein: 175,
          carbs: 290,
          fat: 75
        }
      },
      {
        date: '2024-01-12',
        type: 'Bilan Intermédiaire',
        notes: 'Excellente progression. Augmentation de l\'apport protéique suite aux gains musculaires. Hydratation encore à améliorer.',
        metrics: {
          calories: 2600,
          protein: 180,
          carbs: 300,
          fat: 80
        }
      }
    ],
    recommendations: [
      'Augmenter l\'hydratation pendant les entraînements',
      'Ajouter une collation riche en protéines post-entraînement',
      'Réduire les sucres raffinés au profit de glucides complexes',
      'Privilégier les sources de graisses insaturées'
    ]
  };
  
  const renderSummary = () => (
    <div className={styles.summaryContainer}>
      <div className={styles.currentPlanCard}>
        <h3 className={styles.cardTitle}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" 
              stroke="#FF8800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Plan Nutritionnel Actuel
        </h3>
        <div className={styles.planDate}>
          <span>Début: {new Date(nutritionData.currentPlan.startDate).toLocaleDateString('fr-FR')}</span>
          <span>Fin: {new Date(nutritionData.currentPlan.endDate).toLocaleDateString('fr-FR')}</span>
        </div>
        <h4 className={styles.planName}>{nutritionData.currentPlan.name}</h4>
        <div className={styles.planGoal}>{nutritionData.currentPlan.goal}</div>
        
        <div className={styles.macrosContainer}>
          <div className={styles.caloriesCircle}>
            <div className={styles.caloriesValue}>{nutritionData.currentPlan.calories}</div>
            <div className={styles.caloriesLabel}>kcal/jour</div>
          </div>
          
          <div className={styles.macrosList}>
            <div className={styles.macroItem}>
              <div className={styles.macroIcon} style={{ backgroundColor: 'rgba(52, 211, 153, 0.2)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.9994 19.0002C21.0204 18.4752 20.9054 17.9662 20.6144 17.5592C20.0144 16.7592 19.2144 16.1592 18.2144 15.7592C17.0144 15.2592 15.7144 15.0002 14.3144 15.0002C14.2144 15.0002 14.1144 15.0002 14.0144 15.0102M14.0144 15.0102C14.0144 15.0102 12.3144 15.0002 10.0144 16.8002C7.81436 18.5002 6.91436 21.0002 6.91436 21.0002L9.50436 22.0002C9.50436 22.0002 11.2144 18.4002 14.0144 15.0102ZM14.0144 15.0102C14.0144 15.0102 16.0144 14.4002 17.0144 12.4002C18.0144 10.5002 18.7144 7.3002 16.0144 4.0002C13.3144 0.700195 8.91436 3.0002 8.91436 3.0002C8.91436 3.0002 7.91436 3.4002 7.71436 6.0002C7.51436 8.6002 8.41436 9.3002 9.41436 10.0002C10.5144 10.7002 12.2144 11.4002 12.8144 12.2002C13.7144 13.2002 14.0144 15.0102 14.0144 15.0102Z" 
                  stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className={styles.macroContent}>
                <div className={styles.macroLabel}>Protéines</div>
                <div className={styles.macroValue}>{nutritionData.currentPlan.macros.protein}g</div>
              </div>
            </div>
            
            <div className={styles.macroItem}>
              <div className={styles.macroIcon} style={{ backgroundColor: 'rgba(249, 115, 22, 0.2)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 2H17C17.5304 2 18.0391 2.21071 18.4142 2.58579C18.7893 2.96086 19 3.46957 19 4V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H3C2.46957 22 1.96086 21.7893 1.58579 21.4142C1.21071 21.0391 1 20.5304 1 20V4C1 3.46957 1.21071 2.96086 1.58579 2.58579C1.96086 2.21071 2.46957 2 3 2Z" 
                  stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 15H13M11 2V22M5 15H5.01M5 11H5.01M5 7H5.01M15 15H15.01M15 11H15.01M15 7H15.01" 
                  stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className={styles.macroContent}>
                <div className={styles.macroLabel}>Glucides</div>
                <div className={styles.macroValue}>{nutritionData.currentPlan.macros.carbs}g</div>
              </div>
            </div>
            
            <div className={styles.macroItem}>
              <div className={styles.macroIcon} style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 8L3 12L7 16M17 8L21 12L17 16M14 4L10 20" 
                  stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className={styles.macroContent}>
                <div className={styles.macroLabel}>Lipides</div>
                <div className={styles.macroValue}>{nutritionData.currentPlan.macros.fat}g</div>
              </div>
            </div>
            
            <div className={styles.macroItem}>
              <div className={styles.macroIcon} style={{ backgroundColor: 'rgba(56, 189, 248, 0.2)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C16.4183 22 20 18.4183 20 14C20 9 16 4 12 2C8 4 4 9 4 14C4 18.4183 7.58172 22 12 22Z" 
                  stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className={styles.macroContent}>
                <div className={styles.macroLabel}>Hydratation</div>
                <div className={styles.macroValue}>{nutritionData.currentPlan.hydration}L</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.progressCard}>
        <h3 className={styles.cardTitle}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12L7 16L13 10M17 8L21 12L17 16M13 4L9 20" 
            stroke="#FF8800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Progrès Depuis {new Date(nutritionData.progress.startDate).toLocaleDateString('fr-FR')}
        </h3>
        
        <div className={styles.adherenceContainer}>
          <div className={styles.adherenceTitle}>Adhérence au plan</div>
          <div className={styles.adherenceProgress}>
            <div 
              className={styles.adherenceBar} 
              style={{ width: `${nutritionData.progress.adherence}%` }}
            ></div>
          </div>
          <div className={styles.adherenceValue}>{nutritionData.progress.adherence}%</div>
        </div>
        
        <div className={styles.progressMetrics}>
          <div className={styles.progressMetric}>
            <div className={styles.metricValue} style={{ color: nutritionData.progress.weightChange <= 0 ? '#4ade80' : '#ef4444' }}>
              {nutritionData.progress.weightChange > 0 ? '+' : ''}{nutritionData.progress.weightChange} kg
            </div>
            <div className={styles.metricLabel}>Poids</div>
          </div>
          
          <div className={styles.progressMetric}>
            <div className={styles.metricValue} style={{ color: nutritionData.progress.muscleGain >= 0 ? '#4ade80' : '#ef4444' }}>
              {nutritionData.progress.muscleGain > 0 ? '+' : ''}{nutritionData.progress.muscleGain} kg
            </div>
            <div className={styles.metricLabel}>Masse Musculaire</div>
          </div>
          
          <div className={styles.progressMetric}>
            <div className={styles.metricValue} style={{ color: nutritionData.progress.fatLoss >= 0 ? '#4ade80' : '#ef4444' }}>
              {nutritionData.progress.fatLoss > 0 ? '+' : '-'}{Math.abs(nutritionData.progress.fatLoss)} kg
            </div>
            <div className={styles.metricLabel}>Masse Grasse</div>
          </div>
        </div>
      </div>
      
      <div className={styles.recommendationsCard}>
        <h3 className={styles.cardTitle}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15.5V11.5M12 8.50001H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" 
            stroke="#FF8800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Recommandations
        </h3>
        
        <ul className={styles.recommendationList}>
          {nutritionData.recommendations.map((rec, index) => (
            <li key={index} className={styles.recommendationItem}>{rec}</li>
          ))}
        </ul>
      </div>
    </div>
  );
  
  const renderDailyLog = () => (
    <div className={styles.dailyLogContainer}>
      <div className={styles.logHeader}>
        <h3 className={styles.sectionSubtitle}>Suivi Nutritionnel</h3>
        <div className={styles.dateSelector}>
          <button className={styles.dateNav}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span className={styles.dateDisplay}>
            {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
          <button className={styles.dateNav}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div className={styles.logCards}>
        {['Petit-déjeuner', 'Déjeuner', 'Dîner', 'Collations'].map((meal, index) => (
          <div key={index} className={styles.mealCard}>
            <div className={styles.mealHeader}>
              <h4 className={styles.mealTitle}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {index === 0 ? (
                    // Petit-déjeuner
                    <path d="M2 19H22M13 8V16M4 4C4 3.44772 4.44772 3 5 3H19C19.5523 3 20 3.44772 20 4V8C20 9.10457 19.1046 10 18 10H6C4.89543 10 4 9.10457 4 8V4Z" stroke="#FF8800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  ) : index === 1 ? (
                    // Déjeuner
                    <path d="M8 3V5M12 3V5M16 3V5M3 7H21M5 7V18C5 19.1046 5.89543 20 7 20H17C18.1046 20 19 19.1046 19 18V7" stroke="#FF8800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  ) : index === 2 ? (
                    // Dîner
                    <path d="M16 5H18C19.1046 5 20 5.89543 20 7V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V7C4 5.89543 4.89543 5 6 5H8M12 15V9M9 9C9 7.34315 10.3431 6 12 6C13.6569 6 15 7.34315 15 9" stroke="#FF8800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  ) : (
                    // Collations
                    <path d="M12 5V4M18 12H19M5 12H6M7.05 7.05L7.757 7.757M16.95 7.05L16.243 7.757M12 20V20.01M4 12H20M9 16.5L15 9.5" 
                    stroke="#FF8800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  )}
                </svg>
                {meal}
              </h4>
              <span className={styles.mealTime}>
                {index === 0 ? '7:30 - 8:30' : 
                 index === 1 ? '12:00 - 13:30' : 
                 index === 2 ? '19:00 - 20:30' : 'Variable'}
              </span>
            </div>
            <div className={styles.foodList}>
              {[1, 2].map((item) => (
                <div key={item} className={styles.foodItem}>
                  <div className={styles.foodInfo}>
                    <span className={styles.foodName}>
                      {index === 0 ? 'Œufs & Avocat' : 
                       index === 1 ? 'Poulet & Quinoa' :
                       index === 2 ? 'Saumon & Légumes' : 'Yaourt Grec & Baies'}
                    </span>
                    <span className={styles.foodDescription}>
                      {index === 0 ? '2 œufs, 1/2 avocat, pain complet' : 
                       index === 1 ? '150g poulet, 100g quinoa, légumes' :
                       index === 2 ? '150g saumon, légumes verts, patate douce' : '150g yaourt grec, mix de baies, noix'}
                    </span>
                  </div>
                  <div className={styles.foodMacros}>
                    {index === 0 ? '380 kcal' : 
                     index === 1 ? '450 kcal' :
                     index === 2 ? '420 kcal' : '250 kcal'}
                  </div>
                </div>
              ))}
            </div>
            <button className={styles.addButton}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Ajouter un aliment
            </button>
          </div>
        ))}
      </div>

      <div className={styles.nutritionSummaryCard}>
        <h3 className={styles.cardTitle}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 15C4 15 5 14 8 14C11 14 13 16 16 16C19 16 20 15 20 15V3C20 3 19 4 16 4C13 4 11 2 8 2C5 2 4 3 4 3V15ZM4 15V22" 
            stroke="#FF8800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Résumé Journalier
        </h3>
        
        <div className={styles.macrosList}>
          <div className={styles.macroItem}>
            <div className={styles.macroIcon} style={{ backgroundColor: 'rgba(249, 115, 22, 0.2)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 10C20 14.4183 16.4183 18 12 18C7.58172 18 4 14.4183 4 10C4 5.58172 7.58172 2 12 2C16.4183 2 20 5.58172 20 10Z" 
                stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 2V6M12 18V22M2 12H6M18 12H22M4.92893 4.92893L7.75736 7.75736M19.0711 4.92893L16.2426 7.75736" 
                stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={styles.macroContent}>
              <div className={styles.macroLabel}>Calories</div>
              <div className={styles.macroValue}>1850 / 2200 kcal</div>
            </div>
          </div>
          
          <div className={styles.macroItem}>
            <div className={styles.macroIcon} style={{ backgroundColor: 'rgba(52, 211, 153, 0.2)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.9994 19.0002C21.0204 18.4752 20.9054 17.9662 20.6144 17.5592C20.0144 16.7592 19.2144 16.1592 18.2144 15.7592C17.0144 15.2592 15.7144 15.0002 14.3144 15.0002C14.2144 15.0002 14.1144 15.0002 14.0144 15.0102M14.0144 15.0102C14.0144 15.0102 12.3144 15.0002 10.0144 16.8002C7.81436 18.5002 6.91436 21.0002 6.91436 21.0002L9.50436 22.0002C9.50436 22.0002 11.2144 18.4002 14.0144 15.0102ZM14.0144 15.0102C14.0144 15.0102 16.0144 14.4002 17.0144 12.4002C18.0144 10.5002 18.7144 7.3002 16.0144 4.0002C13.3144 0.700195 8.91436 3.0002 8.91436 3.0002C8.91436 3.0002 7.91436 3.4002 7.71436 6.0002C7.51436 8.6002 8.41436 9.3002 9.41436 10.0002C10.5144 10.7002 12.2144 11.4002 12.8144 12.2002C13.7144 13.2002 14.0144 15.0102 14.0144 15.0102Z" 
                stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={styles.macroContent}>
              <div className={styles.macroLabel}>Protéines</div>
              <div className={styles.macroValue}>125 / 150 g</div>
            </div>
          </div>
          
          <div className={styles.macroItem}>
            <div className={styles.macroIcon} style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 8L3 12L7 16M17 8L21 12L17 16M14 4L10 20" 
                stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={styles.macroContent}>
              <div className={styles.macroLabel}>Glucides</div>
              <div className={styles.macroValue}>180 / 220 g</div>
            </div>
          </div>
          
          <div className={styles.macroItem}>
            <div className={styles.macroIcon} style={{ backgroundColor: 'rgba(56, 189, 248, 0.2)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C16.4183 22 20 18.4183 20 14C20 9 16 4 12 2C8 4 4 9 4 14C4 18.4183 7.58172 22 12 22Z" 
                stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={styles.macroContent}>
              <div className={styles.macroLabel}>Eau</div>
              <div className={styles.macroValue}>1.5 / 2.5 L</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderHistory = () => (
    <div className={styles.historyContainer}>
      <div className={styles.historyHeader}>
        <h3 className={styles.sectionSubtitle}>Historique Nutritionnel</h3>
        <div className={styles.historyFilter}>
          <button className={`${styles.filterButton} ${styles.active}`}>Mensuel</button>
          <button className={styles.filterButton}>Trimestriel</button>
          <button className={styles.filterButton}>Annuel</button>
        </div>
      </div>
      
      <div className={styles.historyChart}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 12H7.5M16.5 12H21M7.5 12C7.5 15.866 10.134 19 14 19C17.866 19 20.5 15.866 20.5 12C20.5 8.13401 17.866 5 14 5C10.134 5 7.5 8.13401 7.5 12Z" 
          stroke="#FF8800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className={styles.chartPlaceholder}>Visualisation des tendances en cours de développement</span>
      </div>
      
      <div className={styles.historyTable}>
        <div className={styles.tableHeader}>
          <div className={styles.tableCell}>Date</div>
          <div className={styles.tableCell}>Événement</div>
          <div className={styles.tableCell}>Calories</div>
          <div className={styles.tableCell}>Protéines</div>
          <div className={styles.tableCell}>Glucides</div>
          <div className={styles.tableCell}>Lipides</div>
        </div>
        
        {nutritionData.history.map((event, index) => (
          <div key={index} className={styles.tableRow}>
            <div className={styles.tableCell}>{new Date(event.date).toLocaleDateString('fr-FR')}</div>
            <div className={styles.tableCell}>
              <div className={styles.eventType}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {event.type.includes('Plan') ? (
                    <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" 
                    stroke="#FF8800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  ) : event.type.includes('Objectif') ? (
                    <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z M16 12L12 8M12 8L8 12M12 8V16" 
                    stroke="#FF8800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  ) : (
                    <path d="M12 4V4.01M8.5 8L8.51 8.01M12 12V12.01M15.5 8L15.51 8.01M12 20V20.01M4 12H20M9 16.5L15 9.5" 
                    stroke="#FF8800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  )}
                </svg>
                {event.type}
              </div>
            </div>
            <div className={styles.tableCell}>{event.metrics?.calories || '-'}</div>
            <div className={styles.tableCell}>{event.metrics?.protein || '-'}</div>
            <div className={styles.tableCell}>{event.metrics?.carbs || '-'}</div>
            <div className={styles.tableCell}>{event.metrics?.fat || '-'}</div>
          </div>
        ))}
      </div>
    </div>
  );
  
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'summary':
        return renderSummary();
      case 'dailyLog':
        return renderDailyLog();
      case 'history':
        return renderHistory();
      default:
        return renderSummary();
    }
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.sectionTabs}>
        <button 
          className={`${styles.tabButton} ${activeSection === 'summary' ? styles.active : ''}`}
          onClick={() => setActiveSection('summary')}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Résumé
        </button>
        <button 
          className={`${styles.tabButton} ${activeSection === 'dailyLog' ? styles.active : ''}`}
          onClick={() => setActiveSection('dailyLog')}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Suivi Quotidien
        </button>
        <button 
          className={`${styles.tabButton} ${activeSection === 'history' ? styles.active : ''}`}
          onClick={() => setActiveSection('history')}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
