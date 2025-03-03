"use client";

import React, { useState, useEffect } from 'react';
import styles from '../styles/createRecurringPaymentModal.module.css';
import { FiX, FiRepeat, FiUser, FiCalendar, FiDollarSign, FiClock, FiLoader } from 'react-icons/fi';
import { programTypes } from './programTypes';

const CreateRecurringPaymentModal = ({ isOpen, onClose, onCreatePayment }) => {
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

  // Récupérer les patients au chargement de la modale
  useEffect(() => {
    if (isOpen) {
      fetchPatients();
      // Initialiser la date du prochain paiement à la date du jour
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        nextDate: today
      }));
    }
  }, [isOpen]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/patients');
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des patients');
      }
      
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error("Erreur de chargement des patients:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Cas spécial pour la sélection du patient
    if (name === 'patientId' && value) {
      const selectedPatient = patients.find(p => p.id === value);
      if (selectedPatient) {
        setFormData({
          ...formData,
          patientId: value,
          patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`
        });
      }
    } 
    // Cas spécial pour la sélection du type de programme
    else if (name === 'programTypeId' && value) {
      const selectedProgram = programTypes.find(p => p.id === value);
      if (selectedProgram) {
        setFormData({
          ...formData,
          programTypeId: value,
          plan: selectedProgram.name,
          amount: selectedProgram.id === 'custom' ? formData.amount : selectedProgram.amount.toString()
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }

    // Effacer l'erreur lorsque l'utilisateur corrige le champ
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.patientId) {
      newErrors.patientId = 'Veuillez sélectionner un patient';
    }
    
    if (!formData.programTypeId) {
      newErrors.programTypeId = 'Veuillez sélectionner un type de programme';
    }
    
    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Un montant valide est requis';
    }
    
    if (!formData.nextDate) {
      newErrors.nextDate = 'La date du prochain paiement est requise';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const newPayment = {
        id: `SUB-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
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
      onClose();
    }
  };

  const frequencyOptions = ['Mensuel', 'Bimensuel', 'Trimestriel', 'Annuel'];

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            <FiRepeat className={styles.titleIcon} />
            Créer un paiement récurrent
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
              <FiUser className={styles.labelIcon} />
              Type de programme
            </label>
            <select
              name="programTypeId"
              value={formData.programTypeId}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">-- Sélectionner un programme --</option>
              {programTypes.map(program => (
                <option key={program.id} value={program.id}>
                  {program.name} {program.id !== 'custom' ? `(${program.amount} €)` : ''}
                </option>
              ))}
            </select>
            {errors.programTypeId && <span className={styles.error}>{errors.programTypeId}</span>}
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <FiDollarSign className={styles.labelIcon} />
                Montant
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className={styles.input}
                placeholder="0.00"
                min="0"
                step="0.01"
                disabled={formData.programTypeId && formData.programTypeId !== 'custom'}
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
                {frequencyOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
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
              Créer le paiement récurrent
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRecurringPaymentModal;
