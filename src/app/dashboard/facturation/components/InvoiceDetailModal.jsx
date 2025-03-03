"use client";
import React, { useEffect, useRef, useState } from 'react';
import { FiX, FiDownload, FiMail, FiShare2, FiCheckCircle, FiCreditCard, FiAlertCircle, FiClock } from 'react-icons/fi';
import { FaBitcoin, FaPaypal, FaCcVisa } from 'react-icons/fa';
import styles from '../styles/invoiceDetailModal.module.css';
import Portal from '../../../../components/ui/Portal';

const InvoiceDetailModal = ({ invoice: initialInvoice, isOpen, onClose, onInvoiceUpdate }) => {
  const modalRef = useRef(null);
  const [invoice, setInvoice] = useState(initialInvoice);
  
  // Mise à jour du state local quand la prop invoice change
  useEffect(() => {
    setInvoice(initialInvoice);
  }, [initialInvoice]);

  if (!isOpen || !invoice) return null;
  
  // Ajout d'un gestionnaire pour fermer le modal avec Escape
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [onClose]);
  
  // Fermer le modal si on clique en dehors
  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };
  
  // Formater les dates
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };
  
  // Calculer le total
  const calculateTotal = (items) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  };
  
  // Formater le montant
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount || 0);
  };
  
  // Marquer comme payée
  const markAsPaid = () => {
    const updatedInvoice = { ...invoice, status: 'paid' };
    setInvoice(updatedInvoice);
    
    // Notification de mise à jour au parent (InvoiceList)
    if (onInvoiceUpdate) {
      onInvoiceUpdate(updatedInvoice);
    }
  };
  
  // Déterminer les infos de statut
  const getStatusInfo = (status) => {
    switch (status) {
      case 'paid':
        return { 
          label: 'Payée', 
          className: styles.statusPaid, 
          icon: <FiCheckCircle size={16} /> 
        };
      case 'pending':
        return { 
          label: 'En attente', 
          className: styles.statusPending, 
          icon: <FiClock size={16} /> 
        };
      case 'overdue':
        return { 
          label: 'En retard', 
          className: styles.statusOverdue, 
          icon: <FiAlertCircle size={16} /> 
        };
      default:
        return { 
          label: status || 'Inconnu', 
          className: '', 
          icon: <FiAlertCircle size={16} /> 
        };
    }
  };
  
  const statusInfo = getStatusInfo(invoice.status);
  
  const modalContent = (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContainer} ref={modalRef}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerInfo}>
            <div className={styles.titleRow}>
              <h2 className={styles.modalTitle}>
                Facture #{invoice.invoiceNumber || invoice.id}
              </h2>
              <span className={`${styles.statusBadge} ${statusInfo.className}`}>
                {statusInfo.icon}
                <span>{statusInfo.label}</span>
              </span>
            </div>
            <p className={styles.createdDate}>
              Créée le {formatDate(invoice.createdAt || invoice.date)}
            </p>
          </div>
          <button 
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Fermer"
          >
            <FiX size={20} />
          </button>
        </div>
        
        {/* Contenu principal */}
        <div className={styles.modalContent}>
          {/* Résumé de la facture */}
          <div className={styles.infoGrid}>
            <div className={styles.infoGroup}>
              <h3 className={styles.infoLabel}>Client</h3>
              <p className={styles.infoValue}>{invoice.patient?.name || 'Client inconnu'}</p>
              {invoice.patient?.email && (
                <p className={styles.infoSubValue}>{invoice.patient.email}</p>
              )}
              {invoice.patient?.phone && (
                <p className={styles.infoSubValue}>{invoice.patient.phone}</p>
              )}
            </div>
            
            <div className={styles.infoGroup}>
              <h3 className={styles.infoLabel}>Dates</h3>
              <div>
                <span className={styles.infoSubValue}>Émission: </span>
                <span className={styles.infoValue}>{formatDate(invoice.createdAt || invoice.date)}</span>
              </div>
              <div>
                <span className={styles.infoSubValue}>Échéance: </span>
                <span className={styles.infoValue}>{formatDate(invoice.dueDate)}</span>
              </div>
            </div>
            
            <div className={styles.infoGroup}>
              <h3 className={styles.infoLabel}>Récapitulatif</h3>
              <div>
                <span className={styles.infoSubValue}>Montant total: </span>
                <span className={styles.infoValue}>{formatAmount(invoice.total)}</span>
              </div>
              <div>
                <span className={styles.infoSubValue}>Statut: </span>
                <span className={styles.infoValue}>{statusInfo.label}</span>
              </div>
            </div>
            
            <div className={styles.infoGroup}>
              <h3 className={styles.infoLabel}>Moyens de paiement</h3>
              <div className={styles.paymentMethods}>
                <FaCcVisa size={20} className={styles.paymentIcon} title="Carte bancaire" />
                <FaPaypal size={20} className={styles.paymentIcon} title="PayPal" />
                <FiCreditCard size={20} className={styles.paymentIcon} title="Virement bancaire" />
                <FaBitcoin size={20} className={styles.paymentIcon} title="Crypto-monnaie" />
              </div>
            </div>
          </div>
          
          {/* Détails des prestations */}
          <div className={styles.itemsSection}>
            <h3 className={styles.infoLabel}>Détail des prestations</h3>
            <div className={styles.itemsCard}>
              {invoice.items && Array.isArray(invoice.items) && invoice.items.map((item, idx) => (
                <div key={idx} className={styles.itemRow}>
                  <div className={styles.itemDetails}>
                    <p className={styles.itemName}>{item.description}</p>
                    {item.details && <p className={styles.itemSubDetails}>{item.details}</p>}
                  </div>
                  <p className={styles.itemAmount}>{formatAmount(item.amount)}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Récapitulatif des montants */}
          <div className={styles.summarySection}>
            {invoice.tax > 0 && (
              <>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Sous-total</span>
                  <span className={styles.summaryValue}>{formatAmount(calculateTotal(invoice.items))}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>TVA ({invoice.taxRate}%)</span>
                  <span className={styles.summaryValue}>{formatAmount(invoice.tax)}</span>
                </div>
              </>
            )}
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total</span>
              <span className={styles.totalValue}>{formatAmount(invoice.total)}</span>
            </div>
          </div>
          
          {/* Notes et instructions */}
          {invoice.notes && (
            <div className={styles.notesSection}>
              <h3 className={styles.infoLabel}>Notes & Instructions</h3>
              <p className={styles.notesText}>{invoice.notes}</p>
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className={styles.actions}>
          <button className={styles.actionButton}>
            <FiDownload size={16} />
            <span>Télécharger PDF</span>
          </button>
          
          <button className={styles.actionButton}>
            <FiMail size={16} />
            <span>Envoyer au patient</span>
          </button>
          
          <button className={styles.actionButton}>
            <FiShare2 size={16} />
            <span>Partager le lien</span>
          </button>
          
          {invoice.status !== 'paid' && (
            <button 
              className={`${styles.actionButton} ${styles.payButton}`}
              onClick={markAsPaid}
            >
              <FiCheckCircle size={16} />
              <span>Marquer comme payée</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
  
  return <Portal>{modalContent}</Portal>;
};

export default InvoiceDetailModal;
