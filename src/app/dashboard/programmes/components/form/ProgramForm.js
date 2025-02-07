'use client';

import { useState } from 'react';
import styles from './FormComponents.module.css';
import PathologySelector from './PathologySelector';
import FoodSelector from './FoodSelector';
import SupplementsForm from './SupplementsForm';
import DurationPicker from './DurationPicker';

export default function ProgramForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'PENDING',
    patientId: '',
    healthProfessionalId: '',
    foods: [],
    supplements: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* Section Informations Générales */}
      <div className={styles.section}>
        <h2>Informations Générales</h2>
        
        <div className={styles.field}>
          <label htmlFor="title">Titre du Programme</label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="startDate">Date de début</label>
          <input
            type="date"
            id="startDate"
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="endDate">Date de fin</label>
          <input
            type="date"
            id="endDate"
            value={formData.endDate}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="patientId">ID du Patient</label>
          <input
            type="text"
            id="patientId"
            value={formData.patientId}
            onChange={(e) => setFormData(prev => ({ ...prev, patientId: e.target.value }))}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="healthProfessionalId">ID du Professionnel de Santé</label>
          <input
            type="text"
            id="healthProfessionalId"
            value={formData.healthProfessionalId}
            onChange={(e) => setFormData(prev => ({ ...prev, healthProfessionalId: e.target.value }))}
            required
          />
        </div>
      </div>

      {/* Section Aliments */}
      <div className={styles.section}>
        <h2>Aliments Recommandés</h2>
        <FoodSelector
          selectedFoods={formData.foods}
          onFoodChange={(foods) => setFormData(prev => ({ ...prev, foods }))}
        />
      </div>

      {/* Section Suppléments */}
      <div className={styles.section}>
        <h2>Suppléments Recommandés</h2>
        <SupplementsForm
          selectedSupplements={formData.supplements}
          onSupplementChange={(supplements) => setFormData(prev => ({ ...prev, supplements }))}
        />
      </div>

      <div className={styles.submitSection}>
        <button type="submit" className={styles.submitButton}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
          Créer le programme
        </button>
      </div>
    </form>
  );
}
