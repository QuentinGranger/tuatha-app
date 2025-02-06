'use client';
import ActivePatientsList from './components/ActivePatientsList';
import './page.css';

export default function DashboardPage() {
  return (
    <div className="dashboard">
      <div className="activePatients">
        <ActivePatientsList />
      </div>
      <div className="stats">
        <h3>Statistiques</h3>
      </div>
      <div className="calendar">
        <h3>Calendrier</h3>
      </div>
      <div className="notifications">
        <h3>Notifications</h3>
      </div>
    </div>
  );
}
