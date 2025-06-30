'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './signup.module.css';

export default function SignupPage() {
  const router = useRouter();
  
  const handleProfileSelection = (profileType) => {
    if (profileType === 'athlete') {
      // Redirection vers l'application athlète
      console.log('Profil athlète sélectionné');
      router.push('/athlete-signup');
    } else if (profileType === 'medecin') {
      // Continuer l'onboarding médecin
      console.log('Profil médecin sélectionné');
      router.push('/medecin-signup');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Choisissez votre profil</h1>
      <p className={styles.subtitle}>Sélectionnez le type de compte qui vous correspond</p>
      
      <div className={styles.profileOptions}>
        <div 
          className={styles.profileCard} 
          onClick={() => handleProfileSelection('athlete')}
        >
          <Image
            src="/img/Onboarding/Athlete.png"
            alt="Profil Athlète"
            width={450}
            height={650}
            className={styles.profileImage}
            priority
          />
          <div className={styles.overlay}>
            <h2 className={styles.profileTitle}>Athlète</h2>
            <p className={styles.profileDescription}>
              Accédez à vos programmes, suivez vos performances et communiquez avec vos professionnels de santé
            </p>
            <button className={styles.selectButton}>Choisir ce profil</button>
          </div>
        </div>
        
        <div 
          className={styles.profileCard} 
          onClick={() => handleProfileSelection('medecin')}
        >
          <Image
            src="/img/Onboarding/Medecin.png"
            alt="Profil Médecin"
            width={450}
            height={650}
            className={styles.profileImage}
            priority
          />
          <div className={styles.overlay}>
            <h2 className={styles.profileTitle}>Professionnel de santé</h2>
            <p className={styles.profileDescription}>
              Gérez vos patients, créez des programmes personnalisés et optimisez votre pratique professionnelle
            </p>
            <button className={styles.selectButton}>Choisir ce profil</button>
          </div>
        </div>
      </div>
      
      <div className={styles.loginLink}>
        <span>Vous avez déjà un compte ? </span>
        <Link href="/">Connectez-vous</Link>
      </div>
    </div>
  );
}
