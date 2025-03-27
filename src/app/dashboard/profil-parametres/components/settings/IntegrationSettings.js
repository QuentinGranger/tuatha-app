'use client';

import React from 'react';
import compStyles from '../../components.module.css';
import { IoAppsOutline, IoCalendarOutline, IoChatboxOutline, IoCartOutline, IoAdd } from 'react-icons/io5';

export default function IntegrationSettings() {
  return (
    <>
      <h2 className={compStyles.settingsTitle}>
        <IoAppsOutline className={compStyles.settingsTitleIcon} />
        Intégrations externes
      </h2>
      
      <div className={compStyles.settingsForm}>
        <div className={compStyles.settingsGroup}>
          <h3 className={compStyles.settingsSubtitle}>Calendriers</h3>
          
          <div className={compStyles.integrationCard}>
            <div className={compStyles.integrationIcon}>
              <IoCalendarOutline />
            </div>
            <div className={compStyles.integrationInfo}>
              <div className={compStyles.integrationName}>Google Calendar</div>
              <div className={compStyles.integrationStatus}>Connecté</div>
            </div>
            <div className={compStyles.switchContainer} style={{ marginBottom: 0 }}>
              <label className={compStyles.switch}>
                <input type="checkbox" className={compStyles.switchInput} defaultChecked />
                <span className={compStyles.switchSlider}></span>
              </label>
            </div>
          </div>
          
          {/* Contenu complet à implémenter */}
        </div>
        
        <div className={compStyles.formActions}>
          <button className={compStyles.primaryButton}>Enregistrer les changements</button>
        </div>
      </div>
    </>
  );
}
