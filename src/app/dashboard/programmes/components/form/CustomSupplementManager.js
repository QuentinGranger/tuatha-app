'use client';

import { useState, useEffect } from 'react';
import styles from './FormComponents.module.css';

export default function CustomSupplementManager({ onSupplementAdded }) {
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
    e.preventDefault();
    
    const supplementData = {
      ...formData,
      sideEffects: formData.sideEffects.split('\n').filter(line => line.trim()),
      warnings: formData.warnings.split('\n').filter(line => line.trim()),
    };

    try {
      if (editingId) {
        await fetch('/api/supplements', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...supplementData }),
        });
      } else {
        await fetch('/api/supplements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(supplementData),
        });
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
      await fetch(`/api/supplements?id=${id}`, { method: 'DELETE' });
      fetchSupplements();
      if (onSupplementAdded) onSupplementAdded();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
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
        <form onSubmit={handleSubmit} className={styles.customSupplementForm}>
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

          <button type="submit" className={styles.submitButton}>
            {editingId ? 'Modifier' : 'Ajouter'} le supplément
          </button>
        </form>
      )}

      <div className={styles.customSupplementList}>
        {supplements.map((supplement) => (
          <div key={supplement.id} className={styles.customSupplementItem}>
            <div className={styles.customSupplementContent}>
              <h4>{supplement.name}</h4>
              <p className={styles.type}>{supplement.type}</p>
              
              {supplement.dosage && (
                <div className={styles.detail}>
                  <strong>Dosage:</strong> {supplement.dosage}
                </div>
              )}
              
              {supplement.frequency && (
                <div className={styles.detail}>
                  <strong>Fréquence:</strong> {supplement.frequency}
                </div>
              )}

              {supplement.description && (
                <div className={styles.description}>{supplement.description}</div>
              )}

              {supplement.sideEffects?.length > 0 && (
                <div className={styles.list}>
                  <strong>Effets secondaires:</strong>
                  <ul>
                    {supplement.sideEffects.map((effect, index) => (
                      <li key={index}>{effect}</li>
                    ))}
                  </ul>
                </div>
              )}

              {supplement.warnings?.length > 0 && (
                <div className={styles.list}>
                  <strong>Avertissements:</strong>
                  <ul>
                    {supplement.warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className={styles.customSupplementActions}>
              <button
                type="button"
                onClick={() => handleEdit(supplement)}
                className={styles.editButton}
              >
                Modifier
              </button>
              <button
                type="button"
                onClick={() => handleDelete(supplement.id)}
                className={styles.deleteButton}
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
