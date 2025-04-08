'use client';

import React, { useState, useEffect } from 'react';
import { 
  FaRunning, 
  FaCalendarAlt, 
  FaChartLine, 
  FaPaperPlane, 
  FaHistory,
  FaSave, 
  FaUser,
  FaUserMd
} from 'react-icons/fa';
import { MdFitnessCenter, MdLocalHospital } from 'react-icons/md';
import SimpleModal from './SimpleModal';
import styles from './WeeklyRecapModal.module.css';

export default function WeeklyRecapModal({ isOpen, onClose, workoutData, stats, patient, period }) {
  const [notes, setNotes] = useState('');
  const [shareWithAthlete, setShareWithAthlete] = useState(true);
  const [shareWithProfessionals, setShareWithProfessionals] = useState(true);
  const [notesHistory, setNotesHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedDays, setExpandedDays] = useState({});
  
  // Effet pour charger l'historique des notes
  useEffect(() => {
    if (isOpen && patient?.id) {
      // Dans une application réelle, vous chargeriez l'historique des notes depuis une API
      // Pour l'exemple, créons des notes fictives
      setNotesHistory([
        {
          id: '1',
          content: 'Excellente semaine avec une bonne progression sur les exercices de force. L\'athète maintient une bonne récupération entre les séances.',
          author: 'Tony Tony Chopper, Nutritionniste',
          date: '05 avril 2025',
          sharedWith: ['athlete', 'professionals']
        },
        {
          id: '2',
          content: 'L\'hydratation reste insuffisante pendant les séances de haute intensité. Recommandation d\'augmenter l\'apport liquidien de 0,5L pendant les entraînements.',
          author: 'Banner, Diététicien',
          date: '02 avril 2025',
          sharedWith: ['professionals']
        }
      ]);
    }
  }, [isOpen, patient]);
  
  // Générer des détails d'entraînement fictifs pour l'exemple
  const generateWorkoutDetails = (workoutType) => {
    if (!workoutType) return [];
    
    // Séances complètes par type d'entraînement
    const sessionsByType = {
      'Force': {
        title: 'Séance de renforcement musculaire',
        objectif: 'Développement de la force sur les groupes principaux',
        description: 'Séance complète axée sur les mouvements polyarticulaires avec charges progressives',
        coach: 'Tony Tony Chopper',
        lieu: 'Salle principale',
        équipement: ['Barres', 'Haltères', 'Bancs', 'Machines guidées', 'TRX'],
        exercices: [
          { name: 'Squats', series: 4, reps: '8-10', weight: '80kg' },
          { name: 'Développé couché', series: 3, reps: '10-12', weight: '60kg' },
          { name: 'Soulevé de terre', series: 3, reps: '8', weight: '100kg' },
          { name: 'Tractions', series: 3, reps: 'Jusqu\'à échec', weight: 'Poids de corps' }
        ],
        échauffement: '10 minutes de mobilité générale + 2 séries légères sur chaque exercice',
        méthodologie: 'Tempo 2-1-3-0, récupération 90s entre séries',
        métriques: {
          volumeTotal: '9600kg',
          intensitéRelative: '75%',
          EffortPerçu: '8/10',
          récupérationPost: 'Moyenne'
        }
      },
      'Endurance': {
        title: 'Développement cardio-vasculaire',
        objectif: 'Amélioration des capacités aérobiques',
        description: 'Travail mixte combinant endurance de base et séquences d\'intensité variable',
        coach: 'Banner',
        lieu: 'Parc + salle cardio',
        équipement: ['Tapis de course', 'Corde à sauter', 'Chronomètre'],
        exercices: [
          { name: 'Course', series: 1, reps: '30min', weight: 'N/A', note: 'Rythme modéré, 150 BPM' },
          { name: 'Corde à sauter', series: 3, reps: '2min', weight: 'N/A', note: 'Récup 60s' },
          { name: 'Burpees', series: 5, reps: '20', weight: 'N/A' }
        ],
        échauffement: '5 minutes de course légère + mobilité articulaire',
        méthodologie: 'Alternance 30min de zone 2 + 15min de fractionné',
        métriques: {
          distanceParcourue: '6.2km',
          vitesseMoyenne: '12.4km/h',
          FCMoyenne: '143bpm',
          caloriesBrûlées: '650'
        }
      },
      'Cardio': {
        title: 'Entraînement HIIT',
        objectif: 'Amélioration de la puissance aérobie et de la capacité de récupération',
        description: 'Séance haute intensité par intervalles visant à maximiser la dépense énergétique',
        coach: 'Tsunade',
        lieu: 'Salle fonctionnelle',
        équipement: ['Rameur', 'Vélo', 'Battle Ropes', 'Box de pliométrie'],
        exercices: [
          { name: 'HIIT', series: 8, reps: '30s on/30s off', weight: 'N/A' },
          { name: 'Vélo stationnaire', series: 1, reps: '20min', weight: 'N/A', note: 'Résistance moyenne' },
          { name: 'Battle ropes', series: 3, reps: '45s', weight: 'N/A' }
        ],
        échauffement: '7 minutes progressive avec mobilité dynamique',
        méthodologie: 'Tabata 20/10 + 3 rounds de circuit',
        métriques: {
          ratioEffortRécup: '1:1',
          FCMax: '180bpm',
          EPOCEstimé: 'Élevé',
          tempsZone5: '12min'
        }
      },
      'Mobilité': {
        title: 'Session Mobilité & Récupération Active',
        objectif: 'Amélioration des amplitudes articulaires et prévention des blessures',
        description: 'Travail ciblé sur les restrictions de mobilité identifiées lors du bilan fonctionnel',
        coach: 'Sanji',
        lieu: 'Salle de récupération',
        équipement: ['Foam roller', 'Bandes élastiques', 'Balles de massage', 'Tapis'],
        exercices: [
          { name: 'Stretching dynamique', series: 2, reps: '10 par mouvement', weight: 'N/A' },
          { name: 'Yoga', series: 1, reps: '15min', weight: 'N/A' },
          { name: 'Foam rolling', series: 1, reps: '5min par zone', weight: 'N/A' }
        ],
        échauffement: '5 minutes d\'activation légère',
        méthodologie: 'PNF + Stretching actif progressif',
        métriques: {
          améliorationMobilité: 'Hanches +12%, Épaules +8%',
          tempsPositionActive: '35min',
          tensionMusculaire: 'Diminuée',
          équilibrePostural: 'Amélioré'
        }
      },
      'Récupération': {
        title: 'Session de Récupération Complète',
        objectif: 'Optimisation de la récupération entre les séances intenses',
        description: 'Protocole complet combinant techniques actives et passives de récupération',
        coach: 'Tony Tony Chopper',
        lieu: 'Espace bien-être',
        équipement: ['Compression pneumatique', 'Tapis', 'Bacs eau froide/chaude'],
        exercices: [
          { name: 'Étirements passifs', series: 1, reps: '30s par position', weight: 'N/A' },
          { name: 'Marche légère', series: 1, reps: '15min', weight: 'N/A' },
          { name: 'Respiration profonde', series: 3, reps: '10 respirations', weight: 'N/A' }
        ],
        échauffement: 'Aucun',
        méthodologie: 'Contraste chaud/froid + mobilisation active légère',
        métriques: {
          HRV: 'Amélioré +15%',
          qualitéSommeil: 'Améliorée',
          sensationMusculaire: 'Diminution tensions -60%',
          marqueursBiologiques: 'Diminution CK et cortisol'
        }
      }
    };
    
    // Sélectionner la séance complète basée sur le type d'entraînement
    const session = sessionsByType[workoutType] || sessionsByType['Force'];
    
    // Ajouter des métriques de performance
    return {
      ...session,
      exercices: session.exercices.map(ex => ({
        ...ex,
        performance: Math.random() > 0.7 ? 'En progrès' : Math.random() > 0.5 ? 'Stable' : 'Difficile',
        intensité: Math.floor(Math.random() * 3) + 3 // Sur 5
      }))
    };
  };
  
  // Fonction pour basculer l'état d'expansion d'un jour
  const toggleDayExpansion = (index) => {
    setExpandedDays(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  const handleSaveNotes = async () => {
    if (!notes.trim()) return;
    
    setLoading(true);
    // Simuler une requête API
    setTimeout(() => {
      // Ajouter la nouvelle note à l'historique
      const newNote = {
        id: `note-${Date.now()}`,
        content: notes,
        author: 'Vous',
        date: new Date().toLocaleDateString('fr-FR', { 
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }),
        sharedWith: [
          ...(shareWithAthlete ? ['athlete'] : []),
          ...(shareWithProfessionals ? ['professionals'] : [])
        ]
      };
      
      setNotesHistory([newNote, ...notesHistory]);
      setNotes('');
      setLoading(false);
    }, 1000);
  };
  
  const getDayLabel = (index, period) => {
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    return days[index];
  };
  
  // Si aucune donnée n'est disponible
  if (!workoutData || !stats) {
    return (
      <SimpleModal
        isOpen={isOpen}
        onClose={onClose}
        title="Récapitulatif de la semaine"
        size="large"
      >
        <div className={styles.emptySummary}>
          Aucune donnée disponible pour ce récapitulatif.
        </div>
      </SimpleModal>
    );
  }
  
  return (
    <SimpleModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Récapitulatif hebdomadaire pour ${patient?.name || 'l\'athlète'}`}
      size="large"
      footer={
        <div className={styles.buttonGroup}>
          <button 
            className={styles.button} 
            onClick={onClose}
          >
            Fermer
          </button>
          <button 
            className={`${styles.button} ${styles.primary}`} 
            onClick={handleSaveNotes}
            disabled={!notes.trim() || loading}
          >
            {loading ? 'Enregistrement...' : (
              <>
                <FaSave /> Enregistrer
              </>
            )}
          </button>
        </div>
      }
    >
      <div className={styles.modalContent}>
        {/* Statistiques */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <FaChartLine /> Aperçu de la semaine
          </h3>
          <div className={styles.weekSummary}>
            <div className={styles.statCard}>
              <p className={styles.statValue}>{stats.frequenceHebdo}</p>
              <p className={styles.statLabel}>Jours d'entraînement</p>
            </div>
            <div className={styles.statCard}>
              <p className={styles.statValue}>{stats.joursRepos}</p>
              <p className={styles.statLabel}>Jours de repos</p>
            </div>
            <div className={styles.statCard}>
              <p className={styles.statValue}>
                {Object.values(stats.chaineSollicitation).reduce((a, b) => a + b, 0)}
              </p>
              <p className={styles.statLabel}>Exercices totaux</p>
            </div>
            <div className={styles.statCard}>
              <p className={styles.statValue}>{stats.douleurs.length}</p>
              <p className={styles.statLabel}>Zones de douleur</p>
            </div>
          </div>
          
          {/* Répartition des douleurs si présentes */}
          {stats.douleurs.length > 0 && (
            <div className={styles.painLevel}>
              {stats.douleurs.map((douleur, idx) => (
                <div key={idx} className={styles.painPoint}>
                  <span 
                    className={`${styles.painCircle} ${
                      douleur.occurrences > 2 ? styles.high : 
                      douleur.occurrences > 1 ? styles.medium : styles.low
                    }`}
                  />
                  <div>{douleur.zone}</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                    {douleur.occurrences}x
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Timeline des entraînements */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <MdFitnessCenter /> Détail des entraînements
          </h3>
          <div className={styles.workoutTimeline}>
            {workoutData.map((day, idx) => (
              <div key={idx} className={styles.workoutDay}>
                <div className={styles.dayLabel}>{getDayLabel(idx, period)}</div>
                {day.type ? (
                  <div className={styles.workoutDetails}>
                    <span className={styles.workoutType}>{day.type}</span>
                    <div className={styles.workoutMuscles}>
                      {Array.isArray(day.muscleGroups) ? 
                        day.muscleGroups.map((muscle, i) => (
                          <span key={i} className={styles.muscleTag}>{muscle}</span>
                        )) : 
                        <span className={styles.muscleTag}>{day.muscleGroups}</span>
                      }
                    </div>
                  </div>
                ) : (
                  <div className={styles.workoutDetails}>
                    <span style={{ fontStyle: 'italic', opacity: 0.7 }}>Jour de repos</span>
                  </div>
                )}
                {day.type && (
                  <div className={styles.workoutActions}>
                    <div className={styles.workoutDuration}>{day.duration}</div>
                    <button 
                      className={styles.detailsToggle}
                      onClick={() => toggleDayExpansion(idx)}
                    >
                      {expandedDays[idx] ? 'Masquer' : 'Détails'}
                    </button>
                  </div>
                )}
                
                {/* Détails étendus de l'entrainement */}
                {day.type && expandedDays[idx] && (
                  <div className={styles.expandedDetails}>
                    <h5 className={styles.detailsTitle}>Détails de l'entraînement</h5>
                    
                    {/* Informations générales sur la séance */}
                    {(() => {
                      const sessionDetails = generateWorkoutDetails(day.type);
                      return (
                        <>
                          <div className={styles.sessionHeader}>
                            <h4 className={styles.sessionTitle}>{sessionDetails.title}</h4>
                            <div className={styles.sessionMeta}>
                              <span><strong>Coach:</strong> {sessionDetails.coach}</span>
                              <span><strong>Lieu:</strong> {sessionDetails.lieu}</span>
                            </div>
                          </div>
                          
                          <div className={styles.sessionDescription}>
                            <p><strong>Objectif:</strong> {sessionDetails.objectif}</p>
                            <p>{sessionDetails.description}</p>
                          </div>
                          
                          <div className={styles.methodologySection}>
                            <div className={styles.methodItem}>
                              <span className={styles.methodLabel}>Échauffement</span>
                              <span className={styles.methodValue}>{sessionDetails.échauffement}</span>
                            </div>
                            <div className={styles.methodItem}>
                              <span className={styles.methodLabel}>Méthodologie</span>
                              <span className={styles.methodValue}>{sessionDetails.méthodologie}</span>
                            </div>
                          </div>
                          
                          <div className={styles.equipmentSection}>
                            <span className={styles.equipmentLabel}>Équipement utilisé:</span>
                            <div className={styles.equipmentTags}>
                              {sessionDetails.équipement.map((item, i) => (
                                <span key={i} className={styles.equipmentTag}>{item}</span>
                              ))}
                            </div>
                          </div>
                        </>
                      );
                    })()}
                    
                    <div className={styles.workoutMetrics}>
                      <div className={styles.metricItem}>
                        <span className={styles.metricLabel}>Durée</span>
                        <span className={styles.metricValue}>{day.duration}</span>
                      </div>
                      <div className={styles.metricItem}>
                        <span className={styles.metricLabel}>Niveau de fatigue</span>
                        <div className={styles.fatigueBar}>
                          <div 
                            className={styles.fatigueFill} 
                            style={{ width: `${day.fatigueLevel * 20}%` }}
                          />
                          <span>{day.fatigueLevel}/5</span>
                        </div>
                      </div>
                      <div className={styles.metricItem}>
                        <span className={styles.metricLabel}>Intensité</span>
                        <span className={styles.metricValue}>Moyenne</span>
                      </div>
                    </div>
                    
                    {/* Tableau des exercices */}
                    <div className={styles.exercisesList}>
                      <h6 className={styles.exercisesTitle}>Programme d'exercices</h6>
                      <table className={styles.exercisesTable}>
                        <thead>
                          <tr>
                            <th>Exercice</th>
                            <th>Séries</th>
                            <th>Répétitions</th>
                            <th>Charge</th>
                            <th>Performance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {generateWorkoutDetails(day.type).exercices.map((exercise, i) => (
                            <tr key={i} className={
                              exercise.performance === 'En progrès' 
                                ? styles.performanceProgress 
                                : exercise.performance === 'Difficile' 
                                  ? styles.performanceDifficult 
                                  : ''
                            }>
                              <td>{exercise.name}</td>
                              <td>{exercise.series}</td>
                              <td>{exercise.reps}</td>
                              <td>{exercise.weight}</td>
                              <td>
                                <span className={styles.performanceIndicator}>
                                  {exercise.performance}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Métriques de performance */}
                    <div className={styles.performanceMetrics}>
                      <h6 className={styles.metricsTitle}>Métriques de performance</h6>
                      <div className={styles.metricsGrid}>
                        {(() => {
                          const metrics = generateWorkoutDetails(day.type).métriques;
                          return Object.entries(metrics).map(([key, value], i) => (
                            <div key={i} className={styles.metricBlock}>
                              <span className={styles.metricBlockLabel}>{key}</span>
                              <span className={styles.metricBlockValue}>{value}</span>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                    
                    {day.type !== 'Récupération' && (
                      <div className={styles.workoutNotes}>
                        <h6>Notes d'entraînement</h6>
                        <p>
                          {day.type === 'Force' 
                            ? 'Progression sur les charges. Attention à la technique sur les dernières répétitions.'
                            : day.type === 'Endurance'
                            ? 'Bonne gestion du cardio. Continuer à travailler sur le maintien du rythme.'
                            : day.type === 'Mobilité'
                            ? 'Amélioration de l\'amplitude sur les hanches. Continuer à travailler les épaules.'
                            : 'Bon niveau d\'intensité maintenu tout au long de la séance.'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Section des notes */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <FaPaperPlane /> Ajouter des notes
          </h3>
          <div className={styles.notesSection}>
            <textarea 
              className={styles.textarea}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ajoutez vos observations et recommandations pour cette semaine d'entraînement..."
            />
            
            <div className={styles.shareOptions}>
              <label className={styles.checkbox}>
                <input 
                  type="checkbox" 
                  checked={shareWithAthlete}
                  onChange={(e) => setShareWithAthlete(e.target.checked)}
                />
                <span><FaUser /> Partager avec l'athlète</span>
              </label>
              <label className={styles.checkbox}>
                <input 
                  type="checkbox"
                  checked={shareWithProfessionals}
                  onChange={(e) => setShareWithProfessionals(e.target.checked)}
                />
                <span><FaUserMd /> Partager avec les professionnels</span>
              </label>
            </div>
          </div>
        </div>
        
        {/* Historique des notes */}
        {notesHistory.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <FaHistory /> Historique des notes
            </h3>
            <div className={styles.historySection}>
              {notesHistory.map((note) => (
                <div key={note.id} className={styles.historyItem}>
                  <div className={styles.historyHeader}>
                    <span className={styles.historyAuthor}>{note.author}</span>
                    <span className={styles.historyDate}>{note.date}</span>
                  </div>
                  <div className={styles.historyContent}>{note.content}</div>
                  <div className={styles.sharedWith}>
                    {note.sharedWith.includes('athlete') && (
                      <span className={styles.shareTag}>
                        <FaUser /> Athlète
                      </span>
                    )}
                    {note.sharedWith.includes('professionals') && (
                      <span className={styles.shareTag}>
                        <FaUserMd /> Professionnels
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SimpleModal>
  );
}
