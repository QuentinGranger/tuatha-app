/**
 * Fonction utilitaire pour obtenir l'URL complète d'une image
 * Si l'URL est déjà complète (commence par http/https), elle est retournée telle quelle
 * Sinon, elle est considérée comme un chemin relatif et est complétée selon l'environnement
 * 
 * @param {string} url - L'URL de l'image ou chemin relatif
 * @returns {string} L'URL complète de l'image
 */
export const getImageUrl = (url) => {
  if (!url) return '/img/professionel/default-avatar.jpg';
  
  // Si l'URL est déjà une URL complète (commence par http ou https)
  if (url.startsWith('http')) {
    return url;
  }
  
  // Si c'est un chemin local, on ajoute le préfixe de l'API si on est en prod
  if (process.env.NEXT_PUBLIC_API_URL && process.env.NODE_ENV === 'production') {
    return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
  }
  
  // En dev ou si pas d'URL d'API configurée, on utilise le chemin local
  return url;
};
