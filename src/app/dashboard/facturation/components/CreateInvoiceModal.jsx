"use client";
import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiPlus, FiTrash2, FiCalendar, FiUser, FiFileText, FiSearch } from 'react-icons/fi';
import styles from '../styles/createInvoiceModal.module.css';

const CreateInvoiceModal = ({ isOpen, onClose, onCreateInvoice }) => {
  const modalRef = useRef(null);
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    patientEmail: '',
    dueDate: '',
    items: [{ description: '', amount: '', details: '' }],
    notes: '',
    taxRate: '0'
  });
  
  // Récupérer les patients depuis l'API
  useEffect(() => {
    const fetchPatients = async () => {
      if (isOpen) {
        try {
          setIsLoading(true);
          const response = await fetch('/api/patients');
          if (!response.ok) {
            throw new Error('Erreur lors de la récupération des patients');
          }
          const data = await response.json();
          setPatients(data);
        } catch (error) {
          console.error('Erreur:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchPatients();
  }, [isOpen]);
  
  // Réinitialiser le formulaire quand le modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      setFormData({
        patientId: '',
        patientName: '',
        patientEmail: '',
        dueDate: getNormalizedToday(),
        items: [{ description: '', amount: '', details: '' }],
        notes: '',
        taxRate: '0'
      });
      
      // Ajouter un gestionnaire d'événements pour fermer le modal avec Escape
      const handleEscapeKey = (e) => {
        if (e.key === 'Escape') onClose();
      };
      
      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }
  }, [isOpen, onClose]);
  
  // Fermer le menu déroulant si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showPatientDropdown && !e.target.closest(`.${styles.patientSearchContainer}`)) {
        setShowPatientDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPatientDropdown]);
  
  // Fermer le modal si on clique en dehors
  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };
  
  const getNormalizedToday = () => {
    const today = new Date();
    return today.toISOString().substring(0, 10);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePatientSelect = (e) => {
    const selectedPatientId = e.target.value;
    if (!selectedPatientId) {
      setFormData(prev => ({
        ...prev,
        patientId: '',
        patientName: '',
        patientEmail: ''
      }));
      return;
    }
    
    const selectedPatient = patients.find(patient => patient.id === selectedPatientId);
    if (selectedPatient) {
      setFormData(prev => ({
        ...prev,
        patientId: selectedPatient.id,
        patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
        patientEmail: selectedPatient.email || ''
      }));
    }
  };
  
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };
  
  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', amount: '', details: '' }]
    }));
  };
  
  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const updatedItems = [...formData.items];
      updatedItems.splice(index, 1);
      
      setFormData(prev => ({
        ...prev,
        items: updatedItems
      }));
    }
  };
  
  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => {
      const amount = parseFloat(item.amount) || 0;
      return sum + amount;
    }, 0);
  };
  
  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    const taxRate = parseFloat(formData.taxRate) || 0;
    return subtotal * (taxRate / 100);
  };
  
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    return subtotal + tax;
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.patientId || !formData.patientName) {
      alert('Veuillez sélectionner un patient pour cette facture.');
      return;
    }
    
    const newInvoice = {
      id: `INV-${Date.now().toString().slice(-6)}`,
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      dueDate: formData.dueDate,
      patient: {
        id: formData.patientId,
        name: formData.patientName,
        email: formData.patientEmail,
      },
      items: formData.items,
      notes: formData.notes,
      description: formData.items[0]?.description || 'Services divers',
      taxRate: parseFloat(formData.taxRate) || 0,
      amount: calculateSubtotal(),
      tax: calculateTax(),
      total: calculateTotal(),
      status: 'pending'
    };
    
    onCreateInvoice(newInvoice);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContainer} ref={modalRef}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Créer une nouvelle facture</h2>
          <button 
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Fermer"
          >
            <FiX size={20} />
          </button>
        </div>
        
        {/* Formulaire */}
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          {/* Informations client */}
          <div>
            <h3 className={styles.sectionTitle}>
              <FiUser />
              <span>Informations du patient</span>
            </h3>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Sélectionner un patient *
              </label>
              <select
                className={styles.select}
                value={formData.patientId}
                onChange={handlePatientSelect}
                required
              >
                <option value="">-- Choisir un patient --</option>
                {isLoading ? (
                  <option disabled>Chargement des patients...</option>
                ) : (
                  patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName}
                    </option>
                  ))
                )}
              </select>
            </div>
            
            {formData.patientId && (
              <div className={styles.selectedPatientInfo}>
                <p><strong>Patient:</strong> {formData.patientName}</p>
                {formData.patientEmail && <p><strong>Email:</strong> {formData.patientEmail}</p>}
              </div>
            )}
          </div>
          
          {/* Date d'échéance */}
          <div>
            <h3 className={styles.sectionTitle}>
              <FiCalendar />
              <span>Détails de la facture</span>
            </h3>
            
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Date d'échéance *
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>
            </div>
          </div>
          
          {/* Items de la facture */}
          <div>
            <h3 className={styles.sectionTitle}>
              <FiFileText />
              <span>Prestations</span>
            </h3>
            
            {formData.items.map((item, index) => (
              <div key={index} className={styles.itemRow}>
                <div className={styles.itemDescription}>
                  <label className={styles.label}>
                    Description *
                  </label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    required
                    className={styles.input}
                    placeholder="Prestation"
                  />
                </div>
                
                <div className={styles.itemAmount}>
                  <label className={styles.label}>
                    Montant (€) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.amount}
                    onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                    required
                    className={styles.input}
                    placeholder="0.00"
                  />
                </div>
                
                <button 
                  type="button"
                  onClick={() => removeItem(index)}
                  disabled={formData.items.length <= 1}
                  className={styles.removeButton}
                  aria-label="Supprimer l'élément"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}
            
            <button 
              type="button" 
              onClick={addItem}
              className={styles.addButton}
            >
              <FiPlus size={16} />
              <span>Ajouter une prestation</span>
            </button>
          </div>
          
          {/* Taxes & Notes */}
          <div>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  TVA (20%)
                </label>
                <div className={styles.toggleContainer}>
                  <input
                    type="checkbox"
                    id="taxToggle"
                    className={styles.toggleInput}
                    checked={formData.taxRate === '20'}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        taxRate: e.target.checked ? '20' : '0'
                      }));
                    }}
                  />
                  <label htmlFor="taxToggle" className={styles.toggleLabel}>
                    <span className={styles.toggleButton}></span>
                  </label>
                  <span className={styles.toggleStatus}>
                    {formData.taxRate === '20' ? 'Activée' : 'Désactivée'}
                  </span>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className={styles.textarea}
                  placeholder="Informations supplémentaires..."
                />
              </div>
            </div>
          </div>
          
          {/* Résumé */}
          <div className={styles.summary}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Sous-total:</span>
              <span className={styles.summaryValue}>{formatCurrency(calculateSubtotal())}</span>
            </div>
            
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>TVA ({formData.taxRate}%):</span>
              <span className={styles.summaryValue}>{formatCurrency(calculateTax())}</span>
            </div>
            
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total:</span>
              <span className={styles.totalValue}>{formatCurrency(calculateTotal())}</span>
            </div>
          </div>
        </form>
        
        {/* Actions */}
        <div className={styles.actions}>
          <button 
            type="button" 
            onClick={onClose}
            className={styles.cancelButton}
          >
            Annuler
          </button>
          
          <button 
            type="submit"
            className={styles.submitButton}
            onClick={handleSubmit}
          >
            Créer la facture
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoiceModal;
