'use client';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import styles from './Topbar.module.css';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { 
  MdSearch, 
  MdNotifications, 
  MdSettings, 
  MdLogout, 
  MdCheckCircle,
  MdNotificationsActive,
  MdOutlineFilterAlt,
  MdOutlineSortByAlpha,
  MdOutlineWarning,
  MdOutlineEvent,
  MdOutlineDescription,
  MdOutlineSystemUpdate,
  MdOutlineSnooze,
  MdDeleteOutline,
  MdOutlineReply,
  MdOutlineMarkEmailRead,
  MdOutlineMarkEmailUnread,
  MdOutlineDoNotDisturbOn,
  MdAccessTime,
  MdOutlineLight,
  MdDarkMode,
  MdOutlinePriorityHigh,
  MdOutlineNotificationsPaused,
  MdPerson
} from 'react-icons/md';

import { FaRegBell } from 'react-icons/fa';
import { IoMdSync } from 'react-icons/io';
import { RiPushpinLine, RiPushpinFill } from 'react-icons/ri';

const getImageUrl = (url) => {
  console.log('Photo URL reçue:', url); // Ajout d'un log pour déboguer
  
  if (!url) {
    console.log('Aucune URL fournie, utilisation de l\'avatar par défaut');
    return '/img/professionel/default-avatar.jpg';
  }
  
  // Si l'URL est déjà une URL complète (commence par http ou https)
  if (url.startsWith('http')) {
    console.log('URL complète détectée:', url);
    return url;
  }
  
  // Vérifier que l'URL commence par un slash
  const formattedUrl = url.startsWith('/') ? url : `/${url}`;
  console.log('URL formatée:', formattedUrl);
  
  // Si c'est un chemin local, on ajoute le préfixe de l'API si on est en prod
  if (process.env.NEXT_PUBLIC_API_URL && process.env.NODE_ENV === 'production') {
    const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}${formattedUrl}`;
    console.log('URL en production:', fullUrl);
    return fullUrl;
  }
  
  // En dev ou si pas d'URL d'API configurée, on utilise le chemin local
  console.log('URL finale en dev:', formattedUrl);
  return formattedUrl;
};

// Exemple de notifications avec timestamps réels
const generateNotificationsList = () => {
  const now = new Date();
  return [
    {
      id: 1,
      type: 'urgent',
      title: 'Annulation urgente',
      message: 'Zelda a annulé son rendez-vous de 15h30 pour cause de maladie',
      timestamp: new Date(now.getTime() - 2 * 60000), // 2 minutes ago
      read: false,
      priority: 'high'
    },
    {
      id: 2,
      type: 'appointment',
      title: 'Nouveau rendez-vous',
      message: 'Master Chief souhaite un rendez-vous pour une rééducation du genou',
      timestamp: new Date(now.getTime() - 15 * 60000), // 15 minutes ago
      read: false,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'document',
      title: 'Nouveau document médical',
      message: 'Dr. Gordon Freeman a partagé une ordonnance pour le patient Kratos',
      timestamp: new Date(now.getTime() - 45 * 60000), // 45 minutes ago
      read: false,
      priority: 'medium'
    },
    {
      id: 4,
      type: 'reminder',
      title: 'Rappel de consultation',
      message: 'Consultation de suivi avec Lara Croft demain à 10h00',
      timestamp: new Date(now.getTime() - 60 * 60000), // 1 heure ago
      read: false,
      priority: 'low'
    },
    {
      id: 5,
      type: 'payment',
      title: 'Paiement reçu',
      message: 'Paiement de 65€ reçu de Mario pour la séance du 05/02',
      timestamp: new Date(now.getTime() - 120 * 60000), // 2 heures ago
      read: true,
      priority: 'low'
    }
  ];
};

export default function Topbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [healthProfessional, setHealthProfessional] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifDropdownPosition, setNotifDropdownPosition] = useState({ top: 0, right: 0 });
  const [expandedNotification, setExpandedNotification] = useState(null);
  const [notificationHoveredId, setNotificationHoveredId] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState('all');
  const [notificationSort, setNotificationSort] = useState('newest');
  const [mounted, setMounted] = useState(false);
  
  // Nouveaux états pour les fonctionnalités avancées
  const [notificationView, setNotificationView] = useState('default'); // 'default', 'grouped', 'timeline'
  const [notificationGroups, setNotificationGroups] = useState({});
  const [pinnedNotifications, setPinnedNotifications] = useState([]);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(60000); // 1 minute par défaut
  const [lastRefreshTime, setLastRefreshTime] = useState(null);
  const [notificationSound, setNotificationSound] = useState(false);
  const refreshIntervalRef = useRef(null);
  
  // Intégration du thème avec next-themes
  const { theme, setTheme } = useTheme() || { theme: 'dark', setTheme: () => {} };
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(theme === 'dark');
  }, [theme]);

  const notificationsRef = useRef(null);
  const profileRef = useRef(null);
  const notificationButtonRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchHealthProfessional = async () => {
      try {
        const response = await fetch('/api/health-professional/current');
        if (!response.ok) {
          throw new Error('Failed to fetch health professional');
        }
        const data = await response.json();
        // L'API peut renvoyer directement un objet ou un objet avec une propriété healthProfessional
        setHealthProfessional(data);
      } catch (error) {
        console.error('Error fetching health professional:', error);
      }
    };

    fetchHealthProfessional();
  }, []);

  useEffect(() => {
    // Charger les notifications
    const notifs = generateNotificationsList();
    setNotifications(notifs);
  }, []);

  useEffect(() => {
    // Générer des notifications de test avec différents types et priorités
    const testNotifications = [
      {
        id: '1',
        title: 'Consultation aujourd\'hui',
        message: 'Rappel: Vous avez un rendez-vous avec Link à 14h30.',
        timestamp: new Date(Date.now() - 30 * 60000), // 30 minutes ago
        read: false,
        type: 'appointment',
        priority: 'high'
      },
      {
        id: '2',
        title: 'Nouveau document disponible',
        message: 'Un nouveau rapport médical a été ajouté au dossier de Ellie.',
        timestamp: new Date(Date.now() - 2 * 60 * 60000), // 2 hours ago
        read: false,
        type: 'document',
        priority: 'medium'
      },
      {
        id: '3',
        title: 'Mise à jour système',
        message: 'Une mise à jour du système est disponible. Agent 47 vous recommande de redémarrer votre application.',
        timestamp: new Date(Date.now() - 5 * 60 * 60000), // 5 hours ago
        read: true,
        type: 'system',
        priority: 'low'
      },
      {
        id: '4',
        title: 'Alerte médicament',
        message: 'Attention: interaction médicamenteuse potentielle détectée pour le patient Cloud Strife.',
        timestamp: new Date(Date.now() - 10 * 60000), // 10 minutes ago
        read: false,
        type: 'urgent',
        priority: 'high'
      },
      {
        id: '5',
        title: 'Rappel de rendez-vous',
        message: 'Le patient Geralt de Rivia a confirmé son rendez-vous pour demain à 9h15.',
        timestamp: new Date(Date.now() - 1 * 60 * 60000), // 1 hour ago
        read: true,
        type: 'appointment',
        priority: 'medium'
      },
    ];
    
    // Mettre à jour l'état des notifications avec les données de test
    if (notifications.length === 0) {
      setNotifications(testNotifications);
    }
  }, [notifications.length]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target) &&
          notificationButtonRef.current && !notificationButtonRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    }
    
    function handleEscapeKey(event) {
      if (event.key === 'Escape') {
        setShowNotifications(false);
        setShowProfileDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleNotificationClick = () => {
    if (notificationButtonRef.current) {
      const rect = notificationButtonRef.current.getBoundingClientRect();
      setNotifDropdownPosition({
        top: rect.bottom + 12,
        right: window.innerWidth - rect.right,
      });
    }
    setShowNotifications(!showNotifications);
    setShowProfileDropdown(false);
    
    // Ajout d'un élément au body pour contourner tout problème de conteneur
    if (!showNotifications) {
      document.body.classList.remove('notifications-open');
    } else {
      document.body.classList.add('notifications-open');
    }
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
    setShowNotifications(false);
    
    // Ajouter la classe au body pour le dropdown du profil
    if (!showProfileDropdown) {
      document.body.classList.add('profile-dropdown-open');
    } else {
      document.body.classList.remove('profile-dropdown-open');
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(notifications.map(notification => {
      if (notification.id === notificationId) {
        return { ...notification, read: true };
      }
      return notification;
    }));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  // Fonction pour filtrer et trier les notifications
  const getFilteredNotifications = () => {
    let filtered = [...notifications];
    
    // Appliquer le filtre
    if (notificationFilter !== 'all') {
      filtered = filtered.filter(notification => 
        notification.type === notificationFilter || 
        (notificationFilter === 'unread' && !notification.read)
      );
    }
    
    // Appliquer le tri
    if (notificationSort === 'newest') {
      filtered.sort((a, b) => b.timestamp - a.timestamp);
    } else if (notificationSort === 'oldest') {
      filtered.sort((a, b) => a.timestamp - b.timestamp);
    } else if (notificationSort === 'priority') {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    }
    
    return filtered;
  };

  // Fonction pour gérer l'expansion des notifications
  const toggleExpandNotification = (id) => {
    if (expandedNotification === id) {
      setExpandedNotification(null);
    } else {
      setExpandedNotification(id);
    }
  };
  
  // Fonction pour l'interaction avec les notifications
  const handleNotificationAction = (notificationId, action) => {
    if (action === 'respond') {
      // Simuler une réponse rapide
      console.log('Réponse à la notification:', notificationId);
      // Simuler un délai de traitement
      setTimeout(() => {
        setNotifications(notifications.map(n => 
          n.id === notificationId ? {...n, responded: true, read: true} : n
        ));
      }, 500);
    } else if (action === 'snooze') {
      // Masquer temporairement la notification
      console.log('Notification snooze:', notificationId);
      setNotifications(notifications.map(n => 
        n.id === notificationId ? {...n, snoozed: true} : n
      ));
    } else if (action === 'delete') {
      console.log('Suppression de la notification:', notificationId);
      setNotifications(notifications.filter(n => n.id !== notificationId));
    }
  };

  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    
    const days = Math.floor(hours / 24);
    return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
  };

  // Fonction pour simuler la récupération de nouvelles notifications
  const fetchNewNotifications = () => {
    // Simuler un appel API pour obtenir les nouvelles notifications
    console.log('Récupération de nouvelles notifications');
    const newNotification = {
      id: `new-${Date.now()}`,
      title: 'Notification automatique',
      message: 'Alerte: Sonic the Hedgehog a besoin d\'un bilan de réévaluation.',
      timestamp: new Date(),
      read: false,
      type: Math.random() > 0.5 ? 'system' : 'document',
      priority: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low'
    };

    // Jouer un son si l'option est activée
    if (notificationSound) {
      playNotificationSound();
    }

    setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
    setLastRefreshTime(new Date());
  };

  // Fonction pour jouer un son de notification
  const playNotificationSound = () => {
    // Cette fonction simulerait la lecture d'un son de notification
    console.log('Son de notification joué');
    // Dans une implémentation réelle, on utiliserait l'API Web Audio
    // const audio = new Audio('/notification-sound.mp3');
    // audio.play();
  };

  // Fonction pour le rafraîchissement automatique des notifications
  useEffect(() => {
    // Cette fonction sera utilisée pour la dépendance dans useEffect
    const fetchAndUpdate = () => {
      fetchNewNotifications();
    };

    if (autoRefreshEnabled) {
      console.log(`Activation du rafraîchissement automatique toutes les ${refreshInterval/1000} secondes`);
      // Démarrer l'intervalle de rafraîchissement
      refreshIntervalRef.current = setInterval(fetchAndUpdate, refreshInterval);
    } else {
      // Arrêter l'intervalle de rafraîchissement
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        console.log('Rafraîchissement automatique désactivé');
      }
    }

    // Nettoyage au démontage
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        console.log('Nettoyage de l\'intervalle de rafraîchissement');
      }
    };
  }, [autoRefreshEnabled, refreshInterval]);

  // Fonction pour épingler/désépingler une notification
  const togglePinNotification = (notificationId) => {
    if (pinnedNotifications.includes(notificationId)) {
      // Désépingler
      setPinnedNotifications(prev => prev.filter(id => id !== notificationId));
    } else {
      // Épingler
      setPinnedNotifications(prev => [...prev, notificationId]);
    }
  };

  // Fonction pour grouper les notifications
  const getGroupedNotifications = () => {
    const groups = {};
    
    getFilteredNotifications().forEach(notification => {
      const groupKey = notification.type || 'other';
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(notification);
    });
    
    return groups;
  };
  
  // Fonction pour changer la vue des notifications
  const changeNotificationView = (view) => {
    setNotificationView(view);
    if (view === 'grouped') {
      setNotificationGroups(getGroupedNotifications());
    }
  };
  
  // Fonction pour alterner le thème clair/sombre
  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setTheme(newTheme);
    setIsDarkMode(newTheme === 'dark');
  };

  return (
    <div className={styles.topbar}>
      <div className={styles.searchContainer}>
        <MdSearch className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={handleSearchChange}
          className={styles.searchInput}
          data-form-type="other"
          autoComplete="off"
        />
      </div>

      <div className={styles.rightSection}>
        <div className={styles.notificationContainer} ref={notificationsRef}>
          {notifications.length > 0 && (
            <div className={styles.lastNotification}>
              <span className={styles.lastNotificationTime}>
                {getRelativeTime(notifications[0].timestamp)}
              </span>
            </div>
          )}
          
          <button 
            className={styles.notificationButton}
            onClick={handleNotificationClick}
            ref={notificationButtonRef}
          >
            <MdNotifications className={styles.notificationIcon} />
            {notifications.filter(n => !n.read).length > 0 && (
              <span className={styles.notificationBadge}>
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>

          {/* Utilisation d'un vrai portail React pour le dropdown des notifications */}
          {showNotifications && mounted && createPortal(
            <div 
              ref={notificationsRef}
              className={styles.notificationsDropdown} 
              style={{ 
                top: `${notifDropdownPosition.top}px`, 
                right: `${notifDropdownPosition.right}px`,
              }}
            >
              <div className={styles.notificationsHeader}>
                <h3>Notifications</h3>
                <div className={styles.notificationActions}>
                  {notifications.filter(n => !n.read).length > 0 && (
                    <button 
                      className={styles.markAllRead}
                      onClick={markAllAsRead}
                    >
                      <MdOutlineMarkEmailRead className={styles.actionIcon} />
                      <span>Tout lire</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Barre d'outils inédite pour les notifications */}
              <div className={styles.notificationToolbar}>
                <div className={styles.notificationViews}>
                  <button 
                    className={`${styles.viewButton} ${notificationView === 'default' ? styles.active : ''}`}
                    onClick={() => changeNotificationView('default')}
                    title="Vue standard"
                  >
                    <FaRegBell />
                  </button>
                  <button 
                    className={`${styles.viewButton} ${notificationView === 'grouped' ? styles.active : ''}`}
                    onClick={() => changeNotificationView('grouped')}
                    title="Vue groupée"
                  >
                    <MdOutlineFilterAlt />
                  </button>
                  <button 
                    className={`${styles.viewButton} ${notificationView === 'timeline' ? styles.active : ''}`}
                    onClick={() => changeNotificationView('timeline')}
                    title="Vue chronologique"
                  >
                    <MdAccessTime />
                  </button>
                </div>
                <div className={styles.notificationSettings}>
                  <button 
                    className={`${styles.settingButton} ${autoRefreshEnabled ? styles.active : ''}`}
                    onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
                    title="Actualisation automatique"
                  >
                    <IoMdSync className={autoRefreshEnabled ? styles.spinning : ''} />
                  </button>
                  <button 
                    className={`${styles.settingButton} ${notificationSound ? styles.active : ''}`}
                    onClick={() => setNotificationSound(!notificationSound)}
                    title={notificationSound ? "Son activé" : "Son désactivé"}
                  >
                    {notificationSound ? 
                      <MdNotificationsActive /> : 
                      <MdOutlineDoNotDisturbOn />
                    }
                  </button>
                  <button 
                    className={styles.settingButton}
                    onClick={toggleTheme}
                    title={isDarkMode ? "Passer au mode clair" : "Passer au mode sombre"}
                  >
                    {isDarkMode ? <MdOutlineLight /> : <MdDarkMode />}
                  </button>
                </div>
              </div>
              {autoRefreshEnabled && lastRefreshTime && (
                <div className={styles.refreshInfo}>
                  Dernière mise à jour: {getRelativeTime(lastRefreshTime)}
                </div>
              )}

              {/* Nouvelle barre de filtres et tri */}
              <div className={styles.notificationFilters}>
                <div className={styles.filterGroup}>
                  <button 
                    className={`${styles.filterButton} ${notificationFilter === 'all' ? styles.active : ''}`}
                    onClick={() => setNotificationFilter('all')}
                  >
                    Toutes
                  </button>
                  <button 
                    className={`${styles.filterButton} ${notificationFilter === 'unread' ? styles.active : ''}`}
                    onClick={() => setNotificationFilter('unread')}
                  >
                    Non lues
                  </button>
                  <button 
                    className={`${styles.filterButton} ${notificationFilter === 'urgent' ? styles.active : ''}`}
                    onClick={() => setNotificationFilter('urgent')}
                  >
                    Urgentes
                  </button>
                </div>
                <div className={styles.sortDropdown}>
                  <select 
                    value={notificationSort}
                    onChange={(e) => setNotificationSort(e.target.value)}
                    className={styles.sortSelect}
                  >
                    <option value="newest">Plus récentes</option>
                    <option value="oldest">Plus anciennes</option>
                    <option value="priority">Priorité</option>
                  </select>
                </div>
              </div>

              <div className={styles.notificationsList}>
                {notificationView === 'default' && getFilteredNotifications().length > 0 ? (
                  getFilteredNotifications().map((notification) => (
                    <div 
                      key={notification.id}
                      className={`${styles.notificationItem} 
                        ${!notification.read ? styles.unread : ''} 
                        ${styles[notification.priority]} 
                        ${expandedNotification === notification.id ? styles.expanded : ''}
                        ${notification.snoozed ? styles.snoozed : ''}
                        ${pinnedNotifications.includes(notification.id) ? styles.pinned : ''}
                        ${notification.responded ? styles.responded : ''}
                      `}
                      onMouseEnter={() => setNotificationHoveredId(notification.id)}
                      onMouseLeave={() => setNotificationHoveredId(null)}
                      onClick={() => toggleExpandNotification(notification.id)}
                    >
                      <div className={styles.notificationContent}>
                        <div className={styles.notificationHeader}>
                          <div className={styles.notificationHeaderInfo}>
                            <div className={styles.notificationTypeIcon}>
                              {notification.type === 'urgent' && <MdOutlineWarning />}
                              {notification.type === 'appointment' && <MdOutlineEvent />}
                              {notification.type === 'document' && <MdOutlineDescription />}
                              {notification.type === 'system' && <MdOutlineSystemUpdate />}
                            </div>
                            <h4>{notification.title}</h4>
                          </div>
                          <div className={styles.notificationActions}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePinNotification(notification.id);
                              }}
                              className={styles.pinButton}
                              title={pinnedNotifications.includes(notification.id) ? "Désépingler" : "Épingler"}
                            >
                              {pinnedNotifications.includes(notification.id) ? 
                                <RiPushpinFill className={styles.pinned} /> : 
                                <RiPushpinLine />
                              }
                            </button>
                            {!notification.read && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                                className={styles.markReadButton}
                                title="Marquer comme lue"
                              >
                                <MdCheckCircle />
                              </button>
                            )}
                          </div>
                        </div>
                        <p className={styles.notificationMessage}>{notification.message}</p>
                        {notification.priority === 'high' && (
                          <div className={styles.priorityBadge}>
                            <MdOutlinePriorityHigh />
                            Priorité haute
                          </div>
                        )}
                        <span className={styles.timestamp}>
                          {getRelativeTime(notification.timestamp)}
                        </span>
                        
                        {/* Panneau d'actions avancées sur la notification */}
                        {expandedNotification === notification.id && (
                          <div className={styles.expandedActions}>
                            <button 
                              className={styles.actionButton}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNotificationAction(notification.id, 'respond');
                              }}
                              title="Répondre"
                            >
                              <MdOutlineReply />
                              Répondre
                            </button>
                            <button 
                              className={styles.actionButton}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNotificationAction(notification.id, 'snooze');
                              }}
                              title="Reporter"
                            >
                              <MdOutlineSnooze />
                              Reporter
                            </button>
                            <button 
                              className={`${styles.actionButton} ${styles.deleteAction}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNotificationAction(notification.id, 'delete');
                              }}
                              title="Supprimer"
                            >
                              <MdDeleteOutline />
                              Supprimer
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : notificationView === 'grouped' ? (
                  // Vue groupée par type
                  Object.entries(getGroupedNotifications()).map(([type, groupNotifications]) => (
                    <div key={type} className={styles.notificationGroup}>
                      <div className={styles.groupHeader}>
                        <h3 className={styles.groupTitle}>
                          {type === 'urgent' && <MdOutlineWarning />}
                          {type === 'appointment' && <MdOutlineEvent />}
                          {type === 'document' && <MdOutlineDescription />}
                          {type === 'system' && <MdOutlineSystemUpdate />}
                          {type === 'other' && <FaRegBell />}
                          {type === 'urgent' && 'Urgentes'}
                          {type === 'appointment' && 'Rendez-vous'}
                          {type === 'document' && 'Documents'}
                          {type === 'system' && 'Système'}
                          {type === 'other' && 'Autres'}
                        </h3>
                        <span className={styles.groupCount}>{groupNotifications.length}</span>
                      </div>
                      {groupNotifications.map(notification => (
                        <div 
                          key={notification.id}
                          className={`${styles.notificationItem} ${styles.groupedItem} ${!notification.read ? styles.unread : ''}`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <h4>{notification.title}</h4>
                          <p>{notification.message}</p>
                          <span className={styles.timestamp}>{getRelativeTime(notification.timestamp)}</span>
                        </div>
                      ))}
                    </div>
                  ))
                ) : notificationView === 'timeline' ? (
                  // Vue chronologique avec timeline
                  <div className={styles.timelineView}>
                    {getFilteredNotifications().length > 0 ? (
                      <>
                        <div className={styles.timelineDates}>
                          <div className={styles.timelineDate}>Aujourd'hui</div>
                          <div className={styles.timelineLine}></div>
                        </div>
                        {getFilteredNotifications()
                          .filter(n => {
                            const today = new Date();
                            const notifDate = new Date(n.timestamp);
                            return notifDate.setHours(0,0,0,0) === today.setHours(0,0,0,0);
                          })
                          .map(notification => (
                            <div 
                              key={notification.id} 
                              className={`${styles.timelineItem} ${!notification.read ? styles.unread : ''}`}
                            >
                              <div className={styles.timelineTime}>
                                {new Date(notification.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </div>
                              <div className={styles.timelineContent}>
                                <div className={styles.timelineDot}></div>
                                <div 
                                  className={`${styles.timelineCard} ${styles[notification.priority]}`} 
                                  onClick={() => toggleExpandNotification(notification.id)}
                                >
                                  <h4>{notification.title}</h4>
                                  <p>{notification.message}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        }
                        
                        <div className={styles.timelineDates}>
                          <div className={styles.timelineDate}>Plus tôt</div>
                          <div className={styles.timelineLine}></div>
                        </div>
                        {getFilteredNotifications()
                          .filter(n => {
                            const today = new Date();
                            const notifDate = new Date(n.timestamp);
                            return notifDate.setHours(0,0,0,0) !== today.setHours(0,0,0,0);
                          })
                          .map(notification => (
                            <div 
                              key={notification.id} 
                              className={`${styles.timelineItem} ${!notification.read ? styles.unread : ''}`}
                            >
                              <div className={styles.timelineTime}>
                                {new Date(notification.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </div>
                              <div className={styles.timelineContent}>
                                <div className={styles.timelineDot}></div>
                                <div 
                                  className={`${styles.timelineCard} ${styles[notification.priority]}`} 
                                  onClick={() => toggleExpandNotification(notification.id)}
                                >
                                  <h4>{notification.title}</h4>
                                  <p>{notification.message}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        }
                      </>
                    ) : (
                      <div className={styles.emptyNotifications}>
                        <div className={styles.emptyIcon}><FaBell /></div>
                        <p>Aucune notification pour cette période</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={styles.emptyNotifications}>
                    <div className={styles.emptyIcon}><FaBell /></div>
                    <p>Aucune notification {notificationFilter !== 'all' ? 'de ce type' : ''}</p>
                  </div>
                )}
              </div>
            </div>,
            document.body
          )}
        </div>

        <div className={styles.userInfo} ref={profileRef}>
          {healthProfessional && (
            <>
              <div className={styles.userDetails}>
                <span className={styles.userName}>
                  {healthProfessional.user.firstName} {healthProfessional.user.lastName}
                </span>
                <div className={styles.userSpecialities}>
                  <span className={styles.userRole}>{healthProfessional.specialty}</span>
                  {healthProfessional.subSpecialty && (
                    <span className={styles.userSubRole}>{healthProfessional.subSpecialty}</span>
                  )}
                </div>
              </div>
              <div 
                className={styles.userAvatar}
                onClick={handleProfileClick}
              >
                <Image
                  src={getImageUrl(healthProfessional.user.photoUrl)}
                  alt={`${healthProfessional.user.firstName} ${healthProfessional.user.lastName}`}
                  width={42}
                  height={42}
                  priority
                />
              </div>

              {showProfileDropdown && mounted && createPortal(
                <div 
                  ref={profileRef}
                  className={styles.profileDropdown}
                  style={{
                    position: 'fixed',
                    top: `${window.scrollY + 80}px`,
                    right: '20px',
                    zIndex: 20000
                  }}
                >
                  <div className={styles.profileHeader}>
                    <div className={styles.profileImageLarge}>
                      <Image
                        src={getImageUrl(healthProfessional.user.photoUrl)}
                        alt={`${healthProfessional.user.firstName} ${healthProfessional.user.lastName}`}
                        width={80}
                        height={80}
                        priority
                      />
                    </div>
                    <div className={styles.profileInfo}>
                      <h3>{healthProfessional.user.firstName} {healthProfessional.user.lastName}</h3>
                      <p>{healthProfessional.specialty}</p>
                      <p className={styles.subSpeciality}>{healthProfessional.subSpecialty}</p>
                    </div>
                  </div>

                  <div className={styles.profileActions}>
                    <button className={styles.profileAction}>
                      <MdPerson />
                      <span>Mon Profil</span>
                    </button>
                    <button className={styles.profileAction}>
                      <MdSettings />
                      <span>Paramètres</span>
                    </button>
                    <button className={`${styles.profileAction} ${styles.logoutAction}`}>
                      <MdLogout />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </div>,
                document.body
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
