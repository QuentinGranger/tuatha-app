import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialiser OpenAI avec la clé API définie dans les variables d'environnement
// La clé est simulée pour cet exercice - dans un déploiement réel, elle serait dans les variables d'environnement
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-simulation-key',
});

/**
 * Fonction pour obtenir des instructions de personnalité basées sur l'email du patient
 */
function getPersonaInstructions(patientEmail) {
  const personas = {
    'batman@wayne-enterprises.com': `
      Tu es Bruce Wayne, aussi connu comme Batman. Tu es:
      - Sérieux et direct dans tes communications
      - Très occupé avec ta vie de justicier nocturne
      - Intéressé par l'optimisation de ton régime pour maximiser tes performances physiques
      - Capable de financer n'importe quel supplément ou régime alimentaire
      - En excellente forme physique mais avec des blessures occasionnelles
      - Préférant les réponses concises
    `,
    'tony@stark-industries.com': `
      Tu es Tony Stark, le génie milliardaire et Iron Man. Tu es:
      - Intelligent, sarcastique et parfois arrogant
      - Fasciné par la technologie et l'innovation
      - Intéressé par les compléments alimentaires à la pointe de la science
      - Amateur de bonne nourriture et occasionnellement d'alcool
      - Ayant des problèmes cardiaques liés à ton réacteur Arc
      - Utilisant souvent des emojis et faisant des blagues techniques
    `,
    'clark.kent@dailyplanet.com': `
      Tu es Clark Kent (Superman). Tu es:
      - Poli, humble et optimiste
      - Ayant un métabolisme exceptionnellement rapide nécessitant beaucoup de calories
      - Intéressé par une alimentation éthique et durable
      - Très en forme mais cachant tes capacités surhumaines
      - Travaillant comme journaliste au Daily Planet
      - Parlant de manière amicale et respectueuse
    `,
    'diana@themyscira.com': `
      Tu es Diana Prince (Wonder Woman). Tu es:
      - Directe, confiante mais aimable
      - Intéressée par les régimes riches en protéines
      - Préférant les aliments naturels aux suppléments synthétiques
      - Ayant une connaissance approfondie des herbes et remèdes naturels
      - Très active physiquement
      - S'exprimant parfois avec des références à la mythologie grecque
    `,
    'peter.parker@dailybugle.com': `
      Tu es Peter Parker (Spider-Man). Tu es:
      - Jeune, enthousiaste et parfois nerveux
      - Avec un métabolisme rapide et des besoins caloriques élevés
      - Ayant un budget limité pour l'alimentation
      - Jonglant entre tes études, ton travail et ta vie de super-héros
      - Intéressé par des solutions pratiques et abordables
      - Faisant souvent des blagues et utilisant un langage jeune
    `
  };

  // Retourner les instructions spécifiques ou des instructions génériques
  return personas[patientEmail] || `
    Tu es un patient suivi par un nutritionniste. Tu es:
    - Intéressé par l'amélioration de ton alimentation
    - Respectueux et ouvert aux conseils
    - Posant des questions pertinentes sur ton régime
    - Partageant occasionnellement tes défis alimentaires quotidiens
    - Recherchant des conseils pratiques et applicables
  `;
}

/**
 * Fonction de traitement des requêtes POST
 */
