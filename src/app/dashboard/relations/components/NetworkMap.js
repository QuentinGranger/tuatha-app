'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './NetworkMap.module.css';

const SPECIALTIES_COLORS = {
  DOCTOR: '#4169E1', // Bleu roi
  PHYSIOTHERAPIST: '#32CD32', // Vert lime
  PHYSICAL_TRAINER: '#FF8C00', // Orange foncé
  NUTRITIONIST: '#8A2BE2', // Violet bleu
  DIETITIAN: '#20B2AA' // Vert d'eau
};

const SPECIALTIES_NAMES = {
  DOCTOR: 'Médecin',
  PHYSIOTHERAPIST: 'Kinésithérapeute',
  PHYSICAL_TRAINER: 'Entraîneur Sportif',
  NUTRITIONIST: 'Nutritionniste',
  DIETITIAN: 'Diététicien'
};

const NetworkMap = ({ professionals, patient, selectedProfessional, onSelectProfessional }) => {
  const canvasRef = useRef(null);
  const [isInitialRender, setIsInitialRender] = useState(true);
  
  useEffect(() => {
    if (!canvasRef.current || !patient) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Définir une taille fixe plus grande pour le canvas
    canvas.width = 600;
    canvas.height = 450;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.7;
    
    // Effacer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dessiner un fond subtil
    drawBackground(ctx, canvas.width, canvas.height);
    
    // Dessiner le patient et les professionnels immédiatement sans animation
    drawPatient(ctx, centerX, centerY, patient);
    
    if (professionals && professionals.length > 0) {
      professionals.forEach((professional, index) => {
        const angle = index * (2 * Math.PI) / professionals.length;
        const targetX = centerX + radius * Math.cos(angle);
        const targetY = centerY + radius * Math.sin(angle);
        
        // Dessiner la connexion entre le patient et le professionnel
        drawConnection(ctx, centerX, centerY, targetX, targetY, professional);
        
        // Dessiner le professionnel
        drawProfessional(
          ctx, 
          targetX, 
          targetY, 
          professional, 
          1.0, 
          selectedProfessional && selectedProfessional.id === professional.id
        );
      });
    }
    
    // Gestion des clics sur le canvas
    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // Vérifier si un professionnel a été cliqué
      if (professionals && professionals.length > 0) {
        for (let i = 0; i < professionals.length; i++) {
          const angle = i * (2 * Math.PI) / professionals.length;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          
          // Distance entre le clic et le centre du professionnel
          const distance = Math.sqrt(Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2));
          
          // Si le clic est dans le cercle du professionnel
          if (distance <= 32) {
            if (onSelectProfessional) {
              onSelectProfessional(professionals[i]);
            }
            break;
          }
        }
      }
    };
    
    canvas.addEventListener('click', handleClick);
    
    return () => {
      canvas.removeEventListener('click', handleClick);
    };
  }, [patient, professionals, selectedProfessional, onSelectProfessional]);
  
  // Fonction pour animer l'entrée des professionnels
  const animateEntrance = (ctx, startX, startY, targetX, targetY, professional, index, selectedProfessional) => {
    let progress = 0;
    const duration = 600 + index * 100; // Décalage de temps pour chaque professionnel
    
    const animate = () => {
      progress += 16; // ~60fps
      const ratio = Math.min(progress / duration, 1);
      // Fonction d'easing pour une animation plus fluide
      const easedRatio = 1 - Math.pow(1 - ratio, 3);
      
      const currentX = startX + (targetX - startX) * easedRatio;
      const currentY = startY + (targetY - startY) * easedRatio;
      
      // Dessiner la connexion si on est au-delà de 40% de l'animation
      if (ratio > 0.4) {
        drawConnection(ctx, startX, startY, currentX, currentY, professional);
      }
      
      // Dessiner le professionnel à sa position actuelle
      if (ratio > 0.2) {
        drawProfessional(ctx, currentX, currentY, professional, 
                         selectedProfessional && professional.id === selectedProfessional.id, 
                         Math.min((ratio - 0.2) / 0.8, 1));
      }
      
      if (ratio < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  };
  
  // Dessiner un fond subtil
  const drawBackground = (ctx, width, height) => {
    // Gradient radial pour le fond
    const gradient = ctx.createRadialGradient(width/2, height/2, 50, width/2, height/2, width * 0.8);
    gradient.addColorStop(0, 'rgba(255, 114, 28, 0.03)');
    gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.01)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.03)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Ajouter quelques cercles subtils pour la profondeur
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.arc(width/2, height/2, width * 0.15 * i, 0, 2 * Math.PI);
      ctx.stroke();
    }
  };
  
  const drawPatient = (ctx, x, y, patient) => {
    // Aura autour du patient
    const gradient = ctx.createRadialGradient(x, y, 20, x, y, 60);
    gradient.addColorStop(0, 'rgba(255, 114, 28, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 114, 28, 0)');
    
    ctx.beginPath();
    ctx.arc(x, y, 55, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Dessiner un cercle pour le patient
    ctx.beginPath();
    ctx.arc(x, y, 45, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(255, 114, 28, 0.7)';
    ctx.fill();
    
    // Bordure brillante
    ctx.beginPath();
    ctx.arc(x, y, 45, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255, 114, 28, 0.9)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Ajouter un effet de lueur/brillance
    ctx.beginPath();
    ctx.arc(x - 15, y - 15, 10, 0, 2 * Math.PI);
    const glowGradient = ctx.createRadialGradient(x - 15, y - 15, 1, x - 15, y - 15, 10);
    glowGradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
    glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = glowGradient;
    ctx.fill();
    
    // Ajouter le nom du patient
    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const firstName = patient?.firstName || patient?.user?.firstName || 'Patient';
    const lastName = patient?.lastName || patient?.user?.lastName || '';
    
    ctx.fillText(firstName, x, y - 8);
    ctx.fillText(lastName, x, y + 10);
  };
  
  const drawProfessional = (ctx, x, y, professional, isSelected, opacity = 1) => {
    const specialtyColor = SPECIALTIES_COLORS[professional.specialty] || '#999';
    
    // Appliquer l'opacité pour l'animation
    ctx.globalAlpha = opacity;
    
    // Aura autour du professionnel si sélectionné
    if (isSelected) {
      const gradient = ctx.createRadialGradient(x, y, 15, x, y, 45);
      gradient.addColorStop(0, 'rgba(255, 214, 0, 0.3)');
      gradient.addColorStop(1, 'rgba(255, 214, 0, 0)');
      
      ctx.beginPath();
      ctx.arc(x, y, 43, 0, 2 * Math.PI);
      ctx.fillStyle = gradient;
      ctx.fill();
    }
    
    // Créer un gradient pour le fond du cercle
    const circleGradient = ctx.createRadialGradient(x, y, 5, x, y, 35);
    circleGradient.addColorStop(0, specialtyColor);
    circleGradient.addColorStop(1, adjustColor(specialtyColor, -30));
    
    // Dessiner un cercle pour le professionnel
    ctx.beginPath();
    ctx.arc(x, y, isSelected ? 36 : 32, 0, 2 * Math.PI);
    ctx.fillStyle = circleGradient;
    ctx.fill();
    
    // Bordure
    ctx.beginPath();
    ctx.arc(x, y, isSelected ? 36 : 32, 0, 2 * Math.PI);
    ctx.strokeStyle = isSelected ? '#FFD700' : specialtyColor;
    ctx.lineWidth = isSelected ? 3 : 2;
    ctx.stroke();
    
    // Ajouter un effet de brillance
    ctx.beginPath();
    ctx.arc(x - 10, y - 10, 8, 0, 2 * Math.PI);
    const glowGradient = ctx.createRadialGradient(x - 10, y - 10, 1, x - 10, y - 10, 8);
    glowGradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
    glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = glowGradient;
    ctx.fill();
    
    // Ajouter le nom du professionnel
    ctx.fillStyle = 'white';
    ctx.font = isSelected ? 'bold 13px Arial' : '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Vérifier que professional.user existe
    if (professional.user) {
      const firstName = professional.user.firstName || '';
      const lastName = professional.user.lastName || '';
      
      // Afficher le nom
      ctx.fillText(firstName, x, y - 5);
      ctx.fillText(lastName, x, y + 10);
    } else {
      // Fallback si pas de données utilisateur
      ctx.fillText("Professionnel", x, y);
    }
    
    // Restaurer l'opacité
    ctx.globalAlpha = 1;
  };
  
  const drawConnection = (ctx, startX, startY, endX, endY, professional) => {
    const specialty = professional.specialty || 'DOCTOR';
    const specialtyColor = SPECIALTIES_COLORS[specialty] || '#4169E1';
    
    // Dessiner la ligne avec un effet de dégradé
    const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
    gradient.addColorStop(0, 'rgba(255, 114, 28, 0.6)');
    gradient.addColorStop(1, specialtyColor + '99'); // 99 ajoute 60% d'opacité
    
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Ajouter un effet de brillance sur la ligne
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Petits cercles pour représenter l'échange de données
    const numDots = 3;
    for (let i = 1; i <= numDots; i++) {
      const t = i / (numDots + 1);
      const x = startX + (endX - startX) * t;
      const y = startY + (endY - startY) * t;
      
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fill();
    }
  };
  
  // Fonction pour ajuster la luminosité d'une couleur
  const adjustColor = (color, amount) => {
    return color; // Fonction simplifiée pour l'instant
  };
  
  if (!patient) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.pulseAnimation}>
          <svg width="60" height="60" viewBox="0 0 24 24">
            <path fill="rgba(255,255,255,0.5)" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 3.553l6 2.667v4.267c0 4.033-2.8 7.827-6 8.96-3.2-1.133-6-4.927-6-8.96V7.22l6-2.667z"/>
          </svg>
        </div>
        <p>Sélectionnez un patient pour voir son réseau de santé</p>
      </div>
    );
  }
  
  return (
    <div className={styles.networkMap}>
      <h2 className={styles.title}>Réseau de Santé</h2>
      <div className={styles.canvasContainer}>
        <canvas ref={canvasRef} className={styles.canvas}></canvas>
      </div>
      <div className={styles.legend}>
        {Object.entries(SPECIALTIES_NAMES).map(([specialty, name]) => (
          <div key={specialty} className={styles.legendItem}>
            <span 
              className={styles.colorSquare} 
              style={{ backgroundColor: SPECIALTIES_COLORS[specialty] }}
            ></span>
            <span>{name}</span>
          </div>
        ))}
      </div>
      <p className={styles.mapHelp}>Cliquez sur un professionnel pour voir ses détails</p>
    </div>
  );
};

export default NetworkMap;
