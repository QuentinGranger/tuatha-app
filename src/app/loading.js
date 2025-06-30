'use client';

import styles from './loading.module.css';

export default function Loading() {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingCard}>
        <div className={styles.spinner}>
          <div className={styles.spinnerOuter}></div>
          <div className={styles.spinnerMiddle}></div>
          <div className={styles.spinnerInner}></div>
        </div>
        <h2 className={styles.title}>Chargement</h2>
        <p className={styles.message}>Veuillez patienter...</p>
      </div>
    </div>
  );
}
