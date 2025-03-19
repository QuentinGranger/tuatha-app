import React, { useState } from 'react';
import CustomCalendar from './CustomCalendar';
import { MdOutlineNavigateNext, MdOutlineNavigateBefore } from 'react-icons/md';
import { FaPlus } from 'react-icons/fa';
import styles from './Calendar.module.css';
import AppointmentModalPortal from './AppointmentModalPortal';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isCreatingAppointment, setIsCreatingAppointment] = useState(false);
  
  // Date actuelle pour générer des rendez-vous
  const getAppointmentsData = () => {
    // Crée des dates pour aujourd'hui, demain et après-demain
    const today = new Date();
    
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(today.getDate() + 2);
    
    // Données de rendez-vous avec des personnages BD/Comics adaptés pour une nutritionniste
    return [
      {
        id: 1,
        title: 'Bilan nutritionnel - Tintin',
        startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0),
        endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
        type: 'virtual',
        status: 'confirmed',
        patient: {
          id: 'p1',
          name: 'Tintin',
          email: 'tintin@moulinsart.be',
          phone: '06 12 34 56 78'
        },
        nutritionInfo: {
          objective: 'Équilibrage alimentaire pour aventurier',
          lastWeight: 65,
          lastSession: null,
          regime: 'Alimentation adaptée aux voyages'
        },
        notes: 'Première consultation pour établir un plan nutritionnel adapté à ses nombreuses aventures. Besoin de conseils pour une alimentation équilibrée lors de voyages prolongés.'
      },
      {
        id: 2,
        title: 'Suivi mensuel - Bruce Wayne',
        startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 0),
        endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 30),
        type: 'in-person',
        status: 'pending',
        patient: {
          id: 'p2',
          name: 'Bruce Wayne',
          email: 'bwayne@waynecorp.com',
          phone: '06 98 76 54 32'
        },
        nutritionInfo: {
          objective: 'Nutrition pour performance physique nocturne',
          lastWeight: 95.5,
          lastSession: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30),
          regime: 'Alimentation hyperprotéinée avec timing spécifique'
        },
        notes: 'Suivi mensuel pour adapter le régime alimentaire aux activités nocturnes intenses. Besoin d\'optimiser l\'apport calorique et le timing des repas.'
      },
      {
        id: 3,
        title: 'Indisponible',
        startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0),
        endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 30),
        type: 'timeblock',
        status: 'timeblock',
        notes: 'Pause déjeuner'
      },
      {
        id: 4,
        title: 'Plan alimentaire - Astérix',
        startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0),
        endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 0),
        type: 'in-person',
        status: 'confirmed',
        patient: {
          id: 'p3',
          name: 'Astérix',
          email: 'asterix@village.gaulois',
          phone: '07 65 43 21 09'
        },
        nutritionInfo: {
          objective: 'Alternative à la potion magique',
          lastWeight: 52.3,
          lastSession: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14),
          regime: 'Régime riche en nutriments naturels'
        },
        notes: 'Consultation pour établir un régime alimentaire naturellement énergisant comme alternative à la potion magique. Attention à son addiction au sanglier.'
      },
      {
        id: 5,
        title: 'Téléconsultation - Peter Parker',
        startTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 10, 0),
        endTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 10, 30),
        type: 'phone',
        status: 'confirmed',
        patient: {
          id: 'p4',
          name: 'Peter Parker',
          email: 'peter.parker@dailybugle.com',
          phone: '06 01 23 45 67'
        },
        nutritionInfo: {
          objective: 'Alimentation pour métabolisme accéléré',
          lastWeight: 75.0,
          lastSession: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 21),
          regime: 'Alimentation hypercalorique adaptée'
        },
        notes: 'Suivi téléphonique pour ajuster son plan nutritionnel. Besoin de gérer un métabolisme exceptionnellement rapide et des besoins caloriques élevés dus à son activité intense.'
      },
      {
        id: 6,
        title: 'Consultation annulée - Tony Stark',
        startTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 11, 0),
        endTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 12, 0),
        type: 'in-person',
        status: 'cancelled',
        patient: {
          id: 'p5',
          name: 'Tony Stark',
          email: 'tony@stark.industries',
          phone: '07 89 01 23 45'
        },
        nutritionInfo: {
          objective: 'Alimentation anti-stress et détox',
          lastWeight: 82.8,
          lastSession: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 60),
          regime: 'Détox métaux lourds, anti-inflammatoire'
        },
        notes: 'Patient a annulé pour cause d\'urgence mondiale. À reprogrammer dès que possible pour suivre son plan détox.'
      },
      {
        id: 7,
        title: 'Bilan nutritionnel - Obélix',
        startTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 14, 0),
        endTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 15, 0),
        type: 'in-person',
        status: 'confirmed',
        patient: {
          id: 'p6',
          name: 'Obélix',
          email: 'obelix@village.gaulois',
          phone: '06 54 32 10 98'
        },
        nutritionInfo: {
          objective: 'Perte de poids et rééquilibrage alimentaire',
          lastWeight: 134.2,
          lastSession: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 15),
          regime: 'Transition progressive sanglier-légumes'
        },
        notes: 'Consultation pour établir un plan de réduction de consommation de sanglier et introduire plus de variété alimentaire. Résistant au changement, approche progressive nécessaire.'
      },
      {
        id: 8,
        title: 'Nutrition sportive - Lucky Luke',
        startTime: new Date(dayAfterTomorrow.getFullYear(), dayAfterTomorrow.getMonth(), dayAfterTomorrow.getDate(), 9, 0),
        endTime: new Date(dayAfterTomorrow.getFullYear(), dayAfterTomorrow.getMonth(), dayAfterTomorrow.getDate(), 10, 0),
        type: 'virtual',
        status: 'confirmed',
        patient: {
          id: 'p7',
          name: 'Lucky Luke',
          email: 'lucky.luke@Western.com',
          phone: '06 78 90 12 34'
        },
        nutritionInfo: {
          objective: 'Alimentation pour cavalier endurant',
          lastWeight: 68.5,
          lastSession: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 45),
          regime: 'Alimentation adaptée aux longues chevauches'
        },
        notes: 'Consultation virtuelle pour optimiser son alimentation pendant ses longues traversées du Far West. Sevrage tabagique en cours, besoin de substituts oraux sains.'
      },
      {
        id: 9,
        title: 'Conseil collectif - Les Schtroumpfs',
        startTime: new Date(dayAfterTomorrow.getFullYear(), dayAfterTomorrow.getMonth(), dayAfterTomorrow.getDate(), 11, 0),
        endTime: new Date(dayAfterTomorrow.getFullYear(), dayAfterTomorrow.getMonth(), dayAfterTomorrow.getDate(), 12, 30),
        type: 'in-person',
        status: 'confirmed',
        patient: {
          id: 'p8',
          name: 'Village des Schtroumpfs',
          email: 'grand.schtroumpf@schtroumpf.village',
          phone: '07 12 34 56 78'
        },
        nutritionInfo: {
          objective: 'Diversification alimentaire au-delà de la salsepareille',
          lastWeight: 'Variable (groupe)',
          lastSession: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10),
          regime: 'Plan nutritionnel communautaire'
        },
        notes: 'Session collective pour le village entier. Objectif de diversifier l\'alimentation au-delà de la salsepareille. Attention particulière pour Schtroumpf Gourmand.'
      },
      {
        id: 10,
        title: 'Bilan complet - Clark Kent',
        startTime: new Date(dayAfterTomorrow.getFullYear(), dayAfterTomorrow.getMonth(), dayAfterTomorrow.getDate(), 15, 0),
        endTime: new Date(dayAfterTomorrow.getFullYear(), dayAfterTomorrow.getMonth(), dayAfterTomorrow.getDate(), 16, 0),
        type: 'in-person',
        status: 'confirmed',
        patient: {
          id: 'p9',
          name: 'Clark Kent',
          email: 'clark.kent@dailyplanet.com',
          phone: '06 87 65 43 21'
        },
        nutritionInfo: {
          objective: 'Alimentation haute énergie solaire',
          lastWeight: 103.6,
          lastSession: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 90),
          regime: 'Optimisation absorption solaire par nutrition'
        },
        notes: 'Consultation pour optimiser l\'alimentation complémentaire à son énergie solaire principale. Besoins caloriques exceptionnellement élevés à gérer discrètement.'
      }
    ];
  };

  // Obtenir les rendez-vous avec des héros
  const [mockAppointments, setMockAppointments] = useState(getAppointmentsData());

  // Gestion du rendez-vous en création
  const handleOpenCreateModal = () => {
    setIsCreatingAppointment(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreatingAppointment(false);
  };

  const handleCreateAppointment = (newAppointment) => {
    // Générer un nouvel ID pour le rendez-vous
    const newId = mockAppointments.length > 0 
      ? Math.max(...mockAppointments.map(a => a.id)) + 1 
      : 1;
    
    const appointmentToAdd = {
      ...newAppointment,
      id: newId
    };
    
    // Ajouter le nouveau rendez-vous à la liste existante
    setMockAppointments([...mockAppointments, appointmentToAdd]);
    setIsCreatingAppointment(false);
  };

  // Navigation dans le calendrier
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Format pour afficher le mois et l'année
  const formatMonthYear = (date) => {
    return date.toLocaleDateString('fr-FR', {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendarHeader}>
        <div className={styles.calendarTitle}>
          <h2>Calendrier</h2>
        </div>
        <div className={styles.calendarControls}>
          <div className={styles.controlsRow}>
            <div className={styles.dateNavigation}>
              <button 
                className={styles.navButton} 
                onClick={goToPrevious}
                aria-label="Semaine précédente"
              >
                <MdOutlineNavigateBefore />
              </button>
              <button 
                className={styles.todayButton}
                onClick={goToToday}
              >
                Aujourd'hui
              </button>
              <button 
                className={styles.navButton} 
                onClick={goToNext}
                aria-label="Semaine suivante"
              >
                <MdOutlineNavigateNext />
              </button>
            </div>
            
            {/* Bouton d'ajout de rendez-vous */}
            <button 
              className={styles.addButton}
              onClick={handleOpenCreateModal}
            >
              <FaPlus /> Ajouter un rendez-vous
            </button>
          </div>
          <div className={styles.currentPeriod}>
            {formatMonthYear(currentDate)}
          </div>
        </div>
      </div>
      <div className={styles.calendarWrapper}>
        <CustomCalendar 
          appointments={mockAppointments}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
        />
      </div>

      {/* Modal de création de rendez-vous */}
      {isCreatingAppointment && (
        <AppointmentModalPortal
          isCreateMode={true}
          onClose={handleCloseCreateModal}
          onCreate={handleCreateAppointment}
        />
      )}
    </div>
  );
};

export default Calendar;
