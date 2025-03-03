'use client';

import React from 'react';
import styles from './ProfessionalList.module.css';

// Mapping des spécialités pour l'affichage
const SPECIALTIES = {
  DOCTOR: 'Médecin',
  PHYSIOTHERAPIST: 'Kinésithérapeute',
  PHYSICAL_TRAINER: 'Coach sportif',
  NUTRITIONIST: 'Nutritionniste',
  DIETITIAN: 'Diététicien(ne)'
};

// Mapping des statuts pour l'affichage
const STATUS = {
  ACTIVE: { label: 'Actif', color: '#4CAF50' },
  PENDING: { label: 'En attente', color: '#FFC107' },
  INACTIVE: { label: 'Inactif', color: '#F44336' }
};

const ProfessionalList = ({ professionals, selectedProfessional, onSelectProfessional }) => {
  if (!professionals || professionals.length === 0) {
    return (
      <div className={`${styles.emptyList} text-light`}>
        <p>Aucun professionnel associé</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={`${styles.title} text-white`}>Professionnels de santé</h2>
      
      <div className={styles.filterControls}>
        <div className={styles.searchBox}>
          <input 
            type="text" 
            placeholder="Rechercher..." 
            className={`${styles.searchInput} text-input`}
          />
        </div>
        
        <div className={styles.filterOptions}>
          <select className={`${styles.filterSelect} text-white`}>
            <option value="">Toutes les spécialités</option>
            {Object.entries(SPECIALTIES).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className={styles.professionalsList}>
        {professionals.map(professional => (
          <div 
            key={professional.id}
            className={`${styles.professionalCard} ${selectedProfessional?.id === professional.id ? styles.selected : ''} bg-glass`}
            onClick={() => onSelectProfessional(professional)}
          >
            <div className={styles.cardHeader}>
              <div 
                className={styles.statusIndicator} 
                style={{ backgroundColor: STATUS[professional.status]?.color || '#999' }}
                title={STATUS[professional.status]?.label || 'Statut inconnu'}
              ></div>
              <div className={`${styles.specialty} text-light`}>{SPECIALTIES[professional.specialty] || professional.specialty}</div>
            </div>
            
            <div className={styles.cardContent}>
              <div className={styles.professionalImage}>
                <img 
                  src={professional.photoUrl || '/img/default-avatar.jpg'} 
                  alt={`${professional.firstName} ${professional.lastName}`} 
                />
              </div>
              
              <div className={styles.professionalInfo}>
                <h3 className={`${styles.name} text-white`}>{professional.firstName} {professional.lastName}</h3>
                {professional.subSpecialty && (
                  <p className={`${styles.subSpecialty} text-light`}>{professional.subSpecialty}</p>
                )}
              </div>
            </div>
            
            {professional.description && (
              <div className={`${styles.description} text-light`}>
                {professional.description}
              </div>
            )}
            
            <div className={styles.cardActions}>
              <button className={`${styles.actionButton} btn-glass`} title="Contacter">
                <span className={styles.icon}>✉️</span>
              </button>
              <button className={`${styles.actionButton} btn-glass`} title="Partager des données">
                <span className={styles.icon}>📊</span>
              </button>
              <button className={`${styles.actionButton} btn-glass`} title="Collaborer">
                <span className={styles.icon}>👥</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfessionalList;
