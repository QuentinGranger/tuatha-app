'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './Topbar.module.css';
import { MdSearch, MdNotifications, MdOutlineClose, MdCheckCircle, MdLogout, MdSettings, MdPerson, MdCalendarToday } from 'react-icons/md';
import Image from 'next/image';

const getImageUrl = (url) => {
  if (!url) return '/img/professionel/default-avatar.jpg';
  
  // Si l'URL est déjà une URL complète (commence par http ou https)
  if (url.startsWith('http')) {
    return url;
  }
  
  // Si c'est un chemin local, on ajoute le préfixe de l'API si on est en prod
  if (process.env.NEXT_PUBLIC_API_URL && process.env.NODE_ENV === 'production') {
    return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
  }
  
  // En dev ou si pas d'URL d'API configurée, on utilise le chemin local
  return url;
};

// Exemple de notifications avec timestamps réels
const generateNotificationsList = () => {
  const now = new Date();
  return [
    {
      id: 1,
      type: 'urgent',
      title: 'Annulation urgente',
      message: 'Mme Sophie Laurent a annulé son rendez-vous de 15h30 pour cause de maladie',
      timestamp: new Date(now.getTime() - 2 * 60000), // 2 minutes ago
      read: false,
      priority: 'high'
    },
    {
      id: 2,
      type: 'appointment',
      title: 'Nouveau rendez-vous',
      message: 'M. Thomas Bernard souhaite un rendez-vous pour une rééducation du genou',
      timestamp: new Date(now.getTime() - 15 * 60000), // 15 minutes ago
      read: false,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'document',
      title: 'Nouveau document médical',
      message: 'Dr Martinez a partagé une ordonnance pour le patient Pierre Dubois',
      timestamp: new Date(now.getTime() - 45 * 60000), // 45 minutes ago
      read: false,
      priority: 'medium'
    },
    {
      id: 4,
      type: 'reminder',
      title: 'Rappel de consultation',
      message: 'Consultation de suivi avec Emma Martin demain à 10h00',
      timestamp: new Date(now.getTime() - 60 * 60000), // 1 heure ago
      read: false,
      priority: 'low'
    },
    {
      id: 5,
      type: 'payment',
      title: 'Paiement reçu',
      message: 'Paiement de 65€ reçu de Jean Dupont pour la séance du 05/02',
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
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

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
    function handleClickOutside(event) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setShowProfileDropdown(false);
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
    setShowNotifications(false);
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
          >
            <MdNotifications className={styles.notificationIcon} />
            {notifications.filter(n => !n.read).length > 0 && (
              <span className={styles.notificationBadge}>
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className={styles.notificationsDropdown}>
              <div className={styles.notificationsHeader}>
                <h3>Notifications</h3>
                {notifications.filter(n => !n.read).length > 0 && (
                  <button 
                    className={styles.markAllRead}
                    onClick={markAllAsRead}
                  >
                    Tout marquer comme lu
                  </button>
                )}
              </div>

              <div className={styles.notificationsList}>
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`${styles.notificationItem} ${!notification.read ? styles.unread : ''} ${styles[notification.priority]}`}
                  >
                    <div className={styles.notificationContent}>
                      <div className={styles.notificationHeader}>
                        <h4>{notification.title}</h4>
                        <div className={styles.notificationActions}>
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className={styles.markReadButton}
                            >
                              <MdCheckCircle />
                            </button>
                          )}
                        </div>
                      </div>
                      <p>{notification.message}</p>
                      <span className={styles.timestamp}>
                        {getRelativeTime(notification.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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

              {showProfileDropdown && (
                <div className={styles.profileDropdown}>
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
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
