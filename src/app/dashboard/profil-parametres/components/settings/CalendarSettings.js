'use client';

import React from 'react';
import compStyles from '../../components.module.css';
import { IoCalendarOutline } from 'react-icons/io5';

export default function CalendarSettings() {
  return (
    <>
      <h2 className={compStyles.settingsTitle}>
        <IoCalendarOutline className={compStyles.settingsTitleIcon} />
        Paramètres du calendrier
      </h2>
      
      <div className={compStyles.settingsForm}>
        <div className={compStyles.settingsGroup}>
          <h3 className={compStyles.settingsSubtitle}>Disponibilité hebdomadaire</h3>
          
          <div className={compStyles.calendarContainer}>
            <div className={compStyles.calendarDay}>Lun</div>
            <div className={compStyles.calendarDay}>Mar</div>
            <div className={compStyles.calendarDay}>Mer</div>
            <div className={compStyles.calendarDay}>Jeu</div>
            <div className={compStyles.calendarDay}>Ven</div>
            <div className={compStyles.calendarDay}>Sam</div>
            <div className={compStyles.calendarDay}>Dim</div>
          </div>
          
          {/* Contenu complet à implémenter */}
        </div>
        
        <div className={compStyles.formActions}>
          <button className={compStyles.primaryButton}>Enregistrer les paramètres</button>
        </div>
      </div>
    </>
  );
}
