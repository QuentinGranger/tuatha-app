'use client';

import styles from './styles.module.css';

export default function Tabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.icon && <span className={styles.icon}>{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      <div className={styles.content}>
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}
