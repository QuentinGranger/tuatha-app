'use client';

import { useState, useEffect } from 'react';
import styles from './ProgramList.module.css';

export default function ProgramList() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await fetch('/api/programs');
      if (!response.ok) {
        throw new Error('Failed to fetch programs');
      }
      const data = await response.json();
      setPrograms(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Chargement des programmes...</div>;
  }

  if (error) {
    return <div className={styles.error}>Erreur: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Rechercher un programme..."
          className={styles.searchInput}
        />
      </div>

      <div className={styles.grid}>
        {programs.map((program) => (
          <div key={program.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>{program.title}</h3>
              <span className={styles.status}>{program.status}</span>
            </div>
            
            <div className={styles.description}>
              {program.description}
            </div>

            <div className={styles.dates}>
              <div>
                <span>Début: {new Date(program.startDate).toLocaleDateString()}</span>
              </div>
              {program.endDate && (
                <div>
                  <span>Fin: {new Date(program.endDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            <div className={styles.stats}>
              <div>
                <span>🏋️ {program.exercises?.length || 0}</span>
                <label>Exercices</label>
              </div>
            </div>

            <div className={styles.actions}>
              <button className={styles.editButton}>
                ✏️ Modifier
              </button>
              <button className={styles.viewButton}>
                👁️ Voir détails
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
