'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './Topbar.module.css';
import { MdSearch, MdNotifications, MdOutlineClose, MdCheckCircle, MdLogout, MdSettings, MdPerson, MdCalendarToday } from 'react-icons/md';
import Image from 'next/image';

// Exemple de données utilisateur (à remplacer par les vraies données)
const userInfo = {
  prenom: 'Sanji',
  nom: 'Vinsmoke',
  specialisation: 'Nutrition',
  sous_specialite: 'Diététique',
  photo_url: '/img/professionel/sanji.jpg',
  experience_annees: 10
};

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
    },
    {
      id: 6,
      type: 'system',
      title: 'Mise à jour du logiciel',
      message: 'Une nouvelle version du logiciel est disponible. Cliquez pour installer.',
      timestamp: new Date(now.getTime() - 180 * 60000), // 3 heures ago
      read: true,
      priority: 'medium'
    },
    {
      id: 7,
      type: 'message',
      title: 'Nouveau message',
      message: 'Dr. Sarah Cohen: "Pouvons-nous discuter du cas de M. Martin?"',
      timestamp: new Date(now.getTime() - 240 * 60000), // 4 heures ago
      read: true,
      priority: 'medium'
    },
    {
      id: 8,
      type: 'stock',
      title: 'Alerte stock',
      message: 'Stock de bandes élastiques bientôt épuisé. Pensez à réapprovisionner.',
      timestamp: new Date(now.getTime() - 300 * 60000), // 5 heures ago
      read: true,
      priority: 'low'
    }
  ];
};

export default function Topbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [notifications, setNotifications] = useState(generateNotificationsList());
  const [lastNotification, setLastNotification] = useState(null);
  const [user, setUser] = useState(userInfo);
  
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  // Fermer les dropdowns quand on clique en dehors
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Charger les informations de l'utilisateur
  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setUser(data);
        }
      })
      .catch(error => console.error('Error fetching user:', error));
  }, []);

  // Formater le temps relatif
  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000); // différence en secondes

    if (diff < 60) return 'À l\'instant';
    if (diff < 3600) return `Il y a ${Math.floor(diff / 60)}min`;
    if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)}h`;
    return 'Il y a plus d\'un jour';
  };

  // Simuler la réception d'une nouvelle notification toutes les 20 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification = {
        id: Date.now(),
        type: 'appointment',
        title: 'Nouvelle demande',
        message: 'Demande de rendez-vous entrante...',
        timestamp: new Date(),
        read: false,
        priority: 'medium'
      };

      setNotifications(prev => [newNotification, ...prev]);
      setLastNotification(newNotification);
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  // Mettre à jour lastNotification quand une nouvelle notification arrive
  useEffect(() => {
    if (notifications.length > 0) {
      const newest = notifications.reduce((newest, notification) => 
        notification.timestamp > newest.timestamp ? notification : newest
      , notifications[0]);
      
      setLastNotification(newest);
    }
  }, [notifications]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const handleLogout = () => {
    // Implémenter la déconnexion ici
    console.log('Déconnexion...');
  };

  return (
    <div className={styles.topbar}>
      <div className={styles.searchContainer}>
        <MdSearch className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Rechercher..."
          className={styles.searchInput}
        />
      </div>
      
      <div className={styles.rightSection}>
        <div className={styles.notificationContainer} ref={notificationsRef}>
          {lastNotification && (
            <div className={styles.lastNotification}>
              <span className={styles.lastNotificationTime}>
                {getRelativeTime(lastNotification.timestamp)}
              </span>
            </div>
          )}
          
          <button 
            className={styles.notificationButton}
            onClick={() => setShowNotifications(!showNotifications)}
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
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className={styles.deleteButton}
                          >
                            <MdOutlineClose />
                          </button>
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
          {user && (
            <>
              <div className={styles.userDetails}>
                <span className={styles.userName}>{user.prenom} {user.nom}</span>
                <div className={styles.userSpecialities}>
                  <span className={styles.userRole}>{user.specialisation}</span>
                  {user.sous_specialite && (
                    <span className={styles.userSubRole}>{user.sous_specialite}</span>
                  )}
                </div>
              </div>
              <div 
                className={styles.userAvatar} 
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                <Image
                  src={getImageUrl(user.photo_url)}
                  alt={`${user.prenom} ${user.nom}`}
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
                        src={getImageUrl(user.photo_url)}
                        alt={`${user.prenom} ${user.nom}`}
                        width={80}
                        height={80}
                        priority
                      />
                    </div>
                    <div className={styles.profileInfo}>
                      <h3>{user.prenom} {user.nom}</h3>
                      <p>{user.specialisation}</p>
                      <p className={styles.subSpeciality}>{user.sous_specialite}</p>
                    </div>
                  </div>
                  
                  <div className={styles.profileStats}>
                    <div className={styles.statItem}>
                      <MdCalendarToday />
                      <div>
                        <span className={styles.statValue}>{user.experience_annees} ans</span>
                        <span className={styles.statLabel}>d'expérience</span>
                      </div>
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
                    <button className={`${styles.profileAction} ${styles.logoutAction}`} onClick={handleLogout}>
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
