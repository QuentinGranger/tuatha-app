'use client';

import React, { useState } from 'react';
import compStyles from '../components.module.css';
import { 
  IoPersonOutline, 
  IoNotificationsOutline, 
  IoCalendarOutline, 
  IoCardOutline,
  IoAppsOutline,
  IoShieldOutline,
  IoEllipsisHorizontal,
  IoAdd,
  IoChatboxOutline,
  IoCartOutline
} from 'react-icons/io5';

// Import des sous-composants
import AccountSettings from './settings/AccountSettings';
import NotificationSettings from './settings/NotificationSettings';
import CalendarSettings from './settings/CalendarSettings';
import PaymentSettings from './settings/PaymentSettings';
import IntegrationSettings from './settings/IntegrationSettings';
import PrivacySettings from './settings/PrivacySettings';

export default function SettingsSection() {
  const [activeSettingsTab, setActiveSettingsTab] = useState('compte');

  return (
    <div className={compStyles.settingsSection}>
      <div className={compStyles.settingsNavigation}>
        <button 
          className={`${compStyles.settingsNavButton} ${activeSettingsTab === 'compte' ? compStyles.settingsNavActive : ''}`} 
          onClick={() => setActiveSettingsTab('compte')}
        >
          <div className={compStyles.settingsNavIconContainer}>
            <IoPersonOutline className={compStyles.settingsNavIcon} />
          </div>
          <span>Compte</span>
        </button>
        
        <button 
          className={`${compStyles.settingsNavButton} ${activeSettingsTab === 'notification' ? compStyles.settingsNavActive : ''}`} 
          onClick={() => setActiveSettingsTab('notification')}
        >
          <div className={compStyles.settingsNavIconContainer}>
            <IoNotificationsOutline className={compStyles.settingsNavIcon} />
          </div>
          <span>Notifications</span>
        </button>
        
        <button 
          className={`${compStyles.settingsNavButton} ${activeSettingsTab === 'calendrier' ? compStyles.settingsNavActive : ''}`} 
          onClick={() => setActiveSettingsTab('calendrier')}
        >
          <div className={compStyles.settingsNavIconContainer}>
            <IoCalendarOutline className={compStyles.settingsNavIcon} />
          </div>
          <span>Calendrier</span>
        </button>
        
        <button 
          className={`${compStyles.settingsNavButton} ${activeSettingsTab === 'payment' ? compStyles.settingsNavActive : ''}`} 
          onClick={() => setActiveSettingsTab('payment')}
        >
          <div className={compStyles.settingsNavIconContainer}>
            <IoCardOutline className={compStyles.settingsNavIcon} />
          </div>
          <span>Paiements</span>
        </button>
        
        <button 
          className={`${compStyles.settingsNavButton} ${activeSettingsTab === 'integrations' ? compStyles.settingsNavActive : ''}`} 
          onClick={() => setActiveSettingsTab('integrations')}
        >
          <div className={compStyles.settingsNavIconContainer}>
            <IoAppsOutline className={compStyles.settingsNavIcon} />
          </div>
          <span>Intégrations</span>
        </button>
        
        <button 
          className={`${compStyles.settingsNavButton} ${activeSettingsTab === 'confidentialite' ? compStyles.settingsNavActive : ''}`} 
          onClick={() => setActiveSettingsTab('confidentialite')}
        >
          <div className={compStyles.settingsNavIconContainer}>
            <IoShieldOutline className={compStyles.settingsNavIcon} />
          </div>
          <span>Confidentialité</span>
        </button>
      </div>
      
      <div className={compStyles.settingsContent}>
        {activeSettingsTab === 'compte' && <AccountSettings />}
        {activeSettingsTab === 'notification' && <NotificationSettings />}
        {activeSettingsTab === 'calendrier' && <CalendarSettings />}
        {activeSettingsTab === 'payment' && <PaymentSettings />}
        {activeSettingsTab === 'integrations' && <IntegrationSettings />}
        {activeSettingsTab === 'confidentialite' && <PrivacySettings />}
      </div>
    </div>
  );
}
