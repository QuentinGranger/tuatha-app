'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import aiService from '../services/aiService';

// Créer le contexte des messages
const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [allPatients, setAllPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [patientTyping, setPatientTyping] = useState(null);

  // Définition des patients de démo pour les tests
  const demoPatients = [
    { 
      id: 'patient1',
      name: 'Bruce Wayne',
      email: 'batman@wayne-enterprises.com',
      avatar: 'batman.jpg',
      lastVisit: '2023-05-15'
    },
    { 
      id: 'patient2',
      name: 'Tony Stark',
      email: 'tony@stark-industries.com',
      avatar: 'ironman.jpg',
      lastVisit: '2023-05-10'
    },
    { 
      id: 'patient3',
      name: 'Clark Kent',
      email: 'clark.kent@dailyplanet.com',
      avatar: 'thor.jpg',
      lastVisit: '2023-05-05'
    },
    { 
      id: 'patient4',
      name: 'Diana Prince',
      email: 'diana@themyscira.com',
      avatar: 'wonderwoman.jpg',
      lastVisit: '2023-04-28'
    },
    { 
      id: 'patient5',
      name: 'Peter Parker',
      email: 'peter.parker@dailybugle.com',
      avatar: 'spiderman.jpg',
      lastVisit: '2023-04-20'
    },
    { 
      id: 'patient6',
      name: 'Selina Kyle',
      email: 'selina.kyle@catwoman.com',
      avatar: 'default-avatar.jpg',
      lastVisit: '2023-04-15'
    },
    { 
      id: 'patient7',
      name: 'Barry Allen',
      email: 'b.allen@starlabs.com',
      avatar: 'naruto.jpg',
      lastVisit: '2023-04-10'
    },
    { 
      id: 'patient8',
      name: 'Natasha Romanoff',
      email: 'n.romanoff@shield.gov',
      avatar: 'deku.jpg',
      lastVisit: '2023-04-05'
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
      const avatarPath = `/img/patient/${patient.avatar}`;
      console.log("Avatar path (from patient.avatar):", avatarPath);
      return avatarPath;
    }
    
    // Vérifier la propriété photoUrl (utilisée dans certaines implémentations)
    if (patient.photoUrl) {
      console.log("Avatar path (from patient.photoUrl):", patient.photoUrl);
      return patient.photoUrl;
    }
    
    // Vérifier si le patient a un objet user avec photoUrl
    if (patient.user && patient.user.photoUrl) {
      console.log("Avatar path (from patient.user.photoUrl):", patient.user.photoUrl);
      return patient.user.photoUrl;
    }
    
    // Fallback sur l'avatar par défaut
    console.log("Aucun avatar trouvé, utilisation de l'avatar par défaut");
    return '/img/patient/default-avatar.jpg';
  };

  // Initialiser allPatients à partir de demoPatients au démarrage
  useEffect(() => {
    setIsLoading(true);
    
    // Générer des avatarUrl pour tous les patients de démo
    const patientsWithAvatars = demoPatients.map(patient => ({
      ...patient,
      avatarUrl: getAvatarUrl(patient)
    }));
    
    setAllPatients(patientsWithAvatars);
    console.log("Patients initialisés avec avatars:", patientsWithAvatars);
    
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
      // Chercher d'abord dans demoPatients pour compatibilité
      const patient = demoPatients.find(p => p.id === patientId);
      console.log(`Recherche du patient avec l'ID ${patientId}:`, patient || 'Non trouvé');
      return patient || null;
    };
    
    if (!storedConversations) {
      // Créer quelques conversations fictives si rien n'est stocké
      // Assurons-nous d'utiliser uniquement des patients qui existent dans demoPatients
      console.log("Création de nouvelles conversations avec les patients connus:", demoPatients.map(p => p.id));
      
      // On va créer une conversation pour chaque patient dans demoPatients
      const initialConversations = demoPatients.slice(0, 3).map((patient, index) => {
        const convId = `conv${index + 1}`;
        const patientId = patient.id;
        
        console.log(`Création de la conversation ${convId} pour le patient ${patientId} (${patient.name})`);
        
        return {
          id: convId,
          patientId: patientId,
          lastMessageTime: new Date(new Date().getTime() - index * 86400000).toISOString(),
          unreadCount: index === 0 ? 2 : 0,
          messages: [
            {
              id: `${index+1}-1`,
              senderId: patientId,
              receiverId: 'nutritionist',
              content: `Bonjour, je suis ${patient.name} et j'ai des questions concernant mon suivi.`,
              timestamp: new Date(new Date().getTime() - (index+1) * 3600000).toISOString(),
              read: true
            },
            {
              id: `${index+1}-2`,
              senderId: 'nutritionist',
              receiverId: patientId,
              content: `Bonjour ${patient.name} ! Bien sûr, je suis là pour vous aider. Quelles sont vos questions ?`,
              timestamp: new Date(new Date().getTime() - (index+1) * 3500000).toISOString(),
              read: true
            }
          ]
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
            lastMessageTime: new Date(conv.lastMessageTime),
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
  const handleSelectConversation = (id) => {
    const conversation = conversations.find(conv => conv.id === id);
    setSelectedConversation(conversation);
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
            lastMessageTime: getCurrentTimeString(),
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
              lastMessageTime: getCurrentTimeString(),
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
              lastMessageTime: getCurrentTimeString(),
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
      lastMessageTime: getCurrentTimeString(),
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
