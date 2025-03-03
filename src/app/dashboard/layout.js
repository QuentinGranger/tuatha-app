'use client';

import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import styles from './layout.module.css';
import { useState, useEffect } from 'react';

export default function DashboardLayout({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Topbar />
        <main className={styles.content}>
          {mounted ? children : <div>Chargement...</div>}
        </main>
      </div>
    </div>
  );
}
