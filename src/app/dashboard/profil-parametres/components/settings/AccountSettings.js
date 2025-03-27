'use client';

import React from 'react';
import compStyles from '../../components.module.css';
import { IoPersonOutline } from 'react-icons/io5';

export default function AccountSettings() {
  return (
    <>
      <h2 className={compStyles.settingsTitle}>
        <IoPersonOutline className={compStyles.settingsTitleIcon} />
        Paramètres du compte
      </h2>
      
      <div className={compStyles.settingsForm}>
        <div className={compStyles.settingsGroup}>
          <h3 className={compStyles.settingsSubtitle}>Informations personnelles</h3>
          
          <div className={compStyles.formGroupGrid}>
            <div className={compStyles.formGroup}>
              <label className={compStyles.formLabel}>Prénom</label>
              <input type="text" className={compStyles.formInput} defaultValue="Alexandre" />
            </div>
            
            <div className={compStyles.formGroup}>
              <label className={compStyles.formLabel}>Nom</label>
              <input type="text" className={compStyles.formInput} defaultValue="Dubois" />
            </div>
          </div>
          
          <div className={compStyles.formGroup}>
            <label className={compStyles.formLabel}>Email</label>
            <input type="email" className={compStyles.formInput} defaultValue="alexandre.dubois@example.com" />
            <div className={compStyles.formHelp}>Cet email est utilisé pour les notifications et connexions</div>
          </div>
          
          <div className={compStyles.formGroup}>
            <label className={compStyles.formLabel}>Téléphone</label>
            <input type="tel" className={compStyles.formInput} defaultValue="+33 6 12 34 56 78" />
          </div>
        </div>
        
        <div className={compStyles.settingsGroup}>
          <h3 className={compStyles.settingsSubtitle}>Sécurité</h3>
          
          <div className={compStyles.formGroup}>
            <label className={compStyles.formLabel}>Mot de passe actuel</label>
            <input type="password" className={compStyles.formInput} placeholder="••••••••" />
          </div>
          
          <div className={compStyles.formGroupGrid}>
            <div className={compStyles.formGroup}>
              <label className={compStyles.formLabel}>Nouveau mot de passe</label>
              <input type="password" className={compStyles.formInput} placeholder="••••••••" />
            </div>
            
            <div className={compStyles.formGroup}>
              <label className={compStyles.formLabel}>Confirmer le mot de passe</label>
              <input type="password" className={compStyles.formInput} placeholder="••••••••" />
            </div>
          </div>
          
          <div className={compStyles.switchContainer}>
            <span className={compStyles.switchLabel}>Authentification à deux facteurs</span>
            <label className={compStyles.switch}>
              <input type="checkbox" className={compStyles.switchInput} />
              <span className={compStyles.switchSlider}></span>
            </label>
          </div>
        </div>
        
        <div className={compStyles.formActions}>
          <button className={compStyles.primaryButton}>Enregistrer les changements</button>
        </div>
      </div>
    </>
  );
}
