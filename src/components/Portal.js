'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Portal component to render children outside the DOM hierarchy
 * @param {Object} props
 * @param {ReactNode} props.children - Content to render in the portal
 * @param {string} props.container - DOM selector for the portal container
 */
export default function Portal({ children, container = 'body' }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return mounted
    ? createPortal(children, document.querySelector(container) || document.body)
    : null;
}
