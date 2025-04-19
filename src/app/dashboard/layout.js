'use client';

import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import styles from './layout.module.css';
import { useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import './styles.css';

export default function DashboardLayout({ children }) {
  // State pour gérer le montage du composant
  const [mounted, setMounted] = useState(false);

  // Effet pour définir mounted à true une fois que le composant est monté
  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);

  // Attendre que l'hydratation soit terminée avant d'afficher le layout complet
  if (!mounted) {
    return (
      <div className={styles.layout}>
        <div className={styles.loadingContainer}>
          <img
            src="/LogoTuatha.png"
            alt="Tuatha Logo"
            className={styles.loadingLogo}
          />
          <div className={styles.loadingSpinner}></div>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className={styles.layout}>
        <Sidebar />
        <div className={styles.mainContent}>
          <Topbar />
          <main className={styles.content}>
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
