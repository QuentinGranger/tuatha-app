"use client";
import React, { useState, useEffect } from 'react';
import styles from './styles/page.module.css';
import FinancialSummary from './components/FinancialSummary';
import InvoiceList from './components/InvoiceList';
import SearchAndFilter from './components/SearchAndFilter';
import RecurringPayments from './components/RecurringPayments';
import CreateInvoiceModal from './components/CreateInvoiceModal';

export default function Facturation() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all'); 
  const [currentStatus, setCurrentStatus] = useState('all');
  const [currentSort, setCurrentSort] = useState('date-desc');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [newInvoice, setNewInvoice] = useState(null);

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
          <RecurringPayments />
        </div>
      </div>

      {isCreateModalOpen && (
        <CreateInvoiceModal 
          isOpen={isCreateModalOpen}
          onClose={handleCloseModal}
          onCreateInvoice={handleAddInvoice}
        />
      )}
    </div>
  );
}
