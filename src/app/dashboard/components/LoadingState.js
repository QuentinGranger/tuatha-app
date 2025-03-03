'use client';

import React from 'react';
import { BiLoaderAlt } from 'react-icons/bi';
import styles from './LoadingState.module.css';

/**
 * Composant d'état de chargement à afficher pendant le chargement des données
 */
const LoadingState = ({ message = "Chargement..." }) => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingIcon}>
        <BiLoaderAlt size={32} />
      </div>
      <p className={styles.loadingMessage}>{message}</p>
    </div>
  );
};

export default LoadingState;
