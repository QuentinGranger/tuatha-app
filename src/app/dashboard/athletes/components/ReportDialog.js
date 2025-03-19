'use client';

import { useState, useEffect } from 'react';
import Portal from '@/components/Portal';
import styles from './ReportDialog.module.css';

export default function ReportDialog({ isOpen, onClose, patient }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [selectedReportType, setSelectedReportType] = useState('complet');
  
  // Handle modal animation
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Réinitialiser l'état si on réouvre le modal
      if (reportData) {
        setReportData(null);
        setGeneratingReport(false);
      }
    } else {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300); // Match the animation duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  
  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  const generateReport = () => {
    setGeneratingReport(true);
    
    // Simulation d'une génération de rapport
    setTimeout(() => {
      const report = {
        patientInfo: {
          fullName: `${patient?.firstName || ''} ${patient?.lastName || ''}`,
          dateOfBirth: patient?.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString('fr-FR') : 'Non renseignée',
          age: patient?.dateOfBirth ? calculateAge(patient.dateOfBirth) : 'Non renseigné',
          gender: patient?.gender === 'male' ? 'Homme' : patient?.gender === 'female' ? 'Femme' : 'Non renseigné',
          contact: {
            phone: patient?.phone || 'Non renseigné',
            email: patient?.email || 'Non renseigné',
            address: patient?.address || 'Non renseignée'
          }
        },
        medicalInfo: patient?.medical ? {
          height: patient.medical.general?.height || 'Non renseignée',
          weight: patient.medical.general?.weight || 'Non renseigné',
          bmi: patient.medical.measurements?.bmi || 'Non renseigné',
          bloodType: patient.medical.general?.bloodType || 'Non renseigné',
          allergies: patient.medical.general?.allergies?.join(', ') || 'Aucune allergie connue',
          chronicConditions: patient.medical.general?.chronicConditions?.join(', ') || 'Aucune condition chronique connue'
        } : getMockMedicalInfo(),
        nutritionData: patient?.nutrition ? {
          goal: patient.nutrition.goal || 'Non défini',
          diet: patient.nutrition.diet || 'Régulier',
          restrictions: patient.nutrition.restrictions?.join(', ') || 'Aucune restriction',
          supplements: patient.nutrition.supplements?.join(', ') || 'Aucun supplément'
        } : getMockNutritionData(),
        performanceData: patient?.performance ? {
          mainSport: patient.performance.mainSport || 'Non spécifié',
          level: patient.performance.level || 'Amateur',
          recentResults: summarizePerformance(patient.performance.results) || 'Aucune donnée disponible'
        } : getMockPerformanceData(),
        recommendations: patient?.recommendations ? 
          formatRecommendations(patient.recommendations) : 
          getMockRecommendations(),
        medicalHistory: patient?.medical?.history ? 
          formatMedicalHistory(patient.medical.history) : 
          getMockMedicalHistory(),
        upcomingAppointments: patient?.appointments ? 
          formatAppointments(patient.appointments) : 
          getMockAppointments(),
        generatedOn: new Date().toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        generatedBy: 'Système Tuatha'
      };
      
      setReportData(report);
      setGeneratingReport(false);
    }, 1800);
  };
  
  const downloadReport = () => {
    // Créer un blob avec le contenu formaté
    const content = reportToText(reportData);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    
    // Créer un lien de téléchargement
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Rapport_${reportData.patientInfo.fullName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    
    // Déclencher le téléchargement
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const calculateAge = (dateOfBirth) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };
  
  const summarizePerformance = (results) => {
    if (!results || results.length === 0) return 'Aucune donnée disponible';
    
    const recentResults = results.slice(0, 3).map(result => 
      `${result.event} - ${result.position}${result.position === 1 ? 'er' : 'ème'} (${result.date})`
    ).join('; ');
    
    return recentResults;
  };
  
  const formatRecommendations = (recommendations) => {
    if (!recommendations || recommendations.length === 0) return ['Aucune recommandation disponible'];
    
    return recommendations.slice(0, 3).map(recommendation => 
      `${recommendation.title}: ${recommendation.content.substring(0, 100)}...`
    );
  };
  
  const formatMedicalHistory = (history) => {
    if (!history || history.length === 0) return ['Aucun historique médical disponible'];
    
    return history.map(entry => 
      `${entry.date} - ${entry.type}: ${entry.notes.substring(0, 100)}...`
    );
  };
  
  const formatAppointments = (appointments) => {
    if (!appointments || appointments.length === 0) return ['Aucun rendez-vous programmé'];
    
    const future = appointments.filter(appointment => new Date(appointment.date) > new Date());
    if (future.length === 0) return ['Aucun rendez-vous programmé'];
    
    return future.map(appointment => 
      `${appointment.date} - ${appointment.type} avec ${appointment.provider}`
    );
  };
  
  // Données fictives pour la démo
  const getMockMedicalInfo = () => ({
    height: '180 cm',
    weight: '75 kg',
    bmi: '23.1',
    bloodType: 'O+',
    allergies: 'Aucune allergie connue',
    chronicConditions: 'Aucune condition chronique connue'
  });
  
  const getMockNutritionData = () => ({
    goal: 'Maintien du poids, optimisation performances',
    diet: 'Équilibré, riche en protéines',
    restrictions: 'Aucune',
    supplements: 'Protéines whey, vitamines B, D, zinc'
  });
  
  const getMockPerformanceData = () => ({
    mainSport: 'Course à pied (marathon)',
    level: 'Semi-professionnel',
    recentResults: 'Marathon de Paris - 32ème (Avril 2023); 10km Vincennes - 5ème (Février 2023)'
  });
  
  const getMockRecommendations = () => [
    'Programme de récupération post-entraînement: Implémenter un protocole de récupération plus structuré incluant 15 minutes d\'étirements dynamiques...',
    'Ajustement nutrition pré-compétition: Augmenter l\'apport en glucides de 20% 3 jours avant l\'événement tout en maintenant la consommation de protéines...',
    'Modification technique course: Correction de l\'asymétrie dans la foulée qui pourrait être responsable des douleurs au genou...'
  ];
  
  const getMockMedicalHistory = () => [
    '10/11/2023 - Bilan Initial: Bilan de santé général excellent. Recommandation de suivi nutritionnel pour optimisation des performances sportives...',
    '15/12/2023 - Suivi Nutritionnel: Ajustement du plan alimentaire. Amélioration de l\'hydratation recommandée...'
  ];
  
  const getMockAppointments = () => [
    '15/04/2023 - Suivi Performance avec Coach Thomas',
    '22/05/2023 - Bilan Nutritionnel avec Dr. Martin'
  ];
  
  const reportToText = (report) => {
    if (!report) return '';
    
    return `
RAPPORT PATIENT - ${report.patientInfo.fullName}
Généré le ${report.generatedOn} par ${report.generatedBy}
====================================================================

INFORMATIONS PATIENT
-------------------
Nom complet: ${report.patientInfo.fullName}
Date de naissance: ${report.patientInfo.dateOfBirth}
Âge: ${report.patientInfo.age} ans
Sexe: ${report.patientInfo.gender}

Contact:
- Téléphone: ${report.patientInfo.contact.phone}
- Email: ${report.patientInfo.contact.email}
- Adresse: ${report.patientInfo.contact.address}

INFORMATIONS MÉDICALES
---------------------
Taille: ${report.medicalInfo.height}
Poids: ${report.medicalInfo.weight}
IMC: ${report.medicalInfo.bmi}
Groupe sanguin: ${report.medicalInfo.bloodType}
Allergies: ${report.medicalInfo.allergies}
Conditions chroniques: ${report.medicalInfo.chronicConditions}

NUTRITION
--------
Objectif: ${report.nutritionData.goal}
Régime: ${report.nutritionData.diet}
Restrictions alimentaires: ${report.nutritionData.restrictions}
Suppléments: ${report.nutritionData.supplements}

PERFORMANCE
----------
Sport principal: ${report.performanceData.mainSport}
Niveau: ${report.performanceData.level}
Résultats récents: ${report.performanceData.recentResults}

RECOMMANDATIONS
--------------
${report.recommendations.map(rec => `- ${rec}`).join('\n')}

HISTORIQUE MÉDICAL
----------------
${report.medicalHistory.map(hist => `- ${hist}`).join('\n')}

RENDEZ-VOUS À VENIR
-----------------
${report.upcomingAppointments.map(app => `- ${app}`).join('\n')}

====================================================================
Ce rapport est généré automatiquement et ne remplace pas l'avis d'un professionnel de santé.
Toutes les informations sont confidentielles et destinées uniquement à un usage professionnel.
`;
  };

  if (!isAnimating && !isOpen) {
    return null;
  }

  return (
    <Portal>
      <div 
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : styles.overlayHidden}`} 
        onClick={onClose}
        aria-modal="true"
        role="dialog"
      >
        <div 
          className={`${styles.dialog} ${isOpen ? styles.dialogVisible : styles.dialogHidden}`} 
          onClick={e => e.stopPropagation()}
        >
          <div className={styles.header}>
            <h2>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF8800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Rapport Patient: {patient?.firstName} {patient?.lastName}
            </h2>
            <button className={styles.closeButton} onClick={onClose} aria-label="Fermer">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div className={styles.content}>
            {!reportData ? (
              <div className={styles.reportOptions}>
                <h3>Générer un rapport patient</h3>
                <p className={styles.description}>
                  Le rapport contiendra un résumé des informations médicales, de nutrition, des performances et des recommandations 
                  pour ce patient. Vous pourrez télécharger le rapport une fois généré.
                </p>
                
                <div className={styles.optionsContainer}>
                  <h4>Type de rapport</h4>
                  <div className={styles.reportTypeOptions}>
                    <label className={styles.radioOption}>
                      <input 
                        type="radio" 
                        name="reportType" 
                        value="complet" 
                        checked={selectedReportType === 'complet'} 
                        onChange={() => setSelectedReportType('complet')}
                      />
                      <span className={styles.radioLabel}>Rapport complet</span>
                      <span className={styles.radioDescription}>Inclut toutes les informations disponibles sur le patient</span>
                    </label>
                    <label className={styles.radioOption}>
                      <input 
                        type="radio" 
                        name="reportType" 
                        value="medical" 
                        checked={selectedReportType === 'medical'} 
                        onChange={() => setSelectedReportType('medical')}
                      />
                      <span className={styles.radioLabel}>Rapport médical</span>
                      <span className={styles.radioDescription}>Focus sur l'historique médical et les recommandations</span>
                    </label>
                    <label className={styles.radioOption}>
                      <input 
                        type="radio" 
                        name="reportType" 
                        value="nutrition" 
                        checked={selectedReportType === 'nutrition'} 
                        onChange={() => setSelectedReportType('nutrition')}
                      />
                      <span className={styles.radioLabel}>Rapport nutritionnel</span>
                      <span className={styles.radioDescription}>Focus sur le plan nutritionnel et les performances</span>
                    </label>
                  </div>
                </div>
                
                <div className={styles.actions}>
                  <button className={styles.cancelButton} onClick={onClose}>
                    Annuler
                  </button>
                  <button 
                    className={styles.generateButton} 
                    onClick={generateReport}
                    disabled={generatingReport}
                  >
                    {generatingReport ? (
                      <>
                        <div className={styles.spinnerSmall}></div>
                        Génération en cours...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                          <path d="M14 3v5h5M9 13h6M9 17h6"/>
                        </svg>
                        Générer le rapport
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.reportPreview}>
                <div className={styles.reportHeader}>
                  <h3>Rapport généré avec succès</h3>
                  <p>Vous pouvez consulter le rapport ci-dessous ou le télécharger.</p>
                </div>
                
                <div className={styles.reportContent}>
                  <pre>{reportToText(reportData)}</pre>
                </div>
                
                <div className={styles.actions}>
                  <button className={styles.backButton} onClick={() => setReportData(null)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="19" y1="12" x2="5" y2="12"></line>
                      <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Revenir
                  </button>
                  <button className={styles.downloadButton} onClick={downloadReport}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Télécharger
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
}
