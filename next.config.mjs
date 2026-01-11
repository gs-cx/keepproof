/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // On ajoute 'chromadb' et 'onnxruntime-node' pour empêcher l'erreur de compilation des binaires
    serverComponentsExternalPackages: ['pdf-lib', '@xenova/transformers', 'chromadb', 'onnxruntime-node'],
  },
  webpack: (config) => {
    config.externals = [...(config.externals || []), 'canvas', 'jsdom'];
    return config;
  },
};

export default nextConfig;
