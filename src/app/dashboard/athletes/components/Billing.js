'use client';

import { useState } from 'react';
import styles from './Billing.module.css';

export default function Billing({ patient }) {
  const [activeSection, setActiveSection] = useState('unpaid');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  
  // Données factices pour la démo
  const mockInvoices = [
    {
      id: 'INV-2023-001',
      date: '2023-01-15',
      dueDate: '2023-02-15',
      amount: 75.00,
      description: 'Consultation initiale',
      status: 'paid',
      paidDate: '2023-01-20',
      paymentMethod: 'Carte bancaire'
    },
    {
      id: 'INV-2023-002',
      date: '2023-02-28',
      dueDate: '2023-03-28',
      amount: 55.00,
      description: 'Suivi nutritionnel',
      status: 'paid',
      paidDate: '2023-03-05',
      paymentMethod: 'Virement bancaire'
    },
    {
      id: 'INV-2023-003',
      date: '2023-04-10',
      dueDate: '2023-05-10',
      amount: 65.00,
      description: 'Analyse des performances',
      status: 'unpaid',
      paidDate: null,
      paymentMethod: null
    },
    {
      id: 'INV-2023-004',
      date: '2023-05-22',
      dueDate: '2023-06-22',
      amount: 75.00,
      description: 'Consultation de suivi',
      status: 'unpaid',
      paidDate: null,
      paymentMethod: null
    }
  ];
  
  const unpaidInvoices = mockInvoices.filter(invoice => invoice.status === 'unpaid');
  const paidInvoices = mockInvoices.filter(invoice => invoice.status === 'paid');
  
  const handleCreateInvoice = () => {
    setSelectedInvoice(null);
    setShowInvoiceModal(true);
  };
  
  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };
  
  const handleMarkAsPaid = (invoiceId) => {
    // Dans une application réelle, nous mettrions à jour la base de données ici
    alert(`Facture ${invoiceId} marquée comme payée`);
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  const formatCurrency = (amount) => {
    return amount.toFixed(2).replace('.', ',') + ' €';
  };
  
  const renderUnpaidInvoices = () => {
    if (unpaidInvoices.length === 0) {
      return (
        <div className={styles.emptyState}>
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2"></rect>
            <line x1="2" y1="10" x2="22" y2="10"></line>
          </svg>
          <p style={{ color: '#FFFFFF' }}>Aucune facture en attente</p>
        </div>
      );
    }
    
    return (
      <div className={`${styles.invoicesList} ${styles.overflowContainer}`}>
        {unpaidInvoices.map(invoice => (
          <div key={invoice.id} className={styles.invoiceCard}>
            <div className={styles.invoiceHeader}>
              <div className={styles.invoiceId}>{invoice.id}</div>
              <div className={styles.invoiceStatus}>
                <span className={styles.statusUnpaid} style={{ backgroundColor: '#FFA07A' }}>En attente</span>
              </div>
            </div>
            <div className={styles.invoiceDetails}>
              <div className={styles.invoiceAmount}>{formatCurrency(invoice.amount)}</div>
              <div className={styles.invoiceDesc}>{invoice.description}</div>
              <div className={styles.invoiceDates}>
                <div>
                  <span className={styles.dateLabel}>Émise le:</span> {formatDate(invoice.date)}
                </div>
                <div>
                  <span className={styles.dateLabel}>Échéance:</span> {formatDate(invoice.dueDate)}
                </div>
              </div>
            </div>
            <div className={styles.invoiceActions}>
              <button 
                className={styles.viewButton} 
                onClick={() => handleViewInvoice(invoice)}
              >
                Voir détails
              </button>
              <button 
                className={styles.paidButton} 
                onClick={() => handleMarkAsPaid(invoice.id)}
              >
                Marquer comme payée
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  const renderPaidInvoices = () => {
    if (paidInvoices.length === 0) {
      return (
        <div className={styles.emptyState}>
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#32CD32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2"></rect>
            <line x1="2" y1="10" x2="22" y2="10"></line>
          </svg>
          <p style={{ color: '#FFFFFF' }}>Aucune facture payée</p>
        </div>
      );
    }
    
    return (
      <div className={`${styles.invoicesList} ${styles.overflowContainer}`}>
        {paidInvoices.map(invoice => (
          <div key={invoice.id} className={styles.invoiceCard}>
            <div className={styles.invoiceHeader}>
              <div className={styles.invoiceId}>{invoice.id}</div>
              <div className={styles.invoiceStatus}>
                <span className={styles.statusPaid} style={{ backgroundColor: '#32CD32' }}>Payée</span>
              </div>
            </div>
            <div className={styles.invoiceDetails}>
              <div className={styles.invoiceAmount}>{formatCurrency(invoice.amount)}</div>
              <div className={styles.invoiceDesc}>{invoice.description}</div>
              <div className={styles.invoiceDates}>
                <div>
                  <span className={styles.dateLabel}>Émise le:</span> {formatDate(invoice.date)}
                </div>
                <div>
                  <span className={styles.dateLabel}>Payée le:</span> {formatDate(invoice.paidDate)}
                </div>
              </div>
              <div className={styles.paymentMethod}>
                <span className={styles.methodLabel}>Méthode de paiement:</span> {invoice.paymentMethod}
              </div>
            </div>
            <div className={styles.invoiceActions}>
              <button 
                className={styles.viewButton} 
                onClick={() => handleViewInvoice(invoice)}
              >
                Voir détails
              </button>
              <button 
                className={styles.downloadButton}
                onClick={() => alert(`Téléchargement de la facture ${invoice.id}`)}
              >
                Télécharger PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  if (!patient) {
    return <div className={styles.emptyState}>Veuillez sélectionner un patient</div>;
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          <h3>Gestion des factures</h3>
          <p className={styles.subtitle}>Gérez les factures et les paiements pour {patient.firstName} {patient.lastName}</p>
        </div>
        <button className={styles.createButton} onClick={handleCreateInvoice}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
            <line x1="12" y1="15" x2="12" y2="19"></line>
            <line x1="10" y1="17" x2="14" y2="17"></line>
          </svg>
          Créer une facture
        </button>
      </div>
      
      <div className={styles.tabs}>
        <button 
          className={`${styles.tabButton} ${activeSection === 'unpaid' ? styles.activeTab : ''}`}
          onClick={() => setActiveSection('unpaid')}
        >
          Factures à payer ({unpaidInvoices.length})
        </button>
        <button 
          className={`${styles.tabButton} ${activeSection === 'paid' ? styles.activeTab : ''}`}
          onClick={() => setActiveSection('paid')}
        >
          Factures payées ({paidInvoices.length})
        </button>
      </div>
      
      <div className={styles.content}>
        {activeSection === 'unpaid' ? renderUnpaidInvoices() : renderPaidInvoices()}
      </div>
      
      {showInvoiceModal && (
        <div className={styles.modalOverlay} onClick={() => setShowInvoiceModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{selectedInvoice ? `Facture ${selectedInvoice.id}` : 'Créer une nouvelle facture'}</h3>
              <button className={styles.closeButton} onClick={() => setShowInvoiceModal(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className={styles.modalContent}>
              {selectedInvoice ? (
                // Affichage détaillé de la facture
                <div className={styles.invoiceDetail}>
                  <div className={styles.detailRow}>
                    <div className={styles.detailLabel}>Numéro de facture</div>
                    <div className={styles.detailValue}>{selectedInvoice.id}</div>
                  </div>
                  <div className={styles.detailRow}>
                    <div className={styles.detailLabel}>Statut</div>
                    <div className={styles.detailValue}>
                      <span className={selectedInvoice.status === 'paid' ? styles.statusPaid : styles.statusUnpaid}>
                        {selectedInvoice.status === 'paid' ? 'Payée' : 'En attente'}
                      </span>
                    </div>
                  </div>
                  <div className={styles.detailRow}>
                    <div className={styles.detailLabel}>Description</div>
                    <div className={styles.detailValue}>{selectedInvoice.description}</div>
                  </div>
                  <div className={styles.detailRow}>
                    <div className={styles.detailLabel}>Montant</div>
                    <div className={styles.detailValue}>{formatCurrency(selectedInvoice.amount)}</div>
                  </div>
                  <div className={styles.detailRow}>
                    <div className={styles.detailLabel}>Date d'émission</div>
                    <div className={styles.detailValue}>{formatDate(selectedInvoice.date)}</div>
                  </div>
                  {selectedInvoice.status === 'paid' ? (
                    <>
                      <div className={styles.detailRow}>
                        <div className={styles.detailLabel}>Date de paiement</div>
                        <div className={styles.detailValue}>{formatDate(selectedInvoice.paidDate)}</div>
                      </div>
                      <div className={styles.detailRow}>
                        <div className={styles.detailLabel}>Méthode de paiement</div>
                        <div className={styles.detailValue}>{selectedInvoice.paymentMethod}</div>
                      </div>
                    </>
                  ) : (
                    <div className={styles.detailRow}>
                      <div className={styles.detailLabel}>Date d'échéance</div>
                      <div className={styles.detailValue}>{formatDate(selectedInvoice.dueDate)}</div>
                    </div>
                  )}
                </div>
              ) : (
                // Formulaire de création de facture
                <div className={styles.invoiceForm}>
                  <div className={styles.formGroup}>
                    <label htmlFor="description">Description</label>
                    <input 
                      type="text" 
                      id="description" 
                      className={styles.input} 
                      placeholder="Ex: Consultation initiale"
                    />
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="amount">Montant (€)</label>
                      <input 
                        type="number" 
                        id="amount" 
                        className={styles.input} 
                        min="0" 
                        step="0.01" 
                        placeholder="0,00"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="dueDate">Date d'échéance</label>
                      <input 
                        type="date" 
                        id="dueDate" 
                        className={styles.input} 
                      />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="notes">Notes additionnelles</label>
                    <textarea 
                      id="notes" 
                      className={styles.textarea} 
                      rows="3"
                      placeholder="Informations complémentaires pour cette facture..."
                    ></textarea>
                  </div>
                </div>
              )}
            </div>
            <div className={styles.modalFooter}>
              {selectedInvoice ? (
                <div className={styles.modalActions}>
                  {selectedInvoice.status === 'unpaid' && (
                    <button 
                      className={styles.paidButton} 
                      onClick={() => {
                        handleMarkAsPaid(selectedInvoice.id);
                        setShowInvoiceModal(false);
                      }}
                    >
                      Marquer comme payée
                    </button>
                  )}
                  <button 
                    className={styles.downloadButton}
                    onClick={() => alert(`Téléchargement de la facture ${selectedInvoice.id}`)}
                  >
                    Télécharger PDF
                  </button>
                </div>
              ) : (
                <div className={styles.modalActions}>
                  <button className={styles.cancelButton} onClick={() => setShowInvoiceModal(false)}>
                    Annuler
                  </button>
                  <button 
                    className={styles.createInvoiceButton}
                    onClick={() => {
                      alert('Facture créée avec succès');
                      setShowInvoiceModal(false);
                    }}
                  >
                    Créer la facture
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
