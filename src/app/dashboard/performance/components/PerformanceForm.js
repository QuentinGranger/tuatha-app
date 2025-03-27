'use client';

import React, { useState, useEffect } from 'react';
import Modal, { ModalButton } from './Modal';
import styles from './Modal.module.css';
import { IoMdSave, IoMdClose, IoMdTrash } from 'react-icons/io';

const initialFormState = {
  date: new Date().toISOString().split('T')[0],
  weight: '',
  hydration: '',
  calories: {
    consumed: '',
    burned: ''
  },
  macros: {
    proteins: '',
    carbs: '',
    fats: ''
  },
  sleep: {
    duration: '',
    quality: '',
    deepPhase: ''
  },
  notes: ''
};

const PerformanceForm = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData = null, 
  patientId,
  isEditing = false,
  readOnly = false
}) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialFormState,
        ...initialData,
        date: initialData.date || initialFormState.date
      });
    } else {
      setFormData(initialFormState);
    }
  }, [initialData, isOpen]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.date) {
      newErrors.date = 'La date est requise';
    }
    
    if (formData.weight && isNaN(parseFloat(formData.weight))) {
      newErrors.weight = 'Veuillez entrer un nombre valide';
    }
    
    if (formData.hydration && isNaN(parseFloat(formData.hydration))) {
      newErrors.hydration = 'Veuillez entrer un nombre valide';
    }
    
    // Validation calories
    if (formData.calories.consumed && isNaN(parseFloat(formData.calories.consumed))) {
      newErrors['calories.consumed'] = 'Veuillez entrer un nombre valide';
    }
    
    if (formData.calories.burned && isNaN(parseFloat(formData.calories.burned))) {
      newErrors['calories.burned'] = 'Veuillez entrer un nombre valide';
    }
    
    // Validation macros
    if (formData.macros.proteins && isNaN(parseFloat(formData.macros.proteins))) {
      newErrors['macros.proteins'] = 'Veuillez entrer un nombre valide';
    }
    
    if (formData.macros.carbs && isNaN(parseFloat(formData.macros.carbs))) {
      newErrors['macros.carbs'] = 'Veuillez entrer un nombre valide';
    }
    
    if (formData.macros.fats && isNaN(parseFloat(formData.macros.fats))) {
      newErrors['macros.fats'] = 'Veuillez entrer un nombre valide';
    }
    
    // Validation sommeil
    if (formData.sleep.duration && isNaN(parseFloat(formData.sleep.duration))) {
      newErrors['sleep.duration'] = 'Veuillez entrer un nombre valide';
    }
    
    if (formData.sleep.quality && (isNaN(parseFloat(formData.sleep.quality)) || 
        parseFloat(formData.sleep.quality) < 0 || parseFloat(formData.sleep.quality) > 100)) {
      newErrors['sleep.quality'] = 'Veuillez entrer un pourcentage entre 0 et 100';
    }
    
    if (formData.sleep.deepPhase && (isNaN(parseFloat(formData.sleep.deepPhase)) || 
        parseFloat(formData.sleep.deepPhase) < 0 || parseFloat(formData.sleep.deepPhase) > 100)) {
      newErrors['sleep.deepPhase'] = 'Veuillez entrer un pourcentage entre 0 et 100';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setLoading(true);
    try {
      // Conversion des valeurs en nombres
      const processedData = {
        ...formData,
        patientId,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        hydration: formData.hydration ? parseFloat(formData.hydration) : null,
        calories: {
          consumed: formData.calories.consumed ? parseFloat(formData.calories.consumed) : null,
          burned: formData.calories.burned ? parseFloat(formData.calories.burned) : null
        },
        macros: {
          proteins: formData.macros.proteins ? parseFloat(formData.macros.proteins) : null,
          carbs: formData.macros.carbs ? parseFloat(formData.macros.carbs) : null,
          fats: formData.macros.fats ? parseFloat(formData.macros.fats) : null
        },
        sleep: {
          duration: formData.sleep.duration ? parseFloat(formData.sleep.duration) : null,
          quality: formData.sleep.quality ? parseFloat(formData.sleep.quality) : null,
          deepPhase: formData.sleep.deepPhase ? parseFloat(formData.sleep.deepPhase) : null
        }
      };
      
      await onSave(processedData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement des données:', error);
      setErrors(prev => ({
        ...prev,
        form: 'Une erreur est survenue lors de l\'enregistrement des données.'
      }));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={readOnly ? 'Détails des données de performance' : (isEditing ? 'Modifier les données de performance' : 'Ajouter des données de performance')}
      footer={
        readOnly ? (
          <ModalButton variant="cancel" onClick={onClose}>
            <IoMdClose /> Fermer
          </ModalButton>
        ) : (
          <>
            <ModalButton variant="cancel" onClick={onClose}>
              <IoMdClose /> Annuler
            </ModalButton>
            <ModalButton variant="confirm" onClick={handleSubmit} disabled={loading}>
              <IoMdSave /> {loading ? 'Enregistrement...' : 'Enregistrer'}
            </ModalButton>
          </>
        )
      }
    >
      <form onSubmit={handleSubmit}>
        {errors.form && (
          <div className={styles.errorMessage}>{errors.form}</div>
        )}
        
        <div className={styles.formGroup}>
          <label htmlFor="date" className={styles.label}>Date</label>
          <input
            id="date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={styles.input}
            max={new Date().toISOString().split('T')[0]}
            readOnly={readOnly}
            disabled={readOnly}
          />
          {errors.date && <div className={styles.errorMessage}>{errors.date}</div>}
        </div>
        
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="weight" className={styles.label}>Poids (kg)</label>
            <input
              id="weight"
              type="text"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className={styles.input}
              placeholder="Ex: 75.5"
              readOnly={readOnly}
              disabled={readOnly}
            />
            {errors.weight && <div className={styles.errorMessage}>{errors.weight}</div>}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="hydration" className={styles.label}>Hydratation (L)</label>
            <input
              id="hydration"
              type="text"
              name="hydration"
              value={formData.hydration}
              onChange={handleChange}
              className={styles.input}
              placeholder="Ex: 2.5"
              readOnly={readOnly}
              disabled={readOnly}
            />
            {errors.hydration && <div className={styles.errorMessage}>{errors.hydration}</div>}
          </div>
        </div>
        
        <h4 className={styles.sectionTitle}>Calories</h4>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="calories.consumed" className={styles.label}>Calories consommées</label>
            <input
              id="calories.consumed"
              type="text"
              name="calories.consumed"
              value={formData.calories.consumed}
              onChange={handleChange}
              className={styles.input}
              placeholder="Ex: 2200"
              readOnly={readOnly}
              disabled={readOnly}
            />
            {errors['calories.consumed'] && (
              <div className={styles.errorMessage}>{errors['calories.consumed']}</div>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="calories.burned" className={styles.label}>Calories dépensées</label>
            <input
              id="calories.burned"
              type="text"
              name="calories.burned"
              value={formData.calories.burned}
              onChange={handleChange}
              className={styles.input}
              placeholder="Ex: 2500"
              readOnly={readOnly}
              disabled={readOnly}
            />
            {errors['calories.burned'] && (
              <div className={styles.errorMessage}>{errors['calories.burned']}</div>
            )}
          </div>
        </div>
        
        <h4 className={styles.sectionTitle}>Macronutriments</h4>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="macros.proteins" className={styles.label}>Protéines (g)</label>
            <input
              id="macros.proteins"
              type="text"
              name="macros.proteins"
              value={formData.macros.proteins}
              onChange={handleChange}
              className={styles.input}
              placeholder="Ex: 120"
              readOnly={readOnly}
              disabled={readOnly}
            />
            {errors['macros.proteins'] && (
              <div className={styles.errorMessage}>{errors['macros.proteins']}</div>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="macros.carbs" className={styles.label}>Glucides (g)</label>
            <input
              id="macros.carbs"
              type="text"
              name="macros.carbs"
              value={formData.macros.carbs}
              onChange={handleChange}
              className={styles.input}
              placeholder="Ex: 250"
              readOnly={readOnly}
              disabled={readOnly}
            />
            {errors['macros.carbs'] && (
              <div className={styles.errorMessage}>{errors['macros.carbs']}</div>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="macros.fats" className={styles.label}>Lipides (g)</label>
            <input
              id="macros.fats"
              type="text"
              name="macros.fats"
              value={formData.macros.fats}
              onChange={handleChange}
              className={styles.input}
              placeholder="Ex: 65"
              readOnly={readOnly}
              disabled={readOnly}
            />
            {errors['macros.fats'] && (
              <div className={styles.errorMessage}>{errors['macros.fats']}</div>
            )}
          </div>
        </div>
        
        <h4 className={styles.sectionTitle}>Sommeil</h4>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="sleep.duration" className={styles.label}>Durée (heures)</label>
            <input
              id="sleep.duration"
              type="text"
              name="sleep.duration"
              value={formData.sleep.duration}
              onChange={handleChange}
              className={styles.input}
              placeholder="Ex: 7.5"
              readOnly={readOnly}
              disabled={readOnly}
            />
            {errors['sleep.duration'] && (
              <div className={styles.errorMessage}>{errors['sleep.duration']}</div>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="sleep.quality" className={styles.label}>Qualité (%)</label>
            <input
              id="sleep.quality"
              type="text"
              name="sleep.quality"
              value={formData.sleep.quality}
              onChange={handleChange}
              className={styles.input}
              placeholder="Ex: 85"
              readOnly={readOnly}
              disabled={readOnly}
            />
            {errors['sleep.quality'] && (
              <div className={styles.errorMessage}>{errors['sleep.quality']}</div>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="sleep.deepPhase" className={styles.label}>Phase profonde (%)</label>
            <input
              id="sleep.deepPhase"
              type="text"
              name="sleep.deepPhase"
              value={formData.sleep.deepPhase}
              onChange={handleChange}
              className={styles.input}
              placeholder="Ex: 25"
              readOnly={readOnly}
              disabled={readOnly}
            />
            {errors['sleep.deepPhase'] && (
              <div className={styles.errorMessage}>{errors['sleep.deepPhase']}</div>
            )}
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="notes" className={styles.label}>Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className={styles.textarea}
            placeholder="Commentaires ou observations additionnelles..."
            readOnly={readOnly}
            disabled={readOnly}
          />
        </div>
      </form>
    </Modal>
  );
};

export default PerformanceForm;
