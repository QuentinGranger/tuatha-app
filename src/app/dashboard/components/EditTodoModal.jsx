import React, { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaUser, FaCalendarAlt, FaTags, FaPaperclip, FaTrash, FaSave, FaEdit, FaCheckSquare } from 'react-icons/fa';
import styles from './EditTodoModal.module.css';

const EditTodoModal = ({ onClose, onSave, task: initialTask, isEditing = false }) => {
  const emptyTask = {
    title: '',
    description: '',
    dueDate: '',
    patient: '',
    patientId: '',
    tags: [],
    checklist: [],
    attachments: [],
    urgent: false
  };

  const [task, setTask] = useState(isEditing && initialTask ? { ...initialTask } : emptyTask);
  const [newTag, setNewTag] = useState('');
  const [newChecklistItem, setNewChecklistItem] = useState('');

  // Amélioration: Faire disparaître le scroll du body lorsque la modale est ouverte
  useEffect(() => {
    // Désactiver le défilement du body quand la modale est ouverte
    document.body.style.overflow = 'hidden';
    
    // Réactiver le défilement quand la modale est fermée (nettoyage)
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTask({
      ...task,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddTag = () => {
    if (newTag.trim() && !task.tags.includes(newTag.trim())) {
      setTask({
        ...task,
        tags: [...task.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTask({
      ...task,
      tags: task.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      const newItem = {
        id: `check-${Date.now()}`,
        text: newChecklistItem.trim(),
        completed: false
      };
      
      setTask({
        ...task,
        checklist: [...task.checklist, newItem]
      });
      setNewChecklistItem('');
    }
  };

  const handleRemoveChecklistItem = (itemId) => {
    setTask({
      ...task,
      checklist: task.checklist.filter(item => item.id !== itemId)
    });
  };

  const handleChecklistItemChange = (itemId) => {
    setTask({
      ...task,
      checklist: task.checklist.map(item => 
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Générer un ID unique si c'est une nouvelle tâche
    const updatedTask = isEditing ? task : {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    onSave(updatedTask);
  };

  // Handler pour gérer l'appui sur la touche Entrée dans les champs tag et checklist
  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };
  
  // Rendre la modale directement dans le flux du DOM sans createPortal
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>{isEditing ? 'Modifier la tâche' : 'Créer une nouvelle tâche'}</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.modalContent}>
            <div className={styles.formGroup}>
              <label htmlFor="title">Titre</label>
              <input
                type="text"
                id="title"
                name="title"
                value={task.title}
                onChange={handleInputChange}
                className={styles.formControl}
                placeholder="Titre de la tâche"
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={task.description}
                onChange={handleInputChange}
                className={styles.formControl}
                placeholder="Description détaillée de la tâche"
                rows="3"
              />
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="dueDate">
                  <FaCalendarAlt /> Date d'échéance
                </label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={task.dueDate}
                  onChange={handleInputChange}
                  className={styles.formControl}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="patient">
                  <FaUser /> Patient
                </label>
                <input
                  type="text"
                  id="patient"
                  name="patient"
                  value={task.patient}
                  onChange={handleInputChange}
                  className={styles.formControl}
                  placeholder="Nom du patient concerné"
                />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label>
                <FaTags /> Tags
              </label>
              <div className={styles.tagInput}>
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className={styles.formControl}
                  placeholder="Ajouter un tag"
                  onKeyPress={(e) => handleKeyPress(e, handleAddTag)}
                />
                <button
                  type="button"
                  className={styles.addButton}
                  onClick={handleAddTag}
                >
                  <FaPlus />
                </button>
              </div>
              
              {task.tags.length > 0 && (
                <div className={styles.tagsContainer}>
                  {task.tags.map((tag, index) => (
                    <div key={index} className={styles.tag}>
                      {tag}
                      <button
                        type="button"
                        className={styles.removeTagButton}
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className={styles.formGroup}>
              <label>
                <FaCheckSquare /> Liste de contrôle
              </label>
              <div className={styles.checklistInput}>
                <input
                  type="text"
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  className={styles.formControl}
                  placeholder="Ajouter un élément à la liste"
                  onKeyPress={(e) => handleKeyPress(e, handleAddChecklistItem)}
                />
                <button
                  type="button"
                  className={styles.addButton}
                  onClick={handleAddChecklistItem}
                >
                  <FaPlus />
                </button>
              </div>
              
              {task.checklist.length > 0 && (
                <div className={styles.checklistContainer}>
                  {task.checklist.map((item) => (
                    <div key={item.id} className={styles.checklistItem}>
                      <input
                        type="checkbox"
                        id={item.id}
                        checked={item.completed}
                        onChange={() => handleChecklistItemChange(item.id)}
                      />
                      <label htmlFor={item.id}>{item.text}</label>
                      <button
                        type="button"
                        className={styles.removeItemButton}
                        onClick={() => handleRemoveChecklistItem(item.id)}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className={styles.formGroup}>
              <label>
                <FaPaperclip /> Pièces jointes
              </label>
              <div className={styles.formControl} style={{ padding: '8px', minHeight: '40px' }}>
                {task.attachments && task.attachments.length > 0 ? (
                  task.attachments.map((attachment, index) => (
                    <div key={index} className={styles.tag}>
                      {attachment}
                    </div>
                  ))
                ) : (
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>
                    Aucune pièce jointe
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
                Fonctionnalité d'upload à venir
              </p>
            </div>
            
            <div className={styles.formGroup}>
              <div className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  id="urgent"
                  name="urgent"
                  checked={task.urgent}
                  onChange={handleInputChange}
                />
                <label htmlFor="urgent">Marquer comme urgent</label>
              </div>
            </div>
            
            <div className={styles.modalFooter}>
              <button type="button" className={styles.cancelButton} onClick={onClose}>
                Annuler
              </button>
              <button type="submit" className={styles.saveButton}>
                {isEditing ? <><FaSave /> Mettre à jour</> : <><FaPlus /> Créer</>}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTodoModal;
