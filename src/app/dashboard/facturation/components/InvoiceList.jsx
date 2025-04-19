"use client";

import React, { useState, useEffect } from 'react';
import styles from '../styles/invoiceList.module.css';
import { FiPlus, FiDownload, FiEye, FiTrash2, FiEdit, FiCheckCircle, FiClock, FiAlertCircle, FiMail, FiUpload, FiDatabase, FiFileText } from 'react-icons/fi';
import InvoiceDetailModal from './InvoiceDetailModal';
import EmailInvoiceModal from './EmailInvoiceModal';
import { downloadInvoicePdf } from '../utils/pdfGenerator';
import { sendInvoiceByEmail } from '../api';

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
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [selectedInvoiceForEmail, setSelectedInvoiceForEmail] = useState(null);
  const [downloadMessage, setDownloadMessage] = useState('');
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
      notes: 'Merci pour votre confiance',
      isImported: false
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
      notes: 'Paiement attendu sous 30 jours',
      isImported: false
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
      tax: 0,
      isImported: false
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
      notes: 'Merci pour votre confiance',
      isImported: false
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
      tax: 0,
      isImported: false
    }
  ]);
  
  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [sendingEmails, setSendingEmails] = useState({});

  // Effet pour ajouter une nouvelle facture créée
  useEffect(() => {
    if (newInvoice) {
      // Vérifier si c'est un lot d'importation de factures
      if (newInvoice.isBatchImport && Array.isArray(newInvoice.invoices)) {
        // Ajouter toutes les factures du lot au début de la liste
        setInvoices(prevInvoices => {
          // Filtrer les factures déjà existantes pour éviter les doublons
          const newInvoices = newInvoice.invoices.filter(
            invoice => !prevInvoices.some(existing => existing.id === invoice.id)
          );
          return [...newInvoices, ...prevInvoices];
        });
      } else {
        // Gestion normale d'une seule facture
        // Vérifier que la facture n'est pas déjà dans la liste
        const exists = invoices.some(invoice => invoice.id === newInvoice.id);
        if (!exists) {
          // Ajouter la nouvelle facture au début de la liste
          setInvoices(prevInvoices => [newInvoice, ...prevInvoices]);
        }
      }
    }
  }, [newInvoice]);

  // Transmettre les factures au composant parent (page.js)
  useEffect(() => {
    if (onInvoicesLoaded) {
      onInvoicesLoaded(invoices);
    }
  }, [invoices, onInvoicesLoaded]);

  // Formatage des dates
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    try {
      // Vérifier si c'est une date valide
      const date = new Date(dateString);
      
      // Si la date est invalide, retourner un tiret
      if (isNaN(date.getTime())) {
        console.warn(`Date invalide: ${dateString}`);
        return '-';
      }
      
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }).format(date);
    } catch (err) {
      console.error(`Erreur lors du formatage de la date ${dateString}:`, err);
      return '-';
    }
  };

  // Formatage des montants en euros
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Fonction pour trier les factures
  const sortInvoices = (invoices, field, direction) => {
    return [...invoices].sort((a, b) => {
      // Transformer les valeurs selon le type de champ
      let valueA, valueB;
      
      if (field === 'date' || field === 'dueDate') {
        valueA = new Date(a[field] || 0);
        valueB = new Date(b[field] || 0);
      } else if (field === 'amount') {
        valueA = parseFloat(a[field] || 0);
        valueB = parseFloat(b[field] || 0);
      } else if (field === 'patient') {
        valueA = a.patient?.name || '';
        valueB = b.patient?.name || '';
      } else {
        valueA = a[field] || '';
        valueB = b[field] || '';
      }

      // Comparer les valeurs selon la direction
      if (direction === 'asc') {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      }
    });
  };

  // Fonction pour changer le tri
  const handleSort = (field) => {
    // Si on clique sur le même champ, on inverse la direction
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Sinon on trie sur le nouveau champ en descendant
      setSortField(field);
      setSortDirection('desc');
    }
    
    // Revenir à la première page quand on change le tri
    setCurrentPage(1);
  };

  // Filtrer les factures en fonction de la recherche
  const filteredInvoices = Array.isArray(invoices) ? invoices.filter(invoice => {
    const searchString = searchQuery.toLowerCase();
    
    // Si la recherche est vide, on retourne toutes les factures
    if (!searchString) return true;
    
    // Rechercher dans les différents champs
    return (
      (invoice.patient?.name?.toLowerCase().includes(searchString)) ||
      (invoice.id?.toLowerCase().includes(searchString)) ||
      (invoice.invoiceNumber?.toLowerCase().includes(searchString)) ||
      (invoice.amount?.toString().includes(searchString)) ||
      (invoice.description?.toLowerCase().includes(searchString))
    );
  }) : [];

  // Appliquer le filtre de période
  const getFilteredByPeriod = (invoices) => {
    const now = new Date();
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const quarterMonth = Math.floor(now.getMonth() / 3) * 3;
    const quarterStart = new Date(now.getFullYear(), quarterMonth, 1);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    switch(currentFilter) {
      case 'year':
        return Array.isArray(invoices) ? invoices.filter(invoice => new Date(invoice.date) >= yearStart) : [];
      case 'quarter':
        return Array.isArray(invoices) ? invoices.filter(invoice => new Date(invoice.date) >= quarterStart) : [];
      case 'month':
        return Array.isArray(invoices) ? invoices.filter(invoice => new Date(invoice.date) >= monthStart) : [];
      default:
        return invoices; // 'all' ne filtre pas par période
    }
  };
  
  // Appliquer le filtre de statut
  const getFilteredByStatus = (invoices) => {
    if (currentStatus && currentStatus !== 'all') {
      return Array.isArray(invoices) ? invoices.filter(invoice => invoice.status === currentStatus) : [];
    }
    return invoices;
  };
  
  // Appliquer le tri basé sur currentSort
  const getSortedInvoices = (invoices) => {
    // Convertir currentSort en nos paramètres internes sortField et sortDirection
    let field = 'date';
    let direction = 'desc';
    
    switch(currentSort) {
      case 'date-asc':
        field = 'date';
        direction = 'asc';
        break;
      case 'date-desc':
        field = 'date';
        direction = 'desc';
        break;
      case 'amount-asc':
        field = 'amount';
        direction = 'asc';
        break;
      case 'amount-desc':
        field = 'amount';
        direction = 'desc';
        break;
      default:
        field = 'date';
        direction = 'desc';
    }
    
    // Mettre à jour les états internes pour refléter le tri externe
    if (sortField !== field) {
      setSortField(field);
    }
    if (sortDirection !== direction) {
      setSortDirection(direction);
    }
    
    return Array.isArray(invoices) ? sortInvoices(invoices, field, direction) : [];
  };

  // Fonction pour exporter les factures en CSV
  const exportToCSV = () => {
    // Utiliser les factures filtrées et triées actuelles
    const dataToExport = sortedInvoices;
    
    // Définir les en-têtes du CSV
    const headers = [
      "Numéro de facture", 
      "Patient", 
      "Description", 
      "Date", 
      "Date d'échéance", 
      "Montant", 
      "Statut"
    ];
    
    // Formater les données pour le CSV
    const csvData = Array.isArray(dataToExport) ? dataToExport.map(invoice => {
      return [
        invoice.id || invoice.invoiceNumber || '',
        invoice.patient?.name || '',
        invoice.description || '',
        formatDate(invoice.date) || '',
        formatDate(invoice.dueDate) || '',
        invoice.amount ? `${invoice.amount} €` : '',
        invoice.status || ''
      ];
    }) : [];
    
    // Ajouter les en-têtes au début
    csvData.unshift(headers);
    
    // Convertir en texte CSV
    const csvString = Array.isArray(csvData) ? csvData.map(row => row.map(cell => {
      // Échapper les virgules, les guillemets et autres caractères spéciaux
      if (cell && (cell.includes(',') || cell.includes('"') || cell.includes('\n'))) {
        return `"${cell.replace(/"/g, '""')}"`;
      }
      return cell;
    }).join(',')).join('\n') : '';
    
    // Créer un blob avec le bon type MIME
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    
    // Créer une URL pour le blob
    const url = URL.createObjectURL(blob);
    
    // Créer un lien pour télécharger
    const link = document.createElement('a');
    link.setAttribute('href', url);
    
    // Nom du fichier avec la date actuelle
    const dateStr = new Date().toLocaleDateString('fr-FR').replace(/\//g, '-');
    link.setAttribute('download', `factures-tuatha-${dateStr}.csv`);
    
    // Ajouter le lien au document, cliquer dessus, puis le retirer
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Libérer l'URL de l'objet
    URL.revokeObjectURL(url);
    
    // Afficher un message de confirmation
    setDownloadMessage('Factures exportées avec succès !');
    setTimeout(() => {
      setDownloadMessage('');
    }, 3000);
  };

  // Chaîner toutes les opérations de filtrage et tri
  const filteredByPeriod = getFilteredByPeriod(filteredInvoices);
  const filteredByStatus = getFilteredByStatus(filteredByPeriod);
  const sortedInvoices = getSortedInvoices(filteredByStatus);
  
  // Ajouter un effet pour revenir à la première page lors d'un changement de filtre
  useEffect(() => {
    setCurrentPage(1);
  }, [currentFilter, currentStatus, currentSort, searchQuery]);

  // Calculer le nombre total de pages et les éléments de la page actuelle
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedInvoices = Array.isArray(sortedInvoices) ? sortedInvoices.slice(indexOfFirstItem, indexOfLastItem) : [];
  const totalPages = Array.isArray(sortedInvoices) ? Math.ceil(sortedInvoices.length / itemsPerPage) : 0;
  
  // Navigation de pagination
  const goToPage = (pageNumber) => {
    // S'assurer que la page est dans les limites
    const page = Math.max(1, Math.min(pageNumber, totalPages));
    setCurrentPage(page);
  };
  
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

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
  
  // Fonction pour obtenir les informations sur la source de la facture
  const getSourceInfo = (isImported) => {
    if (isImported) {
      return {
        label: 'Importée',
        className: styles.sourceImported,
        icon: <FiUpload size={16} />
      };
    } else {
      return {
        label: 'Manuelle',
        className: styles.sourceManual,
        icon: <FiDatabase size={16} />
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
    const updatedInvoices = Array.isArray(invoices) ? invoices.map(invoice => 
      invoice.id === updatedInvoice.id ? updatedInvoice : invoice
    ) : [];
    setInvoices(updatedInvoices);
  };

  // Fermer le modal
  const closeInvoiceDetail = () => {
    setInvoiceDetailOpen(false);
  };

  // Fonction pour télécharger la facture en PDF
  const handleDownloadInvoice = (e, invoice) => {
    e.stopPropagation(); // Empêcher l'ouverture du modal détaillé
    downloadInvoicePdf(invoice);
    setDownloadMessage('Facture téléchargée avec succès !');
    setTimeout(() => {
      setDownloadMessage('');
    }, 3000);
  };

  // Fonction pour envoyer la facture par email
  const handleSendEmail = (e, invoice) => {
    e.stopPropagation(); // Empêcher l'ouverture du modal détaillé
    
    // Ouvrir la modale d'envoi d'email
    setSelectedInvoiceForEmail(invoice);
    setEmailModalOpen(true);
  };

  // Callback quand l'email a été envoyé
  const handleEmailSent = (updatedInvoice) => {
    console.log('Email envoyé avec succès !', updatedInvoice);
    // Vous pourriez ici mettre à jour l'état local si nécessaire
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
        <div className={styles.headerActions}>
          <div className={styles.invoiceCount}>
            {Array.isArray(invoices) ? invoices.length : 0} facture{(Array.isArray(invoices) ? invoices.length : 0) > 1 ? 's' : ''}
          </div>
          {Array.isArray(invoices) && invoices.length > 0 && (
            <button className={styles.exportButton} onClick={exportToCSV} title="Exporter au format CSV">
              <FiFileText size={16} />
              <span>Exporter CSV</span>
            </button>
          )}
        </div>
      </div>
      
      {downloadMessage && (
        <div className={styles.downloadMessage}>
          {downloadMessage}
        </div>
      )}
      
      {Array.isArray(sortedInvoices) && sortedInvoices.length > 0 ? (
        <div className={styles.tableWrapper}>
          <table className={styles.invoiceTable}>
            <thead>
              <tr>
                <th onClick={() => handleSort('id')} className={styles.sortableHeader}>
                  N° Facture {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('patient')} className={styles.sortableHeader}>
                  Patient {sortField === 'patient' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('description')} className={styles.sortableHeader}>
                  Description {sortField === 'description' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('date')} className={styles.sortableHeader}>
                  Date {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('dueDate')} className={styles.sortableHeader}>
                  Échéance {sortField === 'dueDate' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('amount')} className={styles.sortableHeader}>
                  Montant {sortField === 'amount' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('status')} className={styles.sortableHeader}>
                  Statut {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th>Source</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(paginatedInvoices) ? paginatedInvoices.map((invoice) => {
                const statusInfo = getStatusInfo(invoice.status);
                const sourceInfo = getSourceInfo(invoice.isImported);
                
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
                      <span className={`${styles.sourceBadge} ${sourceInfo.className}`}>
                        {sourceInfo.icon}
                        <span>{sourceInfo.label}</span>
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionButtons} onClick={(e) => e.stopPropagation()}>
                        <button 
                          className={styles.actionButton}
                          title="Voir le détail"
                          onClick={() => openInvoiceDetail(invoice)}
                        >
                          <FiEye size={16} />
                        </button>
                        <button 
                          className={styles.actionButton}
                          title="Envoyer par email"
                          onClick={(e) => handleSendEmail(e, invoice)}
                        >
                          <FiMail size={16} />
                        </button>
                        <button 
                          className={styles.actionButton}
                          title="Télécharger"
                          onClick={(e) => handleDownloadInvoice(e, invoice)}
                        >
                          <FiDownload size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }) : []}
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
      
      {/* Afficher la pagination uniquement s'il y a plus de 5 factures */}
      {Array.isArray(sortedInvoices) && sortedInvoices.length > itemsPerPage && (
        <div className={styles.pagination}>
          <button 
            onClick={goToPreviousPage} 
            disabled={currentPage === 1}
            className={styles.paginationButton}
          >
            &lt;
          </button>
          
          {/* Afficher les numéros de page */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // Logique pour afficher les pages autour de la page courante
            let pageToShow;
            if (totalPages <= 5) {
              // Si on a moins de 5 pages, on les affiche toutes de 1 à totalPages
              pageToShow = i + 1;
            } else if (currentPage <= 3) {
              // Si on est au début, afficher 1, 2, 3, 4, 5
              pageToShow = i + 1;
            } else if (currentPage >= totalPages - 2) {
              // Si on est à la fin, afficher les 5 dernières pages
              pageToShow = totalPages - 4 + i;
            } else {
              // Sinon, afficher currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2
              pageToShow = currentPage - 2 + i;
            }
            
            return (
              <button 
                key={pageToShow}
                onClick={() => goToPage(pageToShow)}
                className={`${styles.paginationButton} ${currentPage === pageToShow ? styles.activePage : ''}`}
              >
                {pageToShow}
              </button>
            );
          })}
          
          <button 
            onClick={goToNextPage} 
            disabled={currentPage === totalPages}
            className={styles.paginationButton}
          >
            &gt;
          </button>
          
          <div className={styles.paginationInfo}>
            Affichage {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, Array.isArray(sortedInvoices) ? sortedInvoices.length : 0)} sur {Array.isArray(sortedInvoices) ? sortedInvoices.length : 0}
          </div>
        </div>
      )}
      
      {invoiceDetailOpen && selectedInvoice && (
        <InvoiceDetailModal 
          invoice={selectedInvoice}
          isOpen={invoiceDetailOpen}
          onClose={closeInvoiceDetail}
          onInvoiceUpdate={handleInvoiceUpdate}
          onSendEmail={() => {
            setSelectedInvoiceForEmail(selectedInvoice);
            setEmailModalOpen(true);
          }}
        />
      )}

      {emailModalOpen && selectedInvoiceForEmail && (
        <EmailInvoiceModal
          invoice={selectedInvoiceForEmail}
          isOpen={emailModalOpen}
          onClose={() => {
            setEmailModalOpen(false);
            setSelectedInvoiceForEmail(null);
          }}
          onEmailSent={handleEmailSent}
        />
      )}
    </div>
  );
};

export default InvoiceList;
