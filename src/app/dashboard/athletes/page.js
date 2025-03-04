import PatientDashboard from './components/PatientDashboard';
import styles from './page.module.css';

export default function AthletesPage() {
  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
      </div>
      <PatientDashboard />
    </div>
  );
}
