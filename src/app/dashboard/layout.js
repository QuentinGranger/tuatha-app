import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import styles from './layout.module.css';

export default function DashboardLayout({ children }) {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Topbar />
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
