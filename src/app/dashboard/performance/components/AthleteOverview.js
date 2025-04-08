'use client';

import React, { useState, useEffect } from 'react';
import { FaRunning, FaCalendarAlt, FaChartLine, FaExclamationTriangle, FaComment, FaInfoCircle } from 'react-icons/fa';
import { MdFitnessCenter, MdRestaurant, MdLocalHospital } from 'react-icons/md';
import { IoMdPulse } from 'react-icons/io';
import styles from './AthleteOverview.module.css';
import WeeklyRecapModal from './WeeklyRecapModal';

export default function AthleteOverview({ patient, period = 'week' }) {
  // État pour basculer entre statistiques et douleurs
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overviewData, setOverviewData] = useState(null);
  // État pour contrôler l'ouverture de la modale de récapitulatif
  const [isRecapModalOpen, setIsRecapModalOpen] = useState(false);
  
  // Effet pour charger les données de l'API
  useEffect(() => {
    async function fetchAthleteOverviewData() {
      if (!patient || !patient.id) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        console.log('Récupération des données AthleteOverview pour patient:', patient.id, 'période:', period);
        const response = await fetch(`/api/athlete-overview?patientId=${patient.id}&period=${period}`);
        
        if (!response.ok) {
          throw new Error(`Erreur lors de la récupération des données: ${response.status}`);
        }
        
        const data = await response.json();
        setOverviewData(data);
        console.log('Données récupérées pour AthleteOverview:', data);
      } catch (err) {
        console.error('Erreur lors du chargement des données du suivi athlète:', err);
        setError(err.message || 'Une erreur est survenue lors du chargement des données');
      } finally {
        setLoading(false);
      }
    }
    
    fetchAthleteOverviewData();
  }, [patient, period]);
  
  // Affichage pendant le chargement
  if (loading) {
    return (
      <div className={styles.athleteOverviewContainer}>
        <div className={styles.overviewHeader}>
          <h3 className={styles.overviewTitle}>
            <IoMdPulse className={styles.overviewIcon} />
            Vue Synthétique Professionnel
          </h3>
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '200px',
          width: '100%'
        }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid rgba(255, 136, 0, 0.3)', 
            borderTop: '4px solid #FF8800', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite' 
          }}></div>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }
  
  // Affichage en cas d'erreur
  if (error) {
    return (
      <div className={styles.athleteOverviewContainer}>
        <div className={styles.overviewHeader}>
          <h3 className={styles.overviewTitle}>
            <IoMdPulse className={styles.overviewIcon} />
            Vue Synthétique Professionnel
          </h3>
        </div>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          padding: '2rem',
          textAlign: 'center'
        }}>
          <FaExclamationTriangle size={30} style={{ color: '#FF8800', marginBottom: '1rem' }} />
          <p>Impossible de charger les données du suivi athlète.</p>
          <p style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: '0.5rem' }}>{error}</p>
        </div>
      </div>
    );
  }
  
  // Utiliser des données par défaut si les données de l'API ne sont pas disponibles
  const workoutData = overviewData?.workoutData || [];
  const stats = overviewData?.stats || {
    frequenceHebdo: 0,
    joursRepos: 7,
    chaineSollicitation: {
      push: 0, pull: 0, jambes: 0, core: 0, epaules: 0
    },
    douleurs: []
  };
  const painPoints = overviewData?.painPoints || [];
  const proComments = overviewData?.proComments || {
    alerts: [],
    comments: "Aucune donnée disponible pour le moment.",
    professional: ""
  };
  
  return (
    <div className={styles.athleteOverviewContainer}>
      <div className={styles.overviewHeader}>
        <h3 className={styles.overviewTitle}>
          <IoMdPulse className={styles.overviewIcon} />
          Vue Synthétique Professionnel
        </h3>
      </div>
      
      <div className={styles.sectionsContainer}>
        {/* Section gauche - Timeline et récapitulatif */}
        <div className={styles.sectionCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 className={styles.sectionTitle}>
              <FaCalendarAlt /> Récapitulatif semaine
            </h4>
            <button 
              className={styles.recapButton}
              onClick={() => {
                console.log("Ouverture de la modale de récapitulatif");
                setIsRecapModalOpen(true);
              }}
              title="Voir les détails et ajouter des notes"
            >
              <FaInfoCircle /> En savoir plus
            </button>
          </div>
          
          <div className={styles.timelineContainer}>
            {workoutData.map((day, index) => (
              <div className={styles.timelineDay} key={index}>
                <span className={styles.timelineDate}>{day.date}</span>
                {day.type ? (
                  <>
                    <span className={styles.workoutType}>{day.type}</span>
                    <span className={styles.workoutDuration}>{day.duration}</span>
                    
                    <div className={styles.muscleGroups}>
                      {Array.isArray(day.muscleGroups) && day.muscleGroups.map((muscle, idx) => (
                        <span className={styles.muscleTag} key={idx}>{muscle}</span>
                      ))}
                    </div>
                    
                    <div className={styles.fatigueLevel}>
                      <div 
                        className={styles.fatigueFill} 
                        style={{ width: `${day.fatigueLevel * 25}%` }}
                        title={`Niveau de fatigue: ${day.fatigueLevel}/5`}
                      />
                    </div>
                  </>
                ) : (
                  <span style={{ 
                    fontSize: '0.75rem', 
                    color: 'rgba(255,255,255,0.5)',
                    fontStyle: 'italic',
                    marginTop: '0.5rem'
                  }}>
                    Repos
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Section droite - Statistiques */}
        <div className={styles.sectionCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 className={styles.sectionTitle}>
              <FaChartLine /> Statistiques clés
            </h4>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => setActiveTab('stats')} 
                style={{ 
                  background: activeTab === 'stats' ? 'rgba(255, 136, 0, 0.3)' : 'rgba(40, 40, 55, 0.5)', 
                  border: 'none', 
                  borderRadius: '4px', 
                  padding: '0.25rem 0.5rem', 
                  fontSize: '0.75rem',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Stats
              </button>
              <button 
                onClick={() => setActiveTab('pain')} 
                style={{ 
                  background: activeTab === 'pain' ? 'rgba(255, 136, 0, 0.3)' : 'rgba(40, 40, 55, 0.5)', 
                  border: 'none', 
                  borderRadius: '4px', 
                  padding: '0.25rem 0.5rem', 
                  fontSize: '0.75rem',
                  color: 'white', 
                  cursor: 'pointer'
                }}
              >
                Douleurs
              </button>
            </div>
          </div>
          
          {activeTab === 'stats' ? (
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Fréquence hebdo</span>
                <span className={styles.statValue}>
                  <span className={styles.statHighlight}>{stats.frequenceHebdo}</span> sessions
                </span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Jours de repos</span>
                <span className={styles.statValue}>
                  <span className={styles.statHighlight}>{stats.joursRepos}</span> jours
                </span>
              </div>
              
              <div className={styles.statItem} style={{ gridColumn: '1 / 3' }}>
                <span className={styles.statLabel}>Sollicitation par chaîne musculaire</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                  {Object.entries(stats.chaineSollicitation).map(([chain, count], index) => (
                    <div key={index} style={{ textAlign: 'center' }}>
                      <div style={{ 
                        height: `${count * 8}px`, 
                        width: '20px', 
                        background: 'rgba(255, 136, 0, 0.5)', 
                        margin: '0 auto',
                        borderTopLeftRadius: '3px',
                        borderTopRightRadius: '3px'
                      }}></div>
                      <span style={{ fontSize: '0.65rem' }}>{chain}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.heatmapContainer}>
              <div className={styles.heatmapTitle}>Historique des douleurs</div>
              
              <div className={styles.bodyMap}>
                <div className={styles.bodyMapImage}>
                  {/* Silhouette simplifiée */}
                  <svg width="100" height="120" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M40,20 C40,13 45,10 50,10 C55,10 60,13 60,20 C60,27 55,30 50,30 C45,30 40,27 40,20 Z" fill="rgba(255,255,255,0.2)" />
                    <path d="M40,30 L40,60 L30,90 L35,90 L45,65 L50,65 L55,65 L65,90 L70,90 L60,60 L60,30 Z" fill="rgba(255,255,255,0.2)" />
                    <path d="M40,35 L30,55 L35,55 L40,40 Z" fill="rgba(255,255,255,0.2)" />
                    <path d="M60,35 L70,55 L65,55 L60,40 Z" fill="rgba(255,255,255,0.2)" />
                    <path d="M35,90 L33,110 L37,110 L38,90 Z" fill="rgba(255,255,255,0.2)" />
                    <path d="M65,90 L67,110 L63,110 L62,90 Z" fill="rgba(255,255,255,0.2)" />
                  </svg>
                  
                  {/* Points de douleur sur la silhouette */}
                  {painPoints.map((point, index) => (
                    <div 
                      key={index}
                      className={styles.painPoint}
                      style={{ 
                        top: point.top, 
                        left: point.left,
                        background: point.severity === 'high' 
                          ? 'rgba(255, 0, 0, 0.8)' 
                          : point.severity === 'medium' 
                            ? 'rgba(255, 165, 0, 0.8)' 
                            : 'rgba(255, 255, 0, 0.8)',
                        width: point.severity === 'high' ? '14px' : '10px',
                        height: point.severity === 'high' ? '14px' : '10px',
                      }}
                    />
                  ))}
                </div>
              </div>
              
              {stats.douleurs && stats.douleurs.length > 0 ? (
                <div style={{ marginTop: '0.5rem' }}>
                  {stats.douleurs.map((douleur, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      padding: '0.25rem 0',
                      borderBottom: index < stats.douleurs.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none'
                    }}>
                      <span style={{ fontSize: '0.8rem' }}>{douleur.zone}</span>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        background: douleur.occurrences > 2 ? 'rgba(255,82,82,0.2)' : 'rgba(255,193,7,0.2)', 
                        padding: '0.1rem 0.3rem',
                        borderRadius: '4px'
                      }}>
                        {douleur.occurrences}x
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '1rem 0',
                  fontSize: '0.85rem',
                  color: 'rgba(255,255,255,0.6)',
                  fontStyle: 'italic'
                }}>
                  Aucune zone de douleur signalée
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Zone commentaire pro / retour croisé */}
      <div className={styles.commentSection}>
        <h4 className={styles.commentTitle}>
          <FaComment /> Commentaire professionnel
        </h4>
        
        {proComments.alerts && proComments.alerts.length > 0 && (
          <div className={styles.alertBox}>
            <FaExclamationTriangle className={styles.alertIcon} style={{ marginRight: '0.5rem' }} />
            <span className={styles.alertText}>{proComments.alerts[0]}</span>
          </div>
        )}
        
        <div className={styles.commentBox}>
          {proComments.comments}
          {proComments.professional && (
            <div className={styles.proName}>{proComments.professional}</div>
          )}
        </div>
      </div>
      
      {/* Modale de récapitulatif hebdomadaire */}
      <WeeklyRecapModal 
        isOpen={isRecapModalOpen}
        onClose={() => setIsRecapModalOpen(false)}
        workoutData={overviewData?.last7Days || []}
        stats={overviewData?.stats || {}}
        patient={patient}
        period={period}
      />
    </div>
  );
}
