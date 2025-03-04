'use client';

import { useState } from 'react';
import styles from './Documents.module.css';

export default function Documents({ patient }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all');
  
  if (!patient) {
    return <div className={styles.emptyState}>Veuillez sélectionner un patient</div>;
  }
  
  // Données fictives
  const documents = [
    {
      id: 1,
      name: 'Bilan Initial.pdf',
      type: 'pdf',
      category: 'Bilan',
      size: '2.4 MB',
      date: '2023-11-15',
      isNew: false,
      preview: null
    },
    {
      id: 2,
      name: 'Composition Corporelle - Déc 2023.png',
      type: 'image',
      category: 'Mesures',
      size: '1.8 MB',
      date: '2023-12-15',
      isNew: false,
      preview: null
    },
    {
      id: 3,
      name: 'Plan Alimentaire.pdf',
      type: 'pdf',
      category: 'Nutrition',
      size: '1.2 MB',
      date: '2023-11-18',
      isNew: false,
      preview: null
    },
    {
      id: 4,
      name: 'Analyses Sanguines.pdf',
      type: 'pdf',
      category: 'Médical',
      size: '3.1 MB',
      date: '2024-01-20',
      isNew: true,
      preview: null
    },
    {
      id: 5,
      name: 'Suivi Poids - Q1 2024.xlsx',
      type: 'excel',
      category: 'Mesures',
      size: '0.8 MB',
      date: '2024-02-28',
      isNew: true,
      preview: null
    },
    {
      id: 6,
      name: 'Composition Corporelle - Fév 2024.png',
      type: 'image',
      category: 'Mesures',
      size: '1.7 MB',
      date: '2024-02-28',
      isNew: true,
      preview: null
    }
  ];
  
  const recentFiles = [
    {
      id: 7,
      name: 'Journal Alimentaire - Semaine 12.pdf',
      type: 'pdf',
      size: '1.5 MB',
      date: '2024-03-01'
    },
    {
      id: 8,
      name: 'Compte-rendu consultation 28-02-2024.docx',
      type: 'word',
      size: '0.6 MB',
      date: '2024-02-28'
    },
    {
      id: 9,
      name: 'Questionnaire satisfaction.pdf',
      type: 'pdf',
      size: '0.3 MB',
      date: '2024-02-15'
    }
  ];
  
  const categories = [
    { id: 'all', name: 'Tous' },
    { id: 'Bilan', name: 'Bilans' },
    { id: 'Mesures', name: 'Mesures' },
    { id: 'Nutrition', name: 'Nutrition' },
    { id: 'Médical', name: 'Médical' }
  ];
  
  const filteredDocuments = documents.filter(doc => {
    const matchesQuery = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = currentFilter === 'all' || doc.category === currentFilter;
    return matchesQuery && matchesFilter;
  });
  
  const getFileIcon = (type) => {
    switch(type) {
      case 'pdf':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <rect x="6" y="13" width="12" height="8"></rect>
          </svg>
        );
      case 'image':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        );
      case 'excel':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <polyline points="8 13 10.5 15.5 8 18"></polyline>
            <polyline points="16 13 13.5 15.5 16 18"></polyline>
          </svg>
        );
      case 'word':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
        );
    }
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Rechercher un document..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg className={styles.searchIcon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        
        <div className={styles.actionButtons}>
          <button className={`${styles.actionButton} ${styles.secondaryButton}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
            Partager
          </button>
          <button className={`${styles.actionButton} ${styles.primaryButton}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Importer
          </button>
        </div>
      </div>
      
      <div className={styles.groupsFilter}>
        {categories.map(category => (
          <div 
            key={category.id}
            className={`${styles.filterChip} ${currentFilter === category.id ? styles.active : ''}`}
            onClick={() => setCurrentFilter(category.id)}
          >
            {category.name}
          </div>
        ))}
      </div>
      
      <div className={styles.documentsGrid}>
        {filteredDocuments.length > 0 ? (
          filteredDocuments.map(doc => (
            <div key={doc.id} className={styles.documentCard}>
              <div className={styles.documentPreview}>
                {doc.preview ? (
                  <img src={doc.preview} alt={doc.name} className={styles.previewImage} />
                ) : (
                  getFileIcon(doc.type)
                )}
                <span className={styles.fileExtension}>{doc.type}</span>
              </div>
              
              <div className={styles.documentInfo}>
                <span className={styles.documentCategory}>{doc.category}</span>
                <h3 className={styles.documentName} title={doc.name}>{doc.name}</h3>
                <div className={styles.documentMeta}>
                  <span>{doc.size}</span>
                  <span>{new Date(doc.date).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState} style={{ gridColumn: '1 / -1' }}>
            Aucun document ne correspond à votre recherche
          </div>
        )}
      </div>
      
      <div className={styles.recentFilesSection}>
        <h2 className={styles.sectionTitle}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          Fichiers récents
        </h2>
        
        <div className={styles.recentFilesList}>
          {recentFiles.map(file => (
            <div key={file.id} className={styles.fileRow}>
              <div className={styles.fileRowIcon}>
                {getFileIcon(file.type)}
              </div>
              <div className={styles.fileRowName}>
                {file.name}
              </div>
              <div className={styles.fileRowSize}>
                {file.size}
              </div>
              <div className={styles.fileRowType}>
                {file.type.toUpperCase()}
              </div>
              <div className={styles.fileRowDate}>
                {new Date(file.date).toLocaleDateString('fr-FR')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
