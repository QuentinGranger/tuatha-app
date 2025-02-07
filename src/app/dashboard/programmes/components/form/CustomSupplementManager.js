'use client';

import { useState, useEffect } from 'react';
import styles from './FormComponents.module.css';

export default function CustomSupplementManager({ onSupplementAdded, selectedSupplements = [], onSupplementSelect }) {
  const [supplements, setSupplements] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    dosage: '',
    frequency: '',
    sideEffects: '',
    warnings: '',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchSupplements();
  }, []);

  const fetchSupplements = async () => {
    try {
      const response = await fetch('/api/supplements');
      const data = await response.json();
      setSupplements(data.filter(supplement => supplement.isCustom));
    } catch (error) {
      console.error('Erreur lors de la récupération des suppléments:', error);
    }
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!formData.name || !formData.type) {
      alert('Le nom et le type sont requis');
      return;
    }

    const supplementData = {
      ...formData,
      isCustom: true,
      sideEffects: formData.sideEffects.split('\n').filter(line => line.trim()),
      warnings: formData.warnings.split('\n').filter(line => line.trim()),
    };

    try {
      const url = editingId 
        ? `/api/supplements/${editingId}`
        : '/api/supplements';

      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supplementData),
      });

      if (!response.ok) {
        throw new Error('Failed to save supplement');
      }

      setFormData({
        name: '',
        type: '',
        description: '',
        dosage: '',
        frequency: '',
        sideEffects: '',
        warnings: '',
      });
      setShowForm(false);
      setEditingId(null);
      fetchSupplements();
      if (onSupplementAdded) onSupplementAdded();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Une erreur est survenue lors de la sauvegarde du supplément');
    }
  };

  const handleEdit = (supplement) => {
    setFormData({
      name: supplement.name,
      type: supplement.type,
      description: supplement.description || '',
      dosage: supplement.dosage || '',
      frequency: supplement.frequency || '',
      sideEffects: (supplement.sideEffects || []).join('\n'),
      warnings: (supplement.warnings || []).join('\n'),
    });
    setEditingId(supplement.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce supplément ?')) return;

    try {
      await fetch(`/api/supplements/${id}`, { method: 'DELETE' });
      fetchSupplements();
      if (onSupplementAdded) onSupplementAdded();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleSupplementClick = (supplement) => {
    if (onSupplementSelect) {
      onSupplementSelect(supplement);
    }
  };

  return (
    <div className={styles.customSupplementManager}>
      <div className={styles.customSupplementHeader}>
        <h3>Mes Suppléments Personnalisés</h3>
        <button
          type="button"
          className={styles.addSupplementButton}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Annuler' : 'Ajouter un supplément'}
        </button>
      </div>

      {showForm && (
        <div className={styles.customSupplementFormWrapper}>
          <div className={styles.customSupplementFormContainer}>
            <div className={`${styles.customSupplementForm} customSupplementForm`}>
              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label htmlFor="name">Nom</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.formField}>
                  <label htmlFor="type">Type</label>
                  <input
                    type="text"
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.formField}>
                  <label htmlFor="dosage">Dosage</label>
                  <input
                    type="text"
                    id="dosage"
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                  />
                </div>

                <div className={styles.formField}>
                  <label htmlFor="frequency">Fréquence</label>
                  <input
                    type="text"
                    id="frequency"
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.formField}>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className={styles.formField}>
                <label htmlFor="sideEffects">Effets secondaires (un par ligne)</label>
                <textarea
                  id="sideEffects"
                  value={formData.sideEffects}
                  onChange={(e) => setFormData({ ...formData, sideEffects: e.target.value })}
                  placeholder="Entrez chaque effet secondaire sur une nouvelle ligne"
                />
              </div>

              <div className={styles.formField}>
                <label htmlFor="warnings">Avertissements (un par ligne)</label>
                <textarea
                  id="warnings"
                  value={formData.warnings}
                  onChange={(e) => setFormData({ ...formData, warnings: e.target.value })}
                  placeholder="Entrez chaque avertissement sur une nouvelle ligne"
                />
              </div>

              <div className={styles.formActions}>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => setShowForm(false)}
                >
                  Annuler
                </button>
                <button 
                  type="button"
                  className={styles.submitButton}
                  onClick={handleSubmit}
                >
                  {editingId ? 'Modifier' : 'Ajouter'} le supplément
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.customSupplementList}>
        {supplements.map((supplement) => {
          const isSelected = selectedSupplements?.some(s => s.id === supplement.id);
          return (
            <div 
              key={supplement.id} 
              className={`${styles.customSupplementItem} ${isSelected ? styles.selected : ''}`}
              onClick={() => handleSupplementClick(supplement)}
            >
              <div className={styles.customSupplementContent}>
                <h4>{supplement.name}</h4>
                <p className={styles.type}>{supplement.type}</p>
                {supplement.description && (
                  <p className={styles.description}>{supplement.description}</p>
                )}
                {supplement.dosage && (
                  <p className={styles.dosage}>Dosage: {supplement.dosage}</p>
                )}
                {supplement.frequency && (
                  <p className={styles.frequency}>Fréquence: {supplement.frequency}</p>
                )}
              </div>
              <div className={styles.customSupplementActions}>
                <button
                  type="button"
                  className={styles.editButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(supplement);
                  }}
                >
                  Modifier
                </button>
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(supplement.id);
                  }}
                >
                  Supprimer
                </button>
                {isSelected && (
                  <div className={styles.selectedIndicator}>✓</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
