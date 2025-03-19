'use client';

import { useState, useEffect, useRef } from 'react';
import styles from '../programmes.module.css';
import { FaEdit, FaTrash, FaCheck, FaTimes, FaShareAlt, FaFilePdf, FaClipboard, FaListAlt, FaSpinner } from 'react-icons/fa';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';

export default function ProgramList() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProgram, setEditingProgram] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [shareSuccess, setShareSuccess] = useState(null);
  const [pdfGenerating, setPdfGenerating] = useState(null);
  const [pdfSuccess, setPdfSuccess] = useState(null);
  const [copySuccess, setCopySuccess] = useState(null);
  const [origin, setOrigin] = useState('');
  
  // Références pour les boutons
  const shareButtonRefs = useRef({});
  const pdfButtonRefs = useRef({});
  const copyButtonRefs = useRef({});
  
  // États pour les positions des tooltips
  const [tooltipPositions, setTooltipPositions] = useState({
    share: {},
    pdf: {},
    copy: {}
  });

  useEffect(() => {
    fetchPrograms();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
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

  const handleGeneratePDF = async (program) => {
    try {
      setPdfGenerating(program.id);
      
      // Créer un nouveau document PDF
      const doc = new jsPDF();
      
      // Ajouter un titre
      doc.setFontSize(24);
      doc.setTextColor(255, 114, 28); // Couleur orange (#FF721C)
      doc.text('Plan Nutritionnel', 105, 20, { align: 'center' });
      
      // Informations du programme
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text(`${program.title}`, 105, 30, { align: 'center' });
      
      // Date de création
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Créé le: ${new Date(program.createdAt).toLocaleDateString()}`, 105, 40, { align: 'center' });
      
      // Description
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('Description:', 20, 55);
      
      // Gérer le texte long avec des sauts de ligne
      const splitDescription = doc.splitTextToSize(program.description || 'Aucune description disponible', 170);
      doc.text(splitDescription, 20, 65);
      
      // Position Y après la description
      let yPosition = 65 + (splitDescription.length * 7);
      
      // Objectifs
      if (program.goals) {
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('Objectifs:', 20, yPosition + 10);
        
        const splitGoals = doc.splitTextToSize(program.goals, 170);
        doc.text(splitGoals, 20, yPosition + 20);
        
        yPosition = yPosition + 20 + (splitGoals.length * 7);
      }
      
      // Durée du programme
      if (program.duration) {
        doc.setFontSize(12);
        doc.text(`Durée du programme: ${program.duration} semaines`, 20, yPosition + 10);
        yPosition += 15;
      }
      
      // Fréquence
      if (program.frequency) {
        doc.text(`Fréquence: ${program.frequency} fois par semaine`, 20, yPosition + 5);
        yPosition += 15;
      }
      
      // Notes additionnelles
      if (program.notes) {
        doc.setFontSize(14);
        doc.text('Notes:', 20, yPosition + 5);
        
        const splitNotes = doc.splitTextToSize(program.notes, 170);
        doc.text(splitNotes, 20, yPosition + 15);
        
        yPosition = yPosition + 15 + (splitNotes.length * 7);
      }
      
      // Pied de page
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text('Tuatha - Plateforme de gestion pour professionnels de santé', 105, 280, { align: 'center' });
      doc.text(` ${new Date().getFullYear()} Tuatha. Tous droits réservés.`, 105, 285, { align: 'center' });
      
      // Enregistrer le PDF
      doc.save(`plan-nutritionnel-${program.title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
      
      // Indiquer le succès et réinitialiser
      setPdfGenerating(null);
      setPdfSuccess(program.id);
      
      // Calculer la position du tooltip
      if (pdfButtonRefs.current[program.id]) {
        const rect = pdfButtonRefs.current[program.id].getBoundingClientRect();
        setTooltipPositions(prev => ({
          ...prev,
          pdf: {
            ...prev.pdf,
            [program.id]: {
              left: rect.left + rect.width / 2,
              top: rect.top
            }
          }
        }));
      }
      
      // Réinitialiser le message après 3 secondes
      setTimeout(() => {
        setPdfSuccess(null);
      }, 3000);
      
    } catch (err) {
      console.error('Erreur lors de la génération du PDF:', err);
      setPdfGenerating(null);
    }
  };

  const handleShareProgram = async (program) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Plan nutritionnel: ${program.title}`,
          text: `Découvrez mon plan nutritionnel: ${program.title}`,
          url: origin + `/program/${program.id}`
        });
        setShareSuccess(program.id);
        
        // Calculer la position du tooltip
        if (shareButtonRefs.current[program.id]) {
          const rect = shareButtonRefs.current[program.id].getBoundingClientRect();
          setTooltipPositions(prev => ({
            ...prev,
            share: {
              ...prev.share,
              [program.id]: {
                left: rect.left + rect.width / 2,
                top: rect.top
              }
            }
          }));
        }
        
        // Réinitialiser le message après 3 secondes
        setTimeout(() => {
          setShareSuccess(null);
        }, 3000);
      } else {
        navigator.clipboard.writeText(origin + `/program/${program.id}`);
        setShareSuccess(program.id);
        
        // Calculer la position du tooltip
        if (shareButtonRefs.current[program.id]) {
          const rect = shareButtonRefs.current[program.id].getBoundingClientRect();
          setTooltipPositions(prev => ({
            ...prev,
            share: {
              ...prev.share,
              [program.id]: {
                left: rect.left + rect.width / 2,
                top: rect.top
              }
            }
          }));
        }
        
        // Réinitialiser le message après 3 secondes
        setTimeout(() => {
          setShareSuccess(null);
        }, 3000);
      }
    } catch (err) {
      // Si l'erreur est AbortError ou une erreur liée à une annulation, ne rien faire
      if (err.name === 'AbortError' || err.message.includes('share canceled') || err.message.includes('cancelled')) {
        console.log("Partage annulé par l'utilisateur");
        return;
      }
      
      // Pour les autres erreurs, afficher dans la console mais ne pas montrer d'alerte
      console.error('Erreur lors du partage:', err);
    }
  };

  const handleCopyToClipboard = (program) => {
    try {
      const programDetails = `
        Plan Nutritionnel: ${program.title}
        Description: ${program.description || 'Aucune description'}
        Régime: ${program.dietType || 'Non spécifié'}
        Objectif: ${program.dietGoal || 'Non spécifié'}
        Créé le: ${formatDate(program.createdAt)}
      `;
      navigator.clipboard.writeText(programDetails);
      
      // Afficher le message de succès
      setCopySuccess(program.id);
      
      // Calculer la position du tooltip
      if (copyButtonRefs.current[program.id]) {
        const rect = copyButtonRefs.current[program.id].getBoundingClientRect();
        setTooltipPositions(prev => ({
          ...prev,
          copy: {
            ...prev.copy,
            [program.id]: {
              left: rect.left + rect.width / 2,
              top: rect.top
            }
          }
        }));
      }
      
      // Masquer le message après 3 secondes
      setTimeout(() => {
        setCopySuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Erreur lors de la copie dans le presse-papiers:', err);
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
        <div 
          key={program.id} 
          className={styles.programCard} 
          onClick={(e) => {
            // Empêcher tout comportement par défaut du clic sur la carte
            e.preventDefault();
          }}
        >
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
                <div className={styles.programHeader}>
                  <h3 className={styles.programTitle}>{program.title}</h3>
                  {program.description && (
                    <p className={styles.programDescription}>{program.description}</p>
                  )}
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
            <div className={styles.programDetailsContainer}>
              <div className={styles.programDetails}>
                <div className={styles.detailSection}>
                  <h4>Régime alimentaire</h4>
                  <p>Type : {program.dietType}</p>
                  <p>Objectif : {program.dietGoal}</p>
                </div>

                <div className={styles.detailSection}>
                  <h4>Informations sur le patient</h4>
                  <p>Nom : {program.patient?.user?.firstName || 'N/A'} {program.patient?.user?.lastName || 'N/A'}</p>
                  <p>Âge : {program.patient?.age || 'N/A'}</p>
                  <p>Poids : {program.patient?.weight || 'N/A'} kg</p>
                  <p>Taille : {program.patient?.height || 'N/A'} cm</p>
                </div>

                <div className={styles.detailSection}>
                  <h4>Informations sur la nutritionniste</h4>
                  <p>Nom : {(program.nutritionist?.user?.firstName || program.healthProfessional?.user?.firstName || 'N/A')} {(program.nutritionist?.user?.lastName || program.healthProfessional?.user?.lastName || 'N/A')}</p>
                  <p>Spécialité : {program.nutritionist?.specialty || program.healthProfessional?.specialty || 'N/A'}</p>
                </div>

                {program.meals && program.meals.length > 0 && (
                  <div className={styles.detailSection}>
                    <h4>Repas ({program.meals.length})</h4>
                    <ul className={styles.mealsList}>
                      {program.meals.map((meal) => (
                        <li key={meal.id || Math.random()}>
                          {meal.name || 'Repas sans nom'}
                          {meal.calories && ` - ${meal.calories} calories`}
                          {meal.protein && ` - ${meal.protein} grammes de protéines`}
                          {meal.carbohydrates && ` - ${meal.carbohydrates} grammes de glucides`}
                          {meal.fat && ` - ${meal.fat} grammes de lipides`}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {program.supplements && program.supplements.length > 0 && (
                  <div className={styles.detailSection}>
                    <h4>Suppléments ({program.supplements.length})</h4>
                    <ul className={styles.supplementsList}>
                      {program.supplements.map((supplement) => (
                        <li key={supplement.id || Math.random()}>
                          {supplement.name || 'Supplément sans nom'}
                          {supplement.dosage && ` - ${supplement.dosage}`}
                          {supplement.frequency && ` - ${supplement.frequency}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className={styles.cardActions}>
                <button
                  className={`${styles.actionButton} ${styles.shareButton}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShareProgram(program);
                  }}
                  title="Partager"
                  ref={el => shareButtonRefs.current[program.id] = el}
                >
                  <FaShareAlt />
                  {shareSuccess === program.id && (
                    <span 
                      className={styles.shareTooltip}
                      style={{
                        left: `${tooltipPositions.share[program.id]?.left}px`,
                        top: `${tooltipPositions.share[program.id]?.top}px`
                      }}
                    >
                      Partagé !
                    </span>
                  )}
                </button>
                <button
                  className={`${styles.actionButton} ${styles.pdfButton}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGeneratePDF(program);
                  }}
                  title="Télécharger en PDF"
                  disabled={pdfGenerating === program.id}
                  ref={el => pdfButtonRefs.current[program.id] = el}
                >
                  {pdfGenerating === program.id ? (
                    <FaSpinner className={styles.loadingIcon} />
                  ) : (
                    <FaFilePdf />
                  )}
                  {pdfSuccess === program.id && (
                    <span 
                      className={styles.pdfTooltip}
                      style={{
                        left: `${tooltipPositions.pdf[program.id]?.left}px`,
                        top: `${tooltipPositions.pdf[program.id]?.top}px`
                      }}
                    >
                      PDF généré !
                    </span>
                  )}
                </button>
                <button
                  className={`${styles.actionButton} ${styles.copyButton}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyToClipboard(program);
                  }}
                  title="Copier les détails"
                  ref={el => copyButtonRefs.current[program.id] = el}
                >
                  <FaClipboard />
                  {copySuccess === program.id && (
                    <span 
                      className={styles.copyTooltip}
                      style={{
                        left: `${tooltipPositions.copy[program.id]?.left}px`,
                        top: `${tooltipPositions.copy[program.id]?.top}px`
                      }}
                    >
                      Copié !
                    </span>
                  )}
                </button>
                <button
                  className={styles.actionButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(program);
                  }}
                  title="Modifier"
                >
                  <FaEdit />
                </button>
                <button
                  className={styles.actionButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(program.id);
                  }}
                  title="Supprimer"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
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
