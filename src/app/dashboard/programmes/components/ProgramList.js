'use client';

import { useState, useEffect } from 'react';
import styles from '../programmes.module.css';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

export default function ProgramList() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProgram, setEditingProgram] = useState(null);
  const [editForm, setEditForm] = useState({});

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
      // L'API peut renvoyer directement un tableau ou un objet avec une propriété programs
      setPrograms(Array.isArray(data) ? data : (data.programs || []));
    } catch (err) {
      console.error('Error fetching programs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (program) => {
    setEditingProgram(program.id);
    setEditForm({
      title: program.title,
      description: program.description,
      startDate: program.startDate.split('T')[0],
      endDate: program.endDate ? program.endDate.split('T')[0] : '',
      status: program.status
    });
  };

  const handleCancelEdit = () => {
    setEditingProgram(null);
    setEditForm({});
  };

  const handleSaveEdit = async (programId) => {
    try {
      const response = await fetch(`/api/programs?id=${programId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        throw new Error('Failed to update program');
      }

      const updatedProgram = await response.json();
      setPrograms(programs.map(p => p.id === programId ? updatedProgram : p));
      setEditingProgram(null);
      setEditForm({});
    } catch (err) {
      console.error('Error updating program:', err);
      alert('Failed to update program');
    }
  };

  const handleDelete = async (programId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce programme ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/programs?id=${programId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete program');
      }

      setPrograms(programs.filter(p => p.id !== programId));
    } catch (err) {
      console.error('Error deleting program:', err);
      alert('Failed to delete program');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non définie';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return <div className={styles.loading}>Chargement des programmes...</div>;
  }

  if (error) {
    return <div className={styles.error}>Erreur: {error}</div>;
  }

  if (programs.length === 0) {
    return <div className={styles.empty}>Aucun programme trouvé</div>;
  }

  return (
    <div className={styles.programList}>
      {programs.map((program) => (
        <div key={program.id} className={styles.programCard}>
          <div className={styles.programHeader}>
            {editingProgram === program.id ? (
              <>
                <input
                  type="text"
                  className={styles.editInput}
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
                <div className={styles.editActions}>
                  <button
                    className={styles.editButton}
                    onClick={() => handleSaveEdit(program.id)}
                  >
                    <FaCheck />
                  </button>
                  <button
                    className={styles.editButton}
                    onClick={handleCancelEdit}
                  >
                    <FaTimes />
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className={styles.programTitle}>{program.title}</h3>
                <div className={styles.cardActions}>
                  <button
                    className={styles.actionButton}
                    onClick={() => handleEdit(program)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className={styles.actionButton}
                    onClick={() => handleDelete(program.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </>
            )}
          </div>

          {editingProgram === program.id ? (
            <div className={styles.editForm}>
              <textarea
                className={styles.editInput}
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="Description"
              />
              <div className={styles.editDates}>
                <div>
                  <label>Date de début:</label>
                  <input
                    type="date"
                    value={editForm.startDate}
                    onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label>Date de fin:</label>
                  <input
                    type="date"
                    value={editForm.endDate}
                    onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                  />
                </div>
              </div>
              <select
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
              >
                <option value="ACTIVE">Actif</option>
                <option value="TEMPLATE">Modèle</option>
              </select>
            </div>
          ) : (
            <>
              {program.description && (
                <p className={styles.programDescription}>{program.description}</p>
              )}

              <div className={styles.programDetails}>
                <div className={styles.detailSection}>
                  <h4>Période</h4>
                  <p>Début: {formatDate(program.startDate)}</p>
                  <p>Fin: {formatDate(program.endDate)}</p>
                </div>

                <div className={styles.detailSection}>
                  <h4>Patient</h4>
                  <p>{program.patient.user.firstName} {program.patient.user.lastName}</p>
                  {program.patient.sport && <p>Sport: {program.patient.sport}</p>}
                  {program.patient.injury && <p>Blessure: {program.patient.injury}</p>}
                </div>

                <div className={styles.detailSection}>
                  <h4>Professionnel de santé</h4>
                  <p>{program.healthProfessional.user.firstName} {program.healthProfessional.user.lastName}</p>
                  <p>Spécialité: {program.healthProfessional.specialty}</p>
                </div>

                {program.supplements && program.supplements.length > 0 && (
                  <div className={styles.detailSection}>
                    <h4>Suppléments ({program.supplements.length})</h4>
                    <ul className={styles.supplementsList}>
                      {program.supplements.map((supplement) => (
                        <li key={supplement.id}>
                          {supplement.name}
                          {supplement.dosage && ` - ${supplement.dosage}`}
                          {supplement.frequency && ` - ${supplement.frequency}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {program.exercises && program.exercises.length > 0 && (
                  <div className={styles.detailSection}>
                    <h4>Exercices ({program.exercises.length})</h4>
                    <ul className={styles.exercisesList}>
                      {program.exercises.map((programExercise) => (
                        <li key={programExercise.id}>
                          {programExercise.exercise.name}
                          {programExercise.sets > 0 && ` - ${programExercise.sets} séries`}
                          {programExercise.reps > 0 && ` x ${programExercise.reps} répétitions`}
                          {programExercise.duration > 0 && ` - ${programExercise.duration} minutes`}
                          {programExercise.notes && <div className={styles.exerciseNotes}>{programExercise.notes}</div>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}

          <div className={styles.programMeta}>
            <span className={styles.programStatus}>
              {program.status === 'TEMPLATE' ? 'Modèle' : 'Actif'}
            </span>
            <span className={styles.programDate}>
              Créé le {formatDate(program.createdAt)}
            </span>
            {program.updatedAt !== program.createdAt && (
              <span className={styles.programDate}>
                Mis à jour le {formatDate(program.updatedAt)}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
