'use client';

import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { useState, Suspense } from "react";
import { useAuth } from "./contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";

// Composant client qui utilise useSearchParams
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("Tentative de connexion avec:", email, password);

    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      setLoading(false);
      return;
    }

    try {
      // Simuler un login réussi
      console.log("Appel de la fonction login avec:", email, password);
      const success = await login(email, password);
      console.log("Résultat de login:", success);
      
      if (success) {
        // Rediriger vers le tableau de bord ou la page demandée
        router.push(redirect || "/dashboard");
      } else {
        setError("Identifiants incorrects");
        setLoading(false);
      }
    } catch (err) {
      console.error("Erreur de connexion:", err);
      setError("Identifiant ou mot de passe incorrect");
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.loginHelp}>
        <p>Ceci est une version alpha de Tuatha. Si vous avez pu accéder à cette page, c'est que vous avez reçu le lien de la part de Quentin.</p>
        <p>En cas de problème, veuillez contacter <a href="mailto:quentin@tuatha-app.com" className={styles.emailLink}>quentin@tuatha-app.com</a></p>
      </div>
      
      {error && <div className={styles.errorMessage}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className={styles.emailInput}
          placeholder="Identifiant"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <input
          type="password"
          className={styles.passwordInput}
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <button 
          type="submit" 
          className={styles.continueButton}
          disabled={loading}
        >
          {loading ? "Connexion..." : "Continuer"}
        </button>
      </form>
    </>
  );
}

// Fonction principale qui enveloppe le composant utilisant useSearchParams dans Suspense
export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.loginPanel}>
        <div className={styles.formContainer}>
          <Suspense fallback={<div>Chargement...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
      
      <div className={styles.logoContainer}>
        <div className={styles.logoWrapper}>
          <Image
            src="/LogoTuatha.png"
            alt="Tuatha Logo"
            width={1200}
            height={1200}
            priority
            unoptimized={true}
            className={styles.logo}
          />
        </div>
        
        <div className={styles.footerContent}>
          <Link href="/sitemap" className={styles.footerLink}>Sitemap</Link>
          <Link href="/mentions-legales" className={styles.footerLink}>Mentions légales</Link>
          <Link href="/cgu" className={styles.footerLink}>CGU</Link>
          <Link href="/support" className={styles.footerLink}>Support & aide</Link>
          <Link href="/faq" className={styles.footerLink}>FAQ</Link>
        </div>
      </div>
    </div>
  );
}
