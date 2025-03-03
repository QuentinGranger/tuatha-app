'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from '../page.module.css';
// Importer les icônes nécessaires de react-icons
import { 
  FaAppleAlt, FaHands, FaBrain, FaUserMd, FaUserPlus, 
  FaXRay, FaChild, FaDumbbell, FaCarrot, FaNetworkWired,
  FaThList, FaClock, FaEnvelope, FaPhoneAlt, FaUserSlash 
} from 'react-icons/fa';

// Mapping des spécialités avec leurs couleurs et icônes
const specialtyMapping = {
  'NUTRITIONIST': { 
    color: '#EA4335', 
    icon: <FaAppleAlt />,
    label: 'Nutritionniste' 
  },
  'PHYSIOTHERAPIST': { 
    color: '#34A853', 
    icon: <FaHands />,
    label: 'Kinésithérapeute' 
  },
  'PSYCHOLOGIST': { 
    color: '#AA00FF', 
    icon: <FaBrain />,
    label: 'Psychologue' 
  },
  'DOCTOR': { 
    color: '#4285F4', 
    icon: <FaUserMd />,
    label: 'Médecin' 
  },
  'GENERAL': { 
    color: '#9E9E9E', 
    icon: <FaUserPlus />,
    label: 'Généraliste' 
  },
  'RADIOLOGIST': { 
    color: '#00BCD4', 
    icon: <FaXRay />,
    label: 'Radiologue' 
  },
  'PEDIATRICIAN': { 
    color: '#FBBC05', 
    icon: <FaChild />,
    label: 'Pédiatre' 
  },
  'PHYSICAL_TRAINER': { 
    color: '#FF6F00', 
    icon: <FaDumbbell />,
    label: 'Préparateur physique' 
  },
  'DIETITIAN': { 
    color: '#8BC34A', 
    icon: <FaCarrot />,
    label: 'Diététicien' 
  }
};

// Mapping des statuts pour la démo
const statusMapping = {
  'hp-1': 'active',
  'hp-2': 'active',
  'hp-3': 'pending',
  'hp-4': 'history'
};

