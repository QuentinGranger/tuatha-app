'use client';

import { useState, useEffect } from 'react';
import styles from './FormComponents.module.css';

export default function CustomFoodManager({ onFoodAdded }) {
  const [foods, setFoods] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    calories: '',
    proteins: '',
    carbs: '',
    fats: '',
    description: '',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const response = await fetch('/api/foods');
      const data = await response.json();
      setFoods(data.filter(food => food.isCustom));
    } catch (error) {
      console.error('Erreur lors de la récupération des aliments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const foodData = {
      ...formData,
      calories: parseFloat(formData.calories),
      proteins: parseFloat(formData.proteins),
      carbs: parseFloat(formData.carbs),
      fats: parseFloat(formData.fats),
    };

    try {
      if (editingId) {
        await fetch('/api/foods', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...foodData }),
        });
      } else {
        await fetch('/api/foods', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(foodData),
        });
      }

      setFormData({
        name: '',
        category: '',
        calories: '',
        proteins: '',
        carbs: '',
        fats: '',
        description: '',
      });
      setShowForm(false);
      setEditingId(null);
      fetchFoods();
      if (onFoodAdded) onFoodAdded();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
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
      description: food.description || '',
    });
    setEditingId(food.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet aliment ?')) return;

    try {
      await fetch(`/api/foods?id=${id}`, { method: 'DELETE' });
      fetchFoods();
      if (onFoodAdded) onFoodAdded();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  return (
    <div className={styles.customFoodManager}>
      <div className={styles.customFoodHeader}>
        <h3>Mes Aliments Personnalisés</h3>
        <button
          type="button"
          className={styles.addFoodButton}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Annuler' : 'Ajouter un aliment'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.customFoodForm}>
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
              <label htmlFor="category">Catégorie</label>
              <input
                type="text"
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>

            <div className={styles.formField}>
              <label htmlFor="calories">Calories</label>
              <input
                type="number"
                id="calories"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                required
              />
            </div>

            <div className={styles.formField}>
              <label htmlFor="proteins">Protéines (g)</label>
              <input
                type="number"
                id="proteins"
                value={formData.proteins}
                onChange={(e) => setFormData({ ...formData, proteins: e.target.value })}
                required
              />
            </div>

            <div className={styles.formField}>
              <label htmlFor="carbs">Glucides (g)</label>
              <input
                type="number"
                id="carbs"
                value={formData.carbs}
                onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                required
              />
            </div>

            <div className={styles.formField}>
              <label htmlFor="fats">Lipides (g)</label>
              <input
                type="number"
                id="fats"
                value={formData.fats}
                onChange={(e) => setFormData({ ...formData, fats: e.target.value })}
                required
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

          <button type="submit" className={styles.submitButton}>
            {editingId ? 'Modifier' : 'Ajouter'} l'aliment
          </button>
        </form>
      )}

      <div className={styles.customFoodList}>
        {foods.map((food) => (
          <div key={food.id} className={styles.customFoodItem}>
            <div className={styles.customFoodContent}>
              <h4>{food.name}</h4>
              <p className={styles.category}>{food.category}</p>
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
                onClick={() => handleEdit(food)}
                className={styles.editButton}
              >
                Modifier
              </button>
              <button
                type="button"
                onClick={() => handleDelete(food.id)}
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
