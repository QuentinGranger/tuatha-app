'use client';

import { useState, useEffect } from 'react';
import styles from './FormComponents.module.css';

export default function PathologySelector({ value, onChange }) {
  const [pathologies, setPathologies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPathologies = async () => {
      try {
        const response = await fetch('/api/pathologies');
        if (!response.ok) throw new Error('Failed to fetch pathologies');
        const data = await response.json();
        setPathologies(data);
      } catch (error) {
        console.error('Error fetching pathologies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPathologies();
  }, []);

  if (loading) {
    return (
      <div className={styles.field}>
        <label>Pathologie ciblée</label>
        <select disabled>
          <option>Chargement...</option>
        </select>
      </div>
    );
  }

  return (
    <div className={styles.field}>
      <label htmlFor="pathology">Pathologie ciblée</label>
      <select
        id="pathology"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      >
        <option value="">Sélectionner une pathologie</option>
        {pathologies.map((pathology) => (
          <option key={pathology.id} value={pathology.id}>
            {pathology.name}
          </option>
        ))}
      </select>
      <small>Sélectionnez la pathologie principale ciblée par ce programme</small>
    </div>
  );
}
