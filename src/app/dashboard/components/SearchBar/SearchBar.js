'use client';

import { useState, useEffect, useRef } from 'react';
import { MdSearch, MdClose } from 'react-icons/md';
import styles from './SearchBar.module.css';

const SearchBar = ({ placeholder = "Rechercher dans Tuatha...", onSearch }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Catégories de recherche disponibles
  const searchCategories = [
    { id: 'patients', label: 'Patients', icon: '👤' },
    { id: 'professionals', label: 'Professionnels', icon: '👨‍⚕️' },
    { id: 'appointments', label: 'Rendez-vous', icon: '📅' },
    { id: 'documents', label: 'Documents', icon: '📄' },
    { id: 'messages', label: 'Messages', icon: '💬' }
  ];

  // Fonction de recherche utilisant l'API
  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/search?query=${encodeURIComponent(searchQuery.trim())}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la recherche');
      }
      
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.error('Erreur de recherche:', err);
      setError('Une erreur est survenue lors de la recherche');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Gestion du clic à l'extérieur pour fermer les résultats
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Déclencher la recherche après un délai pour éviter trop de recherches pendant la frappe
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch(query);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Gestion de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && query.trim().length >= 2) {
      performSearch(query);
      setShowResults(true);
      if (onSearch) {
        onSearch(query);
      }
    }
  };

  // Navigation avec le clavier dans les résultats
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowResults(false);
    }
  };

  // Effacer la recherche
  const clearSearch = () => {
    setQuery('');
    setSearchResults([]);
    inputRef.current.focus();
  };

  // Afficher les résultats par catégorie
  const renderResultsByCategory = () => {
    const categorizedResults = {};
    
    // Initialiser les catégories
    searchCategories.forEach(cat => {
      categorizedResults[cat.id] = [];
    });
    
    // Remplir les catégories avec les résultats
    searchResults.forEach(result => {
      if (categorizedResults[result.category]) {
        categorizedResults[result.category].push(result);
      }
    });
    
    return (
      <>
        {searchCategories.map(category => {
          const results = categorizedResults[category.id] || [];
          if (results.length === 0) return null;
          
          return (
            <div key={category.id} className={styles.resultCategory}>
              <div className={styles.categoryHeader}>
                <span className={styles.categoryIcon}>{category.icon}</span>
                <h3>{category.label}</h3>
                <span className={styles.categoryCount}>{results.length}</span>
              </div>
              {results.map(result => (
                <div key={result.id} className={styles.searchResultItem} onClick={() => handleResultClick(result)}>
                  {result.avatar && (
                    <div className={styles.resultAvatar}>
                      <img src={result.avatar} alt={result.name} />
                    </div>
                  )}
                  <div className={styles.resultContent}>
                    <div className={styles.resultName}>{result.name}</div>
                    <div className={styles.resultDetails}>{result.details}</div>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
        
        {searchResults.length > 0 && (
          <div className={styles.viewAllResults}>
            <button>Voir tous les résultats pour "{query}"</button>
          </div>
        )}
        
        {searchResults.length === 0 && query && query.trim().length >= 2 && (
          <div className={styles.noResults}>
            <div className={styles.noResultsIcon}>🔍</div>
            <p>Aucun résultat trouvé pour "{query}"</p>
          </div>
        )}
      </>
    );
  };

  // Gestion du clic sur un résultat
  const handleResultClick = (result) => {
    console.log('Résultat sélectionné:', result);
    
    // Rediriger vers l'URL correspondante
    if (result.url) {
      window.location.href = result.url;
    }
    
    setShowResults(false);
  };

  return (
    <div className={styles.searchContainer} ref={searchRef}>
      <form onSubmit={handleSubmit} className={`${styles.searchForm} ${isFocused ? styles.focused : ''}`}>
        <div className={styles.searchInputContainer}>
          <MdSearch className={styles.searchIcon} />
          <input
            type="text"
            ref={inputRef}
            className={styles.searchInput}
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              setShowResults(!!query && query.trim().length >= 2 && searchResults.length > 0);
            }}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
          />
          {query && (
            <button 
              type="button" 
              className={styles.clearButton}
              onClick={clearSearch}
              aria-label="Effacer la recherche"
            >
              <MdClose />
            </button>
          )}
        </div>
      </form>

      {showResults && (
        <div className={styles.searchResults}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>Recherche en cours...</p>
            </div>
          ) : error ? (
            <div className={styles.errorContainer}>
              <p>{error}</p>
            </div>
          ) : (
            renderResultsByCategory()
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
