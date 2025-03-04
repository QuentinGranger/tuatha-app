import React, { useState } from 'react';
import styles from './NotesRecommendations.module.css';

const NotesRecommendations = () => {
  const [activeTab, setActiveTab] = useState('notes');
  const [selectedNote, setSelectedNote] = useState(null);

  const mockNotes = [
    {
      id: 1,
      title: 'Progression course 2023',
      date: '05 Mars 2023',
      content: "L'athlète a montré une amélioration significative dans ses performances de course. Augmentation de 5% dans la vitesse et 10% dans l'endurance. Continuer à travailler sur la technique de respiration.",
      categories: ['Course', 'Progression']
    },
    {
      id: 2,
      title: 'Objectifs de musculation',
      date: '12 Janvier 2023',
      content: "Souhaite augmenter sa masse musculaire de 3kg d'ici décembre. Focus sur les exercices composés : squats, soulevé de terre, développé couché.",
      categories: ['Musculation', 'Objectifs']
    },
    {
      id: 3,
      title: 'Blessure épaule gauche',
      date: '28 Février 2023',
      content: "Douleur à l'épaule gauche lors des mouvements de rotation. Réduire la charge pour les exercices impliquant les épaules. Recommander des exercices de mobilité.",
      categories: ['Blessure', 'Réhabilitation']
    }
  ];

  const mockRecommendations = [
    {
      id: 1,
      title: 'Programme de récupération post-entraînement',
      content: "Basé sur vos dernières séances d'entraînement, je recommande d'implémenter un protocole de récupération plus structuré incluant 15 minutes d'étirements dynamiques et l'utilisation de bains de glace deux fois par semaine.",
      author: 'Dr. Martin',
      date: '10 Mars 2023'
    },
    {
      id: 2,
      title: 'Ajustement nutrition pré-compétition',
      content: "En préparation pour la compétition du mois prochain, augmentez votre apport en glucides de 20% 3 jours avant l'événement tout en maintenant votre consommation de protéines. Réduisez les fibres la veille pour éviter l'inconfort gastrique.",
      author: 'Lisa N.',
      date: '05 Mars 2023'
    },
    {
      id: 3,
      title: 'Modification technique course',
      content: "J'ai remarqué une asymétrie dans votre foulée qui pourrait être responsable des douleurs au genou. Essayez ces exercices correctifs et concentrez-vous sur l'atterrissage du pied droit plus près de votre ligne médiane.",
      author: 'Thierry M.',
      date: '28 Février 2023'
    }
  ];

  const renderNotes = () => (
    <div className={styles.notesContainer}>
      <div className={styles.noteActionBar}>
        <h3>Notes de suivi</h3>
        <button className={styles.newNoteButton}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Nouvelle note
        </button>
      </div>
      
      <div className={styles.notesContentArea}>
        <div className={styles.notesListWrapper}>
          <div className={styles.notesList}>
            {mockNotes.map(note => (
              <div 
                key={note.id}
                className={`${styles.noteCard} ${selectedNote && selectedNote.id === note.id ? styles.selected : ''}`}
                onClick={() => setSelectedNote(note)}
              >
                <div className={styles.noteHeader}>
                  <h4 className={styles.noteTitle}>{note.title}</h4>
                  <span className={styles.noteDate}>{note.date}</span>
                </div>
                <p className={styles.notePreview}>{note.content}</p>
                <div className={styles.noteCategories}>
                  {note.categories.map((category, idx) => (
                    <span key={idx} className={styles.noteCategory}>{category}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.editorWrapper}>
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
                    {selectedNote.categories.map((category, idx) => (
                      <span key={idx} className={styles.categoryTag}>
                        {category}
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </span>
                    ))}
                    <button className={styles.addCategoryButton}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 136, 0, 0.6)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <span>Sélectionnez une note pour l'éditer ou créez-en une nouvelle</span>
                <button className={styles.emptyStateButton} onClick={() => document.querySelector(`.${styles.newNoteButton}`).click()}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Créer une note
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderRecommendations = () => (
    <div className={styles.recommendationsContainer}>
      <div className={styles.recommendationsActions}>
        <button className={styles.newNoteButton}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Nouvelle recommandation
        </button>
      </div>
      
      <div className={styles.recommendationsGrid}>
        {mockRecommendations.map(rec => (
          <div key={rec.id} className={styles.recommendationCard}>
            <div className={styles.recommendationHeader}>
              <h4 className={styles.recommendationTitle}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF8800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                {rec.title}
              </h4>
              <div className={styles.recommendationIcons}>
                <div className={styles.recommendationIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </div>
                <div className={`${styles.recommendationIcon} ${styles.delete}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </div>
              </div>
            </div>
            <div className={styles.recommendationContent}>
              {rec.content}
            </div>
            <div className={styles.recommendationMeta}>
              <div className={styles.recommendationAuthor}>
                <div className={styles.authorAvatar}>
                  {rec.author.charAt(0)}
                </div>
                {rec.author}
              </div>
              <div>{rec.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.sectionTabs}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'notes' ? styles.active : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          Notes
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'recommendations' ? styles.active : ''}`}
          onClick={() => setActiveTab('recommendations')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          Recommandations
        </button>
      </div>
      
      <div className={styles.sectionContent}>
        {activeTab === 'notes' ? renderNotes() : renderRecommendations()}
      </div>
    </div>
  );
};

export default NotesRecommendations;
