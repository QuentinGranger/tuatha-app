/** @type {import('next').NextConfig} */
const nextConfig = {
  // Activer les server actions
  experimental: {
    serverActions: {
      allowed: true
    }
  },

  // Images
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    unoptimized: true, // Désactiver l'optimisation des images
  },

  // Désactiver strictMode
  reactStrictMode: false,
  
  // Configuration webpack pour désactiver le cache
  webpack: (config, { dev, isServer }) => {
    // Désactiver complètement le cache
    config.cache = false;
    
    // Empêcher la minification en dev
    if (dev) {
      config.optimization.minimize = false;
    }
    
    return config;
  },
  
  // Options générales
  poweredByHeader: false,
  compress: true,
}

export default nextConfig;
