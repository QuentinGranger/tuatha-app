'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './ProfessionalDetail.module.css';
import { 
  FaUserMd, FaHands, FaDumbbell, FaAppleAlt, 
  FaCarrot, FaBrain, FaUserPlus, FaInfoCircle, 
  FaBriefcase, FaAddressCard, FaEnvelope,
  FaPhoneAlt, FaBuilding, FaMapMarkerAlt, FaGlobe, FaCalendarAlt,
  FaExternalLinkAlt, FaComments, FaHistory, FaShareAlt, FaClipboardList,
  FaClock, FaStar, FaChartLine, FaStethoscope
} from 'react-icons/fa';

// Mapping des spécialités pour l'affichage en français
const SPECIALTIES = {
  DOCTOR: { label: 'Médecin', icon: <FaUserMd />, color: '#4285F4' },
  PHYSIOTHERAPIST: { label: 'Kinésithérapeute', icon: <FaHands />, color: '#34A853' },
  PHYSICAL_TRAINER: { label: 'Coach sportif', icon: <FaDumbbell />, color: '#FF6F00' },
  NUTRITIONIST: { label: 'Nutritionniste', icon: <FaAppleAlt />, color: '#EA4335' },
  DIETITIAN: { label: 'Diététicien(ne)', icon: <FaCarrot />, color: '#8BC34A' },
  PSYCHOLOGIST: { label: 'Psychologue', icon: <FaBrain />, color: '#AA00FF' }
};

