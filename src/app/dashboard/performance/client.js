'use client';

import { useState, useEffect } from 'react';
import PerformanceDashboard from './components/PerformanceDashboard';
import { getAllPatients } from './actions';
import { athletes } from './test-data';

export default function PerformanceDashboardClient() {
  const [mounted, setMounted] = useState(false);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    
    async function fetchPatients() {
      try {
        // Utiliser l'action server pour récupérer les patients
        console.log("Tentative de récupération des patients via server action...");
        const data = await getAllPatients();
        console.log("Patients récupérés via server action:", data?.length || 0, data);
        
        if (Array.isArray(data) && data.length > 0) {
          setPatients(data);
        } else {
          console.warn("Données de patients non valides ou vides, utilisation des données de test");
          // Utiliser les données de test en cas d'échec
          setPatients(athletes);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des patients:", error);
        console.log("Utilisation des données de test suite à une erreur");
        setPatients(athletes);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPatients();
  }, []);

  // Logique simple: si le composant n'est pas monté, on affiche un loader
  if (!mounted || loading) {
    return (
      <div className="performance-container">
        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
            <p>Chargement des données...</p>
          </div>
        </div>
      </div>
    );
  }

  console.log("Envoi des patients au composant dashboard:", patients);
  // Une fois monté, on affiche le dashboard
  return <PerformanceDashboard initialPatients={patients} />;
}
