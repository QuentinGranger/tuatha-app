'use client';

import { useState, useEffect } from 'react';
import Portal from '@/components/Portal';
import styles from './ShareDialog.module.css';

export default function ShareDialog({ isOpen, onClose, patient }) {
  const [searchText, setSearchText] = useState('');
  const [selectedDoctors, setSelectedDoctors] = useState([]);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState(null);
  const [successNotification, setSuccessNotification] = useState(false);
  const [showPreModal, setShowPreModal] = useState(true);
  const [showMainModal, setShowMainModal] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // Handle modal animation
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      
      // Vérifier si l'utilisateur a choisi de ne plus voir l'avertissement
      const skipWarning = localStorage.getItem('tuatha_skip_patient_consent_warning') === 'true';
      if (skipWarning) {
        setShowPreModal(false);
        setShowMainModal(true);
      } else {
        setShowPreModal(true);
        setShowMainModal(false);
      }
    } else {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300); // Match the animation duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Fetch available health professionals from the database
  useEffect(() => {
    if (isOpen && showMainModal) {
      setIsLoading(true);
      setError(null);
      
      // Fetch health professionals that are not already associated with this patient
      fetch(`/api/health-professionals?excludePatientId=${patient?.id || ''}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Erreur lors du chargement des professionnels de santé');
          }
          return response.json();
        })
        .then(data => {
          setAvailableDoctors(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Erreur:', err);
          setError(err.message);
          setIsLoading(false);
          
          // Fallback to mock data in case of error
          setAvailableDoctors([
            {
              id: '1',
              user: {
                firstName: 'Tony',
                lastName: 'Tony',
                specialty: 'NUTRITIONIST',
                email: 'chopper.nutritionist@tuatha.app',
                photoUrl: '/img/professionel/chopper.jpg'
              }
            },
            {
              id: '2',
              user: {
                firstName: 'Bruce',
                lastName: 'Banner',
                specialty: 'DIETITIAN',
                email: 'bruce.banner@tuatha.app',
                photoUrl: '/img/professionel/hulk.jpg'
              }
            },
            {
              id: '3',
              user: {
                firstName: 'Stephen',
                lastName: 'Strange',
                specialty: 'OSTEOPATH',
                email: 'stephen.strange@tuatha.app',
                photoUrl: '/placeholder-avatar.png'
              }
            }
          ]);
        });
    }
  }, [isOpen, patient?.id, showMainModal]);

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

  // Gérer la transition entre la pré-modale et la modale principale
  const handleContinue = () => {
    // Si l'utilisateur a coché "Ne plus m'avertir", enregistrer cette préférence
    if (dontShowAgain) {
      localStorage.setItem('tuatha_skip_patient_consent_warning', 'true');
    }
    
    setShowPreModal(false);
    setShowMainModal(true);
  };

  const handleCancel = () => {
    onClose();
  };

  const handleDontShowAgainChange = (e) => {
    setDontShowAgain(e.target.checked);
  };

  // Réinitialiser l'option "Ne plus m'avertir"
  const handleResetWarningPreference = (e) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.removeItem('tuatha_skip_patient_consent_warning');
    setShowPreModal(true);
    setShowMainModal(false);
  };

  // Filter doctors based on search text
  const filteredDoctors = availableDoctors.filter(doctor => {
    if (!doctor.user) return false;
    
    const fullName = `${doctor.user.firstName} ${doctor.user.lastName}`.toLowerCase();
    const email = doctor.user.email.toLowerCase();
    const specialty = (doctor.specialty || doctor.user.specialty || '').toLowerCase();
    const searchLower = searchText.toLowerCase();
    
    return fullName.includes(searchLower) || 
           email.includes(searchLower) || 
           specialty.includes(searchLower);
  });

  const handleDoctorSelect = (doctor) => {
    if (selectedDoctors.some(d => d.id === doctor.id)) {
      setSelectedDoctors(selectedDoctors.filter(d => d.id !== doctor.id));
    } else {
      setSelectedDoctors([...selectedDoctors, doctor]);
    }
  };

  const handleShare = async () => {
    if (selectedDoctors.length === 0) return;
    
    setIsLoading(true);
    
    try {
      // Appel à l'API pour partager le dossier patient
      const response = await fetch('/api/patients/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: patient.id,
          healthProfessionalIds: selectedDoctors.map(doctor => doctor.id)
        }),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors du partage du dossier patient');
      }
      
      // Afficher la notification de succès
      setSuccessNotification(true);
      
      // Fermer la modale après un court délai
      setTimeout(() => {
        setSuccessNotification(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Erreur de partage:', err);
      setError('Erreur lors du partage. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen && !isAnimating) return null;

  // Traduire la spécialité en français
  const getSpecialtyInFrench = (specialty) => {
    const specialtyMap = {
      'NUTRITIONIST': 'Nutritionniste',
      'PHYSIOTHERAPIST': 'Kinésithérapeute',
      'PSYCHOLOGIST': 'Psychologue',
      'DOCTOR': 'Médecin',
      'GENERAL': 'Généraliste',
      'RADIOLOGIST': 'Radiologue',
      'PEDIATRICIAN': 'Pédiatre',
      'PHYSICAL_TRAINER': 'Préparateur physique',
      'DIETITIAN': 'Diététicien(ne)',
      'OSTEOPATH': 'Ostéopathe'
    };
    
    return specialtyMap[specialty] || specialty;
  };

  return (
    <Portal>
      <div 
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : styles.overlayHidden}`} 
        onClick={onClose}
        aria-modal="true"
        role="dialog"
      >
        {successNotification && (
          <div className={styles.notification}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <p>Dossier partagé avec succès</p>
            <div className={styles.progressBar}></div>
          </div>
        )}

        {/* Pré-modale */}
        {showPreModal && isOpen && (
          <div 
            className={`${styles.dialog} ${styles.preModal} ${isOpen ? styles.dialogVisible : styles.dialogHidden}`} 
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.header}>
              <h2>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF8800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                Information importante
              </h2>
              <button className={styles.closeButton} onClick={onClose} aria-label="Fermer">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className={styles.preModalContent}>
              <div className={styles.warningIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#FF8800" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
              
              <div className={styles.preModalMessage}>
                <h3>Consentement du patient requis</h3>
                <p>Veuillez noter que le partage du dossier médical ne sera effectif qu'après validation par le patient via son application mobile.</p>
                <p>Le patient recevra une notification et devra approuver explicitement l'accès à ses données médicales, conformément aux règles de protection des données de santé.</p>
                
                <div className={styles.dontShowAgainWrapper}>
                  <label className={styles.dontShowAgainLabel}>
                    <input 
                      type="checkbox" 
                      checked={dontShowAgain} 
                      onChange={handleDontShowAgainChange} 
                      className={styles.dontShowAgainCheckbox}
                    />
                    <span>Ne plus m'avertir</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className={styles.footer}>
              <div className={styles.footerButtons}>
                <button 
                  className={styles.cancelButton} 
                  onClick={handleCancel}
                >
                  Annuler
                </button>
                <button 
                  className={styles.continueButton} 
                  onClick={handleContinue}
                >
                  Continuer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modale principale */}
        {showMainModal && (
          <div 
            className={`${styles.dialog} ${isOpen ? styles.dialogVisible : styles.dialogHidden}`} 
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.header}>
              <h2>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF8800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
                Partager le dossier patient
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
              </div>
              <div className={styles.patientDetail}>
                <span className={styles.label}>Patient</span>
                <span className={styles.value}>{patient?.firstName} {patient?.lastName}</span>
              </div>
              <button 
                className={styles.resetWarningLink}
                onClick={handleResetWarningPreference}
                title="Réactiver l'avertissement de consentement patient"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </button>
            </div>

            <div className={styles.search}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF8800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                placeholder="Rechercher un professionnel de santé..." 
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            <div className={styles.doctorsList}>
              {isLoading ? (
                <div className={styles.loading}>
                  <div className={styles.spinner}></div>
                  <span>Chargement des professionnels de santé...</span>
                </div>
              ) : error ? (
                <div className={styles.error}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF3333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <p>{error}</p>
                </div>
              ) : filteredDoctors.length === 0 ? (
                <div className={styles.emptyState}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FF8800" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <p>Aucun professionnel de santé trouvé</p>
                </div>
              ) : (
                filteredDoctors.map(doctor => (
                  <div 
                    key={doctor.id} 
                    className={`${styles.doctorCard} ${selectedDoctors.some(d => d.id === doctor.id) ? styles.selected : ''}`}
                    onClick={() => handleDoctorSelect(doctor)}
                  >
                    <div className={styles.doctorAvatar}>
                      <img 
                        src={doctor.user.photoUrl || '/placeholder-avatar.png'} 
                        alt={`${doctor.user.firstName} ${doctor.user.lastName}`} 
                      />
                    </div>
                    <div className={styles.doctorInfo}>
                      <h3>{doctor.user.firstName} {doctor.user.lastName}</h3>
                      <p>{getSpecialtyInFrench(doctor.specialty || doctor.user.specialty)}</p>
                      <span>{doctor.user.email}</span>
                    </div>
                    <div className={styles.checkbox}>
                      {selectedDoctors.some(d => d.id === doctor.id) && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#FF8800" stroke="#FF8800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className={styles.footer}>
              <div className={styles.footerInfo}>
                {selectedDoctors.length > 0 && (
                  <div className={styles.selectedCount}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF8800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    {selectedDoctors.length} professionnel{selectedDoctors.length !== 1 ? 's' : ''} sélectionné{selectedDoctors.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
              <div className={styles.footerButtons}>
                <button 
                  className={styles.cancelButton} 
                  onClick={onClose}
                >
                  Annuler
                </button>
                <button 
                  className={styles.shareButton} 
                  onClick={handleShare}
                  disabled={selectedDoctors.length === 0 || isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className={styles.buttonSpinner}></div>
                      Partage...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                      </svg>
                      Partager
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Portal>
  );
}
