import Link from "next/link";
import styles from "./page.module.css";

export default function CGU() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Conditions Générales d'Utilisation</h1>
        <p className={styles.subtitle}>
          En vigueur au {new Date().toLocaleDateString('fr-FR')}
        </p>
      </header>

      <main className={styles.main}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Objet et champ d'application</h2>
          <p className={styles.text}>
            Les présentes conditions générales d'utilisation (ci-après dénommées "CGU") ont pour objet de définir les conditions d'utilisation du site internet et de l'application mobile Tuatha (ci-après dénommés "le Service"), ainsi que les droits et obligations des utilisateurs de ce Service.
          </p>
          <p className={styles.text}>
            L'accès et l'utilisation du Service impliquent l'acceptation sans réserve des présentes CGU par l'utilisateur. Si l'utilisateur refuse d'accepter ces conditions, il ne doit pas utiliser le Service.
          </p>
          <p className={styles.text}>
            Les présentes CGU sont applicables à tout utilisateur naviguant sur le Service ou utilisant les fonctionnalités proposées. Elles peuvent être modifiées à tout moment, la version applicable étant celle en vigueur au moment de l'utilisation du Service.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Définitions</h2>
          <p className={styles.text}>
            Aux fins des présentes CGU, les termes suivants ont la signification indiquée ci-après :
          </p>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <strong>Service</strong> : désigne le site internet et l'application mobile Tuatha accessibles depuis l'URL https://tuatha-app.com et depuis les boutiques d'applications mobiles.
            </li>
            <li className={styles.listItem}>
              <strong>Utilisateur</strong> : désigne toute personne qui accède et navigue sur le Service, qu'elle soit inscrite ou non.
            </li>
            <li className={styles.listItem}>
              <strong>Compte</strong> : désigne l'espace personnel créé par un Utilisateur lors de son inscription au Service.
            </li>
            <li className={styles.listItem}>
              <strong>Contenu</strong> : désigne tous les éléments (textes, images, vidéos, etc.) publiés sur le Service, tant par l'éditeur que par les Utilisateurs.
            </li>
            <li className={styles.listItem}>
              <strong>Données personnelles</strong> : désigne toute information relative à une personne physique identifiée ou identifiable.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Accès au Service</h2>
          <p className={styles.text}>
            Le Service est accessible gratuitement à tout Utilisateur disposant d'un accès à internet. L'ensemble des coûts afférents à l'accès au Service (matériel informatique, logiciels, connexion internet, etc.) sont à la charge exclusive de l'Utilisateur.
          </p>
          <p className={styles.text}>
            L'accès au Service peut toutefois être limité à certaines fonctionnalités réservées aux Utilisateurs disposant d'un Compte.
          </p>
          <p className={styles.text}>
            L'éditeur du Service s'efforce de permettre l'accès au Service 24 heures sur 24, 7 jours sur 7, sauf en cas de force majeure ou d'un événement hors de son contrôle, et sous réserve des périodes de maintenance et des pannes éventuelles.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Inscription et compte</h2>
          <p className={styles.text}>
            Certaines fonctionnalités du Service nécessitent la création d'un Compte. Pour créer un Compte, l'Utilisateur doit :
          </p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Être une personne physique majeure et capable</li>
            <li className={styles.listItem}>Fournir des informations exactes, complètes et à jour</li>
            <li className={styles.listItem}>Choisir un mot de passe sécurisé</li>
            <li className={styles.listItem}>Accepter les présentes CGU</li>
          </ul>
          <p className={styles.text}>
            L'Utilisateur est seul responsable de la préservation de la confidentialité de ses identifiants de connexion. Toute utilisation du Service avec les identifiants de l'Utilisateur sera présumée avoir été effectuée par ce dernier.
          </p>
          <p className={styles.text}>
            L'Utilisateur s'engage à informer immédiatement l'éditeur du Service de toute utilisation non autorisée de son Compte.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. Utilisation du Service</h2>
          <p className={styles.text}>
            L'Utilisateur s'engage à utiliser le Service de manière conforme aux présentes CGU, aux lois et règlements en vigueur, à l'ordre public et aux bonnes mœurs.
          </p>
          <p className={styles.text}>
            Il est notamment interdit à l'Utilisateur de :
          </p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Utiliser le Service à des fins illégales ou frauduleuses</li>
            <li className={styles.listItem}>Publier ou partager des contenus illicites, diffamatoires, injurieux, obscènes ou portant atteinte aux droits des tiers</li>
            <li className={styles.listItem}>Porter atteinte au bon fonctionnement du Service</li>
            <li className={styles.listItem}>Collecter des données personnelles concernant les autres Utilisateurs</li>
            <li className={styles.listItem}>Usurper l'identité d'un tiers ou tenter d'accéder au Compte d'un autre Utilisateur</li>
            <li className={styles.listItem}>Utiliser des robots, spiders, scrapers ou tout autre moyen automatisé pour accéder au Service</li>
            <li className={styles.listItem}>Contourner les mesures de sécurité ou d'authentification du Service</li>
          </ul>
          <p className={styles.text}>
            En cas de violation de ces règles, l'éditeur du Service se réserve le droit de supprimer le Contenu litigieux et/ou de suspendre ou résilier le Compte de l'Utilisateur concerné, sans préjudice de toute action en justice ou demande d'indemnisation.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>6. Propriété intellectuelle</h2>
          <p className={styles.text}>
            Le Service dans son ensemble (structure, design, textes, logos, images, éléments graphiques, etc.) est protégé par le droit d'auteur et autres droits de propriété intellectuelle. Ces éléments sont la propriété exclusive de l'éditeur du Service ou de ses partenaires.
          </p>
          <p className={styles.text}>
            Toute reproduction, représentation, modification, adaptation, exploitation, traduction, commercialisation, partielle ou intégrale, par quelque procédé que ce soit, sans l'autorisation préalable et écrite de l'éditeur du Service est interdite et pourra donner lieu à des poursuites judiciaires.
          </p>
          <p className={styles.text}>
            L'Utilisateur qui publie du Contenu sur le Service conserve ses droits de propriété intellectuelle sur ce Contenu, mais concède à l'éditeur du Service une licence non exclusive, mondiale, gratuite, sous-licenciable et transférable d'utilisation, de reproduction, de modification, d'adaptation, de publication et d'affichage de ce Contenu dans le cadre de la fourniture du Service.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>7. Responsabilités et garanties</h2>
          <p className={styles.text}>
            L'éditeur du Service s'efforce d'assurer au mieux de ses possibilités l'exactitude et la mise à jour des informations diffusées sur le Service, dont il se réserve le droit de corriger le contenu à tout moment et sans préavis.
          </p>
          <p className={styles.text}>
            Le Service est fourni "tel quel". L'éditeur du Service ne garantit pas que le Service sera exempt d'anomalies, d'erreurs ou de bugs, ni que le Service fonctionnera sans interruption ou panne. L'éditeur du Service ne garantit pas non plus les résultats obtenus par l'utilisation du Service.
          </p>
          <p className={styles.text}>
            L'Utilisateur est seul responsable du Contenu qu'il publie sur le Service. Il garantit qu'il dispose de tous les droits et autorisations nécessaires pour publier ce Contenu et que ce dernier ne porte pas atteinte aux droits des tiers.
          </p>
          <p className={styles.text}>
            L'éditeur du Service n'exerce pas de contrôle a priori sur le Contenu publié par les Utilisateurs et ne saurait être tenu responsable de ce Contenu. En cas de signalement d'un Contenu manifestement illicite, l'éditeur du Service s'engage à le retirer promptement.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>8. Modification et résiliation</h2>
          <p className={styles.text}>
            L'éditeur du Service se réserve le droit de modifier, suspendre ou interrompre tout ou partie du Service, temporairement ou définitivement, sans préavis ni indemnité.
          </p>
          <p className={styles.text}>
            L'éditeur du Service se réserve également le droit de modifier les présentes CGU à tout moment. Les modifications entrent en vigueur dès leur publication sur le Service. L'Utilisateur est réputé avoir accepté les modifications s'il continue à utiliser le Service après leur publication.
          </p>
          <p className={styles.text}>
            L'Utilisateur peut résilier son Compte à tout moment en suivant la procédure prévue à cet effet sur le Service. L'éditeur du Service se réserve le droit de résilier unilatéralement le Compte d'un Utilisateur en cas de violation des présentes CGU, sans préavis ni indemnité.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>9. Protection des données personnelles</h2>
          <p className={styles.text}>
            Dans le cadre de l'utilisation du Service, l'éditeur du Service est amené à collecter et traiter des données à caractère personnel concernant l'Utilisateur. Ces traitements sont effectués conformément à la législation applicable en matière de protection des données personnelles, notamment le Règlement (UE) 2016/679 du Parlement européen et du Conseil du 27 avril 2016 (RGPD) et la loi n° 78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés.
          </p>
          <p className={styles.text}>
            Pour en savoir plus sur la façon dont l'éditeur du Service collecte et traite les données à caractère personnel, l'Utilisateur est invité à consulter la Politique de confidentialité accessible depuis le Service.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>10. Droit applicable et juridiction compétente</h2>
          <p className={styles.text}>
            Les présentes CGU sont régies par le droit français.
          </p>
          <p className={styles.text}>
            En cas de litige relatif à l'interprétation, l'exécution ou la validité des présentes CGU, et faute de règlement amiable, les tribunaux français seront seuls compétents.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>11. Contact</h2>
          <p className={styles.text}>
            Pour toute question relative aux présentes CGU, l'Utilisateur peut contacter l'éditeur du Service à l'adresse suivante : <a href="mailto:quentin@tuatha-app.com" className={styles.link}>quentin@tuatha-app.com</a>
          </p>
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
