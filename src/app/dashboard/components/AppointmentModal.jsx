import React, { useState, useEffect } from 'react';
import { FaVideo, FaPhone, FaTimes, FaUser, FaNotesMedical, FaClock, FaPlus, FaSave, FaRegClock, FaCalendarAlt, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import styles from './AppointmentModal.module.css';

// Données patients importées du seed (en production, ceci viendrait d'une API)
const patientsList = [
  {
    id: 1,
    firstName: 'Bruce',
    lastName: 'Wayne',
    email: 'batman@wayne-enterprises.com',
    phone: '0666666666',
    sport: 'Arts Martiaux',
    injury: 'Multiples fractures dues aux chutes de buildings'
  },
  {
    id: 2,
    firstName: 'Izuku',
    lastName: 'Midoriya',
    email: 'deku@ua.edu',
    phone: '0677777777',
    sport: 'Super-Héroïsme',
    injury: 'Bras cassés à répétition (One For All)'
  },
  {
    id: 3,
    firstName: 'Son',
    lastName: 'Goku',
    email: 'goku@capsule-corp.com',
    phone: '0688888888',
    sport: 'Arts Martiaux',
    injury: 'Surmenage dû aux entraînements à 100x la gravité'
  },
  {
    id: 4,
    firstName: 'Tony',
    lastName: 'Stark',
    email: 'tony@stark-industries.com',
    phone: '0699999999',
    sport: 'Vol en armure',
    injury: 'Problèmes cardiaques (réacteur ARK)'
  },
  {
    id: 5,
    firstName: 'Monkey D.',
    lastName: 'Luffy',
    email: 'luffy@thousand-sunny.com',
    phone: '0611111111',
    sport: 'Piraterie',
    injury: 'Élongation excessive des membres (fruit du Gomu Gomu)'
  },
  {
    id: 6,
    firstName: 'Naruto',
    lastName: 'Uzumaki',
    email: 'naruto@konoha.gov',
    phone: '0622222222',
    sport: 'Ninjutsu',
    injury: 'Épuisement de chakra'
  },
  {
    id: 7,
    firstName: 'Saitama',
    lastName: 'Unknown',
    email: 'saitama@hero-association.org',
    phone: '0633333333',
    sport: 'Super-Héroïsme',
    injury: 'Dépression due à la facilité des combats'
  },
  {
    id: 8,
    firstName: 'Peter',
    lastName: 'Parker',
    email: 'spidey@daily-bugle.com',
    phone: '0644444444',
    sport: 'Acrobaties urbaines',
    injury: 'Tendinite aux poignets (lancer de toiles)'
  },
  {
    id: 9,
    firstName: 'Thor',
    lastName: 'Odinson',
    email: 'thor@asgard.realm', 
    phone: '0655555555',
    sport: 'Lancer de marteau',
    injury: 'Syndrome du canal carpien (Mjolnir)'
  },
  {
    id: 10,
    firstName: 'Diana',
    lastName: 'Prince',
    email: 'wonder@themyscira.com',
    phone: '0687654321',
    sport: 'Combat amazonien',
    injury: 'Tendinite à l\'épaule (lancer de lasso)'
  }
];

/**
 * Modal d'affichage détaillé ou de création/édition d'un rendez-vous
 */
const AppointmentModal = ({ appointment, onClose, onCreate, onUpdate, isCreateMode = false }) => {
  const emptyAppointment = {
    title: '',
    startTime: new Date(),
    endTime: new Date(new Date().setHours(new Date().getHours() + 1)),
    type: 'in-person',
    status: 'pending',
    patient: {
      id: '',
      name: '',
      email: '',
      phone: ''
    },
    nutritionInfo: {
      objective: '',
      specificDiet: '',
      restrictions: [],
      notes: ''
    },
    notes: ''
  };

  const [currentAppointment, setCurrentAppointment] = useState(
    appointment ? { ...appointment } : { ...emptyAppointment }
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [showPatientSearch, setShowPatientSearch] = useState(false);

  // Filtrer les patients basés sur le terme de recherche
  const filteredPatients = patientsList.filter(patient => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  // Désactiver le scroll du body quand la modale est ouverte
  useEffect(() => {
    // Pour éviter le défilement du body pendant que la modale est ouverte
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setCurrentAppointment({
        ...currentAppointment,
        [section]: {
          ...currentAppointment[section],
          [field]: value
        }
      });
    } else {
      setCurrentAppointment({
        ...currentAppointment,
        [name]: value
      });
    }
  };

  const handleTimeChange = (field, value) => {
    setCurrentAppointment({
      ...currentAppointment,
      [field]: value
    });
  };

  const handlePatientSelect = (patient) => {
    setCurrentAppointment({
      ...currentAppointment,
      patient: {
        id: patient.id,
        name: `${patient.firstName} ${patient.lastName}`,
        email: patient.email,
        phone: patient.phone
      }
    });
    setSearchTerm('');
    setShowPatientSearch(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isCreateMode) {
      onCreate({
        ...currentAppointment,
        id: `appointment-${Date.now()}`
      });
    } else {
      onUpdate(currentAppointment);
    }
    onClose();
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  const formatTime = (date) => {
    const d = new Date(date);
    return d.toTimeString().split(' ')[0].substring(0, 5);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>{isCreateMode ? 'Nouveau rendez-vous' : 'Détails du rendez-vous'}</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.modalContent}>
            <div className={styles.formGroup}>
              <label htmlFor="title" className={styles.formLabel}>Titre du rendez-vous</label>
              <input
                type="text"
                id="title"
                name="title"
                value={currentAppointment.title}
                onChange={handleInputChange}
                placeholder="Consultation initiale, Suivi mensuel, etc."
                className={styles.formControl}
                required
              />
            </div>
            
            <div className={styles.formSection}>
              <h4>
                <FaCalendarAlt /> Date et Heure
              </h4>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="startDate" className={styles.formLabel}>Date</label>
                  <input
                    type="date"
                    id="startDate"
                    value={formatDate(currentAppointment.startTime)}
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      const currentStart = new Date(currentAppointment.startTime);
                      date.setHours(currentStart.getHours(), currentStart.getMinutes());
                      handleTimeChange('startTime', date);
                      
                      // Ajuster aussi l'heure de fin si nécessaire
                      const endDate = new Date(date);
                      const currentEnd = new Date(currentAppointment.endTime);
                      endDate.setHours(currentEnd.getHours(), currentEnd.getMinutes());
                      handleTimeChange('endTime', endDate);
                    }}
                    className={styles.formControl}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="startTime" className={styles.formLabel}>Heure de début</label>
                  <input
                    type="time"
                    id="startTime"
                    value={formatTime(currentAppointment.startTime)}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(':');
                      const date = new Date(currentAppointment.startTime);
                      date.setHours(hours, minutes);
                      handleTimeChange('startTime', date);
                      
                      // Ajuster l'heure de fin (1h plus tard par défaut)
                      const endDate = new Date(date);
                      endDate.setHours(endDate.getHours() + 1);
                      handleTimeChange('endTime', endDate);
                    }}
                    className={styles.formControl}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="endTime" className={styles.formLabel}>Heure de fin</label>
                  <input
                    type="time"
                    id="endTime"
                    value={formatTime(currentAppointment.endTime)}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(':');
                      const date = new Date(currentAppointment.endTime);
                      date.setHours(hours, minutes);
                      handleTimeChange('endTime', date);
                    }}
                    className={styles.formControl}
                    required
                  />
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <h4>
                <FaRegClock /> Type de rendez-vous
              </h4>
              <div className={styles.appointmentTypes}>
                <div 
                  className={`${styles.typeOption} ${currentAppointment.type === 'in-person' ? styles.selected : ''}`}
                  onClick={() => handleInputChange({ target: { name: 'type', value: 'in-person' } })}
                >
                  <div className={styles.typeIcon}>
                    <FaUser />
                  </div>
                  <div className={styles.typeLabel}>En personne</div>
                </div>
                
                <div 
                  className={`${styles.typeOption} ${currentAppointment.type === 'virtual' ? styles.selected : ''}`}
                  onClick={() => handleInputChange({ target: { name: 'type', value: 'virtual' } })}
                >
                  <div className={styles.typeIcon}>
                    <FaVideo />
                  </div>
                  <div className={styles.typeLabel}>Virtuel</div>
                </div>
                
                <div 
                  className={`${styles.typeOption} ${currentAppointment.type === 'phone' ? styles.selected : ''}`}
                  onClick={() => handleInputChange({ target: { name: 'type', value: 'phone' } })}
                >
                  <div className={styles.typeIcon}>
                    <FaPhone />
                  </div>
                  <div className={styles.typeLabel}>Téléphone</div>
                </div>
                
                <div 
                  className={`${styles.typeOption} ${currentAppointment.type === 'timeblock' ? styles.selected : ''}`}
                  onClick={() => handleInputChange({ target: { name: 'type', value: 'timeblock' } })}
                >
                  <div className={styles.typeIcon}>
                    <FaRegClock />
                  </div>
                  <div className={styles.typeLabel}>Indisponibilité</div>
                </div>
              </div>
            </div>
            
            {currentAppointment.type !== 'timeblock' && (
              <div className={styles.formSection}>
                <h4>
                  <FaUser /> Informations du patient
                </h4>
                <div className={styles.formGroup}>
                  <label htmlFor="patient" className={styles.formLabel}>
                    Sélectionner un patient <span style={{ color: 'rgba(255, 115, 0, 0.9)' }}>(requis)</span>
                  </label>
                  <div className={styles.patientSearchContainer}>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onFocus={() => setShowPatientSearch(true)}
                      placeholder="Rechercher un patient..."
                      className={`${styles.formControl} ${styles.patientSearchInput}`}
                      required={currentAppointment.type !== 'timeblock'}
                    />
                    <FaSearch className={styles.searchIcon} />
                    
                    {!showPatientSearch && !currentAppointment.patient.name && (
                      <div style={{ 
                        color: 'rgba(255, 255, 255, 0.6)', 
                        fontSize: '0.9rem', 
                        marginTop: '8px',
                        padding: '8px',
                        background: 'rgba(255, 115, 0, 0.1)',
                        borderRadius: '8px'
                      }}>
                        <span style={{ color: 'rgba(255, 115, 0, 0.9)' }}>Astuce :</span> Cliquez sur le champ de recherche et commencez à taper le nom d'un patient pour le sélectionner
                      </div>
                    )}
                    
                    {showPatientSearch && (
                      <div className={styles.patientSearchResults}>
                        {filteredPatients.length === 0 ? (
                          <div style={{ padding: '10px 15px', color: 'rgba(255, 255, 255, 0.7)' }}>
                            Aucun patient trouvé
                          </div>
                        ) : (
                          filteredPatients.map(patient => (
                            <div 
                              key={patient.id} 
                              onClick={() => handlePatientSelect(patient)}
                              className={styles.patientSearchItem}
                            >
                              <div style={{ fontWeight: 500 }}>{patient.firstName} {patient.lastName}</div>
                              <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                                {patient.email} • {patient.phone}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'rgba(255, 115, 0, 0.8)', marginTop: '3px' }}>
                                {patient.injury}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {currentAppointment.patient && currentAppointment.patient.name && (
                  <div className={styles.selectedPatientCard}>
                    <div className={styles.selectedPatientHeader}>
                      <div>
                        <div className={styles.selectedPatientName}>{currentAppointment.patient.name}</div>
                        <div className={styles.selectedPatientInfo}>
                          {currentAppointment.patient.email} • {currentAppointment.patient.phone}
                        </div>
                      </div>
                      <button 
                        type="button"
                        className={styles.removePatientButton}
                        onClick={() => {
                          setCurrentAppointment({
                            ...currentAppointment,
                            patient: {
                              id: '',
                              name: '',
                              email: '',
                              phone: ''
                            }
                          });
                          setSearchTerm('');
                        }}
                      >
                        <FaTimes size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {!isCreateMode && currentAppointment.type !== 'timeblock' && (
              <div className={styles.formSection}>
                <h4>
                  <FaNotesMedical /> Informations nutritionnelles
                </h4>
                <div className={styles.formGroup}>
                  <label htmlFor="nutritionInfo.objective" className={styles.formLabel}>Objectif</label>
                  <input
                    type="text"
                    id="nutritionInfo.objective"
                    name="nutritionInfo.objective"
                    value={currentAppointment.nutritionInfo?.objective || ''}
                    onChange={handleInputChange}
                    placeholder="Objectif nutritionnel principal"
                    className={styles.formControl}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="nutritionInfo.specificDiet" className={styles.formLabel}>Régime spécifique</label>
                  <input
                    type="text"
                    id="nutritionInfo.specificDiet"
                    name="nutritionInfo.specificDiet"
                    value={currentAppointment.nutritionInfo?.specificDiet || ''}
                    onChange={handleInputChange}
                    placeholder="Régime alimentaire particulier"
                    className={styles.formControl}
                  />
                </div>
              </div>
            )}
            
            <div className={styles.formSection}>
              <h4>
                <FaNotesMedical /> Notes
              </h4>
              <div className={styles.formGroup}>
                <label htmlFor="notes" className={styles.formLabel}>Notes additionnelles</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={currentAppointment.notes}
                  onChange={handleInputChange}
                  placeholder="Informations supplémentaires, préparation nécessaire, etc."
                  className={styles.textArea}
                  rows={4}
                />
              </div>
            </div>
          </div>
          
          <div className={styles.modalFooter}>
            <button 
              type="button" 
              className={`${styles.button} ${styles.cancelButton}`} 
              onClick={onClose}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className={`${styles.button} ${styles.saveButton}`}
            >
              <FaSave /> {isCreateMode ? 'Créer' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;
