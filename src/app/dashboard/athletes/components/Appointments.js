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
                        <i className="fas fa-user"></i>
                        {appointment.with}
                      </div>
                    </div>
                    
                    {appointment.notes && (
                      <div className={styles.appointmentNotes}>
                        {appointment.notes}
                      </div>
                    )}
                    
                    <div className={styles.appointmentLocation}>
                      <i className="fas fa-map-marker-alt"></i>
                      {appointment.location}
                    </div>
                  </div>
                  
                  <div className={styles.appointmentActions}>
                    <button className={`${styles.actionButton} ${styles.editButton}`}>
                      <i className="fas fa-edit"></i>
                      Modifier
                    </button>
                    
                    <button className={`${styles.actionButton} ${styles.cancelButton}`}>
                      <i className="fas fa-times"></i>
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
              <i className="fas fa-calendar-alt"></i>
              Calendrier
            </button>
            <button 
              className={`${styles.viewButton} ${view === 'list' ? styles.active : ''}`}
              onClick={() => setView('list')}
            >
              <i className="fas fa-list"></i>
              Liste
            </button>
          </div>
          
          <div className={styles.monthSelector}>
            <button className={styles.monthArrow} onClick={prevMonth}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <div className={styles.month}>
              {currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </div>
            <button className={styles.monthArrow} onClick={nextMonth}>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
        
        <button 
          className={styles.newAppointmentButton}
          onClick={() => setShowModal(true)}
        >
          <i className="fas fa-plus"></i>
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
                <i className="fas fa-times"></i>
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
