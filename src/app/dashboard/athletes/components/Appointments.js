'use client';

import { useState } from 'react';
import styles from './Appointments.module.css';

export default function Appointments({ patient }) {
  const [view, setView] = useState('calendar'); // 'calendar' or 'list'
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  
  if (!patient) {
    return <div className={styles.emptyState}>Veuillez sélectionner un patient</div>;
  }
  
  // Données fictives
  const appointments = [
    {
      id: 1,
      title: 'Consultation Nutrition',
      type: 'nutrition',
      start: new Date(2024, 2, 15, 10, 0),
      end: new Date(2024, 2, 15, 11, 0),
      with: 'Dr. Sophie Legrand',
      location: 'Cabinet A, Étage 2',
      notes: 'Bilan du nouveau plan alimentaire et ajustements si nécessaire.'
    },
    {
      id: 2,
      title: 'Test de performance',
      type: 'performance',
      start: new Date(2024, 2, 18, 14, 30),
      end: new Date(2024, 2, 18, 16, 0),
      with: 'Alex Martin',
      location: 'Salle de sport',
      notes: 'Test VO2Max et évaluation force/puissance. Prévoir tenue adaptée et être bien hydraté.'
    },
    {
      id: 3,
      title: 'Suivi médical',
      type: 'medical',
      start: new Date(2024, 2, 22, 9, 0),
      end: new Date(2024, 2, 22, 9, 30),
      with: 'Dr. Thomas Moreau',
      location: 'Cabinet B, Étage 1',
      notes: 'Suivi du genou droit suite à la rééducation.'
    }
  ];
  
  const prevMonth = () => {
    const date = new Date(currentMonth);
    date.setMonth(date.getMonth() - 1);
    setCurrentMonth(date);
  };
  
  const nextMonth = () => {
    const date = new Date(currentMonth);
    date.setMonth(date.getMonth() + 1);
    setCurrentMonth(date);
  };
  
  const generateCalendarData = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const daysInMonth = lastDayOfMonth.getDate();
    const firstWeekday = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1; // Adjust Sunday (0) to be 6
    
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const days = [];
    
    // Previous month days
    for (let i = 0; i < firstWeekday; i++) {
      const dayNumber = daysInPrevMonth - firstWeekday + i + 1;
      days.push({
        date: new Date(year, month - 1, dayNumber),
        currentMonth: false,
        appointments: []
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        currentMonth: true,
        today: new Date().toDateString() === date.toDateString(),
        appointments: appointments.filter(a => 
          a.start.toDateString() === date.toDateString()
        )
      });
    }
    
    // Next month days
    const totalDaysToShow = 42; // 6 weeks
    const remainingDays = totalDaysToShow - days.length;
    
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        currentMonth: false,
        appointments: []
      });
    }
    
    return days;
  };
  
  const calendarDays = generateCalendarData();
  
  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  
  const groupAppointmentsByDate = () => {
    const sortedAppointments = [...appointments].sort((a, b) => a.start - b.start);
    
    const grouped = sortedAppointments.reduce((acc, appointment) => {
      const dateStr = appointment.start.toDateString();
      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }
      acc[dateStr].push(appointment);
      return acc;
    }, {});
    
    return Object.entries(grouped).map(([dateStr, apps]) => ({
      date: new Date(dateStr),
      appointments: apps
    })).sort((a, b) => a.date - b.date);
  };
  
  const groupedAppointments = groupAppointmentsByDate();
  
  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDuration = (start, end) => {
    const durationMs = end - start;
    const minutes = Math.floor(durationMs / (1000 * 60));
    
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? 
        `${hours}h ${remainingMinutes}min` : 
        `${hours}h`;
    }
  };
  
  const renderCalendarView = () => (
    <div className={styles.calendar}>
      <div className={styles.calendarHeader}>
        {dayNames.map((day, index) => (
          <div key={index} className={styles.dayName}>{day}</div>
        ))}
      </div>
      
      <div className={styles.calendarBody}>
        {calendarDays.map((day, index) => (
          <div 
            key={index} 
            className={`${styles.calendarDay} ${!day.currentMonth ? styles.otherMonth : ''} ${day.today ? styles.today : ''} ${day.appointments.length > 0 ? styles.hasAppointments : ''}`}
          >
            <div className={styles.dayNumber}>{day.date.getDate()}</div>
            
            {day.appointments.length > 0 && (
              <div className={styles.appointments}>
                {day.appointments.map(appointment => (
                  <div 
                    key={appointment.id} 
                    className={`${styles.appointmentPill} ${styles[appointment.type]}`}
                    title={`${appointment.title} - ${formatTime(appointment.start)}`}
                  >
                    {formatTime(appointment.start)} {appointment.title}
                  </div>
                ))}
                
                {day.appointments.length > 3 && (
                  <div className={styles.appointmentCount}>
                    +{day.appointments.length - 3} rendez-vous
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
  
  const renderListView = () => (
    <div className={styles.listContainer}>
      {groupedAppointments.length > 0 ? (
        groupedAppointments.map((group, index) => (
          <div key={index} className={styles.dateGroup}>
            <div className={styles.dateHeader}>
              <span className={styles.dateValue}>
                {group.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              <span className={styles.dateDayName}>
                {group.date.toLocaleDateString('fr-FR', { weekday: 'long' })}
              </span>
            </div>
            
            <div className={styles.appointmentsList}>
              {group.appointments.map(appointment => (
                <div key={appointment.id} className={styles.appointmentItem}>
                  <div className={styles.appointmentTime}>
                    <div className={styles.timeRange}>
                      {formatTime(appointment.start)}
                    </div>
                    <div className={styles.duration}>
                      {formatDuration(appointment.start, appointment.end)}
                    </div>
                  </div>
                  
                  <div className={styles.appointmentContent}>
                    <h3 className={styles.appointmentTitle}>{appointment.title}</h3>
                    
                    <div className={styles.appointmentMeta}>
                      <div className={styles.appointmentType}>
                        <div className={`${styles.typeIndicator} ${styles[appointment.type]}`}></div>
                        {appointment.type === 'nutrition' && 'Nutrition'}
                        {appointment.type === 'medical' && 'Médical'}
                        {appointment.type === 'performance' && 'Performance'}
                        {appointment.type === 'other' && 'Autre'}
                      </div>
                      
                      <div className={styles.appointmentWith}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        {appointment.with}
                      </div>
                    </div>
                    
                    {appointment.notes && (
                      <div className={styles.appointmentNotes}>
                        {appointment.notes}
                      </div>
                    )}
                    
                    <div className={styles.appointmentLocation}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      {appointment.location}
                    </div>
                  </div>
                  
                  <div className={styles.appointmentActions}>
                    <button className={`${styles.actionButton} ${styles.editButton}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                      Modifier
                    </button>
                    
                    <button className={`${styles.actionButton} ${styles.cancelButton}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                      </svg>
                      Annuler
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className={styles.emptyState}>
          Aucun rendez-vous prévu pour cette période
        </div>
      )}
    </div>
  );
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.viewToggle}>
            <button 
              className={`${styles.viewButton} ${view === 'calendar' ? styles.active : ''}`}
              onClick={() => setView('calendar')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>Calendrier</span>
            </button>
            <button 
              className={`${styles.viewButton} ${view === 'list' ? styles.active : ''}`}
              onClick={() => setView('list')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
              <span>Liste</span>
            </button>
          </div>
          
          <div className={styles.monthSelector}>
            <button className={styles.monthArrow} onClick={prevMonth}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <div className={styles.month}>
              {currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </div>
            <button className={styles.monthArrow} onClick={nextMonth}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
        
        <button 
          className={styles.newAppointmentButton}
          onClick={() => setShowModal(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Nouveau rendez-vous
        </button>
      </div>
      
      {view === 'calendar' ? renderCalendarView() : renderListView()}
      
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Nouveau rendez-vous</h2>
              <button className={styles.closeButton} onClick={() => setShowModal(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.formRow}>
                <label className={styles.formLabel}>Titre</label>
                <input 
                  type="text" 
                  className={styles.formInput}
                  placeholder="Titre du rendez-vous"
                />
              </div>
              
              <div className={styles.formGrid}>
                <div className={styles.formRow}>
                  <label className={styles.formLabel}>Date</label>
                  <input 
                    type="date" 
                    className={styles.formInput}
                  />
                </div>
                
                <div className={styles.formRow}>
                  <label className={styles.formLabel}>Type</label>
                  <select className={styles.formSelect}>
                    <option value="nutrition">Nutrition</option>
                    <option value="medical">Médical</option>
                    <option value="performance">Performance</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
              </div>
              
              <div className={styles.formGrid}>
                <div className={styles.formRow}>
                  <label className={styles.formLabel}>Heure de début</label>
                  <input 
                    type="time" 
                    className={styles.formInput}
                  />
                </div>
                
                <div className={styles.formRow}>
                  <label className={styles.formLabel}>Heure de fin</label>
                  <input 
                    type="time" 
                    className={styles.formInput}
                  />
                </div>
              </div>
              
              <div className={styles.formRow}>
                <label className={styles.formLabel}>Avec</label>
                <input 
                  type="text" 
                  className={styles.formInput}
                  placeholder="Nom du praticien"
                />
              </div>
              
              <div className={styles.formRow}>
                <label className={styles.formLabel}>Lieu</label>
                <input 
                  type="text" 
                  className={styles.formInput}
                  placeholder="Lieu du rendez-vous"
                />
              </div>
              
              <div className={styles.formRow}>
                <label className={styles.formLabel}>Notes</label>
                <textarea 
                  className={styles.formTextarea}
                  placeholder="Notes supplémentaires (optionnel)"
                ></textarea>
              </div>
            </div>
            
            <div className={styles.modalFooter}>
              <button 
                className={styles.cancelModalButton}
                onClick={() => setShowModal(false)}
              >
                Annuler
              </button>
              <button className={styles.saveButton}>
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
