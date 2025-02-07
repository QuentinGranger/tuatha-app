'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ProgramForm from './form/ProgramForm';
import styles from './CreateProgram.module.css';

export default function CreateProgram() {
  const router = useRouter();
  const [status, setStatus] = useState('editing'); // editing, submitting, success, error
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setStatus('submitting');
    setError(null);

    try {
      console.log('Form data received:', formData);

      // Vérifier que les suppléments sont un tableau
      const supplements = Array.isArray(formData.supplements) ? formData.supplements : [];

      const requestData = {
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        patientId: formData.patientId,
        healthProfessionalId: formData.healthProfessionalId,
        status: formData.status || 'DRAFT'
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

      console.log('Request data:', requestData);

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
      console.log('Program created:', program);
      
      // Rediriger vers la page des programmes
      router.push('/dashboard/programmes');
      router.refresh();
      setStatus('success');
    } catch (error) {
      console.error('Error:', error);
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
        <p>Création du programme en cours...</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successIcon}>✓</div>
        <h2>Programme créé avec succès!</h2>
        <button onClick={handleCreateNew} className={styles.button}>
          Créer un nouveau programme
        </button>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>⚠️</div>
        <h2>Erreur lors de la création du programme</h2>
        <p className={styles.errorMessage}>{error}</p>
        <button onClick={handleRetry} className={styles.button}>
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2>Créer un nouveau programme</h2>
      <ProgramForm onSubmit={handleSubmit} />
    </div>
  );
}
