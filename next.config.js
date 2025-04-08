/** @type {import('next').NextConfig} */
const nextConfig = {
  // Activer les server actions
  experimental: {
    serverActions: true
  },

  // Images
  images: {
    domains: ['localhost'],
    unoptimized: false,
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
  }
}

module.exports = nextConfig
