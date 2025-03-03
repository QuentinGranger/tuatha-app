"use client";

import React from 'react';
import styles from '../styles/financialSummary.module.css';
import { FiDollarSign, FiCreditCard, FiClock } from 'react-icons/fi';

const FinancialSummary = () => {
  // Ces valeurs seraient normalement récupérées depuis une API
  const financialData = {
    totalInvoiced: 8750.45,
    totalPaid: 6250.80,
    totalPending: 2499.65,
    pendingCount: 8,
    overdueCount: 3
  };

  // Formatage des montants en euros
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Calcul du pourcentage payé
  const paymentPercentage = Math.round((financialData.totalPaid / financialData.totalInvoiced) * 100);

  return (
    <div className={styles.financialSummaryContainer}>
      <div className={styles.summaryCards}>
        <div className={styles.summaryCard}>
          <div className={styles.cardIcon}>
            <FiDollarSign size={22} />
          </div>
          <div className={styles.cardContent}>
            <h3>Total facturé</h3>
            <div className={styles.amount}>{formatCurrency(financialData.totalInvoiced)}</div>
            <div className={styles.period}>Ce mois-ci</div>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={`${styles.cardIcon} ${styles.iconPaid}`}>
            <FiCreditCard size={22} />
          </div>
          <div className={styles.cardContent}>
            <h3>Total payé</h3>
            <div className={styles.amount}>{formatCurrency(financialData.totalPaid)}</div>
            <div className={styles.period}>{paymentPercentage}% des factures</div>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={`${styles.cardIcon} ${styles.iconPending}`}>
            <FiClock size={22} />
          </div>
          <div className={styles.cardContent}>
            <h3>En attente</h3>
            <div className={styles.amount}>{formatCurrency(financialData.totalPending)}</div>
            <div className={styles.period}>
              {financialData.pendingCount} factures dont {financialData.overdueCount} en retard
            </div>
          </div>
        </div>
      </div>

      <div className={styles.progressContainer}>
        <div className={styles.progressLabel}>
          <span>Taux d'encaissement</span>
          <span>{paymentPercentage}%</span>
        </div>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ width: `${paymentPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default FinancialSummary;
