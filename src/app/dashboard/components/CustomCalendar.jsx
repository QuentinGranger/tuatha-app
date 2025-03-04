import React, { useState } from 'react';
import styles from './BigCalendar.module.css';
import { FaCalendarAlt, FaVideo, FaPhone, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { BsGrid1X2, BsCalendarWeek, BsCalendarDay, BsListUl } from 'react-icons/bs';
import AppointmentModal from './AppointmentModal';

// Utilitaires de date
const formatDate = (date) => {
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatTime = (date) => {
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;
  return date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear();
};

// Jours de la semaine
const getWeekDays = (date) => {
  if (!date) return [];
  
  const days = [];
  const mondayOfWeek = new Date(date);
  const day = date.getDay();
  
  // Calcule le lundi de la semaine (0 = dimanche, 1 = lundi, etc.)
  mondayOfWeek.setDate(date.getDate() - (day === 0 ? 6 : day - 1));
  
  // Génère les 7 jours
  for (let i = 0; i < 7; i++) {
    const newDate = new Date(mondayOfWeek);
    newDate.setDate(mondayOfWeek.getDate() + i);
    days.push(newDate);
  }
  
  return days;
};

// Heures de la journée
const getHoursOfDay = () => {
  const hours = [];
  for (let i = 8; i <= 19; i++) {
    hours.push(i);
  }
  return hours;
};

const CustomCalendar = ({ appointments = [], currentDate, onDateChange }) => {
  const [view, setView] = useState('week');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  
  if (!currentDate) {
    currentDate = new Date();
  }
  
  // Gestion du double-clic sur un rendez-vous
  const handleAppointmentDoubleClick = (appointment) => {
    setSelectedAppointment(appointment);
  };
  
  // Fermer le modal de détails du rendez-vous
  const closeAppointmentModal = () => {
    setSelectedAppointment(null);
  };
  
  // Filtre les rendez-vous pour la vue actuelle
  const getFilteredAppointments = () => {
    if (!appointments || appointments.length === 0) return [];
    
    if (view === 'day') {
      return appointments.filter(appt => 
        isSameDay(new Date(appt.startTime), currentDate)
      );
    } else if (view === 'week') {
      const weekDays = getWeekDays(currentDate);
      return appointments.filter(appt => {
        const apptDate = new Date(appt.startTime);
        return weekDays.some(day => isSameDay(day, apptDate));
      });
    } else {
      return appointments;
    }
  };

  // Obtenir les rendez-vous pour un jour spécifique
  const getAppointmentsForDay = (day) => {
    if (!appointments || appointments.length === 0) return [];
    
    return appointments.filter(appt => {
      if (!appt.startTime) return false;
      return isSameDay(new Date(appt.startTime), day);
    });
  };

  // Obtenir les rendez-vous pour une heure spécifique
  const getAppointmentsForHour = (day, hour) => {
    const dayAppointments = getAppointmentsForDay(day);
    if (!dayAppointments || dayAppointments.length === 0) return [];
    
    return dayAppointments.filter(appt => {
      if (!appt.startTime) return false;
      const apptDate = new Date(appt.startTime);
      return apptDate.getHours() === hour;
    });
  };

  // Calculer la position et la hauteur d'un rendez-vous
  const calculateAppointmentStyle = (startTime, endTime) => {
    const startHour = startTime.getHours();
    const startMinutes = startTime.getMinutes();
    const endHour = endTime.getHours();
    const endMinutes = endTime.getMinutes();
    
    // Calcul de la position verticale basée sur l'heure de début
    const topPercentage = (startMinutes / 60) * 100;
    
    // Calcul de la hauteur basée sur la durée
    const durationMinutes = ((endHour - startHour) * 60) + (endMinutes - startMinutes);
    const heightPercentage = (durationMinutes / 60) * 100;
    
    return {
      top: `${topPercentage}%`,
      height: `${heightPercentage}%`
    };
  };

  // Générer le contenu du calendrier en fonction de la vue
  const renderCalendarContent = () => {
    if (view === 'week') {
      return (
        <div className={styles.weekView}>
          <table className={styles.weekTable}>
            <thead>
              <tr>
                <th className={styles.timeHeader}>Heure</th>
                {getWeekDays(currentDate).map((day, idx) => (
                  <th 
                    key={idx} 
                    className={`${styles.dayHeader} ${isSameDay(day, new Date()) ? styles.currentDay : ''}`}
                  >
                    <div className={styles.dayHeaderContent}>
                      <div className={styles.dayName}>
                        {day.toLocaleDateString('fr-FR', { weekday: 'long' })}
                      </div>
                      <div className={styles.dayDate}>
                        {day.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {getHoursOfDay().map(hour => (
                <tr key={hour} className={styles.hourRow}>
                  <td className={styles.timeCell}>{hour}:00</td>
                  {getWeekDays(currentDate).map((day, dayIdx) => {
                    const isCurrentDay = isSameDay(day, new Date());
                    const hourAppointments = getAppointmentsForHour(day, hour);
                    
                    return (
                      <td 
                        key={`${hour}-${dayIdx}`} 
                        className={`${styles.dayCell} ${isCurrentDay ? styles.currentDay : ''}`}
                      >
                        {hourAppointments.map((appt, idx) => {
                          if (!appt.startTime || !appt.endTime) return null;
                          
                          const startTime = new Date(appt.startTime);
                          const endTime = new Date(appt.endTime);
                          const apptStyle = calculateAppointmentStyle(startTime, endTime);
                          
                          return (
                            <div 
                              key={`appt-${appt.id}-${idx}`}
                              className={`${styles.appointment} ${styles[appt.status] || ''}`}
                              style={apptStyle}
                              title={appt.title}
                              onDoubleClick={() => handleAppointmentDoubleClick(appt)}
                            >
                              <div className={styles.appointmentTime}>
                                {formatTime(startTime)}
                              </div>
                              <div className={styles.appointmentTitle}>
                                {appt.title}
                                {appt.type === 'virtual' && <FaVideo className={styles.appointmentIcon} />}
                                {appt.type === 'phone' && <FaPhone className={styles.appointmentIcon} />}
                              </div>
                            </div>
                          );
                        })}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (view === 'day') {
      return (
        <div className={styles.dayView}>
          <div className={styles.dayViewHeader}>
            <h3>{formatDate(currentDate)}</h3>
          </div>
          <div className={styles.dayViewBody}>
            {getHoursOfDay().map(hour => {
              const hourAppointments = getAppointmentsForHour(currentDate, hour);
              
              return (
                <div key={hour} className={styles.hourSlot}>
                  <div className={styles.hourLabel}>{hour}:00</div>
                  <div className={styles.hourContent}>
                    {hourAppointments.map((appt, idx) => {
                      if (!appt.startTime || !appt.endTime) return null;
                      
                      const startTime = new Date(appt.startTime);
                      const endTime = new Date(appt.endTime);
                      const apptStyle = calculateAppointmentStyle(startTime, endTime);
                      
                      return (
                        <div 
                          key={`day-appt-${appt.id}-${idx}`}
                          className={`${styles.appointment} ${styles[appt.status] || ''}`}
                          style={apptStyle}
                          title={appt.title}
                          onDoubleClick={() => handleAppointmentDoubleClick(appt)}
                        >
                          <div className={styles.appointmentTime}>
                            {formatTime(startTime)}
                          </div>
                          <div className={styles.appointmentTitle}>
                            {appt.title}
                            {appt.type === 'virtual' && <FaVideo className={styles.appointmentIcon} />}
                            {appt.type === 'phone' && <FaPhone className={styles.appointmentIcon} />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    } else if (view === 'agenda') {
      const filteredAppointments = getFilteredAppointments();
      return (
        <div className={styles.agendaView}>
          {filteredAppointments && filteredAppointments.length > 0 ? (
            <div className={styles.agendaDay}>
              <div className={styles.agendaDayHeader}>
                <h3>Agenda</h3>
              </div>
              <div className={styles.agendaDayContent}>
                {filteredAppointments.map((appt, idx) => (
                  <div 
                    key={`agenda-${appt.id}`} 
                    className={`${styles.agendaAppointment} ${styles[appt.status] || ''}`}
                    onDoubleClick={() => handleAppointmentDoubleClick(appt)}
                  >
                    <div className={styles.agendaTime}>
                      {formatTime(new Date(appt.startTime))}
                    </div>
                    <div className={styles.agendaAppointmentContent}>
                      <div className={styles.agendaAppointmentTitle}>
                        {appt.title}
                        {appt.type === 'virtual' && <FaVideo />}
                        {appt.type === 'phone' && <FaPhone />}
                      </div>
                      {appt.notes && (
                        <div className={styles.agendaAppointmentNotes}>
                          {appt.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.noAppointments}>
              Aucun rendez-vous sur cette période
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className={styles.calendarWrapper}>
      <div className={styles.viewToggle}>
        <button 
          className={`${styles.viewButton} ${view === 'day' ? styles.activeView : ''}`}
          onClick={() => setView('day')}
          title="Vue Jour"
        >
          <BsCalendarDay />
        </button>
        <button 
          className={`${styles.viewButton} ${view === 'week' ? styles.activeView : ''}`}
          onClick={() => setView('week')}
          title="Vue Semaine"
        >
          <BsCalendarWeek />
        </button>
        <button 
          className={`${styles.viewButton} ${view === 'agenda' ? styles.activeView : ''}`}
          onClick={() => setView('agenda')}
          title="Vue Agenda"
        >
          <BsListUl />
        </button>
      </div>
      {renderCalendarContent()}
      
      {/* Modal d'affichage détaillé du rendez-vous */}
      {selectedAppointment && (
        <AppointmentModal 
          appointment={selectedAppointment} 
          onClose={closeAppointmentModal} 
        />
      )}
    </div>
  );
};

export default CustomCalendar;
