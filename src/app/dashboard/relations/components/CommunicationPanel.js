'use client';

import { useState } from 'react';
import styles from '../page.module.css';

const CommunicationPanel = ({ selectedProfessional }) => {
  const [activeTab, setActiveTab] = useState('chat');
  const [messageInput, setMessageInput] = useState('');
  
  // Messages fictifs pour la démonstration
  const [messages, setMessages] = useState([
    {
      id: 1,
      senderId: 'current-user',
      text: 'Bonjour, j\'ai remarqué que notre patient commun a des carences en fer. Avez-vous des recommandations alimentaires spécifiques ?',
      timestamp: new Date(2025, 2, 1, 10, 15)
    },
    {
      id: 2,
      senderId: 'pro-1',
      text: 'Bonjour, oui tout à fait. Je lui ai prescrit des suppléments, mais il serait bien de compléter avec un régime riche en fer. Des viandes rouges, des épinards et des lentilles seraient parfaits.',
      timestamp: new Date(2025, 2, 1, 10, 25)
    },
    {
      id: 3,
      senderId: 'current-user',
      text: 'Merci pour ces informations ! Je vais adapter son plan nutritionnel en conséquence.',
      timestamp: new Date(2025, 2, 1, 10, 27)
    }
  ]);
  
  const [notes, setNotes] = useState([
    {
      id: 1,
      authorId: 'pro-1',
      authorName: 'Tony Tony',
      text: 'Le patient présente des douleurs lombaires persistantes. À surveiller lors des exercices de musculation.',
      timestamp: new Date(2025, 1, 20)
    },
    {
      id: 2,
      authorId: 'current-user',
      authorName: 'Vous',
      text: 'Plan nutritionnel adapté pour favoriser la récupération musculaire et réduire l\'inflammation.',
      timestamp: new Date(2025, 2, 1)
    }
  ]);
  
  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      senderId: 'current-user',
      text: messageInput,
      timestamp: new Date()
    };
    
    setMessages([...messages, newMessage]);
    setMessageInput('');
  };
  
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  if (!selectedProfessional) {
    return (
      <div className={styles.messagePanel} style={{ justifyContent: 'center', alignItems: 'center' }}>
        <p>Sélectionnez un professionnel pour voir vos échanges</p>
      </div>
    );
  }
  
  return (
    <div className={styles.messagePanel}>
      <div className={styles.messagesHeader}>
        <div className={styles.avatar}>
          <img 
            src={selectedProfessional.user?.photoUrl || '/img/default-avatar.jpg'} 
            alt={selectedProfessional.user ? `${selectedProfessional.user.firstName} ${selectedProfessional.user.lastName}` : 'Professionnel'}
            onError={(e) => {
              e.target.src = '/img/patient/default-avatar.jpg';
            }}
          />
        </div>
        <div style={{ marginLeft: '0.75rem' }}>
          <h3 style={{ margin: '0' }}>
            {selectedProfessional.user 
              ? `${selectedProfessional.user.firstName} ${selectedProfessional.user.lastName}`
              : 'Professionnel de santé'}
          </h3>
          <p style={{ margin: '0', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.6)' }}>
            {formatSpecialty(selectedProfessional.specialty)}
          </p>
        </div>
      </div>
      
      <div className={styles.tabs}>
        <button 
          style={{
            padding: '10px 20px',
            margin: '0 5px 0 0',
            backgroundColor: activeTab === 'chat' ? 'rgba(255, 114, 28, 0.15)' : 'rgba(0, 0, 0, 0.2)',
            color: activeTab === 'chat' ? 'rgba(255, 114, 28, 1)' : 'white',
            border: activeTab === 'chat' ? '1px solid rgba(255, 114, 28, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: activeTab === 'chat' ? '0 4px 15px rgba(255, 114, 28, 0.15)' : 'none',
            transition: 'all 0.3s ease'
          }}
          onClick={() => setActiveTab('chat')}
        >
          Messages
        </button>
        <button 
          style={{
            padding: '10px 20px',
            margin: '0 5px 0 0',
            backgroundColor: activeTab === 'notes' ? 'rgba(255, 114, 28, 0.15)' : 'rgba(0, 0, 0, 0.2)',
            color: activeTab === 'notes' ? 'rgba(255, 114, 28, 1)' : 'white',
            border: activeTab === 'notes' ? '1px solid rgba(255, 114, 28, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: activeTab === 'notes' ? '0 4px 15px rgba(255, 114, 28, 0.15)' : 'none',
            transition: 'all 0.3s ease'
          }}
          onClick={() => setActiveTab('notes')}
        >
          Notes & Annotations
        </button>
        <button 
          style={{
            padding: '10px 20px',
            margin: '0 5px 0 0',
            backgroundColor: activeTab === 'forum' ? 'rgba(255, 114, 28, 0.15)' : 'rgba(0, 0, 0, 0.2)',
            color: activeTab === 'forum' ? 'rgba(255, 114, 28, 1)' : 'white',
            border: activeTab === 'forum' ? '1px solid rgba(255, 114, 28, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: activeTab === 'forum' ? '0 4px 15px rgba(255, 114, 28, 0.15)' : 'none',
            transition: 'all 0.3s ease'
          }}
          onClick={() => setActiveTab('forum')}
        >
          Forum collaboratif
        </button>
      </div>
      
      {activeTab === 'chat' && (
        <>
          <div className={styles.messagesBody}>
            {messages.map(message => (
              <div 
                key={message.id} 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: message.senderId === 'current-user' ? 'flex-end' : 'flex-start',
                  padding: '10px',
                  margin: '10px 0',
                  backgroundColor: message.senderId === 'current-user' ? 'rgba(255, 114, 28, 0.15)' : 'rgba(0, 0, 0, 0.2)',
                  color: message.senderId === 'current-user' ? 'rgba(255, 114, 28, 1)' : 'white',
                  border: message.senderId === 'current-user' ? '1px solid rgba(255, 114, 28, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  boxShadow: message.senderId === 'current-user' ? '0 4px 15px rgba(255, 114, 28, 0.15)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                  {message.senderId === 'current-user' ? 'Vous' : `Dr. ${selectedProfessional.firstName} ${selectedProfessional.lastName}`}
                </div>
                <div style={{ padding: '10px', borderRadius: '8px' }}>
                  {message.text}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles.messageInput}>
            <input
              type="text"
              placeholder="Écrivez un message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              style={{
                padding: '10px',
                width: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.3s ease'
              }}
            />
            <button 
              style={{
                padding: '10px 20px',
                margin: '10px 0',
                backgroundColor: 'rgba(255, 114, 28, 0.15)',
                color: 'rgba(255, 114, 28, 1)',
                border: '1px solid rgba(255, 114, 28, 0.3)',
                borderRadius: '8px',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                boxShadow: '0 4px 15px rgba(255, 114, 28, 0.15)',
                transition: 'all 0.3s ease'
              }}
              onClick={handleSendMessage}
            >
              Envoyer
            </button>
          </div>
        </>
      )}
      
      {activeTab === 'notes' && (
        <div className={styles.messagesBody}>
          <div style={{ marginBottom: '1rem' }}>
            <textarea
              placeholder="Ajouter une note ou annotation..."
              style={{
                padding: '10px',
                width: '100%',
                height: '100px',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.3s ease'
              }}
            />
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '0.5rem'
            }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                  <input type="checkbox" style={{ marginRight: '0.5rem' }} />
                  Visible pour tous les professionnels
                </label>
              </div>
              <button 
                style={{
                  padding: '10px 20px',
                  margin: '10px 0',
                  backgroundColor: 'rgba(255, 114, 28, 0.15)',
                  color: 'rgba(255, 114, 28, 1)',
                  border: '1px solid rgba(255, 114, 28, 0.3)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 15px rgba(255, 114, 28, 0.15)',
                  transition: 'all 0.3s ease'
                }}
              >
                Enregistrer
              </button>
            </div>
          </div>
          
          <div className={styles.timeline}>
            {notes.map(note => (
              <div key={note.id} className={styles.timelineItem}>
                <div className={styles.timelineDot}></div>
                <div className={styles.timelineContent}>
                  <p className={styles.timelineDate}>{formatDate(note.timestamp)}</p>
                  <h4 className={styles.timelineTitle}>{note.authorName}</h4>
                  <p className={styles.timelineText}>{note.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {activeTab === 'forum' && (
        <div className={styles.messagesBody}>
          <p style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)' }}>
            Aucune discussion collaborative n'a été créée pour ce patient.
          </p>
          
          <button 
            style={{
              padding: '10px 20px',
              margin: '10px 0',
              backgroundColor: 'rgba(255, 114, 28, 0.15)',
              color: 'rgba(255, 114, 28, 1)',
              border: '1px solid rgba(255, 114, 28, 0.3)',
              borderRadius: '8px',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              boxShadow: '0 4px 15px rgba(255, 114, 28, 0.15)',
              transition: 'all 0.3s ease'
            }}
          >
            + Créer une nouvelle discussion
          </button>
          
          <div style={{ marginTop: '2rem' }}>
            <h3>Discussions suggérées</h3>
            <div className={styles.relationCard}>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>Suivi post-opératoire</h4>
              <p style={{ fontSize: '0.85rem', margin: '0 0 0.5rem 0', color: 'rgba(255, 255, 255, 0.7)' }}>
                4 professionnels impliqués - Dernière activité il y a 2 jours
              </p>
              <button 
                style={{
                  padding: '10px 20px',
                  margin: '10px 0',
                  backgroundColor: 'rgba(255, 114, 28, 0.15)',
                  color: 'rgba(255, 114, 28, 1)',
                  border: '1px solid rgba(255, 114, 28, 0.3)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 15px rgba(255, 114, 28, 0.15)',
                  transition: 'all 0.3s ease'
                }}
              >
                Rejoindre la discussion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const formatSpecialty = (specialty) => {
  const specialtyMap = {
    'NUTRITIONIST': 'Nutritionniste',
    'PHYSIOTHERAPIST': 'Kinésithérapeute',
    'PSYCHOLOGIST': 'Psychologue',
    'DOCTOR': 'Médecin',
    'GENERAL': 'Généraliste',
    'RADIOLOGIST': 'Radiologue',
    'PEDIATRICIAN': 'Pédiatre',
    'PHYSICAL_TRAINER': 'Entraîneur sportif',
    'DIETITIAN': 'Diététicien'
  };
  
  return specialtyMap[specialty] || specialty;
};

export default CommunicationPanel;
