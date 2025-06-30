'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './config-services.module.css';

export default function MedecinConfigServices() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // État pour les services sélectionnés
  const [selectedServices, setSelectedServices] = useState({
    consultation: false,
    telemedecine: false,
    urgencesSportives: false,
    rehabilitation: false
  });
  
  // États pour les disponibilités
  const [availabilities, setAvailabilities] = useState([
    { id: 1, day: 'Lundi', startTime: '09:00', endTime: '18:00' }
  ]);
  
  // État pour les outils externes
  const [selectedTools, setSelectedTools] = useState({
    calendly: false,
    outlook: false,
    googleCalendar: false,
    appleCalendar: false
  });
  
  // État pour l'adresse du cabinet
  const [officeAddress, setOfficeAddress] = useState('');
  
  // Gérer le changement de sélection des services
  const handleServiceChange = (service) => {
    setSelectedServices(prev => ({
      ...prev,
      [service]: !prev[service]
    }));
  };
  
  // Gérer le changement des disponibilités
  const handleAvailabilityChange = (id, field, value) => {
    setAvailabilities(prev => 
      prev.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };
  
  // Ajouter une nouvelle plage de disponibilité
  const addAvailability = () => {
    const newId = availabilities.length > 0 
      ? Math.max(...availabilities.map(a => a.id)) + 1 
      : 1;
    
    setAvailabilities(prev => [
      ...prev, 
      { id: newId, day: 'Lundi', startTime: '09:00', endTime: '18:00' }
    ]);
  };
  
  // Gérer le changement d'outils externes
  const handleToolChange = (tool) => {
    setSelectedTools(prev => ({
      ...prev,
      [tool]: !prev[tool]
    }));
  };
  
  // Gérer le changement d'adresse
  const handleAddressChange = (e) => {
    setOfficeAddress(e.target.value);
  };
  
  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Ici, nous simulerons l'envoi des données à l'API
      // Dans une implémentation réelle, vous enverriez ces données au backend
      
      // Simuler un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirection vers le dashboard après configuration
      router.push('/dashboard');
    } catch (error) {
      console.error('Erreur lors de la configuration:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h1 className={styles.title}>Configuration des Services</h1>
      <p className={styles.subtitle}>Configurez les services que vous proposez à vos patients</p>
      
      {/* Section des services */}
      <div className={styles.servicesSection}>
        <div className={styles.servicesContainer}>
          <div className={styles.serviceCard}>
            <input 
              type="checkbox" 
              id="consultation"
              checked={selectedServices.consultation}
              onChange={() => handleServiceChange('consultation')}
            />
            <label htmlFor="consultation">
              <div className={styles.serviceIcon}>
                <Image
                  src="/img/services/consultation.svg"
                  alt="Consultation Physique"
                  width={80}
                  height={80}
                />
              </div>
              <span className={styles.serviceName}>Consultation Physique</span>
            </label>
          </div>
          
          <div className={styles.serviceCard}>
            <input 
              type="checkbox" 
              id="telemedecine"
              checked={selectedServices.telemedecine}
              onChange={() => handleServiceChange('telemedecine')}
            />
            <label htmlFor="telemedecine">
              <div className={styles.serviceIcon}>
                <Image
                  src="/img/services/telemedecine.svg"
                  alt="Télémédecine"
                  width={80}
                  height={80}
                />
              </div>
              <span className={styles.serviceName}>Télémédecine</span>
            </label>
          </div>
          
          <div className={styles.serviceCard}>
            <input 
              type="checkbox" 
              id="urgencesSportives"
              checked={selectedServices.urgencesSportives}
              onChange={() => handleServiceChange('urgencesSportives')}
            />
            <label htmlFor="urgencesSportives">
              <div className={styles.serviceIcon}>
                <Image
                  src="/img/services/urgences.svg"
                  alt="Urgences sportives"
                  width={80}
                  height={80}
                />
              </div>
              <span className={styles.serviceName}>Urgences sportives</span>
            </label>
          </div>
          
          <div className={styles.serviceCard}>
            <input 
              type="checkbox" 
              id="rehabilitation"
              checked={selectedServices.rehabilitation}
              onChange={() => handleServiceChange('rehabilitation')}
            />
            <label htmlFor="rehabilitation">
              <div className={styles.serviceIcon}>
                <Image
                  src="/img/services/rehabilitation.svg"
                  alt="Programmes de réhabilitation"
                  width={80}
                  height={80}
                />
              </div>
              <span className={styles.serviceName}>Programmes de réhabilitation</span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Section des horaires de disponibilité */}
      <h2 className={styles.title}>Configurer les jours et horaires de disponibilité</h2>
      <div className={styles.availabilitySection}>
        {availabilities.map((availability) => (
          <div key={availability.id} className={styles.availabilityContainer}>
            <div className={styles.availabilityRow}>
              <span className={styles.availabilityText}>Je suis disponible du</span>
              <select 
                className={styles.timeInput}
                value={availability.day}
                onChange={(e) => handleAvailabilityChange(availability.id, 'day', e.target.value)}
              >
                <option value="Lundi">Lundi</option>
                <option value="Mardi">Mardi</option>
                <option value="Mercredi">Mercredi</option>
                <option value="Jeudi">Jeudi</option>
                <option value="Vendredi">Vendredi</option>
                <option value="Samedi">Samedi</option>
                <option value="Dimanche">Dimanche</option>
              </select>
              <span className={styles.availabilityText}>au</span>
              <select 
                className={styles.timeInput}
                value={availability.day}
                onChange={(e) => handleAvailabilityChange(availability.id, 'day', e.target.value)}
              >
                <option value="Lundi">Lundi</option>
                <option value="Mardi">Mardi</option>
                <option value="Mercredi">Mercredi</option>
                <option value="Jeudi">Jeudi</option>
                <option value="Vendredi">Vendredi</option>
                <option value="Samedi">Samedi</option>
                <option value="Dimanche">Dimanche</option>
              </select>
            </div>
            <div className={styles.availabilityRow}>
              <span className={styles.availabilityText}>de</span>
              <input 
                type="time" 
                className={styles.timeInput}
                value={availability.startTime}
                onChange={(e) => handleAvailabilityChange(availability.id, 'startTime', e.target.value)}
              />
              <span className={styles.availabilityText}>à</span>
              <input 
                type="time" 
                className={styles.timeInput}
                value={availability.endTime}
                onChange={(e) => handleAvailabilityChange(availability.id, 'endTime', e.target.value)}
              />
            </div>
          </div>
        ))}
        <button 
          type="button" 
          className={styles.addDateButton}
          onClick={addAvailability}
        >
          + Ajouter une autre date
        </button>
      </div>
      
      {/* Section des intégrations externes */}
      <h2 className={styles.title}>Synchronisation avec des outils externes</h2>
      <div className={styles.externalToolsSection}>
        <div className={styles.toolsContainer}>
          <div 
            className={styles.toolCard}
            onClick={() => handleToolChange('calendly')}
            style={selectedTools.calendly ? { borderColor: 'rgba(255, 136, 0, 0.6)' } : {}}
          >
            <div className={styles.toolIcon}>
              <Image
                src="/img/tools/calendly.svg"
                alt="Calendly"
                width={60}
                height={60}
              />
            </div>
            <span className={styles.toolName}>Calendly</span>
          </div>
          
          <div 
            className={styles.toolCard}
            onClick={() => handleToolChange('outlook')}
            style={selectedTools.outlook ? { borderColor: 'rgba(255, 136, 0, 0.6)' } : {}}
          >
            <div className={styles.toolIcon}>
              <Image
                src="/img/tools/outlook.svg"
                alt="Outlook"
                width={60}
                height={60}
              />
            </div>
            <span className={styles.toolName}>Outlook</span>
          </div>
          
          <div 
            className={styles.toolCard}
            onClick={() => handleToolChange('googleCalendar')}
            style={selectedTools.googleCalendar ? { borderColor: 'rgba(255, 136, 0, 0.6)' } : {}}
          >
            <div className={styles.toolIcon}>
              <Image
                src="/img/tools/google-calendar.svg"
                alt="Google Calendar"
                width={60}
                height={60}
              />
            </div>
            <span className={styles.toolName}>Google Calendar</span>
          </div>
          
          <div 
            className={styles.toolCard}
            onClick={() => handleToolChange('appleCalendar')}
            style={selectedTools.appleCalendar ? { borderColor: 'rgba(255, 136, 0, 0.6)' } : {}}
          >
            <div className={styles.toolIcon}>
              <Image
                src="/img/tools/apple-calendar.svg"
                alt="Apple Calendar"
                width={60}
                height={60}
              />
            </div>
            <span className={styles.toolName}>Apple Calendar</span>
          </div>
        </div>
      </div>
      
      {/* Section de l'adresse */}
      <h2 className={styles.title}>Adresse du cabinet</h2>
      <div className={styles.addressSection}>
        <div className={styles.addressRow}>
          <span className={styles.availabilityText}>Retrouvez-moi à l'adresse suivante : </span>
          <input 
            type="text" 
            className={styles.addressInput}
            value={officeAddress}
            onChange={handleAddressChange}
            placeholder="Votre adresse de cabinet ou clinique"
          />
        </div>
      </div>
      
      {/* Boutons */}
      <div className={styles.buttonGroup}>
        <button 
          type="submit" 
          className={styles.continueButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Configuration en cours...' : 'Terminer la configuration'}
        </button>
        <Link href="/medecin-signup" className={styles.backButton}>
          Retour
        </Link>
      </div>
    </form>
  );
}
