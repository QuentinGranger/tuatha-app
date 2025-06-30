import { NextResponse } from 'next/server';

// Liste des routes publiques qui ne nécessitent pas d'authentification
export function isPublicRoute(pathname) {
  const publicRoutes = [
    '/',
    '/login',
    '/signup',
    '/athlete-signup',
    '/medecin-signup',
    '/medecin-config-services',
    '/inscrivez-vous',
    '/mot-de-passe-oublie',
    '/mentions-legales',
    '/cgu',
    '/faq',
    '/support',
    '/sitemap',
  ];

  // Routes de programme partagé
  if (pathname.startsWith('/programmes/shared/')) {
    return true;
  }

  // API pour programme partagé
  if (pathname.startsWith('/api/programs/shared/')) {
    return true;
  }

  return publicRoutes.includes(pathname);
}

// Middleware pour vérifier l'authentification
export function middleware(request) {
  const pathname = request.nextUrl.pathname;
  
  // Ne pas bloquer les assets statiques
  if (
    pathname.startsWith('/_next/') || 
    pathname.startsWith('/img/') || 
    pathname.startsWith('/fonts/') || 
    pathname.startsWith('/api/') || 
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }
  
  // Vérifier si c'est une route publique
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }
  
  // Vérifier si l'utilisateur est authentifié via un cookie
  const authCookie = request.cookies.get('tuatha-auth');
  
  if (!authCookie) {
    // Rediriger vers la page de connexion avec le chemin original comme paramètre de redirection
    return NextResponse.redirect(new URL(`/?redirect=${encodeURIComponent(pathname)}`, request.url));
  }
  
  return NextResponse.next();
}

// Configuration du middleware - à quelles routes s'applique-t-il
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
