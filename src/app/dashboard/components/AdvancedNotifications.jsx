"use client";
import React, { useState, useEffect } from 'react';
import { 
  MdCheckCircle, MdNotificationsActive, MdAccessTime, MdPhone, 
  MdAssignment, MdTimeline, MdFilterList, MdFavorite, MdOutlineMessage,
  MdPerson, MdPeople, MdOutlineSnooze, MdThumbUp, MdLightbulb,
  MdLocalHospital, MdDirections, MdSchedule, MdPriorityHigh
} from 'react-icons/md';
import { FiAlertTriangle, FiHeart, FiBarChart2, FiSend, FiMessageSquare, FiClock } from 'react-icons/fi';
import styles from './AdvancedNotifications.module.css';
import Image from 'next/image';

// Composant pour afficher un petit graphique dans la notification
const MiniGraph = ({ data, type }) => {
  // Rendu simple d'un mini graphique
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue;
  
  return (
    <div className={styles.miniGraph}>
      <div className={styles.graphContent}>
        {data.map((value, index) => {
          const height = range === 0 ? 50 : ((value - minValue) / range) * 80 + 10;
          return (
            <div 
              key={index} 
              className={`${styles.graphBar} ${type === 'heart' ? styles.heartRate : ''}`}
              style={{ height: `${height}%` }}
            ></div>
          );
        })}
      </div>
      <div className={styles.graphExpand}>
        <FiBarChart2 size={14} />
      </div>
    </div>
  );
};

// Composant d'action rapide pour les notifications
const QuickActions = ({ type, onAction, patientName, notificationId }) => {
  const [processing, setProcessing] = useState(false);
  const [quickResponse, setQuickResponse] = useState('');
  const [showResponseField, setShowResponseField] = useState(false);
  
  const handleAction = (action) => {
    setProcessing(true);
    // Simuler un délai de traitement
    setTimeout(() => {
      setProcessing(false);
      onAction(notificationId, action, quickResponse);
    }, 700);
  };
  
  // Rendu différent selon le type de notification
  switch(type) {
    case 'vital':
      return (
        <div className={styles.quickActionsVital}>
          <button 
            onClick={() => handleAction('call')}
            className={`${styles.actionButton} ${styles.callButton}`}
            disabled={processing}
          >
            <MdPhone size={16} />
            <span>Appeler le patient</span>
          </button>
          <button 
            onClick={() => handleAction('analyze')}
            className={`${styles.actionButton} ${styles.analyzeButton}`}
            disabled={processing}
          >
            <MdAssignment size={16} />
            <span>Analyse détaillée</span>
          </button>
        </div>
      );
      
    case 'health':
      return (
        <div className={styles.quickActions}>
          <button 
            onClick={() => handleAction('prescribe')}
            className={`${styles.actionButton} ${styles.prescribeButton}`}
            disabled={processing}
          >
            <MdLocalHospital size={16} />
            <span>Prescrire</span>
          </button>
          <button 
            onClick={() => handleAction('request')}
            className={`${styles.actionButton} ${styles.requestButton}`}
            disabled={processing}
          >
            <MdAssignment size={16} />
            <span>Demander analyse</span>
          </button>
          {!showResponseField ? (
            <button 
              onClick={() => setShowResponseField(true)}
              className={`${styles.actionButton} ${styles.messageButton}`}
              disabled={processing}
            >
              <MdOutlineMessage size={16} />
              <span>Répondre</span>
            </button>
          ) : (
            <div className={styles.quickResponseContainer}>
              <input 
                type="text" 
                placeholder="Message rapide..." 
                value={quickResponse}
                onChange={(e) => setQuickResponse(e.target.value)}
                className={styles.quickResponseInput}
              />
              <button 
                onClick={() => handleAction('message')}
                className={styles.sendButton}
                disabled={processing || !quickResponse.trim()}
              >
                <FiSend size={14} />
              </button>
            </div>
          )}
        </div>
      );
    
    case 'appointment':
    case 'reminder':
      return (
        <div className={styles.quickActions}>
          <button 
            onClick={() => handleAction('approve')}
            className={`${styles.actionButton} ${styles.approveButton}`}
            disabled={processing}
          >
            <MdCheckCircle size={16} />
            <span>Confirmer</span>
          </button>
          <div className={styles.snoozeDropdown}>
            <button 
              className={`${styles.actionButton} ${styles.snoozeButton}`}
              disabled={processing}
            >
              <MdOutlineSnooze size={16} />
              <span>Reporter</span>
            </button>
            <div className={styles.snoozeOptions}>
              <button onClick={() => handleAction('snooze', '1h')}>1 heure</button>
              <button onClick={() => handleAction('snooze', '6h')}>6 heures</button>
              <button onClick={() => handleAction('snooze', '24h')}>24 heures</button>
              <button onClick={() => handleAction('snooze', 'next')}>
                Prochain RDV patient
              </button>
            </div>
          </div>
        </div>
      );
      
    default:
      return (
        <div className={styles.quickActions}>
          <button 
            onClick={() => handleAction('approve')}
            className={`${styles.actionButton} ${styles.approveButton}`}
            disabled={processing}
          >
            <MdThumbUp size={16} />
            <span>Approuver</span>
          </button>
          <button 
            onClick={() => setShowResponseField(true)}
            className={`${styles.actionButton} ${styles.messageButton}`}
            disabled={processing || showResponseField}
          >
            <MdOutlineMessage size={16} />
            <span>Répondre</span>
          </button>
          {showResponseField && (
            <div className={styles.quickResponseContainer}>
              <input 
                type="text" 
                placeholder="Message rapide..." 
                value={quickResponse}
                onChange={(e) => setQuickResponse(e.target.value)}
                className={styles.quickResponseInput}
              />
              <button 
                onClick={() => handleAction('message')}
                className={styles.sendButton}
                disabled={processing || !quickResponse.trim()}
              >
                <FiSend size={14} />
              </button>
            </div>
          )}
        </div>
      );
  }
};

