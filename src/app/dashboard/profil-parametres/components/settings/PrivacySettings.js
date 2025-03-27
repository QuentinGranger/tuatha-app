'use client';

import React from 'react';
import compStyles from '../../components.module.css';
import { IoShieldOutline } from 'react-icons/io5';

export default function PrivacySettings() {
  return (
    <>
      <h2 className={compStyles.settingsTitle}>
        <IoShieldOutline className={compStyles.settingsTitleIcon} />
        Confidentialité et données
      </h2>
      
      <div className={compStyles.settingsForm}>
        <div className={compStyles.settingsGroup}>
          <h3 className={compStyles.settingsSubtitle}>Visibilité du profil</h3>
          
          <div className={compStyles.switchContainer}>
            <span className={compStyles.switchLabel}>Profil visible dans le répertoire public</span>
            <label className={compStyles.switch}>
              <input type="checkbox" className={compStyles.switchInput} defaultChecked />
              <span className={compStyles.switchSlider}></span>
            </label>
          </div>
          
          {/* Contenu complet à implémenter */}
        </div>
        
        <div className={compStyles.formActions}>
          <button className={compStyles.secondaryButton} style={{ color: 'rgba(255, 100, 100, 0.8)' }}>Supprimer mon compte</button>
          <button className={compStyles.primaryButton}>Enregistrer les préférences</button>
        </div>
      </div>
    </>
  );
}
