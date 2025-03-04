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

export default function PatientDashboard({ className }) {
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
      return (
        <div className={styles.emptyState}>
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FF8800" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <p>Veuillez sélectionner un patient</p>
        </div>
      );
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
    <main className={`${styles.dashboard} ${className || ''}`}>
      <PatientSelector 
        className={styles.sidebar}
        patients={patients} 
        selectedPatientId={selectedPatient?.id} 
        onPatientChange={handlePatientChange} 
      />
      
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <span>Chargement...</span>
        </div>
      ) : (
        <section className={styles.content}>
          <PatientHeader patient={selectedPatient} />
          <PatientTabs 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
          {renderTabContent()}
        </section>
      )}
    </main>
  );
}
