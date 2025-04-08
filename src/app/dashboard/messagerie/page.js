'use client';

import React, { useState } from 'react';
import { MessageProvider } from '@/contexts/MessageContext';
import ConversationList from './components/ConversationList';
import ChatWindow from './components/ChatWindow';
import NewMessageModal from './components/NewMessageModal';
import styles from './styles/page.module.css';
import './global.css';

// Données statiques des superhéros pour garantir l'affichage
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
    messages: []
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
    messages: []
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
    messages: []
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
    messages: []
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
    messages: []
  }
];

export default function Messagerie() {
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  
  const handleNewMessage = () => {
    setShowNewMessageModal(true);
  };
  
  // Utilisation du style CSS global pour garantir que le composant s'affiche correctement
  return (
    <MessageProvider>
      <div className="messagingContainer glass-container" style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: 'calc(100vh - 80px)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          flexGrow: 1,
          background: 'rgba(17, 25, 40, 0.4)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
        }}>
          <div style={{
            width: '300px',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            height: '100%',
            overflow: 'hidden',
          }}>
            <ConversationList 
              onNewMessage={handleNewMessage} 
              staticConversations={superheroPatients}
            />
          </div>
          <div style={{
            flexGrow: 1,
            height: '100%',
            overflow: 'hidden',
          }}>
            <ChatWindow />
          </div>
        </div>
        
        {showNewMessageModal && (
          <NewMessageModal onClose={() => setShowNewMessageModal(false)} />
        )}
      </div>
    </MessageProvider>
  );
}
