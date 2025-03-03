'use client';

import { useState, useEffect } from 'react';
import { getPatientsForClinic, getPatientById } from '../../../../lib/api/patients';
import PatientSelector from './PatientSelector';
import PatientHeader from './PatientHeader';
import PatientTabs from './PatientTabs';
import MedicalInfo from './MedicalInfo';
import NutritionTracking from './NutritionTracking';
import PerformanceStats from './PerformanceStats';
import NotesRecommendations from './NotesRecommendations';
import Documents from './Documents';
import Appointments from './Appointments';
import styles from './PatientDashboard.module.css';

export default function PatientDashboard() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('medical');

  useEffect(() => {
    async function loadPatients() {
      try {
        const patientsData = await getPatientsForClinic();
        setPatients(patientsData);
        
        // Sélectionner automatiquement le premier patient
        if (patientsData.length > 0) {
          const firstPatient = await getPatientById(patientsData[0].id);
          setSelectedPatient(firstPatient);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des patients:', error);
        setLoading(false);
      }
    }
    
    loadPatients();
  }, []);

  const handlePatientChange = async (patientId) => {
    setLoading(true);
    try {
      const patient = await getPatientById(patientId);
      setSelectedPatient(patient);
    } catch (error) {
      console.error('Erreur lors du chargement du patient:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    if (!selectedPatient) {
      return <div className={styles.emptyState}>Veuillez sélectionner un patient</div>;
    }

    switch (activeTab) {
      case 'medical':
        return <MedicalInfo patient={selectedPatient} />;
      case 'nutrition':
        return <NutritionTracking patient={selectedPatient} />;
      case 'performance':
        return <PerformanceStats patient={selectedPatient} />;
      case 'notes':
        return <NotesRecommendations patient={selectedPatient} />;
      case 'documents':
        return <Documents patient={selectedPatient} />;
      case 'appointments':
        return <Appointments patient={selectedPatient} />;
      default:
        return <MedicalInfo patient={selectedPatient} />;
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.sidebar}>
        <PatientSelector 
          patients={patients} 
          selectedPatientId={selectedPatient?.id} 
          onPatientChange={handlePatientChange} 
        />
      </div>
      
      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>Chargement...</div>
        ) : (
          <>
            <PatientHeader patient={selectedPatient} />
            
            <PatientTabs 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
            />
            
            <div className={styles.tabContent}>
              {renderTabContent()}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
