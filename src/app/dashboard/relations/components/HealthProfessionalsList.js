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
  
  // Styles pour l'effet glassmorphisme et touches d'orange
  const glassmorphismStyle = {
    container: {
      backdropFilter: 'blur(15px)',
      WebkitBackdropFilter: 'blur(15px)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      overflow: 'hidden'
    },
    header: {
      background: 'linear-gradient(135deg, rgba(255, 114, 28, 0.15), rgba(0, 0, 0, 0.2))',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '1.25rem 1.5rem'
    },
    searchBox: {
      position: 'relative',
      marginTop: '10px'
    },
    searchInput: {
      background: 'rgba(0, 0, 0, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
    },
    searchIcon: {
      color: 'rgba(255, 114, 28, 0.7)'
    },
    card: {
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      background: 'rgba(0, 0, 0, 0.2)',
      borderRadius: '12px',
      transition: 'all 0.3s ease',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      overflow: 'hidden',
      position: 'relative'
    },
    cardHover: {
      transform: 'translateY(-3px)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
      borderColor: 'rgba(255, 114, 28, 0.3)'
    },
    cardSelected: {
      background: 'rgba(255, 114, 28, 0.15)',
      border: '1px solid rgba(255, 114, 28, 0.3)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 114, 28, 0.2)'
    },
    cardBefore: {
      content: "''",
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(45deg, rgba(255, 114, 28, 0) 0%, rgba(255, 114, 28, 0.05) 100%)',
      opacity: 0,
      transition: 'opacity 0.3s ease',
      zIndex: 0
    },
    cardBeforeHover: {
      opacity: 1
    },
    avatar: {
      transition: 'all 0.3s ease',
      boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)'
    },
    avatarHover: {
      transform: 'scale(1.05)',
      boxShadow: '0 0 20px rgba(255, 114, 28, 0.3)'
    },
    actionButton: {
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
      background: 'rgba(0, 0, 0, 0.3)',
      transition: 'all 0.3s ease',
      zIndex: 2
    },
    actionButtonHover: {
      background: 'rgba(255, 114, 28, 0.3)',
      borderColor: 'rgba(255, 114, 28, 0.5)',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
    },
    indicator: {
      transition: 'all 0.3s ease',
      boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)'
    }
  };
  
  return (
    <div className={styles.professionalsListContainer} style={glassmorphismStyle.container}>
      <div className={styles.listHeader} style={glassmorphismStyle.header}>
        <h3 className={styles.listTitle}>
          <FaNetworkWired style={{ marginRight: '8px', color: 'rgba(255, 114, 28, 0.9)' }} />
          Réseau de professionnels
        </h3>
        
        <div className={styles.filterTabs} style={{ 
          display: 'flex', 
          gap: '5px', 
          overflowX: 'auto', 
          paddingBottom: '5px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <button 
            className={`${styles.filterTab} ${filterStatus === 'all' ? styles.activeFilter : ''}`}
            onClick={() => setFilterStatus('all')}
            style={{
              padding: '8px 12px',
              background: filterStatus === 'all' ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
              borderRadius: '6px 6px 0 0',
              color: filterStatus === 'all' ? 'rgba(255, 114, 28, 1)' : 'rgba(255, 255, 255, 0.7)',
              fontWeight: filterStatus === 'all' ? '500' : 'normal',
              transition: 'all 0.3s ease'
            }}
          >
            <FaThList style={{ marginRight: '5px', fontSize: '0.8rem' }} />
            Tous
          </button>
          <button 
            className={`${styles.filterTab} ${filterStatus === 'active' ? styles.activeFilter : ''}`}
            onClick={() => setFilterStatus('active')}
            style={{
              padding: '8px 12px',
              background: filterStatus === 'active' ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
              borderRadius: '6px 6px 0 0',
              color: filterStatus === 'active' ? 'rgba(255, 114, 28, 1)' : 'rgba(255, 255, 255, 0.7)',
              fontWeight: filterStatus === 'active' ? '500' : 'normal',
              borderBottom: filterStatus === 'active' ? `2px solid ${statusStyles.active.color}` : 'none',
              transition: 'all 0.3s ease'
            }}
          >
            <span className={styles.statusDot} style={{backgroundColor: statusStyles.active.color}}></span>
            Actifs
          </button>
          <button 
            className={`${styles.filterTab} ${filterStatus === 'pending' ? styles.activeFilter : ''}`}
            onClick={() => setFilterStatus('pending')}
            style={{
              padding: '8px 12px',
              background: filterStatus === 'pending' ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
              borderRadius: '6px 6px 0 0',
              color: filterStatus === 'pending' ? 'rgba(255, 114, 28, 1)' : 'rgba(255, 255, 255, 0.7)',
              fontWeight: filterStatus === 'pending' ? '500' : 'normal',
              borderBottom: filterStatus === 'pending' ? `2px solid ${statusStyles.pending.color}` : 'none',
              transition: 'all 0.3s ease'
            }}
          >
            <span className={styles.statusDot} style={{backgroundColor: statusStyles.pending.color}}></span>
            En attente
          </button>
          <button 
            className={`${styles.filterTab} ${filterStatus === 'history' ? styles.activeFilter : ''}`}
            onClick={() => setFilterStatus('history')}
            style={{
              padding: '8px 12px',
              background: filterStatus === 'history' ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
              borderRadius: '6px 6px 0 0',
              color: filterStatus === 'history' ? 'rgba(255, 114, 28, 1)' : 'rgba(255, 255, 255, 0.7)',
              fontWeight: filterStatus === 'history' ? '500' : 'normal',
              borderBottom: filterStatus === 'history' ? `2px solid ${statusStyles.history.color}` : 'none',
              transition: 'all 0.3s ease'
            }}
          >
            <span className={styles.statusDot} style={{backgroundColor: statusStyles.history.color}}></span>
            Historique
          </button>
        </div>
        
        <div className={styles.searchBox} style={glassmorphismStyle.searchBox}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Rechercher un professionnel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              height: '40px',
              padding: '0 15px 0 40px',
              ...glassmorphismStyle.searchInput,
              color: '#ffffff',
              outline: 'none'
            }}
          />
          <div style={{ 
            position: 'absolute', 
            left: '15px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: 'rgba(255, 114, 28, 0.7)',
            pointerEvents: 'none' 
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
          </div>
        </div>
      </div>
      
      <div className={styles.professionalsList} style={{ 
        padding: '15px', 
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        flex: 1,
        overflowY: 'auto'
      }}>
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
                onClick={() => {
                  onProfessionalSelect(pro.id);
                }}
                style={{
                  display: 'flex',
                  gap: '15px',
                  padding: '15px',
                  alignItems: 'center',
                  position: 'relative',
                  cursor: 'pointer',
                  background: 'rgba(0, 0, 0, 0.2)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                  width: '100%',
                  ...(selectedProfessionalId === pro.id ? {
                    background: 'rgba(255, 114, 28, 0.15)',
                    border: '1px solid rgba(255, 114, 28, 0.3)',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 114, 28, 0.2)'
                  } : {})
                }}
                onMouseOver={e => {
                  if (selectedProfessionalId !== pro.id) {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
                    e.currentTarget.style.borderColor = 'rgba(255, 114, 28, 0.3)';
                  }
                  
                  // Name color change
                  const name = e.currentTarget.querySelector(`.${styles.proName}`);
                  if (name) {
                    name.style.color = 'rgba(255, 114, 28, 0.9)';
                  }
                }}
                onMouseOut={e => {
                  if (selectedProfessionalId !== pro.id) {
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.boxShadow = '';
                    e.currentTarget.style.borderColor = '';
                  }
                  
                  // Name color reset
                  const name = e.currentTarget.querySelector(`.${styles.proName}`);
                  if (name) {
                    name.style.color = '';
                  }
                }}
              >
                {/* Avatar */}
                <div className={styles.proAvatar} style={{ 
                  borderColor: specialtyInfo.color,
                  boxShadow: `0 0 10px ${specialtyInfo.color}30`,
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: 'linear-gradient(45deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid',
                  position: 'relative',
                  flexShrink: 0,
                  transition: 'all 0.3s ease'
                }}>
                  {pro.user?.photoUrl ? (
                    <Image
                      src={pro.user.photoUrl}
                      alt={`Photo de ${pro.user.firstName} ${pro.user.lastName}`}
                      width={46}
                      height={46}
                      className={styles.avatarImage}
                      style={{ 
                        objectFit: 'cover', 
                        borderRadius: '50%', 
                        width: '100%', 
                        height: '100%' 
                      }}
                    />
                  ) : (
                    <span style={{ color: specialtyInfo.color, fontSize: '1.2rem' }}>
                      {specialtyInfo.icon}
                    </span>
                  )}
                  <span className={`${styles.proStatus} ${styles[proStatus]}`} 
                        style={{ 
                          backgroundColor: statusStyles[proStatus].color,
                          boxShadow: `0 0 8px ${statusStyles[proStatus].color}`,
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          position: 'absolute',
                          bottom: '-1px',
                          right: '-1px',
                          border: '2px solid rgba(17, 25, 40, 0.9)',
                          transition: 'all 0.3s ease'
                        }}></span>
                </div>
                
                {/* Info */}
                <div style={{
                  flex: 1,
                  overflow: 'hidden'
                }}>
                  <h4 className={styles.proName} title={`${pro.user?.firstName} ${pro.user?.lastName}`} style={{
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    color: '#fff',
                    margin: '0 0 8px 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    letterSpacing: '0.01em',
                    transition: 'all 0.2s ease'
                  }}>
                    {pro.user?.firstName} {pro.user?.lastName}
                  </h4>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{ 
                      color: specialtyInfo.color,
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      whiteSpace: 'nowrap',
                      fontWeight: '500'
                    }}>
                      <span style={{ fontSize: '0.8rem' }}>
                        {specialtyInfo.icon}
                      </span>
                      {specialtyInfo.label}
                    </span>
                    <span style={{
                      fontSize: '0.8rem',
                      color: 'rgba(255, 255, 255, 0.6)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontStyle: 'italic'
                    }}>
                      <FaClock style={{ marginRight: '4px' }} /> {pro.disponibilite || 'Disponible'}
                    </span>
                  </div>
                </div>
                
                {/* Actions */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  flexShrink: 0
                }}>
                  <button 
                    title="Message" 
                    aria-label="Envoyer un message"
                    onClick={(e) => {
                      e.stopPropagation(); // Empêche le clic de sélectionner le professionnel
                      // Action message
                    }}
                    style={{ 
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: 'rgba(255, 255, 255, 0.9)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      backdropFilter: 'blur(4px)',
                      WebkitBackdropFilter: 'blur(4px)',
                      zIndex: 2
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.background = 'rgba(255, 114, 28, 0.3)';
                      e.currentTarget.style.borderColor = 'rgba(255, 114, 28, 0.5)';
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
                      e.currentTarget.style.transform = '';
                      e.currentTarget.style.boxShadow = '';
                    }}
                  >
                    <FaEnvelope style={{ fontSize: '1rem' }} />
                  </button>
                  <button 
                    title="Appel" 
                    aria-label="Appeler"
                    onClick={(e) => {
                      e.stopPropagation(); // Empêche le clic de sélectionner le professionnel
                      // Action appel
                    }}
                    style={{ 
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: 'rgba(255, 255, 255, 0.9)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      backdropFilter: 'blur(4px)',
                      WebkitBackdropFilter: 'blur(4px)',
                      zIndex: 2
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.background = 'rgba(255, 114, 28, 0.3)';
                      e.currentTarget.style.borderColor = 'rgba(255, 114, 28, 0.5)';
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
                      e.currentTarget.style.transform = '';
                      e.currentTarget.style.boxShadow = '';
                    }}
                  >
                    <FaPhoneAlt style={{ fontSize: '1rem' }} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className={styles.emptyProfessionals} style={{
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.7)',
            padding: '30px',
            fontSize: '0.9rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '200px',
            background: 'rgba(0, 0, 0, 0.1)',
            borderRadius: '10px',
            border: '1px dashed rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)'
          }}>
            <FaUserSlash style={{ fontSize: '1.5rem', marginBottom: '10px', color: 'rgba(255, 255, 255, 0.3)' }} />
            <p style={{ marginTop: '5px', fontWeight: '500' }}>Aucun professionnel de santé ne correspond à vos critères</p>
          </div>
        )}
      </div>
    </div>
  );
}
