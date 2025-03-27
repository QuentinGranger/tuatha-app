'use client';

import React from 'react';
import compStyles from '../../components.module.css';
import { IoCardOutline, IoEllipsisHorizontal, IoAdd } from 'react-icons/io5';

export default function PaymentSettings() {
  return (
    <>
      <h2 className={compStyles.settingsTitle}>
        <IoCardOutline className={compStyles.settingsTitleIcon} />
        Paramètres de paiement
      </h2>
      
      <div className={compStyles.settingsForm}>
        <div className={compStyles.settingsGroup}>
          <h3 className={compStyles.settingsSubtitle}>Moyens de paiement</h3>
          
          <div className={compStyles.paymentCard}>
            <div className={compStyles.paymentIcon}>
              <IoCardOutline />
            </div>
            <div className={compStyles.paymentInfo}>
              <div className={compStyles.paymentName}>Carte Visa •••• 4242</div>
              <div className={compStyles.paymentDetails}>Expire le 12/25</div>
            </div>
            <button className={compStyles.secondaryButton}>
              <IoEllipsisHorizontal />
            </button>
          </div>
          
          <button className={compStyles.addButton}>
            <IoAdd className={compStyles.addIcon} /> Ajouter un moyen de paiement
          </button>
        </div>
        
        {/* Contenu complet à implémenter */}
        
        <div className={compStyles.formActions}>
          <button className={compStyles.primaryButton}>Enregistrer les changements</button>
        </div>
      </div>
    </>
  );
}
