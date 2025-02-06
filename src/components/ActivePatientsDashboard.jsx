'use client'

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import './ActivePatientsDashboard.css';

const NutritionalStatusBadge = ({ status }) => {
  const className = {
    GOOD: 'badge-good',
    AVERAGE: 'badge-average',
    CRITICAL: 'badge-critical'
  }[status];

  const emoji = {
    GOOD: '🟢',
    AVERAGE: '🟡',
    CRITICAL: '🔴'
  }[status];

  return (
    <span className={`badge ${className}`}>
      {emoji} {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
};

const ProgressionIcon = ({ status }) => {
  const className = {
    IMPROVING: 'progression-improving',
    STAGNATING: 'progression-stagnating',
    DECLINING: 'progression-declining'
  }[status];

  const icon = {
    IMPROVING: '↑',
    STAGNATING: '→',
    DECLINING: '↓'
  }[status];

  const label = {
    IMPROVING: 'En amélioration',
    STAGNATING: 'Stable',
    DECLINING: 'En déclin'
  }[status];

  return (
    <div className="tooltip" data-tooltip={label}>
      <span className={`progression-icon ${className}`}>{icon}</span>
    </div>
  );
};

const PatientModal = ({ isOpen, onClose, patient }) => {
  if (!isOpen || !patient) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-header">
          {patient.firstName} {patient.lastName}
        </div>
        <div className="modal-body">
          <div className="info-group">
            <span className="info-label">Sport</span>
            <span>{patient.sport}</span>
          </div>
          <div className="info-group">
            <span className="info-label">Blessure</span>
            <span>{patient.injury || 'Aucune blessure'}</span>
          </div>
          <div className="info-group">
            <span className="info-label">Dernier rendez-vous</span>
            <span>
              {format(new Date(patient.lastAppointment), 'dd MMMM yyyy', { locale: fr })}
            </span>
          </div>
          <div className="info-group">
            <span className="info-label">État nutritionnel</span>
            <NutritionalStatusBadge status={patient.nutritionalStatus} />
          </div>
          <div className="info-group">
            <span className="info-label">Progression</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ProgressionIcon status={patient.progressionStatus} />
              <span>{patient.progressionStatus.charAt(0) + patient.progressionStatus.slice(1).toLowerCase()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActivePatientsDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sportFilter, setSportFilter] = useState('');
  const [injuryFilter, setInjuryFilter] = useState('');
  const [nutritionalStatusFilter, setNutritionalStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/patients');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des patients');
        }
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error('Error fetching patients:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = 
      `${patient.firstName} ${patient.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    
    const matchesSport = !sportFilter || patient.sport === sportFilter;
    const matchesInjury = !injuryFilter || patient.injury === injuryFilter;
    const matchesStatus = !nutritionalStatusFilter || patient.nutritionalStatus === nutritionalStatusFilter;

    return matchesSearch && matchesSport && matchesInjury && matchesStatus;
  });

  const uniqueSports = [...new Set(patients.map((p) => p.sport))];
  const uniqueInjuries = [...new Set(patients.map((p) => p.injury).filter(Boolean))];

  if (isLoading) {
    return <div className="loading">Chargement des patients...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard">
      <div className="filters">
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Rechercher un patient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="select-filter"
          value={sportFilter}
          onChange={(e) => setSportFilter(e.target.value)}
        >
          <option value="">Sport</option>
          {uniqueSports.map((sport) => (
            <option key={sport} value={sport}>
              {sport}
            </option>
          ))}
        </select>
        <select
          className="select-filter"
          value={injuryFilter}
          onChange={(e) => setInjuryFilter(e.target.value)}
        >
          <option value="">Blessure</option>
          {uniqueInjuries.map((injury) => (
            <option key={injury} value={injury}>
              {injury}
            </option>
          ))}
        </select>
        <select
          className="select-filter"
          value={nutritionalStatusFilter}
          onChange={(e) => setNutritionalStatusFilter(e.target.value)}
        >
          <option value="">État nutritionnel</option>
          <option value="GOOD">Bon</option>
          <option value="AVERAGE">Moyen</option>
          <option value="CRITICAL">Critique</option>
        </select>
      </div>

      <div className="table-container">
        <table className="patients-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Sport</th>
              <th>Blessure</th>
              <th>Dernier RDV</th>
              <th>État nutritionnel</th>
              <th>Progression</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient.id} onClick={() => handlePatientClick(patient)}>
                <td>
                  {patient.firstName} {patient.lastName}
                </td>
                <td>{patient.sport}</td>
                <td>{patient.injury || '-'}</td>
                <td>
                  {format(new Date(patient.lastAppointment), 'dd/MM/yyyy')}
                </td>
                <td>
                  <NutritionalStatusBadge status={patient.nutritionalStatus} />
                </td>
                <td>
                  <ProgressionIcon status={patient.progressionStatus} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        patient={selectedPatient}
      />
    </div>
  );
};

export default ActivePatientsDashboard;
