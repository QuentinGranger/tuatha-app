'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './NetworkMap.module.css';
import { FaUserCircle, FaUserMd, FaNetworkWired, FaHands, FaAppleAlt, FaInfoCircle } from 'react-icons/fa';

export default function NetworkMap({ patient, professionals }) {
  const canvasRef = useRef(null);
  const [canvasContext, setCanvasContext] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [animationFrame, setAnimationFrame] = useState(null);

  // Map des couleurs par spécialité
  const specialtyColors = {
    'NUTRITIONIST': '#EA4335',
    'PHYSIOTHERAPIST': '#34A853',
    'PSYCHOLOGIST': '#AA00FF',
    'DOCTOR': '#4285F4',
    'GENERAL': '#9E9E9E',
    'RADIOLOGIST': '#00BCD4',
    'PEDIATRICIAN': '#FBBC05',
    'PHYSICAL_TRAINER': '#FF6F00',
    'DIETITIAN': '#8BC34A'
  };

  // Map des icônes par spécialité
  const specialtyIcons = {
    'NUTRITIONIST': <FaAppleAlt />,
    'PHYSIOTHERAPIST': <FaHands />,
    'DOCTOR': <FaUserMd />,
    'DEFAULT': <FaUserCircle />
  };

  // Map des labels en français
  const specialtyLabels = {
    'NUTRITIONIST': 'Nutritionniste',
    'PHYSIOTHERAPIST': 'Kinésithérapeute',
    'PSYCHOLOGIST': 'Psychologue',
    'DOCTOR': 'Médecin',
    'GENERAL': 'Généraliste',
    'RADIOLOGIST': 'Radiologue',
    'PEDIATRICIAN': 'Pédiatre',
    'PHYSICAL_TRAINER': 'Préparateur physique',
    'DIETITIAN': 'Diététicien'
  };

  // Initialisation du canvas et du contexte
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Ajuster la taille du canvas à son conteneur
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    setCanvasContext(ctx);
    
    // Nettoyer l'animation à la destruction du composant
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [canvasRef]);

  // Dessiner le réseau lorsque le contexte est prêt et que les pros changent
  useEffect(() => {
    if (!canvasContext || !professionals) return;
    
    // Animation
    let animationStartTime = null;
    const animationDuration = 1000; // 1 seconde
    
    const animate = (timestamp) => {
      if (!animationStartTime) animationStartTime = timestamp;
      const elapsedTime = timestamp - animationStartTime;
      const progress = Math.min(elapsedTime / animationDuration, 1);
      
      drawNetwork(progress);
      
      if (progress < 1) {
        setAnimationFrame(requestAnimationFrame(animate));
      }
    };
    
    setAnimationFrame(requestAnimationFrame(animate));
    
  }, [canvasContext, professionals]);

  // Fonction pour dessiner le réseau
  const drawNetwork = (progress = 1) => {
    if (!canvasContext || !canvasRef.current) return;
    
    const ctx = canvasContext;
    const canvas = canvasRef.current;
    
    // Effacer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Centre du canvas
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Dessiner le nœud central (patient)
    const patientRadius = 40 * progress;
    
    // Dégradé pour le nœud du patient
    const patientGradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, patientRadius
    );
    patientGradient.addColorStop(0, 'rgba(255, 136, 0, 0.8)');
    patientGradient.addColorStop(1, 'rgba(255, 88, 0, 0.6)');
    
    // Cercle du patient avec effet de lueur
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, patientRadius, 0, Math.PI * 2);
    ctx.fillStyle = patientGradient;
    ctx.shadowColor = 'rgba(255, 136, 0, 0.6)';
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.restore();
    
    // Dessiner le texte "Patient" au centre
    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Patient', centerX, centerY);
    
    // Si pas de professionnels, ne pas continuer
    if (!professionals || professionals.length === 0) {
      return;
    }
    
    // Dessiner les nœuds des professionnels autour
    const radius = Math.min(canvas.width, canvas.height) * 0.3; // Rayon du cercle où placer les nœuds
    const proCount = professionals.length;
    
    professionals.forEach((pro, index) => {
      // Calculer la position angulaire
      const angle = (index / proCount) * Math.PI * 2;
      const x = centerX + radius * Math.cos(angle) * progress;
      const y = centerY + radius * Math.sin(angle) * progress;
      
      // Couleur basée sur la spécialité
      const color = specialtyColors[pro.specialty] || '#9E9E9E';
      
      // Dessiner la connexion entre patient et professionnel
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * progress})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Dessiner le nœud du professionnel
      const proRadius = 30 * progress;
      
      // Dégradé pour le nœud du professionnel
      const proGradient = ctx.createRadialGradient(
        x, y, 0,
        x, y, proRadius
      );
      proGradient.addColorStop(0, color);
      proGradient.addColorStop(1, `${color}99`);
      
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, proRadius, 0, Math.PI * 2);
      ctx.fillStyle = proGradient;
      ctx.shadowColor = `${color}80`;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.restore();
      
      // Dessiner le texte du professionnel
      const specialty = specialtyLabels[pro.specialty] || pro.specialty;
      ctx.font = 'bold 12px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(specialty, x, y);
      
      // Nom du professionnel en dessous
      if (pro.user) {
        ctx.font = '11px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillText(`${pro.user.firstName} ${pro.user.lastName}`, x, y + proRadius + 15);
      }
    });
  };

  // Fonction pour gérer le survol du canvas
  const handleMouseMove = (e) => {
    if (!canvasRef.current || !professionals) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Centre du canvas
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const patientRadius = 40;
    
    // Vérifier si la souris est sur le patient
    const distanceToPatient = Math.sqrt(
      Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)
    );
    
    if (distanceToPatient <= patientRadius) {
      setHoveredNode({ type: 'patient', name: 'Patient' });
      return;
    }
    
    // Vérifier si la souris est sur un professionnel
    const radius = Math.min(canvas.width, canvas.height) * 0.3;
    const proCount = professionals.length;
    
    for (let i = 0; i < proCount; i++) {
      const angle = (i / proCount) * Math.PI * 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      const proRadius = 30;
      
      const distanceToPro = Math.sqrt(
        Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2)
      );
      
      if (distanceToPro <= proRadius) {
        const pro = professionals[i];
        setHoveredNode({
          type: 'professional',
          specialty: specialtyLabels[pro.specialty] || pro.specialty,
          name: pro.user ? `${pro.user.firstName} ${pro.user.lastName}` : 'Professionnel',
        });
        return;
      }
    }
    
    setHoveredNode(null);
  };

  // Si aucun professionnel n'est disponible
  if (!professionals || professionals.length === 0) {
    return (
      <div className={styles.networkMap}>
        <h3 className={styles.title}>
          <FaNetworkWired className={styles.titleIcon} />
          Réseau de professionnels
        </h3>
        <div className={styles.emptyState}>
          <div className={styles.pulseAnimation}>
            <FaNetworkWired />
          </div>
          <p>Aucun professionnel de santé n'est associé à ce patient pour le moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.networkMap}>
      <h3 className={styles.title}>
        <FaNetworkWired className={styles.titleIcon} />
        Réseau de professionnels
      </h3>
      
      <div className={styles.canvasContainer}>
        <canvas 
          ref={canvasRef} 
          className={styles.canvas}
          onMouseMove={handleMouseMove}
        />
        
        {hoveredNode && (
          <div className={styles.nodeTooltip} style={{
            left: canvasRef.current ? canvasRef.current.width / 2 : '50%',
            top: '10px'
          }}>
            <div className={styles.tooltipIcon}>
              {hoveredNode.type === 'patient' ? <FaUserCircle /> : <FaUserMd />}
            </div>
            <div className={styles.tooltipContent}>
              <div className={styles.tooltipName}>{hoveredNode.name}</div>
              {hoveredNode.type === 'professional' && (
                <div className={styles.tooltipSpecialty}>{hoveredNode.specialty}</div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={styles.colorSquare} style={{ backgroundColor: '#FF8800' }}></div>
          <span>Patient</span>
        </div>
        
        {professionals.map((pro, index) => (
          <div key={index} className={styles.legendItem}>
            <div 
              className={styles.colorSquare} 
              style={{ backgroundColor: specialtyColors[pro.specialty] || '#9E9E9E' }}
            ></div>
            <span>{specialtyLabels[pro.specialty] || pro.specialty}</span>
          </div>
        ))}
      </div>
      
      <div className={styles.mapHelp}>
        <FaInfoCircle style={{ marginRight: '5px' }} />
        Survolez les nœuds pour plus d'informations
      </div>
    </div>
  );
}
