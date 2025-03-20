'use client';

import { useState, useEffect } from 'react';
import styles from './WelcomeModal.module.css';

export default function WelcomeModal({ onClose }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleAccept = () => {
    setIsAnimating(false);
    
    if (dontShowAgain) {
      localStorage.setItem('tuatha_collaboration_consent_seen', 'true');
    }
    
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300); // Durée de l'animation
  };

  return isVisible ? (
    <div className={`${styles.overlay} ${isAnimating ? styles.overlayVisible : styles.overlayHidden}`}>
      <div className={`${styles.dialog} ${isAnimating ? styles.dialogVisible : styles.dialogHidden}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>Consentement des patients requis</h2>
        </div>
        
        <div className={styles.content}>
          <div className={styles.sectionIntro}>
            <div className={styles.iconContainer}>
              <svg className={styles.sectionIcon} width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 11.99H19C18.47 16.11 15.72 19.78 12 20.93V12H5V6.3L12 3.19V11.99ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z" fill="url(#paint0_linear)"/>
                <defs>
                  <linearGradient id="paint0_linear" x1="3" y1="12" x2="21" y2="12" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FF8800"/>
                    <stop offset="1" stopColor="#FFB366"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <p className={styles.welcomeText}>
              Pour utiliser les fonctionnalités de collaboration interdisciplinaire 
              dans Tuatha, le <strong>consentement explicite et éclairé</strong> de vos patients
              est légalement requis selon l'Article 9 du RGPD.
            </p>
          </div>
          
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Obligations légales</h3>
            <ul className={styles.featureList}>
              <li>Le consentement doit être <strong>spécifique</strong>, <strong>informé</strong> et <strong>explicite</strong> (Article 9(2)(a) du RGPD)</li>
              <li>Les patients doivent pouvoir <strong>retirer leur consentement à tout moment</strong> (Article 7(3) du RGPD)</li>
              <li>En tant que professionnel de santé, vous êtes <strong>responsable conjoint du traitement</strong> des données (Article 26 du RGPD)</li>
              <li>Le traitement des données de santé requiert des <strong>garanties appropriées</strong> (Article 9(3) du RGPD)</li>
            </ul>
          </div>
          
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Dans l'application Tuatha</h3>
            <div className={styles.gridFeatures}>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="url(#paint0_linear)"/>
                    <defs>
                      <linearGradient id="paint0_linear" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FF8800"/>
                        <stop offset="1" stopColor="#FFB366"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className={styles.featureText}>
                  <h4>Application mobile</h4>
                  <p>Les patients donnent leur consentement via l'app Tuatha</p>
                </div>
              </div>
              
              <div className={styles.feature}>
                <div className={styles.featureIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="url(#paint0_linear)"/>
                    <defs>
                      <linearGradient id="paint0_linear" x1="4" y1="12" x2="20" y2="12" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FF8800"/>
                        <stop offset="1" stopColor="#FFB366"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className={styles.featureText}>
                  <h4>Section patient</h4>
                  <p>Statut du consentement visible dans le profil patient</p>
                </div>
              </div>
              
              <div className={styles.feature}>
                <div className={styles.featureIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z" fill="url(#paint0_linear)"/>
                    <defs>
                      <linearGradient id="paint0_linear" x1="4" y1="11.5" x2="20" y2="11.5" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FF8800"/>
                        <stop offset="1" stopColor="#FFB366"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className={styles.featureText}>
                  <h4>Granularité des accès</h4>
                  <p>Contrôle précis des données partagées par vos patients</p>
                </div>
              </div>
              
              <div className={styles.feature}>
                <div className={styles.featureIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM14 17H7V15H14V17ZM17 13H7V11H17V13ZM17 9H7V7H17V9Z" fill="url(#paint0_linear)"/>
                    <defs>
                      <linearGradient id="paint0_linear" x1="3" y1="12" x2="21" y2="12" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FF8800"/>
                        <stop offset="1" stopColor="#FFB366"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className={styles.featureText}>
                  <h4>Traçabilité</h4>
                  <p>Journal d'audit des accès et partages conforme à la loi</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.noticeBox}>
            <svg className={styles.noticeIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 21H23L12 2L1 21ZM13 18H11V16H13V18ZM13 14H11V10H13V14Z" fill="url(#paint0_linear)"/>
              <defs>
                <linearGradient id="paint0_linear" x1="1" y1="11.5" x2="23" y2="11.5" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF8800"/>
                  <stop offset="1" stopColor="#FFB366"/>
                </linearGradient>
              </defs>
            </svg>
            <div>
              <h4 className={styles.noticeTitle}>Responsabilité légale</h4>
              <p>
                En tant que professionnel de santé, vous êtes tenu, selon la loi européenne et française, 
                d'obtenir le consentement de vos patients avant tout partage de données de santé. 
                Le secret médical partagé (Art. L. 1110-4 du Code de la santé publique) 
                nécessite une information claire et le consentement du patient.
              </p>
            </div>
          </div>
          
          <div className={styles.checkboxRow}>
            <input 
              type="checkbox" 
              id="dontShowAgain" 
              checked={dontShowAgain} 
              onChange={(e) => setDontShowAgain(e.target.checked)} 
              className={styles.checkbox}
            />
            <label htmlFor="dontShowAgain" className={styles.checkboxLabel}>
              Ne plus afficher ce message
            </label>
          </div>
        </div>
        
        <div className={styles.footer}>
          <button 
            onClick={handleAccept} 
            className={styles.primaryButton}
          >
            J'ai compris mes obligations
          </button>
        </div>
      </div>
    </div>
  ) : null;
}
