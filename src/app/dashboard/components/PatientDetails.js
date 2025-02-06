import { useState } from 'react';
import Image from 'next/image';
import styles from './ActivePatientsList.module.css';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function PatientDetails({ patient, onClose }) {
  const [showNotificationForm, setShowNotificationForm] = useState(false);
  const [notificationData, setNotificationData] = useState({
    title: '',
    description: '',
    priority: 'normal',
    dueDate: '',
  });

  if (!patient) return null;

  const handleSubmitNotification = (e) => {
    e.preventDefault();
    
    const newNotification = {
      id: Date.now(),
      ...notificationData,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    console.log('Nouvelle notification:', newNotification);
    
    setNotificationData({
      title: '',
      description: '',
      priority: 'normal',
      dueDate: '',
    });
    setShowNotificationForm(false);
  };

  return (
    <div className={styles.patientDetailsContainer}>
      <div className={styles.patientDetailsHeader}>
        <h3>Détails du Patient</h3>
        <button onClick={onClose} className={styles.closeButton}>×</button>
      </div>

      <div className={styles.patientDetailsContent}>
        <div className={styles.patientBasicInfo}>
          <h4>{patient.firstName} {patient.lastName}</h4>
          <p>Sport: {patient.sport || 'Non spécifié'}</p>
          <p>Blessure: {patient.injury || 'Aucune blessure'}</p>
          <p>Dernier RDV: {patient.lastAppointment
            ? format(new Date(patient.lastAppointment), 'PPP', { locale: fr })
            : 'Aucun RDV'}</p>
        </div>

        <div className={styles.notificationsSection}>
          <h4>Notifications Personnalisées</h4>
          
          {!showNotificationForm ? (
            <button
              className={styles.addNotificationButton}
              onClick={() => setShowNotificationForm(true)}
            >
              ✨ Ajouter une notification
            </button>
          ) : (
            <form className={styles.notificationForm} onSubmit={handleSubmitNotification}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Titre</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={notificationData.title}
                  onChange={(e) => setNotificationData({
                    ...notificationData,
                    title: e.target.value
                  })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Description</label>
                <textarea
                  className={styles.formTextarea}
                  value={notificationData.description}
                  onChange={(e) => setNotificationData({
                    ...notificationData,
                    description: e.target.value
                  })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Priorité</label>
                <select
                  className={styles.formSelect}
                  value={notificationData.priority}
                  onChange={(e) => setNotificationData({
                    ...notificationData,
                    priority: e.target.value
                  })}
                >
                  <option value="low">Basse</option>
                  <option value="normal">Normale</option>
                  <option value="high">Haute</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Date d'échéance</label>
                <input
                  type="date"
                  className={styles.formInput}
                  value={notificationData.dueDate}
                  onChange={(e) => setNotificationData({
                    ...notificationData,
                    dueDate: e.target.value
                  })}
                  required
                />
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowNotificationForm(false)}
                >
                  Annuler
                </button>
                <button type="submit" className={styles.submitButton}>
                  Ajouter
                </button>
              </div>
            </form>
          )}

          <div className={styles.notificationsList}>
            {patient.notifications?.map((notification) => (
              <div
                key={notification.id}
                className={`${styles.notificationItem} ${styles[`priority${notification.priority}`]}`}
              >
                <div className={styles.notificationHeader}>
                  <h5>{notification.title}</h5>
                  <span className={styles.notificationDate}>
                    {format(new Date(notification.dueDate), 'PPP', { locale: fr })}
                  </span>
                </div>
                <p>{notification.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
