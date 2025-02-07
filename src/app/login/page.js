'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const result = await signIn('development-auto-login', {
        redirect: false,
      });

      if (result?.error) {
        console.error('Login error:', result.error);
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1>Connexion</h1>
        <button onClick={handleLogin} className={styles.loginButton}>
          Connexion Automatique (Dev)
        </button>
      </div>
    </div>
  );
}
