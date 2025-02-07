/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      enabled: true
    },
  },
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
}

export default nextConfig;
