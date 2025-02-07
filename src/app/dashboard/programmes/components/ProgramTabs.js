'use client';

import { useState } from 'react';
import styles from '../programmes.module.css';
import CreateProgram from './CreateProgram';
import ProgramList from './ProgramList';
import AssignProgram from './AssignProgram';

const TABS = {
  CREATE: 'create',
  LIST: 'list',
  ASSIGN: 'assign'
};

export default function ProgramTabs() {
  const [activeTab, setActiveTab] = useState(TABS.LIST);

  const renderTabContent = () => {
    switch (activeTab) {
      case TABS.CREATE:
        return <CreateProgram />;
      case TABS.LIST:
        return (
          <div className={styles.programList}>
            {/* Exemple de cartes de programme */}
            <div className={styles.programCard}>
              <h3 className={styles.programTitle}>Programme Perte de Poids</h3>
              <p className={styles.programDescription}>
                Programme personnalisé pour une perte de poids saine et durable
              </p>
              <div className={styles.programMeta}>
                <span className={styles.programDate}>Créé le 7 Feb 2025</span>
                <span className={styles.programStatus}>En cours</span>
              </div>
            </div>

            <div className={styles.programCard}>
              <h3 className={styles.programTitle}>Programme Prise de Masse</h3>
              <p className={styles.programDescription}>
                Programme de nutrition pour la prise de masse musculaire
              </p>
              <div className={styles.programMeta}>
                <span className={styles.programDate}>Créé le 6 Feb 2025</span>
                <span className={styles.programStatus}>Nouveau</span>
              </div>
            </div>
          </div>
        );
      case TABS.ASSIGN:
        return <AssignProgram />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === TABS.LIST ? styles.active : ''}`}
          onClick={() => setActiveTab(TABS.LIST)}
        >
          Liste des Programmes
        </button>
        <button
          className={`${styles.tab} ${activeTab === TABS.CREATE ? styles.active : ''}`}
          onClick={() => setActiveTab(TABS.CREATE)}
        >
          Créer un Programme
        </button>
        <button
          className={`${styles.tab} ${activeTab === TABS.ASSIGN ? styles.active : ''}`}
          onClick={() => setActiveTab(TABS.ASSIGN)}
        >
          Attribuer un Programme
        </button>
      </div>

      {renderTabContent()}
    </div>
  );
}
