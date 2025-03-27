'use client';

import React from 'react';
import Modal, { ModalButton } from './Modal';
import { IoMdTrash, IoMdClose } from 'react-icons/io';
import styles from './Modal.module.css';

const DeleteConfirmation = ({ isOpen, onClose, onConfirm, entryDate, loading }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Supprimer les données de performance"
      footer={
        <>
          <ModalButton variant="cancel" onClick={onClose}>
            <IoMdClose /> Annuler
          </ModalButton>
          <ModalButton variant="danger" onClick={onConfirm} disabled={loading}>
            <IoMdTrash /> {loading ? 'Suppression...' : 'Supprimer'}
          </ModalButton>
        </>
      }
    >
      <div className={styles.confirmationContent}>
        <div className={styles.iconContainer}>
          <IoMdTrash size={48} color="#EF4444" />
        </div>
        <p className={styles.confirmationText}>
          Êtes-vous sûr de vouloir supprimer les données de performance du <strong>{entryDate}</strong> ?
        </p>
        <p className={styles.warningText}>
          Cette action est irréversible et toutes les données associées seront définitivement perdues.
        </p>
      </div>
    </Modal>
  );
};

export default DeleteConfirmation;
