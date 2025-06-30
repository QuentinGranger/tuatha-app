'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './athlete.module.css';

export default function AthleteSignupPage() {
  const router = useRouter();
  
  // Cette page serait normalement un formulaire complet d'inscription athlète
  // Pour l'instant, c'est juste une page de démonstration

  return (
    <div className={styles.container}>
      <div className={styles.signupCard}>
        <Image
          src="/LogoTuatha.png"
          alt="Tuatha Logo"
          width={100}
          height={100}
          priority
          unoptimized={true}
          className={styles.logo}
        />
        <h1 className={styles.title}>Inscription Athlète</h1>
        <p className={styles.message}>
          La plateforme athlète est en cours de développement.
          Vous pourrez bientôt créer votre compte pour accéder à vos programmes personnalisés.
        </p>
        
        <button 
          className={styles.returnButton}
          onClick={() => router.push('/signup')}
        >
          Retour à la sélection de profil
        </button>
        
        <div className={styles.loginLink}>
          <span>Vous avez déjà un compte ? </span>
          <Link href="/">Connectez-vous</Link>
        </div>
      </div>
    </div>
  );
}
