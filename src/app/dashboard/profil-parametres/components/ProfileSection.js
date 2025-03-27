'use client';

import React, { useState } from 'react';
import compStyles from '../components.module.css';
import { IoIosCamera } from 'react-icons/io';

export default function ProfileSection({ professionalData }) {
  const [editMode, setEditMode] = useState(false);

  return (
    <div className={compStyles.profileContainer}>
      <div className={compStyles.actionBar}>
        <button 
          className={compStyles.editButton}
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? 'Enregistrer les modifications' : 'Modifier le profil'}
        </button>
      </div>
      
      {/* En-tête du profil */}
      <div className={compStyles.profileHeader}>
        <div className={compStyles.profileImageContainer}>
          <img 
            src={professionalData.image} 
            alt={professionalData.name} 
            className={compStyles.profileImage} 
          />
          {editMode && (
            <div className={compStyles.profileImageOverlay}>
              <IoIosCamera className={compStyles.cameraIcon} />
              <span>Changer</span>
            </div>
          )}
        </div>
        
        <div className={compStyles.profileInfo}>
          {editMode ? (
            <input 
              type="text" 
              className={compStyles.formInput} 
              defaultValue={professionalData.name} 
            />
          ) : (
            <h2 className={compStyles.profileName}>{professionalData.name}</h2>
          )}
          
          {editMode ? (
            <input 
              type="text" 
              className={compStyles.formInput} 
              defaultValue={professionalData.specialty} 
            />
          ) : (
            <p className={compStyles.profileTitle}>{professionalData.specialty}</p>
          )}
          
          <div className={compStyles.profileStats}>
            <div className={compStyles.statItem}>
              <div className={compStyles.statValue}>{professionalData.rating}</div>
              <div className={compStyles.statLabel}>Note</div>
            </div>
            <div className={compStyles.statItem}>
              <div className={compStyles.statValue}>{professionalData.reviews}</div>
              <div className={compStyles.statLabel}>Consultations</div>
            </div>
            <div className={compStyles.statItem}>
              <div className={compStyles.statValue}>3</div>
              <div className={compStyles.statLabel}>Années d'expérience</div>
            </div>
          </div>
          
          {editMode ? (
            <textarea 
              className={compStyles.formTextarea} 
              defaultValue={professionalData.bio}
              rows={4}
            />
          ) : (
            <p className={compStyles.profileBio}>
              {professionalData.bio}
            </p>
          )}
        </div>
      </div>
      
      {/* Services */}
      <div className={compStyles.profileSection}>
        <h3 className={compStyles.sectionTitle}>Services proposés</h3>
        <div className={compStyles.servicesGrid}>
          {professionalData.services.map((service, index) => (
            <div key={index} className={compStyles.serviceCard}>
              {editMode ? (
                <>
                  <input 
                    type="text" 
                    className={compStyles.formInput} 
                    defaultValue={service.name} 
                    placeholder="Nom du service"
                  />
                  <textarea 
                    className={compStyles.formTextarea} 
                    defaultValue={service.description || service.name}
                    placeholder="Description du service"
                    rows={3}
                  />
                  <input 
                    type="text" 
                    className={compStyles.formInput} 
                    defaultValue={`${service.price} €`} 
                    placeholder="Prix"
                  />
                </>
              ) : (
                <>
                  <h4 className={compStyles.serviceTitle}>{service.name}</h4>
                  <p className={compStyles.serviceDescription}>{service.description || service.name}</p>
                  <div className={compStyles.servicePrice}>{service.price} €</div>
                </>
              )}
            </div>
          ))}
          
          {editMode && (
            <button className={compStyles.addButton}>
              + Ajouter un service
            </button>
          )}
        </div>
      </div>
      
      {/* Collaborations */}
      <div className={compStyles.profileSection}>
        <h3 className={compStyles.sectionTitle}>Collaborations & Réseaux</h3>
        <div className={compStyles.collaborationsList}>
          {professionalData.collaborations.map((collab, index) => (
            <div key={index} className={compStyles.collaborationItem}>
              {editMode ? (
                <>
                  <input 
                    type="text" 
                    className={compStyles.formInput} 
                    defaultValue={collab.specialty} 
                    style={{ width: '150px' }}
                  />
                  <div className={compStyles.collaborationDetails}>
                    <input 
                      type="text" 
                      className={compStyles.formInput} 
                      defaultValue={collab.name} 
                      placeholder="Titre"
                    />
                    <textarea 
                      className={compStyles.formTextarea} 
                      defaultValue={collab.description || collab.specialty}
                      placeholder="Description"
                      rows={2}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className={compStyles.collaborationType}>{collab.specialty}</div>
                  <div className={compStyles.collaborationDetails}>
                    <div className={compStyles.collaborationTitle}>{collab.name}</div>
                    <div className={compStyles.collaborationDesc}>{collab.description || collab.specialty}</div>
                  </div>
                </>
              )}
            </div>
          ))}
          
          {editMode && (
            <button className={compStyles.addButton}>
              + Ajouter une collaboration
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
