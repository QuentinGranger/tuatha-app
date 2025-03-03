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

  // Chargement initial des patients
  useEffect(() => {
    async function loadPatients() {
      try {
        const patientsData = await prisma.patient.findMany();
        setPatients(patientsData);
        
        // Sélectionner automatiquement le premier patient
        if (patientsData.length > 0) {
          // Récupérer le premier patient avec ses professionnels associés
          const firstPatient = await prisma.patient.findUnique({
            where: { id: patientsData[0].id },
          });
          
          setSelectedPatient(firstPatient);
          
          // Récupérer les professionnels de santé associés à ce patient
          await loadPatientProfessionals(firstPatient.id);
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

  // Fonction pour changer de patient
  const handlePatientChange = async (patientId) => {
    setLoading(true);
    try {
      const patient = await prisma.patient.findUnique({
        where: { id: patientId },
      });
      
      setSelectedPatient(patient);
      
      // Réinitialiser la sélection du professionnel
      setSelectedProfessional(null);
      
      // Récupérer les professionnels de santé associés à ce patient
      await loadPatientProfessionals(patientId);
      
    } catch (error) {
      console.error('Erreur lors du chargement du patient:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour sélectionner un professionnel
  const handleSelectProfessional = (professionalId) => {
    const professional = professionals.find(pro => pro.id === professionalId);
    if (professional) {
      setSelectedProfessional(professional);
    }
  };

  // Fonction pour gérer le changement d'onglet
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Relations Interprofessionnelles</h1>
      
      {/* Sélecteur de patient */}
      <div className={styles.patientSelection}>
        <PatientSelectorRelations 
          patients={patients} 
          selectedPatientId={selectedPatient?.id} 
          onPatientChange={handlePatientChange} 
        />
      </div>
      
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Chargement des données...</p>
        </div>
      ) : !selectedPatient ? (
        <div className={styles.noSelection}>
          <p>Veuillez sélectionner un patient pour voir ses relations interprofessionnelles</p>
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
              
              {/* Contenu en fonction de l'onglet sélectionné */}
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
                  <CommunicationPanel 
                    patient={selectedPatient}
                    professionals={professionals}
                    selectedProfessional={selectedProfessional}
                    onSelectProfessional={handleSelectProfessional}
                  />
                )}
                
                {activeTab === 'collaboration' && (
                  <CollaborativeActionPanel 
                    patient={selectedPatient}
                    professionals={professionals}
                    selectedProfessional={selectedProfessional}
                  />
                )}
                
                {activeTab === 'datasharing' && (
                  <DataSharingPanel 
                    patient={selectedPatient}
                    professionals={professionals}
                    selectedProfessional={selectedProfessional}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
