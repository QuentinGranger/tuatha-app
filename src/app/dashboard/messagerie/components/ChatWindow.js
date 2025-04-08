'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  FiSend, FiPaperclip, FiMic, FiFile, FiImage, FiX, 
  FiUser, FiMoreVertical, FiChevronLeft, FiCheck,
  FiActivity, FiFileText, FiPause, FiPlayCircle,
  FiCalendar, FiArrowRight, FiClipboard,
  FiArchive, FiClock, FiMessageSquare, FiSquare
} from 'react-icons/fi';
import { useMessageContext } from '@/contexts/MessageContext';
import styles from '../styles/page.module.css';

const ChatWindow = () => {
  const { 
    selectedConversation, 
    handleSendMessage,
    handleSelectConversation,
    toggleWaitingResponse,
    toggleArchived,
    patientTyping
  } = useMessageContext();
  
  // États du composant
  const [messageText, setMessageText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const [showPatientData, setShowPatientData] = useState(false);
  const [error, setError] = useState({ show: false, title: '', message: '' });
  
  // Références
  const messageInputRef = useRef(null);
  const chatBodyRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);

  // Défiler vers le bas lorsque de nouveaux messages arrivent
  useEffect(() => {
    if (chatBodyRef.current && selectedConversation?.messages) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [selectedConversation?.messages]);

  // Nettoyer les ressources lors du démontage
  useEffect(() => {
    return () => {
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
      attachments.forEach(att => {
        if (att.url) {
          URL.revokeObjectURL(att.url);
        }
      });
    };
  }, [audioURL, attachments]);

  // Si aucune conversation n'est sélectionnée, afficher un placeholder
  if (!selectedConversation) {
    return (
      <div className={styles.chatWindowContainer}>
        <div className={styles.chatPlaceholder}>
          <div className={styles.placeholderIcon}>
            <FiMessageSquare />
          </div>
          <h2 className={styles.placeholderTitle}>Bienvenue dans votre messagerie</h2>
          <p className={styles.placeholderText}>
            Sélectionnez une conversation dans la liste ou démarrez une nouvelle discussion pour commencer à communiquer avec vos patients.
          </p>
        </div>
      </div>
    );
  }

  // Pour le débogage
  console.log("Conversation sélectionnée dans ChatWindow:", selectedConversation);
  
  // Déterminer l'avatar à afficher en fonction de l'ID de la conversation
  const getPatientAvatar = () => {
    if (!selectedConversation) return "/img/patient/default-avatar.jpg";
    
    const conversationId = selectedConversation.id;
    switch(conversationId) {
      case 'conv-001': return "/img/patient/batman.jpg";
      case 'conv-002': return "/img/patient/deku.jpg";
      case 'conv-003': return "/img/patient/goku.jpg";
      case 'conv-004': return "/img/patient/ironman.jpg";
      case 'conv-005': return "/img/patient/luffy.jpg";
      default: return "/img/patient/default-avatar.jpg";
    }
  };
  
  // Déterminer le nom du patient en fonction de l'ID de la conversation
  const getPatientName = () => {
    if (!selectedConversation) return "Patient";
    
    const conversationId = selectedConversation.id;
    switch(conversationId) {
      case 'conv-001': return "Bruce Wayne";
      case 'conv-002': return "Izuku Midoriya";
      case 'conv-003': return "Son Goku";
      case 'conv-004': return "Tony Stark";
      case 'conv-005': return "Monkey D. Luffy";
      default: return selectedConversation.userName || "Patient";
    }
  };
  
  // Formater les messages par date
  const formatMessagesWithDateSeparators = (messages) => {
    if (!messages || messages.length === 0) return [];
    
    const result = [];
    let currentDate = null;
    
    messages.forEach(message => {
      const messageDate = new Date(message.timestamp).toLocaleDateString();
      
      if (messageDate !== currentDate) {
        currentDate = messageDate;
        result.push({ type: 'date', date: messageDate, id: `date-${messageDate}` });
      }
      
      result.push({ type: 'message', ...message });
    });
    
    return result;
  };

  // Obtenir les messages spécifiques à la conversation sélectionnée
  const getMessagesForConversation = () => {
    if (!selectedConversation) return [];
    
    const conversationId = selectedConversation.id;
    
    // Messages pour chaque superhéros
    switch(conversationId) {
      case 'conv-001': // Bruce Wayne (Batman)
        return [
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
        ];
      
      case 'conv-002': // Izuku Midoriya (Deku)
        return [
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
        ];
      
      case 'conv-003': // Son Goku
        return [
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
        ];
      
      case 'conv-004': // Tony Stark (Iron Man)
        return [
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
        ];
      
      case 'conv-005': // Monkey D. Luffy
        return [
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
        ];
      
      default:
        // Si l'ID n'est pas reconnu, renvoyer un message par défaut
        return [
          {
            id: 'default-msg-001',
            senderId: 'nutritionist',
            receiverId: 'patient',
            content: "Bonjour, comment puis-je vous aider aujourd'hui ?",
            timestamp: new Date().toISOString(),
            read: true
          }
        ];
    }
  };
  
  // Récupérer les messages pour cette conversation
  const conversationMessages = getMessagesForConversation();
  
  // Vérifier si le patient a un avatar valide
  const patientAvatar = getPatientAvatar();
  const patientName = getPatientName();
  
  // Préparation des données pour l'affichage
  const formattedMessages = formatMessagesWithDateSeparators(conversationMessages);
  const patient = selectedConversation?.patient;

  // Envoi d'un message
  const sendMessage = () => {
    if (messageText.trim() || attachments.length > 0 || audioURL) {
      // Créer l'objet message
      const newMessage = {
        text: messageText.trim(),
        attachments: [...attachments],
        audio: audioURL
      };
      
      // Envoyer via le contexte
      handleSendMessage(selectedConversation.id, newMessage);
      
      // Réinitialiser les champs
      setMessageText('');
      setAttachments([]);
      setAudioURL('');
      setIsRecording(false);
      setRecordingTime(0);
      setIsAttachmentMenuOpen(false);
      
      // Focus sur l'input
      messageInputRef.current?.focus();
    }
  };

  // Gérer l'appui sur Entrée
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Formatage du temps d'enregistrement (secondes -> MM:SS)
  const formatRecordingTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Démarrer l'enregistrement audio
  const startRecording = async () => {
    try {
      // Vérifier si le navigateur supporte l'API MediaDevices
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Votre navigateur ne supporte pas l\'enregistrement audio');
      }
      
      // Demander l'accès au microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Créer le MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      // Écouter les données enregistrées
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      // Finaliser l'enregistrement
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        setIsRecording(false);
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      };
      
      // Démarrer l'enregistrement
      mediaRecorder.start();
      setIsRecording(true);
      
      // Démarrer le timer
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Erreur lors de l\'accès au microphone:', error);
      
      let errorMessage = 'Impossible d\'accéder au microphone.';
      
      // Déterminer le type d'erreur pour donner des instructions spécifiques
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = 'Accès au microphone refusé. Vous devez autoriser l\'accès au microphone dans les paramètres de votre navigateur.';
        
        // Instructions spécifiques selon le navigateur
        const browser = detectBrowser();
        if (browser === 'chrome') {
          errorMessage += '\n\nPour activer dans Chrome :\n1. Cliquez sur l\'icône 🔒 dans la barre d\'adresse\n2. Sélectionnez "Paramètres du site"\n3. Activez l\'option "Microphone"';
        } else if (browser === 'firefox') {
          errorMessage += '\n\nPour activer dans Firefox :\n1. Cliquez sur l\'icône 🔒 dans la barre d\'adresse\n2. Cliquez sur "Supprimer les exceptions"\n3. Rechargez la page';
        } else if (browser === 'safari') {
          errorMessage += '\n\nPour activer dans Safari :\n1. Ouvrez Préférences > Sites Web > Microphone\n2. Autorisez ce site';
        }
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage = 'Aucun microphone détecté. Veuillez connecter un microphone et réessayer.';
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        errorMessage = 'Impossible d\'accéder au microphone. Il est peut-être utilisé par une autre application.';
      } else if (error.message === 'Votre navigateur ne supporte pas l\'enregistrement audio') {
        errorMessage = 'Votre navigateur ne supporte pas l\'enregistrement audio. Veuillez utiliser Chrome, Firefox, ou Safari à jour.';
      }
      
      // Afficher un message d'erreur plus détaillé
      setError({
        show: true,
        title: 'Problème d\'accès au microphone',
        message: errorMessage
      });
    }
  };
  
  // Fonction pour détecter le navigateur
  const detectBrowser = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf('chrome') > -1) return 'chrome';
    if (userAgent.indexOf('firefox') > -1) return 'firefox';
    if (userAgent.indexOf('safari') > -1) return 'safari';
    if (userAgent.indexOf('edge') > -1) return 'edge';
    return 'unknown';
  };

  // Arrêter l'enregistrement
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };
  
  // Annuler l'enregistrement
  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setRecordingTime(0);
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };
  
  // Ouvrir le sélecteur de fichier
  const openFileSelector = () => {
    fileInputRef.current?.click();
  };
  
  // Ouvrir le sélecteur d'image
  const openImageSelector = () => {
    imageInputRef.current?.click();
  };
  
  // Gérer la sélection de fichier
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    // Créer des objets d'attachement
    const newAttachments = files.map(file => ({
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file)
    }));
    
    setAttachments(prev => [...prev, ...newAttachments]);
    setIsAttachmentMenuOpen(false);
    e.target.value = ''; // Réinitialiser l'input
  };
  
  // Supprimer une pièce jointe
  const removeAttachment = (attachmentId) => {
    setAttachments(prev => {
      const updated = prev.filter(att => att.id !== attachmentId);
      
      // Libérer les URL
      const removedAtt = prev.find(att => att.id === attachmentId);
      if (removedAtt?.url) {
        URL.revokeObjectURL(removedAtt.url);
      }
      
      return updated;
    });
  };
  
  // Supprimer l'audio enregistré
  const removeAudio = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
      setAudioURL('');
    }
  };
  
  // Réponses rapides prédéfinies
  const quickReplies = [
    "Merci pour votre message, je l'ai bien reçu.",
    "Je vais examiner votre demande et reviens vers vous rapidement.",
    "Pourriez-vous me préciser davantage vos symptômes ?",
    "Je vous invite à prendre rendez-vous pour en discuter plus en détail.",
    "N'hésitez pas à m'envoyer votre journal alimentaire pour la semaine.",
    "Votre progression est excellente, continuez ainsi !"
  ];
  
  // Utiliser une réponse rapide
  const useQuickReply = (reply) => {
    setMessageText(reply);
    setShowQuickReplies(false);
    messageInputRef.current?.focus();
  };
  
  // Formatage de la taille des fichiers
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Formater le nom du fichier (raccourcir si trop long)
  const formatFileName = (name, maxLength = 20) => {
    if (name.length <= maxLength) return name;
    
    const extension = name.split('.').pop();
    const baseName = name.substring(0, name.length - extension.length - 1);
    
    if (baseName.length <= maxLength - 3 - extension.length) return name;
    
    return `${baseName.substring(0, maxLength - 3 - extension.length)}...${extension}`;
  };

  // Recommandations rapides pour le patient
  const patientRecommendations = [
    {
      title: "Alimentation",
      icon: <FiFileText />,
      action: () => useQuickReply("Je vous recommande d'augmenter votre apport en protéines de 10%. Voici un exemple de menu adapté à vos besoins.")
    },
    {
      title: "Prochain RDV",
      icon: <FiCalendar />,
      action: () => useQuickReply("Souhaiteriez-vous fixer notre prochain rendez-vous? Je suis disponible les jours suivants: ...")
    },
    {
      title: "Suivi progression",
      icon: <FiActivity />,
      action: () => useQuickReply("Votre dernière analyse montre une amélioration de vos marqueurs métaboliques. Continuez ainsi!")
    },
    {
      title: "Bilan",
      icon: <FiClipboard />,
      action: () => useQuickReply("Suite à notre dernier échange, voici le bilan que je vous propose:")
    }
  ];

  // Fermer le message d'erreur
  const closeError = () => setError({ ...error, show: false });

  return (
    <div className={styles.chatWindowContainer}>
      {/* En-tête de la conversation */}
      <div className={styles.chatHeader}>
        <div className={styles.chatPatientInfo}>
          <button 
            className={styles.backButton} 
            onClick={() => handleSelectConversation(null)}
            aria-label="Retour"
          >
            <FiChevronLeft />
          </button>
          <div className={styles.chatPatientAvatar}>
            <img
              src={patientAvatar}
              alt={patientName}
              width={40}
              height={40}
              className={styles.avatarImage}
              onError={(e) => {
                console.error('Error loading patient avatar:', e);
                e.target.src = '/img/patient/default-avatar.jpg';
              }}
            />
          </div>
          <div className={styles.chatPatientDetails}>
            <h3 className={styles.chatPatientName}>{patientName}</h3>
            <span className={styles.chatPatientStatus}>{selectedConversation?.email || ''}</span>
          </div>
        </div>
        <div className={styles.chatHeaderActions}>
          <button 
            className={styles.chatActionButton}
            onClick={() => setShowPatientData(!showPatientData)}
            aria-label="Voir dossier patient"
          >
            <FiUser />
            <span>Dossier</span>
          </button>
          <button 
            className={`${styles.chatActionButton} ${selectedConversation.waitingResponse ? styles.active : ''}`}
            onClick={() => toggleWaitingResponse(selectedConversation.id)}
            aria-label={selectedConversation.waitingResponse ? "Marquer comme traité" : "Marquer en attente"}
          >
            {selectedConversation.waitingResponse ? <FiCheck /> : <FiClock />}
            <span>{selectedConversation.waitingResponse ? "Traité" : "En attente"}</span>
          </button>
          <button 
            className={`${styles.chatActionButton} ${selectedConversation.archived ? styles.archiveButton : ''}`}
            onClick={() => toggleArchived(selectedConversation.id)}
            aria-label={selectedConversation.archived ? "Désarchiver" : "Archiver"}
          >
            <FiArchive />
            <span>{selectedConversation.archived ? "Désarchiver" : "Archiver"}</span>
          </button>
        </div>
      </div>
      
      {/* Corps du chat */}
      <div className={styles.chatBody} ref={chatBodyRef}>
        {formattedMessages.map((item, index) => {
          if (item.type === 'date') {
            // Séparateur de date
            return (
              <div key={item.id} className={styles.dateSeparator}>
                <div className={styles.dateLine} />
                <span className={styles.dateText}>{item.date}</span>
                <div className={styles.dateLine} />
              </div>
            );
          } else {
            // Message
            const isReceived = item.senderId !== 'nutritionist';
            const showRead = !isReceived && item.read;
            
            return (
              <div 
                key={item.id || item.timestamp} 
                className={`${styles.messageContainer} ${isReceived ? styles.receivedMessage : styles.sentMessage}`}
              >
                {isReceived && (
                  <div className={styles.messageAvatar}>
                    <img
                      src={patientAvatar}
                      alt={patientName}
                      width={30}
                      height={30}
                      className={styles.messageBubbleAvatar}
                      onError={(e) => {
                        console.error('Error loading message avatar:', e);
                        e.target.src = '/img/patient/default-avatar.jpg';
                      }}
                    />
                  </div>
                )}
                
                <div className={styles.messageContent}>
                  {/* Bulle de message avec texte */}
                  {item.content && (
                    <div className={styles.message}>
                      <p>{item.content}</p>
                      <div className={styles.messageTime}>
                        <span>{new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        {showRead && <FiCheck className={styles.readIcon} />}
                      </div>
                    </div>
                  )}
                  
                  {/* Pièces jointes */}
                  {item.attachments && item.attachments.length > 0 && (
                    <div className={styles.messageAttachments}>
                      {item.attachments.map(att => (
                        <div key={att.id} className={styles.attachmentItem}>
                          {att.type.startsWith('image/') ? (
                            <div className={styles.imageAttachment}>
                              <img 
                                src={att.url} 
                                alt={att.name} 
                                width={200} 
                                height={150} 
                                className={styles.attachmentImage}
                              />
                              <div className={styles.attachmentOverlay}>
                                <span>{att.name}</span>
                              </div>
                            </div>
                          ) : (
                            <div className={styles.fileAttachment}>
                              <FiFile className={styles.fileIcon} />
                              <div className={styles.fileInfo}>
                                <span className={styles.fileName}>{formatFileName(att.name)}</span>
                                <span className={styles.fileSize}>{formatFileSize(att.size)}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Audio */}
                  {item.audio && (
                    <div className={styles.audioMessage}>
                      <audio src={item.audio} controls className={styles.audioPlayer} />
                    </div>
                  )}
                </div>
              </div>
            );
          }
        })}
        
        {/* Indicateur de frappe */}
        {patientTyping === selectedConversation.id && (
          <div className={styles.typingIndicator}>
            <div className={styles.typingDot}></div>
            <div className={styles.typingDot}></div>
            <div className={styles.typingDot}></div>
          </div>
        )}
      </div>
      
      {/* Recommandations rapides */}
      {!selectedConversation.archived && (
        <div className={styles.recommendationsPanel}>
          <h4 className={styles.recommendationsTitle}>Recommandations</h4>
          <div className={styles.recommendationsList}>
            {patientRecommendations.map((rec, index) => (
              <button key={index} className={styles.recommendationButton} onClick={rec.action}>
                {rec.icon}
                <span>{rec.title}</span>
                <FiArrowRight className={styles.recommendationArrow} />
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Zone de saisie */}
      {!selectedConversation.archived && (
        <div className={styles.chatInputArea}>
          {/* Affichage des pièces jointes en cours */}
          {(attachments.length > 0 || audioURL) && (
            <div className={styles.currentAttachments}>
              {/* Pièces jointes de fichiers */}
              {attachments.map(att => (
                <div key={att.id} className={styles.attachmentPreview}>
                  {att.type.startsWith('image/') ? (
                    <div className={styles.imagePreview}>
                      <img src={att.url} alt={att.name} width={60} height={60} className={styles.previewImage} />
                    </div>
                  ) : (
                    <div className={styles.filePreview}>
                      <FiFile className={styles.previewFileIcon} />
                    </div>
                  )}
                  <span className={styles.attachmentName}>{formatFileName(att.name, 15)}</span>
                  <button 
                    className={styles.removeAttachmentButton} 
                    onClick={() => removeAttachment(att.id)}
                    aria-label="Supprimer la pièce jointe"
                  >
                    <FiX />
                  </button>
                </div>
              ))}
              
              {/* Audio enregistré */}
              {audioURL && (
                <div className={styles.audioPreview}>
                  <audio src={audioURL} controls className={styles.previewAudio} />
                  <button 
                    className={styles.removeAudioButton} 
                    onClick={removeAudio}
                    aria-label="Supprimer l'enregistrement audio"
                  >
                    <FiX />
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* Interface d'enregistrement */}
          {isRecording ? (
            <div className={styles.recordingInterface}>
              <div className={styles.recordingInfo}>
                <div className={styles.recordingIndicator}>
                  <div className={styles.recordingPulse} />
                </div>
                <span className={styles.recordingTime}>{formatRecordingTime(recordingTime)}</span>
              </div>
              <div className={styles.recordingControls}>
                <button 
                  className={styles.recordingStopButton} 
                  onClick={stopRecording}
                  aria-label="Arrêter l'enregistrement"
                >
                  <FiSquare />
                </button>
                <button 
                  className={styles.recordingCancelButton} 
                  onClick={cancelRecording}
                  aria-label="Annuler l'enregistrement"
                >
                  <FiX />
                </button>
              </div>
            </div>
          ) : (
            /* Interface de saisie normale */
            <div className={styles.inputInterface}>
              {/* Menu des pièces jointes */}
              {isAttachmentMenuOpen && (
                <div className={styles.attachmentMenu}>
                  <button 
                    className={styles.attachmentOption} 
                    onClick={openFileSelector}
                    aria-label="Joindre un fichier"
                  >
                    <FiFile />
                    <span>Fichier</span>
                  </button>
                  <button 
                    className={styles.attachmentOption} 
                    onClick={openImageSelector}
                    aria-label="Joindre une image"
                  >
                    <FiImage />
                    <span>Image</span>
                  </button>
                </div>
              )}
              
              {/* Bouton des pièces jointes */}
              <button 
                className={`${styles.attachButton} ${isAttachmentMenuOpen ? styles.active : ''}`} 
                onClick={() => setIsAttachmentMenuOpen(!isAttachmentMenuOpen)}
                aria-label="Ajouter une pièce jointe"
              >
                <FiPaperclip />
              </button>
              
              {/* Champ de saisie */}
              <div className={styles.inputWrapper}>
                <textarea
                  ref={messageInputRef}
                  className={styles.messageInput}
                  placeholder="Écrivez votre message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                
                {/* Réponses rapides */}
                {showQuickReplies && (
                  <div className={styles.quickRepliesMenu}>
                    {quickReplies.map((reply, index) => (
                      <button 
                        key={index} 
                        className={styles.quickReply}
                        onClick={() => useQuickReply(reply)}
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Bouton de réponses rapides */}
                <button 
                  className={`${styles.quickRepliesButton} ${showQuickReplies ? styles.active : ''}`}
                  onClick={() => setShowQuickReplies(!showQuickReplies)}
                  aria-label="Réponses rapides"
                >
                  <FiMessageSquare />
                </button>
              </div>
              
              {/* Bouton d'enregistrement */}
              <button 
                className={styles.recordButton} 
                onClick={startRecording}
                aria-label="Enregistrer un message audio"
              >
                <FiMic />
              </button>
              
              {/* Bouton d'envoi */}
              <button 
                className={styles.sendButton} 
                onClick={sendMessage}
                disabled={!messageText.trim() && attachments.length === 0 && !audioURL}
                aria-label="Envoyer le message"
              >
                <FiSend />
              </button>
            </div>
          )}
          
          {/* Inputs masqués pour les fichiers */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileSelect}
            multiple
          />
          <input
            type="file"
            ref={imageInputRef}
            style={{ display: 'none' }}
            onChange={handleFileSelect}
            accept="image/*"
            multiple
          />
        </div>
      )}
      
      {/* Modal d'erreur pour les permissions */}
      {error.show && (
        <div className={styles.errorModal}>
          <div className={styles.errorModalContent}>
            <div className={styles.errorModalHeader}>
              <h3>{error.title}</h3>
              <button onClick={closeError} className={styles.closeButton}>
                <FiX />
              </button>
            </div>
            <div className={styles.errorModalBody}>
              <div className={styles.errorIcon}>
                <FiMic />
              </div>
              <p className={styles.errorMessage}>{error.message}</p>
            </div>
            <div className={styles.errorModalFooter}>
              <button onClick={closeError} className={styles.errorButton}>
                Compris
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
