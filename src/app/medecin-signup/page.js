'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './signup.module.css';

export default function MedecinSignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    photo: null,
    nom: '',
    prenom: '',
    email: '',
    confirmationEmail: '',
    telephone: '',
    specialite: '',
    numeroProfessionnel: '',
    verification: null,
    motDePasse: '',
    confirmationMotDePasse: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Clé localStorage pour la persistance du formulaire
  const FORM_STORAGE_KEY = 'medecin-signup-form';

  // Charger les données depuis localStorage au mount
  useEffect(() => {
    const savedData = localStorage.getItem(FORM_STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(prevData => ({
          ...prevData,
          ...parsedData,
          // Ne pas restaurer les fichiers depuis localStorage (photo et verification restent null)
          photo: null,
          verification: null
        }));
      } catch (error) {
        console.error('Erreur lors du chargement des données sauvegardées:', error);
      }
    }
  }, []);

  // Sauvegarder les données dans localStorage à chaque changement
  useEffect(() => {
    // Créer une copie sans les fichiers pour la sauvegarde
    const dataToSave = {
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      confirmationEmail: formData.confirmationEmail,
      telephone: formData.telephone,
      specialite: formData.specialite,
      numeroProfessionnel: formData.numeroProfessionnel,
      motDePasse: formData.motDePasse,
      confirmationMotDePasse: formData.confirmationMotDePasse
    };
    
    // Sauvegarder seulement si au moins un champ est rempli
    const hasData = Object.values(dataToSave).some(value => value && value.trim && value.trim() !== '');
    if (hasData) {
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(dataToSave));
    }
  }, [formData]);

  const specialites = [
    { value: '', label: 'Sélectionnez votre spécialité' },
    { value: 'medecin', label: 'Médecin' },
    { value: 'coach', label: 'Coach sportif' },
    { value: 'kinesitherapeute', label: 'Kinésithérapeute' },
    { value: 'nutritionniste', label: 'Nutritionniste/Diététicien' }
  ];

  // Fonction pour obtenir les infos du numéro professionnel selon la spécialité
  const getProfessionalNumberInfo = () => {
    switch (formData.specialite) {
      case 'medecin':
        return {
          label: 'Numéro RPPS (Répertoire Partagé des Professionnels de Santé) *',
          placeholder: 'Ex: 10003012345',
          helpText: 'Numéro RPPS à 11 chiffres'
        };
      case 'kinesitherapeute':
        return {
          label: 'Numéro ADELI ou RPPS *',
          placeholder: 'Ex: 120001234567 ou 10003012345',
          helpText: 'Numéro ADELI (12 chiffres) ou RPPS (11 chiffres)'
        };
      case 'nutritionniste':
        return {
          label: 'Numéro ADELI ou SIRET *',
          placeholder: 'Ex: 120001234567',
          helpText: 'Numéro ADELI pour diététiciens ou SIRET pour nutritionnistes'
        };
      case 'coach':
        return {
          label: 'Numéro de carte professionnelle ou certification *',
          placeholder: 'Ex: CQP12345 ou BP-JEPS',
          helpText: 'Numéro de carte professionnelle ou certification reconnue'
        };
      default:
        return null;
    }
  };

  const professionalInfo = getProfessionalNumberInfo();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    
    // Formatage spécial pour le téléphone
    if (name === 'telephone') {
      // Retirer tous les caractères non numériques
      const digitsOnly = value.replace(/\D/g, '');
      
      // Limiter à 10 chiffres
      const limitedDigits = digitsOnly.slice(0, 10);
      
      // Appliquer le format XX XX XX XX XX
      if (limitedDigits.length >= 6) {
        processedValue = limitedDigits.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{0,2})/, '$1 $2 $3 $4 $5').trim();
      } else if (limitedDigits.length >= 4) {
        processedValue = limitedDigits.replace(/(\d{2})(\d{2})(\d{0,2})/, '$1 $2 $3').trim();
      } else if (limitedDigits.length >= 2) {
        processedValue = limitedDigits.replace(/(\d{2})(\d{0,2})/, '$1 $2').trim();
      } else {
        processedValue = limitedDigits;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Effacer l'erreur quand l'utilisateur tape
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [fieldName]: file
      }));

      // Prévisualisation pour la photo
      if (fieldName === 'photo') {
        const reader = new FileReader();
        reader.onload = (e) => setPhotoPreview(e.target.result);
        reader.readAsDataURL(file);
      }

      // Effacer l'erreur
      if (errors[fieldName]) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: ''
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est requis';
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
    if (!formData.confirmationEmail.trim()) newErrors.confirmationEmail = 'La confirmation de l\'email est requise';
    if (formData.email !== formData.confirmationEmail) newErrors.confirmationEmail = 'Les emails ne correspondent pas';
    
    // Validation du format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    if (!formData.telephone.trim()) newErrors.telephone = 'Le téléphone est requis';
    if (!formData.specialite) newErrors.specialite = 'La spécialité est requise';
    if (professionalInfo && !formData.numeroProfessionnel.trim()) newErrors.numeroProfessionnel = 'Le numéro professionnel est requis';
    if (!formData.motDePasse) newErrors.motDePasse = 'Le mot de passe est requis';
    if (formData.motDePasse.length < 6) newErrors.motDePasse = 'Le mot de passe doit contenir au moins 6 caractères';
    if (formData.motDePasse !== formData.confirmationMotDePasse) {
      newErrors.confirmationMotDePasse = 'Les mots de passe ne correspondent pas';
    }
    if (!formData.photo) newErrors.photo = 'Une photo de profil est requise';
    if (!formData.verification) newErrors.verification = 'Un document de vérification est requis';

    // Validation du téléphone (format français avec espaces)
    const phoneRegex = /^0[1-9]( \d{2}){4}$/;
    if (formData.telephone && !phoneRegex.test(formData.telephone)) {
      newErrors.telephone = 'Format de téléphone invalide (ex: 06 12 34 56 78)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Mapper les champs français vers les champs anglais attendus par l'API
      const dataToSend = {
        firstName: formData.prenom,
        lastName: formData.nom,
        email: formData.email,
        password: formData.motDePasse,
        phoneNumber: formData.telephone,
        specialty: formData.specialite,
        licenseNumber: formData.numeroProfessionnel,
        bio: '', // Bio vide pour l'instant
        photoUrl: formData.photo ? URL.createObjectURL(formData.photo) : null,
        verificationDocumentUrl: formData.verification ? URL.createObjectURL(formData.verification) : null
      };

      const response = await fetch('/api/health-professional/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (response.ok) {
        // Nettoyer le localStorage après une soumission réussie
        localStorage.removeItem(FORM_STORAGE_KEY);
        
        // Redirection vers la page de configuration des services
        router.push('/medecin-config-services');
      } else {
        console.error('Erreur lors de l\'inscription:', result.error);
        alert(result.error || 'Erreur lors de l\'inscription');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'inscription');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonction pour vider le formulaire
  const clearForm = () => {
    setFormData({
      photo: null,
      nom: '',
      prenom: '',
      email: '',
      confirmationEmail: '',
      telephone: '',
      specialite: '',
      numeroProfessionnel: '',
      verification: null,
      motDePasse: '',
      confirmationMotDePasse: ''
    });
    setPhotoPreview(null);
    setErrors({});
    localStorage.removeItem(FORM_STORAGE_KEY);
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.header}>
          <h1 className={styles.title}>Inscription Professionnel</h1>
          <p className={styles.subtitle}>Créez votre compte professionnel de santé</p>
        </div>

        {/* Photo de profil */}
        <div className={styles.photoSection}>
          <label className={styles.photoLabel}>
            <div className={styles.photoContainer}>
              {photoPreview ? (
                <img src={photoPreview} alt="Aperçu" className={styles.photoPreview} />
              ) : (
                <div className={styles.photoPlaceholder}>
                  <i className="fas fa-camera"></i>
                  <span>Photo de profil</span>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'photo')}
              className={styles.fileInput}
            />
          </label>
          {errors.photo && <span className={styles.error}>{errors.photo}</span>}
        </div>

        {/* Informations personnelles */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="nom">Nom *</label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleInputChange}
              className={errors.nom ? styles.inputError : styles.input}
              placeholder="Votre nom"
            />
            {errors.nom && <span className={styles.error}>{errors.nom}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="prenom">Prénom *</label>
            <input
              type="text"
              id="prenom"
              name="prenom"
              value={formData.prenom}
              onChange={handleInputChange}
              className={errors.prenom ? styles.inputError : styles.input}
              placeholder="Votre prénom"
            />
            {errors.prenom && <span className={styles.error}>{errors.prenom}</span>}
          </div>
        </div>

        {/* Email */}
        <div className={styles.formGroup}>
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={errors.email ? styles.inputError : styles.input}
            placeholder="Votre email"
          />
          {errors.email && <span className={styles.error}>{errors.email}</span>}
        </div>

        {/* Confirmation Email */}
        <div className={styles.formGroup}>
          <label htmlFor="confirmationEmail">Confirmer l'email *</label>
          <input
            type="email"
            id="confirmationEmail"
            name="confirmationEmail"
            value={formData.confirmationEmail}
            onChange={handleInputChange}
            className={errors.confirmationEmail ? styles.inputError : styles.input}
            placeholder="Confirmez votre email"
          />
          {errors.confirmationEmail && <span className={styles.error}>{errors.confirmationEmail}</span>}
        </div>

        {/* Téléphone */}
        <div className={styles.formGroup}>
          <label htmlFor="telephone">Téléphone *</label>
          <input
            type="tel"
            id="telephone"
            name="telephone"
            value={formData.telephone}
            onChange={handleInputChange}
            className={errors.telephone ? styles.inputError : styles.input}
            placeholder="Ex: 06 12 34 56 78"
          />
          {errors.telephone && <span className={styles.error}>{errors.telephone}</span>}
        </div>

        {/* Spécialité */}
        <div className={styles.formGroup}>
          <label htmlFor="specialite">Spécialité *</label>
          <select
            id="specialite"
            name="specialite"
            value={formData.specialite}
            onChange={handleInputChange}
            className={errors.specialite ? styles.selectError : styles.select}
          >
            {specialites.map(spec => (
              <option key={spec.value} value={spec.value}>
                {spec.label}
              </option>
            ))}
          </select>
          {errors.specialite && <span className={styles.error}>{errors.specialite}</span>}
        </div>

        {/* Numéro professionnel */}
        {professionalInfo && (
          <div className={styles.formGroup}>
            <label htmlFor="numeroProfessionnel">{professionalInfo.label}</label>
            <input
              type="text"
              id="numeroProfessionnel"
              name="numeroProfessionnel"
              value={formData.numeroProfessionnel}
              onChange={handleInputChange}
              className={errors.numeroProfessionnel ? styles.inputError : styles.input}
              placeholder={professionalInfo.placeholder}
            />
            <small className={styles.helpText}>{professionalInfo.helpText}</small>
            {errors.numeroProfessionnel && <span className={styles.error}>{errors.numeroProfessionnel}</span>}
          </div>
        )}

        {/* Document de vérification */}
        <div className={styles.formGroup}>
          <label htmlFor="verification">Document de vérification *</label>
          <div className={styles.fileUpload}>
            <input
              type="file"
              id="verification"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileChange(e, 'verification')}
              className={styles.fileInput}
            />
            <label htmlFor="verification" className={styles.fileUploadLabel}>
              <i className="fas fa-upload"></i>
              {formData.verification ? formData.verification.name : 'Choisir un fichier'}
            </label>
          </div>
          <small className={styles.fileHelp}>
            Diplôme, certificat ou document prouvant votre qualité professionnelle
          </small>
          {errors.verification && <span className={styles.error}>{errors.verification}</span>}
        </div>

        {/* Mots de passe */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="motDePasse">Mot de passe *</label>
            <input
              type="password"
              id="motDePasse"
              name="motDePasse"
              value={formData.motDePasse}
              onChange={handleInputChange}
              className={errors.motDePasse ? styles.inputError : styles.input}
              placeholder="Minimum 6 caractères"
            />
            {errors.motDePasse && <span className={styles.error}>{errors.motDePasse}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmationMotDePasse">Confirmer le mot de passe *</label>
            <input
              type="password"
              id="confirmationMotDePasse"
              name="confirmationMotDePasse"
              value={formData.confirmationMotDePasse}
              onChange={handleInputChange}
              className={errors.confirmationMotDePasse ? styles.inputError : styles.input}
              placeholder="Confirmez votre mot de passe"
            />
            {errors.confirmationMotDePasse && <span className={styles.error}>{errors.confirmationMotDePasse}</span>}
          </div>
        </div>

        {/* Erreur de soumission */}
        {errors.submit && (
          <div className={styles.submitError}>
            {errors.submit}
          </div>
        )}

        {/* Bouton de soumission */}
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              Création en cours...
            </>
          ) : (
            <>
              <i className="fas fa-arrow-right"></i>
              Continuer
            </>
          )}
        </button>

        {/* Bouton pour vider le formulaire */}
        <button 
          type="button" 
          className={styles.clearButton}
          onClick={clearForm}
        >
          <i className="fas fa-trash-alt"></i>
          Vider le formulaire
        </button>

        {/* Lien de connexion */}
        <div className={styles.loginLink}>
          Déjà inscrit ? <a href="/">Connectez-vous</a>
        </div>
      </form>
    </div>
  );
}
