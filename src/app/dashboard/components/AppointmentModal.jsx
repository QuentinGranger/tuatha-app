import React, { useState, useEffect } from 'react';
import { FaVideo, FaPhone, FaTimes, FaUser, FaNotesMedical, FaClock, FaPlus, FaSave } from 'react-icons/fa';
import styles from './AppointmentModal.module.css';

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

  // Désactiver le scroll du body quand la modale est ouverte
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    // Réactiver le scroll quand la modale est fermée
    return () => {
      document.body.style.overflow = 'auto';
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

  // Rendre la modale directement dans le flux du DOM sans createPortal
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
              <label htmlFor="title">Titre du rendez-vous</label>
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
                <FaClock /> Date et Heure
              </h4>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="startDate">Date</label>
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
                  <label htmlFor="startTime">Heure de début</label>
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
                  <label htmlFor="endTime">Heure de fin</label>
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
                <FaUser /> Informations du patient
              </h4>
              <div className={styles.formGroup}>
                <label htmlFor="patient.name">Nom du patient</label>
                <input
                  type="text"
                  id="patient.name"
                  name="patient.name"
                  value={currentAppointment.patient.name}
                  onChange={handleInputChange}
                  placeholder="Nom complet du patient"
                  className={styles.formControl}
                  required
                />
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="patient.email">Email</label>
                  <input
                    type="email"
                    id="patient.email"
                    name="patient.email"
                    value={currentAppointment.patient.email}
                    onChange={handleInputChange}
                    placeholder="Email du patient"
                    className={styles.formControl}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="patient.phone">Téléphone</label>
                  <input
                    type="tel"
                    id="patient.phone"
                    name="patient.phone"
                    value={currentAppointment.patient.phone}
                    onChange={handleInputChange}
                    placeholder="Numéro de téléphone"
                    className={styles.formControl}
                  />
                </div>
              </div>
            </div>
            
            <div className={styles.formSection}>
              <h4>
                <FaNotesMedical /> Informations nutritionnelles
              </h4>
              <div className={styles.formGroup}>
                <label htmlFor="nutritionInfo.objective">Objectif nutritionnel</label>
                <input
                  type="text"
                  id="nutritionInfo.objective"
                  name="nutritionInfo.objective"
                  value={currentAppointment.nutritionInfo.objective}
                  onChange={handleInputChange}
                  placeholder="Perte de poids, prise de masse, etc."
                  className={styles.formControl}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="nutritionInfo.specificDiet">Régime spécifique</label>
                <select
                  id="nutritionInfo.specificDiet"
                  name="nutritionInfo.specificDiet"
                  value={currentAppointment.nutritionInfo.specificDiet}
                  onChange={handleInputChange}
                  className={styles.formControl}
                >
                  <option value="">Aucun régime spécifique</option>
                  <option value="vegetarian">Végétarien</option>
                  <option value="vegan">Végétalien</option>
                  <option value="gluten-free">Sans gluten</option>
                  <option value="lactose-free">Sans lactose</option>
                  <option value="keto">Keto</option>
                  <option value="paleo">Paléo</option>
                  <option value="low-carb">Faible en glucides</option>
                  <option value="high-protein">Riche en protéines</option>
                  <option value="mediterranean">Méditerranéen</option>
                  <option value="other">Autre (préciser dans les notes)</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="nutritionInfo.notes">Notes nutritionnelles</label>
                <textarea
                  id="nutritionInfo.notes"
                  name="nutritionInfo.notes"
                  value={currentAppointment.nutritionInfo.notes}
                  onChange={handleInputChange}
                  placeholder="Notes additionnelles concernant la nutrition"
                  className={styles.formControl}
                  rows="3"
                />
              </div>
            </div>
            
            <div className={styles.formSection}>
              <h4>Détails du rendez-vous</h4>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="type">Type de rendez-vous</label>
                  <div className={styles.buttonGroup}>
                    <button
                      type="button"
                      className={`${styles.typeButton} ${currentAppointment.type === 'in-person' ? styles.active : ''}`}
                      onClick={() => setCurrentAppointment({ ...currentAppointment, type: 'in-person' })}
                    >
                      <FaUser /> En personne
                    </button>
                    <button
                      type="button"
                      className={`${styles.typeButton} ${currentAppointment.type === 'video' ? styles.active : ''}`}
                      onClick={() => setCurrentAppointment({ ...currentAppointment, type: 'video' })}
                    >
                      <FaVideo /> Visio
                    </button>
                    <button
                      type="button"
                      className={`${styles.typeButton} ${currentAppointment.type === 'phone' ? styles.active : ''}`}
                      onClick={() => setCurrentAppointment({ ...currentAppointment, type: 'phone' })}
                    >
                      <FaPhone /> Téléphone
                    </button>
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="status">Statut</label>
                  <select
                    id="status"
                    name="status"
                    value={currentAppointment.status}
                    onChange={handleInputChange}
                    className={styles.formControl}
                  >
                    <option value="pending">En attente</option>
                    <option value="confirmed">Confirmé</option>
                    <option value="cancelled">Annulé</option>
                    <option value="completed">Terminé</option>
                  </select>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="notes">Notes générales</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={currentAppointment.notes}
                  onChange={handleInputChange}
                  placeholder="Notes supplémentaires concernant ce rendez-vous"
                  className={styles.formControl}
                  rows="3"
                />
              </div>
            </div>
          </div>
          
          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className={styles.saveButton}>
              {isCreateMode ? <><FaPlus /> Créer</> : <><FaSave /> Mettre à jour</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;
