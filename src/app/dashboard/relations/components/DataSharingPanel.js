'use client';

import { useState } from 'react';
import { 
  FaShareAlt, FaChartLine, FaHeartbeat,
  FaAppleAlt, FaInfoCircle, FaCheck, FaToggleOn
} from 'react-icons/fa';
import styles from './DataSharingPanel.module.css';

const DataSharingPanel = ({ patient, professionals, selectedProfessional }) => {
  const [activeTab, setActiveTab] = useState('nutrition');
  const [sharingStatus, setSharingStatus] = useState({
    nutrition: true,
    biometrics: true,
    performance: false
  });
  
  // Données fictives pour la démo
  const nutritionData = [
    { id: 1, date: '28 Fév', calories: 2150, proteins: 120, carbs: 220, fats: 85 },
    { id: 2, date: '27 Fév', calories: 2050, proteins: 115, carbs: 210, fats: 80 },
    { id: 3, date: '26 Fév', calories: 2100, proteins: 118, carbs: 215, fats: 82 },
  ];
  
  const bioData = [
    { id: 1, date: '28 Fév', weight: 75, glucose: 95, cholesterol: 185, bp: '120/80' },
    { id: 2, date: '21 Fév', weight: 76, glucose: 92, cholesterol: 190, bp: '118/78' },
    { id: 3, date: '14 Fév', weight: 77, glucose: 98, cholesterol: 195, bp: '122/82' },
  ];
  
  const performanceData = [
    { id: 1, date: '28 Fév', vo2max: 48.5, strength: 75, endurance: 82, flex: 68 },
    { id: 2, date: '21 Fév', vo2max: 47.8, strength: 73, endurance: 80, flex: 67 },
    { id: 3, date: '14 Fév', vo2max: 47.2, strength: 72, endurance: 79, flex: 65 },
  ];
  
  const toggleSharing = (dataType) => {
    setSharingStatus(prev => ({
      ...prev,
      [dataType]: !prev[dataType]
    }));
  };
  
  if (!patient) {
    return (
      <div className={styles.emptyState}>
        <FaShareAlt size={40} className={styles.emptyStateIcon} />
        <p>Veuillez sélectionner un patient</p>
      </div>
    );
  }
  
  if (!selectedProfessional) {
    return (
      <div className={styles.emptyState}>
        <FaShareAlt size={40} className={styles.emptyStateIcon} />
        <p>Sélectionnez un professionnel pour voir les données partagées</p>
      </div>
    );
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          <FaShareAlt className={styles.titleIcon} />
          <h2>Partage avec {selectedProfessional.name}</h2>
        </div>
        <div className={styles.professionalBadge}>
          <span>{selectedProfessional.specialty}</span>
        </div>
      </div>
      
      <div className={styles.dataTabs}>
        <button 
          className={`${styles.dataTab} ${activeTab === 'nutrition' ? styles.activeDataTab : ''}`}
          onClick={() => setActiveTab('nutrition')}
        >
          <FaAppleAlt className={styles.tabIcon} />
          <span>Nutrition</span>
          <span className={`${styles.statusDot} ${sharingStatus.nutrition ? styles.shared : styles.notShared}`}></span>
        </button>
        <button 
          className={`${styles.dataTab} ${activeTab === 'biometrics' ? styles.activeDataTab : ''}`}
          onClick={() => setActiveTab('biometrics')}
        >
          <FaHeartbeat className={styles.tabIcon} />
          <span>Biométrie</span>
          <span className={`${styles.statusDot} ${sharingStatus.biometrics ? styles.shared : styles.notShared}`}></span>
        </button>
        <button 
          className={`${styles.dataTab} ${activeTab === 'performance' ? styles.activeDataTab : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          <FaChartLine className={styles.tabIcon} />
          <span>Performance</span>
          <span className={`${styles.statusDot} ${sharingStatus.performance ? styles.shared : styles.notShared}`}></span>
        </button>
      </div>
      
      <div className={styles.sharingControls}>
        <div className={styles.sharingStatus}>
          <span>
            {sharingStatus[activeTab] 
              ? <><FaCheck className={styles.statusIcon} /> Données partagées</>
              : <><FaInfoCircle className={styles.statusIconWarning} /> Non partagées</>
            }
          </span>
        </div>
        <button 
          className={`${styles.sharingToggle} ${sharingStatus[activeTab] ? styles.on : styles.off}`}
          onClick={() => toggleSharing(activeTab)}
        >
          <FaToggleOn className={styles.toggleIcon} />
          <span>{sharingStatus[activeTab] ? 'Arrêter' : 'Activer'}</span>
        </button>
      </div>
      
      <div className={styles.dataContent}>
        {activeTab === 'nutrition' && (
          <div className={sharingStatus.nutrition ? styles.dataVisible : styles.dataHidden}>
            <div className={styles.dataGridWrapper}>
              <h3 className={styles.sectionTitle}>Vue d'ensemble</h3>
              <div className={styles.dataGrid}>
                <div className={styles.dataCard}>
                  <p className={styles.dataTitle}>Calories</p>
                  <h3 className={styles.dataValue}>2100 kcal</h3>
                </div>
                <div className={styles.dataCard}>
                  <p className={styles.dataTitle}>Protéines</p>
                  <h3 className={styles.dataValue}>118 g</h3>
                </div>
                <div className={styles.dataCard}>
                  <p className={styles.dataTitle}>Glucides</p>
                  <h3 className={styles.dataValue}>215 g</h3>
                </div>
                <div className={styles.dataCard}>
                  <p className={styles.dataTitle}>Lipides</p>
                  <h3 className={styles.dataValue}>82 g</h3>
                </div>
              </div>
            </div>
            
            <div className={styles.tableSection}>
              <h3 className={styles.sectionTitle}>Journal alimentaire</h3>
              <div className={styles.tableContainer}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Kcal</th>
                      <th>Prot.</th>
                      <th>Gluc.</th>
                      <th>Lip.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nutritionData.map(day => (
                      <tr key={day.id}>
                        <td>{day.date}</td>
                        <td>{day.calories}</td>
                        <td>{day.proteins}g</td>
                        <td>{day.carbs}g</td>
                        <td>{day.fats}g</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'biometrics' && (
          <div className={sharingStatus.biometrics ? styles.dataVisible : styles.dataHidden}>
            <div className={styles.dataGridWrapper}>
              <h3 className={styles.sectionTitle}>Vue d'ensemble</h3>
              <div className={styles.dataGrid}>
                <div className={styles.dataCard}>
                  <p className={styles.dataTitle}>Poids</p>
                  <h3 className={styles.dataValue}>75 kg</h3>
                </div>
                <div className={styles.dataCard}>
                  <p className={styles.dataTitle}>Glycémie</p>
                  <h3 className={styles.dataValue}>95 mg/dL</h3>
                </div>
                <div className={styles.dataCard}>
                  <p className={styles.dataTitle}>Cholestérol</p>
                  <h3 className={styles.dataValue}>185 mg/dL</h3>
                </div>
                <div className={styles.dataCard}>
                  <p className={styles.dataTitle}>Tension</p>
                  <h3 className={styles.dataValue}>120/80</h3>
                </div>
              </div>
            </div>
            
            <div className={styles.tableSection}>
              <h3 className={styles.sectionTitle}>Historique</h3>
              <div className={styles.tableContainer}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Poids</th>
                      <th>Glyc.</th>
                      <th>Chol.</th>
                      <th>Tension</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bioData.map(day => (
                      <tr key={day.id}>
                        <td>{day.date}</td>
                        <td>{day.weight}</td>
                        <td>{day.glucose}</td>
                        <td>{day.cholesterol}</td>
                        <td>{day.bp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'performance' && (
          <div className={sharingStatus.performance ? styles.dataVisible : styles.dataHidden}>
            <div className={styles.dataGridWrapper}>
              <h3 className={styles.sectionTitle}>Vue d'ensemble</h3>
              <div className={styles.dataGrid}>
                <div className={styles.dataCard}>
                  <p className={styles.dataTitle}>VO2 Max</p>
                  <h3 className={styles.dataValue}>48.5</h3>
                </div>
                <div className={styles.dataCard}>
                  <p className={styles.dataTitle}>Force</p>
                  <h3 className={styles.dataValue}>75 %</h3>
                </div>
                <div className={styles.dataCard}>
                  <p className={styles.dataTitle}>Endurance</p>
                  <h3 className={styles.dataValue}>82 %</h3>
                </div>
                <div className={styles.dataCard}>
                  <p className={styles.dataTitle}>Flexibilité</p>
                  <h3 className={styles.dataValue}>68 %</h3>
                </div>
              </div>
            </div>
            
            <div className={styles.tableSection}>
              <h3 className={styles.sectionTitle}>Historique</h3>
              <div className={styles.tableContainer}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>VO2</th>
                      <th>Force</th>
                      <th>Endur.</th>
                      <th>Flex.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {performanceData.map(day => (
                      <tr key={day.id}>
                        <td>{day.date}</td>
                        <td>{day.vo2max}</td>
                        <td>{day.strength}%</td>
                        <td>{day.endurance}%</td>
                        <td>{day.flex}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {!sharingStatus[activeTab] && (
          <div className={styles.notSharedOverlay}>
            <div className={styles.notSharedContent}>
              <FaShareAlt size={40} className={styles.overlayIcon} />
              <h3>Données non partagées</h3>
              <p>Les données ne sont pas partagées avec {selectedProfessional.name}.</p>
              <button 
                className={styles.enableSharingButton}
                onClick={() => toggleSharing(activeTab)}
              >
                Activer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataSharingPanel;
