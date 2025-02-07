'use client';

import { useState } from 'react';
import styles from './programmes.module.css';
import ProgramTabs from './components/ProgramTabs';

export default function ProgramsPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Programmes</h1>
        <p className={styles.subtitle}>
          Gérez vos programmes personnalisés et suivez les progrès de vos patients
        </p>
      </header>
      <ProgramTabs />
    </div>
  );
}
