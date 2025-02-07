'use client';

import styles from './FormComponents.module.css';

export default function DurationPicker({ value, onChange }) {
  const presetDurations = [
    { days: 7, label: '1 semaine' },
    { days: 14, label: '2 semaines' },
    { days: 21, label: '3 semaines' },
    { days: 28, label: '4 semaines' },
    { days: 42, label: '6 semaines' }
  ];

  return (
    <div className={styles.durationPicker}>
      <label htmlFor="duration">Durée du programme</label>
      
      <div className={styles.durationPresets}>
        {presetDurations.map(({ days, label }) => (
          <button
            key={days}
            type="button"
            className={`${styles.presetButton} ${value === days ? styles.active : ''}`}
            onClick={() => onChange(days)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className={styles.customDuration}>
        <input
          type="number"
          id="duration"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          min="1"
          max="365"
          required
        />
        <span className={styles.durationUnit}>jours</span>
      </div>

      <small className={styles.helper}>
        Durée recommandée : 2 à 6 semaines pour des résultats optimaux
      </small>
    </div>
  );
}