// Composant de collaboration pour mentionner un collègue
const CollaborationSection = ({ notification, colleagues, onMention }) => {
  const [showColleaguesList, setShowColleaguesList] = useState(false);
  const [activeColleagues, setActiveColleagues] = useState(
    notification.activeColleagues || []
  );
  
  return (
    <div className={styles.collaborationSection}>
      <div className={styles.activeColleagues}>
        {activeColleagues.length > 0 && (
          <div className={styles.avatarStack}>
            {activeColleagues.map((colleague, index) => (
              <div key={index} className={styles.activeColleagueAvatar} title={`${colleague.name} est en train de traiter cette notification`}>
                <Image
                  src={colleague.photoUrl || '/img/professionel/default-avatar.jpg'}
                  alt={colleague.name}
                  width={24}
                  height={24}
                />
                <span className={styles.activeStatus}></span>
              </div>
            ))}
          </div>
        )}
        
        <button 
          className={styles.mentionButton}
          onClick={() => setShowColleaguesList(!showColleaguesList)}
        >
          <MdPeople size={16} />
          <span>Mentionner</span>
        </button>
        
        {showColleaguesList && (
          <div className={styles.colleaguesList}>
            {colleagues.map((colleague) => (
              <div 
                key={colleague.id} 
                className={styles.colleagueItem}
                onClick={() => {
                  onMention(notification.id, colleague);
                  setShowColleaguesList(false);
                }}
              >
                <div className={styles.colleagueAvatar}>
                  <Image
                    src={colleague.photoUrl || '/img/professionel/default-avatar.jpg'}
                    alt={colleague.name}
                    width={28}
                    height={28}
                  />
                  <span className={colleague.online ? styles.onlineStatus : styles.offlineStatus}></span>
                </div>
                <div className={styles.colleagueInfo}>
                  <span className={styles.colleagueName}>{colleague.name}</span>
                  <span className={styles.colleagueSpecialty}>{colleague.specialty}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Rendu des tags intelligents
const SmartTags = ({ tags, onTagFilter }) => {
  return (
    <div className={styles.smartTags}>
      {tags.map((tag, index) => (
        <span 
          key={index} 
          className={styles.tag}
          onClick={() => onTagFilter(tag)}
        >
          #{tag}
        </span>
      ))}
    </div>
  );
};

// Composant de résumé contextuel avec IA
const AIContextSummary = ({ summary, risk }) => {
  const getRiskClass = () => {
    switch (risk) {
      case 'high': return styles.highRisk;
      case 'moderate': return styles.moderateRisk;
      case 'low': return styles.lowRisk;
      default: return '';
    }
  };
  
  return (
    <div className={`${styles.aiSummary} ${getRiskClass()}`}>
      <div className={styles.summaryHeader}>
        <MdLightbulb size={16} className={styles.aiIcon} />
        <span className={styles.aiLabel}>Analyse IA</span>
      </div>
      <p className={styles.summaryText}>{summary}</p>
      {risk && (
        <div className={`${styles.riskIndicator} ${getRiskClass()}`}>
          Risque: {risk === 'high' ? 'Élevé' : risk === 'moderate' ? 'Modéré' : 'Faible'}
        </div>
      )}
    </div>
  );
};

// Composant principal de notification avancée
const AdvancedNotificationItem = ({ 
  notification, 
  onAction, 
  onMention, 
  onTagFilter,
  colleagues
}) => {
  // Obtenir l'icône en fonction du type
  const getTypeIcon = () => {
    switch (notification.type) {
      case 'vital':
        return <FiAlertTriangle size={18} className={styles.vitalIcon} />;
      case 'health':
        return <FiHeart size={18} className={styles.healthIcon} />;
      case 'appointment':
        return <MdSchedule size={18} className={styles.appointmentIcon} />;
      case 'reminder':
        return <FiClock size={18} className={styles.reminderIcon} />;
      case 'document':
        return <MdAssignment size={18} className={styles.documentIcon} />;
      default:
        return <MdNotificationsActive size={18} />;
    }
  };
  
  // Obtenir la classe de priorité
  const getPriorityClass = () => {
    switch (notification.priority) {
      case 'urgent':
        return styles.urgentPriority;
      case 'high':
        return styles.highPriority;
      case 'medium':
        return styles.mediumPriority;
      case 'low':
        return styles.lowPriority;
      default:
        return '';
    }
  };
  
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year} à ${hours}h${minutes}`;
  };
  
  return (
    <div className={`${styles.notificationItem} ${!notification.read ? styles.unread : ''} ${getPriorityClass()}`}>
      <div className={styles.notificationHeader}>
        <div className={styles.typeIndicator}>
          {getTypeIcon()}
        </div>
        <div className={styles.notificationTitleRow}>
          <h4 className={styles.notificationTitle}>
            {notification.title}
            {notification.favoritePatient && (
              <span className={styles.favoriteIndicator} title="Patient favori">
                <MdFavorite size={14} />
              </span>
            )}
          </h4>
          <div className={styles.notificationTime}>
            {formatTimestamp(notification.timestamp)}
          </div>
        </div>
      </div>
      
      <div className={styles.notificationContent}>
        <div className={styles.messageContent}>
          <p className={styles.notificationMessage}>{notification.message}</p>
          
          {notification.tags && notification.tags.length > 0 && (
            <SmartTags tags={notification.tags} onTagFilter={onTagFilter} />
          )}
        </div>
        
        {notification.graphData && (
          <MiniGraph 
            data={notification.graphData} 
            type={notification.graphType || 'default'} 
          />
        )}
      </div>
      
      {notification.aiSummary && (
        <AIContextSummary 
          summary={notification.aiSummary} 
          risk={notification.riskLevel} 
        />
      )}
      
      <QuickActions 
        type={notification.type} 
        onAction={onAction} 
        patientName={notification.patientName}
        notificationId={notification.id}
      />
      
      <CollaborationSection 
        notification={notification}
        colleagues={colleagues}
        onMention={onMention}
      />
    </div>
  );
};

// Composant principal pour les notifications avancées
const AdvancedNotifications = ({ 
  notifications, 
  colleagues, 
  onAction, 
  onMarkAllRead,
  onFilter,
  onTagFilter,
  onMention
}) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeTags, setActiveTags] = useState([]);
  const [position, setPosition] = useState({ top: 80, right: 20 });
  
  // Calculer la position dynamiquement lors du montage
  useEffect(() => {
    // Récupération de la position du bouton de notification dans la Topbar
    const notificationButton = document.querySelector('[class*="notificationButton"]');
    if (notificationButton) {
      const rect = notificationButton.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 12,
        right: window.innerWidth - rect.right,
      });
    }
  }, []);
  
  // Tri des notifications par urgence puis par patient favori
  const sortedNotifications = [...notifications].sort((a, b) => {
    // D'abord par priorité
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    // Ensuite par patient favori
    if (a.favoritePatient && !b.favoritePatient) return -1;
    if (!a.favoritePatient && b.favoritePatient) return 1;
    
    // Enfin par date (les plus récentes en haut)
    return new Date(b.timestamp) - new Date(a.timestamp);
  });
  
  // Filtrer les notifications selon le filtre actif
  const filteredNotifications = sortedNotifications.filter(notification => {
    // Filtre par type
    if (activeFilter !== 'all' && notification.type !== activeFilter) {
      return false;
    }
    
    // Filtre par tags
    if (activeTags.length > 0) {
      if (!notification.tags) return false;
      return activeTags.every(tag => notification.tags.includes(tag));
    }
    
    return true;
  });
  
  // Gestionnaire pour le filtre par tag
  const handleTagFilter = (tag) => {
    if (activeTags.includes(tag)) {
      setActiveTags(activeTags.filter(t => t !== tag));
    } else {
      setActiveTags([...activeTags, tag]);
    }
    
    if (onTagFilter) {
      onTagFilter(tag);
    }
  };
  
  // Gestionnaire pour le filtre par type
  const handleTypeFilter = (type) => {
    setActiveFilter(type);
    if (onFilter) {
      onFilter(type);
    }
  };
  
  return (
    <div className={styles.notificationsContainer} style={{ top: position.top, right: position.right }}>
      <div className={styles.notificationsHeader}>
        <div className={styles.headerTitle}>
          <h3>Notifications</h3>
          <span className={styles.notificationCount}>
            {notifications.filter(n => !n.read).length} nouvelles
          </span>
        </div>
        
        <div className={styles.headerActions}>
          {notifications.filter(n => !n.read).length > 0 && (
            <button 
              className={styles.markAllReadButton}
              onClick={onMarkAllRead}
            >
              <MdCheckCircle size={16} />
              <span>Tout marquer comme lu</span>
            </button>
          )}
          
          <div className={styles.filterDropdown}>
            <button className={styles.filterButton}>
              <MdFilterList size={18} />
              <span>Filtrer</span>
            </button>
            
            <div className={styles.filterOptions}>
              <button 
                className={activeFilter === 'all' ? styles.activeFilter : ''}
                onClick={() => handleTypeFilter('all')}
              >
                Toutes
              </button>
              <button 
                className={activeFilter === 'vital' ? styles.activeFilter : ''}
                onClick={() => handleTypeFilter('vital')}
              >
                Urgences
              </button>
              <button 
                className={activeFilter === 'health' ? styles.activeFilter : ''}
                onClick={() => handleTypeFilter('health')}
              >
                Données santé
              </button>
              <button 
                className={activeFilter === 'appointment' ? styles.activeFilter : ''}
                onClick={() => handleTypeFilter('appointment')}
              >
                Rendez-vous
              </button>
              <button 
                className={activeFilter === 'document' ? styles.activeFilter : ''}
                onClick={() => handleTypeFilter('document')}
              >
                Documents
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {activeTags.length > 0 && (
        <div className={styles.activeFilters}>
          <span className={styles.filterLabel}>Filtres actifs:</span>
          {activeTags.map((tag, index) => (
            <span key={index} className={styles.activeTag} onClick={() => handleTagFilter(tag)}>
              #{tag} <span className={styles.removeTag}>×</span>
            </span>
          ))}
          <button 
            className={styles.clearFilters}
            onClick={() => setActiveTags([])}
          >
            Effacer tout
          </button>
        </div>
      )}
      
      <div className={styles.notificationsList}>
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => (
            <AdvancedNotificationItem 
              key={notification.id}
              notification={notification}
              onAction={onAction}
              onTagFilter={handleTagFilter}
              onMention={onMention}
              colleagues={colleagues}
            />
          ))
        ) : (
          <div className={styles.emptyNotifications}>
            <p>Aucune notification ne correspond à vos filtres</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedNotifications;
