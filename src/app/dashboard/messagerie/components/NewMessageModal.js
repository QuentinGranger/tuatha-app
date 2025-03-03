'use client';

import React, { useState, useEffect } from 'react';
import { FiX, FiSearch, FiSend, FiUser } from 'react-icons/fi';
import { useMessageContext } from '@/contexts/MessageContext';
import styles from '../page.module.css';

const NewMessageModal = ({ onClose }) => {
  const { allPatients, handleStartNewConversation } = useMessageContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [initialMessage, setInitialMessage] = useState('');
  
  // Filtrer les patients selon le terme de recherche
  const filteredPatients = allPatients.filter(patient => 
    !patient || !patient.name 
      ? false 
      : patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Gérer l'envoi du nouveau message
  const handleSendMessage = () => {
    if (selectedPatient && initialMessage.trim()) {
      handleStartNewConversation(selectedPatient);
      onClose();
    }
  };
  
  // Fermer avec la touche Echap
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.newMessageModal}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Nouveau message</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <FiX />
          </button>
        </div>
        
        <div className={styles.modalBody}>
          {!selectedPatient ? (
            // Étape 1: Sélection du patient
            <>
              <div className={styles.patientSearchContainer}>
                <FiSearch className={styles.searchIcon} />
                <input 
                  type="text"
                  placeholder="Rechercher un patient..."
                  className={styles.patientSearchInput}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className={styles.patientsList}>
                {filteredPatients.length === 0 ? (
                  <div className={styles.noResults}>
                    <p>Aucun patient ne correspond à votre recherche</p>
                  </div>
                ) : (
                  filteredPatients.map(patient => (
                    <div 
                      key={patient.id}
                      className={styles.patientSearchItem}
                      onClick={() => setSelectedPatient(patient)}
                    >
                      <div className={styles.patientSearchAvatar}>
                        <img 
                          src={patient?.avatarUrl || '/img/patient/default-avatar.jpg'}
                          alt={patient?.name || 'Patient'}
                          width={40}
                          height={40}
                          className={styles.avatarImage}
                          onError={(e) => {
                            console.error('Error loading search patient avatar:', e);
                            e.target.src = '/img/patient/default-avatar.jpg';
                          }}
                        />
                      </div>
                      <div className={styles.patientSearchInfo}>
                        <h4 className={styles.patientSearchName}>{patient?.name || 'Patient sans nom'}</h4>
                        <p className={styles.patientSearchEmail}>{patient?.email || ''}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            // Étape 2: Composer le message
            <div className={styles.composeMessage}>
              <div className={styles.selectedPatientInfo}>
                <div className={styles.selectedPatientAvatar}>
                  <img 
                    src={selectedPatient?.avatarUrl || '/img/patient/default-avatar.jpg'}
                    alt={selectedPatient?.name || 'Patient'}
                    width={50}
                    height={50}
                    className={styles.avatarImage}
                    onError={(e) => {
                      console.error('Error loading selected patient avatar:', e);
                      e.target.src = '/img/patient/default-avatar.jpg';
                    }}
                  />
                </div>
                <div className={styles.selectedPatientDetails}>
                  <h4 className={styles.selectedPatientName}>{selectedPatient.name}</h4>
                  <button 
                    className={styles.changePatientButton} 
                    onClick={() => setSelectedPatient(null)}
                  >
                    Changer de patient
                  </button>
                </div>
              </div>
              
              <div className={styles.messageComposer}>
                <textarea
                  className={styles.initialMessageInput}
                  placeholder="Écrivez votre message..."
                  value={initialMessage}
                  onChange={(e) => setInitialMessage(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
        
        <div className={styles.modalFooter}>
          <button 
            className={styles.cancelButton} 
            onClick={onClose}
          >
            Annuler
          </button>
          {selectedPatient && (
            <button
              className={styles.sendInitialMessageButton}
              onClick={handleSendMessage}
              disabled={!initialMessage.trim()}
            >
              <FiSend />
              <span>Envoyer</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewMessageModal;
