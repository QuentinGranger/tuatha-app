'use client';
import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { format, addDays, isBefore } from 'date-fns';
import { fr } from 'date-fns/locale';
import styles from './ActivePatientsList.module.css';

const getStatusClass = (status) => {
  const classes = {
    GOOD: styles.badgeGood,
    AVERAGE: styles.badgeAverage,
    CRITICAL: styles.badgeCritical,
  };
  return `${styles.badge} ${classes[status]}`;
};

const getProgressClass = (status) => {
  const classes = {
    IMPROVING: styles.badgeImproving,
    STAGNATING: styles.badgeStagnating,
    DECLINING: styles.badgeDeclining,
  };
  return `${styles.badge} ${classes[status]}`;
};

const getAlertPriority = (type) => {
  switch (type) {
    case 'URGENT':
      return {
        icon: '🔥',
        class: styles.alertUrgent,
        label: 'Urgent'
      };
    case 'IMPORTANT':
      return {
        icon: '⚠️',
        class: styles.alertImportant,
        label: 'Important'
      };
    default:
      return {
        icon: '📌',
        class: styles.alertNormal,
        label: 'Normal'
      };
  }
};

const getStatusIndicator = (nutritionalStatus) => {
  switch (nutritionalStatus) {
    case 'CRITICAL':
      return {
        class: styles.statusUrgent,
        icon: '🔥'
      };
    case 'AVERAGE':
      return {
        class: styles.statusImportant,
        icon: '⚠️'
      };
    case 'GOOD':
      return {
        class: styles.statusNormal,
        icon: '✅'
      };
    default:
      return {
        class: styles.statusNormal,
        icon: '✅'
      };
  }
};

const generateAlerts = (patient) => {
  const alerts = [];
  const today = new Date();

  // Alerte pour rendez-vous
  if (patient.lastAppointment) {
    const lastAppointment = new Date(patient.lastAppointment);
    const nextAppointmentDue = addDays(lastAppointment, 30); // Supposons un suivi tous les 30 jours
    
    if (isBefore(nextAppointmentDue, today)) {
      alerts.push({
        id: `appointment-${patient.id}`,
        type: 'IMPORTANT',
        title: 'Rendez-vous de suivi nécessaire',
        message: 'Le dernier rendez-vous date de plus de 30 jours.',
        timestamp: new Date(),
      });
    }
  }

  // Alerte pour état nutritionnel critique
  if (patient.nutritionalStatus === 'CRITICAL') {
    alerts.push({
      id: `nutrition-${patient.id}`,
      type: 'URGENT',
      title: 'État nutritionnel critique',
      message: 'Intervention immédiate requise pour rééquilibrage nutritionnel.',
      timestamp: new Date(),
    });
  }

  // Alerte pour progression négative
  if (patient.progressionStatus === 'DECLINING') {
    alerts.push({
      id: `progression-${patient.id}`,
      type: 'IMPORTANT',
      title: 'Progression en déclin',
      message: 'La progression du patient montre une tendance négative.',
      timestamp: new Date(),
    });
  }

  return alerts;
};

