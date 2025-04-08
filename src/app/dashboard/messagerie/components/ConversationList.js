'use client';

import React, { useState, useEffect } from 'react';
import styles from '../styles/page.module.css';
import { useMessageContext } from '@/contexts/MessageContext';
import prisma from '@/lib/prisma'; // Import du mock prisma

// Les conversations seront obtenues du fichier prisma.js ou des props
const getConversationsFromPatients = () => {
  // On récupère les patients du mock prisma
  const superheroPatients = [
    {
      id: 'conv-001',
      userName: "Bruce Wayne",
      lastMessage: "Je vais avoir besoin d'un nouveau régime pour mes patrouilles nocturnes",
      timestamp: "14:30",
      unread: 2,
      avatar: "/img/patient/batman.jpg",
      patientId: 'pat-001',
      status: "En suivi",
      messages: [
        {
          id: 'msg-001',
          senderId: 'patient',
          receiverId: 'nutritionist',
          content: "Bonjour, j'aimerais adapter mon régime à mes activités nocturnes.",
          timestamp: "2025-04-02T20:30:00.000Z",
          read: true
        },
        {
          id: 'msg-002',
          senderId: 'nutritionist',
          receiverId: 'patient',
          content: "Bien sûr Bruce, je peux vous proposer un plan nutritionnel adapté à vos besoins spécifiques.",
          timestamp: "2025-04-02T20:35:00.000Z",
          read: true
        },
        {
          id: 'msg-003',
          senderId: 'patient',
          receiverId: 'nutritionist',
          content: "Je vais avoir besoin d'un nouveau régime pour mes patrouilles nocturnes",
          timestamp: "2025-04-03T14:30:00.000Z",
          read: false
        }
      ]
    },
    {
      id: 'conv-002',
      userName: "Izuku Midoriya",
      lastMessage: "Est-ce que mon nouveau régime convient à One For All ?",
      timestamp: "Hier",
      unread: 1,
      avatar: "/img/patient/deku.jpg",
      patientId: 'pat-002',
      status: "Actif",
      messages: [
        {
          id: 'msg-004',
          senderId: 'patient',
          receiverId: 'nutritionist',
          content: "Bonjour, je cherche à optimiser mon apport calorique pour mieux utiliser mon Alter.",
          timestamp: "2025-04-01T10:15:00.000Z",
          read: true
        },
        {
          id: 'msg-005',
          senderId: 'nutritionist',
          receiverId: 'patient',
          content: "Izuku, nous allons travailler sur un régime spécifique pour augmenter ta résistance physique.",
          timestamp: "2025-04-01T10:20:00.000Z",
          read: true
        },
        {
          id: 'msg-006',
          senderId: 'patient',
          receiverId: 'nutritionist',
          content: "Est-ce que mon nouveau régime convient à One For All ?",
          timestamp: "2025-04-02T09:45:00.000Z",
          read: false
        }
      ]
    },
    {
      id: 'conv-003',
      userName: "Son Goku",
      lastMessage: "J'ai besoin de plus de calories pour mon combat contre Vegeta",
      timestamp: "Lun",
      unread: 3,
      avatar: "/img/patient/goku.jpg",
      patientId: 'pat-003',
      status: "En attente",
      messages: [
        {
          id: 'msg-007',
          senderId: 'patient',
          receiverId: 'nutritionist',
          content: "Bonjour, je vais bientôt affronter Vegeta et j'ai besoin d'un régime spécial.",
          timestamp: "2025-03-31T08:10:00.000Z",
          read: true
        },
        {
          id: 'msg-008',
          senderId: 'nutritionist',
          receiverId: 'patient',
          content: "Goku, nous pouvons augmenter considérablement ton apport calorique pour ce combat important.",
          timestamp: "2025-03-31T08:15:00.000Z",
          read: true
        },
        {
          id: 'msg-009',
          senderId: 'patient',
          receiverId: 'nutritionist',
          content: "Super ! J'ai vraiment besoin de beaucoup d'énergie pour mes kamehameha.",
          timestamp: "2025-03-31T08:20:00.000Z",
          read: true
        },
        {
          id: 'msg-010',
          senderId: 'patient',
          receiverId: 'nutritionist',
          content: "J'ai besoin de plus de calories pour mon combat contre Vegeta",
          timestamp: "2025-04-01T10:05:00.000Z",
          read: false
        }
      ]
    },
    {
      id: 'conv-004',
      userName: "Tony Stark",
      lastMessage: "Ce complément alimentaire me donne des palpitations",
      timestamp: "29/03",
      unread: 0,
      avatar: "/img/patient/ironman.jpg",
      patientId: 'pat-004',
      status: "En suivi",
      messages: [
        {
          id: 'msg-011',
          senderId: 'patient',
          receiverId: 'nutritionist',
          content: "Bonjour, je cherche quelque chose qui pourrait améliorer mes performances cognitives.",
          timestamp: "2025-03-25T15:40:00.000Z",
          read: true
        },
        {
          id: 'msg-012',
          senderId: 'nutritionist',
          receiverId: 'patient',
          content: "Tony, j'ai une formule qui pourrait vous aider. Elle contient des acides gras oméga-3 et des antioxydants.",
          timestamp: "2025-03-25T15:45:00.000Z",
          read: true
        },
        {
          id: 'msg-013',
          senderId: 'patient',
          receiverId: 'nutritionist',
          content: "Ce complément alimentaire me donne des palpitations",
          timestamp: "2025-03-29T09:30:00.000Z",
          read: true
        }
      ]
    },
    {
      id: 'conv-005',
      userName: "Monkey D. Luffy",
      lastMessage: "J'ai besoin d'un régime spécial pour devenir le roi des pirates",
      timestamp: "28/03",
      unread: 0,
      avatar: "/img/patient/luffy.jpg",
      patientId: 'pat-005',
      status: "En pause",
      messages: [
        {
          id: 'msg-014',
          senderId: 'patient',
          receiverId: 'nutritionist',
          content: "Bonjour ! J'adore manger de la viande ! Comment faire pour en manger plus ?",
          timestamp: "2025-03-26T18:20:00.000Z",
          read: true
        },
        {
          id: 'msg-015',
          senderId: 'nutritionist',
          receiverId: 'patient',
          content: "Luffy, tu as besoin d'un régime équilibré, pas seulement de la viande.",
          timestamp: "2025-03-26T18:25:00.000Z",
          read: true
        },
        {
          id: 'msg-016',
          senderId: 'patient',
          receiverId: 'nutritionist',
          content: "J'ai besoin d'un régime spécial pour devenir le roi des pirates",
          timestamp: "2025-03-28T12:10:00.000Z",
          read: true
        }
      ]
    }
  ];
  
  return superheroPatients;
};

