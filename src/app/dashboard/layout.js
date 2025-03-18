'use client';

import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import styles from './layout.module.css';
import { useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';

export default function DashboardLayout({ children }) {
  // State pour gérer le montage du composant
  const [mounted, setMounted] = useState(false);

  // Effet pour définir mounted à true une fois que le composant est monté
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className={styles.layout}>
        <Sidebar />
        <div className={styles.mainContent}>
          <Topbar />
          <main className={styles.content}>
            {mounted ? children : <div>Chargement...</div>}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
