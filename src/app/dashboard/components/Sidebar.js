'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';
import { useAuth } from '@/app/contexts/AuthContext';
import { useState, useEffect } from 'react';

// Imports d'icônes les plus utilisées directement pour éviter les retards au chargement
import { 
  MdDashboard, 
  MdRestaurant, 
  MdQueryStats,
  MdGroup,
  MdBusinessCenter,
  MdMessage,
  MdPayments,
  MdAccountCircle,
  MdAssignment,
  MdInsights
} from 'react-icons/md';

// Import dynamique des icônes moins fréquemment utilisées
const MdLogout = dynamic(() => import('react-icons/md').then(mod => mod.MdLogout));

const menuItems = [
  { name: 'Tableau de Bord', path: '/dashboard', icon: MdDashboard },
  { name: 'Programmes', path: '/dashboard/programmes', icon: MdAssignment },
  { name: 'Indicateurs de Performance', path: '/dashboard/performance', icon: MdInsights },
  { name: 'Dossiers Patients', path: '/dashboard/athletes', icon: MdGroup },
  { name: 'Réseau Professionnel', path: '/dashboard/relations', icon: MdBusinessCenter },
  { name: 'Messagerie', path: '/dashboard/messagerie', icon: MdMessage },
  { name: 'Facturation et Paiements', path: '/dashboard/facturation', icon: MdPayments },
];

const bottomMenuItems = [
  { name: 'Profil & Paramètres', path: '/dashboard/profil-parametres', icon: MdAccountCircle },
  { name: 'Déconnexion', path: '/logout', icon: MdLogout },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Effet pour éviter les erreurs d'hydratation
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = (e) => {
    if (e.target.pathname === '/logout' || e.currentTarget.pathname === '/logout') {
      e.preventDefault();
      // Utiliser la fonction logout du contexte d'authentification
      logout();
    }
  };

  // Si le composant n'est pas encore monté, retourner une div au lieu de nav
  // pour éviter les incohérences entre SSR et client
  if (!mounted) {
    return (
      <div className={styles.sidebar}>
        <div className={styles.logoContainer}>
          <img
            src="/LogoTuatha.png"
            alt="Tuatha Logo"
            className={styles.logo}
          />
        </div>
        {/* Version simplifiée sans interactivité pendant le chargement */}
      </div>
    );
  }

  return (
    <nav className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <Link href="/dashboard">
          <img
            src="/LogoTuatha.png"
            alt="Tuatha Logo"
            className={styles.logo}
          />
        </Link>
      </div>
      <ul className={styles.menu}>
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link 
              href={item.path}
              className={`${styles.menuItem} ${pathname === item.path ? styles.active : ''}`}
            >
              <item.icon className={styles.menuIcon} />
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
      <ul className={styles.bottomMenu}>
        {bottomMenuItems.map((item) => (
          <li key={item.path}>
            <Link 
              href={item.path}
              className={`${styles.menuItem} ${pathname === item.path ? styles.active : ''}`}
              onClick={handleLogout}
            >
              <item.icon className={styles.menuIcon} />
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
