'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import NutritionPlanForm from './form/NutritionPlanForm';
import styles from './CreateProgram.module.css';

export default function CreateProgram() {
  const router = useRouter();
  const [status, setStatus] = useState('editing'); // editing, submitting, success, error
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setStatus('submitting');
    setError(null);

    try {
      console.log('CreateNutritionProgram - Form data received:', formData);

      // Vérifier les champs requis
      const requiredFields = ['title', 'patientId', 'healthProfessionalId', 'startDate'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        console.log('CreateNutritionProgram - Missing fields:', missingFields);
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Vérifier que les suppléments sont un tableau
      const supplements = Array.isArray(formData.supplements) ? formData.supplements : [];
      
      // Vérifier que les repas sont un tableau
      const meals = Array.isArray(formData.meals) ? formData.meals : [];

      const requestData = {
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        patientId: formData.patientId,
        healthProfessionalId: formData.healthProfessionalId || formData.nutritionistId,
        nutritionistId: formData.nutritionistId || formData.healthProfessionalId,
        status: formData.status || 'DRAFT',
        calories: formData.calories,
        proteins: formData.proteins,
        carbs: formData.carbs,
        fats: formData.fats,
        restrictions: formData.restrictions,
        objectives: formData.objectives,
        dietType: formData.dietType || 'BALANCED',
        dietGoal: formData.dietGoal || 'MAINTENANCE'
      };

      // Ajouter les suppléments seulement s'il y en a
      if (supplements.length > 0) {
        requestData.supplements = supplements.map(supplement => ({
          id: supplement.id,
          dosage: supplement.dosage,
          frequency: supplement.frequency,
          notes: supplement.notes
        }));
      }
      
      // Ajouter les repas seulement s'il y en a
      if (meals.length > 0) {
        requestData.meals = meals.map(meal => ({
          id: meal.id,
          name: meal.name,
          calories: meal.calories,
          protein: meal.protein,
          carbohydrates: meal.carbohydrates,
          fat: meal.fat,
          timeOfDay: meal.timeOfDay,
          notes: meal.notes
        }));
      }

      console.log('CreateNutritionProgram - Request data to send:', requestData);

      const response = await fetch('/api/programs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create program');
      }

      const program = await response.json();
      console.log('CreateNutritionProgram - Program created:', program);
      
      // Rediriger vers la page des programmes
      router.push('/dashboard/programmes');
      router.refresh();
      setStatus('success');
    } catch (error) {
      console.error('CreateNutritionProgram - Error:', error);
      setError(error.message);
      setStatus('error');
      throw new Error('Failed to create program: ' + error.message);
    }
  };

  const handleRetry = () => {
    setStatus('editing');
    setError(null);
  };

  const handleCreateNew = () => {
    setStatus('editing');
    setError(null);
  };

  if (status === 'submitting') {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <p>Création du plan nutritionnel en cours...</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successIcon}>✓</div>
        <h2>Plan nutritionnel créé avec succès!</h2>
        <button onClick={handleCreateNew} className={styles.button}>
          Créer un nouveau plan nutritionnel
        </button>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>⚠️</div>
        <h2>Erreur lors de la création du plan nutritionnel</h2>
        <p className={styles.errorMessage}>{error}</p>
        <button onClick={handleRetry} className={styles.button}>
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2>Créer un nouveau plan nutritionnel</h2>
      <NutritionPlanForm 
        onSubmit={handleSubmit} 
        patientId="pat-001" 
        healthProfessionalId="hp-001" 
      />
    </div>
  );
}
