'use client';

import React from 'react';
import compStyles from '../components.module.css';
import { IoNotificationsOutline, IoCheckmarkCircleOutline, IoTimeOutline, IoCalendarOutline } from 'react-icons/io5';

export default function NotificationsSection() {
  // Données fictives pour les notifications
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Nouveau rendez-vous confirmé',
      description: 'Marie Dupont a réservé une consultation le 22 mars à 14:00',
      date: '2025-03-19T15:30:00',
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'Rappel de rendez-vous',
      description: 'Vous avez un rendez-vous avec Pierre Martin demain à 10:00',
      date: '2025-03-18T09:15:00',
      read: true
    },
    {
      id: 3,
      type: 'success',
      title: 'Paiement reçu',
      description: 'Vous avez reçu un paiement de 95€ de Sophie Leclerc',
      date: '2025-03-17T14:22:00',
      read: true
    },
    {
      id: 4,
      type: 'info',
      title: 'Annulation de rendez-vous',
      description: 'Paul Dubois a annulé son rendez-vous du 25 mars',
      date: '2025-03-16T18:05:00',
      read: false
    }
  ];

  // Formater la date relative
  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Aujourd'hui";
    } else if (diffDays === 1) {
      return "Hier";
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jours`;
    } else {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
    }
  };

  return (
    <div className={compStyles.notificationsContainer}>
      <div className={compStyles.notificationsHeader}>
        <h2 className={compStyles.sectionTitle}>
          <IoNotificationsOutline className={compStyles.sectionTitleIcon} />
          Notifications récentes
        </h2>
        <button className={compStyles.secondaryButton}>Marquer tout comme lu</button>
      </div>
      
      <div className={compStyles.notificationsList}>
        {notifications.map(notification => (
          <div key={notification.id} className={`${compStyles.notificationItem} ${!notification.read ? compStyles.notificationUnread : ''}`}>
            <div className={compStyles.notificationIcon}>
              {notification.type === 'success' && <IoCheckmarkCircleOutline className={compStyles.notificationSuccessIcon} />}
              {notification.type === 'info' && <IoTimeOutline className={compStyles.notificationInfoIcon} />}
              {notification.type === 'calendar' && <IoCalendarOutline className={compStyles.notificationCalendarIcon} />}
            </div>
            
            <div className={compStyles.notificationContent}>
              <div className={compStyles.notificationTitle}>{notification.title}</div>
              <div className={compStyles.notificationDesc}>{notification.description}</div>
              <div className={compStyles.notificationDate}>{formatRelativeDate(notification.date)}</div>
            </div>
            
            {!notification.read && <div className={compStyles.notificationBadge}></div>}
          </div>
        ))}
      </div>
      
      <div className={compStyles.notificationsFooter}>
        <button className={compStyles.primaryButton}>Voir toutes les notifications</button>
      </div>
    </div>
  );
}
