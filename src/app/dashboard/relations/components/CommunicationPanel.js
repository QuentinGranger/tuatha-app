'use client';

import { useState } from 'react';
import styles from './CommunicationPanel.module.css';

const CommunicationPanel = ({ selectedProfessional }) => {
  const [activeTab, setActiveTab] = useState('chat');
  const [messageInput, setMessageInput] = useState('');
  const [showCreateForumModal, setShowCreateForumModal] = useState(false);
  const [forumTitle, setForumTitle] = useState('');
  const [forumDescription, setForumDescription] = useState('');
  const [forumType, setForumType] = useState('discussion');
  const [isPublic, setIsPublic] = useState(true);
  
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
    },
    {
      id: 4,
      senderId: 'pro-1',
      text: 'Parfait. J\'ai également remarqué qu\'il présente des signes de déshydratation légère. Pourriez-vous le sensibiliser à l\'importance d\'une bonne hydratation, surtout étant donné son régime sportif intense ? Il faudrait lui conseiller de boire au moins 2 litres d\'eau par jour, idéalement répartis tout au long de la journée. Je pense que cela pourrait significativement améliorer ses performances et sa récupération après l\'effort.',
      timestamp: new Date(2025, 2, 1, 10, 35)
    }
  ]);
  
  const [notes, setNotes] = useState([
    {
      id: 1,
      authorId: 'pro-1',
      authorName: 'Dr. Tony Tony',
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
  
  // États pour le forum collaboratif
  const [forumTopics, setForumTopics] = useState([
    {
      id: 1,
      title: "Suivi post-opératoire",
      description: "Discussion sur le suivi et les recommandations après l'opération du genou",
      participants: [
        { id: 'pro-1', name: 'Dr. Tony', photo: `${selectedProfessional.user?.photoUrl || '/img/professionel/chopper.jpg'}` },
        { id: 'pro-2', name: 'Dr. Smith', photo: `${selectedProfessional.user?.photoUrl || '/img/professionel/recovery-girl.jpg'}` },
        { id: 'pro-3', name: 'Dr. Leroy', photo: `${selectedProfessional.user?.photoUrl || '/img/professionel/tsunade.jpg'}` },
        { id: 'current-user', name: 'Vous', photo: `${selectedProfessional.user?.photoUrl || '/img/professionel/sanji.jpg'}` }
      ],
      lastActivity: new Date(2025, 2, 15),
      type: 'consultation',
      isPublic: true,
      tags: ['post-op', 'rééducation', 'orthopédie'],
      messages: [
        { id: 1, authorId: 'pro-1', authorName: 'Dr. Tony', text: "J'ai revu le patient aujourd'hui. La cicatrisation est bonne mais il signale des douleurs persistantes lors de la flexion complète.", timestamp: new Date(2025, 2, 13, 10, 30) },
        { id: 2, authorId: 'pro-2', authorName: 'Dr. Smith', text: "Est-ce qu'il effectue correctement les exercices de rééducation? J'ai remarqué qu'il a tendance à forcer sur l'articulation.", timestamp: new Date(2025, 2, 13, 14, 15) },
        { id: 3, authorId: 'pro-3', authorName: 'Dr. Leroy', text: "Je lui ai prescrit des anti-inflammatoires et recommandé d'alterner chaud et froid sur la zone. Qu'en pensez-vous?", timestamp: new Date(2025, 2, 14, 9, 0) },
        { id: 4, authorId: 'current-user', authorName: 'Vous', text: "D'après mon évaluation, je pense que nous devrions diminuer l'intensité des exercices pendant une semaine et se concentrer davantage sur la mobilité que sur le renforcement.", timestamp: new Date(2025, 2, 15, 11, 45) }
      ]
    },
    {
      id: 2,
      title: "Coordination nutritionnelle",
      description: "Synchronisation des recommandations nutritionnelles avec le programme de rééducation",
      participants: [
        { id: 'pro-1', name: 'Dr. Tony', photo: `${selectedProfessional.user?.photoUrl || '/img/professionel/chopper.jpg'}` },
        { id: 'pro-4', name: 'Dr. Zeno', photo: `${selectedProfessional.user?.photoUrl || '/img/professionel/zeno.jpg'}` },
        { id: 'current-user', name: 'Vous', photo: `${selectedProfessional.user?.photoUrl || '/img/professionel/sanji.jpg'}` }
      ],
      lastActivity: new Date(2025, 2, 16),
      type: 'discussion',
      isPublic: true,
      tags: ['nutrition', 'rééducation', 'coordination'],
      messages: [
        { id: 1, authorId: 'pro-1', authorName: 'Dr. Tony', text: "Le patient devrait augmenter son apport en protéines pour favoriser la récupération musculaire.", timestamp: new Date(2025, 2, 15, 10, 0) },
        { id: 2, authorId: 'pro-4', authorName: 'Dr. Zeno', text: "Je lui ai préparé un planning nutritionnel adapté. Je recommande également une supplémentation en oméga-3 pour réduire l'inflammation.", timestamp: new Date(2025, 2, 15, 14, 30) },
        { id: 3, authorId: 'current-user', authorName: 'Vous', text: "Excellent plan. J'ajouterais qu'il serait bien de synchroniser les apports en protéines avec les séances d'exercices - idéalement dans l'heure qui suit l'effort.", timestamp: new Date(2025, 2, 16, 9, 15) }
      ]
    }
  ]);
  
  // État pour le forum sélectionné et l'affichage de la vue détaillée
  const [selectedForum, setSelectedForum] = useState(null);
  const [forumMessageInput, setForumMessageInput] = useState('');
  
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
  
  const formatRelativeTime = (date) => {
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return "aujourd'hui";
    } else if (diffInDays === 1) {
      return "hier";
    } else {
      return `il y a ${diffInDays} jours`;
    }
  };
  
  const handleCreateForum = () => {
    // Validation basique
    if (!forumTitle.trim() || !forumDescription.trim()) {
      return;
    }
    
    const newForum = {
      id: forumTopics.length + 1,
      title: forumTitle,
      description: forumDescription,
      participants: [
        { id: 'current-user', name: 'Vous', photo: `${selectedProfessional.user?.photoUrl || '/img/professionel/saitama.jpg'}` },
        { id: 'pro-1', name: 'Dr. Tony', photo: `${selectedProfessional.user?.photoUrl || '/img/professionel/chopper.jpg'}` }
      ],
      lastActivity: new Date(),
      type: forumType,
      isPublic: isPublic,
      tags: [],
      messages: []
    };
    
    setForumTopics([...forumTopics, newForum]);
    
    // Réinitialiser le formulaire et fermer la modal
    setForumTitle('');
    setForumDescription('');
    setForumType('discussion');
    setIsPublic(true);
    setShowCreateForumModal(false);
  };
  
  // Fonction pour envoyer un message dans le forum sélectionné
  const handleSendForumMessage = () => {
    if (!forumMessageInput.trim() || !selectedForum) return;
    
    const newMessage = {
      id: selectedForum.messages.length + 1,
      authorId: 'current-user',
      authorName: 'Vous',
      text: forumMessageInput,
      timestamp: new Date()
    };
    
    // Mettre à jour le forum avec le nouveau message
    const updatedForums = forumTopics.map(forum => {
      if (forum.id === selectedForum.id) {
        const updatedForum = {
          ...forum,
          messages: [...forum.messages, newMessage],
          lastActivity: new Date()
        };
        setSelectedForum(updatedForum); // Mettre à jour le forum sélectionné
        return updatedForum;
      }
      return forum;
    });
    
    setForumTopics(updatedForums);
    setForumMessageInput('');
  };
  
  // Fonction pour sélectionner un forum
  const handleSelectForum = (forum) => {
    setSelectedForum(forum);
  };
  
  // Fonction pour revenir à la liste des forums
  const handleBackToForumList = () => {
    setSelectedForum(null);
  };
  
  // Fonction pour grouper les messages par expéditeur
  const groupMessagesByUser = (messages) => {
    let groupedMessages = [];
    let currentGroup = null;
    
    messages.forEach((message, index) => {
      // Si c'est le premier message ou si l'expéditeur est différent du précédent
      if (!currentGroup || currentGroup.senderId !== message.senderId) {
        // Fermer le groupe précédent si existe
        if (currentGroup) {
          groupedMessages.push(currentGroup);
        }
        
        // Créer un nouveau groupe
        currentGroup = {
          id: `group-${message.id}`,
          senderId: message.senderId,
          messages: [message]
        };
      } else {
        // Ajouter au groupe courant
        currentGroup.messages.push(message);
      }
      
      // Si c'est le dernier message, ajouter le groupe courant
      if (index === messages.length - 1 && currentGroup) {
        groupedMessages.push(currentGroup);
      }
    });
    
    return groupedMessages;
  };
  
  if (!selectedProfessional) {
    return (
      <div className={styles.panel}>
        <div className={styles.panelBody}>
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>👋</div>
            <h3 className={styles.emptyStateTitle}>Commencez une conversation</h3>
            <p className={styles.emptyStateText}>
              Sélectionnez un professionnel de santé pour voir vos échanges
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // Grouper les messages
  const groupedMessages = groupMessagesByUser(messages);
  
  // Déterminer l'image du professionnel sélectionné
  const professionalImages = {
    'NUTRITIONIST': '/img/professionel/sanji.jpg',
    'PHYSIOTHERAPIST': '/img/professionel/recovery-girl.jpg',
    'PSYCHOLOGIST': '/img/professionel/orihime.jpg', 
    'DOCTOR': '/img/professionel/chopper.jpg',
    'GENERAL': '/img/professionel/Hulk.jpg',
    'RADIOLOGIST': '/img/professionel/tsunade.jpg',
    'PEDIATRICIAN': '/img/professionel/tsunade.jpg',
    'PHYSICAL_TRAINER': '/img/professionel/saitama.jpg',
    'DIETITIAN': '/img/professionel/zeno.jpg'
  };
  
  const professionalImage = professionalImages[selectedProfessional.specialty] || '/img/default-avatar.jpg';
  
  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.avatar}>
          <img 
            src={selectedProfessional.user?.photoUrl || professionalImage} 
            alt={selectedProfessional.user ? `${selectedProfessional.user.firstName} ${selectedProfessional.user.lastName}` : 'Professionnel'}
            onError={(e) => {
              e.target.src = '/img/default-avatar.jpg';
            }}
          />
        </div>
        <div className={styles.userInfo}>
          <h3 className={styles.userName}>
            {selectedProfessional.user 
              ? `${selectedProfessional.user.firstName} ${selectedProfessional.user.lastName}`
              : 'Professionnel de santé'}
          </h3>
          <p className={styles.userSpecialty}>
            {formatSpecialty(selectedProfessional.specialty)}
          </p>
        </div>
      </div>
      
      <div className={styles.tabs}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'chat' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          Messages
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'notes' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          Notes & Annotations
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'forum' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('forum')}
        >
          Forum collaboratif
        </button>
      </div>
      
      {activeTab === 'chat' && (
        <>
          <div className={styles.panelBody}>
            {messages.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyStateIcon}>💬</div>
                <h3 className={styles.emptyStateTitle}>Aucun message</h3>
                <p className={styles.emptyStateText}>
                  Commencez la conversation avec ce professionnel
                </p>
              </div>
            ) : (
              groupedMessages.map((group) => (
                <div 
                  key={group.id}
                  className={styles.message}
                >
                  <div className={styles.messageSender}>
                    {group.senderId === 'current-user' ? 'Vous' : `Dr. ${selectedProfessional.user?.firstName || ''} ${selectedProfessional.user?.lastName || ''}`}
                  </div>
                  
                  {group.messages.map((message) => (
                    <div key={message.id} className={`${styles.messageContent} ${group.senderId === 'current-user' ? styles.messageRight : styles.messageLeft}`}>
                      <div className={styles.messageContent}>
                        {message.text}
                      </div>
                      <div className={styles.messageTime}>
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
          
          <div className={styles.inputSection}>
            <input
              type="text"
              className={styles.textInput}
              placeholder="Écrivez un message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button 
              className={styles.actionButton}
              onClick={handleSendMessage}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </>
      )}
      
      {activeTab === 'notes' && (
        <div className={styles.panelBody}>
          <div className={styles.noteForm}>
            <textarea
              className={styles.textInput}
              placeholder="Ajouter une note ou annotation..."
              rows="4"
            />
            <div className={styles.checkboxContainer}>
              <input 
                type="checkbox" 
                id="noteVisibility" 
                className={styles.checkbox}
              />
              <label 
                htmlFor="noteVisibility" 
                className={styles.checkboxLabel}
              >
                Visible pour tous les professionnels
              </label>
            </div>
            <button className={styles.actionButton}>
              Enregistrer
            </button>
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
        <div className={styles.panelBody}>
          {forumTopics.length === 0 ? (
            <div className={styles.createForumCard} onClick={() => setShowCreateForumModal(true)}>
              <div className={styles.createForumIcon}>💬</div>
              <h3 className={styles.createForumTitle}>Créer une nouvelle discussion</h3>
              <p className={styles.createForumText}>
                Démarrez une discussion collaborative avec ce professionnel et d'autres intervenants pour ce patient.
              </p>
            </div>
          ) : selectedForum ? (
            // Vue détaillée d'un forum
            <div className={styles.forumDetailContainer}>
              <button 
                className={styles.backButton}
                onClick={handleBackToForumList}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Retour aux discussions
              </button>
              
              <div className={styles.forumDetailHeader}>
                <h3 className={styles.forumDetailTitle}>
                  {selectedForum.title}
                  <span className={styles.tag}>{selectedForum.type === 'consultation' ? 'Consultation' : 'Discussion'}</span>
                </h3>
                <p className={styles.forumDetailDescription}>{selectedForum.description}</p>
                
                <div className={styles.forumDetailMeta}>
                  <div className={styles.forumDetailParticipants}>
                    <span className={styles.forumDetailMetaLabel}>Participants:</span>
                    <div className={styles.participantAvatars}>
                      {selectedForum.participants.map((participant) => (
                        <div key={participant.id} className={styles.participantAvatar} title={participant.name}>
                          <img 
                            src={participant.photo}
                            alt={participant.name}
                            onError={(e) => {
                              e.target.src = '/img/default-avatar.jpg';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <button className={styles.addParticipantButton}>+</button>
                  </div>
                </div>
              </div>
              
              <div className={styles.forumMessages}>
                {selectedForum.messages.length === 0 ? (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyStateIcon}>💬</div>
                    <h3 className={styles.emptyStateTitle}>Aucun message</h3>
                    <p className={styles.emptyStateText}>
                      Soyez le premier à écrire dans cette discussion
                    </p>
                  </div>
                ) : (
                  selectedForum.messages.map((message) => (
                    <div key={message.id} className={`${styles.forumMessage} ${message.authorId === 'current-user' ? styles.forumMessageRight : styles.forumMessageLeft}`}>
                      <div className={styles.forumMessageHeader}>
                        <span className={styles.forumMessageAuthor}>{message.authorName}</span>
                        <span className={styles.forumMessageTime}>{formatTime(message.timestamp)}</span>
                      </div>
                      <div className={styles.forumMessageContent}>
                        {message.text}
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className={styles.forumInputSection}>
                <input
                  type="text"
                  className={styles.textInput}
                  placeholder="Écrivez un message..."
                  value={forumMessageInput}
                  onChange={(e) => setForumMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendForumMessage()}
                />
                <button 
                  className={styles.actionButton}
                  onClick={handleSendForumMessage}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.forumContainer}>
              <div className={styles.forumSection}>
                <h3 className={styles.forumSectionTitle}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                  </svg>
                  Discussions actives
                </h3>
                
                {forumTopics.map(topic => (
                  <div 
                    key={topic.id} 
                    className={styles.forumCard}
                    onClick={() => handleSelectForum(topic)}
                  >
                    <h4 className={styles.forumCardTitle}>
                      {topic.title}
                      <span className={styles.tag}>{topic.type === 'consultation' ? 'Consultation' : 'Discussion'}</span>
                    </h4>
                    <p className={styles.forumCardDescription}>{topic.description}</p>
                    <div className={styles.forumCardMeta}>
                      <div className={styles.forumCardParticipants}>
                        <div className={styles.participantAvatars}>
                          {topic.participants.slice(0, 3).map((participant, index) => (
                            <div key={participant.id} className={styles.participantAvatar}>
                              <img 
                                src={participant.photo}
                                alt={participant.name}
                                onError={(e) => {
                                  e.target.src = '/img/default-avatar.jpg';
                                }}
                              />
                            </div>
                          ))}
                        </div>
                        {topic.participants.length > 3 && (
                          <span>+{topic.participants.length - 3}</span>
                        )}
                        <span style={{ marginLeft: '0.5rem' }}>
                          {topic.participants.length} participants
                        </span>
                      </div>
                      <div className={styles.forumCardTimestamp}>
                        Dernière activité {formatRelativeTime(topic.lastActivity)}
                      </div>
                    </div>
                  </div>
                ))}
                
                <button 
                  className={styles.actionButton}
                  onClick={() => setShowCreateForumModal(true)}
                  style={{ marginTop: '1rem' }}
                >
                  + Créer une nouvelle discussion
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Modal pour créer un nouveau forum */}
      {showCreateForumModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button 
              className={styles.modalCloseButton}
              onClick={() => setShowCreateForumModal(false)}
            >
              ×
            </button>
            
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Créer une nouvelle discussion</h2>
              <p className={styles.modalSubtitle}>
                Créez un espace d'échange dédié à ce patient
              </p>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="forumTitle" className={styles.formLabel}>Titre de la discussion</label>
              <input
                type="text"
                id="forumTitle"
                className={styles.formInput}
                placeholder="Ex: Suivi nutritionnel post-opératoire"
                value={forumTitle}
                onChange={(e) => setForumTitle(e.target.value)}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="forumDescription" className={styles.formLabel}>Description</label>
              <textarea
                id="forumDescription"
                className={`${styles.formInput} ${styles.formTextarea}`}
                placeholder="Décrivez l'objectif de cette discussion..."
                value={forumDescription}
                onChange={(e) => setForumDescription(e.target.value)}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="forumType" className={styles.formLabel}>Type de discussion</label>
              <select
                id="forumType"
                className={`${styles.formInput} ${styles.formSelect}`}
                value={forumType}
                onChange={(e) => setForumType(e.target.value)}
              >
                <option value="discussion">Discussion générale</option>
                <option value="consultation">Consultation collaborative</option>
                <option value="suivi">Suivi thérapeutique</option>
              </select>
            </div>
            
            <div className={styles.checkboxContainer}>
              <input 
                type="checkbox" 
                id="forumVisibility" 
                className={styles.checkbox}
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              <label 
                htmlFor="forumVisibility" 
                className={styles.checkboxLabel}
              >
                Visible pour tous les professionnels associés à ce patient
              </label>
            </div>
            
            <div className={styles.formActions}>
              <button 
                className={styles.cancelButton}
                onClick={() => setShowCreateForumModal(false)}
              >
                Annuler
              </button>
              <button 
                className={styles.submitButton}
                onClick={handleCreateForum}
              >
                Créer la discussion
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
