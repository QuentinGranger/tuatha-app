import Link from "next/link";
import styles from "./page.module.css";

export default function MentionsLegales() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Mentions Légales</h1>
        <p className={styles.subtitle}>
          Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004 pour la confiance en l'économie numérique
        </p>
      </header>

      <main className={styles.main}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Éditeur du site</h2>
          <p className={styles.text}>Le présent site Tuatha est édité par :</p>
          <p className={styles.text}><strong>Quentin Savigny</strong></p>
          <p className={styles.text}>38 rue Caulincourt</p>
          <p className={styles.text}>75018 PARIS</p>
          <p className={styles.text}>France</p>
          <p className={styles.text}>Email : <a href="mailto:quentin@tuatha-app.com" className={styles.link}>quentin@tuatha-app.com</a></p>
          <p className={styles.text}>Directeur de la publication : Quentin Savigny</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Hébergement</h2>
          <p className={styles.text}>Le site est hébergé par :</p>
          <p className={styles.text}><strong>Vercel Inc.</strong></p>
          <p className={styles.text}>440 N Barranca Ave #4133</p>
          <p className={styles.text}>Covina, CA 91723</p>
          <p className={styles.text}>États-Unis</p>
          <p className={styles.text}><a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className={styles.link}>https://vercel.com</a></p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Propriété intellectuelle</h2>
          <p className={styles.text}>L'ensemble du site, y compris sa structure et son contenu (textes, logos, images, photographies, vidéos, sons, etc.), est protégé par le droit d'auteur, le droit des marques et le droit des bases de données. Ces éléments restent la propriété exclusive de Quentin Savigny ou de ses partenaires.</p>
          <p className={styles.text}>Toute représentation, reproduction, exploitation, rediffusion ou utilisation, totale ou partielle, des éléments du site, par quelque procédé que ce soit, sans l'autorisation préalable et expresse de Quentin Savigny, est strictement interdite et constituerait une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la Propriété Intellectuelle.</p>
          <p className={styles.text}>Les marques et logos présents sur le site sont des marques déposées par leurs propriétaires respectifs.</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Protection des données personnelles</h2>
          <p className={styles.text}>Conformément aux dispositions du Règlement Général sur la Protection des Données (RGPD) et de la loi Informatique et Libertés du 6 janvier 1978 modifiée, vous disposez des droits suivants concernant vos données à caractère personnel :</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Droit d'accès aux données</li>
            <li className={styles.listItem}>Droit de rectification des données inexactes</li>
            <li className={styles.listItem}>Droit à l'effacement (droit à l'oubli)</li>
            <li className={styles.listItem}>Droit à la limitation du traitement</li>
            <li className={styles.listItem}>Droit à la portabilité des données</li>
            <li className={styles.listItem}>Droit d'opposition</li>
          </ul>
          <p className={styles.text}>Vous pouvez exercer ces droits en écrivant à l'adresse suivante : <a href="mailto:quentin@tuatha-app.com" className={styles.link}>quentin@tuatha-app.com</a></p>
          <p className={styles.text}>En cas de réclamation, vous pouvez contacter la Commission Nationale de l'Informatique et des Libertés (CNIL) : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className={styles.link}>www.cnil.fr</a></p>
        </section>
        
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. Cookies</h2>
          <p className={styles.text}>Le site Tuatha peut utiliser des cookies qui sont des fichiers stockés temporairement ou définitivement sur votre ordinateur pour faciliter la navigation et réaliser des statistiques de visites. Les cookies ne contiennent pas d'information personnelle et ne peuvent pas être utilisés pour identifier quelqu'un.</p>
          <p className={styles.text}>Vous pouvez désactiver l'utilisation de cookies en modifiant les paramètres de votre navigateur. Pour plus d'informations, consultez la rubrique d'aide de votre navigateur.</p>
        </section>
        
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>6. Limitation de responsabilité</h2>
          <p className={styles.text}>Les informations contenues sur ce site sont aussi précises que possible et le site est régulièrement mis à jour. Cependant, des erreurs ou omissions peuvent survenir. Quentin Savigny décline toute responsabilité pour les erreurs ou omissions dans les informations qui seraient présentes sur le site.</p>
          <p className={styles.text}>Les liens hypertextes mis en place dans le cadre du site en direction d'autres ressources présentes sur Internet ne sauraient engager la responsabilité de Quentin Savigny.</p>
        </section>
        
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>7. Droit applicable et juridiction compétente</h2>
          <p className={styles.text}>Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.</p>
          <p className={styles.text}>Pour toute question relative aux présentes mentions légales du site, vous pouvez nous écrire à l'adresse email : <a href="mailto:quentin@tuatha-app.com" className={styles.link}>quentin@tuatha-app.com</a></p>
        </section>
        
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>8. Mise à jour</h2>
          <p className={styles.text}>Les présentes mentions légales ont été mises à jour le {new Date().toLocaleDateString('fr-FR')}.</p>
          <p className={styles.text}>Quentin Savigny se réserve le droit de modifier ces mentions légales à tout moment. L'utilisateur est donc invité à les consulter régulièrement.</p>
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