const AlertItem = ({ alert, onMarkAsRead, onEdit, onDelete }) => {
  const priority = getAlertPriority(alert.type);
  const [showActions, setShowActions] = useState(false);
  
  return (
    <div 
      className={`${styles.alertItem} ${priority.class} ${alert.read ? styles.alertRead : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={styles.alertHeader}>
        <div className={styles.alertHeaderLeft}>
          <span className={styles.alertIcon}>{priority.icon}</span>
          <span className={styles.alertTitle}>{alert.title}</span>
        </div>
        <div className={styles.alertHeaderRight}>
          <span className={styles.alertTimestamp}>
            {format(alert.timestamp, 'HH:mm', { locale: fr })}
          </span>
          {showActions && (
            <div className={styles.alertActions}>
              {!alert.read && (
                <button 
                  onClick={() => onMarkAsRead(alert.id)}
                  className={styles.alertAction}
                  title="Marquer comme lu"
                >
                  ✓
                </button>
              )}
              <button 
                onClick={() => onEdit(alert)}
                className={styles.alertAction}
                title="Modifier"
              >
                ✎
              </button>
              <button 
                onClick={() => onDelete(alert.id)}
                className={styles.alertAction}
                title="Supprimer"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>
      <p className={styles.alertMessage}>{alert.message}</p>
    </div>
  );
};

const EditAlertForm = ({ alert, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: alert?.title || '',
    message: alert?.message || '',
    type: alert?.type || 'NORMAL',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...alert,
      ...formData,
      id: alert?.id || Date.now().toString(),
      timestamp: new Date(),
      read: false,
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.editAlertForm}>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Titre</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={styles.formInput}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Message</label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className={styles.formTextarea}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Priorité</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className={styles.formSelect}
        >
          <option value="NORMAL">Normale</option>
          <option value="IMPORTANT">Importante</option>
          <option value="URGENT">Urgente</option>
        </select>
      </div>
      <div className={styles.formActions}>
        <button type="button" onClick={onCancel} className={styles.cancelButton}>
          Annuler
        </button>
        <button type="submit" className={styles.submitButton}>
          {alert ? 'Enregistrer' : 'Créer'}
        </button>
      </div>
    </form>
  );
};

const PatientDetails = ({ patient, onClose }) => {
  const [alerts, setAlerts] = useState([]);
  const [editingAlert, setEditingAlert] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (patient) {
      setAlerts(generateAlerts(patient));
      setIsCreating(false);
      setEditingAlert(null);
    }
  }, [patient]);

  const handleMarkAsRead = (alertId) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
  };

  const handleEditAlert = (alert) => {
    setEditingAlert(alert);
    setIsCreating(false);
  };

  const handleCreateAlert = () => {
    setIsCreating(true);
    setEditingAlert(null);
  };

  const handleSaveAlert = (updatedAlert) => {
    if (isCreating) {
      setAlerts([...alerts, updatedAlert]);
      setIsCreating(false);
    } else {
      setAlerts(alerts.map(alert => 
        alert.id === updatedAlert.id ? updatedAlert : alert
      ));
      setEditingAlert(null);
    }
  };

  const handleDeleteAlert = (alertId) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const handleOverlayClick = useCallback((e) => {
    if (e.target.classList.contains(styles.overlay)) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!patient) return null;

  return (
    <>
      <div 
        className={`${styles.overlay} ${patient ? styles.visible : ''}`} 
        onClick={handleOverlayClick}
      />
      <div className={`${styles.sidePanel} ${patient ? styles.open : ''}`}>
        <div className={styles.patientDetails}>
          <button 
            className={styles.closeButton} 
            onClick={onClose}
            aria-label="Fermer le panneau"
          >
            ×
          </button>
          
          <div className={styles.detailsHeader}>
            <div className={styles.detailsProfileImage}>
              <Image
                src={patient.photoUrl}
                alt={`${patient.firstName} ${patient.lastName}`}
                width={100}
                height={100}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                unoptimized
              />
            </div>
            <div className={styles.detailsInfo}>
              <h2 className={styles.detailsName}>
                {patient.firstName} {patient.lastName}
              </h2>
            </div>
          </div>

          <div className={styles.detailsSection}>
            <h3>Informations personnelles</h3>
            <div className={styles.detailsGrid}>
              <div className={styles.detailsItem}>
                <div className={styles.detailsLabel}>Sport</div>
                <div className={styles.detailsValue}>{patient.sport || '-'}</div>
              </div>
              <div className={styles.detailsItem}>
                <div className={styles.detailsLabel}>Blessure</div>
                <div className={styles.detailsValue}>{patient.injury || '-'}</div>
              </div>
              <div className={styles.detailsItem}>
                <div className={styles.detailsLabel}>Dernier RDV</div>
                <div className={styles.detailsValue}>
                  {patient.lastAppointment
                    ? format(new Date(patient.lastAppointment), 'PPP', { locale: fr })
                    : '-'}
                </div>
              </div>
            </div>

            <div className={styles.alertsSection}>
              <div className={styles.alertsHeader}>
                <h3>Alertes et notifications</h3>
                <button 
                  onClick={handleCreateAlert}
                  className={styles.createAlertButton}
                  title="Créer une alerte"
                >
                  +
                </button>
              </div>
              {(editingAlert || isCreating) ? (
                <EditAlertForm
                  alert={editingAlert}
                  onSave={handleSaveAlert}
                  onCancel={() => {
                    setEditingAlert(null);
                    setIsCreating(false);
                  }}
                />
              ) : (
                <div className={styles.alertsList}>
                  {alerts.length > 0 ? (
                    alerts.map(alert => (
                      <AlertItem
                        key={alert.id}
                        alert={alert}
                        onMarkAsRead={handleMarkAsRead}
                        onEdit={handleEditAlert}
                        onDelete={handleDeleteAlert}
                      />
                    ))
                  ) : (
                    <div className={styles.noAlerts}>
                      Aucune alerte pour ce patient
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default function ActivePatientsList() {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('/api/patients');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des patients');
        }
        const data = await response.json();
        setPatients(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching patients:', err);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((patient) => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
    setSelectedPatient(null);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <h2 className={styles.title}>Liste des <span>patients actifs</span></h2>
        </div>
        
        <div className={styles.searchContainer}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Rechercher un patient..."
            value={searchQuery}
            onChange={handleSearch}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr>
                <th className={styles.tableHeaderCell}>Patient</th>
                <th className={styles.tableHeaderCell}>Sport</th>
                <th className={styles.tableHeaderCell}>Blessure</th>
                <th className={styles.tableHeaderCell}>Dernier RDV</th>
                <th className={styles.tableHeaderCell}>État Nutritionnel</th>
                <th className={styles.tableHeaderCell}>Progression</th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {filteredPatients.map((patient) => {
                const status = getStatusIndicator(patient.nutritionalStatus);
                return (
                  <tr
                    key={patient.id}
                    className={`${styles.tableRow} ${selectedPatient?.id === patient.id ? styles.selectedRow : ''}`}
                    onClick={() => handlePatientClick(patient)}
                  >
                    <td className={styles.tableCell}>
                      <div className={styles.patientInfo}>
                        <div className={styles.imageContainer}>
                          <Image
                            src={patient.photoUrl}
                            alt={`${patient.firstName} ${patient.lastName}`}
                            width={24}
                            height={24}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                            className={styles.image}
                            unoptimized
                          />
                        </div>
                        <div className={styles.patientStatus}>
                          <div className={styles.patientName}>
                            {patient.firstName} {patient.lastName}
                          </div>
                          <span className={styles.statusIcon}>{status.icon}</span>
                          <div className={`${styles.statusIndicator} ${status.class}`} />
                        </div>
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      {patient.sport || '-'}
                    </td>
                    <td className={styles.tableCell}>
                      {patient.injury || 'Aucune blessure'}
                    </td>
                    <td className={styles.tableCell}>
                      {patient.lastAppointment
                        ? format(new Date(patient.lastAppointment), 'PPP', { locale: fr })
                        : '-'}
                    </td>
                    <td className={styles.tableCell}>
                      <span className={getStatusClass(patient.nutritionalStatus)}>
                        {patient.nutritionalStatus}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      <span className={getProgressClass(patient.progressionStatus)}>
                        {patient.progressionStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        <PatientDetails
          patient={selectedPatient}
          onClose={handleCloseSidebar}
        />
      </div>
    </div>
  );
}
