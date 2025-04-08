'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import aiService from '../services/aiService';
import prisma from '@/lib/prisma'; // Import du mock prisma

// Créer le contexte des messages
const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [allPatients, setAllPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [patientTyping, setPatientTyping] = useState(null);

  // Récupérer les patients superhéros depuis le mock Prisma
  const superheroPatients = [
    { 
      id: 'pat-001',
      name: 'Bruce Wayne',
      email: 'batman@wayne-enterprises.com',
      avatar: '/img/patient/batman.jpg',
      lastVisit: '2025-02-05',
      user: {
        firstName: 'Bruce',
        lastName: 'Wayne',
        photoUrl: '/img/patient/batman.jpg'
      }
    },
    { 
      id: 'pat-002',
      name: 'Izuku Midoriya',
      email: 'deku@ua.edu',
      avatar: '/img/patient/deku.jpg',
      lastVisit: '2025-02-04',
      user: {
        firstName: 'Izuku',
        lastName: 'Midoriya',
        photoUrl: '/img/patient/deku.jpg'
      }
    },
    { 
      id: 'pat-003',
      name: 'Son Goku',
      email: 'goku@capsule-corp.com',
      avatar: '/img/patient/goku.jpg',
      lastVisit: '2025-02-03',
      user: {
        firstName: 'Son',
        lastName: 'Goku',
        photoUrl: '/img/patient/goku.jpg'
      }
    },
    { 
      id: 'pat-004',
      name: 'Tony Stark',
      email: 'tony@stark-industries.com',
      avatar: '/img/patient/ironman.jpg',
      lastVisit: '2025-02-02',
      user: {
        firstName: 'Tony',
        lastName: 'Stark',
        photoUrl: '/img/patient/ironman.jpg'
      }
    },
    { 
      id: 'pat-005',
      name: 'Monkey D. Luffy',
      email: 'luffy@thousand-sunny.com',
      avatar: '/img/patient/luffy.jpg',
      lastVisit: '2025-02-01',
      user: {
        firstName: 'Monkey D.',
        lastName: 'Luffy',
        photoUrl: '/img/patient/luffy.jpg'
      }
    },
    { 
      id: 'pat-006',
      name: 'Naruto Uzumaki',
      email: 'naruto@konoha.gov',
      avatar: '/img/patient/naruto.jpg',
      lastVisit: '2025-01-31',
      user: {
        firstName: 'Naruto',
        lastName: 'Uzumaki',
        photoUrl: '/img/patient/naruto.jpg'
      }
    },
    { 
      id: 'pat-007',
      name: 'Saitama',
      email: 'saitama@hero-association.org',
      avatar: '/img/patient/saitama.jpg',
      lastVisit: '2025-01-30',
      user: {
        firstName: 'Saitama',
        lastName: '',
        photoUrl: '/img/patient/saitama.jpg'
      }
    }
  ];

  // Fonction utilitaire pour obtenir l'URL de l'avatar
  const getAvatarUrl = (patient) => {
    // Si patient est null ou undefined, retourner l'avatar par défaut
    if (!patient) {
      console.log("Patient null, utilisation de l'avatar par défaut");
      return '/img/patient/default-avatar.jpg';
    }
    
    console.log("Génération d'URL d'avatar pour:", patient);
    
    // Vérifier la propriété avatar (utilisée dans le mock)
    if (patient.avatar) {
      // Vérifier si le chemin commence déjà par /img/patient/ pour éviter la duplication
      if (patient.avatar.startsWith('/img/patient/')) {
        console.log("Avatar path (from patient.avatar, path complet):", patient.avatar);
        return patient.avatar;
      } else {
        const avatarPath = `/img/patient/${patient.avatar.replace(/^\//, '')}`;
        console.log("Avatar path (from patient.avatar, path généré):", avatarPath);
        return avatarPath;
      }
    }
    
    // Vérifier la propriété photoUrl (utilisée dans certaines implémentations)
    if (patient.photoUrl) {
      // Éviter la duplication de /img/patient/
      if (patient.photoUrl.startsWith('/img/patient/')) {
        console.log("Avatar path (from patient.photoUrl, path complet):", patient.photoUrl);
        return patient.photoUrl;
      } else {
        const photoPath = `/img/patient/${patient.photoUrl.replace(/^\//, '')}`;
        console.log("Avatar path (from patient.photoUrl, path généré):", photoPath);
        return photoPath;
      }
    }
    
    // Vérifier si le patient a un objet user avec photoUrl
    if (patient.user && patient.user.photoUrl) {
      // Éviter la duplication de /img/patient/
      if (patient.user.photoUrl.startsWith('/img/patient/')) {
        console.log("Avatar path (from patient.user.photoUrl, path complet):", patient.user.photoUrl);
        return patient.user.photoUrl;
      } else {
        const userPhotoPath = `/img/patient/${patient.user.photoUrl.replace(/^\//, '')}`;
        console.log("Avatar path (from patient.user.photoUrl, path généré):", userPhotoPath);
        return userPhotoPath;
      }
    }
    
    // Fallback sur l'avatar par défaut
    console.log("Aucun avatar trouvé, utilisation de l'avatar par défaut");
    return '/img/patient/default-avatar.jpg';
  };

  // Initialiser allPatients à partir des patients superhéros au démarrage
  useEffect(() => {
    setIsLoading(true);
    
    // Générer des avatarUrl pour tous les patients superhéros
    const patientsWithAvatars = superheroPatients.map(patient => ({
      ...patient,
      avatarUrl: getAvatarUrl(patient)
    }));
    
    setAllPatients(patientsWithAvatars);
    console.log("Patients superhéros initialisés avec avatars:", patientsWithAvatars);
    
    setIsLoading(false);
  }, []);

  // Charger les conversations depuis l'API ou des données de démo
  useEffect(() => {
    console.log("Chargement des conversations...");
    // Si des conversations sont déjà stockées, les charger
    let storedConversations = localStorage.getItem('conversations');
    
    // Pour le débogage, on va supprimer les données stockées et recréer les conversations
    console.log("⚠️ Suppression des conversations stockées pour forcer la création de nouvelles conversations");
    localStorage.removeItem('conversations');
    storedConversations = null;
    
    // Fonction pour trouver un patient par ID dans notre liste de patients
    const findPatientById = (patientId) => {
      // Chercher dans les superheroPatients
      const patient = superheroPatients.find(p => p.id === patientId);
      console.log(`Recherche du patient avec l'ID ${patientId}:`, patient || 'Non trouvé');
      return patient || null;
    };
    
    if (!storedConversations) {
      // Créer des conversations pour les patients superhéros
      console.log("Création de nouvelles conversations avec les superhéros:", superheroPatients.map(p => p.id));
      
      // Les messages thématiques pour chaque superhéros
      const superheroMessages = {
        'pat-001': [
          { id: 'msg1', text: "J'ai besoin d'un nouveau régime pour mes patrouilles nocturnes", sender: 'patient', timestamp: new Date(2025, 3, 1, 14, 30).toISOString() },
          { id: 'msg2', text: "Bonjour Bruce, bien sûr. Je vous recommande un régime riche en protéines et en antioxydants pour maintenir votre force et récupérer rapidement.", sender: 'professional', timestamp: new Date(2025, 3, 1, 14, 35).toISOString() },
          { id: 'msg3', text: "Et que pensez-vous des compléments alimentaires pour mes fractures récurrentes ?", sender: 'patient', timestamp: new Date(2025, 3, 1, 14, 40).toISOString() }
        ],
        'pat-002': [
          { id: 'msg1', text: "Est-ce que mon nouveau régime convient à One For All ?", sender: 'patient', timestamp: new Date(2025, 3, 1, 10, 15).toISOString() },
          { id: 'msg2', text: "Bonjour Izuku. Oui, mais j'aimerais augmenter votre apport calorique pour soutenir la charge de votre quirk.", sender: 'professional', timestamp: new Date(2025, 3, 1, 10, 20).toISOString() }
        ],
        'pat-003': [
          { id: 'msg1', text: "J'ai besoin de plus de calories pour mon combat contre Vegeta", sender: 'patient', timestamp: new Date(2025, 2, 29, 9, 0).toISOString() },
          { id: 'msg2', text: "Bonjour Son Goku. Je vais vous proposer un plan nutritionnel spécial Super Saiyan avec 10 000 calories par jour.", sender: 'professional', timestamp: new Date(2025, 2, 29, 9, 5).toISOString() },
          { id: 'msg3', text: "Parfait ! Est-ce que je peux toujours manger autant de riz ?", sender: 'patient', timestamp: new Date(2025, 2, 29, 9, 10).toISOString() },
          { id: 'msg4', text: "Oui, mais essayez d'équilibrer avec plus de protéines et de légumes.", sender: 'professional', timestamp: new Date(2025, 2, 29, 9, 15).toISOString() }
        ],
        'pat-004': [
          { id: 'msg1', text: "Ce complément alimentaire me donne des palpitations", sender: 'patient', timestamp: new Date(2025, 2, 24, 16, 45).toISOString() },
          { id: 'msg2', text: "Bonjour Tony. C'est probablement dû à l'interaction avec votre réacteur ARK. Je vous recommande d'arrêter immédiatement ce complément.", sender: 'professional', timestamp: new Date(2025, 2, 24, 16, 50).toISOString() }
        ],
        'pat-005': [
          { id: 'msg1', text: "J'ai encore besoin de plus de viande !", sender: 'patient', timestamp: new Date(2025, 2, 23, 12, 0).toISOString() },
          { id: 'msg2', text: "Bonjour Luffy. Je comprends votre besoin, mais essayons d'équilibrer votre alimentation avec d'autres nutriments essentiels.", sender: 'professional', timestamp: new Date(2025, 2, 23, 12, 5).toISOString() }
        ],
        'pat-006': [
          { id: 'msg1', text: "Est-ce que je peux avoir des ramens dans mon régime ?", sender: 'patient', timestamp: new Date(2025, 2, 21, 19, 30).toISOString() },
          { id: 'msg2', text: "Bonjour Naruto. Oui, mais en quantité modérée. Je vous suggère des ramens enrichis en légumes et protéines maigres.", sender: 'professional', timestamp: new Date(2025, 2, 21, 19, 35).toISOString() }
        ],
        'pat-007': [
          { id: 'msg1', text: "Je m'ennuie quand je termine mes adversaires en un coup. Des conseils pour m'amuser plus longtemps ?", sender: 'patient', timestamp: new Date(2025, 2, 20, 15, 0).toISOString() },
          { id: 'msg2', text: "Bonjour Saitama. Avez-vous envisagé de vous imposer des limites ? Peut-être n'utiliser qu'un doigt ?", sender: 'professional', timestamp: new Date(2025, 2, 20, 15, 5).toISOString() }
        ],
      };
      
      // Créer une conversation pour chaque patient superhéro
      const initialConversations = superheroPatients.map(patient => {
        const patientName = `${patient.user.firstName} ${patient.user.lastName}`.trim();
        const messages = superheroMessages[patient.id] || [];
        
        return {
          id: `conv-${patient.id}`,
          patient: patient,
          patientId: patient.id,
          patientName: patientName,
          patientAvatar: getAvatarUrl(patient),
          unreadCount: Math.floor(Math.random() * 3),
          lastMessageDate: messages.length > 0 ? new Date(messages[messages.length - 1].timestamp) : new Date(),
          lastMessage: messages.length > 0 ? messages[messages.length - 1].text : "Aucun message",
          messages: messages,
          isArchived: false,
          isWaitingResponse: false
        };
      });

      console.log("Initial conversations:", initialConversations);
      
      // Ajouter les URLs d'avatar générées pour chaque patient dans les conversations
      const processedConversations = initialConversations.map(conv => {
        // Trouver le patient correspondant à cette conversation
        const patient = findPatientById(conv.patientId);
        
        // Si le patient est trouvé, ajouter ses détails à la conversation
        if (patient) {
          // S'assurer que le patient a une URL d'avatar générée correctement
          const patientWithAvatar = {
            ...patient,
            avatarUrl: getAvatarUrl(patient)
          };
          
          return {
            ...conv,
            patient: patientWithAvatar
          };
        }
        
        // Si le patient n'est pas trouvé, retourner la conversation sans modifier
        return conv;
      });
      
      console.log("Processed conversations with avatars:", processedConversations);
      
      // Filtrer les conversations sans patient valide pour éviter les erreurs
      const validConversations = processedConversations.filter(conv => {
        const hasPatient = !!conv.patient;
        if (!hasPatient) {
          console.warn(`Conversation sans patient valide trouvée:`, conv);
        }
        return hasPatient;
      });
      
      if (validConversations.length !== processedConversations.length) {
        console.warn(`${processedConversations.length - validConversations.length} conversation(s) sans patient valide ont été filtrées`);
      }
      
      setConversations(validConversations);
      localStorage.setItem('conversations', JSON.stringify(initialConversations));
    } else {
      // Charger les conversations depuis localStorage
      try {
        const parsedConversations = JSON.parse(storedConversations);
        
        console.log("Parsed conversations from localStorage:", parsedConversations);
        
        // Reconstruire les objets date à partir des chaînes ISO
        const processedConversations = parsedConversations.map(conv => {
          // Trouver le patient correspondant pour cette conversation
          const patient = findPatientById(conv.patientId);
          
          return {
            ...conv,
            lastMessageDate: new Date(conv.lastMessageDate),
            messages: conv.messages.map(msg => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            })),
            // Ajouter l'objet patient avec son URL d'avatar
            patient: patient ? {
              ...patient,
              avatarUrl: getAvatarUrl(patient)
            } : null
          };
        });
        
        console.log("Processed conversations with patients and avatars:", processedConversations);
        
        // Filtrer les conversations sans patient valide pour éviter les erreurs
        const validConversations = processedConversations.filter(conv => {
          const hasPatient = !!conv.patient;
          if (!hasPatient) {
            console.warn(`Conversation sans patient valide trouvée:`, conv);
          }
          return hasPatient;
        });
        
        if (validConversations.length !== processedConversations.length) {
          console.warn(`${processedConversations.length - validConversations.length} conversation(s) sans patient valide ont été filtrées`);
        }
        
        setConversations(validConversations);
      } catch (error) {
        console.error('Erreur lors du chargement des conversations:', error);
        // En cas d'erreur, réinitialiser les conversations
        localStorage.removeItem('conversations');
      }
    }
    
  }, []); // Revenir à un tableau de dépendances vide pour éviter les erreurs

  // Mise à jour de la conversation sélectionnée quand la liste des conversations change
  useEffect(() => {
    // Si une conversation est sélectionnée, mettre à jour la référence
    if (selectedConversation) {
      const updatedSelectedConversation = conversations.find(
        conv => conv.id === selectedConversation.id
      );
      
      if (updatedSelectedConversation) {
        setSelectedConversation(updatedSelectedConversation);
      }
    }
  }, [conversations]);

  // Fonction utilitaire pour obtenir l'heure actuelle dans un format affichable
  const getCurrentTimeString = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  // Fonction pour sélectionner une conversation
  const handleSelectConversation = (conversation) => {
    // Accepter soit un ID de conversation, soit un objet conversation complet
    if (typeof conversation === 'string') {
      const foundConversation = conversations.find(conv => conv.id === conversation);
      setSelectedConversation(foundConversation || null);
    } else {
      // Si c'est déjà un objet conversation, l'utiliser directement
      setSelectedConversation(conversation);
      
      // Si la conversation n'a pas de messages, initialiser un tableau vide
      if (conversation && !conversation.messages) {
        setSelectedConversation({
          ...conversation,
          messages: []
        });
      }
    }
  };

  // Fonction pour l'envoi de messages et la génération de réponses
  const handleSendMessage = (conversationId, newMessage) => {
    console.log("Message envoyé:", newMessage?.text ? newMessage.text.substring(0, 50) : "Pièce jointe ou audio uniquement");
    const now = Date.now();
    
    // Créer le message à ajouter à la conversation
    const messageToAdd = {
      id: `msg-${now}`,
      senderId: 'nutritionist',
      receiverId: 'patient',
      content: newMessage.text || '',
      timestamp: new Date().toISOString(),
      attachments: newMessage.attachments || [],
      audio: newMessage.audio || null,
      read: true
    };
    
    console.log("Message formaté pour ajout:", messageToAdd);
    
    setConversations(prevConversations => {
      const updated = prevConversations.map(conv => {
        if (conv.id === conversationId) {
          // Ajouter le message à la conversation
          const updatedMessages = [...conv.messages, messageToAdd];
          console.log(`Conversation ${conversationId}: Ajout du message, nouveau total: ${updatedMessages.length}`);
          
          // Déterminer s'il faut simuler une réponse du patient
          const shouldWaitForPatient = conv.patientEmail ? true : false;
          
          // Obtenir la conversation mise à jour
          const updatedConv = {
            ...conv,
            lastMessage: messageToAdd.content,
            lastMessageDate: getCurrentTimeString(),
            messages: updatedMessages,
            waitingResponse: shouldWaitForPatient,
            refreshFlag: now // Ajouter un flag pour forcer le rafraîchissement
          };
          
          // Si cette conversation est la conversation sélectionnée, mettre à jour la référence
          if (selectedConversation && selectedConversation.id === conversationId) {
            setTimeout(() => {
              console.log("Mise à jour de la conversation sélectionnée");
              setSelectedConversation(updatedConv);
            }, 0);
          }
          
          // Si le message est destiné à un patient, simuler une réponse
          if (shouldWaitForPatient) {
            console.log(`Simulation de réponse du patient: ${conv.patientEmail}`);
            
            // Afficher l'indicateur de frappe du patient après un court délai
            setTimeout(() => {
              setPatientTyping({
                conversationId,
                isTyping: true
              });
            }, 500);
            
            // Calculer un délai pour la réponse (entre 3 et 6 secondes)
            const responseDelay = Math.floor(Math.random() * 3000) + 3000;
            
            // Générer une réponse après le délai
            setTimeout(() => {
              // Masquer l'indicateur de frappe
              setPatientTyping({
                conversationId,
                isTyping: false
              });
              
              // Générer la réponse via l'API AI ou fallback
              console.log(`Génération de réponse après ${responseDelay}ms pour ${conv.patientEmail}`);
              generatePatientResponse(conv.patientEmail, updatedMessages, conversationId);
            }, responseDelay);
          }
          
          return updatedConv;
        }
        return conv;
      });
      
      return updated;
    });
  };

  // Générer une réponse automatique du patient via l'API AI
  const generatePatientResponse = async (patientEmail, conversationHistory, conversationId) => {
    console.log("Début de la génération de réponse pour", patientEmail);
    try {
      // Appel au service AI pour générer une réponse
      const aiResponse = await aiService.generatePatientResponse(
        patientEmail, 
        conversationHistory,
        ''  // Prompt optionnel
      );
      
      console.log("Réponse AI reçue:", aiResponse?.substring(0, 50));
      
      // Créer le message de réponse du patient
      const patientReply = {
        id: `msg-${Date.now()}`,
        senderId: 'patient',
        receiverId: 'nutritionist',
        content: aiResponse,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      console.log("Réponse du patient formatée:", patientReply);
      
      // Ajouter le message à la conversation
      const now = Date.now();
      
      setConversations(prevConversations => {
        console.log("Mise à jour des conversations avec la réponse du patient");
        const updated = prevConversations.map(conv => {
          if (conv.id === conversationId) {
            console.log(`Ajout de la réponse à la conversation ${conversationId}`);
            const updatedMessages = [...conv.messages, patientReply];
            
            // Créer la conversation mise à jour
            const updatedConv = {
              ...conv,
              lastMessage: patientReply.content,
              lastMessageDate: getCurrentTimeString(),
              messages: updatedMessages,
              waitingResponse: false,
              unreadCount: conv.unreadCount + 1,
              refreshFlag: now // Forcer le rafraîchissement
            };
            
            // Déclencher un rafraîchissement forcé de l'interface
            setTimeout(() => {
              if (selectedConversation && selectedConversation.id === conversationId) {
                console.log("Mise à jour forcée de la conversation sélectionnée");
                setSelectedConversation({...updatedConv, refreshFlag: Date.now()});
                
                // Faire défiler vers le bas après l'ajout du message
                setTimeout(() => {
                  console.log("Défilement vers le bas");
                  const chatBody = document.querySelector('.chatBody');
                  if (chatBody) {
                    chatBody.scrollTop = chatBody.scrollHeight;
                  }
                }, 100);
              }
            }, 0);
            
            return updatedConv;
          }
          return conv;
        });
        
        return updated;
      });
    } catch (error) {
      console.error('Erreur lors de la génération de la réponse IA:', error);
      
      // En cas d'erreur, ajouter une réponse de secours directement
      const fallbackMessage = "Désolé, je n'ai pas bien compris votre message. Pourriez-vous reformuler?";
      const fallbackReply = {
        id: `msg-${Date.now()}`,
        senderId: 'patient',
        receiverId: 'nutritionist',
        content: fallbackMessage,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      console.log("Utilisation d'une réponse de secours en cas d'erreur:", fallbackReply);
      
      // Ajouter le message à la conversation
      const now = Date.now();
      setConversations(prevConversations => {
        const updated = prevConversations.map(conv => {
          if (conv.id === conversationId) {
            const updatedMessages = [...conv.messages, fallbackReply];
            const updatedConv = {
              ...conv,
              lastMessage: fallbackReply.content,
              lastMessageDate: getCurrentTimeString(),
              messages: updatedMessages,
              waitingResponse: false,
              unreadCount: conv.unreadCount + 1,
              refreshFlag: now
            };
            
            // Mettre à jour la référence de la conversation sélectionnée
            if (selectedConversation && selectedConversation.id === conversationId) {
              setTimeout(() => {
                setSelectedConversation({...updatedConv, refreshFlag: Date.now()});
              }, 0);
            }
            
            return updatedConv;
          }
          return conv;
        });
        
        return updated;
      });
    }
  };

  // Fonction pour démarrer une nouvelle conversation
  const handleStartNewConversation = (patient) => {
    console.log("Patient sélectionné pour nouvelle conversation:", patient);
    
    // Générer une URL d'avatar pour le patient
    const patientWithAvatar = {
      ...patient,
      avatarUrl: getAvatarUrl(patient)
    };
    
    console.log("Patient avec URL d'avatar générée:", patientWithAvatar);
    
    // Vérifier si une conversation existe déjà avec ce patient
    const existingConversation = conversations.find(
      conv => conv.patient.id === patient.id && !conv.archived
    );
    
    if (existingConversation) {
      // Si une conversation existe déjà, la sélectionner
      handleSelectConversation(existingConversation.id);
      return;
    }
    
    // Créer une nouvelle conversation
    const newConversation = {
      id: `conv-${Date.now()}`,
      patient: patientWithAvatar,
      patientEmail: patient.email,
      lastMessage: "",
      lastMessageDate: getCurrentTimeString(),
      messages: [],
      unreadCount: 0,
      waitingResponse: false,
      archived: false
    };
    
    // Ajouter la nouvelle conversation à la liste
    setConversations(prevConversations => {
      const newConversations = [newConversation, ...prevConversations];
      
      // Sauvegarder dans localStorage
      localStorage.setItem('conversations', JSON.stringify(newConversations));
      
      return newConversations;
    });
    
    // Sélectionner la nouvelle conversation
    setSelectedConversation(newConversation);
  };

  // Fonction pour basculer l'état "en attente de réponse" d'une conversation
  const toggleWaitingResponse = (conversationId) => {
    setConversations(prevConversations => {
      const updatedConversations = prevConversations.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            waitingResponse: !conv.waitingResponse
          };
        }
        return conv;
      });
      
      // Sauvegarder dans localStorage
      localStorage.setItem('conversations', JSON.stringify(updatedConversations));
      
      return updatedConversations;
    });
  };

  // Fonction pour archiver/désarchiver une conversation
  const toggleArchived = (conversationId) => {
    setConversations(prevConversations => {
      const updatedConversations = prevConversations.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            archived: !conv.archived
          };
        }
        return conv;
      });
      
      // Sauvegarder dans localStorage
      localStorage.setItem('conversations', JSON.stringify(updatedConversations));
      
      return updatedConversations;
    });
  };

  // Faire défiler automatiquement vers le bas quand les messages changent
  useEffect(() => {
    const chatBody = document.querySelector('.chatBody');
    if (chatBody) {
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  }, [conversations]);

  // Les valeurs et fonctions exposées par le contexte
  const value = {
    selectedConversation,
    conversations,
    allPatients,
    patientTyping,
    handleSelectConversation,
    handleSendMessage,
    handleStartNewConversation,
    toggleWaitingResponse,
    toggleArchived
  };
  
  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useMessageContext = () => {
  return useContext(MessageContext);
};

export default MessageContext;
