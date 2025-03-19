import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaEllipsisH, FaClock, FaUser, FaTags, FaPaperclip, FaCheckSquare,
         FaExclamationTriangle, FaListUl, FaSpinner, FaCheckCircle, FaEdit, FaTrashAlt } from 'react-icons/fa';
import styles from './TodoList.module.css';
import TodoCard from './TodoCard';
import EditTodoModal from './EditTodoModal';

const TodoList = () => {
  const [columns, setColumns] = useState({
    'urgent': {
      id: 'urgent',
      title: 'Urgent',
      icon: <FaExclamationTriangle />,
      taskIds: ['task-7'],
    },
    'to-do': {
      id: 'to-do',
      title: 'À Faire',
      icon: <FaListUl />,
      taskIds: ['task-1', 'task-2', 'task-3'],
    },
    'in-progress': {
      id: 'in-progress',
      title: 'En Cours',
      icon: <FaSpinner />,
      taskIds: ['task-4', 'task-5'],
    },
    'done': {
      id: 'done',
      title: 'Terminé',
      icon: <FaCheckCircle />,
      taskIds: ['task-6'],
    }
  });

  const [tasks, setTasks] = useState({
    'task-1': {
      id: 'task-1',
      title: 'Plan Nutritionnel - Ender',
      description: 'Préparer un plan alimentaire personnalisé pour un sportif de haut niveau en phase de prise de masse musculaire, avec optimisation des apports protéiques et énergétiques.',
      dueDate: '2025-03-10',
      patient: 'Ender Wiggin',
      patientId: 'p001',
      tags: ['sportif', 'prise de masse', 'musculation'],
      checklist: [
        { id: 'check-1', text: 'Analyser besoins caloriques', completed: true },
        { id: 'check-2', text: 'Équilibrer macronutriments', completed: false },
        { id: 'check-3', text: 'Planifier repas post-entraînement', completed: false },
        { id: 'check-4', text: 'Calculer apport protéique optimal', completed: true },
        { id: 'check-5', text: 'Sélectionner compléments adaptés', completed: false },
        { id: 'check-6', text: 'Créer planning hebdomadaire', completed: false }
      ],
      attachments: ['mesures_pierre.pdf'],
      createdAt: '2025-03-01'
    },
    'task-2': {
      id: 'task-2',
      title: 'Analyse Bilan Sanguin - Katniss',
      description: 'Interpréter les résultats du bilan sanguin complet et ajuster le plan nutritionnel en fonction des carences identifiées, notamment en fer et vitamines B.',
      dueDate: '2025-03-05',
      patient: 'Katniss Everdeen',
      patientId: 'p002',
      tags: ['bilan', 'anémie', 'carences'],
      checklist: [
        { id: 'check-7', text: 'Vérifier taux de ferritine', completed: true },
        { id: 'check-8', text: 'Analyser hémoglobine', completed: true },
        { id: 'check-9', text: 'Recommandations suppléments en fer', completed: false },
        { id: 'check-10', text: 'Liste aliments riches en fer héminique', completed: false },
        { id: 'check-11', text: 'Proposer alternatives végétariennes', completed: false }
      ],
      attachments: ['bilan_sophie.pdf', 'historique_analyses.pdf'],
      createdAt: '2025-02-28'
    },
    'task-3': {
      id: 'task-3',
      title: 'Suivi hebdo - Paul',
      description: 'Appel de suivi hebdomadaire et ajustements du plan de perte de poids. Analyse des résultats de la semaine et discussion des difficultés rencontrées.',
      dueDate: '2025-03-04',
      patient: 'Paul Atréides',
      patientId: 'p003',
      tags: ['suivi', 'perte de poids', 'hebdomadaire'],
      checklist: [
        { id: 'check-12', text: 'Vérifier journal alimentaire', completed: false },
        { id: 'check-13', text: 'Analyser mesures de poids', completed: true },
        { id: 'check-14', text: 'Ajuster calories', completed: false },
        { id: 'check-15', text: 'Revoir répartition glucides', completed: false },
        { id: 'check-16', text: 'Planifier appel de suivi', completed: true },
        { id: 'check-17', text: 'Envoyer nouveau planning', completed: false }
      ],
      attachments: ['courbe_poids_lucas.pdf'],
      createdAt: '2025-03-02'
    },
    'task-4': {
      id: 'task-4',
      title: 'Plan sans gluten - Honor',
      description: 'Adaptation complète du plan alimentaire pour intolérance au gluten sévère, incluant la recherche de sources cachées de gluten et alternatives nutritionnellement équivalentes.',
      dueDate: '2025-03-07',
      patient: 'Honor Harrington',
      patientId: 'p004',
      tags: ['sans gluten', 'intolérance', 'maladie cœliaque'],
      checklist: [
        { id: 'check-18', text: 'Liste aliments autorisés', completed: true },
        { id: 'check-19', text: 'Alternatives sans gluten', completed: true },
        { id: 'check-20', text: 'Menu semaine détaillé', completed: false },
        { id: 'check-21', text: 'Guide achats en supermarché', completed: true },
        { id: 'check-22', text: 'Vérifier contaminations croisées', completed: false },
        { id: 'check-23', text: 'Recettes sans gluten', completed: false }
      ],
      attachments: ['intolerance_gluten.pdf', 'test_allergie.pdf'],
      createdAt: '2025-02-25'
    },
    'task-5': {
      id: 'task-5',
      title: 'Prog. sportif - Takeshi',
      description: 'Plan nutritionnel spécifique pour préparation marathon, avec stratégies de charge glycogénique, hydratation pendant l\'effort et récupération post-course.',
      dueDate: '2025-03-12',
      patient: 'Takeshi Kovacs',
      patientId: 'p005',
      tags: ['sportif', 'endurance', 'marathon'],
      checklist: [
        { id: 'check-24', text: 'Protocol recharge glycogène', completed: true },
        { id: 'check-25', text: 'Plan hydratation pendant course', completed: false },
        { id: 'check-26', text: 'Nutrition pré-compétition', completed: true },
        { id: 'check-27', text: 'Stratégie ravitaillement course', completed: false },
        { id: 'check-28', text: 'Plan récupération post-marathon', completed: false }
      ],
      attachments: ['plan_marathon.pdf'],
      createdAt: '2025-03-01'
    },
    'task-6': {
      id: 'task-6',
      title: 'Bilan mensuel - Ellen',
      description: 'Analyse complète des progrès mensuels et ajustements du plan pour patiente diabétique de type 2. Évaluation de l\'équilibre glycémique et modifications diététiques.',
      dueDate: '2025-03-01',
      patient: 'Ellen Ripley',
      patientId: 'p006',
      tags: ['bilan', 'diabète', 'mensuel'],
      checklist: [
        { id: 'check-29', text: 'Générer graphique glycémie', completed: true },
        { id: 'check-30', text: 'Analyser tendances HbA1c', completed: true },
        { id: 'check-31', text: 'Ajuster index glycémique repas', completed: true },
        { id: 'check-32', text: 'Vérifier journal alimentaire', completed: true },
        { id: 'check-33', text: 'Mettre à jour médicaments', completed: true },
        { id: 'check-34', text: 'Envoyer rapport mensuel', completed: true }
      ],
      attachments: ['rapport_mars_marie.pdf', 'graphiques_glycemie.pdf'],
      createdAt: '2025-02-20'
    },
    'task-7': {
      id: 'task-7',
      title: 'Réaction allergique - Winston',
      description: 'Ajustement urgent du plan suite à réaction allergique sévère. Identification de l\'allergène et refonte complète du régime avec élimination des risques.',
      dueDate: '2025-03-03',
      patient: 'Winston Smith',
      patientId: 'p007',
      tags: ['allergie', 'urgent', 'réaction'],
      checklist: [
        { id: 'check-35', text: 'Identifier allergène spécifique', completed: true },
        { id: 'check-36', text: 'Créer nouveau plan d\'urgence', completed: false },
        { id: 'check-37', text: 'Contacter médecin traitant', completed: false },
        { id: 'check-38', text: 'Liste complète exclusions', completed: true },
        { id: 'check-39', text: 'Plan d\'urgence réaction', completed: false },
        { id: 'check-40', text: 'Former à l\'auto-injection', completed: false }
      ],
      attachments: ['allergie_paul.pdf', 'test_cutane.pdf', 'ordonnance.pdf'],
      createdAt: '2025-03-02'
    }
  });

  const columnOrder = ['urgent', 'to-do', 'in-progress', 'done'];
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTasks, setFilteredTasks] = useState({...tasks});
  const [editingTask, setEditingTask] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeColumn, setActiveColumn] = useState(null);
  const [movingTasks, setMovingTasks] = useState({});

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredTasks({...tasks});
      return;
    }

    const lowercasedSearch = searchTerm.toLowerCase();
    const filtered = Object.entries(tasks).reduce((acc, [id, task]) => {
      if (
        task.title.toLowerCase().includes(lowercasedSearch) ||
        task.description.toLowerCase().includes(lowercasedSearch) ||
        task.patient.toLowerCase().includes(lowercasedSearch) ||
        task.tags.some(tag => tag.toLowerCase().includes(lowercasedSearch))
      ) {
        acc[id] = task;
      }
      return acc;
    }, {});

    setFilteredTasks(filtered);
  }, [searchTerm, tasks]);

  // Gestion du drag-and-drop
  const handleDragStart = (e, taskId, columnId) => {
    // Vérifier si l'élément cliqué est un contrôle d'expansion ou une sous-tâche
    const isControlElement = e.target.closest(`.${styles.todoControls}`) || 
                            e.target.closest(`.${styles.checklistItem}`) ||
                            e.target.closest(`.${styles.attachmentItem}`) ||
                            e.target.closest(`.${styles.taskActions}`);
    
    if (isControlElement) {
      e.preventDefault();
      return;
    }
    
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('sourceColumnId', columnId);
    e.currentTarget.classList.add(styles.dragging);
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove(styles.dragging);
    // Nettoyer toutes les classes "over"
    document.querySelectorAll(`.${styles.over}`).forEach(el => {
      el.classList.remove(styles.over);
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add(styles.draggingOver);
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove(styles.draggingOver);
  };

  const handleTaskDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Trouver la carte survolée
    const taskCard = e.currentTarget;
    
    // Retirer la classe "over" de toutes les tâches
    document.querySelectorAll(`.${styles.over}`).forEach(el => {
      if (el !== taskCard) {
        el.classList.remove(styles.over);
      }
    });
    
    // Ajouter la classe "over" à la tâche actuelle
    taskCard.classList.add(styles.over);
  };

  const handleTaskDragLeave = (e) => {
    e.currentTarget.classList.remove(styles.over);
  };

  const handleDrop = (e, targetColumnId) => {
    e.preventDefault();
    e.currentTarget.classList.remove(styles.draggingOver);
    
    // Nettoyer les classes visuelles
    document.querySelectorAll(`.${styles.over}`).forEach(el => {
      el.classList.remove(styles.over);
    });
    
    const taskId = e.dataTransfer.getData('taskId');
    const sourceColumnId = e.dataTransfer.getData('sourceColumnId');
    
    // Déplacer la tâche entre colonnes ou réorganiser dans la même colonne
    setColumns(prevColumns => {
      // Supprimer la tâche de la colonne source
      const sourceColumn = prevColumns[sourceColumnId];
      const newSourceTaskIds = sourceColumn.taskIds.filter(id => id !== taskId);
      
      if (sourceColumnId === targetColumnId) {
        // Si même colonne, déterminer la position d'insertion
        const dropTarget = e.target.closest(`.${styles.taskCard}`);
        
        if (!dropTarget) {
          // Déposé sur un espace vide, ajouter à la fin
          return {
            ...prevColumns,
            [sourceColumnId]: {
              ...sourceColumn,
              taskIds: [...newSourceTaskIds, taskId]
            }
          };
        }
        
        const targetTaskId = dropTarget.getAttribute('data-task-id');
        
        if (targetTaskId === taskId) {
          // Déposé sur lui-même, rien ne change
          return prevColumns;
        }
        
        // Trouver l'index de l'élément cible dans la liste
        const targetIndex = newSourceTaskIds.indexOf(targetTaskId);
        
        // Insérer l'élément à la bonne position
        const updatedTaskIds = [...newSourceTaskIds];
        updatedTaskIds.splice(targetIndex, 0, taskId);
        
        return {
          ...prevColumns,
          [sourceColumnId]: {
            ...sourceColumn,
            taskIds: updatedTaskIds
          }
        };
      } else {
        // Déplacer entre colonnes différentes
        const destinationColumn = prevColumns[targetColumnId];
        const newDestinationTaskIds = [...destinationColumn.taskIds, taskId];
        
        return {
          ...prevColumns,
          [sourceColumnId]: {
            ...sourceColumn,
            taskIds: newSourceTaskIds
          },
          [targetColumnId]: {
            ...destinationColumn,
            taskIds: newDestinationTaskIds
          }
        };
      }
    });
  };

  // Handler pour créer une nouvelle tâche
  const handleAddTask = (newTask) => {
    // Ajouter la tâche aux données
    setTasks(prevTasks => ({
      ...prevTasks,
      [newTask.id]: newTask
    }));
    
    // Ajouter l'ID de la tâche à la colonne "À Faire" par défaut
    // ou à la colonne "Urgent" si la tâche est marquée comme urgente
    const targetColumnId = newTask.urgent ? 'urgent' : 'to-do';
    
    setColumns(prevColumns => ({
      ...prevColumns,
      [targetColumnId]: {
        ...prevColumns[targetColumnId],
        taskIds: [...prevColumns[targetColumnId].taskIds, newTask.id]
      }
    }));
    
    // Fermer le modal
    setIsAddModalOpen(false);
  };

  // Handler pour éditer une tâche existante
  const handleEditTask = (updatedTask) => {
    // Mettre à jour la tâche dans les données
    setTasks(prevTasks => ({
      ...prevTasks,
      [updatedTask.id]: updatedTask
    }));
    
    // Si la priorité a changé (urgent ou non), déplacer la tâche vers la bonne colonne
    if (updatedTask.urgent && !columns['urgent'].taskIds.includes(updatedTask.id)) {
      // Trouver dans quelle colonne se trouve actuellement la tâche
      let currentColumnId = '';
      for (const [columnId, column] of Object.entries(columns)) {
        if (column.taskIds.includes(updatedTask.id)) {
          currentColumnId = columnId;
          break;
        }
      }
      
      if (currentColumnId && currentColumnId !== 'urgent') {
        // Déplacer la tâche de sa colonne actuelle vers la colonne "Urgent"
        setColumns(prevColumns => {
          const currentColumn = prevColumns[currentColumnId];
          const urgentColumn = prevColumns['urgent'];
          
          return {
            ...prevColumns,
            [currentColumnId]: {
              ...currentColumn,
              taskIds: currentColumn.taskIds.filter(id => id !== updatedTask.id)
            },
            'urgent': {
              ...urgentColumn,
              taskIds: [...urgentColumn.taskIds, updatedTask.id]
            }
          };
        });
      }
    }
    
    // Fermer le modal d'édition
    setIsEditModalOpen(false);
    setEditingTask(null);
  };

  // Handler pour mettre à jour une tâche
  const handleUpdateTask = (updatedTask) => {
    // Vérifier si toutes les tâches de la checklist sont complétées
    const allCompleted = updatedTask.checklist && 
                         updatedTask.checklist.length > 0 && 
                         updatedTask.checklist.every(item => item.completed);
    
    // Mettre à jour la tâche dans l'état
    setTasks(prevTasks => ({
      ...prevTasks,
      [updatedTask.id]: updatedTask
    }));
    
    // Si toutes les tâches sont complétées et que la tâche n'est pas déjà dans la colonne "done"
    if (allCompleted) {
      // Trouver dans quelle colonne est actuellement la tâche
      let currentColumnId = null;
      
      for (const [columnId, column] of Object.entries(columns)) {
        if (column.taskIds.includes(updatedTask.id)) {
          currentColumnId = columnId;
          break;
        }
      }
      
      // Si la tâche n'est pas déjà dans la colonne "done", la déplacer
      if (currentColumnId && currentColumnId !== 'done') {
        // Marquer la tâche comme étant en mouvement pour l'animation
        setMovingTasks(prev => ({
          ...prev,
          [updatedTask.id]: true
        }));
        
        // Attendre que l'animation se termine avant de déplacer la tâche
        setTimeout(() => {
          // Retirer la tâche de sa colonne actuelle
          setColumns(prevColumns => ({
            ...prevColumns,
            [currentColumnId]: {
              ...prevColumns[currentColumnId],
              taskIds: prevColumns[currentColumnId].taskIds.filter(id => id !== updatedTask.id)
            },
            // Ajouter la tâche à la colonne "done"
            'done': {
              ...prevColumns['done'],
              taskIds: [...prevColumns['done'].taskIds, updatedTask.id]
            }
          }));
          
          // Réinitialiser l'état d'animation après le déplacement
          setTimeout(() => {
            setMovingTasks(prev => {
              const newState = { ...prev };
              delete newState[updatedTask.id];
              return newState;
            });
          }, 100); // Un court délai pour s'assurer que la réinitialisation se produit après le rendu
        }, 1000); // Attendre 1 seconde (durée de l'animation)
      }
    }
  };

  // Handler pour supprimer une tâche
  const handleDeleteTask = (taskId) => {
    // Trouver dans quelle colonne est la tâche
    let columnId = '';
    for (const [colId, column] of Object.entries(columns)) {
      if (column.taskIds.includes(taskId)) {
        columnId = colId;
        break;
      }
    }
    
    if (!columnId) return;
    
    // Supprimer la tâche de la colonne
    setColumns(prevColumns => ({
      ...prevColumns,
      [columnId]: {
        ...prevColumns[columnId],
        taskIds: prevColumns[columnId].taskIds.filter(id => id !== taskId)
      }
    }));
    
    // Supprimer la tâche des données
    setTasks(prevTasks => {
      const newTasks = { ...prevTasks };
      delete newTasks[taskId];
      return newTasks;
    });
  };

  // Handler pour ouvrir le modal d'édition
  const openEditModal = (taskId) => {
    setEditingTask(tasks[taskId]);
    setIsEditModalOpen(true);
  };

  // Handler pour ajouter une nouvelle tâche dans une colonne spécifique
  const handleAddTaskToColumn = (columnId) => {
    setActiveColumn(columnId);
    setIsAddModalOpen(true);
  };

  return (
    <>
      <div className={styles.todoListContainer}>
        <div className={styles.todoListHeader}>
          <h2 className={styles.todoListTitle}>Tâches et Suivis</h2>
          
          <div className={styles.todoListActions}>
            <div className={styles.searchContainer}>
              <FaSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            
            <button
              className={styles.addButton}
              onClick={() => {
                setActiveColumn(null);
                setIsAddModalOpen(true);
              }}
            >
              <FaPlus />
              <span>Ajouter</span>
            </button>
          </div>
        </div>
        
        <div className={styles.todoListContent}>
          {columnOrder.map((columnId) => {
            const column = columns[columnId];
            const columnTasks = column.taskIds
              .filter(taskId => filteredTasks[taskId])
              .map(taskId => filteredTasks[taskId]);
            
            return (
              <div
                key={column.id}
                className={styles.todoColumn}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <div className={styles.columnHeader}>
                  <div className={styles.columnInfo}>
                    <div className={styles.columnIcon}>
                      {column.icon}
                    </div>
                    <h3>{column.title} <span className={styles.taskCount}>{columnTasks.length}</span></h3>
                  </div>
                  <button 
                    className={styles.columnAddButton}
                    onClick={() => handleAddTaskToColumn(column.id)}
                  >
                    <FaPlus />
                  </button>
                </div>
                
                <div className={styles.taskList}>
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`${styles.taskCard} ${movingTasks[task.id] ? styles.taskCardMoving : ''}`}
                      draggable
                      data-task-id={task.id}
                      onDragStart={(e) => handleDragStart(e, task.id, column.id)}
                      onDragEnd={handleDragEnd}
                      onDragOver={handleTaskDragOver}
                      onDragLeave={handleTaskDragLeave}
                    >
                      <div className={styles.taskActions}>
                        <button 
                          className={`${styles.actionButton} ${styles.editButton}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(task.id);
                          }}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
                              handleDeleteTask(task.id);
                            }
                          }}
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                      <TodoCard task={task} onUpdateTask={handleUpdateTask} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Modales rendues en dehors du conteneur principal, directement dans le DOM */}
      {isAddModalOpen && (
        <EditTodoModal
          onClose={() => {
            setIsAddModalOpen(false);
            setActiveColumn(null);
          }}
          onSave={(newTask) => {
            // Si une colonne spécifique est active, ajouter la tâche à cette colonne
            if (activeColumn) {
              setTasks(prevTasks => ({
                ...prevTasks,
                [newTask.id]: newTask
              }));
              
              setColumns(prevColumns => ({
                ...prevColumns,
                [activeColumn]: {
                  ...prevColumns[activeColumn],
                  taskIds: [...prevColumns[activeColumn].taskIds, newTask.id]
                }
              }));
              
              setIsAddModalOpen(false);
              setActiveColumn(null);
            } else {
              // Sinon utiliser le handler par défaut
              handleAddTask(newTask);
            }
          }}
          isEditing={false}
        />
      )}
      
      {isEditModalOpen && editingTask && (
        <EditTodoModal
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingTask(null);
          }}
          onSave={handleEditTask}
          task={editingTask}
          isEditing={true}
        />
      )}
    </>
  );
};

export default TodoList;
