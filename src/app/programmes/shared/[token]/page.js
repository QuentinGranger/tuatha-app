'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FaCalendarAlt, FaEye, FaFilePdf, FaSpinner } from 'react-icons/fa';
import styles from './shared.module.css';
import formatDate from '@/utils/formatDate';

export default function SharedProgramPage() {
  const { token } = useParams();
  const [program, setProgram] = useState(null);
  const [shareInfo, setShareInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSharedProgram = async () => {
      try {
        setLoading(true);
        
        try {
          const response = await fetch(`/api/programs/shared/${token}`);
          
          if (!response.ok) {
            if (response.status === 404) {
              throw new Error('Le lien de partage est invalide ou a expiré');
            } else {
              throw new Error('Erreur lors de la récupération du programme');
            }
          }
          
          const data = await response.json();
          setProgram(data.program);
          setShareInfo(data.shareInfo);
        } catch (apiError) {
          console.error('API error:', apiError);
          throw apiError;
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Erreur:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (token) {
      fetchSharedProgram();
    }
  }, [token]);

  const handleDownloadPDF = () => {
    if (program) {
      // Fonctionnalité à implémenter
      alert('Téléchargement du PDF en cours de développement');
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <FaSpinner className={styles.spinner} />
        <p>Chargement du programme...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h1>Oups !</h1>
        <p>{error}</p>
        <p>
          Le lien que vous avez utilisé n&apos;est plus valide ou a expiré.
          Veuillez demander un nouveau lien au professionnel de santé.
        </p>
      </div>
    );
  }

  if (!program) {
    return (
      <div className={styles.errorContainer}>
        <h1>Programme non trouvé</h1>
        <p>Le programme que vous recherchez n&apos;existe pas ou n&apos;est plus accessible.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.logoContainer}>
          <img src="/logo.png" alt="Tuatha" className={styles.logo} />
        </div>
        <h1 className={styles.title}>{program.title}</h1>
        <div className={styles.metaInfo}>
          <span>
            <FaCalendarAlt className={styles.icon} /> Créé le {formatDate(program.createdAt)}
          </span>
          {shareInfo && (
            <span>
              <FaEye className={styles.icon} /> Consulté {shareInfo.viewCount} fois
            </span>
          )}
        </div>
        <button onClick={handleDownloadPDF} className={styles.pdfButton}>
          <FaFilePdf className={styles.pdfIcon} /> Télécharger en PDF
        </button>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.infoCard}>
          <h2>Description</h2>
          <p>{program.description || 'Aucune description disponible'}</p>
          
          <div className={styles.infoRow}>
            <div className={styles.infoItem}>
              <strong>Catégorie:</strong> {program.category || 'Non spécifié'}
            </div>
            <div className={styles.infoItem}>
              <strong>Objectif:</strong> {program.objective || 'Non spécifié'}
            </div>
          </div>
          
          {program.healthProfessional && (
            <div className={styles.authorInfo}>
              <p>
                <strong>Créé par:</strong>{' '}
                {program.healthProfessional.user
                  ? `${program.healthProfessional.user.firstName} ${program.healthProfessional.user.lastName}`
                  : 'Professionnel de santé'}
              </p>
            </div>
          )}
        </div>

        {program.exercises && program.exercises.length > 0 && (
          <div className={styles.sectionCard}>
            <h2>Exercices</h2>
            <div className={styles.items}>
              {program.exercises.map((pe, index) => (
                <div key={index} className={styles.itemCard}>
                  <h3>{pe.exercise?.name || `Exercice ${index + 1}`}</h3>
                  <div className={styles.itemDetails}>
                    {pe.sets && <span className={styles.tag}>Séries: {pe.sets}</span>}
                    {pe.reps && <span className={styles.tag}>Répétitions: {pe.reps}</span>}
                    {pe.rest && <span className={styles.tag}>Repos: {pe.rest}s</span>}
                  </div>
                  {pe.exercise?.description && <p>{pe.exercise.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {program.supplements && program.supplements.length > 0 && (
          <div className={styles.sectionCard}>
            <h2>Suppléments</h2>
            <div className={styles.items}>
              {program.supplements.map((supplement, index) => (
                <div key={index} className={styles.itemCard}>
                  <h3>{supplement.name || `Supplément ${index + 1}`}</h3>
                  <div className={styles.itemDetails}>
                    {supplement.dosage && <span className={styles.tag}>Dosage: {supplement.dosage}</span>}
                    {supplement.frequency && <span className={styles.tag}>Fréquence: {supplement.frequency}</span>}
                  </div>
                  {supplement.description && <p>{supplement.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Tuatha - Tous droits réservés</p>
        {shareInfo && shareInfo.expiresAt && (
          <p className={styles.expiryInfo}>
            Ce lien expirera le {formatDate(shareInfo.expiresAt)}
          </p>
        )}
      </div>
    </div>
  );
}
