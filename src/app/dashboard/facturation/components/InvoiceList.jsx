"use client";

import React, { useState, useEffect } from 'react';
import styles from '../styles/invoiceList.module.css';
import { FiPlus, FiDownload, FiEye, FiTrash2, FiEdit, FiCheckCircle, FiClock, FiAlertCircle, FiMail } from 'react-icons/fi';
import InvoiceDetailModal from './InvoiceDetailModal';

const InvoiceList = ({ 
  searchQuery, 
  currentFilter, 
  currentStatus = 'all', 
  currentSort = 'date-desc',
  newInvoice, 
  onInvoicesLoaded 
}) => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceDetailOpen, setInvoiceDetailOpen] = useState(false);
  
  // Exemple de données de factures (normalement issues d'une API)
  const [invoices, setInvoices] = useState([
    {
      id: 'INV-2025-0042',
      invoiceNumber: 'INV-2025-0042',
      patient: {
        name: 'Bruce Wayne',
        email: 'batman@wayne-enterprises.com',
        phone: '+33 6 12 34 56 78',
        avatar: '/img/patient/batman.jpg'
      },
      date: '2025-03-01',
      createdAt: '2025-03-01',
      dueDate: '2025-03-31',
      amount: 125,
      total: 125,
      status: 'paid',
      description: 'Consultation nutritionnelle + suivi mensuel',
      items: [
        { description: 'Consultation nutritionnelle', amount: 80, details: 'Séance de 60 minutes' },
        { description: 'Suivi mensuel', amount: 45, details: 'Accès à la plateforme' }
      ],
      taxRate: 0,
      tax: 0,
      notes: 'Merci pour votre confiance'
    },
    {
      id: 'INV-2025-0041',
      invoiceNumber: 'INV-2025-0041',
      patient: {
        name: 'Tony Stark',
        email: 'tony@stark-industries.com',
        phone: '+33 6 23 45 67 89',
        avatar: '/img/patient/ironman.jpg'
      },
      date: '2025-02-28',
      createdAt: '2025-02-28',
      dueDate: '2025-03-28',
      amount: 180,
      total: 180,
      status: 'pending',
      description: 'Bilan nutritionnel complet',
      items: [
        { description: 'Bilan nutritionnel complet', amount: 180, details: 'Analyse corporelle et conseils personnalisés' }
      ],
      taxRate: 0,
      tax: 0,
      notes: 'Paiement attendu sous 30 jours'
    },
    {
      id: 'INV-2025-0039',
      invoiceNumber: 'INV-2025-0039',
      patient: {
        name: 'Peter Parker',
        email: 'spidey@daily-bugle.com',
        avatar: '/img/patient/spiderman.jpg'
      },
      date: '2025-02-25',
      createdAt: '2025-02-25',
      dueDate: '2025-03-25',
      amount: 95,
      total: 95,
      status: 'overdue',
      description: 'Consultation de suivi',
      items: [
        { description: 'Consultation de suivi', amount: 95, details: 'Séance de 45 minutes' }
      ],
      taxRate: 0,
      tax: 0
    },
    {
      id: 'INV-2025-0036',
      invoiceNumber: 'INV-2025-0036',
      patient: {
        name: 'Diana Prince',
        email: 'wonder@themyscira.com',
        avatar: '/img/patient/wonderwoman.jpg'
      },
      date: '2025-02-22',
      createdAt: '2025-02-22',
      dueDate: '2025-03-22',
      amount: 150,
      total: 150,
      status: 'paid',
      description: 'Programme nutritionnel personnalisé',
      items: [
        { description: 'Programme nutritionnel personnalisé', amount: 150, details: 'Plan sur 3 mois' }
      ],
      taxRate: 0,
      tax: 0,
      notes: 'Merci pour votre confiance'
    },
    {
      id: 'INV-2025-0032',
      invoiceNumber: 'INV-2025-0032',
      patient: {
        name: 'Naruto Uzumaki',
        email: 'naruto@konoha.gov',
        avatar: '/img/patient/naruto.jpg'
      },
      date: '2025-02-18',
      createdAt: '2025-02-18',
      dueDate: '2025-03-18',
      amount: 85,
      total: 85,
      status: 'pending',
      description: 'Consultation et plan de récupération',
      items: [
        { description: 'Consultation nutritionnelle', amount: 60, details: 'Séance de 30 minutes' },
        { description: 'Plan de récupération', amount: 25, details: 'Après entrainement intensif' }
      ],
      taxRate: 0,
      tax: 0
    }
  ]);

  // Effet pour ajouter une nouvelle facture lorsque c'est demandé
  useEffect(() => {
    if (newInvoice) {
      setInvoices(prevInvoices => {
        const updatedInvoices = [newInvoice, ...prevInvoices];
        if (onInvoicesLoaded) {
          onInvoicesLoaded(updatedInvoices);
        }
        return updatedInvoices;
      });
    }
  }, [newInvoice, onInvoicesLoaded]);

  // Partager les données des factures avec le composant parent lors du premier rendu
  useEffect(() => {
    if (onInvoicesLoaded) {
      onInvoicesLoaded(invoices);
    }
  }, [onInvoicesLoaded]);

  // Formater la date en format français
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Formatage des montants en euros
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Filtrer les factures en fonction de la recherche
  const filteredInvoices = invoices.filter(invoice => {
    const searchString = searchQuery.toLowerCase();
    
    // Si la recherche est vide, on montre tout
    if (!searchString) return true;
    
    // Vérifier si l'invoice a tous les champs nécessaires
    const patientName = invoice.patient?.name || '';
    const patientEmail = invoice.patient?.email || '';
    
    // Recherche dans le nom du patient, l'ID de la facture ou le montant
    return (
      patientName.toLowerCase().includes(searchString) ||
      patientEmail.toLowerCase().includes(searchString) ||
      invoice.id.toLowerCase().includes(searchString) ||
      invoice.amount.toString().includes(searchString) ||
      invoice.description.toLowerCase().includes(searchString)
    );
  });

  // Filtrer par période et statut
  const getFilteredByPeriodAndStatus = () => {
    console.log('Total invoices avant filtrage:', invoices.length);
    console.log('Statut actuel:', currentStatus);
    console.log('Filtre actuel:', currentFilter);
    
    const now = new Date();
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const quarterMonth = Math.floor(now.getMonth() / 3) * 3;
    const quarterStart = new Date(now.getFullYear(), quarterMonth, 1);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Filtrer d'abord par période
    let filtered = filteredInvoices;
    console.log('Après filtrage par recherche:', filtered.length);
    
    switch(currentFilter) {
      case 'year':
        filtered = filtered.filter(invoice => new Date(invoice.date) >= yearStart);
        console.log('Après filtrage par année:', filtered.length);
        break;
      case 'quarter':
        filtered = filtered.filter(invoice => new Date(invoice.date) >= quarterStart);
        console.log('Après filtrage par trimestre:', filtered.length);
        break;
      case 'month':
        filtered = filtered.filter(invoice => new Date(invoice.date) >= monthStart);
        console.log('Après filtrage par mois:', filtered.length);
        break;
      default:
        // 'all' ne filtre pas par période
        console.log('Pas de filtrage par période (all)');
        break;
    }
    
    // Ensuite filtrer par statut, seulement si c'est un statut valide
    if (currentStatus && currentStatus !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === currentStatus);
      console.log('Après filtrage par statut:', filtered.length);
    } else {
      console.log('Pas de filtrage par statut (all)');
    }
    
    // Vérifier les résultats avant de les retourner
    console.log('Nombre final de factures après filtrage:', filtered.length);
    
    // Trier les factures
    return sortInvoices(filtered);
  };
  
  // Fonction pour trier les factures
  const sortInvoices = (invoicesToSort) => {
    return [...invoicesToSort].sort((a, b) => {
      switch (currentSort) {
        case 'date-asc':
          return new Date(a.date) - new Date(b.date);
        case 'date-desc':
          return new Date(b.date) - new Date(a.date);
        case 'amount-asc':
          return a.amount - b.amount;
        case 'amount-desc':
          return b.amount - a.amount;
        default:
          return new Date(b.date) - new Date(a.date); // Par défaut, les plus récentes d'abord
      }
    });
  };

  const invoicesToShow = getFilteredByPeriodAndStatus();

  // Fonction pour obtenir les informations de statut
  const getStatusInfo = (status) => {
    switch(status) {
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

  // Fonction pour ouvrir le modal de détail de facture
  const openInvoiceDetail = (invoice) => {
    setSelectedInvoice(invoice);
    setInvoiceDetailOpen(true);
  };

  // Fonction pour mettre à jour une facture
  const handleInvoiceUpdate = (updatedInvoice) => {
    const updatedInvoices = invoices.map(invoice => 
      invoice.id === updatedInvoice.id ? updatedInvoice : invoice
    );
    setInvoices(updatedInvoices);
  };

  // Fermer le modal
  const closeInvoiceDetail = () => {
    setInvoiceDetailOpen(false);
  };

  return (
    <div className={styles.invoiceListContainer}>
      <div className={styles.listHeader}>
        <h2 className={styles.listTitle}>
          Factures
          {currentFilter === 'month' 
            ? ' du mois' 
            : currentFilter === 'quarter' 
              ? ' du trimestre' 
              : currentFilter === 'year' 
                ? ' de l\'année' 
                : ''}
        </h2>
        <div className={styles.invoiceCount}>
          {invoicesToShow.length} facture{invoicesToShow.length > 1 ? 's' : ''}
        </div>
      </div>
      
      {invoicesToShow.length > 0 ? (
        <div className={styles.tableWrapper}>
          <table className={styles.invoiceTable}>
            <thead>
              <tr>
                <th>N° Facture</th>
                <th>Patient</th>
                <th>Description</th>
                <th>Date</th>
                <th>Échéance</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoicesToShow.map((invoice) => {
                const statusInfo = getStatusInfo(invoice.status);
                
                return (
                  <tr 
                    key={invoice.id} 
                    className={styles.invoiceRow}
                    onClick={() => openInvoiceDetail(invoice)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td className={styles.invoiceId}>{invoice.id}</td>
                    <td>
                      <div className={styles.patientInfo}>
                        <div className={styles.patientAvatar}>
                          {invoice.patient && invoice.patient.avatar ? (
                            <img src={invoice.patient.avatar} alt={invoice.patient.name} />
                          ) : (
                            <span>{invoice.patient && invoice.patient.name ? invoice.patient.name.charAt(0) : 'U'}</span>
                          )}
                        </div>
                        <div className={styles.patientDetails}>
                          <div className={styles.patientName}>{invoice.patient?.name || 'Patient inconnu'}</div>
                          <div className={styles.patientEmail}>{invoice.patient?.email || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td>{invoice.description}</td>
                    <td>{formatDate(invoice.date)}</td>
                    <td>{formatDate(invoice.dueDate)}</td>
                    <td className={styles.amountCell}>
                      {formatCurrency(invoice.amount)}
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${statusInfo.className}`}>
                        {statusInfo.icon}
                        <span>{statusInfo.label}</span>
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button 
                          className={styles.actionButton}
                          title="Voir le détail"
                        >
                          <FiEye size={16} />
                        </button>
                        <button 
                          className={styles.actionButton}
                          title="Envoyer par email"
                        >
                          <FiMail size={16} />
                        </button>
                        <button 
                          className={styles.actionButton}
                          title="Télécharger"
                        >
                          <FiDownload size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <FiClock size={40} className={styles.emptyIcon} />
          <h3>Aucune facture trouvée</h3>
          <p>Aucune facture ne correspond à vos critères de recherche pour cette période.</p>
        </div>
      )}
      
      {invoiceDetailOpen && selectedInvoice && (
        <InvoiceDetailModal 
          invoice={selectedInvoice}
          isOpen={invoiceDetailOpen}
          onClose={closeInvoiceDetail}
          onInvoiceUpdate={handleInvoiceUpdate}
        />
      )}
    </div>
  );
};

export default InvoiceList;
