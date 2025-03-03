'use client';

import React from 'react';
import Link from 'next/link';
import { FiAlertCircle } from 'react-icons/fi';
import styles from './EmptyState.module.css';

/**
 * Composant d'état vide à afficher lorsqu'aucune donnée n'est disponible
 */
const EmptyState = ({
  title = "Aucune donnée disponible",
  description = "Il n'y a pas de données à afficher pour le moment.",
  actionText,
  actionUrl,
  icon: Icon = FiAlertCircle
}) => {
  return (
    <div className={styles.emptyStateContainer}>
      <div className={styles.emptyStateIcon}>
        <Icon size={48} />
      </div>
      <h3 className={styles.emptyStateTitle}>{title}</h3>
      <p className={styles.emptyStateDescription}>{description}</p>
      
      {actionText && actionUrl && (
        <Link href={actionUrl} className={styles.emptyStateAction}>
          {actionText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
