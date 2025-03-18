"use client";
import React, { useState, useRef, useEffect } from 'react';
import { FiX, FiSend, FiMail, FiCheck, FiAlertCircle } from 'react-icons/fi';
import styles from '../styles/emailInvoiceModal.module.css';
import Portal from '../../../../components/ui/Portal';
import { sendInvoiceByEmail } from '../api';
import { getCurrentUser } from '../../../../services/userService';

const EmailInvoiceModal = ({ invoice, isOpen, onClose, onEmailSent }) => {
  const modalRef = useRef(null);
  const [doctor, setDoctor] = useState(null);
  const [emailData, setEmailData] = useState({
    to: invoice?.patient?.email || '',
    subject: `Facture ${invoice?.id || ''} - ${invoice?.description || 'Consultation'}`,
    message: `Cher/Chère ${invoice?.patient?.name?.split(' ')[0] || 'Patient(e)'},\n\nVeuillez trouver ci-joint votre facture ${invoice?.id || ''} d'un montant de ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(invoice?.total || 0)}.\n\nN'hésitez pas à me contacter pour toute question.\n\nCordialement,\nDr. Sophie Martin`
  });
  const [isSending, setIsSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  // Récupérer les informations du médecin depuis le service utilisateur
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setDoctor(user);
      
      // Construire la signature en fonction des données disponibles
      let signature = 'Dr. Sophie Martin';
      
      if (user.user) {
        // Format API principal (user.user contient les infos de base)
        signature = `${user.title || 'Dr.'} ${user.user.firstName} ${user.user.lastName}`;
      } else if (user.firstName && user.lastName) {
        // Format alternatif
        signature = `${user.title || 'Dr.'} ${user.firstName} ${user.lastName}`;
      } else if (user.name) {
        // Si seulement le nom est disponible
        signature = `${user.title || 'Dr.'} ${user.name}`;
      }
      
      // Mettre à jour la signature du message
      setEmailData(prev => ({
        ...prev,
        message: prev.message.replace(
          /Cordialement,\nDr\. Sophie Martin$/,
          `Cordialement,\n${signature}`
        )
      }));
    }
  }, []);

  useEffect(() => {
    // Mise à jour des champs si l'invoice change
    if (invoice) {
      // Construire la signature en fonction des données disponibles
      let signature = 'Dr. Sophie Martin';
      
      if (doctor) {
        if (doctor.user) {
          // Format API principal (user.user contient les infos de base)
          signature = `${doctor.title || 'Dr.'} ${doctor.user.firstName} ${doctor.user.lastName}`;
        } else if (doctor.firstName && doctor.lastName) {
          // Format alternatif
          signature = `${doctor.title || 'Dr.'} ${doctor.firstName} ${doctor.lastName}`;
        } else if (doctor.name) {
          // Si seulement le nom est disponible
          signature = `${doctor.title || 'Dr.'} ${doctor.name}`;
        }
      }
      
      setEmailData({
        to: invoice.patient?.email || '',
        subject: `Facture ${invoice.id || ''} - ${invoice.description || 'Consultation'}`,
        message: `Cher/Chère ${invoice.patient?.name?.split(' ')[0] || 'Patient(e)'},\n\nVeuillez trouver ci-joint votre facture ${invoice.id || ''} d'un montant de ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(invoice.total || 0)}.\n\nN'hésitez pas à me contacter pour toute question.\n\nCordialement,\n${signature}`
      });
    }
  }, [invoice, doctor]);

  if (!isOpen || !invoice) return null;

  // Fermer avec la touche Escape
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [onClose]);
  
  // Fermer si on clique en dehors
  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  // Gestion du changement des champs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmailData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Envoi de l'email
  const handleSendEmail = async (e) => {
    e.preventDefault();
    
    // Validation de base
    if (!emailData.to) {
      setError("L'adresse email du destinataire est requise.");
      return;
    }
    
    setIsSending(true);
    setError('');
    
    try {
      // On utilise un objet combinant l'invoice et les données du formulaire
      const emailPayload = {
        ...invoice,
        patient: {
          ...invoice.patient,
          email: emailData.to
        },
        emailSubject: emailData.subject,
        emailMessage: emailData.message
      };
      
      const success = await sendInvoiceByEmail(emailPayload);
      
      if (success) {
        setEmailSent(true);
        
        // Notifier le parent que l'email a été envoyé
        if (onEmailSent) {
          onEmailSent(emailPayload);
        }
        
        // Fermer la modale après un délai
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError("Impossible d'envoyer l'email. Veuillez réessayer.");
      }
    } catch (err) {
      console.error("Erreur lors de l'envoi de l'email:", err);
      setError("Une erreur s'est produite lors de l'envoi. Veuillez réessayer.");
    } finally {
      setIsSending(false);
    }
  };

  const modalContent = (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContainer} ref={modalRef}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerInfo}>
            <div className={styles.titleRow}>
              <h2 className={styles.modalTitle}>
                <FiMail className={styles.titleIcon} />
                Envoyer la facture par email
              </h2>
            </div>
            <p className={styles.invoiceInfo}>
              Facture #{invoice.invoiceNumber || invoice.id} - {invoice.description}
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
        
        {/* Contenu du formulaire */}
        <form onSubmit={handleSendEmail} className={styles.emailForm}>
          <div className={styles.formContent}>
            <div className={styles.formGroup}>
              <label htmlFor="to" className={styles.formLabel}>Destinataire</label>
              <input 
                type="email" 
                id="to" 
                name="to" 
                className={styles.formInput}
                value={emailData.to} 
                onChange={handleInputChange}
                placeholder="Email du patient"
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="subject" className={styles.formLabel}>Objet</label>
              <input 
                type="text" 
                id="subject" 
                name="subject" 
                className={styles.formInput}
                value={emailData.subject} 
                onChange={handleInputChange}
                placeholder="Objet de l'email"
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.formLabel}>Message</label>
              <textarea 
                id="message" 
                name="message" 
                className={styles.formTextarea}
                value={emailData.message} 
                onChange={handleInputChange}
                placeholder="Contenu de l'email"
                rows={6}
                required
              />
            </div>
            
            {error && (
              <div className={styles.errorMessage}>
                <FiAlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
          </div>
          
          <div className={styles.actions}>
            <button 
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={isSending || emailSent}
            >
              Annuler
            </button>
            
            <button 
              type="submit"
              className={`${styles.sendButton} ${isSending ? styles.sending : ''} ${emailSent ? styles.sent : ''}`}
              disabled={isSending || emailSent}
            >
              {isSending ? (
                <>
                  <div className={styles.loadingSpinner}></div>
                  <span>Envoi en cours...</span>
                </>
              ) : emailSent ? (
                <>
                  <FiCheck size={18} />
                  <span>Email envoyé !</span>
                </>
              ) : (
                <>
                  <FiSend size={18} />
                  <span>Envoyer l'email</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
  return <Portal>{modalContent}</Portal>;
};

export default EmailInvoiceModal;
