'use client';

import React from 'react';
import Image from 'next/image';
import styles from './ProfessionalDetail.module.css';
import { 
  FaUserMd, FaHands, FaDumbbell, FaAppleAlt, 
  FaCarrot, FaBrain, FaUserPlus, FaInfoCircle, 
  FaBriefcase, FaAddressCard, FaEnvelope,
  FaPhoneAlt, FaBuilding, FaMapMarkerAlt, FaGlobe, FaCalendarAlt
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
  if (!professional) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyStateIcon}>
          <FaUserMd size={40} />
        </div>
        <p className={styles.emptyStateText}>Sélectionnez un professionnel pour voir ses détails</p>
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div 
          className={styles.professionalImage} 
          style={{ borderColor: specialtyInfo.color }}
        >
          {photoUrl ? (
            <div className={styles.imageContainer}>
              <Image 
                src={photoUrl} 
                alt={`${firstName} ${lastName}`} 
                width={90}
                height={90}
                style={{ objectFit: 'cover', borderRadius: '50%' }}
              />
            </div>
          ) : (
            <div className={styles.iconPlaceholder} style={{ backgroundColor: `${specialtyInfo.color}20` }}>
              <span style={{ color: specialtyInfo.color, fontSize: '2rem' }}>
                {specialtyInfo.icon}
              </span>
            </div>
          )}
        </div>
        
        <div className={styles.headerInfo}>
          <h1 className={styles.name}>
            {firstName || 'Prénom'} {lastName || 'Nom'}
          </h1>
          <div className={styles.specialty} style={{ color: specialtyInfo.color }}>
            <span className={styles.specialtyIcon}>
              {specialtyInfo.icon}
            </span>
            {specialtyInfo.label}
            {professional.subSpecialty && (
              <span className={styles.subSpecialty}> • {professional.subSpecialty}</span>
            )}
          </div>
          {professional.organization && (
            <div className={styles.organization}>
              <FaBuilding style={{ marginRight: '5px' }} />
              {professional.organization}
            </div>
          )}
        </div>
      </div>
      
      <div className={styles.content}>
        {professional.description && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <FaInfoCircle style={{ marginRight: '8px' }} /> À propos
            </h3>
            <p className={styles.description}>{professional.description}</p>
          </div>
        )}
        
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <FaBriefcase style={{ marginRight: '8px' }} /> Informations professionnelles
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
                <span className={styles.infoValue}>{professional.yearsExperience} ans</span>
              </div>
            )}
            
            {professional.availability && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Disponibilité</span>
                <span className={styles.infoValue}>
                  <FaCalendarAlt style={{ marginRight: '5px' }} /> {professional.availability}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <FaAddressCard style={{ marginRight: '8px' }} /> Contact
          </h3>
          
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Email</span>
              <span className={styles.infoValue}>
                <FaEnvelope style={{ marginRight: '5px' }} /> 
                <a href={`mailto:${email}`} className={styles.contactLink}>{email}</a>
              </span>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Téléphone</span>
              <span className={styles.infoValue}>
                <FaPhoneAlt style={{ marginRight: '5px' }} /> 
                <a href={`tel:${phone}`} className={styles.contactLink}>{formatPhone(phone)}</a>
              </span>
            </div>
            
            {professional.organization && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Organisation</span>
                <span className={styles.infoValue}>
                  <FaBuilding style={{ marginRight: '5px' }} /> {professional.organization}
                </span>
              </div>
            )}
            
            {professional.address && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Adresse</span>
                <span className={styles.infoValue}>
                  <FaMapMarkerAlt style={{ marginRight: '5px' }} /> {professional.address}
                </span>
              </div>
            )}
            
            {professional.website && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Site web</span>
                <span className={styles.infoValue}>
                  <FaGlobe style={{ marginRight: '5px' }} />
                  <a href={professional.website} target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                    {professional.website}
                  </a>
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Vous pouvez ajouter plus de sections ici selon les besoins */}
      </div>
    </div>
  );
};

export default ProfessionalDetail;
