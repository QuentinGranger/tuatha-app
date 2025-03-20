'use client';

import { useState, useEffect } from 'react';
import prisma from '../../../lib/prisma';
import NetworkMap from './components/NetworkMap';
import ProfessionalDetail from './components/ProfessionalDetail';
import CommunicationPanel from './components/CommunicationPanel';
import CollaborativeActionPanel from './components/CollaborativeActionPanel';
import DataSharingPanel from './components/DataSharingPanel';
import PatientSelectorRelations from './components/PatientSelectorRelations';
import HealthProfessionalsList from './components/HealthProfessionalsList';
import WelcomeModal from './components/WelcomeModal';
import ConsentBlockModal from './components/ConsentBlockModal';
import ConsentRequestModal from './components/ConsentRequestModal';
import ConsentResponseModal from './components/ConsentResponseModal';
import styles from './page.module.css';

export default function Relations() {
  // États pour les données
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [professionals, setProfessionals] = useState([]);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // États pour la navigation
  const [activeTab, setActiveTab] = useState('network');
  
  // État pour la modale d'accueil
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  
  // État pour la modale de blocage pour patient sans consentement
  const [showConsentBlockModal, setShowConsentBlockModal] = useState(false);
  const [patientConsents, setPatientConsents] = useState({});
  
  // État pour la modale de demande de consentement
  const [showConsentRequestModal, setShowConsentRequestModal] = useState(false);
  
  // État pour la modale de réponse de consentement
  const [showConsentResponseModal, setShowConsentResponseModal] = useState(false);
  const [consentResponseType, setConsentResponseType] = useState('accept'); // 'accept' ou 'decline'

  // Vérifier si la modale d'accueil doit être affichée
  useEffect(() => {
    // Vérifier si l'utilisateur a déjà vu la modale
    const hasSeenWelcome = localStorage.getItem('tuatha_collaboration_consent_seen') === 'true';
    setShowWelcomeModal(!hasSeenWelcome);
    
    // Bloquer le défilement du body quand la modale est ouverte
    if (!hasSeenWelcome) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'auto';
      };
    }
  }, []);

  // Chargement initial des patients
  useEffect(() => {
    async function loadPatients() {
      try {
        const patientsData = await prisma.patient.findMany();
        setPatients(patientsData);
        
        // Simuler des données de consentement aléatoires pour les patients
        const consentData = {};
        patientsData.forEach(patient => {
          // Assigner aléatoirement un statut de consentement pour la démo
          consentData[patient.id] = Math.random() > 0.3;
        });
        setPatientConsents(consentData);
        
        // Sélectionner automatiquement le premier patient
        if (patientsData.length > 0) {
          // Utiliser handlePatientChange pour la cohérence
          handlePatientChange(patientsData[0].id);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadPatients();
  }, []);

  // Fonction pour charger les professionnels d'un patient
  const loadPatientProfessionals = async (patientId) => {
    try {
      // On récupère les professionnels à partir des relations (simulé dans le mock Prisma)
      // Dans une vraie implémentation, on utiliserait:
      // const healthTeam = await prisma.patientHealthProfessional.findMany({
      //   where: { patientId: patientId },
      //   include: { HealthProfessional: { include: { user: true } } },
      // });
      
      // Comme on a un mock Prisma, on va adapter la requête
      const allProfessionals = await prisma.healthProfessional.findMany({
        include: { user: true }
      });
      
      // Simuler une relation entre patients et professionnels basée sur un pattern
      // Par exemple, supposons que chaque patient est suivi par 2-3 professionnels choisis aléatoirement
      // Dans notre cas, on utilisera un pattern prévisible pour la démo:
      // - Le premier patient est suivi par les professionnels 1 et 3
      // - Le deuxième patient est suivi par les professionnels 2 et 4
      // etc.
      
      const patientIndex = parseInt(patientId.replace('pat-', '')) - 1;
      const professionalIndices = [
        (patientIndex % 4) + 1,
        ((patientIndex + 2) % 4) + 1
      ];
      
      const patientProfessionals = allProfessionals.filter(pro => 
        professionalIndices.includes(parseInt(pro.id.replace('hp-', '')))
      );
      
      setProfessionals(patientProfessionals);
      
      // Sélectionner le premier professionnel s'il y en a
      if (patientProfessionals.length > 0) {
        setSelectedProfessional(patientProfessionals[0]);
      } else {
        setSelectedProfessional(null);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des professionnels:', error);
      setProfessionals([]);
      setSelectedProfessional(null);
    }
  };

  // Fonction pour charger les professionnels d'un patient sans vérifier le consentement
  const loadPatientProfessionalsWithoutConsent = async (patientId) => {
    try {
      setLoading(true);
      
      // Comme on a un mock Prisma, on va adapter la requête
      const allProfessionals = await prisma.healthProfessional.findMany({
        include: { user: true }
      });
      
      // Simuler une relation entre patients et professionnels
      const patientIndex = parseInt(patientId.replace('pat-', '')) - 1;
      const professionalIndices = [
        (patientIndex % 4) + 1,
        ((patientIndex + 2) % 4) + 1
      ];
      
      const patientProfessionals = allProfessionals.filter(pro => 
        professionalIndices.includes(parseInt(pro.id.replace('hp-', '')))
      );
      
      setProfessionals(patientProfessionals);
      
      // Sélectionner le premier professionnel s'il y en a
      if (patientProfessionals.length > 0) {
        setSelectedProfessional(patientProfessionals[0]);
      } else {
        setSelectedProfessional(null);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des professionnels:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour changer de patient
  const handlePatientChange = async (patientId) => {
    if (!patientId) {
      setSelectedPatient(null);
      setProfessionals([]);
      setSelectedProfessional(null);
      return;
    }

    try {
      setLoading(true);
      
      // Trouver le patient sélectionné
      const patient = patients.find(p => p.id === patientId);
      setSelectedPatient(patient);
      
      // Vérifier le consentement du patient
      const hasConsent = patientConsents[patientId] || false;
      setShowConsentBlockModal(!hasConsent);
      
      // Si pas de consentement, afficher la modale et ne pas charger les données
      if (!hasConsent) {
        setLoading(false);
        return; // Ne pas charger les professionnels
      }
      
      // Comme on a un mock Prisma, on va adapter la requête
      const allProfessionals = await prisma.healthProfessional.findMany({
        include: { user: true }
      });
      
      // Simuler une relation entre patients et professionnels basée sur un pattern
      // Par exemple, supposons que chaque patient est suivi par 2-3 professionnels choisis aléatoirement
      // Dans notre cas, on utilisera un pattern prévisible pour la démo:
      // - Le premier patient est suivi par les professionnels 1 et 3
      // - Le deuxième patient est suivi par les professionnels 2 et 4
      // etc.
      
      const patientIndex = parseInt(patientId.replace('pat-', '')) - 1;
      const professionalIndices = [
        (patientIndex % 4) + 1,
        ((patientIndex + 2) % 4) + 1
      ];
      
      const patientProfessionals = allProfessionals.filter(pro => 
        professionalIndices.includes(parseInt(pro.id.replace('hp-', '')))
      );
      
      setProfessionals(patientProfessionals);
      
      // Sélectionner le premier professionnel s'il y en a
      if (patientProfessionals.length > 0) {
        setSelectedProfessional(patientProfessionals[0]);
      } else {
        setSelectedProfessional(null);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du patient:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour sélectionner un professionnel
  const handleSelectProfessional = (professionalId) => {
    console.log('handleSelectProfessional appelé avec ID:', professionalId);
    // Vérifier que l'ID n'est pas déjà sélectionné pour éviter des re-rendus inutiles
    if (selectedProfessional?.id === professionalId) {
      console.log('Ce professionnel est déjà sélectionné');
      return;
    }
    
    const professional = professionals.find(pro => pro.id === professionalId);
    console.log('Professionnel trouvé:', professional);
    
    if (professional) {
      // Forcer la mise à jour de l'état pour garantir un re-rendu
      setSelectedProfessional(null); // D'abord vider l'état
      
      // Utiliser setTimeout pour s'assurer que le changement d'état est bien appliqué
      setTimeout(() => {
        setSelectedProfessional(professional);
        console.log('selectedProfessional défini à:', professional);
      }, 50);
    } else {
      console.error('Professionnel non trouvé avec l\'ID:', professionalId);
      console.log('Liste des professionnels disponibles:', professionals);
    }
  };

  // Fonction pour gérer le changement d'onglet
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Fonction pour fermer la modale d'accueil
  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false);
    localStorage.setItem('tuatha_collaboration_consent_seen', 'true');
    document.body.style.overflow = 'auto';
  };

  // Fonction pour rouvrir la modale d'accueil
  const handleReopenWelcomeModal = () => {
    setShowWelcomeModal(true);
    document.body.style.overflow = 'hidden';
  };
  
  // Fonction pour demander le consentement au patient
  const handleRequestConsent = () => {
    // NE PAS fermer la modale de blocage immédiatement
    // On la laisse ouverte pendant que l'utilisateur attend la réponse du patient
    
    // Afficher la modale de demande de consentement
    setShowConsentRequestModal(true);
    
    // Après 3 secondes, la modale de demande se ferme automatiquement (par le composant)
    
    // Simuler la mise à jour du statut de consentement après un délai
    setTimeout(() => {
      if (selectedPatient) {
        // Décider aléatoirement si le consentement est accepté ou refusé (pour la démo)
        const isAccepted = Math.random() > 0.3; // 70% de chance d'acceptation
        
        if (isAccepted) {
          // Mise à jour du statut de consentement
          setPatientConsents(prev => ({
            ...prev,
            [selectedPatient.id]: true
          }));
          
          // Envoyer une notification concernant la réponse du patient
          addNotificationToTopbar({
            title: 'Consentement accordé',
            message: `${selectedPatient?.user?.firstName} ${selectedPatient?.user?.lastName} a accepté votre demande de consentement. Vous pouvez maintenant accéder à ses données.`,
            type: 'urgent',
            priority: 'high'
          });
          
          setConsentResponseType('accept');
          
          // Fermer DÉFINITIVEMENT la modale de blocage puisque le consentement a été accordé
          setShowConsentBlockModal(false);
          
          // Afficher la modale de réponse
          setShowConsentResponseModal(true);
          
          // Charger les données du patient
          loadPatientProfessionalsWithoutConsent(selectedPatient.id);
        } else {
          // Notification de refus
          addNotificationToTopbar({
            title: 'Consentement refusé',
            message: `${selectedPatient?.user?.firstName} ${selectedPatient?.user?.lastName} a refusé votre demande de consentement.`,
            type: 'urgent',
            priority: 'high'
          });
          
          setConsentResponseType('decline');
          
          // Afficher la modale de réponse mais GARDER la modale de blocage active
          // car le consentement a été refusé
          setShowConsentResponseModal(true);
          
          // Ne pas fermer la modale de blocage ici car le consentement a été refusé
          // L'utilisateur devra soit réessayer, soit choisir un autre patient
        }
      }
    }, 15000); // 15 secondes après la demande
  };

  // Fonction pour gérer la fermeture de la modale de blocage
  const handleCloseConsentModal = () => {
    setShowConsentBlockModal(false);
    
    // Revenez au patient précédent qui avait un consentement ou désélectionnez complètement
    const patientWithConsent = patients.find(p => patientConsents[p.id]);
    if (patientWithConsent) {
      handlePatientChange(patientWithConsent.id);
    } else {
      // Si aucun patient n'a de consentement, désélectionnez tout
      setSelectedPatient(null);
      setProfessionals([]);
      setSelectedProfessional(null);
    }
  };

  // Fonction pour ajouter une notification à la topbar
  const addNotificationToTopbar = (notificationData) => {
    // Trouver l'élément global pour les notifications (s'il existe)
    if (typeof window !== 'undefined') {
      // Créer un événement personnalisé avec les données de notification
      const event = new CustomEvent('tuatha-notification', { 
        detail: notificationData 
      });
      
      // Dispatch l'événement sur window pour qu'il puisse être capturé par Topbar
      window.dispatchEvent(event);
      
      console.log('Notification envoyée:', notificationData);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Relations Interprofessionnelles</h1>
      <div className={styles.actionsBar}>
        <button 
          className={styles.consentModalButton}
          onClick={handleReopenWelcomeModal}
          title="Revoir les informations de consentement"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM12 20C16.418 20 20 16.418 20 12C20 7.582 16.418 4 12 4C7.582 4 4 7.582 4 12C4 16.418 7.582 20 12 20ZM12 5C13.6569 5 15 6.34315 15 8C15 9.65685 13.6569 11 12 11C10.3431 11 9 9.65685 9 8C9 6.34315 10.3431 5 12 5ZM12 13C14.6111 13 16.8224 14.2822 17.6383 16.175C16.7008 17.3181 15.4233 18.1733 13.9588 18.6174C13.3228 17.6723 12.2259 17 11 17C9.77412 17 8.67721 17.6723 8.04123 18.6174C6.57674 18.1733 5.29917 17.3181 4.36172 16.175C5.17762 14.2822 7.38886 13 10 13H12Z" fill="currentColor"/>
        </svg>
          Consentement
        </button>
      </div>

      {/* Sélecteur de patient */}
      <div className={styles.patientSelection}>
        <PatientSelectorRelations 
          patients={patients} 
          selectedPatientId={selectedPatient?.id} 
          onPatientChange={handlePatientChange}
          patientConsents={patientConsents}
        />
      </div>
      
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Chargement des données...</p>
        </div>
      ) : !selectedPatient ? (
        <div className={styles.noSelection}>
          <h2>Bienvenue dans l'espace Relations</h2>
          <p>
            Explorez et gérez les relations interprofessionnelles pour assurer une prise en charge optimale de vos patients.
            Sélectionnez un patient pour commencer.
          </p>
          
          <div className={styles.selectionSteps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h3 className={styles.stepTitle}>Sélection du patient</h3>
              <p className={styles.stepDescription}>Choisissez un patient dans le menu déroulant en haut de la page.</p>
            </div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h3 className={styles.stepTitle}>Vision du réseau</h3>
              <p className={styles.stepDescription}>Visualisez les professionnels impliqués dans le parcours de soins.</p>
            </div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h3 className={styles.stepTitle}>Collaboration</h3>
              <p className={styles.stepDescription}>Explorez les différents modes de collaboration et partagez des informations.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.relationsLayout}>
          {/* Colonne de gauche: liste des professionnels */}
          <div className={styles.sidebarColumn}>
            <div className={styles.professionalsSidebar}>
              <HealthProfessionalsList 
                professionals={professionals} 
                selectedProfessionalId={selectedProfessional?.id}
                onProfessionalSelect={handleSelectProfessional}
              />
            </div>
          </div>
          
          {/* Colonne principale: contenu */}
          <div className={styles.mainColumn}>
            <div className={styles.contentPanel}>
              {/* Modale de blocage pour patient sans consentement */}
              {showConsentBlockModal && selectedPatient && (
                <ConsentBlockModal 
                  patient={selectedPatient} 
                  onRequestConsent={handleRequestConsent}
                  onClose={handleCloseConsentModal}
                />
              )}
              
              {/* Modale de demande de consentement */}
              {showConsentRequestModal && selectedPatient && (
                <ConsentRequestModal 
                  patient={selectedPatient}
                  onClose={() => setShowConsentRequestModal(false)}
                />
              )}
              
              {/* Modale de réponse de consentement */}
              {showConsentResponseModal && selectedPatient && (
                <ConsentResponseModal 
                  patient={selectedPatient}
                  responseType={consentResponseType}
                  onClose={() => setShowConsentResponseModal(false)}
                />
              )}
              
              {/* Onglets de navigation */}
              <div className={styles.tabsContainer}>
                <button 
                  className={`${styles.tabButton} ${activeTab === 'network' ? styles.activeTab : ''}`}
                  onClick={() => handleTabChange('network')}
                >
                  <i className="fas fa-network-wired"></i>
                  Carte du réseau
                </button>
                <button 
                  className={`${styles.tabButton} ${activeTab === 'communication' ? styles.activeTab : ''}`}
                  onClick={() => handleTabChange('communication')}
                >
                  <i className="fas fa-comments"></i>
                  Communication
                </button>
                <button 
                  className={`${styles.tabButton} ${activeTab === 'collaboration' ? styles.activeTab : ''}`}
                  onClick={() => handleTabChange('collaboration')}
                >
                  <i className="fas fa-users"></i>
                  Actions collaboratives
                </button>
                <button 
                  className={`${styles.tabButton} ${activeTab === 'datasharing' ? styles.activeTab : ''}`}
                  onClick={() => handleTabChange('datasharing')}
                >
                  <i className="fas fa-share-alt"></i>
                  Partage de données
                </button>
              </div>
              
              {/* Contenu en fonction de l'onglet sélectionné - Ne s'affiche pas si la modale de consentement est visible */}
              {!showConsentBlockModal && !showConsentRequestModal && !showConsentResponseModal && (
                <div className={styles.tabContent}>
                  {activeTab === 'network' && (
                    <div className={styles.networkContent}>
                      <div className={styles.mapSection}>
                        <NetworkMap 
                          patient={selectedPatient}
                          professionals={professionals}
                          onSelectProfessional={handleSelectProfessional}
                          selectedProfessional={selectedProfessional}
                        />
                      </div>
                      
                      {selectedProfessional && (
                        <div className={styles.detailSection}>
                          <ProfessionalDetail 
                            professional={selectedProfessional} 
                            patient={selectedPatient}
                          />
                        </div>
                      )}
                    </div>
                  )}
                  
                  {activeTab === 'communication' && (
                    <div className={styles.fullWidthPanel}>
                      <CommunicationPanel 
                        patient={selectedPatient}
                        professionals={professionals}
                        selectedProfessional={selectedProfessional}
                        onSelectProfessional={handleSelectProfessional}
                      />
                    </div>
                  )}
                  
                  {activeTab === 'collaboration' && (
                    <div>
                      {console.log('Onglet collaboration actif, selectedProfessional:', selectedProfessional)}
                      
                      {/* S'assurer que le composant est monté à chaque changement de professionnel */}
                      <CollaborativeActionPanel 
                        key={selectedProfessional?.id || 'no-professional'}
                        patient={selectedPatient}
                        selectedProfessional={selectedProfessional}
                        onSelectProfessional={handleSelectProfessional}
                      />
                    </div>
                  )}
                  
                  {activeTab === 'datasharing' && (
                    <div className={styles.fullWidthPanel}>
                      <DataSharingPanel 
                        patient={selectedPatient}
                        professionals={professionals}
                        selectedProfessional={selectedProfessional}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Modale d'accueil pour le consentement */}
      {showWelcomeModal && (
        <WelcomeModal onClose={handleCloseWelcomeModal} />
      )}
    </div>
  );
}
