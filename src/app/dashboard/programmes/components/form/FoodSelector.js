'use client';

import { useState, useEffect } from 'react';
import styles from './FormComponents.module.css';
import CustomFoodManager from './CustomFoodManager';

export default function FoodSelector({ selectedFoods = [], onFoodsChange }) {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState('breakfast');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const fetchFoods = async () => {
    try {
      const response = await fetch('/api/foods');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des aliments');
      }
      const data = await response.json();
      setFoods(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching foods:', err);
      setError('Erreur lors de la récupération des aliments');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleFoodAdded = (newFood) => {
    setFoods(prevFoods => [...prevFoods, newFood]);
  };

  const handleTimeOfDaySelect = (timeOfDay) => {
    setSelectedTimeOfDay(timeOfDay);
  };

  const handleFoodClick = (food) => {
    const foodWithTimeOfDay = {
      ...food,
      timeOfDay: selectedTimeOfDay
    };

    const existingFoodIndex = selectedFoods.findIndex(
      f => f.id === food.id && f.timeOfDay === selectedTimeOfDay
    );

    if (existingFoodIndex >= 0) {
      // Si l'aliment est déjà sélectionné pour ce moment de la journée, le retirer
      const newSelectedFoods = [...selectedFoods];
      newSelectedFoods.splice(existingFoodIndex, 1);
      onFoodsChange(newSelectedFoods);
    } else {
      // Sinon, l'ajouter
      onFoodsChange([...selectedFoods, foodWithTimeOfDay]);
    }
  };

  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(foods.map(food => food.category))];

  if (loading) {
    return <div className={styles.loading}>Chargement des aliments...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.foodSelector}>
      <div className={styles.timeOfDaySelector}>
        {['breakfast', 'lunch', 'dinner'].map(timeOfDay => (
          <button
            key={`time-${timeOfDay}`}
            type="button"
            className={`${styles.timeButton} ${selectedTimeOfDay === timeOfDay ? styles.selected : ''}`}
            onClick={() => handleTimeOfDaySelect(timeOfDay)}
          >
            {timeOfDay === 'breakfast' ? 'Petit déjeuner' : timeOfDay === 'lunch' ? 'Déjeuner' : 'Dîner'}
          </button>
        ))}
      </div>

      <div className={styles.foodFilters}>
        <input
          type="text"
          placeholder="Rechercher un aliment..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={styles.categorySelect}
        >
          <option value="">Toutes les catégories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.foodList}>
        {filteredFoods.map(food => {
          const isSelected = selectedFoods.some(
            f => f.id === food.id && f.timeOfDay === selectedTimeOfDay
          );
          return (
            <div
              key={`food-${food.id}-${selectedTimeOfDay}`}
              className={`${styles.foodItem} ${isSelected ? styles.selected : ''}`}
              onClick={() => handleFoodClick(food)}
            >
              <div className={styles.foodInfo}>
                <h4>{food.name}</h4>
                <p className={styles.foodCategory}>{food.category}</p>
              </div>
              <div className={styles.foodMacros}>
                <span>P: {food.protein}g</span>
                <span>G: {food.carbs}g</span>
                <span>L: {food.fat}g</span>
              </div>
            </div>
          );
        })}
      </div>

      <CustomFoodManager onFoodAdded={handleFoodAdded} />
    </div>
  );
}
