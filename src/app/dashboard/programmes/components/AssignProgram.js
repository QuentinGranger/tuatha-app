'use client';

import { useState, useEffect } from 'react';
import styles from './AssignProgram.module.css';

export default function AssignProgram() {
  const [programs, setPrograms] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [customNotes, setCustomNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [programsRes, patientsRes] = await Promise.all([
        fetch('/api/programs'),
        fetch('/api/patients')
      ]);

      if (!programsRes.ok || !patientsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const [programsData, patientsData] = await Promise.all([
        programsRes.json(),
        patientsRes.json()
      ]);

      setPrograms(programsData);
      setPatients(patientsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProgram || !selectedPatient) return;

    try {
      const response = await fetch('/api/programs/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          programId: selectedProgram,
          patientId: selectedPatient,
          customizationNotes: customNotes
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to assign program');
      }

      // Réinitialiser le formulaire
      setSelectedProgram(null);
      setSelectedPatient(null);
      setCustomNotes('');

      // TODO: Ajouter un message de succès
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Chargement...</div>;
  }

  if (error) {
    return <div className={styles.error}>Erreur: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="program">Programme Nutritionnel</label>
          <select
            id="program"
            value={selectedProgram || ''}
            onChange={(e) => setSelectedProgram(e.target.value)}
            required
          >
            <option value="">Sélectionner un programme</option>
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="patient">Patient</label>
          <select
            id="patient"
            value={selectedPatient || ''}
            onChange={(e) => setSelectedPatient(e.target.value)}
            required
          >
            <option value="">Sélectionner un patient</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.firstName} {patient.lastName}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="notes">Notes de Personnalisation</label>
          <textarea
            id="notes"
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            placeholder="Ajoutez des notes spécifiques pour ce patient..."
            rows={4}
          />
        </div>

        {selectedProgram && selectedPatient && (
          <div className={styles.preview}>
            <h3>Aperçu de l'Attribution</h3>
            <div className={styles.previewContent}>
              <div className={styles.previewItem}>
                <span>Programme:</span>
                <strong>{programs.find(p => p.id === selectedProgram)?.name}</strong>
              </div>
              <div className={styles.previewItem}>
                <span>Patient:</span>
                <strong>
                  {patients.find(p => p.id === selectedPatient)?.firstName}{' '}
                  {patients.find(p => p.id === selectedPatient)?.lastName}
                </strong>
              </div>
            </div>
          </div>
        )}

        <div className={styles.actions}>
          <button type="submit" className={styles.submitButton} disabled={!selectedProgram || !selectedPatient}>
            Attribuer le Programme
          </button>
        </div>
      </form>
    </div>
  );
}
