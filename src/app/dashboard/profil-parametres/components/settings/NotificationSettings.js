'use client';

import React from 'react';
import compStyles from '../../components.module.css';
import { IoNotificationsOutline } from 'react-icons/io5';

export default function NotificationSettings() {
  return (
    <>
      <h2 className={compStyles.settingsTitle}>
        <IoNotificationsOutline className={compStyles.settingsTitleIcon} />
        Préférences de notifications
      </h2>
      
      <div className={compStyles.settingsForm}>
        <div className={compStyles.settingsGroup}>
          <h3 className={compStyles.settingsSubtitle}>Applications</h3>
          
          <div className={compStyles.switchContainer}>
            <span className={compStyles.switchLabel}>Email</span>
            <label className={compStyles.switch}>
              <input type="checkbox" className={compStyles.switchInput} defaultChecked />
              <span className={compStyles.switchSlider}></span>
            </label>
          </div>
          
          <div className={compStyles.switchContainer}>
            <span className={compStyles.switchLabel}>SMS</span>
            <label className={compStyles.switch}>
              <input type="checkbox" className={compStyles.switchInput} defaultChecked />
              <span className={compStyles.switchSlider}></span>
            </label>
          </div>
          
          <div className={compStyles.switchContainer}>
            <span className={compStyles.switchLabel}>Notifications Push</span>
            <label className={compStyles.switch}>
              <input type="checkbox" className={compStyles.switchInput} defaultChecked />
              <span className={compStyles.switchSlider}></span>
            </label>
          </div>
        </div>
        
        <div className={compStyles.settingsGroup}>
          <h3 className={compStyles.settingsSubtitle}>Types de notifications</h3>
          
          <div className={compStyles.switchContainer}>
            <span className={compStyles.switchLabel}>Nouvelles réservations</span>
            <label className={compStyles.switch}>
              <input type="checkbox" className={compStyles.switchInput} defaultChecked />
              <span className={compStyles.switchSlider}></span>
            </label>
          </div>
          
          <div className={compStyles.switchContainer}>
            <span className={compStyles.switchLabel}>Annulations</span>
            <label className={compStyles.switch}>
              <input type="checkbox" className={compStyles.switchInput} defaultChecked />
              <span className={compStyles.switchSlider}></span>
            </label>
          </div>
          
          <div className={compStyles.switchContainer}>
            <span className={compStyles.switchLabel}>Rappels avant rendez-vous</span>
            <label className={compStyles.switch}>
              <input type="checkbox" className={compStyles.switchInput} defaultChecked />
              <span className={compStyles.switchSlider}></span>
            </label>
          </div>
          
          <div className={compStyles.switchContainer}>
            <span className={compStyles.switchLabel}>Mises à jour du système</span>
            <label className={compStyles.switch}>
              <input type="checkbox" className={compStyles.switchInput} />
              <span className={compStyles.switchSlider}></span>
            </label>
          </div>
          
          <div className={compStyles.switchContainer}>
            <span className={compStyles.switchLabel}>Nouveaux messages</span>
            <label className={compStyles.switch}>
              <input type="checkbox" className={compStyles.switchInput} defaultChecked />
              <span className={compStyles.switchSlider}></span>
            </label>
          </div>
        </div>
        
        <div className={compStyles.formActions}>
          <button className={compStyles.primaryButton}>Enregistrer les préférences</button>
        </div>
      </div>
    </>
  );
}
