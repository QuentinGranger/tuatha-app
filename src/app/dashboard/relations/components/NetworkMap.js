'use client';

import React from 'react';
import styles from '../page.module.css';

export default function NetworkMap() {
  return (
    <div className={styles.networkMap}>
      <h3>Réseau de professionnels</h3>
      <div className={styles.networkPlaceholder}>
        <p>Visualisation du réseau des professionnels de santé</p>
        <div className={styles.networkVisualization}>
          <div className={styles.centralNode}>Patient</div>
          <div className={styles.connectedNodes}>
            <div className={styles.node}>Nutritionniste</div>
            <div className={styles.node}>Médecin</div>
            <div className={styles.node}>Kinésithérapeute</div>
          </div>
        </div>
      </div>
    </div>
  );
}
