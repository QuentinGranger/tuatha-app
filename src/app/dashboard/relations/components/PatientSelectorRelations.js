'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { FaChevronDown, FaChevronUp, FaSearch, FaCheck, FaUser, FaRunning } from 'react-icons/fa';
import styles from './PatientSelectorRelations.module.css';

export default function PatientSelectorRelations({ patients, selectedPatientId, onPatientChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAnimation, setShowAnimation] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [isMounted, setIsMounted] = useState(false);
  
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const searchInputRef = useRef(null);
  
  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  
  // Pour éviter une erreur d'hydratation, on s'assure de ne monter les portails que côté client
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    // Fermer le menu déroulant lorsqu'on clique ailleurs
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          triggerRef.current && !triggerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    // Mettre à jour la position du dropdown en cas de scroll ou resize
    function updatePosition() {
      if (triggerRef.current && isOpen) {
        const rect = triggerRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width
        });
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen]);

  // Auto-focus sur l'input de recherche quand le dropdown est ouvert
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 200);
    }
    
    // Mise à jour de la position du dropdown quand il s'ouvre
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [isOpen]);
  
  const filteredPatients = patients.filter(patient => {
    // On vérifie si l'utilisateur est présent
    if (!patient.user) {
      return false;
    }
    
    const fullName = `${patient.user.firstName} ${patient.user.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
    setShowAnimation(true);
    
    // Réinitialiser la recherche lorsqu'on ouvre le dropdown
    if (!isOpen) {
      setSearchQuery('');
    }
  };

  const handleSelectPatient = (patientId) => {
    onPatientChange(patientId);
    setIsOpen(false);
  };
  
  // Rendu du dropdown via un portail
  const renderDropdown = () => {
    if (!isMounted || !isOpen) return null;
    
    return createPortal(
      <div 
        className={styles.patientDropdownMenu}
        style={{
          position: 'absolute',
          top: `${dropdownPosition.top}px`,
          left: `${dropdownPosition.left}px`,
          width: `${dropdownPosition.width}px`,
          zIndex: 1000
        }}
        ref={dropdownRef}
      >
        <div className={styles.searchBox}>
          <input
            ref={searchInputRef}
            type="text"
            className={styles.searchInput}
            placeholder="Rechercher un patient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
          <FaSearch className={styles.searchIcon} />
        </div>
        
        <div className={styles.patientDropdownList}>
          {filteredPatients.length > 0 ? (
            filteredPatients.map(patient => (
              <div 
                key={patient.id}
                className={`${styles.patientDropdownItem} ${selectedPatientId === patient.id ? styles.selectedPatientItem : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectPatient(patient.id);
                }}
              >
                <div className={styles.patientItemAvatar}>
                  {patient.user?.photoUrl ? (
                    <Image
                      src={patient.user.photoUrl}
                      alt={`Photo de ${patient.user?.firstName} ${patient.user?.lastName}`}
                      width={36}
                      height={36}
                      className={styles.avatarImage}
                    />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      {patient.user?.firstName?.charAt(0)}{patient.user?.lastName?.charAt(0)}
                    </div>
                  )}
                </div>
                
                <div className={styles.patientItemInfo}>
                  <span className={styles.patientItemName}>{patient.user?.firstName} {patient.user?.lastName}</span>
                  <span className={styles.patientItemDetail}>
                    <FaRunning className={styles.itemSportIcon} />
                    {patient.sport || 'Sport non spécifié'}
                  </span>
                </div>
                
                {selectedPatientId === patient.id && (
                  <div className={styles.checkIcon}>
                    <FaCheck />
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className={styles.noResults}>Aucun patient trouvé</div>
          )}
        </div>
      </div>,
      document.body
    );
  };
  
  return (
    <div className={`${styles.patientRoot} ${styles.patientDropdownContainer}`}>
      <div className={styles.dropdownHeader}>
        <label className={styles.dropdownLabel}>Patient sélectionné</label>
      </div>
      
      <div 
        className={`${styles.patientDropdownTrigger} ${isOpen ? styles.active : ''}`}
        onClick={handleToggleDropdown}
        ref={triggerRef}
      >
        {selectedPatient?.user ? (
          <>
            <div className={styles.selectedPatientAvatar}>
              {selectedPatient.user?.photoUrl ? (
                <Image
                  src={selectedPatient.user.photoUrl}
                  alt={`Photo de ${selectedPatient.user?.firstName} ${selectedPatient.user?.lastName}`}
                  width={40}
                  height={40}
                  className={styles.avatarImage}
                />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {selectedPatient.user?.firstName?.charAt(0)}{selectedPatient.user?.lastName?.charAt(0)}
                </div>
              )}
              <div className={styles.avatarGlow}></div>
            </div>
            <div className={styles.selectedPatientInfo}>
              <span className={styles.selectedPatientName}>
                {selectedPatient.user?.firstName} {selectedPatient.user?.lastName}
              </span>
              <span className={styles.selectedPatientDetail}>
                <FaRunning className={styles.sportIcon} />
                {selectedPatient.sport || 'Sport non spécifié'}
              </span>
            </div>
          </>
        ) : (
          <span className={styles.noPatientSelected}>
            <FaUser className={styles.userIcon} />
            Sélectionner un patient
          </span>
        )}
        <div className={styles.dropdownIcon}>
          {isOpen ? <FaChevronUp className={styles.chevronIcon} /> : <FaChevronDown className={styles.chevronIcon} />}
        </div>
      </div>
      
      {renderDropdown()}
    </div>
  );
}
