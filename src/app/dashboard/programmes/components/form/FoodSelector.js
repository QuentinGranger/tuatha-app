'use client';

import { useState, useEffect } from 'react';
import styles from './FormComponents.module.css';
import CustomFoodManager from './CustomFoodManager';

export default function FoodSelector({ selectedFoods, onFoodChange }) {
  const [foods, setFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const response = await fetch('/api/foods');
      const data = await response.json();
      setFoods(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching foods:', error);
      setLoading(false);
    }
  };

  const toggleFood = (foodId, timeOfDay) => {
    const existingEntry = selectedFoods.find(item => item.foodId === foodId);
    
    if (existingEntry) {
      // Si l'aliment est déjà sélectionné pour ce moment de la journée, on le retire
      if (existingEntry.timeOfDay === timeOfDay) {
        onFoodChange(selectedFoods.filter(item => !(item.foodId === foodId && item.timeOfDay === timeOfDay)));
      } else {
        // Si l'aliment est sélectionné pour un autre moment, on met à jour le moment
        onFoodChange(selectedFoods.map(item => 
          item.foodId === foodId ? { ...item, timeOfDay } : item
        ));
      }
    } else {
      // Si l'aliment n'est pas encore sélectionné, on l'ajoute
      onFoodChange([...selectedFoods, { foodId, timeOfDay }]);
    }
  };

  const getFoodTimeOfDay = (foodId) => {
    const entry = selectedFoods.find(item => item.foodId === foodId);
    return entry ? entry.timeOfDay : null;
  };

  const filteredFoods = foods.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    food.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className={styles.loading}>Chargement des aliments...</div>;
  }

  return (
    <div className={styles.foodSelector}>
      <h3>Aliments Recommandés</h3>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Rechercher un aliment..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {filteredFoods.length === 0 ? (
        <div className={styles.noResults}>
          Aucun aliment trouvé pour "{searchTerm}"
        </div>
      ) : (
        <div className={styles.foodList}>
          {filteredFoods.map((food) => {
            const timeOfDay = getFoodTimeOfDay(food.id);
            return (
              <div
                key={food.id}
                className={`${styles.foodItem} ${timeOfDay ? styles.selected : ''}`}
              >
                <div className={styles.foodHeader}>
                  <div className={styles.foodName}>
                    <span className={styles.foodIcon}>🍽️</span>
                    {food.name}
                  </div>
                  <div className={styles.foodType}>{food.category}</div>
                </div>
                
                <div className={styles.foodDetails}>
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

                <div className={styles.mealTimeSelector}>
                  <button
                    type="button"
                    className={`${styles.mealTimeButton} ${timeOfDay === 'breakfast' ? styles.selected : ''}`}
                    onClick={() => toggleFood(food.id, 'breakfast')}
                  >
                    <span className={styles.mealTimeIcon}>🌅</span>
                    Petit déjeuner
                  </button>
                  <button
                    type="button"
                    className={`${styles.mealTimeButton} ${timeOfDay === 'lunch' ? styles.selected : ''}`}
                    onClick={() => toggleFood(food.id, 'lunch')}
                  >
                    <span className={styles.mealTimeIcon}>☀️</span>
                    Déjeuner
                  </button>
                  <button
                    type="button"
                    className={`${styles.mealTimeButton} ${timeOfDay === 'dinner' ? styles.selected : ''}`}
                    onClick={() => toggleFood(food.id, 'dinner')}
                  >
                    <span className={styles.mealTimeIcon}>🌙</span>
                    Dîner
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CustomFoodManager onFoodAdded={() => fetchFoods()} />

      <div className={styles.selectedCount}>
        {selectedFoods.length} aliments sélectionnés
      </div>
    </div>
  );
}
