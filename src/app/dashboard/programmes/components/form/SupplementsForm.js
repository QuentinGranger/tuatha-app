'use client';

import { useState, useEffect } from 'react';
import styles from './FormComponents.module.css';
import CustomSupplementManager from './CustomSupplementManager';

export default function SupplementsForm({ selectedSupplements = [], onSupplementChange }) {
  const [supplements, setSupplements] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSupplements();
  }, []);

  const fetchSupplements = async () => {
    try {
      const response = await fetch('/api/supplements');
      if (!response.ok) {
        throw new Error('Failed to fetch supplements');
      }
      const data = await response.json();
      const validSupplements = data.filter(supplement => supplement && supplement.id);
      setSupplements(validSupplements);
    } catch (error) {
      console.error('Erreur lors de la récupération des suppléments:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleSupplementClick = (supplement) => {
    if (!supplement || !supplement.id) {
      console.error('Tentative de sélection d\'un supplément invalide:', supplement);
      return;
    }

    const isSelected = selectedSupplements.some(s => s.id === supplement.id);
    
    if (isSelected) {
      onSupplementChange(selectedSupplements.filter(s => s.id !== supplement.id));
    } else {
      // S'assurer que l'ID est correctement inclus
      const supplementWithId = {
        id: supplement.id,
        name: supplement.name,
        dosage: '',
        frequency: '',
        notes: ''
      };
      onSupplementChange([...selectedSupplements, supplementWithId]);
    }
  };

  const handleCustomSupplementSelect = (supplement) => {
    if (!supplement || !supplement.id) {
      console.error('Tentative de sélection d\'un supplément personnalisé invalide:', supplement);
      return;
    }
    handleSupplementClick(supplement);
  };

  const filteredSupplements = supplements.filter(supplement =>
    supplement && supplement.id && !supplement.isCustom && (
      supplement.name.toLowerCase().includes(searchQuery) ||
      (supplement.category || '').toLowerCase().includes(searchQuery)
    )
  );

  return (
    <div className={styles.supplementsForm}>
      <div className={styles.supplementsHeader}>
        <h3>Compléments alimentaires</h3>
        <div className={styles.supplementFilters}>
          <input
            type="text"
            placeholder="Rechercher un supplément..."
            value={searchQuery}
            onChange={handleSearchChange}
            className={styles.searchInput}
            data-form-type="other"
          />
        </div>
      </div>

      <div className={styles.supplementsList}>
        {filteredSupplements.map((supplement) => (
          <div
            key={`supplement-${supplement.id}`}
            className={`${styles.supplementItem} ${
              selectedSupplements.some(s => s.id === supplement.id) ? styles.selected : ''
            }`}
            onClick={() => handleSupplementClick(supplement)}
          >
            <div className={styles.supplementHeader}>
              <div className={styles.supplementName}>
                <span className={styles.supplementIcon}>💊</span>
                {supplement.name}
              </div>
              <div className={styles.supplementCategory}>
                {supplement.category}
              </div>
            </div>
            
            <div className={styles.supplementDetails}>
              {supplement.dosage && (
                <div className={styles.dosage}>
                  <strong>Dosage:</strong> {supplement.dosage}
                </div>
              )}
              {supplement.recommendations && (
                <div className={styles.recommendations}>
                  <strong>Recommandations:</strong>
                  <p>{supplement.recommendations}</p>
                </div>
              )}
              {supplement.description && (
                <div className={styles.description}>
                  {supplement.description}
                </div>
              )}
            </div>

            <div className={styles.supplementFooter}>
              <div className={styles.tags}>
                {supplement.benefits?.map((benefit, index) => (
                  <span key={`benefit-${supplement.id}-${index}`} className={styles.tag}>
                    {benefit}
                  </span>
                ))}
              </div>
              <div className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={selectedSupplements.some(s => s.id === supplement.id)}
                  onChange={() => handleSupplementClick(supplement)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.selectedCount}>
        {selectedSupplements.length} suppléments sélectionnés
      </div>

      <CustomSupplementManager 
        onSupplementAdded={fetchSupplements}
        selectedSupplements={selectedSupplements}
        onSupplementSelect={handleCustomSupplementSelect}
      />
    </div>
  );
}
