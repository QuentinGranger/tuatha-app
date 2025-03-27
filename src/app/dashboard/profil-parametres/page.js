'use client';

import { useState } from 'react';
import styles from './page.module.css';
import compStyles from './components.module.css';
import { IoIosSettings, IoMdPerson, IoIosCalendar, IoIosLock, IoMdNotifications, IoIosLink, IoIosCard, IoMdStar, IoMdAdd, IoMdCamera, IoIosEye } from 'react-icons/io';
import Image from 'next/image';

// Import des composants
import TabNavigation from './components/TabNavigation';
import ProfileSection from './components/ProfileSection';
import SettingsSection from './components/SettingsSection';
import NotificationsSection from './components/NotificationsSection';

export default function ProfilParametres() {
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState('compte');

  // Données fictives basées sur le profil de Tony Tony
  const professionalData = {
    name: 'Tony Tony',
    specialty: 'Nutritionniste sportif',
    rating: 4.9,
    reviews: 128,
    bio: 'Nutritionniste spécialisé dans la performance sportive avec plus de 10 ans d\'expérience. Je travaille avec des athlètes professionnels et amateurs pour optimiser leur nutrition et atteindre leurs objectifs.',
    email: 'tony.tony@tuatha-health.com',
    phone: '+33 6 12 34 56 78',
    address: '15 rue de la Performance, 75001 Paris',
    website: 'www.tony-nutrition.com',
    socials: [
      { platform: 'LinkedIn', link: 'linkedin.com/in/tony-tony' },
      { platform: 'Instagram', link: 'instagram.com/tony_nutrition' }
    ],
    services: [
      { name: 'Consultation initiale', duration: 60, price: 95 },
      { name: 'Suivi nutritionnel', duration: 30, price: 65 },
      { name: 'Plan alimentaire personnalisé', duration: null, price: 120 },
      { name: 'Analyse de composition corporelle', duration: 30, price: 50 }
    ],
    availability: [
      { day: 'Lundi', hours: '9:00 - 18:00' },
      { day: 'Mardi', hours: '9:00 - 18:00' },
      { day: 'Mercredi', hours: '9:00 - 12:00' },
      { day: 'Jeudi', hours: '9:00 - 18:00' },
      { day: 'Vendredi', hours: '9:00 - 16:00' }
    ],
    collaborations: [
      { name: 'Dr. Jean Martin', specialty: 'Médecin du sport' },
      { name: 'Sophie Dupont', specialty: 'Kinésithérapeute' }
    ]
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.mainTitle}>
        <span className={styles.gradientText}>Profil & Paramètres</span>
      </h1>
      
      {/* Navigation par onglets */}
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Conteneur principal pour le contenu */}
      <div className={styles.contentContainer}>
        {activeTab === 'profile' && (
          <ProfileSection professionalData={professionalData} />
        )}
        
        {activeTab === 'settings' && (
          <SettingsSection />
        )}
        
        {activeTab === 'notifications' && (
          <NotificationsSection />
        )}
      </div>
    </div>
  );
}
