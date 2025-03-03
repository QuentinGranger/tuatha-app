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
        return 'fas fa-file-pdf';
      case 'image':
        return 'fas fa-file-image';
      case 'excel':
        return 'fas fa-file-excel';
      case 'word':
        return 'fas fa-file-word';
      default:
        return 'fas fa-file';
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
          <i className={`fas fa-search ${styles.searchIcon}`}></i>
        </div>
        
        <div className={styles.actionButtons}>
          <button className={`${styles.actionButton} ${styles.secondaryButton}`}>
            <i className="fas fa-share-alt"></i>
            Partager
          </button>
          <button className={`${styles.actionButton} ${styles.primaryButton}`}>
            <i className="fas fa-upload"></i>
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
                  <i className={`${getFileIcon(doc.type)} ${styles.fileIcon}`}></i>
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
          <i className="fas fa-clock"></i>
          Fichiers récents
        </h2>
        
        <div className={styles.recentFilesList}>
          {recentFiles.map(file => (
            <div key={file.id} className={styles.fileRow}>
              <div className={styles.fileRowIcon}>
                <i className={getFileIcon(file.type)}></i>
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
