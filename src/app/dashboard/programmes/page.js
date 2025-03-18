'use client';

import { useState } from 'react';
import styles from './programmes.module.css';
import ProgramTabs from './components/ProgramTabs';

export default function ProgramsPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Plans Nutritionnels</h1>
        <p className={styles.subtitle}>
          Créez et gérez des plans nutritionnels personnalisés pour optimiser la santé de vos patients
        </p>
      </header>
      <ProgramTabs />
    </div>
  );
}
