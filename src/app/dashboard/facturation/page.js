"use client";
import React, { useState, useEffect } from 'react';
import styles from './styles/page.module.css';
import FinancialSummary from './components/FinancialSummary';
import InvoiceList from './components/InvoiceList';
import SearchAndFilter from './components/SearchAndFilter';
import RecurringPayments from './components/RecurringPayments';
import CreateInvoiceModal from './components/CreateInvoiceModal';
import CreateRecurringPaymentModal from './components/CreateRecurringPaymentModal';

export default function Facturation() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all'); 
  const [currentStatus, setCurrentStatus] = useState('all');
  const [currentSort, setCurrentSort] = useState('date-desc');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateRecurringModalOpen, setIsCreateRecurringModalOpen] = useState(false);
  const [isEditRecurringModalOpen, setIsEditRecurringModalOpen] = useState(false);
  const [currentEditPayment, setCurrentEditPayment] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [newInvoice, setNewInvoice] = useState(null);
  const [newRecurringPayment, setNewRecurringPayment] = useState(null);

  // Récupérer les factures depuis le composant InvoiceList
  const fetchInvoicesFromList = (invoicesData) => {
    setInvoices(invoicesData);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
  };

  const handleStatusChange = (status) => {
    setCurrentStatus(status);
  };

  const handleSortChange = (sort) => {
    setCurrentSort(sort);
  };

  const handleCreateInvoice = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleAddInvoice = (invoice) => {
    setNewInvoice(invoice);
    setIsCreateModalOpen(false);
  };

  // Gestion des paiements récurrents
  const openCreateRecurringModal = () => {
    setIsCreateRecurringModalOpen(true);
  };

  const closeCreateRecurringModal = () => {
    setIsCreateRecurringModalOpen(false);
  };

  const handleCreateRecurringPayment = (payment) => {
    setNewRecurringPayment(payment);
    closeCreateRecurringModal();
  };

  // Gestion de l'édition des paiements récurrents
  const handleEditRecurringPayment = (payment) => {
    setCurrentEditPayment(payment);
    setIsEditRecurringModalOpen(true);
  };

  const closeEditRecurringModal = () => {
    setIsEditRecurringModalOpen(false);
    setCurrentEditPayment(null);
  };

  const handleUpdateRecurringPayment = (updatedPayment) => {
    // Ici, nous pourrions appeler une API pour mettre à jour le paiement
    // Pour l'exemple, nous mettons simplement à jour l'état local
    setNewRecurringPayment(updatedPayment); // Cela déclenchera la mise à jour dans le composant RecurringPayments
    closeEditRecurringModal();
  };

  // Gestion de la suppression des paiements récurrents
  const handleDeleteRecurringPayment = (paymentId) => {
    // Ici, nous pourrions appeler une API pour supprimer le paiement
    // Pour l'exemple, la suppression est gérée directement dans le composant RecurringPayments
    console.log(`Paiement récurrent supprimé: ${paymentId}`);
  };

  return (
    <div className={styles.facturationContainer}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Facturation</h1>
        <button 
          className={styles.createInvoiceButton} 
          onClick={handleCreateInvoice}
        >
          <span className={styles.buttonIcon}>➕</span>
          <span className={styles.buttonText}>Créer une facture</span>
        </button>
      </div>

      <SearchAndFilter 
        onSearch={handleSearch} 
        currentFilter={currentFilter}
        onFilterChange={handleFilterChange}
        invoices={invoices}
        onStatusChange={handleStatusChange}
        onSortChange={handleSortChange}
      />

      <FinancialSummary />

      <div className={styles.mainContent}>
        <div className={styles.invoicesSection}>
          <InvoiceList 
            searchQuery={searchQuery} 
            currentFilter={currentFilter} 
            currentStatus={currentStatus}
            currentSort={currentSort}
            newInvoice={newInvoice}
            onInvoicesLoaded={fetchInvoicesFromList}
          />
        </div>
        
        <div className={styles.paymentsSection}>
          <RecurringPayments 
            onCreateButtonClick={openCreateRecurringModal}
            newRecurringPayment={newRecurringPayment}
            onEditPayment={handleEditRecurringPayment}
            onDeletePayment={handleDeleteRecurringPayment}
          />
        </div>
      </div>

      <CreateInvoiceModal 
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        onCreateInvoice={handleAddInvoice}
      />

      <CreateRecurringPaymentModal
        isOpen={isCreateRecurringModalOpen}
        onClose={closeCreateRecurringModal}
        onCreatePayment={handleCreateRecurringPayment}
      />

      {isEditRecurringModalOpen && currentEditPayment && (
        <CreateRecurringPaymentModal
          isOpen={isEditRecurringModalOpen}
          onClose={closeEditRecurringModal}
          onCreatePayment={handleUpdateRecurringPayment}
          editMode={true}
          initialData={currentEditPayment}
        />
      )}
    </div>
  );
}
