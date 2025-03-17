'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  FaBell, FaCheckCircle, FaFilter, FaTrashAlt, 
  FaInfoCircle, FaExclamationTriangle, FaCalendarAlt,
  FaUserMd, FaHospital, FaPrescriptionBottleAlt,
  FaFileMedical, FaStethoscope, FaHeartbeat,
  FaRegBell, FaSearch, FaClock, FaSlidersH
} from 'react-icons/fa';
import styles from './NotificationsPanel.module.css';

const NOTIFICATION_TYPES = {
  INFO: { icon: <FaInfoCircle />, color: '#3498db', label: 'Information' },
  WARNING: { icon: <FaExclamationTriangle />, color: '#f39c12', label: 'Avertissement' },
  URGENT: { icon: <FaExclamationTriangle />, color: '#e74c3c', label: 'Urgent' },
  SUCCESS: { icon: <FaCheckCircle />, color: '#2ecc71', label: 'Succès' },
  APPOINTMENT: { icon: <FaCalendarAlt />, color: '#9b59b6', label: 'Rendez-vous' },
  MEDICAL: { icon: <FaUserMd />, color: '#1abc9c', label: 'Médical' },
  PRESCRIPTION: { icon: <FaPrescriptionBottleAlt />, color: '#e67e22', label: 'Ordonnance' }
};

// Génération de données de démonstration
const generateMockNotifications = () => {
  const now = new Date();
  const notifications = [
    {
      id: 1,
      title: 'Nouveau rendez-vous planifié',
      message: 'Un rendez-vous avec Dr. Martin a été planifié pour le 10 mars 2025 à 14h30.',
      timestamp: new Date(now.getTime() - 1000 * 60 * 30), // 30 minutes ago
      type: 'APPOINTMENT',
      read: false,
      professional: {
        id: 101,
        name: 'Dr. Martin',
        specialty: 'DOCTOR'
      }
    },
    {
      id: 2,
      title: 'Résultats d\'analyse disponibles',
      message: 'Les résultats de votre prise de sang du 28/02 sont maintenant disponibles. Veuillez les consulter dès que possible.',
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 3), // 3 hours ago
      type: 'MEDICAL',
      read: false,
      professional: {
        id: 102,
        name: 'Laboratoire Central',
        specialty: 'DOCTOR'
      }
    },
    {
      id: 3,
      title: 'Rappel de rendez-vous',
      message: 'Rappel : Vous avez un rendez-vous demain à 10h00 avec Mme Dupont, votre nutritionniste.',
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 12), // 12 hours ago
      type: 'APPOINTMENT',
      read: true,
      professional: {
        id: 103,
        name: 'Mme Dupont',
        specialty: 'NUTRITIONIST'
      }
    },
    {
      id: 4,
      title: 'Modification d\'ordonnance',
      message: 'Votre ordonnance pour Doliprane a été mise à jour. Veuillez consulter les nouvelles instructions de dosage.',
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24), // 1 day ago
      type: 'PRESCRIPTION',
      read: true,
      professional: {
        id: 101,
        name: 'Dr. Martin',
        specialty: 'DOCTOR'
      }
    },
    {
      id: 5,
      title: 'Nouvelle recommandation d\'exercice',
      message: 'Votre kinésithérapeute a ajouté de nouveaux exercices à votre programme de rééducation.',
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 36), // 1.5 days ago
      type: 'INFO',
      read: true,
      professional: {
        id: 104,
        name: 'Jean Dupont',
        specialty: 'PHYSIOTHERAPIST'
      }
    },
    {
      id: 6,
      title: 'Alerte de suivi médical',
      message: 'Il est temps de prendre rendez-vous pour votre suivi trimestriel. Veuillez contacter votre médecin dès que possible.',
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 48), // 2 days ago
      type: 'WARNING',
      read: false,
      professional: null // Notification système
    },
    {
      id: 7,
      title: 'Programme nutritionnel mis à jour',
      message: 'Votre nutritionniste a mis à jour votre plan alimentaire hebdomadaire.',
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 72), // 3 days ago
      type: 'INFO',
      read: true,
      professional: {
        id: 103,
        name: 'Mme Dupont',
        specialty: 'NUTRITIONIST'
      }
    },
    {
      id: 8,
      title: 'Rappel de prise de médicament',
      message: 'N\'oubliez pas de prendre votre médicament contre l\'hypertension tous les jours selon la prescription.',
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 96), // 4 days ago
      type: 'URGENT',
      read: true,
      professional: {
        id: 101,
        name: 'Dr. Martin',
        specialty: 'DOCTOR'
      }
    },
    {
      id: 9,
      title: 'Confirmation de partage de données',
      message: 'Vous avez autorisé le partage de vos données médicales avec Dr. Legrand.',
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 120), // 5 days ago
      type: 'SUCCESS',
      read: true,
      professional: {
        id: 105,
        name: 'Dr. Legrand',
        specialty: 'DOCTOR'
      }
    },
    {
      id: 10,
      title: 'Votre plan d\'action collaboratif a été mis à jour',
      message: 'Dr. Martin a modifié votre plan d\'action suite à votre dernière consultation.',
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 144), // 6 days ago
      type: 'INFO',
      read: true,
      professional: {
        id: 101,
        name: 'Dr. Martin',
        specialty: 'DOCTOR'
      }
    }
  ];
  
  return notifications;
};

