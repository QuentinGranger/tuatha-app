'use client';

import { useState } from 'react';
import Link from "next/link";
import styles from "./page.module.css";

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('general');
  const [openQuestions, setOpenQuestions] = useState({});

  const toggleQuestion = (id) => {
    setOpenQuestions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const faqData = {
    general: [
      {
        id: 'general-1',
        question: "Qu'est-ce que Tuatha ?",
        answer: "Tuatha est une plateforme complète dédiée aux nutritionnistes et diététiciens pour gérer leur clientèle, créer des programmes nutritionnels personnalisés, suivre les progrès de leurs patients, et simplifier la facturation. Notre solution tout-en-un permet aux professionnels de la nutrition de se concentrer sur l'essentiel : l'accompagnement de leurs patients."
      },
      {
        id: 'general-2',
        question: "Comment puis-je créer un compte Tuatha ?",
        answer: "Pour créer un compte Tuatha, rendez-vous sur notre page d'inscription et remplissez le formulaire avec vos informations professionnelles. Une fois votre demande soumise, notre équipe la vérifiera et activera votre compte professionnel. Vous recevrez un email de confirmation avec vos identifiants de connexion."
      },
      {
        id: 'general-3',
        question: "Tuatha est-il disponible sur mobile ?",
        answer: "Oui, Tuatha est entièrement responsive et fonctionne parfaitement sur tous les appareils mobiles. Nous développons également des applications natives pour iOS et Android qui seront disponibles prochainement."
      },
      {
        id: 'general-4',
        question: "Mes données sont-elles sécurisées ?",
        answer: "Absolument. La sécurité et la confidentialité des données sont nos priorités. Tuatha utilise un chiffrement de bout en bout, stocke les données sur des serveurs sécurisés en Europe, et est pleinement conforme au RGPD. Nous ne partageons jamais vos données avec des tiers sans votre consentement explicite."
      }
    ],
    patients: [
      {
        id: 'patients-1',
        question: "Comment ajouter un nouveau patient ?",
        answer: "Pour ajouter un nouveau patient, accédez à la section 'Athlètes' depuis votre tableau de bord, puis cliquez sur le bouton 'Ajouter un patient'. Remplissez le formulaire avec les informations du patient et cliquez sur 'Enregistrer'. Vous pouvez ensuite inviter le patient à rejoindre la plateforme en lui envoyant un email d'invitation automatisé."
      },
      {
        id: 'patients-2',
        question: "Comment mes patients peuvent-ils accéder à leurs programmes nutritionnels ?",
        answer: "Vos patients reçoivent un lien unique et sécurisé par email pour accéder à leurs programmes nutritionnels. Ils peuvent également créer un compte patient sur Tuatha pour accéder à tous leurs programmes, suivre leurs progrès et communiquer avec vous directement via la messagerie intégrée."
      },
      {
        id: 'patients-3',
        question: "Puis-je importer une liste de patients existants ?",
        answer: "Oui, Tuatha vous permet d'importer votre liste de patients existants via un fichier CSV. Accédez à la section 'Athlètes', cliquez sur 'Importer des patients', puis suivez les instructions pour télécharger et importer votre fichier."
      }
    ],
    facturation: [
      {
        id: 'facturation-1',
        question: "Comment créer une facture ?",
        answer: "Pour créer une facture, accédez à la section 'Facturation', puis cliquez sur 'Créer une facture'. Sélectionnez le patient concerné, ajoutez les prestations réalisées, définissez les taxes applicables et ajoutez éventuellement des notes. Prévisualisez la facture avant de la finaliser et de l'envoyer par email au patient."
      },
      {
        id: 'facturation-2',
        question: "Tuatha gère-t-il les paiements récurrents ?",
        answer: "Oui, Tuatha vous permet de créer des abonnements et des plans de paiement récurrents pour vos patients. Vous pouvez définir la fréquence (mensuelle, trimestrielle, annuelle), le montant et la durée. Les factures seront générées et envoyées automatiquement selon le calendrier défini."
      },
      {
        id: 'facturation-3',
        question: "Comment suivre les paiements en attente ?",
        answer: "Le tableau de bord de facturation affiche clairement le statut de toutes vos factures : payées, en attente ou en retard. Vous pouvez filtrer les factures par statut et recevoir des notifications pour les paiements en retard. Tuatha peut également envoyer des rappels automatiques aux patients pour les factures non réglées."
      },
      {
        id: 'facturation-4',
        question: "Puis-je personnaliser mes factures ?",
        answer: "Absolument. Tuatha vous permet de personnaliser vos factures avec votre logo, vos coordonnées professionnelles, et d'adapter la mise en page selon vos préférences. Vous pouvez créer plusieurs modèles de factures pour différents types de prestations."
      }
    ],
    programmes: [
      {
        id: 'programmes-1',
        question: "Comment créer un programme nutritionnel personnalisé ?",
        answer: "Pour créer un programme nutritionnel, accédez à la section 'Programmes', puis cliquez sur 'Nouveau programme'. Vous pouvez ensuite sélectionner un modèle existant ou partir de zéro. Ajoutez des repas, des aliments, des recettes et des recommandations adaptées à votre patient. Vous pouvez également inclure des objectifs caloriques, des macronutriments et des conseils personnalisés."
      },
      {
        id: 'programmes-2',
        question: "Puis-je réutiliser des programmes existants ?",
        answer: "Oui, vous pouvez créer des modèles de programmes et les réutiliser pour différents patients. Vous pourrez ensuite personnaliser ces modèles en fonction des besoins spécifiques de chaque patient, ce qui vous fera gagner un temps considérable."
      },
      {
        id: 'programmes-3',
        question: "Les patients peuvent-ils donner leur retour sur les programmes ?",
        answer: "Absolument. Les patients peuvent noter leur adhérence au programme, indiquer leurs difficultés et vous envoyer des commentaires directement depuis leur interface. Vous recevrez ces retours dans votre tableau de bord, ce qui vous permettra d'ajuster les programmes si nécessaire."
      }
    ],
    messagerie: [
      {
        id: 'messagerie-1',
        question: "Comment fonctionne le système de messagerie ?",
        answer: "La messagerie Tuatha vous permet de communiquer directement avec vos patients depuis la plateforme. Vous pouvez envoyer des messages texte, des photos, des documents, et même des messages vocaux. Les conversations sont organisées par patient et toutes les communications sont stockées de manière sécurisée."
      },
      {
        id: 'messagerie-2',
        question: "Puis-je programmer des messages automatiques ?",
        answer: "Oui, Tuatha vous permet de créer et programmer des messages automatiques pour vos patients : rappels de rendez-vous, encouragements hebdomadaires, suivi de progression, etc. Vous pouvez personnaliser ces messages et définir leur fréquence d'envoi."
      },
      {
        id: 'messagerie-3',
        question: "Les patients sont-ils notifiés des nouveaux messages ?",
        answer: "Oui, les patients reçoivent des notifications par email et/ou push (s'ils utilisent l'application mobile) lorsque vous leur envoyez un message. Vous êtes également notifié lorsqu'un patient vous répond."
      }
    ],
    technique: [
      {
        id: 'technique-1',
        question: "Que faire en cas de problème technique ?",
        answer: "En cas de problème technique, consultez d'abord notre section 'Support' qui contient des guides de dépannage pour les problèmes courants. Si le problème persiste, contactez notre équipe de support technique via le formulaire de contact ou par email à quentin@tuatha-app.com. Nous vous répondrons dans les 24 heures ouvrées."
      },
      {
        id: 'technique-2',
        question: "Tuatha fonctionne-t-il hors ligne ?",
        answer: "Certaines fonctionnalités de Tuatha sont disponibles en mode hors ligne, notamment la consultation des programmes nutritionnels et des fiches patients préalablement chargées. Cependant, les fonctionnalités comme la messagerie ou la création de nouveaux contenus nécessitent une connexion internet. Les données modifiées hors ligne seront synchronisées automatiquement dès que la connexion sera rétablie."
      },
      {
        id: 'technique-3',
        question: "Comment exporter mes données depuis Tuatha ?",
        answer: "Tuatha vous permet d'exporter vos données dans plusieurs formats (CSV, PDF, Excel) selon le type de données. Pour exporter, accédez à la section concernée (Patients, Facturation, etc.), puis cliquez sur le bouton 'Exporter' et suivez les instructions. Vous pouvez également demander une exportation complète de toutes vos données depuis les paramètres de votre compte."
      }
    ]
  };

  const categories = [
    { id: 'general', label: 'Général' },
    { id: 'patients', label: 'Gestion des patients' },
    { id: 'facturation', label: 'Facturation' },
    { id: 'programmes', label: 'Programmes nutritionnels' },
    { id: 'messagerie', label: 'Messagerie' },
    { id: 'technique', label: 'Support technique' }
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Foire Aux Questions</h1>
        <p className={styles.subtitle}>
          Trouvez rapidement des réponses à vos questions sur Tuatha
        </p>
      </header>

      <main className={styles.main}>
        <section className={styles.categoriesSection}>
          <div className={styles.categoriesContainer}>
            {categories.map(category => (
              <button 
                key={category.id}
                className={`${styles.categoryButton} ${activeCategory === category.id ? styles.activeCategory : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.faqSection}>
          <h2 className={styles.categoryTitle}>{categories.find(c => c.id === activeCategory).label}</h2>
          
          <div className={styles.questionsContainer}>
            {faqData[activeCategory].map(item => (
              <div key={item.id} className={styles.questionItem}>
                <button 
                  className={`${styles.questionButton} ${openQuestions[item.id] ? styles.active : ''}`}
                  onClick={() => toggleQuestion(item.id)}
                >
                  <span className={styles.questionText}>{item.question}</span>
                  <span className={styles.toggleIcon}>
                    {openQuestions[item.id] ? '−' : '+'}
                  </span>
                </button>
                
                {openQuestions[item.id] && (
                  <div className={styles.answerContainer}>
                    <p className={styles.answerText}>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className={styles.contactSection}>
          <h2 className={styles.sectionTitle}>Vous n'avez pas trouvé votre réponse ?</h2>
          <p className={styles.text}>
            Contactez notre équipe de support qui se fera un plaisir de vous aider.
          </p>
          <div className={styles.contactButtons}>
            <Link href="/support" className={styles.primaryButton}>
              Contacter le support
            </Link>
            <a href="mailto:quentin@tuatha-app.com" className={styles.secondaryButton}>
              Envoyer un email
            </a>
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
