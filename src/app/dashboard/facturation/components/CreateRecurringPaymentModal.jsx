"use client";

import React, { useState, useEffect } from 'react';
import styles from '../styles/createRecurringPaymentModal.module.css';
import { FiX, FiRepeat, FiUser, FiCalendar, FiDollarSign, FiClock, FiLoader } from 'react-icons/fi';
import { programTypes } from './programTypes';

const CreateRecurringPaymentModal = ({ isOpen, onClose, onCreatePayment, editMode = false, initialData = null }) => {
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    programTypeId: '',
    plan: '',
    amount: '',
    frequency: 'Mensuel',
    nextDate: '',
    active: true
  });

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  // Réinitialiser le formulaire quand la modale s'ouvre ou initialiser avec les données d'édition
  useEffect(() => {
    if (isOpen) {
      if (editMode && initialData) {
        // Si on est en mode édition et qu'on a des données initiales, on les utilise
        setFormData({
          id: initialData.id, // Important pour l'édition
          patientId: initialData.patientId,
          patientName: initialData.patientName,
          programTypeId: initialData.programTypeId,
          plan: initialData.plan,
          amount: initialData.amount.toString(),
          frequency: initialData.frequency,
          nextDate: initialData.nextDate,
          active: initialData.active,
          suspended: initialData.suspended
        });
      } else {
        // Sinon, on réinitialise le formulaire
        setFormData({
          patientId: '',
          patientName: '',
          programTypeId: '',
          plan: '',
          amount: '',
          frequency: 'Mensuel',
          nextDate: '',
          active: true
        });
        
        // Initialiser la date du prochain paiement à la date du jour
        const today = new Date().toISOString().split('T')[0];
        setFormData(prev => ({
          ...prev,
          nextDate: today
        }));
      }
      setErrors({});
    }
  }, [isOpen, editMode, initialData]);

  // Charger les patients depuis l'API
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      // Simule une récupération des données depuis l'API puisque c'est un exemple
      setTimeout(() => {
        // Utiliser les données des patients du fichier seed.mjs
        const mockPatients = [
          {
            id: 'pat-001',
            firstName: 'Bruce',
            lastName: 'Wayne',
            email: 'batman@wayne-enterprises.com'
          },
          {
            id: 'pat-002',
            firstName: 'Izuku',
            lastName: 'Midoriya',
            email: 'deku@ua.edu'
          },
          {
            id: 'pat-003',
            firstName: 'Son',
            lastName: 'Goku',
            email: 'goku@capsule-corp.com'
          },
          {
            id: 'pat-004',
            firstName: 'Tony',
            lastName: 'Stark',
            email: 'tony@stark-industries.com'
          }
        ];
        setPatients(mockPatients);
        setLoading(false);
      }, 1000);
    }
  }, [isOpen]);

  // Mettre à jour le montant en fonction du programme sélectionné
  useEffect(() => {
    if (formData.programTypeId && !editMode) {
      const selectedProgram = programTypes.find(p => p.id === formData.programTypeId);
      if (selectedProgram) {
        setFormData(prev => ({
          ...prev,
          plan: selectedProgram.name,
          amount: selectedProgram.amount
        }));
      }
    }
  }, [formData.programTypeId, editMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'patientId' && value) {
      const selectedPatient = patients.find(p => p.id === value);
      if (selectedPatient) {
        setFormData(prev => ({
          ...prev,
          patientId: value,
          patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Supprimer l'erreur pour ce champ si elle existe
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.patientId) {
      newErrors.patientId = 'Veuillez sélectionner un patient';
    }
    
    if (!formData.programTypeId) {
      newErrors.programTypeId = 'Veuillez sélectionner un programme';
    }
    
    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Veuillez entrer un montant valide';
    }
    
    if (!formData.nextDate) {
      newErrors.nextDate = 'Veuillez sélectionner une date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      if (editMode) {
        // Mode édition - utiliser l'ID existant
        const updatedPayment = {
          ...formData,
          amount: Number(formData.amount),
        };
        
        onCreatePayment(updatedPayment);
      } else {
        // Mode création - générer un nouvel ID
        const paymentId = `SUB-${Math.floor(1000 + Math.random() * 9000)}`;
        
        const newPayment = {
          id: paymentId,
          patientId: formData.patientId,
          patientName: formData.patientName,
          programTypeId: formData.programTypeId,
          plan: formData.plan,
          amount: Number(formData.amount),
          frequency: formData.frequency,
          nextDate: formData.nextDate,
          active: true,
          suspended: false
        };
        
        onCreatePayment(newPayment);
      }
    }
  };

  // Si la modale n'est pas ouverte, ne pas la rendre
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            <FiRepeat className={styles.titleIcon} />
            {editMode ? 'Modifier le paiement récurrent' : 'Créer un paiement récurrent'}
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              <FiUser className={styles.labelIcon} />
              Patient
            </label>
            {loading ? (
              <div className={styles.loadingContainer}>
                <FiLoader className={styles.loadingIcon} />
                <span>Chargement des patients...</span>
              </div>
            ) : (
              <select
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                className={styles.select}
                disabled={editMode} // Désactiver en mode édition
              >
                <option value="">-- Sélectionner un patient --</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.firstName} {patient.lastName}
                  </option>
                ))}
              </select>
            )}
            {errors.patientId && <span className={styles.error}>{errors.patientId}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              <FiRepeat className={styles.labelIcon} />
              Type de programme
            </label>
            <select
              name="programTypeId"
              value={formData.programTypeId}
              onChange={handleChange}
              className={styles.select}
              disabled={editMode} // Désactiver en mode édition
            >
              <option value="">-- Sélectionner un programme --</option>
              {programTypes.map(program => (
                <option key={program.id} value={program.id}>
                  {program.name} ({program.amount}€)
                </option>
              ))}
            </select>
            {errors.programTypeId && <span className={styles.error}>{errors.programTypeId}</span>}
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <FiDollarSign className={styles.labelIcon} />
                Montant (€)
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className={styles.input}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              {errors.amount && <span className={styles.error}>{errors.amount}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <FiClock className={styles.labelIcon} />
                Fréquence
              </label>
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="Hebdomadaire">Hebdomadaire</option>
                <option value="Bimensuel">Bimensuel</option>
                <option value="Mensuel">Mensuel</option>
                <option value="Trimestriel">Trimestriel</option>
                <option value="Semestriel">Semestriel</option>
                <option value="Annuel">Annuel</option>
              </select>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>
              <FiCalendar className={styles.labelIcon} />
              Date du prochain paiement
            </label>
            <input
              type="date"
              name="nextDate"
              value={formData.nextDate}
              onChange={handleChange}
              className={styles.input}
            />
            {errors.nextDate && <span className={styles.error}>{errors.nextDate}</span>}
          </div>
          
          <div className={styles.formActions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className={styles.submitButton}>
              {editMode ? 'Mettre à jour' : 'Créer le paiement récurrent'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRecurringPaymentModal;
