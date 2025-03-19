'use client';

import { useState, useEffect, useRef } from 'react';
import Portal from '@/components/Portal';
import styles from './MessageDialog.module.css';

export default function MessageDialog({ isOpen, onClose, patient }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Données factices pour le prototype
  const mockMessages = [
    {
      id: 1,
      sender: 'professional',
      content: `Bonjour ${patient?.firstName || 'patient'}, comment allez-vous aujourd'hui?`,
      timestamp: new Date(Date.now() - 86400000).toISOString() // hier
    },
    {
      id: 2,
      sender: 'patient',
      content: 'Bonjour, je vais bien merci. J\'ai suivi le programme nutritionnel que vous m\'avez donné.',
      timestamp: new Date(Date.now() - 82800000).toISOString() // hier
    },
    {
      id: 3,
      sender: 'professional',
      content: 'Excellent ! Avez-vous remarqué des changements dans votre récupération après l\'entraînement ?',
      timestamp: new Date(Date.now() - 79200000).toISOString() // hier
    },
    {
      id: 4,
      sender: 'patient',
      content: 'Oui, je me sens moins fatigué. Est-ce qu\'on peut ajuster légèrement la partie hydratation ?',
      timestamp: new Date(Date.now() - 75600000).toISOString() // hier
    }
  ];

  // Handle modal animation
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Charger les messages
      setLoading(true);
      setTimeout(() => {
        setMessages(mockMessages);
        setLoading(false);
      }, 800);
    } else {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300); // Match the animation duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const newMsg = {
      id: messages.length + 1,
      sender: 'professional',
      content: newMessage,
      timestamp: new Date().toISOString()
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  const formatDate = (dateString) => {
    const messageDate = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const isToday = messageDate.toDateString() === now.toDateString();
    const isYesterday = messageDate.toDateString() === yesterday.toDateString();
    
    if (isToday) {
      return `Aujourd'hui, ${messageDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (isYesterday) {
      return `Hier, ${messageDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return messageDate.toLocaleDateString('fr-FR', { 
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  if (!isAnimating && !isOpen) {
    return null;
  }

  return (
    <Portal>
      <div 
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : styles.overlayHidden}`} 
        onClick={onClose}
        aria-modal="true"
        role="dialog"
      >
        <div 
          className={`${styles.dialog} ${isOpen ? styles.dialogVisible : styles.dialogHidden}`} 
          onClick={e => e.stopPropagation()}
        >
          <div className={styles.header}>
            <h2>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF8800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Messagerie avec {patient?.firstName} {patient?.lastName}
            </h2>
            <button className={styles.closeButton} onClick={onClose} aria-label="Fermer">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div className={styles.patientInfo}>
            <div className={styles.patientAvatar}>
              <img 
                src={patient?.photo || patient?.photoUrl || '/placeholder-avatar.png'} 
                alt={`${patient?.firstName} ${patient?.lastName}`} 
              />
              <span className={styles.status}></span>
            </div>
            <div className={styles.patientDetail}>
              <span className={styles.label}>Patient</span>
              <span className={styles.value}>{patient?.firstName} {patient?.lastName}</span>
            </div>
          </div>

          <div className={styles.messagesContainer}>
            {loading ? (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <span>Chargement des messages...</span>
              </div>
            ) : messages.length === 0 ? (
              <div className={styles.emptyState}>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FF8800" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <p>Aucun message</p>
                <p className={styles.emptyStateSubtext}>Commencez la conversation avec {patient?.firstName}</p>
              </div>
            ) : (
              <div className={styles.messagesList}>
                {messages.map((message, index) => (
                  <div 
                    key={message.id} 
                    className={`${styles.messageItem} ${message.sender === 'professional' ? styles.sent : styles.received}`}
                  >
                    <div className={styles.messageContent}>
                      <p>{message.content}</p>
                      <span className={styles.messageTime}>{formatDate(message.timestamp)}</span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <form className={styles.messageForm} onSubmit={handleSendMessage}>
            <div className={styles.messageInputWrapper}>
              <input 
                type="text" 
                placeholder="Écrivez votre message..." 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className={styles.messageInput}
              />
              <button 
                type="submit" 
                className={styles.sendButton}
                disabled={newMessage.trim() === ''}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Portal>
  );
}
