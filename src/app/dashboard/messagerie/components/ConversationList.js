'use client';

import React, { useState, useEffect } from 'react';
import { useMessageContext } from '@/contexts/MessageContext';
import { FiSearch, FiPlus, FiFilter, FiStar, FiClock, FiMessageSquare, FiArchive } from 'react-icons/fi';
import styles from '../page.module.css';

const ConversationList = ({ onNewMessage }) => {
  const { 
    conversations, 
    selectedConversation, 
    handleSelectConversation,
    allPatients,
    handleStartNewConversation
  } = useMessageContext();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'waiting', 'archived'
  const [pinnedConversations, setPinnedConversations] = useState([]);

  // Filtrer les conversations selon les critères
  console.log("ConversationList - conversations reçues:", conversations);
  
  const filteredConversations = conversations.filter(conv => {
    // Vérifier si le patient existe
    if (!conv.patient) {
      console.error("Conversation sans patient détectée:", conv);
      return false;
    }
    
    // Filtrer par recherche
    const matchesSearch = conv.patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtrer par mode
    const matchesFilter = 
      (filterMode === 'all') || 
      (filterMode === 'waiting' && conv.waitingResponse) || 
      (filterMode === 'archived' && conv.archived);
    
    return matchesSearch && matchesFilter;
  });
  
  console.log("ConversationList - conversations filtrées:", filteredConversations);

  // Trier les conversations (épinglées en premier, puis par date du dernier message)
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    // Épinglées en premier
    if (pinnedConversations.includes(a.id) && !pinnedConversations.includes(b.id)) return -1;
    if (!pinnedConversations.includes(a.id) && pinnedConversations.includes(b.id)) return 1;
    
    // Puis par date du dernier message (le plus récent en premier)
    const aLastMsg = a.messages && a.messages.length > 0 ? a.messages[a.messages.length - 1] : null;
    const bLastMsg = b.messages && b.messages.length > 0 ? b.messages[b.messages.length - 1] : null;
    
    // Si aucun message n'existe, utiliser un timestamp par défaut ou une autre méthode de tri
    if (!aLastMsg && !bLastMsg) return 0;
    if (!aLastMsg) return 1;
    if (!bLastMsg) return -1;
    
    return new Date(bLastMsg.timestamp) - new Date(aLastMsg.timestamp);
  });

  // Épingler/désépingler une conversation
  const togglePin = (convId, e) => {
    e.stopPropagation();
    setPinnedConversations(prev => 
      prev.includes(convId) 
        ? prev.filter(id => id !== convId) 
        : [...prev, convId]
    );
  };

  // Formater la date du dernier message
  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    try {
      const date = new Date(timestamp);
      // Vérifier si la date est valide
      if (isNaN(date.getTime())) return 'Date invalide';
      
      const now = new Date();
      const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        // Aujourd'hui : heure
        return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      } else if (diffDays === 1) {
        // Hier
        return 'Hier';
      } else if (diffDays < 7) {
        // Cette semaine : jour
        return date.toLocaleDateString([], {weekday: 'short'});
      } else {
        // Plus ancien : date
        return date.toLocaleDateString([], {day: 'numeric', month: 'short'});
      }
    } catch (error) {
      console.error('Erreur lors du formatage de la date:', error);
      return 'Date invalide';
    }
  };

  // Obtenir le statut du patient
  const getPatientStatus = (conv) => {
    if (conv.archived) return 'Archivé';
    if (conv.waitingResponse) return 'En attente';
    return 'En suivi';
  };

  // Obtenir la classe CSS du statut
  const getStatusClass = (conv) => {
    if (conv.archived) return styles.statusInfo;
    if (conv.waitingResponse) return styles.statusWarning;
    return styles.statusSuccess;
  };

  // Obtenir le dernier message (texte raccourci si nécessaire)
  const getLastMessage = (conv) => {
    if (!conv.messages || conv.messages.length === 0) return 'Aucun message';
    
    const lastMsg = conv.messages[conv.messages.length - 1];
    if (!lastMsg || !lastMsg.content) return 'Message sans contenu';
    
    const maxLength = 40;
    
    if (lastMsg.content.length <= maxLength) return lastMsg.content;
    return `${lastMsg.content.substring(0, maxLength)}...`;
  };

  return (
    <div className={styles.conversationListContainer}>
      <div className={styles.conversationListHeader}>
        <h2 className={styles.headerTitle}>Messagerie</h2>
        
        {/* Barre de recherche */}
        <div className={styles.searchContainer}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Rechercher un patient..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Boutons de filtre */}
        <div className={styles.filterButtons}>
          <button 
            className={`${styles.filterButton} ${filterMode === 'all' ? styles.active : ''}`}
            onClick={() => setFilterMode('all')}
          >
            <FiMessageSquare />
            <span>Tous</span>
          </button>
          <button 
            className={`${styles.filterButton} ${filterMode === 'waiting' ? styles.active : ''}`}
            onClick={() => setFilterMode('waiting')}
          >
            <FiClock />
            <span>En attente</span>
          </button>
          <button 
            className={`${styles.filterButton} ${filterMode === 'archived' ? styles.active : ''}`}
            onClick={() => setFilterMode('archived')}
          >
            <FiArchive />
            <span>Archivés</span>
          </button>
        </div>
        
        {/* Bouton nouveau message */}
        <button className={styles.newMessageButton} onClick={() => onNewMessage?.()}>
          <FiPlus />
          <span>Nouveau message</span>
        </button>
      </div>
      
      {/* Liste des conversations */}
      <div className={styles.conversationList}>
        {sortedConversations.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Aucun résultat trouvé pour votre recherche</p>
          </div>
        ) : (
          sortedConversations.map(conv => (
            <div
              key={conv.id}
              className={`${styles.conversationItem} ${selectedConversation?.id === conv.id ? styles.active : ''}`}
              onClick={() => handleSelectConversation(conv.id)}
            >
              {/* Avatar et badge de non-lu */}
              <div className={styles.conversationAvatar}>
                <img
                  src={conv.patient?.avatarUrl || '/img/patient/default-avatar.jpg'}
                  alt={conv.patient?.name || 'Patient'}
                  width={50}
                  height={50}
                  className={styles.avatarImage}
                  onError={(e) => {
                    console.error('Error loading conversation avatar:', e);
                    e.target.src = '/img/patient/default-avatar.jpg';
                  }}
                />
                {conv.unreadCount > 0 && (
                  <span className={styles.unreadBadge}>{conv.unreadCount}</span>
                )}
              </div>
              
              <div className={styles.conversationInfo}>
                {/* Nom et heure */}
                <div className={styles.conversationHeader}>
                  <h3 className={styles.patientName}>{conv.patient?.name}</h3>
                  <span className={styles.conversationTime}>
                    {conv.messages && conv.messages.length > 0 
                      ? formatTime(conv.messages[conv.messages.length - 1].timestamp)
                      : 'N/A'}
                  </span>
                </div>
                
                {/* Message et statut */}
                <div className={styles.conversationPreview}>
                  <p className={styles.previewText}>{getLastMessage(conv)}</p>
                  <span className={`${styles.statusBadge} ${getStatusClass(conv)}`}>
                    {getPatientStatus(conv)}
                  </span>
                </div>
              </div>
              
              {/* Bouton épingler */}
              <button 
                className={`${styles.pinButton} ${pinnedConversations.includes(conv.id) ? styles.pinned : ''}`}
                onClick={(e) => togglePin(conv.id, e)}
                aria-label={pinnedConversations.includes(conv.id) ? "Désépingler" : "Épingler"}
              >
                <FiStar />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationList;
