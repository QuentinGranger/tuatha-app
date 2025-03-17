'use client';

import React, { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaEnvelope, 
  FaChartBar, 
  FaUsers, 
  FaUserMd, 
  FaRunning, 
  FaAppleAlt, 
  FaUtensils 
} from 'react-icons/fa';
import styles from './ProfessionalList.module.css';

// Mapping des spécialités pour l'affichage
const SPECIALTIES = {
  DOCTOR: { label: 'Médecin', icon: <FaUserMd /> },
  PHYSIOTHERAPIST: { label: 'Kinésithérapeute', icon: <FaRunning /> },
  PHYSICAL_TRAINER: { label: 'Coach sportif', icon: <FaRunning /> },
  NUTRITIONIST: { label: 'Nutritionniste', icon: <FaAppleAlt /> },
  DIETITIAN: { label: 'Diététicien(ne)', icon: <FaUtensils /> }
};

// Mapping des statuts pour l'affichage
const STATUS = {
  ACTIVE: { label: 'Actif', color: '#4CAF50' },
  PENDING: { label: 'En attente', color: '#FFC107' },
  INACTIVE: { label: 'Inactif', color: '#F44336' }
};

const ProfessionalList = ({ professionals, selectedProfessional, onSelectProfessional }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProfessionals, setFilteredProfessionals] = useState(professionals || []);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [hoverCard, setHoverCard] = useState(null);
  
  useEffect(() => {
    if (!professionals) return;
    
    const results = professionals.filter(prof => {
      // Filtre par recherche
      const nameMatch = `${prof.firstName} ${prof.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtre par spécialité
      const specialtyMatch = selectedSpecialty ? prof.specialty === selectedSpecialty : true;
      
      return nameMatch && specialtyMatch;
    });
    
    setFilteredProfessionals(results);
  }, [professionals, searchTerm, selectedSpecialty]);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleSpecialtyChange = (e) => {
    setSelectedSpecialty(e.target.value);
  };

  if (!professionals || professionals.length === 0) {
    return (
      <div className={styles.emptyList}>
        <p>Aucun professionnel associé</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Professionnels de santé</h2>
      
      <div className={styles.filterControls}>
        <div className={styles.searchBox}>
          <input 
            type="text" 
            placeholder="Rechercher un professionnel..." 
            className={styles.searchInput}
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <FaSearch className={styles.searchIcon} />
        </div>
        
        <div className={styles.filterOptions}>
          <select 
            className={styles.filterSelect}
            value={selectedSpecialty}
            onChange={handleSpecialtyChange}
          >
            <option value="">Toutes les spécialités</option>
            {Object.entries(SPECIALTIES).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className={styles.professionalsList}>
        {filteredProfessionals.length > 0 ? (
          filteredProfessionals.map(professional => (
            <div 
              key={professional.id}
              className={`${styles.professionalCard} ${selectedProfessional?.id === professional.id ? styles.selected : ''}`}
              onClick={() => onSelectProfessional(professional.id)}
              onMouseEnter={() => setHoverCard(professional.id)}
              onMouseLeave={() => setHoverCard(null)}
            >
              <div className={styles.cardHeader}>
                <div 
                  className={styles.statusIndicator} 
                  style={{ backgroundColor: STATUS[professional.status]?.color || '#999' }}
                  title={STATUS[professional.status]?.label || 'Statut inconnu'}
                ></div>
                <div className={styles.specialty}>
                  {SPECIALTIES[professional.specialty]?.icon}
                  <span className={styles.specialtyText}>
                    {SPECIALTIES[professional.specialty]?.label || professional.specialty}
                  </span>
                </div>
              </div>
              
              <div className={styles.cardContent}>
                <div className={styles.professionalImage}>
                  {professional.photoUrl ? (
                    <img 
                      src={professional.photoUrl} 
                      alt={`${professional.firstName} ${professional.lastName}`} 
                    />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      {professional.firstName?.charAt(0)}{professional.lastName?.charAt(0)}
                    </div>
                  )}
                </div>
                
                <div className={styles.professionalInfo}>
                  <h3 className={styles.name}>{professional.firstName} {professional.lastName}</h3>
                  {professional.subSpecialty && (
                    <p className={styles.subSpecialty}>{professional.subSpecialty}</p>
                  )}
                </div>
              </div>
              
              {professional.description && (
                <div className={styles.description}>
                  {professional.description}
                </div>
              )}
              
              <div className={styles.cardActions}>
                <button 
                  className={styles.actionButton} 
                  title="Contacter"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Action pour contacter
                  }}
                >
                  <FaEnvelope className={styles.icon} />
                </button>
                <button 
                  className={styles.actionButton} 
                  title="Partager des données"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Action pour partager des données
                  }}
                >
                  <FaChartBar className={styles.icon} />
                </button>
                <button 
                  className={styles.actionButton} 
                  title="Collaborer"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Action pour collaborer
                  }}
                >
                  <FaUsers className={styles.icon} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyList}>
            <p>Aucun professionnel trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalList;
