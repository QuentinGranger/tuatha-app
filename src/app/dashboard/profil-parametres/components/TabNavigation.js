'use client';

import React from 'react';
import styles from './TabNavigation.module.css';
import { 
  IoPersonCircleOutline, 
  IoSettingsOutline, 
  IoNotificationsOutline 
} from 'react-icons/io5';

export default function TabNavigation({ activeTab, setActiveTab }) {
  return (
    <div className={styles.tabNavigation}>
      <button 
        className={`${styles.tabButton} ${activeTab === 'profile' ? styles.tabActive : ''}`}
        onClick={() => setActiveTab('profile')}
      >
        <IoPersonCircleOutline className={styles.tabIcon} />
        <span>Profil</span>
      </button>
      
      <button 
        className={`${styles.tabButton} ${activeTab === 'settings' ? styles.tabActive : ''}`}
        onClick={() => setActiveTab('settings')}
      >
        <IoSettingsOutline className={styles.tabIcon} />
        <span>Paramètres</span>
      </button>
      
      <button 
        className={`${styles.tabButton} ${activeTab === 'notifications' ? styles.tabActive : ''}`}
        onClick={() => setActiveTab('notifications')}
      >
        <IoNotificationsOutline className={styles.tabIcon} />
        <span>Notifications</span>
      </button>
    </div>
  );
}
