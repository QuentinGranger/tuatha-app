import Link from "next/link";
import styles from "./page.module.css";

export default function Sitemap() {
  // Structure du sitemap basée sur l'analyse de l'application
  const sitemapData = [
    {
      title: "Accueil",
      path: "/",
      description: "Page d'accueil et connexion",
      requiresAuth: false
    },
    {
      title: "Dashboard",
      path: "/dashboard",
      description: "Tableau de bord principal",
      requiresAuth: true,
      children: [
        {
          title: "Athlètes",
          path: "/dashboard/athletes",
          description: "Gestion des patients/athlètes",
          requiresAuth: true
        },
        {
          title: "Facturation",
          path: "/dashboard/facturation",
          description: "Gestion des factures et paiements",
          requiresAuth: true
        },
        {
          title: "Messagerie",
          path: "/dashboard/messagerie",
          description: "Communication avec les patients",
          requiresAuth: true
        },
        {
          title: "Performance",
          path: "/dashboard/performance",
          description: "Suivi des performances et statistiques",
          requiresAuth: true
        },
        {
          title: "Profil & Paramètres",
          path: "/dashboard/profil-parametres",
          description: "Gestion du profil utilisateur et paramètres de l'application",
          requiresAuth: true
        },
        {
          title: "Programmes",
          path: "/dashboard/programmes",
          description: "Création et gestion des programmes nutritionnels",
          requiresAuth: true
        },
        {
          title: "Relations",
          path: "/dashboard/relations",
          description: "Gestion des relations avec les professionnels de santé",
          requiresAuth: true
        }
      ]
    },
    {
      title: "Connexion",
      path: "/login",
      description: "Page de connexion alternative",
      requiresAuth: false
    },
    {
      title: "Programmes partagés",
      path: "/programmes/shared",
      description: "Accès aux programmes partagés via token",
      requiresAuth: true
    },
    {
      title: "Mentions légales",
      path: "/mentions-legales",
      description: "Informations légales",
      requiresAuth: false
    },
    {
      title: "CGU",
      path: "/cgu",
      description: "Conditions Générales d'Utilisation",
      requiresAuth: false
    },
    {
      title: "Support & Aide",
      path: "/support",
      description: "Page d'aide et support",
      requiresAuth: false
    },
    {
      title: "FAQ",
      path: "/faq",
      description: "Questions fréquemment posées",
      requiresAuth: false
    }
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Plan du site</h1>
        <p className={styles.description}>
          Retrouvez ici l'ensemble des pages du dashboard Tuatha.
        </p>
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span className={styles.publicIndicator}></span> Accessible sans connexion
          </div>
          <div className={styles.legendItem}>
            <span className={styles.privateIndicator}></span> Nécessite une connexion
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.sitemapGrid}>
          {sitemapData.map((section, index) => (
            <div key={index} className={`${styles.sectionCard} ${section.requiresAuth ? styles.privateSection : styles.publicSection}`}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <Link href={section.path} className={styles.sectionLink}>
                    {section.title}
                  </Link>
                </h2>
                {section.requiresAuth && (
                  <span className={styles.lockIcon} title="Nécessite une connexion">🔒</span>
                )}
              </div>
              <p className={styles.sectionDescription}>{section.description}</p>
              
              {section.children && section.children.length > 0 && (
                <ul className={styles.childrenList}>
                  {section.children.map((child, childIndex) => (
                    <li key={childIndex} className={`${styles.childItem} ${child.requiresAuth ? styles.privateChild : styles.publicChild}`}>
                      <div className={styles.childHeader}>
                        <Link href={child.path} className={styles.childLink}>
                          {child.title}
                        </Link>
                        {child.requiresAuth && (
                          <span className={styles.smallLockIcon} title="Nécessite une connexion">🔒</span>
                        )}
                      </div>
                      <p className={styles.childDescription}>{child.description}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </main>
      
      <footer className={styles.footer}>
        <Link href="/" className={styles.backLink}>
          Retour à l'accueil
        </Link>
      </footer>
    </div>
  );
}
