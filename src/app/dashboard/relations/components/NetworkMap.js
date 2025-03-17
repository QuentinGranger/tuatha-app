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
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 450 });
  
  // Fonction pour ajuster la luminosité d'une couleur
  const adjustColor = (color, amount) => {
    // Simple implementation for now
    return color;
  };
  
  // Dessiner un fond subtil
  const drawBackground = (ctx, width, height) => {
    // Gradient radial pour le fond
    const gradient = ctx.createRadialGradient(width/2, height/2, 50, width/2, height/2, width * 0.8);
    gradient.addColorStop(0, 'rgba(255, 114, 28, 0.08)');
    gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.03)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.06)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Ajouter quelques cercles subtils pour la profondeur
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    
    for (let i = 1; i <= 4; i++) {
      ctx.beginPath();
      ctx.arc(width/2, height/2, width * 0.12 * i, 0, 2 * Math.PI);
      ctx.stroke();
    }
    
    // Ajout d'un léger effet de grain
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 2;
      const opacity = Math.random() * 0.05;
      
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fill();
    }
  };
  
  const drawPatient = (ctx, x, y, patient) => {
    // Aura externe
    const outerGradient = ctx.createRadialGradient(x, y, 20, x, y, 65);
    outerGradient.addColorStop(0, 'rgba(255, 114, 28, 0.3)');
    outerGradient.addColorStop(0.7, 'rgba(255, 114, 28, 0.1)');
    outerGradient.addColorStop(1, 'rgba(255, 114, 28, 0)');
    
    ctx.beginPath();
    ctx.arc(x, y, 60, 0, 2 * Math.PI);
    ctx.fillStyle = outerGradient;
    ctx.fill();
    
    // Cercle principal
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 45);
    gradient.addColorStop(0, 'rgba(255, 114, 28, 0.9)');
    gradient.addColorStop(0.7, 'rgba(255, 114, 28, 0.7)');
    gradient.addColorStop(1, 'rgba(255, 114, 28, 0.6)');
    
    ctx.beginPath();
    ctx.arc(x, y, 45, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Bordure brillante
    ctx.beginPath();
    ctx.arc(x, y, 45, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Effet de lumière
    ctx.beginPath();
    ctx.arc(x - 15, y - 15, 15, 0, 2 * Math.PI);
    const glowGradient = ctx.createRadialGradient(x - 15, y - 15, 0, x - 15, y - 15, 15);
    glowGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = glowGradient;
    ctx.fill();
    
    // Barre de séparation entre nom et prénom
    ctx.beginPath();
    ctx.moveTo(x - 20, y);
    ctx.lineTo(x + 20, y);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Texte du patient
    const firstName = patient?.firstName || patient?.user?.firstName || 'Patient';
    const lastName = patient?.lastName || patient?.user?.lastName || '';
    
    // Effet d'ombre pour le texte
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
    
    // Prénom
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(firstName, x, y - 9);
    
    // Nom
    ctx.font = '14px Arial';
    ctx.fillText(lastName, x, y + 11);
    
    // Réinitialiser les effets d'ombre
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  };
  
  const drawProfessional = (ctx, x, y, professional, isSelected, opacity = 1) => {
    const specialtyColor = SPECIALTIES_COLORS[professional.specialty] || '#999';
    
    // Appliquer l'opacité pour l'animation
    ctx.globalAlpha = opacity;
    
    // Aura externe pour le professionnel
    if (isSelected) {
      const outerGradient = ctx.createRadialGradient(x, y, 15, x, y, 50);
      outerGradient.addColorStop(0, 'rgba(255, 214, 0, 0.4)');
      outerGradient.addColorStop(0.6, 'rgba(255, 214, 0, 0.2)');
      outerGradient.addColorStop(1, 'rgba(255, 214, 0, 0)');
      
      ctx.beginPath();
      ctx.arc(x, y, 45, 0, 2 * Math.PI);
      ctx.fillStyle = outerGradient;
      ctx.fill();
    }
    
    // Cercle principal avec dégradé
    const size = isSelected ? 38 : 34;
    const circleGradient = ctx.createRadialGradient(x - size/4, y - size/4, 0, x, y, size);
    circleGradient.addColorStop(0, adjustColor(specialtyColor, 30));
    circleGradient.addColorStop(0.7, specialtyColor);
    circleGradient.addColorStop(1, adjustColor(specialtyColor, -20));
    
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fillStyle = circleGradient;
    ctx.fill();
    
    // Effet de verre avec un cercle semi-transparent
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    const glassGradient = ctx.createLinearGradient(x - size, y - size, x + size, y + size);
    glassGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
    glassGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
    glassGradient.addColorStop(1, 'rgba(0, 0, 0, 0.05)');
    ctx.fillStyle = glassGradient;
    ctx.fill();
    
    // Bordure
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.strokeStyle = isSelected ? 'rgba(255, 214, 0, 0.8)' : 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = isSelected ? 3 : 1.5;
    ctx.stroke();
    
    // Reflet
    ctx.beginPath();
    ctx.arc(x - size/3, y - size/3, size/3, 0, 2 * Math.PI);
    const reflectionGradient = ctx.createRadialGradient(
      x - size/3, y - size/3, 0,
      x - size/3, y - size/3, size/2
    );
    reflectionGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    reflectionGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = reflectionGradient;
    ctx.fill();
    
    // Effet d'ombre pour le texte
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
    
    // Texte du professionnel
    ctx.fillStyle = 'white';
    ctx.font = isSelected ? 'bold 14px Arial' : '13px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Vérifier que professional.user existe
    if (professional.user) {
      const firstName = professional.user.firstName || '';
      const lastName = professional.user.lastName || '';
      
      // Barre de séparation entre nom et prénom
      if (firstName && lastName) {
        ctx.beginPath();
        ctx.moveTo(x - 15, y);
        ctx.lineTo(x + 15, y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      
      // Afficher le nom
      ctx.fillText(firstName, x, y - 8);
      ctx.fillText(lastName, x, y + 10);
    } else {
      // Fallback si pas de données utilisateur
      ctx.fillText("Professionnel", x, y);
    }
    
    // Réinitialiser les effets
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  };
  
  const drawConnection = (ctx, startX, startY, endX, endY, professional) => {
    const specialty = professional.specialty || 'DOCTOR';
    const specialtyColor = SPECIALTIES_COLORS[specialty] || '#4169E1';
    
    // Ligne principale avec dégradé
    const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
    gradient.addColorStop(0, 'rgba(255, 114, 28, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 114, 28, 0.4)');
    gradient.addColorStop(1, specialtyColor + 'CC'); // CC = 80% opacité
    
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Effet de brillance sur la ligne
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Petits cercles pour représenter l'échange de données
    const numDots = 3;
    for (let i = 1; i <= numDots; i++) {
      const t = i / (numDots + 1);
      const x = startX + (endX - startX) * t;
      const y = startY + (endY - startY) * t;
      
      // Effet de lueur autour des points
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      const dotGlow = ctx.createRadialGradient(x, y, 0, x, y, 6);
      dotGlow.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
      dotGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = dotGlow;
      ctx.fill();
      
      // Point central
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fill();
      
      // Bordure du point
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  };
  
  // Gestion du redimensionnement
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const container = canvasRef.current.parentElement;
        if (container) {
          const width = container.clientWidth;
          // Adapter la hauteur en fonction de la largeur pour maintenir un ratio
          const height = Math.min(width * 0.75, 450);
          setCanvasSize({ width, height });
        }
      }
    };
    
    // Initialisation
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  useEffect(() => {
    if (!canvasRef.current || !patient) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Définir la taille du canvas
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    
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
          selectedProfessional && selectedProfessional.id === professional.id,
          1.0
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
          if (distance <= 34) {
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
  }, [patient, professionals, selectedProfessional, onSelectProfessional, canvasSize]);
  
  if (!patient) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.pulseAnimation}>
          <svg width="60" height="60" viewBox="0 0 24 24">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 3.553l6 2.667v4.267c0 4.033-2.8 7.827-6 8.96-3.2-1.133-6-4.927-6-8.96V7.22l6-2.667z"/>
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
