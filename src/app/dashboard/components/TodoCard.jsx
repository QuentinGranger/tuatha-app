import React, { useState } from 'react';
import { FaEllipsisH, FaCalendarDay, FaUser, FaTags, FaPaperclip, FaCheckSquare, FaExpandAlt, FaCompressAlt, FaCheck, FaRegSquare } from 'react-icons/fa';
import styles from './TodoCard.module.css';

const TodoCard = ({ task, onUpdateTask }) => {
  const { 
    id,
    title, 
    description, 
    dueDate, 
    patient, 
    tags, 
    checklist, 
    attachments 
  } = task;
  
  // État pour l'expansion de la carte
  const [isExpanded, setIsExpanded] = useState(false);

  // Calcul pour la date d'échéance
  const today = new Date();
  const dueDateObj = dueDate ? new Date(dueDate) : null;
  const isOverdue = dueDateObj && dueDateObj < today;
  const isDueSoon = dueDateObj && !isOverdue && dueDateObj <= new Date(today.setDate(today.getDate() + 3));
  
  // Calcul pour la progression de la checklist
  const completedItems = checklist ? checklist.filter(item => item.completed).length : 0;
  const totalItems = checklist ? checklist.length : 0;
  const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  // Formatter la date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { day: 'numeric', month: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  // Gérer le double-clic
  const handleDoubleClick = (e) => {
    // Empêcher le déclenchement du drag
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded); // Basculer l'état d'expansion à chaque double-clic
  };

  // Gérer le clic sur un élément de checklist
  const handleChecklistItemClick = (e, itemId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!onUpdateTask) return; // S'assurer que onUpdateTask est fourni
    
    // Créer une copie de la tâche avec l'élément de checklist mis à jour
    const updatedChecklist = checklist.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    
    // Appeler onUpdateTask avec la tâche mise à jour
    onUpdateTask({
      ...task,
      checklist: updatedChecklist
    });
  };

  return (
    <div 
      className={`${styles.todoCard} ${isExpanded ? styles.expanded : ''}`}
      onDoubleClick={handleDoubleClick}
    >
      <div className={styles.todoCardHeader}>
        <h3 className={styles.todoTitle}>{title}</h3>
        <div className={styles.todoControls}>
          {isExpanded ? 
            <FaCompressAlt onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(false);
            }} /> : 
            <FaExpandAlt onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(true);
            }} />
          }
        </div>
      </div>
      
      {(description && isExpanded) && (
        <p className={styles.todoDescription}>{description}</p>
      )}
      
      <div className={styles.todoMeta}>
        <div className={styles.todoMetaRow}>
          {dueDate && (
            <div className={`${styles.metaItem} ${styles.dueDate} ${isOverdue ? styles.overdue : ''} ${isDueSoon ? styles.dueSoon : ''}`}>
              <FaCalendarDay />
              {formatDate(dueDate)}
            </div>
          )}
          
          {patient && (
            <div className={`${styles.metaItem} ${styles.patient}`}>
              <FaUser />
              {patient}
            </div>
          )}
        </div>

        {tags && tags.length > 0 && (
          <div className={styles.tagsList}>
            {tags.map((tag, index) => (
              <span key={index} className={styles.tag}>{tag}</span>
            ))}
          </div>
        )}
        
        {/* Affichage du résumé de la checklist */}
        {checklist && checklist.length > 0 && (
          <div className={styles.checklistSummary}>
            <div className={styles.metaItem}>
              <FaCheckSquare />
              {completedItems}/{totalItems}
            </div>
            <div className={styles.checklistProgressBar}>
              <div 
                className={styles.checklistProgress} 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}
        
        {/* Affichage des pièces jointes */}
        {attachments && attachments.length > 0 && (
          <div className={styles.attachmentsSummary}>
            <div className={styles.metaItem}>
              <FaPaperclip />
              {attachments.length}
            </div>
          </div>
        )}
      </div>
      
      {/* Affichage détaillé de la checklist en mode étendu */}
      {isExpanded && checklist && checklist.length > 0 && (
        <div className={styles.checklistDetail}>
          <h4>Liste des tâches</h4>
          <ul className={styles.checklistItems}>
            {checklist.map((item) => (
              <li 
                key={item.id} 
                className={styles.checklistItem}
                onClick={(e) => handleChecklistItemClick(e, item.id)}
              >
                <span className={styles.checkIcon}>
                  {item.completed ? 
                    <FaCheck className={styles.completed} /> : 
                    <FaRegSquare />
                  }
                </span>
                <span className={`${styles.checklistItemText} ${item.completed ? styles.completed : ''}`}>
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Affichage détaillé des pièces jointes en mode étendu */}
      {isExpanded && attachments && attachments.length > 0 && (
        <div className={styles.attachmentsDetail}>
          <h4>Pièces jointes</h4>
          <ul className={styles.attachmentItems}>
            {attachments.map((attachment, index) => (
              <li key={index} className={styles.attachmentItem}>
                <FaPaperclip />
                <span>{attachment}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TodoCard;
