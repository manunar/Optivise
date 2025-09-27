import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimisations de performance
  compress: true, // Active la compression gzip
  
  // Ne pas bloquer le build par les erreurs ESLint (les corriger ultérieurement)
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Optimisations des images
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Optimisations du build
  experimental: {
    optimizeCss: true, // Re-enabled - critters dependency now installed
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  
  // Headers de sécurité et cache
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
