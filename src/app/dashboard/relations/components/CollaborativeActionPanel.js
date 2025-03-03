'use client';

import { useState } from 'react';
import styles from '../page.module.css';
import { FaPlusCircle, FaClipboardList, FaBell } from 'react-icons/fa';

const CollaborativeActionPanel = ({ selectedProfessional, patient }) => {
  // Vérifier si un professionnel est sélectionné
  if (!selectedProfessional) {
    return (
      <div className="text-center py-5 bg-glass rounded-lg" style={{ padding: '3rem' }}>
        <FaClipboardList size={40} style={{ marginBottom: '1rem', opacity: 0.6, color: 'white' }} />
        <p className="text-light">Sélectionnez un professionnel pour voir les plans d'action collaboratifs</p>
      </div>
    );
  }

  // Récupérer les informations du professionnel
  const professionalUser = selectedProfessional.user || {};
  const professionalName = `${professionalUser.firstName || ''} ${professionalUser.lastName || ''}`.trim() || 'Professionnel';
  const professionalSpecialty = selectedProfessional.specialty || '';

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
    <div className="bg-glass p-4 rounded-lg">
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'tasks' ? styles.activeTab : ''} text-white`}
          onClick={() => setActiveTab('tasks')}
        >
          <FaClipboardList style={{ marginRight: '8px' }} />
          Actions & Tâches
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'notifications' ? styles.activeTab : ''} text-white`}
          onClick={() => setActiveTab('notifications')}
        >
          <FaBell style={{ marginRight: '8px' }} />
          Notifications & Alertes
        </button>
      </div>
      
      {activeTab === 'tasks' && (
        <div style={{ padding: '1rem 0 0 0' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h3 className="text-white" style={{ margin: 0 }}>
              Tâches collaboratives avec {professionalName}
            </h3>
            <button className="btn-accent" style={{
              padding: '0.5rem 1rem',
              background: 'rgba(255, 114, 28, 0.7)',
              border: 'none',
              borderRadius: '6px',
              color: 'white',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <FaPlusCircle size={14} />
              Nouvelle tâche
            </button>
          </div>
          
          <div>
            {tasks.map(task => (
              <div 
                key={task.id}
                style={{
                  background: 'rgba(30, 40, 55, 0.4)',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginBottom: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'white' }}>{task.title}</h4>
                  <div 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '90px',
                      borderRadius: '4px',
                      padding: '0.25rem 0.5rem',
                      backgroundColor: `${getStatusColor(task.status)}20`,
                      border: `1px solid ${getStatusColor(task.status)}`,
                      color: getStatusColor(task.status),
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}
                  >
                    {getStatusLabel(task.status)}
                  </div>
                </div>
                
                <p style={{ margin: '0.5rem 0 1rem 0', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                  {task.description}
                </p>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                  <div>
                    <span style={{ fontWeight: '600' }}>Attribué par:</span> {task.assignedBy}
                  </div>
                  <div>
                    <span style={{ fontWeight: '600' }}>Pour:</span> {task.assignedTo}
                  </div>
                  <div>
                    <span style={{ fontWeight: '600' }}>Échéance:</span> {task.dueDate}
                  </div>
                  <div>
                    <span style={{ fontWeight: '600' }}>Priorité:</span> {getPriorityLabel(task.priority)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {activeTab === 'notifications' && (
        <div style={{ padding: '1rem 0 0 0' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h3 className="text-white" style={{ margin: 0 }}>
              Notifications liées à {professionalName}
            </h3>
          </div>
          
          <div>
            {notifications.map(notification => (
              <div
                key={notification.id}
                style={{
                  background: notification.read ? 'rgba(30, 40, 55, 0.3)' : 'rgba(30, 40, 55, 0.5)',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  marginBottom: '0.75rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  opacity: notification.read ? 0.7 : 1,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {!notification.read && (
                  <div style={{
                    position: 'absolute',
                    top: '0.75rem',
                    left: '0',
                    width: '4px',
                    height: '70%',
                    backgroundColor: 'rgba(255, 114, 28, 0.8)',
                    borderRadius: '0 2px 2px 0'
                  }}></div>
                )}
                
                <div style={{ paddingLeft: notification.read ? '0' : '0.75rem' }}>
                  <h4 className="text-white" style={{ 
                    margin: '0 0 0.5rem 0',
                    fontSize: '0.95rem',
                    fontWeight: notification.read ? 400 : 600
                  }}>
                    {notification.title}
                  </h4>
                  <p className="text-light" style={{ 
                    margin: '0',
                    fontSize: '0.85rem'
                  }}>
                    {notification.description}
                  </p>
                </div>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-end'
                }}>
                  <span className="text-muted" style={{ 
                    fontSize: '0.75rem'
                  }}>
                    {formatRelativeTime(notification.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaborativeActionPanel;