export default function ConversationList({ onNewMessage, staticConversations }) {
  // Utiliser le contexte MessageContext pour accéder aux conversations et sélectionner une conversation
  const { 
    conversations: contextConversations, 
    selectedConversation, 
    handleSelectConversation 
  } = useMessageContext();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [conversations, setConversations] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  
  useEffect(() => {
    // Si des conversations statiques sont fournies, les utiliser
    if (staticConversations && staticConversations.length > 0) {
      console.log("Utilisation des conversations statiques fournies en props", staticConversations);
      setConversations(staticConversations);
      // Si contextConversations est vide, initialiser avec nos données statiques
      if ((!contextConversations || contextConversations.length === 0) && handleSelectConversation) {
        handleSelectConversation(staticConversations[0]);
      }
    } 
    // Sinon, vérifier le contexte
    else if (contextConversations && contextConversations.length > 0) {
      console.log("Conversations du contexte:", contextConversations);
      setConversations(contextConversations);
    } 
    // Dernier recours: utiliser les données mockées
    else {
      const mockConversations = getConversationsFromPatients();
      console.log("Conversations mock:", mockConversations);
      setConversations(mockConversations);
      // Si handleSelectConversation existe, sélectionner la première conversation par défaut
      if (handleSelectConversation) {
        handleSelectConversation(mockConversations[0]);
      }
    }
  }, [contextConversations, staticConversations, handleSelectConversation]);
  
  // Logs pour déboguer les conversations filtrées
  useEffect(() => {
    if (conversations && conversations.length > 0) {
      console.log("Conversations actuelles:", conversations);
      console.log("Premier élément:", conversations[0]);
    }
  }, [conversations]);
  
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = searchTerm 
      ? conv.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
      
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'unread' && conv.unread > 0) ||
      (filterStatus === 'suivi' && conv.status === "En suivi") ||
      (filterStatus === 'actif' && conv.status === "Actif");
      
    return matchesSearch && matchesFilter;
  });

  // Formater le dernier message pour qu'il ne soit pas trop long
  const formatLastMessage = (message) => {
    if (!message) return '';
    return message.length > 50 ? message.substring(0, 47) + '...' : message;
  };
  
  // Gérer le clic sur une conversation
  const handleConversationClick = (conversation) => {
    // S'assurer que la conversation a toutes les propriétés nécessaires
    const completeConversation = {
      ...conversation,
      // Garantir que ces propriétés existent
      messages: conversation.messages || [],
      patient: {
        id: conversation.patientId,
        name: conversation.userName,
        avatar: conversation.avatar,
        photoUrl: conversation.avatar,
        user: {
          firstName: conversation.userName?.split(' ')[0] || 'Patient',
          lastName: conversation.userName?.split(' ')[1] || '',
          photoUrl: conversation.avatar
        }
      }
    };
    
    console.log("Conversation sélectionnée complète:", completeConversation);
    
    // Appeler la fonction du contexte pour sélectionner la conversation
    if (handleSelectConversation) {
      handleSelectConversation(completeConversation);
    } else {
      console.log("La fonction handleSelectConversation n'est pas disponible");
    }
  };

  return (
    <div className={styles.conversationListContainer}>
      <div className={styles.conversationHeader}>
        <h2 className={styles.conversationTitle}>Messages</h2>
        <button 
          className={styles.newMessageButton}
          onClick={onNewMessage}
          aria-label="Nouveau message"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      
      <div className={styles.searchContainer}>
        <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <input 
          type="text"
          className={styles.searchInput}
          placeholder="Rechercher une conversation..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className={styles.filterButtons}>
        <button 
          className={`${styles.filterButton} ${filterStatus === 'all' ? styles.active : ''}`}
          onClick={() => setFilterStatus('all')}
        >
          Tous
        </button>
        <button 
          className={`${styles.filterButton} ${filterStatus === 'unread' ? styles.active : ''}`}
          onClick={() => setFilterStatus('unread')}
        >
          Non lus
        </button>
        <button 
          className={`${styles.filterButton} ${filterStatus === 'suivi' ? styles.active : ''}`}
          onClick={() => setFilterStatus('suivi')}
        >
          En suivi
        </button>
      </div>
      
      <div className={styles.conversationsContainer}>
        {filteredConversations.length > 0 ? (
          filteredConversations.map(conversation => (
            <div 
              key={conversation.id} 
              className={`${styles.conversationItem} ${selectedConversation?.id === conversation.id ? styles.active : ''}`}
              onClick={() => handleConversationClick(conversation)}
            >
              <div className={styles.avatarContainer}>
                <div className={styles.avatar}>
                  {/* Utilisation d'une table de correspondance pour les avatars */}
                  {conversation.id === 'conv-001' && (
                    <img src="/img/patient/batman.jpg" alt="Bruce Wayne" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                  )}
                  {conversation.id === 'conv-002' && (
                    <img src="/img/patient/deku.jpg" alt="Izuku Midoriya" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                  )}
                  {conversation.id === 'conv-003' && (
                    <img src="/img/patient/goku.jpg" alt="Son Goku" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                  )}
                  {conversation.id === 'conv-004' && (
                    <img src="/img/patient/ironman.jpg" alt="Tony Stark" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                  )}
                  {conversation.id === 'conv-005' && (
                    <img src="/img/patient/luffy.jpg" alt="Monkey D. Luffy" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                  )}
                  {!['conv-001', 'conv-002', 'conv-003', 'conv-004', 'conv-005'].includes(conversation.id) && (
                    <img src="/img/patient/default-avatar.jpg" alt="Default" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                  )}
                  <span className={`${styles.statusIndicator} ${
                    conversation.status === "Actif" ? styles.statusOnline : 
                    conversation.status === "En suivi" ? styles.statusInProgress : 
                    styles.statusAway}`}>
                  </span>
                </div>
              </div>
              
              <div className={styles.conversationContent}>
                <div className={styles.conversationHeader}>
                  <h3 className={styles.userName}>{conversation.userName || "Patient sans nom"}</h3>
                  <span className={styles.timestamp}>{conversation.timestamp || "Récent"}</span>
                </div>
                
                <div className={styles.messagePreview}>
                  <p className={styles.lastMessage}>{formatLastMessage(conversation.lastMessage || "Aucun message")}</p>
                  {conversation.unread > 0 && (
                    <span className={styles.unreadBadge}>{conversation.unread}</span>
                  )}
                </div>
                
                <div className={styles.patientStatus}>
                  {conversation.status && (
                    <span className={`${styles.statusBadge} ${styles[`status${conversation.status?.replace(/\s+/g, '') || 'Default'}`] || styles.statusDefault}`}>
                      {conversation.status || "Indéfini"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <p>Aucune conversation ne correspond à votre recherche</p>
          </div>
        )}
      </div>
    </div>
  );
}
