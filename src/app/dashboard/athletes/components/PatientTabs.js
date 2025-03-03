'use client';

import styles from './PatientTabs.module.css';

export default function PatientTabs({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'medical', label: 'Infos Médicales', icon: '🩺' },
    { id: 'nutrition', label: 'Suivi Nutritionnel', icon: '🍽️' },
    { id: 'performance', label: 'KPI & Statistiques', icon: '📊' },
    { id: 'notes', label: 'Notes & Recommandations', icon: '💬' },
    { id: 'documents', label: 'Documents & Analyses', icon: '📎' },
    { id: 'appointments', label: 'Rendez-vous', icon: '📅' },
  ];

  return (
    <div className={styles.tabs}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className={styles.icon}>{tab.icon}</span>
          <span className={styles.label}>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
