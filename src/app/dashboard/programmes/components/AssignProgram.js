'use client';

import { useState, useEffect } from 'react';
import styles from './AssignProgram.module.css';

export default function AssignProgram() {
  const [programs, setPrograms] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [programsRes, patientsRes] = await Promise.all([
        fetch('/api/programs?status=TEMPLATE'),
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
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProgram || !selectedPatient) {
      alert('Veuillez sélectionner un programme et un patient');
      return;
    }

    try {
      const response = await fetch('/api/programs/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          programId: selectedProgram,
          patientId: selectedPatient,
          notes: customNotes
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to assign program');
      }

      alert('Programme assigné avec succès !');
      setSelectedProgram('');
      setSelectedPatient('');
      setCustomNotes('');
    } catch (err) {
      console.error('Error assigning program:', err);
      alert(err.message);
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
      <h2>Assigner un Programme</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="program">Programme</label>
          <select
            id="program"
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            required
          >
            <option value="">Sélectionner un programme</option>
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.title}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="patient">Patient</label>
          <select
            id="patient"
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            required
          >
            <option value="">Sélectionner un patient</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.user.firstName} {patient.user.lastName}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="notes">Notes personnalisées</label>
          <textarea
            id="notes"
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            placeholder="Ajoutez des notes spécifiques pour ce patient..."
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Assigner le Programme
        </button>
      </form>
    </div>
  );
}
