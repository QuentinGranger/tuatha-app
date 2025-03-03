'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from '../page.module.css';

export default function PatientSelectorRelations({ patients, selectedPatientId, onPatientChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  
  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  
  useEffect(() => {
    // Fermer le menu déroulant lorsqu'on clique ailleurs
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const filteredPatients = patients.filter(patient => {
    // On vérifie si l'utilisateur est présent
    if (!patient.user) {
      return false;
    }
    
    const fullName = `${patient.user.firstName} ${patient.user.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });
  
  return (
    <div className={styles.patientDropdownContainer} ref={dropdownRef}>
      <div className={styles.dropdownHeader}>
        <label className={styles.dropdownLabel}>Patient sélectionné :</label>
      </div>
      
      <div 
        className={styles.patientDropdownTrigger} 
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedPatient?.user ? (
          <>
            <div className={styles.selectedPatientAvatar}>
              {selectedPatient.user?.photoUrl ? (
                <Image
                  src={selectedPatient.user.photoUrl}
                  alt={`Photo de ${selectedPatient.user?.firstName} ${selectedPatient.user?.lastName}`}
                  width={36}
                  height={36}
                  className={styles.avatarImage}
                  style={{ objectFit: 'cover', borderRadius: '50%' }}
                />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {selectedPatient.user?.firstName?.charAt(0)}{selectedPatient.user?.lastName?.charAt(0)}
                </div>
              )}
            </div>
            <div className={styles.selectedPatientInfo}>
              <span className={styles.selectedPatientName}>
                {selectedPatient.user?.firstName} {selectedPatient.user?.lastName}
              </span>
              <span className={styles.selectedPatientDetail}>
                {selectedPatient.sport || 'Sport non spécifié'}
              </span>
            </div>
          </>
        ) : (
          <span className={styles.noPatientSelected}>Sélectionner un patient</span>
        )}
        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`} style={{ marginLeft: 'auto' }}></i>
      </div>
      
      {isOpen && (
        <div className={styles.patientDropdownMenu}>
          <div className={styles.searchBox}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Rechercher un patient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            <i className="fas fa-search" style={{ position: 'absolute', right: '15px', color: 'rgba(255, 255, 255, 0.6)' }}></i>
          </div>
          
          <div className={styles.patientDropdownList}>
            {filteredPatients.length > 0 ? (
              filteredPatients.map(patient => (
                <div 
                  key={patient.id}
                  className={`${styles.patientDropdownItem} ${selectedPatientId === patient.id ? styles.selectedPatientItem : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onPatientChange(patient.id);
                    setIsOpen(false);
                  }}
                >
                  <div className={styles.patientItemAvatar}>
                    {patient.user?.photoUrl ? (
                      <Image
                        src={patient.user.photoUrl}
                        alt={`Photo de ${patient.user?.firstName} ${patient.user?.lastName}`}
                        width={32}
                        height={32}
                        className={styles.avatarImage}
                        style={{ objectFit: 'cover', borderRadius: '50%' }}
                      />
                    ) : (
                      <div className={styles.avatarPlaceholder}>
                        {patient.user?.firstName?.charAt(0)}{patient.user?.lastName?.charAt(0)}
                      </div>
                    )}
                  </div>
                  
                  <div className={styles.patientItemInfo}>
                    <span className={styles.patientItemName}>{patient.user?.firstName} {patient.user?.lastName}</span>
                    <span className={styles.patientItemDetail}>{patient.sport || 'Sport non spécifié'}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.noResults}>Aucun patient trouvé</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
