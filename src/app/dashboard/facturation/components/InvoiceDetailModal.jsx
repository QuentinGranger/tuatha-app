"use client";
import React, { useEffect, useRef, useState } from 'react';
import { FiX, FiDownload, FiMail, FiShare2, FiCheckCircle, FiCreditCard, FiAlertCircle, FiClock } from 'react-icons/fi';
import { FaBitcoin, FaPaypal, FaCcVisa } from 'react-icons/fa';
import styles from '../styles/invoiceDetailModal.module.css';
import Portal from '../../../../components/ui/Portal';
import { downloadInvoicePdf } from '../utils/pdfGenerator';
import { generateInvoiceLink } from '../api';

const InvoiceDetailModal = ({ invoice: initialInvoice, isOpen, onClose, onInvoiceUpdate, onSendEmail }) => {
  const modalRef = useRef(null);
  const [invoice, setInvoice] = useState(initialInvoice);
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [message, setMessage] = useState('');

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
    // Empêcher les clics multiples
    if (paymentProcessing) return;
    
    // Afficher l'animation de traitement
    setPaymentProcessing(true);
    
    // Simuler un temps de traitement (dans une vraie application, ce serait un appel API)
    setTimeout(() => {
      const updatedInvoice = { ...invoice, status: 'paid' };
      setInvoice(updatedInvoice);
      setPaymentProcessing(false);
      setPaymentSuccess(true);
      
      // Notification de mise à jour au parent (InvoiceList)
      if (onInvoiceUpdate) {
        onInvoiceUpdate(updatedInvoice);
      }
      
      // Réinitialiser l'état de succès après 3 secondes pour permettre de voir l'animation
      setTimeout(() => {
        setPaymentSuccess(false);
      }, 3000);
    }, 1500);
  };
  
  // Télécharger la facture en PDF
  const downloadPdf = () => {
    const success = downloadInvoicePdf(invoice);
    if (success) {
      setMessage('Facture téléchargée avec succès.');
      setTimeout(() => setMessage(''), 3000); // Masquer le message après 3 secondes
    }
  };
  
  // Envoyer la facture par email au patient
  const sendByEmail = () => {
    // Si une fonction de callback est fournie, l'appeler
    if (onSendEmail) {
      onSendEmail(invoice);
    }
  };
  
  // Partager le lien de la facture
  const shareInvoiceLink = async () => {
    // Générer un lien pour la facture
    const invoiceLink = generateInvoiceLink(invoice);
    
    // Vérifier si l'API Web Share est disponible (navigateurs modernes)
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Facture #${invoice.invoiceNumber || invoice.id}`,
          text: `Voici votre facture pour ${invoice.description || 'votre consultation'} d'un montant de ${formatAmount(invoice.total)}`,
          url: invoiceLink,
        });
        
        // L'API Web Share ne déclenche pas d'erreur en cas de succès mais ne renvoie pas de confirmation
        setMessage('Facture partagée avec succès');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        // L'utilisateur a annulé ou une erreur s'est produite
        if (error.name !== 'AbortError') {
          console.error('Erreur lors du partage :', error);
          // Fallback sur le presse-papiers
          await fallbackToCopyToClipboard(invoiceLink);
        }
      }
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API Web Share
      await fallbackToCopyToClipboard(invoiceLink);
    }
  };
  
  // Méthode de repli si l'API de partage n'est pas disponible
  const fallbackToCopyToClipboard = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      // Afficher une notification de succès
      setShowCopyNotification(true);
      setTimeout(() => setShowCopyNotification(false), 3000);
    } catch (err) {
      console.error('Impossible de copier le lien:', err);
      
      // Dernière tentative - créer un élément temporaire
      try {
        const textArea = document.createElement('textarea');
        textArea.value = link;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (success) {
          setShowCopyNotification(true);
          setTimeout(() => setShowCopyNotification(false), 3000);
        } else {
          throw new Error('Échec de la copie');
        }
      } catch (finalError) {
        alert('Impossible de copier le lien. Veuillez le sélectionner manuellement : ' + link);
      }
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
          <button 
            className={styles.actionButton}
            onClick={downloadPdf}
          >
            <FiDownload size={16} />
            <span>Télécharger PDF</span>
          </button>
          
          <button 
            className={styles.actionButton}
            onClick={sendByEmail}
          >
            <FiMail size={16} />
            <span>Envoyer au patient</span>
          </button>
          
          <button 
            className={styles.actionButton}
            onClick={shareInvoiceLink}
          >
            <FiShare2 size={16} />
            <span>Partager le lien</span>
          </button>
          
          {invoice.status !== 'paid' && (
            <button 
              className={`${styles.actionButton} ${styles.payButton} ${paymentProcessing ? styles.processing : ''} ${paymentSuccess ? styles.success : ''}`}
              onClick={markAsPaid}
              disabled={paymentProcessing}
            >
              {paymentProcessing ? (
                <>
                  <div className={styles.loadingSpinner}></div>
                  <span>Traitement...</span>
                </>
              ) : paymentSuccess ? (
                <>
                  <FiCheckCircle size={16} />
                  <span>Paiement confirmé !</span>
                </>
              ) : (
                <>
                  <FiCheckCircle size={16} />
                  <span>Marquer comme payée</span>
                </>
              )}
            </button>
          )}
        </div>
        
        {/* Notification de copie réussie */}
        {showCopyNotification && (
          <div className={styles.copyNotification}>
            Le lien a été copié dans le presse-papiers !
          </div>
        )}
        
        {/* Notification de téléchargement/partage réussi */}
        {message && (
          <div className={styles.downloadNotification}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
  
  return <Portal>{modalContent}</Portal>;
};

export default InvoiceDetailModal;