export async function POST(request) {
  console.log('API ai-message: Requête reçue', new Date().toISOString());
  
  try {
    // Récupérer et parser le corps de la requête
    const body = await request.json();
    const { patientEmail, conversationHistory = [], prompt = '' } = body;
    
    console.log('API ai-message: Email du patient:', patientEmail);
    console.log('API ai-message: Nombre de messages dans l\'historique:', conversationHistory?.length || 0);

    // Vérifier si l'email du patient est fourni
    if (!patientEmail) {
      console.error('API ai-message: Erreur - Email du patient manquant');
      return NextResponse.json(
        { error: 'Email du patient requis' },
        { status: 400 }
      );
    }

    // Construire les instructions système pour ChatGPT
    const systemPrompt = `
      ${getPersonaInstructions(patientEmail)}
      
      Règles de communication:
      1. Réponds toujours comme si tu étais le patient décrit ci-dessus.
      2. Adapte ton style de communication à la personnalité décrite.
      3. Garde tes réponses entre 1 et 3 phrases maximum.
      4. N'utilise jamais de termes techniques médicaux à moins que le nutritionniste ne les ait introduits.
      5. Pose occasionnellement des questions liées à l'alimentation ou à tes progrès.
      6. Ne mentionne JAMAIS que tu es une IA, ChatGPT ou un modèle de langage - reste dans ton personnage.
      7. Adapte ta réponse au contexte de la conversation précédente.
      
      ${prompt ? 'Instructions supplémentaires: ' + prompt : ''}
    `;

    // Formater l'historique des conversations pour ChatGPT
    const formattedHistory = conversationHistory.map(msg => ({
      role: msg.senderId === 'patient' ? 'assistant' : 'user',
      content: msg.content || ''
    }));
    
    console.log('API ai-message: Historique formaté pour OpenAI:', JSON.stringify(formattedHistory.slice(-2)));
    
    // Vérifier la clé API OpenAI
    console.log('API ai-message: Vérification de la clé API', 
      process.env.OPENAI_API_KEY ? 
      (process.env.OPENAI_API_KEY === 'sk-simulation-key' ? 
        'Clé de simulation détectée' : 
        `Clé réelle détectée (${process.env.OPENAI_API_KEY.substring(0, 7)}...)`
      ) : 
      'Aucune clé API détectée');

    // Appeler l'API ChatGPT
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-simulation-key') {
      try {
        console.log('API ai-message: Tentative d\'appel à OpenAI');
        
        const messages = [
          { role: "system", content: systemPrompt },
          ...formattedHistory
        ];
        
        console.log('API ai-message: Messages envoyés à OpenAI:', messages.length);
        
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: messages,
          max_tokens: 150,
          temperature: 0.7,
        });

        console.log('API ai-message: Réponse OpenAI reçue avec succès');
        
        const aiResponse = completion.choices[0].message.content;
        console.log('API ai-message: Contenu de la réponse:', aiResponse.substring(0, 50) + '...');
        
        // Retourner la réponse générée
        return NextResponse.json({
          response: aiResponse,
          source: 'chatgpt'
        });
      } catch (openaiError) {
        console.error('API ai-message: Erreur OpenAI:', openaiError);
        console.error('API ai-message: Détails de l\'erreur:', JSON.stringify({
          name: openaiError.name,
          message: openaiError.message,
          stack: openaiError.stack?.split('\n')[0] || 'No stack trace'
        }));
        console.log('API ai-message: Fallback vers les réponses simulées');
        // En cas d'erreur avec l'API OpenAI, on bascule sur les réponses simulées
      }
    } else {
      console.log('API ai-message: Utilisation des réponses simulées (pas de clé API valide)');
    }
    
    // Simuler une réponse si aucune clé API n'est définie ou en cas d'erreur
    // En production, cette partie serait améliorée avec une meilleure gestion d'erreurs
    const fallbackResponses = {
      'batman@wayne-enterprises.com': "Compris. J'ajusterai mon régime selon vos recommandations malgré mes contraintes de temps. Avez-vous des options spécifiques pour récupérer après les... activités physiques nocturnes intenses?",
      'tony@stark-industries.com': "Ces macronutriments sont intéressants, mais j'ai déjà développé un smoothie avec 27 vitamines et minéraux parfaitement dosés. JARVIS peut vous envoyer la formule si vous voulez l'analyser. 🤓",
      'clark.kent@dailyplanet.com': "Je vais suivre ces conseils, mais je pourrais avoir besoin de doubler les portions. Mon métabolisme est... particulièrement actif. Les aliments biologiques que vous suggérez semblent excellents!",
      'diana@themyscira.com': "Vos recommandations sont judicieuses. Sur Themyscira, nous utilisions des herbes similaires. Puis-je ajouter plus de protéines? Mon entraînement quotidien est particulièrement intense.",
      'peter.parker@dailybugle.com': "Super ces conseils! Mais euh, vous auriez des alternatives moins chères? Le budget est serré ce mois-ci... et j'ai besoin de beaucoup d'énergie pour, euh, mes activités extrascolaires."
    };

    const genericResponses = [
      "Merci pour ces conseils, je vais les intégrer à mon quotidien. Est-ce que je peux adapter les horaires des repas selon mon emploi du temps?",
      "C'est noté pour les changements de régime. Avez-vous des recommandations pour les collations entre les repas?",
      "Je comprends mieux maintenant. Quand devrions-nous faire le prochain point sur mon évolution?",
      "Ces nouvelles recommandations me semblent pertinentes. J'ai remarqué des changements positifs depuis que je suis vos conseils précédents."
    ];

    // Sélectionner une réponse spécifique ou générique
    const response = fallbackResponses[patientEmail] || 
      genericResponses[Math.floor(Math.random() * genericResponses.length)];

    return NextResponse.json({
      response,
      source: 'simulation'
    });
  } catch (error) {
    console.error('Error in AI message API:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement de la demande', details: error.message },
      { status: 500 }
    );
  }
}
