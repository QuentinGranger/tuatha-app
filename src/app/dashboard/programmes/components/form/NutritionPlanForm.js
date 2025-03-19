'use client';

import { useState } from 'react';
import styles from './FormComponents.module.css';
import FoodSelector from './FoodSelector';
import SupplementsForm from './SupplementsForm';
import { 
  FiCalendar, 
  FiEdit3, 
  FiList, 
  FiPackage, 
  FiActivity, 
  FiTarget, 
  FiLayers, 
  FiCheckCircle,
  FiTrendingDown,
  FiTrendingUp,
  FiCrosshair,
  FiHeart,
  FiShield,
  FiRefreshCw,
  FiSettings,
  FiBreakfast,
  FiCoffee
} from 'react-icons/fi';
import { 
  GiMeat, 
  GiPlantRoots, 
  GiCarrot, 
  GiWheat, 
  GiMilkCarton,
  GiBowlOfRice,
  GiBroccoli,
  GiOlive,
  GiPaperBagOpen
} from 'react-icons/gi';
import { TbScale, TbMeat } from 'react-icons/tb';
import { MdOutlineBalance } from 'react-icons/md';

export default function NutritionPlanForm({ onSubmit, initialData, patientId, healthProfessionalId }) {
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
    dietType: initialData?.dietType || 'BALANCED',
    dietGoal: initialData?.dietGoal || 'MAINTENANCE',
    patientId: initialData?.patientId || patientId || '',
    healthProfessionalId: initialData?.healthProfessionalId || healthProfessionalId || '',
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
      // Vérifier et forcer les valeurs par défaut si nécessaire
      const actualPatientId = formData.patientId || patientId || 'pat-001';
      const actualHealthProfessionalId = formData.healthProfessionalId || healthProfessionalId || 'hp-001';
      const actualStartDate = formData.startDate ? formatDateToISO(formData.startDate) : new Date().toISOString();
      
      console.log('NutritionPlanForm - Données du formulaire avant formatage:', {
        ...formData,
        patientId: actualPatientId,
        healthProfessionalId: actualHealthProfessionalId
      });

      const formattedData = {
        title: formData.title || 'Plan nutritionnel par défaut',
        description: formData.description,
        startDate: actualStartDate,
        endDate: formatDateToISO(formData.endDate),
        status: 'TEMPLATE',
        calories: formData.calories,
        proteins: formData.proteins,
        carbs: formData.carbs,
        fats: formData.fats,
        restrictions: formData.restrictions,
        objectives: formData.objectives,
        dietType: formData.dietType,
        dietGoal: formData.dietGoal,
        patientId: actualPatientId,
        healthProfessionalId: actualHealthProfessionalId
      };

      console.log('NutritionPlanForm - Données formatées:', formattedData);

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

  const appendTextToField = (fieldName, text) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: prev[fieldName] + (prev[fieldName] ? ', ' : '') + text
    }));
  };

  const handlePresetClick = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formSection}>
        <div className={styles.sectionHeader}>
          <FiEdit3 size={24} />
          <h3>Informations générales</h3>
        </div>
        
        <div className={styles.infoCardWrapper}>
          <div className={styles.infoCard}>
            <div className={styles.formField}>
              <label htmlFor="title">
                <span className={styles.requiredField}>Titre du plan nutritionnel *</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Ex: Régime méditerranéen personnalisé"
                className={styles.primaryInput}
              />
              <small className={styles.fieldHint}>Un titre clair qui décrit le plan nutritionnel</small>
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
                className={styles.expandingTextarea}
              />
              <small className={styles.fieldHint}>Décrivez le plan, ses objectifs et ses caractéristiques</small>
            </div>
          </div>

          <div className={styles.dateCardContainer}>
            <div className={styles.dateCard}>
              <div className={styles.dateCardHeader}>
                <FiCalendar size={20} />
                <h4>Période du programme</h4>
              </div>
              
              <div className={styles.formField}>
                <label htmlFor="startDate">
                  <span className={styles.requiredField}>Date de début *</span>
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className={styles.dateInput}
                  required
                />
              </div>

              <div className={styles.formField}>
                <label htmlFor="endDate">Date de fin prévue</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className={styles.dateInput}
                />
                <small className={styles.fieldHint}>Optionnel - Laissez vide pour un programme sans date de fin</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.formSection}>
        <h3>
          <FiTarget size={20} />
          Type de régime et objectif
        </h3>
        
        <div className={styles.dietTypeSection}>
          <h4 className={styles.dietSectionTitle}>Type de régime</h4>
          <div className={styles.dietOptionsGrid}>
            {[
              { value: 'BALANCED', label: 'Équilibré', icon: <MdOutlineBalance size={20} /> },
              { value: 'LOW_CARB', label: 'Faible en glucides', icon: <GiCarrot size={20} /> },
              { value: 'KETO', label: 'Cétogène', icon: <GiMeat size={20} /> },
              { value: 'VEGETARIAN', label: 'Végétarien', icon: <GiPlantRoots size={20} /> },
              { value: 'VEGAN', label: 'Végan', icon: <GiBroccoli size={20} /> },
              { value: 'PALEO', label: 'Paléo', icon: <GiBowlOfRice size={20} /> },
              { value: 'MEDITERRANEAN', label: 'Méditerranéen', icon: <GiOlive size={20} /> },
              { value: 'GLUTEN_FREE', label: 'Sans gluten', icon: <GiWheat size={20} /> },
              { value: 'DAIRY_FREE', label: 'Sans produits laitiers', icon: <GiMilkCarton size={20} /> },
              { value: 'CUSTOM', label: 'Personnalisé', icon: <FiSettings size={20} /> }
            ].map(option => (
              <div
                key={option.value}
                className={`${styles.dietOptionCard} ${formData.dietType === option.value ? styles.selectedDietOption : ''}`}
                onClick={() => {
                  setFormData({
                    ...formData,
                    dietType: option.value
                  });
                }}
              >
                <div className={styles.dietOptionIcon}>{option.icon}</div>
                <div className={styles.dietOptionLabel}>{option.label}</div>
              </div>
            ))}
          </div>
          
          <h4 className={styles.dietSectionTitle}>Objectif du régime</h4>
          <div className={styles.dietGoalsGrid}>
            {[
              { value: 'WEIGHT_LOSS', label: 'Perte de poids', icon: <FiTrendingDown size={20} /> },
              { value: 'MAINTENANCE', label: 'Maintien du poids', icon: <FiCrosshair size={20} /> },
              { value: 'WEIGHT_GAIN', label: 'Prise de poids', icon: <FiTrendingUp size={20} /> },
              { value: 'MUSCLE_BUILDING', label: 'Construction musculaire', icon: <TbMeat size={20} /> },
              { value: 'HEALTH_IMPROVEMENT', label: 'Amélioration de la santé', icon: <FiHeart size={20} /> },
              { value: 'DISEASE_PREVENTION', label: 'Prévention des maladies', icon: <FiShield size={20} /> },
              { value: 'RECOVERY', label: 'Récupération', icon: <FiRefreshCw size={20} /> },
              { value: 'CUSTOM', label: 'Personnalisé', icon: <FiSettings size={20} /> }
            ].map(option => (
              <div
                key={option.value}
                className={`${styles.dietGoalCard} ${formData.dietGoal === option.value ? styles.selectedDietGoal : ''}`}
                onClick={() => {
                  setFormData({
                    ...formData,
                    dietGoal: option.value
                  });
                }}
              >
                <div className={styles.dietGoalIcon}>{option.icon}</div>
                <div className={styles.dietGoalLabel}>{option.label}</div>
              </div>
            ))}
          </div>
          
          {/* Champs cachés pour maintenir la compatibilité avec le formulaire */}
          <input
            type="hidden"
            id="dietType"
            name="dietType"
            value={formData.dietType}
          />
          <input
            type="hidden"
            id="dietGoal"
            name="dietGoal"
            value={formData.dietGoal}
          />
        </div>
      </div>

      <div className={styles.formSection}>
        <h3>
          <FiActivity size={20} />
          Objectifs et restrictions
        </h3>
        <div className={styles.nutritionGoalsContainer}>
          <div className={styles.goalCard}>
            <div className={styles.goalCardHeader}>
              <FiTarget size={20} />
              <h4>Objectifs nutritionnels</h4>
            </div>
            <div className={styles.goalContent}>
              <p className={styles.goalDescription}>
                Précisez les objectifs spécifiques que ce plan nutritionnel doit atteindre pour le patient.
              </p>
              <textarea
                id="objectives"
                name="objectives"
                value={formData.objectives}
                onChange={handleInputChange}
                placeholder="Ex: Perte de poids, gain de masse musculaire, équilibre alimentaire..."
                rows={4}
                className={styles.goalTextarea}
              />
              <div className={styles.objectiveTags}>
                <span onClick={() => appendTextToField('objectives', 'Perte de poids')}>Perte de poids</span>
                <span onClick={() => appendTextToField('objectives', 'Masse musculaire')}>Masse musculaire</span>
                <span onClick={() => appendTextToField('objectives', 'Énergie')}>Énergie</span>
                <span onClick={() => appendTextToField('objectives', 'Bien-être')}>Bien-être</span>
              </div>
            </div>
          </div>

          <div className={styles.goalCard}>
            <div className={styles.goalCardHeader}>
              <FiShield size={20} />
              <h4>Restrictions alimentaires</h4>
            </div>
            <div className={styles.goalContent}>
              <p className={styles.goalDescription}>
                Indiquez les aliments ou ingrédients à éviter et toute restriction spécifique à prendre en compte.
              </p>
              <textarea
                id="restrictions"
                name="restrictions"
                value={formData.restrictions}
                onChange={handleInputChange}
                placeholder="Ex: Sans gluten, végétarien, allergies..."
                rows={4}
                className={styles.goalTextarea}
              />
              <div className={styles.restrictionTags}>
                <span onClick={() => appendTextToField('restrictions', 'Sans gluten')}>Sans gluten</span>
                <span onClick={() => appendTextToField('restrictions', 'Allergie lactose')}>Allergie lactose</span>
                <span onClick={() => appendTextToField('restrictions', 'Fruits à coque')}>Fruits à coque</span>
                <span onClick={() => appendTextToField('restrictions', 'Sans sucre ajouté')}>Sans sucre ajouté</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.formSection}>
        <h3>
          <FiActivity size={20} />
          Besoins nutritionnels quotidiens
        </h3>
        <div className={styles.nutritionNeedsContainer}>
          <p className={styles.sectionDescription}>
            Définissez les apports nutritionnels quotidiens recommandés pour ce plan. Ces valeurs serviront de référence pour évaluer l'équilibre nutritionnel global.
          </p>
          
          <div className={styles.macroCardsContainer}>
            <div className={styles.macroCard}>
              <div className={styles.macroCardHeader}>
                <FiTarget size={20} />
                <h4>Calories</h4>
              </div>
              <div className={styles.macroCardContent}>
                <div className={styles.macroIconContainer}>
                  <GiPaperBagOpen size={36} className={styles.macroIcon} />
                </div>
                <div className={styles.macroInputContainer}>
                  <div className={styles.macroInputWrapper}>
                    <input
                      type="number"
                      id="calories"
                      name="calories"
                      value={formData.calories}
                      onChange={handleInputChange}
                      placeholder="Ex: 2000"
                      className={styles.macroInput}
                    />
                    <span className={styles.macroUnit}>kcal</span>
                  </div>
                  <div className={styles.macroDescription}>
                    Apport calorique quotidien total
                  </div>
                  <div className={styles.macroPresets}>
                    <span onClick={() => handlePresetClick('calories', 1500)}>1500</span>
                    <span onClick={() => handlePresetClick('calories', 2000)}>2000</span>
                    <span onClick={() => handlePresetClick('calories', 2500)}>2500</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.macroCard}>
              <div className={styles.macroCardHeader}>
                <FiTarget size={20} />
                <h4>Protéines</h4>
              </div>
              <div className={styles.macroCardContent}>
                <div className={styles.macroIconContainer}>
                  <TbMeat size={36} className={styles.macroIcon} />
                </div>
                <div className={styles.macroInputContainer}>
                  <div className={styles.macroInputWrapper}>
                    <input
                      type="number"
                      id="proteins"
                      name="proteins"
                      value={formData.proteins}
                      onChange={handleInputChange}
                      placeholder="Ex: 100"
                      className={styles.macroInput}
                    />
                    <span className={styles.macroUnit}>g</span>
                  </div>
                  <div className={styles.macroDescription}>
                    Essentiel pour la croissance et la réparation musculaire
                  </div>
                  <div className={styles.macroPresets}>
                    <span onClick={() => handlePresetClick('proteins', 60)}>60</span>
                    <span onClick={() => handlePresetClick('proteins', 100)}>100</span>
                    <span onClick={() => handlePresetClick('proteins', 150)}>150</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.macroCard}>
              <div className={styles.macroCardHeader}>
                <FiTarget size={20} />
                <h4>Glucides</h4>
              </div>
              <div className={styles.macroCardContent}>
                <div className={styles.macroIconContainer}>
                  <GiWheat size={36} className={styles.macroIcon} />
                </div>
                <div className={styles.macroInputContainer}>
                  <div className={styles.macroInputWrapper}>
                    <input
                      type="number"
                      id="carbs"
                      name="carbs"
                      value={formData.carbs}
                      onChange={handleInputChange}
                      placeholder="Ex: 250"
                      className={styles.macroInput}
                    />
                    <span className={styles.macroUnit}>g</span>
                  </div>
                  <div className={styles.macroDescription}>
                    Principale source d'énergie pour l'organisme
                  </div>
                  <div className={styles.macroPresets}>
                    <span onClick={() => handlePresetClick('carbs', 150)}>150</span>
                    <span onClick={() => handlePresetClick('carbs', 250)}>250</span>
                    <span onClick={() => handlePresetClick('carbs', 350)}>350</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.macroCard}>
              <div className={styles.macroCardHeader}>
                <FiTarget size={20} />
                <h4>Lipides</h4>
              </div>
              <div className={styles.macroCardContent}>
                <div className={styles.macroIconContainer}>
                  <GiOlive size={36} className={styles.macroIcon} />
                </div>
                <div className={styles.macroInputContainer}>
                  <div className={styles.macroInputWrapper}>
                    <input
                      type="number"
                      id="fats"
                      name="fats"
                      value={formData.fats}
                      onChange={handleInputChange}
                      placeholder="Ex: 70"
                      className={styles.macroInput}
                    />
                    <span className={styles.macroUnit}>g</span>
                  </div>
                  <div className={styles.macroDescription}>
                    Important pour l'absorption des vitamines et hormones
                  </div>
                  <div className={styles.macroPresets}>
                    <span onClick={() => handlePresetClick('fats', 40)}>40</span>
                    <span onClick={() => handlePresetClick('fats', 70)}>70</span>
                    <span onClick={() => handlePresetClick('fats', 100)}>100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {formData.calories && formData.proteins && formData.carbs && formData.fats && (
            <div className={styles.macroDistribution}>
              <h4>Répartition des macronutriments</h4>
              <div className={styles.macroProgressBars}>
                <div className={styles.macroProgressItem}>
                  <div className={styles.macroProgressLabel}>
                    <span>Protéines</span>
                    <span>{Math.round((formData.proteins * 4 / (formData.calories || 1)) * 100)}%</span>
                  </div>
                  <div className={styles.macroProgressBar}>
                    <div 
                      className={styles.macroProgressBarFill} 
                      style={{ 
                        width: `${Math.round((formData.proteins * 4 / (formData.calories || 1)) * 100)}%`,
                        backgroundColor: '#FF721C' 
                      }}
                    ></div>
                  </div>
                </div>
                <div className={styles.macroProgressItem}>
                  <div className={styles.macroProgressLabel}>
                    <span>Glucides</span>
                    <span>{Math.round((formData.carbs * 4 / (formData.calories || 1)) * 100)}%</span>
                  </div>
                  <div className={styles.macroProgressBar}>
                    <div 
                      className={styles.macroProgressBarFill} 
                      style={{ 
                        width: `${Math.round((formData.carbs * 4 / (formData.calories || 1)) * 100)}%`,
                        backgroundColor: '#2196F3' 
                      }}
                    ></div>
                  </div>
                </div>
                <div className={styles.macroProgressItem}>
                  <div className={styles.macroProgressLabel}>
                    <span>Lipides</span>
                    <span>{Math.round((formData.fats * 9 / (formData.calories || 1)) * 100)}%</span>
                  </div>
                  <div className={styles.macroProgressBar}>
                    <div 
                      className={styles.macroProgressBarFill} 
                      style={{ 
                        width: `${Math.round((formData.fats * 9 / (formData.calories || 1)) * 100)}%`,
                        backgroundColor: '#4CAF50' 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
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

      <div className={styles.formSection}>
        <h3>
          <FiTarget size={20} />
          Informations patient et professionnel de santé
        </h3>
        <div className={styles.formGrid}>
          <div className={styles.formField}>
            <label htmlFor="patientId">ID du patient</label>
            <input
              type="text"
              id="patientId"
              name="patientId"
              value={formData.patientId}
              onChange={handleInputChange}
              placeholder="Ex: 12345"
            />
          </div>

          <div className={styles.formField}>
            <label htmlFor="healthProfessionalId">ID du professionnel de santé</label>
            <input
              type="text"
              id="healthProfessionalId"
              name="healthProfessionalId"
              value={formData.healthProfessionalId}
              onChange={handleInputChange}
              placeholder="Ex: 67890"
            />
          </div>
        </div>
      </div>

      <div className={styles.formActions}>
        <button type="submit" className={styles.submitButton}>
          Créer le plan nutritionnel
        </button>
      </div>
    </form>
  );
}