const NotificationsPanel = ({ patient, professionals }) => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef(null);
  
  useEffect(() => {
    // Chargement des notifications (mock)
    setNotifications(generateMockNotifications());
  }, []);

  // Effet pour animer les notifications entrantes
  useEffect(() => {
    const timer = setTimeout(() => {
      const cards = document.querySelectorAll(`.${styles.notificationCard}`);
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, index * 100);
      });
    }, 300);
    
    return () => clearTimeout(timer);
  }, [notifications, filter, searchTerm]);
  
  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const diffMs = now - timestamp;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    } else if (diffMin > 0) {
      return `Il y a ${diffMin} minute${diffMin > 1 ? 's' : ''}`;
    } else {
      return 'À l\'instant';
    }
  };
  
  const formatFullDate = (timestamp) => {
    return timestamp.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };
  
  const deleteNotification = (id) => {
    setNotifications(prev => 
      prev.filter(notif => notif.id !== id)
    );
  };
  
  const clearAllNotifications = () => {
    setNotifications([]);
  };
  
  const getFilteredNotifications = () => {
    let filtered = [...notifications];
    
    // Filtre par type
    if (filter !== 'all') {
      filtered = filtered.filter(notif => notif.type === filter);
    }
    
    // Filtre par recherche
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(notif => 
        notif.title.toLowerCase().includes(term) || 
        notif.message.toLowerCase().includes(term) ||
        (notif.professional && notif.professional.name.toLowerCase().includes(term))
      );
    }
    
    // Tri par date (plus récent en premier)
    filtered.sort((a, b) => b.timestamp - a.timestamp);
    
    return filtered;
  };
  
  const getNotificationTypeInfo = (type) => {
    return NOTIFICATION_TYPES[type] || NOTIFICATION_TYPES.INFO;
  };
  
  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(notif => !notif.read).length;

  const focusSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };
  
  if (!patient) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyStateIcon}>
          <FaRegBell />
        </div>
        <p>Veuillez sélectionner un patient pour voir ses notifications et alertes</p>
      </div>
    );
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          <FaBell className={styles.titleIcon} />
          <h2>Notifications et Alertes</h2>
          {unreadCount > 0 && (
            <span className={styles.badge}>{unreadCount}</span>
          )}
        </div>
        
        <div className={`${styles.search} ${isSearchFocused ? styles.focused : ''}`}>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className={styles.searchInput}
          />
        </div>
      </div>
      
      <div className={styles.actions}>
        <div className={styles.filterContainer}>
          <FaFilter className={styles.filterIcon} />
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">Toutes les notifications</option>
            {Object.entries(NOTIFICATION_TYPES).map(([type, info]) => (
              <option key={type} value={type}>{info.label}</option>
            ))}
          </select>
        </div>
        
        <div className={styles.buttonGroup}>
          <button 
            className={styles.actionButton} 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <FaCheckCircle className={styles.buttonIcon} />
            <span>Tout marquer comme lu</span>
          </button>
          <button 
            className={`${styles.actionButton} ${styles.dangerButton}`} 
            onClick={clearAllNotifications}
            disabled={notifications.length === 0}
          >
            <FaTrashAlt className={styles.buttonIcon} />
            <span>Tout effacer</span>
          </button>
        </div>
      </div>
      
      <div className={styles.notificationList}>
        {filteredNotifications.length === 0 ? (
          <div className={styles.emptyNotifications}>
            <div className={styles.emptyStateIcon}>
              <FaSearch />
            </div>
            <p>Aucune notification ne correspond à vos critères</p>
          </div>
        ) : (
          filteredNotifications.map((notification, index) => {
            const typeInfo = getNotificationTypeInfo(notification.type);
            return (
              <div 
                key={notification.id} 
                className={`${styles.notificationCard} ${notification.read ? styles.read : styles.unread}`}
                onClick={() => markAsRead(notification.id)}
                style={{ 
                  opacity: 0, 
                  transform: 'translateY(20px)',
                  transition: 'all 0.3s ease',
                  transitionDelay: `${index * 0.05}s`
                }}
              >
                <div className={styles.notificationHeader}>
                  <div className={styles.notificationTypeIcon} style={{ color: typeInfo.color }}>
                    {typeInfo.icon}
                  </div>
                  <div className={styles.notificationInfo}>
                    <h3 className={styles.notificationTitle}>{notification.title}</h3>
                    {notification.professional && (
                      <p className={styles.notificationSource}>
                        {notification.professional.name}
                      </p>
                    )}
                  </div>
                  <div className={styles.notificationActions}>
                    <button 
                      className={styles.deleteButton} 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      aria-label="Supprimer la notification"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
                
                <div className={styles.notificationBody}>
                  <p className={styles.notificationMessage}>{notification.message}</p>
                </div>
                
                <div className={styles.notificationFooter}>
                  <span className={styles.notificationType} style={{ backgroundColor: `${typeInfo.color}20`, color: typeInfo.color, borderColor: `${typeInfo.color}30` }}>
                    {typeInfo.label}
                  </span>
                  <span className={styles.notificationTime} title={formatFullDate(notification.timestamp)}>
                    <FaClock style={{ marginRight: '5px', fontSize: '0.8rem', opacity: '0.7' }} />
                    {formatRelativeTime(notification.timestamp)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;
