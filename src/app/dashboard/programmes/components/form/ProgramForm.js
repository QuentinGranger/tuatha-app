'use client';

import { useState } from 'react';
import styles from './FormComponents.module.css';
import FoodSelector from './FoodSelector';
import SupplementsForm from './SupplementsForm';
import { FiCalendar, FiEdit3, FiList, FiPackage } from 'react-icons/fi';

export default function ProgramForm({ onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    foods: initialData?.foods || [],
    supplements: initialData?.supplements || [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFoodsChange = (foods) => {
    setFormData(prev => ({
      ...prev,
      foods
    }));
  };

  const handleSupplementsChange = (supplements) => {
    setFormData(prev => ({
      ...prev,
      supplements
    }));
  };

  const formatDateToISO = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const target = e.target;
    const isNestedFormSubmit = target.closest('.customSupplementForm');
    if (isNestedFormSubmit) {
      return;
    }
    
    try {
      const formattedData = {
        title: formData.title,
        description: formData.description,
        startDate: formatDateToISO(formData.startDate),
        endDate: formatDateToISO(formData.endDate),
        status: 'TEMPLATE'
      };

      if (Array.isArray(formData.supplements) && formData.supplements.length > 0) {
        const validSupplements = formData.supplements
          .filter(s => s && s.id)
          .map(supplement => ({
            id: supplement.id,
            dosage: supplement.dosage || '',
            frequency: supplement.frequency || '',
            notes: supplement.notes || ''
          }));

        if (validSupplements.length > 0) {
          formattedData.supplements = validSupplements;
        }
      }

      await onSubmit(formattedData);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formSection}>
        <h3>
          <FiEdit3 size={20} />
          Informations générales
        </h3>
        <div className={styles.formGrid}>
          <div className={styles.formField}>
            <label htmlFor="title">Titre du programme *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Ex: Programme de récupération"
            />
          </div>

          <div className={styles.formField}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description détaillée du programme..."
              rows={4}
            />
          </div>

          <div className={styles.formField}>
            <label htmlFor="startDate">
              <FiCalendar size={16} />
              Date de début recommandée
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.formField}>
            <label htmlFor="endDate">
              <FiCalendar size={16} />
              Date de fin recommandée
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      <div className={styles.formSection}>
        <h3>
          <FiList size={20} />
          Alimentation
        </h3>
        <FoodSelector
          selectedFoods={formData.foods}
          onFoodsChange={handleFoodsChange}
        />
      </div>

      <div className={styles.formSection}>
        <h3>
          <FiPackage size={20} />
          Suppléments
        </h3>
        <SupplementsForm
          selectedSupplements={formData.supplements}
          onSupplementChange={handleSupplementsChange}
        />
      </div>

      <div className={styles.formActions}>
        <button type="submit" className={styles.submitButton}>
          Créer le modèle de programme
        </button>
      </div>
    </form>
  );
}
