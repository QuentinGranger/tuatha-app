'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './PatientSelector.module.css';

export default function PatientSelector({ patients, selectedPatientId, onPatientChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredPatients = patients.filter(patient => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Dossiers Patients</h2>
      </div>
      
      <div className={styles.searchContainer}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Rechercher un patient..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <i className={`fas fa-search ${styles.searchIcon}`}></i>
      </div>
      
      <div className={styles.patientList}>
        {filteredPatients.length > 0 ? (
          filteredPatients.map(patient => (
            <div 
              key={patient.id}
              className={`${styles.patientCard} ${selectedPatientId === patient.id ? styles.selected : ''}`}
              onClick={() => onPatientChange(patient.id)}
            >
              <div className={styles.patientAvatar}>
                <Image
                  src={patient.photo || '/placeholder-avatar.png'}
                  alt={`Photo de ${patient.firstName} ${patient.lastName}`}
                  width={48}
                  height={48}
                  className={styles.avatarImage}
                />
                <span className={`${styles.status} ${styles[patient.status || 'active']}`}></span>
              </div>
              
              <div className={styles.patientInfo}>
                <h3 className={styles.patientName}>{patient.firstName} {patient.lastName}</h3>
                <div className={styles.patientDetails}>
                  <span className={styles.patientAge}>{patient.age} ans</span>
                  {patient.isVIP && <span className={styles.vipTag}>VIP</span>}
                </div>
              </div>
              
              {patient.hasNewData && <span className={styles.notificationDot}></span>}
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            Aucun patient ne correspond à votre recherche
          </div>
        )}
      </div>
      
      <button className={styles.addButton}>
        <i className="fas fa-plus"></i>
        Ajouter un patient
      </button>
    </div>
  );
}
