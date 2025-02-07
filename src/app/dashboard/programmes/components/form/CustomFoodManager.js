'use client';

import { useState, useEffect } from 'react';
import styles from './FormComponents.module.css';

const FOOD_CATEGORIES = [
  'Protéines',
  'Féculents',
  'Légumes',
  'Fruits',
  'Produits laitiers',
  'Matières grasses',
  'Boissons',
  'Autres'
];

export default function CustomFoodManager({ onFoodAdded }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    calories: '',
    proteins: '',
    carbs: '',
    fats: '',
    description: ''
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [foods, setFoods] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ['calories', 'proteins', 'carbs', 'fats'];
    
    if (numericFields.includes(name)) {
      // Permettre uniquement les nombres et le point décimal
      if (value === '' || /^\d*\.?\d*$/.test(value)) {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Convertir les valeurs en nombres
      const numericData = {
        ...formData,
        calories: parseFloat(formData.calories) || 0,
        proteins: parseFloat(formData.proteins) || 0,
        carbs: parseFloat(formData.carbs) || 0,
        fats: parseFloat(formData.fats) || 0
      };

      let response;
      if (editingId) {
        response = await fetch('/api/foods', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: editingId, ...numericData })
        });
      } else {
        response = await fetch('/api/foods', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(numericData)
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création de l\'aliment');
      }

      const newFood = await response.json();
      
      // Réinitialiser le formulaire
      setFormData({
        name: '',
        category: '',
        calories: '',
        proteins: '',
        carbs: '',
        fats: '',
        description: ''
      });
      setShowForm(false);
      setIsSubmitting(false);
      setEditingId(null);
      
      // Notifier le parent qu'un nouvel aliment a été ajouté
      if (onFoodAdded) {
        onFoodAdded(newFood);
      }
    } catch (err) {
      console.error('Error creating food:', err);
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  const handleEdit = (food) => {
    setFormData({
      name: food.name,
      category: food.category,
      calories: food.calories.toString(),
      proteins: food.proteins.toString(),
      carbs: food.carbs.toString(),
      fats: food.fats.toString(),
      description: food.description || ''
    });
    setEditingId(food.id);
    setShowForm(true);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet aliment ?')) return;

    try {
      const response = await fetch(`/api/foods?id=${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch('/api/foods');
        const data = await response.json();
        setFoods(data.filter(food => food.isCustom));
      } catch (error) {
        console.error('Erreur lors de la récupération des aliments:', error);
        setError('Erreur lors de la récupération des aliments');
      }
    };
    fetchFoods();
  }, []);

  if (!showForm) {
    return (
      <div className={styles.customFoodManager}>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className={styles.addButton}
        >
          Ajouter un aliment personnalisé
        </button>
        <div className={styles.customFoodList}>
          {foods.map((food) => (
            <div key={food.id} className={styles.customFoodItem}>
              <div className={styles.customFoodContent}>
                <h4>{food.name}</h4>
                <p className={styles.foodCategory}>{food.category}</p>
                <div className={styles.macros}>
                  <span>{food.calories} kcal</span>
                  <span>{food.proteins}g protéines</span>
                  <span>{food.carbs}g glucides</span>
                  <span>{food.fats}g lipides</span>
                </div>
                {food.description && (
                  <p className={styles.description}>{food.description}</p>
                )}
              </div>
              <div className={styles.customFoodActions}>
                <button
                  type="button"
                  className={styles.editButton}
                  onClick={() => handleEdit(food)}
                >
                  ✏️ Modifier
                </button>
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => handleDelete(food.id)}
                >
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.customFoodManager}>
      <div className={styles.customFoodForm}>
        <h3>{editingId ? 'Modifier l\'aliment' : 'Ajouter un nouvel aliment'}</h3>
        
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="name">Nom de l'aliment</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="category">Catégorie</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionner une catégorie</option>
            {FOOD_CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="calories">Calories (kcal)</label>
            <input
              type="text"
              id="calories"
              name="calories"
              value={formData.calories}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="proteins">Protéines (g)</label>
            <input
              type="text"
              id="proteins"
              name="proteins"
              value={formData.proteins}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="carbs">Glucides (g)</label>
            <input
              type="text"
              id="carbs"
              name="carbs"
              value={formData.carbs}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="fats">Lipides (g)</label>
            <input
              type="text"
              id="fats"
              name="fats"
              value={formData.fats}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Description (optionnelle)</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className={styles.formActions}>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className={styles.cancelButton}
            disabled={isSubmitting}
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Création...' : editingId ? 'Modifier l\'aliment' : 'Créer l\'aliment'}
          </button>
        </div>
      </div>
    </div>
  );
}
