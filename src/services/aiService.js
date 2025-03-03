'use client';

/**
 * Service pour gérer les interactions avec l'API AI
 */
export const aiService = {
  /**
   * Générer une réponse automatique simulant le patient via l'API AI
   * @param {string} patientEmail - Email du patient pour identifier sa personnalité
   * @param {Array} conversationHistory - Historique de la conversation pour le contexte
   * @param {string} prompt - Instructions spécifiques pour la génération (optionnel)
   * @returns {Promise<string>} - La réponse générée
   */
  generatePatientResponse: async (patientEmail, conversationHistory, prompt = '') => {
    try {
      console.log(`AI Service: Génération d'une réponse pour ${patientEmail}`);
      console.log('Historique de conversation utilisé:', conversationHistory?.length || 0, 'messages');
      
      // Afficher des informations détaillées pour le débogage
      console.log('URL de l\'API:', '/api/ai-message');
      console.log('Données envoyées:', JSON.stringify({
        patientEmail,
        conversationHistory: conversationHistory?.slice(-3), // Affiche les 3 derniers messages pour éviter une sortie trop longue
        prompt
      }, null, 2));
      
      const startTime = Date.now();
      console.log('Début de la requête API à:', new Date().toISOString());
      
      try {
        const response = await fetch('/api/ai-message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            patientEmail,
            conversationHistory,
            prompt
          }),
        });

        console.log('Réponse API reçue après', (Date.now() - startTime), 'ms');
        console.log('Statut de la réponse:', response.status, response.statusText);
        
        if (!response.ok) {
          console.error(`API Error with status ${response.status}`);
          const errorText = await response.text();
          console.error('Détails de l\'erreur API:', errorText);
          throw new Error(`Erreur API: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log(`Réponse reçue - Source: ${data.source || 'non spécifiée'}`);
        console.log(`Contenu de la réponse: "${data.response.substring(0, 50)}${data.response.length > 50 ? '...' : ''}"`);
        return data.response;
      } catch (fetchError) {
        console.error('Erreur lors de la requête API:', fetchError);
        throw fetchError; // Propager l'erreur pour utiliser les réponses de secours
      }
    } catch (error) {
      console.error('Erreur lors de la génération de la réponse AI:', error);
      console.log("Utilisation de la réponse de secours locale");
      
      // FORCER L'UTILISATION DES RÉPONSES DE SECOURS
      console.log('Réponse de secours forcée pour déboguer');
      
      // Utiliser des réponses de fallback personnalisées selon le patient
      if (patientEmail === 'batman@wayne-enterprises.com') {
        console.log('Réponse reçue - Source: Fallback');
        return "J'ai noté les modifications du régime. Je devrais pouvoir les intégrer malgré mes horaires nocturnes. Avez-vous des recommandations spécifiques pour l'énergie à long terme?";
      } else if (patientEmail === 'tony@stark-industries.com') {
        console.log('Réponse reçue - Source: Fallback');
        return "Intéressant ce nouveau complément... J'ai déjà fait quelques ajustements sur sa composition moléculaire pour qu'il soit compatible avec mon réacteur Arc. Ça vous dérange si j'améliore votre formule? 😏";
      } else if (patientEmail === 'clark.kent@dailyplanet.com') {
        console.log('Réponse reçue - Source: Fallback');
        return "Merci pour ces conseils, Dr. Tony. J'essaierai d'augmenter mes apports comme suggéré. Mon métabolisme est... particulièrement rapide, donc les 5000 calories me semblent encore un peu justes. 🙂";
      } else if (patientEmail === 'selina.kyle@catwoman.com') {
        console.log('Réponse reçue - Source: Fallback');
        return "Vos recommandations sont intéressantes... Je préfère néanmoins garder une certaine flexibilité dans mon régime, surtout pendant mes activités nocturnes. Les protéines supplémentaires sont appréciées. 😼";
      } else {
        console.log('Réponse reçue - Source: Fallback');
        return "J'ai bien reçu vos recommandations et je vais essayer de les suivre. Pourriez-vous me préciser les horaires idéaux pour ces repas?";
      }
    }
  }
};

export default aiService;
