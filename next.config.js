/** @type {import('next').NextConfig} */
const nextConfig = {
  // Les server actions sont disponibles par défaut dans Next.js 14+
  
  // Images
  images: {
    domains: ['localhost'],
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Désactiver strictMode pour éviter les doubles rendus en dev
  reactStrictMode: false,
  
  // Ignorer les erreurs de type ESLint pendant le build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Ignorer les erreurs de type TypeScript pendant le build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Augmenter la limite de temps pour la génération statique (en ms)
  staticPageGenerationTimeout: 180000, // 3 minutes au lieu de 60 secondes par défaut
  
  // Paquets externes pour les Server Components
  serverExternalPackages: ['@prisma/client', 'bcrypt', 'openai'],
  
  // Autres optimisations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['react-icons'],
  },
  
  // Configuration des routes dynamiques vs statiques
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
