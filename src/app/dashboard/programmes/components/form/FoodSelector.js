'use client';

import { useState, useEffect } from 'react';
import styles from './FormComponents.module.css';
import CustomFoodManager from './CustomFoodManager';
import { FiSunrise, FiSun, FiMoon, FiSearch, FiPlus, FiTrash2 } from 'react-icons/fi';

export default function FoodSelector({ selectedFoods = [], onFoodsChange }) {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState('breakfast');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFoodSelector, setShowFoodSelector] = useState(true);

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

  const removeFoodFromMeal = (foodId, timeOfDay) => {
    const newSelectedFoods = selectedFoods.filter(
      f => !(f.id === foodId && f.timeOfDay === timeOfDay)
    );
    onFoodsChange(newSelectedFoods);
  };

  const filteredFoods = foods.filter(food => {
    // Vérifier que food et food.name existent avant d'utiliser toLowerCase()
    const matchesSearch = food && food.name 
      ? food.name.toLowerCase().includes(searchTerm.toLowerCase()) 
      : false;
    const matchesCategory = !selectedCategory || (food && food.category === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(foods.map(food => food.category))];
  
  // Grouper les aliments sélectionnés par type de repas
  const breakfastFoods = selectedFoods.filter(food => food.timeOfDay === 'breakfast');
  const lunchFoods = selectedFoods.filter(food => food.timeOfDay === 'lunch');
  const dinnerFoods = selectedFoods.filter(food => food.timeOfDay === 'dinner');

  // Fonction pour afficher le titre du repas selon le type
  const getMealTitle = (timeOfDay) => {
    switch(timeOfDay) {
      case 'breakfast': return 'Petit déjeuner';
      case 'lunch': return 'Déjeuner';
      case 'dinner': return 'Dîner';
      default: return '';
    }
  };

  // Fonction pour afficher l'icône du repas selon le type
  const getMealIcon = (timeOfDay) => {
    switch(timeOfDay) {
      case 'breakfast': return <FiSunrise size={20} />;
      case 'lunch': return <FiSun size={20} />;
      case 'dinner': return <FiMoon size={20} />;
      default: return null;
    }
  };

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

      {showFoodSelector ? (
        <>
          <div className={styles.foodFilters}>
            <div className={styles.searchInputWrapper}>
              <FiSearch size={18} />
              <input
                type="text"
                placeholder="Rechercher un aliment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
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
            {filteredFoods.length > 0 ? (
              filteredFoods.map(food => {
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
                      <span title="Protéines">P: {food.protein}g</span>
                      <span title="Glucides">G: {food.carbs}g</span>
                      <span title="Lipides">L: {food.fat}g</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={styles.emptyResult}>
                Aucun aliment trouvé pour cette recherche.
              </div>
            )}
          </div>
        </>
      ) : null}
      
      {/* Résumé des repas */}
      <div className={styles.mealsContainer}>
        {/* Petit déjeuner */}
        <div className={styles.mealSummary}>
          <div className={`${styles.mealHeader} ${styles.breakfast}`}>
            <h4>{getMealIcon('breakfast')} {getMealTitle('breakfast')}</h4>
            <div className={styles.mealMacros}>
              <span>P: {breakfastFoods.reduce((sum, food) => sum + (food.protein || 0), 0)}g</span>
              <span>G: {breakfastFoods.reduce((sum, food) => sum + (food.carbs || 0), 0)}g</span>
              <span>L: {breakfastFoods.reduce((sum, food) => sum + (food.fat || 0), 0)}g</span>
            </div>
          </div>
          <div className={styles.mealItems}>
            {breakfastFoods.length > 0 ? (
              breakfastFoods.map(food => (
                <div key={`meal-breakfast-${food.id}`} className={styles.mealItem}>
                  <span className={styles.mealItemName}>{food.name}</span>
                  <div className={styles.mealItemActions}>
                    <div className={styles.mealItemMacros}>
                      <span>P: {food.protein}g</span>
                      <span>G: {food.carbs}g</span>
                      <span>L: {food.fat}g</span>
                    </div>
                    <button 
                      className={styles.removeButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFoodFromMeal(food.id, 'breakfast');
                      }}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyMeal}>
                Aucun aliment sélectionné pour le petit déjeuner
              </div>
            )}
          </div>
        </div>

        {/* Déjeuner */}
        <div className={styles.mealSummary}>
          <div className={`${styles.mealHeader} ${styles.lunch}`}>
            <h4>{getMealIcon('lunch')} {getMealTitle('lunch')}</h4>
            <div className={styles.mealMacros}>
              <span>P: {lunchFoods.reduce((sum, food) => sum + (food.protein || 0), 0)}g</span>
              <span>G: {lunchFoods.reduce((sum, food) => sum + (food.carbs || 0), 0)}g</span>
              <span>L: {lunchFoods.reduce((sum, food) => sum + (food.fat || 0), 0)}g</span>
            </div>
          </div>
          <div className={styles.mealItems}>
            {lunchFoods.length > 0 ? (
              lunchFoods.map(food => (
                <div key={`meal-lunch-${food.id}`} className={styles.mealItem}>
                  <span className={styles.mealItemName}>{food.name}</span>
                  <div className={styles.mealItemActions}>
                    <div className={styles.mealItemMacros}>
                      <span>P: {food.protein}g</span>
                      <span>G: {food.carbs}g</span>
                      <span>L: {food.fat}g</span>
                    </div>
                    <button 
                      className={styles.removeButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFoodFromMeal(food.id, 'lunch');
                      }}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyMeal}>
                Aucun aliment sélectionné pour le déjeuner
              </div>
            )}
          </div>
        </div>

        {/* Dîner */}
        <div className={styles.mealSummary}>
          <div className={`${styles.mealHeader} ${styles.dinner}`}>
            <h4>{getMealIcon('dinner')} {getMealTitle('dinner')}</h4>
            <div className={styles.mealMacros}>
              <span>P: {dinnerFoods.reduce((sum, food) => sum + (food.protein || 0), 0)}g</span>
              <span>G: {dinnerFoods.reduce((sum, food) => sum + (food.carbs || 0), 0)}g</span>
              <span>L: {dinnerFoods.reduce((sum, food) => sum + (food.fat || 0), 0)}g</span>
            </div>
          </div>
          <div className={styles.mealItems}>
            {dinnerFoods.length > 0 ? (
              dinnerFoods.map(food => (
                <div key={`meal-dinner-${food.id}`} className={styles.mealItem}>
                  <span className={styles.mealItemName}>{food.name}</span>
                  <div className={styles.mealItemActions}>
                    <div className={styles.mealItemMacros}>
                      <span>P: {food.protein}g</span>
                      <span>G: {food.carbs}g</span>
                      <span>L: {food.fat}g</span>
                    </div>
                    <button 
                      className={styles.removeButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFoodFromMeal(food.id, 'dinner');
                      }}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyMeal}>
                Aucun aliment sélectionné pour le dîner
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toggle pour afficher/masquer le sélecteur d'aliments */}
      <button 
        className={styles.toggleSelectorButton}
        onClick={() => setShowFoodSelector(!showFoodSelector)}
      >
        {showFoodSelector ? 'Masquer la sélection d\'aliments' : 'Afficher la sélection d\'aliments'}
        {showFoodSelector ? null : <FiPlus size={16} />}
      </button>

      <CustomFoodManager onFoodAdded={handleFoodAdded} />
    </div>
  );
}
