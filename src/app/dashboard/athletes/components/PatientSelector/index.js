'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './styles.module.css';

export default function PatientSelector({ patients: providedPatients, selectedPatientId, onPatientChange }) {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Premier useEffect pour gérer les patients fournis par props
  useEffect(() => {
    if (Array.isArray(providedPatients) && providedPatients.length > 0) {
      setPatients(providedPatients);
      setIsLoading(false);
    }
  }, [providedPatients]);

  // Deuxième useEffect pour le fetching API (sans dépendances qui changent de taille)
  useEffect(() => {
    // Ne charger depuis l'API que si aucun patient n'est fourni
    if (!Array.isArray(providedPatients) || providedPatients.length === 0) {
      const fetchPatients = async () => {
        try {
          const response = await fetch('/api/patients');
          if (!response.ok) throw new Error('Erreur lors de la récupération des patients');
          const data = await response.json();
          console.log('API Response:', data);
          // Assurer que nous stockons toujours un tableau de patients
          setPatients(Array.isArray(data) ? data : (data.patients || []));
        } catch (error) {
          console.error('Erreur:', error);
          setPatients([]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchPatients();
    }
  }, []); // Dépendances vides, exécuté uniquement au montage

  const handlePatientSelect = (patient) => {
    console.log('Selecting patient:', patient);
    // Vérifier si onPatientChange est une fonction et l'appeler avec l'ID du patient
    if (typeof onPatientChange === 'function') {
      onPatientChange(patient.id);
    } else {
      console.error('La prop onPatientChange n\'est pas une fonction');
    }
  };

  // S'assurer que nous filtrons toujours un tableau valide
  const filteredPatients = Array.isArray(patients) ? patients.filter(patient => 
    patient?.user && `${patient.user.firstName} ${patient.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  if (isLoading) {
    return <div className={styles.loading}>Chargement des patients...</div>;
  }

  // Fonction pour obtenir l'URL de la photo du patient
  const getPatientPhotoUrl = (patient) => {
    // Vérifier d'abord si le patient a directement une propriété photo
    if (patient.photo) {
      return patient.photo;
    }
    
    // Vérifier ensuite si la photo est dans l'objet user
    if (patient.user && patient.user.photoUrl) {
      return patient.user.photoUrl;
    }
    
    // URL par défaut si aucune photo n'est disponible
    return '/placeholder-avatar.png';
  };

  // Fonction pour obtenir le nom du patient
  const getPatientName = (patient) => {
    // Si le patient a des propriétés firstName et lastName directement
    if (patient.firstName && patient.lastName) {
      return `${patient.firstName} ${patient.lastName}`;
    }
    
    // Si les propriétés sont dans l'objet user
    if (patient.user && patient.user.firstName && patient.user.lastName) {
      return `${patient.user.firstName} ${patient.user.lastName}`;
    }
    
    // Si le patient a une propriété userName
    if (patient.userName) {
      return patient.userName;
    }
    
    // Valeur par défaut
    return 'Patient sans nom';
  };

  return (
    <div className={styles.container}>
      <div className={styles.search}>
        <input
          type="text"
          placeholder="Rechercher un patient..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.list}>
        {filteredPatients.length > 0 ? (
          <div className={styles.patientsGrid}>
            {filteredPatients.map((patient) => {
              const patientName = getPatientName(patient);
              const photoUrl = getPatientPhotoUrl(patient);
              
              return (
                <button
                  key={patient.id}
                  className={`${styles.patient} ${selectedPatientId === patient.id ? styles.selected : ''}`}
                  onClick={() => handlePatientSelect(patient)}
                >
                  <div className={styles.avatar}>
                    <Image
                      src={photoUrl}
                      alt={`Photo de ${patientName}`}
                      width={40}
                      height={40}
                    />
                    <span className={`${styles.status} ${styles[patient.nutritionalStatus?.toLowerCase() || 'average']}`} />
                  </div>
                  <div className={styles.info}>
                    <span className={styles.name}>{patientName}</span>
                    <span className={styles.sport}>{patient.sport || 'Sport non spécifié'}</span>
                  </div>
                  {patient.alerts && (
                    <div className={styles.alerts}>
                      {patient.alerts.deficiencies && (
                        <span className={`${styles.alert} ${styles.nutrition}`}>
                          {patient.alerts.deficiencies.length}
                        </span>
                      )}
                      {patient.alerts.injuries && (
                        <span className={`${styles.alert} ${styles.injury}`}>
                          {patient.alerts.injuries.length}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyMessage}>Aucun patient trouvé</div>
        )}
      </div>
    </div>
  );
}
