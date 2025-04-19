'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './HealthProfessionalsList.module.css';
// Importer les icônes nécessaires de react-icons
import { 
  FaAppleAlt, FaHands, FaBrain, FaUserMd, FaUserPlus, 
  FaXRay, FaChild, FaDumbbell, FaCarrot, FaNetworkWired,
  FaThList, FaClock, FaEnvelope, FaPhoneAlt, FaUserSlash,
  FaSearch, FaTimes, FaFilter, FaSyncAlt, FaEllipsisH
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
  const [highlightedCard, setHighlightedCard] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortType, setSortType] = useState('name'); // 'name', 'specialty', 'recent'
  const searchInputRef = useRef(null);
  
  // Effet d'animation au chargement
  useEffect(() => {
    const cards = document.querySelectorAll(`.${styles.professionalCard}`);
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = 1;
        card.style.transform = 'translateY(0)';
      }, 100 * index);
    });
  }, [professionals, filterStatus, searchQuery]);
  
  // Raccourci clavier pour la recherche
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+F ou Cmd+F pour focus sur la recherche
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      // Escape pour effacer la recherche
      if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        setSearchQuery('');
        searchInputRef.current.blur();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Filtrer les professionnels selon le statut, la recherche et le tri
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
    
    const matchesSearch = searchQuery === '' || 
                          fullName.includes(searchQuery.toLowerCase()) ||
                          specialtyLabel.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  }).sort((a, b) => {
    // Tri
    switch (sortType) {
      case 'name':
        return `${a.user.firstName} ${a.user.lastName}`.localeCompare(`${b.user.firstName} ${b.user.lastName}`);
      case 'specialty':
        const specA = specialtyMapping[a.specialty]?.label || a.specialty;
        const specB = specialtyMapping[b.specialty]?.label || b.specialty;
        return specA.localeCompare(specB);
      case 'recent':
        // Simulation - dans une vraie application, cela pourrait être basé sur la date d'ajout
        return parseInt(b.id.replace('hp-', '')) - parseInt(a.id.replace('hp-', ''));
      default:
        return 0;
    }
  });
  
  // Styles pour les statuts
  const statusStyles = {
    active: { color: '#34A853', label: 'Actif' },
    pending: { color: '#FBBC05', label: 'En attente' },
    history: { color: '#9E9E9E', label: 'Historique' }
  };
  
  // Gérer le clic sur un filtre
  const handleFilterClick = (status) => {
    setFilterStatus(status);
    
    // Animation subtile de rafraîchissement de la liste
    const listElement = document.querySelector(`.${styles.professionalsList}`);
    if (listElement) {
      listElement.style.opacity = '0.8';
      setTimeout(() => {
        listElement.style.opacity = '1';
      }, 300);
    }
  };
  
  // Gérer le clic sur un professionnel
  const handleProfessionalClick = (professionalId) => {
    // Effet de pulsation avant sélection
    setHighlightedCard(professionalId);
    setTimeout(() => {
      onProfessionalSelect(professionalId);
      setHighlightedCard(null);
    }, 300);
  };
  
  // Effacer la recherche
  const clearSearch = () => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  };
  
  // Calculer le nombre de professionnels par statut
  const statusCounts = professionals.reduce((acc, pro) => {
    const status = statusMapping[pro.id] || 'active';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
  
  return (
    <div className={styles.professionalsListContainer}>
      <div className={styles.listHeader}>
        <h3 className={styles.listTitle}>
          <FaNetworkWired className={styles.titleIcon} />
          Réseau de professionnels
        </h3>
        
        <div className={styles.filterTabs}>
          <button 
            className={`${styles.filterTab} ${filterStatus === 'all' ? styles.activeFilter : ''}`}
            onClick={() => handleFilterClick('all')}
            title="Tous les professionnels"
          >
            <FaThList /> 
            Tous
            <span className={styles.countBadge}>{professionals.length}</span>
          </button>
          
          <button 
            className={`${styles.filterTab} ${filterStatus === 'active' ? styles.activeFilter : ''}`}
            onClick={() => handleFilterClick('active')}
            title="Professionnels actifs"
          >
            <span 
              className={styles.statusDot} 
              style={{ backgroundColor: statusStyles.active.color }}
            ></span>
            Actifs
            <span className={styles.countBadge}>{statusCounts.active || 0}</span>
          </button>
          
          <button 
            className={`${styles.filterTab} ${filterStatus === 'pending' ? styles.activeFilter : ''}`}
            onClick={() => handleFilterClick('pending')}
            title="Professionnels en attente"
          >
            <span 
              className={styles.statusDot} 
              style={{ backgroundColor: statusStyles.pending.color }}
            ></span>
            En attente
            <span className={styles.countBadge}>{statusCounts.pending || 0}</span>
          </button>
          
          <button 
            className={`${styles.filterTab} ${filterStatus === 'history' ? styles.activeFilter : ''}`}
            onClick={() => handleFilterClick('history')}
            title="Historique des professionnels"
          >
            <span 
              className={styles.statusDot} 
              style={{ backgroundColor: statusStyles.history.color }}
            ></span>
            Historique
            <span className={styles.countBadge}>{statusCounts.history || 0}</span>
          </button>
        </div>
        
        <div className={`${styles.searchBox} ${isSearchFocused ? styles.searchFocused : ''}`}>
          <div className={styles.searchInputWrapper}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Rechercher un professionnel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              ref={searchInputRef}
            />
            {searchQuery && (
              <button 
                className={styles.clearSearch} 
                onClick={clearSearch}
                aria-label="Effacer la recherche"
              >
                <FaTimes />
              </button>
            )}
          </div>
          
          <div className={styles.searchActions}>
            <button 
              className={styles.filterButton} 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              aria-label="Options de filtrage avancées"
              title="Filtre et tri"
            >
              <FaFilter />
            </button>
          </div>
        </div>
        
        {isFilterOpen && (
          <div className={styles.advancedFilterPanel}>
            <div className={styles.sortOptions}>
              <span className={styles.sortTitle}>Trier par:</span>
              <div className={styles.sortButtons}>
                <button
                  className={`${styles.sortButton} ${sortType === 'name' ? styles.activeSort : ''}`}
                  onClick={() => setSortType('name')}
                >
                  Nom
                </button>
                <button
                  className={`${styles.sortButton} ${sortType === 'specialty' ? styles.activeSort : ''}`}
                  onClick={() => setSortType('specialty')}
                >
                  Spécialité
                </button>
                <button
                  className={`${styles.sortButton} ${sortType === 'recent' ? styles.activeSort : ''}`}
                  onClick={() => setSortType('recent')}
                >
                  Récent
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className={styles.professionalsList}>
        {filteredProfessionals.length === 0 ? (
          <div className={styles.emptyList}>
            <div className={styles.emptyIcon}>
              <FaUserSlash />
            </div>
            <p>Aucun professionnel ne correspond à votre recherche</p>
            {searchQuery && (
              <button className={styles.resetButton} onClick={clearSearch}>
                <FaSyncAlt /> Réinitialiser la recherche
              </button>
            )}
          </div>
        ) : (
          filteredProfessionals.map(pro => {
            // Déterminer le statut pour cet élément (pour la démo)
            const proStatus = statusMapping[pro.id] || 'active';
            
            // Déterminer si cette carte est sélectionnée
            const isSelected = pro.id === selectedProfessionalId;
            const isHighlighted = pro.id === highlightedCard;
            
            return (
              <div 
                key={pro.id}
                className={`
                  ${styles.professionalCard} 
                  ${styles[`status${proStatus.charAt(0).toUpperCase()}${proStatus.slice(1)}`]} 
                  ${isSelected ? styles.selectedPro : ''} 
                  ${isHighlighted ? styles.highlightedPro : ''}
                `}
                onClick={() => handleProfessionalClick(pro.id)}
                style={{ opacity: 0, transform: 'translateY(20px)' }}
              >
                <div className={styles.avatarContainer}>
                  <div 
                    className={styles.statusIndicator} 
                    style={{ backgroundColor: statusStyles[proStatus].color }}
                    title={statusStyles[proStatus].label}
                  ></div>
                  
                  <div className={styles.proAvatar}>
                    {pro.user?.photoUrl ? (
                      <Image
                        src={pro.user.photoUrl}
                        alt={`${pro.user.firstName} ${pro.user.lastName}`}
                        width={60}
                        height={60}
                        className={styles.avatarImage}
                        priority={true}
                      />
                    ) : (
                      <div className={styles.avatarPlaceholder} style={{ 
                        backgroundColor: specialtyMapping[pro.specialty]?.color || '#9E9E9E' 
                      }}>
                        {pro.user?.firstName?.charAt(0) || ''}{pro.user?.lastName?.charAt(0) || ''}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className={styles.proDetails}>
                  <div className={styles.proName}>
                    {pro.user?.firstName} {pro.user?.lastName}
                  </div>
                  
                  <div className={styles.proSpecialty}>
                    <span className={styles.specialtyIcon} style={{ 
                      color: specialtyMapping[pro.specialty]?.color || '#9E9E9E' 
                    }}>
                      {specialtyMapping[pro.specialty]?.icon || <FaUserMd />}
                    </span>
                    {specialtyMapping[pro.specialty]?.label || pro.specialty}
                  </div>
                  
                  <div className={styles.contactInfo}>
                    {pro.user?.email && (
                      <div className={styles.contactItem} title={pro.user.email}>
                        <FaEnvelope />
                        <span className={styles.contactText}>{pro.user.email}</span>
                      </div>
                    )}
                    
                    {pro.user?.phone && (
                      <div className={styles.contactItem} title={pro.user.phone}>
                        <FaPhoneAlt />
                        <span className={styles.contactText}>{pro.user.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className={styles.proActions}>
                  <button className={styles.actionButton} title="Plus d'options">
                    <FaEllipsisH />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
