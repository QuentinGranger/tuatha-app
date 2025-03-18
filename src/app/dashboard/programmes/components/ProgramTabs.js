'use client';

import { useState } from 'react';
import styles from '../programmes.module.css';
import CreateNutritionProgram from './CreateNutritionProgram';
import ProgramList from './ProgramList';
import AssignProgram from './AssignProgram';

const TABS = {
  CREATE: 'create',
  LIST: 'list',
  ASSIGN: 'assign'
};

export default function ProgramTabs() {
  const [activeTab, setActiveTab] = useState(TABS.LIST);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case TABS.CREATE:
        return <CreateNutritionProgram onSuccess={() => handleTabChange(TABS.LIST)} />;
      case TABS.LIST:
        return <ProgramList />;
      case TABS.ASSIGN:
        return <AssignProgram />;
      default:
        return <ProgramList />;
    }
  };

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === TABS.LIST ? styles.active : ''}`}
          onClick={() => handleTabChange(TABS.LIST)}
        >
          Mes Plans Nutritionnels
        </button>
        <button
          className={`${styles.tab} ${activeTab === TABS.CREATE ? styles.active : ''}`}
          onClick={() => handleTabChange(TABS.CREATE)}
        >
          Créer un Plan Nutritionnel
        </button>
        <button
          className={`${styles.tab} ${activeTab === TABS.ASSIGN ? styles.active : ''}`}
          onClick={() => handleTabChange(TABS.ASSIGN)}
        >
          Assigner un Plan
        </button>
      </div>
      <div className={styles.tabContent}>{renderTabContent()}</div>
    </div>
  );
}
