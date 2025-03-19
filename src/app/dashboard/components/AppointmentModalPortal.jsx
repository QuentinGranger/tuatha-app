import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import AppointmentModal from './AppointmentModal';

/**
 * Composant qui utilise un Portal React pour rendre le modal de rendez-vous
 * en dehors de la hiérarchie DOM normale, ce qui évite les problèmes de z-index
 * et de débordement
 */
const AppointmentModalPortal = ({ appointment, onClose, onCreate, onUpdate, isCreateMode = false }) => {
  // Utiliser un portail React pour s'assurer que la modale apparaît en haut de la hiérarchie du DOM
  return typeof window !== 'undefined' 
    ? createPortal(
        <AppointmentModal
          appointment={appointment}
          onClose={onClose}
          onCreate={onCreate}
          onUpdate={onUpdate}
          isCreateMode={isCreateMode}
        />,
        document.body
      ) 
    : null;
};

export default AppointmentModalPortal;
