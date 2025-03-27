'use client';

import React, { useState } from 'react';
import { IoMdCreate, IoMdTrash, IoMdEye, IoMdAdd } from 'react-icons/io';
import tableStyles from './performanceTables.module.css';

const formatDate = (dateString) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

const PerformanceTable = ({ 
  data, 
  onAdd, 
  onEdit, 
  onDelete, 
  onView,
  selectedPatient 
}) => {
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const sortedData = [...data].sort((a, b) => {
    let valueA, valueB;
    
    // Obtenir les valeurs selon le champ de tri
    switch (sortField) {
      case 'date':
        valueA = new Date(a.date);
        valueB = new Date(b.date);
        break;
      case 'weight':
        valueA = a.weight || 0;
        valueB = b.weight || 0;
        break;
      case 'hydration':
        valueA = a.hydration || 0;
        valueB = b.hydration || 0;
        break;
      case 'calories':
        valueA = (a.calories?.consumed || 0) - (a.calories?.burned || 0);
        valueB = (b.calories?.consumed || 0) - (b.calories?.burned || 0);
        break;
      case 'sleep':
        valueA = a.sleep?.duration || 0;
        valueB = b.sleep?.duration || 0;
        break;
      default:
        valueA = a[sortField] || '';
        valueB = b[sortField] || '';
    }
    
    // Déterminer l'ordre
    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  // Fonction pour obtenir l'icône de tri
  const getSortIcon = (field) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };
  
  return (
    <div className={tableStyles.kpiCard}>
      <div className={tableStyles.cardHeader}>
        <h3 className={tableStyles.cardTitle}>
          Historique des Données
        </h3>
        
        <button 
          className={tableStyles.addButton}
          onClick={() => onAdd()}
          disabled={!selectedPatient}
          title={!selectedPatient ? "Veuillez d'abord sélectionner un patient" : "Ajouter une entrée"}
        >
          <IoMdAdd /> Ajouter
        </button>
      </div>
      
      <div className={tableStyles.cardContent}>
        {data.length === 0 ? (
          <div className={tableStyles.emptyState}>
            <p>Aucune donnée disponible pour ce patient.</p>
            <button 
              className={tableStyles.addEmptyButton}
              onClick={() => onAdd()}
              disabled={!selectedPatient}
            >
              <IoMdAdd /> Ajouter des données
            </button>
          </div>
        ) : (
          <div className={tableStyles.tablePremium}>
            <table>
              <thead>
                <tr>
                  <th onClick={() => handleSort('date')}>
                    Date {getSortIcon('date')}
                  </th>
                  <th onClick={() => handleSort('weight')}>
                    Poids {getSortIcon('weight')}
                  </th>
                  <th onClick={() => handleSort('hydration')}>
                    Hydratation {getSortIcon('hydration')}
                  </th>
                  <th onClick={() => handleSort('calories')}>
                    Bilan Cal. {getSortIcon('calories')}
                  </th>
                  <th onClick={() => handleSort('sleep')}>
                    Sommeil {getSortIcon('sleep')}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((entry, index) => (
                  <tr key={index}>
                    <td>{formatDate(entry.date)}</td>
                    <td>
                      {entry.weight ? (
                        <span className={tableStyles.metricValue}>{entry.weight} kg</span>
                      ) : (
                        <span className={tableStyles.notRecorded}>Non enregistré</span>
                      )}
                    </td>
                    <td>
                      {entry.hydration ? (
                        <span className={tableStyles.metricValue}>{entry.hydration} L</span>
                      ) : (
                        <span className={tableStyles.notRecorded}>Non enregistré</span>
                      )}
                    </td>
                    <td>
                      {entry.calories?.consumed || entry.calories?.burned ? (
                        <div>
                          <span className={tableStyles.metricValue}>
                            {((entry.calories?.consumed || 0) - (entry.calories?.burned || 0)).toFixed(0)} kcal
                          </span>
                          <div className={tableStyles.smallText}>
                            {entry.calories?.consumed ? `+${entry.calories.consumed} kcal` : ''} 
                            {entry.calories?.burned ? ` -${entry.calories.burned} kcal` : ''}
                          </div>
                        </div>
                      ) : (
                        <span className={tableStyles.notRecorded}>Non enregistré</span>
                      )}
                    </td>
                    <td>
                      {entry.sleep?.duration ? (
                        <div>
                          <span className={tableStyles.metricValue}>{entry.sleep.duration}h</span>
                          {entry.sleep.quality && (
                            <div className={tableStyles.smallText}>
                              Qualité: {entry.sleep.quality}%
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className={tableStyles.notRecorded}>Non enregistré</span>
                      )}
                    </td>
                    <td>
                      <div className={tableStyles.actionButtons}>
                        <button
                          className={`${tableStyles.actionButton} ${tableStyles.viewButton}`}
                          onClick={() => onView(entry)}
                          title="Voir les détails"
                        >
                          <IoMdEye />
                        </button>
                        <button
                          className={`${tableStyles.actionButton} ${tableStyles.editButton}`}
                          onClick={() => onEdit(entry)}
                          title="Modifier"
                        >
                          <IoMdCreate />
                        </button>
                        <button
                          className={`${tableStyles.actionButton} ${tableStyles.deleteButton}`}
                          onClick={() => onDelete(entry)}
                          title="Supprimer"
                        >
                          <IoMdTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceTable;
