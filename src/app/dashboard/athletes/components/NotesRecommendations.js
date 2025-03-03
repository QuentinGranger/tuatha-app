'use client';

import { useState } from 'react';
import styles from './NotesRecommendations.module.css';

export default function NotesRecommendations({ patient }) {
  const [activeSection, setActiveSection] = useState('notes');
  const [selectedNote, setSelectedNote] = useState(null);
  
  if (!patient) {
    return <div className={styles.emptyState}>Veuillez sélectionner un patient</div>;
  }
  
  // Données fictives
  const notes = [
    {
      id: 1,
      title: 'Consultation initiale',
      date: '2023-11-15',
      content: 'Première consultation avec le patient. Objectifs fixés: perte de masse grasse, gain de masse musculaire, amélioration de l\'endurance cardio-vasculaire.',
      categories: ['Nutrition', 'Objectifs']
    },
    {
      id: 2,
      title: 'Ajustement plan nutritionnel',
      date: '2023-12-10',
      content: 'Ajustement des macronutriments suite au premier mois de suivi. Augmentation des protéines, légère diminution des glucides. Patient signale des difficultés à maintenir l\'hydratation quotidienne recommandée.',
      categories: ['Nutrition', 'Hydratation']
    },
    {
      id: 3,
      title: 'Bilan intermédiaire',
      date: '2024-01-15',
      content: 'Résultats positifs après 2 mois de suivi. Diminution de 3% de masse grasse, augmentation de la masse musculaire de 1.2kg. Amélioration notable de la performance lors des exercices cardio. Maintien du même plan nutritionnel pour le prochain cycle.',
      categories: ['Bilan', 'Performance', 'Nutrition']
    }
  ];
  
  const recommendations = [
    {
      id: 1,
      title: 'Hydratation',
      content: 'Augmenter l\'apport hydrique à 3L par jour minimum, particulièrement les jours d\'entraînement intense. Privilégier l\'eau et limiter les boissons sucrées même si elles sont "sportives".',
      author: 'Dr. Martin',
      date: '2024-01-15'
    },
    {
      id: 2,
      title: 'Récupération post-entraînement',
      content: 'Ajouter une collation riche en protéines (25-30g) dans les 30 minutes suivant les séances d\'entraînement intensif pour optimiser la récupération musculaire.',
      author: 'Sophie Dubois',
      date: '2024-02-10'
    },
    {
      id: 3,
      title: 'Gestion du stress',
      content: 'Intégrer des séances courtes de méditation (5-10 minutes) avant le coucher pour améliorer la qualité du sommeil et la récupération. L\'application Calm est recommandée.',
      author: 'Sophie Dubois',
      date: '2024-02-28'
    }
  ];
  
  const renderNotes = () => (
    <div className={styles.notesContainer}>
      <div>
        <div className={styles.notesList}>
          {notes.map(note => (
            <div 
              key={note.id} 
              className={`${styles.noteCard} ${selectedNote?.id === note.id ? styles.selected : ''}`}
              onClick={() => setSelectedNote(note)}
            >
              <div className={styles.noteHeader}>
                <h3 className={styles.noteTitle}>{note.title}</h3>
                <span className={styles.noteDate}>{new Date(note.date).toLocaleDateString('fr-FR')}</span>
              </div>
              
              <p className={styles.notePreview}>{note.content}</p>
              
              <div className={styles.noteCategories}>
                {note.categories.map((category, index) => (
                  <span key={index} className={styles.noteCategory}>{category}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <button className={styles.newNoteButton}>
          <i className="fas fa-plus"></i>
          Nouvelle note
        </button>
      </div>
      
      <div className={styles.noteEditor}>
        {selectedNote ? (
          <>
            <div className={styles.editorHeader}>
              <input 
                type="text" 
                className={styles.editorTitle} 
                value={selectedNote.title}
                readOnly
              />
              
              <div className={styles.editorCategorySelector}>
                {selectedNote.categories.map((category, index) => (
                  <div key={index} className={styles.categoryTag}>
                    {category}
                    <i className="fas fa-times"></i>
                  </div>
                ))}
                <button className={styles.addCategoryButton}>
                  <i className="fas fa-plus"></i>
                  Ajouter
                </button>
              </div>
            </div>
            
            <div className={styles.editorBody}>
              <textarea 
                className={styles.editorTextarea}
                value={selectedNote.content}
                readOnly
              />
            </div>
            
            <div className={styles.editorActions}>
              <button className={`${styles.editorButton} ${styles.cancelButton}`}>
                Annuler
              </button>
              <button className={`${styles.editorButton} ${styles.saveButton}`}>
                Enregistrer
              </button>
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            Sélectionnez une note pour l'éditer ou créez-en une nouvelle
          </div>
        )}
      </div>
    </div>
  );
  
  const renderRecommendations = () => (
    <div className={styles.recommendationsContainer}>
      <div className={styles.recommendationsActions}>
        <button className={styles.newNoteButton}>
          <i className="fas fa-plus"></i>
          Nouvelle recommandation
        </button>
      </div>
      
      {recommendations.map(recommendation => (
        <div key={recommendation.id} className={styles.recommendationCard}>
          <div className={styles.recommendationHeader}>
            <h3 className={styles.recommendationTitle}>
              <i className="fas fa-lightbulb" style={{ color: 'var(--color-accent)' }}></i>
              {recommendation.title}
            </h3>
            
            <div className={styles.recommendationIcons}>
              <div className={styles.recommendationIcon}>
                <i className="fas fa-edit"></i>
              </div>
              <div className={`${styles.recommendationIcon} ${styles.delete}`}>
                <i className="fas fa-trash-alt"></i>
              </div>
            </div>
          </div>
          
          <div className={styles.recommendationContent}>
            {recommendation.content}
          </div>
          
          <div className={styles.recommendationMeta}>
            <div className={styles.recommendationAuthor}>
              <div className={styles.authorAvatar}>
                {recommendation.author.charAt(0)}
              </div>
              {recommendation.author}
            </div>
            
            <div>
              {new Date(recommendation.date).toLocaleDateString('fr-FR')}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
  
  return (
    <div className={styles.container}>
      <div className={styles.sectionTabs}>
        <button 
          className={`${styles.tabButton} ${activeSection === 'notes' ? styles.active : ''}`}
          onClick={() => setActiveSection('notes')}
        >
          <i className="fas fa-sticky-note"></i>
          Notes
        </button>
        <button 
          className={`${styles.tabButton} ${activeSection === 'recommendations' ? styles.active : ''}`}
          onClick={() => setActiveSection('recommendations')}
        >
          <i className="fas fa-lightbulb"></i>
          Recommandations
        </button>
      </div>
      
      <div className={styles.sectionContent}>
        {activeSection === 'notes' ? renderNotes() : renderRecommendations()}
      </div>
    </div>
  );
}
