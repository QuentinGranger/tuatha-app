import React from 'react';
import styles from './Breadcrumb.module.css';
import { MdChevronRight } from 'react-icons/md';

// Ex: [{label: 'Dashboard', href: '/'}, {label: 'Facturation', href: '/dashboard/facturation'}]
export default function Breadcrumb({ items = [] }) {
  return (
    <nav className={styles.breadcrumbContainer} aria-label="Fil d'Ariane">
      <ol className={styles.breadcrumbList}>
        {items.map((item, idx) => (
          <li key={item.href || item.label} className={styles.breadcrumbItem}>
            {item.href && idx !== items.length - 1 ? (
              <a href={item.href} className={styles.breadcrumbLink}>{item.label}</a>
            ) : (
              <span className={styles.breadcrumbCurrent}>{item.label}</span>
            )}
            {idx < items.length - 1 && (
              <MdChevronRight className={styles.breadcrumbSeparator} />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
