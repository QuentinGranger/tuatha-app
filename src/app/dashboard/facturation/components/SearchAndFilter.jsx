"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/searchAndFilter.module.css';
import { FiSearch, FiFilter, FiCalendar, FiX, FiUser, FiFileText, FiDollarSign } from 'react-icons/fi';

const SearchAndFilter = ({ onSearch, currentFilter, onFilterChange, invoices = [], onStatusChange, onSortChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchCategory, setSearchCategory] = useState('all');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [currentStatus, setCurrentStatus] = useState('all');
  const [currentSort, setCurrentSort] = useState('date-desc');
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Catégories de recherche disponibles
  const searchCategories = [
    { id: 'all', label: 'Tous', icon: <FiSearch /> },
    { id: 'patient', label: 'Patient', icon: <FiUser /> },
    { id: 'invoice', label: 'N° Facture', icon: <FiFileText /> },
    { id: 'amount', label: 'Montant', icon: <FiDollarSign /> }
  ];

  // Générer des suggestions en fonction de la requête et de la catégorie
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    let filteredSuggestions = [];

    switch (searchCategory) {
      case 'patient':
        // Rechercher parmi les noms de patients
        const patientMatches = Array.from(new Set(
          invoices
            .filter(inv => inv.patient?.name?.toLowerCase().includes(query))
            .map(inv => inv.patient.name)
        )).slice(0, 5);
        
        filteredSuggestions = patientMatches.map(name => ({
          type: 'patient',
          value: name,
          icon: <FiUser />
        }));
        break;

      case 'invoice':
        // Rechercher parmi les numéros de facture
        const invoiceMatches = Array.from(new Set(
          invoices
            .filter(inv => inv.id?.toLowerCase().includes(query) || inv.invoiceNumber?.toLowerCase().includes(query))
            .map(inv => inv.invoiceNumber || inv.id)
        )).slice(0, 5);
        
        filteredSuggestions = invoiceMatches.map(id => ({
          type: 'invoice',
          value: id,
          icon: <FiFileText />
        }));
        break;

      case 'amount':
        // Rechercher parmi les montants
        const amountMatches = Array.from(new Set(
          invoices
            .filter(inv => inv.total?.toString().includes(query) || inv.amount?.toString().includes(query))
            .map(inv => inv.total || inv.amount)
        )).slice(0, 5).sort((a, b) => a - b);
        
        filteredSuggestions = amountMatches.map(amount => ({
          type: 'amount',
          value: `${amount} €`,
          searchValue: amount.toString(),
          icon: <FiDollarSign />
        }));
        break;

      default:
        // Recherche globale
        // Patients
        const patients = Array.from(new Set(
          invoices
            .filter(inv => inv.patient?.name?.toLowerCase().includes(query))
            .map(inv => inv.patient.name)
        )).slice(0, 2);
        
        // Factures
        const invoiceIds = Array.from(new Set(
          invoices
            .filter(inv => inv.id?.toLowerCase().includes(query) || inv.invoiceNumber?.toLowerCase().includes(query))
            .map(inv => inv.invoiceNumber || inv.id)
        )).slice(0, 2);
        
        // Montants
        const amounts = Array.from(new Set(
          invoices
            .filter(inv => inv.total?.toString().includes(query) || inv.amount?.toString().includes(query))
            .map(inv => inv.total || inv.amount)
        )).slice(0, 2).sort((a, b) => a - b);

        filteredSuggestions = [
          ...patients.map(name => ({ type: 'patient', value: name, icon: <FiUser /> })),
          ...invoiceIds.map(id => ({ type: 'invoice', value: id, icon: <FiFileText /> })),
          ...amounts.map(amount => ({ 
            type: 'amount', 
            value: `${amount} €`, 
            searchValue: amount.toString(),
            icon: <FiDollarSign /> 
          }))
        ];
        break;
    }

    setSuggestions(filteredSuggestions);
    setShowSuggestions(filteredSuggestions.length > 0 && searchFocused);
  }, [searchQuery, searchCategory, invoices, searchFocused]);

  // Gérer le clic en dehors des suggestions pour les fermer
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
          searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleSearchFocus = () => {
    setSearchFocused(true);
    if (searchQuery.length >= 2 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    onSearch('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleCategoryChange = (category) => {
    setSearchCategory(category);
    if (searchQuery) {
      onSearch(searchQuery); // Refaire la recherche avec la nouvelle catégorie
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const searchValue = suggestion.searchValue || suggestion.value;
    setSearchQuery(searchValue);
    onSearch(searchValue);
    setShowSuggestions(false);
  };

  const handleFilterClick = (filter) => {
    onFilterChange(filter);
  };

  const handleStatusChange = (e) => {
    const status = e.target.value;
    setCurrentStatus(status);
    if (onStatusChange) {
      onStatusChange(status);
    }
  };

  const handleSortChange = (e) => {
    const sort = e.target.value;
    setCurrentSort(sort);
    if (onSortChange) {
      onSortChange(sort);
    }
  };

  return (
    <div className={styles.searchAndFilterContainer}>
      <div className={styles.searchSection}>
        <div className={`${styles.searchBarContainer} ${searchFocused ? styles.focused : ''}`}>
          <div className={styles.searchIconWrapper}>
            <FiSearch className={styles.searchIcon} />
          </div>
          
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Rechercher par patient, numéro de facture ou montant..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
          />
          
          {searchQuery && (
            <button className={styles.clearButton} onClick={handleClearSearch}>
              <FiX size={16} />
            </button>
          )}
        </div>
        
        <div className={styles.searchCategories}>
          {searchCategories.map(category => (
            <button
              key={category.id}
              className={`${styles.categoryButton} ${searchCategory === category.id ? styles.active : ''}`}
              onClick={() => handleCategoryChange(category.id)}
              title={`Rechercher par ${category.label}`}
            >
              {category.icon}
              <span>{category.label}</span>
            </button>
          ))}
        </div>
        
        {showSuggestions && suggestions.length > 0 && (
          <div className={styles.suggestionsContainer} ref={suggestionsRef}>
            <ul className={styles.suggestionsList}>
              {suggestions.map((suggestion, index) => (
                <li
                  key={`${suggestion.type}-${index}`}
                  className={styles.suggestionItem}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <span className={styles.suggestionIcon}>{suggestion.icon}</span>
                  <span className={styles.suggestionText}>{suggestion.value}</span>
                  <span className={styles.suggestionType}>{searchCategories.find(cat => cat.id === suggestion.type)?.label}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className={styles.filterContainer}>
        <div className={styles.filterPeriod}>
          <div className={styles.filterLabel}>
            <FiCalendar className={styles.filterIcon} />
            <span>Période:</span>
          </div>
          <div className={styles.filterButtons}>
            <button
              className={`${styles.filterButton} ${currentFilter === 'month' ? styles.active : ''}`}
              onClick={() => handleFilterClick('month')}
            >
              Mois en cours
            </button>
            <button
              className={`${styles.filterButton} ${currentFilter === 'quarter' ? styles.active : ''}`}
              onClick={() => handleFilterClick('quarter')}
            >
              Trimestre
            </button>
            <button
              className={`${styles.filterButton} ${currentFilter === 'year' ? styles.active : ''}`}
              onClick={() => handleFilterClick('year')}
            >
              Année
            </button>
            <button
              className={`${styles.filterButton} ${currentFilter === 'all' ? styles.active : ''}`}
              onClick={() => handleFilterClick('all')}
            >
              Tout
            </button>
          </div>
        </div>

        <div className={styles.filterOptions}>
          <div className={styles.filterDropdown}>
            <select 
              className={styles.statusFilter}
              value={currentStatus}
              onChange={handleStatusChange}
            >
              <option value="all">Tous les statuts</option>
              <option value="paid">Payé</option>
              <option value="pending">En attente</option>
              <option value="overdue">En retard</option>
            </select>
          </div>

          <div className={styles.filterDropdown}>
            <select 
              className={styles.sortFilter}
              value={currentSort}
              onChange={handleSortChange}
            >
              <option value="date-desc">Plus récentes</option>
              <option value="date-asc">Plus anciennes</option>
              <option value="amount-desc">Montant ↓</option>
              <option value="amount-asc">Montant ↑</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilter;
