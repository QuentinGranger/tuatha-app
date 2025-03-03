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
        notes: 'Établissement du plan nutritionnel pour optimiser les performances sportives tout en réduisant légèrement le taux de masse grasse.'
      },
      {
        date: '2023-12-10',
        type: 'Suivi Mensuel',
        notes: 'Bonne adhérence au plan. Ajustement des apports en glucides les jours d\'entraînement intense. Résultats positifs sur la composition corporelle.'
      },
      {
        date: '2024-01-12',
        type: 'Bilan Intermédiaire',
        notes: 'Excellente progression. Augmentation de l\'apport protéique suite aux gains musculaires. Hydratation encore à améliorer.'
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
          <i className="fas fa-clipboard-list"></i>
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
                <i className="fas fa-drumstick-bite" style={{ color: '#34d399' }}></i>
              </div>
              <div className={styles.macroContent}>
                <div className={styles.macroLabel}>Protéines</div>
                <div className={styles.macroValue}>{nutritionData.currentPlan.macros.protein}g</div>
              </div>
            </div>
            
            <div className={styles.macroItem}>
              <div className={styles.macroIcon} style={{ backgroundColor: 'rgba(249, 115, 22, 0.2)' }}>
                <i className="fas fa-bread-slice" style={{ color: '#f97316' }}></i>
              </div>
              <div className={styles.macroContent}>
                <div className={styles.macroLabel}>Glucides</div>
                <div className={styles.macroValue}>{nutritionData.currentPlan.macros.carbs}g</div>
              </div>
            </div>
            
            <div className={styles.macroItem}>
              <div className={styles.macroIcon} style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)' }}>
                <i className="fas fa-cheese" style={{ color: '#3b82f6' }}></i>
              </div>
              <div className={styles.macroContent}>
                <div className={styles.macroLabel}>Lipides</div>
                <div className={styles.macroValue}>{nutritionData.currentPlan.macros.fat}g</div>
              </div>
            </div>
            
            <div className={styles.macroItem}>
              <div className={styles.macroIcon} style={{ backgroundColor: 'rgba(56, 189, 248, 0.2)' }}>
                <i className="fas fa-tint" style={{ color: '#38bdf8' }}></i>
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
          <i className="fas fa-chart-line"></i>
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
          <i className="fas fa-lightbulb"></i>
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
      </div>
      
      <div className={styles.averagesCard}>
        <h3 className={styles.cardTitle}>Moyennes Quotidiennes</h3>
        
        <div className={styles.averagesGrid}>
          <div className={styles.averageItem}>
            <div className={styles.averageValue}>{nutritionData.dailyLog.averageCalories}</div>
            <div className={styles.averageLabel}>Calories (kcal)</div>
          </div>
          
          <div className={styles.averageItem}>
            <div className={styles.averageValue}>{nutritionData.dailyLog.averageProtein}</div>
            <div className={styles.averageLabel}>Protéines (g)</div>
          </div>
          
          <div className={styles.averageItem}>
            <div className={styles.averageValue}>{nutritionData.dailyLog.averageCarbs}</div>
            <div className={styles.averageLabel}>Glucides (g)</div>
          </div>
          
          <div className={styles.averageItem}>
            <div className={styles.averageValue}>{nutritionData.dailyLog.averageFat}</div>
            <div className={styles.averageLabel}>Lipides (g)</div>
          </div>
          
          <div className={styles.averageItem}>
            <div className={styles.averageValue}>{nutritionData.dailyLog.averageHydration}</div>
            <div className={styles.averageLabel}>Hydratation (L)</div>
          </div>
        </div>
      </div>
      
      <div className={styles.adherenceByMealCard}>
        <h3 className={styles.cardTitle}>Adhérence par Repas</h3>
        
        <div className={styles.mealAdherenceGrid}>
          {Object.entries(nutritionData.dailyLog.adherenceByMeal).map(([meal, value]) => (
            <div key={meal} className={styles.mealAdherenceItem}>
              <div className={styles.mealName}>{
                meal === 'breakfast' ? 'Petit-déjeuner' :
                meal === 'lunch' ? 'Déjeuner' :
                meal === 'dinner' ? 'Dîner' : 'Collations'
              }</div>
              <div className={styles.mealAdherenceBar}>
                <div 
                  className={styles.mealAdherenceProgress} 
                  style={{ 
                    width: `${value}%`,
                    backgroundColor: value > 90 ? '#4ade80' : value > 70 ? '#f97316' : '#ef4444'
                  }}
                ></div>
              </div>
              <div className={styles.mealAdherenceValue}>{value}%</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Ici, on pourrait ajouter un graphique de suivi des calories et macros au fil du temps */}
    </div>
  );
  
  const renderHistory = () => (
    <div className={styles.historyContainer}>
      <div className={styles.timeline}>
        {nutritionData.history.map((event, index) => (
          <div key={index} className={styles.timelineEvent}>
            <div className={styles.timelineDate}>
              {new Date(event.date).toLocaleDateString('fr-FR')}
            </div>
            <div className={styles.timelineDot}></div>
            <div className={styles.timelineContent}>
              <h4 className={styles.eventTitle}>{event.type}</h4>
              <p className={styles.eventNotes}>{event.notes}</p>
            </div>
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
          <i className="fas fa-clipboard-check"></i>
          Résumé
        </button>
        <button 
          className={`${styles.tabButton} ${activeSection === 'dailyLog' ? styles.active : ''}`}
          onClick={() => setActiveSection('dailyLog')}
        >
          <i className="fas fa-calendar-day"></i>
          Suivi Quotidien
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
