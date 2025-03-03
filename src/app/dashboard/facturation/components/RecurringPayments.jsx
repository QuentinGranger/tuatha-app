"use client";

import React, { useState, useRef, useEffect } from 'react';
import { FiPlus, FiSearch, FiFilter, FiUser, FiCalendar, FiDollarSign, FiClock, FiPause, FiPlay, FiRefreshCw } from 'react-icons/fi';
import styles from '../styles/recurringPayments.module.css';
import CreateRecurringPaymentModal from './CreateRecurringPaymentModal';
import { programTypes } from './programTypes';

const RecurringPayments = () => {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
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
        programTypeId: 'joint-health',
        plan: 'Santé Articulaire',
        amount: 85,
        frequency: 'Bimensuel',
        nextDate: '2024-04-05',
        active: true,
        suspended: true
      }
    ]);
  }, []);

  const handleCreatePayment = (newPayment) => {
    setPayments([newPayment, ...payments]);
  };

  const togglePaymentStatus = (id, isSuspended) => {
    setPayments(payments.map(payment => 
      payment.id === id 
        ? { ...payment, suspended: isSuspended } 
        : payment
    ));
  };
  
  const filteredPayments = payments.filter(payment => 
    payment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.plan.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Paiements récurrents</h2>
        <button 
          className={styles.addButton}
          onClick={() => setShowCreateModal(true)}
        >
          <FiPlus size={20} />
          Créer
        </button>
      </div>
      
      <div className={styles.searchContainer}>
        <div className={styles.searchBox}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Rechercher par patient ou par type de programme..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>
      
      <div className={styles.tableContainer}>
        <table className={styles.paymentsTable}>
          <thead>
            <tr>
              <th>Ref.</th>
              <th>
                <div className={styles.thContent}>
                  <FiUser className={styles.thIcon} />
                  Patient
                </div>
              </th>
              <th>
                <div className={styles.thContent}>
                  <FiRefreshCw className={styles.thIcon} />
                  Programme
                </div>
              </th>
              <th>
                <div className={styles.thContent}>
                  <FiDollarSign className={styles.thIcon} />
                  Montant
                </div>
              </th>
              <th>
                <div className={styles.thContent}>
                  <FiClock className={styles.thIcon} />
                  Fréquence
                </div>
              </th>
              <th>
                <div className={styles.thContent}>
                  <FiCalendar className={styles.thIcon} />
                  Prochain paiement
                </div>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => (
                <tr 
                  key={payment.id} 
                  className={payment.suspended ? styles.suspendedRow : ''}
                >
                  <td className={styles.idCell}>{payment.id}</td>
                  <td>{payment.patientName}</td>
                  <td>{payment.plan}</td>
                  <td className={styles.amountCell}>{formatCurrency(payment.amount)}</td>
                  <td>{payment.frequency}</td>
                  <td className={styles.dateCell}>{formatDate(payment.nextDate)}</td>
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
      
      <CreateRecurringPaymentModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreatePayment={handleCreatePayment}
      />
    </div>
  );
};

export default RecurringPayments;
