/** @type {import('next').NextConfig} */
const nextConfig = {
  // --- 1. BLOQUER LE TÉLÉCHARGEMENT DES POLICES (C'est ça qui plante) ---
  optimizeFonts: false,

  // --- 2. IGNORER LES ERREURS ---
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // --- 3. PERFORMANCE & STABILITÉ ---
  swcMinify: true,
  images: { unoptimized: true },
  productionBrowserSourceMaps: false,
  
  // Timeout plus long pour éviter les coupures
  staticPageGenerationTimeout: 300,

  // Force le mode "1 seul processeur" pour ne pas saturer la mémoire
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
};

export default nextConfig;