const ProfessionalDetail = ({ professional }) => {
  const [activeTab, setActiveTab] = useState('info');
  const [animateIn, setAnimateIn] = useState(false);
  const [hoveredContact, setHoveredContact] = useState(null);
  
  // Animation d'entrée lors du changement de professionnel
  useEffect(() => {
    setAnimateIn(false);
    
    const timer = setTimeout(() => {
      setAnimateIn(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, [professional]);
  
  if (!professional) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyStateIcon}>
          <FaStethoscope size={50} />
        </div>
        <h3 className={styles.emptyStateTitle}>Aucun professionnel sélectionné</h3>
        <p className={styles.emptyStateText}>
          Sélectionnez un professionnel dans la liste pour voir ses informations détaillées
        </p>
      </div>
    );
  }

  // Format du téléphone: +33 6 12 34 56 78
  const formatPhone = (phone) => {
    if (!phone) return 'Non renseigné';
    return phone.replace(/(\+\d{2})(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5 $6');
  };

  // Récupérer les informations de spécialité
  const specialtyInfo = SPECIALTIES[professional.specialty] || { 
    label: professional.specialty || 'Non spécifié', 
    icon: <FaUserPlus />, 
    color: '#9E9E9E' 
  };

  // Vérifier si professional.user existe
  const user = professional.user || {};
  const firstName = user.firstName || '';
  const lastName = user.lastName || '';
  const email = user.email || 'email@exemple.com';
  const phone = user.phoneNumber || '';
  const photoUrl = user.photoUrl || '';
  
  // Définir les différentes sections disponibles
  const tabs = [
    { id: 'info', label: 'Informations', icon: <FaInfoCircle /> },
    { id: 'history', label: 'Historique', icon: <FaHistory /> },
    { id: 'collab', label: 'Collaboration', icon: <FaShareAlt /> }
  ];

  return (
    <div className={`${styles.container} ${animateIn ? styles.animateIn : styles.animateOut}`}>
      <div className={styles.header}>
        <div className={styles.headerBackground} style={{ 
          background: `linear-gradient(135deg, ${specialtyInfo.color}22, ${specialtyInfo.color}11)` 
        }}></div>
        
        <div 
          className={styles.professionalImage} 
          style={{ borderColor: specialtyInfo.color }}
        >
          {photoUrl ? (
            <div className={styles.imageContainer}>
              <Image 
                src={photoUrl} 
                alt={`${firstName} ${lastName}`} 
                width={100}
                height={100}
                className={styles.profileImage}
              />
            </div>
          ) : (
            <div 
              className={styles.iconPlaceholder} 
              style={{ 
                background: `linear-gradient(135deg, ${specialtyInfo.color}40, ${specialtyInfo.color}20)`,
                boxShadow: `0 5px 20px ${specialtyInfo.color}33` 
              }}
            >
              <span style={{ color: specialtyInfo.color }}>
                {specialtyInfo.icon}
              </span>
            </div>
          )}
          
          <div className={styles.statusIndicator} title="Actif">
            <span className={styles.statusDot}></span>
          </div>
        </div>
        
        <div className={styles.headerInfo}>
          <h1 className={styles.name}>
            {firstName || 'Prénom'} {lastName || 'Nom'}
          </h1>
          
          <div 
            className={styles.specialty} 
            style={{ color: specialtyInfo.color }}
          >
            <span className={styles.specialtyIcon}>
              {specialtyInfo.icon}
            </span>
            <span className={styles.specialtyText}>
              {specialtyInfo.label}
              {professional.subSpecialty && (
                <span className={styles.subSpecialty}> • {professional.subSpecialty}</span>
              )}
            </span>
          </div>
          
          {professional.organization && (
            <div className={styles.organization}>
              <FaBuilding className={styles.organizationIcon} />
              {professional.organization}
            </div>
          )}
          
          <div className={styles.quickContactButtons}>
            {email && (
              <a href={`mailto:${email}`} className={styles.quickContactButton} title="Envoyer un email">
                <FaEnvelope />
              </a>
            )}
            {phone && (
              <a href={`tel:${phone}`} className={styles.quickContactButton} title="Appeler">
                <FaPhoneAlt />
              </a>
            )}
            <button className={`${styles.quickContactButton} ${styles.messageButton}`} title="Message interne">
              <FaComments />
            </button>
          </div>
        </div>
      </div>
      
      <div className={styles.tabsContainer}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tabButton} ${activeTab === tab.id ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            <span className={styles.tabLabel}>{tab.label}</span>
            {activeTab === tab.id && <span className={styles.activeIndicator}></span>}
          </button>
        ))}
      </div>
      
      <div className={styles.content}>
        {activeTab === 'info' && (
          <>
            {professional.description && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  <FaInfoCircle className={styles.sectionIcon} /> 
                  <span>À propos</span>
                </h3>
                <p className={styles.description}>{professional.description}</p>
              </div>
            )}
            
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                <FaBriefcase className={styles.sectionIcon} /> 
                <span>Informations professionnelles</span>
              </h3>
              
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Spécialité</span>
                  <span className={styles.infoValue} style={{ color: specialtyInfo.color }}>
                    {specialtyInfo.icon} {specialtyInfo.label}
                  </span>
                </div>
                
                {professional.subSpecialty && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Sous-spécialité</span>
                    <span className={styles.infoValue}>{professional.subSpecialty}</span>
                  </div>
                )}
                
                {professional.yearsExperience && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Expérience</span>
                    <span className={styles.infoValue}>
                      <FaChartLine className={styles.infoIcon} />
                      {professional.yearsExperience} ans
                    </span>
                  </div>
                )}
                
                {professional.availability && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Disponibilité</span>
                    <span className={styles.infoValue}>
                      <FaCalendarAlt className={styles.infoIcon} /> 
                      {professional.availability}
                    </span>
                  </div>
                )}
                
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Dernière consultation</span>
                  <span className={styles.infoValue}>
                    <FaClock className={styles.infoIcon} /> 
                    {professional.lastConsultation || 'Il y a 2 semaines'}
                  </span>
                </div>
                
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Évaluation</span>
                  <span className={styles.infoValue}>
                    <div className={styles.ratingStars}>
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={i < (professional.rating || 4) ? styles.starFilled : styles.starEmpty} 
                        />
                      ))}
                    </div>
                  </span>
                </div>
              </div>
            </div>
            
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                <FaAddressCard className={styles.sectionIcon} /> 
                <span>Contact</span>
              </h3>
              
              <div className={styles.infoGrid}>
                <div 
                  className={`${styles.contactItem} ${hoveredContact === 'email' ? styles.hovered : ''}`}
                  onMouseEnter={() => setHoveredContact('email')}
                  onMouseLeave={() => setHoveredContact(null)}
                >
                  <span className={styles.infoLabel}>Email</span>
                  <div className={styles.contactValue}>
                    <FaEnvelope className={styles.contactIcon} style={{ color: '#EA4335' }} /> 
                    <a href={`mailto:${email}`} className={styles.contactLink}>{email}</a>
                  </div>
                </div>
                
                <div 
                  className={`${styles.contactItem} ${hoveredContact === 'phone' ? styles.hovered : ''}`}
                  onMouseEnter={() => setHoveredContact('phone')}
                  onMouseLeave={() => setHoveredContact(null)}
                >
                  <span className={styles.infoLabel}>Téléphone</span>
                  <div className={styles.contactValue}>
                    <FaPhoneAlt className={styles.contactIcon} style={{ color: '#34A853' }} /> 
                    <a href={`tel:${phone}`} className={styles.contactLink}>{formatPhone(phone)}</a>
                  </div>
                </div>
                
                {professional.organization && (
                  <div className={styles.contactItem}>
                    <span className={styles.infoLabel}>Organisation</span>
                    <div className={styles.contactValue}>
                      <FaBuilding className={styles.contactIcon} style={{ color: '#4285F4' }} /> 
                      {professional.organization}
                    </div>
                  </div>
                )}
                
                {professional.address && (
                  <div className={styles.contactItem}>
                    <span className={styles.infoLabel}>Adresse</span>
                    <div className={styles.contactValue}>
                      <FaMapMarkerAlt className={styles.contactIcon} style={{ color: '#FBBC05' }} /> 
                      {professional.address}
                    </div>
                  </div>
                )}
                
                {professional.website && (
                  <div 
                    className={`${styles.contactItem} ${hoveredContact === 'website' ? styles.hovered : ''}`}
                    onMouseEnter={() => setHoveredContact('website')}
                    onMouseLeave={() => setHoveredContact(null)}
                  >
                    <span className={styles.infoLabel}>Site web</span>
                    <div className={styles.contactValue}>
                      <FaGlobe className={styles.contactIcon} style={{ color: '#AA00FF' }} />
                      <a href={professional.website} target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                        {professional.website}
                        <FaExternalLinkAlt className={styles.externalLinkIcon} />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'history' && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <FaHistory className={styles.sectionIcon} /> 
              <span>Historique des interactions</span>
            </h3>
            
            <div className={styles.timelineContainer}>
              <div className={styles.timeline}>
                <div className={styles.timelineItem}>
                  <div className={styles.timelineDate}>
                    <span className={styles.timelineDay}>15</span>
                    <span className={styles.timelineMonth}>Mar</span>
                  </div>
                  <div className={styles.timelineDot} style={{ backgroundColor: '#34A853' }}></div>
                  <div className={styles.timelineContent}>
                    <h4 className={styles.timelineTitle}>Consultation</h4>
                    <p className={styles.timelineText}>
                      Consultation sur le bilan nutritionnel mensuel
                    </p>
                    <div className={styles.timelineMeta}>
                      <span className={styles.timelineTime}>
                        <FaClock /> 10:30
                      </span>
                      <span className={styles.timelineDuration}>
                        <FaClipboardList /> 45 min
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.timelineItem}>
                  <div className={styles.timelineDate}>
                    <span className={styles.timelineDay}>28</span>
                    <span className={styles.timelineMonth}>Fév</span>
                  </div>
                  <div className={styles.timelineDot} style={{ backgroundColor: '#4285F4' }}></div>
                  <div className={styles.timelineContent}>
                    <h4 className={styles.timelineTitle}>Échange de messages</h4>
                    <p className={styles.timelineText}>
                      Échange concernant les résultats d'analyse
                    </p>
                    <div className={styles.timelineMeta}>
                      <span className={styles.timelineTime}>
                        <FaComments /> 16:45
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.timelineItem}>
                  <div className={styles.timelineDate}>
                    <span className={styles.timelineDay}>14</span>
                    <span className={styles.timelineMonth}>Fév</span>
                  </div>
                  <div className={styles.timelineDot} style={{ backgroundColor: '#EA4335' }}></div>
                  <div className={styles.timelineContent}>
                    <h4 className={styles.timelineTitle}>Consultation initiale</h4>
                    <p className={styles.timelineText}>
                      Première consultation et établissement du plan nutritionnel
                    </p>
                    <div className={styles.timelineMeta}>
                      <span className={styles.timelineTime}>
                        <FaClock /> 14:00
                      </span>
                      <span className={styles.timelineDuration}>
                        <FaClipboardList /> 60 min
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'collab' && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <FaShareAlt className={styles.sectionIcon} /> 
              <span>Collaboration</span>
            </h3>
            
            <div className={styles.collabContent}>
              <div className={styles.collabItem}>
                <h4 className={styles.collabTitle}>Partage de données</h4>
                <div className={styles.collabDescription}>
                  <p>Définissez les données que vous souhaitez partager avec ce professionnel.</p>
                </div>
                
                <div className={styles.dataPermissions}>
                  <div className={styles.permissionItem}>
                    <label className={styles.permissionLabel}>
                      <input type="checkbox" checked className={styles.permissionCheckbox} />
                      <span className={styles.checkboxCustom}></span>
                      <span>Données nutritionnelles</span>
                    </label>
                  </div>
                  
                  <div className={styles.permissionItem}>
                    <label className={styles.permissionLabel}>
                      <input type="checkbox" checked className={styles.permissionCheckbox} />
                      <span className={styles.checkboxCustom}></span>
                      <span>Bilans médicaux</span>
                    </label>
                  </div>
                  
                  <div className={styles.permissionItem}>
                    <label className={styles.permissionLabel}>
                      <input type="checkbox" className={styles.permissionCheckbox} />
                      <span className={styles.checkboxCustom}></span>
                      <span>Journal d'activité physique</span>
                    </label>
                  </div>
                  
                  <div className={styles.permissionItem}>
                    <label className={styles.permissionLabel}>
                      <input type="checkbox" className={styles.permissionCheckbox} />
                      <span className={styles.checkboxCustom}></span>
                      <span>Journal alimentaire</span>
                    </label>
                  </div>
                </div>
                
                <button className={styles.updatePermissionsButton}>
                  Mettre à jour les permissions
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className={styles.actions}>
        <button className={`${styles.actionButton} ${styles.primaryAction}`}>
          <FaComments /> Message
        </button>
        <button className={styles.actionButton}>
          <FaCalendarAlt /> Rendez-vous
        </button>
      </div>
    </div>
  );
};

export default ProfessionalDetail;
