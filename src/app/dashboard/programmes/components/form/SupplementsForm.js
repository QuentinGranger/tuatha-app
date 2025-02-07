'use client';

import { useState, useEffect } from 'react';
import styles from './FormComponents.module.css';
import CustomSupplementManager from './CustomSupplementManager';

export default function SupplementsForm({ selectedSupplements, onSupplementChange }) {
  const [supplements, setSupplements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSupplements = async () => {
      try {
        const response = await fetch('/api/supplements');
        if (!response.ok) throw new Error('Failed to fetch supplements');
        const data = await response.json();
        setSupplements(data);
      } catch (error) {
        console.error('Error fetching supplements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSupplements();
  }, []);

  const toggleSupplement = (supplementId) => {
    const isSelected = selectedSupplements.includes(supplementId);
    if (isSelected) {
      onSupplementChange(selectedSupplements.filter(id => id !== supplementId));
    } else {
      onSupplementChange([...selectedSupplements, supplementId]);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Chargement des suppléments...</div>;
  }

  return (
    <div className={styles.supplementsForm}>
      <h3>Suppléments Recommandés</h3>
      <div className={styles.supplementsList}>
        {supplements.map((supplement) => (
          <div
            key={supplement.id}
            className={`${styles.supplementItem} ${
              selectedSupplements.includes(supplement.id) ? styles.selected : ''
            }`}
            onClick={() => toggleSupplement(supplement.id)}
          >
            <div className={styles.supplementHeader}>
              <div className={styles.supplementName}>
                <span className={styles.supplementIcon}>💊</span>
                {supplement.name}
              </div>
              <div className={styles.supplementType}>{supplement.type}</div>
            </div>
            
            <div className={styles.supplementDetails}>
              <div className={styles.dosage}>
                <strong>Dosage:</strong> {supplement.dosage}
              </div>
              <div className={styles.recommendations}>
                <strong>Recommandations:</strong>
                <p>{supplement.recommendations}</p>
              </div>
            </div>

            <div className={styles.checkbox}>
              <input
                type="checkbox"
                checked={selectedSupplements.includes(supplement.id)}
                onChange={() => toggleSupplement(supplement.id)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.selectedCount}>
        {selectedSupplements.length} suppléments sélectionnés
      </div>
      <CustomSupplementManager onSupplementAdded={() => fetchSupplements()} />
    </div>
  );
}
