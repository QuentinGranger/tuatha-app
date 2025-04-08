'use client';

import React, { useState, useEffect } from 'react';
import { IoMdAnalytics, IoMdArrowDropdown } from 'react-icons/io';
import { MdTrendingUp, MdTrendingDown } from 'react-icons/md';
import { athletes, athleteData, periodLabels } from '../test-data';
import { WeightChart, HydrationChart, CaloriesChart, MacrosChart } from './PerformanceCharts';
import styles from './performanceHeader.module.css';
import tableStyles from './performanceTables.module.css';
import PerformanceTable from './PerformanceTable';
import PerformanceForm from './PerformanceForm';
import DeleteConfirmation from './DeleteConfirmation';
import AthleteOverview from './AthleteOverview';

// Composant principal
export default function PerformanceDashboard({ initialPatients = [] }) {
  // États pour les données
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [performanceData, setPerformanceData] = useState({});
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // État pour les modales CRUD
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [crudLoading, setCrudLoading] = useState(false);

  // Données d'historique des performances (simulées pour la démo)
  const [performanceHistory, setPerformanceHistory] = useState([
    {
      id: '1',
      patientId: 'patient1',
      date: '2025-03-26',
      weight: 75.5,
      hydration: 2.8,
      calories: {
        consumed: 2350,
        burned: 2600
      },
      macros: {
        proteins: 135,
        carbs: 210,
        fats: 70
      },
      sleep: {
        duration: 7.2,
        quality: 90,
        deepPhase: 30
      },
      notes: "Excellente journée, bien hydraté et bon équilibre alimentaire."
    },
    {
      id: '2',
      patientId: 'patient1',
      date: '2025-03-25',
      weight: 75.8,
      hydration: 2.5,
      calories: {
        consumed: 2500,
        burned: 2200
      },
      macros: {
        proteins: 120,
        carbs: 230,
        fats: 80
      },
      sleep: {
        duration: 6.8,
        quality: 85,
        deepPhase: 25
      },
      notes: "Repas un peu trop riches en glucides, sommeil légèrement perturbé."
    },
    {
      id: '3',
      patientId: 'patient1',
      date: '2025-03-24',
      weight: 76.2,
      hydration: 3.0,
      calories: {
        consumed: 2250,
        burned: 2500
      },
      macros: {
        proteins: 140,
        carbs: 200,
        fats: 65
      },
      sleep: {
        duration: 7.5,
        quality: 92,
        deepPhase: 32
      },
      notes: "Excellente récupération, bonne hydratation et alimentation équilibrée."
    },
    {
      id: '4',
      patientId: 'patient1',
      date: '2025-03-23',
      weight: 76.5,
      hydration: 2.2,
      calories: {
        consumed: 2400,
        burned: 2100
      },
      macros: {
        proteins: 110,
        carbs: 240,
        fats: 85
      },
      sleep: {
        duration: 6.5,
        quality: 78,
        deepPhase: 22
      },
      notes: "Hydratation insuffisante, sommeil perturbé."
    }
  ]);

  // Filtrer l'historique par patient sélectionné
  const filteredHistory = performanceHistory.filter(entry => 
    !selectedPatient || entry.patientId === selectedPatient.id
  );

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

  // Fonction pour obtenir l'état global des performances
  const getOverallStatus = () => {
    const statuses = [
      performanceData.weight?.status,
      performanceData.hydration?.status,
      performanceData.calories?.status,
      performanceData.macros?.status,
    ].filter(Boolean);
    
    if (statuses.includes('red')) return 'red';
    if (statuses.includes('yellow')) return 'yellow';
    return 'green';
  };
  
  // Classes CSS pour les statuts
  const getStatusClass = (status) => {
    switch(status) {
      case 'green': return tableStyles.green;
      case 'yellow': return tableStyles.yellow;
      case 'red': return tableStyles.red;
      default: return '';
    }
  };

  // Handlers pour les opérations CRUD
  const handleAddEntry = () => {
    setSelectedEntry(null);
    setIsAddModalOpen(true);
  };
  
  const handleViewEntry = (entry) => {
    setSelectedEntry(entry);
    setIsViewModalOpen(true);
  };
  
  const handleEditEntry = (entry) => {
    setSelectedEntry(entry);
    setIsEditModalOpen(true);
  };
  
  const handleDeleteEntry = (entry) => {
    setSelectedEntry(entry);
    setIsDeleteModalOpen(true);
  };
  
  const handleSaveEntry = async (data) => {
    setCrudLoading(true);
    
    try {
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (data.id) {
        // Mise à jour d'une entrée existante
        setPerformanceHistory(prev => 
          prev.map(entry => entry.id === data.id ? { ...data } : entry)
        );
      } else {
        // Ajout d'une nouvelle entrée
        const newEntry = {
          ...data,
          id: Date.now().toString(),
          patientId: selectedPatient?.id || 'patient1'
        };
        setPerformanceHistory(prev => [newEntry, ...prev]);
      }
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement des données:', error);
      return false;
    } finally {
      setCrudLoading(false);
    }
  };
  
  const handleConfirmDelete = async () => {
    if (!selectedEntry) return;
    
    setCrudLoading(true);
    
    try {
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setPerformanceHistory(prev => 
        prev.filter(entry => entry.id !== selectedEntry.id)
      );
      
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de la suppression des données:', error);
    } finally {
      setCrudLoading(false);
    }
  };
  
  // Formater la date pour l'affichage
  const formatDisplayDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
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

  return (
    <div className="performance-dashboard">
      {/* Header premium amélioré */}
      <div className={styles.performanceHeader}>
        <div className={styles.headerTop}>
          <div className={styles.titleContainer}>
            <IoMdAnalytics className={styles.titleIcon} />
            <h1 className={styles.title}>Indicateurs de Performance</h1>
          </div>
          
          <div className={styles.statusContainer}>
            <div className={`${styles.statusBadge} ${styles[getOverallStatus()]}`}></div>
            <span className={styles.statusText}>
              {getOverallStatus() === 'green' ? 'Excellent' : 
               getOverallStatus() === 'yellow' ? 'À surveiller' : 'Attention requise'}
            </span>
          </div>
        </div>
        
        <div className={styles.patientInfo}>
          <div className={styles.selectContainer}>
            <label htmlFor="athlete-select" className={styles.selectLabel}>Athlète:</label>
            <div style={{ position: 'relative' }}>
              <select 
                id="athlete-select"
                onChange={(e) => handlePatientChange(e.target.value)}
                value={selectedPatient.id}
                className={styles.select}
              >
                {Array.isArray(patients) && patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} - {patient.objective}
                  </option>
                ))}
              </select>
              <IoMdArrowDropdown className={styles.selectArrow} />
            </div>
          </div>
          
          <div className={styles.periodSelect}>
            <button 
              className={`${styles.periodButton} ${selectedPeriod === 'week' ? styles.periodButtonActive : ''}`} 
              onClick={() => handlePeriodChange('week')}
            >
              Semaine
            </button>
            <button 
              className={`${styles.periodButton} ${selectedPeriod === 'month' ? styles.periodButtonActive : ''}`} 
              onClick={() => handlePeriodChange('month')}
            >
              Mois
            </button>
            <button 
              className={`${styles.periodButton} ${selectedPeriod === 'quarter' ? styles.periodButtonActive : ''}`} 
              onClick={() => handlePeriodChange('quarter')}
            >
              Trimestre
            </button>
          </div>
        </div>
      </div>
      
      {/* Contenu principal */}
      <div className="performance-main-content">
        {/* Vue synthétique du suivi athlète pour les pros */}
        <AthleteOverview patient={selectedPatient} period={selectedPeriod} />
        
        {/* Grille des indicateurs de performance */}
        <div className="kpi-grid">
          {/* Poids */}
          <div className={tableStyles.kpiCard}>
            <div className={tableStyles.cardHeader}>
              <h3 className={tableStyles.cardTitle}>
                <span className={`${tableStyles.statusIndicator} ${getStatusClass(performanceData.weight?.status)}`}></span>
                Évolution du Poids <span className={tableStyles.cardIcon}>⚖️</span>
              </h3>
            </div>
            <div className={tableStyles.cardContent}>
              <div className={tableStyles.metricsRow}>
                <div className={tableStyles.metricCard}>
                  <span className={tableStyles.metricLabel}>Actuel</span>
                  <span className={tableStyles.currValue}>{performanceData.weight?.current} kg</span>
                </div>
                <div className={tableStyles.metricCard}>
                  <span className={tableStyles.metricLabel}>Objectif</span>
                  <span className={tableStyles.targetValue}>{performanceData.weight?.target} kg</span>
                </div>
                <div className={tableStyles.metricCard}>
                  <span className={tableStyles.metricLabel}>Différence</span>
                  <div className={tableStyles.metricTrend}>
                    {performanceData.weight?.current - performanceData.weight?.target > 0 ? 
                      <MdTrendingUp className={tableStyles.trendDown} /> : 
                      <MdTrendingDown className={tableStyles.trendUp} />
                    }
                    <span>{Math.abs(performanceData.weight?.current - performanceData.weight?.target).toFixed(1)} kg</span>
                  </div>
                </div>
              </div>
              
              <div className={tableStyles.progressContainer}>
                <div 
                  className={tableStyles.progressBar} 
                  style={{ 
                    width: `${Math.min(100, (performanceData.weight?.current / performanceData.weight?.target) * 100)}%`
                  }}
                ></div>
              </div>
              
              <div className={tableStyles.chartContainer}>
                <WeightChart 
                  data={performanceData.weight || {}} 
                  labels={periodLabels[selectedPeriod]} 
                />
              </div>
              
              {performanceData.weight?.notes && (
                <div className={tableStyles.noteSection}>{performanceData.weight.notes}</div>
              )}
            </div>
          </div>
          
          {/* Hydratation */}
          <div className={tableStyles.kpiCard}>
            <div className={tableStyles.cardHeader}>
              <h3 className={tableStyles.cardTitle}>
                <span className={`${tableStyles.statusIndicator} ${getStatusClass(performanceData.hydration?.status)}`}></span>
                Hydratation <span className={tableStyles.cardIcon}>💧</span>
              </h3>
            </div>
            <div className={tableStyles.cardContent}>
              <div className={tableStyles.metricsRow}>
                <div className={tableStyles.metricCard}>
                  <span className={tableStyles.metricLabel}>Consommé</span>
                  <span className={tableStyles.currValue}>{performanceData.hydration?.current} L</span>
                </div>
                <div className={tableStyles.metricCard}>
                  <span className={tableStyles.metricLabel}>Objectif</span>
                  <span className={tableStyles.targetValue}>{performanceData.hydration?.target} L</span>
                </div>
                <div className={tableStyles.metricCard}>
                  <span className={tableStyles.metricLabel}>Progression</span>
                  <span className={tableStyles.targetValue}>
                    {Math.round((performanceData.hydration?.current / performanceData.hydration?.target) * 100)}%
                  </span>
                </div>
              </div>
              
              <div className={tableStyles.progressContainer}>
                <div 
                  className={tableStyles.progressBar} 
                  style={{ 
                    width: `${Math.min(100, (performanceData.hydration?.current / performanceData.hydration?.target) * 100)}%`
                  }}
                ></div>
              </div>
              
              <div className={tableStyles.chartContainer}>
                <HydrationChart 
                  data={performanceData.hydration || {}} 
                  labels={periodLabels[selectedPeriod]} 
                />
              </div>
              
              {performanceData.hydration?.notes && (
                <div className={tableStyles.noteSection}>{performanceData.hydration.notes}</div>
              )}
            </div>
          </div>
          
          {/* Calories */}
          <div className={tableStyles.kpiCard}>
            <div className={tableStyles.cardHeader}>
              <h3 className={tableStyles.cardTitle}>
                <span className={`${tableStyles.statusIndicator} ${getStatusClass(performanceData.calories?.status)}`}></span>
                Apport vs Dépense Calorique <span className={tableStyles.cardIcon}>🔥</span>
              </h3>
            </div>
            <div className={tableStyles.cardContent}>
              <div className={tableStyles.metricsRow}>
                <div className={tableStyles.metricCard}>
                  <span className={tableStyles.metricLabel}>Consommation</span>
                  <span className={tableStyles.currValue}>{performanceData.calories?.current} kcal</span>
                </div>
                <div className={tableStyles.metricCard}>
                  <span className={tableStyles.metricLabel}>Objectif</span>
                  <span className={tableStyles.targetValue}>{performanceData.calories?.target} kcal</span>
                </div>
                <div className={tableStyles.metricCard}>
                  <span className={tableStyles.metricLabel}>Dépense</span>
                  <span className={tableStyles.targetValue}>{performanceData.calories?.burn} kcal</span>
                </div>
              </div>
              
              <div className={tableStyles.chartContainer}>
                <CaloriesChart 
                  data={performanceData.calories || {}} 
                  labels={periodLabels[selectedPeriod]} 
                />
              </div>
              
              {performanceData.calories?.notes && (
                <div className={tableStyles.noteSection}>{performanceData.calories.notes}</div>
              )}
            </div>
          </div>
          
          {/* Macronutriments */}
          <div className={tableStyles.kpiCard}>
            <div className={tableStyles.cardHeader}>
              <h3 className={tableStyles.cardTitle}>
                <span className={`${tableStyles.statusIndicator} ${getStatusClass(performanceData.macros?.status)}`}></span>
                Macronutriments <span className={tableStyles.cardIcon}>🍗🥦🥑</span>
              </h3>
            </div>
            <div className={tableStyles.cardContent}>
              {Array.isArray(performanceData.macros?.items) && (
                <div className={tableStyles.dataTable}>
                  <table>
                    <thead>
                      <tr>
                        <th>Nutriment</th>
                        <th>Actuel</th>
                        <th>Objectif</th>
                        <th>Progression</th>
                      </tr>
                    </thead>
                    <tbody>
                      {performanceData.macros.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.label}</td>
                          <td><span className={tableStyles.metricValue}>{item.current}g</span></td>
                          <td>{item.target}g</td>
                          <td>
                            <div className={tableStyles.progressContainer} style={{ width: '60px', marginBottom: 0 }}>
                              <div 
                                className={tableStyles.progressBar} 
                                style={{ 
                                  width: `${Math.min(100, (item.current / item.target) * 100)}%`
                                }}
                              ></div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              <div className={tableStyles.chartContainer}>
                <MacrosChart 
                  data={performanceData.macros || {}} 
                  labels={periodLabels[selectedPeriod]} 
                />
              </div>
              
              {performanceData.macros?.notes && (
                <div className={tableStyles.noteSection}>{performanceData.macros.notes}</div>
              )}
            </div>
          </div>
          
          {/* Sommeil & Récupération */}
          {performanceData.sleep && (
            <div className={tableStyles.kpiCard}>
              <div className={tableStyles.cardHeader}>
                <h3 className={tableStyles.cardTitle}>
                  <span className={`${tableStyles.statusIndicator} ${getStatusClass(performanceData.sleep?.status)}`}></span>
                  Sommeil & Récupération <span className={tableStyles.cardIcon}>😴</span>
                </h3>
              </div>
              <div className={tableStyles.cardContent}>
                <div className={tableStyles.metricsRow}>
                  <div className={tableStyles.metricCard}>
                    <span className={tableStyles.metricLabel}>Durée</span>
                    <span className={tableStyles.currValue}>{performanceData.sleep?.current}h</span>
                  </div>
                  <div className={tableStyles.metricCard}>
                    <span className={tableStyles.metricLabel}>Objectif</span>
                    <span className={tableStyles.targetValue}>{performanceData.sleep?.target}h</span>
                  </div>
                  <div className={tableStyles.metricCard}>
                    <span className={tableStyles.metricLabel}>Qualité</span>
                    <span className={tableStyles.targetValue}>
                      {performanceData.sleep?.quality || '85%'}
                    </span>
                  </div>
                </div>
                
                <div className={tableStyles.dataTable}>
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Durée</th>
                        <th>Phases profondes</th>
                        <th>Qualité</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>26/03/2025</td>
                        <td>
                          <div className={tableStyles.dataCell}>
                            <span className={tableStyles.metricValue}>7.2h</span>
                          </div>
                        </td>
                        <td>2.1h</td>
                        <td>
                          <div className={tableStyles.progressContainer} style={{ width: '60px', marginBottom: 0 }}>
                            <div className={tableStyles.progressBar} style={{ width: '90%' }}></div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>25/03/2025</td>
                        <td>
                          <div className={tableStyles.dataCell}>
                            <span className={tableStyles.metricValue}>6.8h</span>
                          </div>
                        </td>
                        <td>1.9h</td>
                        <td>
                          <div className={tableStyles.progressContainer} style={{ width: '60px', marginBottom: 0 }}>
                            <div className={tableStyles.progressBar} style={{ width: '85%' }}></div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>24/03/2025</td>
                        <td>
                          <div className={tableStyles.dataCell}>
                            <span className={tableStyles.metricValue}>7.5h</span>
                          </div>
                        </td>
                        <td>2.3h</td>
                        <td>
                          <div className={tableStyles.progressContainer} style={{ width: '60px', marginBottom: 0 }}>
                            <div className={tableStyles.progressBar} style={{ width: '92%' }}></div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>23/03/2025</td>
                        <td>
                          <div className={tableStyles.dataCell}>
                            <span className={tableStyles.metricValue}>6.5h</span>
                          </div>
                        </td>
                        <td>1.8h</td>
                        <td>
                          <div className={tableStyles.progressContainer} style={{ width: '60px', marginBottom: 0 }}>
                            <div className={tableStyles.progressBar} style={{ width: '78%' }}></div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className={tableStyles.metricsRow} style={{ marginTop: '16px' }}>
                  <div className={tableStyles.metricCard}>
                    <span className={tableStyles.metricLabel}>Sommeil léger</span>
                    <span className={tableStyles.targetValue}>45%</span>
                  </div>
                  <div className={tableStyles.metricCard}>
                    <span className={tableStyles.metricLabel}>Sommeil profond</span>
                    <span className={tableStyles.targetValue}>30%</span>
                  </div>
                  <div className={tableStyles.metricCard}>
                    <span className={tableStyles.metricLabel}>Phase REM</span>
                    <span className={tableStyles.targetValue}>25%</span>
                  </div>
                </div>
                
                {performanceData.sleep?.notes && (
                  <div className={tableStyles.noteSection}>{performanceData.sleep.notes}</div>
                )}
              </div>
            </div>
          )}
          
          {/* Indicateurs Médicaux */}
          {performanceData.medical && (
            <div className={tableStyles.kpiCard}>
              <div className={tableStyles.cardHeader}>
                <h3 className={tableStyles.cardTitle}>
                  <span className={`${tableStyles.statusIndicator} ${getStatusClass(performanceData.medical?.status)}`}></span>
                  Indicateurs Médicaux <span className={tableStyles.cardIcon}>🩸</span>
                </h3>
              </div>
              <div className={tableStyles.cardContent}>
                <div className={tableStyles.medicalGrid}>
                  {Array.isArray(performanceData.medical?.datasets) && performanceData.medical.datasets.map((dataset, index) => {
                    const lastIndex = dataset.data.length - 1;
                    const lastValue = dataset.data[lastIndex];
                    
                    // Déterminer si la valeur est dans la plage normale
                    let statusClass = tableStyles.normal;
                    let isNormal = true;
                    
                    if (dataset.normal.includes('-')) {
                      const [min, max] = dataset.normal.split('-').map(v => +v);
                      isNormal = lastValue >= min && lastValue <= max;
                    } else if (dataset.normal.includes('>')) {
                      const threshold = +dataset.normal.replace('>', '');
                      isNormal = lastValue > threshold;
                    } else if (dataset.normal.includes('<')) {
                      const threshold = +dataset.normal.replace('<', '');
                      isNormal = lastValue < threshold;
                    }
                    
                    if (!isNormal) {
                      statusClass = Math.abs(dataset.data[lastIndex-1] - lastValue) > dataset.criticalThreshold 
                        ? tableStyles.alert
                        : tableStyles.warning;
                    }
                    
                    return (
                      <div key={index} className={tableStyles.medicalItem}>
                        <span className={tableStyles.medicalLabel}>{dataset.label}</span>
                        <div>
                          <span className={`${tableStyles.medicalValue} ${statusClass}`}>
                            {lastValue}
                          </span>
                          <span className={tableStyles.medicalUnit}> {dataset.unit}</span>
                        </div>
                        <span className={tableStyles.medicalRange}>
                          Normal: {dataset.normal} {dataset.unit}
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                {performanceData.medical?.notes && (
                  <div className={tableStyles.noteSection}>{performanceData.medical.notes}</div>
                )}
              </div>
            </div>
          )}
          
          {/* Nouveau tableau - Tendances Générales */}
          <div className={tableStyles.kpiCard}>
            <div className={tableStyles.cardHeader}>
              <h3 className={tableStyles.cardTitle}>
                <span className={`${tableStyles.statusIndicator} ${tableStyles.green}`}></span>
                Tendances Générales <span className={tableStyles.cardIcon}>📈</span>
              </h3>
            </div>
            <div className={tableStyles.cardContent}>
              <div className={tableStyles.dataTable}>
                <table>
                  <thead>
                    <tr>
                      <th>Indicateur</th>
                      <th>7 derniers jours</th>
                      <th>30 derniers jours</th>
                      <th>Tendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Poids</td>
                      <td>
                        <div className={tableStyles.dataCell}>
                          <span className={tableStyles.metricValue}>-0.8 kg</span>
                        </div>
                      </td>
                      <td>-2.3 kg</td>
                      <td>
                        <div className={tableStyles.metricTrend}>
                          <MdTrendingDown className={tableStyles.trendUp} />
                          <span>Positif</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Hydratation</td>
                      <td>
                        <div className={tableStyles.dataCell}>
                          <span className={tableStyles.metricValue}>+12%</span>
                        </div>
                      </td>
                      <td>+8%</td>
                      <td>
                        <div className={tableStyles.metricTrend}>
                          <MdTrendingUp className={tableStyles.trendUp} />
                          <span>Positif</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Calories</td>
                      <td>
                        <div className={tableStyles.dataCell}>
                          <span className={tableStyles.metricValue}>-120 kcal</span>
                        </div>
                      </td>
                      <td>-85 kcal</td>
                      <td>
                        <div className={tableStyles.metricTrend}>
                          <MdTrendingDown className={tableStyles.trendUp} />
                          <span>Positif</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Sommeil</td>
                      <td>
                        <div className={tableStyles.dataCell}>
                          <span className={tableStyles.metricValue}>+0.5h</span>
                        </div>
                      </td>
                      <td>+0.3h</td>
                      <td>
                        <div className={tableStyles.metricTrend}>
                          <MdTrendingUp className={tableStyles.trendUp} />
                          <span>Positif</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className={tableStyles.noteSection}>
                Ces tendances sont calculées par rapport à vos objectifs personnels et ajustées selon votre progression.
              </div>
            </div>
          </div>
          
        </div>
        
        {/* Tableau des données de performance */}
        <div className="kpi-grid" style={{ marginTop: '2rem' }}>
          <PerformanceTable 
            data={filteredHistory}
            onAdd={handleAddEntry}
            onView={handleViewEntry}
            onEdit={handleEditEntry}
            onDelete={handleDeleteEntry}
            selectedPatient={selectedPatient}
          />
        </div>
      </div>
      
      {/* Modales CRUD */}
      <PerformanceForm 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveEntry}
        patientId={selectedPatient?.id}
        isEditing={false}
      />
      
      <PerformanceForm 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEntry}
        initialData={selectedEntry}
        patientId={selectedPatient?.id}
        isEditing={true}
      />
      
      <PerformanceForm 
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        onSave={() => {}}
        initialData={selectedEntry}
        patientId={selectedPatient?.id}
        isEditing={false}
        readOnly={true}
      />
      
      <DeleteConfirmation 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        entryDate={selectedEntry ? formatDisplayDate(selectedEntry.date) : ''}
        loading={crudLoading}
      />
    </div>
  );
}
