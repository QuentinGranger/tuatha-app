import React, { useState, useEffect } from 'react';
import { FaClipboardList, FaBell, FaPlusCircle, FaUserMd, FaCalendarAlt, FaTag, FaUser } from 'react-icons/fa';
import styles from './CollaborativeActionPanel.module.css';

const CollaborativeActionPanel = ({ selectedProfessional, patient }) => {
  console.log('CollaborativeActionPanel: selectedProfessional reçu =', selectedProfessional);
  
  // Log à chaque changement de selectedProfessional
  useEffect(() => {
    console.log('selectedProfessional a changé:', selectedProfessional);
  }, [selectedProfessional]);
  
  // Vérifier si un professionnel est sélectionné
  if (!selectedProfessional || !selectedProfessional.user) {
    console.log('Pas de professionnel sélectionné ou pas de user:', selectedProfessional);
    return (
      <div className={styles.panel}>
        <div className={styles.welcomePanel}>
          <div className={styles.welcomeIcon}>
            <FaUserMd />
          </div>
          <h3 className="text-white">Sélectionnez un professionnel</h3>
          <p className={styles.welcomeMessage}>
            Choisissez un professionnel pour visualiser les actions collaboratives et les notifications associées.
          </p>
        </div>
      </div>
    );
  }

  // Récupérer les informations du professionnel
  const professionalUser = selectedProfessional.user;
  const professionalName = `${professionalUser.firstName} ${professionalUser.lastName}`;
  const professionalSpecialty = selectedProfessional.specialty || '';
  console.log('Nom du professionnel:', professionalName);
  console.log('Spécialité:', professionalSpecialty);

  const [activeTab, setActiveTab] = useState('tasks');
  
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Modifier le plan alimentaire',
      description: 'Adapter le régime pour augmenter l\'apport en protéines et réduire les glucides simples',
      assignedBy: 'Vous',
      assignedTo: professionalName,
      dueDate: '05 Mars 2025',
      status: 'PENDING',
      priority: 'HIGH'
    },
    {
      id: 2,
      title: 'Évaluation de la mobilité articulaire',
      description: 'Faire une évaluation complète de la mobilité de l\'épaule droite suite à la blessure',
      assignedBy: professionalName,
      assignedTo: 'Bruce Banner',
      dueDate: '10 Mars 2025',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM'
    },
    {
      id: 3,
      title: 'Ajuster protocole de récupération',
      description: 'Intégrer des séances de cryothérapie après les entraînements à haute intensité',
      assignedBy: 'Vous',
      assignedTo: professionalName,
      dueDate: '03 Mars 2025',
      status: 'COMPLETED',
      priority: 'MEDIUM'
    }
  ]);
  
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Modification de traitement',
      description: `${professionalName} a modifié le traitement anti-inflammatoire`,
      timestamp: new Date(2025, 2, 1, 9, 15),
      read: false
    },
    {
      id: 2,
      title: 'Nouveau résultat d\'analyse',
      description: 'Nouveaux résultats sanguins disponibles - Voir marqueurs inflammatoires',
      timestamp: new Date(2025, 1, 28, 14, 30),
      read: true
    },
    {
      id: 3,
      title: 'Annulation de rendez-vous',
      description: 'Le rendez-vous du 5 mars a été annulé par le patient',
      timestamp: new Date(2025, 1, 27, 11, 45),
      read: true
    }
  ]);
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return '#f1c40f';
      case 'IN_PROGRESS': return '#3498db';
      case 'COMPLETED': return '#2ecc71';
      default: return '#bdc3c7';
    }
  };
  
  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'HIGH': return 'Haute';
      case 'MEDIUM': return 'Moyenne';
      case 'LOW': return 'Basse';
      default: return 'Standard';
    }
  };
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDING': return 'En attente';
      case 'IN_PROGRESS': return 'En cours';
      case 'COMPLETED': return 'Terminé';
      default: return status;
    }
  };
  
  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const diffMs = now - timestamp;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    } else if (diffMin > 0) {
      return `Il y a ${diffMin} minute${diffMin > 1 ? 's' : ''}`;
    } else {
      return 'À l\'instant';
    }
  };
  
  return (
    <div className={styles.panel}>
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'tasks' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          <FaClipboardList />
          Actions & Tâches
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'notifications' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <FaBell />
          Notifications & Alertes
        </button>
      </div>
      
      {activeTab === 'tasks' && (
        <>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>
              Tâches collaboratives avec <span>{professionalName}</span>
            </h3>
            <button className={styles.actionButton}>
              <FaPlusCircle size={14} />
              Nouvelle tâche
            </button>
          </div>
          
          <div className={styles.content}>
            {tasks.map(task => (
              <div 
                key={task.id}
                className={styles.taskCard}
              >
                <div className={styles.taskHeader}>
                  <h4 className={styles.taskTitle}>{task.title}</h4>
                  <div 
                    className={`
                      ${styles.taskStatus} 
                      ${task.status === 'PENDING' ? styles.statusPending : 
                        task.status === 'IN_PROGRESS' ? styles.statusInProgress : 
                        styles.statusCompleted}
                    `}
                  >
                    {getStatusLabel(task.status)}
                  </div>
                </div>
                
                <div className={styles.taskBody}>
                  <p className={styles.taskDescription}>
                    {task.description}
                  </p>
                  
                  <div className={styles.taskMeta}>
                    <div className={styles.taskMetaItem}>
                      <FaUser size={12} />
                      <span className={styles.taskMetaLabel}>Attribué par:</span> {task.assignedBy}
                    </div>
                    <div className={styles.taskMetaItem}>
                      <FaUserMd size={12} />
                      <span className={styles.taskMetaLabel}>Pour:</span> {task.assignedTo}
                    </div>
                    <div className={styles.taskMetaItem}>
                      <FaCalendarAlt size={12} />
                      <span className={styles.taskMetaLabel}>Échéance:</span> {task.dueDate}
                    </div>
                    <div className={styles.taskMetaItem}>
                      <FaTag size={12} />
                      <span className={styles.taskMetaLabel}>Priorité:</span> 
                      <span 
                        className={`
                          ${task.priority === 'HIGH' ? styles.highPriority : 
                            task.priority === 'MEDIUM' ? styles.mediumPriority : 
                            styles.lowPriority}
                        `}
                      >
                        {getPriorityLabel(task.priority)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {tasks.length === 0 && (
              <div className={styles.emptyState}>
                <p>Aucune tâche collaborative avec ce professionnel pour le moment.</p>
              </div>
            )}
          </div>
        </>
      )}
      
      {activeTab === 'notifications' && (
        <>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>
              Notifications liées à <span>{professionalName}</span>
            </h3>
          </div>
          
          <div className={styles.content}>
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={`
                  ${styles.notificationCard}
                  ${!notification.read ? styles.notificationUnread : ''}
                `}
              >
                <div className={styles.notificationContent}>
                  <h4 className={styles.notificationTitle}>
                    {notification.title}
                  </h4>
                  <p className={styles.notificationBody}>
                    {notification.description}
                  </p>
                </div>
                
                <div className={styles.notificationTime}>
                  {formatRelativeTime(notification.timestamp)}
                </div>
              </div>
            ))}
            
            {notifications.length === 0 && (
              <div className={styles.emptyState}>
                <p>Aucune notification liée à ce professionnel pour le moment.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CollaborativeActionPanel;
