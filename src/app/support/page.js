import Link from "next/link";
import styles from "./page.module.css";

export default function Support() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Support & Aide</h1>
        <p className={styles.subtitle}>
          Nous sommes là pour vous aider à tirer le meilleur parti de Tuatha
        </p>
      </header>

      <main className={styles.main}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Comment pouvons-nous vous aider ?</h2>
          <div className={styles.supportOptions}>
            <div className={styles.supportOption}>
              <div className={styles.supportIcon}>📋</div>
              <h3 className={styles.optionTitle}>Documentation</h3>
              <p className={styles.optionDescription}>
                Consultez notre documentation complète pour apprendre à utiliser toutes les fonctionnalités de Tuatha.
              </p>
              <Link href="/support/documentation" className={styles.button}>
                Voir la documentation
              </Link>
            </div>
            
            <div className={styles.supportOption}>
              <div className={styles.supportIcon}>❓</div>
              <h3 className={styles.optionTitle}>FAQ</h3>
              <p className={styles.optionDescription}>
                Trouvez des réponses aux questions fréquemment posées par nos utilisateurs.
              </p>
              <Link href="/faq" className={styles.button}>
                Consulter la FAQ
              </Link>
            </div>
            
            <div className={styles.supportOption}>
              <div className={styles.supportIcon}>✉️</div>
              <h3 className={styles.optionTitle}>Contact</h3>
              <p className={styles.optionDescription}>
                Besoin d'une aide personnalisée ? Notre équipe de support est disponible pour vous aider.
              </p>
              <Link href="#contact-form" className={styles.button}>
                Nous contacter
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Guides d'utilisation rapides</h2>
          <div className={styles.guides}>
            <div className={styles.guideItem}>
              <h3 className={styles.guideTitle}>Prise en main</h3>
              <p className={styles.text}>
                Découvrez les bases de Tuatha et comment configurer votre profil pour commencer.
              </p>
              <Link href="/support/guides/getting-started" className={styles.link}>
                Lire le guide →
              </Link>
            </div>
            
            <div className={styles.guideItem}>
              <h3 className={styles.guideTitle}>Gestion des patients</h3>
              <p className={styles.text}>
                Apprenez à ajouter, modifier et gérer efficacement vos patients.
              </p>
              <Link href="/support/guides/patient-management" className={styles.link}>
                Lire le guide →
              </Link>
            </div>
            
            <div className={styles.guideItem}>
              <h3 className={styles.guideTitle}>Facturation</h3>
              <p className={styles.text}>
                Tout ce que vous devez savoir sur la création et la gestion des factures.
              </p>
              <Link href="/support/guides/billing" className={styles.link}>
                Lire le guide →
              </Link>
            </div>
            
            <div className={styles.guideItem}>
              <h3 className={styles.guideTitle}>Messagerie</h3>
              <p className={styles.text}>
                Comment communiquer efficacement avec vos patients via notre système de messagerie intégré.
              </p>
              <Link href="/support/guides/messaging" className={styles.link}>
                Lire le guide →
              </Link>
            </div>
            
            <div className={styles.guideItem}>
              <h3 className={styles.guideTitle}>Programmes nutritionnels</h3>
              <p className={styles.text}>
                Guide détaillé pour créer et partager des programmes nutritionnels personnalisés.
              </p>
              <Link href="/support/guides/nutrition-programs" className={styles.link}>
                Lire le guide →
              </Link>
            </div>
            
            <div className={styles.guideItem}>
              <h3 className={styles.guideTitle}>Suivi des performances</h3>
              <p className={styles.text}>
                Comment utiliser les outils d'analyse pour suivre les progrès de vos patients.
              </p>
              <Link href="/support/guides/performance-tracking" className={styles.link}>
                Lire le guide →
              </Link>
            </div>
          </div>
        </section>
        
        <section className={styles.section} id="contact-form">
          <h2 className={styles.sectionTitle}>Contacter le support</h2>
          <p className={styles.text}>
            Notre équipe de support est disponible pour répondre à vos questions du lundi au vendredi, de 9h à 18h.
          </p>
          <form className={styles.contactForm}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.formLabel}>Nom</label>
              <input type="text" id="name" className={styles.formInput} placeholder="Votre nom" />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>Email</label>
              <input type="email" id="email" className={styles.formInput} placeholder="votre@email.com" />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="subject" className={styles.formLabel}>Sujet</label>
              <select id="subject" className={styles.formSelect}>
                <option value="">Sélectionnez un sujet</option>
                <option value="technical">Problème technique</option>
                <option value="account">Gestion de compte</option>
                <option value="billing">Facturation</option>
                <option value="feature">Suggestion de fonctionnalité</option>
                <option value="other">Autre</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.formLabel}>Message</label>
              <textarea 
                id="message" 
                className={styles.formTextarea} 
                placeholder="Décrivez votre problème ou votre question en détail"
                rows="5"
              ></textarea>
            </div>
            
            <button type="submit" className={styles.submitButton}>
              Envoyer le message
            </button>
            
            <p className={styles.formDisclaimer}>
              Vous pouvez également nous contacter directement par email à <a href="mailto:quentin@tuatha-app.com" className={styles.link}>quentin@tuatha-app.com</a>
            </p>
          </form>
        </section>
        
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Ressources supplémentaires</h2>
          <div className={styles.resources}>
            <div className={styles.resourceItem}>
              <h3 className={styles.resourceTitle}>Blog</h3>
              <p className={styles.text}>
                Consultez notre blog pour les dernières actualités, conseils et études de cas.
              </p>
              <Link href="/blog" className={styles.link}>
                Visiter le blog →
              </Link>
            </div>
            
            <div className={styles.resourceItem}>
              <h3 className={styles.resourceTitle}>Webinaires</h3>
              <p className={styles.text}>
                Participez à nos webinaires pour approfondir vos connaissances et poser vos questions en direct.
              </p>
              <Link href="/webinaires" className={styles.link}>
                Calendrier des webinaires →
              </Link>
            </div>
            
            <div className={styles.resourceItem}>
              <h3 className={styles.resourceTitle}>Communauté</h3>
              <p className={styles.text}>
                Rejoignez notre communauté de nutritionnistes pour partager vos expériences et apprendre des autres.
              </p>
              <Link href="/communaute" className={styles.link}>
                Rejoindre la communauté →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <Link href="/" className={styles.backLink}>
          Retour à l'accueil
        </Link>
      </footer>
    </div>
  );
}
