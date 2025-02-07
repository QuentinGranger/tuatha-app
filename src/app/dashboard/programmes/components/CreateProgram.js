'use client';

import { useState } from 'react';
import styles from './CreateProgram.module.css';
import ProgramForm from './form/ProgramForm';

export default function CreateProgram() {
  const [status, setStatus] = useState('editing'); // editing, submitting, success, error
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setStatus('submitting');
    setError(null);

    try {
      const response = await fetch('/api/programs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create program');
      }

      setStatus('success');
    } catch (err) {
      setError(err.message);
      setStatus('error');
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

  return (
    <div className={styles.container}>
      {status === 'editing' && (
        <>
          <h2>Créer un nouveau programme</h2>
          <ProgramForm onSubmit={handleSubmit} />
        </>
      )}

      {status === 'submitting' && (
        <div className={styles.message}>
          Création du programme en cours...
        </div>
      )}

      {status === 'error' && (
        <div className={styles.error}>
          <h2>Erreur lors de la création du programme</h2>
          <p>{error}</p>
          <button className={styles.retryButton} onClick={handleRetry}>
            <span>Réessayer</span>
          </button>
        </div>
      )}

      {status === 'success' && (
        <div className={styles.success}>
          <h2>Programme créé avec succès!</h2>
          <p>Votre nouveau programme a été créé et est maintenant disponible.</p>
          <button className={styles.newButton} onClick={handleCreateNew}>
            <span>Créer un autre programme</span>
          </button>
        </div>
      )}
    </div>
  );
}
