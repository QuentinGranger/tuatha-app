'use client';

import { useState } from 'react';
import styles from './FormComponents.module.css';
import FoodSelector from './FoodSelector';
import SupplementsForm from './SupplementsForm';
import { FiCalendar, FiEdit3, FiList, FiPackage, FiActivity } from 'react-icons/fi';

export default function NutritionPlanForm({ onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    foods: initialData?.foods || [],
    supplements: initialData?.supplements || [],
    calories: initialData?.calories || '',
    proteins: initialData?.proteins || '',
    carbs: initialData?.carbs || '',
    fats: initialData?.fats || '',
    restrictions: initialData?.restrictions || '',
    objectives: initialData?.objectives || '',
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
        status: 'TEMPLATE',
        calories: formData.calories,
        proteins: formData.proteins,
        carbs: formData.carbs,
        fats: formData.fats,
        restrictions: formData.restrictions,
        objectives: formData.objectives
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
      console.error('Erreur lors de la soumission du formulaire:', error);
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
            <label htmlFor="title">Titre du plan nutritionnel *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Ex: Régime méditerranéen personnalisé"
            />
          </div>

          <div className={styles.formField}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description détaillée du régime alimentaire..."
              rows={4}
            />
          </div>

          <div className={styles.formField}>
            <label htmlFor="startDate">
              <FiCalendar size={16} />
              Date de début du régime
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
              Date de fin prévue
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
          <FiActivity size={20} />
          Objectifs et restrictions
        </h3>
        <div className={styles.formGrid}>
          <div className={styles.formField}>
            <label htmlFor="objectives">Objectifs nutritionnels</label>
            <textarea
              id="objectives"
              name="objectives"
              value={formData.objectives}
              onChange={handleInputChange}
              placeholder="Ex: Perte de poids, gain de masse musculaire, équilibre alimentaire..."
              rows={3}
            />
          </div>

          <div className={styles.formField}>
            <label htmlFor="restrictions">Restrictions alimentaires</label>
            <textarea
              id="restrictions"
              name="restrictions"
              value={formData.restrictions}
              onChange={handleInputChange}
              placeholder="Ex: Sans gluten, végétarien, allergies..."
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className={styles.formSection}>
        <h3>
          <FiActivity size={20} />
          Besoins nutritionnels quotidiens
        </h3>
        <div className={styles.formGrid}>
          <div className={styles.formField}>
            <label htmlFor="calories">Calories (kcal)</label>
            <input
              type="number"
              id="calories"
              name="calories"
              value={formData.calories}
              onChange={handleInputChange}
              placeholder="Ex: 2000"
            />
          </div>

          <div className={styles.formField}>
            <label htmlFor="proteins">Protéines (g)</label>
            <input
              type="number"
              id="proteins"
              name="proteins"
              value={formData.proteins}
              onChange={handleInputChange}
              placeholder="Ex: 100"
            />
          </div>

          <div className={styles.formField}>
            <label htmlFor="carbs">Glucides (g)</label>
            <input
              type="number"
              id="carbs"
              name="carbs"
              value={formData.carbs}
              onChange={handleInputChange}
              placeholder="Ex: 250"
            />
          </div>

          <div className={styles.formField}>
            <label htmlFor="fats">Lipides (g)</label>
            <input
              type="number"
              id="fats"
              name="fats"
              value={formData.fats}
              onChange={handleInputChange}
              placeholder="Ex: 70"
            />
          </div>
        </div>
      </div>

      <div className={styles.formSection}>
        <h3>
          <FiList size={20} />
          Plan alimentaire
        </h3>
        <FoodSelector
          selectedFoods={formData.foods}
          onFoodsChange={handleFoodsChange}
        />
      </div>

      <div className={styles.formSection}>
        <h3>
          <FiPackage size={20} />
          Compléments alimentaires
        </h3>
        <SupplementsForm
          selectedSupplements={formData.supplements}
          onSupplementChange={handleSupplementsChange}
        />
      </div>

      <div className={styles.formActions}>
        <button type="submit" className={styles.submitButton}>
          Créer le plan nutritionnel
        </button>
      </div>
    </form>
  );
}
