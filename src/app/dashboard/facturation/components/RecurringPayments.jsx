"use client";

import React, { useState, useRef, useEffect } from 'react';
import { FiPlus, FiSearch, FiFilter, FiUser, FiCalendar, FiDollarSign, FiClock, FiPause, FiPlay, FiRefreshCw, FiEdit, FiTrash2, FiX } from 'react-icons/fi';
import styles from '../styles/recurringPayments.module.css';
import { programTypes } from './programTypes';

const RecurringPayments = ({ onCreateButtonClick, newRecurringPayment, onEditPayment, onDeletePayment }) => {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef(null);
  
  // Format options
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Données d'exemple - Dans une vraie application, cela viendrait d'une API
  useEffect(() => {
    setPayments([
      {
        id: 'SUB-0001',
        patientId: 'pat-001',
        patientName: 'Bruce Wayne',
        programTypeId: 'nutri-premium',
        plan: 'Programme Nutritionnel Premium',
        amount: 180,
        frequency: 'Mensuel',
        nextDate: '2024-04-10',
        active: true,
        suspended: false
      },
      {
        id: 'SUB-0002',
        patientId: 'pat-002',
        patientName: 'Clark Kent',
        programTypeId: 'sport-performance',
        plan: 'Performance Sportive',
        amount: 150,
        frequency: 'Mensuel',
        nextDate: '2024-04-15',
        active: true,
        suspended: false
      },
      {
        id: 'SUB-0003',
        patientId: 'pat-003',
        patientName: 'Diana Prince',
        programTypeId: 'nutri-basic',
        plan: 'Suivi Nutritionnel Basique',
        amount: 90,
        frequency: 'Mensuel',
        nextDate: '2024-04-05',
        active: false,
        suspended: true
      }
    ]);
  }, []);

  // Ajouter ou mettre à jour un paiement
  useEffect(() => {
    if (newRecurringPayment) {
      setPayments(prev => {
        // Vérifier si ce paiement existe déjà (mise à jour)
        const existingIndex = prev.findIndex(p => p.id === newRecurringPayment.id);
        
        if (existingIndex !== -1) {
          // Mise à jour du paiement existant
          const updatedPayments = [...prev];
          updatedPayments[existingIndex] = newRecurringPayment;
          return updatedPayments;
        } else {
          // Ajout d'un nouveau paiement
          return [newRecurringPayment, ...prev];
        }
      });
    }
  }, [newRecurringPayment]);

  // Gérer la recherche
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Effacer la recherche
  const clearSearch = () => {
    setSearchTerm('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Filtrer les paiements par terme de recherche
  const filteredPayments = payments.filter(payment => {
    if (!searchTerm.trim()) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      payment.patientName.toLowerCase().includes(searchLower) ||
      payment.plan.toLowerCase().includes(searchLower) ||
      formatCurrency(payment.amount).includes(searchTerm) ||
      payment.frequency.toLowerCase().includes(searchLower)
    );
  });

  // Activation/désactivation d'un paiement récurrent
  const togglePaymentStatus = (id, suspend = false) => {
    setPayments(payments.map(payment => {
      if (payment.id === id) {
        return {
          ...payment,
          active: suspend ? false : true,
          suspended: suspend
        };
      }
      return payment;
    }));
  };

  // Gérer la suppression d'un paiement
  const handleDeletePayment = (id) => {
    // Si la prop onDeletePayment existe, l'appeler
    if (onDeletePayment) {
      onDeletePayment(id);
    }
    
    // Également supprimer de l'état local
    setPayments(payments.filter(payment => payment.id !== id));
  };

  // Gérer l'édition d'un paiement
  const handleEditPayment = (payment) => {
    if (onEditPayment) {
      onEditPayment(payment);
    }
  };

  return (
    <div className={styles.recurringPaymentsContainer}>
      <div className={styles.headerSection}>
        <div className={styles.header}>
          <h2 className={styles.title}>Paiements Récurrents</h2>
          <button 
            className={styles.addButton} 
            onClick={onCreateButtonClick}
          >
            <FiPlus size={16} />
            <span>Nouveau</span>
          </button>
        </div>
        
        <div className={styles.searchContainer}>
          <FiSearch className={styles.searchIcon} />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Rechercher un patient, programme..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={handleSearch}
          />
          {searchTerm && (
            <button
              className={styles.clearSearchButton}
              onClick={clearSearch}
              title="Effacer la recherche"
            >
              <FiX size={14} />
            </button>
          )}
        </div>
      </div>
      
      <div className={styles.tableContainer}>
        <table className={styles.paymentsTable}>
          <thead>
            <tr>
              <th><FiUser title="Patient" /></th>
              <th>Programme</th>
              <th><FiDollarSign title="Montant" /></th>
              <th><FiClock title="Fréquence" /></th>
              <th><FiCalendar title="Prochaine date" /></th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map(payment => (
                <tr key={payment.id} className={payment.suspended ? styles.suspendedRow : ''}>
                  <td className={styles.patientCell}>{payment.patientName}</td>
                  <td>{payment.plan}</td>
                  <td className={styles.amountCell}>{formatCurrency(payment.amount)}</td>
                  <td>{payment.frequency}</td>
                  <td>{formatDate(payment.nextDate)}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${payment.suspended ? styles.suspended : payment.active ? styles.active : styles.inactive}`}>
                      {payment.suspended ? 'Suspendu' : payment.active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      {payment.suspended ? (
                        <button 
                          className={`${styles.actionButton} ${styles.resumeButton}`}
                          onClick={() => togglePaymentStatus(payment.id, false)}
                          title="Reprendre les paiements"
                        >
                          <FiPlay size={16} />
                        </button>
                      ) : (
                        <button 
                          className={`${styles.actionButton} ${styles.pauseButton}`}
                          onClick={() => togglePaymentStatus(payment.id, true)}
                          title="Suspendre les paiements"
                        >
                          <FiPause size={16} />
                        </button>
                      )}
                      <button 
                        className={`${styles.actionButton} ${styles.editButton}`}
                        onClick={() => handleEditPayment(payment)}
                        title="Modifier le paiement"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button 
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        onClick={() => handleDeletePayment(payment.id)}
                        title="Supprimer le paiement"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className={styles.emptyState}>
                  Aucun paiement récurrent trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecurringPayments;