export default function HealthProfessionalsList({ professionals, selectedProfessionalId, onProfessionalSelect }) {
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'pending', 'history'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filtrer les professionnels selon le statut et la recherche
  const filteredProfessionals = professionals.filter(pro => {
    // Déterminer le statut du professionnel (pour la démo)
    const proStatus = statusMapping[pro.id] || 'active';
    
    const matchesStatus = filterStatus === 'all' || proStatus === filterStatus;
    
    // Vérifier si le professionnel a un utilisateur associé
    if (!pro.user) {
      return false;
    }
    
    const fullName = `${pro.user.firstName} ${pro.user.lastName}`.toLowerCase();
    const specialtyLabel = specialtyMapping[pro.specialty]?.label || pro.specialty;
    
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) ||
                          specialtyLabel.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });
  
  // Styles pour les statuts
  const statusStyles = {
    active: { color: '#34A853', label: 'Actif' },
    pending: { color: '#FBBC05', label: 'En attente' },
    history: { color: '#9E9E9E', label: 'Historique' }
  };
  
  return (
    <div className={styles.professionalsListContainer}>
      <div className={styles.listHeader}>
        <h3 className={styles.listTitle}>
          <FaNetworkWired style={{ marginRight: '8px', color: 'rgba(255, 114, 28, 0.9)' }} />
          Réseau de professionnels
        </h3>
        
        <div className={styles.filterTabs}>
          <button 
            className={`${styles.filterTab} ${filterStatus === 'all' ? styles.activeFilter : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            <FaThList style={{ marginRight: '5px', fontSize: '0.8rem' }} />
            Tous
          </button>
          <button 
            className={`${styles.filterTab} ${filterStatus === 'active' ? styles.activeFilter : ''}`}
            onClick={() => setFilterStatus('active')}
            style={{borderBottom: filterStatus === 'active' ? `2px solid ${statusStyles.active.color}` : 'none'}}
          >
            <span className={styles.statusDot} style={{backgroundColor: statusStyles.active.color}}></span>
            Actifs
          </button>
          <button 
            className={`${styles.filterTab} ${filterStatus === 'pending' ? styles.activeFilter : ''}`}
            onClick={() => setFilterStatus('pending')}
            style={{borderBottom: filterStatus === 'pending' ? `2px solid ${statusStyles.pending.color}` : 'none'}}
          >
            <span className={styles.statusDot} style={{backgroundColor: statusStyles.pending.color}}></span>
            En attente
          </button>
          <button 
            className={`${styles.filterTab} ${filterStatus === 'history' ? styles.activeFilter : ''}`}
            onClick={() => setFilterStatus('history')}
            style={{borderBottom: filterStatus === 'history' ? `2px solid ${statusStyles.history.color}` : 'none'}}
          >
            <span className={styles.statusDot} style={{backgroundColor: statusStyles.history.color}}></span>
            Historique
          </button>
        </div>
        
        <div className={styles.searchBox}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Rechercher un professionnel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div style={{ position: 'absolute', right: '15px', color: 'rgba(255, 255, 255, 0.6)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
          </div>
        </div>
      </div>
      
      <div className={styles.professionalsList}>
        {filteredProfessionals.length > 0 ? (
          filteredProfessionals.map(pro => {
            const specialtyInfo = specialtyMapping[pro.specialty] || { 
              color: '#9E9E9E', 
              icon: <FaUserPlus />,
              label: 'Autre' 
            };
            const proStatus = statusMapping[pro.id] || 'active';
            
            return (
              <div 
                key={pro.id}
                className={`${styles.professionalCard} ${selectedProfessionalId === pro.id ? styles.selectedPro : ''} ${styles[`status-${proStatus}`] || ''}`}
                onClick={() => onProfessionalSelect(pro.id)}
              >
                <div className={styles.proAvatar} style={{ 
                  borderColor: specialtyInfo.color,
                  boxShadow: `0 0 10px ${specialtyInfo.color}30`
                }}>
                  {pro.user?.photoUrl ? (
                    <div className={styles.imageWrapper}>
                      <Image
                        src={pro.user.photoUrl}
                        alt={`Photo de ${pro.user.firstName} ${pro.user.lastName}`}
                        width={46}
                        height={46}
                        className={styles.avatarImage}
                        style={{ objectFit: 'cover', borderRadius: '50%', width: '100%', height: '100%' }}
                      />
                    </div>
                  ) : (
                    <span style={{ color: specialtyInfo.color, fontSize: '1.2rem' }}>
                      {specialtyInfo.icon}
                    </span>
                  )}
                  <span className={`${styles.proStatus} ${styles[proStatus]}`} 
                        style={{ 
                          backgroundColor: statusStyles[proStatus].color,
                          boxShadow: `0 0 5px ${statusStyles[proStatus].color}` 
                        }}></span>
                </div>
                
                <div className={styles.proContent}>
                  <div className={styles.proInfo}>
                    <h4 className={styles.proName} title={`${pro.user?.firstName} ${pro.user?.lastName}`}>
                      {pro.user?.firstName} {pro.user?.lastName}
                    </h4>
                    <div className={styles.proDetails}>
                      <span className={styles.proSpecialty} style={{ color: specialtyInfo.color }}>
                        <span className={styles.specialtyIcon}>
                          {specialtyInfo.icon}
                        </span>
                        {specialtyInfo.label}
                      </span>
                      <span className={styles.lastContact}>
                        <FaClock style={{ marginRight: '4px' }} /> {pro.disponibilite || 'Disponible'}
                      </span>
                    </div>
                  </div>
                  
                  <div className={styles.proActions}>
                    <button 
                      className={styles.actionButton} 
                      title="Message" 
                      aria-label="Envoyer un message"
                      onClick={(e) => {
                        e.stopPropagation(); // Empêche le clic de sélectionner le professionnel
                        // Action message
                      }}
                    >
                      <FaEnvelope style={{ fontSize: '1rem' }} />
                    </button>
                    <button 
                      className={styles.actionButton} 
                      title="Appel" 
                      aria-label="Appeler"
                      onClick={(e) => {
                        e.stopPropagation(); // Empêche le clic de sélectionner le professionnel
                        // Action appel
                      }}
                    >
                      <FaPhoneAlt style={{ fontSize: '1rem' }} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className={styles.emptyProfessionals}>
            <FaUserSlash style={{ fontSize: '1.5rem', marginBottom: '10px', color: 'rgba(255, 255, 255, 0.3)' }} />
            <p>Aucun professionnel de santé ne correspond à vos critères</p>
          </div>
        )}
      </div>
    </div>
  );
}
