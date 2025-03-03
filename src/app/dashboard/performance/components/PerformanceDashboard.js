'use client';

import { useState, useEffect } from 'react';
import { athletes, athleteData, periodLabels } from '../test-data';
import { WeightChart, HydrationChart, CaloriesChart, MacrosChart } from './PerformanceCharts';

// Composant principal
export default function PerformanceDashboard({ initialPatients = [] }) {
  // États pour les données
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [performanceData, setPerformanceData] = useState({});
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Suppression des références pour les cartes KPI puisqu'elles sont maintenant autosizables
  // const kpiChartRefs = useRef([]);
  
  // Effet pour charger les patients au montage du composant
  useEffect(() => {
    async function loadPatients() {
      try {
        console.log("Patients initiaux:", initialPatients?.length || 0);
        
        // Si nous avons des patients initiaux, utilisons-les
        if (Array.isArray(initialPatients) && initialPatients.length > 0) {
          console.log("Utilisation des patients initiaux:", initialPatients);
          setPatients(initialPatients);
          // Sélectionner le premier patient par défaut
          setSelectedPatient(initialPatients[0]);
          return;
        }
        
        // Sinon, utilisons les données de test
        console.log("Utilisation des données de test pour les patients");
        const testPatients = athletes.map(athlete => ({
          id: athlete.id,
          name: athlete.name,
          objective: athlete.objective,
          status: athlete.status
        }));
        
        console.log("Patients de test créés:", testPatients);
        setPatients(testPatients);
        setSelectedPatient(testPatients[0]);
      } catch (error) {
        console.error('Erreur lors du chargement des patients:', error);
        // Utiliser un tableau vide en cas d'erreur
        setPatients([]);
        setSelectedPatient(null);
      } finally {
        setLoading(false);
      }
    }
    
    loadPatients();
  }, [initialPatients]);

  // Effet pour charger les données de performance quand un patient est sélectionné
  useEffect(() => {
    if (selectedPatient && selectedPatient.id) {
      // Log pour débogage - début de la récupération
      console.log("Chargement des données pour le patient:", selectedPatient);
      try {
        // Pour l'instant, on utilise les données de test
        // Dans une vraie application, on ferait un appel API ici
        console.log("Patient sélectionné:", selectedPatient);
        console.log("Données disponibles:", Object.keys(athleteData));
        
        let patientPerformanceData = athleteData[selectedPatient.id];
        console.log("Données trouvées:", patientPerformanceData ? "Oui" : "Non");
        console.log("Données trouvées pour le patient sélectionné:", patientPerformanceData);
        
        // Log pour débogage - structure des données reçues
        console.log("Données de performance reçues:", patientPerformanceData);
        
        // Si aucune donnée n'est trouvée pour cet athlète, utiliser les données par défaut
        if (!patientPerformanceData) {
          console.log("Utilisation des données par défaut");
          patientPerformanceData = athleteData['1']; // Utiliser l'athlète avec ID '1' comme fallback
          console.log("Données par défaut utilisées:", patientPerformanceData);
          
          // Si même les données par défaut ne sont pas disponibles, créer un objet vide
          if (!patientPerformanceData) {
            console.error("Aucune donnée disponible, même par défaut");
            patientPerformanceData = {
              weight: { current: 0, target: 0, status: 'yellow', notes: 'Données non disponibles' },
              hydration: { current: 0, target: 0, status: 'yellow', notes: 'Données non disponibles' },
              calories: { current: 0, target: 0, burn: 0, status: 'yellow', notes: 'Données non disponibles' },
              macros: { 
                current: { protein: 0, carbs: 0, fat: 0 },
                target: { protein: 0, carbs: 0, fat: 0 },
                status: 'yellow',
                items: [] // Ajouter un tableau vide pour éviter l'erreur de map
              },
              notes: { content: 'Aucune note disponible', lastUpdate: new Date().toLocaleDateString() }
            };
          }
        }
        
        // S'assurer que tous les objets nécessaires existent pour éviter les erreurs
        if (patientPerformanceData.macros && !patientPerformanceData.macros.items) {
          // Créer les items à partir des données current/target si possible
          const macros = patientPerformanceData.macros;
          if (macros.current && macros.target) {
            patientPerformanceData.macros.items = [
              { label: 'Protéines', current: macros.current.protein || 0, target: macros.target.protein || 0 },
              { label: 'Glucides', current: macros.current.carbs || 0, target: macros.target.carbs || 0 },
              { label: 'Lipides', current: macros.current.fat || 0, target: macros.target.fat || 0 }
            ];
          } else {
            patientPerformanceData.macros.items = [];
          }
        }
        
        // S'assurer que l'objet medical et ses datasets existent
        if (patientPerformanceData.medical && !patientPerformanceData.medical.datasets) {
          patientPerformanceData.medical.datasets = [];
        }
        
        // S'assurer que l'objet trends existe
        if (!patientPerformanceData.trends) {
          patientPerformanceData.trends = [];
        }
        
        setPerformanceData(patientPerformanceData);
      } catch (error) {
        console.error('Erreur lors du chargement des données de performance:', error);
        // Utiliser un objet de données minimal en cas d'erreur
        const fallbackData = {
          weight: { current: 0, target: 0, status: 'yellow', notes: 'Données non disponibles' },
          hydration: { current: 0, target: 0, status: 'yellow', notes: 'Données non disponibles' },
          calories: { current: 0, target: 0, burn: 0, status: 'yellow', notes: 'Données non disponibles' },
          macros: { 
            current: { protein: 0, carbs: 0, fat: 0 },
            target: { protein: 0, carbs: 0, fat: 0 },
            status: 'yellow',
            items: [] // Ajouter un tableau vide pour éviter l'erreur de map
          },
          notes: { content: 'Aucune note disponible', lastUpdate: new Date().toLocaleDateString() },
          medical: { datasets: [] },
          trends: []
        };
        setPerformanceData(fallbackData);
      }
    }
  }, [selectedPatient]);

  // Gestionnaire de changement de patient
  const handlePatientChange = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    setSelectedPatient(patient);
  };

  // Gestionnaire de changement de période
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  // Si chargement en cours, afficher un message
  if (loading) {
    return (
      <div className="performance-container">
        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
            <div className="loader"></div>
            <p>Chargement des données de performance...</p>
          </div>
        </div>
      </div>
    );
  }

  // Si aucun patient n'est sélectionné, inciter à en choisir un
  if (!selectedPatient) {
    return (
      <div className="container empty-state">
        <div className="glass-panel">
          <h2>Tableau de bord de performances</h2>
          <p>Veuillez sélectionner un athlète pour voir ses indicateurs de performance.</p>
          
          <div className="athlete-selector">
            <label htmlFor="athlete-select">Choisir un athlète:</label>
            <select 
              id="athlete-select"
              onChange={(e) => handlePatientChange(e.target.value)}
              value=""
            >
              <option value="" disabled>Sélectionner un athlète</option>
              {Array.isArray(patients) && patients.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} - {patient.objective}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  }

  // Vérifier que les données de performance existent
  const hasPerformanceData = performanceData && 
                            performanceData.weight && 
                            performanceData.hydration && 
                            performanceData.calories && 
                            performanceData.macros;

  // Si aucune donnée n'est disponible pour le patient sélectionné
  if (!hasPerformanceData) {
    return (
      <div className="container">
        <div className="dashboard-header">
          <div className="patient-info">
            <div className="athlete-selector">
              <label htmlFor="athlete-select">Athlète:</label>
              <select 
                id="athlete-select"
                onChange={(e) => handlePatientChange(e.target.value)}
                value={selectedPatient.id}
              >
                {Array.isArray(patients) && patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} - {patient.objective}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="glass-panel">
          <h2>Données non disponibles</h2>
          <p>Aucune donnée de performance n'est disponible pour cet athlète.</p>
        </div>
      </div>
    );
  }

  // Obtenir le statut global basé sur les statuts des différents KPIs
  const getOverallStatus = () => {
    if (!performanceData) return 'yellow';
    
    const statuses = [
      performanceData.weight?.status,
      performanceData.hydration?.status,
      performanceData.calories?.status,
      performanceData.macros?.status,
      performanceData.sleep?.status,
      performanceData.medical?.status
    ].filter(Boolean);
    
    if (statuses.includes('red')) return 'red';
    if (statuses.includes('yellow')) return 'yellow';
    return 'green';
  };

  const overallStatus = getOverallStatus();
  const statusEmoji = {
    green: '🟢',
    yellow: '🟡',
    red: '🔴'
  };

  return (
    <div className="performance-container">
      {/* En-tête avec sélecteurs et information patient */}
      <div className="glass-panel">
        <div className="header-container">
          <div className="patient-info">
            <div className="athlete-selector">
              <select 
                value={selectedPatient?.id} 
                onChange={(e) => handlePatientChange(e.target.value)}
              >
                {Array.isArray(patients) && patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="athlete-status">
              <span className={`status-indicator status-${overallStatus}`}></span>
              <span className="status-text">
                {statusEmoji[overallStatus]} {selectedPatient?.name || 'Athlète'} - {selectedPatient?.objective || 'Objectif non défini'}
              </span>
            </div>
          </div>
          
          <div className="period-selector">
            <div className="selector-label">Période:</div>
            <div className="selector-buttons">
              <button 
                className={selectedPeriod === 'week' ? 'active' : ''} 
                onClick={() => handlePeriodChange('week')}
              >
                Semaine
              </button>
              <button 
                className={selectedPeriod === 'month' ? 'active' : ''} 
                onClick={() => handlePeriodChange('month')}
              >
                Mois
              </button>
              <button 
                className={selectedPeriod === 'quarter' ? 'active' : ''} 
                onClick={() => handlePeriodChange('quarter')}
              >
                Trimestre
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Graphiques KPI principaux */}
      <div className="glass-panel">
        <h2>📊 Indicateurs de Performance</h2>
        <div className="kpi-grid">
          {/* Poids et Composition */}
          <div className="glass-panel kpi-chart">
            <h3>
              <span className={`status-indicator status-${performanceData.weight?.status}`}></span>
              Poids & Masse Grasse 📉
            </h3>
            <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div className="kpi-current-value">
                <div className="kpi-value">{performanceData.weight?.current} kg</div>
                <div className="kpi-target">Objectif: {performanceData.weight?.target} kg</div>
              </div>
              <div className="chart-container">
                <WeightChart 
                  data={performanceData.weight || {}} 
                  labels={periodLabels[selectedPeriod]} 
                />
              </div>
              <div className="kpi-note">{performanceData.weight?.notes}</div>
            </div>
          </div>
          
          {/* Hydratation */}
          <div className="glass-panel kpi-chart">
            <h3>
              <span className={`status-indicator status-${performanceData.hydration?.status}`}></span>
              Hydratation 💧
            </h3>
            <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div className="kpi-current-value">
                <div className="kpi-value">{performanceData.hydration?.current} L</div>
                <div className="kpi-target">Objectif: {performanceData.hydration?.target} L</div>
              </div>
              <div className="chart-container">
                <HydrationChart 
                  data={performanceData.hydration || {}} 
                  labels={periodLabels[selectedPeriod]} 
                />
              </div>
              <div className="kpi-note">{performanceData.hydration?.notes}</div>
            </div>
          </div>
          
          {/* Calories */}
          <div className="glass-panel kpi-chart">
            <h3>
              <span className={`status-indicator status-${performanceData.calories?.status}`}></span>
              Apport vs Dépense Calorique 🔥
            </h3>
            <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div className="kpi-current-value">
                <div className="kpi-value">{performanceData.calories?.current} kcal</div>
                <div className="kpi-target">Objectif: {performanceData.calories?.target} kcal</div>
                <div className="kpi-burn">Dépense: {performanceData.calories?.burn} kcal</div>
              </div>
              <div className="chart-container">
                <CaloriesChart 
                  data={performanceData.calories || {}} 
                  labels={periodLabels[selectedPeriod]} 
                />
              </div>
              <div className="kpi-note">{performanceData.calories?.notes}</div>
            </div>
          </div>
          
          {/* Macronutriments */}
          <div className="glass-panel kpi-chart">
            <h3>
              <span className={`status-indicator status-${performanceData.macros?.status}`}></span>
              Macronutriments 🍗🥦🥑
            </h3>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div className="macros-details">
                {/* Vérifier que items existe et est un tableau avant d'appeler map */}
                {Array.isArray(performanceData.macros?.items) && performanceData.macros.items.map((item, index) => (
                  <div key={index} className="macro-item">
                    <div className="macro-label">{item.label}</div>
                    <div className="macro-value">{item.current}g</div>
                    <div className="macro-target">Objectif: {item.target}g</div>
                  </div>
                ))}
              </div>
              
              <div className="chart-container macros-chart">
                <MacrosChart 
                  data={performanceData.macros || {}} 
                  labels={periodLabels[selectedPeriod]} 
                />
              </div>
              
              <div className="kpi-note">{performanceData.macros?.notes}</div>
            </div>
          </div>
          
          {/* Sommeil & Récupération */}
          {performanceData.sleep && (
            <div className="glass-panel kpi-chart">
              <h3>
                <span className={`status-indicator status-${performanceData.sleep?.status}`}></span>
                Sommeil & Récupération 😴
              </h3>
              <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div className="kpi-current-value">
                  <div className="kpi-value">{performanceData.sleep?.current}h</div>
                  <div className="kpi-target">Objectif: {performanceData.sleep?.target}h</div>
                </div>
                <div className="kpi-chart-placeholder">
                  <div className="chart-container">
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--color-text-light)' }}>
                      Graphique en cours de développement
                    </div>
                  </div>
                </div>
                <div className="kpi-note">{performanceData.sleep?.notes}</div>
              </div>
            </div>
          )}
          
          {/* Indicateurs Médicaux */}
          {performanceData.medical && (
            <div className="glass-panel kpi-chart">
              <h3>
                <span className={`status-indicator status-${performanceData.medical?.status}`}></span>
                Indicateurs Médicaux 🩸
              </h3>
              <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div className="medical-grid">
                  {Array.isArray(performanceData.medical?.datasets) && performanceData.medical.datasets.map((dataset, index) => {
                    const lastIndex = dataset.data.length - 1;
                    const lastValue = dataset.data[lastIndex];
                    const isNormal = dataset.normal.includes('-') 
                      ? (lastValue >= +dataset.normal.split('-')[0] && lastValue <= +dataset.normal.split('-')[1])
                      : dataset.normal.includes('>') 
                        ? lastValue >= +dataset.normal.replace('>', '').trim()
                        : lastValue <= +dataset.normal.replace('<', '').trim();
                    
                    return (
                      <div key={index} className={`medical-item ${isNormal ? 'normal' : 'abnormal'}`}>
                        <div className="medical-label">{dataset.label}</div>
                        <div className="medical-value">{lastValue}</div>
                        <div className="medical-normal">{dataset.normal}</div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="kpi-note">{performanceData.medical?.notes}</div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Tendances Hebdomadaires */}
      {Array.isArray(performanceData.trends) && performanceData.trends.length > 0 && (
        <div className="glass-panel">
          <h2>📅 Évolution & Tendances</h2>
          <div className="trends-container">
            {performanceData.trends.map((trend, index) => (
              <div key={index} className="trend-card">
                <h4>{trend.name}</h4>
                <div className="trend-value">{trend.value} <span className="trend-change">{trend.change}</span></div>
                <div className="trend-progress">
                  <div 
                    className="trend-progress-bar" 
                    style={{ 
                      width: `${trend.progress}%`,
                      backgroundColor: 
                        trend.progress >= 90 ? 'var(--color-success)' : 
                        trend.progress >= 70 ? 'var(--color-warning)' : 
                        'var(--color-danger)'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Notes et Recommandations */}
      <div className="glass-panel">
        <h2>📖 Notes & Recommandations</h2>
        <div className="notes-box">
          <h3>Dernière mise à jour: {performanceData.notes?.lastUpdate}</h3>
          <div className="notes-content">
            {performanceData.notes?.content}
          </div>
          <textarea 
            className="notes-input"
            value={performanceData.notes?.content}
            onChange={(e) => setPerformanceData({ ...performanceData, notes: { ...performanceData.notes, content: e.target.value } })}
            placeholder="Ajouter des notes ou recommandations..."
          ></textarea>
          <button className="save-btn">
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
